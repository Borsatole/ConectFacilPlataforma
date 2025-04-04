<?php
// antes
// require_once 'chave-api.php';
// include_once('../Auth/IP/pega-ip-usuario.php');

// depois
include_once(dirname(__DIR__, 2) . '/Auth/IP/pega-ip-usuario.php');
include_once(dirname(__DIR__, 2) . '/Auth/Token/chave-api.php');

require dirname(__DIR__, 2) . '/vendor/autoload.php'; // Se estiver usando Composer


use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function criaToken($email, $id)
{

    // $chaveSecreta = "z3X!p@v9&LuGm8T#b7KdQ2Y^cWjN6R4s";
    // Onde tem ChaveApi ficava $chaveSecreta

    // Dados do usuário para inserir no token
    $payload = [
        "iss" => "https://seusite.com",  // Emissor do token
        "aud" => "https://seusite.com",  // Destinatário do token
        "Ip" => PegarIpDoUsuario(),
        "iat" => time(),                 // Timestamp de emissão
        "exp" => time() + (60 * 60),      // Expira em 1 hora
        "user_id" => $id,                 // ID do usuário autenticado
        "email" => $email                // Email do usuário
    ];

    // Gerando o token JWT
    $token = JWT::encode($payload, chaveApi(), 'HS256');
    // $decoded = JWT::decode($token, new Key($chaveSecreta, 'HS256'));

    return $token;

}



