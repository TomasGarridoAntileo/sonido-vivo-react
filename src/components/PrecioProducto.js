/* Muestra el precio de un producto. Si está en oferta, muestra el precio
   normal tachado, el precio de oferta y el porcentaje de descuento.
   PROPS: producto. Una sola responsabilidad: mostrar el precio. */

import React from "react";
import { Badge } from "react-bootstrap";
import { porcentajeDescuento, precioFinal } from "../data/baseDatos";
import { formatearPrecio } from "../utils/formato";

function PrecioProducto({ producto, grande = false }) {
  const descuento = porcentajeDescuento(producto);
  const final = precioFinal(producto);

  return (
    <div className={`precio ${grande ? "precio--grande" : ""}`}>
      {descuento > 0 && (
        <del className="precio__anterior" data-testid="precio-anterior">{formatearPrecio(producto.precio)}</del>
      )}
      <data className="producto__precio" value={final}>{formatearPrecio(final)}</data>
      {descuento > 0 && <Badge bg="danger" className="ms-2">-{descuento}%</Badge>}
    </div>
  );
}

export default PrecioProducto;
