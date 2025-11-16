let table;
let fontTitolo;
let fontTesto;

let datiFiltratiPerAnno = []; // array per dati un solo anno

// costanti sfondo gradiente
const coloreBackgroundTop = "#d6fcffff";
const coloreBackgroundBottom = "#fdf98aff";

// navbar e prato
const coloreTitolo = 40;
const coloreNavBar = ["#a8ca88cf"];
const coloreBordoNavBar = "#000000c4";
const colorePrato = "#00341eff";


let paesiPerRegione = {};
let posizioniPerRegione = {};
let paeseInHoverGlobale;


const coloreBackgroundTooltip = ["#efefefff"];
const coloreBordoTooltip = 100;
const coloreTestoTooltip = 40;


const coloreStelo = ["#ce1e4a90"];
const coloreCentroSoffione = ["#00341eff"];
const colori = {
  F: { base: "#2d6d6dbd", light: "#6ea5a5", dark: "#1a4444" },
  PF: { base: "#8fa59cc1", light: "#b8cbc3", dark: "#6b7f76" },
  NF: { base: "#6f0c2bb0", light: "#dfd4c5", dark: "#9a8872" }
}

const coloreHighlight = ["#e6124790"];

const colorePannelloLegenda = "#a8ca88cf";


// variabili es 04
let paeseSelezionato = null;
let sottocategorieAperte = {}; // tiene traccia quali sottocategorie sono aperte


function preload() {
  table = loadTable('FREEDOMHOUSE_ES3.csv', 'csv', 'header');

  fontTitolo = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
  fontTesto = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}


function setup() {
  let altezzaTotale = 1250;
  createCanvas(windowWidth, altezzaTotale);

  textFont(fontTesto);

  // Carica TUTTI i dati del 2025 direttamente
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let paese = {
      nome: row.get('Country/Territory'),
      regione: row.get('Region'),
      tipo: row.get('C/T'),
      status: row.get('Status'),
      pr: parseInt(row.get('PR')) || 0, 
      cl: parseInt(row.get('CL')) || 0,
      total: parseInt(row.get('TOTAL ')) || 0,
      // aggiungo tutte le sottocategorie
      totalA: parseInt(row.get('Total A')) || 0,
      totalB: parseInt(row.get('Total B')) || 0,
      totalC: parseInt(row.get('Total C')) || 0,
      totalD: parseInt(row.get('Total D')) || 0,
      totalE: parseInt(row.get('Total E')) || 0,
      totalF: parseInt(row.get('Total F')) || 0,
      totalG: parseInt(row.get('Total G')) || 0,
      // aggiungo domande parametri
      a1: parseInt(row.get('Question A1')) || 0,
      a2: parseInt(row.get('Question A2')) || 0,
      a3: parseInt(row.get('Question A3')) || 0,
      b1: parseInt(row.get('Question B1')) || 0,
      b2: parseInt(row.get('Question B2')) || 0,
      b3: parseInt(row.get('Question B3')) || 0,
      b4: parseInt(row.get('Question B4')) || 0,
      c1: parseInt(row.get('Question C1')) || 0,
      c2: parseInt(row.get('Question C2')) || 0,
      c3: parseInt(row.get('Question C3')) || 0,
      d1: parseInt(row.get('Question D1')) || 0,
      d2: parseInt(row.get('Question D2')) || 0,
      d3: parseInt(row.get('Question D3')) || 0,
      d4: parseInt(row.get('Question D4')) || 0,
      e1: parseInt(row.get('Question E1')) || 0,
      e2: parseInt(row.get('Question E2')) || 0,
      e3: parseInt(row.get('Question E3')) || 0,
      f1: parseInt(row.get('Question F1')) || 0,
      f2: parseInt(row.get('Question F2')) || 0,
      f3: parseInt(row.get('Question F3')) || 0,
      f4: parseInt(row.get('Question F4')) || 0,
      g1: parseInt(row.get('Question G1')) || 0,
      g2: parseInt(row.get('Question G2')) || 0,
      g3: parseInt(row.get('Question G3')) || 0,
      g4: parseInt(row.get('Question G4')) || 0
    };

    datiFiltratiPerAnno.push(paese);
  }

  raggruppaPaesiPerRegione();
  precalcolaPosizioniRegioni();
}


