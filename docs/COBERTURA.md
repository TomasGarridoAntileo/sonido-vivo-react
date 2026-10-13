# Documento de cobertura de testing

**Proyecto:** Sonido Vivo, tienda en línea y panel de administración (React + React Bootstrap)
**Asignatura:** DSY1104 Desarrollo Fullstack II · Evaluación Parcial 2
**Autor:** Tomás Garrido Antileo · Sección 006D
**Herramientas:** Karma 6.4 · Jasmine 5.4 · Testing Library · karma-coverage (Istanbul)
**Resultado de la última ejecución:** 132 pruebas, 132 correctas, 0 fallidas

---

## 1. Objetivo

Verificar que la lógica de negocio y los componentes del frontend funcionan como se espera: el renderizado, las props, el estado, los eventos, la base de datos simulada (CRUD), el flujo de compra y el panel de administración. Además, medir qué parte del código ejecutan las pruebas para encontrar zonas sin verificar.

## 2. Entorno de pruebas

| Pieza | Función | Dónde se configura |
|---|---|---|
| **Karma** | Corredor: abre Chrome, carga las pruebas y muestra el resultado | `karma.conf.js` |
| **Jasmine** | Framework: `describe`, `it`, `expect`, `beforeEach`, espías (`jasmine.createSpy`, `spyOn`) | `frameworks: ["jasmine"]` |
| **karma-webpack + babel-loader** | Traduce JSX e `import` para que el navegador los entienda | `webpack.module.rules` |
| **@testing-library/react** | Dibuja componentes en un DOM real, los busca como lo haría una persona (por etiqueta, rol o texto) y simula eventos con `fireEvent` | Se importa en cada prueba |
| **babel-plugin-istanbul + karma-coverage** | Instrumenta `src/` y genera el informe | `plugins: ["istanbul"]` y `coverageReporter` |
| **ChromeHeadless** | Chrome sin ventana, apto para terminal, EC2 o integración continua | `browsers` |
| **Limpieza entre pruebas** | `beforeEach` global que vacía `localStorage`: la base de datos, el carrito y la sesión parten siempre desde los datos iniciales | `test/utilidades.js` |

**Umbral mínimo:** 80% de sentencias, líneas y funciones, y 70% de ramas. Si la cobertura baja de ese nivel, `npm test` falla (opción `check` de `coverageReporter`).

**Ejecución:**

```bash
npm test                 # una vez, con informe de cobertura
npm run test:watch       # se repite al guardar cambios
```

## 3. Resultado global

| Métrica | Cubierto | Total | % | Umbral | Estado |
|---|---|---|---|---|---|
| Sentencias | 957 | 1013 | **94,47%** | 80% | Cumple |
| Ramas | 657 | 778 | **84,44%** | 70% | Cumple |
| Funciones | 356 | 371 | **95,95%** | 80% | Cumple |
| Líneas | 814 | 841 | **96,78%** | 80% | Cumple |

Captura del informe HTML: `docs/capturas/informe-cobertura.png`. Informe navegable: `coverage/html/index.html` (se genera con `npm test`).

## 4. Cobertura por carpeta y archivo

| Carpeta / archivo | % Sentencias | % Ramas | % Funciones | % Líneas |
|---|---|---|---|---|
| **src** (App.js: rutas, estado del carrito y la sesión) | 100 | 100 | 100 | 100 |
| **src/components** (14 componentes reutilizables) | 100 | 93,61 | 100 | 100 |
| **src/data** (baseDatos.js con el CRUD, productos, semillas, regiones) | 100 | 84,09 | 100 | 100 |
| **src/hooks** (useFormulario) | 98,46 | 83,33 | 100 | 100 |
| **src/pages** (vistas de la tienda) | 94,63 | 80,85 | 91,48 | 95,10 |
| **src/pages/admin** (panel de administración) | 89,34 | 81,10 | 92,39 | 94,14 |
| **src/utils** (validaciones, carrito, compra, reportes, sesión) | 93,95 | 87,08 | 100 | 97,37 |

Detalle de los archivos con menor cobertura:

| Archivo | % Sentencias | % Ramas | Sin cubrir |
|---|---|---|---|
| admin/CategoriasAdmin.js | 81,63 | 81,39 | 33-36 (confirmar y eliminar una categoría vacía) |
| admin/UsuariosAdmin.js | 84,21 | 83,33 | 30-33 (eliminar otro usuario), 189-197 (selector de región y comuna) |
| admin/Ordenes.js | 85,71 | 75 | 64 (orden inexistente) |
| Contacto.js | 87,5 | 85,71 | 44-45, 65 (botón "Usar" y cerrar el mensaje) |
| Blogs.js | 88,88 | 50 | 43 (artículo inexistente) |
| Reportes.js | 100 | 50 | ramas sin ventas |
| Ofertas.js | 100 | 40 | rama "no hay ofertas" |

