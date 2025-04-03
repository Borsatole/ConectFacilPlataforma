import { useContext } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";

export default function TelaLogin() {
  document.title = "Acesse sua conta";
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Obtém a função login do contexto
  const { fecharMenu } = useMenu();

  async function verificaLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const dadosFormularioLogin = Object.fromEntries(formData.entries());
    const RotaApi = import.meta.env.VITE_API;

    try {
      const response = await axios.post(
        `${RotaApi}/Backend/Auth/login.php`,
        dadosFormularioLogin
      );

      if (response.data.JWT) {
        console.log(response.data);

        Swal.fire({
          title: "Sucesso!",
          text: `${response.data.successMessage}`,
          icon: "success",
          confirmButtonText: "Ok",
        });

        fecharMenu(); // Fecha o menu antes de fazer login
        login(response.data.JWT);

        // Redireciona para o Dashboard
        navigate("/dashboard");
      } else {
        Swal.fire({
          title: "Error!",
          text: `${response.data.erroMessage}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  return (
    <>
      <div className="h-full">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/images/logo.png"
              className="mx-auto h-20 w-auto"
            />
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" id="formLogin" onSubmit={verificaLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-left font-medium text-gray-900"
                >
                  E-mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-left font-medium text-gray-900"
                  >
                    Senha
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{ cursor: "pointer" }}
                >
                  Fazer Login
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Não tem cadastro?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
