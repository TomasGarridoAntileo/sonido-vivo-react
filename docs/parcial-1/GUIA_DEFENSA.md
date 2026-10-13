# Guía de defensa · Evaluación Parcial 1

El 60% de la nota está en **explicar y justificar** (IE1.1.3, IE1.1.4, IE1.2.2, IE1.3.2). Esta guía dice qué mostrar en pantalla y qué decir en cada indicador. Practíquenla en voz alta: cada integrante debe poder explicar cualquier parte, no solo la suya.

| Indicador | Peso | Tipo |
|---|---|---|
| IE1.1.1 Contenido HTML5 | 8% | Producto |
| IE1.1.2 CSS externo | 10% | Producto |
| IE1.2.1 Validaciones JS | 10% | Producto |
| IE1.3.1 Repositorio remoto | 12% | Producto |
| IE1.1.3 Explica HTML y semántica | 10% | Defensa |
| IE1.1.4 Describe uso de CSS | 15% | Defensa |
| IE1.2.2 Demuestra validaciones | 15% | Defensa |
| IE1.3.2 Justifica uso de Git | 20% | Defensa |

---

## IE1.1.1 y IE1.1.3 · HTML5 y semántica correcta

### Qué mostrar

Abrir `index.html` en VS Code y en el navegador, lado a lado.

| Requisito de la rúbrica | Dónde está |
|---|---|
| Estructura actual de HTML | `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset>` y `<meta name="viewport">` en el `<head>` de cada página |
| Navegación por hipervínculos | `<nav>` del encabezado (5 páginas), migas de pan, enlaces del pie, enlaces de categorías a `productos.html?categoria=...` |
| Imágenes | Logo y 10 íconos SVG con `alt` |
| Botones | "Ver catálogo", "Crear cuenta", botón de menú móvil, botones de enviar y limpiar |
| Videos | `<video controls poster>` con `<source>` en `nosotros.html` |
| Elementos de navegación | `<nav aria-label>` en encabezado, pie y migas |
| Formularios | `registro.html` y `contacto.html` (`<form>`, `<fieldset>`, `<legend>`, `<label for>`) |
| Footer | `<footer class="pie">` en todas las páginas |

### Qué decir

- **Semántica** significa usar la etiqueta que describe el *significado* del contenido, no solo cómo se ve. Un `<div>` no dice nada; un `<nav>` le dice al navegador, a Google y a un lector de pantalla "esto es navegación".
- Recorrer la estructura de una página:
  - `<header>`: encabezado con logo y menú.
  - `<nav>`: bloques de enlaces de navegación.
  - `<main>`: contenido principal (uno solo por página).
  - `<section>`: bloques temáticos con su propio título (`aria-labelledby` lo conecta con el `<h2>`).
  - `<article>`: contenido que tiene sentido por sí solo, como cada producto o cada sucursal.
  - `<aside>`: contenido complementario (hitos de la empresa, otros canales de contacto).
  - `<footer>`: pie con datos de contacto y enlaces.
- Etiquetas semánticas menos conocidas que usamos:
  - `<figure>` y `<figcaption>`: el video con su descripción.
  - `<address>`: direcciones de las sucursales.
  - `<time datetime="2012">`: años de la línea de tiempo (legibles por máquinas).
  - `<data value="129990">`: el precio guarda el número puro aunque se muestre "$129.990".
  - `<table>` con `<caption>`, `<thead>`, `<tbody>`, `<tfoot>` y `scope` en los `<th>`.
- **Jerarquía de títulos**: un solo `<h1>` por página, luego `<h2>` por sección y `<h3>` dentro. No se saltan niveles.
- **Por qué importa**: accesibilidad (los lectores de pantalla navegan por títulos y regiones), SEO (Google entiende qué es cada parte) y mantenimiento (el código se lee solo).
- Accesibilidad extra: enlace "Saltar al contenido", `alt` en imágenes, `<label for>` en cada campo, `aria-current="page"` marca la página actual en el menú.
- El HTML se validó con un validador estándar sin errores.

### Preguntas probables

- *¿Diferencia entre `<section>` y `<article>`?* `<article>` se entiende solo (una tarjeta de producto podría estar en otra página y tener sentido); `<section>` agrupa contenido de un mismo tema dentro de la página.
- *¿Por qué `alt=""` en algunos íconos?* Porque son decorativos: el texto de al lado ya dice la categoría. Si tuvieran `alt`, el lector de pantalla repetiría lo mismo dos veces.
- *¿Para qué sirve el `meta viewport`?* Indica al navegador del celular que use el ancho real del dispositivo; sin él, el diseño responsivo no funciona.

