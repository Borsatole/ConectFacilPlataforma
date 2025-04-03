<?php
$host = 'localhost';
$dbname = 'sistemacomauth';
$username = 'root';
$password = '';

try {

    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die('Erro ao conectar com o banco de dados: ' . $e->getMessage());

}
?>