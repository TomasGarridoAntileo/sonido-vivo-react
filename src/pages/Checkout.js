/* Checkout (paso de pago): /checkout
   El cliente revisa su compra, ingresa sus datos y la dirección de entrega,
   elige la opción de entrega y paga (pasarela SIMULADA en esta etapa).
   Si inició sesión, sus datos se completan automáticamente.
   PROPS (desde App): items del carrito, sesion y onCompraExitosa (vacía el carrito). */

import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import EncabezadoPagina from "../components/EncabezadoPagina";
import ResumenErrores from "../components/ResumenErrores";
import TablaItems from "../components/TablaItems";
import { REGIONES } from "../data/regiones";
import { useFormulario } from "../hooks/useFormulario";
import { calcularTotales } from "../utils/carrito";
import { calcularEnvio, OPCIONES_ENTREGA, procesarCompra } from "../utils/compra";
import { formatearPrecio } from "../utils/formato";
import { validarCorreo, validarNombre, validarSeleccion, validarTexto } from "../utils/validaciones";

export const REGLAS_CHECKOUT = {
  nombre: { etiqueta: "Nombre", validar: (v) => { const r = validarNombre(v); return r.error ? r : {}; } },
  apellidos: { etiqueta: "Apellidos", validar: (v) => validarTexto(v, { campo: "tus apellidos", min: 2, max: 60 }) },
  correo: { etiqueta: "Correo", validar: (v) => { const r = validarCorreo(v); return r.error ? r : {}; } },
  entrega: { etiqueta: "Opción de entrega", validar: validarSeleccion("Elige cómo quieres recibir tu compra.") },
  // La calle solo es obligatoria si se pide despacho a domicilio (campo dependiente)
  calle: {
    etiqueta: "Calle",
    validar: (v, todos) => validarTexto(v, { campo: "la calle y número", min: 3, max: 80, obligatorio: todos.entrega === "despacho" }),
  },
  region: { etiqueta: "Región", validar: validarSeleccion("Elige la región.") },
  comuna: { etiqueta: "Comuna", validar: validarSeleccion("Elige la comuna.") },
  indicaciones: { etiqueta: "Indicaciones", validar: (v) => validarTexto(v, { campo: "las indicaciones", max: 200, obligatorio: false }) },
  pago: { etiqueta: "Resultado del pago", validar: validarSeleccion("Elige el resultado de la pasarela de pago simulada.") },
};

/** Valores iniciales: si hay sesión, se completan con los datos del usuario. */
export function valoresDesdeSesion(sesion) {
  return {
    nombre: sesion ? sesion.nombre : "",
    apellidos: sesion ? sesion.apellidos : "",
    correo: sesion ? sesion.correo : "",
    entrega: "despacho",
    calle: sesion ? sesion.direccion || "" : "",
    departamento: "",
    region: sesion ? sesion.region || "" : "",
    comuna: sesion ? sesion.comuna || "" : "",
    indicaciones: "",
    pago: "",
  };
}

