import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function DetalleEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEmpleado = async () => {
      try {
        const respuesta = await api.get(`/empleados/${id}`);
        setEmpleado(respuesta.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("Ese empleado no existe.");
        } else {
          setError("No se pudo cargar la información del empleado.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarEmpleado();
  }, [id, navigate]);

  const eliminarEmpleado = async () => {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar a ${empleado.nombre} ${empleado.apellido_paterno}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await api.delete(`/empleados/${id}`);
      navigate("/empleados");
    } catch (err) {
      setError("No se pudo eliminar el empleado.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 antialiased flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Cargando expediente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 antialiased p-6">
        <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!empleado) return null;

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("/empleados")}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Volver a empleados
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/empleados/${id}/editar`)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              Editar
            </button>
            <button
              onClick={eliminarEmpleado}
              className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              
              <div className="flex justify-center sm:justify-start">
                <img
                  src={
                    empleado.foto_url
                      ? `http://127.0.0.1:8000${empleado.foto_url}`
                      : "/sin-foto.png"
                  }
                  alt={empleado.nombre}
                  className="h-32 w-32 rounded-lg border border-slate-200 object-cover bg-slate-100 shadow-sm sm:h-40 sm:w-40"
                />
              </div>

              <div className="flex-1">
                <div className="border-b border-slate-200 pb-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 mb-2">
                    {empleado.puesto?.nombre_puesto || "N/A"}
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}
                  </h1>
                </div>

                <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nº Empleado
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
                      {empleado.numero_empleado}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Salario base
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
                      ${empleado.puesto?.salario ? empleado.puesto.salario.toLocaleString("es-MX", { minimumFractionDigits: 2 }) : "0.00"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Correo electrónico
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {empleado.correo}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Teléfono
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {empleado.telefono}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Dirección particular
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {empleado.direccion}
                    </dd>
                  </div>
                </dl>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default DetalleEmpleado;