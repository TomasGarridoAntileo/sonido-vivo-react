/* Reportes generales: ventas y productos más vendidos (datos de las órdenes). */

import React from "react";
import { Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { listar } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";
import { productosMasVendidos, resumenVentas } from "../../utils/reportes";

function Reportes() {
  const ordenes = listar("ordenes");
  const ventas = resumenVentas(ordenes);
  const top = productosMasVendidos(ordenes);
  const maximo = Math.max(1, ...top.map((t) => t.unidades));
  const tasa = ventas.ordenes ? Math.round((ventas.pagadas / ventas.ordenes) * 100) : 0;

  const tarjetas = [
    ["Total vendido", formatearPrecio(ventas.totalVendido)],
    ["Órdenes pagadas", ventas.pagadas],
    ["Órdenes rechazadas", ventas.rechazadas],
    ["Ticket promedio", formatearPrecio(ventas.ticketPromedio)],
  ];

  return (
    <>
      <h1 className="h3">Reportes</h1>
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        {tarjetas.map(([t, v]) => (
          <Col key={t}><Card body className="h-100"><small className="text-body-secondary">{t}</small><p className="fs-4 fw-bold mb-0">{v}</p></Card></Col>
        ))}
      </Row>
      <Card body className="mb-4">
        <h2 className="h6">Pagos aprobados: {tasa}%</h2>
        <ProgressBar>
          <ProgressBar variant="success" now={tasa} key="ok" label={`${ventas.pagadas} pagadas`} />
          <ProgressBar variant="danger" now={100 - tasa} key="error" label={ventas.rechazadas ? `${ventas.rechazadas} rechazadas` : ""} />
        </ProgressBar>
      </Card>
      <h2 className="h5">Productos más vendidos</h2>
      {top.length === 0 ? <p>Aún no hay ventas.</p> : (
        <Table responsive className="bg-white align-middle">
          <thead><tr><th>Producto</th><th>Unidades</th><th className="text-end">Monto</th></tr></thead>
          <tbody>
            {top.map((t) => (
              <tr key={t.codigo}>
                <td>{t.nombre} <small className="text-body-secondary">({t.codigo})</small></td>
                <td style={{ minWidth: 200 }}><ProgressBar now={(t.unidades / maximo) * 100} label={`${t.unidades}`} /></td>
                <td className="text-end">{formatearPrecio(t.monto)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Reportes;
