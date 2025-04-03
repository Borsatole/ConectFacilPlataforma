<?php

function verificarAssinaturaMp($xSignature, $xRequestId, $PagamentoId, $chavesecretanotificacao)
{
    try {

        $dataID = isset($PagamentoId) ? $PagamentoId : '';

        //--> Divide a xSignature 2 partes
        $parts = explode(',', $xSignature);

        //--> Inicializa as variáveis timestamp e hash
        $ts = null;
        $hash = null;

        //--> Loop para dividir as partes em chave e valor
        foreach ($parts as $part) {
            //--> Divide a parte em chave e valor
            $keyValue = explode('=', $part, 2);
            if (count($keyValue) == 2) {
                $key = trim($keyValue[0]);
                $value = trim($keyValue[1]);
                if ($key === "ts") {
                    $ts = $value;
                } elseif ($key === "v1") {
                    $hash = $value;
                }
            }
        }

        //--> Chave secreta
        $secret = $chavesecretanotificacao ?? '';

        //---> Gera o manifest
        $manifest = "id:$dataID;request-id:$xRequestId;ts:$ts;";

        //--> Crie uma assinatura HMAC definindo o tipo de hash e a chave como um array de bytes.
        $sha = hash_hmac('sha256', $manifest, $secret);

        // HMAC verificação
        if ($sha === $hash) {
            return true;
        } else {
            return false;
        }
    } catch (Exception $e) {
        return false;
    }

}
?>