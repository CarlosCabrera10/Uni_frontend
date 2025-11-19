import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
