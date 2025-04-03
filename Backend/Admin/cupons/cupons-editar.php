<?php

header("Access-Control-Allow-Origin: *"); // Permite qualquer origem (pode ser restrito se necessário)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeçalhos permitidos

require_once(dirname(__DIR__, 2) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 2) . '/conexao.php');
require_once(dirname(__DIR__, 2) . '/Checkout/cupons/cuponsFuncoes.php');

$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false,
        "message" => "Erro na formatação do JSON: " . json_last_error_msg()
    ]);
    exit;
}

$token = $dados['token'] ?? null;
$id = $dados['couponId'] ?? null;
$codigo = $dados['codigo'] ?? null;
$desconto = $dados['desconto'] ?? null;
$tipo = $dados['tipo'] ?? null;
$validade = $dados['validade'] ?? null;
$maxuse = $dados['maxuse'] ?? null;
$valido = $dados['valido'] ?? 0;
$produtos = $dados['produtos'] ?? null;





$validacao = validarToken($token);

if (!$validacao["success"]) {
    echo json_encode($validacao);
    exit;
}

$userId = $validacao["data"]["user_id"];

if ($id == null || $codigo == null || $desconto == null || $tipo == null || $validade == null || $maxuse == null) {
    echo json_encode([
        "success" => false,
        "message" => "Os campos id, codigo, desconto, tipo, validade, maxuse, valido e produtos são obrigatórios"
    ]);
    exit;
}


if (!buscarCupomPorId($id)) {
    echo json_encode([
        "success" => false,
        "message" => "Cupom não existe mais"
    ]);
    exit;
}

if ($desconto <= 1) {
    echo json_encode([
        "success" => false,
        "message" => "O desconto nao pode ser menor que 1"
    ]);
    exit;
}

if ($maxuse <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Máximo de uso nao pode ser 0"
    ]);
    exit;
}

// ---> Verifica se o tipo é percent e se o valor do é maior que 99
if ($tipo === 'percent' && $desconto > 99) {
    echo json_encode([
        "success" => false,
        "message" => "O maximo de desconto percentual é 99.00%"
    ]);
    exit();
}

// Converte o array de produtos para string JSON
if (is_array($produtos)) {
    $produtos = json_encode($produtos);
}

// Busca o cupom pelo ID
$cupom = buscarCupomPorId($id);
if (!$cupom) {
    echo json_encode([
        "success" => false,
        "message" => "Cupom não encontrado"
    ]);
    exit;
}

try {
    editarCupom($id, $codigo, $desconto, $tipo, $validade, $maxuse, $valido, $produtos);
    echo json_encode([
        "success" => true,
        "message" => "Cupom atualizado com sucesso"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao editar o cupom: " . $e->getMessage()
    ]);
}
?>