function draw() {
  paeseInHoverGlobale = null;
  background(220);

  disegnaGradiente();

  disegnaNavBar();

  // disegno "prato"
  let yPrato = 800;
  fill(colorePrato);
  noStroke();
  rect(0, yPrato, width, height - yPrato);

  // DISEGNO TUTTI I SOFFIONI
  if (paesiPerRegione['Americas']) {
    disegnaSoffione(
      paesiPerRegione['Americas'], 
      'Americas',
      145, 550, 300, yPrato,
      posizioniPerRegione['Americas'],
      50, true, 0, 150
    );
  }
  
  if (paesiPerRegione['Europe']) {
    disegnaSoffione(
      paesiPerRegione['Europe'], 
      'Europe',
      180, 180, 
      width/3.8, yPrato,
      posizioniPerRegione['Europe'],
      40, true, 0, 180
    );
  }
  
  if (paesiPerRegione['Africa']) {
    disegnaSoffione(
      paesiPerRegione['Africa'], 
      'Africa',
      width/2.6, 350, 
      width/2.3, yPrato,
      posizioniPerRegione['Africa'],
      50, 
      true, 0, 180
    );
  }
  
  if (paesiPerRegione['Middle East']) {
    disegnaSoffione(
      paesiPerRegione['Middle East'], 
      'Middle East',
      width/1.75, 430, 
      width/2.5, yPrato,
      posizioniPerRegione['Middle East'],
      25, true, 20, -100
    );
  }
  
  if (paesiPerRegione['Eurasia']) {
    disegnaSoffione(
      paesiPerRegione['Eurasia'], 
      'Eurasia',
      width/1.45, 230, 
      width /1.7, yPrato,
      posizioniPerRegione['Eurasia'],
      20, true, 60, 70
    );
  }
  
  if (paesiPerRegione['Asia']) {
    disegnaSoffione(
      paesiPerRegione['Asia'], 
      'Asia',
      width/1.15, 200, 
      width/ 1.3, yPrato,
      posizioniPerRegione['Asia'],
      50, 
      true, 30, 155
    );
  }

  // PANNELLO LEGENDA
  disegnaPannelloLegenda(yPrato);

  // TESTO SOTTO
  disegnaSezioneTestuale(yPrato + 80);

  // V SCROLLA X VEDERE ALTRO
  disegnaIndicatoreScroll(yPrato);

  // DISEGNO TOOLTIP INFO (solo se non c'è pannello dettaglio aperto)
  if (paeseInHoverGlobale !== null && paeseSelezionato === null) {
    mostraInfoPaese(paeseInHoverGlobale, mouseX, mouseY);
  }

  // DISEGNO PANNELLO DETTAGLIO se paese selezionato
  if (paeseSelezionato !== null) {
  disegnaPannelloDettaglio();
}
}



function disegnaGradiente() {
  for (let y = 0; y < height; y++) { // scorre ogni riga di pixel dall'alto al basso
    let interp = map(y, 0, height, 0, 1); // posizione y convertita in valore da 0 a height
    let c = lerpColor(color(coloreBackgroundTop), color(coloreBackgroundBottom), interp); 
      // mi da colore c che è risultato interpolazione tra 2 colori 
    stroke(c);
    line(0, y, width, y); // ogni pixel di altezza occupato da una riga della lunghezza schermo del colore c
  }
}

function disegnaNavBar() {
  push();
  
  fill(coloreNavBar);
  stroke(coloreBordoNavBar);
  strokeWeight(0);
  let navHeight = 70;
  let navMargin = 320;
  rect(navMargin, 35, width - (navMargin * 2), navHeight, 100);
  
  textFont(fontTitolo);
  fill(coloreTitolo);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(40);
  textStyle(BOLD);
  text("FREEDOM IN THE WORLD", width/2, 65);
  
  pop();
}

function raggruppaPaesiPerRegione() {
  paesiPerRegione = {}; // creo oggetto che organizza paesi in base a regione
  
  for (let paese of datiFiltratiPerAnno) {
    // per ogni paese nell'array, o creo array vuoto per regione che non esiste
    // e ci metto dentro quel paese, o metto paese nella regione rispettiva
    if (!paesiPerRegione[paese.regione]) {
      paesiPerRegione[paese.regione] = [];
    }
    paesiPerRegione[paese.regione].push(paese);
  }
}


