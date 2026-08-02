let texto = "TIPO GENERATIVO";
let interletrado = 0;

function setup() {
  createCanvas(1000, 800);
  textFont("Helvetica");
  textStyle(BOLD);
  textSize(48);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(20);
  fill(255);

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

    let d = dist(mouseX, mouseY, letraX, y);
    let desplazamiento = map(d, 0, 20, -60, 0, true);

    push();
    translate(letraX, y + desplazamiento);
    text(letra, 0, 0);
    pop();

    x += letraWidth + interletrado;
  }
}