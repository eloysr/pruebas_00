let texto = "TIPO GENERATIVO";
let tiempo = 0;

function setup() {
  createCanvas(800, 600);
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
    let offset = sin(tiempo + i * 0.3) * 30;

    push();
    translate(x, y + offset);
    text(letra, 0, 0);
    pop();

    x += textWidth(letra);
  }

  tiempo += 0.05;
}