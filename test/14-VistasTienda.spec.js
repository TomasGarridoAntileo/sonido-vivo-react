/* PRUEBA 14 · Nuevas vistas de la tienda (useParams) y reportes */

import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { listar } from "../src/data/baseDatos";
import { inventarioPorCategoria, productosMasVendidos, resumenVentas } from "../src/utils/reportes";
import { renderApp } from "./utilidades";

describe("14 · Vistas de la tienda y reportes", () => {
  it("detalle de producto: lee el código de la URL (useParams) y agrega al carrito", () => {
    renderApp("/productos/GE001");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Guitarra Eléctrica Stratocaster");
    expect(screen.getByText("-12%")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    expect(screen.getByTestId("contador-carrito").textContent).toBe("1");
    expect(screen.getByText("1 en tu carrito")).toBeTruthy();
    expect(screen.getByText("También en Guitarras Eléctricas")).toBeTruthy();
  });

  it("detalle de un código inexistente muestra un aviso", () => {
    renderApp("/productos/XX999");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Producto no encontrado");
  });

  it("ofertas muestra solo productos con precio rebajado", () => {
    renderApp("/ofertas");
    expect(screen.getByTestId("resumen-ofertas").textContent).toBe("5 productos en oferta.");
    expect(screen.getAllByTestId("precio-anterior").length).toBe(5);
  });

  it("categorías: lista las 10 categorías", () => {
    renderApp("/categorias");
    expect(screen.getAllByRole("listitem").filter((li) => li.closest("[aria-label='Categorías']")).length).toBe(10);
    expect(screen.queryAllByRole("article").length).toBe(0); // sin categoría elegida no hay productos
  });

  it("categoría elegida (useParams): muestra solo sus productos", () => {
    renderApp("/categorias/teclados");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Teclados y Pianos");
    const productos = screen.getAllByRole("article");
    expect(productos.length).toBe(4);
    productos.forEach((a) => expect(a.textContent).toContain("Teclados y Pianos"));
  });

  it("blog: lista los artículos y abre el detalle", () => {
    renderApp("/blogs");
    fireEvent.click(screen.getAllByText("Leer más")[1]);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("5 consejos para cuidar tus pedales de efectos");
  });

  it("resultado de compra: orden inexistente e impresión de la boleta (mock de window.print)", () => {
    renderApp("/compra/exitosa/99999999");
    expect(screen.getByText("No encontramos la orden 99999999")).toBeTruthy();
  });

  it("la boleta de una compra exitosa se puede imprimir", () => {
    const imprimir = spyOn(window, "print"); // no abre el diálogo real
    renderApp("/compra/exitosa/20260001");
    fireEvent.click(screen.getByRole("button", { name: "Imprimir boleta" }));
    expect(imprimir).toHaveBeenCalledTimes(1);
  });

  it("reportes: resumen de ventas, más vendidos e inventario por categoría", () => {
    const ordenes = listar("ordenes");
    expect(resumenVentas(ordenes)).toEqual({ ordenes: 2, pagadas: 1, rechazadas: 1, totalVendido: 112960, ticketPromedio: 112960 });
    expect(productosMasVendidos(ordenes)[0]).toEqual({ codigo: "AC001", nombre: "Cuerdas Guitarra Eléctrica 09-42", unidades: 2, monto: 17980 });
    const inventario = inventarioPorCategoria(listar("productos"), listar("categorias"));
    expect(inventario.length).toBe(10);
    expect(inventario.find((f) => f.slug === "baterias").productos).toBe(5);
    expect(resumenVentas([]).ticketPromedio).toBe(0);
  });
});
