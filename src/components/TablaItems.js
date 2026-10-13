/* Tabla de ítems de una compra (checkout, boleta, admin).
   PROPS: items [{ codigo, nombre, precio, cantidad }]. Solo muestra. */

import React from "react";
import { Table } from "react-bootstrap";
import { formatearPrecio } from "../utils/formato";

function TablaItems({ items }) {
  return (
    <Table responsive size="sm" className="tabla-items align-middle">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col" className="text-end">Precio</th>
          <th scope="col" className="text-center">Cantidad</th>
          <th scope="col" className="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.codigo}>
            <td>{i.nombre} <small className="text-body-secondary">({i.codigo})</small></td>
            <td className="text-end">{formatearPrecio(i.precio)}</td>
            <td className="text-center">{i.cantidad}</td>
            <td className="text-end">{formatearPrecio(i.precio * i.cantidad)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaItems;
