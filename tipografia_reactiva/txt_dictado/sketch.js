let interletrado = 15;
let mic;
let nivel = 0;
let micActivo = false;
let boton;
let texto = "DI ALGO...";
let reconocimiento;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  mic = new p5.AudioIn();

  boton = createButton("Activar micrófono");
  boton.position(20, 20);
  boton.mousePressed(activarMicrofono);
}

function activarMicrofono() {
  userStartAudio();
  mic.start();
  micActivo = true;
  boton.hide();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = true;
  reconocimiento.interimResults = true;

  reconocimiento.onresult = (evento) => {
    let resultado = evento.results[evento.results.length - 1];
    texto = resultado[0].transcript.toUpperCase();
  };

  reconocimiento.onend = () => {
    reconocimiento.start();
  };

  reconocimiento.start();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
  fill(255);

  if (micActivo) {
    nivel = mic.getLevel();
  }

  // El volumen decide el tamaño: bajito = pequeño, alto = grande
  let tamanoMin = 20;
  let tamanoMax = 300;
  let tamano = map(nivel, 0, 0.5, tamanoMin, tamanoMax, true);

  textSize(tamano);

  // Calculamos el ancho del texto con ese tamaño
  let anchoTexto = 0;
  for (let i = 0; i < texto.length; i++) {
    anchoTexto += textWidth(texto.charAt(i)) + interletrado;
  }
  anchoTexto -= interletrado;

  // Límite de seguridad: si aun así no cabe en pantalla, lo reducimos más
  let margen = 60;
  let anchoDisponible = width - margen * 2;

  if (anchoTexto > anchoDisponible) {
    let factor = anchoDisponible / anchoTexto;
    tamano = tamano * factor;
    textSize(tamano);

    anchoTexto = 0;
    for (let i = 0; i < texto.length; i++) {
      anchoTexto += textWidth(texto.charAt(i)) + interletrado;
    }
    anchoTexto -= interletrado;
  }

  let x = width / 2 - anchoTexto / 2;
  let y = height / 2;

  for (let i = 0; i < texto.length; i++) {
    let letra = texto.charAt(i);
    let letraWidth = textWidth(letra);
    let letraX = x + letraWidth / 2;

    push();
    translate(letraX, y);
    text(letra, 0, 0);
    pop();

    x += letraWidth + interletrado;
  }
}