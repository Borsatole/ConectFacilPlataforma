import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading";
import { useState } from "react";

function Step2({
  sellerInfo,
  handleContinue,
  setMercadoPagoDados,
  handleClose,
}) {
  const [loading, setLoading] = useState(false);
  const dadosDoUsuario = sellerInfo?.dadosDoUsuario || {};
  const dadosDaCompra = sellerInfo?.dadosDaCompra || {};

  if (dadosDaCompra.total == 0) {
    Swal.fire("Você não pode usar esse cupom nesse produto.", "", "error");

    handleClose();
  }

  const finalizarCompra = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          `${import.meta.env.VITE_API}/Backend/Checkout/cria-pagamento.php`,
          {
            token: localStorage.getItem("token"),
            cupom: dadosDaCompra.cupom,
            idProduto: dadosDaCompra.idProduto,
          }
        )
        .then((response) => {
          if (response.status == 200 && response.data.success == true) {
            setMercadoPagoDados(response.data);
            handleContinue(3);
            setLoading(false);
          } else {
            handleClose();
            Swal.fire(`${response.data.message}`, "", "error");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3
        className="text-xl font-bold leading-6 text-gray-900 mb-4"
        id="modal-title"
      >
        Confirmação dos dados
      </h3>
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-lg font-semibold mb-2">Dados do Usuário</h4>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Nome: {dadosDoUsuario.nome || "Nome não informado"}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            E-mail: {dadosDoUsuario.email || "E-mail não informado"}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Contato: {dadosDoUsuario.telefone || "Telefone não informado"}
          </p>
        </div>
        <h4 className="text-lg font-semibold mb-2">Dados da Venda</h4>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Produto: {dadosDaCompra.titulo || "Produto não informado"}
          </p>
          {dadosDaCompra.desconto !== 0 ? (
            <p className="text-sm text-gray-700 mb-2">
              Subtotal: {dadosDaCompra.subtotal || "Preço não informado"}
            </p>
          ) : null}

          {dadosDaCompra.cupom ? (
            <p className="text-sm text-gray-700 mb-2">
              Cupom: {dadosDaCompra.cupom}
            </p>
          ) : null}

          {dadosDaCompra.desconto > 0 ? (
            <p className="text-sm text-gray-700 mb-2 ">
              <span className=" text-green-500 font-semibold rounded">
                DESCONTO APLICADO - R${" "}
                {(dadosDaCompra.desconto ?? 0).toFixed(2)}
              </span>
            </p>
          ) : null}

          <p className="text-sm text-gray-700 mb-2 ">
            Total a Pagar: R$ {(dadosDaCompra.total ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => finalizarCompra()}
            className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-pointer"
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
            {loading ? (
              <div className="flex items-center justify-center max-h-6 scale-65">
                <Loading />
              </div>
            ) : (
              "Finalizar o Pagamento"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

Step2.propTypes = {
  sellerInfo: PropTypes.object,
  setMercadoPagoDados: PropTypes.func,
  handleContinue: PropTypes.func,
  handleClose: PropTypes.func,
};

export default Step2;
