import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { setAuthToken } from "../lib/axiosClient";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [uuid, setUUID] = useState("");

  useEffect(() => {
    // Verificar si ya hay tokens guardados
    const checkTokens = () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUUID = localStorage.getItem("userUUID");
      // if token present set it on axios client so requests include Authorization
      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
      }
      if (savedToken && savedUUID) {
        setUUID(savedUUID);
        setIsAuthenticated(true);
      }
    };

    checkTokens();

    // Escuchar eventos de inyección desde Swift
    window.addEventListener("tokensInjected", checkTokens);
    window.addEventListener("storage", checkTokens);

    return () => {
      window.removeEventListener("tokensInjected", checkTokens);
      window.removeEventListener("storage", checkTokens);
    };
  }, []);

  const parseAuthError = (error) => {
    const errorDescription = error.toLowerCase();

    if (
      errorDescription.includes("invalid login credentials") ||
      errorDescription.includes("invalid_grant") ||
      errorDescription.includes("email not confirmed")
    ) {
      return "Email o contraseña incorrectos. Por favor verifica tus credenciales.";
    } else if (
      errorDescription.includes("user not found") ||
      errorDescription.includes("email_not_found")
    ) {
      return "No existe una cuenta con este email. Verifica el email o regístrate.";
    } else if (errorDescription.includes("too_many_requests")) {
      return "Demasiados intentos. Espera unos minutos antes de intentar nuevamente.";
    } else if (
      errorDescription.includes("network") ||
      errorDescription.includes("connection")
    ) {
      return "Error de conexión. Verifica tu internet e intenta nuevamente.";
    } else {
      return "Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.";
    }
  };

  const handleAuth = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/signin", { email, password });
      const body = res.data;

      // Response contains session, user, usuario, perfil, perfil_empresa
      const { session, user, usuario, perfil, perfil_empresa } = body;

      const accessToken = session?.access_token || null;

      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
        setAuthToken(accessToken);
      }
      // store full session and user info for dashboard
      if (session) localStorage.setItem("session", JSON.stringify(session));
      if (user) localStorage.setItem("authUser", JSON.stringify(user));
      if (user?.id) localStorage.setItem("userUUID", user.id);
      if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
      if (perfil) localStorage.setItem("perfil", JSON.stringify(perfil));
      if (perfil_empresa)
        localStorage.setItem("perfil_empresa", JSON.stringify(perfil_empresa));

      setToken(accessToken || "");
      setUUID(user?.id || "");
      setIsAuthenticated(true);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // axios errors: error.response?.data or error.message
      const msg =
        error?.response?.data?.error || error?.message || "Error desconocido";
      setErrorMessage(parseAuthError((msg || "").toString()));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userUUID");
    setToken("");
    setUUID("");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setRememberMe(false);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ✅ Sesión Activa
            </h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Token:</p>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 break-all">
                  {token.substring(0, 40)}...
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">UUID:</p>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200">
                  {uuid}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          {/* Card de login */}
          <div className="bg-white rounded-xl shadow-sm">
            {/* Título */}
            <div className="pt-7 px-5 pb-5 text-center">
              <h1 className="text-3xl font-semibold text-gray-800">Accede</h1>
              <p className="text-sm text-gray-500 mt-1">
                Inicia sesión en tu cuenta
              </p>
            </div>

            {/* Formulario */}
            <div className="px-5 space-y-3">
              {/* Campo de correo/usuario */}
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">
                  Correo o usuario
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <svg
                    className="w-5 h-5 text-gray-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-gray-500">Contraseña</label>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <svg
                    className="w-5 h-5 text-gray-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Recordarme y olvidaste contraseña */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-800">Recordarme</span>
                </button>
                <button className="text-sm text-orange-500 hover:text-orange-600">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Mensaje de error */}
            {errorMessage && (
              <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Botón de entrar */}
            <div className="px-5 mt-4">
              <button
                onClick={handleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Entrar
              </button>
            </div>

            {/* Registro */}
            <div className="px-5 pb-7 pt-4 text-center">
              <span className="text-sm text-gray-500">¿No tienes cuenta? </span>
              <button className="text-sm font-medium text-orange-500 hover:text-orange-600">
                Registrarse
              </button>
            </div>
          </div>

          {/* Planes y suscripciones */}
          <div className="text-center mt-7">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Planes y suscripciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
