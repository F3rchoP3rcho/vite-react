import { useEffect, useState } from "react";

type Personal = {
  id: string;
  Nombre: string;
  Edad: number;
  Altura: string;
  Sexo: string;
  Estudios: string;
};

export default function InfoPersonalPage() {
  const [data, setData] = useState<Personal[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    document.title = "Info Personal | Veterinaria";
  }, []);

  const obtenerInfo = async () => {
    try {
      setError("");

      const res = await fetch("https://veterinaria-steel.vercel.app/api/infoPersonal");
      if (!res.ok) throw new Error("Error al consultar la API");

      const json: Personal[] = await res.json();
      setData(json);
    } catch (err) {
      setError("No se pudo obtener la información");
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Información del Personal</h1>

      <button onClick={obtenerInfo} style={{ padding: "8px 12px", borderRadius: 10 }}>
        Consultar API
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: 16 }}>
        {data.map((persona) => (
          <li key={persona.id} style={{ marginBottom: 12 }}>
            <strong>{persona.Nombre}</strong> <br />
            Edad: {persona.Edad} <br />
            Sexo: {persona.Sexo} <br />
            Estudios: {persona.Estudios}
          </li>
        ))}
      </ul>
    </div>
  );
}
