/* PRUEBA 6 · Componentes de formulario: CampoFormulario y MedidorClave (manipulación del DOM) */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CampoFormulario from "../src/components/CampoFormulario";
import MedidorClave, { nivelSeguridad } from "../src/components/MedidorClave";

describe("06 · <CampoFormulario> y <MedidorClave>", () => {
  const base = { id: "correo", etiqueta: "Correo", valor: "", onCambiar: () => {}, onSalir: () => {}, onUsarSugerencia: () => {} };

  it("sin validar no pinta el campo ni muestra error", () => {
    render(<CampoFormulario {...base} />);
    const input = screen.getByLabelText(/Correo/);
    expect(input.classList.contains("is-invalid")).toBeFalse();
    expect(input.classList.contains("is-valid")).toBeFalse();
  });

  it("con error marca el campo como inválido y lo conecta con su mensaje", () => {
    render(<CampoFormulario {...base} resultado={{ error: "Escribe tu correo electrónico." }} />);
    const input = screen.getByLabelText(/Correo/);
    expect(input.classList.contains("is-invalid")).toBeTrue();
    expect(input.getAttribute("aria-describedby")).toContain("correo-error");
    expect(screen.getByRole("alert").textContent).toBe("Escribe tu correo electrónico.");
  });

  it("muestra la sugerencia y ejecuta onUsarSugerencia al presionar 'Usar'", () => {
    const onUsarSugerencia = jasmine.createSpy("onUsarSugerencia");
    render(<CampoFormulario {...base} onUsarSugerencia={onUsarSugerencia}
      resultado={{ sugerencia: { texto: "¿Quisiste decir a@gmail.com?", valor: "a@gmail.com" } }} />);
    expect(screen.getByText(/Quisiste decir/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Usar" }));
    expect(onUsarSugerencia).toHaveBeenCalled();
  });

  it("envía cada tecla a onCambiar y avisa al salir del campo", () => {
    const onCambiar = jasmine.createSpy("onCambiar");
    const onSalir = jasmine.createSpy("onSalir");
    render(<CampoFormulario {...base} onCambiar={onCambiar} onSalir={onSalir} />);
    const input = screen.getByLabelText(/Correo/);
    fireEvent.change(input, { target: { value: "x@y.cl" } });
    fireEvent.blur(input);
    expect(onCambiar).toHaveBeenCalledWith("x@y.cl");
    expect(onSalir).toHaveBeenCalled();
  });

  it("renderiza un select con las opciones hijas y muestra información extra", () => {
    render(<CampoFormulario {...base} id="motivo" etiqueta="Motivo" tipo="select" resultado={{ info: "Guitarra (4 en stock)" }}>
      <option value="">Elige</option><option value="stock">Stock</option>
    </CampoFormulario>);
    expect(screen.getByLabelText("Motivo").tagName).toBe("SELECT");
    expect(screen.getByText("Guitarra (4 en stock)")).toBeTruthy();
  });

  it("el medidor marca los requisitos cumplidos y calcula el nivel", () => {
    const { container, rerender } = render(<MedidorClave clave="abc" />);
    expect(container.querySelectorAll("li.cumple").length).toBe(1); // solo minúscula
    rerender(<MedidorClave clave="Sonido#2026" />);
    expect(container.querySelectorAll("li.cumple").length).toBe(5);
    expect(screen.getByText("Segura")).toBeTruthy();
    expect(nivelSeguridad(0).variante).toBe("danger");
    expect(nivelSeguridad(3).variante).toBe("warning");
  });
});
