/* Iniciar sesión: /login
   Valida el formulario y busca el usuario en la base de datos simulada.
   PROPS: onIniciarSesion(usuario) — App guarda la sesión en su estado y en localStorage. */

import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import EncabezadoPagina from "../components/EncabezadoPagina";
import { validarCredenciales } from "../data/baseDatos";
import { useFormulario } from "../hooks/useFormulario";
import { validarCorreo } from "../utils/validaciones";

export const REGLAS_LOGIN = {
  correo: {
    etiqueta: "Correo",
    // Para iniciar sesión solo importa el formato: las sugerencias de dominio no aplican
    validar: (v) => {
      const r = validarCorreo(v);
      return r.error ? { error: r.error } : {};
    },
  },
  clave: { etiqueta: "Contraseña", validar: (v) => (v ? {} : { error: "Escribe tu contraseña." }) },
};

function IniciarSesion({ onIniciarSesion }) {
  const form = useFormulario(REGLAS_LOGIN, { correo: "", clave: "" });
  const [errorAcceso, setErrorAcceso] = useState("");
  const navigate = useNavigate();

  const campo = (id) => ({
    id,
    valor: form.valores[id],
    resultado: form.resultados[id],
    onCambiar: (v) => { form.cambiar(id, v); setErrorAcceso(""); },
    onSalir: () => form.tocar(id),
  });

  const alEnviar = (evento) => {
    evento.preventDefault();
    const { correo, clave } = form.valores;
    // 1) Validación de formato (no limpia el formulario)
    if (!form.validarTodo()) return;
    // 2) Comprobación contra la base de datos
    const usuario = validarCredenciales(correo, clave);
    if (!usuario) {
      setErrorAcceso("Correo o contraseña incorrectos. Revisa los datos o crea una cuenta.");
      return;
    }
    if (onIniciarSesion) onIniciarSesion(usuario);
    navigate(usuario.rol === "admin" ? "/admin" : "/");
  };

  return (
    <>
      <EncabezadoPagina titulo="Iniciar sesión" bajada="Con tu cuenta, tus datos se completan solos al comprar." />
      <section className="seccion">
        <Container className="contenedor-angosto">
          <Card body>
            {errorAcceso && <Alert variant="danger" role="alert">{errorAcceso}</Alert>}
            <Form noValidate onSubmit={alEnviar} aria-label="Iniciar sesión">
              <CampoFormulario {...campo("correo")} etiqueta="Correo electrónico" tipo="email" autoComplete="email" />
              <CampoFormulario {...campo("clave")} etiqueta="Contraseña" tipo="password" autoComplete="current-password" />
              <Button type="submit" variant="valvula" className="w-100">Ingresar</Button>
            </Form>
            <p className="mt-3 mb-0 text-center">¿No tienes cuenta? <Link to="/registro">Créala aquí</Link></p>
          </Card>
          <Alert variant="info" className="mt-3 small">
            <strong>Cuentas de demostración:</strong><br />
            Administrador: admin@sonidovivo.cl · Admin#2026<br />
            Cliente: camila@gmail.com · Cliente#2026
          </Alert>
        </Container>
      </section>
    </>
  );
}

export default IniciarSesion;
