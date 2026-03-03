import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import GuestLayout from "./layouts/GuestLayout";
import GuestHomePage from "./pages/guest/GuestHomePage.tsx";
import GuestServiciosPage from "./pages/guest/GuestServiciosPage";
import InfoPersonalPage from "./pages/InfoPersonalPage";
import AnimalesPage from "./pages/AnimalesPage";
import EmpleadosPage from "./pages/EmpleadosPage";
import ServiciosPage from "./pages/ServiciosPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";  
import CitasPage from "./pages/CitasPage.tsx";
import GuestCitasPage from "./pages/guest/GuestCitasPage.tsx";

// ==========================================
// EL GUARDIA DE SEGURIDAD (Ruta Protegida)
// ==========================================
const ProtectedRoute = () => {
  // Buscamos si guardaste el "usuario" en el navegador al hacer login
  const isLogged = localStorage.getItem("usuario");

  if (!isLogged) {
    // Si NO está logueado, lo mandamos a la fuerza al login
    return <Navigate to="/login" replace />;
  }

  // Si SÍ está logueado, lo dejamos pasar a las rutas hijas
  return <Outlet />;
};

export default function App() {
  return (
    <Routes>
      {/* 1. RUTA PÚBLICA: Cualquiera puede ver el Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/guest" element={<GuestLayout />}>
        <Route index element={<GuestHomePage />} />
        <Route path="servicios" element={<GuestServiciosPage />} />
        <Route path="Citas" element={<GuestCitasPage />} />
      </Route>

      {/* 2. RUTAS PROTEGIDAS: Requieren inicio de sesión */}
      <Route element={<ProtectedRoute />}>
        {/* Mantenemos tu MainLayout para el diseño */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/info-personal" element={<InfoPersonalPage />} />
          <Route path="/animales" element={<AnimalesPage />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/citas" element={<CitasPage />} />
        </Route>
      </Route>

      {/* 3. RUTA COMODÍN: Si escriben una URL que no existe, los mandamos al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}