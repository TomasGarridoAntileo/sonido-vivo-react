/* Nuevo producto (/admin/productos/nuevo) y Editar producto (/admin/productos/:codigo/editar).
   Mismo componente para los dos casos: si la URL trae :codigo, está editando.
   CREAR o ACTUALIZAR en la base de datos simulada. */

import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import ResumenErrores from "../../components/ResumenErrores";
import { actualizar, crear, listar, obtener } from "../../data/baseDatos";
import { useFormulario } from "../../hooks/useFormulario";
import {
  validarCodigoNuevo, validarEntero, validarPrecioOferta, validarSeleccion, validarTexto,
} from "../../utils/validaciones";

export function reglasProducto(esNuevo, codigosExistentes) {
  return {
    codigo: { etiqueta: "Código", validar: (v) => (esNuevo ? validarCodigoNuevo(v, codigosExistentes) : {}) },
    nombre: { etiqueta: "Nombre", validar: (v) => validarTexto(v, { campo: "el nombre", min: 3, max: 60 }) },
    slug: { etiqueta: "Categoría", validar: validarSeleccion("Elige la categoría.") },
    marca: { etiqueta: "Marca", validar: (v) => validarTexto(v, { campo: "la marca", min: 2, max: 30 }) },
    modelo: { etiqueta: "Modelo", validar: (v) => validarTexto(v, { campo: "el modelo", min: 1, max: 30 }) },
    precio: { etiqueta: "Precio", validar: (v) => validarEntero(v, { campo: "el precio", min: 1 }) },
    precioOferta: { etiqueta: "Precio de oferta", validar: (v, todos) => validarPrecioOferta(v, todos.precio) },
    stock: { etiqueta: "Stock", validar: (v) => validarEntero(v, { campo: "el stock", min: 0, max: 9999 }) },
    stockCritico: { etiqueta: "Stock crítico", validar: (v) => validarEntero(v, { campo: "el stock crítico", min: 0, max: 999 }) },
    descripcion: { etiqueta: "Descripción", validar: (v) => validarTexto(v, { campo: "la descripción", min: 10, max: 200 }) },
  };
}

/** Pasa del formulario (todo texto) a un producto con números. */
export function formularioAProducto(v, categorias) {
  const categoria = categorias.find((c) => c.slug === v.slug);
  const producto = {
    codigo: v.codigo.trim().toUpperCase(),
    categoria: categoria ? categoria.nombre : "",
    slug: v.slug,
    nombre: v.nombre.trim(),
    marca: v.marca.trim(),
    modelo: v.modelo.trim(),
    stock: Number(v.stock),
    stockCritico: Number(v.stockCritico),
    precio: Number(v.precio),
    descripcion: v.descripcion.trim(),
  };
  producto.precioOferta = String(v.precioOferta).trim() ? Number(v.precioOferta) : null;
  return producto;
}

function FormularioProducto() {
  const { codigo } = useParams();
  const esNuevo = !codigo;
  const existente = esNuevo ? null : obtener("productos", codigo);
  const categorias = listar("categorias");
  const codigos = listar("productos").map((p) => p.codigo);
  const navigate = useNavigate();

  const inicial = existente
    ? { ...existente, precio: String(existente.precio), precioOferta: existente.precioOferta ? String(existente.precioOferta) : "",
        stock: String(existente.stock), stockCritico: String(existente.stockCritico ?? 3) }
    : { codigo: "", nombre: "", slug: "", marca: "", modelo: "", precio: "", precioOferta: "", stock: "0", stockCritico: "3", descripcion: "" };

  const form = useFormulario(reglasProducto(esNuevo, codigos), inicial);

  if (!esNuevo && !existente) return <p>No existe el producto {codigo}. <Link to="/admin/productos">Volver</Link></p>;

  const campo = (id) => ({
    id,
    valor: form.valores[id],
    resultado: form.resultados[id],
    onCambiar: (v) => form.cambiar(id, id === "codigo" ? v.toUpperCase() : v),
    onSalir: () => form.tocar(id),
  });

  const guardar = (evento) => {
    evento.preventDefault();
    if (!form.validarTodo()) return;
    const producto = formularioAProducto(form.valores, categorias);
    if (esNuevo) crear("productos", producto);
    else actualizar("productos", codigo, producto);
    navigate("/admin/productos", { state: { mensaje: `${esNuevo ? "Se creó" : "Se actualizó"} ${producto.nombre}.` } });
  };

  return (
    <>
      <h1 className="h3">{esNuevo ? "Nuevo producto" : `Editar ${existente.nombre}`}</h1>
      <ResumenErrores errores={form.resumen} />
      <Card body>
        <Form noValidate onSubmit={guardar} aria-label={esNuevo ? "Nuevo producto" : "Editar producto"}>
          <Row>
            <Col md={3}><CampoFormulario {...campo("codigo")} etiqueta="Código" placeholder="GE006" disabled={!esNuevo} maxLength={5}
              ayuda={esNuevo ? "2 letras y 3 números." : "El código no se puede cambiar."} /></Col>
            <Col md={5}><CampoFormulario {...campo("nombre")} etiqueta="Nombre" maxLength={60} /></Col>
            <Col md={4}>
              <CampoFormulario {...campo("slug")} etiqueta="Categoría" tipo="select" onCambiar={(v) => form.cambiar("slug", v, { tocar: true })}>
                <option value="">Selecciona</option>
                {categorias.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
              </CampoFormulario>
            </Col>
            <Col md={6}><CampoFormulario {...campo("marca")} etiqueta="Marca" /></Col>
            <Col md={6}><CampoFormulario {...campo("modelo")} etiqueta="Modelo" /></Col>
            <Col sm={6} md={3}><CampoFormulario {...campo("precio")} etiqueta="Precio ($)" inputMode="numeric" /></Col>
            <Col sm={6} md={3}><CampoFormulario {...campo("precioOferta")} etiqueta="Precio de oferta ($)" opcional inputMode="numeric" /></Col>
            <Col sm={6} md={3}><CampoFormulario {...campo("stock")} etiqueta="Stock" inputMode="numeric" /></Col>
            <Col sm={6} md={3}><CampoFormulario {...campo("stockCritico")} etiqueta="Stock crítico" inputMode="numeric" /></Col>
          </Row>
          <CampoFormulario {...campo("descripcion")} etiqueta="Descripción" tipo="textarea" maxLength={200} />
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">{esNuevo ? "Crear producto" : "Guardar cambios"}</Button>
            <Button as={Link} to="/admin/productos" variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </Card>
    </>
  );
}

export default FormularioProducto;
