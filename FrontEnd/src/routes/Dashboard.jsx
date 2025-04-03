import ConteudoDashboard from "../layout/ConteudoDashboard";
import MenuLateral from "../layout/MenuLateral";

export default function Dashboard() {
  return (
    <div className="flex">
      <MenuLateral />

      <div style={{ width: "100%" }}>
        <ConteudoDashboard />
      </div>
    </div>
  );
}
