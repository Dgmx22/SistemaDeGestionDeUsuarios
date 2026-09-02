import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [puestos, setPuestos] = useState([]);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

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
    const cargarDatos = async () => {
      try {
        const [respuestaPuestos, respuestaEmpleado] = await Promise.all([
          api.get("/puestos"),
          api.get(`/empleados/${id}`),
        ]);

        setPuestos(respuestaPuestos.data);

        const empleado = respuestaEmpleado.data;
        setFormulario({
          numero_empleado: empleado.numero_empleado,
          nombre: empleado.nombre,
          apellido_paterno: empleado.apellido_paterno,
          apellido_materno: empleado.apellido_materno,
          telefono: empleado.telefono,
          correo: empleado.correo,
          direccion: empleado.direccion,
          puesto_id: empleado.puesto_id,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("No se pudo cargar la información del empleado.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await api.put(`/empleados/${id}`, {
        ...formulario,
        puesto_id: Number(formulario.puesto_id),
      });

      if (foto) {
        const formData = new FormData();
        formData.append("foto", foto);

        await api.post(`/empleados/${id}/foto`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate(`/empleados/${id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("No se pudo actualizar el empleado. Revisa los datos.");
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 antialiased flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Cargando datos del empleado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Editar Expediente
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Actualiza la información personal, asignación de puesto o fotografía del colaborador.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/empleados/${id}`)}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Volver al detalle
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="numero_empleado" className="block text-xs font-medium text-slate-700 mb-1">
                  Nº Empleado
                </label>
                <input
                  id="numero_empleado"
                  type="text"
                  name="numero_empleado"
                  placeholder="Ej. EMP-001"
                  value={formulario.numero_empleado}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label htmlFor="puesto_id" className="block text-xs font-medium text-slate-700 mb-1">
                  Puesto asignado
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
                      {puesto.nombre_puesto} — ${puesto.salario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nombre" className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre(s)
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label htmlFor="apellido_paterno" className="block text-xs font-medium text-slate-700 mb-1">
                  Apellido Paterno
                </label>
                <input
                  id="apellido_paterno"
                  type="text"
                  name="apellido_paterno"
                  placeholder="Apellido Paterno"
                  value={formulario.apellido_paterno}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label htmlFor="apellido_materno" className="block text-xs font-medium text-slate-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  id="apellido_materno"
                  type="text"
                  name="apellido_materno"
                  placeholder="Apellido Materno"
                  value={formulario.apellido_materno}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-xs font-medium text-slate-700 mb-1">
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
                <label htmlFor="correo" className="block text-xs font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  value={formulario.correo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="direccion" className="block text-xs font-medium text-slate-700 mb-1">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  name="direccion"
                  placeholder="Calle, número, colonia, ciudad"
                  value={formulario.direccion}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="foto" className="block text-xs font-medium text-slate-700 mb-1">
                  Cambiar fotografía (opcional)
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/empleados/${id}`)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}

export default EditarEmpleado;