import { createContext, useState, useEffect } from "react";

import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Criando o contexto de autenticação
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    loggedIn: !!localStorage.getItem("token"),
  });

  // Verifica o token ao iniciar
  useEffect(() => {
    if (auth.token) {
      verificaToken(auth.token);
    }
  }, [auth.token, verificaToken]); // Só executa quando o token muda

  // Função para validar o token na API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function verificaToken(token) {
    const RotaApi = import.meta.env.VITE_API;
    try {
      const response = await axios.post(
        `${RotaApi}/Backend/Auth/Token/valida-jwt.php`,
        { token: token }
      );

      // console.log(response.data);

      if (!response.data.success) {
        toast.error("Token expirado! Deslogando usuário...", {
          position: "top-right",
          autoClose: 900,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // console.log("Token expirado! Deslogando usuário...");
        logout();
      }
    } catch (e) {
      toast.error("Token expirado! Deslogando usuário...", {
        position: "top-right",
        autoClose: 900,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      logout();
    }
  }

  // Função para realizar login e armazenar o token
  const login = (token) => {
    localStorage.setItem("token", token);
    setAuth({ token, loggedIn: true });
  };

  // Função para logout com redirecionamento correto
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, loggedIn: false });

    // Evita erros de navegação antes da atualização do estado
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
