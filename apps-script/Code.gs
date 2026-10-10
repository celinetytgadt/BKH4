/**
 * Boekhoudapp 4e jaar (Fietsatelier Noor) — De MET
 * Serverkant: bewaren van werk, indienen ter nakijking, feedback teruggeven.
 *
 * ÉÉN SCRIPT EN ÉÉN SHEET VOOR DE DRIE VESTIGINGEN. In kern 8 had elke
 * vestiging een eigen Sheet met een eigen kopie van dit script, en moest
 * elke wijziging drie keer gebeuren. Hier is er nog maar één: de app stuurt
 * bij elk verzoek de code van de vestiging mee (LEU, SKW, TW), en in de
 * tabbladen Klas, Inzendingen en Detail staat die code in een eigen kolom.
 * Filter op die kolom om enkel je eigen vestiging te zien.
 *
 * Deze code hoort in het Apps Script-project dat vasthangt aan de Google
 * Sheet (Extensies → Apps Script), samen met SleutelCase.gs en het manifest
 * appsscript.json. Dat manifest beperkt de toegang: enkel deze Sheet, en in
 * Drive enkel de map die het script zelf aanmaakt.
 * Ze draait onder het account van wie ze publiceert: leerlingen loggen
 * nergens in en krijgen zelf geen enkele toegang tot de Sheet of tot de
 * Drive-map met de werkbestanden.
 *
 * Zie HANDLEIDING-koppeling.md voor de installatie.
 *
 * ---------------------------------------------------------------------------
 * DE TABBLADEN
 *
 *   Klas          vestiging | naam | code | opmerking
 *                 De namen die in de app in de keuzelijst staan, met hun
 *                 persoonlijke code. Alleen hier staan de codes — nooit in
 *                 de app-code, want die is publiek leesbaar. Een leerling
 *                 ziet enkel de namen van de gekozen vestiging.
 *
 *   Inzendingen   één rij per verrichting per inzending. Hier kijk je na.
 *                 Er wordt NOOIT een rij overschreven of verwijderd, zodat
 *                 je de evolutie van elke leerling kan volgen.
 *
 *   Detail        één rij per boekingslijn, voor als je wil uitpluizen wat
 *                 er precies geboekt is.
 *
 *   Instellingen  instelling | waarde | toelichting
 *                 De teksten en links die de app toont, en de expertcode
 *                 waarmee een vakexpert het beheertabblad in de app opent.
 *                 Deze gelden voor de drie vestigingen samen.
 *
 *   Taken         categorie | LEU | SKW | TW | opmerking
 *                 De taak in Classroom die bij elke categorie hoort, per
 *                 vestiging (elke school heeft haar eigen Classroom-klas).
 *                 De app toont die link bij het indienen.
 *
 *   Sleutel       de oplossing, per verrichting. Wordt bij de installatie
 *                 automatisch ingevuld met de sleutel van de case
 *                 (SleutelCase.gs).
 * ---------------------------------------------------------------------------
 */

/* ==========================================================================
   Instellingen
   ========================================================================== */

// Moet exact overeenkomen met SLEUTEL in js/config-koppeling.js.
// Dit is een drempel, geen slot: de app-code is publiek leesbaar. Ze houdt
// toevallige of geautomatiseerde rommel tegen, niet iemand die het meent.
//
// LET OP bij een update: plak je een nieuwe versie van dit bestand in de
// Apps Script-editor, kijk dan altijd of dit woord nog klopt. Staat hier
// iets anders dan in js/config-koppeling.js, dan weigert het script alles
// met de melding "de app is niet juist ingesteld".
var SLEUTEL = "DEMET";

// ---------------------------------------------------------------------------
// DE VESTIGINGEN
//
// De codes moeten exact overeenkomen met VESTIGINGEN in
// js/config-koppeling.js. Een verzoek met een andere code wordt geweigerd.
//
// De code komt vooraan in de bestandsnaam van het werkbestand
// (werk_LEU_lotte.json), zodat de drie vestigingen samen in dezelfde map
// staan zonder elkaars werk te overschrijven, en in een eigen kolom van de
// tabbladen Klas, Inzendingen en Detail.
var VESTIGINGEN = {
  LEU: "Leuven",
  SKW: "Katelijne",
  TW: "Tielt-Winge",
};

// De werkbestanden komen in een map die het script zelf aanmaakt (zie
// "Werk bewaren en ophalen" hieronder): het script heeft bewust enkel
// toegang tot wat het zelf maakte. Het ID van die map staat in de
// scripteigenschappen; menu Boekhoudapp → Waar staan de werkbestanden?

var BLAD_KLAS = "Klas";
var BLAD_INZENDINGEN = "Inzendingen";
var BLAD_DETAIL = "Detail";
var BLAD_INSTELLINGEN = "Instellingen";
var BLAD_TAKEN = "Taken";
var BLAD_SLEUTEL = "Sleutel";

var MAP_NAAM = "Boekhoudapp 4e jaar werkbestanden";
var MAP_VERSIES = "versies";

// Hoeveel oudere versies van het werkbestand bewaard blijven per leerling.
var AANTAL_VERSIES = 5;
// Er wordt hoogstens één keer per zoveel minuten een extra versie weggezet.
var VERSIE_INTERVAL_MIN = 60;

var KOP_INZENDINGEN = [
  "tijdstip", "vestiging", "leerling", "categorie", "ref", "boeking", "status leerling",
  "beoordeling", "feedback", "klaar", "is laatste", "inzending",
  "automatische controle",
];
var KOP_DETAIL = [
  "tijdstip", "vestiging", "leerling", "inzending", "ref", "lijn", "bedrag", "rekening",
  "omschrijving", "D/C", "relatie", "redenering", "A/P/K/O", "stijgt/daalt",
];
var KOP_KLAS = ["vestiging", "naam", "code", "opmerking"];
var KOP_SLEUTEL = ["ref", "rekening of veld", "D/C", "bedrag of rubrieken", "opmerking"];

// Van welke leerling de oplossingssleutel standaard overgenomen wordt (menu
// Boekhoudapp → Sleutel overnemen uit een inzending). Je kan bij het
// overnemen nog een andere naam intikken.
var SLEUTEL_LEERLING = "test";

var KOP_INSTELLINGEN = ["instelling", "waarde", "toelichting"];
// Kolom A de categorie, dan één kolom per vestiging met de link naar de taak
// in Classroom, en als laatste een opmerking. In de kolom van een vestiging
// hoort de volledige link uit Classroom (taak openen -> de drie puntjes ->
// Link kopiëren), dus iets als https://classroom.google.com/c/<klas>/a/<taak>/details
function kopTaken_() {
  return ["categorie"].concat(Object.keys(VESTIGINGEN)).concat(["opmerking"]);
}

// De categorieën waarvoor er een taak in Classroom bestaat. Ze komen overeen
// met wat de leerling in het indienvenster aanvinkt. Eindbalans en
// resultaatverwerking horen samen in één taak; de rest staat apart per soort
// verrichting. Wijzigt de bundel van opbouw, dan zet je hier de nieuwe
// categorieën en draai je Boekhoudapp -> Eerste installatie opnieuw. Het
// beheertabblad in de app werkt de lijst ook zelf bij.
var TAAK_CATEGORIEEN = [
  "K1 · Aankopen",
  "K1 · Verkopen",
  "K1 · Btw-verwerking",
  "K1 · Financiële verrichtingen",
  "K2 · Aankopen",
  "K2 · Verkopen",
  "K2 · Btw-verwerking",
  "K2 · Financiële verrichtingen",
  "K3 · Aankopen en verkopen",
  "K3 · Btw-verwerking",
  "K3 · Financiële verrichtingen",
  "K4 · Alle verrichtingen",
  "Eindejaarsverrichtingen",
  "Resultaatverwerking & Eindbalans",
];

// De instellingen die de vakexpert vanuit de app kan aanpassen, met de
// toelichting die in kolom C van het tabblad Instellingen komt te staan.
// Wie liever rechtstreeks in de Sheet werkt, kan dat: de app leest gewoon
// wat er in kolom B staat.
var INSTELLINGEN_UITLEG = [
  ["expertcode", "",
    "De code waarmee een vakexpert het tabblad Beheer in de app opent. Deel ze enkel met je collega-experten. Leeg = het beheertabblad blijft dicht."],
  ["welkomsttekst", "",
    "De tekst op de startpagina van de app. Lege regel = nieuwe alinea. Een link maak je zo: [naar de cursus](https://...). Leeg = de standaardtekst van de app."],
  ["mededeling", "",
    "Korte mededeling in een gekleurd kader bovenaan elke pagina (bv. \"Indienen kan tot vrijdag 17 u\"). Leeg = geen kader."],
  ["cursusUrl", "",
    "Link naar de digitale cursus. Staat als knop Cursus bovenaan in de app, op elk tabblad."],
  ["handleidingUrl", "",
    "Link naar de handleiding voor de leerlingen. Staat als knop Handleiding bovenaan. Leeg = die knop verdwijnt."],
];

// Kolomnummers in Inzendingen (1-gebaseerd), zodat de rest leesbaar blijft.
var K_TIJDSTIP = 1, K_VESTIGING = 2, K_LEERLING = 3, K_CATEGORIE = 4, K_REF = 5,
    K_BOEKING = 6, K_STATUS_LEERLING = 7, K_BEOORDELING = 8, K_FEEDBACK = 9,
    K_KLAAR = 10, K_IS_LAATSTE = 11, K_INZENDING = 12, K_AUTOMATISCH = 13;

// De drie beoordelingen, gelijk aan de afspraken met de collega's in
// Classroom. "In orde" heeft een bijzondere betekenis in de app: zo'n
// verrichting gaat op slot en wordt niet meer meegestuurd bij een volgende
// inzending. Wijzig die schrijfwijze dus niet zonder IN_ORDE in js/app.js
// mee aan te passen.
var BEOORDELINGEN = ["In orde", "Te remediëren", "Niet afgerond"];

var BEOORDELING_KLEUREN = {
  "In orde": "#d9ead3",        // groen
  "Te remediëren": "#fce5cd",  // oranje
  "Niet afgerond": "#f4cccc",  // rood
};

/* ==========================================================================
   Binnenkomende verzoeken
   ========================================================================== */

/**
 * De app haalt gegevens op met een GET: het bewaarde werk of de feedback.
 * GET wordt bewust gebruikt voor lezen, POST voor schrijven.
 */
