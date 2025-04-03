import PropTypes from "prop-types";
import Loading from "./Loading";

function CardEstatisticas(props) {
  CardEstatisticas.propTypes = {
    icone: PropTypes.string.isRequired,
    valor: PropTypes.string.isRequired,
    descricao: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired, // Adicionando a prop de loading
  };

  return (
    <div
      className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 md:p-6 rounded-lg shadow-lg flex items-center text-white relative"
      style={{
        backgroundImage: "linear-gradient(161deg, #4F46E5, #2664EB)",
        cursor: "pointer",
      }}
    >
      <i className={`${props.icone} text-3xl md:text-4xl mr-4`}></i>
      <div>
        <div className="text-2xl md:text-3xl font-bold">
          {/* Exibe o spinner enquanto estiver carregando */}
          {props.loading ? (
            <Loading />
          ) : (
            props.valor // Exibe o valor se não estiver carregando
          )}
        </div>
        <p>{props.descricao}</p>
      </div>
    </div>
  );
}

export default CardEstatisticas;
