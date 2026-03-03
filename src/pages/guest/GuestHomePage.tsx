import { useNavigate } from "react-router-dom";
import "./Guest.css";

import heroImg from "../../assets/vet-hero.jpg";

export default function GuestHomePage() {
  const navigate = useNavigate();

  return (
    <div className="guestPage">
      <section className="guestHero">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="guestHeroTitle">Veterinaria 🐶🐱</h1>
            <p className="guestHeroText">
              Bienvenido. Aquí puedes ver servicios, horarios y la información general sin entrar como administrador.
            </p>

            <div className="guestActions">
              <button className="guestBtn guestBtnPrimary" onClick={() => navigate("/guest/servicios")}>
                Ver servicios
              </button>

              <button className="guestBtn guestBtnGhost" onClick={() => navigate("/guest/citas")}>
                Agendar cita
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div style={{ overflow: "hidden", borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)" }}>
            <img
              src={heroImg}
              alt="Veterinaria"
              style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

      <div className="guestGrid">
        <div className="guestCard">
          <h3 style={{ marginTop: 0 }}>🕒 Horarios</h3>
          <p style={{ margin: "6px 0", opacity: 0.9 }}>Lun–Sáb: 9:00 am – 7:00 pm</p>
          <p style={{ margin: 0, opacity: 0.9 }}>Dom: 10:00 am – 2:00 pm</p>
        </div>

        <div className="guestCard">
          <h3 style={{ marginTop: 0 }}>📍 Ubicación</h3>
          <p style={{ margin: "6px 0", opacity: 0.9 }}>Av. Principal #123</p>
          <p style={{ margin: 0, opacity: 0.9 }}>Villahermosa, Tab.</p>
        </div>

        <div className="guestCard">
          <h3 style={{ marginTop: 0 }}>✅ Recomendación</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Trae cartilla de vacunas y llega 10 minutos antes.
          </p>
        </div>
      </div>
    </div>
  );
}