import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Bloqueia o acesso direto a rotas autenticadas (ex: digitar
 * "/home" manualmente na barra de endereço) quando não existe
 * uma sessão válida no localStorage.
 *
 * Uso (no main.jsx):
 *   { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> }
 */
const RotaProtegida = ({ children }) => {
  // eslint-disable-next-line no-useless-assignment
  let authData = null;

  try {
    authData = JSON.parse(localStorage.getItem("auth"));
  } catch {
    authData = null;
  }

  // Sem sessão válida (ou dado corrompido no localStorage) → volta pro Login
  if (!authData?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RotaProtegida;
