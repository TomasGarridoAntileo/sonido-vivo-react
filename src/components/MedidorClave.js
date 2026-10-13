/* Medidor de seguridad de la contraseña.
   Recibe la clave por props y calcula en cada render cuántos
   requisitos cumple. No necesita estado propio: es un valor DERIVADO. */

import React from "react";
import { ProgressBar } from "react-bootstrap";
import { REGLAS_CLAVE, contarReglasCumplidas } from "../utils/validaciones";

const REQUISITOS = [
  { regla: "largo", texto: "Entre 8 y 20 caracteres" },
  { regla: "mayuscula", texto: "Una letra mayúscula" },
  { regla: "minuscula", texto: "Una letra minúscula" },
  { regla: "numero", texto: "Un número" },
  { regla: "especial", texto: "Un símbolo (por ejemplo ! # $ % &)" },
];

export function nivelSeguridad(cumplidas) {
  if (cumplidas <= 1) return { variante: "danger", texto: "Débil" };
  if (cumplidas <= 3) return { variante: "warning", texto: "Media" };
  return { variante: "success", texto: "Segura" };
}

export default function MedidorClave({ clave }) {
  const cumplidas = contarReglasCumplidas(clave);
  const nivel = nivelSeguridad(cumplidas);

  return (
    <div className="medidor-clave" id="clave-requisitos">
      <ProgressBar
        now={(cumplidas / 5) * 100}
        variant={nivel.variante}
        label={clave ? nivel.texto : ""}
        aria-label={`Seguridad de la contraseña: ${cumplidas} de 5 requisitos`}
      />
      <ul className="requisitos">
        {REQUISITOS.map((r) => {
          const cumple = REGLAS_CLAVE[r.regla](clave);
          return (
            <li key={r.regla} className={cumple ? "cumple" : ""} data-regla={r.regla}>
              {r.texto}
              <span className="visually-hidden">{cumple ? " (cumple)" : " (pendiente)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
