/* PRUEBA 1 · Lógica de validación (funciones puras)
   Verifica las reglas de negocio de la Parcial 1 que ahora usan los componentes React. */

import {
  calcularDV, distancia, validarClave, validarCodigoProducto, validarConfirmacion,
  validarCorreo, validarFechaNacimiento, validarMensaje, validarNombre, validarRut, validarTelefono,
} from "../src/utils/validaciones";

describe("01 · Validaciones (utils/validaciones.js)", () => {
  describe("RUT", () => {
    it("calcula el dígito verificador con módulo 11, incluido el caso K", () => {
      expect(calcularDV("12345678")).toBe("5");
      expect(calcularDV("11111111")).toBe("1");
      expect(calcularDV("10000013")).toBe("K");
    });

    it("rechaza un RUT con dígito verificador incorrecto", () => {
      expect(validarRut("12.345.678-9").error).toContain("dígito verificador");
    });

    it("acepta un RUT válido sin formato y sugiere el formato con puntos y guion", () => {
      const r = validarRut("123456785");
      expect(r.error).toBeUndefined();
      expect(r.sugerencia.valor).toBe("12.345.678-5");
    });

    it("no muestra nada cuando el RUT ya está bien escrito", () => {
      expect(validarRut("12.345.678-5")).toEqual({});
    });
  });

  describe("Correo", () => {
    it("pide la @ cuando falta", () => {
      expect(validarCorreo("tomas.gmail.com").error).toContain("@");
    });

    it("sugiere el dominio correcto si está mal escrito (distancia de Levenshtein)", () => {
      expect(distancia("gmial.com", "gmail.com")).toBe(2);
      expect(validarCorreo("tomas@gmial.com").sugerencia.valor).toBe("tomas@gmail.com");
    });
  });

  describe("Nombre y celular", () => {
    it("exige apellido y propone mayúsculas iniciales", () => {
      expect(validarNombre("Tomás", { exigirApellido: true }).error).toContain("apellido");
      expect(validarNombre("tomás pérez", { exigirApellido: true }).sugerencia.valor).toBe("Tomás Pérez");
      expect(validarNombre("Tomás3").error).toContain("solo puede tener letras");
    });

    it("detecta el 9 faltante del celular y lo sugiere", () => {
      const r = validarTelefono("12345678");
      expect(r.error).toContain("Faltan dígitos");
      expect(r.sugerencia.valor).toBe("+56 9 1234 5678");
    });
  });

  describe("Fecha de nacimiento (con fecha fija)", () => {
    // La función recibe "hoy" como parámetro. En la app se usa la fecha real;
    // en la prueba se entrega una fecha FIJA para que el resultado sea siempre el mismo,
    // sin importar el día en que se ejecute.
    const HOY = new Date(2026, 9, 10); // 10 de octubre de 2026

    it("rechaza a un menor de 18 e indica su edad", () => {
      expect(validarFechaNacimiento("2010-01-01", HOY).error).toContain("Tienes 16 años");
    });

    it("acepta a quien cumple 18 justo hoy, y rechaza a quien los cumple mañana", () => {
      expect(validarFechaNacimiento("2008-10-10", HOY)).toEqual({});
      expect(validarFechaNacimiento("2008-10-11", HOY).error).toContain("17 años");
    });

    it("rechaza fechas futuras y fechas vacías", () => {
      expect(validarFechaNacimiento("2030-01-01", HOY).error).toContain("posterior a hoy");
      expect(validarFechaNacimiento("", HOY).error).toContain("Indica tu fecha");
    });
  });

  describe("Contraseña y mensaje", () => {
    it("lista los requisitos que faltan y no permite usar el nombre", () => {
      expect(validarClave("abc").error).toContain("una mayúscula");
      expect(validarClave("Tomas#2026", "Tomás Pérez").error).toBeUndefined(); // "Tomás" con tilde ≠ "tomas"
      expect(validarClave("Perez#2026x", "Perez Soto").error).toContain("No uses tu nombre");
      expect(validarConfirmacion("Clave#123", "Clave#124").error).toContain("no coinciden");
    });

    it("valida el largo del mensaje de contacto", () => {
      expect(validarMensaje("Hola").error).toContain("4 caracteres");
      expect(validarMensaje("Quiero saber si tienen stock de la guitarra.")).toEqual({});
    });
  });

  describe("Código de producto (catálogo simulado)", () => {
    // MOCK DE DATOS: se reemplaza el catálogo real por uno pequeño y conocido
    const catalogoFalso = [{ codigo: "GE002", nombre: "Les Paul", marca: "Epiphone", modelo: "Std", stock: 4 }];

    it("es obligatorio solo si el motivo es consulta de stock", () => {
      expect(validarCodigoProducto("", "stock", catalogoFalso).error).toContain("indica el código");
      expect(validarCodigoProducto("", "cotizacion", catalogoFalso)).toEqual({});
    });

    it("completa códigos incompletos y muestra el stock de los que existen", () => {
      expect(validarCodigoProducto("ge2", "stock", catalogoFalso).sugerencia.valor).toBe("GE002");
      expect(validarCodigoProducto("GE002", "stock", catalogoFalso).info).toContain("4 en stock");
      expect(validarCodigoProducto("ZZ999", "stock", catalogoFalso).error).toContain("No tenemos");
    });
  });
});
