/* ==========================================================
   validaciones.js — Funciones PURAS de validación.

   Vienen de la Evaluación Parcial 1 (assets/js/validaciones.js).
   El cambio importante al pasar a React: ya no leen ni escriben
   el DOM. Reciben valores y devuelven un objeto:

     { error?: string, sugerencia?: { texto, valor }, info?: string }

   Así los componentes deciden cómo mostrar el resultado y las
   funciones se pueden probar con Jasmine sin navegador ni HTML.
   ========================================================== */

import { PRODUCTOS } from "../data/productos";

export const DOMINIOS_COMUNES = [
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com",
  "live.cl", "icloud.com", "duocuc.cl", "profesor.duoc.cl",
];

/** Distancia de Levenshtein: cuántas letras hay que cambiar entre dos textos. */
export function distancia(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + costo);
    }
  }
  return m[a.length][b.length];
}

export function capitalizar(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function validarNombre(valor, { exigirApellido = false } = {}) {
  const limpio = valor.trim().replace(/\s+/g, " ");
  if (limpio === "") return { error: "Escribe tu nombre." };
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(limpio)) {
    return { error: "El nombre solo puede tener letras y espacios. Quita números o símbolos." };
  }
  if (limpio.length < 3) return { error: "El nombre debe tener al menos 3 letras." };
  if (exigirApellido && limpio.split(" ").length < 2) {
    return { error: "Escribe tu nombre y al menos un apellido, separados por un espacio." };
  }
  const bonito = capitalizar(limpio);
  if (bonito !== valor) {
    return { sugerencia: { texto: `¿Lo escribimos como "${bonito}"?`, valor: bonito } };
  }
  return {};
}

