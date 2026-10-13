/* PRUEBA 4 · Componente TarjetaProducto (props y eventos) */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TarjetaProducto from "../src/components/TarjetaProducto";
import { FUTURO, PRODUCTO_PRUEBA } from "./utilidades";

describe("04 · <TarjetaProducto>", () => {
  const dibujar = (props) =>
    render(<MemoryRouter future={FUTURO}><TarjetaProducto producto={PRODUCTO_PRUEBA} {...props} /></MemoryRouter>);

  it("muestra los datos que recibe por props", () => {
    dibujar();
    expect(screen.getByRole("heading", { name: "Guitarra de Prueba" })).toBeTruthy();
    expect(screen.getByText("$100.000")).toBeTruthy();
    expect(screen.getByText("Últimas 2")).toBeTruthy();
    expect(screen.getByText(/Código GE999/)).toBeTruthy();
  });

  it("llama a onAgregar con el producto al presionar el botón (espía de Jasmine)", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    dibujar({ onAgregar });
    fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(PRODUCTO_PRUEBA);
  });

  it("desactiva el botón cuando ya está todo el stock en el carrito", () => {
    dibujar({ onAgregar: () => {}, enCarrito: 2 });
    const boton = screen.getByRole("button", { name: "Máximo en carrito" });
    expect(boton.disabled).toBeTrue();
    expect(screen.getByText("2 en tu carrito")).toBeTruthy();
  });

  it("muestra 'Sin stock' y no permite agregar si el stock es 0", () => {
    dibujar({ producto: { ...PRODUCTO_PRUEBA, stock: 0 }, onAgregar: () => {} });
    expect(screen.getByRole("button", { name: "Sin stock" }).disabled).toBeTrue();
  });

  it("sin onAgregar no muestra el botón y el nombre enlaza al detalle del producto", () => {
    dibujar();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("link", { name: "Guitarra de Prueba" }).getAttribute("href")).toBe("/productos/GE999");
  });

  it("si está en oferta muestra el precio anterior tachado y el descuento (renderizado condicional)", () => {
    dibujar({ producto: { ...PRODUCTO_PRUEBA, precioOferta: 80000 } });
    expect(screen.getByTestId("precio-anterior").textContent).toBe("$100.000");
    expect(screen.getByText("$80.000")).toBeTruthy();
    expect(screen.getByText("-20%")).toBeTruthy();
  });
});
