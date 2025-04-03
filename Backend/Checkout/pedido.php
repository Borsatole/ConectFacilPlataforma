<?php

require_once dirname(__DIR__, 1) . '/Usuario/BuscarDados/buscas-recargas.php';


// ---> Verifica se o pedido ja existe
function verificaSeJaexisteEsseId($idpedido)
{
    global $pdo;
    $sql = "SELECT * FROM pedidos WHERE idpedido = :idpedido";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idpedido" => $idpedido]);
    return $stmt->rowCount() > 0;
}

// ---> Cria o pedido
function criaPedido($dadosPedido)
{
    global $pdo;

    date_default_timezone_set('America/Sao_Paulo');

    try {
        //---> verifica se o pedido ja existe
        if (verificaSeJaexisteEsseId($dadosPedido["idPedido"])) {
            echo json_encode(["status" => "error", "message" => "Esse ID ja existe!"]);
            exit;
        }

        //---> cria o pedido
        $sql = "INSERT INTO pedidos (idPedido,idusuario, idproduto, titulo, status, codigoderecarga, servidor, dias, valor) 
        VALUES (:idpedido, :idusuario, :idproduto, :titulo, :status, :codigoderecarga, :servidor, :dias, :valor )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":idpedido" => $dadosPedido["idPedido"],
            ":idusuario" => $dadosPedido["idUsuario"],
            ":idproduto" => $dadosPedido["idProduto"],
            ":titulo" => $dadosPedido["titulo"],
            ":status" => $dadosPedido["status"] ?? "pendente",
            ":codigoderecarga" => $dadosPedido["codigoderecarga"] ?? "",
            ":servidor" => $dadosPedido["servidor"] ?? "",
            ":dias" => $dadosPedido["dias"] ?? 0,
            ":valor" => $dadosPedido["valor"]
        ]);


        //---> verifica se o pedido foi criado
        if ($stmt->rowCount() > 0) {
            return true;
        }
    } catch (PDOException $e) {
        return false;
    }
}

// ---> Busca o pedido
function buscaPedido($id)
{
    global $pdo;
    $sql = "SELECT * FROM pedidos WHERE idpedido = :idpedido";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idpedido" => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// ---> Atualiza o status do pedido
function atualizaPedido($id, $status)
{
    global $pdo;

    try {
        $sql = "UPDATE pedidos SET status = :status WHERE idpedido = :idpedido";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([":status" => $status, ":idpedido" => $id]);
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

//---> Atualiza o codigo de recarga
function colocarCodigoDeRecargaNoPedido($idPedido, $codigo)
{
    try {
        global $pdo;
        $sql = "UPDATE pedidos SET codigoderecarga = :codigo WHERE idpedido = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([":codigo" => $codigo, ":id" => $idPedido]);
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

// ---> Coloca 1 no campos usado
function marcarCodigoDeRecargaComoUsado($id)
{
    try {
        global $pdo;
        $sql = "UPDATE codigosderecargas SET usado = 1 WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([":id" => $id]);
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

// ---> Busca a quantidade de codigo de recarga disponivel
function buscaQuantidadeDeCodigoDeRecarga($servidor, $dias)
{
    global $pdo;
    $sql = "SELECT COUNT(*) FROM codigosderecargas WHERE servidor = :servidor AND usado = 0 AND dias = :dias";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":servidor" => $servidor, ":dias" => $dias]);
    $resultado = $stmt->fetchColumn();
    return $resultado;
}

// ---> Busca o primeiro codigo de recarga disponivel
function buscaCodigoDeRecargaDisponivel($servidor, $dias)
{
    global $pdo;
    $sql = "SELECT * FROM codigosderecargas WHERE servidor = :servidor AND usado = 0 AND dias = :dias";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":servidor" => $servidor, ":dias" => $dias]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($resultado) {
        return $resultado;
    }
    return false;
}


// ---> Finaliza o pedido e envia o codigo de recarga
function finalizarPedidoEnviarCodigo($idpedido)
{
    global $pdo;

    $aprovado = true;


    if ($aprovado) {
        atualizaPedido($idpedido, "aprovado");
        $dadosPedido = buscaPedido($idpedido);
        $quantidadeDeCodigo = buscaQuantidadeDeCodigoDeRecarga($dadosPedido["servidor"], $dadosPedido["dias"] ?? 0);

        // ---> Verifica se tem codigo de recarga disponivel
        if ($quantidadeDeCodigo > 0) {
            // ---> Busca o codigo de recarga disponivel
            $codigoDeRecarga = buscaCodigoDeRecargaDisponivel($dadosPedido["servidor"], $dadosPedido["dias"]);

            // ---> Insere o codigo de recarga no pedido
            $inserirCodigoDeRecarga = colocarCodigoDeRecargaNoPedido($idpedido, $codigoDeRecarga["codigo"]);

            // ---> Coloca 1 no campo usado
            $colocar1NoCampoUsado = marcarCodigoDeRecargaComoUsado($codigoDeRecarga["id"]);


            if (!$inserirCodigoDeRecarga || !$colocar1NoCampoUsado) {
                exit;
            }

            $compra = [
                "idpedido" => $idpedido,
                "idusuario" => $dadosPedido["idusuario"],
                "idproduto" => $dadosPedido["idproduto"],
                "titulo" => $dadosPedido["titulo"],
                "status" => $dadosPedido["status"],
                "codigoderecarga" => $codigoDeRecarga["codigo"],
                "servidor" => $dadosPedido["servidor"],
                "valor" => $dadosPedido["valor"]
            ];
            $testes = [
                "dadosPedido" => $dadosPedido,
                "codigoDeRecarga" => $compra
            ];
            return $testes;

        } else {
            return false;
        }
    }
}

// ---> Lista todos os pedidos
function listaPedidos()
{
    global $pdo;
    $sql = "SELECT * FROM pagamentos";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>