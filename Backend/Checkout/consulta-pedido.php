<?php
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once dirname(__DIR__, 1) . '/vendor/autoload.php';
require_once dirname(__DIR__, 1) . '/Auth/Token/valida-jwt-interno.php';
require_once dirname(__DIR__, 1) . '/conexao.php';
require_once dirname(__DIR__, 1) . '/Checkout/pedido.php';

$dados = json_decode(file_get_contents('php://input'), true);
$token = $dados['token'] ?? '';
$idPedido = $dados['idPedido'] ?? '';

if (empty($idPedido) || $idPedido == null) {
    echo json_encode(["success" => false, "message" => "ID do pedido não informado"]);
    exit;
}


// --->Validacao do token
$validacao = validarToken($token);



if (!$validacao["success"]) {
    echo json_encode(["success" => false, "message" => "Token inválido"]);
    exit;
}


$pedido = buscaPedido($idPedido);
$idUsuario = $validacao["data"]["user_id"];


if ($pedido == false) {
    echo json_encode(["success" => false, "message" => "Pedido não encontrado"]);
    exit;
}

if ($pedido["idusuario"] != $idUsuario) {
    echo json_encode(["success" => false, "message" => "Você não tem permissão para acessar este pedido"]);
    exit;
}

$data = [
    "success" => true,
    "pedido" => $pedido
];

echo json_encode($data);
