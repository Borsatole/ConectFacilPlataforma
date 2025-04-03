import { useMenu } from "../context/MenuContext";

const ConteudoDashboard = () => {
  const { abrirMenu, fecharMenu, menuAberto } = useMenu();

  return (
    <div className={`content-wrapper ${!menuAberto ? "menu-closed" : ""}`}>
      {/* Botão para abrir o menu */}
      <button
        onClick={abrirMenu}
        className="fixed left-4 top-4 p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all z-50"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Conteúdo principal */}
      <div className="p-4">{/* Seu conteúdo existente aqui */}</div>
    </div>
  );
};

export default ConteudoDashboard;
