<?php


function listarCupons()
{
    global $pdo;
    $sql = "SELECT * FROM cupons";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function buscarCupomPorId($id)
{
    global $pdo;
    $sql = "SELECT * FROM cupons WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
function buscarCupom($codigo)
{
    global $pdo;
    $sql = "SELECT * FROM cupons WHERE codigo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$codigo]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
function validarCupom($codigoCupom)
{
    global $pdo;

    $cupom = buscarCupom($codigoCupom) ?? null;
    $idProduto = $produto["id"] ?? null;


    if (!$cupom) {
        return [
            "success" => false,
            "message" => "Cupom não encontrado"
        ];
    }

    // Verifica se o cupom está expirado
    if (strtotime($cupom["validade"]) < time()) {
        return [
            "success" => false,
            "message" => "Cupom expirado"
        ];
    }

    // Verifica se atingiu o limite de uso
    if ($cupom["usos"] >= $cupom["maxuse"]) {
        return [
            "success" => false,
            "message" => "Cupom atingiu o limite máximo de uso"
        ];
    }

    return [

        "success" => true,
        "desconto" => $cupom["desconto"],
        "cupom" => $cupom
    ];
}
function calcularDesconto($cupom, $valorProduto)
{
    if ($cupom != null && $cupom != "") {
        $validacaoCupom = validarCupom($cupom);

        if (!$validacaoCupom["success"]) {
            return [
                "success" => false,
                "mensagem" => $validacaoCupom["message"],
                "total" => 0,
                "desconto" => 0
            ];
        }

        $cupomData = $validacaoCupom["cupom"];

        // Calcula o desconto
        if ($cupomData["tipo"] === "percent") {
            $valorDesconto = ($valorProduto * $cupomData["desconto"]) / 100;
        } else {
            $valorDesconto = $cupomData["desconto"];
        }

        // Calcula o total final
        $total = max($valorProduto - $valorDesconto, 0);

        return [
            "success" => true,
            "cupom" => $cupomData,
            "mensagem" => "Cupom aplicado com sucesso",
            "total" => $total,
            "desconto" => $valorDesconto
        ];
    } else {
        return [
            "success" => false,
            "mensagem" => "Nenhum cupom fornecido",
            "total" => 0,
            "desconto" => 0
        ];
    }
}
function adicionarCupom($codigo, $desconto, $tipo, $validade, $maxuse, $usos, $valido, $produtos)
{
    global $pdo;

    try {
        $stmt = $pdo->prepare("INSERT INTO cupons (codigo, desconto, tipo, validade, maxuse, usos, valido, produtos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$codigo, $desconto, $tipo, $validade, $maxuse, $usos, $valido, $produtos]);
    } catch (PDOException $e) {
        throw new Exception("Erro no banco de dados: " . $e->getMessage());
    }
}


function editarCupom($id, $codigo, $desconto, $tipo, $validade, $maxuse, $valido, $produtos)
{
    global $pdo;
    $stmt = $pdo->prepare("UPDATE cupons SET codigo = ?, desconto = ?, tipo = ?, validade = ?, maxuse = ?, valido = ?, produtos = ? WHERE id = ?");
    $stmt->execute([$codigo, $desconto, $tipo, $validade, $maxuse, $valido, $produtos, $id]);
    return $stmt->rowCount() > 0;
}

function deletarCupom($codigo)
{
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM cupons WHERE codigo = ?");
    $stmt->execute([$codigo]);
}

?>