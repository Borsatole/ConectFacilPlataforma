import CardsPedidos from "../components/CardsPedidos";
import BotaoAbrirMenu from "../components/botaoAbrirMenu";

function ConteudoMeusPedidos() {
  return (
    <div className="w-full min-h-screen p-4 md:p-10 bg-gray-100 " id="conteudo">
      <BotaoAbrirMenu />
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      </div>

      <CardsPedidos />
    </div>
  );
}

export default ConteudoMeusPedidos;
