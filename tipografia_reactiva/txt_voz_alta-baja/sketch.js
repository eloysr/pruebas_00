// --- Cambia este número cada vez que edites el archivo ---
let VERSION = "v1.0";
// ---------------------------------------------------------

let mic;
let palabras = [];
let escuchando = false;
let reconocimiento;
let botonEscuchar, botonParar, botonLimpiar;
let etiquetaVersion;
let nivelPico = 0;

// --- Parámetros de calibración ---
let volumenMaximo = 0.06;
let tamanoMinimo = 15;
let tamanoMaximo = 500;
// ---------------------------------

let margen = 40;
let espacioEntrePalabras = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(LEFT, TOP);

  mic = new p5.AudioIn();

  botonEscuchar = createButton("Escuchar");
  botonEscuchar.mousePressed(empezarAEscuchar);
  fijarEnPantalla(botonEscuchar, 20);

  botonParar = createButton("Dejar de escuchar");
  botonParar.mousePressed(pararDeEscuchar);
  fijarEnPantalla(botonParar, 120);
  botonParar.hide();

  botonLimpiar = createButton("Limpiar");
  botonLimpiar.mousePressed(() => palabras = []);
  fijarEnPantalla(botonLimpiar, 260);

  // Indicador de versión, siempre visible abajo a la derecha
  etiquetaVersion = createDiv(VERSION + " · " + new Date().toLocaleTimeString());
  etiquetaVersion.style("position", "fixed");
  etiquetaVersion.style("bottom", "10px");
  etiquetaVersion.style("right", "12px");
  etiquetaVersion.style("color", "#666");
  etiquetaVersion.style("font-family", "monospace");
  etiquetaVersion.style("font-size", "12px");
  etiquetaVersion.style("z-index", "100");
}

// Hace que un botón quede fijo en pantalla aunque hagas scroll
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
}

// Calcula la posición de cada palabra y la altura total necesaria
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
      y += alturaLinea;
      alturaLinea = 0;
    }

    posiciones.push({ palabra: palabra, x: x, y: y });

    x += ancho + espacioEntrePalabras;
    alturaLinea = max(alturaLinea, palabra.tamano * 1.2);
  }

  return { posiciones: posiciones, alturaTotal: y + alturaLinea + margen };
}

function draw() {
  background(20);
  fill(255);

  if (escuchando) {
    nivelPico = max(nivelPico, mic.getLevel());
  }

  let disposicion = calcularDisposicion();

  // Si el texto no cabe, el canvas crece y aparece scroll en la página
  let alturaNecesaria = max(windowHeight, disposicion.alturaTotal);
  if (abs(alturaNecesaria - height) > 1) {
    resizeCanvas(width, alturaNecesaria);
    return; // saltamos este fotograma; el siguiente ya dibuja con el tamaño correcto
  }

  for (let item of disposicion.posiciones) {
    textSize(item.palabra.tamano);
    text(item.palabra.texto, item.x, item.y);
  }
}