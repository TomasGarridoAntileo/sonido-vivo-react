# Guía de defensa · Evaluación Parcial 2

La presentación vale el **60%** y es **individual**. Como el proyecto es individual, todo lo que está aquí lo explicas tú: practica en voz alta con el proyecto abierto.

| Indicador | Peso | Qué demuestras |
|---|---|---|
| IE2.1.3 Diseño del proyecto con un framework JS | 15% | Por qué React, cómo está organizado |
| IE2.1.4 Componentes, props, estado y Bootstrap responsivo | 20% | El indicador con más peso |
| IE2.2.2 Pruebas unitarias con Jasmine y Karma | 15% | Mostrar pruebas corriendo y explicar varias |
| IE2.3.2 Proceso de testeo: entorno, mocks, resultados | 10% | Configuración, mocks y cobertura |

**Preparar antes:** `npm install` hecho, `npm start` corriendo, VS Code abierto y una terminal lista para `npm test`.

> Todo lo que usa el proyecto está en el material de la unidad 2 (guías 2.1.x, 2.2.x y 2.3.x). Si te preguntan "¿de dónde sacaste esto?", la columna **Material** de cada tabla te dice qué guía citar.

---

## Guion de 15 minutos (según el Anexo 1)

El Anexo 1 indica **15 minutos de presentación + 5 de preguntas abiertas**, que incluyen **preguntas sobre los cambios en GitHub**.

| Min. | Qué mostrar | Dónde |
|---|---|---|
| 0–2 | Qué es Sonido Vivo, qué cambió desde la Parcial 1 (React, base de datos simulada, panel admin) | README, árbol de carpetas en VS Code |
| 2–5 | **Tienda:** buscar "boss" en la barra → detalle de un producto → Ofertas → Categorías → agregar 2 productos (sube el contador y el total) | `npm start` |
| 5–8 | **Compra:** Carrito → Comprar ahora → Checkout con errores → pago **rechazado** (el carrito se mantiene) → Volver a pagar → pago **aprobado** → boleta | Navegador |
| 8–11 | **Panel:** Iniciar sesión como admin → Dashboard → crear un producto con error de validación y luego bien → editar stock → verlo en la tienda → órdenes y boleta → stock crítico | Navegador |
| 11–13 | **Código:** `App.js` (estado y rutas protegidas), `baseDatos.js` (CRUD), `TarjetaProducto` (props) | VS Code |
| 13–15 | **Pruebas:** `npm test` (132 de 132), abrir 1 prueba y el informe de cobertura | Terminal y navegador |

**Cuentas de demostración:** admin@sonidovivo.cl / Admin#2026 · camila@gmail.com / Cliente#2026.
Si los datos quedan desordenados después de ensayar: en el navegador, F12 → Aplicación → Local Storage → borrar, y recargar.

### Preguntas sobre GitHub

- *¿Cómo organizaste el trabajo?* Una rama por funcionalidad (`feature/estructura-react`, `feature/catalogo-carrito`, `feature/formularios`, `feature/vistas-tienda`, `feature/panel-admin`, `feature/testing`), unidas a `main` con merge. Mostrar `git log --oneline --graph --all`.
- *¿Qué cambió en un commit?* `git show <id>`: por ejemplo, el commit del CRUD agrega `src/data/baseDatos.js`.
- *¿Por qué mensajes con tipo (`feat:`, `test:`, `docs:`)?* Con leer el historial se entiende qué cambió y por qué sin abrir el código.

---

## IE2.1.3 · Diseño del proyecto con React (15%)

### Qué decir

