/* Campo de formulario reutilizable con error y sugerencia.
   Props principales:
     id, etiqueta, valor, resultado ({ error, sugerencia, info })
     onCambiar(valor), onSalir(), onUsarSugerencia()
     tipo ("text", "email", "date", "password", "textarea", "select"), ayuda, opcional, children (opciones del select)
   Usa Form.Control de React Bootstrap: isInvalid / isValid pintan el
   borde rojo o verde y Form.Control.Feedback muestra el mensaje. */

import React from "react";
import { Button, Form } from "react-bootstrap";

export default function CampoFormulario({
  id, etiqueta, valor, resultado, onCambiar, onSalir, onUsarSugerencia,
  tipo = "text", ayuda, opcional = false, children, ...resto
}) {
  const validado = Boolean(resultado);
  const error = resultado?.error;
  const sugerencia = resultado?.sugerencia;
  const info = resultado?.info;
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`, (sugerencia || info) && `${id}-sugerencia`]
    .filter(Boolean).join(" ") || undefined;

  const propsComunes = {
    id,
    name: id,
    value: valor,
    onChange: (e) => onCambiar(e.target.value),
    onBlur: onSalir,
    isInvalid: validado && Boolean(error),
    isValid: validado && !error,
    "aria-describedby": describe,
    ...resto,
  };

  return (
    <Form.Group className="campo mb-3">
      <Form.Label htmlFor={id}>
        {etiqueta} {opcional && <span className="opcional">(opcional)</span>}
      </Form.Label>

      {tipo === "select" ? (
        <Form.Select {...propsComunes}>{children}</Form.Select>
      ) : tipo === "textarea" ? (
        <Form.Control as="textarea" rows={5} {...propsComunes} />
      ) : (
        <Form.Control type={tipo} {...propsComunes} />
      )}

      {ayuda && <Form.Text id={`${id}-ayuda`}>{ayuda}</Form.Text>}

      <Form.Control.Feedback type="invalid" id={`${id}-error`} role="alert">
        {error}
      </Form.Control.Feedback>

      {sugerencia && (
        <div className="sugerencia" id={`${id}-sugerencia`}>
          <span>{sugerencia.texto} </span>
          <Button size="sm" variant="outline-valvula" onClick={onUsarSugerencia}>Usar</Button>
        </div>
      )}
      {!sugerencia && info && (
        <div className="sugerencia sugerencia--info" id={`${id}-sugerencia`}>{info}</div>
      )}
    </Form.Group>
  );
}
