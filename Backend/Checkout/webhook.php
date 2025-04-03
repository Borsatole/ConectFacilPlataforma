<?php
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
require_once dirname(__DIR__, 1) . '/conexao.php';
require_once dirname(__DIR__, 1) . '/Checkout/pedido.php';
require_once dirname(__DIR__, 1) . '/Checkout/verificar-assinatura.php';
require_once dirname(__DIR__, 1) . '/Checkout/config-mp.php';


$xSignature = $_SERVER['HTTP_X_SIGNATURE'];
$xRequestId = $_SERVER['HTTP_X_REQUEST_ID'];

$dados = json_decode(file_get_contents('php://input'), true);
$idPedido = $dados['data']['id'];

// Verifica se os dados necessários foram informados
if (empty($xSignature) || empty($xRequestId) || empty($idPedido)) {
    echo json_encode(array("sucess" => false, "message" => "Você não informou todos os dados necessários"));
    exit;
}

//---> Verifica se a assinatura é válida
$statusDaAssinatura = verificarAssinaturaMp($xSignature, $xRequestId, $idPedido, $chavesecretanotificacao) ?? false;


//---> Se a assinatura for inválida
if ($statusDaAssinatura !== true) {
    echo json_encode(array("sucess" => false, "message" => "Assinatura inválida"));
    exit;
}

// ---> Verifica se o pedido existe
$verificaExistenciaPedido = verificaSeJaexisteEsseId($idPedido) ?? false;

// ---> Se o pedido não existir
if (!$verificaExistenciaPedido) {
    echo json_encode(array("sucess" => false, "message" => "Pedido não encontrado"));
    exit;
}


// ---> Verifica se a requisição é de atualização de pagamento
if ($dados['action'] == 'payment.updated') {
    $idPedido = $dados['data']['id'];

    //---> Verifica se o pedido existe
    $accessToken = 'TEST-558360857384760-022615-87d4fa89c277eb58f958434757f04be3-362655224';

    // ---> Verificar o status do pagamento
    $verificarStatus = verificarStatusPagamento($idPedido, $accessToken);
    $status = $verificarStatus['status'];
    $status = 'approved';

    // ---> Se o status for pago, atualizar o pedido
    if ($status == 'approved') {
        finalizarPedidoEnviarCodigo($idPedido);
    }

    echo json_encode($status);

    // ---> Retornar um HTTP STATUS 200 (OK) para o mercado pago
    return http_response_code(200);
}


function verificarStatusPagamento($idPedido, $accessToken)
{
    $url = "https://api.mercadopago.com/v1/payments/" . $idPedido;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken"
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        return 'Erro na requisição: ' . curl_error($ch);
    }

    curl_close($ch);

    return json_decode($response, true);
}



