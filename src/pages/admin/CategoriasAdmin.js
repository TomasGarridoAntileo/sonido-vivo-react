/* Categorías en el panel:
   /admin/categorias              listado (Leer y Eliminar)
   /admin/categorias/nueva        Crear
   /admin/categorias/:slug/editar Actualizar */

import React, { useState } from "react";
import { Alert, Button, Card, Form, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import ResumenErrores from "../../components/ResumenErrores";
import { actualizar, crear, eliminar, listar, obtener, productosPorCategoria } from "../../data/baseDatos";
import { useFormulario } from "../../hooks/useFormulario";
import { normalizar } from "../../utils/formato";
import { validarEntero, validarTexto } from "../../utils/validaciones";

/** "Pianos y Teclados" -> "pianos-y-teclados" */
export function crearSlug(nombre) {
  return normalizar(nombre).trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ListaCategoriasAdmin() {
  const [categorias, setCategorias] = useState(() => listar("categorias"));
  const [aviso, setAviso] = useState(null);
  const location = useLocation();
  const mensaje = location.state && location.state.mensaje;

  const borrar = (c) => {
    const cantidad = productosPorCategoria(c.slug).length;
    if (cantidad > 0) {
      setAviso({ tipo: "danger", texto: `No se puede eliminar ${c.nombre}: tiene ${cantidad} productos. Muévelos o elimínalos primero.` });
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría ${c.nombre}?`)) return;
    eliminar("categorias", c.slug);
    setCategorias(listar("categorias"));
    setAviso({ tipo: "warning", texto: `Se eliminó ${c.nombre}.` });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Button as={Link} to="/admin/categorias/nueva" variant="success" size="sm">Nueva categoría</Button>
      </div>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {aviso && <Alert variant={aviso.tipo}>{aviso.texto}</Alert>}
      <Table responsive hover className="bg-white align-middle">
        <thead><tr><th>Nombre</th><th>Subcategorías</th><th className="text-center">Productos</th><th>Acciones</th></tr></thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.slug}>
              <td>{c.nombre}</td>
              <td className="small">{c.subcategorias}</td>
              <td className="text-center">{productosPorCategoria(c.slug).length}</td>
              <td className="text-nowrap">
                <Button as={Link} to={`/admin/categorias/${c.slug}/editar`} size="sm" variant="outline-secondary" className="me-1">Editar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => borrar(c)} aria-label={`Eliminar ${c.nombre}`}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export function FormularioCategoria() {
  const { slug } = useParams();
  const esNueva = !slug;
  const existente = esNueva ? null : obtener("categorias", slug);
  const navigate = useNavigate();
  const nombresExistentes = listar("categorias").map((c) => c.slug);

  const reglas = {
    nombre: {
      etiqueta: "Nombre",
      validar: (v) => {
        const r = validarTexto(v, { campo: "el nombre", min: 3, max: 40 });
        if (!r.error && esNueva && nombresExistentes.includes(crearSlug(v))) return { error: "Ya existe una categoría con ese nombre." };
        return r;
      },
    },
    subcategorias: { etiqueta: "Subcategorías", validar: (v) => validarTexto(v, { campo: "las subcategorías", max: 150, obligatorio: false }) },
    referencias: { etiqueta: "Referencias", validar: (v) => validarEntero(v, { campo: "las referencias", min: 0, max: 9999 }) },
  };
  const form = useFormulario(reglas, existente
    ? { nombre: existente.nombre, subcategorias: existente.subcategorias || "", referencias: String(existente.referencias ?? 0) }
    : { nombre: "", subcategorias: "", referencias: "0" });

  if (!esNueva && !existente) return <p>No existe la categoría {slug}. <Link to="/admin/categorias">Volver</Link></p>;

  const campo = (id) => ({ id, valor: form.valores[id], resultado: form.resultados[id], onCambiar: (v) => form.cambiar(id, v), onSalir: () => form.tocar(id) });

  const guardar = (evento) => {
    evento.preventDefault();
    if (!form.validarTodo()) return;
    const datos = { nombre: form.valores.nombre.trim(), subcategorias: form.valores.subcategorias.trim(), referencias: Number(form.valores.referencias) };
    if (esNueva) crear("categorias", { slug: crearSlug(datos.nombre), ...datos });
    else actualizar("categorias", slug, datos);
    navigate("/admin/categorias", { state: { mensaje: `${esNueva ? "Se creó" : "Se actualizó"} la categoría ${datos.nombre}.` } });
  };

  return (
    <>
      <h1 className="h3">{esNueva ? "Nueva categoría" : `Editar ${existente.nombre}`}</h1>
      <ResumenErrores errores={form.resumen} />
      <Card body style={{ maxWidth: 640 }}>
        <Form noValidate onSubmit={guardar} aria-label={esNueva ? "Nueva categoría" : "Editar categoría"}>
          <CampoFormulario {...campo("nombre")} etiqueta="Nombre" maxLength={40}
            ayuda={esNueva && form.valores.nombre ? `Dirección: /categorias/${crearSlug(form.valores.nombre)}` : undefined} />
          <CampoFormulario {...campo("subcategorias")} etiqueta="Subcategorías" opcional placeholder="Separadas por coma" />
          <CampoFormulario {...campo("referencias")} etiqueta="Referencias en tienda física" inputMode="numeric" />
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">{esNueva ? "Crear categoría" : "Guardar cambios"}</Button>
            <Button as={Link} to="/admin/categorias" variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </Card>
    </>
  );
}
