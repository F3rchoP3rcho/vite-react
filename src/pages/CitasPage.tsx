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
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);

  // ==========================================
  // Cargar servicios desde backend
  // ==========================================
  useEffect(() => {
    fetch(`${API_URL}/infoservicios`)
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error(err));
  }, []);

  // ==========================================
  // Generar horarios según servicio
  // ==========================================
  const generarHoras = (inicio: number, fin: number) => {

    const horas: string[] = [];

    for (let h = inicio; h < fin; h++) {
      horas.push(`${String(h).padStart(2, "0")}:00`);
      horas.push(`${String(h).padStart(2, "0")}:30`);
    }

    return horas;
  };

  console.log("Servicio:", servicioSeleccionado);
  console.log("Horas generadas:", generarHoras(inicio, fin));

  // ==========================================
  // Detectar servicio seleccionado
  // ==========================================
  useEffect(() => {

  if (servicioId === null) {
    setHorasDisponibles([]);
    return;
  }

  const servicioSeleccionado = servicios.find(
    s => s.id_servicios === servicioId
  );

  if (!servicioSeleccionado) {
    setHorasDisponibles([]);
    return;
  }

  const nombre = servicioSeleccionado.tipos_servicios.toLowerCase();

  let inicio = 10;
  let fin = 20;

  if (nombre.includes("vacun") || nombre.includes("despar")) {
    fin = 19;
  }

  if (nombre.includes("groom")) {
    inicio = 9;
  }

  setHorasDisponibles(generarHoras(inicio, fin));
  setHora("");

}, [servicioId, servicios]);

  // ==========================================
  // Enviar formulario
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!servicioId) {
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
        setFecha("");
        setHora("");
        setNombreCliente("");
        setNombreMascota("");
      } else {
        alert(data.message);
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
          onChange={(e) => setServicioId(Number(e.target.value))}
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
        <select
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        >
          <option value="">Selecciona</option>
          {horasDisponibles.map(h => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

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