import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";


const FormularioUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [terminos, setTerminos] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📍 PASO 1: Se presionó el botón de Iniciar");

    if (!terminos) {
      console.log("🛑 PASO 1.5: Falta aceptar los términos");
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    console.log("📍 PASO 2: Términos aceptados. Preparando envío...");

    try {
      // ⚠️ IMPORTANTE: Si ya subiste tu backend a Vercel, cambia esta URL por la tuya.
      // Ejemplo: "https://veterinaria-o702atrpp-sergio-avendanos-projects.vercel.app/api/login"
      const URL_BACKEND = "https://veterinaria-steel.vercel.app/api/v1/login"; 
      console.log("📍 PASO 3: Intentando conectar con:", URL_BACKEND);

      const response = await fetch(URL_BACKEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          usuario: usuario, 
          contrasena: password 
        }),
      });

      console.log("📍 PASO 4: El servidor respondió con status:", response.status);

      const data = await response.json();
      console.log("📍 PASO 5: Datos leídos del servidor:", data);

      if (response.ok) {
        console.log("✅ PASO 6: Login exitoso, guardando sesión...");
        localStorage.setItem("usuario", usuario);
        alert("¡Bienvenido!");
        navigate("/");
      } else {
        console.log("❌ PASO 6: El servidor rechazó las credenciales");
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("🚨 PASO DE ERROR: Falló la conexión o la lectura de datos", error);
      alert("No se pudo conectar con el servidor. Revisa la consola.");
    }
  };

  return (
    <div style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <label htmlFor="usuario">
          Iniciar con usuario o correo electrónico:
        </label>
        <br />
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <br />
        <br />

        <label htmlFor="password">Contraseña:</label>
        <br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            required
          />{" "}
          Acepto los términos y condiciones
        </label>
        <br />
        <br />

        <button type="submit">Iniciar</button>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("guest", "1"); // opcional
            navigate("/guest");
          }}
          style={{ marginTop: 10 }}
        >
          Iniciar como invitado
        </button>
      </form>
    </div>
  );
};

export default FormularioUsuario;