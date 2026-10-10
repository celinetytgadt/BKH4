// config-koppeling.js
// De koppeling met Google Sheets. Enkel dit bestand moet je aanpassen
// nadat het script gepubliceerd is — zie HANDLEIDING-koppeling.md.
//
// ÉÉN APP, ÉÉN SCRIPT, DRIE VESTIGINGEN
// In kern 8 had elke vestiging een eigen Sheet met een eigen kopie van het
// script. Hier is dat er nog maar één: één Google Sheet, één Apps Script,
// één web-app-URL. De leerling kiest bovenaan de app eerst de vestiging en
// daarna de naam; de code van de vestiging gaat bij elk verzoek mee, en het
// script zoekt daarmee de juiste klaslijst en de juiste Classroom-taken op.
// Een wijziging aan het script gebeurt dus nog maar één keer.

// Het voorvoegsel voor alles wat deze app in de browser onthoudt (aanmelding,
// werk, feedback). Alle apps op celinetytgadt.github.io delen dat geheugen;
// met een eigen voorvoegsel leest deze app nooit iets van de app van kern 8
// of een andere app. Elke app moet hier een ander woord hebben.
const OPSLAG_APP = "bkh4";

const KOPPELING = {
  // De URL die Google geeft na "Implementeren → Nieuwe implementatie →
  // Web-app". Ze eindigt op /exec. Blijft ze leeg, dan werkt de app volledig
  // op zichzelf (enkel bewaren in de browser, geen indienen).
  webAppUrl: "https://script.google.com/macros/s/AKfycbz9t7A2duIgRBS7-xzLiKjFwG9RV_8Cyrg-YwpYM9IicYmzCEzfc24_kMAUQ62X_Fyl/exec",

  // Moet exact hetzelfde woord zijn als SLEUTEL bovenaan Code.gs.
  // Let op: dit staat in publiek leesbare code. Het is een drempel tegen
  // toevallige rommel, geen wachtwoord — de echte afscherming is dat enkel
  // de vakexperten bij de Sheet en bij de Drive-map kunnen.
  sleutel: "DEMET",

  // Om de hoeveel minuten het werk stilletjes naar de Drive gaat.
  bewaarIntervalMinuten: 2,

  // Feedback automatisch ophalen bij het openen van de app.
  feedbackBijOpstart: true,
};

// De drie vestigingen. De code komt in de kolom "vestiging" van de Sheet en
// in de bestandsnaam van het werkbestand (werk_LEU_lottev.json); ze moet
// overeenkomen met VESTIGINGEN bovenaan Code.gs. "naam" is wat de leerling in
// de keuzelijst ziet.
//
// Eén vestiging? Laat er dan gewoon één in de lijst staan: de keuzelijst
// verdwijnt dan vanzelf uit de app.
const VESTIGINGEN = [
  { code: "LEU", naam: "Leuven" },
  { code: "SKW", naam: "Katelijne" },
  { code: "TW", naam: "Tielt-Winge" },
];