function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.sleutel !== SLEUTEL) return antwoord({ ok: false, fout: "sleutel" });

    // Elk verzoek hoort bij één vestiging: die bepaalt welke klaslijst,
    // welke taken en welke werkbestanden er gebruikt worden.
    var vest = vestigingCode_(p.vestiging);
    if (!vest) return antwoord({ ok: false, fout: "vestiging onbekend: " + (p.vestiging || "(geen)") });

    // De instellingen, de taken en de namen van de klaslijst. Bewust zonder
    // aanmelding: de app heeft de namen nodig vóór de leerling aangemeld is.
    // Er gaat hier niets naar buiten dat niet toch al in de app zichtbaar is.
    if (p.actie === "instellingen") return antwoord(instellingenPubliek_(vest));

    // Het beheertabblad in de app: enkel met de expertcode.
    if (p.actie === "beheer") return antwoord(haalBeheerOp_(p.expertcode, vest));

    if (p.actie === "aanmelden") {
      return antwoord(controleerAanmelding(vest, p.naam, p.code));
    }

    if (p.actie === "werk") {
      var check = controleerAanmelding(vest, p.naam, p.code);
      if (!check.ok) return antwoord(check);
      return antwoord(haalWerkOp(vest, check.leerling));
    }

    if (p.actie === "feedback") {
      var check2 = controleerAanmelding(vest, p.naam, p.code);
      if (!check2.ok) return antwoord(check2);
      return antwoord({ ok: true, feedback: haalFeedbackOp(vest, check2.leerling) });
    }

    return antwoord({ ok: false, fout: "onbekende actie" });
  } catch (err) {
    return antwoord({ ok: false, fout: String(err) });
  }
}

/**
 * De app schrijft met een POST: het werk bewaren of een inzending doen.
 *
 * De app stuurt bewust Content-Type text/plain. Bij application/json stuurt
 * de browser eerst een OPTIONS-verzoek, en daar antwoordt Apps Script niet
 * op — dan zou elke verzending stuklopen op CORS.
 */
function doPost(e) {
  var lock = null;
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.sleutel !== SLEUTEL) return antwoord({ ok: false, fout: "sleutel" });
    var vest = vestigingCode_(data.vestiging);
    if (!vest) return antwoord({ ok: false, fout: "vestiging onbekend: " + (data.vestiging || "(geen)") });

    /* Enkel wie in de Sheet schrijft, heeft het slot nodig: die rijen mogen
       niet door elkaar geschreven worden. Het gewone bewaren schrijft naar
       één bestand in de Drive — dat van díé leerling — en kan niemand in de
       weg zitten.

       Dat maakte het verschil: elke leerling bewaart om de twee minuten, en
       zolang het bewaren óók het slot nam, stond wie op dat moment iets in
       het beheertabblad wilde opslaan gewoon te wachten tot alle andere
       verzoeken van die minuut voorbij waren. */
    var neemSlot = function () {
      lock = LockService.getScriptLock();
      return lock.tryLock(30000);
    };

    // Het beheertabblad meldt zich met de expertcode aan en niet met een
    // leerlingnaam. Daarom vóór de gewone aanmeldcontrole.
    if (data.actie === "beheerBewaren") {
      if (!neemSlot()) return antwoord({ ok: false, fout: "te druk, probeer opnieuw" });
      return antwoord(bewaarBeheer_(data, vest));
    }

    var check = controleerAanmelding(vest, data.naam, data.code);
    if (!check.ok) return antwoord(check);

    if (data.actie === "bewaren") {
      return antwoord(bewaarWerk(vest, check.leerling, data.state));
    }
    if (data.actie === "indienen") {
      if (!neemSlot()) return antwoord({ ok: false, fout: "te druk, probeer opnieuw" });
      return antwoord(verwerkInzending(vest, check.leerling, data));
    }
    return antwoord({ ok: false, fout: "onbekende actie" });
  } catch (err) {
    return antwoord({ ok: false, fout: String(err) });
  } finally {
    if (lock) { try { lock.releaseLock(); } catch (e2) {} }
  }
}

/**
 * De code van een vestiging zoals ze in VESTIGINGEN staat, of "" als ze daar
 * niet in staat. Hoofdletters maken niet uit.
 */
function vestigingCode_(code) {
  var c = String(code || "").trim().toUpperCase();
  return Object.prototype.hasOwnProperty.call(VESTIGINGEN, c) ? c : "";
}

