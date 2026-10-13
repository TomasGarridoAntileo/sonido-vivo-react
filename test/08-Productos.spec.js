/* PRUEBA 8 · Página Productos y navegación de la App (React Router + estado del carrito en App) */

import React from "react";
import { fireEvent, screen, within } from "@testing-library/react";
import BarraNavegacion from "../src/components/BarraNavegacion";
import Productos from "../src/pages/Productos";
import { CLAVE_ALMACENAMIENTO } from "../src/utils/carrito";
import { renderApp, renderConRouter, simularLocalStorage } from "./utilidades";

describe("08 · <Productos> y navegación (App)", () => {
  const resumen = () => screen.getByTestId("resumen-catalogo").textContent;

  it("muestra los 51 productos del catálogo", () => {
    renderConRouter(<Productos />, { ruta: "/productos" });
    expect(resumen()).toContain("51 productos encontrados.");
    expect(screen.getAllByRole("article").length).toBe(51);
  });

  it("aplica la categoría que llega en la URL (?categoria=pedales) con useLocation", () => {
    renderConRouter(<Productos />, { ruta: "/productos?categoria=pedales" });
    expect(screen.getByLabelText("Categoría").value).toBe("pedales");
    screen.getAllByRole("article").forEach((a) => expect(a.textContent).toContain("Pedales de Efectos"));
  });

  it("ignora categorías inexistentes en la URL", () => {
    renderConRouter(<Productos />, { ruta: "/productos?categoria=violines" });
    expect(screen.getByLabelText("Categoría").value).toBe("");
  });

  it("filtra al escribir o elegir categoría y avisa cuando no hay resultados", () => {
    renderConRouter(<Productos />, { ruta: "/productos" });
    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "microfonos" } });
    screen.getAllByRole("article").forEach((a) => expect(a.textContent).toContain("Micrófonos"));
    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "xyz123" } });
    expect(screen.getByText("No encontramos productos con esa búsqueda.")).toBeTruthy();
  });

  it("al presionar Agregar avisa al padre con el producto (espía en la prop onAgregar)", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    renderConRouter(<Productos onAgregar={onAgregar} />, { ruta: "/productos" });
    const primera = screen.getAllByRole("article")[0];
    fireEvent.click(within(primera).getByRole("button", { name: "Agregar al carrito" }));
    expect(onAgregar).toHaveBeenCalledWith(jasmine.objectContaining({ codigo: "GA001" }));
    expect(resumen()).toContain("Agregaste «Guitarra Acústica Folk» al carrito.");
  });

  it("en la App, agregar sube el contador de la barra y se guarda en localStorage (mock)", () => {
    const datos = simularLocalStorage();
    renderApp("/productos");
    const contador = screen.getByTestId("contador-carrito");
    expect(contador.textContent).toBe("0");

    const primera = screen.getAllByRole("article")[0];
    fireEvent.click(within(primera).getByRole("button", { name: "Agregar al carrito" }));
    fireEvent.click(within(primera).getByRole("button", { name: "Agregar al carrito" }));

    expect(contador.textContent).toBe("2");
    expect(within(primera).getByText("2 en tu carrito")).toBeTruthy();
    expect(JSON.parse(datos[CLAVE_ALMACENAMIENTO])[0].cantidad).toBe(2);
  });

  it("la barra recibe las unidades por props y marca la página actual", () => {
    renderConRouter(<BarraNavegacion unidades={5} />, { ruta: "/productos" });
    expect(screen.getByTestId("contador-carrito").textContent).toBe("5");
    expect(screen.getByRole("link", { name: "Productos" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBeNull();
  });

  it("la portada muestra las 10 categorías, el ecualizador y el pie", () => {
    simularLocalStorage();
    const { container } = renderApp("/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Encuentra el instrumento");
    expect(container.querySelectorAll(".categoria").length).toBe(10);
    expect(container.querySelectorAll(".ecualizador li").length).toBe(24);
    expect(screen.getByRole("contentinfo").textContent).toContain("Sonido Vivo");
  });

  it("al hacer clic en una categoría abre la vista de esa categoría sin recargar", () => {
    simularLocalStorage();
    renderApp("/");
    fireEvent.click(screen.getByRole("link", { name: /Micrófonos/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Micrófonos");
    screen.getAllByRole("article").forEach((a) => expect(a.textContent).toContain("Micrófonos"));
  });

  it("el buscador de la barra abre el catálogo filtrado (?q=)", () => {
    renderApp("/");
    fireEvent.change(screen.getByLabelText("Buscar productos"), { target: { value: "shure" } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(screen.getByLabelText("Buscar").value).toBe("shure");
    screen.getAllByRole("article").forEach((a) => expect(a.textContent).toContain("Shure"));
  });

  it("Nosotros arma la tabla con 340 referencias y una ruta inexistente muestra 404", () => {
    simularLocalStorage();
    renderApp("/nosotros");
    expect(screen.getByRole("table").querySelectorAll("tbody tr").length).toBe(10);
    expect(screen.getByRole("table").querySelector("tfoot").textContent).toContain("340");
  });

  it("una ruta inexistente muestra la página 404", () => {
    simularLocalStorage();
    renderApp("/no-existe");
    expect(screen.getByText("Página no encontrada")).toBeTruthy();
  });
});
