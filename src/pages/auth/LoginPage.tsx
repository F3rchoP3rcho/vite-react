import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const FormularioUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [terminos, setTerminos] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!terminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const URL_BACKEND = `${import.meta.env.VITE_API_URL}/v1/login`;

      const response = await fetch(URL_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("usuario", usuario);
        alert("¡Bienvenido!");
        navigate("/");
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor. Revisa la consola.");
    }
  };

  return (
    <div className="loginScreen" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
      <form className="loginBox" onSubmit={handleSubmit}>
        <h1 className="loginTitle">Iniciar sesión</h1>
        <p className="loginSub">
          Accede como administrador o entra como invitado para ver servicios.
        </p>

        <label className="loginLabel" htmlFor="usuario">
          Usuario o correo
        </label>
        <input
          className="loginInput"
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label className="loginLabel" htmlFor="password">
          Contraseña
        </label>
        <input
          className="loginInput"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="loginRow">
          <input
            type="checkbox"
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            id="terminos"
          />
          <label htmlFor="terminos">Acepto los términos y condiciones</label>
        </div>

        <div className="loginActions">
          <button className="loginBtn loginBtnPrimary" type="submit">
            Iniciar
          </button>

          <button
            className="loginBtn loginBtnGhost"
            type="button"
            onClick={() => {
              localStorage.setItem("guest", "1");
              navigate("/guest");
            }}
          >
            Iniciar como invitado
          </button>
        </div>

        <div className="loginFooter">
          Veterinaria • Proyecto final
        </div>
      </form>
    </div>
  );
};

export default FormularioUsuario;