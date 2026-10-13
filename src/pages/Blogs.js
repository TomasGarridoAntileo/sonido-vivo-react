/* Blog: /blogs (lista) y /blogs/:id (detalle). */

import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EncabezadoPagina from "../components/EncabezadoPagina";
import { BLOGS } from "../data/semillas";

export function ListaBlogs() {
  return (
    <>
      <EncabezadoPagina titulo="Blog" bajada="Consejos de músicos para músicos." />
      <section className="seccion">
        <Container>
          <Row xs={1} md={2} className="g-4">
            {BLOGS.map((b) => (
              <Col key={b.id}>
                <Card as="article" className="h-100">
                  <Card.Body>
                    <img src={`/img/categorias/${b.categoria}.svg`} alt="" width="48" height="48" className="mb-2" />
                    <Card.Title as="h2" className="h4">{b.titulo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-body-secondary">
                      <time dateTime={b.fecha}>{b.fecha}</time> · {b.autor}
                    </Card.Subtitle>
                    <Card.Text>{b.resumen}</Card.Text>
                    <Button as={Link} to={`/blogs/${b.id}`} variant="outline-valvula">Leer más</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export function DetalleBlog() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === id);

  if (!blog) {
    return (
      <Container className="seccion">
        <h1>Artículo no encontrado</h1>
        <Button as={Link} to="/blogs" variant="valvula">Volver al blog</Button>
      </Container>
    );
  }

  return (
    <>
      <EncabezadoPagina titulo={blog.titulo} miga="Blog" bajada={`${blog.fecha} · ${blog.autor}`} />
      <article className="seccion">
        <Container className="articulo">
          {blog.contenido.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
          <div className="d-flex gap-2 mt-4">
            <Button as={Link} to={`/categorias/${blog.categoria}`} variant="valvula">Ver productos relacionados</Button>
            <Button as={Link} to="/blogs" variant="outline-secondary">Volver al blog</Button>
          </div>
        </Container>
      </article>
    </>
  );
}