function Checkout({ items = [], sesion = null, onCompraExitosa }) {
  const form = useFormulario(REGLAS_CHECKOUT, valoresDesdeSesion(sesion));
  const navigate = useNavigate();
  const { valores, resultados } = form;
  const { subtotal } = calcularTotales(items);
  const envio = calcularEnvio(valores.entrega, subtotal);
  const total = subtotal + envio;

  if (items.length === 0) {
    return (
      <>
        <EncabezadoPagina titulo="Pago" miga="Checkout" />
        <Container className="seccion">
          <p>No tienes productos en el carrito.</p>
          <Button as={Link} to="/productos" variant="valvula">Ir al catálogo</Button>
        </Container>
      </>
    );
  }

  const campo = (id) => ({
    id,
    valor: valores[id],
    resultado: resultados[id],
    onCambiar: (v) => form.cambiar(id, v),
    onSalir: () => form.tocar(id),
    onUsarSugerencia: () => form.usarSugerencia(id),
  });

  const pagar = (evento) => {
    evento.preventDefault();
    if (!form.validarTodo()) return;
    const orden = procesarCompra({
      items,
      datos: valores,
      usuarioId: sesion ? sesion.id : null,
      pagoAprobado: valores.pago === "aprobar",
    });
    if (orden.estado === "pagada") {
      if (onCompraExitosa) onCompraExitosa(orden);
      navigate(`/compra/exitosa/${orden.numero}`);
    } else {
      navigate(`/compra/error/${orden.numero}`); // el carrito se mantiene para reintentar
    }
  };

  const comunas = valores.region ? REGIONES[valores.region] : [];

  return (
    <>
      <EncabezadoPagina titulo="Pago" miga="Checkout" bajada="Completa tus datos y la dirección de entrega." />
      <section className="seccion">
        <Container className="contenedor-medio">
          <Card body className="mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h2 className="h4 mb-0">Tu compra</h2>
              <span className="badge bg-primary fs-6" data-testid="total-checkout">Total a pagar: {formatearPrecio(total)}</span>
            </div>
            <TablaItems items={items} />
            <p className="mb-0 text-end small">
              Productos {formatearPrecio(subtotal)} · Envío {envio ? formatearPrecio(envio) : "gratis"}
            </p>
          </Card>

          {!sesion && (
            <Alert variant="light">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link> y tus datos se completan solos.</Alert>
          )}
          <ResumenErrores errores={form.resumen} />

          <Form noValidate onSubmit={pagar} className="formulario" aria-label="Checkout">
            <fieldset>
              <legend>Información del cliente</legend>
              <Row>
                <Col md={6}><CampoFormulario {...campo("nombre")} etiqueta="Nombre" autoComplete="given-name" /></Col>
                <Col md={6}><CampoFormulario {...campo("apellidos")} etiqueta="Apellidos" autoComplete="family-name" /></Col>
                <Col md={6}><CampoFormulario {...campo("correo")} etiqueta="Correo" tipo="email" autoComplete="email" /></Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend>Entrega</legend>
              <Form.Group className="mb-3" role="radiogroup" aria-labelledby="titulo-entrega">
                <p id="titulo-entrega" className="form-label fw-semibold mb-1">Opción de entrega</p>
                {OPCIONES_ENTREGA.map((o) => (
                  <Form.Check
                    key={o.valor}
                    type="radio"
                    id={`entrega-${o.valor}`}
                    name="entrega"
                    value={o.valor}
                    label={`${o.texto}${o.costo ? ` · ${formatearPrecio(o.costo)}` : ""}`}
                    checked={valores.entrega === o.valor}
                    onChange={(e) => form.cambiar("entrega", e.target.value, { tocar: true, tocarTambien: ["calle"] })}
                  />
                ))}
              </Form.Group>
              <Row>
                <Col md={8}>
                  <CampoFormulario {...campo("calle")} etiqueta="Calle y número" opcional={valores.entrega !== "despacho"} autoComplete="street-address" />
                </Col>
                <Col md={4}>
                  <CampoFormulario {...campo("departamento")} etiqueta="Departamento" opcional placeholder="Ej: 603" />
                </Col>
                <Col md={6}>
                  <CampoFormulario {...campo("region")} etiqueta="Región" tipo="select"
                    onCambiar={(v) => form.cambiar("region", v, { tocar: true, extras: { comuna: "" } })}>
                    <option value="">Selecciona una región</option>
                    {Object.keys(REGIONES).map((r) => <option key={r} value={r}>{r}</option>)}
                  </CampoFormulario>
                </Col>
                <Col md={6}>
                  <CampoFormulario {...campo("comuna")} etiqueta="Comuna" tipo="select" disabled={!valores.region}
                    onCambiar={(v) => form.cambiar("comuna", v, { tocar: true })}>
                    <option value="">{valores.region ? "Selecciona una comuna" : "Primero elige la región"}</option>
                    {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                  </CampoFormulario>
                </Col>
              </Row>
              <CampoFormulario {...campo("indicaciones")} etiqueta="Indicaciones para la entrega" tipo="textarea" opcional
                placeholder="Ej: entre calles, color del edificio, no tiene timbre." maxLength={200} />
            </fieldset>

            <fieldset className="pasarela">
              <legend>Pasarela de pago (simulada)</legend>
              <p className="small text-body-secondary mb-2">
                En esta etapa no hay conexión con un banco. Elige el resultado para probar los dos caminos de la compra.
              </p>
              {[{ valor: "aprobar", texto: "Pago aprobado" }, { valor: "rechazar", texto: "Pago rechazado" }].map((o) => (
                <Form.Check
                  key={o.valor}
                  inline
                  type="radio"
                  id={`pago-${o.valor}`}
                  name="pago"
                  value={o.valor}
                  label={o.texto}
                  checked={valores.pago === o.valor}
                  isInvalid={Boolean(resultados.pago && resultados.pago.error)}
                  onChange={(e) => form.cambiar("pago", e.target.value, { tocar: true })}
                />
              ))}
              {resultados.pago && resultados.pago.error && <div className="invalid-feedback d-block" role="alert">{resultados.pago.error}</div>}
            </fieldset>

            <div className="text-end">
              <Button type="submit" variant="success" size="lg">Pagar ahora {formatearPrecio(total)}</Button>
            </div>
          </Form>
        </Container>
      </section>
    </>
  );
}

export default Checkout;
