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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Animales | Veterinaria";

    const consultar = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/animales`);
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

    consultar();
  }, []);

  return (
    <div className="card page">
      <h1 className="h1">Animales</h1>
      <p className="p">Consulta y visualiza los registros desde la API.</p>

      {loading && (
        <p className="p" style={{ marginTop: 12 }}>
          Cargando información...
        </p>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p className="p" style={{ marginTop: 12 }}>
          No hay registros para mostrar.
        </p>
      )}

      {data.length > 0 && (
        <div className="tableWrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Animal</th>
                <th>Raza</th>
                <th>Nombre</th>
                <th>Años</th>
                <th>Síntomas</th>
                <th>Vacunación</th>
                <th>Dieta</th>
              </tr>
            </thead>

            <tbody>
              {data.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.Animal}</td>
                  <td>{a.Raza}</td>
                  <td>{a.Nombre}</td>
                  <td>{a.Años}</td>
                  <td>{a.Sintomas}</td>
                  <td>
                    <span className={`chip ${a["Vacunación"] ? "chipGood" : "chipBad"}`}>
                      <span className="dot" />
                      {a["Vacunación"] ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>{a.Dieta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
