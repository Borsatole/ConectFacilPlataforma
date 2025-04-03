import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  return auth.loggedIn ? children : <Navigate to="/login" />;
}
