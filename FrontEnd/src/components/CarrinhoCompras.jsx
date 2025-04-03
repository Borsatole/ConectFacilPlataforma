import PropTypes from "prop-types";

function CarrinhoCompras({ items = 0 }) {
  CarrinhoCompras.propTypes = {
    items: PropTypes.number,
  };

  return (
    <div className="relative">
      <button className="text-gray-600 hover:text-gray-800 transition duration-200">
        <i className="fa fa-bell text-2xl"></i>
      </button>
      <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-600 text-white text-xs font-bold text-center rounded-full">
        {items}
      </span>
    </div>
  );
}

export default CarrinhoCompras;
