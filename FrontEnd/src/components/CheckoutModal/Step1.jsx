import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Step1({
  setSellerInfo,
  productInfo,
  handleContinue,
  handleChangeCupom,
  cupom,
}) {
  const { logout } = useContext(AuthContext);

  

  async function EnviarDados() {
    try {
      await axios
        .post(
          `${import.meta.env.VITE_API}/Backend/Checkout/cupons/cupons.php`,
          {
            token: localStorage.getItem("token"),
            cupom: cupom,
            idProduto: productInfo.id,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status == 200 && response.data.success == true) {
            setSellerInfo(response.data);
            handleContinue(2);
          } else {
            if (
              response.data.success == false &&
              response.data.error == "Token inválido"
            ) {
              logout();
              toast.error("Token expirado! Faça login novamente");
            } else {
              Swal.fire(response.data.error, "", "error");
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h3
        className="text-xl font-bold leading-6 text-gray-900 mb-4"
        id="modal-title"
      >
        Compre e Receba na hora!
      </h3>

      <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:space-x-6 mb-6">
        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
          <img
            src={productInfo.imageUrl}
            alt={productInfo.title}
            className="rounded-lg object-contain w-full max-w-xs"
            style={{ maxWidth: "30vw" }}
          />
        </div>

        <div className="md:w-2/3">
          <h4 className="text-lg font-semibold mb-2">{productInfo.title}</h4>
          <p className="text-gray-700 mb-3">{productInfo.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-4">
            R$ {productInfo.price}
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-1">
            <h5 className="font-medium mb-2">Informações importantes:</h5>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Seu codigo fica salvo em meus pedidos</li>
              <li>Entrega tambem por e-mail</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Você tem um cupom de desconto?
        </p>

        <div className="mt-2">
          <input
            type="text"
            placeholder="Digite o código do cupom"
            value={cupom}
            onChange={handleChangeCupom}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => EnviarDados()}
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

Step1.propTypes = {
  productInfo: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  sellerInfo: PropTypes.object,
  setSellerInfo: PropTypes.func,
  handleContinue: PropTypes.func,
  handleChangeCupom: PropTypes.func,
  cupom: PropTypes.string,
  desconto: PropTypes.number,
};

export default Step1;
