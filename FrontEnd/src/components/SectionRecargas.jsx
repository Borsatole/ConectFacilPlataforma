import { useState, useEffect, useContext } from "react";
import Loading from "./Loading";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";


function SectionRecargas() {
  const [recargas, setRecargas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { logout } = useContext(AuthContext);

  // Buscar servidores
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

        if (data.error) {
          if (data.error == "Token não fornecido" || data.error == "Token inválido") {
          toast.error("Sua sessão expirou, faça login novamente.");
          logout();
        }
      }

        if (data.recargas) {
          setRecargas(data.recargas);
        } else {
          throw new Error("Formato de dados de servidores inválido");
        }
      } catch (error) {
        console.error("Erro ao carregar servidores:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  // console.log(recargas);
  const handleadicionarRecarga = () => {
    console.log("adicionar recarga");
  };

  const handleDeleteRecarga = async (recarga) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/Backend/Admin/recargas/recargas-deletar.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            idRecarga: recarga.id,
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
        const updatedRecargas = recargas.filter((c) => c.id !== recarga.id);
        // setRecargas(updatedRecargas);
        
      } else {
        throw new Error(data.message || "Erro ao deletar cupom");
      }
    } catch (error) {
      console.error("Erro ao deletar recarga:", error);
    }
  };

  if (loading) {
    return <Loading color="var(--corPrincipal)" />;
  }

  if (error) {
    return <div>Erro:{error}</div>;
  }

  function handleConfirmarDelete(recarga) {
    Swal.fire({
      title: "A recarga e todos os codigos cadastrados serão deletados permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRecarga(recarga);
      }
    });
  }

  return (
    <>
      <button
        className="text-white py-2 px-4 rounded mb-4 cursor-pointer transition duration-300"
        style={{
          backgroundColor: "var(--corPrincipal)",
        }}
        onClick={() => handleadicionarRecarga()}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "var(--corSecundaria)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "var(--corPrincipal)")
        }
      >
        Adicionar recarga
      </button>

      {recargas.length === 0 ? (
        <div>Nenhuma recarga encontrada</div>
      ) : (
        <div id="Recargas" className="tabcontent block overflow-x-scroll">
          <h2 className="text-x2 font-semibold mb-4">Minhas Recargas</h2>

          <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="px-6 py-3 text-left "></th>
                <th className="px-6 py-3 text-left ">Recarga</th>
                <th className="px-6 py-3 text-left ">Dias</th>
                <th className="px-6 py-3 text-left ">Codigos</th>
                <th className="px-6 py-3 text-left ">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recargas
                .sort((a, b) => parseFloat(a.dias) - parseFloat(b.dias))
                .map((recarga) => {
                return (
                  <tr key={recarga.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 ">
                      <img
                        src={`${import.meta.env.VITE_API}/Backend/Recargas/${
                          recarga.imagem
                        }`}
                        alt=""
                        style={{
                          width: "50px",
                          borderRadius: "50%",
                          minWidth: "50px",
                        }}
                      />
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      <span>{recarga.titulo.toUpperCase()}</span>
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      <span>{recarga.dias}</span>
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      <span>5</span>
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => console.log(recarga)}
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
                        onClick={() => handleConfirmarDelete(recarga)}
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
        </div>
      )}
    </>
  );
}

export default SectionRecargas;
