import CardRecargas from "./CardRecargas";
import PropTypes from "prop-types";
import Loading from "./Loading";

function CatalogoRecargas(props) {
  // Corrigir a definição de tipos de propriedades
  CatalogoRecargas.propTypes = {
    items: PropTypes.array,
    loading: PropTypes.bool,
  };

  // Ajustar a desestruturação do objeto props
  const { items, loading } = props;

  const RotaApi = import.meta.env.VITE_API;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 text-left mb-8">
        Recargas
      </h2>

      {loading ? (
        // alinha o spinner ao centro
        <div className="flex justify-center h-140 ">
          <Loading color="var(--corPrincipal)" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3  justify-items-center">
          {items.sort((a, b) => parseFloat(a.dias) - parseFloat(b.dias))
          .map((item) => (
            <CardRecargas
              key={item.id}
              id={item.id}
              imgRecarga={`${RotaApi}/Backend/Recargas/${item.imagem}`}
              descricaoRecarga={item.titulo}
              valorRecarga={item.valor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogoRecargas;
