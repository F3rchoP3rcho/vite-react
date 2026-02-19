import { NavLink, Outlet, useNavigate } from "react-router-dom";


export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Si guardas sesión en localStorage, bórrala:
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Te manda al login
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
            <NavLink to="/" className="btn">Inicio</NavLink>
            <NavLink to="/info-personal" className="btn">Info Personal</NavLink>
            <NavLink to="/animales" className="btn">Animales</NavLink>
            <NavLink to="/empleados" className="btn">Empleados</NavLink>
            <NavLink to="/servicios" className="btn">Servicios</NavLink>
            <NavLink to="/citas" className="btn">Citas</NavLink>
          </nav>
          
          <button
            onClick={handleLogout}
            className="btn"
            style={{ marginLeft: "auto" }}
          >
            Cerrar sesión
          </button>

        </div>

      </header>


      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
