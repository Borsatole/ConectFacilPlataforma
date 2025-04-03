<?php


function buscaCompleta($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function buscarEmail($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT email FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['email'];
}

function buscarNome($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT nome FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['nome'];
}

function buscarTelefone($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT telefone FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['telefone'];
}

function buscarAvatar($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT avatar FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['avatar'];
}


function buscarTotalPedidos($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE idusuario = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Pega todas as linhas
    // Retornar o total de pedidos

    if (empty($result) || $result == null) {
        return 0;
    } else {
        return count($result);
    }
}

function buscarPedidosCancelados($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE idusuario = ? AND status = 'Cancelado'");
    $stmt->execute([$userId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Pega todas as linhas
    // Retornar o total de pedidos

    if (empty($result) || $result == null) {
        return 0;
    } else {
        return count($result);
    }

}

function buscarPedidosPendentes($userId)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE idusuario = ? AND status = 'Pendente'");
    $stmt->execute([$userId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); // Pega todas as linhas
    // Retornar o total de pedidos

    if (empty($result) || $result == null) {
        return 0;
    } else {
        return count($result);
    }

}
?>