- **Por qué React** (2.1.1). En la Parcial 1 el encabezado y el pie estaban copiados en 5 HTML, y `main.js` escribía el DOM a mano. React es una biblioteca basada en **componentes reutilizables**; con **JSX** describo cómo se ve la interfaz y, cuando cambia el **state**, React actualiza solo lo necesario gracias al **Virtual DOM**.
- **Create React App** (2.1.2). El proyecto se creó con `npx create-react-app`, igual que en la guía: `public/index.html` tiene el `<div id="root">`, `src/index.js` monta `<App />` y `npm start` lo levanta en el **puerto 3000**.
- **React Bootstrap** (2.1.2). Instalado con `npm install react-bootstrap bootstrap` e importado en `index.js` con `import 'bootstrap/dist/css/bootstrap.min.css'`.
- **SPA con React Router** (2.2.1). Hay un solo `index.html`. `BrowserRouter` envuelve la app, `<Routes>`/`<Route>` eligen qué página mostrar según la URL y `<Link>` cambia de página **sin recargar**. Por eso el carrito no se pierde al navegar.
- **Base de datos simulada con CRUD** (Anexo 1). `src/data/baseDatos.js` guarda 4 colecciones (productos, categorías, usuarios y órdenes) en `localStorage` y ofrece `listar`, `obtener`, `crear`, `actualizar` y `eliminar`. La tienda **lee** de ahí y el panel **escribe** ahí: si el admin cambia un precio, la tienda lo muestra al instante.
- **Rutas anidadas y protegidas** (2.2.1: "Anidación de rutas" y "Protección de rutas"). Todo `/admin/*` está anidado bajo `LayoutAdmin` (menú + `<Outlet />`) y envuelto en `RutaAdmin`: si no hay sesión de administrador, `<Navigate to="/login" />`.
- **Parámetros de ruta** (2.2.1: `useParams`). `/productos/:codigo`, `/categorias/:slug`, `/compra/exitosa/:numero`, `/admin/usuarios/:id`.
- **Atomic Design** (2.3.1) y **responsabilidad única** (Anexo 1). Átomos (`Button`, `Badge`), moléculas (`CampoFormulario`, `ItemCarrito`), organismos (`BarraNavegacion`, `TarjetaProducto`, `FiltrosCatalogo`) y páginas (`pages/`).
- **Estructura por responsabilidad** (mostrar el árbol en VS Code):

| Carpeta | Contiene | Regla |
|---|---|---|
| `pages/` | Una por ruta | Arma la pantalla |
| `components/` | Piezas reutilizables | Reciben props |
| `hooks/` | `useFormulario` | Hook personalizado para formularios (2.3.5) |
| `pages/admin/` | Panel de administración | Rutas anidadas bajo `/admin` |
| `utils/` | Validaciones, catálogo, carrito, compra, reportes, sesión | Funciones **puras** o casi puras: fáciles de probar |
| `data/` | `baseDatos.js` (CRUD) y datos iniciales del Excel | La "base de datos" de esta etapa |

- **Qué se reutilizó de la Parcial 1.** Las validaciones (RUT módulo 11, corrección de correos, edad, contraseña) pasaron casi intactas a `utils/validaciones.js`. El cambio fue quitarles el DOM: ahora **reciben un valor y devuelven `{ error, sugerencia }`**. Por eso son fáciles de probar.

### Preguntas probables

- *¿Qué es JSX?* Una extensión de JavaScript para escribir algo parecido a HTML dentro del código. Babel lo traduce a JavaScript. Por eso se escribe `className` y no `class`.
- *¿Qué es el Virtual DOM?* Una copia liviana de la interfaz en memoria. React compara la versión nueva con la anterior y aplica solo las diferencias al DOM real.
- *¿Qué es el flujo de datos unidireccional?* Los datos bajan de padre a hijo por props. Si un hijo necesita cambiar algo, llama a una función que le pasó el padre.
- *¿Por qué una SPA?* Navegación instantánea y estado que se mantiene entre páginas (el carrito).

---

## IE2.1.4 · Componentes, props, estado y responsivo (20%)

### Guion de demostración

1. **Props** (2.2.1): abrir `components/TarjetaProducto.js`. Recibe `producto`, `enCarrito` y `onAgregar`. Mostrar que **la misma tarjeta** se usa en `Inicio.js` (4 destacados) y en `Productos.js` (catálogo).
2. **State en el padre** (2.2.1): abrir `App.js`. El carrito está en `const [carrito, setCarrito] = useState(cargarCarrito)`. Como lo usan varias páginas, vive en el **padre común** y se reparte por **props**:
   - `BarraNavegacion` recibe `unidades` (el contador).
   - `Inicio` y `Productos` reciben `carrito` y `onAgregar`.
   - `Carrito` recibe `items`, `onCambiarCantidad`, `onQuitar` y `onVaciar`.
