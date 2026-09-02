import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Empleados from "./components/Empleados";
import CrearEmpleado from "./components/CrearEmpleado";
import LayoutProtegido from "./components/LayoutProtegido";
import DetalleEmpleado from "./components/DetalleEmpleado";
import Puestos from "./components/Puestos";
import EditarEmpleado from "./components/EditarEmpleado";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutProtegido />}>
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empleados/nuevo" element={<CrearEmpleado />} />
          <Route path="/empleados/:id" element={<DetalleEmpleado />} />
          <Route path="/puestos" element={<Puestos />} />
          <Route path="/empleados/:id/editar" element={<EditarEmpleado />} />

        </Route>

        <Route path="/" element={<Navigate to="/empleados" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;