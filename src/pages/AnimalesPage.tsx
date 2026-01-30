import { useEffect, useState } from "react";

type Animal = {
  id: string;
  Animal: string;
  Raza: string;
  Nombre: string;
  Años: string;
  Sintomas: string;
  Vacunación: boolean;
  Dieta: string;
};

export default function AnimalesPage() {
  const [data, setData] = useState<Animal[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Animales | Veterinaria";
  }, []);

  const consultar = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://veterinaria-steel.vercel.app/api/animales");
      if (!res.ok) throw new Error("Error al consultar la API de animales");

      const json: Animal[] = await res.json();
      setData(json);
    } catch (e) {
      setError("No se pudo obtener la información de animales");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Animales</h1>

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
                {["ID", "Animal", "Raza", "Nombre", "Años", "Síntomas", "Vacunación", "Dieta"].map(
                  (h) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.id}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Animal}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Raza}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Nombre}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Años}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Sintomas}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>
                    {a["Vacunación"] ? "Sí" : "No"}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f2f2f2" }}>{a.Dieta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
