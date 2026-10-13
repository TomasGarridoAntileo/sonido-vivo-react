/* PRUEBA 10 · Página Carrito dentro de la App, con datos guardados (localStorage simulado) */

import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import Carrito from "../src/pages/Carrito";
import { CLAVE_ALMACENAMIENTO } from "../src/utils/carrito";
import { renderApp, renderConRouter, simularLocalStorage } from "./utilidades";

// Carrito ya guardado con 2 productos (3 unidades)
const GUARDADO = JSON.stringify([
  { codigo: "GA001", nombre: "Guitarra Acústica Folk", marca: "Yamaha", modelo: "F310", precio: 109990, stock: 8, slug: "guitarras-acusticas", cantidad: 1 },
  { codigo: "MI001", nombre: "Micrófono Dinámico", marca: "Shure", modelo: "SM58", precio: 129990, stock: 2, slug: "microfonos", cantidad: 2 },
]);

function abrirCarrito() {
  const datos = simularLocalStorage({ [CLAVE_ALMACENAMIENTO]: GUARDADO });
  renderApp("/carrito");
  return datos;
}

describe("10 · <Carrito>", () => {
  it("vacío: invita a ir al catálogo (renderizado condicional)", () => {
    renderConRouter(<Carrito items={[]} />);
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
    expect(screen.getByText("Ir al catálogo").getAttribute("href")).toBe("/productos");
    expect(screen.queryByText("Comprar ahora")).toBeNull();
  });

  it("recupera lo guardado en localStorage y muestra el total en el carrito y en la barra", () => {
    abrirCarrito();
    expect(screen.getByText("3 productos")).toBeTruthy();
    expect(screen.getByTestId("total-carrito").textContent).toBe("$369.970");
    expect(screen.getByTestId("contador-carrito").textContent).toBe("3");
    expect(screen.getByTestId("total-barra").textContent).toBe("$369.970");
  });

  it("los botones + y − cambian la cantidad respetando el stock", () => {
    abrirCarrito();
    const [masGuitarra, masMicro] = screen.getAllByRole("button", { name: "Agregar una unidad" });
    fireEvent.click(masGuitarra);
    expect(screen.getByTestId("cantidad-GA001").textContent).toBe("2");
    expect(masMicro.disabled).toBeTrue(); // el micrófono ya está en su stock máximo
    fireEvent.click(screen.getAllByRole("button", { name: "Quitar una unidad" })[1]);
    expect(screen.getByTestId("cantidad-MI001").textContent).toBe("1");
  });

  it("elimina un producto, vacía el carrito y lo guarda", () => {
    const datos = abrirCarrito();
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(screen.queryByText("Guitarra Acústica Folk")).toBeNull();
    expect(screen.getByText("2 productos")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
    expect(JSON.parse(datos[CLAVE_ALMACENAMIENTO])).toEqual([]);
  });

  it("'Comprar ahora' lleva al checkout y avisa cuánto falta para el despacho gratis", () => {
    abrirCarrito();
    expect(screen.getByText("¡Tu compra tiene despacho gratis!")).toBeTruthy();
    fireEvent.click(screen.getByText("Comprar ahora"));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pago");
  });
});
