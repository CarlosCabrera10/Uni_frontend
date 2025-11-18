import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Leer el token desde localStorage
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "auto",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h2>ADMIN Móvil</h2>
      <p>Prueba para WebView Swift</p>

      {/* Mostrar token si existe */}
      {token ? (
        <p>
          <strong>Token guardado:</strong> {token}
        </p>
      ) : (
        <p>No hay token guardado</p>
      )}
    </div>
  );
}

export default App;
