import { useMenu } from "../context/MenuContext";

function BotaoAbrirMenu() {
  const { abrirMenu } = useMenu();
  return (
    <div id="botao-abrir-menu">
      <button
        onClick={abrirMenu}
        className="left-0 p-1 text-white rounded-r-lg hover:bg-gray-200 transition-all cursor-pointer"
      >
        <svg
          data-v-49e15297=""
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          className="hamburger is-active"
        >
          <path
            data-v-49e15297=""
            d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export default BotaoAbrirMenu;
