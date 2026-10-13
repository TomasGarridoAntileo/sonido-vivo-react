/* Estructura del panel de administración (rutas ANIDADAS de React Router).
   Menú lateral + <Outlet />, que muestra la sub-página de la URL actual.
   En celular el menú queda arriba; desde 992px queda a la izquierda.
   PROPS: sesion y onCerrarSesion (desde App). */

import React from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";

export const MENU_ADMIN = [
  { ruta: "/admin", texto: "Dashboard" },
  { ruta: "/admin/ordenes", texto: "Órdenes" },
  { ruta: "/admin/productos", texto: "Productos" },
  { ruta: "/admin/categorias", texto: "Categorías" },
  { ruta: "/admin/usuarios", texto: "Usuarios" },
  { ruta: "/admin/reportes", texto: "Reportes" },
  { ruta: "/admin/perfil", texto: "Perfil" },
];

/** Una opción está activa si es la ruta exacta o una sub-ruta (excepto Dashboard). */
export function estaActivo(pathname, ruta) {
  return ruta === "/admin" ? pathname === "/admin" : pathname.startsWith(ruta);
}

function LayoutAdmin({ sesion, onCerrarSesion }) {
  const { pathname } = useLocation();

  return (
    <div className="admin">
      <header className="admin__barra">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Link to="/admin" className="marca text-white text-decoration-none">
            <img src="/img/logo.svg" alt="" width="30" height="30" /> Panel Sonido Vivo
          </Link>
          <span className="text-light small d-none d-sm-inline">{sesion ? `${sesion.nombre} (${sesion.correo})` : ""}</span>
        </Container>
      </header>
      <Container fluid>
        <Row>
          <Col as="aside" lg={2} className="admin__menu py-3" aria-label="Menú de administración">
            <Nav variant="pills" className="flex-lg-column flex-row flex-wrap gap-1">
              {MENU_ADMIN.map((m) => {
                const activo = estaActivo(pathname, m.ruta);
                return (
                  <Nav.Link as={Link} to={m.ruta} key={m.ruta} active={activo} aria-current={activo ? "page" : undefined}>
                    {m.texto}
                  </Nav.Link>
                );
              })}
            </Nav>
            <hr />
            <div className="d-grid gap-2">
              <Button as={Link} to="/" variant="dark" size="sm">Ver tienda</Button>
              <Button variant="danger" size="sm" onClick={onCerrarSesion}>Cerrar sesión</Button>
            </div>
          </Col>
          <Col as="main" id="contenido" lg={10} className="py-4 admin__contenido">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LayoutAdmin;
