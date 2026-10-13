/* Categorías: /categorias y /categorias/:slug
   Arriba, las tarjetas de todas las categorías; abajo, los productos de la elegida.
   useParams lee el slug desde la URL. */

import React from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina";
import GrillaProductos from "../components/GrillaProductos";
import { listar, productosPorCategoria } from "../data/baseDatos";

function Categorias({ carrito = [], onAgregar }) {
  const { slug } = useParams();
  const categorias = listar("categorias");
  const elegida = slug ? categorias.find((c) => c.slug === slug) : null;
  const productos = elegida ? productosPorCategoria(elegida.slug) : [];

  return (
    <>
      <EncabezadoPagina
        titulo={elegida ? elegida.nombre : "Categorías"}
        miga={elegida ? elegida.nombre : "Categorías"}
        bajada={elegida ? elegida.subcategorias : "Elige una categoría para ver sus productos."}
      />
      <section className="seccion">
        <Container>
          <Row as="ul" xs={2} sm={3} md={4} lg={5} className="g-3 list-unstyled mb-5" aria-label="Categorías">
            {categorias.map((c) => (
              <Col as="li" key={c.slug}>
                <Card as={Link} to={`/categorias/${c.slug}`} className={`tarjeta-categoria h-100 ${elegida && elegida.slug === c.slug ? "activa" : ""}`}
                  aria-current={elegida && elegida.slug === c.slug ? "page" : undefined}>
                  <Card.Body className="text-center">
                    <img src={`/img/categorias/${c.slug}.svg`} alt="" width="48" height="48" />
                    <Card.Title as="h2" className="h6 mt-2 mb-0">{c.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {slug && !elegida && <Alert variant="warning">No existe la categoría "{slug}".</Alert>}
          {elegida && (
            <>
              <h2>{elegida.nombre} <small className="text-body-secondary fs-6">({productos.length} productos)</small></h2>
              {productos.length === 0 ? (
                <p>Aún no hay productos en esta categoría.</p>
              ) : (
                <GrillaProductos productos={productos} carrito={carrito} onAgregar={onAgregar} />
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default Categorias;