function antwoord(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ==========================================================================
   Aanmelding
   ========================================================================== */

/**
 * Vergelijkt naam en code met het tabblad Klas, enkel bij de leerlingen van
 * de gekozen vestiging. De naam wordt vergeleken zonder hoofdletters, spaties
 * en leestekens: "Lotte V." en "lotte v" zijn dezelfde leerling. Zo raakt
 * niemand werk kwijt door een tikfout.
 */
function controleerAanmelding(vest, naam, code) {
  if (!naam) return { ok: false, fout: "geen naam" };
  blad_(BLAD_KLAS);   // foutmelding als de installatie nog niet gebeurd is
  var rijen = klasLezen_(vest);

  // Staat er voor deze vestiging nog geen enkele naam in het tabblad Klas,
  // dan werkt de app zonder codes verder. Zo kan je testen vóór de
  // klaslijst vastligt.
  if (!rijen.length) return { ok: true, leerling: String(naam).trim(), zonderCode: true };

  var gezocht = normaliseerNaam_(naam);
  for (var i = 0; i < rijen.length; i++) {
    if (normaliseerNaam_(rijen[i].naam) !== gezocht) continue;
    var juisteCode = rijen[i].code;
    if (!juisteCode) return { ok: true, leerling: rijen[i].naam, zonderCode: true };
    if (String(code || "").trim() !== juisteCode) return { ok: false, fout: "code" };
    // De schrijfwijze uit de Klas-lijst wint, zodat de Sheet netjes blijft.
    return { ok: true, leerling: rijen[i].naam };
  }
  return { ok: false, fout: "naam onbekend" };
}

function normaliseerNaam_(n) {
  return String(n || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/* ==========================================================================
   Werk bewaren en ophalen (Drive)

   BEPERKTE TOEGANG. Dit script mag in Drive enkel aan de bestanden en mappen
   die het zelf aangemaakt heeft (toegang "drive.file", zie appsscript.json).
   De rest van de Drive van het account blijft voor het script onzichtbaar.
   Daarom gebruikt het hier niet DriveApp — dat vraagt altijd toegang tot de
   volledige Drive — maar de geavanceerde dienst "Drive" (Drive API v3).

   Lezen kan de Drive-dienst met die beperkte toegang niet. Daarvoor haalt
   het script de inhoud op via het Drive-adres van Google zelf (UrlFetchApp).
   In appsscript.json staat dat het script enkel dát adres mag aanspreken.

   Gevolg: het script maakt zijn map zelf aan. Een bestaande map opgeven kan
   niet, want daar zou het script geen toegang toe hebben.
   ========================================================================== */

var MIME_MAP = "application/vnd.google-apps.folder";
var DRIVE_URL = "https://www.googleapis.com/drive/v3/files/";

// Een tekst veilig in een zoekvraag van Drive zetten.
function driveTekst_(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// Alle bestanden die aan een zoekvraag voldoen: [{ id, name, createdTime }].
// Met drive.file ziet het script enkel wat het zelf aangemaakt heeft.
function driveZoek_(vraag) {
  var uit = [];
  var token = null;
  do {
    var r = Drive.Files.list({
      q: vraag,
      fields: "nextPageToken, files(id, name, createdTime)",
      pageSize: 1000,
      pageToken: token || undefined,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    uit = uit.concat(r.files || []);
    token = r.nextPageToken;
  } while (token);
  return uit;
}

function bestandenInMap_(mapId) {
  return driveZoek_("'" + driveTekst_(mapId) + "' in parents and trashed = false and mimeType != '" + MIME_MAP + "'");
}

function bestandInMap_(mapId, naam) {
  var lijst = driveZoek_("'" + driveTekst_(mapId) + "' in parents and name = '" + driveTekst_(naam) + "' and trashed = false");
  return lijst.length ? lijst[0] : null;
}

function maakBestand_(mapId, naam, inhoud) {
  return Drive.Files.create(
    { name: naam, parents: [mapId], mimeType: "application/json" },
    Utilities.newBlob(inhoud, "application/json", naam),
    { supportsAllDrives: true, fields: "id" });
}

function schrijfBestand_(id, inhoud) {
  Drive.Files.update({}, id, Utilities.newBlob(inhoud, "application/json"), { supportsAllDrives: true });
}

function leesBestand_(id) {
  var r = UrlFetchApp.fetch(DRIVE_URL + encodeURIComponent(id) + "?alt=media&supportsAllDrives=true", {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (r.getResponseCode() !== 200) {
    throw new Error("bestand niet leesbaar (code " + r.getResponseCode() + ")");
  }
  return r.getContentText("UTF-8");
}

function gooiWeg_(id) {
  Drive.Files.update({ trashed: true }, id, null, { supportsAllDrives: true });
}

function aanmaakTijd_(bestand) {
  return new Date(bestand.createdTime).getTime() || 0;
}

/**
 * Het volledige werk van een leerling als JSON-bestand in de map van het
 * script. Leerlingen hebben geen toegang tot die map: het script geeft alleen
 * het bestand terug dat bij hun eigen aanmelding hoort.
 */
function bewaarWerk(vest, naam, stateObj) {
  if (!stateObj) return { ok: false, fout: "geen werk meegestuurd" };
  var map = werkMap_();
  var bestandsnaam = werkBestandsnaam_(vest, naam);
  var inhoud = JSON.stringify({
    vestiging: vest,
    leerling: naam,
    gewijzigd: new Date().toISOString(),
    state: stateObj,
  });

  var bestaand = bestandInMap_(map, bestandsnaam);
  if (bestaand) {
    bewaarVersie_(vest, naam, bestaand.id);
    schrijfBestand_(bestaand.id, inhoud);
  } else {
    maakBestand_(map, bestandsnaam, inhoud);
  }
  return { ok: true, gewijzigd: new Date().toISOString() };
}

/**
 * De naam van het werkbestand van één leerling. De code van de vestiging
 * staat erin, zodat de drie vestigingen samen in dezelfde map kunnen staan —
 * ook als er in twee scholen een Lotte zit.
 */
function werkBestandsnaam_(vest, naam) {
  return "werk_" + vestigingDeel_(vest) + normaliseerNaam_(naam) + ".json";
}

function vestigingDeel_(vest) {
  var v = String(vest || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return v ? v + "_" : "";
}

function haalWerkOp(vest, naam) {
  var bestand = bestandInMap_(werkMap_(), werkBestandsnaam_(vest, naam));
  if (!bestand) return { ok: true, gevonden: false };
  try {
    var pakket = JSON.parse(leesBestand_(bestand.id));
    return { ok: true, gevonden: true, gewijzigd: pakket.gewijzigd, state: pakket.state };
  } catch (err) {
    return { ok: false, fout: "bewaard bestand onleesbaar: " + err };
  }
}

/**
 * Zet af en toe een kopie van de vorige versie apart, zodat je werk kan
 * terugzetten als een leerling zich vergist. Hoogstens één kopie per uur,
 * en er blijven er AANTAL_VERSIES bewaard.
 *
 * Het uur wordt eerst in de scripteigenschappen nagekeken en pas daarna in de
 * map zelf: anders zou bij élke bewaarbeurt de versiemap doorzocht en het
 * oude bestand gelezen worden.
 */
function bewaarVersie_(vest, naam, bestandId) {
  try {
    var slug = vestigingDeel_(vest) + normaliseerNaam_(naam);
    var props = PropertiesService.getScriptProperties();
    var sleutelLaatste = "VERSIE_" + slug;
    var laatste = Number(props.getProperty(sleutelLaatste) || 0);
    if (laatste && (new Date().getTime() - laatste) / 60000 < VERSIE_INTERVAL_MIN) return;

    var map = versieMap_();
    var bestaand = versiesVan_(map, slug);

    if (bestaand.length) {
      var minutenGeleden = (new Date().getTime() - aanmaakTijd_(bestaand[0])) / 60000;
      if (minutenGeleden < VERSIE_INTERVAL_MIN) {
        props.setProperty(sleutelLaatste, String(aanmaakTijd_(bestaand[0])));
        return;
      }
    }
    props.setProperty(sleutelLaatste, String(new Date().getTime()));
    var stempel = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmm");
    maakBestand_(map, "werk_" + slug + "_" + stempel + ".json", leesBestand_(bestandId));

    for (var i = AANTAL_VERSIES - 1; i < bestaand.length; i++) gooiWeg_(bestaand[i].id);
  } catch (err) {
    // Een mislukte versiekopie mag het bewaren zelf nooit tegenhouden.
    console.error("versie bewaren mislukt: " + err);
  }
}

// De versies van één leerling, nieuwste eerst.
function versiesVan_(map, slug) {
  return bestandenInMap_(map)
    .filter(function (f) { return String(f.name).indexOf("werk_" + slug + "_") === 0; })
    .sort(function (a, b) { return aanmaakTijd_(b) - aanmaakTijd_(a); });
}

/**
 * De map met de werkbestanden (haar ID). Het script maakt ze de eerste keer
 * zelf aan in de Drive van het account waaronder het draait, en onthoudt het
 * ID. Wordt de map later verplaatst (bv. naar een gedeelde Drive), dan blijft
 * het ID hetzelfde en blijft het script ze dus vinden.
 */
function werkMap_() {
  return map_("MAP_ID", MAP_NAAM, null);
}

// De submap "versies", altijd ín de map hierboven.
function versieMap_() {
  return map_("MAP_VERSIES_ID", MAP_VERSIES, werkMap_());
}

function map_(eigenschap, naam, ouderId) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(eigenschap);
  if (id) {
    try {
      var info = Drive.Files.get(id, { fields: "id, trashed", supportsAllDrives: true });
      if (info && !info.trashed) return id;
    } catch (err) { /* map verwijderd — hieronder opnieuw zoeken of aanmaken */ }
  }
  // Met drive.file vindt dit enkel mappen die het script zelf maakte.
  var vraag = "name = '" + driveTekst_(naam) + "' and mimeType = '" + MIME_MAP + "' and trashed = false" +
    (ouderId ? " and '" + driveTekst_(ouderId) + "' in parents" : "");
  var gevonden = driveZoek_(vraag);
  var nieuwId = gevonden.length
    ? gevonden[0].id
    : Drive.Files.create(ouderId ? { name: naam, mimeType: MIME_MAP, parents: [ouderId] } : { name: naam, mimeType: MIME_MAP },
        null, { supportsAllDrives: true, fields: "id" }).id;
  props.setProperty(eigenschap, nieuwId);
  return nieuwId;
}

/* ==========================================================================
   Inzendingen
   ========================================================================== */

/**
 * Voegt de ingediende verrichtingen onderaan het tabblad Inzendingen toe.
 * Er wordt nooit iets overschreven; enkel de kolom "is laatste" van oudere
 * rijen van dezelfde leerling en dezelfde verrichting wordt leeggemaakt,
 * zodat je filter altijd de nieuwste versie toont.
 */
function verwerkInzending(vest, leerling, data) {
  var items = data.items || [];
  if (!items.length) return { ok: false, fout: "niets geselecteerd" };

  var nu = new Date();
  var inzendingId = Utilities.formatDate(nu, Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") +
    "-" + vest + "-" + normaliseerNaam_(leerling).slice(0, 8);

  var blad = blad_(BLAD_INZENDINGEN);
  var eersteNieuweRij = blad.getLastRow() + 1;

  var rijen = items.map(function (it) {
    return [
      nu, vest, leerling, it.categorie || "", it.ref || "", it.boeking || "",
      it.status || "", "", "", false, "JA", inzendingId, "",
    ];
  });
  blad.getRange(eersteNieuweRij, 1, rijen.length, KOP_INZENDINGEN.length).setValues(rijen);
  blad.getRange(eersteNieuweRij, K_KLAAR, rijen.length, 1).insertCheckboxes();
  blad.getRange(eersteNieuweRij, K_BEOORDELING, rijen.length, 1)
    .setDataValidation(beoordelingValidatie_());

  markeerOudereRijen_(blad, vest, leerling, items.map(function (it) { return it.ref; }), eersteNieuweRij);
  schrijfDetail_(vest, leerling, data, inzendingId, nu);

  // Meteen naast de sleutel leggen. Loopt daar iets mis, dan mag de
  // inzending zelf daar niet onder lijden: die staat er al.
  try {
    nakijkenEnSchrijven_(blad, eersteNieuweRij, items);
  } catch (err) {
    console.error("Automatisch nakijken mislukt: " + err);
  }

  return { ok: true, aantal: rijen.length, inzending: inzendingId };
}

/**
 * Zet "is laatste" leeg bij alle oudere rijen van deze leerling voor de
 * verrichtingen die nu opnieuw ingediend zijn.
 *
 * Er worden bewust enkel de drie kolommen gelezen die hier nodig zijn, en er
 * wordt enkel de kolom "is laatste" teruggeschreven. Vroeger ging het hele
 * tabblad heen en weer — kolom "boeking" met haar lange teksten incluis — en
 * dat tabblad groeit het hele schooljaar aan.
 */
function markeerOudereRijen_(blad, vest, leerling, refs, vanafRij) {
  if (vanafRij <= 2) return;
  var aantal = vanafRij - 2;
  if (aantal <= 0) return;

  var vestigingen = blad.getRange(2, K_VESTIGING, aantal, 1).getValues();
  var leerlingen = blad.getRange(2, K_LEERLING, aantal, 1).getValues();
  var refKolom = blad.getRange(2, K_REF, aantal, 1).getValues();
  var laatsteBereik = blad.getRange(2, K_IS_LAATSTE, aantal, 1);
  var laatste = laatsteBereik.getValues();

  var gezocht = normaliseerNaam_(leerling);
  var refSet = {};
  refs.forEach(function (r) { refSet[String(r)] = true; });

  var gewijzigd = false;
  for (var i = 0; i < aantal; i++) {
    if (laatste[i][0] !== "JA") continue;
    if (String(vestigingen[i][0]) !== vest) continue;
    if (normaliseerNaam_(leerlingen[i][0]) !== gezocht) continue;
    if (!refSet[String(refKolom[i][0])]) continue;
    laatste[i][0] = "";
    gewijzigd = true;
  }
  if (gewijzigd) laatsteBereik.setValues(laatste);
}

function schrijfDetail_(vest, leerling, data, inzendingId, nu) {
  var lijnen = [];
  (data.items || []).forEach(function (it) {
    (it.lijnen || []).forEach(function (r, idx) {
      lijnen.push([
        nu, vest, leerling, inzendingId, it.ref, idx + 1,
        r.bedrag || "", r.rekening || "", r.omschrijving || "", r.dc || "",
        r.relatie || "", r.redenering || "", r.apko || "", r.stijgtDaalt || "",
      ]);
    });
  });
  if (!lijnen.length) return;
  var blad = blad_(BLAD_DETAIL);
  blad.getRange(blad.getLastRow() + 1, 1, lijnen.length, KOP_DETAIL.length).setValues(lijnen);
}

/* ==========================================================================
   Automatisch nakijken

   De oplossingssleutel staat in het tabblad Sleutel. Bij de eerste
   installatie komt daar de sleutel van de case in (SleutelCase.gs). Wil je
   een eigen oplossing gebruiken, dien ze dan in vanuit de app als leerling
   "test" (zie SLEUTEL_LEERLING) en kies Boekhoudapp → Sleutel overnemen uit
   een inzending. Daarna mag je het tabblad gerust zelf bijwerken.

   Per boeking wordt per rekening het saldo vergeleken (debet min credit).
   Of een leerling 704000 in één lijn boekt (21.000) of in twee (18.000 en
   3.000), maakt dus niet uit — zolang het totaal per rekening klopt. De naam
   van de klant of leverancier telt niet mee.

   Wat het script invult:
     klopt        beoordeling "In orde"
     klopt niet   beoordeling "Te remediëren" + in de kolom "automatische
                  controle" welke rekeningen afwijken (enkel voor jou)
   Het vinkje "klaar" blijft altijd uit: vrijgeven doe je zelf. Onafgewerkte
   of niet begonnen verrichtingen, en alles waarvoor geen sleutel bestaat
   (bv. de open vragen bij Klanten & leveranciers), blijven onaangeroerd.
   ========================================================================== */

var REF_GETALLEN = "RESULTAATVERWERKING";
var REF_BALANS = "EINDBALANS";
var REF_NIET_NAKIJKEN = { RELATIES: true };

// Bedragen komen binnen als tekst uit de app ("1.250" of "1.234,50") of als
// getal uit de Sheet. Wat niet te lezen valt, wordt null.
function bedragGetal_(v) {
  if (typeof v === "number") return isNaN(v) ? null : v;
  var t = String(v === null || v === undefined ? "" : v).replace(/[\s€]/g, "");
  if (!t) return null;
  if (t.indexOf(",") !== -1) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  var n = Number(t);
  return isNaN(n) ? null : n;
}

function rond2_(n) { return Math.round(n * 100) / 100; }

// 1234.5 → "1.234,50", zoals in de app.
function bedragTekst_(n) {
  n = Math.abs(rond2_(n));
  var centen = Math.round(n * 100) % 100;
  var heel = String(Math.floor(n + 0.000001)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return heel + (centen ? "," + (centen < 10 ? "0" : "") + centen : "");
}

function saldoTekst_(n) {
  if (Math.abs(n) < 0.005) return "niets";
  return bedragTekst_(n) + (n > 0 ? " D" : " C");
}

function rekeningNr_(v) { return String(v === null || v === undefined ? "" : v).replace(/\D/g, ""); }

function rubriekLijst_(v) {
  return String(v === null || v === undefined ? "" : v).split(/[^0-9]+/)
    .filter(function (x) { return x; }).sort();
}

function soortVoorRef_(ref) {
  if (ref === REF_GETALLEN) return "getallen";
  if (ref === REF_BALANS) return "balans";
  return "boeking";
}

// Saldo per rekening: debet positief, credit negatief. Rekeningen die op
// nul uitkomen, tellen niet mee.
function saldiUitLijnen_(lijnen) {
  var saldi = {}, volgorde = [];
  lijnen.forEach(function (l) {
    var nr = rekeningNr_(l.rekening);
    var bedrag = bedragGetal_(l.bedrag);
    var dc = String(l.dc || "").trim().toUpperCase();
    if (!nr || bedrag === null || (dc !== "D" && dc !== "C")) return;
    if (!(nr in saldi)) { saldi[nr] = 0; volgorde.push(nr); }
    saldi[nr] = rond2_(saldi[nr] + (dc === "D" ? bedrag : -bedrag));
  });
  var uit = {};
  volgorde.forEach(function (nr) { if (Math.abs(saldi[nr]) >= 0.005) uit[nr] = saldi[nr]; });
  return uit;
}

/**
 * Leest het tabblad Sleutel in:
 *   { AK01: { soort: "boeking", saldi: { "604000": 20000, ... } },
 *     RESULTAATVERWERKING: { soort: "getallen", getallen: { Winst: 9730, ... } },
 *     EINDBALANS: { soort: "balans", vakken: { Kapitaal: ["10"], ... } } }
 */
function sleutelLezen_() {
  var blad = bladOfNiets_(BLAD_SLEUTEL);
  if (!blad || blad.getLastRow() < 2) return {};
  var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, 4).getValues();
  var sleutel = {};
  rijen.forEach(function (r) {
    var ref = String(r[0] || "").trim();
    var wat = String(r[1] === null || r[1] === undefined ? "" : r[1]).trim();
    if (!ref || !wat) return;
    var soort = soortVoorRef_(ref);
    if (!sleutel[ref]) sleutel[ref] = { soort: soort, saldi: {}, getallen: {}, vakken: {} };
    var s = sleutel[ref];
    if (soort === "boeking") {
      var nr = rekeningNr_(wat), bedrag = bedragGetal_(r[3]);
      var dc = String(r[2] || "").trim().toUpperCase();
      if (!nr || bedrag === null) return;
      s.saldi[nr] = rond2_((s.saldi[nr] || 0) + (dc === "C" ? -bedrag : bedrag));
    } else if (soort === "getallen") {
      var g = bedragGetal_(r[3]);
      if (g !== null) s.getallen[wat] = g;
    } else {
      s.vakken[wat] = rubriekLijst_(r[3]);
    }
  });
  return sleutel;
}

/**
 * Legt één ingediende verrichting naast de sleutel.
 * Geeft null terug als er niets na te kijken valt (geen sleutel, niet
 * afgewerkt), anders { ok: true/false, notitie: "…" }.
 */
function controleerItem_(ref, status, lijnen, sleutel) {
  if (REF_NIET_NAKIJKEN[ref]) return null;
  var s = sleutel[ref];
  if (!s) return null;
  var verschillen = [];

  if (s.soort === "boeking") {
    if (status !== "geboekt") return null;
    var geboekt = saldiUitLijnen_(lijnen || []);
    var nrs = Object.keys(s.saldi);
    Object.keys(geboekt).forEach(function (nr) { if (nrs.indexOf(nr) === -1) nrs.push(nr); });
    nrs.forEach(function (nr) {
      var verwacht = s.saldi[nr] || 0, echt = geboekt[nr] || 0;
      if (Math.abs(verwacht - echt) < 0.005) return;
      verschillen.push(nr + ": verwacht " + saldoTekst_(verwacht) + ", geboekt " + saldoTekst_(echt));
    });

  } else if (s.soort === "getallen") {
    if (status !== "ingevuld") return null;
    var ingevuld = {};
    (lijnen || []).forEach(function (l) {
      var g = bedragGetal_(l.bedrag);
      if (l.redenering && g !== null) ingevuld[String(l.redenering).trim()] = g;
    });
    var velden = Object.keys(s.getallen);
    // Nog niet alles ingevuld? Dan is het onafgewerkt: niet beoordelen.
    if (velden.some(function (v) { return !(v in ingevuld); })) return null;
    velden.forEach(function (v) {
      if (Math.abs(s.getallen[v] - ingevuld[v]) >= 0.005) {
        verschillen.push(v + ": verwacht " + bedragTekst_(s.getallen[v]) + ", ingevuld " + bedragTekst_(ingevuld[v]));
      }
    });

  } else {
    if (status !== "ingevuld") return null;
    // Per rubriek: in welk vak hoort ze, en waar ligt ze?
    var hoort = {}, ligt = {};
    Object.keys(s.vakken).forEach(function (vak) { s.vakken[vak].forEach(function (rb) { hoort[rb] = vak; }); });
    (lijnen || []).forEach(function (l) {
      var vak = String(l.rekening || "").trim();
      rubriekLijst_(l.redenering).forEach(function (rb) { ligt[rb] = vak; });
    });
    var rubrieken = Object.keys(hoort);
    Object.keys(ligt).forEach(function (rb) { if (rubrieken.indexOf(rb) === -1) rubrieken.push(rb); });
    rubrieken.sort().forEach(function (rb) {
      if (hoort[rb] === ligt[rb]) return;
      if (!ligt[rb]) verschillen.push("rubriek " + rb + ": niet geplaatst (hoort bij " + hoort[rb] + ")");
      else if (!hoort[rb]) verschillen.push("rubriek " + rb + ": ligt bij " + ligt[rb] + ", maar staat niet in de sleutel");
      else verschillen.push("rubriek " + rb + ": ligt bij " + ligt[rb] + ", hoort bij " + hoort[rb]);
    });
  }

  return verschillen.length
    ? { ok: false, notitie: "✗ " + verschillen.join("\n") }
    : { ok: true, notitie: "✓ klopt met de sleutel" };
}

// Zet de uitkomst in de nieuwe rijen van een inzending. Enkel beoordeling en
// de kolom automatische controle; "klaar" blijft uit.
function nakijkenEnSchrijven_(blad, eersteRij, items) {
  var sleutel = sleutelLezen_();
  if (!Object.keys(sleutel).length || !items.length) return;
  zorgVoorKopAutomatisch_(blad);

  var beoordelingen = [], notities = [], iets = false;
  items.forEach(function (it) {
    var res = controleerItem_(String(it.ref || ""), it.status || "", it.lijnen || [], sleutel);
    if (res) iets = true;
    beoordelingen.push([res ? (res.ok ? BEOORDELINGEN[0] : BEOORDELINGEN[1]) : ""]);
    notities.push([res ? res.notitie : ""]);
  });
  if (!iets) return;
  blad.getRange(eersteRij, K_BEOORDELING, items.length, 1).setValues(beoordelingen);
  blad.getRange(eersteRij, K_AUTOMATISCH, items.length, 1).setValues(notities);
}

// Sheets die al bestonden vóór deze versie hebben de kolom nog niet.
function zorgVoorKopAutomatisch_(blad) {
  var kop = blad.getRange(1, K_AUTOMATISCH);
  if (!kop.getValue()) {
    kop.setValue(KOP_INZENDINGEN[K_AUTOMATISCH - 1]).setFontWeight("bold").setBackground("#e9eaf7");
  }
}

// Alle rijen uit Detail, gegroepeerd per leerling, inzending en ref:
//   { "<leerling>|<inzending>|<ref>": [ {lijn, bedrag, rekening, dc, redenering}, … ] }
// De leerling hoort mee in de sleutel: kopieer je in de Sheet rijen van de
// ene leerling naar een andere (bv. om te testen), dan houden die hun oude
// inzendingscode. Zonder de naam werden hun lijnen dan samengeteld.
function detailSleutel_(vest, leerling, inzending, ref) {
  return String(vest) + "|" + normaliseerNaam_(leerling) + "|" + String(inzending) + "|" + String(ref);
}
function detailPerInzending_(filterLeerling) {
  var blad = bladOfNiets_(BLAD_DETAIL);
  var uit = {};
  if (!blad || blad.getLastRow() < 2) return uit;
  var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, KOP_DETAIL.length).getValues();
  var gezocht = filterLeerling ? normaliseerNaam_(filterLeerling) : null;
  rijen.forEach(function (r) {
    // tijdstip, vestiging, leerling, inzending, ref, lijn, bedrag, rekening,
    // omschrijving, D/C, relatie, redenering
    if (gezocht && normaliseerNaam_(r[2]) !== gezocht) return;
    var sleutel = detailSleutel_(r[1], r[2], r[3], r[4]);
    if (!uit[sleutel]) uit[sleutel] = [];
    uit[sleutel].push({
      tijdstip: r[0], inzending: String(r[3]), ref: String(r[4]), lijn: Number(r[5]) || 0,
      bedrag: r[6], rekening: r[7], dc: r[9], redenering: r[11],
    });
  });
  Object.keys(uit).forEach(function (k) { uit[k].sort(function (a, b) { return a.lijn - b.lijn; }); });
  return uit;
}

/**
 * Menu: neemt de laatste inzending van één leerling (standaard "test") over
 * als oplossingssleutel. Per verrichting telt de recentste inzending.
 */
function sleutelOvernemen() {
  var ui = SpreadsheetApp.getUi();
  var vraag = ui.prompt("Sleutel overnemen",
    "Van welke leerling neem je de inzendingen over als oplossingssleutel?\n" +
    "Laat leeg voor '" + SLEUTEL_LEERLING + "'.", ui.ButtonSet.OK_CANCEL);
  if (vraag.getSelectedButton() !== ui.Button.OK) return;
  var naam = String(vraag.getResponseText() || "").trim() || SLEUTEL_LEERLING;

  var perInzending = detailPerInzending_(naam);
  // Per ref de recentste inzending.
  var recentst = {};
  Object.keys(perInzending).forEach(function (k) {
    var lijnen = perInzending[k], ref = lijnen[0].ref;
    var t = new Date(lijnen[0].tijdstip).getTime() || 0;
    if (!recentst[ref] || t > recentst[ref].t) recentst[ref] = { t: t, lijnen: lijnen };
  });
  var refs = Object.keys(recentst).filter(function (ref) { return !REF_NIET_NAKIJKEN[ref]; });
  if (!refs.length) {
    ui.alert("Geen inzendingen gevonden van '" + naam + "' in het tabblad Detail.");
    return;
  }

  // De volgorde blijft die van het tabblad Detail: zo staat de sleutel in
  // dezelfde volgorde als de app (BB, AK01, AK02 …).
  var rijen = [];
  refs.forEach(function (ref) {
    var lijnen = recentst[ref].lijnen, soort = soortVoorRef_(ref);
    if (soort === "boeking") {
      var saldi = saldiUitLijnen_(lijnen);
      Object.keys(saldi).forEach(function (nr) {
        rijen.push([ref, nr, saldi[nr] > 0 ? "D" : "C", Math.abs(saldi[nr]), ""]);
      });
    } else if (soort === "getallen") {
      lijnen.forEach(function (l) {
        var g = bedragGetal_(l.bedrag);
        if (l.redenering && g !== null) rijen.push([ref, String(l.redenering), "", g, ""]);
      });
    } else {
      lijnen.forEach(function (l) {
        if (l.rekening) rijen.push([ref, String(l.rekening), "", rubriekLijst_(l.redenering).join(", "), ""]);
      });
    }
  });

  var ok = ui.alert("Sleutel overnemen",
    "Van '" + naam + "' worden " + refs.length + " verrichtingen overgenomen (" + rijen.length + " regels).\n\n" +
    "Wat nu in het tabblad Sleutel staat, wordt vervangen. Doorgaan?", ui.ButtonSet.YES_NO);
  if (ok !== ui.Button.YES) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blad = maakBlad_(ss, BLAD_SLEUTEL, KOP_SLEUTEL);
  if (blad.getLastRow() > 1) blad.getRange(2, 1, blad.getLastRow() - 1, KOP_SLEUTEL.length).clearContent();
  // Kolom D als tekst: anders maakt de Sheet van "22, 23, 24" soms iets anders.
  blad.getRange(2, 4, Math.max(rijen.length, 1), 1).setNumberFormat("@");
  blad.getRange(2, 1, rijen.length, KOP_SLEUTEL.length).setValues(rijen.map(function (r) {
    return [r[0], r[1], r[2], typeof r[3] === "number" ? bedragTekst_(r[3]) : r[3], r[4]];
  }));

  ui.alert("Klaar. Het tabblad Sleutel bevat nu de oplossing van '" + naam + "'.\n\n" +
    "Nieuwe inzendingen worden vanaf nu automatisch nagekeken. Voor wat er al binnen is: " +
    "Boekhoudapp → Open inzendingen automatisch nakijken.");
}

/**
 * Menu: kijkt alle nieuwste inzendingen na die nog geen beoordeling hebben.
 * Handig voor wat er binnenkwam vóór de sleutel er was, of na een
 * aanpassing aan de sleutel (maak dan eerst de beoordelingen leeg).
 */
function nakijkenOpenInzendingen() {
  var ui = SpreadsheetApp.getUi();
  var sleutel = sleutelLezen_();
  if (!Object.keys(sleutel).length) {
    ui.alert("Het tabblad Sleutel is nog leeg. Kies eerst Boekhoudapp → Sleutel overnemen uit een inzending.");
    return;
  }
  var blad = blad_(BLAD_INZENDINGEN);
  if (blad.getLastRow() < 2) { ui.alert("Er zijn nog geen inzendingen."); return; }
  zorgVoorKopAutomatisch_(blad);

  var n = blad.getLastRow() - 1;
  var rijen = blad.getRange(2, 1, n, K_AUTOMATISCH).getValues();
  var detail = detailPerInzending_(null);
  var beoordelingBereik = blad.getRange(2, K_BEOORDELING, n, 1);
  var autoBereik = blad.getRange(2, K_AUTOMATISCH, n, 1);
  var beoordelingen = beoordelingBereik.getValues();
  var notities = autoBereik.getValues();
  var inOrde = 0, teRemedieren = 0;

  for (var i = 0; i < n; i++) {
    var r = rijen[i];
    if (r[K_IS_LAATSTE - 1] !== "JA") continue;
    if (String(r[K_BEOORDELING - 1] || "").trim()) continue;
    var ref = String(r[K_REF - 1]);
    var lijnen = detail[detailSleutel_(r[K_VESTIGING - 1], r[K_LEERLING - 1], r[K_INZENDING - 1], ref)] || [];
    var res = controleerItem_(ref, String(r[K_STATUS_LEERLING - 1] || ""), lijnen, sleutel);
    if (!res) continue;
    beoordelingen[i][0] = res.ok ? BEOORDELINGEN[0] : BEOORDELINGEN[1];
    notities[i][0] = res.notitie;
    if (res.ok) inOrde++; else teRemedieren++;
  }
  beoordelingBereik.setValues(beoordelingen);
  autoBereik.setValues(notities);
  ui.alert("Klaar: " + inOrde + " keer '" + BEOORDELINGEN[0] + "' en " + teRemedieren + " keer '" +
    BEOORDELINGEN[1] + "' ingevuld.\n\nNiets is vrijgegeven: zet zelf het vinkje 'klaar' aan.");
}

/* ==========================================================================
   Feedback teruggeven
   ========================================================================== */

/**
 * Geeft alle rijen terug die jij vrijgegeven hebt (vinkje "klaar"). Zolang
 * dat vinkje uit staat, ziet de leerling niets — je kan dus gerust over
 * meerdere dagen nakijken.
 *
 * Bewust álle vrijgegeven ronden en niet enkel de laatste: de leerling moet
 * kunnen terugkijken wat er de vorige keer opgemerkt was. De app toont de
 * nieuwste bovenaan en klapt de oudere ronden in. Lang worden die lijstjes
 * niet: zodra een verrichting "In orde" is, gaat ze op slot en wordt ze niet
 * meer opnieuw ingediend.
 */
function haalFeedbackOp(vest, naam) {
  var blad = blad_(BLAD_INZENDINGEN);
  if (blad.getLastRow() < 2) return [];
  var n = blad.getLastRow() - 1;
  // Twee smalle blokken in plaats van het hele tabblad: de kolom "boeking"
  // staat er tussenin en bevat de volledige boeking van elke leerling. Die
  // hier meelezen maakte het ophalen van feedback onnodig zwaar, en dat
  // gebeurt bij élke keer dat een leerling de app opent.
  var links = blad.getRange(2, K_TIJDSTIP, n, K_REF).getValues();          // tijdstip, vestiging, leerling, categorie, ref
  var rechts = blad.getRange(2, K_BEOORDELING, n, 3).getValues();          // beoordeling, feedback, klaar
  var gezocht = normaliseerNaam_(naam);
  var uit = [];

  for (var i = 0; i < n; i++) {
    if (String(links[i][K_VESTIGING - 1]) !== vest) continue;
    if (normaliseerNaam_(links[i][K_LEERLING - 1]) !== gezocht) continue;
    if (rechts[i][2] !== true) continue;
    var beoordeling = String(rechts[i][0] || "").trim();
    var tekst = String(rechts[i][1] || "").trim();
    if (!beoordeling && !tekst) continue;

    var tijdstip = links[i][K_TIJDSTIP - 1];
    uit.push({
      ref: String(links[i][K_REF - 1]),
      beoordeling: beoordeling,
      feedback: tekst,
      ingediend: tijdstip ? Utilities.formatDate(new Date(tijdstip), Session.getScriptTimeZone(), "d/MM/yyyy") : "",
      tijdstip: tijdstip ? new Date(tijdstip).getTime() : 0,
    });
  }

  // Nieuwste eerst; de app groepeert ze per verrichting.
  uit.sort(function (a, b) { return b.tijdstip - a.tijdstip; });
  return uit;
}

/* ==========================================================================
   Menu in de Sheet
   ========================================================================== */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Boekhoudapp")
    .addItem("Feedback vrijgeven voor deze leerling", "geefVrijVoorLeerling")
    .addItem("Feedback intrekken voor deze leerling", "trekInVoorLeerling")
    .addSeparator()
    .addItem("Sleutel van de case (opnieuw) invullen", "sleutelCaseInvullen")
    .addItem("Sleutel overnemen uit een inzending…", "sleutelOvernemen")
    .addItem("Open inzendingen automatisch nakijken", "nakijkenOpenInzendingen")
    .addSeparator()
    .addItem("Codes genereren voor lege vakjes", "genereerCodes")
    .addItem("Expertcode instellen…", "zetExpertcode")
    .addSeparator()
    .addItem("Waar staan de werkbestanden?", "toonWerkMap")
    .addItem("Werk terugzetten uit een versie…", "zetVersieTerug")
    .addItem("Eerste installatie", "installeer")
    .addToUi();
}

/**
 * Zet het vinkje "klaar" aan bij alle nieuwste rijen van de leerling waar je
 * cursor staat. Zo hoef je niet veertig vinkjes apart aan te tikken.
 */
function geefVrijVoorLeerling() { zetKlaarVoorLeerling_(true); }
function trekInVoorLeerling() { zetKlaarVoorLeerling_(false); }

function zetKlaarVoorLeerling_(waarde) {
  var ui = SpreadsheetApp.getUi();
  var blad = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BLAD_INZENDINGEN);
  var actief = SpreadsheetApp.getActiveSheet();
  if (!blad || actief.getName() !== BLAD_INZENDINGEN) {
    ui.alert("Zet je cursor eerst op een rij in het tabblad " + BLAD_INZENDINGEN + ".");
    return;
  }
  var rij = actief.getActiveCell().getRow();
  if (rij < 2) { ui.alert("Zet je cursor op de rij van een leerling."); return; }

  var leerling = blad.getRange(rij, K_LEERLING).getValue();
  var vest = String(blad.getRange(rij, K_VESTIGING).getValue());
  if (!leerling) { ui.alert("Op deze rij staat geen leerling."); return; }

  var n = blad.getLastRow() - 1;
  var waarden = blad.getRange(2, 1, n, KOP_INZENDINGEN.length).getValues();
  var gezocht = normaliseerNaam_(leerling);
  var aantal = 0;

  // De vinkjes in één blok terugschrijven. Cel per cel was één heen-en-weer
  // met Google per verrichting; bij een leerling met dertig verrichtingen
  // bleef het menu daardoor merkbaar lang hangen.
  var kolom = blad.getRange(2, K_KLAAR, n, 1);
  var vinkjes = kolom.getValues();

  for (var i = 0; i < waarden.length; i++) {
    // Twee vestigingen kunnen een gelijknamige leerling hebben.
    if (String(waarden[i][K_VESTIGING - 1]) !== vest) continue;
    if (normaliseerNaam_(waarden[i][K_LEERLING - 1]) !== gezocht) continue;
    if (waarden[i][K_IS_LAATSTE - 1] !== "JA") continue;
    if (waarde) {
      // Niets vrijgeven waar nog geen enkel oordeel bij staat.
      var heeftIets = String(waarden[i][K_BEOORDELING - 1] || "").trim() ||
                      String(waarden[i][K_FEEDBACK - 1] || "").trim();
      if (!heeftIets) continue;
    }
    vinkjes[i][0] = waarde;
    aantal++;
  }
  if (aantal) kolom.setValues(vinkjes);

  ui.alert(waarde
    ? aantal + " verrichting(en) van " + leerling + " (" + vest + ") staan nu klaar. Ze zijn zichtbaar zodra de leerling in de app op Feedback ophalen klikt."
    : aantal + " verrichting(en) van " + leerling + " zijn weer verborgen voor de leerling.");
}

/**
 * Zegt in welke map dit script écht schrijft, en hoeveel werkbestanden van
 * elke vestiging daar al staan, met een link om de map te openen (om ze te
 * delen met de collega's of te verplaatsen).
 */
function toonWerkMap() {
  var ui = SpreadsheetApp.getUi();
  try {
    var map = werkMap_();
    var perVest = {}, andere = 0;
    Object.keys(VESTIGINGEN).forEach(function (v) { perVest[v] = 0; });
    var info = Drive.Files.get(map, { fields: "name, webViewLink", supportsAllDrives: true });
    bestandenInMap_(map).forEach(function (f) {
      var naam = String(f.name);
      if (naam.indexOf("werk_") !== 0) return;
      var v = naam.slice(5).split("_")[0];
      if (perVest[v] !== undefined) perVest[v]++;
      else andere++;
    });

    ui.alert(
      "Map: " + info.name + "\n" +
      "Adres: " + info.webViewLink + "\n" +
      "Het script maakte deze map zelf aan en kan in Drive enkel aan deze map en wat erin staat.\n\n" +
      "Versies komen in de submap '" + MAP_VERSIES + "' van díé map.\n\n" +
      "Werkbestanden per vestiging:\n" +
      Object.keys(perVest).map(function (v) { return "  " + v + " (" + VESTIGINGEN[v] + "): " + perVest[v]; }).join("\n") +
      (andere ? "\nZonder gekende vestiging: " + andere : "") + "\n\n" +
      "Herkent de app een bestand niet, dan staat het in de verkeerde map of heeft het niet " +
      "exact de naam werk_<VESTIGING>_<naam zonder hoofdletters, spaties en leestekens>.json");
  } catch (err) {
    ui.alert("De map is niet bereikbaar:\n\n" + err.message +
      "\n\nStaat de geavanceerde dienst Drive aan (appsscript.json) en gaf je de toestemming bij de installatie?");
  }
}

/**
 * Zet de nieuwste bewaarde versie van één leerling terug als haar
 * werkbestand. Het script léést nooit uit de submap 'versies' — dat is een
 * archief — dus een bestand daar zomaar neerzetten doet niets. Deze functie
 * is de brug: ze kopieert de inhoud naar het echte werkbestand, en zet het
 * huidige werk eerst als extra versie apart.
 */
function zetVersieTerug() {
  var ui = SpreadsheetApp.getUi();
  var vraagV = ui.prompt("Werk terugzetten",
    "Van welke vestiging? (" + Object.keys(VESTIGINGEN).join(", ") + ")", ui.ButtonSet.OK_CANCEL);
  if (vraagV.getSelectedButton() !== ui.Button.OK) return;
  var vest = vestigingCode_(vraagV.getResponseText());
  if (!vest) { ui.alert("Die vestiging ken ik niet. Kies uit: " + Object.keys(VESTIGINGEN).join(", ")); return; }
  var vraag = ui.prompt("Werk terugzetten",
    "Van welke leerling? Schrijf de naam zoals in het tabblad Klas.", ui.ButtonSet.OK_CANCEL);
  if (vraag.getSelectedButton() !== ui.Button.OK) return;
  var naam = String(vraag.getResponseText() || "").trim();
  if (!naam) return;

  var slug = vestigingDeel_(vest) + normaliseerNaam_(naam);
  var versies = versiesVan_(versieMap_(), slug);
  if (!versies.length) {
    ui.alert("Geen bewaarde versies gevonden voor " + naam + ".\n\n" +
      "Er werd gezocht naar bestanden die beginnen met werk_" + slug + "_ in de submap '" +
      MAP_VERSIES + "'.");
    return;
  }
  var nieuwste = versies[0];

  var pakket;
  try {
    pakket = JSON.parse(leesBestand_(nieuwste.id));
  } catch (err) {
    ui.alert("Die versie is onleesbaar:\n\n" + nieuwste.name);
    return;
  }
  // Vers tijdstip, anders houdt de app het (oudere) werk in de browser voor
  // het recentste en vraagt ze niets.
  pakket.gewijzigd = new Date().toISOString();
  var inhoud = JSON.stringify(pakket);

  var antwoordKnop = ui.alert("Werk terugzetten",
    "De nieuwste bewaarde versie van " + naam + " is:\n\n" + nieuwste.name +
    "\n\nDie wordt haar werkbestand. Wat er nu in staat, wordt eerst als extra versie weggezet.",
    ui.ButtonSet.YES_NO);
  if (antwoordKnop !== ui.Button.YES) return;

  var map = werkMap_();
  var stempel = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmm");
  var huidig = bestandInMap_(map, werkBestandsnaam_(vest, naam));
  if (huidig) {
    maakBestand_(versieMap_(), "werk_" + slug + "_" + stempel + "-voor-terugzetten.json", leesBestand_(huidig.id));
    schrijfBestand_(huidig.id, inhoud);
  } else {
    maakBestand_(map, werkBestandsnaam_(vest, naam), inhoud);
  }

  ui.alert("Klaar.\n\n" +
    "Laat " + naam + " zich opnieuw aanmelden in de app. De teruggezette versie is nu de " +
    "recentste, dus de app neemt ze vanzelf over.");
}

/**
 * Vult een unieke viercijferige code in bij elke leerling in het tabblad
 * Klas die er nog geen heeft. Bestaande codes blijven ongemoeid.
 */
function genereerCodes() {
  var blad = blad_(BLAD_KLAS);
  if (blad.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert("Vul eerst de vestiging (kolom A) en de namen van je leerlingen (kolom B) in.");
    return;
  }
  // Kolom B = naam, kolom C = code.
  var bereik = blad.getRange(2, 2, blad.getLastRow() - 1, 2);
  var waarden = bereik.getValues();
  var gebruikt = {};
  waarden.forEach(function (r) { if (r[1]) gebruikt[String(r[1]).trim()] = true; });

  var nieuw = 0;
  waarden.forEach(function (r) {
    if (!String(r[0] || "").trim() || String(r[1] || "").trim()) return;
    var code;
    do { code = String(Math.floor(1000 + Math.random() * 9000)); } while (gebruikt[code]);
    gebruikt[code] = true;
    r[1] = code;
    nieuw++;
  });
  // Als tekst opslaan, anders slikt Sheets een voorloopnul op.
  blad.getRange(2, 3, blad.getLastRow() - 1, 1).setNumberFormat("@");
  bereik.setValues(waarden);
  SpreadsheetApp.getUi().alert(nieuw + " nieuwe code(s) aangemaakt.");
}

/* ==========================================================================
   Installatie
   ========================================================================== */

/**
 * Maakt de drie tabbladen aan met de juiste koppen, opmaak en filter.
 * Bestaande gegevens blijven staan; deze functie mag je gerust opnieuw
 * uitvoeren.
 */
function installeer() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var opmerkingen = [];

  // Elke stap apart: gaat er één mis (bv. omdat er al een filter staat),
  // dan mag de rest niet stilvallen. Bij de eerste versie stopte de
  // installatie halverwege en bleven de kleuren op de oude instelling.
  var stap = function (wat, fn) {
    try { fn(); } catch (err) { opmerkingen.push("• " + wat + ": " + err.message); }
  };

  var klas = maakBlad_(ss, BLAD_KLAS, KOP_KLAS);
  stap("breedtes tabblad Klas", function () {
    klas.setColumnWidth(1, 90).setColumnWidth(2, 200).setColumnWidth(3, 80).setColumnWidth(4, 300);
    klas.getRange("C:C").setNumberFormat("@");
    klas.getRange(2, 1, klas.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(VESTIGINGEN), true).setAllowInvalid(false).build());
    if (!klas.getFilter()) klas.getRange(1, 1, 1, KOP_KLAS.length).createFilter();
  });

  var inz = maakBlad_(ss, BLAD_INZENDINGEN, KOP_INZENDINGEN);
  stap("breedtes tabblad Inzendingen", function () {
    inz.setColumnWidth(K_TIJDSTIP, 130);
    inz.setColumnWidth(K_VESTIGING, 80);
    inz.setColumnWidth(K_LEERLING, 140);
    inz.setColumnWidth(K_CATEGORIE, 150);
    inz.setColumnWidth(K_REF, 80);
    inz.setColumnWidth(K_BOEKING, 420);
    inz.setColumnWidth(K_STATUS_LEERLING, 110);
    inz.setColumnWidth(K_BEOORDELING, 130);
    inz.setColumnWidth(K_FEEDBACK, 380);
    // De boeking staat met één lijn per regel in de cel (704000  22.000  C).
    // Wrap én bovenaan uitlijnen, anders staat een boeking van vier lijnen
    // in het midden van een hoge rij te zweven.
    inz.getRange(2, K_BOEKING, inz.getMaxRows() - 1, 1).setWrap(true).setVerticalAlignment("top");
    inz.getRange(2, K_FEEDBACK, inz.getMaxRows() - 1, 1).setWrap(true).setVerticalAlignment("top");
  });

  // Staat er al een filter, dan blijft die gewoon staan: createFilter()
  // gooit anders een fout en dat is het niet waard.
  stap("filter", function () {
    if (!inz.getFilter()) inz.getRange(1, 1, 1, KOP_INZENDINGEN.length).createFilter();
  });

  stap("kleuren van de beoordelingen", function () { kleurBeoordelingen_(inz); });

  // De keuzelijst op alle bestaande rijen bijwerken, zodat oude rijen na een
  // update van de beoordelingen niet met de vorige lijst blijven zitten.
  stap("keuzelijst van de beoordelingen", function () {
    if (inz.getLastRow() > 1) {
      inz.getRange(2, K_BEOORDELING, inz.getLastRow() - 1, 1).setDataValidation(beoordelingValidatie_());
    }
  });

  var inst = maakBlad_(ss, BLAD_INSTELLINGEN, KOP_INSTELLINGEN);
  stap("tabblad Instellingen", function () {
    zorgVoorInstellingen_(inst);
    inst.setColumnWidth(1, 160).setColumnWidth(2, 420).setColumnWidth(3, 520);
    inst.getRange(2, 2, inst.getMaxRows() - 1, 2).setWrap(true).setVerticalAlignment("top");
    inst.getRange("B:B").setNumberFormat("@");
  });

  var taken = maakBlad_(ss, BLAD_TAKEN, kopTaken_());
  stap("tabblad Taken", function () {
    zorgVoorTaken_(taken);
    taken.setColumnWidth(1, 240);
    for (var k = 2; k < kopTaken_().length; k++) taken.setColumnWidth(k, 300);
    taken.setColumnWidth(kopTaken_().length, 240);
  });

  stap("breedte kolom automatische controle", function () {
    inz.setColumnWidth(K_AUTOMATISCH, 380);
    inz.getRange(2, K_AUTOMATISCH, inz.getMaxRows() - 1, 1).setWrap(true).setVerticalAlignment("top");
  });

  var sl = maakBlad_(ss, BLAD_SLEUTEL, KOP_SLEUTEL);
  stap("breedtes tabblad Sleutel", function () {
    sl.setColumnWidth(1, 150).setColumnWidth(2, 240).setColumnWidth(3, 50).setColumnWidth(4, 160).setColumnWidth(5, 300);
  });
  // De sleutel van de case meteen invullen, zodat het automatisch nakijken
  // vanaf de eerste inzending werkt. Staat er al iets, dan blijft dat staan.
  var sleutelIngevuld = false;
  stap("sleutel van de case", function () {
    if (sl.getLastRow() < 2) { schrijfSleutelCase_(sl); sleutelIngevuld = true; }
  });

  var det = maakBlad_(ss, BLAD_DETAIL, KOP_DETAIL);
  stap("breedtes tabblad Detail", function () {
    det.setColumnWidth(1, 130).setColumnWidth(2, 80).setColumnWidth(3, 140).setColumnWidth(4, 190);
  });

  // De mappen meteen aanmaken, zodat de eerste leerling niet moet wachten.
  stap("map in Drive", function () { werkMap_(); versieMap_(); });

  // Bewust kort: collega's lezen dit, en de meeste instellingen passen ze
  // aan via het tabblad Beheer in de app. De technische gegevens (vestiging,
  // sleutelwoord, map) staan in HANDLEIDING-koppeling.md.
  SpreadsheetApp.getUi().alert(
    "Klaar.\n\n" +
    "• Code voor Beheer aanpassen: menu Boekhoudapp → Expertcode instellen.\n" +
    "• Nakijken doe je in het tabblad Inzendingen: filter op 'vestiging' en op 'is laatste' = JA.\n" +
    "• Er wordt automatisch gecontroleerd of de inzending klopt met de sleutel" +
    (sleutelIngevuld ? " (de sleutel van de case staat al klaar)" : "") + ".\n" +
    "• Feedback gegeven? Vink 'klaar' aan in kolom J." +
    (opmerkingen.length ? "\n\nNiet alles lukte, maar de installatie is wel doorgelopen:\n" + opmerkingen.join("\n") : "")
  );
}

function maakBlad_(ss, naam, koppen) {
  var blad = ss.getSheetByName(naam) || ss.insertSheet(naam);
  blad.getRange(1, 1, 1, koppen.length).setValues([koppen])
    .setFontWeight("bold").setBackground("#e9eaf7");
  blad.setFrozenRows(1);
  return blad;
}

function beoordelingValidatie_() {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(BEOORDELINGEN, true)
    .setAllowInvalid(true)
    .build();
}

function kleurBeoordelingen_(blad) {
  var bereik = blad.getRange(2, K_BEOORDELING, blad.getMaxRows() - 1, 1);
  var regels = Object.keys(BEOORDELING_KLEUREN).map(function (waarde) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(waarde)
      .setBackground(BEOORDELING_KLEUREN[waarde])
      .setRanges([bereik])
      .build();
  });
  blad.setConditionalFormatRules(regels);
}

function blad_(naam) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blad = ss.getSheetByName(naam);
  if (!blad) throw new Error("Tabblad '" + naam + "' bestaat niet. Voer eerst Boekhoudapp → Eerste installatie uit.");
  return blad;
}

/* ==========================================================================
   Instellingen, taken en klaslijst

   Alles wat de vakexpert vanuit het beheertabblad in de app aanpast, staat
   in twee tabbladen van deze Sheet:

     Instellingen   instelling | waarde | toelichting
     Taken          categorie  | link naar de taak in Classroom | opmerking

   De namen van de leerlingen staan in het tabblad Klas, samen met hun code.
   De app haalt die namen hier op: sinds deze versie hoeft js/data-klas.js
   niet meer bijgehouden te worden.
   ========================================================================== */

// Zoals blad_(), maar zonder foutmelding: een Sheet die nog niet opnieuw
// geïnstalleerd is, mag de app niet doen vastlopen.
function bladOfNiets_(naam) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(naam) || null;
}

/* Het tabblad Instellingen wordt binnen één verzoek meermaals gelezen: eerst
   om de expertcode te controleren, daarna om de teksten mee te geven. Elke
   leesbeurt is een heen-en-weer met Google van een paar honderd milliseconden,
   dus het antwoord wordt onthouden zolang dít verzoek loopt. Wie schrijft,
   maakt het geheugen leeg met vergeetInstellingen_(). */
var _instellingenCache = null;

function instellingenLezen_() {
  if (_instellingenCache) return _instellingenCache;
  var uit = {};
  var blad = bladOfNiets_(BLAD_INSTELLINGEN);
  if (blad && blad.getLastRow() >= 2) {
    var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, 2).getValues();
    rijen.forEach(function (r) {
      var sleutel = String(r[0] || "").trim();
      if (sleutel) uit[sleutel] = String(r[1] === null || r[1] === undefined ? "" : r[1]);
    });
  }
  _instellingenCache = uit;
  return uit;
}

