import { useEffect } from "react";
import { Link } from "react-router-dom";

const card: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  border: "1px solid #e5e5e5",
  background: "white",
};

export default function HomePage() {
  useEffect(() => {
    document.title = "Inicio | Veterinaria";
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Inicio</h1>
      <p>Selecciona un módulo para consultar su API.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Información del Personal</h3>
          <p>Consulta la API de infoPersonal (la que ya tenías).</p>
          <Link to="/info-personal">Ir →</Link>
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Animales</h3>
          <p>Lista de animales con síntomas, dieta y vacunación.</p>
          <Link to="/animales">Ir →</Link>
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Empleados</h3>
          <p>Información de empleados (puesto, salario, activo, etc.).</p>
          <Link to="/empleados">Ir →</Link>
        </div>
      </div>
    </div>
  );
}
