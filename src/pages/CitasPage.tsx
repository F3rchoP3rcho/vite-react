import { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

export default function CitasPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<any[]>([]); // Usamos any temporalmente para investigar el objeto
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      const data = await res.json();
      console.log("Datos que llegan de la DB:", data); // ESTO NOS DIRÁ EL NOMBRE DEL ID
      setCitas(data);
    } catch (err) {
      console.error("Error cargando citas:", err);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/infoservicios`).then(res => res.json()).then(setServicios);
    cargarCitas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (servicioId === null) return alert("Selecciona servicio");

    try {
      const res = await fetch(`${API_URL}/citas`, {
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

      if (res.ok) {
        alert("Cita agendada 🐾");
        setServicioId(null); setFecha(""); setHora(""); setNombreCliente(""); setNombreMascota("");
        cargarCitas();
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const eliminarCita = async (citaObjeto: any) => {
    // Intentamos encontrar el ID buscando nombres comunes
    const id = citaObjeto.id || citaObjeto.id_citas || citaObjeto.id_cita;

    if (!id) {
      console.log("Objeto de la cita sin ID:", citaObjeto);
      alert("Error: No se detecta un ID en el objeto. Revisa la consola.");
      return;
    }

    if (!confirm("¿Eliminar cita?")) return;

    try {
      const res = await fetch(`${API_URL}/citas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCitas(citas.filter(c => (c.id || c.id_citas || c.id_cita) !== id));
      } else {
        alert("Error en el servidor al borrar");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Agendar Cita</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginBottom: "3rem", display: "grid", gap: "10px" }}>
        <label>Servicio</label>
        <select value={servicioId ?? ""} onChange={(e) => setServicioId(Number(e.target.value))} required>
          <option value="">Selecciona</option>
          {servicios.map(s => <option key={s.id_servicios} value={s.id_servicios}>{s.tipos_servicios}</option>)}
        </select>

        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

        <label>Hora</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />

        <label>Dueño</label>
        <input type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />

        <label>Mascota</label>
        <input type="text" value={nombreMascota} onChange={(e) => setNombreMascota(e.target.value)} required />

        <button type="submit" style={{ background: "#3b82f6", color: "white", padding: "10px", cursor: "pointer", border: "none" }}>Agendar</button>
      </form>

      <hr />

      <h3>Historial</h3>
      <div style={{ display: "grid", gap: "10px", marginTop: "1rem" }}>
        {citas.map((cita, index) => (
          <div key={index} style={{ border: "1px solid #334155", padding: "1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", backgroundColor: "#1e293b" }}>
            <div>
              <strong>{cita.nombre_mascota}</strong> - {cita.tipos_servicios}<br />
              <small>📅 {cita.fecha?.split('T')[0]} | 👤 {cita.nombre_cliente}</small>
            </div>
            <button 
              onClick={() => eliminarCita(cita)} // Pasamos TODO el objeto
              style={{ background: "#ef4444", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}