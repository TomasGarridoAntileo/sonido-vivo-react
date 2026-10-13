/* Detalle completo de una orden (boleta): cliente, entrega, ítems y totales.
   Lo usan Pago correcto, Pago con error y el panel (Mostrar boleta).
   PROPS: orden. */

import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { OPCIONES_ENTREGA } from "../utils/compra";
import { formatearPrecio } from "../utils/formato";
import TablaItems from "./TablaItems";

function DetalleOrden({ orden }) {
  const entrega = OPCIONES_ENTREGA.find((o) => o.valor === orden.entrega.tipo);
  const subtotal = orden.total - orden.costoEnvio;

  return (
    <div className="detalle-orden">
      <Row className="g-3 mb-3">
        <Col md={6}>
          <h3 className="h6 text-uppercase text-body-secondary">Cliente</h3>
          <p className="mb-0">{orden.cliente.nombre} {orden.cliente.apellidos}</p>
          <p className="mb-0">{orden.cliente.correo}</p>
        </Col>
        <Col md={6}>
          <h3 className="h6 text-uppercase text-body-secondary">Entrega</h3>
          <p className="mb-0">{entrega ? entrega.texto : orden.entrega.tipo}</p>
          {orden.entrega.tipo === "despacho" ? (
            <p className="mb-0">
              {orden.entrega.calle}{orden.entrega.departamento && `, depto. ${orden.entrega.departamento}`}, {orden.entrega.comuna}, {orden.entrega.region}
            </p>
          ) : (
            <p className="mb-0">Tienda más cercana a {orden.entrega.comuna}</p>
          )}
          {orden.entrega.indicaciones && <p className="mb-0 fst-italic">"{orden.entrega.indicaciones}"</p>}
        </Col>
      </Row>
      <TablaItems items={orden.items} />
      <Card body className="totales-orden">
        <dl className="mb-0">
          <div className="d-flex justify-content-between"><dt>Subtotal</dt><dd className="mb-0">{formatearPrecio(subtotal)}</dd></div>
          <div className="d-flex justify-content-between"><dt>Envío</dt><dd className="mb-0">{orden.costoEnvio ? formatearPrecio(orden.costoEnvio) : "Gratis"}</dd></div>
          <div className="d-flex justify-content-between fs-5"><dt>Total</dt><dd className="mb-0 fw-bold" data-testid="total-orden">{formatearPrecio(orden.total)}</dd></div>
        </dl>
      </Card>
    </div>
  );
}

export default DetalleOrden;
