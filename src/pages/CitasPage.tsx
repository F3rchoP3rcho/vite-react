import { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

interface Cita {
  id_citas?: number; // O el nombre que tenga el ID en tu DB
  servicio_id: number;
  fecha: string;
  hora: string;
  nombre_cliente: string;
  nombre_mascota: string;
  tipos_servicios?: string; // Para mostrar el nombre del servicio en la lista
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

export default function CitasPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]); // Estado para el historial
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

  // ==========================================
  // Cargar datos (Servicios y Citas)
  // ==========================================
  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      const data = await res.json();
      setCitas(data);
    } catch (err) {
      console.error("Error cargando citas:", err);
    }
  };

  useEffect(() => {
    // Cargar servicios
    fetch(`${API_URL}/infoservicios`)
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error cargando servicios:", err));

    // Cargar historial inicial
    cargarCitas();
  }, []);

  // ==========================================
  // Enviar formulario
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (servicioId === null) return alert("Selecciona un servicio");

    try {
      const response = await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicio_id: servicioId,
          fecha,
          hora,
          nombre_cliente: nombreCliente,
          nombre_mascota: nombreMascota,
        }),
      });

      if (response.ok) {
        alert("¡Cita agendada! 🐾");
        // Resetear campos
        setServicioId(null); setFecha(""); setHora(""); setNombreCliente(""); setNombreMascota("");
        // Recargar la lista automáticamente
        cargarCitas();
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  // ==========================================
  // Eliminar Cita
  // ==========================================
  const eliminarCita = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;

    try {
      const response = await fetch(`${API_URL}/citas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filtramos el estado para quitar la cita eliminada visualmente
        setCitas(citas.filter((cita) => cita.id_citas !== id));
      } else {
        alert("No se pudo eliminar la cita");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <h2>Agendar Cita</h2>
      
      {/* Formulario (Igual al anterior con ligeros ajustes de estilo) */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginBottom: "3rem" }}>
        <div style={{ display: "grid", gap: "10px" }}>
          <label>Servicio</label>
          <select value={servicioId ?? ""} onChange={(e) => setServicioId(Number(e.target.value))} required>
            <option value="">Selecciona</option>
            {servicios.map(s => <option key={s.id_servicios} value={s.id_servicios}>{s.tipos_servicios}</option>)}
          </select>

          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

          <label>Hora</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />

          <label>Nombre del dueño</label>
          <input type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />

          <label>Nombre de la mascota</label>
          <input type="text" value={nombreMascota} onChange={(e) => setNombreMascota(e.target.value)} required />

          <button type="submit" style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>Agendar</button>
        </div>
      </form>

      <hr />

      {/* SECCIÓN DE HISTORIAL / AGENDA */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Historial de Citas</h3>
        {citas.length === 0 ? (
          <p>No hay citas programadas.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {citas.map((cita) => (
              <div 
                key={cita.id_citas} 
                style={{ 
                  border: "1px solid #334155", 
                  padding: "1rem", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#1e293b"
                }}
              >
                <div>
                  <strong>{cita.nombre_mascota}</strong> ({cita.tipos_servicios || 'Servicio'})<br />
                  <small>📅 {cita.fecha} | ⏰ {cita.hora}</small><br />
                  <small>👤 Dueño: {cita.nombre_cliente}</small>
                </div>
                <button 
                  onClick={() => eliminarCita(cita.id_citas!)}
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}