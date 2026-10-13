/* ==========================================================
   useFormulario.js — Hook personalizado que reemplaza al
   "motor genérico" conectarFormulario() de la Parcial 1.

   En vez de escuchar eventos y escribir en el DOM, guarda
   en el ESTADO de React:
     valores     -> lo que escribió la persona (formulario controlado)
     resultados  -> { error, sugerencia, info } de cada campo validado
     resumen     -> lista de errores al intentar enviar
     confirmacion-> mensaje final cuando todo está correcto
   React vuelve a dibujar el formulario cada vez que cambia.

   reglas = { campo: { etiqueta, validar(valor, todosLosValores) } }
   El orden de las claves es el orden del resumen de errores.
   ========================================================== */

import { useState } from "react";

function validarCampo(reglas, campo, valores) {
  return reglas[campo].validar(valores[campo], valores);
}

export function useFormulario(reglas, valoresIniciales) {
  const [valores, setValores] = useState(valoresIniciales);
  const [resultados, setResultados] = useState({});
  const [tocados, setTocados] = useState({});
  const [resumen, setResumen] = useState([]);
  const [confirmacion, setConfirmacion] = useState(null);

  // Revalida los campos ya tocados. Así, si cambia "clave", también
  // se actualiza "clave2"; si cambia "motivo", también "codigo".
  const revalidar = (nuevosValores, nuevosTocados) => {
    const nuevos = {};
    Object.keys(reglas).forEach((campo) => {
      if (nuevosTocados[campo]) nuevos[campo] = validarCampo(reglas, campo, nuevosValores);
    });
    setResultados(nuevos);
  };

  /**
   * Actualiza un valor.
   * Opciones:
   *   tocar        valida de inmediato (selects, casillas, radios)
   *   tocarTambien otros campos que pasan a validarse (ej.: motivo -> codigo)
   *   extras       otros valores que cambian a la vez (ej.: región -> comuna vacía)
   */
  const cambiar = (campo, valor, { tocar = false, tocarTambien = [], extras = {} } = {}) => {
    const nuevosValores = { ...valores, ...extras, [campo]: valor };
    const nuevosTocados = { ...tocados };
    if (tocar && reglas[campo]) nuevosTocados[campo] = true;
    tocarTambien.forEach((c) => { if (reglas[c]) nuevosTocados[c] = true; });
    setValores(nuevosValores);
    setTocados(nuevosTocados);
    setConfirmacion(null);
    revalidar(nuevosValores, nuevosTocados);
    return nuevosValores;
  };

  /** Al salir del campo (blur) se marca como tocado y se valida. */
  const tocar = (campo) => {
    if (!reglas[campo]) return;
    const nuevosTocados = { ...tocados, [campo]: true };
    setTocados(nuevosTocados);
    revalidar(valores, nuevosTocados);
  };

  /** Aplica la sugerencia propuesta por el validador (botón "Usar"). */
  const usarSugerencia = (campo) => {
    const sugerencia = resultados[campo]?.sugerencia;
    if (sugerencia) cambiar(campo, sugerencia.valor, { tocar: true });
  };

  const reiniciar = () => {
    setValores(valoresIniciales);
    setResultados({});
    setTocados({});
    setResumen([]);
  };

  /** Valida todos los campos, muestra los errores y el resumen. Devuelve true si no hay errores. */
  const validarTodo = () => {
    const todos = {};
    const errores = [];
    Object.keys(reglas).forEach((campo) => {
      const r = validarCampo(reglas, campo, valores);
      todos[campo] = r;
      if (r.error) errores.push({ campo, etiqueta: reglas[campo].etiqueta, mensaje: r.error });
    });
    setResultados(todos);
    setTocados(Object.fromEntries(Object.keys(reglas).map((c) => [c, true])));
    setResumen(errores);
    if (errores.length > 0) setConfirmacion(null);
    return errores.length === 0;
  };

  /** Valida todo; si no hay errores llama a alEnviarOk y limpia el formulario. */
  const enviar = (evento, alEnviarOk) => {
    if (evento) evento.preventDefault();
    if (!validarTodo()) return false;
    const mensaje = alEnviarOk(valores); // primero se usan los datos...
    reiniciar(); // ...después se limpia
    setConfirmacion(mensaje);
    return true;
  };

  return { valores, resultados, resumen, confirmacion, cambiar, tocar, usarSugerencia, validarTodo, enviar, reiniciar, setConfirmacion, setValores };
}
