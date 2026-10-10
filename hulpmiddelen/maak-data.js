// maak-data.js — schrijft de bestanden js/data-opdrachten.js,
// js/data-beginstand.js en js/data-relaties.js op basis van case.json.
//
//   node hulpmiddelen/maak-data.js
//
// Let op: wat je met de hand in die drie bestanden wijzigt, wordt hierdoor
// overschreven. Pas je liever de bestanden zelf aan, draai dit dan niet meer.

"use strict";
const fs = require("fs");
const path = require("path");
const { CASE, CATEGORIE_VOLGORDE, opdrachten, beginbalans, openFacturen2026, twee } = require("./opbouw.js");

const ROOT = path.join(__dirname, "..");
const L = opdrachten();
const s = (x) => JSON.stringify(x);

const KWARTAAL_NAAM = { K1: "1e kwartaal", K2: "2e kwartaal", K3: "3e kwartaal", K4: "4e kwartaal" };

function titel(o) {
  const r = o.ref;
  if (/^AK/.test(r)) return "Aankoop " + r;
  if (/^VK/.test(r)) return "Verkoop " + r;
  if (/^DOC/.test(r)) return "Document " + r;
  if (/^ONTV/.test(r)) return "Dagontvangsten " + r;
  if (/^KAS/.test(r)) return "Kasstuk " + r;
  if (/^BANK/.test(r)) return "Bankafschrift " + r;
  if (/^BTW(\d)/.test(r)) return "Btw-verwerking " + r + " (" + KWARTAAL_NAAM["K" + r.slice(3)] + ")";
  if (r === "VR") return "Voorraad VR";
  if (r === "AFSCHR") return "Afschrijvingen AFSCHR";
  return r;
}

const BTW_UITLEG =
  "Kijk in de T-rekeningen rechts naar het saldo van de tussentijdse btw-rekeningen (de 411- en 451-rekeningen die niet op 000 eindigen). " +
  "Na de btw-aangifte van het kwartaal worden die rekeningen leeggemaakt: de btw komt samen op 411000 Terug te vorderen btw-saldo (een tegoed) " +
  "of op 451000 Te betalen btw-saldo (een schuld). Staat er van het vorige kwartaal nog een tegoed op 411000, verreken dat dan mee. " +
  "Boek je in volgorde, dan staat in de T-rekeningen precies de btw van dit kwartaal.";

function regel(o) {
  const v = { ref: o.ref, categorie: o.categorie, titel: titel(o) };
  if (/^BTW/.test(o.ref)) {
    v.geenDocument = true;
    v.instructie = BTW_UITLEG;
  } else if (o.ref === "RESULTAAT") {
    v.geenDocument = true;
    v.verborgenInNav = true;
  } else {
    v.doc = o.ref;
  }
  if (/^(BANK|KAS)/.test(o.ref)) v.betaalstuk = true;
  // Hulpdocumenten bij de bankafschriften.
  if (o.soort === "BANK") {
    const oms = o.regels.map((r) => r.oms).join(" | ");
    if (/2026-018|2026-1288/.test(oms)) {
      v.hulpdocs = [
        { doc: "BBVK", titel: "Openstaande verkoopfactuur 2026-018 (van vorig jaar)" },
        { doc: "BBAK", titel: "Openstaande aankoopfactuur 2026-1288 (van vorig jaar)" },
      ];
    } else if (/lening/i.test(oms)) {
      v.hulpdoc = "LENING";
      v.hulpdocTitel = "Kredietovereenkomst en aflossingstabel";
    }
  }
  return v;
}

/* ---------------- data-opdrachten.js ---------------- */

