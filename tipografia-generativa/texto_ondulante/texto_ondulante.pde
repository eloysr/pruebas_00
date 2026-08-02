PFont fuente;
String texto = "TIPO GENERATIVO";
float tiempo = 0;

void setup() {
  size(1000, 800);
  fuente = createFont("Helvetica-Bold", 48);
  textFont(fuente);
  textAlign(CENTER, CENTER);
}

void draw() {
  background(20);
  fill(255);
  
  float x = width / 2 - textWidth(texto) / 2;
  float y = height / 2;
  
  for (int i = 0; i < texto.length(); i++) {
    char letra = texto.charAt(i);
    float offset = sin(tiempo + i * 0.3) * 30;
    
    pushMatrix();
    translate(x, y + offset);
    text(letra, 0, 0);
    popMatrix();
    
    x += textWidth(letra);
  }
  
  tiempo += 0.05;
}
