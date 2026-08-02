let mic;
let texto = "Pulsa Escuchar";
let tamano = 60;
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
    texto = resultado[0].transcript;

    let nivel = mic.getLevel();
    console.log("nivel:", nivel); // para calibrar; lo quitamos después

    // Tamaño mínimo fijo, tamaño máximo = el que ocupa TODO el ancho de pantalla
    let tamanoMinimo = 30;
    let tamanoMaximo = calcularTamanoParaAnchoCompleto(texto);

    // 0.15 es un volumen "alto" típico hablando fuerte; ajustamos abajo si hace falta
    let nivelAjustado = constrain(nivel / 0.15, 0, 1);
    tamano = lerp(tamanoMinimo, tamanoMaximo, nivelAjustado);
  };

  reconocimiento.onend = () => {
    if (escuchando) reconocimiento.start();
  };

  reconocimiento.start();
}

// Calcula qué tamaño de letra hace que el texto ocupe el ancho de la pantalla (con margen)
function calcularTamanoParaAnchoCompleto(cadena) {
  let margen = 40;
  let anchoDisponible = width - margen * 2;

  textSize(100); // tamaño de referencia para medir proporciones
  let anchoDeReferencia = textWidth(cadena);

  if (anchoDeReferencia === 0) return 100; // evita división por cero si el texto está vacío

  return (anchoDisponible / anchoDeReferencia) * 100;
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