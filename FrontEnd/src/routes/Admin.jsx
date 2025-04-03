import ConteudoAdmin from "../layout/ConteudoAdmin";
import MenuLateral from "../layout/MenuLateral";

export default function Perfil() {
  return (
    <div className="flex">
      <MenuLateral />

      <div style={{ width: "100%" }} className="bg-gray-100">
        <ConteudoAdmin />
      </div>
    </div>
  );
}
