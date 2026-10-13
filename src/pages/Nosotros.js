import React from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import EncabezadoPagina from "../components/EncabezadoPagina";
import { listar } from "../data/baseDatos";
import { SUCURSALES } from "../data/regiones";

const HITOS = [
  { anio: 2012, texto: "Abre la primera tienda en Providencia." },
  { anio: 2016, texto: "Se suman las categorías de baterías y teclados." },
  { anio: 2020, texto: "Abre la sucursal de Viña del Mar y el área de estudio y grabación." },
  { anio: 2026, texto: "Lanzamiento del sitio web con catálogo y carrito en línea." },
];

export default function Nosotros() {
  const categorias = listar("categorias");
  const total = categorias.reduce((s, c) => s + (Number(c.referencias) || 0), 0);

  return (
    <>
      <EncabezadoPagina titulo="Quiénes somos" miga="Nosotros" bajada="Una tienda atendida por músicos, para músicos." />

      <section className="seccion" aria-labelledby="titulo-historia">
        <Container>
          <Row className="g-4">
            <Col as="article" xs={12} lg={7}>
              <h2 id="titulo-historia">Nuestra historia</h2>
              <p>Sonido Vivo nació como una pequeña tienda de cuerdas y accesorios en Providencia. Con los años sumamos guitarras, baterías, teclados y amplificación, y hoy el catálogo supera las 340 referencias.</p>
              <p>Probamos todo lo que vendemos. Si tienes dudas entre dos modelos, puedes tocarlos en la tienda antes de decidir.</p>
              <p>Esta etapa del proyecto lleva el sitio a React: catálogo con filtros, carrito de compras y registro de clientes.</p>
            </Col>
            <Col as="aside" xs={12} lg={5} aria-label="Hitos de la empresa">
              <h3>Hitos</h3>
              <ol className="linea-tiempo">
                {HITOS.map((h) => (
                  <li key={h.anio}><time dateTime={String(h.anio)}>{h.anio}</time> {h.texto}</li>
                ))}
              </ol>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="seccion seccion--blanca" aria-labelledby="titulo-video">
        <Container>
          <h2 id="titulo-video">Así suena la tienda</h2>
          <figure className="video-tienda">
            {/* ratio-16x9 de Bootstrap mantiene la proporción en cualquier ancho */}
            <div className="ratio ratio-16x9">
              <video controls preload="metadata" poster="/video/poster.jpg">
                <source src="/video/sonido-vivo.mp4" type="video/mp4" />
                Tu navegador no puede reproducir video. <a href="/video/sonido-vivo.mp4">Descarga el video</a>.
              </video>
            </div>
            <figcaption>Forma de onda de una prueba de sonido en la sala de amplificadores (10 segundos).</figcaption>
          </figure>
        </Container>
      </section>

      <section className="seccion" aria-labelledby="titulo-sucursales">
        <Container>
          <h2 id="titulo-sucursales">Sucursales</h2>
          <Row xs={1} md={3} className="g-3">
            {SUCURSALES.map((s) => (
              <Col key={s.id}>
                <Card as="article" className="sucursal h-100">
                  <Card.Body>
                    <Card.Title as="h3">{s.nombre}</Card.Title>
                    <address className="mb-1">{s.direccion}</address>
                    <Card.Text>{s.horario}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="seccion seccion--blanca" aria-labelledby="titulo-tabla">
        <Container>
          <h2 id="titulo-tabla">Lo que vendemos</h2>
          {/* responsive: la tabla se desplaza horizontalmente en pantallas chicas */}
          <Table responsive striped hover>
            <caption>Categorías y número aproximado de referencias</caption>
            <thead>
              <tr><th scope="col">Categoría</th><th scope="col">Subcategorías</th><th scope="col">Referencias</th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.slug}><th scope="row">{c.nombre}</th><td>{c.subcategorias}</td><td>{c.referencias}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={2}>Total</td><td>{total}</td></tr>
            </tfoot>
          </Table>
        </Container>
      </section>
    </>
  );
}
