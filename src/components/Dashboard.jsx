import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [perfilEmpresa, setPerfilEmpresa] = useState(null);
  const [session, setSession] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    const p = localStorage.getItem("perfil");
    const pe = localStorage.getItem("perfil_empresa");
    const s = localStorage.getItem("session");
    const au = localStorage.getItem("authUser");
    if (u) setUsuario(JSON.parse(u));
    if (p) setPerfil(JSON.parse(p));
    if (pe) setPerfilEmpresa(JSON.parse(pe));
    if (s) setSession(JSON.parse(s));
    if (au) setAuthUser(JSON.parse(au));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userUUID");
    localStorage.removeItem("usuario");
    localStorage.removeItem("perfil");
    localStorage.removeItem("perfil_empresa");
    localStorage.removeItem("session");
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "20px"
        }}
      >
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      <main>
        <div style={{ marginBottom: "20px" }}>
          <h2>Bienvenido al Dashboard</h2>
          <p>Has iniciado sesión exitosamente.</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Información de cuenta</h3>
          <pre style={{ background: "#f7f7f7", padding: "10px" }}>
            {JSON.stringify(
              usuario || { id: localStorage.getItem("userUUID") },
              null,
              2
            )}
          </pre>
        </div>

        {session && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Session (auth)</h3>
            <p>
              <strong>Access token:</strong>
            </p>
            <pre
              style={{
                background: "#f7f7f7",
                padding: "10px",
                overflowX: "auto"
              }}
            >
              {session.access_token}
            </pre>
            <p>
              <strong>Expires at:</strong> {session.expires_at}
            </p>
            <p>
              <strong>Refresh token:</strong> {session.refresh_token}
            </p>
            {authUser && (
              <>
                <h4>User metadata</h4>
                <pre style={{ background: "#f7f7f7", padding: "10px" }}>
                  {JSON.stringify(authUser, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}

        {perfil && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Perfil</h3>
            <p>
              <strong>Nombre:</strong> {perfil.nombre_completo}
            </p>
            <p>
              <strong>Ubicación:</strong> {perfil.ubicacion}
            </p>
            <p>
              <strong>Teléfono:</strong> {perfil.telefono}
            </p>
          </div>
        )}

        {perfilEmpresa && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Perfil Empresa</h3>
            <p>
              <strong>Nombre comercial:</strong>{" "}
              {perfilEmpresa.nombre_comercial}
            </p>
            <p>
              <strong>Año fundación:</strong> {perfilEmpresa.anio_fundacion}
            </p>
            <p>
              <strong>Total empleados:</strong> {perfilEmpresa.total_empleados}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
