let texto = "TIPO GENERATIVO";

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

  let x = width / 2 - textWidth(texto) / 2;
  let y = height / 2;

  for (let i = 0; i < texto.length; i++) {
    let letra = texto.charAt(i);
    let letraWidth = textWidth(letra);
    let letraX = x + letraWidth / 2;

    // Distancia entre el mouse y esta letra
    let d = dist(mouseX, mouseY, letraX, y);

    // Cuanto más cerca el mouse, más se desplaza hacia arriba
    let desplazamiento = map(d, 0, 200, -60, 0, true);

    // Cuanto más cerca el mouse, más grande se ve la letra
    let escala = map(d, 0, 200, 1.8, 1, true);

    push();
    translate(letraX, y + desplazamiento);
    scale(escala);
    text(letra, 0, 0);
    pop();

    x += letraWidth;
  }
}