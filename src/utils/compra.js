/* ==========================================================
   compra.js — Lógica del checkout (paso de pago).
   ========================================================== */

import { crear, descontarStock, siguienteNumeroOrden, verificarStock } from "../data/baseDatos";
import { calcularTotales } from "./carrito";

export const OPCIONES_ENTREGA = [
  { valor: "despacho", texto: "Despacho a domicilio (2 a 4 días hábiles)", costo: 4990 },
  { valor: "retiro", texto: "Retiro en tienda (sin costo, en 48 horas)", costo: 0 },
];

export const ENVIO_GRATIS_DESDE = 200000;

/** Costo de envío: gratis para retiro o para compras sobre $200.000. */
export function calcularEnvio(tipo, subtotal) {
  const opcion = OPCIONES_ENTREGA.find((o) => o.valor === tipo);
  if (!opcion || subtotal >= ENVIO_GRATIS_DESDE) return 0;
  return opcion.costo;
}

/** Fecha de hoy en formato AAAA-MM-DD. */
export function fechaHoy(hoy = new Date()) {
  const dos = (n) => String(n).padStart(2, "0");
  return `${hoy.getFullYear()}-${dos(hoy.getMonth() + 1)}-${dos(hoy.getDate())}`;
}

/**
 * Registra la orden en la base de datos simulada.
 * pagoAprobado viene de la pasarela de pago (simulada en esta etapa).
 * Si el pago se aprueba y hay stock, descuenta el stock y la orden queda "pagada";
 * si no, queda "rechazada" con el motivo.
 */
export function procesarCompra({ items, datos, usuarioId = null, pagoAprobado }) {
  const { subtotal } = calcularTotales(items);
  const costoEnvio = calcularEnvio(datos.entrega, subtotal);
  const problemasStock = verificarStock(items);
  const aprobada = pagoAprobado && problemasStock.length === 0;

  const orden = {
    numero: siguienteNumeroOrden(),
    fecha: fechaHoy(),
    estado: aprobada ? "pagada" : "rechazada",
    motivo: aprobada ? "" : problemasStock[0] || "El banco rechazó el pago.",
    usuarioId,
    cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim() },
    entrega: {
      tipo: datos.entrega,
      calle: datos.calle.trim(),
      departamento: datos.departamento.trim(),
      region: datos.region,
      comuna: datos.comuna,
      indicaciones: datos.indicaciones.trim(),
    },
    items: items.map(({ codigo, nombre, precio, cantidad, slug }) => ({ codigo, nombre, precio, cantidad, slug })),
    costoEnvio,
    total: subtotal + costoEnvio,
  };

  crear("ordenes", orden);
  if (aprobada) descontarStock(items);
  return orden;
}
