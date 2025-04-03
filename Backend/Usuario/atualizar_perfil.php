<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once(dirname(__DIR__, 1) . '/Auth/Token/valida-jwt-interno.php');
require_once(dirname(__DIR__, 1) . '/conexao.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-usuario.php');
require_once(dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-recargas.php');

$dadosRecebidos = file_get_contents('php://input');
$dados = json_decode($dadosRecebidos, true);
$token = $dados['token'] ?? null;
$nome = $dados['nome'] ?? null;
$email = $dados['email'] ?? null;
$senha = $dados['senha'] ?? null;
$telefone = $dados['telefone'] ?? null;
$avatar = $dados['avatar'] ?? null;

$validacao = validarToken($token);

function editarUsuario($userId, $nome, $email, $senha, $telefone, $avatar)
{
    global $pdo;

    // Primeiro verifica se o usuário existe
    $checkStmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = ?");
    $checkStmt->execute([$userId]);

    if ($checkStmt->rowCount() == 0) {
        throw new Exception("Usuário ID $userId não encontrado");
    }

    if ($senha !== null) {
        $stmt = $pdo->prepare("UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, avatar = ? WHERE id = ?");
        $stmt->execute([$nome, $email, $senha, $telefone, $avatar, $userId]);
    } else {
        $stmt = $pdo->prepare("UPDATE usuarios SET nome = ?, email = ?, telefone = ?, avatar = ? WHERE id = ?");
        $stmt->execute([$nome, $email, $telefone, $avatar, $userId]);
    }

    return $stmt->rowCount();
}
// Na parte principal do código, altere:
if ($validacao["success"]) {
    $userId = $validacao["data"]["user_id"];

    try {
        $linhasAfetadas = editarUsuario($userId, $nome, $email, $senha, $telefone, $avatar);
        echo json_encode([
            "success" => true,
            "message" => "Perfil atualizado com sucesso",
            "linhas_afetadas" => $linhasAfetadas
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao atualizar o perfil",
            "erro" => $e->getMessage()
        ]);
        exit();
    }
} else {
    echo json_encode($validacao);
}