Se excluye `src/index.js`: solo monta la aplicación en el `<div id="root">` y no tiene lógica.

## 5. Alcance: qué cubre cada archivo de prueba

| # | Archivo | Qué se prueba | Tipo | Casos |
|---|---|---|---|---|
| 01 | `01-validaciones.spec.js` | RUT (módulo 11), correo con sugerencia de dominio, nombre, celular, edad con fecha fija, contraseña, mensaje y código de producto | Lógica | 15 |
| 02 | `02-catalogo.spec.js` | Búsqueda sin tildes, filtro por categoría, orden por precio y nombre sin alterar el original, formato CLP y texto de stock | Lógica | 5 |
| 03 | `03-carrito.spec.js` | Agregar, límite de stock, inmutabilidad, cambiar cantidad, quitar, totales y `localStorage` dañado o bloqueado | Lógica de estado | 9 |
| 04 | `04-TarjetaProducto.spec.js` | Props que se muestran, evento `onAgregar`, botón desactivado, enlace al detalle, precio de oferta | Componente (props, eventos y renderizado condicional) | 6 |
| 05 | `05-FiltrosCatalogo.spec.js` | Componente controlado: muestra los valores recibidos y avisa cada cambio | Componente (props y eventos) | 4 |
| 06 | `06-CampoFormulario.spec.js` | Clases `is-invalid` / `is-valid`, `aria-describedby`, botón "Usar", select, medidor de contraseña | Componente (manipulación del DOM) | 6 |
| 07 | `07-useFormulario.spec.js` | Hook personalizado: validar al salir, revalidar en vivo, campos dependientes, sugerencia, resumen y envío | Hook (estado) | 6 |
| 08 | `08-Productos.spec.js` | Catálogo, filtros desde la URL, buscador de la barra, contador del carrito, enlace activo, portada, Nosotros y 404 | Integración | 12 |
| 09 | `09-Formularios.spec.js` | Registro (resumen de errores, foco, sugerencias, comunas, alta del usuario) y Contacto | Integración (flujo de usuario) | 9 |
| 10 | `10-Carrito.spec.js` | Carrito vacío, carga desde `localStorage`, + y −, eliminar, vaciar, total en la barra, "Comprar ahora" | Integración | 5 |
| 11 | `11-baseDatos.spec.js` | **CRUD**: listar, obtener, crear (duplicados), actualizar, eliminar, reiniciar; ofertas, stock crítico, stock, login y registro | Lógica de datos | 12 |
| 12 | `12-Checkout.spec.js` | Envío, compra aprobada y rechazada, falta de stock, datos de la sesión, validaciones, **pago correcto** y **pago con error** | Lógica + integración | 9 |
| 13 | `13-Admin.spec.js` | Login, **rutas protegidas**, dashboard, CRUD de productos, categorías y usuarios desde la interfaz, stock crítico, reportes, órdenes y perfil | Integración | 25 |
| 14 | `14-VistasTienda.spec.js` | Detalle de producto y categoría con `useParams`, ofertas, blog, resultado de compra, impresión y reportes | Integración + lógica | 9 |
| | | | **Total** | **132** |

## 6. Cumplimiento de la propuesta de pruebas del docente (Anexo 1)

| Propuesta | Tarea pedida | Dónde se cumple |
|---|---|---|
| Renderizado correcto | Una lista renderiza todos los elementos de un conjunto de datos | 08: el catálogo dibuja los 51 productos; 14: Ofertas dibuja los 5 productos en oferta y Categorías las 10 categorías |
| Renderizado condicional | Un mensaje de error solo se muestra cuando hay un error | 06: sin validar no hay error y con error aparece; 12: el resumen de errores solo aparece al pagar con datos vacíos; 10: "Comprar ahora" solo existe si hay productos |
| Propiedades (props) | Un botón recibe su etiqueta y la función `onClick` | 04: el botón de `TarjetaProducto` cambia de etiqueta según las props ("Agregar", "Sin stock", "Máximo en carrito") y llama a `onAgregar`; 06: el botón "Usar" llama a `onUsarSugerencia` |
| Estado (state) | El estado de un formulario cambia al escribir | 07: `useFormulario` actualiza el valor y revalida en vivo; 13: el formulario de producto muestra un error al escribir un precio de oferta mayor al normal |
| Eventos | Un clic cambia el estado o ejecuta una función | 10: + y − cambian la cantidad; 13: eliminar llama a `window.confirm` (mock); 14: "Agregar al carrito" sube el contador de la barra |

