/* ==========================================================
   baseDatos.js — Fuente de datos SIMULADA (como una base de datos).

   Guarda cuatro "tablas" (colecciones) en localStorage:
     productos  (clave: codigo)
     categorias (clave: slug)
     usuarios   (clave: id)
     ordenes    (clave: numero)

   La primera vez se cargan los datos iniciales (semillas).
   Ofrece funciones CRUD genéricas:
     listar(coleccion)                 -> Leer todos
     obtener(coleccion, id)            -> Leer uno
     crear(coleccion, registro)        -> Crear
     actualizar(coleccion, id, datos)  -> Actualizar
     eliminar(coleccion, id)           -> Eliminar
   y funciones del negocio construidas sobre ellas
   (ofertas, stock crítico, login, órdenes...).

   Los componentes de React llaman a estas funciones y guardan
   el resultado en su estado (useState) para redibujar la vista.
   En la Parcial 3 este archivo se reemplazará por llamadas a la API.
   ========================================================== */

import { CATEGORIAS, PRODUCTOS } from "./productos";
import { ORDENES_INICIALES, USUARIOS_INICIALES } from "./semillas";

const PREFIJO = "sonido-vivo-bd-";

const COLECCIONES = {
  productos: { id: "codigo", semilla: () => PRODUCTOS.map((p) => ({ stockCritico: 3, ...p })) },
  categorias: { id: "slug", semilla: () => CATEGORIAS },
  usuarios: { id: "id", semilla: () => USUARIOS_INICIALES },
  ordenes: { id: "numero", semilla: () => ORDENES_INICIALES },
};

function config(coleccion) {
  const c = COLECCIONES[coleccion];
  if (!c) throw new Error(`No existe la colección "${coleccion}"`);
  return c;
}

/* ---------- Lectura y escritura en localStorage ---------- */

function leer(coleccion) {
  const { semilla } = config(coleccion);
  try {
    const texto = localStorage.getItem(PREFIJO + coleccion);
    if (texto) {
      const datos = JSON.parse(texto);
      if (Array.isArray(datos)) return datos;
    }
  } catch (error) {
    /* sin almacenamiento o datos dañados: se usa la semilla */
  }
  // Copia profunda para no modificar nunca los datos iniciales
  return JSON.parse(JSON.stringify(semilla()));
}

function escribir(coleccion, lista) {
  try {
    localStorage.setItem(PREFIJO + coleccion, JSON.stringify(lista));
  } catch (error) {
    /* modo privado: los cambios duran mientras la página esté abierta */
  }
}

/* ---------- CRUD genérico ---------- */

/** LEER todos los registros de una colección. */
export function listar(coleccion) {
  return leer(coleccion);
}

/** LEER un registro por su identificador (o null si no existe). */
export function obtener(coleccion, id) {
  const campo = config(coleccion).id;
  return leer(coleccion).find((r) => r[campo] === id) || null;
}

/** CREAR un registro. Lanza un error si el identificador ya existe. */
export function crear(coleccion, registro) {
  const campo = config(coleccion).id;
  const lista = leer(coleccion);
  if (!registro[campo]) throw new Error(`Falta el campo "${campo}"`);
  if (lista.some((r) => r[campo] === registro[campo])) {
    throw new Error(`Ya existe un registro con ${campo} "${registro[campo]}"`);
  }
  const nueva = [...lista, registro];
  escribir(coleccion, nueva);
  return registro;
}

/** ACTUALIZAR un registro (solo cambia los campos entregados). */
export function actualizar(coleccion, id, cambios) {
  const campo = config(coleccion).id;
  const lista = leer(coleccion);
  const existente = lista.find((r) => r[campo] === id);
  if (!existente) throw new Error(`No existe un registro con ${campo} "${id}"`);
  const actualizado = { ...existente, ...cambios, [campo]: id }; // el identificador no cambia
  escribir(coleccion, lista.map((r) => (r[campo] === id ? actualizado : r)));
  return actualizado;
}

