import { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

export default function CitasPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

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
      .then(setServicios)
      .catch((err) => console.error("Error servicios:", err));
    cargarCitas();
  }, []);

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
        alert("¡Cita agendada correctamente! 🐾");
        setServicioId(null); setFecha(""); setHora(""); setNombreCliente(""); setNombreMascota("");
        cargarCitas();
      }
    } catch (error) {
      alert("Error de conexión al agendar");
    }
  };

  const eliminarCita = async (citaObjeto: any) => {
    const id = citaObjeto.id || citaObjeto.id_citas || citaObjeto.id_cita;
    if (!id) return alert("No se encontró el ID");
    if (!confirm(`¿Eliminar cita de ${citaObjeto.nombre_mascota}?`)) return;

    try {
      const response = await fetch(`${API_URL}/citas/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCitas(citas.filter((c) => (c.id || c.id_citas || c.id_cita) !== id));
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "2px solid #3b82f6", paddingBottom: "10px" }}>Agendar Cita</h2>
      
      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px 0 40px 0", display: "grid", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Servicio</label>
          <select style={{ width: "100%", padding: "10px", borderRadius: "4px", color: "black" }} value={servicioId ?? ""} onChange={(e) => setServicioId(Number(e.target.value))} required>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => <option key={s.id_servicios} value={s.id_servicios}>{s.tipos_servicios}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Fecha</label>
            <input style={{ width: "100%", padding: "10px", borderRadius: "4px", color: "black" }} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Hora</label>
            <input style={{ width: "100%", padding: "10px", borderRadius: "4px", color: "black" }} type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
          </div>
        </div>

        <input style={{ padding: "10px", borderRadius: "4px", color: "black" }} type="text" placeholder="Nombre dueño" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />
        <input style={{ padding: "10px", borderRadius: "4px", color: "black" }} type="text" placeholder="Nombre mascota" value={nombreMascota} onChange={(e) => setNombreMascota(e.target.value)} required />

        <button type="submit" style={{ padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Agendar Cita 🐾
        </button>
      </form>

      <hr style={{ borderColor: "#334155", marginBottom: "30px" }} />

      {/* HISTORIAL CORREGIDO */}
      <h3>Historial de Citas</h3>
      <div style={{ display: "grid", gap: "15px", marginTop: "1rem" }}>
        {citas.map((cita, index) => (
          <div key={index} style={{ border: "1px solid #334155", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b" }}>
            <div>
              <strong style={{ fontSize: "1.2rem", color: "#38bdf8" }}>{cita.nombre_mascota}</strong>
              <span style={{ color: "#94a3b8", marginLeft: "10px" }}>({cita.tipos_servicios})</span>
              
              {/* LA HORA VA AQUÍ - COLOR AMARILLO PARA QUE SE VEA */}
              <div style={{ marginTop: "8px", display: "flex", gap: "20px", fontSize: "1rem" }}>
                <span>📅 {cita.fecha?.split('T')[0]}</span>
                <span style={{ color: "#fbbf24", fontWeight: "bold", background: "#2d3748", padding: "2px 8px", borderRadius: "4px" }}>
                   ⏰ {cita.hora || "Sin hora"} 
                </span>
              </div>
              
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "8px" }}>
                👤 Dueño: {cita.nombre_cliente}
              </div>
            </div>

            <button onClick={() => eliminarCita(cita)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer" }}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}