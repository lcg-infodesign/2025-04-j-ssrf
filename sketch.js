let table;
let fontTitolo;
let fontTesto;

let datiFiltratiPerAnno = []; // array per dati un solo anno
let annoSelezionato = 2025; // di default mostro all'inizio 2025
let menuAnno;

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



function preload() {
  table = loadTable('FREEDOMHOUSE_ES3.csv', 'csv', 'header');

  fontTitolo = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
  fontTesto = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}


function setup() {
  let altezzaTotale = 1250;
  createCanvas(windowWidth, altezzaTotale);

  textFont(fontTesto);

  filtraDatiPerAnno(annoSelezionato);
 
  creareMenuAnno()
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

  // DISEGNO TOOLTIP INFO
  // nel draw pk voglio stia sopra a tutto
  if (paeseInHoverGlobale !== null) {
    mostraInfoPaese(paeseInHoverGlobale, mouseX, mouseY);
  }

}

function filtraDatiPerAnno(anno) {
  datiFiltratiPerAnno = [];
  
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let edizione = parseInt(row.get('Edition')); 
    // parseInt converte stringa in un numero intero, 
    // pk edizione nel dataser letta come stringa non corrisponde a 2025 
    // numero del menu tendina
    
    if (edizione === anno) {
      let paese = {
        nome: row.get('Country/Territory'),
        regione: row.get('Region'),
        tipo: row.get('C/T'),
        status: row.get('Status'),
        pr: parseInt(row.get('PR')) || 0, 
        cl: parseInt(row.get('CL')) || 0,
        total: parseInt(row.get('TOTAL ')) || 0
        // per sicurezza metto ||0 in modo che se cerco di parsare
        // una stringa che non è un numero non si buggi tutto ma mi dia 0
      };
      datiFiltratiPerAnno.push(paese);
    }
  }

  raggruppaPaesiPerRegione();
  precalcolaPosizioniRegioni(); 
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

function creareMenuAnno() {

  menuAnno = createSelect();
  menuAnno.id('menuAnno'); // assegno id per poter stilizzare in css nell'index
  
  let navHeight = 70;
  let navTop = 90;
  menuAnno.position(width / 2 - 50, navTop + (navHeight/2.5) );
  
  menuAnno.option('2025');
  menuAnno.option('2024');
  menuAnno.option('2023');
  menuAnno.selected(annoSelezionato.toString()); // di default seleziona anno corrente
  menuAnno.changed(cambiaAnno);
  // quando cambio la selezione chiama funzione cambiAnno
}

function cambiaAnno() {
  annoSelezionato = parseInt(menuAnno.value());
  filtraDatiPerAnno(annoSelezionato);
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