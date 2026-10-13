import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ENLACES } from "./BarraNavegacion";

export default function PiePagina({ anio = new Date().getFullYear() }) {
  return (
    <footer className="pie">
      <Container>
        <Row className="g-4">
          <Col xs={12} md={5}>
            <h2>Sonido Vivo</h2>
            <p>Tienda de instrumentos musicales, amplificación y equipos de estudio. Más de 340 referencias en 10 categorías.</p>
            <address>
              Casa matriz: Av. Providencia 2150, Providencia, Santiago
              <br />
              <a href="tel:+56222334455">+56 2 2233 4455</a> · <a href="mailto:contacto@sonidovivo.cl">contacto@sonidovivo.cl</a>
            </address>
          </Col>
          <Col xs={6} md={4}>
            <nav aria-label="Enlaces del pie de página">
              <h2>Navegación</h2>
              <ul className="list-unstyled">
                {ENLACES.map((e) => (
                  <li key={e.ruta}><Link to={e.ruta}>{e.texto}</Link></li>
                ))}
              </ul>
            </nav>
          </Col>
          <Col xs={6} md={3}>
            <h2>Síguenos</h2>
            <ul className="list-unstyled">
              <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </Col>
        </Row>
        <p className="pie__legal">
          <small>© {anio} Sonido Vivo. Proyecto académico DSY1104 Desarrollo Fullstack II.</small>
        </p>
      </Container>
    </footer>
  );
}
