/* Utilidades de formato compartidas por varios componentes. */

const formatoCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

/** 129990 -> "$129.990" */
export function formatearPrecio(valor) {
  return formatoCLP.format(valor);
}

/** Quita tildes y pasa a minúsculas: "Batería" -> "bateria" */
export function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
