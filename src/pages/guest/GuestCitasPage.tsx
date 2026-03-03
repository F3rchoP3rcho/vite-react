import React, { useEffect, useState } from "react";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = "https://veterinaria-steel.vercel.app/api";

// Función extra para convertir la hora de texto ("14:30") a minutos totales numéricos
const horaAMinutos = (horaStr: string) => {
  if (!horaStr) return 0;
  const [horas, minutos] = horaStr.split(":").map(Number);
  return horas * 60 + minutos;
};

export default function CitasPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/infoservicios`)
      .then((res) => res.json())
      .then(setServicios)
      .catch((err) => console.error("Error servicios:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (servicioId === null) return alert("Selecciona un servicio");

    try {
      // 1. Descargamos las citas actuales
      const resCitas = await fetch(`${API_URL}/citas`);
      const citasExistentes = await resCitas.json();

      // Convertimos la hora que el usuario quiere a minutos
      const nuevaHoraEnMinutos = horaAMinutos(hora);

      // 2. Buscamos si hay conflictos de horario (menos de 60 minutos de diferencia en el mismo día)
      const horarioOcupado = citasExistentes.some((cita: any) => {
        // Si no es el mismo día, no hay problema
        if (cita.fecha !== fecha) return false;

        // Si es el mismo día, calculamos la diferencia de tiempo
        const citaExistenteEnMinutos = horaAMinutos(cita.hora);
        const diferencia = Math.abs(citaExistenteEnMinutos - nuevaHoraEnMinutos);

        // Si la diferencia es menor a 60 minutos, hay conflicto (retorna true)
        return diferencia < 60;
      });

      // 3. Si está ocupado, bloqueamos el guardado
      if (horarioOcupado) {
        alert("⚠️ Horario no disponible. Por favor, deja un espacio de al menos 1 hora entre citas.");
        return; 
      }

      // 4. Si el horario está libre, guardamos
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
        setServicioId(null); 
        setFecha(""); 
        setHora(""); 
        setNombreCliente(""); 
        setNombreMascota("");
      }
    } catch (error) {
      alert("Error de conexión al agendar");
    }
  };

  return (
    <div className="citas-page">
      <h2 className="citas-titulo">Agendar Cita</h2>
      
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
    </div>
  );
}