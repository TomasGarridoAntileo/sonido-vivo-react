/* PRUEBA 11 · Base de datos simulada (data/baseDatos.js): CRUD y reglas del negocio */

import {
  actualizar, crear, descontarStock, eliminar, listar, obtener, porcentajeDescuento, precioFinal,
  productosCriticos, productosEnOferta, registrarCliente, reiniciarBaseDatos, siguienteIdUsuario,
  siguienteNumeroOrden, validarCredenciales, verificarStock,
} from "../src/data/baseDatos";
import { PRODUCTO_PRUEBA } from "./utilidades";

describe("11 · Base de datos simulada (CRUD)", () => {
  describe("CRUD genérico", () => {
    it("LEER: parte con los datos iniciales del Excel", () => {
      expect(listar("productos").length).toBe(51);
      expect(listar("categorias").length).toBe(10);
      expect(obtener("productos", "GE002").nombre).toBe("Guitarra Eléctrica Les Paul");
      expect(obtener("productos", "XX999")).toBeNull();
    });

    it("CREAR: agrega un registro y lo guarda en localStorage", () => {
      crear("productos", PRODUCTO_PRUEBA);
      expect(listar("productos").length).toBe(52);
      expect(localStorage.getItem("sonido-vivo-bd-productos")).toContain("GE999");
    });

    it("CREAR: rechaza identificadores repetidos o vacíos", () => {
      expect(() => crear("productos", { ...PRODUCTO_PRUEBA, codigo: "GA001" })).toThrowError(/Ya existe/);
      expect(() => crear("productos", { nombre: "Sin código" })).toThrowError(/Falta el campo/);
      expect(() => listar("mascotas")).toThrowError(/No existe la colección/);
    });

    it("ACTUALIZAR: cambia solo los campos entregados y no el identificador", () => {
      const r = actualizar("productos", "GA001", { precio: 99990, codigo: "ZZ000" });
      expect(r.precio).toBe(99990);
      expect(r.codigo).toBe("GA001");
      expect(obtener("productos", "GA001").marca).toBe("Yamaha");
      expect(() => actualizar("productos", "XX999", {})).toThrowError(/No existe/);
    });

    it("ELIMINAR: quita el registro y avisa si no existía", () => {
      expect(eliminar("productos", "GA001")).toBeTrue();
      expect(obtener("productos", "GA001")).toBeNull();
      expect(eliminar("productos", "GA001")).toBeFalse();
    });

    it("reiniciar vuelve a los datos iniciales", () => {
      eliminar("productos", "GA001");
      reiniciarBaseDatos();
      expect(obtener("productos", "GA001")).not.toBeNull();
    });

    it("no se cae si localStorage está bloqueado (usa los datos iniciales en memoria)", () => {
      spyOn(Storage.prototype, "getItem").and.throwError("bloqueado");
      spyOn(Storage.prototype, "setItem").and.throwError("bloqueado");
      expect(listar("productos").length).toBe(51);
      expect(() => crear("productos", PRODUCTO_PRUEBA)).not.toThrow();
    });
  });

  describe("reglas del negocio", () => {
    it("precio final y descuento de las ofertas", () => {
      expect(precioFinal({ precio: 100000, precioOferta: 80000 })).toBe(80000);
      expect(precioFinal({ precio: 100000, precioOferta: null })).toBe(100000);
      expect(precioFinal({ precio: 100000, precioOferta: 120000 })).toBe(100000); // una "oferta" más cara no cuenta
      expect(porcentajeDescuento({ precio: 100000, precioOferta: 80000 })).toBe(20);
      expect(productosEnOferta().length).toBe(5);
    });

    it("stock crítico: productos con stock igual o menor a su mínimo", () => {
      const antes = productosCriticos().length;
      actualizar("productos", "AC001", { stock: 1 });
      expect(productosCriticos().length).toBe(antes + 1);
      expect(productosCriticos().every((p) => p.stock <= p.stockCritico)).toBeTrue();
    });

    it("verifica y descuenta stock al comprar", () => {
      expect(verificarStock([{ codigo: "BT002", nombre: "Batería", cantidad: 5 }])[0]).toContain("Solo quedan 2");
      expect(verificarStock([{ codigo: "XX999", nombre: "Fantasma", cantidad: 1 }])[0]).toContain("ya no está disponible");
      descontarStock([{ codigo: "GA001", cantidad: 3 }]);
      expect(obtener("productos", "GA001").stock).toBe(5);
    });

    it("login: solo con correo y clave correctos (sin importar mayúsculas del correo)", () => {
      expect(validarCredenciales("ADMIN@sonidovivo.cl", "Admin#2026").rol).toBe("admin");
      expect(validarCredenciales("admin@sonidovivo.cl", "otra")).toBeNull();
      expect(validarCredenciales("nadie@gmail.com", "Admin#2026")).toBeNull();
    });

    it("registro de clientes con id correlativo y números de orden", () => {
      expect(siguienteIdUsuario()).toBe("U003");
      const u = registrarCliente({ nombre: "Tomás Garrido Antileo", rut: "12.345.678-5", correo: "Tomas@Duocuc.cl", clave: "Sonido#2026", telefono: "+56 9 1234 5678", region: "Maule", comuna: "Talca" });
      expect(u.id).toBe("U003");
      expect(u.apellidos).toBe("Garrido Antileo");
      expect(u.correo).toBe("tomas@duocuc.cl");
      expect(u.rol).toBe("cliente");
      expect(siguienteNumeroOrden()).toBe("20260003");
    });
  });
});
