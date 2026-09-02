import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const getLinkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const getMobileLinkClasses = ({ isActive }) =>
    `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="border-b border-slate-200 bg-white antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
               RH
            </span>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/empleados" className={getLinkClasses} end>
              Empleados
            </NavLink>
            <NavLink to="/empleados/nuevo" className={getLinkClasses}>
              Nuevo empleado
            </NavLink>
            <NavLink to="/puestos" className={getLinkClasses}>
              Puestos
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center">
            <button
              onClick={cerrarSesion}
              className="rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
              aria-expanded={menuAbierto}
              aria-label="Abrir menú principal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {menuAbierto && (
        <div className="border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 md:hidden bg-slate-50/50">
          <NavLink
            to="/empleados"
            className={getMobileLinkClasses}
            onClick={() => setMenuAbierto(false)}
            end
          >
            Empleados
          </NavLink>
          <NavLink
            to="/empleados/nuevo"
            className={getMobileLinkClasses}
            onClick={() => setMenuAbierto(false)}
          >
            Nuevo empleado
          </NavLink>
          <NavLink
            to="/puestos"
            className={getMobileLinkClasses}
            onClick={() => setMenuAbierto(false)}
          >
            Puestos
          </NavLink>
          <div className="pt-2">
            <button
              onClick={cerrarSesion}
              className="w-full text-left block rounded-md bg-slate-200/70 px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-300/70"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;