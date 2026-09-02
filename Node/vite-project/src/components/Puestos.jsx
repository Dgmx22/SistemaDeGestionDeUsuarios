import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Puestos() {
  const [puestos, setPuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const [nombrePuesto, setNombrePuesto] = useState("");
  const [salario, setSalario] = useState("");

  const cargarPuestos = async () => {
    try {
      const respuesta = await api.get("/puestos");
      setPuestos(respuesta.data);
    } catch (err) {
      setError("No se pudieron cargar los puestos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPuestos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await api.post("/puestos", {
        nombre_puesto: nombrePuesto,
        salario: Number(salario),
      });

      setNombrePuesto("");
      setSalario("");
      cargarPuestos();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("No se pudo crear el puesto.");
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Catálogo de Puestos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de cargos y tabulador salarial.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4">
            Agregar nuevo puesto
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="nombrePuesto" className="block text-xs font-medium text-slate-700 mb-1">
                Nombre del puesto
              </label>
              <input
                id="nombrePuesto"
                type="text"
                placeholder="Ej. Desarrollador Senior"
                value={nombrePuesto}
                onChange={(e) => setNombrePuesto(e.target.value)}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="w-full sm:w-48">
              <label htmlFor="salario" className="block text-xs font-medium text-slate-700 mb-1">
                Salario mensual ($)
              </label>
              <input
                id="salario"
                type="number"
                placeholder="0.00"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {guardando ? "Guardando..." : "Agregar puesto"}
            </button>
          </form>
        </div>

        {cargando ? (
          <div className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-500">Cargando puestos registrados...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-600 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Puesto</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Salario Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {puestos.map((puesto) => (
                  <tr key={puesto.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {puesto.nombre_puesto}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-sm font-medium text-slate-900">
                      ${puesto.salario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {puestos.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-sm text-slate-500">
                      No hay puestos registrados en el catálogo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}

export default Puestos;