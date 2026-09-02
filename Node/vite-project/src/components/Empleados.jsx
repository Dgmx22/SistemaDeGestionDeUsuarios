import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 20;

  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [puestoId, setPuestoId] = useState("");

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

  useEffect(() => {
    const cargarEmpleados = async () => {
      setCargando(true);
      try {
        const respuesta = await api.get("/empleados", {
          params: {
            pagina,
            limite,
            numero_empleado: numeroEmpleado || undefined,
            puesto_id: puestoId || undefined,
          },
        });

        setEmpleados(respuesta.data.resultados);
        setTotal(respuesta.data.total);
        setTotalPaginas(respuesta.data.total_paginas);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("No se pudieron cargar los empleados");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarEmpleados();
  }, [pagina, numeroEmpleado, puestoId, navigate]);

  const aplicarFiltroNumero = (valor) => {
    setNumeroEmpleado(valor);
    setPagina(1);
  };

  const aplicarFiltroPuesto = (valor) => {
    setPuestoId(valor);
    setPagina(1);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6 antialiased">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 antialiased">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Directorio de Empleados
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestión de personal y consulta de expedientes.
            </p>
          </div>
          <button
            onClick={() => navigate("/empleados/nuevo")}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Nuevo empleado
          </button>
        </div>

        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="buscar-numero" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Número de empleado
              </label>
              <input
                id="buscar-numero"
                type="text"
                placeholder="Ej. EMP-01"
                value={numeroEmpleado}
                onChange={(e) => aplicarFiltroNumero(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label htmlFor="filtrar-puesto" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Filtrar por puesto
              </label>
              <select
                id="filtrar-puesto"
                value={puestoId}
                onChange={(e) => aplicarFiltroPuesto(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="">Todos los puestos</option>
                {puestos.map((puesto) => (
                  <option key={puesto.id} value={puesto.id}>
                    {puesto.nombre_puesto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-500">Cargando datos de empleados...</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-600 tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Nº Empleado</th>
                    <th scope="col" className="px-6 py-3.5">Nombre Completo</th>
                    <th scope="col" className="px-6 py-3.5">Puesto</th>
                    <th scope="col" className="px-6 py-3.5">Correo</th>
                    <th scope="col" className="px-6 py-3.5 text-right"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {empleados.map((empleado) => (
                    <tr key={empleado.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-900">
                        {empleado.numero_empleado}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                        {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {empleado.puesto?.nombre_puesto || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {empleado.correo}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/empleados/${empleado.id}`)}
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                  {empleados.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                        No se encontraron empleados registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {empleados.map((empleado) => (
                <div key={empleado.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      #{empleado.numero_empleado}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {empleado.puesto?.nombre_puesto || "N/A"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {empleado.correo}
                  </p>
                  <div className="mt-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/empleados/${empleado.id}`)}
                      className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 text-center text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
              <span className="text-sm text-slate-600">
                Página <span className="font-medium text-slate-900">{pagina}</span> de{" "}
                <span className="font-medium text-slate-900">{totalPaginas}</span> ({total} empleados en total)
              </span>

              <div className="flex space-x-2">
                <button
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => p - 1)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={pagina === totalPaginas || totalPaginas === 0}
                  onClick={() => setPagina((p) => p + 1)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default Empleados;