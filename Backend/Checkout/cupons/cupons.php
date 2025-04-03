<?php


header("Access-Control-Allow-Origin: *"); // Permite qualquer origem (pode ser restrito se necessário)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Cabeçalhos permitidos


require_once(dirname(__DIR__, 2) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 2) . '/conexao.php');
require_once(dirname(__DIR__, 2) . '/Usuario/BuscarDados/buscas-usuario.php');
require_once(dirname(__DIR__, 2) . '/Usuario/BuscarDados/buscas-recargas.php');
require_once(dirname(__DIR__, 2) . '/Checkout/cupons/cuponsFuncoes.php');

$dadosRecebidos = file_get_contents('php://input');

$dados = json_decode($dadosRecebidos, true);

$token = $dados['token'] ?? null;
$idProduto = $dados["idProduto"] ?? null;
$cupom = $dados["cupom"] ?? null;


$validacao = validarToken($token);

if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];
    $dadosUsuario = buscaCompleta($userId)[0];
    $idProduto = $dados["idProduto"] ?? null;

    // Verifica se o ID do produto foi fornecido
    if (!$idProduto) {
        echo json_encode([
            "success" => false,
            "message" => "ID do produto não fornecido"
        ]);
        exit;
    }

    // Busca o produto e verifica se existe
    $produto = buscarRecargasPeloId($idProduto);
    $validacaoCupom = validarCupom($cupom);


    $dadosProduto = buscarRecargasPeloId($idProduto);
    $dadosCupom = buscarCupom($cupom);
    $verificaSeProdutoEstaValidoNoCupom = verificaSeProdutoEstaValidoNoCupom($dadosCupom, $dadosProduto);

  
    $valorDesconto = calcularDesconto($cupom, $produto["valor"]);

    if (!$validacaoCupom["success"] || !$verificaSeProdutoEstaValidoNoCupom["success"]) {
        echo json_encode([
            "success" => true,
            "dadosDoUsuario" => [
                "nome" => $dadosUsuario["nome"],
                "email" => $dadosUsuario["email"],
                "telefone" => $dadosUsuario["telefone"],
            ],
            "dadosDaCompra" => [
                "idProduto" => $idProduto,
                "titulo" => $produto["titulo"],
                "subtotal" => floatval($produto["valor"]),
                "cupom" => '',
                "desconto" => 0,
                "total" => floatval($produto["valor"]),
            ]
        ]);
        exit;
    }




    echo json_encode([
        "success" => true,
        "dadosDoUsuario" => [
            "nome" => $dadosUsuario["nome"],
            "email" => $dadosUsuario["email"],
            "telefone" => $dadosUsuario["telefone"],
        ],
        "dadosDaCompra" => [
            "idProduto" => $idProduto,
            "titulo" => $produto["titulo"],
            "subtotal" => floatval($produto["valor"]),
            "cupom" => $cupom,
            "desconto" => floatval($valorDesconto["desconto"]),
            "total" => floatval($valorDesconto["total"]),
        ]
    ]);



} else {
    echo json_encode($validacao);
}


function verificaSeProdutoEstaValidoNoCupom($dadosCupom, $dadosProduto){

    // Verifica se o produto está na lista de produtos permitidos
    $produtosPermitidos = json_decode($dadosCupom['produtos'], true);
    $verificaSeOCupomAplicaNoProduto = in_array($dadosProduto['id'], $produtosPermitidos);
    if (!$verificaSeOCupomAplicaNoProduto) {
        return [
            "success" => false,
            "message" => "Cupom não aplicável ao produto"
        ];
    }
    return [
        "success" => true,
        "message" => "Cupom aplicável ao produto"
    ];






}

?>