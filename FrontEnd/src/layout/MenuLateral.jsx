import { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import "../assets/css/MenuLateral.css";
import Swal from "sweetalert2";
const RotaApi = import.meta.env.VITE_API;
const MenuLateral = () => {
  const { logout } = useContext(AuthContext);
  const { menuAberto, fecharMenu } = useMenu();

  const [dadosMenuLateral, setDadosMenuLateral] = useState({
    avatar: "",
    nome: "",
    email: "",
    tipoDeUsuario: "",
  });

  useEffect(() => {
    buscarDadosMenuLateral();
  }, []);

  async function buscarDadosMenuLateral() {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${RotaApi}/Backend/Usuario/Dashboard.php`,
        { token: token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // console.log(response.data);
        setDadosMenuLateral({
          avatar: `${RotaApi}/Backend/Usuario/avatar/${response.data.InformacoesBasicas.Avatar}`,
          nome: response.data.InformacoesBasicas.NomeDoUsuario,
          email: response.data.InformacoesBasicas.email,
          tipoDeUsuario: response.data.InformacoesBasicas.TipoDeUsuario,
        });
      } else {
        // console.error("Erro na requisição:", response.statusText);
        return null;
      }
    } catch (error) {
      // console.error("Erro na verificação do token:", error);

      return null;
    }
  }

  function ConfirmSair() {
    Swal.fire({
      title: "Deseja realmente sair?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#655CC9",
      cancelButtonColor: "#929292",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Chama a função de logout
      }
    });
  }
  return (
    <>
      {/* Overlay para o menu */}
      <div
        className={`menu-overlay ${menuAberto ? "visible" : ""}`}
        onClick={fecharMenu}
      />

      {/* Menu Lateral */}
      <aside
        className={`flex flex-col h-screen px-4 py-8 overflow-y-auto corPrincipalBg menu-lateral ${
          menuAberto ? "menu-aberto" : ""
        }`}
        style={{ backgroundImage: "linear-gradient(161deg, #4F46E5, #2664EB)" }}
      >
        {/* Botão para fechar o menu - apenas visível em mobile */}
        <button
          id="botao-fechar-menu"
          onClick={fecharMenu}
          className="absolute right-4 top-4 p-2 text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={dadosMenuLateral.avatar}
            alt="Avatar"
          />

          <h4 className="mx-2 mt-2 font-medium text-white">
            {dadosMenuLateral.nome}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-400">
            {String(dadosMenuLateral.email)}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6 ">
          <nav>
            <a
              className="flex items-center px-4 py-2 mt-5 text-white rounded-lg hvPrincipal"
              href="/dashboard"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Dashboard</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-white hover:bg-gray-100 hover:text-gray-700 rounded-lg hvPrincipal"
              href="/pedidos"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Meus Pedidos</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-white hover:bg-gray-100 hover:text-gray-700 rounded-lg hvPrincipal"
              href="/perfil"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Perfil</span>
            </a>

            {dadosMenuLateral.tipoDeUsuario === "admin" && (
              <a
                className="flex items-center px-4 py-2 mt-5 text-white hover:bg-gray-100 hover:text-gray-700 rounded-lg hvPrincipal"
                href="/admin"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">Admin</span>
              </a>
            )}

            <hr className="my-8 border-gray-200 dark:border-gray-300"></hr>

            <a
              className="flex items-center px-4 py-2 mt-5 text-white hover:bg-gray-100 hover:text-gray-700 rounded-lg hvPrincipal"
              href="#"
              onClick={ConfirmSair}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Logout</span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default MenuLateral;
