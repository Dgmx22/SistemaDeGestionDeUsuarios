import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function LayoutProtegido() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout-protegido">
      <Navbar />
      <div className="contenido">
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutProtegido;