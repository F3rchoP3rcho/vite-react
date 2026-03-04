import React, { useEffect, useState } from "react";
import "./Guest.css";

interface Servicio {
  id_servicios: number;
  tipos_servicios: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// ✅ MISMA FUNCIÓN que ya tenían
const horaAMinutos = (horaStr: string) => {
  if (!horaStr) return 0;
  const [horas, minutos] = horaStr.split(":").map(Number);
  return horas * 60 + minutos;
};

export default function GuestCitasPage() {
  // ✅ MISMOS STATES que ya tenían
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombreMascota, setNombreMascota] = useState("");

  // ✅ MISMO FETCH a servicios
  useEffect(() => {
    fetch(`${API_URL}/infoservicios`)
      .then((res) => res.json())
      .then(setServicios)
      .catch((err) => console.error("Error servicios:", err));
  }, []);

  // ✅ MISMO SUBMIT: valida 1 hora y hace POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (servicioId === null) return alert("Selecciona un servicio");

    try {
      const resCitas = await fetch(`${API_URL}/citas`);
      const citasExistentes = await resCitas.json();

      const nuevaHoraEnMinutos = horaAMinutos(hora);

      const horarioOcupado = citasExistentes.some((cita: any) => {
        if (cita.fecha !== fecha) return false;

        const citaExistenteEnMinutos = horaAMinutos(cita.hora);
        const diferencia = Math.abs(citaExistenteEnMinutos - nuevaHoraEnMinutos);

        return diferencia < 60;
      });

      if (horarioOcupado) {
        alert("⚠️ Horario no disponible. Por favor, deja un espacio de al menos 1 hora entre citas.");
        return;
      }

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
    <div className="guestPage">
      {/* HERO */}
      <section className="guestHero">
        <h1 className="guestHeroTitle">Agendar cita 📅</h1>
        <p className="guestHeroText">
          Elige un servicio y un horario. Por política, debe haber al menos 1 hora entre citas del mismo día.
        </p>
      </section>

      {/* FORM (mismos inputs, nuevo diseño) */}
      <section className="guestCard" style={{ marginTop: 18 }}>
        <form onSubmit={handleSubmit} className="guestForm">
          <div className="guestField">
            <label className="guestLabel">Servicio</label>
            <select
              className="guestSelect"
              value={servicioId ?? ""}
              onChange={(e) => setServicioId(Number(e.target.value))}
              required
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id_servicios} value={s.id_servicios}>
                  {s.tipos_servicios}
                </option>
              ))}
            </select>
          </div>

          <div className="guestRow2">
            <div className="guestField">
              <label className="guestLabel">Fecha</label>
              <input
                className="guestInput"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div className="guestField">
              <label className="guestLabel">Hora</label>
              <input
                className="guestInput"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="guestField">
            <label className="guestLabel">Nombre del dueño</label>
            <input
              className="guestInput"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              required
            />
          </div>

          <div className="guestField">
            <label className="guestLabel">Nombre de la mascota</label>
            <input
              className="guestInput"
              type="text"
              placeholder="Ej: Firulais"
              value={nombreMascota}
              onChange={(e) => setNombreMascota(e.target.value)}
              required
            />
          </div>

          <div className="guestActions">
            <button type="submit" className="guestBtn guestBtnPrimary">
              Agendar Cita 🐾
            </button>
          </div>
        </form>

        <hr className="guestDivider" />
      </section>
    </div>
  );
}