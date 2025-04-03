<?php
require_once('../Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 1) . '/conexao.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-usuario.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-recargas.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-pedidos.php');


$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);
$token = $dados['token'] ?? null;

$validacao = validarToken($token);


if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];

    // Vamos retornar os pedidos desse usuario de 10 em 10


    echo json_encode(
        [

            "Pedidos" => buscarTodosPedidos($userId)
        ]
    );




} else {



    echo json_encode($validacao);
    // retornar um 401 na tela do usuario
    //http_response_code(401);
}

