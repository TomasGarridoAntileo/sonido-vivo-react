/* Barra de navegación de la tienda (React Bootstrap + React Router), basada en el template.
   - En celular y tablet se colapsa en un botón (Navbar.Toggle); desde 992px (expand="lg") se ve completa.
   - Link cambia de página sin recargar; useLocation marca el enlace activo.
   - El buscador envía a /productos?q=texto con useNavigate.
   PROPS (desde App): unidades y total del carrito, categorias, sesion, onCerrarSesion. */

import React, { useState } from "react";
import { Badge, Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatearPrecio } from "../utils/formato";
import { esAdmin } from "../utils/sesion";

export const ENLACES = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/ofertas", texto: "Ofertas" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/blogs", texto: "Blog" },
  { ruta: "/contacto", texto: "Contacto" },
];

function BarraNavegacion({ unidades = 0, total = 0, categorias = [], sesion = null, onCerrarSesion }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const buscar = (evento) => {
    evento.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
    setBusqueda("");
  };

  const enlace = (ruta, texto) => {
    const activo = pathname === ruta;
    return (
      <Nav.Link as={Link} to={ruta} key={ruta} eventKey={ruta} active={activo} aria-current={activo ? "page" : undefined}>
        {texto}
      </Nav.Link>
    );
  };

  return (
    <Navbar expand="lg" variant="dark" className="barra" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="marca">
          <img src="/img/logo.svg" alt="" width="36" height="36" />
          Sonido Vivo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        {/* En escritorio: dos filas a la derecha del logo (buscador y cuenta arriba, enlaces abajo), como el template */}
        <Navbar.Collapse id="menu-principal" className="flex-lg-column align-items-lg-end">
          <div className="d-lg-flex align-items-center gap-2 py-2 py-lg-1 barra__superior">
            <Form className="d-flex buscador mb-2 mb-lg-0" role="search" onSubmit={buscar}>
              <Form.Control
                type="search"
                placeholder="Buscar"
                aria-label="Buscar productos"
                size="sm"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Button type="submit" variant="outline-light" size="sm" className="ms-1">Buscar</Button>
            </Form>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {sesion ? (
                <>
                  <span className="text-light small" data-testid="saludo">Hola, {sesion.nombre}</span>
                  {esAdmin(sesion) && (
                    <Button as={Link} to="/admin" size="sm" variant="warning" className="text-nowrap">Panel admin</Button>
                  )}
                  <Button size="sm" variant="outline-light" className="text-nowrap" onClick={onCerrarSesion}>Cerrar sesión</Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" size="sm" variant="outline-light" className="text-nowrap">Iniciar sesión</Button>
                  <Button as={Link} to="/registro" size="sm" variant="valvula" className="text-nowrap">Crear cuenta</Button>
                </>
              )}
            </div>
          </div>
          <Nav className="align-items-lg-center">
            {ENLACES.slice(0, 2).map((e) => enlace(e.ruta, e.texto))}
            <NavDropdown title="Categorías" id="menu-categorias" active={pathname.startsWith("/categorias")}>
              <NavDropdown.Item as={Link} to="/categorias">Todas las categorías</NavDropdown.Item>
              <NavDropdown.Divider />
              {categorias.map((c) => (
                <NavDropdown.Item as={Link} to={`/categorias/${c.slug}`} key={c.slug}>{c.nombre}</NavDropdown.Item>
              ))}
            </NavDropdown>
            {ENLACES.slice(2).map((e) => enlace(e.ruta, e.texto))}
            <Nav.Link as={Link} to="/carrito" eventKey="/carrito" active={pathname === "/carrito"} className="enlace-carrito ms-lg-2">
              Carrito{" "}
              <Badge bg="warning" text="dark" pill data-testid="contador-carrito">{unidades}</Badge>
              <span className="ms-1 total-carrito" data-testid="total-barra">{formatearPrecio(total)}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;
