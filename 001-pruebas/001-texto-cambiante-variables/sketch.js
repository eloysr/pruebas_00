let interletrado = 15;
let mic;
let nivel = 0;
let micActivo = false;
let boton;
let texto = "Cargando frase...";
let entradaTexto;
let botonAplicarTexto;
let botonColor;
let botonFondo;
let botonTamano;
let botonFuente;
let paletaColores;
let paletaFondo;
let paletaTamano;
let paletaFuente;
let colorTexto = [255, 255, 255];
let colorFondo = [32, 32, 32];
let tamañoTexto = 80;
let fuenteTexto = "Helvetica";
let textoPersonalizado = false;
let swatchSeleccionadoTexto;
let swatchSeleccionadoFondo;
let sizeSeleccionado;
let fontSeleccionado;
let colorSeleccionadoHex = "#FFFFFF";
let colorFondoHex = "#202020";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textStyle(BOLD);
  textSize(80);
  textAlign(CENTER, CENTER);

  mic = new p5.AudioIn();

  const uiPanel = createDiv();
  uiPanel.addClass("ui-panel");
  uiPanel.style("position", "fixed");
  uiPanel.style("left", "20px");
  uiPanel.style("top", "20px");
  uiPanel.style("width", "360px");
  uiPanel.style("display", "flex");
  uiPanel.style("flex-direction", "column");
  uiPanel.style("gap", "10px");
  uiPanel.style("z-index", "1000");

  boton = createButton("Activar micrófono");
  boton.parent(uiPanel);
  boton.style("width", "auto");
  boton.style("height", "2.5rem");
  boton.mousePressed(activarMicrofono);

  entradaTexto = createInput("");
  entradaTexto.attribute("placeholder", "Escribe un texto personalizado");
  entradaTexto.parent(uiPanel);
  entradaTexto.style("width", "100%");
  entradaTexto.elt.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      aplicarTextoPersonalizado();
    }
  });

  botonAplicarTexto = createButton("Aplicar texto");
  botonAplicarTexto.parent(uiPanel);
  botonAplicarTexto.style("width", "auto");
  botonAplicarTexto.style("height", "2.5rem");
  botonAplicarTexto.mousePressed(aplicarTextoPersonalizado);

  botonColor = createButton(`Color · ${colorSeleccionadoHex}`);
  botonColor.parent(uiPanel);
  botonColor.style("width", "auto");
  botonColor.style("height", "2.5rem");
  botonColor.addClass("color-dropdown-button");
  botonColor.mousePressed(togglePaletaColores);

  botonFondo = createButton(`Fondo · ${colorFondoHex}`);
  botonFondo.parent(uiPanel);
  botonFondo.style("width", "auto");
  botonFondo.style("height", "2.5rem");
  botonFondo.addClass("color-dropdown-button");
  botonFondo.mousePressed(togglePaletaFondo);

  botonTamano = createButton(`Tamaño · ${tamañoTexto}`);
  botonTamano.parent(uiPanel);
  botonTamano.style("width", "auto");
  botonTamano.style("height", "2.5rem");
  botonTamano.addClass("color-dropdown-button");
  botonTamano.mousePressed(togglePaletaTamano);

  botonFuente = createButton(`Tipografía · ${fuenteTexto}`);
  botonFuente.parent(uiPanel);
  botonFuente.style("width", "auto");
  botonFuente.style("height", "2.5rem");
  botonFuente.addClass("color-dropdown-button");
  botonFuente.mousePressed(togglePaletaFuente);

  paletaColores = createDiv();
  paletaColores.addClass("color-palette");
  paletaColores.position(20, 260);
  paletaColores.style("display", "none");

  paletaFondo = createDiv();
  paletaFondo.addClass("color-palette");
  paletaFondo.position(20, 260);
  paletaFondo.style("display", "none");

  paletaTamano = createDiv();
  paletaTamano.addClass("option-palette");
  paletaTamano.position(20, 260);
  paletaTamano.style("display", "none");

  paletaFuente = createDiv();
  paletaFuente.addClass("option-palette");
  paletaFuente.position(20, 260);
  paletaFuente.style("display", "none");

  const paleta256 = generarPaleta256();
  paleta256.forEach((color, index) => {
    const swatch = createDiv();
    swatch.addClass("color-swatch");
    swatch.style("background", color.hex);
    swatch.attribute("data-hex", color.hex);
    swatch.parent(paletaColores);
    swatch.mousePressed(() => {
      seleccionarTextoColor(color.hex, swatch);
      paletaColores.style("display", "none");
    });

    if (color.hex === colorSeleccionadoHex) {
      seleccionarTextoColor(color.hex, swatch);
    }
  });

  paleta256.forEach((color, index) => {
    const swatch = createDiv();
    swatch.addClass("color-swatch");
    swatch.style("background", color.hex);
    swatch.attribute("data-hex", color.hex);
    swatch.parent(paletaFondo);
    swatch.mousePressed(() => {
      seleccionarFondoColor(color.hex, swatch);
      paletaFondo.style("display", "none");
    });

    if (color.hex === colorFondoHex) {
      seleccionarFondoColor(color.hex, swatch);
    }
  });

  const tamaños = [32, 48, 64, 80, 96, 120];
  tamaños.forEach((size) => {
    const item = createDiv(size.toString());
    item.addClass("option-item");
    item.parent(paletaTamano);
    item.mousePressed(() => {
      seleccionarTamano(size, item);
      paletaTamano.style("display", "none");
    });

    if (size === tamañoTexto) {
      seleccionarTamano(size, item);
    }
  });

  const fuentes = ["Helvetica", "Georgia", "Courier New", "Noto Sans", "Times New Roman", "Verdana"];
  fuentes.forEach((font) => {
    const item = createDiv(font);
    item.addClass("option-item");
    item.parent(paletaFuente);
    item.mousePressed(() => {
      seleccionarFuente(font, item);
      paletaFuente.style("display", "none");
    });

    if (font === fuenteTexto) {
      seleccionarFuente(font, item);
    }
  });

  paletaColores.elt.addEventListener("click", (evento) => evento.stopPropagation());
  paletaFondo.elt.addEventListener("click", (evento) => evento.stopPropagation());
  paletaTamano.elt.addEventListener("click", (evento) => evento.stopPropagation());
  paletaFuente.elt.addEventListener("click", (evento) => evento.stopPropagation());
  botonColor.elt.addEventListener("click", (evento) => evento.stopPropagation());
  botonFondo.elt.addEventListener("click", (evento) => evento.stopPropagation());
  botonTamano.elt.addEventListener("click", (evento) => evento.stopPropagation());
  botonFuente.elt.addEventListener("click", (evento) => evento.stopPropagation());

  // No random phrase loading on page load.
}

