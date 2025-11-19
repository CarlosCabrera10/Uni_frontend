import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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
            <div className="text-sm text-gray-500">
              <p>Has iniciado sesión exitosamente como empresa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
