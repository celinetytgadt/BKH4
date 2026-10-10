// maak-sleutel.js — schrijft apps-script/SleutelCase.gs: de oplossingssleutel
// van de case, in het formaat van het tabblad Sleutel van de Google Sheet.
//
//   node hulpmiddelen/maak-sleutel.js
//
// Per verrichting staat er per rekening het saldo van de boeking (zoals het
// script ze vergelijkt: of een leerling 604000 in één of in twee lijnen boekt,
// maakt niet uit). Daarna de getallen van de resultaatverwerking en de
// plaats van elke rubriek op de eindbalans.
//
// Het script controleert eerst zelf of alles klopt: beginbalans + alle
// boekingen moet exact de proefbalans "na afsluiting" uit de Excel geven.

"use strict";
const fs = require("fs");
const path = require("path");
const { CASE, opdrachten, saldiVoor, beginbalans } = require("./opbouw.js");

const L = opdrachten();
const rond = (x) => Math.round(x * 100) / 100;

// 1. Nazicht: alles samen moet de proefbalans na afsluiting geven.
const totaal = {};
beginbalans().forEach((r) => { totaal[r.rekening] = r.saldo; });
L.forEach((o) => {
  const s = saldiVoor(o);
  Object.keys(s).forEach((k) => { totaal[k] = rond((totaal[k] || 0) + s[k]); });
});
const fouten = CASE.j2.proefbalans.filter((r) => Math.abs((totaal[r.rekening] || 0) - r.slot) > 0.005);
if (fouten.length) {
  console.error("De sleutel klopt niet met de proefbalans:");
  fouten.forEach((r) => console.error("  " + r.rekening + ": " + (totaal[r.rekening] || 0) + " i.p.v. " + r.slot));
  process.exit(1);
}

// 2. De regels van de boekingen.
const rijen = [];
L.forEach((o) => {
  const s = saldiVoor(o);
  Object.keys(s).forEach((nr) => rijen.push([o.ref, nr, s[nr] > 0 ? "D" : "C", Math.abs(s[nr]), ""]));
});

// 3. De resultaatverwerking: opbrengsten en kosten vóór de boeking RESULTAAT.
const pb = CASE.j2.proefbalans;
// Kosten (klasse 6) en opbrengsten (klasse 7) na voorraad en afschrijvingen,
// maar vóór de resultaatverwerking zelf.
const k6 = rond(pb.filter((r) => r.rekening[0] === "6" && r.rekening !== "693000").reduce((t, r) => t + r.slot, 0));
const k7 = rond(-pb.filter((r) => r.rekening[0] === "7" && r.rekening !== "793000").reduce((t, r) => t + r.slot, 0));
const winst = rond(k7 - k6);
const geboekt = -(pb.find((r) => r.rekening === "140000").slot - pb.find((r) => r.rekening === "140000").opening);
if (Math.abs(winst - geboekt) > 0.005) {
  console.error("Winst " + winst + " verschilt van de overgedragen winst " + geboekt);
  process.exit(1);
}
rijen.push(["RESULTAATVERWERKING", "Opbrengsten", "", k7, ""]);
rijen.push(["RESULTAATVERWERKING", "Kosten", "", k6, ""]);
rijen.push(["RESULTAATVERWERKING", "Winst", "", winst, ""]);

