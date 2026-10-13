/* PRUEBA 12 · Compra: carrito → checkout → pago correcto o pago con error */

import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import Checkout, { valoresDesdeSesion } from "../src/pages/Checkout";
import { listar, obtener } from "../src/data/baseDatos";
import { CLAVE_ALMACENAMIENTO } from "../src/utils/carrito";
import { calcularEnvio, fechaHoy, procesarCompra } from "../src/utils/compra";
import { iniciarSesionComo, renderApp, renderConRouter } from "./utilidades";

const ITEMS = [
  { codigo: "GE001", nombre: "Guitarra Eléctrica Stratocaster", precio: 219990, stock: 5, slug: "guitarras-electricas", cantidad: 1 },
  { codigo: "PE001", nombre: "Pedal Distorsión", precio: 79990, stock: 7, slug: "pedales", cantidad: 2 },
];
const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

/** Abre la App en /checkout con el carrito cargado. */
function abrirCheckout(items = ITEMS) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(items));
  renderApp("/checkout");
}

function completarDatos() {
  escribir("Nombre", "Tomás");
  escribir("Apellidos", "Garrido Antileo");
  escribir("Correo", "tomas@duocuc.cl");
  escribir(/Calle y número/, "Av. Pajaritos 1840");
  escribir("Región", "Región Metropolitana");
  escribir("Comuna", "Maipú");
}

describe("12 · Checkout y resultado de la compra", () => {
  describe("lógica (utils/compra.js)", () => {
    it("envío: cuesta en despacho, es gratis al retirar o sobre $200.000", () => {
      expect(calcularEnvio("despacho", 50000)).toBe(4990);
      expect(calcularEnvio("retiro", 50000)).toBe(0);
      expect(calcularEnvio("despacho", 250000)).toBe(0);
      expect(fechaHoy(new Date(2026, 0, 5))).toBe("2026-01-05");
    });

    it("una compra aprobada queda pagada y descuenta stock; una rechazada no", () => {
      const datos = { ...valoresDesdeSesion(null), nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "retiro", region: "Maule", comuna: "Talca" };
      const ok = procesarCompra({ items: [ITEMS[1]], datos, pagoAprobado: true });
      expect(ok.estado).toBe("pagada");
      expect(obtener("productos", "PE001").stock).toBe(5);
      const mal = procesarCompra({ items: [ITEMS[1]], datos, pagoAprobado: false });
      expect(mal.estado).toBe("rechazada");
      expect(obtener("productos", "PE001").stock).toBe(5);
      expect(listar("ordenes").length).toBe(4); // 2 iniciales + 2 nuevas
    });

    it("se rechaza si ya no hay stock suficiente, aunque el banco apruebe", () => {
      const datos = { ...valoresDesdeSesion(null), nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "retiro" };
      const orden = procesarCompra({ items: [{ ...ITEMS[0], cantidad: 99 }], datos, pagoAprobado: true });
      expect(orden.estado).toBe("rechazada");
      expect(orden.motivo).toContain("Solo quedan");
    });
  });

  describe("vista", () => {
    it("muestra la compra y el total a pagar con envío", () => {
      renderConRouter(<Checkout items={ITEMS} />);
      expect(screen.getByText("Guitarra Eléctrica Stratocaster")).toBeTruthy();
      expect(screen.getByTestId("total-checkout").textContent).toBe("Total a pagar: $379.970"); // 379.970 > 200.000: envío gratis
    });

    it("con sesión iniciada completa los datos del cliente automáticamente (props)", () => {
      const sesion = iniciarSesionComo("U002");
      renderConRouter(<Checkout items={ITEMS} sesion={sesion} />);
      expect(screen.getByLabelText("Nombre").value).toBe("Camila");
      expect(screen.getByLabelText("Correo").value).toBe("camila@gmail.com");
      expect(screen.getByLabelText("Comuna").value).toBe("Viña del Mar");
    });

    it("sin datos muestra los errores; la calle deja de ser obligatoria al elegir retiro", () => {
      renderConRouter(<Checkout items={ITEMS} />);
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
      expect(screen.getByText(/Revisa 7 campos/)).toBeTruthy();
      fireEvent.click(screen.getByLabelText(/Retiro en tienda/));
      expect(screen.getByLabelText(/Calle y número/).classList.contains("is-invalid")).toBeFalse();
    });

    it("pago aprobado: muestra la boleta, vacía el carrito y descuenta stock", () => {
      abrirCheckout();
      completarDatos();
      fireEvent.click(screen.getByLabelText("Pago aprobado"));
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Se ha realizado la compra n.º 20260003");
      expect(screen.getByTestId("total-orden").textContent).toBe("$379.970");
      expect(screen.getByTestId("contador-carrito").textContent).toBe("0");
      expect(obtener("productos", "GE001").stock).toBe(4);
    });

    it("pago rechazado: muestra el error, mantiene el carrito y permite reintentar", () => {
      abrirCheckout();
      completarDatos();
      fireEvent.click(screen.getByLabelText("Pago rechazado"));
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("No se pudo realizar el pago");
      expect(screen.getByTestId("contador-carrito").textContent).toBe("3");
      fireEvent.click(screen.getByText("Volver a realizar el pago"));
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pago");
    });

    it("con el carrito vacío no deja pagar", () => {
      renderConRouter(<Checkout items={[]} />);
      expect(screen.getByText("No tienes productos en el carrito.")).toBeTruthy();
      expect(screen.queryByRole("button", { name: /Pagar ahora/ })).toBeNull();
    });
  });
});