/** ELIMINAR un registro. Devuelve true si existía. */
export function eliminar(coleccion, id) {
  const campo = config(coleccion).id;
  const lista = leer(coleccion);
  const nueva = lista.filter((r) => r[campo] !== id);
  escribir(coleccion, nueva);
  return nueva.length < lista.length;
}

/** Vuelve todas las colecciones a los datos iniciales. */
export function reiniciarBaseDatos() {
  Object.keys(COLECCIONES).forEach((c) => {
    try {
      localStorage.removeItem(PREFIJO + c);
    } catch (error) {
      /* nada que borrar */
    }
  });
}

/* =========================================================
   Funciones del negocio (usan el CRUD de arriba)
   ========================================================= */

/** Precio que paga el cliente: el de oferta si existe. */
export function precioFinal(producto) {
  return producto.precioOferta && producto.precioOferta < producto.precio ? producto.precioOferta : producto.precio;
}

export function porcentajeDescuento(producto) {
  if (precioFinal(producto) === producto.precio) return 0;
  return Math.round((1 - producto.precioOferta / producto.precio) * 100);
}

export function productosEnOferta() {
  return listar("productos").filter((p) => precioFinal(p) < p.precio);
}

export function productosPorCategoria(slug) {
  return listar("productos").filter((p) => p.slug === slug);
}

/** Productos cuyo stock está en o bajo su stock crítico. */
export function productosCriticos() {
  return listar("productos").filter((p) => p.stock <= (p.stockCritico ?? 3));
}

/* ---------- Usuarios y sesión ---------- */

export function buscarUsuarioPorCorreo(correo) {
  const buscado = correo.trim().toLowerCase();
  return listar("usuarios").find((u) => u.correo.toLowerCase() === buscado) || null;
}

/** Siguiente id disponible: U001, U002, ... */
export function siguienteIdUsuario() {
  const numeros = listar("usuarios").map((u) => Number(u.id.slice(1)) || 0);
  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return "U" + String(siguiente).padStart(3, "0");
}

/** Devuelve el usuario si correo y clave coinciden; si no, null. */
export function validarCredenciales(correo, clave) {
  const usuario = buscarUsuarioPorCorreo(correo);
  return usuario && usuario.clave === clave ? usuario : null;
}

/* ---------- Órdenes ---------- */

export function siguienteNumeroOrden() {
  const numeros = listar("ordenes").map((o) => Number(o.numero) || 0);
  return String((numeros.length ? Math.max(...numeros) : 20260000) + 1);
}

/** Revisa que haya stock para cada ítem. Devuelve la lista de problemas. */
export function verificarStock(items) {
  return items
    .map((item) => {
      const producto = obtener("productos", item.codigo);
      if (!producto) return `${item.nombre} ya no está disponible.`;
      if (producto.stock < item.cantidad) return `Solo quedan ${producto.stock} unidades de ${item.nombre}.`;
      return null;
    })
    .filter(Boolean);
}

/** Descuenta del stock las unidades compradas. */
export function descontarStock(items) {
  items.forEach((item) => {
    const producto = obtener("productos", item.codigo);
    if (producto) actualizar("productos", item.codigo, { stock: producto.stock - item.cantidad });
  });
}

export function ordenesDeUsuario(usuarioId) {
  return listar("ordenes").filter((o) => o.usuarioId === usuarioId);
}

/** Crea un cliente a partir del formulario de registro. */
export function registrarCliente(datos) {
  const partes = datos.nombre.trim().replace(/\s+/g, " ").split(" ");
  return crear("usuarios", {
    id: siguienteIdUsuario(),
    run: datos.rut,
    nombre: partes[0],
    apellidos: partes.slice(1).join(" "),
    correo: datos.correo.trim().toLowerCase(),
    clave: datos.clave,
    rol: "cliente",
    telefono: datos.telefono,
    region: datos.region,
    comuna: datos.comuna,
    direccion: "",
    fechaRegistro: new Date().toISOString().slice(0, 10),
  });
}
