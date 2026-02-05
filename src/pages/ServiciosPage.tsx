import { useEffect, useState } from "react";

type Servicio = {
  id_servicios: string;
  Tipos_servicios: string;
  Disponibilidad: string;
  Horario: string;
  Encargado: string;
  Numero_pacientes: string;
};

export default function ServiciosPage() {
  const [data, setData] = useState<Servicio[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Servicios | Veterinaria";
  }, []);

  const consultar = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://veterinaria-steel.vercel.app/api/infoservicios");
      if (!res.ok) throw new Error("Error al consultar la API de servicios");

      const json: Servicio[] = await res.json();
      setData(json);
    } catch (e) {
      setError("No se pudo obtener la información de servicios");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card page">
      <h1 className="h1">Servicios</h1>
      <p className="p">Consulta y visualiza los registros desde la API.</p>

      <div className="actions">
        <button className="btn btnPrimary" onClick={consultar}>
          Consultar API
        </button>
      </div>

      {loading && (
        <p className="p" style={{ marginTop: 12 }}>
          Cargando...
        </p>
      )}
      {error && <p className="error">{error}</p>}

      {data.length > 0 && (
        <div className="tableWrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de servicio</th>
                <th>Disponibilidad</th>
                <th>Horario</th>
                <th>Encargado</th>
                <th>Número de pacientes</th>
              </tr>
            </thead>

            <tbody>
              {data.map((s) => (
                <tr key={s.id_servicios}>
                  <td>{s.id_servicios}</td>
                  <td>{s.Tipos_servicios}</td>
                  <td>{s.Disponibilidad}</td>
                  <td>{s.Horario}</td>
                  <td>{s.Encargado}</td>
                  <td>{s.Numero_pacientes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
