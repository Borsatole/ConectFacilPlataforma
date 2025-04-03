/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const abrirMenu = () => {
    setMenuAberto(true);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <MenuContext.Provider
      value={{ menuAberto, toggleMenu, abrirMenu, fecharMenu }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu deve ser usado dentro de um MenuProvider");
  }
  return context;
}

MenuProvider.propTypes = {
  children: PropTypes.node,
};