// per disegnare soffione prima calcolo posizioni casuali per vari paesi
// poi uso questa funzione per disegnare pallini per ogni stato in funzione per 
// disegnare il soffione intero
function calcolaPosizioniSoffione(paesi, dispersione = 1) {
  let posizioni = [];
  let raggioBase = 50 * dispersione;
  let numeroLivelli = ceil(sqrt(paesi.length / 12)); 
    // dispongo paesi in anelli, arrotondo per eccesso
    // radice quadrata di numero paesi / 12, perchè capacità dei cerchi
    // cresce quadraticamente, capacità dei livelli è uguale a circa
    // numero di livelli^2, quindi livelli ≈ √capacità
  let indicePaese = 0;
  
  for (let livello = 0; livello < numeroLivelli; livello++) {
    let raggio = raggioBase + (livello * 40 * dispersione);
    // calcolo raggi diversi in base a livello

    // calcolo numero pallini per livello in modo da limitare sovrapposizioni
    let paesiInQuestoLivello = min(
      floor((TWO_PI * raggio) / (20 * dispersione)), 
      // arrotondo per difetto: circonferenza / 20 (voglio che ogni pallino abbia 20 px a disposizione) 
      // x dispersione (controlla quindi se hanno poi più o meno spazio disponibile 
      // rispetto a default 20)
      paesi.length - indicePaese
      // il min() prende il valore più piccolo tra:
        // quanti pallini ci stanno fisicamente nel cerchio
        // quanti paesi  rimangono effettivamente da posizionare
    );
    
    // trovo posizione per ogni pallino nell'anello corrente
    for (let i = 0; i < paesiInQuestoLivello; i++) {
      if (indicePaese >= paesi.length) break; // si interrompe se supero numero di paesi
      
      let angolo = map(i, 0, paesiInQuestoLivello, 0, TWO_PI); 
      // distribuisco pllini di un livello su 360 gradi
      let variazioneRaggio = random(-10 * dispersione, 30 * dispersione);
      let variazioneAngolo = random(-0.08, 0.08); // "b" questa b mi ha fatto perdere 3 ore
      // x rendere più organico introduco variazione sia di angolo che di raggio
      
      // trasformo coordinate polari in cartesiane
      let x = (raggio + variazioneRaggio) * cos(angolo + variazioneAngolo);
      // cos(a) = cateto adiacente (x) / ipotenusa (r) 
      // --> quindi cateto adiacente (x) / ipotenusa (r) x r = cateto adiacente che è x
      let y = (raggio + variazioneRaggio) * sin(angolo + variazioneAngolo);
       // sin(a) = cateto opposto (y) / ipotenusa (r) 
        // --> quindi cateto opposto (y) / ipotenusa (r) x r = cateto opposto che è y

      posizioni.push({x: x, y: y});
      indicePaese++;
    }
  }
  
  return posizioni;
}

function precalcolaPosizioniRegioni() {
  // ora preparo coordinate per per pallini di ciascuna regione, e definisco dispersione
  posizioniPerRegione = {};
  
  for (let regione in paesiPerRegione) {
    // per ogni nome di regione nell'oggetto paesiperregione
    let paesi = paesiPerRegione[regione];
    // prendi l'aray di paesi di questa regione e chiamalo "paesi"
    let dispersione = map(paesi.length, 0, 50, 0.8, 1.2);
    // calcolo dispersione tra 0.8 e 1.2 in base a quanti paesi ci sono in una regione
    posizioniPerRegione[regione] = calcolaPosizioniSoffione(paesi, dispersione);
    // calcolo posizioni dei pallini per questa regione e salvo nell'oggetto 
    // posizioniPerRegione con il nome della regione come chiave
  }
}

function mostraInfoPaese(paese, x, y) {
  push();
  
  fill(coloreBackgroundTooltip);
  stroke(coloreBordoTooltip);
  strokeWeight(1);
  
  let larghezzaTooltip = 200;
  let altezzaTooltip = 115;
  
  let tooltipX = x + 15;
  let tooltipY = y + 15;
  

  // se tooltip esce dallo schermo spostalo
  if (tooltipX + larghezzaTooltip > width - 10) {
    tooltipX = x - larghezzaTooltip - 15;
  }
  if (tooltipY + altezzaTooltip > height - 10) {
    tooltipY = y - altezzaTooltip - 15;
  }
  if (tooltipX < 10) tooltipX = 10;
  if (tooltipY < 10) tooltipY = 10;
  
  rect(tooltipX, tooltipY, larghezzaTooltip, altezzaTooltip, 5);
  
  noStroke();
  fill(coloreTestoTooltip);
  textAlign(LEFT, TOP);
  textSize(12);
  textFont (fontTitolo)
  text(paese.nome, tooltipX + 10, tooltipY + 10);
  

  textSize(10);
  textFont (fontTesto)
  let tipoTesto = paese.tipo === 'c' ? 'Country' : 'Territory';
  text("Type: " + tipoTesto, tooltipX + 10, tooltipY + 45);
  text("Status: " + paese.status, tooltipX + 10, tooltipY + 30);
  text("Political Rights: " + paese.pr, tooltipX + 10, tooltipY + 60);
  text("Civil Liberties: " + paese.cl, tooltipX + 10, tooltipY + 75);
  text("Total Score: " + paese.total, tooltipX + 10, tooltipY + 90);
  
  pop();
}

