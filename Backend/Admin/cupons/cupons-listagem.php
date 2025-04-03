<?php


header("Access-Control-Allow-Origin: *"); // Permite qualquer origem (pode ser restrito se necessário)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeçalhos permitidos

require_once(dirname(__DIR__, 2) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 2) . '/conexao.php');
require_once(dirname(__DIR__, 2) . '/Checkout/cupons/cuponsFuncoes.php');

$dadosRecebidos = file_get_contents('php://input');

$dados = json_decode($dadosRecebidos, true);

$token = $dados['token'] ?? null;


$validacao = validarToken($token);

if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];
    $cupons = listarCupons();




    echo json_encode([
        "success" => true,
        "todosCupons" => $cupons,
    ]);



} else {
    echo json_encode($validacao);
}

?>