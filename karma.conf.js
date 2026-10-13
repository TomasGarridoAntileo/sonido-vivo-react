/* ==========================================================
   karma.conf.js — Configuración de Karma + Jasmine.

   Karma: corredor de pruebas. Abre un navegador real (Chrome),
          carga las pruebas y muestra el resultado en la terminal.
   Jasmine: framework con el que se escriben (describe / it / expect / spies).
   Webpack + Babel: Karma no entiende JSX ni "import"; webpack arma
          un paquete con cada prueba y babel traduce JSX a JavaScript.
   Istanbul (babel-plugin-istanbul) + karma-coverage: miden qué líneas
          del código ejecutaron las pruebas y generan el informe HTML.

   Ejecutar:  npm test            (una vez, para entregar)
              npm run test:watch  (se repite al guardar)
   ========================================================== */

const path = require("path");

// Si no hay Chrome instalado (Linux/EC2), se puede indicar con CHROME_BIN
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      { pattern: "test/**/*.spec.js", watched: false },
      // Imágenes de public/ disponibles (sin cargarlas como script) para evitar avisos 404
      { pattern: "public/**/*", included: false, served: true, watched: false },
    ],
    proxies: { "/img/": "/base/public/img/", "/video/": "/base/public/video/" },

    preprocessors: {
      "test/**/*.spec.js": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Instrumenta SOLO el código de src/ (no las pruebas) para medir cobertura
                plugins: [["istanbul", { include: ["src/**"], exclude: ["test/**", "src/index.js"] }]],
              },
            },
          },
          // Las pruebas no necesitan estilos: si un componente importa CSS, se ignora
          { test: /\.css$/, type: "asset/source" },
        ],
      },
    },

    reporters: ["progress", "kjhtml", "coverage"],

    coverageReporter: {
      dir: path.join(__dirname, "coverage"),
      reporters: [
        { type: "html", subdir: "html" },        // informe navegable: coverage/html/index.html
        { type: "text-summary" },                // resumen en la terminal
        { type: "text", subdir: ".", file: "cobertura.txt" }, // tabla por archivo: coverage/cobertura.txt
        { type: "json-summary", subdir: "." },
      ],
      check: {
        // Umbral mínimo acordado por el equipo: si baja, npm test falla
        global: { statements: 80, branches: 70, functions: 80, lines: 80 },
      },
    },

    client: {
      jasmine: { random: false }, // orden fijo: más fácil de leer en la presentación
      clearContext: false,        // deja visible el reporte de Jasmine en el navegador
    },

    browsers: [process.env.KARMA_BROWSER || "ChromeHeadless"],
    customLaunchers: {
      // Para servidores Linux/EC2 o contenedores sin entorno gráfico
      ChromeHeadlessSinSandbox: { base: "ChromeHeadless", flags: ["--no-sandbox"] },
    },
    singleRun: true,
    concurrency: 1,
    browserNoActivityTimeout: 60000,
  });
};
