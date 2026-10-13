/* Carrito de compras.
   PROPS (desde App): items del carrito y las funciones para cambiarlo.
   El botón "Comprar ahora" lleva al checkout (paso de pago). */

import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina";
import ItemCarrito from "../components/ItemCarrito";
import { calcularTotales } from "../utils/carrito";
import { ENVIO_GRATIS_DESDE } from "../utils/compra";
import { formatearPrecio } from "../utils/formato";

function Carrito({ items = [], onCambiarCantidad, onQuitar, onVaciar }) {
  const { unidades, subtotal } = calcularTotales(items);
  const faltaEnvioGratis = ENVIO_GRATIS_DESDE - subtotal;

  return (
    <>
      <EncabezadoPagina titulo="Tu carrito" miga="Carrito" bajada="Revisa tus productos y continúa al pago." />
      <section className="seccion">
        <Container>
          {items.length === 0 ? (
            <div className="vacio text-center py-5">
              <h2 className="h4">Tu carrito está vacío</h2>
              <p>Revisa el catálogo y agrega lo que quieras comprar.</p>
              <Button as={Link} to="/productos" variant="valvula">Ir al catálogo</Button>
            </div>
          ) : (
            <Row className="g-4">
              <Col lg={8}>
                <h2 className="h5">{unidades === 1 ? "1 producto" : `${unidades} productos`}</h2>
                <ul className="lista-carrito">
                  {items.map((item) => (
                    <ItemCarrito key={item.codigo} item={item} onCambiarCantidad={onCambiarCantidad} onQuitar={onQuitar} />
                  ))}
                </ul>
                <Button variant="outline-danger" size="sm" onClick={onVaciar}>Vaciar carrito</Button>
              </Col>
              <Col lg={4}>
                <Card className="resumen-pedido">
                  <Card.Body>
                    <Card.Title as="h2" className="h5">Resumen</Card.Title>
                    <dl className="d-flex justify-content-between mb-2">
                      <dt>Total productos</dt>
                      <dd className="mb-0 fs-4 fw-bold" data-testid="total-carrito">{formatearPrecio(subtotal)}</dd>
                    </dl>
                    <p className="small text-body-secondary">
                      {faltaEnvioGratis > 0
                        ? `Te faltan ${formatearPrecio(faltaEnvioGratis)} para despacho gratis.`
                        : "¡Tu compra tiene despacho gratis!"}
                    </p>
                    <Button as={Link} to="/checkout" variant="valvula" className="w-100">Comprar ahora</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}

export default Carrito;
