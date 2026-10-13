# Plan de trabajo en Git y GitHub

Este plan cubre **IE1.3.1** (12%) y es la base para **IE1.3.2** (20%), el indicador con más peso de la evaluación.
Lo importante: los commits los tiene que hacer **cada integrante desde su propia cuenta**. El docente revisa el historial en GitHub (autor, fecha y mensaje de cada commit), así que el reparto debe verse ahí.

## 1. Reparto de tareas

| Integrante | Rama | Archivos a su cargo |
|---|---|---|
| Integrante 1 (HTML) | `feature/estructura-html` | `index.html`, `nosotros.html`, `productos.html`, imágenes y video |
| Integrante 2 (CSS) | `feature/estilos` | `assets/css/estilos.css` |
| Integrante 3 (JS) | `feature/javascript` | `assets/js/*.js`, `registro.html`, `contacto.html` |

Cada uno trabaja en archivos distintos: así se evitan conflictos y cada commit tiene un autor claro.

## 2. Convención de mensajes de commit

Formato: `tipo: descripción en presente y en minúscula`

| Tipo | Cuándo usarlo | Ejemplo |
|---|---|---|
| `feat` | Algo nuevo que ve el usuario | `feat: agrega formulario de registro` |
| `fix` | Corrección de un error | `fix: corrige mensaje que se borraba al enviar el formulario` |
| `style` | Cambios visuales o de CSS | `style: agrega media query para tablets de 768px` |
| `docs` | Documentación | `docs: agrega instrucciones en README` |
| `refactor` | Ordenar código sin cambiar lo que hace | `refactor: separa validadores en funciones reutilizables` |
| `chore` | Configuración del repositorio | `chore: agrega .gitignore` |

Reglas: un commit = un cambio con sentido; nunca mensajes como "cambios", "avance", "asdf" o "final2".

## 3. Paso a paso

### Integrante 1 crea el repositorio (una sola vez)

```bash
git init
git add README.md .gitignore
git commit -m "chore: crea repositorio con README y .gitignore"
git branch -M main
git remote add origin https://github.com/USUARIO/sonido-vivo.git
git push -u origin main
```

Luego en GitHub: *Settings → Collaborators → Add people* e invita a los otros dos integrantes.

### Integrantes 2 y 3 clonan

```bash
git clone https://github.com/USUARIO/sonido-vivo.git
cd sonido-vivo
git config user.name "Nombre Apellido"
git config user.email "correo@duocuc.cl"
```

### Cada integrante trabaja en su rama

```bash
git checkout -b feature/estilos          # (cada uno con su rama)
# ...editar archivos...
git add assets/css/estilos.css
git commit -m "style: agrega variables de color y tipografía"
git push -u origin feature/estilos
```

En GitHub se abre un **Pull Request** hacia `main`, otro integrante lo revisa y lo aprueba (*Merge*).

### Antes de seguir trabajando, cada uno actualiza su copia

```bash
git checkout main
git pull origin main
git checkout feature/estilos
git merge main
```

### Si aparece un conflicto

Git marca el archivo con `<<<<<<<`, `=======` y `>>>>>>>`. Se elige qué versión queda, se borran las marcas y:

```bash
git add archivo-con-conflicto
git commit -m "fix: resuelve conflicto en el menú de navegación"
```

## 4. Historial sugerido (orden aproximado)

| # | Autor | Mensaje |
|---|---|---|
| 1 | Int. 1 | `chore: crea repositorio con README y .gitignore` |
| 2 | Int. 1 | `feat: agrega estructura HTML5 de la página de inicio` |
| 3 | Int. 1 | `feat: agrega íconos de categorías y logo en assets/img` |
| 4 | Int. 1 | `feat: agrega página nosotros con historia, sucursales y tabla de categorías` |
| 5 | Int. 1 | `feat: agrega video de la tienda en nosotros` |
| 6 | Int. 2 | `style: crea hoja de estilos externa con variables y reset` |
| 7 | Int. 2 | `style: agrega estilos de encabezado, navegación y pie de página` |
| 8 | Int. 2 | `style: agrega diseño de tarjetas de producto y categorías` |
| 9 | Int. 2 | `style: agrega media queries para 600, 768 y 992 px` |
| 10 | Int. 2 | `style: agrega estilos de estados de error y éxito en formularios` |
| 11 | Int. 3 | `feat: agrega datos del catálogo desde la planilla Excel` |
| 12 | Int. 3 | `feat: agrega catálogo con búsqueda, filtro por categoría y orden` |
| 13 | Int. 3 | `feat: agrega formulario de registro y contacto` |
| 14 | Int. 3 | `feat: valida RUT con dígito verificador y sugiere formato` |
| 15 | Int. 3 | `feat: sugiere corrección de dominio en correos mal escritos` |
| 16 | Int. 3 | `feat: agrega medidor y requisitos de contraseña en vivo` |
| 17 | Int. 3 | `fix: corrige mensaje de confirmación que se borraba al limpiar` |
| 18 | Int. 2 | `fix: evita que el menú fijo tape los campos con error` |
| 19 | Int. 1 | `docs: agrega guía de defensa y plan de git` |

## 5. Por qué trabajamos así (para IE1.3.2)

- **Ramas por integrante**: cada persona avanza sin romper lo que funciona en `main`; `main` siempre se puede mostrar.
- **Mensajes con tipo**: con leer `git log --oneline` se entiende qué cambió y por qué, sin abrir el código. Si algo falla, se ubica el commit que lo introdujo.
- **Commits pequeños**: si un cambio rompe algo, se puede revertir solo ese (`git revert <id>`) sin perder el resto del trabajo.
- **Pull Requests**: obligan a que otro integrante revise el código antes de unirlo, lo que detecta errores temprano y reparte el conocimiento del proyecto.
- **Repositorio remoto**: es la copia oficial y respaldo del proyecto; nadie depende del computador de otro.
- **Reparto por archivos**: reduce conflictos y deja evidencia objetiva de quién hizo qué.

Comandos útiles para mostrar en la defensa:

```bash
git log --oneline --graph --all     # historial con ramas
git shortlog -sn                    # cuántos commits hizo cada integrante
git show <id-del-commit>            # qué cambió en un commit
```
