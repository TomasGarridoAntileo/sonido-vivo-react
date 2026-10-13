/* Tarjeta de un producto.
   Props:
     producto   objeto del catálogo (obligatorio)
     enCarrito  cuántas unidades ya están en el carrito (para no superar el stock)
     onAgregar  función que recibe el producto al presionar "Agregar"
   El componente NO sabe qué hace "agregar": solo avisa al padre.
   Así se puede reutilizar (portada, catálogo, categorías, ofertas)
   y probar con un espía de Jasmine. */

import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { textoStock } from "../utils/catalogo";
import PrecioProducto from "./PrecioProducto";

function TarjetaProducto({ producto, enCarrito = 0, onAgregar }) {
  const agotado = producto.stock === 0;
  const alLimite = enCarrito >= producto.stock;
  const stockBajo = producto.stock <= 2;

  return (
    <Card as="article" className="producto h-100">
      <Link to={`/productos/${producto.codigo}`} className="producto__imagen" aria-hidden="true" tabIndex={-1}>
        <img src={`/img/categorias/${producto.slug}.svg`} alt="" width="72" height="72" />
      </Link>
      <Card.Body className="d-flex flex-column">
        <p className="producto__codigo">Código {producto.codigo} · {producto.categoria}</p>
        <Card.Title as="h3">
          <Link to={`/productos/${producto.codigo}`} className="producto__enlace">{producto.nombre}</Link>
        </Card.Title>
        <p className="producto__marca">{producto.marca} {producto.modelo}</p>
        <Card.Text className="producto__descripcion">{producto.descripcion}</Card.Text>
        <div className="producto__pie mt-auto">
          <PrecioProducto producto={producto} />
          <Badge bg={agotado ? "secondary" : stockBajo ? "danger" : "success"} className="stock">
            {textoStock(producto.stock)}
          </Badge>
        </div>
        {onAgregar && (
          <Button
            variant="valvula"
            className="mt-3"
            disabled={agotado || alLimite}
            onClick={() => onAgregar(producto)}
          >
            {agotado ? "Sin stock" : alLimite ? "Máximo en carrito" : "Agregar al carrito"}
          </Button>
        )}
        {enCarrito > 0 && <p className="producto__en-carrito">{enCarrito} en tu carrito</p>}
      </Card.Body>
    </Card>
  );
}

export default TarjetaProducto;