function vergeetInstellingen_() { _instellingenCache = null; }

/* In welke kolom van het tabblad Taken staan de links van deze vestiging?
   Gezocht op de kop, zodat een kolom die verschoven werd niet stilletjes de
   links van een andere school geeft. */
function takenKolom_(blad, vest) {
  var kop = blad.getRange(1, 1, 1, Math.max(blad.getLastColumn(), 1)).getValues()[0];
  for (var i = 0; i < kop.length; i++) {
    if (String(kop[i]).trim().toUpperCase() === vest) return i + 1;
  }
  return 0;
}

function takenKolomOpmerking_(blad) {
  var kop = blad.getRange(1, 1, 1, Math.max(blad.getLastColumn(), 1)).getValues()[0];
  for (var i = 0; i < kop.length; i++) {
    if (String(kop[i]).trim().toLowerCase() === "opmerking") return i + 1;
  }
  return 0;
}

// De taken van één vestiging: [{ categorie, link, opmerking }].
function takenLezen_(vest) {
  var uit = [];
  var blad = bladOfNiets_(BLAD_TAKEN);
  if (!blad || blad.getLastRow() < 2) return uit;
  var kol = takenKolom_(blad, vest);
  var kolOpm = takenKolomOpmerking_(blad);
  var breedte = blad.getLastColumn();
  var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, breedte).getValues();
  rijen.forEach(function (r) {
    var cat = String(r[0] || "").trim();
    if (!cat) return;
    uit.push({
      categorie: cat,
      link: kol ? String(r[kol - 1] || "").trim() : "",
      opmerking: kolOpm ? String(r[kolOpm - 1] || "").trim() : "",
    });
  });
  return uit;
}

