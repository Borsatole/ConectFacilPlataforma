<?php
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');



// require_once '../vendor/autoload.php';
// require_once('../Auth/Token/valida-jwt-interno.php');
// require_once '../Usuario/BuscarDados/buscas-recargas.php';
// require_once '../Usuario/BuscarDados/buscas-usuario.php';
// require_once '../conexao.php';
// require_once './cupons/cuponsFuncoes.php';
// require_once 'config-mp.php';
// require_once 'pedido.php';



require_once(dirname(__DIR__) . '/vendor/autoload.php');
require_once(dirname(__DIR__) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__) . '/Usuario/BuscarDados/buscas-recargas.php');
require_once(dirname(__DIR__) . '/Usuario/BuscarDados/buscas-usuario.php');
require_once(dirname(__DIR__) . '/conexao.php');
require_once(dirname(__DIR__) . '/Checkout/cupons/cuponsFuncoes.php');
require_once(dirname(__DIR__) . '/Checkout/config-mp.php');
require_once(dirname(__DIR__) . '/Checkout/pedido.php');

use MercadoPago\Client\Common\RequestOptions;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\MercadoPagoConfig;

// Configuração do MercadoPago
MercadoPagoConfig::setAccessToken($accessToken);
MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);


// --->Recebimento de dados do usuario
$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);
$token = $dados['token'] ?? null;
$idProduto = $dados['idProduto'] ?? null;
$cupom = $dados['cupom'] ?? '';


// --->Verifica se há dados recebidos
if (!$dados || $dados == null || $dados == "") {
    echo json_encode(["success" => false, "message" => "Nenhum dado recebido"]);
    exit;
}


// --->Validacao das informacoes recebidas
if ($token == null || $token == "") {
    echo json_encode(["success" => false, "message" => "Token não informado"]);
    exit;
}

if ($idProduto == null || $idProduto == "") {
    echo json_encode(["success" => false, "message" => "Produto não informado"]);
    exit;
}

// --->Validacao do token
$validacao = validarToken($token);

if (!$validacao["success"]) {
    echo json_encode(["success" => false, "message" => "Token inválido"]);
    exit;
}



if ($validacao["success"]) {

    $idUsuario = $validacao["data"]["user_id"];
    $dadosProduto = buscarRecargasPeloId($idProduto);
    $dadosCupom = buscarCupom($cupom);
    $precoFinal = null;



    // --->Verificar se o produto existe
    if (!$dadosProduto) {
        echo json_encode(["success" => false, "message" => "Produto não encontrado"]);
        exit;
    }

    // --->Verificar se o usuario existe
    if (!$idUsuario) {
        echo json_encode(["success" => false, "message" => "Usuario não encontrado"]);
        exit;
    }

    // ---> Verifica se o valor do produto é maior que 0
    if ($dadosProduto["valor"] <= 0) {
        echo json_encode(["success" => false, "message" => "Valor do produto não pode ser 0"]);
        exit;
    }

    // ---> Verifica se tem algum codigo de recarga disponivel desse servidor
    $codigoDisponivel = buscaQuantidadeDeCodigoDeRecarga($dadosProduto["servidor"], $dadosProduto["dias"]);


    // ---> Verifica se tem codigo de recarga disponivel
    if ($codigoDisponivel <= 0) {
        echo json_encode(["success" => false, "message" => "Esse codigo de recarga nao está disponivel"]);
        exit;
    }

    // ---> Verifica se o cupom é aplicavel a esse produto




    // ---> Verifica se o cupom é valido
    $resultadoDesconto = calcularDesconto($cupom, $dadosProduto["valor"]);



    // ---> Verifica se o desconto é valido
    if (!$resultadoDesconto["success"]) {
        $precoFinal = floatval($dadosProduto["valor"]);
    } else {
        $precoFinal = floatval($resultadoDesconto["total"]);
    }


    // ---> Busca os dados do usuario
    $dadosUsuario = buscaCompleta($idUsuario)[0];


    // ---> Separa os dados e cria o pagamento
    $dadosPagamento = [
        "idPedido" => $idPedido ?? null,
        "idUsuario" => $dadosUsuario['id'],
        "idProduto" => $idProduto,
        "valor" => $precoFinal,
        "titulo" => $dadosProduto["titulo"] ?? "Pagamento de recarga",
        "servidor" => $dadosProduto["servidor"] ?? "",
        "dias" => $dadosProduto["dias"] ?? 0,
        "descricao" => "Pagamento de recarga " . $dadosProduto["titulo"] . " com desconto de " . $resultadoDesconto["desconto"] . " reais",
        "quantidade" => 1,
        "parcelas" => 1,
        "metodoPagamento" => "pix",
        "payer_email" => $dadosUsuario["email"],
        "telefone" => $dadosUsuario['telefone'] ?? "",
        "nome" => $dadosUsuario['nome'] ?? "",
    ];




    if ($dadosUsuario == null || $dadosUsuario == "") {
        echo json_encode(["success" => false, "message" => "Erro ao buscar dados do usuario"]);
        exit;
    }

    if ($dadosProduto == null || $dadosProduto == "") {
        echo json_encode(["success" => false, "message" => "Erro ao buscar dados do produto"]);
        exit;
    }



    if ($precoFinal !== null && $precoFinal > 0 && $precoFinal !== 0 && $precoFinal !== "") {
        criarPagamento($dadosPagamento);
    } else {
        echo json_encode(["success" => false, "message" => "Você não pode fazer essa operação"]);
        exit;
    }



}


