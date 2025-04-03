import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Step1 from "../components/CheckoutModal/Step1";
import Step2 from "../components/CheckoutModal/Step2";
import Step3 from "../components/CheckoutModal/Step3";
import Sucess from "../components/CheckoutModal/Sucess";

export default function CheckoutModal({ isOpen = true, onClose, productInfo }) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const [cupom, setCupom] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [sellerInfo, setSellerInfo] = useState(null);

  // Constantes do MercadoPago
  const [mercadoPagoDados, setMercadoPagoDados] = useState(null);
  const [dadosCodigo, setDadosCodigo] = useState({});

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setModalOpen(false);
    setCurrentStep(1); // Resetar para a primeira etapa quando fechar
    setSellerInfo(null);
    if (onClose) onClose();
  };

  return (
    <div className="relative flex justify-center">
      {modalOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="relative inline-block px-6 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full sm:p-6"
              style={{ width: "100%", maxWidth: "800px" }}
            >
              {/* Botão de fechar no canto superior direito */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                aria-label="Fechar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {currentStep === 1 ? (
                // Primeira etapa: informações do produto e cupom
                <>
                  <Step1
                    sellerInfo={sellerInfo}
                    handleClose={handleClose}
                    setSellerInfo={setSellerInfo}
                    productInfo={productInfo}
                    handleContinue={() => setCurrentStep(2)}
                    handleChangeCupom={(e) => setCupom(e.target.value)} // Adicione isso
                    cupom={cupom}
                  />
                </>
              ) : currentStep === 2 ? (
                <>
                  <Step2
                    sellerInfo={sellerInfo}
                    handleClose={handleClose}
                    setMercadoPagoDados={setMercadoPagoDados}
                    handleContinue={() => setCurrentStep(3)}
                  />
                </>
              ) : currentStep === 3 ? (
                <>
                  <Step3
                    handleClose={handleClose}
                    handleContinue={() => setCurrentStep(4)}
                    mercadoPagoDados={mercadoPagoDados}
                    setMercadoPagoDados={setMercadoPagoDados}
                    setDadosCodigo={setDadosCodigo}
                  />
                </>
              ) : currentStep === 4 ? (
                <>
                  <Sucess handleClose={handleClose} dadosCodigo={dadosCodigo} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CheckoutModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
  }),
  productInfo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
};
