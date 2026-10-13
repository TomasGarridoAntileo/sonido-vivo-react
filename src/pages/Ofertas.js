/* Ofertas: todos los productos con precio rebajado (precioOferta). */

import React from "react";
import { Container } from "react-bootstrap";
import EncabezadoPagina from "../components/EncabezadoPagina";
import GrillaProductos from "../components/GrillaProductos";
import { productosEnOferta } from "../data/baseDatos";

function Ofertas({ carrito = [], onAgregar }) {
  const ofertas = productosEnOferta();

  return (
    <>
      <EncabezadoPagina titulo="Ofertas" bajada="Precios rebajados mientras dure el stock." />
      <section className="seccion">
        <Container>
          <p data-testid="resumen-ofertas">{ofertas.length === 1 ? "1 producto en oferta." : `${ofertas.length} productos en oferta.`}</p>
          {ofertas.length === 0 ? (
            <p>Por ahora no hay ofertas. ¡Vuelve pronto!</p>
          ) : (
            <GrillaProductos productos={ofertas} carrito={carrito} onAgregar={onAgregar} />
          )}
        </Container>
      </section>
    </>
  );
}

export default Ofertas;