export function validarCorreo(valor) {
  const correo = valor.trim().toLowerCase();
  if (correo === "") return { error: "Escribe tu correo electrónico." };
  if (!correo.includes("@")) {
    return { error: "Al correo le falta la @. Ejemplo: nombre@gmail.com" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(correo)) {
    return { error: "El correo no tiene un formato válido. Revisa lo que va después de la @ (ejemplo: gmail.com)." };
  }
  const [usuario, dominio] = correo.split("@");
  if (!DOMINIOS_COMUNES.includes(dominio)) {
    const parecido = DOMINIOS_COMUNES.find((d) => distancia(dominio, d) <= 2);
    if (parecido) {
      const propuesta = `${usuario}@${parecido}`;
      return { sugerencia: { texto: `¿Quisiste decir ${propuesta}?`, valor: propuesta } };
    }
  }
  return {};
}

/** Dígito verificador del RUT chileno (módulo 11). */
export function calcularDV(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export function formatearRut(cuerpo, dv) {
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

export function validarRut(valor) {
  const limpio = valor.replace(/[.\-\s]/g, "").toUpperCase();
  if (limpio === "") return { error: "Escribe tu RUT." };
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return { error: "El RUT debe tener 7 u 8 números y un dígito verificador (0-9 o K). Ejemplo: 12.345.678-5" };
  }
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (calcularDV(cuerpo) !== dv) {
    return { error: "El dígito verificador no corresponde a ese RUT. Revisa que no falte ni sobre un número." };
  }
  const formateado = formatearRut(cuerpo, dv);
  if (formateado !== valor) {
    return { sugerencia: { texto: `Formato recomendado: ${formateado}`, valor: formateado } };
  }
  return {};
}

export function validarTelefono(valor) {
  let digitos = valor.replace(/\D/g, "");
  if (digitos === "") return { error: "Escribe un número de celular para avisarte cuando tu pedido esté listo." };
  if (digitos.startsWith("56")) digitos = digitos.slice(2);

  if (digitos.length === 8) {
    const propuesta = `+56 9 ${digitos.slice(0, 4)} ${digitos.slice(4)}`;
    return {
      error: "Faltan dígitos: los celulares en Chile tienen 9 números y empiezan con 9.",
      sugerencia: { texto: `¿Te faltó el 9 inicial? ${propuesta}`, valor: propuesta },
    };
  }
  if (digitos.length !== 9 || !digitos.startsWith("9")) {
    return { error: "El celular debe tener 9 dígitos y comenzar con 9. Ejemplo: +56 9 1234 5678" };
  }
  const formateado = `+56 ${digitos[0]} ${digitos.slice(1, 5)} ${digitos.slice(5)}`;
  if (formateado !== valor) {
    return { sugerencia: { texto: `Formato recomendado: ${formateado}`, valor: formateado } };
  }
  return {};
}

/** Calcula la edad cumplida a una fecha dada. */
export function calcularEdad(nacimiento, hoy) {
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad--;
  return edad;
}

/**
 * @param {string} valor  fecha "AAAA-MM-DD" del <input type="date">
 * @param {Date}   hoy    se puede inyectar para probar con una fecha fija
 */
export function validarFechaNacimiento(valor, hoy = new Date()) {
  if (valor === "") return { error: "Indica tu fecha de nacimiento." };
  const nacimiento = new Date(valor + "T00:00:00");
  if (Number.isNaN(nacimiento.getTime())) return { error: "La fecha no es válida." };
  if (nacimiento > hoy) return { error: "La fecha de nacimiento no puede ser posterior a hoy." };

  const edad = calcularEdad(nacimiento, hoy);
  if (edad < 18) {
    return { error: `Tienes ${edad} años. Para comprar en línea debes ser mayor de 18; un adulto responsable puede crear la cuenta.` };
  }
  if (edad > 110) return { error: "Revisa el año: la fecha indica más de 110 años." };
  return {};
}

export const REGLAS_CLAVE = {
  largo: (c) => c.length >= 8 && c.length <= 20,
  mayuscula: (c) => /[A-ZÁÉÍÓÚÑ]/.test(c),
  minuscula: (c) => /[a-záéíóúñ]/.test(c),
  numero: (c) => /\d/.test(c),
  especial: (c) => /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(c),
};

export const NOMBRE_REGLA = {
  largo: "entre 8 y 20 caracteres",
  mayuscula: "una mayúscula",
  minuscula: "una minúscula",
  numero: "un número",
  especial: "un símbolo",
};

/** Cuántas de las 5 reglas cumple la contraseña (para el medidor). */
export function contarReglasCumplidas(clave) {
  return Object.values(REGLAS_CLAVE).filter((regla) => regla(clave)).length;
}

export function validarClave(valor, nombre = "") {
  if (valor === "") return { error: "Crea una contraseña." };
  const faltan = Object.keys(REGLAS_CLAVE).filter((r) => !REGLAS_CLAVE[r](valor));
  if (faltan.length > 0) {
    return { error: "A tu contraseña le falta: " + faltan.map((r) => NOMBRE_REGLA[r]).join(", ") + "." };
  }
  const primerNombre = nombre.trim().split(" ")[0].toLowerCase();
  if (primerNombre.length >= 3 && valor.toLowerCase().includes(primerNombre)) {
    return { error: "No uses tu nombre dentro de la contraseña: es lo primero que alguien intentaría." };
  }
  return {};
}

export function validarConfirmacion(valor, clave) {
  if (valor === "") return { error: "Repite la contraseña para confirmarla." };
  if (valor !== clave) return { error: "Las contraseñas no coinciden. Revisa mayúsculas y minúsculas." };
  return {};
}

export function validarSeleccion(mensaje) {
  return (valor) => (valor === "" ? { error: mensaje } : {});
}

/**
 * Código de producto: 2 letras + 3 números (formato de la planilla).
 * @param {string} valor
 * @param {string} motivo     si es "stock", el código es obligatorio
 * @param {Array}  productos  catálogo donde buscar (se puede reemplazar por un mock en las pruebas)
 */
export function validarCodigoProducto(valor, motivo, productos = PRODUCTOS) {
  const codigo = valor.trim().toUpperCase();
  const esStock = motivo === "stock";

  if (codigo === "") {
    return esStock ? { error: "Para consultar stock indica el código del producto (por ejemplo GE002)." } : {};
  }

  const existe = productos.find((p) => p.codigo === codigo);
  if (existe) {
    return { info: `${existe.nombre} ${existe.marca} ${existe.modelo} (${existe.stock} en stock)` };
  }

  // "ge2", "GE02" o "ge-002" -> GE002
  const partes = codigo.replace(/[^A-Z0-9]/g, "").match(/^([A-Z]{2})(\d{1,3})$/);
  if (partes) {
    const propuesto = partes[1] + partes[2].padStart(3, "0");
    const producto = productos.find((p) => p.codigo === propuesto);
    if (producto) {
      return {
        error: "El código debe tener 2 letras y 3 números.",
        sugerencia: { texto: `¿Buscas ${propuesto}, ${producto.nombre} ${producto.marca}?`, valor: propuesto },
      };
    }
  }
  if (!/^[A-Z]{2}\d{3}$/.test(codigo)) {
    return { error: "El código tiene 2 letras y 3 números, por ejemplo GA001. Lo ves en cada producto del catálogo." };
  }
  return { error: `No tenemos un producto con el código ${codigo}. Revísalo en el catálogo.` };
}

export function validarMensaje(valor) {
  const largo = valor.trim().length;
  if (largo === 0) return { error: "Escribe tu mensaje." };
  if (largo < 20) return { error: `Tu mensaje tiene ${largo} caracteres. Escribe al menos 20 para que podamos ayudarte.` };
  if (largo > 500) return { error: "El mensaje supera los 500 caracteres." };
  return {};
}

/* =========================================================
   Validaciones de los formularios del panel de administración
   ========================================================= */

/** Texto obligatorio con largo mínimo y máximo. */
export function validarTexto(valor, { campo, min = 1, max = 200, obligatorio = true }) {
  const limpio = String(valor ?? "").trim();
  if (limpio === "") return obligatorio ? { error: `Escribe ${campo}.` } : {};
  if (limpio.length < min) return { error: `${capitalizar(campo)} debe tener al menos ${min} caracteres.` };
  if (limpio.length > max) return { error: `${capitalizar(campo)} no puede superar los ${max} caracteres.` };
  return {};
}

/** Número entero dentro de un rango (precios, stock). */
export function validarEntero(valor, { campo, min = 0, max = 100000000, obligatorio = true }) {
  const texto = String(valor ?? "").trim();
  if (texto === "") return obligatorio ? { error: `Indica ${campo}.` } : {};
  if (!/^\d+$/.test(texto)) return { error: `${capitalizar(campo)} debe ser un número entero, sin puntos ni signos.` };
  const n = Number(texto);
  if (n < min) return { error: `${capitalizar(campo)} debe ser al menos ${min}.` };
  if (n > max) return { error: `${capitalizar(campo)} no puede superar ${max}.` };
  return {};
}

/** Código de un producto NUEVO: formato AA000 y que no exista. */
export function validarCodigoNuevo(valor, codigosExistentes) {
  const codigo = valor.trim().toUpperCase();
  if (codigo === "") return { error: "Escribe el código del producto." };
  if (!/^[A-Z]{2}\d{3}$/.test(codigo)) return { error: "El código tiene 2 letras y 3 números, por ejemplo GE006." };
  if (codigosExistentes.includes(codigo)) return { error: `Ya existe un producto con el código ${codigo}.` };
  return {};
}

/** Precio de oferta: opcional, pero si se indica debe ser menor que el precio normal. */
export function validarPrecioOferta(valor, precio) {
  const r = validarEntero(valor, { campo: "el precio de oferta", min: 1, obligatorio: false });
  if (r.error || String(valor ?? "").trim() === "") return r;
  if (Number(valor) >= Number(precio)) return { error: "El precio de oferta debe ser menor que el precio normal." };
  return {};
}
