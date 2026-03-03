import { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

interface Cita {
  id?: number;         // Ajustado para mayor compatibilidad
  id_citas?: number;   // Ajustado para mayor compatibilidad
  servicio_id: number;
  fecha: string;
  hora: string;
  nombre_cliente: string;
  nombre_mascota: string;
  tipos_servicios?: string;
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

export default function CitasPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
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
    fetch(`${API_URL}/infoservicios`)
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error cargando servicios:", err));

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
        setServicioId(null); setFecha(""); setHora(""); setNombreCliente(""); setNombreMascota("");
        cargarCitas();
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  // ==========================================
  // Eliminar Cita (Corregido)
  // ==========================================
  const eliminarCita = async (id: number | undefined) => {
    if (!id) {
      alert("Error: No se encontró el ID de esta cita en la base de datos.");
      return;
    }

    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;

    try {
      const response = await fetch(`${API_URL}/citas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filtramos buscando ambos posibles nombres de ID para estar seguros
        setCitas(citas.filter((cita) => (cita.id !== id && cita.id_citas !== id)));
      } else {
        alert("El servidor no permitió borrar la cita. Revisa la ruta DELETE.");
      }
    } catch (error) {
      console.error("Error al borrar:", error);
      alert("Error de conexión al intentar eliminar.");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "1px solid #334155", paddingBottom: "10px" }}>Agendar Cita</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginBottom: "3rem", display: "grid", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Servicio</label>
          <select style={{ width: "100%", padding: "8px" }} value={servicioId ?? ""} onChange={(e) => setServicioId(Number(e.target.value))} required>
            <option value="">Selecciona</option>
            {servicios.map(s => <option key={s.id_servicios} value={s.id_servicios}>{s.tipos_servicios}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Fecha</label>
          <input style={{ width: "100%", padding: "8px" }} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Hora</label>
          <input style={{ width: "100%", padding: "8px" }} type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Nombre del dueño</label>
          <input style={{ width: "100%", padding: "8px" }} type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Nombre de la mascota</label>
          <input style={{ width: "100%", padding: "8px" }} type="text" value={nombreMascota} onChange={(e) => setNombreMascota(e.target.value)} required />
        </div>

        <button type="submit" style={{ padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Agendar
        </button>
      </form>

      <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "10px" }}>Historial de Citas</h3>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {citas.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No hay citas registradas todavía.</p>
        ) : (
          citas.map((cita) => {
            // Intentamos obtener el ID sea cual sea su nombre en la DB
            const idCita = cita.id || cita.id_citas;
            
            return (
              <div 
                key={idCita || Math.random()} 
                style={{ border: "1px solid #334155", padding: "1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b" }}
              >
                <div>
                  <strong style={{ fontSize: "1.1rem", color: "#38bdf8" }}>{cita.nombre_mascota}</strong> 
                  <span style={{ color: "#94a3b8", marginLeft: "10px" }}>({cita.tipos_servicios || 'Consulta'})</span>
                  <div style={{ marginTop: "5px", fontSize: "0.9rem" }}>
                    <span>📅 {cita.fecha.split('T')[0]}</span> | <span>⏰ {cita.hora}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>👤 Dueño: {cita.nombre_cliente}</div>
                </div>
                <button 
                  onClick={() => eliminarCita(idCita)}
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Eliminar
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}