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
      .then(setServicios)
      .catch((err) => console.error("Error servicios:", err));

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
        alert("¡Cita agendada correctamente! 🐾");
        setServicioId(null); setFecha(""); setHora(""); setNombreCliente(""); setNombreMascota("");
        cargarCitas();
      }
    } catch (error) {
      alert("Error de conexión al agendar");
    }
  };

  // ==========================================
  // Eliminar Cita
  // ==========================================
  const eliminarCita = async (citaObjeto: any) => {
    const id = citaObjeto.id || citaObjeto.id_citas || citaObjeto.id_cita;

    if (!id) {
      alert("No se pudo encontrar el ID de esta cita.");
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la cita de ${citaObjeto.nombre_mascota}?`)) return;

    try {
      const response = await fetch(`${API_URL}/citas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCitas(citas.filter((c) => (c.id || c.id_citas || c.id_cita) !== id));
      } else {
        alert("El servidor no pudo eliminar la cita.");
      }
    } catch (error) {
      alert("Error de conexión al eliminar.");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "2px solid #3b82f6", paddingBottom: "10px", display: "inline-block" }}>Agendar Cita</h2>
      
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

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Nombre del dueño</label>
          <input style={{ width: "100%", padding: "10px", borderRadius: "4px", color: "black" }} type="text" placeholder="Tu nombre" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Nombre de la mascota</label>
          <input style={{ width: "100%", padding: "10px", borderRadius: "4px", color: "black" }} type="text" placeholder="Nombre de la mascota" value={nombreMascota} onChange={(e) => setNombreMascota(e.target.value)} required />
        </div>

        <button type="submit" style={{ padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
          Agendar Cita 🐾
        </button>
      </form>

      <hr style={{ borderColor: "#334155", marginBottom: "30px" }} />

      {/* HISTORIAL / AGENDA */}
      <h3 style={{ marginBottom: "20px" }}>Historial de Citas</h3>
      <div style={{ display: "grid", gap: "15px" }}>
        {citas.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No hay citas agendadas.</p>
        ) : (
          citas.map((cita, index) => {
            const idParaBorrar = cita.id || cita.id_citas || cita.id_cita;
            return (
              <div 
                key={index} 
                style={{ border: "1px solid #334155", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b" }}
              >
                <div>
                  <strong style={{ fontSize: "1.2rem", color: "#38bdf8" }}>{cita.nombre_mascota}</strong>
                  <span style={{ color: "#94a3b8", marginLeft: "10px" }}>({cita.tipos_servicios || 'General'})</span>
                  
                  {/* AQUÍ ESTÁ EL CAMBIO: FECHA Y HORA JUNTAS */}
                  <div style={{ marginTop: "8px", display: "flex", gap: "20px", fontSize: "1rem" }}>
                    <span>📅 {cita.fecha?.split('T')[0]}</span>
                    <span style={{ color: "#fbbf24", fontWeight: "bold" }}>⏰ {cita.hora}</span>
                  </div>
                  
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "8px" }}>
                    👤 Dueño: <span style={{ color: "#e2e8f0" }}>{cita.nombre_cliente}</span>
                  </div>
                </div>

                <button 
                  onClick={() => eliminarCita(cita)}
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
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