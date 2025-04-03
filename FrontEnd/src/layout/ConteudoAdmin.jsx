import BotaoAbrirMenu from "../components/botaoAbrirMenu";
import TabsAdmin from "../components/TabsAdmin";

function ConteudoMeusPedidos() {
  return (
    <div className="w-full min-h-screen p-4 md:p-10 bg-gray-100 " id="conteudo">
      <BotaoAbrirMenu />
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      <TabsAdmin />
    </div>
  );
}

export default ConteudoMeusPedidos;
