import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({ isOpen = true, onClose, productInfo }) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const [cupom, setCupom] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setModalOpen(false);
    setCurrentStep(1); // Resetar para a primeira etapa quando fechar
    if (onClose) onClose();
  };

  const handleContinue = (step) => {
    // Avança para a próxima etapa
    setCurrentStep(step);
  };

  const handleChangeCupom = (e) => {
    setCupom(e.target.value);
  };

  return (
    <div className="relative flex justify-center">
      {modalOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="relative inline-block px-6 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full sm:p-6"
              style={{ width: "80%", maxWidth: "800px" }}
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
                  <h3
                    className="text-xl font-bold leading-6 text-gray-900 mb-4"
                    id="modal-title"
                  >
                    Compre e Receba na hora!
                  </h3>

                  <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                    <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                      <img
                        src={productInfo.imageUrl}
                        alt={productInfo.title}
                        className="rounded-lg object-cover w-full max-w-xs"
                      />
                    </div>

                    <div className="md:w-2/3">
                      <h4 className="text-lg font-semibold mb-2">
                        {productInfo.title}
                      </h4>
                      <p className="text-gray-700 mb-3">
                        {productInfo.description}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mb-4">
                        R$ {productInfo.price}
                      </p>

                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h5 className="font-medium mb-2">
                          Informações importantes:
                        </h5>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Entrega instantânea por e-mail</li>
                          <li>Validade de 30 dias após a compra</li>
                          <li>Suporte disponível 24h por dia</li>
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
                        onClick={() => handleContinue(true)}
                        className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-pointer"
                        style={{
                          backgroundColor: "var(--corPrincipal)",
                          color: "var(--corTexto1)",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--corSecundaria)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "var(--corPrincipal)")
                        }
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Segunda etapa: confirmação de continuidade
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
                    O cliente continuou!
                  </h3>

                  <p className="text-gray-600 mb-6">
                    Você prosseguiu para a próxima etapa do processo de compra.
                    {cupom.trim() && (
                      <span className="block mt-2">
                        Cupom <span className="font-semibold">{cupom}</span>{" "}
                        aplicado com sucesso!
                      </span>
                    )}
                  </p>

                  <button
                    onClick={handleClose}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Fechar e finalizar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  productInfo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
};
