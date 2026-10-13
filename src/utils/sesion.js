/* ==========================================================
   sesion.js — Usuario que inició sesión, guardado en localStorage.
   Se guarda una copia SIN la contraseña.
   ========================================================== */

export const CLAVE_SESION = "sonido-vivo-sesion";

export function cargarSesion() {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    return texto ? JSON.parse(texto) : null;
  } catch (error) {
    return null;
  }
}

export function guardarSesion(usuario) {
  const { clave, ...sinClave } = usuario;
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sinClave));
  } catch (error) {
    /* sin almacenamiento: la sesión dura mientras la página esté abierta */
  }
  return sinClave;
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (error) {
    /* nada que borrar */
  }
}

export function esAdmin(sesion) {
  return Boolean(sesion && sesion.rol === "admin");
}
