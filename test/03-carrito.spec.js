/* PRUEBA 3 · Reglas del carrito (funciones puras e inmutables) y persistencia */

import {
  agregarAlCarrito, calcularTotales, cambiarCantidad, cantidadEnCarrito,
  cargarCarrito, CLAVE_ALMACENAMIENTO, guardarCarrito, quitarDelCarrito,
} from "../src/utils/carrito";
import { PRODUCTO_PRUEBA, simularLocalStorage } from "./utilidades";

describe("03 · Carrito (utils/carrito.js)", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const items = agregarAlCarrito([], PRODUCTO_PRUEBA);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(1);
  });

  it("suma unidades al repetir y nunca supera el stock", () => {
    let items = agregarAlCarrito([], PRODUCTO_PRUEBA);
    items = agregarAlCarrito(items, PRODUCTO_PRUEBA);
    items = agregarAlCarrito(items, PRODUCTO_PRUEBA); // stock = 2: la tercera no entra
    expect(items[0].cantidad).toBe(2);
    expect(cantidadEnCarrito(items, "GE999")).toBe(2);
    expect(cantidadEnCarrito(items, "XX000")).toBe(0);
  });

  it("no agrega productos sin stock", () => {
    expect(agregarAlCarrito([], { ...PRODUCTO_PRUEBA, stock: 0 })).toEqual([]);
  });

  it("no modifica el arreglo anterior (inmutabilidad)", () => {
    const antes = agregarAlCarrito([], PRODUCTO_PRUEBA);
    const despues = agregarAlCarrito(antes, PRODUCTO_PRUEBA);
    expect(antes[0].cantidad).toBe(1);
    expect(despues).not.toBe(antes);
  });

  it("cambia cantidades respetando el stock, quita con 0 y elimina", () => {
    const items = agregarAlCarrito([], PRODUCTO_PRUEBA);
    expect(cambiarCantidad(items, "GE999", 9)[0].cantidad).toBe(2); // limitado al stock
    expect(cambiarCantidad(items, "GE999", 0)).toEqual([]);
    expect(quitarDelCarrito(items, "GE999")).toEqual([]);
  });

  it("calcula unidades y total", () => {
    const items = [{ precio: 1000, cantidad: 2 }, { precio: 500, cantidad: 1 }];
    expect(calcularTotales(items)).toEqual({ unidades: 3, subtotal: 2500 });
    expect(calcularTotales([])).toEqual({ unidades: 0, subtotal: 0 });
  });

  describe("persistencia en localStorage (mock con spyOn)", () => {
    it("guarda el carrito como texto JSON y lo vuelve a leer", () => {
      const datos = simularLocalStorage();
      guardarCarrito([{ codigo: "A", precio: 1, cantidad: 1 }]);
      expect(localStorage.setItem).toHaveBeenCalledWith(CLAVE_ALMACENAMIENTO, jasmine.any(String));
      expect(JSON.parse(datos[CLAVE_ALMACENAMIENTO]).length).toBe(1);
      expect(cargarCarrito().length).toBe(1);
    });

    it("parte vacío si no hay nada guardado o si los datos están dañados", () => {
      simularLocalStorage();
      expect(cargarCarrito()).toEqual([]);
      localStorage.getItem.and.returnValue("{esto no es json");
      expect(cargarCarrito()).toEqual([]);
    });

    it("no se cae si el navegador bloquea el almacenamiento (modo privado)", () => {
      spyOn(Storage.prototype, "getItem").and.throwError("bloqueado");
      spyOn(Storage.prototype, "setItem").and.throwError("bloqueado");
      expect(cargarCarrito()).toEqual([]);
      expect(() => guardarCarrito([])).not.toThrow();
    });
  });
});
