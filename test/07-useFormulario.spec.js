/* PRUEBA 7 · Hook personalizado useFormulario (estado del formulario)
   Un hook solo funciona dentro de un componente, así que se crea uno mínimo para probarlo. */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useFormulario } from "../src/hooks/useFormulario";

const REGLAS = {
  nombre: { etiqueta: "Nombre", validar: (v) => (v ? {} : { error: "Falta el nombre" }) },
  clave: { etiqueta: "Clave", validar: (v) => (v.length >= 4 ? {} : { error: "Clave corta" }) },
  clave2: { etiqueta: "Repetir", validar: (v, todos) => (v === todos.clave ? {} : { error: "No coinciden" }) },
  alias: { etiqueta: "Alias", validar: (v) => (v === v.toLowerCase() ? {} : { sugerencia: { texto: "Usa minúsculas", valor: v.toLowerCase() } }) },
};

function FormularioDePrueba({ alEnviarOk }) {
  const f = useFormulario(REGLAS, { nombre: "", clave: "", clave2: "", alias: "" });
  return (
    <form onSubmit={(e) => f.enviar(e, alEnviarOk)}>
      {Object.keys(REGLAS).map((c) => (
        <div key={c}>
          <label htmlFor={c}>{c}</label>
          <input id={c} value={f.valores[c]} onChange={(e) => f.cambiar(c, e.target.value)} onBlur={() => f.tocar(c)} />
          <span data-testid={`error-${c}`}>{f.resultados[c]?.error ?? ""}</span>
          {f.resultados[c]?.sugerencia && <button type="button" onClick={() => f.usarSugerencia(c)}>Usar {c}</button>}
        </div>
      ))}
      <p data-testid="resumen">{f.resumen.length}</p>
      <p data-testid="confirmacion">{f.confirmacion ?? ""}</p>
      <button type="submit">Enviar</button>
    </form>
  );
}

describe("07 · useFormulario (hook personalizado)", () => {
  const escribir = (id, valor) => fireEvent.change(screen.getByLabelText(id), { target: { value: valor } });
  const error = (id) => screen.getByTestId(`error-${id}`).textContent;

  it("no muestra errores mientras la persona escribe por primera vez", () => {
    render(<FormularioDePrueba alEnviarOk={() => "ok"} />);
    escribir("clave", "ab");
    expect(error("clave")).toBe("");
  });

  it("valida al salir del campo y luego en vivo con cada cambio", () => {
    render(<FormularioDePrueba alEnviarOk={() => "ok"} />);
    escribir("clave", "ab");
    fireEvent.blur(screen.getByLabelText("clave"));
    expect(error("clave")).toBe("Clave corta");
    escribir("clave", "abcd");
    expect(error("clave")).toBe("");
  });

  it("revalida un campo dependiente cuando cambia otro (clave -> clave2)", () => {
    render(<FormularioDePrueba alEnviarOk={() => "ok"} />);
    escribir("clave", "abcd");
    escribir("clave2", "abcd");
    fireEvent.blur(screen.getByLabelText("clave2"));
    expect(error("clave2")).toBe("");
    escribir("clave", "abcde");
    expect(error("clave2")).toBe("No coinciden");
  });

  it("aplica la sugerencia con el botón Usar", () => {
    render(<FormularioDePrueba alEnviarOk={() => "ok"} />);
    escribir("alias", "ToMaS");
    fireEvent.blur(screen.getByLabelText("alias"));
    fireEvent.click(screen.getByRole("button", { name: "Usar alias" }));
    expect(screen.getByLabelText("alias").value).toBe("tomas");
  });

  it("al enviar con errores arma el resumen y NO llama a alEnviarOk", () => {
    const alEnviarOk = jasmine.createSpy("alEnviarOk");
    render(<FormularioDePrueba alEnviarOk={alEnviarOk} />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(screen.getByTestId("resumen").textContent).toBe("2"); // nombre y clave
    expect(alEnviarOk).not.toHaveBeenCalled();
  });

  it("al enviar sin errores entrega los datos, muestra confirmación y limpia", () => {
    const alEnviarOk = jasmine.createSpy("alEnviarOk").and.returnValue("Listo");
    render(<FormularioDePrueba alEnviarOk={alEnviarOk} />);
    escribir("nombre", "Ana");
    escribir("clave", "abcd");
    escribir("clave2", "abcd");
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(alEnviarOk).toHaveBeenCalledWith({ nombre: "Ana", clave: "abcd", clave2: "abcd", alias: "" });
    expect(screen.getByTestId("confirmacion").textContent).toBe("Listo");
    expect(screen.getByLabelText("nombre").value).toBe("");
  });
});
