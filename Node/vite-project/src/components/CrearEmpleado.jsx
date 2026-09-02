import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CrearEmpleado() {
  const [puestos, setPuestos] = useState([]);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    numero_empleado: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    correo: "",
    direccion: "",
    puesto_id: "",
  });

  useEffect(() => {
    const cargarPuestos = async () => {
      try {
        const respuesta = await api.get("/puestos");
        setPuestos(respuesta.data);
      } catch (err) {
        console.error("No se pudieron cargar los puestos", err);
      }
    };
    cargarPuestos();
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const respuesta = await api.post("/empleados", {
        ...formulario,
        puesto_id: Number(formulario.puesto_id),
      });

      const nuevoEmpleadoId = respuesta.data.id;

      if (foto) {
        const formData = new FormData();
        formData.append("foto", foto);

        await api.post(`/empleados/${nuevoEmpleadoId}/foto`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/empleados");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("No se pudo crear el empleado. Revisa los datos.");
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Nuevo empleado
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Registra la información personal y laboral del nuevo colaborador.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/empleados")}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-800"
          >
            Volver al listado
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label htmlFor="numero_empleado" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Número de empleado
              </label>
              <input
                id="numero_empleado"
                type="text"
                name="numero_empleado"
                placeholder="Ej. EMP-001"
                value={formulario.numero_empleado}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 font-mono text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label htmlFor="nombre" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Nombre(s)"
                value={formulario.nombre}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label htmlFor="apellido_paterno" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Apellido paterno
              </label>
              <input
                id="apellido_paterno"
                type="text"
                name="apellido_paterno"
                placeholder="Primer apellido"
                value={formulario.apellido_paterno}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label htmlFor="apellido_materno" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Apellido materno
              </label>
              <input
                id="apellido_materno"
                type="text"
                name="apellido_materno"
                placeholder="Segundo apellido"
                value={formulario.apellido_materno}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                placeholder="10 dígitos"
                value={formulario.telefono}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="correo" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                name="correo"
                placeholder="correo@empresa.com"
                value={formulario.correo}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="direccion" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Calle, número, colonia y ciudad"
                value={formulario.direccion}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="puesto_id" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Puesto de trabajo
              </label>
              <select
                id="puesto_id"
                name="puesto_id"
                value={formulario.puesto_id}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="">Selecciona un puesto</option>
                {puestos.map((puesto) => (
                  <option key={puesto.id} value={puesto.id}>
                    {puesto.nombre_puesto} — ${puesto.salario.toLocaleString("es-MX")}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="foto" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Foto del empleado (opcional)
              </label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/empleados")}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-800 sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {guardando ? "Guardando..." : "Crear empleado"}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

export default CrearEmpleado;