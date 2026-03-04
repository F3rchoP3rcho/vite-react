import { useEffect, useMemo, useState } from "react";
import "./Guest.css";

type Servicio = {
  id_servicios: string | number;
  tipos_servicios: string;
  Disponibilidad: string;
  Horario: string;
  Encargado: string;
};

export default function GuestServiciosPage() {
  const [data, setData] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [q, setQ] = useState<string>("");

  useEffect(() => {
    const consultar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/infoservicios`);
        if (!res.ok) throw new Error("Error al consultar la API");
        const json = await res.json();

        // Asegura que sea arreglo
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        setError("No se pudo obtener la información de servicios.");
      } finally {
        setLoading(false);
      }
    };

    consultar();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data;

    return data.filter((s) =>
      `${s.tipos_servicios} ${s.Disponibilidad} ${s.Horario} ${s.Encargado}`
        .toLowerCase()
        .includes(term)
    );
  }, [data, q]);

  if (loading) {
    return (
      <div className="guestPage">
        <div className="guestHero">
          <h1 className="guestHeroTitle">Servicios</h1>
          <p className="guestHeroText">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guestPage">
        <div className="guestHero">
          <h1 className="guestHeroTitle">Servicios</h1>
          <p className="guestHeroText">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guestPage">
      <div className="guestHero">
        <h1 className="guestHeroTitle">Servicios disponibles</h1>
        <p className="guestHeroText">
          Consulta disponibilidad y horario de cada servicio.
        </p>

        <div style={{ marginTop: 14 }}>
          <input
            className="guestInput"
            placeholder="Buscar servicio..."
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="guestGrid">
        {filtered.map((s) => (
          <div key={s.id_servicios} className="guestCard">
            <h3>{s.tipos_servicios}</h3>

            <div style={{ margin: "8px 0" }}>
              <span className="guestTag">{s.Disponibilidad}</span>
              <span className="guestTag">{s.Horario}</span>
            </div>

            <p>
              <b>Encargado:</b> {s.Encargado}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}