let VERSION = "v1.1";

let mic;
let palabras = [];
let escuchando = false;
let reconocimiento;
let botonEscuchar, botonParar, botonLimpiar;
let etiquetaVersion;
let nivelPico = 0;

let volumenMaximo = 0.02;
let tamanoMinimo = 6;
let tamanoMaximo = 500;

let margen = 40;
let espacioEntrePalabras = 20;

// Cache de la disposición: solo se recalcula cuando hace falta
let disposicion = { posiciones: [], alturaTotal: 0 };
let necesitaRecalcular = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  noLoop(); // no dibujamos en bucle continuo; solo cuando hay cambios

  mic = new p5.AudioIn();

  botonEscuchar = createButton("Escuchar");
  botonEscuchar.mousePressed(empezarAEscuchar);
  fijarEnPantalla(botonEscuchar, 20);

  botonParar = createButton("Dejar de escuchar");
  botonParar.mousePressed(pararDeEscuchar);
  fijarEnPantalla(botonParar, 120);
  botonParar.hide();

  botonLimpiar = createButton("Limpiar");
  botonLimpiar.mousePressed(() => {
    palabras = [];
    necesitaRecalcular = true;
    redraw();
  });
  fijarEnPantalla(botonLimpiar, 260);

  etiquetaVersion = createDiv(VERSION + " · " + new Date().toLocaleTimeString());
  etiquetaVersion.style("position", "fixed");
  etiquetaVersion.style("bottom", "10px");
  etiquetaVersion.style("right", "12px");
  etiquetaVersion.style("color", "#666");
  etiquetaVersion.style("font-family", "monospace");
  etiquetaVersion.style("font-size", "12px");
  etiquetaVersion.style("z-index", "100");

  redraw();
}

function fijarEnPantalla(elemento, izquierda) {
  elemento.style("position", "fixed");
  elemento.style("top", "20px");
  elemento.style("left", izquierda + "px");
  elemento.style("z-index", "100");
}

function empezarAEscuchar() {
  userStartAudio();
  mic.start();
  escuchando = true;

  botonEscuchar.hide();
  botonParar.show();

  // Medimos el volumen aparte del bucle de dibujo, 20 veces por segundo
  setInterval(() => {
    if (escuchando) nivelPico = max(nivelPico, mic.getLevel());
  }, 50);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = true;
  reconocimiento.interimResults = false;

  reconocimiento.onresult = (evento) => {
    let resultado = evento.results[evento.results.length - 1];
    let frase = resultado[0].transcript.trim();

    let nivelAjustado = constrain(nivelPico / volumenMaximo, 0, 1);
    let tamano = lerp(tamanoMinimo, tamanoMaximo, nivelAjustado);

    console.log("pico:", nivelPico.toFixed(4), "→ tamaño:", tamano.toFixed(0));

    for (let p of frase.split(" ")) {
      if (p.length > 0) {
        palabras.push({ texto: p, tamano: tamano });
      }
    }

    nivelPico = 0;
    necesitaRecalcular = true;
    redraw(); // dibujamos una sola vez, ahora que hay contenido nuevo
  };

  reconocimiento.onend = () => {
    if (escuchando) reconocimiento.start();
  };

  reconocimiento.start();
}

function pararDeEscuchar() {
  escuchando = false;
  mic.stop();
  if (reconocimiento) reconocimiento.stop();

  botonParar.hide();
  botonEscuchar.show();
}

function windowResized() {
  resizeCanvas(windowWidth, height);
  necesitaRecalcular = true;
  redraw();
}

function calcularDisposicion() {
  let posiciones = [];
  let x = margen;
  let y = margen;
  let alturaLinea = 0;

  for (let palabra of palabras) {
    textSize(palabra.tamano);
    let ancho = textWidth(palabra.texto);

    if (x + ancho > width - margen && x > margen) {
      x = margen;
      y +=