// Alle leerlingen van het tabblad Klas, met hun vestiging en rijnummer.
function klasAlles_() {
  var uit = [];
  var blad = bladOfNiets_(BLAD_KLAS);
  if (!blad || blad.getLastRow() < 2) return uit;
  var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, 4).getValues();
  rijen.forEach(function (r, i) {
    var naam = String(r[1] || "").trim();
    if (!naam) return;
    uit.push({
      vestiging: String(r[0] || "").trim().toUpperCase(), naam: naam,
      code: String(r[2] || "").trim(), opmerking: String(r[3] || "").trim(), rij: i + 2,
    });
  });
  return uit;
}

// De leerlingen van één vestiging: [{ naam, code, opmerking }].
function klasLezen_(vest) {
  return klasAlles_().filter(function (l) { return l.vestiging === vest; }).map(function (l) {
    return { naam: l.naam, code: l.code, opmerking: l.opmerking };
  });
}

/**
 * Wat de app aan élke bezoeker mag geven: de teksten, de links, de taken en
 * de namen van de klaslijst. Bewust ZONDER de codes van de leerlingen en
 * zonder de expertcode — die verlaten de Sheet enkel na een geslaagde
 * controle van de expertcode.
 */
/* Enkel de instellingen die de app mag tonen. De expertcode hoort daar
   nooit bij: die blijft in de Sheet. Eén functie voor de drie plaatsen waar
   ze weggestuurd worden, zodat een nieuwe instelling niet op één plek
   vergeten kan worden. */