function disegnaSoffione(
  paesi,              // array paesi nella regione
  nomeRegione,        // nome regione
  centroX, centroY,   // coordinate del centro soffione
  steloStartX, steloStartY,  // coordinate partenza dello stelo
  posizioni,          // Array delle posizioni precalcolate
  diametroCentro = 60,  // diametro del centro 
  mostraNome = true,    // se mostrare il nome regione
  labelOffsetX = 0,     // spostamento orizzontale dell'etichetta
  labelOffsetY = 180    // spostamento verticale dell'etichetta
) {
  push();
  
  // STELO

  noFill();
  stroke(coloreStelo);
  strokeWeight(3.5);
  
  bezier(
    steloStartX, steloStartY,
    steloStartX - 30, steloStartY - 80,
    centroX + 50, centroY + 50,
    centroX, centroY
  );
  
  // SOFFIONE
  // sposta l'origine del sistema di coordinate al centro del soffione
  translate(centroX, centroY);
  
  // per ogni paese diesgno linea che collega suo pallino al centro
  for (let i = 0; i < paesi.length; i++) {
    let paese = paesi[i];
    let pos = posizioni[i];
    
    stroke(colori[paese.status].light);
    strokeWeight(0.3);
    line(0, 0, pos.x, pos.y);
  }
  
  // variabile x contenere paese su cui stiamo in hover
  let paeseInHover = null;
  
  // finalmente disegno pallini aaaaaaaaaaaaaaaaa
  // per ogni paese calcolo dimensione pallino in base a punteggio totale
  for (let i = 0; i < paesi.length; i++) {
    let paese = paesi[i];
    let pos = posizioni[i];
    
    let dimensione = map(paese.total, 5, 100, 6, 25); 
    // distribuisco total score del paese, che va da 5 a 100, tra 6 e 25
    
    // distingue countries da territories
    if (paese.tipo === 'c') {
      // se è countries cerchio pieno
      fill(colori[paese.status].base);
      noStroke();
      circle(pos.x, pos.y, dimensione);
    } else {
      // altrimenti cerchi concentrici
      noFill();
      stroke(colori[paese.status].base);
      strokeWeight(1.5);
      circle(pos.x, pos.y, dimensione);
      strokeWeight(1);
      circle(pos.x, pos.y, dimensione * 0.65);
      strokeWeight(0.8);
      circle(pos.x, pos.y, dimensione * 0.35);
    }
    
    // rilevamento hover
    let distanzaMouse = dist(mouseX - centroX, mouseY - centroY, pos.x, pos.y);
    // calcolo distanza mouse e pallino (sto lavorando in sistema coordinate traslato
    // quindi devo sottrarre centro x e Y a mouse X e mouse Y che sono globali)

    // se mouse è dentro il pallino (distanza < raggio), disegna anello rosso intorno e salva questo paese
    if (distanzaMouse < dimensione/2) {
      noFill();
      stroke(coloreHighlight);
      strokeWeight(2.5);
      circle(pos.x, pos.y, dimensione + 6);
      paeseInHover = paese;
    }
  }
  
  // centro soffione
  fill(coloreCentroSoffione);
  noStroke();
  circle(0, 0, diametroCentro);
  
  pop();
  
  // disegno etichetta se la voglio
  if (mostraNome) {
    push();
    textFont(fontTitolo);
    fill(coloreTitolo);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text(nomeRegione, centroX + labelOffsetX, centroY + labelOffsetY);
    pop();
  }
  
  if (paeseInHover !== null) {
    paeseInHoverGlobale = paeseInHover;
  }
  // salvo paese in hover in una variabile
  
}


function disegnaPannelloLegenda(yPrato) {
  push();
  
  let pannelloX = width - 420;
  let pannelloY = yPrato - 370;
  let pannelloLarghezza = 380;
  let pannelloAltezza = 340;
  let raggioAngoli = 15;
  
  fill(colorePannelloLegenda);
  noStroke();
  rect(pannelloX, pannelloY, pannelloLarghezza, pannelloAltezza, raggioAngoli);
  
  let testoX = pannelloX + 25;
  let testoY = pannelloY + 40;
  
  fill(coloreTitolo);
  textAlign(LEFT, TOP);
  textSize(18);
  textFont(fontTitolo);
  text("COME LEGGERE LA VISUALIZZAZIONE", testoX, testoY);
  
  testoY += 35;
  textSize(11);
  textFont(fontTesto);

  let testoDescrizione = "Ogni soffione rappresenta una regione geopolitica.\nI pallini sono paesi/territori valutati secondo il\nFreedom in the World Index. Punta il cursore su \nuno di essi per visualizzarne i dettagli";
  text(testoDescrizione, testoX, testoY);
  
  testoY += 80;
  textFont(fontTitolo);
  text("Dimensione dei pallini:", testoX, testoY);
  
  testoY += 15;
  textFont(fontTesto);
  text("Indica il punteggio totale di libertà (0-100)", testoX, testoY);
  
  testoY += 25;
  fill(colori.F.base);
  circle(testoX + 10, testoY, 8);
  textSize(10);
  fill(coloreTitolo);
  text("Basso punteggio", testoX + 25, testoY - 5);
  
  fill(colori.F.base);
  circle(testoX + 140, testoY, 20);
  fill(coloreTitolo);
  text("Alto punteggio", testoX + 160, testoY - 5);
  
  testoY += 35;
  textSize(11);
  textFont(fontTitolo);
  fill(coloreTitolo);
  text("Status di Libertà:", testoX, testoY);
  
  testoY += 20;
  textFont(fontTesto);
  fill(colori.F.base);
  circle(testoX + 8, testoY, 12);
  fill(coloreTitolo);
  textSize(10);
  text("Free (F)", testoX + 20, testoY - 5);
  
  fill(colori.PF.base);
  circle(testoX + 100, testoY, 12);
  fill(coloreTitolo);
  text("Partly Free (PF)", testoX + 112, testoY - 5);
  
  fill(colori.NF.base);
  circle(testoX + 230, testoY, 12);
  fill(coloreTitolo);
  text("Not Free (NF)", testoX + 242, testoY - 5);
  
  testoY += 30;
  textSize(11);
  textFont(fontTitolo);
  fill(coloreTitolo);
  text("Tipo:", testoX, testoY);
  
  testoY += 20;
  textFont(fontTesto);
  fill(220);
  circle(testoX + 8, testoY, 12);
  fill(coloreTitolo);
  textSize(10);
  text("Country (nazione)", testoX + 20, testoY - 5);
  
  noFill();
  stroke(220);
  strokeWeight(1.2);
  circle(testoX + 160, testoY, 12);
  strokeWeight(0.8);
  circle(testoX + 160, testoY, 8);
  strokeWeight(0.6);
  circle(testoX + 160, testoY, 4);
  noStroke();
  fill(coloreTitolo);
  text("Territory (territorio)", testoX + 172, testoY - 5);

  pop();
}

