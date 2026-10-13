/* Catálogo.
   ESTADO (useState): los filtros (texto, categoría, orden) y el último producto agregado.
   PROPS: "carrito" y "onAgregar" llegan desde App.
   La lista filtrada NO es estado: se calcula en cada render con filtrarProductos(),
   así nunca queda desactualizada.
   useLocation (React Router) lee ?categoria=pedales y ?q=boss (buscador de la barra)
   para abrir el catálogo ya filtrado. */

import React, { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina";
import FiltrosCatalogo from "../components/FiltrosCatalogo";
import GrillaProductos from "../components/GrillaProductos";
import { listar } from "../data/baseDatos";
import { filtrarProductos } from "../utils/catalogo";

function Productos({ carrito = [], onAgregar }) {
  // Datos desde la base de datos simulada (incluye cambios hechos en el panel admin)
  const productos = listar("productos");
  const categorias = listar("categorias");
  const location = useLocation();
  const parametros = new URLSearchParams(location.search);
  const categoriaUrl = parametros.get("categoria") || "";
  const textoUrl = parametros.get("q") || "";
  const categoriaValida = categorias.some((c) => c.slug === categoriaUrl) ? categoriaUrl : "";

  const [filtros, setFiltros] = useState({ texto: textoUrl, categoria: categoriaValida, orden: "" });
  const [ultimoAgregado, setUltimoAgregado] = useState(null);

  const lista = filtrarProductos(productos, filtros);

  const cambiarFiltro = (nombre, valor) => {
    setFiltros({ ...filtros, [nombre]: valor });
  };

  const alAgregar = (producto) => {
    if (onAgregar) onAgregar(producto);
    setUltimoAgregado(producto.nombre);
  };

  return (
    <>
      <EncabezadoPagina titulo="Catálogo" miga="Productos" bajada={`${productos.length} productos de nuestras 10 categorías. Agrega al carrito y retira en tienda.`} />
      <section className="seccion" aria-labelledby="titulo-catalogo">
        <Container>
          <h2 id="titulo-catalogo" className="visually-hidden">Productos</h2>
          <FiltrosCatalogo filtros={filtros} categorias={categorias} onCambiar={cambiarFiltro} />

          <p className="resumen-catalogo" aria-live="polite" data-testid="resumen-catalogo">
            {lista.length === 1 ? "1 producto encontrado." : `${lista.length} productos encontrados.`}
            {ultimoAgregado && <span className="ms-2 text-success">Agregaste «{ultimoAgregado}» al carrito.</span>}
          </p>

          {lista.length === 0 ? (
            <Alert variant="light" className="vacio">
              <p className="mb-1"><strong>No encontramos productos con esa búsqueda.</strong></p>
              <p className="mb-0">Prueba con la marca (por ejemplo "Boss") o elige "Todas" en categoría.</p>
            </Alert>
          ) : (
            <GrillaProductos productos={lista} carrito={carrito} onAgregar={alAgregar} />
          )}
        </Container>
      </section>
    </>
  );
}

/* Si cambia la URL (por ejemplo, una nueva búsqueda desde la barra estando ya en el catálogo),
   la "key" distinta hace que React cree el catálogo de nuevo con los filtros de la URL. */
function ProductosConUrl(props) {
  const location = useLocation();
  return <Productos key={location.search} {...props} />;
}

export default ProductosConUrl;
