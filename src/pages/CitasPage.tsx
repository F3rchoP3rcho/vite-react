import { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

export default function CitasPage() {

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

  // ==========================================
  // Cargar servicios
  // ==========================================
  useEffect(() => {
    fetch(`${API_URL}/infoservicios`)
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error("Error cargando servicios:", err));
  }, []);

  // ==========================================
  // Enviar formulario
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (servicioId === null) {
      alert("Selecciona un servicio");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          servicio_id: servicioId,
          fecha,
          hora,
          nombre_cliente: nombreCliente,
          nombre_mascota: nombreMascota
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cita agendada correctamente 🐾");
        setServicioId(null);
        setFecha("");
        setHora("");
        setNombreCliente("");
        setNombreMascota("");
      } else {
        alert(data.message || "Error al agendar");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Agendar Cita</h2>

      <form onSubmit={handleSubmit}>

        {/* Servicio */}
        <label>Servicio</label>
        <select
          value={servicioId ?? ""}
          onChange={(e) =>
            setServicioId(
              e.target.value === "" ? null : Number(e.target.value)
            )
          }
          required
        >
          <option value="">Selecciona</option>
          {servicios.map(servicio => (
            <option
              key={servicio.id_servicios}
              value={servicio.id_servicios}
            >
              {servicio.tipos_servicios}
            </option>
          ))}
        </select>

        <br /><br />

        {/* Fecha */}
        <label>Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <br /><br />

        {/* Hora */}
        <label>Hora</label>
        <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        required
        step="60"
        />

        <br /><br />

        {/* Nombre cliente */}
        <label>Nombre del dueño</label>
        <input
          type="text"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          required
        />

        <br /><br />

        {/* Nombre mascota */}
        <label>Nombre de la mascota</label>
        <input
          type="text"
          value={nombreMascota}
          onChange={(e) => setNombreMascota(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">
          Agendar
        </button>

      </form>
    </div>
  );
}