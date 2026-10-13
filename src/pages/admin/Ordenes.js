/* Órdenes / boletas: listado (/admin/ordenes) y boleta (/admin/ordenes/:numero). */

import React, { useState } from "react";
import { Badge, Button, Card, Form, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DetalleOrden from "../../components/DetalleOrden";
import { listar, obtener } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";

export function EstadoOrden({ estado }) {
  return <Badge bg={estado === "pagada" ? "success" : "danger"}>{estado === "pagada" ? "Pagada" : "Rechazada"}</Badge>;
}

export function ListaOrdenes() {
  const [filtro, setFiltro] = useState("");
  // Las más recientes primero
  const ordenes = listar("ordenes")
    .filter((o) => filtro === "" || o.estado === filtro)
    .sort((a, b) => b.numero.localeCompare(a.numero));

  return (
    <>
      <h1 className="h3">Órdenes</h1>
      <Form.Group className="mb-3" style={{ maxWidth: 260 }} controlId="filtro-estado">
        <Form.Label>Estado</Form.Label>
        <Form.Select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
        </Form.Select>
      </Form.Group>
      <Table responsive hover className="bg-white">
        <thead>
          <tr><th>N.º</th><th>Fecha</th><th>Cliente</th><th className="text-end">Total</th><th>Estado</th><th /></tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.numero}>
              <td>{o.numero}</td>
              <td>{o.fecha}</td>
              <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
              <td className="text-end">{formatearPrecio(o.total)}</td>
              <td><EstadoOrden estado={o.estado} /></td>
              <td><Button as={Link} to={`/admin/ordenes/${o.numero}`} size="sm" variant="outline-primary">Ver boleta</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {ordenes.length === 0 && <p>No hay órdenes con ese estado.</p>}
    </>
  );
}

export function MostrarBoleta() {
  const { numero } = useParams();
  const orden = obtener("ordenes", numero);
  if (!orden) return <p>No existe la orden {numero}. <Link to="/admin/ordenes">Volver</Link></p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Boleta n.º {orden.numero} <EstadoOrden estado={orden.estado} /></h1>
        <div className="d-flex gap-2 no-imprimir">
          <Button variant="danger" size="sm" onClick={() => window.print()}>Imprimir</Button>
          <Button as={Link} to="/admin/ordenes" variant="outline-secondary" size="sm">Volver</Button>
        </div>
      </div>
      <Card body>
        <p className="text-body-secondary">Fecha: {orden.fecha}{orden.motivo ? ` · Motivo del rechazo: ${orden.motivo}` : ""}</p>
        <DetalleOrden orden={orden} />
      </Card>
    </>
  );
}
