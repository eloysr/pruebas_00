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
  textSize(48);
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

  // Configuración del reconocimiento de voz
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = true;      // sigue escuchando sin parar
  reconocimiento.interimResults = false; // solo frases ya confirmadas, no a medio decir

  reconocimiento.onresult = (evento) => {
    let ultimoResultado = evento.results[evento.results.length - 1];
    texto = ultimoResultado[0].transcript.toUpperCase();
  };

  reconocimiento.onend = () => {
    reconocimiento.start(); // se reinicia solo si el navegador lo corta
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

  let interletradoActual = interletrado + nivel * 150;

  let anchoTotal = 0;
  for (let i = 0; i < texto.length; i++) {
    anchoTotal += textWidth(texto.charAt(i)) + interletradoActual;
  }
  anchoTotal -= interletradoActual;

  let x = width / 2 - anchoTotal / 2;
  let y = height / 2;

  for (let i = 0; i < texto.length; i++) {
    let letra = texto.charAt(i);
    let letraWidth = textWidth(letra);
    let letraX = x + letraWidth / 2;

    let desplazamiento = sin(frameCount * 0.2 + i) * nivel * 400;
    let escala = 1 + nivel * 5;

    push();
    translate(letraX, y + desplazamiento);
    scale(escala);
    text(letra, 0, 0);
    pop();

    x += letraWidth + interletradoActual;
  }
}