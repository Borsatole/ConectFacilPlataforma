<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once(dirname(__DIR__, 2) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 2) . '/Usuario/BuscarDados/buscas-recargas.php');
require_once(dirname(__DIR__, 2) . '/Checkout/cupons/cuponsFuncoes.php');
require_once(dirname(__DIR__, 2) . '/conexao.php');

$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);

$token = $dados['token'] ?? null;
$codigo = $dados["codigo"] ?? null;

if ($codigo == null) {
    echo json_encode([
        "success" => false,
        "message" => "ID do cupom não foi enviado."
    ]);
    exit();
}

$validacao = validarToken($token);

if ($validacao["success"]) {
    try {
        $userId = $validacao["data"]["user_id"];
        $cupomDeletado = buscarCupom($codigo) ?? null;

        if (!$cupomDeletado) {
            echo json_encode([
                "success" => false,
                "message" => "Cupom não encontrado."
            ]);
            exit();
        }

        deletarCupom($codigo);

        echo json_encode([
            "success" => true,
            "dados" => $dados,
            "cupomDeletado" => $cupomDeletado,
            "message" => "Cupom deletado com sucesso!"
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao deletar cupom: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode($validacao);
}

?>