function publiekeInstellingen_(inst) {
  return {
    welkomsttekst: inst.welkomsttekst || "",
    mededeling: inst.mededeling || "",
    cursusUrl: inst.cursusUrl || "",
    handleidingUrl: inst.handleidingUrl || "",
  };
}

function instellingenPubliek_(vest) {
  var inst = instellingenLezen_();
  var taken = {};
  takenLezen_(vest).forEach(function (t) { if (t.link) taken[t.categorie] = t.link; });
  return {
    ok: true,
    vestiging: vest,
    instellingen: publiekeInstellingen_(inst),
    taken: taken,
    klas: klasLezen_(vest).map(function (l) { return l.naam; }),
    beheerMogelijk: !!String(inst.expertcode || "").trim(),
  };
}

/**
 * De expertcode. Ze staat in het tabblad Instellingen en niet in deze code:
 * zo kan ze gewijzigd worden zonder het script opnieuw te publiceren.
 * Is er nog geen code ingevuld, dan blijft het beheertabblad dicht — anders
 * zou een lege code toegang geven.
 */
function controleerExpert_(code) {
  var juiste = String(instellingenLezen_().expertcode || "").trim();
  if (!juiste) {
    return { ok: false, fout: "geen expertcode",
      uitleg: "Er is nog geen expertcode ingesteld. Zet er een in het tabblad Instellingen van de Google Sheet (menu Boekhoudapp → Expertcode instellen)." };
  }
  if (String(code || "").trim() !== juiste) return { ok: false, fout: "expertcode" };
  return { ok: true };
}

