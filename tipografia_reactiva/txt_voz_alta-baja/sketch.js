let mic;
let palabras = []; // cada elemento: { texto: "hola", tamano: 80 }
let escuchando = false;
let reconocimiento;
let botonEscuchar, botonParar, botonLimpiar;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textAlign(LEFT, TOP); // alineación por esquina, más fácil para maquetar líneas

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

    let nivel = mic.getLevel();
    let nivelAjustado = constrain(nivel / 0.15, 0, 1);
    let tamano = lerp(30, 300, nivelAjustado);

    // Separamos la frase en palabras sueltas, cada una con el mismo tamaño
    let nuevasPalabras = frase.split(" ");
    for (let p of nuevasPalabras) {
      if (p.length > 0) {
        palabras.push({ texto: p, tamano: tamano });
      }
    }
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

  let margen = 40;
  let x = margen;
  let y = margen;
  let alturaLinea = 0; // altura de la palabra más grande de la línea actual
  let espacioEntrePalabras = 20;

  for (let palabra of palabras) {
    textSize(palabra.tamano);
    let ancho = textWidth(palabra.texto);

    // Si no cabe en esta línea, saltamos a la siguiente
    if (x + ancho > width - margen) {
      x = margen;
      y += alturaLinea;
      alturaLinea = 0;
    }

    text(palabra.texto, x, y);

    x += ancho + espacioEntrePalabras;
    alturaLinea = max(alturaLinea, palabra.tamano * 1.2); // 1.2 = interlineado
  }
}