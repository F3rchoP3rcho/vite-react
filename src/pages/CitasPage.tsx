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
  // Cargar servicios al montar el componente
  // ==========================================
  useEffect(() => {
    fetch(`${API_URL}/infoservicios`)
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  // ==========================================
  // Enviar formulario
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (servicioId === null) {
      alert("Por favor, selecciona un servicio");
      return;
    }

    // Objeto que se enviará a la API
    const nuevaCita = {
      servicio_id: servicioId,
      fecha,
      hora,
      nombre_cliente: nombreCliente,
      nombre_mascota: nombreMascota,
    };

    try {
      const response = await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCita),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cita agendada correctamente! 🐾");
        // Resetear el formulario
        setServicioId(null);
        setFecha("");
        setHora("");
        setNombreCliente("");
        setNombreMascota("");
      } else {
        alert(data.message || "Hubo un error al agendar la cita");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Agendar Cita</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* Servicio */}
        <div>
          <label style={{ display: "block" }}>Servicio</label>
          <select
            style={{ width: "100%", padding: "8px" }}
            value={servicioId ?? ""}
            onChange={(e) =>
              setServicioId(e.target.value === "" ? null : Number(e.target.value))
            }
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id_servicios} value={servicio.id_servicios}>
                {servicio.tipos_servicios}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label style={{ display: "block" }}>Fecha</label>
          <input
            style={{ width: "100%", padding: "8px" }}
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        {/* Hora */}
        <div>
          <label style={{ display: "block" }}>Hora (Completa HH:mm AM/PM)</label>
          <input
            style={{ width: "100%", padding: "8px" }}
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </div>

        {/* Nombre Cliente (Dueño) */}
        <div>
          <label style={{ display: "block" }}>Nombre del dueño</label>
          <input
            style={{ width: "100%", padding: "8px" }}
            type="text"
            placeholder="Ej. Juan Pérez"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
          />
        </div>

        {/* Nombre Mascota */}
        <div>
          <label style={{ display: "block" }}>Nombre de la mascota</label>
          <input
            style={{ width: "100%", padding: "8px" }}
            type="text"
            placeholder="Ej. Firulais"
            value={nombreMascota}
            onChange={(e) => setNombreMascota(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: "10px", 
            backgroundColor: "#2ecc71", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Agendar Cita
        </button>

      </form>
    </div>
  );
}