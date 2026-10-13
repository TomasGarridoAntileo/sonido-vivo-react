import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <section className="seccion">
      <Container>
        <h1>Página no encontrada</h1>
        <p>La dirección que escribiste no existe en Sonido Vivo.</p>
        <Button as={Link} to="/" variant="valvula">Volver al inicio</Button>
      </Container>
    </section>
  );
}