let out = `// data-opdrachten.js
// Lijst van alle opdrachten (verantwoordingsstukken) met hun referentie,
// categorie (voor de navigatie) en titel.
//
// GEMAAKT MET hulpmiddelen/maak-data.js uit de case Fietsatelier Noor (jaar 2
// = 2027, 4e jaar). Wil je de lijst met de hand bijwerken, dan mag dat
// gerust — maar draai dat hulpmiddel daarna niet meer, anders is het weg.
//
// Velden (zoals in de app van kern 8):
//   ref           wat in de T-rekeningen bij elke boeking komt te staan
//   categorie     waar de opdracht in het menu staat
//   doc           de bestandsnaam (zonder extensie) in documenten/
//   hulpdoc(s)    een tweede, inklapbaar document bij de opdracht
//   geenDocument  er hoort geen verantwoordingsstuk bij (btw-verwerking)
//   betaalstuk    bankafschrift of kasstuk: op het tabblad Klanten &
//                 leveranciers telt dit als betaling, niet als factuur
//   vasteBoeking  de boeking staat al klaar en kan niet gewijzigd worden
//                 (de beginbalans: die komt uit het 3e jaar)
//
// In K3 en K4 staan aankopen en verkopen door elkaar. Daar heten ze neutraal
// DOC01, DOC02 … zodat de referentie niet verklapt of Noor koopt of verkoopt.

const OPDRACHTEN = [
  // De beginbalans is de eindbalans van 2026, na de afsluiting door de
  // boekhouder. De boeking staat al klaar (js/data-beginstand.js).
  { ref: "BB", navLabel: "BEGINBALANS (BB)", categorie: "Beginbalans", titel: "Beginbalans 1 januari 2027 (BB)", doc: "BEGINBALANS", vasteBoeking: true,
    hulpdocs: [
      { doc: "BBVK", titel: "Openstaande verkoopfactuur 2026-018 (van vorig jaar)" },
      { doc: "BBAK", titel: "Openstaande aankoopfactuur 2026-1288 (van vorig jaar)" },
    ] },
`;

let vorige = "Beginbalans";
L.filter((o) => o.ref !== "RESULTAAT").forEach((o) => {
  if (o.categorie !== vorige) { out += "\n  // " + o.categorie + "\n"; vorige = o.categorie; }
  const v = regel(o);
  const delen = Object.keys(v).map((k) => k + ": " + s(v[k]));
  out += "  { " + delen.join(", ") + " },\n";
});

out += `
  // RESULTAAT staat niet in het menu maar op de eigen pagina
  // Resultaatverwerking. Het moet wel meetellen in de T-rekeningen.
  { ref: "RESULTAAT", categorie: "Resultaatverwerking", titel: "Resultaatverwerking", geenDocument: true, verborgenInNav: true },
];

// Volgorde van de categorieën in het menu.
const CATEGORIE_VOLGORDE = ${JSON.stringify(CATEGORIE_VOLGORDE, null, 2).replace(/\n/g, "\n")};

// Een tussentitel in het menu boven de eerste categorie van elk kwartaal. In
// het menu valt het voorvoegsel "K1 · " dan weg onder die titel.
const CATEGORIE_KOPPEN = {
  "Beginbalans": "Start van het jaar",
  "K1 · Aankopen": "1e kwartaal · januari – maart 2027",
  "K2 · Aankopen": "2e kwartaal · april – juni 2027",
  "K3 · Aankopen en verkopen": "3e kwartaal · juli – september 2027",
  "K4 · Alle verrichtingen": "4e kwartaal · oktober – december 2027",
  "Eindejaarsverrichtingen": "Afsluiting 31 december 2027",
};

// Bij welke categorie gaat de pagina "Klanten & leveranciers" mee bij het
// indienen? De pagina zelf staat altijd bovenaan in het menu (zie
// RELATIES_BOVENAAN): openstaande facturen volg je het hele jaar op.
const CATEGORIE_RELATIES = "K4 · Alle verrichtingen";
const RELATIES_BOVENAAN = true;

// Welke categorieën bevatten BETALINGEN? Sinds K4 alles door elkaar staat,
// kijkt de app eerst naar het veld "betaalstuk" bij de opdracht zelf; deze
// lijst blijft als reserve voor opdrachten zonder dat veld.
const CATEGORIE_BETALINGEN = [
  "K1 · Financiële verrichtingen",
  "K2 · Financiële verrichtingen",
  "K3 · Financiële verrichtingen",
];

// De resultaatverwerking. In deze case is er geen vennootschapsbelasting en
// geen toevoeging aan de reserves: de volledige winst gaat naar de
// overgedragen winst. Daarom is er maar één boeking (RESULTAAT).
const RESULTAAT_CONFIG = {
  refs: ["RESULTAAT"],
  titel: "Resultaatverwerking — RESULTAAT",
  subtitel: "Bouw eerst de resultatenrekening op, bereken daarna de winst en boek RESULTAAT.",
  stappen: [
    ["opbrengsten", "1. Hoeveel opbrengsten maakte het bedrijf? (klasse 7)"],
    ["kosten", "2. Hoeveel kosten maakte het bedrijf? (klasse 6)"],
    ["winst", "3. Bereken de winst"],
  ],
  // De namen waaronder de getallen in de Sheet komen (en in de sleutel staan).
  stapNamen: { opbrengsten: "Opbrengsten", kosten: "Kosten", winst: "Winst" },
  boekingen: [
    { ref: "RESULTAAT", titel: "RESULTAAT — Toewijzing van het resultaat",
      uitleg: "Fietsatelier Noor houdt de volledige winst in het bedrijf: ze wordt overgedragen naar volgend jaar. Er is geen vennootschapsbelasting en er gaat niets naar de reserves." },
  ],
};

// Korte tips boven het redeneerschema (zoals in kern 8).
const TIP_VOLGORDE =
  " Let op: dit klopt enkel als je in volgorde boekt. Ga je later terug om een vorig stuk te verbeteren, " +
  "dan zitten de boekingen van daarna al in het saldo van de T-rekening.";

const TIP_BANK =
  "Klopt je saldo op de T-rekening van de bank met het bankafschrift? " +
  "Check dat vóór én na je boeking — zo weet je zeker dat je wijziging op de bankrekening juist geboekt is." +
  TIP_VOLGORDE;

const TIP_KAS =
  "Klopt je saldo op de T-rekening van de kas met het kasstuk? " +
  "Check dat vóór én na je boeking — zo weet je zeker dat je wijziging in de kas juist geboekt is." +
  TIP_VOLGORDE;

OPDRACHTEN.forEach(function (o) {
  if (o.tip) return;
  if (String(o.ref).indexOf("BANK") === 0) o.tip = TIP_BANK;
  else if (String(o.ref).indexOf("KAS") === 0) o.tip = TIP_KAS;
});
`;
fs.writeFileSync(path.join(ROOT, "js/data-opdrachten.js"), out);

