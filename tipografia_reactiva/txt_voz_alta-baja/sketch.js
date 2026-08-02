let mic;
let nivel = 0;
let texto = "DI ALGO";
let boton;
let sensibilidad = 8; // sube este número si necesitas más rango, baja si se satura muy rápido

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  mic = new p5.AudioIn();

  boton = createButton("Activar micrófono");
  boton.position(20, 20);
  boton.mousePressed(activar);
}

function activar() {
  userStartAudio();
  mic.start();
  boton.hide();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = true;
  reconocimiento.interimResults = true;

  reconocimiento.onresult = (evento) => {
    let resultado = evento.results[evento.results.length - 1];
    texto = resultado[0].transcript.toUpperCase();
  };

  reconocimiento.onend = () => reconocimiento.start();
  reconocimiento.start();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
  fill(255);

  nivel = mic.getLevel();

  // Volumen (0 a ~1) → tamaño de letra (20px a 500px)
  let nivelAjustado = constrain(nivel * sensibilidad, 0, 1);
  let tamano = map(nivelAjustado, 0, 1, 20, 500);

  textSize(tamano);
  text(texto, width / 2, height / 2);
}