let interletrado = 15;
let mic;
let nivel = 0;
let micActivo = false;
let boton;

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
  userStartAudio(); // necesario por políticas de autoplay del navegador
  mic.start();
  micActivo = true;
  boton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
  fill(255);

  if (micActivo) {
    nivel = mic.getLevel(); // valor entre 0 (silencio) y ~1 (muy fuerte)
  }

  let h = nf(hour(), 2);
  let m = nf(minute(), 2);
  let s = nf(second(), 2);
  let texto = h + " : " + m + " : " + s;

  let anchoTotal = 0;
  for (let i = 0; i < texto.length; i++) {
    anchoTotal += textWidth(texto.charAt(i)) + interletrado;
  }
  anchoTotal -= interletrado;

  let x = width / 2 - anchoTotal / 2;
  let y = height / 2;

  for (let i = 0; i < texto.length; i++) {
    let letra = texto.charAt(i);
    let letraWidth = textWidth(letra);
    let letraX = x + letraWidth / 2;

    // Cada letra reacciona al volumen, con una variación distinta por letra
    let desplazamiento = sin(frameCount * 0.2 + i) * nivel * 400;

    push();
    translate(letraX, y + desplazamiento);
    text(letra, 0, 0);
    pop();

    x += letraWidth + interletrado;
  }
}