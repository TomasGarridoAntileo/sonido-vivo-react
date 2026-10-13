/* Filtros del catálogo: componente CONTROLADO.
   No guarda estado propio: recibe los valores por props (filtros)
   y avisa cada cambio con onCambiar(nombreDelFiltro, valorNuevo).
   El estado vive en la página <Productos>, que es quien filtra. */

import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ORDENES } from "../utils/catalogo";

export default function FiltrosCatalogo({ filtros, categorias, onCambiar }) {
  return (
    <Form className="filtros" role="search" onSubmit={(e) => e.preventDefault()}>
      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Form.Group controlId="buscar">
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="search"
              placeholder="Nombre, marca, modelo o código"
              value={filtros.texto}
              onChange={(e) => onCambiar("texto", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Group controlId="filtro-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={filtros.categoria} onChange={(e) => onCambiar("categoria", e.target.value)}>
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Group controlId="orden">
            <Form.Label>Ordenar por</Form.Label>
            <Form.Select value={filtros.orden} onChange={(e) => onCambiar("orden", e.target.value)}>
              {ORDENES.map((o) => (
                <option key={o.valor} value={o.valor}>{o.texto}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}
