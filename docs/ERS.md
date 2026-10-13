# Especificación de Requisitos de Software (ERS)

**Sistema:** Sonido Vivo, tienda en línea de instrumentos musicales
**Asignatura:** DSY1104 Desarrollo Fullstack II · Caso semestral, Forma B
**Autor:** Tomás Garrido Antileo · Sección 006D
**Versión:** 2.0 (propuesta terminada para la Evaluación Parcial 2)
**Fecha:** octubre de 2026

## Historial de versiones

| Versión | Entrega | Cambios |
|---|---|---|
| 1.0 | Evaluación Parcial 1 | Sitio estático en HTML5, CSS externo y validaciones en JavaScript |
| 2.0 | Evaluación Parcial 2 | Migración a React y React Bootstrap; base de datos simulada con CRUD y persistencia en localStorage; nuevas vistas (detalle de producto, categorías, ofertas, blog, inicio de sesión, checkout, pago correcto y con error); panel de administración; pruebas unitarias con Jasmine y Karma |

---

## 1. Introducción

### 1.1 Propósito

Este documento describe qué debe hacer el frontend de Sonido Vivo y con qué condiciones de calidad. Sirve de referencia al desarrollador, al docente que evalúa y a quien continúe el proyecto en la Parcial 3 (backend).

### 1.2 Alcance

El sistema es una aplicación web de una sola página (SPA) que permite:

**Tienda (pública):**

- Revisar el catálogo, buscar, filtrar por categoría, ver ofertas y el detalle de cada producto.
- Armar un carrito y **comprar**: checkout con datos del cliente, dirección y opción de entrega, y resultado del pago (correcto o con error) con boleta.
- Registrarse, iniciar sesión (los datos se completan solos al comprar), leer el blog y enviar consultas.

**Panel de administración (solo rol administrador):**

- Dashboard con indicadores, órdenes y boletas, productos (crear, ver, editar, eliminar, stock crítico y reporte de inventario), categorías, usuarios (con historial de compras), reportes de ventas y perfil.

**Datos:** un archivo JavaScript (`src/data/baseDatos.js`) actúa como **base de datos simulada**, con funciones **CRUD** y persistencia en `localStorage`. Los componentes la leen y la modifican, y la interfaz se actualiza al instante.

**Fuera de alcance en esta versión:** cobro real con un banco (la pasarela de pago es simulada), envío de correos y la API del backend. Se integrarán en la Parcial 3.

### 1.3 Definiciones

| Término | Significado |
|---|---|
| SPA | Aplicación de una sola página: cambia de vista sin recargar el navegador |
| Componente | Pieza de interfaz de React que recibe **props** y puede tener **estado** |
| Props | Datos que un componente recibe de su padre (solo lectura) |
| Estado | Datos que un componente guarda y que, al cambiar, vuelven a dibujar la interfaz |
| Orden | Registro de una compra (pagada o rechazada) con su boleta |
| CRUD | Crear, Leer (Read), Actualizar (Update) y Eliminar (Delete) registros |
| Referencia | Cada modelo distinto del catálogo (340 en total según la planilla) |

### 1.4 Referencias

- Planilla del caso: `DSY1104 - Forma B - Catalogo Sonido Vivo.xlsx` (10 categorías y 51 productos de muestra).
- Enunciado de la Evaluación Parcial 2 de DSY1104.
- ERS versión 1.0 (Parcial 1).

## 2. Descripción general

### 2.1 Perspectiva del producto

Sonido Vivo tiene tres tiendas físicas (Providencia, Maipú y Viña del Mar) y más de 340 referencias. Hoy los clientes llaman o escriben para preguntar stock. El sitio les permite verlo en línea y comprar con despacho o retiro en tienda, y al personal le da un panel para mantener el catálogo y revisar las ventas.

### 2.2 Usuarios

| Usuario | Necesidad principal |
|---|---|
| Visitante | Ver qué hay, a qué precio y en qué stock; ver ofertas |
| Cliente registrado | Comprar con despacho o retiro, sin volver a escribir sus datos |
| Músico que no sabe qué elegir | Leer el blog y pedir asesoría a un vendedor |
| Administrador | Mantener productos, precios, stock, categorías y usuarios; revisar órdenes y reportes |

### 2.3 Restricciones