function criarPagamento($dadosPagamento)
{

    try {
        $client = new PaymentClient();
        // Step 4: Create the request array
        $request = [
            // valor do pagamento
            "transaction_amount" => $dadosPagamento["valor"],
            // descricao do pagamento
            "description" => $dadosPagamento["descricao"],
            // parcelas
            "installments" => 1,
            // metodo de pagamento
            "payment_method_id" => $dadosPagamento["metodoPagamento"],
            "payer" => [
                "email" => $dadosPagamento["payer_email"],
                // Adicione mais dados do pagador se necessário
                "first_name" => $dadosPagamento["nome"],
                "last_name" => "Sobrenome",
                "phone" => [
                    "number" => $dadosPagamento["telefone"],
                    "area_code" => "55"
                ]
            ]
        ];

        // Step 5: Create the request options, setting X-Idempotency-Key
        $request_options = new RequestOptions();

        // Gerar um valor único para X-Idempotency-Key (importante para evitar pagamentos duplicados)
        $idempotency_key = uniqid() . '-' . microtime(true);
        $request_options->setCustomHeaders(["X-Idempotency-Key: " . $idempotency_key]);

        // Step 6: Make the request
        $payment = $client->create($request, $request_options);

        // Se for PIX, exibe as informações do PIX
        if (isset($payment->point_of_interaction) && isset($payment->point_of_interaction->transaction_data)) {
            // file_put_contents('log.txt', date('Y-m-d H:i:s') . " - " . json_encode($payment) . PHP_EOL, FILE_APPEND);

            //---> cria o pedido
            $dadosPagamento["idPedido"] = $payment->id;
            $PedidoCriado = criaPedido($dadosPagamento);


            if (!$PedidoCriado) {
                echo json_encode([
                    "success" => false,
                    "message" => "Erro ao criar pedido",
                ]);
                exit;
            }



            echo json_encode([
                "success" => true,
                "paymentId" => $payment->id,
                "tituloPedido" => $dadosPagamento["titulo"],
                "paymentStatus" => $payment->status,
                "valorPagamento" => $payment->transaction_amount,
                "CopiaECola" => $payment->point_of_interaction->transaction_data->qr_code,
                "QRCodeBase64" => $payment->point_of_interaction->transaction_data->qr_code_base64,

            ]);




        }

        // Step 7: Handle exceptions
    } catch (MPApiException $e) {
        echo "Status code: " . $e->getApiResponse()->getStatusCode() . "\n";
        echo "Content: ";
        var_dump($e->getApiResponse()->getContent());
        echo "\n";
    } catch (\Exception $e) {
        echo "Exception: " . $e->getMessage();
    }
}



