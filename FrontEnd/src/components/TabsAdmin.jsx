import { useState } from "react";
import SectionCupons from "./SectionCupons";
import SectionRecargas from "./SectionRecargas";


function TabsAdmin() {
  const [autorization, setAuthorization] = useState(true);
  // mudar o titulo da pagina
  document.title = "Administrador do Sistema";
  const [activeTab, setActiveTab] = useState("Vendas");


  return (
    <>
      {!autorization ? (
      <>
        <h1>Você não tem autorização para acessar essa seção.</h1>
     </>
      
        
        
      ) : (
        <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="mb-4 border-b border-gray-200">
            <ul className="flex">
              {[
                { id: "Vendas", label: "Vendas da loja" },
                { id: "Recarga", label: "Cadastrar Recarga" },
                { id: "Cupons", label: "Cadastrar cupons" },
              ].map((tab) => (
                <li key={tab.id} className="mr-1">
                  <button
                    className={`tablinks inline-block py-2 px-4 border-b-2 cursor-pointer ${
                      activeTab === tab.id
                        ? "text-blue-800 border-blue-500"
                        : "text-blue-500 hover:text-blue-800"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {[
              {
                id: "Vendas",
                title: "Vendas da loja",
                content: <SectionVendasLoja />,
              },
              {
                id: "Recarga",
                title: "Cadastrar Recarga",
                content: <SectionRecargas />,
              },
              {
                id: "Cupons",
                title: "Cadastrar cupons",
                content: <SectionCupons />,
              },
            ].map((tab) => (
              <div
                key={tab.id}
                className="tabcontent"
                style={{ display: activeTab === tab.id ? "block" : "none" }}
              >
                <h2 className="text-xl font-semibold mb-4">{tab.title}</h2>
                <div>{tab.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default TabsAdmin;

function SectionVendasLoja() {
  return (
    <div>
      <div id="Vendas" className="tabcontent block">
        <h2 className="text-x2 font-semibold mb-4">Relatório de Vendas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total de Pedidos</h3>
            <p className="text-2xl font-bold">150</p>
            <p className="text-sm text-gray-600">Últimos 30 dias</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Vendas Realizadas</h3>
            <p className="text-2xl font-bold">75</p>
            <p className="text-sm text-gray-600">Últimos 30 dias</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Ticket Médio</h3>
            <p className="text-2xl font-bold">200</p>
            <p className="text-sm text-gray-600">Últimos 30 dias</p>
          </div>
        </div>

        <h2 className="text-x2 font-semibold mb-4 mt-4">Mercado Pago</h2>
        {/* criar campo para inserir o token e outro para inserir a assinatura de webhook com o campo de copiar  e um botao para salvar*/}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Token</h3>
            <input type="text" className="w-full p-2 rounded-md" />
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Assinatura do Webhook</h3>
            <input type="text" className="w-full p-2 rounded-md" />
          </div>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded-md">
          Salvar
        </button>
      </div>
    </div>
  );
}