---

## IE1.1.2 y IE1.1.4 · Hoja de estilos externa y personalizada

### Qué mostrar

1. En cualquier HTML, la línea `<link rel="stylesheet" href="assets/css/estilos.css">`.
2. Buscar `style=` en todo el proyecto (Ctrl+Shift+F en VS Code): **0 resultados**.
3. Abrir `estilos.css` y mostrar la tabla de contenido del inicio.
4. En el navegador, abrir DevTools (F12) → modo dispositivo (Ctrl+Shift+M) y cambiar entre celular, tablet y escritorio.

### Qué decir

- **Por qué externa**: hay tres formas de aplicar CSS (en línea con `style`, incrustado con `<style>` y externo con `<link>`). Elegimos externo porque una sola hoja sirve para las 5 páginas: si cambiamos el color del botón, cambia en todo el sitio editando una línea. Con estilos en línea habría que cambiarlo en cada etiqueta.
- **Cascada y especificidad**: el orden de prioridad es estilos del navegador < hoja de autor (la nuestra) < incrustados < en línea < `!important`. Al no usar estilos en línea ni `!important`, todo el control está en `estilos.css` y no hay reglas que se pisen sin querer.
- **Variables CSS** (`:root { --valvula: #F0A43A; }`): la paleta y la tipografía se definen una vez y se reutilizan. Cambiar la marca completa es cambiar 5 valores.
- **Diseño de la interfaz**: la paleta está inspirada en un amplificador (azul noche como el tapiz del equipo y ámbar como la luz de una válvula); el elemento llamativo es el ecualizador de la portada. Todo lo demás es sobrio para que el producto sea el protagonista.
- **Mobile first**: los estilos base son para celular y las media queries *agregan* columnas a medida que hay más espacio. Usamos los puntos de corte del material del curso:
  - 600px: tablet vertical (categorías en 3 columnas, productos en 2).
  - 768px: tablet horizontal (el menú deja de ser desplegable, productos en 3).
  - 992px: escritorio (categorías en 5, productos en 4).
- **CSS Grid y Flexbox**: Grid para grillas de dos dimensiones (catálogo, categorías); Flexbox para alinear en una fila (encabezado, pie de cada tarjeta).
- **Imágenes y video responsivos**: `max-width: 100%; height: auto;` evita que se salgan del contenedor.
- **Unidades**: `rem` para tipografía y espacios (respeta el tamaño de letra que eligió el usuario), `%` y `fr` para anchos, `clamp()` + `vw` para el título de la portada que se adapta al ancho de pantalla.
- **Nombres de clases** tipo BEM (`.producto__precio`, `.boton--contorno`): bloque, elemento y variante. Se entiende de dónde viene cada estilo.
- **Buenas prácticas del material**: tabla de contenido comentada, una sola hoja combinada (menos peticiones HTTP), formato estándar con una propiedad por línea, rutas relativas (`assets/...`).
- **Accesibilidad**: foco visible con `:focus-visible`, contraste suficiente, y `prefers-reduced-motion` desactiva la animación si el usuario lo pidió en su sistema.

### Preguntas probables

- *¿Por qué no Bootstrap?* La rúbrica pide hojas de estilo **personalizadas**. Con Bootstrap el diseño sería el del framework; aquí cada regla es nuestra y la podemos explicar. Bootstrap acelera el desarrollo pero agrega muchas clases y peso que no usaríamos.
- *¿Mantenimiento eficiente?* Un archivo, variables, comentarios por sección y nada en línea: cualquiera del equipo encuentra y cambia un estilo en segundos.

---

## IE1.2.1 y IE1.2.2 · Validaciones con JavaScript

### Guion de demostración (en este orden)