## 7. Uso de mocks (simulaciones)

| Mock | Qué reemplaza | Por qué | Archivo |
|---|---|---|---|
| `jasmine.createSpy("onAgregar")` y similares | Funciones que el padre pasa por props | Verificar que el componente **avisa** al padre (cuántas veces y con qué datos) sin depender de lo que el padre haga | 04, 05, 06, 07, 08, 09 |
| `spyOn(Storage.prototype, "getItem" / "setItem")` | `localStorage` del navegador | Partir con un carrito conocido y comprobar qué se guardó. Jasmine restaura el original al terminar cada prueba | 03, 08, 10, 11 |
| `.and.throwError("bloqueado")` | `localStorage` bloqueado (modo privado) | Probar que la app y la base de datos no se caen si el navegador no deja guardar | 03, 11 |
| `spyOn(window, "confirm").and.returnValue(...)` | El cuadro "¿Eliminar…?" del navegador | Probar los dos caminos (cancelar y confirmar) sin que aparezca un diálogo real | 13 |
| `spyOn(window, "print")` | El diálogo de impresión | Comprobar que "Imprimir boleta" lo llama, sin abrir la impresora | 14 |
| Pasarela de pago simulada (`pagoAprobado`) | Un banco real | Probar la compra exitosa y la rechazada de forma controlada | 12 |
| Fecha fija `new Date(2026, 9, 10)` | La fecha de hoy | La validación de edad depende del día; con una fecha fija el resultado no cambia | 01, 12 |
| `iniciarSesionComo("U001")` | Un inicio de sesión real | Entrar directo al panel como administrador o cliente | 12, 13 |
| `MemoryRouter` | El historial del navegador | Abrir cualquier ruta (por ejemplo `/admin/productos/GA001/editar`) sin navegador real | 04, 08 al 14 |

## 8. Análisis de resultados

1. **Toda la lógica de datos está cubierta.** `baseDatos.js` (el CRUD), `compra.js`, `carrito.js`, `catalogo.js` y `reportes.js` tienen 100% de sentencias y funciones. Es lo más importante, porque de ahí sale todo lo que ve el usuario.
2. **Los componentes reutilizables están en 100% de sentencias.** Cada uno se prueba aislado (04 a 07) y además dentro de las páginas (08 a 14).
3. **Lo que falta son ramas poco frecuentes:**

| Sin cubrir | Riesgo | Decisión |
|---|---|---|
| Mensajes "no encontrado" de blog y orden en el panel | Bajo | Agregar casos con identificadores inexistentes |
| "No hay ofertas" y "aún no hay ventas" | Bajo: solo pasa con la base vacía | Agregar un caso con la base vaciada |
| Eliminar una categoría vacía y eliminar otro usuario | Medio: es una acción irreversible | **Siguiente iteración:** agregar una prueba con `spyOn(window, "confirm")` |
| Botón "Usar" y cerrar el mensaje en Contacto | Bajo: se prueba el mismo mecanismo en Registro | Aceptado |
| Casos de borde de `validaciones.js` (más de 110 años, mensaje sobre 500 caracteres) | Medio | Agregar a la prueba 01 |

4. **Problemas detectados durante el desarrollo y cubiertos por pruebas:**
   - El login borraba lo escrito cuando la contraseña era incorrecta. Se agregó `validarTodo()` al hook para validar sin limpiar el formulario; la prueba 13 verifica que el correo se mantiene.
   - Al crear un usuario de prueba con una contraseña que contenía su propio nombre, el formulario la rechazó como corresponde: la misma regla funciona en el registro y en el panel (prueba 13).

**Conclusión:** la cobertura supera los umbrales en las cuatro métricas. Lo pendiente son ramas de baja frecuencia. La mejora con más valor es probar la eliminación de categorías y usuarios, porque son acciones irreversibles.

## 9. Cómo leer el informe

- **Sentencias:** instrucciones ejecutadas al menos una vez.
- **Ramas:** caminos de cada `if`, `? :`, `&&` y `||`. Es la métrica más exigente: un `if` sin su `else` probado deja una rama sin cubrir.
- **Funciones:** funciones llamadas al menos una vez (incluidas las flechas de los `onClick`).
- **Líneas:** líneas con código ejecutado.
- En el informe HTML, el **verde** indica código ejecutado, el **rojo** código no ejecutado y la marca **"I" o "E"** indica un `if` o un `else` que nunca se tomó.

Una cobertura alta no garantiza que no haya errores: solo dice que el código se **ejecutó**. Por eso cada prueba verifica resultados con `expect`, incluidos los casos de error (pago rechazado, stock insuficiente, código repetido, acceso sin permiso).