| Código | Restricción |
|---|---|
| RS01 | El frontend se construye con **React** (Create React App), **React Router** y **React Bootstrap**, usando la materia de la unidad 2 |
| RS02 | Las pruebas unitarias se escriben con **Jasmine** y se ejecutan con **Karma** |
| RS03 | El código se versiona en un repositorio **GitHub** público con historial de commits por funcionalidad |
| RS04 | Debe funcionar en las versiones actuales de Chrome, Edge y Firefox, en celular, tablet y escritorio |
| RS05 | Los datos del catálogo provienen de la planilla del caso |

### 2.4 Supuestos

- Los datos iniciales salen de la planilla del caso; después se modifican desde el panel y se guardan en `localStorage`. En la Parcial 3 se leerán desde el backend.
- Cuentas de demostración: `admin@sonidovivo.cl` / `Admin#2026` (administrador) y `camila@gmail.com` / `Cliente#2026` (cliente). Son datos de prueba de un proyecto académico.
- La pasarela de pago es simulada: el usuario elige "aprobado" o "rechazado" para probar ambos caminos.

## 3. Requisitos funcionales

Prioridad: **A** = esencial, **M** = importante, **B** = deseable.

### 3.1 Navegación y estructura

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF01 | La barra tiene buscador, Inicio, Productos, Categorías (menú desplegable), Ofertas, Nosotros, Blog, Contacto, Carrito con su total, e Iniciar sesión / Crear cuenta (o el nombre del usuario y Cerrar sesión); marca la página actual | A | `BarraNavegacion` |
| RF02 | La navegación entre páginas no recarga el navegador (SPA con React Router) | A | `App` |
| RF03 | En pantallas menores a 992 px el menú se colapsa en un botón | A | `BarraNavegacion` |
| RF04 | La barra muestra la cantidad de unidades del carrito y se actualiza al agregar | A | `App` (estado), `BarraNavegacion` (props) |
| RF05 | Una dirección inexistente muestra una página "no encontrada" con enlace al inicio | M | `NoEncontrada` |
| RF06 | Todas las páginas comparten el mismo pie con datos de contacto y enlaces | M | `PiePagina` |

### 3.2 Catálogo

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF07 | La portada muestra las 10 categorías (cada una abre su vista), los productos destacados y las ofertas | A | `Inicio` |
| RF08 | El catálogo lista los 51 productos con código, categoría, nombre, marca, modelo, descripción, precio en pesos y stock | A | `Productos`, `TarjetaProducto` |
| RF09 | Se puede buscar por nombre, marca, modelo o código, sin importar tildes ni mayúsculas | A | `FiltrosCatalogo`, `filtrarProductos` |
| RF10 | Se puede filtrar por categoría y ordenar por precio (ascendente o descendente) o por nombre | A | `FiltrosCatalogo`, `filtrarProductos` |
| RF11 | Se indica cuántos productos coinciden y se muestra un mensaje de ayuda si no hay resultados | M | `Productos` |
| RF12 | El stock se muestra en verde, en rojo si quedan 2 o menos ("Últimas 2") y en gris si no hay | M | `TarjetaProducto` |
| RF13 | El nombre de cada producto lleva a su detalle; desde el detalle, "Consultar" abre Contacto con el código ya escrito | B | `TarjetaProducto`, `DetalleProducto`, `Contacto` |

### 3.3 Carrito de compras

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF14 | Se puede agregar un producto al carrito desde la portada o el catálogo | A | `TarjetaProducto`, `agregarAlCarrito` |
| RF15 | No se puede agregar más unidades que el stock disponible; el botón cambia a "Máximo en carrito" o "Sin stock" | A | `agregarAlCarrito`, `TarjetaProducto` |
| RF16 | En el carrito se puede aumentar, disminuir y eliminar productos, o vaciarlo | A | `Carrito`, `ItemCarrito` |
| RF17 | El carrito muestra el total a pagar en pesos chilenos | A | `Carrito`, `calcularTotales` |
| RF18 | El carrito se conserva al recargar la página o cerrar el navegador | M | `App`, `cargarCarrito` / `guardarCarrito` (localStorage) |
| RF19 | "Comprar ahora" lleva al checkout; el carrito indica cuánto falta para el despacho gratis | A | `Carrito` |

### 3.4 Registro de clientes

