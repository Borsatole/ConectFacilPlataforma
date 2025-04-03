<?php

function buscarTodosPedidos($userId)
{
    global $pdo;

    // Busca pedidos dos últimos 90 dias
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE idusuario = ? AND created >= DATE_SUB(NOW(), INTERVAL 90 DAY)");
    $stmt->bindValue(1, $userId, PDO::PARAM_INT);

    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)) {
        return [];
    } else {
        return $result;
    }
}



?>