/* Una fila del carrito. Recibe el item y dos funciones del padre. */

import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { formatearPrecio } from "../utils/formato";

export default function ItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  return (
    <li className="item-carrito">
      <img src={`/img/categorias/${item.slug}.svg`} alt="" width="48" height="48" />
      <div className="item-carrito__datos">
        <h3 className="h6 mb-1">{item.nombre}</h3>
        <p className="mb-1 text-body-secondary small">{item.marca} {item.modelo} · Código {item.codigo}</p>
        <p className="mb-0 small">{formatearPrecio(item.precio)} c/u</p>
      </div>
      <div className="item-carrito__acciones">
        <ButtonGroup size="sm" aria-label={`Cantidad de ${item.nombre}`}>
          <Button variant="outline-secondary" onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)} aria-label="Quitar una unidad">−</Button>
          <span className="cantidad" aria-live="polite" data-testid={`cantidad-${item.codigo}`}>{item.cantidad}</span>
          <Button
            variant="outline-secondary"
            onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}
            aria-label="Agregar una unidad"
          >+</Button>
        </ButtonGroup>
        <strong className="item-carrito__total">{formatearPrecio(item.precio * item.cantidad)}</strong>
        <Button variant="link" size="sm" className="text-danger p-0" onClick={() => onQuitar(item.codigo)}>
          Eliminar
        </Button>
      </div>
    </li>
  );
}