| ID | Requisito | Prioridad |
|---|---|---|
| RF20 | Nombre completo con al menos un apellido; solo letras; sugiere mayúsculas iniciales | A |
| RF21 | RUT válido con dígito verificador (módulo 11); sugiere el formato 12.345.678-5 | A |
| RF22 | Fecha de nacimiento: mayor de 18 años y no futura; el error indica la edad calculada | A |
| RF23 | Celular chileno de 9 dígitos que comienza con 9; si falta el 9 lo sugiere | A |
| RF24 | Región y comuna; las comunas dependen de la región elegida | A |
| RF25 | Correo válido; si el dominio parece mal escrito (gmial.com) sugiere el correcto | A |
| RF26 | Contraseña de 8 a 20 caracteres con mayúscula, minúscula, número y símbolo, sin contener el nombre; muestra un medidor y la lista de requisitos en vivo | A |
| RF27 | Repetir contraseña debe coincidir; se revalida si cambia la contraseña | A |
| RF28 | Nivel como músico obligatorio; instrumento de interés y suscripción opcionales | M |
| RF29 | Aceptar términos y condiciones es obligatorio | A |
| RF30 | Al enviar con errores se muestra un resumen con enlaces a cada campo; si todo está bien, un mensaje de bienvenida y el formulario se limpia | A |

### 3.5 Contacto

| ID | Requisito | Prioridad |
|---|---|---|
| RF31 | Nombre, correo, motivo y mensaje son obligatorios | A |
| RF32 | Si el motivo es "Consulta de stock", el código de producto pasa a ser obligatorio | A |
| RF33 | El código se escribe siempre en mayúsculas; si existe, se muestra el producto y su stock; si está incompleto (ge2) se sugiere el código correcto (GE002) | M |
| RF34 | El mensaje debe tener entre 20 y 500 caracteres y muestra un contador en vivo | M |

### 3.6 Reglas comunes de validación

- Cada campo se valida **al salir de él** y, después, **mientras se escribe**, para que el error desaparezca apenas se corrige.
- Los mensajes dicen qué está mal y cómo corregirlo. Las **sugerencias** se aplican con un botón "Usar".
- Los formularios usan `noValidate`: los mensajes son propios y en español, no los genéricos del navegador.

### 3.7 Nuevas vistas de la tienda (Anexo 1)

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF35 | Detalle de producto en `/productos/:codigo`: imagen, precio (con oferta si aplica), stock, botón para agregar y productos relacionados | A | `DetalleProducto` (`useParams`) |
| RF36 | Vista Categorías en `/categorias` con todas las categorías, y en `/categorias/:slug` con los productos de la elegida | A | `Categorias` |
| RF37 | Vista Ofertas con todos los productos que tienen precio rebajado; se muestra el precio anterior tachado y el % de descuento | A | `Ofertas`, `PrecioProducto` |
| RF38 | Blog con lista de artículos y detalle de cada uno (2 artículos) | M | `ListaBlogs`, `DetalleBlog` |
| RF39 | El buscador de la barra abre el catálogo filtrado por el texto (`/productos?q=texto`) | M | `BarraNavegacion`, `Productos` |
| RF40 | Iniciar sesión con correo y contraseña; si son incorrectos se muestra un error sin borrar lo escrito; el administrador entra al panel y el cliente vuelve a la tienda | A | `IniciarSesion` |
| RF41 | El registro crea la cuenta en la base de datos y no permite correos repetidos | A | `Registro`, `registrarCliente` |
| RF42 | **Checkout:** muestra la compra y el total; pide nombre, apellidos, correo, opción de entrega (despacho o retiro), calle (obligatoria solo con despacho), departamento, región, comuna e indicaciones; si hay sesión, los datos se completan solos | A | `Checkout` |
| RF43 | Despacho a domicilio de $4.990, gratis desde $200.000 o con retiro en tienda | M | `calcularEnvio` |
| RF44 | **Pago correcto:** se crea la orden "pagada", se descuenta el stock, se vacía el carrito y se muestra la boleta con su número y la opción de imprimirla | A | `ResultadoCompra`, `procesarCompra` |
| RF45 | **Pago con error:** se crea la orden "rechazada" con el motivo (banco o falta de stock), el carrito se mantiene y hay un botón para volver a pagar | A | `ResultadoCompra`, `procesarCompra` |