3. **Comunicación hijo → padre:** la tarjeta no sabe qué es "agregar"; llama a `onAgregar(producto)`, que es la función `manejarAgregar` de App. App calcula el carrito nuevo y llama a `setCarrito`. React vuelve a dibujar y el contador de la barra sube solo.
4. **localStorage** (2.2.1): cada cambio pasa por `actualizarCarrito`, que hace `setCarrito(nuevo)` y `guardarCarrito(nuevo)` (`localStorage.setItem`). Al abrir la página, `useState(cargarCarrito)` lee lo guardado. **Demostrar:** agregar 2 productos, recargar con F5, y el carrito sigue ahí.
5. **Reglas del carrito como funciones puras:** abrir `utils/carrito.js`. `agregarAlCarrito` recibe el arreglo y devuelve uno **nuevo** sin modificar el anterior (con `...` y `map`). Mostrar la regla de stock: agregar la batería BT002 tres veces; el botón cambia a "Máximo en carrito".
6. **State local:** en `Productos.js`, `useState` guarda los filtros. Escribir "boss" en el buscador: la lista cambia en vivo. La lista filtrada **no** es state: se **calcula** en cada render con `filtrarProductos()`, así nunca queda desactualizada.
7. **Parámetros de la URL** (2.2.1): `useLocation` lee `?categoria=pedales`. Hacer clic en una categoría de la portada: el catálogo se abre ya filtrado.
8. **Formulario controlado** (2.2.2): cada input muestra un valor del state y lo actualiza en `onChange`, igual que el `LoginForm` de la guía. `FiltrosCatalogo` es controlado: muestra `filtros.texto` y avisa con `onCambiar`.
9. **Hook personalizado** (2.3.5): `hooks/useFormulario.js` reemplaza al `conectarFormulario()` de la Parcial 1. Usa `useState` para `valores`, `resultados`, `resumen` y `confirmacion`. Demostrar en Registro:
   - RUT `123456785` → sugerencia → **Usar**.
   - Escribir la contraseña y repetirla; cambiar la primera → la segunda se marca "no coinciden" sola (campos dependientes).
   - Elegir región → aparecen sus comunas; cambiar región → la comuna se vacía.
   - "Crear cuenta" vacío → resumen con 11 errores; clic en uno lleva al campo.
10. **Valores derivados:** `MedidorClave` no tiene state: calcula cuántos requisitos cumple la clave en cada render.

### Responsivo con Bootstrap (mostrar en DevTools, Ctrl+Shift+M)

| Ancho | Qué cambia | Cómo se logró |
|---|---|---|
| 390 px (celular) | Menú en botón ☰, 1 producto por fila, categorías en 2, botones a todo el ancho | `Navbar expand="lg"` + `Navbar.Toggle`, `Row xs={1}`, `Row xs={2}` |
| 768 px (tablet) | 3 productos por fila, categorías en 3, filtros en 2 columnas | `md={3}`, `sm={3}`, `Col sm={6}` |
| 1280 px (escritorio) | Menú completo, 4 productos por fila, categorías en 5 | `xl={4}`, `lg={5}` |

- La grilla de Bootstrap tiene **12 columnas** y puntos de corte `sm` 576, `md` 768, `lg` 992 y `xl` 1200. En React Bootstrap se escriben como props: `<Row xs={1} sm={2} md={3} xl={4}>`, igual que el `<Col md={8}>` de la guía 2.1.2.
- Componentes de React Bootstrap usados: `Navbar`, `Nav`, `Container`, `Row`, `Col`, `Card`, `Button`, `Badge`, `Form`, `Alert`, `Table responsive`, `ProgressBar`, `Breadcrumb`, `ButtonGroup`.
- `Table responsive` desplaza la tabla de Nosotros en celular, y `ratio ratio-16x9` mantiene la proporción del video.
- **Personalización:** `estilos.css` se carga **después** de Bootstrap. Cambia sus variables (`--bs-body-font-family`, colores de validación) y crea el botón `variant="valvula"` con la paleta de la Parcial 1. Así no se ve como "un Bootstrap más".
- Capturas de evidencia: `docs/capturas/`.

### Preguntas probables

- *¿Diferencia entre props y state?* Las props vienen del padre y son de solo lectura dentro del componente. El state es propio, puede cambiar con el tiempo y, al cambiar (`setX`), React vuelve a dibujar.
- *¿Por qué el carrito está en App y no en la página Carrito?* Porque lo usan la barra, la portada, el catálogo y el carrito. El state se pone en el **padre común** y se reparte por props (*levantar el estado*).
- *¿Por qué `key` en los `.map()`?* Para que React identifique cada elemento y no rehaga toda la lista al cambiar uno. Usamos el código del producto, que es único.
- *¿Por qué `useState(cargarCarrito)` sin paréntesis?* Así React llama a `cargarCarrito` **solo la primera vez** y no lee `localStorage` en cada render.
- *¿localStorage o sessionStorage?* `localStorage` se mantiene aunque se cierre el navegador; `sessionStorage` se borra al cerrar la pestaña. Para un carrito conviene que se mantenga.

