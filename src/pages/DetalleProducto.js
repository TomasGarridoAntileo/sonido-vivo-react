/* Detalle de un producto: /productos/:codigo
   useParams (React Router, guía 2.2.1) toma el código desde la URL.
   PROPS: carrito y onAgregar (desde App). */

import React from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina";
import GrillaProductos from "../components/GrillaProductos";
import PrecioProducto from "../components/PrecioProducto";
import { obtener, productosPorCategoria } from "../data/baseDatos";
import { cantidadEnCarrito } from "../utils/carrito";
import { textoStock } from "../utils/catalogo";

function DetalleProducto({ carrito = [], onAgregar }) {
  const { codigo } = useParams();
  const producto = obtener("productos", (codigo || "").toUpperCase());

  if (!producto) {
    return (
      <>
        <EncabezadoPagina titulo="Producto no encontrado" miga="Productos" />
        <Container className="seccion">
          <p>No existe un producto con el código {codigo}.</p>
          <Button as={Link} to="/productos" variant="valvula">Volver al catálogo</Button>
        </Container>
      </>
    );
  }

  const enCarrito = cantidadEnCarrito(carrito, producto.codigo);
  const agotado = producto.stock === 0;
  const alLimite = enCarrito >= producto.stock;
  const relacionados = productosPorCategoria(producto.slug).filter((p) => p.codigo !== producto.codigo).slice(0, 4);

  return (
    <>
      <EncabezadoPagina titulo={producto.nombre} miga={producto.categoria} bajada={`${producto.marca} ${producto.modelo} · Código ${producto.codigo}`} />
      <section className="seccion">
        <Container>
          <Row className="g-4 align-items-center">
            <Col md={5}>
              <div className="detalle-imagen">
                <img src={`/img/categorias/${producto.slug}.svg`} alt={`Ícono de ${producto.categoria}`} width="160" height="160" />
              </div>
            </Col>
            <Col md={7}>
              <p className="mb-1"><Link to={`/categorias/${producto.slug}`}>{producto.categoria}</Link></p>
              <h2 className="h3">{producto.marca} {producto.modelo}</h2>
              <p className="lead">{producto.descripcion}</p>
              <PrecioProducto producto={producto} grande />
              <p className="mt-2">
                <Badge bg={agotado ? "secondary" : producto.stock <= 2 ? "danger" : "success"}>{textoStock(producto.stock)}</Badge>
                {enCarrito > 0 && <span className="ms-2 text-success">{enCarrito} en tu carrito</span>}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="valvula" size="lg" disabled={agotado || alLimite} onClick={() => onAgregar && onAgregar(producto)}>
                  {agotado ? "Sin stock" : alLimite ? "Máximo en carrito" : "Agregar al carrito"}
                </Button>
                <Button as={Link} to={`/contacto?codigo=${producto.codigo}`} variant="outline-secondary" size="lg">Consultar</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {relacionados.length > 0 && (
        <section className="seccion seccion--blanca" aria-labelledby="titulo-relacionados">
          <Container>
            <h2 id="titulo-relacionados">También en {producto.categoria}</h2>
            <GrillaProductos productos={relacionados} carrito={carrito} onAgregar={onAgregar} />
          </Container>
        </section>
      )}
    </>
  );
}

export default DetalleProducto;
