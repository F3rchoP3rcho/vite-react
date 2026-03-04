import { useEffect, useState } from "react";
import "./HomePage.css";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = import.meta.env.VITE_API_URL;

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
    <div className="citas-page">
      <h2 className="citas-titulo">Agendar Cita</h2>
      
      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="citas-form">
        <div className="form-group">
          <label>Servicio</label>
          <select 
            className="form-control" 
            value={servicioId ?? ""} 
            onChange={(e) => setServicioId(Number(e.target.value))} 
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => (
              <option key={s.id_servicios} value={s.id_servicios}>{s.tipos_servicios}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha</label>
            <input 
              className="form-control" 
              type="date" 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Hora</label>
            <input 
              className="form-control" 
              type="time" 
              value={hora} 
              onChange={(e) => setHora(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nombre del dueño</label>
          <input 
            className="form-control" 
            type="text" 
            placeholder="Ej: Juan Pérez" 
            value={nombreCliente} 
            onChange={(e) => setNombreCliente(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Nombre de la mascota</label>
          <input 
            className="form-control" 
            type="text" 
            placeholder="Ej: Firulais" 
            value={nombreMascota} 
            onChange={(e) => setNombreMascota(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn-agendar">
          Agendar Cita 🐾
        </button>
      </form>

      <hr className="citas-divisor" />

      {/* HISTORIAL */}
      <h3 className="citas-titulo">Historial de Citas</h3>
      <div className="historial-grid">
        {citas.map((cita, index) => (
          <div key={index} className="historial-card">
            <div className="historial-info">
              <div className="historial-header">
                <strong className="mascota-nombre">{cita.nombre_mascota}</strong>
                <span className="servicio-tipo">({cita.tipos_servicios})</span>
              </div>
              
              <div className="fecha-hora-container">
                <span className="cita-fecha">📅 {cita.fecha?.split('T')[0]}</span>
                <span className="cita-hora">⏰ {cita.hora || "Sin hora"}</span>
              </div>
              
              <div className="cita-dueno">
                👤 Dueño: {cita.nombre_cliente}
              </div>
            </div>

            <button onClick={() => eliminarCita(cita)} className="btn-eliminar">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}