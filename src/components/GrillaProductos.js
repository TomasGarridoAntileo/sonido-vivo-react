/* Grilla responsiva de tarjetas de producto.
   PROPS: productos (lista), carrito (para saber cuántos hay de cada uno), onAgregar.
   Se reutiliza en Inicio, Productos, Categorías, Ofertas y Detalle (relacionados). */

import React from "react";
import { Col, Row } from "react-bootstrap";
import { cantidadEnCarrito } from "../utils/carrito";
import TarjetaProducto from "./TarjetaProducto";

function GrillaProductos({ productos, carrito = [], onAgregar, columnas = { xs: 1, sm: 2, md: 3, xl: 4 } }) {
  return (
    <Row {...columnas} className="g-4">
      {productos.map((p) => (
        <Col key={p.codigo}>
          <TarjetaProducto producto={p} enCarrito={cantidadEnCarrito(carrito, p.codigo)} onAgregar={onAgregar} />
        </Col>
      ))}
    </Row>
  );
}

export default GrillaProductos;
