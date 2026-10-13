/* Registro de clientes con React Bootstrap + useFormulario.
   Es un FORMULARIO CONTROLADO: cada input muestra valores.x y
   cada cambio pasa por cambiar(). La validación usa las mismas
   funciones puras de la Parcial 1 (utils/validaciones.js). */

import React from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import CampoFormulario from "../components/CampoFormulario";
import EncabezadoPagina from "../components/EncabezadoPagina";
import MedidorClave from "../components/MedidorClave";
import ResumenErrores from "../components/ResumenErrores";
import { buscarUsuarioPorCorreo, listar, registrarCliente } from "../data/baseDatos";
import { Link } from "react-router-dom";
import { REGIONES } from "../data/regiones";
import { useFormulario } from "../hooks/useFormulario";
import {
  validarClave, validarConfirmacion, validarCorreo, validarFechaNacimiento,
  validarNombre, validarRut, validarSeleccion, validarTelefono,
} from "../utils/validaciones";

export const VALORES_INICIALES_REGISTRO = {
  nombre: "", rut: "", fecha: "", telefono: "", region: "", comuna: "",
  correo: "", clave: "", clave2: "", interes: "", nivel: "", terminos: false, novedades: false,
};

// El orden de las reglas es el orden en que aparecen en el resumen de errores
export const REGLAS_REGISTRO = {
  nombre: { etiqueta: "Nombre completo", validar: (v) => validarNombre(v, { exigirApellido: true }) },
  rut: { etiqueta: "RUT", validar: validarRut },
  fecha: { etiqueta: "Fecha de nacimiento", validar: (v) => validarFechaNacimiento(v) },
  telefono: { etiqueta: "Celular", validar: validarTelefono },
  region: { etiqueta: "Región", validar: validarSeleccion("Elige la región donde quieres retirar tus compras.") },
  comuna: { etiqueta: "Comuna", validar: validarSeleccion("Elige tu comuna.") },
  correo: {
    etiqueta: "Correo",
    validar: (v) => {
      const r = validarCorreo(v);
      if (!r.error && buscarUsuarioPorCorreo(v)) return { error: "Ya existe una cuenta con ese correo. Inicia sesión o usa otro correo." };
      return r;
    },
  },
  clave: { etiqueta: "Contraseña", validar: (v, todos) => validarClave(v, todos.nombre) },
  clave2: { etiqueta: "Repetir contraseña", validar: (v, todos) => validarConfirmacion(v, todos.clave) },
  nivel: { etiqueta: "Nivel como músico", validar: (v) => (v ? {} : { error: "Cuéntanos tu nivel para recomendarte productos adecuados." }) },
  terminos: { etiqueta: "Términos y condiciones", validar: (v) => (v ? {} : { error: "Debes aceptar los términos para crear la cuenta." }) },
};

const NIVELES = [
  { valor: "principiante", texto: "Estoy empezando" },
  { valor: "intermedio", texto: "Toco hace un tiempo" },
  { valor: "profesional", texto: "Toco profesionalmente" },
];

