import { useEffect, useState } from "react";

type Servicio = {
  id_servicios: string;
  tipos_servicios: string;
  Disponibilidad: string;
  Horario: string;
  Encargado: string;
  // Numero_pacientes: string;  // <- NO lo usamos en clientes
};

export default function GuestServiciosPage() {
  const [data, setData] = useState<Servicio[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Servicios (Clientes) | Veterinaria";

    const consultar = async () => {
      try {
        const res = await fetch("https://veterinaria-steel.vercel.app/api/infoservicios");
        if (!res.ok) throw new Error("Error al consultar la API");

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError("No se pudo obtener la información de servicios");
      } finally {
        setLoading(false);
      }
    };

    consultar();
  }, []);

  return (
    <div className="card page">
      <h1 className="h1">Servicios</h1>
      <p className="p">Servicios disponibles para clientes.</p>

      {loading && <p className="p">Cargando información...</p>}
      {error && <p className="error">{error}</p>}

      {/* Vista tipo cards para clientes */}
      {data.length > 0 && (
        <div className="grid">
          {data.map((s) => (
            <div key={s.id_servicios} className="card inner">
              <h3 className="h3" style={{ marginBottom: 6 }}>{s.tipos_servicios}</h3>
              <p className="p">Disponibilidad: {s.Disponibilidad}</p>
              <p className="p">Horario: {s.Horario}</p>
              <p className="p">Encargado: {s.Encargado}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}