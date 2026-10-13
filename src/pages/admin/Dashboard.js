/* Dashboard: resumen del día con datos LEÍDOS de la base de datos simulada. */

import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listar, productosCriticos } from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";
import { resumenVentas } from "../../utils/reportes";

const ACCESOS = [
  { ruta: "/admin/ordenes", titulo: "Órdenes", texto: "Seguimiento de todas las compras y sus boletas." },
  { ruta: "/admin/productos", titulo: "Productos", texto: "Inventario, precios, ofertas y stock." },
  { ruta: "/admin/categorias", titulo: "Categorías", texto: "Organiza los productos para facilitar la navegación." },
  { ruta: "/admin/usuarios", titulo: "Usuarios", texto: "Cuentas de clientes y administradores." },
  { ruta: "/admin/reportes", titulo: "Reportes", texto: "Ventas, productos más vendidos e inventario." },
  { ruta: "/admin/perfil", titulo: "Perfil", texto: "Tus datos de administrador." },
  { ruta: "/admin/productos/criticos", titulo: "Stock crítico", texto: "Productos que hay que reponer." },
  { ruta: "/", titulo: "Tienda", texto: "Ver la tienda como la ve un cliente." },
];

function Dashboard() {
  const ordenes = listar("ordenes");
  const productos = listar("productos");
  const usuarios = listar("usuarios");
  const ventas = resumenVentas(ordenes);
  const inventario = productos.reduce((s, p) => s + p.stock, 0);
  const criticos = productosCriticos().length;

  const indicadores = [
    { titulo: "Compras", valor: ventas.pagadas, detalle: `Total vendido: ${formatearPrecio(ventas.totalVendido)}`, color: "primary" },
    { titulo: "Productos", valor: productos.length, detalle: `Inventario: ${inventario} unidades`, color: "success" },
    { titulo: "Usuarios", valor: usuarios.length, detalle: `Stock crítico: ${criticos} productos`, color: "warning" },
  ];

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-body-secondary">Resumen de la actividad de la tienda.</p>
      <Row xs={1} md={3} className="g-3 mb-4">
        {indicadores.map((i) => (
          <Col key={i.titulo}>
            <Card bg={i.color} text={i.color === "warning" ? "dark" : "white"} className="h-100 indicador">
              <Card.Body>
                <Card.Title as="h2" className="h6 mb-1">{i.titulo}</Card.Title>
                <p className="display-6 mb-1" data-testid={`indicador-${i.titulo.toLowerCase()}`}>{i.valor}</p>
                <small>{i.detalle}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row xs={1} sm={2} xl={4} className="g-3">
        {ACCESOS.map((a) => (
          <Col key={a.ruta}>
            <Card as={Link} to={a.ruta} className="h-100 acceso-admin text-decoration-none">
              <Card.Body className="text-center">
                <Card.Title as="h2" className="h6">{a.titulo}</Card.Title>
                <Card.Text className="small text-body-secondary">{a.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Dashboard;
