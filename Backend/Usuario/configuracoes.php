<?php

header("Access-Control-Allow-Origin: *"); // Permite qualquer origem (pode ser restrito se necessário)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeçalhos permitidos


require_once(dirname(__DIR__, 1) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 1) . '/conexao.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-usuario.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-recargas.php');





$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);
$token = $dados['token'] ?? null;

$validacao = validarToken($token);


if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];

    $dados = buscaCompleta($userId)[0];

    echo json_encode(
        [
            "success" => true,
            "dados" => $dados
        ]
    );


} else {



    echo json_encode($validacao);
    // retornar um 401 na tela do usuario
    //http_response_code(401);
}

