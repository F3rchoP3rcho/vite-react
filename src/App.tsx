import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import InfoPersonalPage from "./pages/InfoPersonalPage";
import AnimalesPage from "./pages/AnimalesPage";
import EmpleadosPage from "./pages/EmpleadosPage";
import ServiciosPage from "./pages/ServiciosPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";  

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/info-personal" element={<InfoPersonalPage />} />
        <Route path="/animales" element={<AnimalesPage />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
