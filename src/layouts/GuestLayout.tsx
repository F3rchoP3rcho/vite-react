import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function GuestLayout() {
  const navigate = useNavigate();

  const handleExit = () => {
    // (Opcional) si guardas algo del invitado en localStorage
    localStorage.removeItem("guest");

    // Regresa al login
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        className="card"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          borderLeft: 0,
          borderRight: 0,
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 800, letterSpacing: -0.3 }}>Veterinaria</div>

          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <NavLink to="/guest" className="btn">Inicio</NavLink>
            <NavLink to="/guest/servicios" className="btn">Servicios</NavLink>

          </nav>

          <button onClick={handleExit} className="btn" style={{ marginLeft: "auto" }}>
            Salir
          </button>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}