/* ---------------- data-beginstand.js ---------------- */

const open = openFacturen2026();
const relatieVoor = (nr) => {
  if (nr === "400000") return open.find((d) => d.soort === "VK").aan;
  if (nr === "440000") return open.find((d) => d.soort === "AK").van;
  return "";
};
const fmt = (n) => new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 2 }).format(n);
const rijen = beginbalans().map((r) => ({
  bedrag: fmt(Math.abs(r.saldo)),
  redenering: "beginbalans 1/1/2027",
  apko: r.apko,
  stijgtDaalt: "",
  rekening: r.rekening,
  dc: r.saldo > 0 ? "D" : "C",
  relatie: relatieVoor(r.rekening),
}));

fs.writeFileSync(path.join(ROOT, "js/data-beginstand.js"), `// data-beginstand.js
// De beginboeking (BB) op 1 januari 2027. Ze staat al klaar in de app en kan
// door de leerling niet gewijzigd worden: dit zijn de cijfers van het 3e jaar
// (2026), na de afsluiting door de boekhouder. De beginbalans 2027 is dus de
// eindbalans 2026.
//
// GEMAAKT MET hulpmiddelen/maak-data.js uit de case (tabblad J1 Proefbalans,
// kolom "Na afsluiting 31/12"). De namen bij 400000 en 440000 zijn de twee
// facturen van eind december die nog openstaan: die worden in januari betaald.

const BEGINSTAND = {
  ref: "BB",
  rows: ${JSON.stringify(rijen, null, 2).replace(/\n/g, "\n  ")},
};
`);

/* ---------------- data-relaties.js ---------------- */

const klanten = new Set(), leveranciers = new Set();
CASE.j2.documenten.concat(open).forEach((d) => {
  if (d.soort === "AK" || d.soort === "CN-AK") leveranciers.add(d.van);
  if (d.soort === "VK" || d.soort === "CN-VK") klanten.add(d.aan);
});
klanten.add("particulieren (dagontvangsten)");

fs.writeFileSync(path.join(ROOT, "js/data-relaties.js"), `// data-relaties.js
// Startlijstje van klanten en leveranciers voor het extra veld bij boekingen
// op 400000 (Handelsdebiteuren) en 440000 (Leveranciers). Zo schrijven de
// leerlingen dezelfde naam telkens op dezelfde manier, en tellen factuur en
// betaling bij dezelfde relatie.
//
// GEMAAKT MET hulpmiddelen/maak-data.js: alle bedrijven uit jaar 2 van de case.
// Namen die leerlingen zelf intikken, verschijnen er vanzelf bij.

const RELATIES = {
  klanten: ${JSON.stringify([...klanten].sort(), null, 4).replace(/\n\]/, "\n  ]")},
  leveranciers: ${JSON.stringify([...leveranciers].sort(), null, 4).replace(/\n\]/, "\n  ]")},
};
`);

console.log("Geschreven: js/data-opdrachten.js (" + (L.length + 1) + " opdrachten), js/data-beginstand.js (" +
  rijen.length + " rijen), js/data-relaties.js (" + klanten.size + " klanten, " + leveranciers.size + " leveranciers)");
