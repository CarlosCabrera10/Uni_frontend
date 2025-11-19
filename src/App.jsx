import { useState } from "react";

function App() {
  const [token, setToken] = useState("");

  const mostrarToken = () => {
    const savedToken = localStorage.getItem("authToken");
    setToken(savedToken || "");
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "auto",
        fontFamily: "sans-serif",
        textAlign: "center"
      }}
    >
      <h2>ADMIN Móvil</h2>
      <p>Prueba para WebView Swift</p>

      <button onClick={mostrarToken} style={{ padding: 10, marginBottom: 20 }}>
        Mostrar Token
      </button>

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