### 3.8 Panel de administración (Anexo 1, Figura 10)

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF46 | Las rutas `/admin/*` solo son accesibles para usuarios con rol administrador; si no, redirigen a Iniciar sesión | A | `RutaAdmin` |
| RF47 | Dashboard con compras, productos, inventario, usuarios y accesos a cada módulo | A | `Dashboard` |
| RF48 | Órdenes: listado con filtro por estado y "Mostrar boleta" con opción de imprimir | A | `ListaOrdenes`, `MostrarBoleta` |
| RF49 | Productos: listado con búsqueda; **crear**, **mostrar**, **editar** y **eliminar** (con confirmación), con validaciones (código único AA000, precio de oferta menor al normal, enteros no negativos) | A | `ListaProductosAdmin`, `FormularioProducto`, `MostrarProducto` |
| RF50 | Listado de productos críticos (stock igual o menor a su stock crítico) y reporte de inventario por categoría | M | `ProductosCriticos`, `ReporteProductos` |
| RF51 | Categorías: crear (la dirección se genera desde el nombre), editar y eliminar; no se elimina una categoría con productos | A | `ListaCategoriasAdmin`, `FormularioCategoria` |
| RF52 | Usuarios: crear, mostrar (con **historial de compras**), editar (la contraseña vacía no se cambia) y eliminar; el administrador no puede eliminarse a sí mismo | A | `ListaUsuarios`, `MostrarUsuario`, `FormularioUsuario` |
| RF53 | Reportes: total vendido, órdenes pagadas y rechazadas, ticket promedio y productos más vendidos | M | `Reportes` |
| RF54 | Perfil: el administrador edita sus propios datos y la sesión se actualiza | M | `FormularioUsuario` (modo perfil) |

### 3.9 Datos y persistencia

| ID | Requisito | Prioridad | Componente |
|---|---|---|---|
| RF55 | Un archivo JavaScript actúa como base de datos simulada con 4 colecciones: productos, categorías, usuarios y órdenes | A | `data/baseDatos.js` |
| RF56 | Funciones **CRUD** genéricas: `listar`, `obtener`, `crear` (rechaza identificadores repetidos), `actualizar` y `eliminar` | A | `data/baseDatos.js` |
| RF57 | Los cambios se guardan en `localStorage` y se ven al instante en la tienda (por ejemplo, un precio editado en el panel o el stock descontado tras una compra) | A | `baseDatos.js` + componentes |

## 4. Requisitos no funcionales

| ID | Categoría | Requisito | Cómo se verifica |
|---|---|---|---|
| RNF01 | Responsividad | La interfaz se adapta a celular (≥ 360 px), tablet (768 px) y escritorio (≥ 992 px) con la grilla de Bootstrap: catálogo en 1, 2, 3 y 4 columnas | Capturas en `docs/capturas/` y modo dispositivo de DevTools |
| RNF02 | Usabilidad | Todo formulario indica errores en el campo y en un resumen; nada se pierde al corregir | Pruebas 07 y 09 |
| RNF03 | Accesibilidad | Etiquetas asociadas a cada campo, `aria-describedby` para errores, `aria-current` en el menú, foco visible, enlace "Saltar al contenido", textos alternativos y respeto a `prefers-reduced-motion` | Pruebas 06 y 08; revisión con Lighthouse |
| RNF04 | Rendimiento | Compilación optimizada con Create React App (`npm run build`); la aplicación completa pesa unos 110 KB de JavaScript comprimido | `npm run build` |
| RNF05 | Mantenibilidad | Lógica de negocio en funciones puras (`utils/`), separada de la vista; componentes reutilizables con props | Revisión de código |
| RNF06 | Calidad | Pruebas unitarias con Jasmine y Karma; cobertura mínima de 80% de sentencias, funciones y líneas, y 70% de ramas; si baja, la ejecución falla | `npm test`, `docs/COBERTURA.md` |
| RNF07 | Robustez | Si el navegador no permite guardar (modo privado), el carrito sigue funcionando en memoria | Prueba 03 |
| RNF08 | Portabilidad | Ejecutable en Windows, macOS, Linux y en una instancia EC2 (puerto 3000) | `npm start` |
| RNF09 | Seguridad | Los datos ingresados se muestran como texto (React escapa el HTML), lo que evita inyección de scripts. La validación del cliente no reemplaza la del servidor (Parcial 3) | Revisión de código |

## 5. Diseño de la solución

### 5.1 Arquitectura y rutas

