/* Resultado de la compra:
   /compra/exitosa/:numero  -> "Se ha realizado la compra" + boleta
   /compra/error/:numero    -> "No se pudo realizar el pago" + botón para reintentar
   useParams toma el número de orden; la orden se LEE de la base de datos simulada. */

import React from "react";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DetalleOrden from "../components/DetalleOrden";
import { obtener } from "../data/baseDatos";

function ResultadoCompra({ exito }) {
  const { numero } = useParams();
  const orden = obtener("ordenes", numero);

  if (!orden) {
    return (
      <Container className="seccion">
        <h1 className="h3">No encontramos la orden {numero}</h1>
        <Button as={Link} to="/" variant="valvula">Volver al inicio</Button>
      </Container>
    );
  }

  return (
    <section className="seccion">
      <Container className="contenedor-medio">
        <Card body className="boleta">
          <div className="d-flex flex-wrap justify-content-between gap-2">
            {exito ? (
              <h1 className="h3 text-success">✓ Se ha realizado la compra n.º {orden.numero}</h1>
            ) : (
              <h1 className="h3 text-danger">✕ No se pudo realizar el pago n.º {orden.numero}</h1>
            )}
            <small className="text-body-secondary">Fecha: {orden.fecha}</small>
          </div>

          {exito ? (
            <p>Gracias por tu compra. Te enviaremos el detalle a <strong>{orden.cliente.correo}</strong>.</p>
          ) : (
            <>
              <Alert variant="danger">{orden.motivo || "El pago fue rechazado."} Tu carrito sigue guardado.</Alert>
              <div className="text-center mb-3">
                <Button as={Link} to="/checkout" variant="success" size="lg">Volver a realizar el pago</Button>
              </div>
            </>
          )}

          <DetalleOrden orden={orden} />

          {exito && (
            <div className="d-flex justify-content-center gap-2 mt-3 no-imprimir">
              <Button variant="danger" onClick={() => window.print()}>Imprimir boleta</Button>
              <Button as={Link} to="/productos" variant="outline-secondary">Seguir comprando</Button>
            </div>
          )}
        </Card>
      </Container>
    </section>
  );
}

export default ResultadoCompra;