function disegnaSezioneTestuale(yInizio) {
  push();
  
  let margine = 80;
  let larghezzaTotale = width - (margine * 2);
  let larghezzaColonna = larghezzaTotale / 3;
  
  let col1X = margine;
  textFont(fontTitolo);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(40);
  textStyle(BOLD);
  textLeading(40);
  text("ABOUT THE\nDATASET", col1X, yInizio);
  
  let col2X = margine + larghezzaColonna;
  textFont(fontTesto);
  textSize(13);
  textStyle(NORMAL);
  textLeading(22);
  fill(255, 255, 255, 230);
  
  let testo1 = "Freedom in the World è il rapporto annuale di Freedom House sulla libertà politica e i diritti civili nel mondo. Valuta lo stato della libertà in paesi e territori attraverso un'analisi dettagliata dei diritti politici e delle libertà civili.\n\nOgni paese riceve un punteggio da 0 a 100, basato su 25 indicatori che misurano la libertà di espressione, il diritto di voto, lo stato di diritto e altri aspetti che l'organizzazione ritiene indicatori della libertà umana.";
  
  text(testo1, col2X, yInizio, larghezzaColonna - 40);
  
  let col3X = margine + (larghezzaColonna * 2);
  
  let testo2 = "I paesi sono classificati in tre categorie: Free (liberi), Partly Free (parzialmente liberi) e Not Free (non liberi). Questa metodologia può essere utilizzata anche come strumento per comprendere le tendenze globali della democrazia.";
  
  text(testo2, col3X, yInizio, larghezzaColonna - 40);
  
  pop();
}

function disegnaIndicatoreScroll(yPrato) {
  push();
  
  let x = width / 2;
  let y = yPrato - 40;
  
  // creo oscillazione verticale di 5px
  let offset = sin(frameCount * 0.05) * 5;
  y += offset;
  
  noFill();
  stroke(coloreCentroSoffione);
  
  strokeWeight(1.3);
  beginShape();
  vertex(x - 15, y - 10);
  vertex(x, y);
  vertex(x + 15, y - 10);
  endShape();
  
  beginShape();
  vertex(x - 15, y + 5);
  vertex(x, y + 15);
  vertex(x + 15, y + 5);
  endShape();
  
  noStroke();
  fill(coloreCentroSoffione);
  textFont(fontTesto);
  textAlign(CENTER, CENTER);
  textSize(11);
  text("Scorri per saperne di più", x, y - 35);
  
  pop();
}

function mousePressed() {
  // se c'è già pannello aperto, controlla se clicco su X per chiuderlo
  if (paeseSelezionato !== null) {
    let margine = 60;
    let larghezzaPannello = width - (margine * 2);
    let altezzaPannello = windowHeight - (margine * 2);
    let pannelloX = margine;
    let pannelloY = margine;
    
    // Posizione pulsante chiudi x
    let chiudiX = pannelloX + larghezzaPannello - 40;
    let chiudiY = pannelloY + 20;
    let chiudiSize = 30;
    
    if (mouseX > chiudiX && mouseX < chiudiX + chiudiSize &&
        mouseY > chiudiY && mouseY < chiudiY + chiudiSize) {
      paeseSelezionato = null;
      sottocategorieAperte = {};
      return;
    }
    
    // controlla click sui pulsanti + delle sottocategorie
    controllaClickSottocategorie();
    return;
  }
  
  // altrimenti guarda se clicco su un pallino x aprire dettaglio
  if (paeseInHoverGlobale !== null) {
    paeseSelezionato = paeseInHoverGlobale; // uso variabile già creata x es 03
    sottocategorieAperte = {}; // reset sottocategorie aperte
  }
}

