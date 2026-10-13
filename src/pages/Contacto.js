import React from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import EncabezadoPagina from "../components/EncabezadoPagina";
import ResumenErrores from "../components/ResumenErrores";
import { useFormulario } from "../hooks/useFormulario";
import {
  validarCodigoProducto, validarCorreo, validarMensaje, validarNombre, validarSeleccion,
} from "../utils/validaciones";

export const MOTIVOS = [
  { valor: "cotizacion", texto: "Cotización" },
  { valor: "stock", texto: "Consulta de stock" },
  { valor: "tecnico", texto: "Servicio técnico" },
  { valor: "asesoria", texto: "Asesoría para elegir" },
  { valor: "otro", texto: "Otro" },
];

export const REGLAS_CONTACTO = {
  nombre: { etiqueta: "Nombre", validar: (v) => validarNombre(v) },
  correo: { etiqueta: "Correo", validar: validarCorreo },
  motivo: { etiqueta: "Motivo", validar: validarSeleccion("Elige el motivo para derivar tu mensaje a la persona correcta.") },
  // El código depende de otro campo: es obligatorio solo si el motivo es "stock"
  codigo: { etiqueta: "Código del producto", validar: (v, todos) => validarCodigoProducto(v, todos.motivo) },
  mensaje: { etiqueta: "Mensaje", validar: validarMensaje },
};

function Contacto({ onEnviar }) {
  // Si viene desde el catálogo: /contacto?codigo=GE002
  const location = useLocation();
  const codigoUrl = (new URLSearchParams(location.search).get("codigo") || "").toUpperCase();

  const form = useFormulario(REGLAS_CONTACTO, {
    nombre: "", correo: "", motivo: codigoUrl ? "stock" : "", codigo: codigoUrl, mensaje: "",
  });
  const { valores, resultados } = form;

  const campo = (id) => ({
    id,
    valor: valores[id],
    resultado: resultados[id],
    onCambiar: (v) => form.cambiar(id, v),
    onSalir: () => form.tocar(id),
    onUsarSugerencia: () => form.usarSugerencia(id),
  });

  const largo = valores.mensaje.length;

  const alEnviar = (e) =>
    form.enviar(e, (datos) => {
      if (onEnviar) onEnviar(datos);
      return { nombre: datos.nombre.trim().split(" ")[0], correo: datos.correo.trim() };
    });

  return (
    <>
      <EncabezadoPagina titulo="Contacto" bajada="Cotizaciones, consultas de stock, servicio técnico o asesoría." />
      <section className="seccion" aria-labelledby="titulo-contacto">
        <Container>
          <Row className="g-5">
            <Col lg={8}>
              <h2 id="titulo-contacto">Escríbenos</h2>
              {form.confirmacion && (
                <Alert variant="success" className="confirmacion" dismissible onClose={() => form.setConfirmacion(null)}>
                  <Alert.Heading as="h2" className="h4">Mensaje enviado</Alert.Heading>
                  <p className="mb-0">
                    Gracias, {form.confirmacion.nombre}. Te responderemos a <strong>{form.confirmacion.correo}</strong> en menos de 24 horas hábiles.
                  </p>
                </Alert>
              )}
              <ResumenErrores errores={form.resumen} />

              <Form noValidate onSubmit={alEnviar} className="formulario" aria-label="Contacto">
                <Row>
                  <Col md={6}><CampoFormulario {...campo("nombre")} etiqueta="Nombre" autoComplete="name" maxLength={60} /></Col>
                  <Col md={6}><CampoFormulario {...campo("correo")} etiqueta="Correo electrónico" tipo="email" autoComplete="email" placeholder="nombre@correo.cl" /></Col>
                  <Col md={6}>
                    <CampoFormulario
                      {...campo("motivo")}
                      etiqueta="Motivo"
                      tipo="select"
                      // Si cambia el motivo, el código puede pasar a ser obligatorio
                      onCambiar={(v) => form.cambiar("motivo", v, { tocar: true, tocarTambien: valores.codigo || v === "stock" ? ["codigo"] : [] })}
                    >
                      <option value="">Selecciona un motivo</option>
                      {MOTIVOS.map((m) => <option key={m.valor} value={m.valor}>{m.texto}</option>)}
                    </CampoFormulario>
                  </Col>
                  <Col md={6}>
                    <CampoFormulario
                      {...campo("codigo")}
                      etiqueta="Código del producto"
                      opcional={valores.motivo !== "stock"}
                      maxLength={6}
                      placeholder="Ej: GE002"
                      ayuda="Lo encuentras en cada producto del catálogo."
                      onCambiar={(v) => form.cambiar("codigo", v.toUpperCase())}
                    />
                  </Col>
                </Row>
                <CampoFormulario {...campo("mensaje")} etiqueta="Mensaje" tipo="textarea" maxLength={500} />
                <p className={`contador ${largo > 450 ? "al-limite" : ""}`} data-testid="contador-mensaje">{largo} / 500</p>
                <Button type="submit" variant="valvula" size="lg">Enviar mensaje</Button>
              </Form>
            </Col>

            <Col as="aside" lg={4} className="datos-contacto" aria-label="Otros canales de contacto">
              <h2>Otros canales</h2>
              <dl>
                <dt>Teléfono</dt><dd><a href="tel:+56222334455">+56 2 2233 4455</a></dd>
                <dt>Correo</dt><dd><a href="mailto:contacto@sonidovivo.cl">contacto@sonidovivo.cl</a></dd>
                <dt>Servicio técnico</dt><dd>Solo en casa matriz, de lunes a viernes.</dd>
                <dt>Sucursales</dt><dd><Link to="/nosotros">Ver direcciones y horarios</Link></dd>
              </dl>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Contacto;
