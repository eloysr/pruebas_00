let mic;
let texto = "Pulsa Escuchar";
let tamano = 60;
let sensibilidad = 10;
let escuchando = false;
let reconocimiento;
let botonEscuchar, botonParar;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  mic = new p5.AudioIn();

  botonEscuchar = createButton("Escuchar");
  botonEscuchar.position(20, 20);
  botonEscuchar.mousePressed(empezarAEscuchar);

  botonParar = createButton("Dejar de escuchar");
  botonParar.position(120, 20);
  botonParar.mousePressed(pararDeEscuchar);
  botonParar.hide();
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
    texto = resultado[0].transcript; // sin toUpperCase — respeta may/minúsculas naturales

    let nivelAjustado = constrain(mic.getLevel() * sensibilidad, 0, 1);
    tamano = map(nivelAjustado, 0, 1, 20, 1200);
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

  textSize(tamano);
  text(texto, width / 2, height / 2);
}