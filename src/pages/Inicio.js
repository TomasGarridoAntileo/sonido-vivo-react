import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Ecualizador from "../components/Ecualizador";
import GrillaProductos from "../components/GrillaProductos";
import { listar, productosEnOferta } from "../data/baseDatos";

const CODIGOS_DESTACADOS = ["GA001", "GE002", "BT002", "MI001"];

/* PROPS: "carrito" (para saber cuántas unidades hay de cada destacado) y "onAgregar" (viene de App). */
function Inicio({ carrito = [], onAgregar }) {
  // Los datos se leen de la base de datos simulada: si el admin cambia un precio o stock, se ve aquí
  const productos = listar("productos");
  const categorias = listar("categorias");
  const destacados = productos.filter((p) => CODIGOS_DESTACADOS.includes(p.codigo));
  const ofertas = productosEnOferta().slice(0, 4);

  return (
    <>
      <section className="portada" aria-labelledby="titulo-portada">
        <Container>
          <h1 className="portada__titulo" id="titulo-portada">Encuentra el instrumento con el que vas a sonar</h1>
          <p className="portada__texto">
            Guitarras, baterías, teclados, amplificación y equipos de grabación. Revisa el stock en línea,
            arma tu carrito y retira en cualquiera de nuestras tres tiendas.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to="/productos" variant="valvula" size="lg">Ver catálogo</Button>
            <Button as={Link} to="/registro" variant="outline-light" size="lg">Crear cuenta</Button>
          </div>
          <Ecualizador />
        </Container>
      </section>

      <section className="seccion" aria-labelledby="titulo-categorias">
        <Container>
          <h2 id="titulo-categorias">Compra por categoría</h2>
          <p className="seccion__intro">Elige una categoría para ver sus productos en el catálogo.</p>
          {/* Grilla responsiva: 2 columnas en celular, 3 en tablet, 5 en escritorio */}
          <Row as="ul" xs={2} sm={3} lg={5} className="g-3 list-unstyled categorias">
            {categorias.map((c) => (
              <Col as="li" key={c.slug}>
                <Link className="categoria" to={`/categorias/${c.slug}`}>
                  <img src={`/img/categorias/${c.slug}.svg`} alt="" width="44" height="44" />
                  <strong>{c.nombre}</strong>
                  <span>{c.referencias} referencias</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="seccion seccion--blanca" aria-labelledby="titulo-destacados">
        <Container>
          <h2 id="titulo-destacados">Los más pedidos este mes</h2>
          <p className="seccion__intro">
            Una guitarra para partir, una para el escenario, una batería que no molesta a los vecinos y el micrófono que usan casi todos los escenarios.
          </p>
          <GrillaProductos productos={destacados} carrito={carrito} onAgregar={onAgregar} columnas={{ xs: 1, sm: 2, lg: 4 }} />
          <p className="mt-4">
            <Button as={Link} to="/productos" variant="outline-valvula">Ver los {productos.length} productos del catálogo</Button>
          </p>
        </Container>
      </section>

      {ofertas.length > 0 && (
        <section className="seccion" aria-labelledby="titulo-ofertas">
          <Container>
            <h2 id="titulo-ofertas">Ofertas de la semana</h2>
            <p className="seccion__intro">Precios rebajados mientras dure el stock.</p>
            <GrillaProductos productos={ofertas} carrito={carrito} onAgregar={onAgregar} columnas={{ xs: 1, sm: 2, lg: 4 }} />
            <p className="mt-4"><Button as={Link} to="/ofertas" variant="outline-valvula">Ver todas las ofertas</Button></p>
          </Container>
        </section>
      )}

      <aside className="seccion" aria-labelledby="titulo-asesoria">
        <Container>
          <h2 id="titulo-asesoria">¿No sabes qué elegir?</h2>
          <p>Cuéntanos qué tocas y cuánto quieres invertir. Un vendedor músico te responde en menos de 24 horas hábiles.</p>
          <Button as={Link} to="/contacto" variant="valvula">Pedir asesoría</Button>
        </Container>
      </aside>
    </>
  );
}

export default Inicio;
