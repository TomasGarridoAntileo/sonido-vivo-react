/* ==========================================================
   semillas.js — Datos iniciales de usuarios, órdenes y blogs.
   Se cargan en la base de datos simulada la primera vez que se
   abre la aplicación (o al reiniciarla desde el panel).
   ========================================================== */

// Cuentas de demostración (proyecto académico: las claves son de prueba)
export const USUARIOS_INICIALES = [
  {
    id: "U001", run: "11.111.111-1", nombre: "Administrador", apellidos: "Sonido Vivo",
    correo: "admin@sonidovivo.cl", clave: "Admin#2026", rol: "admin",
    telefono: "+56 9 1111 1111", region: "Región Metropolitana", comuna: "Providencia",
    direccion: "Av. Providencia 2150", fechaRegistro: "2026-03-01",
  },
  {
    id: "U002", run: "12.345.678-5", nombre: "Camila", apellidos: "Rojas Fuentes",
    correo: "camila@gmail.com", clave: "Cliente#2026", rol: "cliente",
    telefono: "+56 9 8765 4321", region: "Valparaíso", comuna: "Viña del Mar",
    direccion: "Los Crisantemos 450, depto 603", fechaRegistro: "2026-05-14",
  },
];

export const ORDENES_INICIALES = [
  {
    numero: "20260001", fecha: "2026-09-20", estado: "pagada", usuarioId: "U002",
    cliente: { nombre: "Camila", apellidos: "Rojas Fuentes", correo: "camila@gmail.com" },
    entrega: { tipo: "despacho", calle: "Los Crisantemos 450", departamento: "603", region: "Valparaíso", comuna: "Viña del Mar", indicaciones: "" },
    items: [
      { codigo: "GA003", nombre: "Guitarra Acústica Clásica 4/4", precio: 89990, cantidad: 1 },
      { codigo: "AC001", nombre: "Cuerdas Guitarra Eléctrica 09-42", precio: 8990, cantidad: 2 },
    ],
    costoEnvio: 4990, total: 112960,
  },
  {
    numero: "20260002", fecha: "2026-10-02", estado: "rechazada", usuarioId: "U002",
    cliente: { nombre: "Camila", apellidos: "Rojas Fuentes", correo: "camila@gmail.com" },
    entrega: { tipo: "retiro", calle: "", departamento: "", region: "Región Metropolitana", comuna: "Providencia", indicaciones: "" },
    items: [{ codigo: "PE001", nombre: "Pedal Distorsión", precio: 79990, cantidad: 1 }],
    costoEnvio: 0, total: 79990,
  },
];

export const BLOGS = [
  {
    id: "elegir-primera-guitarra",
    titulo: "Cómo elegir tu primera guitarra",
    fecha: "2026-08-12",
    autor: "Equipo Sonido Vivo",
    categoria: "guitarras-acusticas",
    resumen: "Acústica, clásica o eléctrica: qué mirar antes de comprar y cuánto invertir para empezar bien.",
    contenido: [
      "La primera pregunta no es la marca, sino el estilo: si te gusta el rock, una eléctrica te va a motivar más; si quieres acompañar canciones en casa, una acústica es más práctica.",
      "Las guitarras clásicas usan cuerdas de nailon, más suaves para los dedos. Son ideales para niños y para quienes estudian música formalmente.",
      "Fíjate en la altura de las cuerdas (acción): si están muy separadas del mástil, cuesta tocar y es fácil frustrarse. En la tienda la ajustamos gratis al comprar.",
      "Para partir, un presupuesto de entre 90 y 250 mil pesos alcanza para un instrumento que no tendrás que cambiar en el primer año.",
    ],
  },
  {
    id: "cuidar-tus-pedales",
    titulo: "5 consejos para cuidar tus pedales de efectos",
    fecha: "2026-09-03",
    autor: "Servicio técnico Sonido Vivo",
    categoria: "pedales",
    resumen: "Fuentes de poder, cables y almacenamiento: errores comunes que acortan la vida de tus pedales.",
    contenido: [
      "Usa siempre la fuente de poder indicada por el fabricante (voltaje y polaridad). Una fuente equivocada es la causa número uno de pedales quemados.",
      "Desconecta la fuente antes de cambiar el orden de los pedales en tu pedalboard.",
      "Limpia los conectores con un paño seco; si aparece ruido al mover el cable, probablemente es el cable y no el pedal.",
      "Guárdalos en un lugar seco: la humedad oxida los switches.",
      "Si un pedal falla, tráelo a casa matriz: el diagnóstico es gratuito.",
    ],
  },
];
