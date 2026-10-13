/* PRUEBA 5 · Componente controlado FiltrosCatalogo */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import FiltrosCatalogo from "../src/components/FiltrosCatalogo";

describe("05 · <FiltrosCatalogo>", () => {
  const categorias = [
    { slug: "pedales", nombre: "Pedales de Efectos" },
    { slug: "bajos", nombre: "Bajos Eléctricos" },
  ];
  let onCambiar;

  beforeEach(() => {
    onCambiar = jasmine.createSpy("onCambiar");
    render(<FiltrosCatalogo filtros={{ texto: "boss", categoria: "pedales", orden: "" }} categorias={categorias} onCambiar={onCambiar} />);
  });

  it("muestra los valores que recibe (componente controlado)", () => {
    expect(screen.getByLabelText("Buscar").value).toBe("boss");
    expect(screen.getByLabelText("Categoría").value).toBe("pedales");
  });

  it("crea una opción por categoría más 'Todas'", () => {
    expect(screen.getByLabelText("Categoría").querySelectorAll("option").length).toBe(3);
  });

  it("avisa al padre qué filtro cambió y su nuevo valor", () => {
    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "fender" } });
    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "precio-asc" } });
    expect(onCambiar.calls.allArgs()).toEqual([["texto", "fender"], ["orden", "precio-asc"]]);
  });

  it("no recarga la página al presionar Enter en el buscador", () => {
    const formulario = screen.getByRole("search");
    const evento = new Event("submit", { bubbles: true, cancelable: true });
    formulario.dispatchEvent(evento);
    expect(evento.defaultPrevented).toBeTrue();
  });
});
