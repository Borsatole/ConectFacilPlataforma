import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "./Loading";

function PedidoCard({ id, server, codigo, data, valor, situacao, bgColor }) {
  function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo);
    Swal.fire(`Código copiado: <br> ${codigo}`, "", "success");
  }

  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${bgColor}`}
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ fontWeight: "bolder", fontFamily: "Poppins, sans-serif" }}
        >
          {server} (#{id})
        </h2>
        {codigo !== "" ? (
          <p
            className="bg-green-200 text-green-800 font-semibold rounded inline-block"
            style={{
              fontSize: "0.8rem",
            }}
          >
            Codigo de recarga - {codigo}
          </p>
        ) : null}
        <p className="text-gray-600" style={{ fontWeight: "200" }}>
          Data Pedido: {data}
        </p>
        <p className="text-gray-600" style={{ fontWeight: "200" }}>
          Valor: R${valor}
        </p>
        <p className="text-gray-600" style={{ fontWeight: "200" }}>
          Pagamento:
          <span
            className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${
              situacao === "aprovado"
                ? "bg-green-200 text-green-800"
                : "bg-yellow-200 text-yellow-800"
            }`}
          >
            {situacao}
          </span>
        </p>
      </div>
      {codigo !== "" ? (
        <button
          onClick={() => copiarCodigo(codigo)}
          style={{
            cursor: "pointer",
            color: "var(--color-green-500)",
            fontSize: "1.3rem",
          }}
        >
          <i className="fas fa-copy"></i>
        </button>
      ) : null}
    </div>
  );
}

PedidoCard.propTypes = {
  id: PropTypes.string.isRequired,
  server: PropTypes.string,
  codigo: PropTypes.string,
  data: PropTypes.string.isRequired,
  valor: PropTypes.string,
  situacao: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
};

function CardsPedidos() {
  const [dadosPedidos, setDadosPedidos] = useState({ pedidos: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    MeusPedidos();
  }, []);

  async function MeusPedidos() {
    const RotaApi = import.meta.env.VITE_API;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${RotaApi}/Backend/Usuario/Pedidos.php`,
        { token },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 && response.data.Pedidos) {
        setDadosPedidos({ pedidos: response.data.Pedidos });

        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        console.error(
          "Erro na requisição ou dados inválidos:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro na verificação do token:", error);
    }
  }

  const pedidos = dadosPedidos.pedidos || [];
  const pedidosmaisrecentes = pedidos.sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );

  function converterData(data) {
    const dataConvertida = new Date(data);
    const dia = dataConvertida.getDate();
    const mes = dataConvertida.getMonth() + 1;
    const ano = dataConvertida.getFullYear();
    const hora = dataConvertida.getHours();
    const minuto = dataConvertida.getMinutes();
    const segundo = dataConvertida.getSeconds();
    return `${dia < 10 ? `0${dia}` : dia}/${
      mes < 10 ? `0${mes}` : mes
    }/${ano} as ${hora}:${minuto < 10 ? `0${minuto}` : minuto}:${
      segundo < 10 ? `0${segundo}` : segundo
    }`;
  }

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center">
              <Loading color="var(--corPrincipal)" />
            </div>
          ) : pedidosmaisrecentes.length > 0 ? (
            pedidosmaisrecentes.map((pedido, index) => (
              <PedidoCard
                key={pedido.idpedido}
                id={pedido.idpedido}
                server={pedido.titulo}
                dias={pedido.dias}
                codigo={pedido.codigoderecarga}
                data={converterData(pedido.created)}
                valor={pedido.valor}
                situacao={pedido.status}
                bgColor={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              />
            ))
          ) : (
            <p className="text-gray-600">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardsPedidos;
