import { useNavigate } from "react-router-dom";
import heroImg from "../../assets/vet-hero.jpg";

export default function GuestHomePage() {
  const navigate = useNavigate();

  return (
    <div className="card page">
      {/* HERO */}
      <div
        className="card inner"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr .8fr",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div>
          <h1 className="h1">Veterinaria 🐶🐱</h1>
          <p className="p">
            Bienvenido. Aquí puedes ver servicios, horarios y la información general sin entrar como administrador.
          </p>

          <div className="actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={() => navigate("/guest/servicios")}>
              Ver servicios
            </button>
            <button className="btn" onClick={() => navigate("/login")}>
              Soy administrador
            </button>
          </div>
        </div>

        {/* Imagen */}
        <div className="card" style={{ overflow: "hidden", borderRadius: 16 }}>
          <img
            src={heroImg}
            alt="Veterinaria"
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="grid">
        <div className="card inner">
          <h3 className="h3">Horarios</h3>
          <p className="p">Lun–Sáb: 9:00 am – 7:00 pm</p>
          <p className="p">Dom: 10:00 am – 2:00 pm</p>
        </div>

        <div className="card inner">
          <h3 className="h3">Ubicación</h3>
          <p className="p">📍 Av. Principal #123</p>
          <p className="p">📞 (993) 000 0000</p>
        </div>

        <div className="card inner">
          <h3 className="h3">Recomendación</h3>
          <p className="p">Trae cartilla de vacunas si es consulta general.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="card inner" style={{ marginTop: 16 }}>
        <h3 className="h3">¿Necesitas agendar?</h3>
        <p className="p">
          Si más adelante agregan “Agendar cita” para clientes, se puede crear otra ruta en <b>/guest/citas</b>.
        </p>
      </div>
    </div>
  );
}