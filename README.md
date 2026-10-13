# Sonido Vivo · Tienda de instrumentos en React

Proyecto de la **Evaluación Parcial 2 (30%)** de **DSY1104 Desarrollo Fullstack II**, Forma B.
Continúa la Parcial 1 (HTML, CSS y JavaScript puro): el mismo sitio, ahora como aplicación **React** con **React Bootstrap**, una **base de datos simulada con CRUD**, **compra completa** (carrito, checkout, pago correcto o con error), **panel de administración** y **pruebas unitarias con Jasmine y Karma**, según el Anexo 1 de la evaluación.

## Requisitos

- Node.js 18 o superior (`node --version`)
- Google Chrome (Karma lo usa para correr las pruebas)

## Cómo ejecutarlo

```bash
git clone <url-del-repo>
cd sonido-vivo-react
npm install          # instala dependencias (una sola vez)
npm start            # abre la app en http://localhost:3000
npm test             # corre las 132 pruebas con Karma y Jasmine y genera la cobertura
npm run build        # versión optimizada en build/
```

El informe de cobertura queda en `coverage/html/index.html` (ábrelo en el navegador) y la tabla resumida en `coverage/cobertura.txt`.

> **En EC2 o Linux sin Chrome con interfaz:** `KARMA_BROWSER=ChromeHeadlessSinSandbox npm test`
> (si Chrome no está en la ruta por defecto, indica `CHROME_BIN=/ruta/a/chrome`).

## Tecnologías (las de la unidad 2)

| Herramienta | Para qué | Material |
|---|---|---|
| Create React App (react-scripts 5) | Crear, ejecutar y compilar el proyecto | 2.1.2 |
| React 18 | Componentes, JSX, props y state (`useState`) | 2.1.1, 2.2.1 |
| React Router 6 | SPA; `useParams` (`/productos/:codigo`), `useLocation` (`?categoria=`), rutas anidadas y protegidas (`/admin`) | 2.2.1 |
| React Bootstrap 2 + Bootstrap 5 | Grilla responsiva y componentes (Navbar, Card, Form, Alert, Table...) | 2.1.2, 2.2.2 |
| localStorage | Persistencia de la base de datos simulada, el carrito y la sesión | 2.2.1 |
| Karma 6 + Jasmine 5 | Corredor y framework de pruebas unitarias | 2.3.2, 2.3.5 |
| Testing Library | `render`, `fireEvent`, `screen` para probar componentes | 2.3.2, 2.3.3 |
| webpack + babel-loader | Que Karma entienda JSX | 2.3.5 |
| karma-coverage | Informe de cobertura de código | 2.3.4 |

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@sonidovivo.cl | Admin#2026 |
| Cliente | camila@gmail.com | Cliente#2026 |

El panel está en `/admin` (botón **Panel admin** en la barra tras iniciar sesión). Los datos se guardan en el navegador: para volver a los datos iniciales, borra el Local Storage (F12 → Aplicación).

## Estructura

```
sonido-vivo-react/
├── package.json            Dependencias y scripts (start, build, test)
├── karma.conf.js           Configuración de Karma, Jasmine, webpack y cobertura
├── public/
│   ├── index.html          Página única donde React monta la app (<div id="root">)
│   ├── img/                Logo e íconos de categorías
│   └── video/              Video de la tienda
├── src/
│   ├── index.js            Punto de entrada: Bootstrap, estilos y BrowserRouter
│   ├── App.js              Estado del carrito y la sesión (useState) y todas las rutas
│   ├── components/         Piezas reutilizables (TarjetaProducto, CampoFormulario, MedidorClave...)
│   ├── pages/              Vistas de la tienda (Inicio, Productos, Detalle, Categorías, Ofertas, Blog,
│   │                       Login, Registro, Contacto, Carrito, Checkout, Resultado de compra)
│   ├── pages/admin/        Panel: Dashboard, Órdenes, Productos, Categorías, Usuarios, Reportes, Perfil
│   ├── hooks/              useFormulario: hook personalizado para formularios
│   ├── utils/              Lógica: validaciones, catálogo, carrito, compra, reportes, sesión, formato
│   ├── data/               baseDatos.js (base de datos simulada con CRUD) y datos iniciales del Excel
│   └── styles/estilos.css  Personalización de marca sobre Bootstrap
├── test/                   14 archivos de prueba (*.spec.js) y utilidades
└── docs/
    ├── ERS.md              Especificación de Requisitos (versión 2.0)
    ├── COBERTURA.md        Documento de cobertura de testing
    ├── GUIA_DEFENSA.md     Guion para la presentación
    ├── PLAN_GIT.md         Flujo de trabajo en Git
    ├── capturas/           Evidencia responsiva e informe de cobertura
    └── parcial-1/          Documentos de la entrega anterior
```

## Qué cambió respecto de la Parcial 1

| Parcial 1 | Parcial 2 |
|---|---|
| 5 archivos HTML con encabezado y pie repetidos | 1 `index.html`; encabezado y pie son componentes que se escriben una vez |
| `main.js` y `validaciones.js` leen y escriben el DOM | Componentes con **props** y **state**; React actualiza el DOM |
| Validadores mezclados con el DOM | Validadores **puros** en `utils/validaciones.js`, probados con Jasmine |
| CSS propio con media queries | Grilla de **Bootstrap** (`Row`/`Col` con `xs`, `sm`, `md`, `lg`) + hoja de marca |
| Sin carrito | **Carrito** con `useState` en App, pasado por props y guardado en `localStorage` |
| Datos fijos en un arreglo | **Base de datos simulada** con CRUD y persistencia |
| 5 páginas | **16 rutas en la tienda** y un **panel de administración** con 18 rutas protegidas |
| Sin pruebas | **132 pruebas** en 14 archivos, **94% de sentencias cubiertas** |

## Autor

Trabajo individual de **Tomás Garrido Antileo** (DSY1104, sección 006D). Responsable de todo el proyecto: migración a React, base de datos simulada, tienda, compra, panel de administración, diseño responsivo, pruebas con Karma y Jasmine y documentación.
