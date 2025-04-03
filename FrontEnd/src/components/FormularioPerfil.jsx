import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function FormularioPerfil() {
  const [dadosRecebidosFormulario, setDadosRecebidosFormulario] =
    useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // Lista fixa de avatares disponíveis
  const [avatares] = useState([
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
  ]);
  const [avatarSelecionado, setAvatarSelecionado] = useState("");

  useEffect(() => {
    async function buscarDados() {
      const token = localStorage.getItem("token");
      const RotaApi = import.meta.env.VITE_API;

      setCarregando(true);
      setErro(null);

      try {
        const response = await axios.post(
          `${RotaApi}/Backend/Usuario/configuracoes.php`,
          { token: token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Verificando se os dados estão em response.data ou response.data.dados
          if (response.data.dados) {
            setDadosRecebidosFormulario(response.data.dados);
            // Define o avatar atual como selecionado
            setAvatarSelecionado(response.data.dados.avatar || "");
          } else {
            // Se os dados estiverem diretamente em response.data
            setDadosRecebidosFormulario(response.data);
            setAvatarSelecionado(response.data.avatar || "");
          }
        }

        // Removido a chamada para buscar avatares
      } catch (error) {
        console.error("Erro na verificação do token:", error);
        setErro(
          "Falha ao carregar os dados do perfil. Por favor, tente novamente mais tarde."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  // Use um useEffect para monitorar as mudanças no estado e logar quando for atualizado
  useEffect(() => {
    if (dadosRecebidosFormulario) {
      // console.log("Dados carregados:", dadosRecebidosFormulario);
    }
  }, [dadosRecebidosFormulario]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const RotaApi = import.meta.env.VITE_API;

    try {
      const formData = {
        token: token,
        nome: e.target.fullName.value,
        email: e.target.email.value,
        telefone: e.target.phone.value,
        avatar: avatarSelecionado,
      };

      // Incluir senha apenas se tiver sido preenchida
      if (e.target.password.value) {
        formData.senha = e.target.password.value;
      }

      console.log("Dados do formulário:", formData);

      const response = await axios.post(
        `${RotaApi}/Backend/Usuario/atualizar_perfil.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response);

        toast.success("Perfil atualizado com sucesso! Atualizando a pagina", {
          position: "top-right",
          autoClose: 900,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2200);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Falha ao atualizar o perfil. Por favor, tente novamente.");
    }
  };

  // Função para selecionar um avatar
  const selecionarAvatar = (avatar) => {
    setAvatarSelecionado(avatar);
  };

  // Mostra mensagem de carregamento enquanto os dados estão sendo buscados
  if (carregando) {
    return <div className="text-center p-6">Carregando dados do perfil...</div>;
  }

  // Mostra mensagem de erro se ocorrer algum problema
  if (erro) {
    return <div className="text-center p-6 text-red-500">{erro}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {dadosRecebidosFormulario ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Selecione seu Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-2">
              {avatares.map((avatar, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer flex items-center justify-center"
                  onClick={() => selecionarAvatar(avatar)}
                >
                  <div
                    className={`
                    w-26 h-26 rounded-full border-2 p-1 flex
                    ${
                      avatarSelecionado === avatar
                        ? "border-green-500 ring-2 ring-green-300"
                        : "border-gray-200"
                    }
                  `}
                  >
                    <img
                      alt={`Avatar ${index + 1}`}
                      className="rounded-full w-full object-cover"
                      src={`${
                        import.meta.env.VITE_API
                      }/Backend/Usuario/avatar/${avatar}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100";
                      }}
                    />
                  </div>
                  {avatarSelecionado === avatar && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Nome Completo
            </label>
            <div className="mt-2">
              <input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                autoComplete="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={dadosRecebidosFormulario.nome || ""}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={dadosRecebidosFormulario.email || ""}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                placeholder="Digite sua nova senha (deixe em branco para manter a atual)"
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Telefone de Contato
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                placeholder="Digite seu telefone"
                autoComplete="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={dadosRecebidosFormulario.telefone || ""}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-pointer"
              style={{
                backgroundColor: "var(--corPrincipal)",
                color: "var(--corTexto1)",
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-6">
          Nenhum dado de perfil disponível. Por favor, faça login novamente.
        </div>
      )}
    </div>
  );
}

export default FormularioPerfil;
