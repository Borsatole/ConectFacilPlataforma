<?php
function buscarRecargas()
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM recargas");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}


function buscarRecargasPeloId($idRecarga)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM recargas WHERE id = :idRecarga");
    $stmt->bindParam(':idRecarga', $idRecarga, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

?>