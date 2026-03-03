import { useNavigate } from "react-router-dom";

export default function GuestHomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px 0" }}>
      <h1 style={{ marginBottom: 6 }}>Bienvenido a la Veterinaria 🐶🐱</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Esta sección es para clientes visitantes (no administradores).
      </p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>¿Qué puedes hacer aquí?</h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
          <li>Ver información general</li>
          <li>Consultar servicios (si lo agregan después)</li>
          <li>Agendar citas (si lo agregan después)</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => navigate("/login")}>
          Ir al login de administrador
        </button>
      </div>
    </div>
  );
}