/**
 * Alles wat de expert in het beheertabblad ziet: de instellingen, de taken
 * én de klaslijst mét de codes. Enkel na een geslaagde codecontrole.
 */
function haalBeheerOp_(code, vest) {
  var check = controleerExpert_(code);
  if (!check.ok) return check;
  var inst = instellingenLezen_();
  return {
    ok: true,
    vestiging: vest,
    instellingen: publiekeInstellingen_(inst),
    taken: takenLezen_(vest),
    klas: klasLezen_(vest),
  };
}

/**
 * Bewaart wat de expert in het beheertabblad ingevuld heeft. De drie delen
 * gaan samen, maar elk deel wordt alleen aangeraakt als het meegestuurd is:
 * zo kan het beheertabblad later uitgebreid worden zonder dat een oudere
 * app-versie hier gegevens wist.
 *
 * Alles gaat per blok naar de Sheet en niet cel per cel. Elke losse
 * setValue is een heen-en-weer met Google; bij een klas van twintig
 * leerlingen liep dat op tot een halve minuut, en dan haakt de browser af
 * terwijl het schrijven aan deze kant gewoon doorgaat.
 *
 * De klaslijst wordt volledig herschreven met wat de app stuurt. Namen
 * zonder code krijgen er een; bestaande codes blijven ongemoeid, zodat een
 * leerling niet plots niet meer binnen raakt.
 */
