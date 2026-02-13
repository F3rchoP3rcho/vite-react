import React, { useState, FormEvent } from "react";

const FormularioUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [terminos, setTerminos] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!terminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    console.log("Usuario:", usuario);
    console.log("Contraseña:", password);
    alert("Inicio de sesión enviado");
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
      </form>
    </div>
  );
};

export default FormularioUsuario;