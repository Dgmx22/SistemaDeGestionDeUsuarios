import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const datos = new URLSearchParams();
      datos.append("username", usuario);
      datos.append("password", password);

      const respuesta = await api.post("/login", datos, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", respuesta.data.access_token);
      navigate("/empleados");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 antialiased">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Iniciar sesión
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa tus credenciales para acceder al portal.
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" 
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="usuario" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:bg-slate-950"
          >
            Entrar
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;