function disegnaPannelloDettaglio() {
  push();
  
  let margine = 60;
  let larghezzaPannello = width - (margine * 2);
  let altezzaPannello = windowHeight - (margine * 2);
  let pannelloX = margine;
  let pannelloY = margine;
  
  //sfondo
  fill(255, 255, 255, 240);
  stroke(coloreTitolo);
  strokeWeight(2);
  rect(pannelloX, pannelloY, larghezzaPannello, altezzaPannello, 20);
  
  // Pulsante chiudi x 
  let chiudiX = pannelloX + larghezzaPannello - 40;
  let chiudiY = pannelloY + 20;
  stroke(coloreTitolo);
  strokeWeight(3);
  line(chiudiX, chiudiY, chiudiX + 20, chiudiY + 20);
  line(chiudiX + 20, chiudiY, chiudiX, chiudiY + 20);
  
  // DIVISIONE PANNELLO 2 PARTI
  let larghezzaSinistra = 450;
  let xDivisione = pannelloX + larghezzaSinistra;
  //linea divisione
  stroke(coloreTitolo, 100);
  strokeWeight(1);
  line(xDivisione, pannelloY + 30, xDivisione, pannelloY + altezzaPannello - 30);
  

  // PANNELLO PARTE SINISTRA (INFO TESTUALI + BARRE)
  noStroke();
  fill(coloreTitolo);
  textFont(fontTitolo);
  textAlign(LEFT, TOP);
  
  let xTesto = pannelloX + 40;
  let yTesto = pannelloY + 40;
  
  // Nome paese e aanno
  textSize(32);
  text(paeseSelezionato.nome, xTesto, yTesto);
  yTesto += 40;
  textFont(fontTesto);
  textSize(16);
  fill(coloreTitolo, 150);
  text("2025", xTesto, yTesto);
  yTesto += 50;

  // POLITICAL RIGHTS
  fill(coloreTitolo);
  textFont(fontTitolo);
  textSize(20);
  text("POLITICAL RIGHTS: " + paeseSelezionato.pr, xTesto, yTesto);
  yTesto += 35;

  // Sottocategorie PR
  yTesto = disegnaSottocategoria(
    "A", 
    "Electoral Process", 
    paeseSelezionato.totalA, 
    12,
    [
      { testo: "Is the head of state and/or head of government elected through free and fair elections?", punteggio: paeseSelezionato.a1 },
      { testo: "Are the legislative representatives elected through free and fair elections?", punteggio: paeseSelezionato.a2 },
      { testo: "Are the electoral laws and framework fair?", punteggio: paeseSelezionato.a3 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );
  
  yTesto = disegnaSottocategoria(
    "B",
    "Political Pluralism and Participation",
    paeseSelezionato.totalB,
    16,
    [
      { testo: "Do people have the right to organize in different political parties?", punteggio: paeseSelezionato.b1 },
      { testo: "Is there a significant opposition vote and realistic possibility for power change?", punteggio: paeseSelezionato.b2 },
      { testo: "Are people free from domination by military, foreign powers, or other groups?", punteggio: paeseSelezionato.b3 },
      { testo: "Do minority groups have self-determination or participation in decision-making?", punteggio: paeseSelezionato.b4 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );
  
  yTesto = disegnaSottocategoria(
    "C",
    "Functioning of Government",
    paeseSelezionato.totalC,
    12,
    [
      { testo: "Do freely elected representatives determine government policies?", punteggio: paeseSelezionato.c1 },
      { testo: "Is the government free from pervasive corruption?", punteggio: paeseSelezionato.c2 },
      { testo: "Is the government accountable and transparent?", punteggio: paeseSelezionato.c3 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );


  yTesto += 30;
  
  // CIVIL LIBERTIES
  fill(coloreTitolo);
  textFont(fontTitolo);
  textSize(20);
  text("CIVIL LIBERTIES: " + paeseSelezionato.cl, xTesto, yTesto);
  yTesto += 35;
  
  // Sottocategorie CL
  yTesto = disegnaSottocategoria(
    "D",
    "Freedom of Expression and Belief",
    paeseSelezionato.totalD,
    16,
    [
      { testo: "Are there free and independent media?", punteggio: paeseSelezionato.d1 },
      { testo: "Are there free religious institutions and expression?", punteggio: paeseSelezionato.d2 },
      { testo: "Is there academic freedom?", punteggio: paeseSelezionato.d3 },
      { testo: "Is there open and free private discussion?", punteggio: paeseSelezionato.d4 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );
  
  yTesto = disegnaSottocategoria(
    "E",
    "Associational and Organizational Rights",
    paeseSelezionato.totalE,
    12,
    [
      { testo: "Is there freedom of assembly and demonstration?", punteggio: paeseSelezionato.e1 },
      { testo: "Is there freedom for NGOs?", punteggio: paeseSelezionato.e2 },
      { testo: "Are there free trade unions and collective bargaining?", punteggio: paeseSelezionato.e3 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );
  
  yTesto = disegnaSottocategoria(
    "F",
    "Rule of Law",
    paeseSelezionato.totalF,
    16,
    [
      { testo: "Is there an independent judiciary?", punteggio: paeseSelezionato.f1 },
      { testo: "Does the rule of law prevail in civil and criminal matters?", punteggio: paeseSelezionato.f2 },
      { testo: "Is there protection from political terror and unjustified imprisonment?", punteggio: paeseSelezionato.f3 },
      { testo: "Do laws guarantee equal treatment of population segments?", punteggio: paeseSelezionato.f4 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );
  
  yTesto = disegnaSottocategoria(
    "G",
    "Personal Autonomy and Individual Rights",
    paeseSelezionato.totalG,
    16,
    [
      { testo: "Does the state control travel, residence, or employment?", punteggio: paeseSelezionato.g1 },
      { testo: "Do citizens have the right to own property and establish businesses?", punteggio: paeseSelezionato.g2 },
      { testo: "Are there personal social freedoms, including gender equality?", punteggio: paeseSelezionato.g3 },
      { testo: "Is there equality of opportunity and absence of economic exploitation?", punteggio: paeseSelezionato.g4 }
    ],
    xTesto + 20,
    yTesto,
    larghezzaSinistra - 100
  );


  pop();
}


function disegnaSottocategoria(id, nome, punteggio, maxPunteggio, domande, x, y, larghezzaMax) {
  push();
  
  let yCorrente = y;
  let isAperta = sottocategorieAperte[id] || false;
  

  // NOMI PARAMETRI
  textFont(fontTesto);
  textSize(11);
  fill(coloreTitolo, 180);
  textAlign(LEFT, TOP);
  text(nome, x + 5, yCorrente, larghezzaMax - 80);
  
  yCorrente += 18; // spazio dopo il nome
  
  // BARRA PUNTEGGIO
  let barraHeight = 8; // barra molto sottile
  let barraMaxWidth = larghezzaMax - 90; // lascio spazio per punteggio a destra
  
  // sfondo
  fill(220);
  noStroke();
  rect(x + 5, yCorrente, barraMaxWidth, barraHeight, 4);
  
  // colore (in base punteggio)
  let percentuale = punteggio / maxPunteggio;
  let barraWidth = barraMaxWidth * percentuale; 
  
  // Colore barra in base a percentuale
  let coloreBarra;
  if (percentuale >= 0.75) {
    coloreBarra = color(45, 109, 109); // (F)
  } else if (percentuale >= 0.5) {
    coloreBarra = color(143, 165, 156); // (PF)
  } else {
    coloreBarra = color(111, 12, 43); //(NF)
  }
  
  fill(coloreBarra);
  if (barraWidth > 0) {
    rect(x + 5, yCorrente, barraWidth, barraHeight, 4);
  }
  
  // PUNTEGGIO IN NUMERO
  textFont(fontTitolo);
  textSize(18);
  fill(coloreTitolo);
  textAlign(RIGHT, CENTER);
  text(punteggio, x + larghezzaMax - 30, yCorrente + barraHeight/2);
  
  // Massimo punteggio più piccolo
  textFont(fontTesto);
  textSize(11);
  fill(coloreTitolo, 150);
  text("/" + maxPunteggio, x + larghezzaMax - 5, yCorrente + barraHeight/2);
  


  // PULSANTE ESPANDI
  let btnSize = 18;
  let btnX = x - 20;
  let btnY = y + 9; // allineamento
  
  // verifica se hover 
  let isHover = mouseX > btnX - btnSize/2 && mouseX < btnX + btnSize/2 &&
                mouseY > btnY - btnSize/2 && mouseY < btnY + btnSize/2;
  
  // evidenzia hover
  if (isHover) {
    fill(coloreHighlight, 150);
    noStroke();
    circle(btnX, btnY, btnSize + 4); // alone più grande
  }
  // effettivo
  if (isHover) {
    fill(coloreHighlight, 220);
  } else {
    fill(coloreTitolo, 120);
  }
  noStroke();
  circle(btnX, btnY, btnSize);
  
  stroke(255);
  strokeWeight(2);
  
  if (isAperta) {
    // Disegna X
    line(btnX - 4, btnY - 4, btnX + 4, btnY + 4);
    line(btnX + 4, btnY - 4, btnX - 4, btnY + 4);
  } else {
    // Disegna +
    line(btnX - 4, btnY, btnX + 4, btnY);
    line(btnX, btnY - 4, btnX, btnY + 4);
  }

  yCorrente += barraHeight + 5; // spazio dopo la barra

  yCorrente += 5; // piccolo spazio prima delle domande
  

  // DOMANDE ESPANSE
  if (isAperta) {
    textFont(fontTesto);
    textSize(10);
    fill(coloreTitolo, 180);
    textAlign(LEFT, TOP);
    
    for (let domanda of domande) {

      // cerchietto inidicatore colorato punteggio
      let punteggioPerc = domanda.punteggio / 4;
      let coloreIndicatore;
      if (punteggioPerc >= 0.75) {
        coloreIndicatore = color(45, 109, 109);
      } else if (punteggioPerc >= 0.5) {
        coloreIndicatore = color(143, 165, 156);
      } else {
        coloreIndicatore = color(111, 12, 43);
      }
      
      fill(coloreIndicatore);
      noStroke();
      circle(x + 10, yCorrente + 7, 6);
      
      // Punteggio domanda
      textFont(fontTitolo);
      textSize(10);
      fill(coloreTitolo);
      textAlign(LEFT, CENTER);
      text(domanda.punteggio + "/4", x + 20, yCorrente + 7);
      
      // Testo domanda
      textFont(fontTesto);
      textSize(9);
      fill(coloreTitolo, 160);
      textAlign(LEFT, TOP);
      text(domanda.testo, x + 50, yCorrente + 2, larghezzaMax - 60);
      
      // Calcolo altezza approssimativa (x evitare sovrapposizioni abbondo)
      let testoLarghezza = textWidth(domanda.testo);
      let righeStimate = ceil(testoLarghezza / (larghezzaMax - 60));
      yCorrente += max(18, righeStimate * 13 + 6);
    }
    yCorrente += 5; // spazio dopo tutte domande
  }
  
  yCorrente += 8; // spazio tra sottocategorie

  pop();
  return yCorrente;
}

function controllaClickSottocategorie() {
  if (paeseSelezionato === null) return;
  
  let margine = 60;
  let pannelloX = margine;
  let pannelloY = margine;
  let xTesto = pannelloX + 40;
  let yTesto = pannelloY + 40;
  
  // replico layout funzione disegna pannello così tasti posizionati esattamente stessi punti
  yTesto += 40; // nome paese
  yTesto += 50; // anno
  yTesto += 35; // titolo PR
  
  let btnSize = 18; // corrispnde dimensione in disegnasottocategoria
  
  //funzione helper che replica logica di disegnasottocategoria
  function checkButton(id, yStart) {
    // bottone posizionato a x - 20, y + 9 (come in disegnaSottocategoria)
    let btnX = xTesto + 20 - 20; // = xTesto (che è pannelloX + 40)
    let btnY = yStart + 9;
    
    // controllo se mouse è nell'area del bottone
    if (mouseX > btnX - btnSize/2 && mouseX < btnX + btnSize/2 &&
        mouseY > btnY - btnSize/2 && mouseY < btnY + btnSize/2) {
      let eraAperta = sottocategorieAperte[id] || false;
      //se clicco su una sottocategoria, chiudo tutte le altre
      sottocategorieAperte = {}; // chiudo tutto
      // Toggle: se aperta diventa chiusa, se chiusa diventa aperta
      sottocategorieAperte[id] = !eraAperta;
      return true;
    }
    return false;
  }
  
  //funzione per calcolare altezza di una sottocategoria (replica logica di disegnaSottocategoria)
  function altezzaSottocategoria(id, numDomande) {
    let altezza = 18 + 8 + 5 + 5 + 8; // nome(18) + barra(8) + spazi + margine finale
    
    if (sottocategorieAperte[id]) {
      //se aperta, aggiungo spazio per le domande (ogni domanda occupa circa 16-20px )
      altezza += numDomande * 18 + 10; // stima conservativa
    }
    
    return altezza;
  }
  
  // POLITICAL RIGHTS
  // Sottocategoria A
  if (checkButton("A", yTesto)) return;
  yTesto += altezzaSottocategoria("A", 3);
  
  // Sottocategoria B
  if (checkButton("B", yTesto)) return;
  yTesto += altezzaSottocategoria("B", 4);
  
  // Sottocategoria C
  if (checkButton("C", yTesto)) return;
  yTesto += altezzaSottocategoria("C", 3);
  
  yTesto += 30; // spazio prima CL
  yTesto += 35; // titolo CL
  
  // CIVIL LIBERTIES
  // Sottocategoria D
  if (checkButton("D", yTesto)) return;
  yTesto += altezzaSottocategoria("D", 4);
  
  // Sottocategoria E
  if (checkButton("E", yTesto)) return;
  yTesto += altezzaSottocategoria("E", 3);
  
  // Sottocategoria F
  if (checkButton("F", yTesto)) return;
  yTesto += altezzaSottocategoria("F", 4);
  
  // Sottocategoria G
  if (checkButton("G", yTesto)) return;
}