```
index.js → BrowserRouter → App   (estado: carrito y sesion)

TIENDA (ruta layout con BarraNavegacion y PiePagina)
  /                         Inicio
  /productos                Productos (?categoria= y ?q=)
  /productos/:codigo        DetalleProducto (useParams)
  /categorias[/:slug]       Categorias (useParams)
  /ofertas                  Ofertas
  /nosotros  /contacto      Nosotros, Contacto
  /registro  /login         Registro, IniciarSesion
  /blogs  /blogs/:id        ListaBlogs, DetalleBlog
  /carrito                  Carrito
  /checkout                 Checkout (useFormulario)
  /compra/exitosa/:numero   ResultadoCompra (pago correcto)
  /compra/error/:numero     ResultadoCompra (pago con error)
  *                         NoEncontrada

ADMINISTRACIÓN /admin  (RutaAdmin + LayoutAdmin con <Outlet />)
  (index)                   Dashboard
  ordenes, ordenes/:numero  ListaOrdenes, MostrarBoleta
  productos, productos/nuevo, productos/:codigo,
  productos/:codigo/editar, productos/criticos,
  productos/reportes        CRUD de productos y reportes
  categorias, categorias/nueva, categorias/:slug/editar
  usuarios, usuarios/nuevo, usuarios/:id, usuarios/:id/editar
  reportes, perfil
```

Los componentes siguen la idea de **Atomic Design** vista en clase y el principio de **responsabilidad única** que pide el Anexo 1: átomos (`Button`, `Badge`), moléculas (`CampoFormulario`, `PrecioProducto`, `ItemCarrito`), organismos (`BarraNavegacion`, `TarjetaProducto`, `GrillaProductos`, `DetalleOrden`, `TablaItems`) y páginas.

### 5.2 Manejo del estado y de los datos

| Dato | Dónde vive | Por qué ahí |
|---|---|---|
| Ítems del carrito | `App` (`useState`), guardado en `localStorage` | Lo usan la barra, la portada, el catálogo, el carrito y el checkout: se pone en el padre común y se reparte por **props** |
| Sesión | `App` (`useState`), guardada en `localStorage` sin la contraseña | La usan la barra, el checkout y la protección del panel |
| Productos, categorías, usuarios, órdenes | Base de datos simulada (`baseDatos.js` + `localStorage`) | Es la "fuente de verdad": las vistas la leen al dibujarse; el panel la modifica con el CRUD |
| Listas del panel (productos, categorías, usuarios) | `useState` en cada listado | Al eliminar se vuelve a leer la colección y la tabla se redibuja |
| Valores y errores de formularios | `useFormulario` (hook personalizado con `useState`) | Cada formulario tiene su propio estado |
| Filtros del catálogo | `Productos` (`useState`), inicializados desde la URL (`useLocation`) | Solo los usa el catálogo |
| Totales, lista filtrada, stock crítico, reportes | No se guardan: se **calculan** | Evita datos duplicados que se desincronicen |

### 5.3 Trazabilidad requisito → prueba

| Requisitos | Archivo de prueba |
|---|---|
| RF20–RF27, RF32–RF34 (reglas de validación) | `01-validaciones.spec.js` |
| RF09, RF10, RF12 | `02-catalogo.spec.js` |
| RF14–RF18, RNF07 | `03-carrito.spec.js` |
| RF08, RF12, RF13, RF15, RF37 | `04-TarjetaProducto.spec.js` |
| RF09, RF10 | `05-FiltrosCatalogo.spec.js` |
| RF26, RF30, RNF03 | `06-CampoFormulario.spec.js` |
| RF27, RF30, reglas comunes (3.6) | `07-useFormulario.spec.js` |
| RF01, RF02, RF04, RF05, RF07, RF11, RF39 | `08-Productos.spec.js` |
| RF21, RF24, RF30, RF31–RF34, RF41 | `09-Formularios.spec.js` |
| RF16–RF19 | `10-Carrito.spec.js` |
| RF41, RF55–RF57 | `11-baseDatos.spec.js` |
| RF42–RF45 | `12-Checkout.spec.js` |
| RF40, RF46–RF54 | `13-Admin.spec.js` |
| RF35–RF38, RF44, RF53 | `14-VistasTienda.spec.js` |

## 6. Próxima versión (Parcial 3)

- Reemplazar `baseDatos.js` por llamadas a una **API REST** (productos, categorías, usuarios, órdenes) manteniendo los mismos nombres de funciones.
- Autenticación en el servidor con contraseñas cifradas y validación de los datos en el backend.
- Integración con una pasarela de pago real y envío de la boleta por correo.
