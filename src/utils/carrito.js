/* ==========================================================
   carrito.js — Reglas del carrito como funciones puras.

   El carrito es un arreglo de ítems:
     [{ codigo, nombre, marca, modelo, precio, stock, slug, cantidad }]

   Cada función recibe el arreglo actual y devuelve un arreglo
   NUEVO (no modifica el original). Así App.js puede guardarlo
   con setCarrito(...) y React vuelve a dibujar la interfaz.
   Además se pueden probar con Jasmine sin renderizar nada.
   ========================================================== */

import { precioFinal } from "../data/baseDatos";

export const CLAVE_ALMACENAMIENTO = "sonido-vivo-carrito";

/** Agrega una unidad. No agrega si no hay stock o si ya está todo el stock en el carrito. */
export function agregarAlCarrito(items, producto) {
  if (producto.stock === 0) return items;
  const existente = items.find((i) => i.codigo === producto.codigo);
  if (existente) {
    if (existente.cantidad >= producto.stock) return items;
    return items.map((i) =>
      i.codigo === producto.codigo ? { ...i, cantidad: i.cantidad + 1 } : i
    );
  }
  const { codigo, nombre, marca, modelo, stock, slug } = producto;
  // Se guarda el precio que paga el cliente (el de oferta, si tiene)
  return [...items, { codigo, nombre, marca, modelo, precio: precioFinal(producto), stock, slug, cantidad: 1 }];
}

/** Cambia la cantidad (máximo el stock). Con 0 o menos, el producto sale del carrito. */
export function cambiarCantidad(items, codigo, cantidad) {
  if (cantidad <= 0) return quitarDelCarrito(items, codigo);
  return items.map((i) =>
    i.codigo === codigo ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i
  );
}

export function quitarDelCarrito(items, codigo) {
  return items.filter((i) => i.codigo !== codigo);
}

/** Cuántas unidades de un producto hay en el carrito. */
export function cantidadEnCarrito(items, codigo) {
  const item = items.find((i) => i.codigo === codigo);
  return item ? item.cantidad : 0;
}

/** Totales: se calculan, no se guardan. */
export function calcularTotales(items) {
  const unidades = items.reduce((suma, i) => suma + i.cantidad, 0);
  const subtotal = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  return { unidades, subtotal };
}

/* ---------- Persistencia con localStorage (material 2.2.1) ---------- */

/** Lee el carrito guardado. Si no hay, está dañado o el navegador lo bloquea, parte vacío. */
export function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    const items = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

/** Guarda el carrito. Si el navegador no deja guardar (modo privado), sigue funcionando en memoria. */
export function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(items));
  } catch (error) {
    /* sin almacenamiento disponible: no pasa nada */
  }
}
