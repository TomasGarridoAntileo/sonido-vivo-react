/* Usuarios en el panel:
   /admin/usuarios             listado (Leer y Eliminar)
   /admin/usuarios/nuevo       Crear
   /admin/usuarios/:id         Mostrar usuario + historial de compras
   /admin/usuarios/:id/editar  Actualizar */

import React, { useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import ResumenErrores from "../../components/ResumenErrores";
import { actualizar, buscarUsuarioPorCorreo, crear, eliminar, listar, obtener, ordenesDeUsuario, siguienteIdUsuario } from "../../data/baseDatos";
import { REGIONES } from "../../data/regiones";
import { useFormulario } from "../../hooks/useFormulario";
import { formatearPrecio } from "../../utils/formato";
import { validarClave, validarCorreo, validarNombre, validarRut, validarSeleccion, validarTexto } from "../../utils/validaciones";
import { EstadoOrden } from "./Ordenes";

export function ListaUsuarios({ sesion }) {
  const [usuarios, setUsuarios] = useState(() => listar("usuarios"));
  const [aviso, setAviso] = useState("");
  const location = useLocation();
  const mensaje = location.state && location.state.mensaje;

  const borrar = (u) => {
    if (sesion && sesion.id === u.id) {
      setAviso("No puedes eliminar tu propia cuenta mientras estás conectado.");
      return;
    }
    if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) return;
    eliminar("usuarios", u.id);
    setUsuarios(listar("usuarios"));
    setAviso(`Se eliminó a ${u.nombre} ${u.apellidos}.`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="success" size="sm">Nuevo usuario</Button>
      </div>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {aviso && <Alert variant="warning">{aviso}</Alert>}
      <Table responsive hover className="bg-white align-middle">
        <thead><tr><th>Nombre</th><th>Correo</th><th>RUN</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.run}</td>
              <td><Badge bg={u.rol === "admin" ? "dark" : "secondary"}>{u.rol === "admin" ? "Administrador" : "Cliente"}</Badge></td>
              <td className="text-nowrap">
                <Button as={Link} to={`/admin/usuarios/${u.id}`} size="sm" variant="outline-primary" className="me-1">Ver</Button>
                <Button as={Link} to={`/admin/usuarios/${u.id}/editar`} size="sm" variant="outline-secondary" className="me-1">Editar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => borrar(u)} aria-label={`Eliminar ${u.nombre}`}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export function MostrarUsuario() {
  const { id } = useParams();
  const u = obtener("usuarios", id);
  if (!u) return <p>No existe el usuario {id}. <Link to="/admin/usuarios">Volver</Link></p>;
  const compras = ordenesDeUsuario(u.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">{u.nombre} {u.apellidos}</h1>
        <div className="d-flex gap-2">
          <Button as={Link} to={`/admin/usuarios/${u.id}/editar`} size="sm">Editar</Button>
          <Button as={Link} to="/admin/usuarios" size="sm" variant="outline-secondary">Volver</Button>
        </div>
      </div>
      <Card body className="mb-4">
        <Row xs={1} md={2}>
          <Col><p className="mb-1"><strong>Correo:</strong> {u.correo}</p><p className="mb-1"><strong>RUN:</strong> {u.run}</p><p className="mb-1"><strong>Rol:</strong> {u.rol}</p></Col>
          <Col><p className="mb-1"><strong>Teléfono:</strong> {u.telefono || "—"}</p><p className="mb-1"><strong>Dirección:</strong> {u.direccion || "—"}, {u.comuna}, {u.region}</p><p className="mb-1"><strong>Registro:</strong> {u.fechaRegistro}</p></Col>
        </Row>
      </Card>
      <h2 className="h5">Historial de compras ({compras.length})</h2>
      {compras.length === 0 ? (
        <p>Este usuario aún no tiene compras.</p>
      ) : (
        <Table responsive hover className="bg-white">
          <thead><tr><th>N.º</th><th>Fecha</th><th className="text-end">Total</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {compras.map((o) => (
              <tr key={o.numero}>
                <td>{o.numero}</td><td>{o.fecha}</td><td className="text-end">{formatearPrecio(o.total)}</td>
                <td><EstadoOrden estado={o.estado} /></td>
                <td><Button as={Link} to={`/admin/ordenes/${o.numero}`} size="sm" variant="outline-primary">Ver boleta</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

/** Reglas del formulario de usuario. La clave solo es obligatoria al crear. */
export function reglasUsuario({ esNuevo, idActual }) {
  return {
    nombre: { etiqueta: "Nombre", validar: (v) => { const r = validarNombre(v); return r.error ? r : {}; } },
    apellidos: { etiqueta: "Apellidos", validar: (v) => validarTexto(v, { campo: "los apellidos", min: 2, max: 60 }) },
    run: { etiqueta: "RUN", validar: (v) => { const r = validarRut(v); return r.error ? r : {}; } },
    correo: {
      etiqueta: "Correo",
      validar: (v) => {
        const r = validarCorreo(v);
        if (r.error) return r;
        const otro = buscarUsuarioPorCorreo(v);
        if (otro && otro.id !== idActual) return { error: "Ese correo ya pertenece a otro usuario." };
        return {};
      },
    },
    rol: { etiqueta: "Rol", validar: validarSeleccion("Elige el rol.") },
    clave: {
      etiqueta: "Contraseña",
      validar: (v, todos) => (esNuevo || v ? validarClave(v, todos.nombre) : {}), // al editar, vacía = no cambia
    },
  };
}

export function FormularioUsuario({ propio = false, sesion = null, onPerfilActualizado }) {
  const params = useParams();
  const id = propio ? sesion && sesion.id : params.id;
  const esNuevo = !id;
  const existente = esNuevo ? null : obtener("usuarios", id);
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState("");

  const form = useFormulario(reglasUsuario({ esNuevo, idActual: id }), existente
    ? { nombre: existente.nombre, apellidos: existente.apellidos, run: existente.run, correo: existente.correo, rol: existente.rol,
        telefono: existente.telefono || "", region: existente.region || "", comuna: existente.comuna || "", direccion: existente.direccion || "", clave: "" }
    : { nombre: "", apellidos: "", run: "", correo: "", rol: "cliente", telefono: "", region: "", comuna: "", direccion: "", clave: "" });

  if (!esNuevo && !existente) return <p>No existe el usuario. <Link to="/admin/usuarios">Volver</Link></p>;

  const campo = (c) => ({ id: c, valor: form.valores[c], resultado: form.resultados[c], onCambiar: (v) => form.cambiar(c, v), onSalir: () => form.tocar(c), onUsarSugerencia: () => form.usarSugerencia(c) });

  const guardar = (evento) => {
    evento.preventDefault();
    if (!form.validarTodo()) return;
    const v = form.valores;
    const datos = {
      nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), run: v.run.trim(), correo: v.correo.trim().toLowerCase(),
      rol: propio ? existente.rol : v.rol, telefono: v.telefono.trim(), region: v.region, comuna: v.comuna, direccion: v.direccion.trim(),
    };
    if (v.clave) datos.clave = v.clave;
    if (esNuevo) {
      crear("usuarios", { id: siguienteIdUsuario(), fechaRegistro: new Date().toISOString().slice(0, 10), ...datos });
      navigate("/admin/usuarios", { state: { mensaje: `Se creó a ${datos.nombre} ${datos.apellidos}.` } });
    } else {
      const actualizado = actualizar("usuarios", id, datos);
      if (propio) {
        if (onPerfilActualizado) onPerfilActualizado(actualizado);
        setGuardado("Tus datos se guardaron.");
      } else {
        navigate("/admin/usuarios", { state: { mensaje: `Se actualizó a ${datos.nombre} ${datos.apellidos}.` } });
      }
    }
  };

  const comunas = form.valores.region ? REGIONES[form.valores.region] : [];
  const titulo = propio ? "Mi perfil" : esNuevo ? "Nuevo usuario" : `Editar ${existente.nombre} ${existente.apellidos}`;

  return (
    <>
      <h1 className="h3">{titulo}</h1>
      {guardado && <Alert variant="success">{guardado}</Alert>}
      <ResumenErrores errores={form.resumen} />
      <Card body>
        <Form noValidate onSubmit={guardar} aria-label={titulo}>
          <Row>
            <Col md={6}><CampoFormulario {...campo("nombre")} etiqueta="Nombre" /></Col>
            <Col md={6}><CampoFormulario {...campo("apellidos")} etiqueta="Apellidos" /></Col>
            <Col md={6}><CampoFormulario {...campo("run")} etiqueta="RUN" placeholder="12.345.678-5" /></Col>
            <Col md={6}><CampoFormulario {...campo("correo")} etiqueta="Correo" tipo="email" /></Col>
            {!propio && (
              <Col md={6}>
                <CampoFormulario {...campo("rol")} etiqueta="Rol" tipo="select" onCambiar={(v) => form.cambiar("rol", v, { tocar: true })}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </CampoFormulario>
              </Col>
            )}
            <Col md={6}><CampoFormulario {...campo("telefono")} etiqueta="Teléfono" opcional /></Col>
            <Col md={6}>
              <CampoFormulario {...campo("region")} etiqueta="Región" tipo="select" opcional onCambiar={(v) => form.cambiar("region", v, { extras: { comuna: "" } })}>
                <option value="">Sin región</option>
                {Object.keys(REGIONES).map((r) => <option key={r} value={r}>{r}</option>)}
              </CampoFormulario>
            </Col>
            <Col md={6}>
              <CampoFormulario {...campo("comuna")} etiqueta="Comuna" tipo="select" opcional disabled={!form.valores.region}>
                <option value="">Sin comuna</option>
                {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
              </CampoFormulario>
            </Col>
            <Col md={6}><CampoFormulario {...campo("direccion")} etiqueta="Dirección" opcional /></Col>
            <Col md={6}>
              <CampoFormulario {...campo("clave")} etiqueta={esNuevo ? "Contraseña" : "Nueva contraseña"} tipo="password" opcional={!esNuevo}
                ayuda={esNuevo ? "8 a 20 caracteres con mayúscula, minúscula, número y símbolo." : "Déjala vacía para no cambiarla."} />
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">{esNuevo ? "Crear usuario" : "Guardar cambios"}</Button>
            {!propio && <Button as={Link} to="/admin/usuarios" variant="outline-secondary">Cancelar</Button>}
          </div>
        </Form>
      </Card>
    </>
  );
}
