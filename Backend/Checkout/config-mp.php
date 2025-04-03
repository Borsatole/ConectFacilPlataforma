<?php

// acessar o banco de dados

require_once dirname(__DIR__, 1) . '/conexao.php';

// acessar a tabela configuracoes do banco de dados
$sql = "SELECT * FROM configuracoes";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$configuracoes = $stmt->fetch(PDO::FETCH_ASSOC);

$accessToken = $configuracoes['mp_token'];
$chavesecretanotificacao = $configuracoes['chavesecretanotificacao'];


?>