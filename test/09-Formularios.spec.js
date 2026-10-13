/* PRUEBA 9 · Formularios de Registro y Contacto (flujo completo del usuario) */

import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import Contacto from "../src/pages/Contacto";
import Registro from "../src/pages/Registro";
import { renderConRouter } from "./utilidades";

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const salir = (etiqueta) => fireEvent.blur(screen.getByLabelText(etiqueta));

describe("09 · Formularios", () => {
  describe("<Registro>", () => {
    it("al enviar vacío muestra el resumen con los 11 campos pendientes", () => {
      renderConRouter(<Registro />);
      fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
      expect(screen.getByText("Revisa 11 campos antes de continuar")).toBeTruthy();
    });

    it("cada error del resumen lleva el foco a su campo", () => {
      renderConRouter(<Registro />);
      fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
      fireEvent.click(screen.getByRole("link", { name: "RUT" }));
      expect(document.activeElement).toBe(screen.getByLabelText("RUT"));
    });

    it("sugiere el formato del RUT y lo aplica con 'Usar'", () => {
      renderConRouter(<Registro />);
      escribir("RUT", "123456785");
      salir("RUT");
      fireEvent.click(screen.getByRole("button", { name: "Usar" }));
      expect(screen.getByLabelText("RUT").value).toBe("12.345.678-5");
    });

    it("carga las comunas de la región elegida y la vacía si cambia la región", () => {
      renderConRouter(<Registro />);
      const comuna = screen.getByLabelText("Comuna");
      expect(comuna.disabled).toBeTrue();
      escribir("Región", "Valparaíso");
      expect(comuna.disabled).toBeFalse();
      expect(comuna.querySelectorAll("option").length).toBe(6); // 5 comunas + "Selecciona"
      escribir("Comuna", "Viña del Mar");
      escribir("Región", "Maule");
      expect(comuna.value).toBe("");
    });

    it("con todo correcto crea la cuenta y llama al servicio de registro (mock)", () => {
      const servicio = jasmine.createSpy("onRegistrar");
      renderConRouter(<Registro onRegistrar={servicio} />);
      escribir("Nombre completo", "Tomás Pérez");
      escribir("RUT", "12.345.678-5");
      escribir("Fecha de nacimiento", "1998-05-20");
      escribir("Celular", "+56 9 1234 5678");
      escribir("Región", "Región Metropolitana");
      escribir("Comuna", "Providencia");
      escribir("Correo electrónico", "tomas@gmail.com");
      escribir("Contraseña", "Sonido#2026");
      escribir("Repite la contraseña", "Sonido#2026");
      fireEvent.click(screen.getByLabelText("Toco hace un tiempo"));
      fireEvent.click(screen.getByLabelText(/Acepto los términos/));
      fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

      expect(servicio).toHaveBeenCalledTimes(1);
      expect(servicio.calls.mostRecent().args[0].comuna).toBe("Providencia");
      expect(screen.getByText("Cuenta creada")).toBeTruthy();
      expect(screen.getByText("tomas@gmail.com")).toBeTruthy();
      expect(screen.getByLabelText("Nombre completo").value).toBe(""); // se limpió
    });
  });

  describe("<Contacto>", () => {
    it("llega desde el catálogo con el código y el motivo 'stock' ya puestos", () => {
      renderConRouter(<Contacto />, { ruta: "/contacto?codigo=ge002" });
      expect(screen.getByLabelText(/Código del producto/).value).toBe("GE002");
      expect(screen.getByLabelText("Motivo").value).toBe("stock");
    });

    it("el código pasa a ser obligatorio al elegir 'Consulta de stock'", () => {
      renderConRouter(<Contacto />);
      escribir("Motivo", "stock");
      expect(screen.getByText(/Para consultar stock indica el código/)).toBeTruthy();
      escribir(/Código del producto/, "ge2");
      expect(screen.getByLabelText(/Código del producto/).value).toBe("GE2"); // siempre en mayúsculas
    });

    it("cuenta los caracteres del mensaje en vivo", () => {
      renderConRouter(<Contacto />);
      escribir("Mensaje", "Hola, ¿tienen stock?");
      expect(screen.getByTestId("contador-mensaje").textContent).toBe("20 / 500");
    });

    it("con datos válidos envía el mensaje (mock del servicio)", () => {
      const onEnviar = jasmine.createSpy("onEnviar");
      renderConRouter(<Contacto onEnviar={onEnviar} />);
      escribir("Nombre", "Ana Rojas");
      escribir("Correo electrónico", "ana@duocuc.cl");
      escribir("Motivo", "asesoria");
      escribir("Mensaje", "Busco mi primera guitarra eléctrica para tocar rock.");
      fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
      expect(onEnviar).toHaveBeenCalled();
      expect(screen.getByText("Mensaje enviado")).toBeTruthy();
    });
  });
});