**Registro (`registro.html`)**
1. Presionar "Crear cuenta" con todo vacío → aparece el **resumen de errores** arriba con enlaces; clic en uno lleva al campo.
2. Nombre `tomás pérez` → sugerencia "¿Lo escribimos como 'Tomás Pérez'?" con botón **Usar**.
3. RUT `12345678-9` → error: el dígito verificador no corresponde. Cambiar a `123456785` → sugiere el formato `12.345.678-5`.
4. Fecha que dé menos de 18 años → error que dice la edad calculada y qué hacer.
5. Celular `12345678` → error "faltan dígitos" + sugerencia "¿Te faltó el 9 inicial?".
6. Correo `tomas@gmial.com` → "¿Quisiste decir tomas@gmail.com?" → clic en **Usar**.
7. Región → se cargan las comunas de esa región.
8. Contraseña: mostrar cómo se marcan los requisitos y crece el medidor mientras se escribe. Escribir el propio nombre dentro → error específico.
9. Repetir contraseña distinta → "Las contraseñas no coinciden".
10. Completar todo bien → mensaje "Cuenta creada" con el nombre y correo.

**Contacto (`contacto.html`)**
1. Elegir motivo "Consulta de stock" sin código → el código pasa a ser obligatorio.
2. Código `ge2` → "¿Buscas GE002, Guitarra Eléctrica Les Paul Epiphone?" → **Usar** → muestra el producto y su stock.
3. Mensaje corto → error con la cantidad de caracteres actual; contador `x / 500` en vivo.
4. Desde el catálogo, "Consultar este producto" abre el formulario con el código ya puesto.

### Qué decir (cómo funciona por dentro)

- `novalidate` en el `<form>` apaga los globos genéricos del navegador ("Completa este campo") para mostrar **mensajes propios** en español, específicos y que dicen cómo corregir.
- **Eventos**:
  - `blur` (salir del campo): valida la primera vez, para no marcar error mientras la persona recién empieza a escribir.
  - `input` (cada tecla): una vez tocado el campo, revalida en vivo para que el error desaparezca apenas se corrige.
  - `submit`: `preventDefault()` detiene el envío, valida todo y decide entre resumen de errores o confirmación.
- **Diseño del código**: cada validador es una función que recibe el valor y devuelve `{ error, sugerencia }`. Un motor genérico (`conectarFormulario`) los conecta a cualquier formulario. Por eso registro y contacto reutilizan `validarNombre` y `validarCorreo`.
- **Algoritmos destacados**:
  - **RUT módulo 11**: se multiplican los dígitos de derecha a izquierda por 2, 3, 4, 5, 6, 7 (y se repite), se suma, se calcula `11 - (suma % 11)`; 11 da "0" y 10 da "K".
  - **Corrección de correos**: distancia de Levenshtein, cuenta cuántas letras hay que cambiar entre dos textos. Si el dominio está a 2 cambios o menos de uno conocido (gmail.com, hotmail.com, duocuc.cl...), se sugiere.
  - **Código de producto**: se compara con el arreglo `PRODUCTOS` (datos del Excel); si el formato está incompleto (`ge2`), se completa con ceros y se busca.
- **Accesibilidad**: los mensajes están en elementos con `aria-live="polite"` (el lector de pantalla los lee), los campos se marcan con `aria-invalid` y se conectan a su error con `aria-describedby`.
- **Validar en el cliente no reemplaza validar en el servidor**: mejora la experiencia, pero cuando exista backend se debe volver a validar allá, porque el JavaScript del navegador se puede desactivar o modificar.

### Preguntas probables

- *¿Por qué no solo `required` y `pattern` de HTML?* Porque sus mensajes son genéricos y no permiten sugerencias, cálculos (dígito verificador, edad) ni reglas que dependen de otros campos (código obligatorio solo si el motivo es stock).
- *¿Diferencia entre error y sugerencia?* El error impide enviar. La sugerencia propone una mejora (formato, mayúsculas, dominio) y la persona decide si la acepta.

---

## IE1.3.1 y IE1.3.2 · Repositorio remoto colaborativo

Ver `docs/PLAN_GIT.md`. En la defensa:

1. Abrir el repositorio en GitHub → pestaña **Insights → Contributors**: se ve que los tres aportaron.
2. Pestaña **Commits**: leer 3 o 4 mensajes y explicar qué cambió en cada uno.
3. Mostrar un **Pull Request** cerrado y quién lo revisó.
4. Si hubo un conflicto, contar cómo se resolvió. Es un buen ejemplo para el 20% de IE1.3.2.
5. Terminal: `git log --oneline --graph --all` y `git shortlog -sn`.

Argumentos de justificación: sección 5 de `PLAN_GIT.md` (ramas, mensajes con tipo, commits pequeños, Pull Requests, respaldo remoto, reparto por archivos).
