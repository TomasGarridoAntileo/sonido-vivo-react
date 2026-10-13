import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

/** Encabezado de las páginas interiores con migas de pan. */
export default function EncabezadoPagina({ titulo, bajada, miga }) {
  return (
    <header className="encabezado-pagina">
      <Container>
        <Breadcrumb aria-label="Ruta de navegación">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
          <Breadcrumb.Item active>{miga ?? titulo}</Breadcrumb.Item>
        </Breadcrumb>
        <h1>{titulo}</h1>
        {bajada && <p className="lead mb-0">{bajada}</p>}
      </Container>
    </header>
  );
}
