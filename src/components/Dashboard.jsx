import React from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/axiosClient";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get user data from localStorage on component mount
  const getUserData = () => {
    try {
      const storedUserData = localStorage.getItem("userData");
      return storedUserData ? JSON.parse(storedUserData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const userData = getUserData();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clear auth token from axios headers
    setAuthToken(null);

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              ¡Bienvenido al Dashboard!
            </h1>
            {userData?.perfil?.nombre_completo && (
              <div className="mb-6">
                <p className="text-lg text-gray-600">
                  Hola,{" "}
                  <span className="font-semibold text-orange-500">
                    {userData.perfil.nombre_completo}
                  </span>
                </p>
              </div>
            )}
            <div className="text-sm text-gray-500 mb-6">
              <p>Has iniciado sesión exitosamente como empresa.</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
