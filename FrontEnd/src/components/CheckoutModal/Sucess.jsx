import PropTypes from "prop-types";
import { toast } from "react-toastify";
function Sucess({
  dadosCodigo = { servidor: "", codigoderecarga: "", idPedido: "" },
}) {
  return (
    <div className="py-8 text-center">
      <div className="mb-6 flex justify-center">
        <div className="bg-green-100 rounded-full p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Compra Finalizada com Sucesso!
      </h3>

      <p className="text-gray-600 mb-6">
        Seu codigo de recarga é:
        <span className="block mt-2 font-semibold text-lg bg-gray-100 p-2 rounded-md bg-green-200 text-green-800 mx-auto">
          {dadosCodigo.codigoderecarga || "Entre em contato com o suporte"}
        </span>
        {dadosCodigo && (
          <span className="block mt-2 up">
            Seu codigo fica salvo em <strong>Meus Pedidos,</strong>
            <br />
            tambem enviamos o codigo para o seu email.
          </span>
        )}
      </p>

      <button
        onClick={() => {
          if (
            dadosCodigo.codigoderecarga !== "" &&
            dadosCodigo.codigoderecarga !== null &&
            dadosCodigo.codigoderecarga !== undefined
          ) {
            navigator.clipboard.writeText(dadosCodigo.codigoderecarga);
            toast.success("Codigo copiado para a area de transferência");
          } else {
            toast.error("Contate nosso suporte");
          }
        }}
        className="w-1/2 px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-pointer"
      >
        Copiar
      </button>
    </div>
  );
}

Sucess.propTypes = {
  dadosCodigo: PropTypes.object,
  handleClose: PropTypes.func,
};

export default Sucess;
