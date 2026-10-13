# Plan de trabajo en Git · Evaluación Parcial 2

Proyecto **individual**. Igual que en la Parcial 1 se usa un flujo profesional: ramas por funcionalidad, mensajes `tipo: descripción`, commits pequeños y Pull Requests hacia `main`. Aunque no haya revisores, el Pull Request deja registrado qué entró, cuándo y con qué pruebas.

## Repositorio

Repositorio público `sonido-vivo-react` (separado del de la Parcial 1, que se enlaza desde el README). `.gitignore` excluye `node_modules/`, `dist/` y `coverage/`: se regeneran con `npm install`, `npm run build` y `npm test`.

## Ramas

| Rama | Contenido |
|---|---|
| `main` | Versión estable: siempre compila y pasa las pruebas |
| `feature/estructura-react` | Proyecto Create React App, rutas, barra, pie, Inicio, Nosotros, estilos |
| `feature/catalogo-carrito` | Catálogo, filtros, tarjeta de producto y carrito (useState en App + localStorage) |
| `feature/formularios` | Validaciones puras, `useFormulario`, Registro y Contacto |
| `feature/vistas-tienda` | Base de datos simulada (CRUD), detalle, categorías, ofertas, blog, login, checkout y resultado de compra |
| `feature/panel-admin` | Panel de administración con rutas anidadas y protegidas |
| `feature/testing` | Karma, Jasmine, cobertura, las pruebas y el documento de cobertura |

## Convención de mensajes

| Tipo | Uso | Ejemplo |
|---|---|---|
| `feat` | Funcionalidad nueva | `feat: agrega carrito con usestate y localstorage` |
| `fix` | Corrección | `fix: colapsa el menú hasta 992px para que no se corte en tablet` |
| `refactor` | Reordenar sin cambiar el comportamiento | `refactor: convierte validaciones en funciones puras` |
| `style` | Estilos | `style: adapta paleta de la parcial 1 sobre bootstrap` |
| `test` | Pruebas | `test: agrega pruebas de las reglas del carrito` |
| `docs` | Documentación | `docs: agrega documento de cobertura` |
| `chore` | Configuración | `chore: configura karma, jasmine y cobertura` |

## Antes de unir una rama a main

```bash
npm test          # 132 de 132 y cobertura sobre el umbral
npm run build     # compila sin errores
```

Si `npm test` falla, no se une. Es la misma idea que un pipeline de integración continua (el `buildspec.yml` de AWS CodeBuild del material del curso ejecuta `npm test`).

## Comandos para la defensa

```bash
git log --oneline --graph --all   # historial con ramas
git show <id>                     # qué cambió en un commit
```
