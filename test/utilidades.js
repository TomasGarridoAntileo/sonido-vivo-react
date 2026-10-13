/* Ayudas compartidas por las pruebas de componentes. */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../src/App";
import { CLAVE_SESION } from "../src/utils/sesion";
import { obtener } from "../src/data/baseDatos";

/* Antes de CADA prueba se limpia el localStorage real del navegador de pruebas:
   así la base de datos simulada, el carrito y la sesión parten desde los datos
   iniciales y ninguna prueba depende de lo que dejó otra. */
beforeEach(() => {
  try {
    localStorage.clear();
  } catch (error) {
    /* sin almacenamiento */
  }
});

// Activa ya el comportamiento de React Router v7 (evita avisos en la consola)
export const FUTURO = { v7_startTransition: true, v7_relativeSplatPath: true };

/**
 * Renderiza un componente dentro de un router en memoria (MemoryRouter),
 * abriendo la ruta indicada, por ejemplo "/productos?categoria=pedales".
 */
export function renderConRouter(ui, { ruta = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={FUTURO}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

/**
 * MOCK de localStorage con spyOn de Jasmine.
 * Reemplaza getItem y setItem del navegador por versiones en memoria,
 * para que cada prueba parta con datos conocidos y no ensucie el navegador.
 * Jasmine restaura los métodos originales al terminar cada prueba.
 * Debe llamarse dentro de un it() o beforeEach().
 */
export function simularLocalStorage(inicial = {}) {
  const datos = { ...inicial };
  spyOn(Storage.prototype, "getItem").and.callFake((clave) => (clave in datos ? datos[clave] : null));
  spyOn(Storage.prototype, "setItem").and.callFake((clave, valor) => { datos[clave] = String(valor); });
  return datos;
}

/** Producto de prueba con datos claros (no depende del catálogo real). */
export const PRODUCTO_PRUEBA = {
  codigo: "GE999",
  categoria: "Guitarras Eléctricas",
  slug: "guitarras-electricas",
  nombre: "Guitarra de Prueba",
  marca: "Marca",
  modelo: "Modelo X",
  stock: 2,
  precio: 100000,
  descripcion: "Producto inventado para las pruebas.",
};

/** Dibuja la aplicación completa abriendo una ruta (con barra, rutas anidadas y protegidas). */
export function renderApp(ruta = "/") {
  return render(<MemoryRouter initialEntries={[ruta]} future={FUTURO}><App /></MemoryRouter>);
}

/** Deja una sesión iniciada (por ejemplo "U001" = administrador, "U002" = cliente). */
export function iniciarSesionComo(id) {
  const { clave, ...usuario } = obtener("usuarios", id);
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  return usuario;
}
