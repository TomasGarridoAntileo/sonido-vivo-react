/* PRUEBA 2 · Lógica del catálogo (búsqueda, filtro y orden) */

import { filtrarProductos, textoStock } from "../src/utils/catalogo";
import { formatearPrecio, normalizar } from "../src/utils/formato";
import { PRODUCTOS } from "../src/data/productos";

describe("02 · Catálogo (utils/catalogo.js y utils/formato.js)", () => {
  const muestra = [
    { codigo: "PE001", nombre: "Pedal Distorsión", marca: "Boss", modelo: "DS-1", categoria: "Pedales de Efectos", slug: "pedales", precio: 59990 },
    { codigo: "BT001", nombre: "Batería Acústica", marca: "Pearl", modelo: "Roadshow", categoria: "Baterías", slug: "baterias", precio: 499990 },
    { codigo: "PE002", nombre: "Afinador de pedal", marca: "Boss", modelo: "TU-3", categoria: "Pedales de Efectos", slug: "pedales", precio: 89990 },
  ];

  it("busca sin importar tildes ni mayúsculas", () => {
    expect(normalizar("Batería")).toBe("bateria");
    expect(filtrarProductos(muestra, { texto: "BATERIA" }).map((p) => p.codigo)).toEqual(["BT001"]);
  });

  it("combina búsqueda por marca con filtro de categoría", () => {
    const r = filtrarProductos(muestra, { texto: "boss", categoria: "pedales" });
    expect(r.length).toBe(2);
  });

  it("ordena por precio sin modificar el arreglo original", () => {
    const copia = [...muestra];
    const r = filtrarProductos(muestra, { orden: "precio-desc" });
    expect(r.map((p) => p.precio)).toEqual([499990, 89990, 59990]);
    expect(muestra).toEqual(copia);
    expect(filtrarProductos(muestra, { orden: "precio-asc" })[0].codigo).toBe("PE001");
    expect(filtrarProductos(muestra, { orden: "nombre" })[0].nombre).toBe("Afinador de pedal");
  });

  it("devuelve lista vacía si nada coincide y todos los productos sin filtros", () => {
    expect(filtrarProductos(muestra, { texto: "violín" })).toEqual([]);
    expect(filtrarProductos(PRODUCTOS).length).toBe(51);
  });

  it("formatea precios en pesos chilenos y describe el stock", () => {
    expect(formatearPrecio(129990)).toBe("$129.990");
    expect(textoStock(0)).toBe("Sin stock");
    expect(textoStock(2)).toBe("Últimas 2");
    expect(textoStock(8)).toBe("8 en stock");
  });
});
