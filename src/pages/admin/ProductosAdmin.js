/* Productos en el panel:
   /admin/productos            listado con búsqueda, ver, editar y eliminar (Leer y Eliminar del CRUD)
   /admin/productos/:codigo    mostrar producto
   /admin/productos/criticos   productos con stock crítico
   /admin/productos/reportes   inventario por categoría */

import React, { useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, ProgressBar, Row, Table } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import PrecioProducto from "../../components/PrecioProducto";
import { eliminar, listar, obtener, productosCriticos } from "../../data/baseDatos";
import { normalizar, formatearPrecio } from "../../utils/formato";
import { inventarioPorCategoria } from "../../utils/reportes";

export function ListaProductosAdmin() {
  // ESTADO: la lista se guarda en useState para redibujar al eliminar
  const [productos, setProductos] = useState(() => listar("productos"));
  const [texto, setTexto] = useState("");
  const location = useLocation();
  const mensaje = location.state && location.state.mensaje;
  const [eliminado, setEliminado] = useState("");

  const visibles = productos.filter((p) =>
    normalizar(`${p.codigo} ${p.nombre} ${p.marca} ${p.categoria}`).includes(normalizar(texto.trim()))
  );

  const borrar = (producto) => {
    if (!window.confirm(`¿Eliminar ${producto.nombre} (${producto.codigo})? Esta acción no se puede deshacer.`)) return;
    eliminar("productos", producto.codigo);
    setProductos(listar("productos")); // se vuelve a leer: la tabla se actualiza
    setEliminado(`Se eliminó ${producto.nombre}.`);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos <small className="text-body-secondary fs-6">({productos.length})</small></h1>
        <div className="d-flex flex-wrap gap-2">
          <Button as={Link} to="/admin/productos/criticos" variant="outline-danger" size="sm">Stock crítico</Button>
          <Button as={Link} to="/admin/productos/reportes" variant="outline-secondary" size="sm">Reporte</Button>
          <Button as={Link} to="/admin/productos/nuevo" variant="success" size="sm">Nuevo producto</Button>
        </div>
      </div>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {eliminado && <Alert variant="warning">{eliminado}</Alert>}
      <Form.Control
        type="search"
        placeholder="Buscar por código, nombre, marca o categoría"
        aria-label="Buscar productos"
        className="mb-3"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <Table responsive hover size="sm" className="bg-white align-middle">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th className="text-end">Precio</th><th className="text-center">Stock</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {visibles.map((p) => (
            <tr key={p.codigo}>
              <td>{p.codigo}</td>
              <td>{p.nombre} {p.precioOferta ? <Badge bg="danger">Oferta</Badge> : null}</td>
              <td>{p.categoria}</td>
              <td className="text-end">{formatearPrecio(p.precio)}</td>
              <td className="text-center">
                <Badge bg={p.stock <= (p.stockCritico ?? 3) ? "danger" : "success"}>{p.stock}</Badge>
              </td>
              <td className="text-nowrap">
                <Button as={Link} to={`/admin/productos/${p.codigo}`} size="sm" variant="outline-primary" className="me-1">Ver</Button>
                <Button as={Link} to={`/admin/productos/${p.codigo}/editar`} size="sm" variant="outline-secondary" className="me-1">Editar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => borrar(p)} aria-label={`Eliminar ${p.nombre}`}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {visibles.length === 0 && <p>No hay productos que coincidan.</p>}
    </>
  );
}

export function MostrarProducto() {
  const { codigo } = useParams();
  const p = obtener("productos", codigo);
  if (!p) return <p>No existe el producto {codigo}. <Link to="/admin/productos">Volver</Link></p>;

  const datos = [
    ["Código", p.codigo], ["Categoría", p.categoria], ["Marca", p.marca], ["Modelo", p.modelo],
    ["Stock", p.stock], ["Stock crítico", p.stockCritico ?? 3], ["Descripción", p.descripcion],
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">{p.nombre}</h1>
        <div className="d-flex gap-2">
          <Button as={Link} to={`/admin/productos/${p.codigo}/editar`} size="sm" variant="primary">Editar</Button>
          <Button as={Link} to="/admin/productos" size="sm" variant="outline-secondary">Volver</Button>
        </div>
      </div>
      <Card body>
        <Row className="g-3 align-items-center">
          <Col md={3} className="text-center">
            <img src={`/img/categorias/${p.slug}.svg`} alt="" width="96" height="96" />
          </Col>
          <Col md={9}>
            <PrecioProducto producto={p} grande />
            <Table size="sm" className="mt-3 mb-0">
              <tbody>
                {datos.map(([k, v]) => <tr key={k}><th scope="row" style={{ width: "30%" }}>{k}</th><td>{v}</td></tr>)}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export function ProductosCriticos() {
  const criticos = productosCriticos();
  return (
    <>
      <h1 className="h3">Productos con stock crítico</h1>
      <p className="text-body-secondary">Productos cuyo stock es igual o menor a su stock crítico. Hay que reponerlos.</p>
      {criticos.length === 0 ? (
        <Alert variant="success">No hay productos en stock crítico.</Alert>
      ) : (
        <Table responsive hover className="bg-white">
          <thead><tr><th>Código</th><th>Producto</th><th className="text-center">Stock</th><th className="text-center">Crítico</th><th /></tr></thead>
          <tbody>
            {criticos.map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td className="text-center"><Badge bg="danger">{p.stock}</Badge></td>
                <td className="text-center">{p.stockCritico ?? 3}</td>
                <td><Button as={Link} to={`/admin/productos/${p.codigo}/editar`} size="sm" variant="outline-primary">Reponer</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export function ReporteProductos() {
  const filas = inventarioPorCategoria(listar("productos"), listar("categorias"));
  const maximo = Math.max(1, ...filas.map((f) => f.valor));
  const totalValor = filas.reduce((s, f) => s + f.valor, 0);

  return (
    <>
      <h1 className="h3">Reporte de inventario</h1>
      <p>Valor total del inventario: <strong>{formatearPrecio(totalValor)}</strong></p>
      <Table responsive className="bg-white align-middle">
        <thead><tr><th>Categoría</th><th className="text-center">Productos</th><th className="text-center">Unidades</th><th className="text-center">Críticos</th><th>Valor del inventario</th></tr></thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.slug}>
              <td>{f.nombre}</td>
              <td className="text-center">{f.productos}</td>
              <td className="text-center">{f.unidades}</td>
              <td className="text-center">{f.criticos}</td>
              <td style={{ minWidth: 220 }}>
                <ProgressBar now={(f.valor / maximo) * 100} label={formatearPrecio(f.valor)} visuallyHidden={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