export default function Registro({ onRegistrar }) {
  const form = useFormulario(REGLAS_REGISTRO, VALORES_INICIALES_REGISTRO);
  const { valores, resultados } = form;

  // Atajo: props comunes de cada CampoFormulario
  const campo = (id) => ({
    id,
    valor: valores[id],
    resultado: resultados[id],
    onCambiar: (v) => form.cambiar(id, v),
    onSalir: () => form.tocar(id),
    onUsarSugerencia: () => form.usarSugerencia(id),
  });

  const comunas = valores.region ? REGIONES[valores.region] : [];

  const alEnviar = (e) =>
    form.enviar(e, (datos) => {
      registrarCliente(datos); // CREAR en la base de datos simulada
      if (onRegistrar) onRegistrar(datos); // aviso opcional al padre (en las pruebas es un espía)
      return { nombre: datos.nombre.trim().split(" ")[0], correo: datos.correo.trim() };
    });

  return (
    <>
      <EncabezadoPagina titulo="Crea tu cuenta" miga="Registro" bajada="Con tu cuenta puedes reservar productos y retirarlos en tienda." />
      <section className="seccion" aria-labelledby="titulo-registro">
        <Container>
          <h2 id="titulo-registro" className="visually-hidden">Formulario de registro</h2>

          {form.confirmacion && (
            <Alert variant="success" className="confirmacion" dismissible onClose={() => form.setConfirmacion(null)}>
              <Alert.Heading as="h2" className="h4">Cuenta creada</Alert.Heading>
              <p className="mb-0">
                Bienvenido a Sonido Vivo, {form.confirmacion.nombre}. Tu cuenta <strong>{form.confirmacion.correo}</strong> ya está creada. <Link to="/login">Inicia sesión</Link> para comprar más rápido.
              </p>
            </Alert>
          )}
          <ResumenErrores errores={form.resumen} />

          {/* noValidate: los mensajes los escribe nuestra lógica, no el navegador */}
          <Form noValidate onSubmit={alEnviar} onReset={form.reiniciar} className="formulario" aria-label="Registro">
            <fieldset>
              <legend>Datos personales</legend>
              <Row>
                <Col md={6}><CampoFormulario {...campo("nombre")} etiqueta="Nombre completo" autoComplete="name" maxLength={60} /></Col>
                <Col md={6}><CampoFormulario {...campo("rut")} etiqueta="RUT" placeholder="12.345.678-5" maxLength={12} ayuda="Con o sin puntos. Si termina en K, escríbela al final." /></Col>
                <Col md={6}><CampoFormulario {...campo("fecha")} etiqueta="Fecha de nacimiento" tipo="date" ayuda="Debes ser mayor de 18 años para comprar en línea." /></Col>
                <Col md={6}><CampoFormulario {...campo("telefono")} etiqueta="Celular" tipo="tel" autoComplete="tel" placeholder="+56 9 1234 5678" /></Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend>Dirección de retiro</legend>
              <Row>
                <Col md={6}>
                  <CampoFormulario
                    {...campo("region")}
                    etiqueta="Región"
                    tipo="select"
                    // Al cambiar la región se vacía la comuna (dependencia entre campos)
                    onCambiar={(v) => form.cambiar("region", v, { tocar: true, extras: { comuna: "" } })}
                  >
                    <option value="">Selecciona una región</option>
                    {Object.keys(REGIONES).map((r) => <option key={r} value={r}>{r}</option>)}
                  </CampoFormulario>
                </Col>
                <Col md={6}>
                  <CampoFormulario
                    {...campo("comuna")}
                    etiqueta="Comuna"
                    tipo="select"
                    disabled={!valores.region}
                    onCambiar={(v) => form.cambiar("comuna", v, { tocar: true })}
                  >
                    <option value="">{valores.region ? "Selecciona una comuna" : "Primero elige la región"}</option>
                    {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                  </CampoFormulario>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend>Tu cuenta</legend>
              <CampoFormulario {...campo("correo")} etiqueta="Correo electrónico" tipo="email" autoComplete="email" placeholder="nombre@correo.cl" />
              <Row>
                <Col md={6}>
                  <CampoFormulario {...campo("clave")} etiqueta="Contraseña" tipo="password" autoComplete="new-password" maxLength={20} />
                  <MedidorClave clave={valores.clave} />
                </Col>
                <Col md={6}>
                  <CampoFormulario {...campo("clave2")} etiqueta="Repite la contraseña" tipo="password" autoComplete="new-password" />
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend>Preferencias</legend>
              <Row>
                <Col md={6}>
                  <CampoFormulario {...campo("interes")} etiqueta="Instrumento que más te interesa" tipo="select" opcional>
                    <option value="">Sin preferencia</option>
                    {listar("categorias").map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
                  </CampoFormulario>
                </Col>
                <Col md={6}>
                  <Form.Group className="campo mb-3" role="radiogroup" aria-labelledby="nivel-etiqueta">
                    <p id="nivel-etiqueta" className="form-label fw-semibold mb-1">Nivel como músico</p>
                    {NIVELES.map((n, i) => (
                      <Form.Check
                        key={n.valor}
                        type="radio"
                        id={i === 0 ? "nivel" : `nivel-${n.valor}`}
                        name="nivel"
                        label={n.texto}
                        value={n.valor}
                        checked={valores.nivel === n.valor}
                        isInvalid={Boolean(resultados.nivel?.error)}
                        onChange={(e) => form.cambiar("nivel", e.target.value, { tocar: true })}
                      />
                    ))}
                    {resultados.nivel?.error && <div className="invalid-feedback d-block" role="alert">{resultados.nivel.error}</div>}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="campo mb-2">
                <Form.Check
                  type="checkbox"
                  id="terminos"
                  label="Acepto los términos y condiciones y la política de privacidad."
                  checked={valores.terminos}
                  isInvalid={Boolean(resultados.terminos?.error)}
                  feedback={resultados.terminos?.error}
                  feedbackType="invalid"
                  onChange={(e) => form.cambiar("terminos", e.target.checked, { tocar: true })}
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                id="novedades"
                label="Quiero recibir ofertas y lanzamientos por correo."
                checked={valores.novedades}
                onChange={(e) => form.cambiar("novedades", e.target.checked)}
              />
            </fieldset>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Button type="submit" variant="valvula" size="lg">Crear cuenta</Button>
              <Button type="reset" variant="outline-secondary" size="lg">Limpiar formulario</Button>
            </div>
          </Form>
        </Container>
      </section>
    </>
  );
}
