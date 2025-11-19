import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState("");
  const [uuid, setUUID] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Leer tokens inmediatamente
    const checkTokens = () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUUID = localStorage.getItem("userUUID");

      if (savedToken && savedUUID) {
        setToken(savedToken);
        setUUID(savedUUID);
        setIsReady(true);
        console.log("✅ Tokens detectados:", {
          token: savedToken,
          uuid: savedUUID
        });
      }
    };

    // Verificar inmediatamente
    checkTokens();

    // Escuchar eventos de inyección desde Swift
    window.addEventListener("tokensInjected", (e) => {
      console.log("🔔 Evento tokensInjected recibido", e.detail);
      checkTokens();
    });

    // Escuchar cambios en storage
    window.addEventListener("storage", checkTokens);

    // Polling de respaldo (opcional, se detiene cuando encuentra tokens)
    const interval = setInterval(() => {
      if (!isReady) {
        checkTokens();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("tokensInjected", checkTokens);
      window.removeEventListener("storage", checkTokens);
    };
  }, [isReady]);

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "auto",
        fontFamily: "sans-serif"
      }}
    >
      <h2>🏢 ADMIN Móvil</h2>

      {isReady ? (
        <div
          style={{
            background: "#d4edda",
            padding: 15,
            borderRadius: 8,
            marginTop: 20
          }}
        >
          <h3 style={{ color: "#155724" }}>✅ Sesión Activa</h3>
          <p>
            <strong>Token:</strong> {token.substring(0, 20)}...
          </p>
          <p>
            <strong>UUID:</strong> {uuid}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#fff3cd",
            padding: 15,
            borderRadius: 8,
            marginTop: 20
          }}
        >
          <p>⏳ Esperando tokens de Swift...</p>
        </div>
      )}
    </div>
  );
}

export default App;
