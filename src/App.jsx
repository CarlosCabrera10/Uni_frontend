import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir la raíz a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta de login - protegida para usuarios autenticados */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Ruta protegida del dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
