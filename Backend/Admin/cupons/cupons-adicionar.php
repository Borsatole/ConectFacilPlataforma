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
$desconto = $dados["desconto"] ?? null;
$maxuse = $dados["maxuse"] ?? null;
$produtos = json_encode($dados["produtos"] ?? []);
$tipo = $dados["tipo"] ?? null;
$validade = $dados["validade"] ?? null;
$valido = $dados["valido"] ?? null;

if (!$codigo || !$desconto || !$maxuse || !$tipo || !$validade || is_null($valido)) {
    echo json_encode([
        "success" => false,
        "message" => "Dados incompletos ou inválidos"
    ]);
    exit();
}


$validacao = validarToken($token);

if ($validacao["success"]) {

    //---> Verifica se o codigo ja existe
    if (buscarCupom($codigo)) {
        echo json_encode([
            "success" => false,
            "message" => "Já existe um cupom com esse codigo"
        ]);
        exit();
    }

    // ---> Verifica se o desconto eh valido
    if ($desconto <= 1) {
        echo json_encode([
            "success" => false,
            "message" => "O desconto nao pode ser menor que 1"
        ]);
        exit;
    }

    // ---> Verifica se o tipo é percent e se o valor do é maior que 99
    if ($tipo === 'percent' && $desconto > 99) {
        echo json_encode([
            "success" => false,
            "message" => "Desconto percentual inválido"
        ]);
        exit();
    }

    //---> Adiciona o cupom
    try {
        $userId = $validacao["data"]["user_id"];
        adicionarCupom($codigo, $desconto, $tipo, $validade, $maxuse, $usos = 0, $valido, $produtos);

        echo json_encode([
            "success" => true,
            "dados" => $dados,
            "novocupon" => buscarCupom($codigo) ?? null,
            "message" => "Cupom adicionado com sucesso!"
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao adicionar cupom: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode($validacao);
}


?>