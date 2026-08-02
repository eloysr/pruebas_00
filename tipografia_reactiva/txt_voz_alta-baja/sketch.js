let mic;
let palabras = [];
let escuchando = false;
let reconocimiento;
let botonEscuchar, botonParar, botonLimpiar;
let nivelPico = 0;

// --- Parámetros de calibración: ajusta estos según lo que veas en la consola ---
let volumenMaximo = 0.06;  // volumen que consideramos "grito" (bájalo si no llegas al máximo)
let tamanoMinimo = 15;     // tamaño para susurros
let tamanoMaximo = 500;    // tamaño para gritos
// -----------------------------------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(LEFT, TOP);

  mic = new p5.AudioIn();

  botonEscuchar = createButton("Escuchar");
  botonEscuchar.position(20, 20);
  botonEscuchar.mousePressed(empezarAEscuchar);

  botonParar = createButton("Dejar de escuchar");
  botonParar.position(120, 20);
  botonParar.mousePressed(pararDeEscuchar);
  botonParar.hide();

  botonLimpiar = createButton("Limpiar");
  botonLimpiar.position(260, 20);
  botonLimpiar.mousePressed(() => palabras = []);
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

    let nuevasPalabras = frase.split(" ");
    for (let p of nuevasPalabras) {
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
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
  fill(255);

  if (escuchando) {
    nivelPico = max(nivelPico, mic.getLevel());
  }

  let margen = 40;
  let x = margen;
  let y = margen;
  let alturaLinea = 0;
  let espacioEntrePalabras = 20;

  for (let palabra of palabras) {
    textSize(palabra.tamano);
    let ancho = textWidth(palabra.texto);

    if (x + ancho > width - margen) {
      x = margen;
      y += alturaLinea;
      alturaLinea = 0;
    }

    text(palabra.texto, x, y);

    x += ancho + espacioEntrePalabras;
    alturaLinea = max(alturaLinea, palabra.tamano * 1.2);
  }
}