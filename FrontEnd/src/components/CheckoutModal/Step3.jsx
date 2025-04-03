import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

import { useEffect, useState, useContext } from "react";
import Loading from "../Loading";

function Step3({
  mercadoPagoDados,
  setDadosCodigo,
  handleClose,
  handleContinue,
}) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const pixCopiaEcola = mercadoPagoDados?.CopiaECola || "";
  const pixQrCode = mercadoPagoDados?.QRCodeBase64 || "";
  const paymentId = mercadoPagoDados?.paymentId || "";
  const tituloPedido = mercadoPagoDados?.tituloPedido || "";
  const total = mercadoPagoDados?.valorPagamento || 0;
  // const idPagamento = mercadoPagoDados?.paymentId || "";

  console.log(mercadoPagoDados);
  // Verificar se os dados do Pix estão disponíveis
  useEffect(() => {
    if (pixCopiaEcola === "" && pixQrCode === "") {
      handleClose();
      Swal.fire("Tente novamente mais tarde", "", "error");
    }
  }, [pixCopiaEcola, pixQrCode, handleClose]);

  // Configurar verificação de pagamento
  useEffect(() => {
    // Inicia carregando
    setLoading(true);

    // Função de verificação
    const verificarPagamento = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/Backend/Checkout/consulta-pedido.php`,
          {
            token: localStorage.getItem("token"),
            idPedido: paymentId,
          }
        );

        if (response.status == 200 && response.data.success == true) {
          if (
            response.data.pedido.status == "pendente" &&
            response.data.pedido.codigoderecarga == ""
          ) {
            // console.log("Aguardando pagamento...");
            // console.log(response.data.pedido);

            return;
          } else {
            setDadosCodigo({
              servidor: response.data.pedido.servidor,
              codigoderecarga: response.data.pedido.codigoderecarga,
              idPedido: response.data.pedido.id,
            });
            setLoading(false);
            handleContinue(4);
          }
        } else {
          if (response.data.message == "Token inválido") {
            logout();
            toast.error("Token expirado! Faça login novamente");
          } else {
            Swal.fire(`${response.data.message}`, "", "error");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        Swal.fire("Erro ao verificar pagamento", "", "error");
      }
    };

    // Verificar a cada 30 segundos
    const interval = setInterval(verificarPagamento, 3000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [paymentId, handleContinue, setDadosCodigo, logout]); // Array de dependências vazio para executar apenas uma vez

  return (
    <div className="p-4">
      <h3
        className="text-xl font-bold leading-6 text-gray-900 mb-4"
        id="modal-title"
      >
        Pagamento
      </h3>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-lg font-semibold mb-2">Qr Code</h4>

        {pixQrCode ? (
          <img
            src={`data:image/png;base64,${pixQrCode}`}
            alt="Qr Code"
            className="w-80 h-80 mx-auto mt-4 shadow-lg rounded-lg object-contain"
          />
        ) : (
          <p className="text-center text-gray-500">QR Code não disponível</p>
        )}

        <h1 className="text-center text-gray-500 mt-4 font-semibold">
          Escaneie o codigo qr ou copie o código e cole no seu app de pagamento
        </h1>

        <h1 className="text-center text-gray-500 mt-4 font-semibold text-2xl text-green-500">
          {tituloPedido} - R$ {(total ?? 0).toFixed(2)}
        </h1>

        <textarea
          name="copiaECola"
          id="copiaECola"
          className="w-full p-2 mt-4 border border-gray-600 rounded-md resize-none"
          value={pixCopiaEcola}
          readOnly
          rows={4}
          style={{
            border: "none",
            backgroundColor: "#f2f2f2",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
            gap: "1rem",
          }}
        >
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(pixCopiaEcola);
                toast.success("Codigo copiado para a area de transferência");
              }}
              className="w-full px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-300"
              style={{
                backgroundColor: "var(--corPrincipal)",
                color: "var(--corTexto1)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--corSecundaria)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--corPrincipal)")
              }
            >
              Copiar
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Loading color="var(--corPrincipal)" style={{ scale: "0.3" }} />
              <p className="text-sm text-gray-600">Aguardando o pagamento...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

Step3.propTypes = {
  mercadoPagoDados: PropTypes.object,
  setDadosCodigo: PropTypes.func,
  handleFinish: PropTypes.func,
  handleContinue: PropTypes.func,
  handleClose: PropTypes.func,
};

export default Step3;
