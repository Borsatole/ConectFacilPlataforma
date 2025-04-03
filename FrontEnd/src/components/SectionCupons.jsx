import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import Loading from "../components/Loading";

function SectionCupons() {
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [server, setServer] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function handleConfirmDelete(cupom) {
    Swal.fire({
      title: "Tem certeza de que deseja excluir esse cupom?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCoupon(cupom);
      }
    });
  }

  const determinarStatus = (cupom) => {
    if (cupom.valido === 0) return "Inativo";

    const dataValidade = new Date(cupom.validade);
    const hoje = new Date();

    if (dataValidade < hoje) return "Expirado";
    if (cupom.usos >= cupom.maxuse) return "Limite Excedido";

    return "Ativo";
  };

  const formatarDesconto = (cupom) => {
    return cupom.tipo === "percent"
      ? `${parseFloat(cupom.desconto).toFixed(0)}%`
      : `R$ ${parseFloat(cupom.desconto).toFixed(2)}`;
  };

  const showAlert = (message, isSuccess = true) => {
    Swal.fire({
      title: isSuccess ? "Sucesso" : "Erro",
      text: message,
      icon: isSuccess ? "success" : "error",
    });
  };

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API
          }/Backend/Admin/servidores/buscar-recargas.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: localStorage.getItem("token"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar servidores");
        }

        const data = await response.json();

        if (data.recargas) {
          setServer(data.recargas);
        } else {
          throw new Error("Formato de dados de servidores inválido");
        }
      } catch (error) {
        console.error("Erro ao carregar servidores:", error);
        showAlert(`Erro ao carregar servidores: ${error.message}`, false);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  // Fetch coupons
  useEffect(() => {
    const carregarTodosCupons = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API
          }/Backend/Admin/cupons/cupons-listagem.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: localStorage.getItem("token"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar cupons");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.todosCupons)) {
          setCupons(data.todosCupons);
        } else {
          throw new Error("Formato de dados inválido");
        }
      } catch (error) {
        console.log(error);
        // console.error("Erro ao carregar cupons:", error);
        showAlert(`Erro ao carregar cupons: ${error.message}`, false);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    carregarTodosCupons();
  }, []);

  // Handle edit coupon
  const handleEditCoupon = (cupom) => {
    setSelectedCoupon(cupom);
    setIsEditModalOpen(true);
  };

  // Handle add new coupon
  const handleAddCoupon = () => {
    setIsAddModalOpen(true);
  };

  // Close modals
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedCoupon(null);
  };

  // Update coupon
  const handleUpdateCoupon = async (e) => {
    e.preventDefault();

    // Get selected servers
    const selectedServers = Array.from(
      e.target.querySelectorAll('input[name="aplicavel"]:checked')
    ).map((checkbox) => checkbox.value);

    const dados = {
      token: localStorage.getItem("token"),
      couponId: selectedCoupon.id,
      codigo: e.target.codigo.value,
      desconto: e.target.desconto.value,
      tipo: e.target.tipo.value,
      validade: e.target.validade.value,
      maxuse: e.target.maxuse.value,
      valido: e.target.valido.checked ? 1 : 0,
      produtos: selectedServers,
    };

    console.log(dados);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/Backend/Admin/cupons/cupons-editar.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor");
      }

      const data = await response.json();

      if (data.success) {
        // Fetch updated list of coupons
        const listResponse = await fetch(
          `${import.meta.env.VITE_API}/Backend/Admin/cupons/cupons-listagem.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: localStorage.getItem("token"),
            }),
          }
        );

        if (!listResponse.ok) {
          throw new Error("Falha ao atualizar lista de cupons");
        }

        const listData = await listResponse.json();
        if (listData.success && Array.isArray(listData.todosCupons)) {
          setCupons(listData.todosCupons);
        }

        showAlert("Cupom atualizado com sucesso!");
        handleCloseModal();
      } else {
        throw new Error(data.message || "Erro ao atualizar cupom");
      }
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      showAlert(`${error.message}`, false);
    }
  };

  // Add new coupon
  const handleAddNewCoupon = async (e) => {
    e.preventDefault();

    // Get selected servers
    const selectedServers = Array.from(
      e.target.querySelectorAll('input[name="aplicavel"]:checked')
    ).map((checkbox) => checkbox.value);

    const dados = {
      token: localStorage.getItem("token"),
      codigo: e.target.codigo.value,
      desconto: e.target.desconto.value,
      tipo: e.target.tipo.value,
      validade: e.target.validade.value,
      maxuse: e.target.maxuse.value,
      valido: e.target.valido.checked ? 1 : 0,
      produtos: selectedServers,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/Backend/Admin/cupons/cupons-adicionar.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor");
      }

      const data = await response.json();

      if (data.success) {
        // Add new coupon to local data

        showAlert("Cupom adicionado com sucesso!");
        console.log(data);

        // relistar cupons
        const updatedCupons = [data.novocupon, ...cupons];
        setCupons(updatedCupons);
        handleCloseModal();
      } else {
        throw new Error(data.message || "Erro ao adicionar cupom");
      }
    } catch (error) {
      console.error("Erro ao adicionar cupom:", error);
      showAlert(`Erro ao adicionar cupom: ${error.message}`, false);
    }
  };

  const handleDeleteCoupon = async (cupom) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/Backend/Admin/cupons/cupons-deletar.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            codigo: cupom.codigo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor");
      }

      const data = await response.json();

      console.log(data);

      if (data.success) {
        // Remove deleted coupon from local data
        const updatedCupons = cupons.filter((c) => c.id !== cupom.id);
        setCupons(updatedCupons);
        showAlert("Cupom deletado com sucesso!");
      } else {
        throw new Error(data.message || "Erro ao deletar cupom");
      }
    } catch (error) {
      console.error("Erro ao deletar cupom:", error);
      showAlert(`Erro ao deletar cupom: ${error.message}`, false);
    }
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <div id="Vendas" className="tabcontent block overflow-x-scroll">
        <button
          className="text-white py-2 px-4 rounded mb-4 cursor-pointer transition duration-300"
          style={{
            backgroundColor: "var(--corPrincipal)",
          }}
          onClick={handleAddCoupon}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "var(--corSecundaria)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "var(--corPrincipal)")
          }
        >
          Adicionar cupom
        </button>
        <h2 className="text-x2 font-semibold mb-4">Meus Cupons</h2>

        {cupons.length === 0 ? (
          <div>Nenhum cupom encontrado</div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="px-6 py-3 text-left ">Cupom</th>
                <th className="px-6 py-3 text-left ">Desconto</th>
                <th className="px-6 py-3 text-left ">Validade</th>
                <th className="px-6 py-3 text-left ">Uso</th>
                <th className="px-6 py-3 text-left ">Status</th>
                <th className="px-6 py-3 text-left ">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cupons.map((cupom) => {
                const status = determinarStatus(cupom);
                return (
                  <tr key={cupom.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 ">{cupom.codigo}</td>
                    <td className="px-6 py-4 ">{formatarDesconto(cupom)}</td>
                    <td className="px-6 py-4">
                      {format(parseISO(cupom.validade), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 ">
                      {cupom.usos} / {cupom.maxuse}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === "Ativo"
                            ? "text-green-700 bg-green-100"
                            : status === "Expirado"
                            ? "text-red-700 bg-red-100"
                            : "text-yellow-700 bg-yellow-100"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEditCoupon(cupom)}
                        className="text-white py-2 px-4 rounded mb-4 cursor-pointer transition duration-300"
                        style={{
                          backgroundColor: "var(--corPrincipal)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleConfirmDelete(cupom)}
                        className="text-white py-2 px-4 rounded mb-4 cursor-pointer transition duration-300"
                        style={{
                          backgroundColor: "var(--corPrincipal)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Coupon Modal */}
      {isEditModalOpen && selectedCoupon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.33)" }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-4">Editar Cupom</h2>

            <form onSubmit={handleUpdateCoupon}>
              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Código do Cupom
                </label>
                <input
                  type="text"
                  name="codigo"
                  placeholder="Digite o código do cupom"
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedCoupon.codigo || ""}
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Desconto
                </label>
                <select
                  name="tipo"
                  defaultValue={selectedCoupon.tipo}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="percent">Porcentagem</option>
                  <option value="valor">Valor Fixo</option>
                </select>
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Desconto
                </label>
                <input
                  type="number"
                  name="desconto"
                  defaultValue={selectedCoupon.desconto}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Data de Validade
                </label>
                <input
                  type="datetime-local"
                  name="validade"
                  defaultValue={format(
                    parseISO(selectedCoupon.validade),
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Máximo de Usos
                </label>
                <input
                  type="number"
                  name="maxuse"
                  min="0"
                  defaultValue={selectedCoupon.maxuse}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Recargas Aplicáveis
                </label>

                <div className="flex flex-col gap-2 overflow-y-scroll max-h-40 p-2">
                  {server.sort((a, b) => parseFloat(a.dias) - parseFloat(b.dias)).map((server) => (
                    <label
                      key={server.id}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer transition-all hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
                    >
                      <input
                        type="checkbox"
                        name="aplicavel"
                        value={server.id}
                        defaultChecked={(() => {
                          try {
                            if (!selectedCoupon.produtos) return false;

                            const aplicaveis = JSON.parse(
                              selectedCoupon.produtos
                            );
                            return (
                              Array.isArray(aplicaveis) &&
                              aplicaveis.map(String).includes(String(server.id))
                            );
                          } catch (error) {
                            console.error(
                              "Erro ao verificar produtos aplicáveis:",
                              error
                            );
                            return false;
                          }
                        })()}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {server.titulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="valido"
                    defaultChecked={selectedCoupon.valido === 1}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-sm">Cupom Ativo</span>
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  style={{
                    backgroundColor: "var(--corPrincipal)",
                    cursor: "pointer",
                  }}
                >
                  Atualizar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.33)" }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cupom</h2>

            <form onSubmit={handleAddNewCoupon}>
              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Código do Cupom
                </label>
                <input
                  type="text"
                  name="codigo"
                  placeholder="Digite o código do cupom"
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Desconto
                </label>
                <select
                  name="tipo"
                  defaultValue="percent"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="percent">Porcentagem</option>
                  <option value="valor">Valor Fixo</option>
                </select>
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Desconto
                </label>
                <input
                  type="number"
                  name="desconto"
                  min="0"
                  step="0.01"
                  placeholder="Digite o valor do desconto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Data de Validade
                </label>
                <input
                  type="datetime-local"
                  name="validade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Máximo de Usos
                </label>
                <input
                  type="number"
                  name="maxuse"
                  min="0"
                  defaultValue="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Aplicável
                </label>

                <div className="flex flex-col gap-2 overflow-y-scroll max-h-40 p-2">
                  {server.map((server) => (
                    <label
                      key={server.id}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer transition-all hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
                    >
                      <input
                        type="checkbox"
                        name="aplicavel"
                        value={server.id}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {server.titulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="valido"
                    defaultChecked={true}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-sm">Cupom Ativo</span>
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  style={{
                    backgroundColor: "var(--corPrincipal)",
                    cursor: "pointer",
                  }}
                >
                  Adicionar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionCupons;