// 4. De eindbalans: welke rubriek in welk vak (vaknamen uit js/data-balans.js).
const VAK = {
  "10": "Kapitaal", "13": "Reserves", "14": "Overgedragen resultaat", "16": "Voorzieningen",
  "17": "Schulden op meer dan 1 jaar",
  "20": "Oprichtingskosten", "21": "Immateriële vaste activa", "22": "Materiële vaste activa",
  "23": "Materiële vaste activa", "24": "Materiële vaste activa",
  "34": "Voorraden", "40": "Vorderingen op ten hoogste 1 jaar", "41": "Vorderingen op ten hoogste 1 jaar",
  "42": "Schulden op ten hoogste 1 jaar", "44": "Schulden op ten hoogste 1 jaar", "45": "Schulden op ten hoogste 1 jaar",
  "48": "Schulden op ten hoogste 1 jaar", "55": "Liquide middelen", "57": "Liquide middelen", "58": "Liquide middelen",
  "60": "Handelsgoederen, grond- en hulpstoffen", "61": "Diensten en diverse goederen", "63": "Afschrijvingen",
  "65": "Financiële kosten", "69": "Resultaatverwerking",
  "70": "Omzet", "74": "Andere bedrijfsopbrengsten", "75": "Financiële opbrengsten", "79": "Resultaatverwerking",
};
const perRubriek = {};
pb.forEach((r) => {
  const rb = r.rekening.slice(0, 2);
  perRubriek[rb] = rond((perRubriek[rb] || 0) + r.slot);
});
const perVak = {};
Object.keys(perRubriek).sort().forEach((rb) => {
  if (Math.abs(perRubriek[rb]) < 0.005) return;
  if (!VAK[rb]) throw new Error("Geen vak voor rubriek " + rb);
  (perVak[VAK[rb]] = perVak[VAK[rb]] || []).push(rb);
});
Object.keys(perVak).forEach((vak) => rijen.push(["EINDBALANS", vak, "", perVak[vak].join(", "), ""]));

// 5. Wegschrijven als Apps Script-bestand.
const fmt = (n) => typeof n === "number" ? new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 2 }).format(n) : n;
const regels = rijen.map((r) => "  " + JSON.stringify([r[0], r[1], r[2], fmt(r[3]), r[4]])).join(",\n");

const gs = `/**
 * SleutelCase.gs — de oplossingssleutel van de case Fietsatelier Noor, jaar 2
 * (2027, 4e jaar). Hoort in hetzelfde Apps Script-project als Code.gs.
 *
 * GEMAAKT MET hulpmiddelen/maak-sleutel.js uit de Excel van de case. Pas je
 * de case aan, maak dit bestand dan opnieuw en plak het hier over het oude.
 *
 * De sleutel komt in het tabblad Sleutel van de Sheet:
 *   - bij de eerste installatie automatisch (als dat tabblad nog leeg is);
 *   - of via het menu Boekhoudapp → Sleutel van de case (opnieuw) invullen.
 * Daarna mag je het tabblad gerust zelf bijwerken.
 *
 * Per verrichting: ref | rekening | D/C | saldo van de boeking op die rekening.
 * RESULTAATVERWERKING: de getallen die de leerling berekent.
 * EINDBALANS: welke rubrieken in welk vak van de balans en de
 * resultatenrekening horen (na de resultaatverwerking).
 */

var SLEUTEL_CASE = [
${regels},
];

/** Menu: vervangt de inhoud van het tabblad Sleutel door de sleutel van de case. */
function sleutelCaseInvullen() {
  var ui = SpreadsheetApp.getUi();
  var ok = ui.alert("Sleutel van de case invullen",
    "Wat nu in het tabblad Sleutel staat, wordt vervangen door de oplossing van de case (" +
    SLEUTEL_CASE.length + " regels). Doorgaan?", ui.ButtonSet.YES_NO);
  if (ok !== ui.Button.YES) return;
  var blad = maakBlad_(SpreadsheetApp.getActiveSpreadsheet(), BLAD_SLEUTEL, KOP_SLEUTEL);
  schrijfSleutelCase_(blad);
  ui.alert("Klaar. Nieuwe inzendingen worden vanaf nu automatisch nagekeken. Voor wat er al binnen is: " +
    "Boekhoudapp → Open inzendingen automatisch nakijken.");
}

function schrijfSleutelCase_(blad) {
  if (blad.getLastRow() > 1) blad.getRange(2, 1, blad.getLastRow() - 1, KOP_SLEUTEL.length).clearContent();
  // Kolom D als tekst: anders maakt de Sheet van "22, 23, 24" of "1.500" iets anders.
  blad.getRange(2, 4, SLEUTEL_CASE.length, 1).setNumberFormat("@");
  blad.getRange(2, 1, SLEUTEL_CASE.length, KOP_SLEUTEL.length).setValues(SLEUTEL_CASE);
}
`;
fs.writeFileSync(path.join(__dirname, "..", "apps-script", "SleutelCase.gs"), gs);
console.log("Geschreven: apps-script/SleutelCase.gs (" + rijen.length + " regels). Opbrengsten " + k7 +
  ", kosten " + k6 + ", winst " + winst + ". Proefbalans klopt.");
