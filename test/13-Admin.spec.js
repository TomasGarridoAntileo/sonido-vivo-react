/* PRUEBA 13 · Inicio de sesión y panel de administración (rutas protegidas y CRUD desde la interfaz) */

import React from "react";
import { fireEvent, screen, within } from "@testing-library/react";
import { listar, obtener } from "../src/data/baseDatos";
import { estaActivo } from "../src/pages/admin/LayoutAdmin";
import { iniciarSesionComo, renderApp } from "./utilidades";

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe("13 · Sesión y administración", () => {
  describe("iniciar sesión", () => {
    it("con datos incorrectos muestra un error y no entra", () => {
      renderApp("/login");
      escribir("Correo electrónico", "admin@sonidovivo.cl");
      escribir("Contraseña", "equivocada");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByText(/Correo o contraseña incorrectos/)).toBeTruthy();
      expect(screen.getByLabelText("Correo electrónico").value).toBe("admin@sonidovivo.cl"); // no se borra lo escrito
    });

    it("el administrador entra al panel y la sesión se guarda", () => {
      renderApp("/login");
      escribir("Correo electrónico", "admin@sonidovivo.cl");
      escribir("Contraseña", "Admin#2026");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();
      expect(JSON.parse(localStorage.getItem("sonido-vivo-sesion")).rol).toBe("admin");
      expect(localStorage.getItem("sonido-vivo-sesion")).not.toContain("Admin#2026"); // la clave no se guarda
    });

    it("un cliente vuelve a la tienda, ve su nombre y puede cerrar sesión", () => {
      renderApp("/login");
      escribir("Correo electrónico", "camila@gmail.com");
      escribir("Contraseña", "Cliente#2026");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByTestId("saludo").textContent).toBe("Hola, Camila");
      expect(screen.queryByText("Panel admin")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
      expect(screen.getByText("Iniciar sesión")).toBeTruthy();
    });
  });

  describe("rutas protegidas", () => {
    it("sin sesión o como cliente, /admin redirige al login", () => {
      renderApp("/admin/productos");
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Iniciar sesión");
    });

    it("como cliente tampoco puede entrar", () => {
      iniciarSesionComo("U002");
      renderApp("/admin");
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Iniciar sesión");
    });

    it("el menú marca la sección activa, incluidas sus sub-rutas", () => {
      expect(estaActivo("/admin/productos/GA001/editar", "/admin/productos")).toBeTrue();
      expect(estaActivo("/admin/productos", "/admin")).toBeFalse();
      expect(estaActivo("/admin", "/admin")).toBeTrue();
    });
  });

  describe("panel (con sesión de administrador)", () => {
    beforeEach(() => iniciarSesionComo("U001"));

    it("el dashboard muestra los indicadores leídos de la base de datos", () => {
      renderApp("/admin");
      expect(screen.getByTestId("indicador-productos").textContent).toBe("51");
      expect(screen.getByTestId("indicador-usuarios").textContent).toBe("2");
      expect(screen.getByTestId("indicador-compras").textContent).toBe("1");
    });

    it("crear producto: valida el formulario y luego lo agrega a la tienda", () => {
      renderApp("/admin/productos/nuevo");
      fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));
      expect(screen.getByText(/Revisa 7 campos/)).toBeTruthy();

      escribir(/Código/, "ge006");
      escribir("Nombre", "Guitarra Telecaster");
      escribir("Categoría", "guitarras-electricas");
      escribir("Marca", "Fender");
      escribir("Modelo", "Player Tele");
      escribir("Precio ($)", "899990");
      escribir(/Precio de oferta/, "999990");
      fireEvent.blur(screen.getByLabelText(/Precio de oferta/));
      expect(screen.getByText("El precio de oferta debe ser menor que el precio normal.")).toBeTruthy();
      escribir(/Precio de oferta/, "849990");
      escribir("Stock", "4");
      escribir("Descripción", "Cuerpo de aliso y pastillas Alnico V.");
      fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

      expect(screen.getByText("Se creó Guitarra Telecaster.")).toBeTruthy();
      const nuevo = obtener("productos", "GE006");
      expect(nuevo.precio).toBe(899990);
      expect(nuevo.categoria).toBe("Guitarras Eléctricas");
    });

    it("no permite crear un producto con un código que ya existe", () => {
      renderApp("/admin/productos/nuevo");
      escribir(/Código/, "GA001");
      fireEvent.blur(screen.getByLabelText(/Código/));
      expect(screen.getByText("Ya existe un producto con el código GA001.")).toBeTruthy();
    });

    it("editar producto: carga sus datos y guarda los cambios", () => {
      renderApp("/admin/productos/BT002/editar");
      expect(screen.getByLabelText("Stock").value).toBe("2");
      escribir("Stock", "12");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      expect(obtener("productos", "BT002").stock).toBe(12);
    });

    it("eliminar producto pide confirmación (mock de window.confirm)", () => {
      const confirmar = spyOn(window, "confirm").and.returnValue(false);
      renderApp("/admin/productos");
      fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedal Distorsión" }));
      expect(confirmar).toHaveBeenCalled();
      expect(obtener("productos", "PE001")).not.toBeNull(); // canceló

      confirmar.and.returnValue(true);
      fireEvent.click(screen.getByRole("button", { name: "Eliminar Pedal Distorsión" }));
      expect(obtener("productos", "PE001")).toBeNull();
      expect(screen.queryByRole("button", { name: "Eliminar Pedal Distorsión" })).toBeNull();
    });

    it("no deja eliminar una categoría que tiene productos", () => {
      renderApp("/admin/categorias");
      fireEvent.click(screen.getByRole("button", { name: "Eliminar Baterías" }));
      expect(screen.getByText(/No se puede eliminar Baterías: tiene 5 productos/)).toBeTruthy();
      expect(listar("categorias").length).toBe(10);
    });

    it("crear categoría genera su dirección (slug) a partir del nombre", () => {
      renderApp("/admin/categorias/nueva");
      escribir("Nombre", "Instrumentos de Viento");
      fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
      expect(obtener("categorias", "instrumentos-de-viento").nombre).toBe("Instrumentos de Viento");
    });

    it("mostrar usuario incluye su historial de compras", () => {
      renderApp("/admin/usuarios/U002");
      expect(screen.getByText("Historial de compras (2)")).toBeTruthy();
      const tabla = screen.getByRole("table");
      expect(within(tabla).getByText("20260001")).toBeTruthy();
    });

    it("el administrador no puede eliminarse a sí mismo", () => {
      renderApp("/admin/usuarios");
      fireEvent.click(screen.getByRole("button", { name: "Eliminar Administrador" }));
      expect(screen.getByText(/No puedes eliminar tu propia cuenta/)).toBeTruthy();
    });

    it("mostrar producto, stock crítico y reporte de inventario", () => {
      renderApp("/admin/productos/BT002");
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Batería Electrónica 8 pads");
      expect(screen.getByText("Roland")).toBeTruthy();
    });

    it("stock crítico lista los productos a reponer", () => {
      renderApp("/admin/productos/criticos");
      const filas = screen.getAllByRole("row").slice(1);
      expect(filas.length).toBe(listar("productos").filter((p) => p.stock <= p.stockCritico).length);
      expect(screen.getAllByText("Reponer").length).toBe(filas.length);
    });

    it("reporte de inventario y reportes de ventas", () => {
      renderApp("/admin/productos/reportes");
      expect(screen.getByText(/Valor total del inventario/)).toBeTruthy();
      expect(screen.getAllByRole("row").length).toBe(11); // encabezado + 10 categorías
    });

    it("reportes muestra el total vendido y el producto más vendido", () => {
      renderApp("/admin/reportes");
      expect(screen.getAllByText("$112.960", { selector: "p" }).length).toBe(2); // total vendido y ticket promedio (1 venta)
      expect(screen.getByText(/Pagos aprobados: 50%/)).toBeTruthy();
      expect(screen.getByText("Cuerdas Guitarra Eléctrica 09-42")).toBeTruthy();
    });

    it("órdenes se pueden filtrar por estado", () => {
      renderApp("/admin/ordenes");
      expect(screen.getAllByText("Ver boleta").length).toBe(2);
      escribir("Estado", "pagada");
      expect(screen.getAllByText("Ver boleta").length).toBe(1);
    });

    it("crear usuario valida RUN, correo repetido y contraseña", () => {
      renderApp("/admin/usuarios/nuevo");
      escribir("Nombre", "Pedro");
      escribir("Apellidos", "Soto");
      escribir("RUN", "12.345.678-9");
      escribir("Correo", "camila@gmail.com");
      escribir("Contraseña", "corta");
      fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
      expect(screen.getByText(/Revisa 3 campos/)).toBeTruthy();
      escribir("RUN", "12.345.678-5");
      escribir("Correo", "pedro@gmail.com");
      escribir("Contraseña", "Sonido#2026x");
      fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
      expect(screen.getByText("Se creó a Pedro Soto.")).toBeTruthy();
      expect(listar("usuarios").length).toBe(3);
    });

    it("editar usuario: la contraseña vacía no se cambia", () => {
      renderApp("/admin/usuarios/U002/editar");
      expect(screen.getByLabelText("Correo").value).toBe("camila@gmail.com");
      escribir(/Teléfono/, "+56 9 2222 3333");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      const u = obtener("usuarios", "U002");
      expect(u.telefono).toBe("+56 9 2222 3333");
      expect(u.clave).toBe("Cliente#2026");
    });

    it("perfil: el administrador actualiza sus datos y se refleja en la sesión", () => {
      renderApp("/admin/perfil");
      escribir("Nombre", "Tomás");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      expect(screen.getByText("Tus datos se guardaron.")).toBeTruthy();
      expect(JSON.parse(localStorage.getItem("sonido-vivo-sesion")).nombre).toBe("Tomás");
    });

    it("editar categoría guarda los cambios", () => {
      renderApp("/admin/categorias/pedales/editar");
      escribir(/Subcategorías/, "Distorsión, Delay");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      expect(obtener("categorias", "pedales").subcategorias).toBe("Distorsión, Delay");
    });

    it("la boleta de una orden se puede consultar desde Órdenes", () => {
      renderApp("/admin/ordenes");
      fireEvent.click(screen.getAllByText("Ver boleta")[0]);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Boleta n.º 20260002");
    });
  });
});
