import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Component to protect public routes (like login) from authenticated users
function PublicRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default ProtectedRoute;
export { PublicRoute };
