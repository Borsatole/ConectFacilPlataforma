<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once(dirname(__DIR__, 2) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 2) . '/Usuario/BuscarDados/buscas-recargas.php');

require_once(dirname(__DIR__, 2) . '/conexao.php');

$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);

$token = $dados['token'] ?? null;
$idRecarga = $dados["idRecarga"] ?? null;

if ($idRecarga == null) {
    echo json_encode([
        "success" => false,
        "message" => "ID da recarga não foi enviado."
    ]);
    exit();
}

$validacao = validarToken($token);

if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];

    // ---> Verifica se a recarga existe
    $Recarga = buscarRecargasPeloId($idRecarga) ?? null; 

    // ---> Separa a informação do servidor
    $servidor = $Recarga["servidor"] ?? null;

    // ---> Separa a informação dos dias
    $dias = $Recarga["dias"] ?? null;

    if (!$Recarga) {
        echo json_encode([
            "success" => false,
            "message" => "Recarga não encontrada."
        ]); 
        exit();
    }


    try {
        // deletarRecarga($idRecarga);
        // deletarTodosCodigos($idRecarga);
        
        echo json_encode([
            "success" => true,
            "dados" => $dados,
            "validacao" => json_encode($Recarga),
            "dias" => $dias,
            "servidor" => $servidor,
            "message" => "Recarga deletada com sucesso!"
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao deletar recarga: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode($validacao);
}




function deletarRecarga($idRecarga)
{
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM recargas WHERE id = :idRecarga");
    $stmt->bindParam(':idRecarga', $idRecarga, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}


function deletarTodosCodigos($idRecarga)
{
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM codigosderecargas WHERE idRecarga = :idRecarga");
    $stmt->bindParam(':idRecarga', $idRecarga, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

?>