function aplicarTextoPersonalizado() {
  let valor = entradaTexto.value().trim();

  if (valor.length > 0) {
    texto = valor;
    textoPersonalizado = true;
  } else {
    texto = "Cargando frase...";
    textoPersonalizado = false;
  }
}

function seleccionarTextoColor(hex, swatch) {
  colorTexto = hexToRgb(hex);
  colorSeleccionadoHex = hex;
  botonColor.html(`Color · ${hex}`);

  if (swatchSeleccionadoTexto) {
    swatchSeleccionadoTexto.removeClass("selected");
  }

  swatch.addClass("selected");
  swatchSeleccionadoTexto = swatch;
}

function seleccionarFondoColor(hex, swatch) {
  colorFondo = hexToRgb(hex);
  colorFondoHex = hex;
  botonFondo.html(`Fondo · ${hex}`);

  if (swatchSeleccionadoFondo) {
    swatchSeleccionadoFondo.removeClass("selected");
  }

  swatch.addClass("selected");
  swatchSeleccionadoFondo = swatch;
}

function seleccionarTamano(size, item) {
  tamañoTexto = size;
  sizeSeleccionado = item;
  botonTamano.html(`Tamaño · ${size}`);

  if (sizeSeleccionado && sizeSeleccionado !== item) {
    sizeSeleccionado.removeClass("selected");
  }

  item.addClass("selected");
  sizeSeleccionado = item;
}

function seleccionarFuente(font, item) {
  fuenteTexto = font;
  fontSeleccionado = item;
  botonFuente.html(`Tipografía · ${font}`);

  if (fontSeleccionado && fontSeleccionado !== item) {
    fontSeleccionado.removeClass("selected");
  }

  item.addClass("selected");
  fontSeleccionado = item;
}

function togglePaletaColores() {
  const display = paletaColores.style("display");
  paletaColores.style("display", display === "none" ? "grid" : "none");
  paletaFondo.style("display", "none");
  paletaTamano.style("display", "none");
  paletaFuente.style("display", "none");
}

function togglePaletaFondo() {
  const display = paletaFondo.style("display");
  paletaFondo.style("display", display === "none" ? "grid" : "none");
  paletaColores.style("display", "none");
  paletaTamano.style("display", "none");
  paletaFuente.style("display", "none");
}

function togglePaletaTamano() {
  const display = paletaTamano.style("display");
  paletaTamano.style("display", display === "none" ? "grid" : "none");
  paletaColores.style("display", "none");
  paletaFondo.style("display", "none");
  paletaFuente.style("display", "none");
}

function togglePaletaFuente() {
  const display = paletaFuente.style("display");
  paletaFuente.style("display", display === "none" ? "grid" : "none");
  paletaColores.style("display", "none");
  paletaFondo.style("display", "none");
  paletaTamano.style("display", "none");
}

function generarPaleta256() {
  const niveles = [0, 32, 64, 96, 128, 160, 192, 224, 255];
  const colores = [];

  for (let r of niveles) {
    for (let g of niveles) {
      for (let b of niveles) {
        colores.push({
          hex: rgbToHex(r, g, b)
        });

        if (colores.length >= 256) {
          return colores;
        }
      }
    }
  }

  return colores;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((valor) => valor.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function hexToRgb(hex) {
  const limpio = hex.replace("#", "");
  const valor = limpio.length === 3
    ? limpio.split("").map((char) => char + char).join("")
    : limpio;

  const r = parseInt(valor.slice(0, 2), 16);
  const g = parseInt(valor.slice(2, 4), 16);
  const b = parseInt(valor.slice(4, 6), 16);

  return [r, g, b];
}

function activarMicrofono() {
  userStartAudio();
  mic.start();
  micActivo = true;
  boton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(colorFondo[0], colorFondo[1], colorFondo[2]);
  textFont(fuenteTexto);
  textSize(tamañoTexto);
  fill(colorTexto[0], colorTexto[1], colorTexto[2]);

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
    let escala = 1 + nivel * 600;

    push();
    translate(letraX, y + desplazamiento);
    scale(escala);
    text(letra, 0, 0);
    pop();

    x += letraWidth + interletradoActual;
  }
}