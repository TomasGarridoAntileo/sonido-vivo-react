/* Resumen de errores al intentar enviar un formulario.
   PROPS: "errores" es la lista que arma useFormulario.
   Cada error es un enlace que lleva el foco al campo con problemas. */

import React from "react";
import { Alert } from "react-bootstrap";

function ResumenErrores({ errores }) {
  if (errores.length === 0) return null;

  const irAlCampo = (evento, campo) => {
    evento.preventDefault();
    const elemento = document.getElementById(campo);
    if (elemento) elemento.focus();
  };

  return (
    <Alert variant="danger" className="resumen-errores" role="alert">
      <Alert.Heading as="h2" className="h5">
        Revisa {errores.length === 1 ? "1 campo" : `${errores.length} campos`} antes de continuar
      </Alert.Heading>
      <ul className="mb-0">
        {errores.map((e) => (
          <li key={e.campo}>
            <a href={`#${e.campo}`} onClick={(ev) => irAlCampo(ev, e.campo)}>{e.etiqueta}</a>: {e.mensaje}
          </li>
        ))}
      </ul>
    </Alert>
  );
}

export default ResumenErrores;