---

## IE2.2.2 · Pruebas unitarias con Jasmine y Karma (15%)

### Demostración

1. En la terminal: `npm test`. Karma abre Chrome sin ventana, corre las pruebas y muestra **`TOTAL: 132 SUCCESS`** y el resumen de cobertura.
2. Abrir un archivo de prueba y explicar la estructura de Jasmine:

```js
describe("04 · <TarjetaProducto>", () => {          // agrupa pruebas de un componente
  it("llama a onAgregar con el producto ...", () => { // un caso, en lenguaje natural
    const onAgregar = jasmine.createSpy("onAgregar"); // ARRANGE: preparar (mock)
    dibujar({ onAgregar });
    fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" })); // ACT: actuar
    expect(onAgregar).toHaveBeenCalledWith(PRODUCTO_PRUEBA);                      // ASSERT: verificar
  });
});
```

3. **Los 14 archivos de prueba** (132 casos):

| # | Archivo | Qué asegura | Ejemplo para contar |
|---|---|---|---|
| 01 | validaciones | Reglas de negocio | El RUT 12.345.678-9 se rechaza porque el dígito correcto es 5 |
| 02 | catalogo | Búsqueda y orden | "BATERIA" encuentra "Batería"; ordenar no altera el arreglo original |
| 03 | carrito | Reglas del carrito y localStorage | Con stock 2, la tercera unidad no entra |
| 04 | TarjetaProducto | Props, eventos y renderizado condicional | El botón llama a `onAgregar`; si hay oferta, aparece el precio tachado |
| 05 | FiltrosCatalogo | Componente controlado | Cada cambio avisa `("texto", "fender")` |
| 06 | CampoFormulario | DOM | Con error el input tiene `is-invalid` y `aria-describedby` |
| 07 | useFormulario | Estado del hook | Al cambiar la clave, "repetir" se revalida |
| 08 | Productos + App | Integración | Buscar en la barra filtra el catálogo; agregar sube el contador |
| 09 | Formularios | Flujo de usuario | El registro completo crea el usuario |
| 10 | Carrito | Integración | + y − respetan el stock; "Comprar ahora" lleva al checkout |
| 11 | baseDatos | **CRUD** | Crear un código repetido lanza error; eliminar devuelve `true` o `false` |
| 12 | Checkout | Compra | Pago aprobado descuenta stock y vacía el carrito; rechazado lo mantiene |
| 13 | Admin | Login, rutas protegidas, CRUD en pantalla | Un cliente que entra a `/admin` termina en el login |
| 14 | Vistas tienda | `useParams` y reportes | `/productos/GE001` muestra la Stratocaster con -12% |

La tabla de la sección 6 de `docs/COBERTURA.md` muestra cómo se cumple **cada tarea de la propuesta de pruebas del docente** (renderizado, renderizado condicional, props, estado y eventos).

4. **Mostrar que una prueba sirve:** en `utils/carrito.js` cambiar `>=` por `>` en la regla de stock y correr `npm test`: la prueba 03 falla y dice cuál regla se rompió. Deshacer el cambio.

### Qué decir

- Se prueban **tres niveles**: funciones puras (01–03, 11), componentes aislados (04–07) e integración de varios componentes (08–10, 12–14).
- Las pruebas buscan elementos **como lo haría una persona** (por etiqueta, rol o texto visible), no por clases internas. Si cambiamos el diseño, las pruebas siguen sirviendo.
- Cada prueba verifica también los **casos de error**: formulario vacío, menor de edad, stock agotado, código inexistente.
- Calidad del código: las pruebas permitieron migrar de la Parcial 1 a React con confianza (*refactorización segura*) y detectan *regresiones* si alguien rompe algo después.

### Preguntas probables

