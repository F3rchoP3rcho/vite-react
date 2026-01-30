import { useEffect, useState } from "react";

type Empleado = {
  id_empleado: number;
  nombre: string;
  apellido: string;
  puesto: string;
  especialidad: string | null;
  telefono: string;
  email: string;
  fecha_contratacion: string; // ISO
  salario: string;
  activo: boolean;
};

export default function EmpleadosPage() {
  const [data, setData] = useState<Empleado[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Empleados | Veterinaria";
  }, []);

  const consultar = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://veterinaria-steel.vercel.app/api/empleadosinfo");
      if (!res.ok) throw new Error("Error al consultar la API de empleados");

      const json: Empleado[] = await res.json();
      setData(json);
    } catch (e) {
      setError("No se pudo obtener la información de empleados");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Empleados</h1>

      <button onClick={consultar} style={{ padding: "8px 12px", borderRadius: 10 }}>
        Consultar API
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr>
                {[
                  "ID",
                  "Nombre",
                  "Puesto",
                  "Especialidad",
                  "Teléfono",
                  "Email",
                  "Fecha contratación",
                  "Salario",
                  "Activo",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderBottom: "1px solid #eee",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id_empleado}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {e.id_empleado}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {e.nombre} {e.apellido}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{e.puesto}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {e.especialidad ?? "—"}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{e.telefono}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{e.email}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {formatearFecha(e.fecha_contratacion)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{e.salario}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {e.activo ? "Sí" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
