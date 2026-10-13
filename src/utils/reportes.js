/* ==========================================================
   reportes.js — Cálculos para el panel de administración.
   Funciones puras: reciben listas y devuelven resúmenes.
   ========================================================== */

export function resumenVentas(ordenes) {
  const pagadas = ordenes.filter((o) => o.estado === "pagada");
  const total = pagadas.reduce((s, o) => s + o.total, 0);
  return {
    ordenes: ordenes.length,
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    totalVendido: total,
    ticketPromedio: pagadas.length ? Math.round(total / pagadas.length) : 0,
  };
}

/** Unidades vendidas por producto (solo órdenes pagadas), de mayor a menor. */
export function productosMasVendidos(ordenes, limite = 5) {
  const conteo = {};
  ordenes
    .filter((o) => o.estado === "pagada")
    .forEach((o) => o.items.forEach((i) => {
      if (!conteo[i.codigo]) conteo[i.codigo] = { codigo: i.codigo, nombre: i.nombre, unidades: 0, monto: 0 };
      conteo[i.codigo].unidades += i.cantidad;
      conteo[i.codigo].monto += i.cantidad * i.precio;
    }));
  return Object.values(conteo).sort((a, b) => b.unidades - a.unidades).slice(0, limite);
}

/** Productos, unidades en stock y valor del inventario por categoría. */
export function inventarioPorCategoria(productos, categorias) {
  return categorias.map((c) => {
    const lista = productos.filter((p) => p.slug === c.slug);
    return {
      slug: c.slug,
      nombre: c.nombre,
      productos: lista.length,
      unidades: lista.reduce((s, p) => s + p.stock, 0),
      valor: lista.reduce((s, p) => s + p.stock * p.precio, 0),
      criticos: lista.filter((p) => p.stock <= (p.stockCritico ?? 3)).length,
    };
  });
}