- *¿Diferencia entre Jasmine y Karma?* Jasmine es el **lenguaje** de las pruebas (`describe`, `it`, `expect`, espías). Karma es el **corredor**: abre el navegador y ejecuta.
- *Create React App trae Jest, ¿por qué no lo usaste?* La evaluación pide Jasmine y Karma, así que en `package.json` el script `"test"` ejecuta `karma start karma.conf.js` en vez del Jest de CRA. Además, Karma corre las pruebas en un Chrome real y no en un DOM simulado.
- *¿Qué es `toHaveBeenCalledWith`?* Un *matcher* de Jasmine para espías: verifica que la función se llamó con esos argumentos.

---

## IE2.3.2 · Proceso de testeo (10%)

### 1. Configuración del entorno (mostrar `karma.conf.js`)

- `frameworks: ["jasmine", "webpack"]`: escribimos con Jasmine; webpack empaqueta cada prueba.
- `babel-loader` con `preset-react`: traduce JSX. Sin esto Karma no entiende `<Componente />`.
- `files: test/**/*.spec.js`: dónde están las pruebas.
- `test/utilidades.js` tiene un `beforeEach` global que limpia `localStorage`: cada prueba parte con la base de datos inicial.
- `browsers: ChromeHeadless`: Chrome sin ventana. En EC2 se usa `ChromeHeadlessSinSandbox`.
- `singleRun: true`: corre una vez y termina (para entregar o integración continua).
- `reporters: ["coverage"]` + `coverageReporter` (karma-coverage, guía 2.3.4): genera el informe HTML. Como las pruebas pasan por webpack, el código se instrumenta con `babel-plugin-istanbul` (el mismo Istanbul que menciona la guía).
- `check`: umbrales mínimos; si la cobertura baja, `npm test` falla.

### 2. Escritura de pruebas

Patrón **Preparar → Actuar → Verificar**, nombres descriptivos en español, `beforeEach` para preparar datos comunes, y datos de prueba claros (`PRODUCTO_PRUEBA`, con stock 2 para probar el límite).

### 3. Uso de mocks

| Mock | Para qué |
|---|---|
| `jasmine.createSpy()` | Reemplaza funciones que llegan por props; verificamos que se llamen con los datos correctos |
| `spyOn(Storage.prototype, "getItem")` | Reemplaza `localStorage`: cada prueba parte limpia y vemos qué se guardó. Jasmine lo restaura solo al terminar |
| Fecha fija como parámetro | `validarFechaNacimiento(valor, hoy)` recibe "hoy"; en la prueba se pasa una fecha fija para que el resultado no dependa del día |
| Catálogo falso | Prueba el código de producto con datos pequeños y conocidos |
| `onRegistrar` / `onEnviar` | Simulan el backend que todavía no existe |
| `spyOn(window, "confirm")` | Simula que el usuario responde "Aceptar" o "Cancelar" al eliminar, sin un diálogo real |
| `spyOn(window, "print")` | Comprueba que "Imprimir boleta" llama a la impresora, sin abrirla |
| Pasarela de pago simulada | "Aprobado" o "Rechazado" para probar los dos caminos de la compra |
| `MemoryRouter` | Abre una URL específica sin navegador real |

*Por qué mockear:* **aislar** la unidad que se prueba. Si la prueba del carrito dependiera del `localStorage` real, una prueba anterior podría dejar datos y hacerla fallar.

### 4. Análisis de resultados (abrir `coverage/html/index.html`)

| Métrica | Resultado |
|---|---|
| Sentencias | 94,47% |
| Ramas | 84,44% |
| Funciones | 95,95% |
| Líneas | 96,78% |

- Explicar las cuatro métricas (ver `docs/COBERTURA.md`, sección 8). Ramas es la más exigente.
- Entrar a un archivo con rojo, por ejemplo `admin/CategoriasAdmin.js` líneas 33-36 (eliminar una categoría vacía), y explicar qué prueba faltaría: un caso con `spyOn(window, "confirm")` sobre una categoría sin productos.
- **Cobertura alta no significa cero errores:** solo que el código se ejecutó. Lo que da confianza son los `expect` que verifican resultados.

---

## Checklist del día

- [ ] `npm install` hecho en el computador de la presentación
- [ ] `npm start` funcionando en http://localhost:3000
- [ ] `npm test` corrido antes (132 de 132) y `coverage/html/index.html` generado
- [ ] Repositorio público en GitHub con el historial de commits
- [ ] ERS y documento de cobertura subidos a AVA
- [ ] Practicaste las cuatro secciones en voz alta (unos 10 minutos en total)
