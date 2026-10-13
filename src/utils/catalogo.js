/* ==========================================================
   catalogo.js — Lógica del catálogo separada de la vista.
   El componente <Productos> guarda los filtros en su estado
   y llama a esta función pura para obtener la lista a mostrar.
   ========================================================== */

import { normalizar } from "./formato";

export const ORDENES = [
  { valor: "", texto: "Destacados" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
  { valor: "nombre", texto: "Nombre (A-Z)" },
];

/**
 * Filtra y ordena productos sin modificar el arreglo original.
 * @param {Array} productos
 * @param {{ texto?: string, categoria?: string, orden?: string }} filtros
 */
export function filtrarProductos(productos, { texto = "", categoria = "", orden = "" } = {}) {
  const buscado = normalizar(texto.trim());

  const resultado = productos.filter((p) => {
    const coincideCategoria = categoria === "" || p.slug === categoria;
    const textoProducto = normalizar(`${p.codigo} ${p.nombre} ${p.marca} ${p.modelo} ${p.categoria}`);
    return coincideCategoria && textoProducto.includes(buscado);
  });

  if (orden === "precio-asc") resultado.sort((a, b) => a.precio - b.precio);
  if (orden === "precio-desc") resultado.sort((a, b) => b.precio - a.precio);
  if (orden === "nombre") resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return resultado;
}

/** Texto del estado de stock que se muestra en cada tarjeta. */
export function textoStock(stock) {
  if (stock === 0) return "Sin stock";
  if (stock <= 2) return `Últimas ${stock}`;
  return `${stock} en stock`;
}
