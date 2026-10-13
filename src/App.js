/* ==========================================================
   App.js — Componente principal.

   ESTADO (useState), compartido por varias páginas:
     carrito -> lista de productos a comprar (se guarda en localStorage)
     sesion  -> usuario que inició sesión (se guarda en localStorage)
   Se entregan a los hijos por PROPS (flujo de datos unidireccional).
   Los hijos no cambian el estado directamente: llaman a las
   funciones que les pasa App.

   RUTAS (React Router):
     - Tienda: comparte barra y pie mediante una ruta "layout" con <Outlet />.
     - Administración: rutas ANIDADAS bajo /admin y PROTEGIDAS: solo
       un usuario con rol "admin" puede entrar; si no, va a /login.
   ========================================================== */

import React, { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import BarraNavegacion from "./components/BarraNavegacion";
import PiePagina from "./components/PiePagina";
import { listar } from "./data/baseDatos";
import { DetalleBlog, ListaBlogs } from "./pages/Blogs";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import Checkout from "./pages/Checkout";
import Contacto from "./pages/Contacto";
import DetalleProducto from "./pages/DetalleProducto";
import IniciarSesion from "./pages/IniciarSesion";
import Inicio from "./pages/Inicio";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Ofertas from "./pages/Ofertas";
import Productos from "./pages/Productos";
import Registro from "./pages/Registro";
import ResultadoCompra from "./pages/ResultadoCompra";
import { FormularioCategoria, ListaCategoriasAdmin } from "./pages/admin/CategoriasAdmin";
import Dashboard from "./pages/admin/Dashboard";
import FormularioProducto from "./pages/admin/FormularioProducto";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import { ListaOrdenes, MostrarBoleta } from "./pages/admin/Ordenes";
import { ListaProductosAdmin, MostrarProducto, ProductosCriticos, ReporteProductos } from "./pages/admin/ProductosAdmin";
import Reportes from "./pages/admin/Reportes";
import { FormularioUsuario, ListaUsuarios, MostrarUsuario } from "./pages/admin/UsuariosAdmin";
import {
  agregarAlCarrito, calcularTotales, cambiarCantidad, cargarCarrito, guardarCarrito, quitarDelCarrito,
} from "./utils/carrito";
import { cargarSesion, cerrarSesion, esAdmin, guardarSesion } from "./utils/sesion";

/** Protección de rutas: solo administradores. */
export function RutaAdmin({ sesion, children }) {
  if (!esAdmin(sesion)) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  // Valores iniciales: lo que quedó guardado en localStorage (se lee una sola vez)
  const [carrito, setCarrito] = useState(cargarCarrito);
  const [sesion, setSesion] = useState(cargarSesion);

  /* ----- Carrito ----- */
  const actualizarCarrito = (nuevo) => {
    setCarrito(nuevo);
    guardarCarrito(nuevo);
  };
  const manejarAgregar = (producto) => actualizarCarrito(agregarAlCarrito(carrito, producto));
  const manejarCambiarCantidad = (codigo, cantidad) => actualizarCarrito(cambiarCantidad(carrito, codigo, cantidad));
  const manejarQuitar = (codigo) => actualizarCarrito(quitarDelCarrito(carrito, codigo));
  const manejarVaciar = () => actualizarCarrito([]);

  /* ----- Sesión ----- */
  const manejarInicioSesion = (usuario) => setSesion(guardarSesion(usuario));
  const manejarCierreSesion = () => {
    cerrarSesion();
    setSesion(null);
  };

  const { unidades, subtotal } = calcularTotales(carrito);
  const tienda = { carrito, onAgregar: manejarAgregar }; // props comunes de las vistas con productos

  // Estructura común de la tienda: barra + contenido de la ruta + pie
  const layoutTienda = (
    <>
      <a className="saltar-contenido" href="#contenido">Saltar al contenido</a>
      <BarraNavegacion
        unidades={unidades}
        total={subtotal}
        categorias={listar("categorias")}
        sesion={sesion}
        onCerrarSesion={manejarCierreSesion}
      />
      <main id="contenido">
        <Outlet />
      </main>
      <PiePagina />
    </>
  );

  return (
    <div className="App">
      <Routes>
        {/* ---------------- TIENDA ---------------- */}
        <Route element={layoutTienda}>
          <Route path="/" element={<Inicio {...tienda} />} />
          <Route path="/productos" element={<Productos {...tienda} />} />
          <Route path="/productos/:codigo" element={<DetalleProducto {...tienda} />} />
          <Route path="/categorias" element={<Categorias {...tienda} />} />
          <Route path="/categorias/:slug" element={<Categorias {...tienda} />} />
          <Route path="/ofertas" element={<Ofertas {...tienda} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<ListaBlogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<IniciarSesion onIniciarSesion={manejarInicioSesion} />} />
          <Route
            path="/carrito"
            element={<Carrito items={carrito} onCambiarCantidad={manejarCambiarCantidad} onQuitar={manejarQuitar} onVaciar={manejarVaciar} />}
          />
          <Route path="/checkout" element={<Checkout items={carrito} sesion={sesion} onCompraExitosa={manejarVaciar} />} />
          <Route path="/compra/exitosa/:numero" element={<ResultadoCompra exito />} />
          <Route path="/compra/error/:numero" element={<ResultadoCompra exito={false} />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>

        {/* ---------------- ADMINISTRACIÓN (protegida) ---------------- */}
        <Route
          path="/admin"
          element={
            <RutaAdmin sesion={sesion}>
              <LayoutAdmin sesion={sesion} onCerrarSesion={manejarCierreSesion} />
            </RutaAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<ListaOrdenes />} />
          <Route path="ordenes/:numero" element={<MostrarBoleta />} />
          <Route path="productos" element={<ListaProductosAdmin />} />
          <Route path="productos/nuevo" element={<FormularioProducto />} />
          <Route path="productos/criticos" element={<ProductosCriticos />} />
          <Route path="productos/reportes" element={<ReporteProductos />} />
          <Route path="productos/:codigo" element={<MostrarProducto />} />
          <Route path="productos/:codigo/editar" element={<FormularioProducto />} />
          <Route path="categorias" element={<ListaCategoriasAdmin />} />
          <Route path="categorias/nueva" element={<FormularioCategoria />} />
          <Route path="categorias/:slug/editar" element={<FormularioCategoria />} />
          <Route path="usuarios" element={<ListaUsuarios sesion={sesion} />} />
          <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
          <Route path="usuarios/:id" element={<MostrarUsuario />} />
          <Route path="usuarios/:id/editar" element={<FormularioUsuario />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<FormularioUsuario propio sesion={sesion} onPerfilActualizado={manejarInicioSesion} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
