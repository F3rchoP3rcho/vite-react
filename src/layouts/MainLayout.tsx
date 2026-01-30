import { NavLink, Outlet } from "react-router-dom";

const linkStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: "#111",
  border: "1px solid #ddd",
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  background: "#111",
  color: "white",
  border: "1px solid #111",
};

export default function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <header
        style={{
          padding: 16,
          borderBottom: "1px solid #e5e5e5",
          background: "white",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ margin: 0 }}>Veterinaria Dashboard</h2>

          <nav style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Inicio
            </NavLink>

            <NavLink
              to="/info-personal"
              style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            >
              Info Personal
            </NavLink>

            <NavLink
              to="/animales"
              style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            >
              Animales
            </NavLink>

            <NavLink
              to="/empleados"
              style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            >
              Empleados
            </NavLink>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