function bewaarBeheer_(data, vest) {
  var check = controleerExpert_(data && data.expertcode);
  if (!check.ok) return check;

  var gedaan = [];
  // Wat we straks teruggeven; blijft null zolang dat deel niet meegestuurd
  // was, en dan wordt het alsnog uit de Sheet gelezen.
  var nieuweTaken = null;
  var nieuweKlas = null;

  if (data.instellingen) {
    var bi = blad_(BLAD_INSTELLINGEN);
    zorgVoorInstellingen_(bi);
    var nI = Math.max(bi.getLastRow() - 1, 0);
    if (nI) {
      var bekend = {};
      INSTELLINGEN_UITLEG.forEach(function (u) { bekend[u[0]] = true; });
      var bereikI = bi.getRange(2, 1, nI, 2);
      var waardenI = bereikI.getValues();
      var iets = false;
      for (var i = 0; i < waardenI.length; i++) {
        var sleutel = String(waardenI[i][0] || "").trim();
        // De expertcode wijzigen kan enkel in de Sheet zelf: wie de code al
        // kent, mag ze niet voor iedereen anders kunnen zetten.
        if (!sleutel || sleutel === "expertcode" || !bekend[sleutel]) continue;
        if (!Object.prototype.hasOwnProperty.call(data.instellingen, sleutel)) continue;
        var nieuweWaarde = String(data.instellingen[sleutel] || "");
        if (String(waardenI[i][1]) === nieuweWaarde) continue;
        waardenI[i][1] = nieuweWaarde;
        iets = true;
      }
      if (iets) { bereikI.setValues(waardenI); vergeetInstellingen_(); }
    }
    gedaan.push("instellingen");
  }

  // Enkel de kolom van déze vestiging wordt herschreven: de links van de
  // andere scholen blijven staan. Een categorie die er nog niet stond, komt
  // er onderaan bij.
  if (data.taken) {
    var bt = blad_(BLAD_TAKEN);
    zorgVoorTaken_(bt);
    var kol = takenKolom_(bt, vest);
    if (!kol) throw new Error("In het tabblad Taken staat geen kolom " + vest + ". Voer Boekhoudapp → Eerste installatie opnieuw uit.");
    var nT = Math.max(bt.getLastRow() - 1, 0);
    var cats = nT ? bt.getRange(2, 1, nT, 1).getValues() : [];
    var links = nT ? bt.getRange(2, kol, nT, 1).getValues() : [];
    var opRij = {};
    cats.forEach(function (c, i) { var t = String(c[0] || "").trim(); if (t) opRij[t] = i; });
    data.taken.forEach(function (t) {
      var cat = String(t.categorie || "").trim();
      if (!cat) return;
      if (opRij[cat] === undefined) {
        cats.push([cat]);
        links.push([""]);
        opRij[cat] = cats.length - 1;
      }
      links[opRij[cat]][0] = String(t.link || "");
    });
    if (cats.length) {
      bt.getRange(2, 1, cats.length, 1).setValues(cats);
      bt.getRange(2, kol, links.length, 1).setValues(links);
    }
    nieuweTaken = null;   // hieronder opnieuw gelezen, met de opmerkingen erbij
    gedaan.push("taken");
  }

  // De klaslijst van déze vestiging wordt vervangen door wat de app stuurt;
  // de leerlingen van de andere vestigingen blijven ongemoeid. Alles wordt
  // in één blok teruggeschreven: eerst de andere scholen, dan deze.
  if (data.klas) {
    var bk = blad_(BLAD_KLAS);
    var alles = klasAlles_();
    var bestaand = {};
    var gebruikt = {};
    alles.forEach(function (l) {
      if (!l.code) return;
      gebruikt[l.code] = true;
      if (l.vestiging === vest) bestaand[normaliseerNaam_(l.naam)] = l.code;
    });

    var oudK = Math.max(bk.getLastRow() - 1, 0);
    var rijenK = alles.filter(function (l) { return l.vestiging !== vest; })
      .map(function (l) { return [l.vestiging, l.naam, l.code, l.opmerking]; });
    var eigen = [];
    data.klas.forEach(function (l) {
      var naam = String(l.naam || "").trim();
      if (!naam) return;
      var code = String(l.code || "").trim() || bestaand[normaliseerNaam_(naam)] || "";
      if (!code) {
        do { code = String(Math.floor(1000 + Math.random() * 9000)); } while (gebruikt[code]);
      }
      gebruikt[code] = true;
      eigen.push([vest, naam, code, String(l.opmerking || "")]);
    });
    rijenK = rijenK.concat(eigen);
    nieuweKlas = eigen.map(function (r) {
      return { naam: r[1], code: r[2], opmerking: r[3] };
    });
    while (rijenK.length < oudK) rijenK.push(["", "", "", ""]);
    if (rijenK.length) {
      // Codes als tekst, anders slikt Sheets een voorloopnul op.
      bk.getRange(2, 3, rijenK.length, 1).setNumberFormat("@");
      bk.getRange(2, 1, rijenK.length, 4).setValues(rijenK);
    }
    gedaan.push("klaslijst " + vest + " (" + eigen.length + ")");
  }

  // Zeker weten dat alles in de Sheet staat vóór we ja zeggen.
  SpreadsheetApp.flush();

  /* Alles teruggeven zoals het nu in de Sheet staat — opgebouwd uit wat we
     zopas geschreven hebben, dus zonder er nog eens voor te gaan lezen. De
     app werkt zichzelf daarmee meteen bij en hoeft geen tweede verzoek te
     doen; dat scheelde de helft van de wachttijd bij elke bewaarbeurt. */
  return {
    ok: true,
    bewaard: gedaan,
    instellingen: publiekeInstellingen_(instellingenLezen_()),
    taken: nieuweTaken !== null ? nieuweTaken : takenLezen_(vest),
    klas: nieuweKlas !== null ? nieuweKlas : klasLezen_(vest),
  };
}

/**
 * Zorgt dat elke bekende instelling een rij heeft, met haar toelichting in
 * kolom C. Bestaande waarden in kolom B blijven staan; enkel wat ontbreekt
 * komt erbij. Zo mag deze functie (en dus de installatie) altijd opnieuw
 * lopen. Er wordt enkel geschreven als er écht iets verandert — deze functie
 * loopt bij elke bewaarbeurt mee.
 */
function zorgVoorInstellingen_(blad) {
  var n = Math.max(blad.getLastRow() - 1, 0);
  var waarden = n ? blad.getRange(2, 1, n, 3).getValues() : [];
  var opRij = {};
  waarden.forEach(function (r, i) {
    var s = String(r[0] || "").trim();
    if (s) opRij[s] = i;
  });

  var iets = false;
  INSTELLINGEN_UITLEG.forEach(function (u) {
    if (opRij[u[0]] !== undefined) {
      // De toelichting wel bijwerken: die mag met de app meegroeien.
      if (String(waarden[opRij[u[0]]][2]) !== u[2]) {
        waarden[opRij[u[0]]][2] = u[2];
        iets = true;
      }
      return;
    }
    waarden.push([u[0], u[1], u[2]]);
    iets = true;
  });

  if (iets && waarden.length) {
    blad.getRange(2, 1, waarden.length, 3).setValues(waarden);
    vergeetInstellingen_();
  }
}

/**
 * Zorgt dat elke categorie een rij heeft in het tabblad Taken. Bestaande
 * links blijven staan.
 */
function zorgVoorTaken_(blad) {
  // Ontbreekt de kolom van een vestiging (bv. er kwam er één bij), dan
  // wordt ze vóór de kolom opmerking ingevoegd.
  Object.keys(VESTIGINGEN).forEach(function (v) {
    if (takenKolom_(blad, v)) return;
    var opm = takenKolomOpmerking_(blad);
    if (opm) blad.insertColumnBefore(opm);
    var kol = opm || Math.max(blad.getLastColumn(), 1) + 1;
    blad.getRange(1, kol).setValue(v).setFontWeight("bold").setBackground("#e9eaf7");
  });

  var n = Math.max(blad.getLastRow() - 1, 0);
  var waarden = n ? blad.getRange(2, 1, n, 1).getValues() : [];
  var aanwezig = {};
  waarden.forEach(function (r) {
    var s = String(r[0] || "").trim();
    if (s) aanwezig[s] = true;
  });
  var iets = false;
  TAAK_CATEGORIEEN.forEach(function (cat) {
    if (aanwezig[cat]) return;
    waarden.push([cat]);
    iets = true;
  });
  if (iets && waarden.length) blad.getRange(2, 1, waarden.length, 1).setValues(waarden);
}

/**
 * Menu Boekhoudapp -> Expertcode instellen. Vraagt de code en zet ze in het
 * tabblad Instellingen. Er is één code voor de drie vestigingen samen.
 */
function zetExpertcode() {
  var ui = SpreadsheetApp.getUi();
  var blad = blad_(BLAD_INSTELLINGEN);
  zorgVoorInstellingen_(blad);
  var antw = ui.prompt(
    "Expertcode",
    "Met deze code openen jij en je collega-experten het tabblad Beheer in de app.\n" +
    "Geef ze niet aan de leerlingen.\n\nHuidige code: " + (instellingenLezen_().expertcode || "(nog geen)"),
    ui.ButtonSet.OK_CANCEL);
  if (antw.getSelectedButton() !== ui.Button.OK) return;
  var code = String(antw.getResponseText() || "").trim();
  if (!code) { ui.alert("Er is niets gewijzigd: een lege code zou het beheertabblad voor iedereen openzetten."); return; }
  var rijen = blad.getRange(2, 1, blad.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < rijen.length; i++) {
    if (String(rijen[i][0] || "").trim() === "expertcode") {
      blad.getRange(i + 2, 2).setValue(code).setNumberFormat("@");
      vergeetInstellingen_();
      ui.alert("De expertcode staat op: " + code + "\n\nZe geldt voor de drie vestigingen samen.");
      return;
    }
  }
  ui.alert("Het tabblad Instellingen is niet in orde. Voer eerst Boekhoudapp → Eerste installatie uit.");
}
