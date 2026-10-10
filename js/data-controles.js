// data-controles.js
// Alles wat bij de controles hoort.
// Wijzigt dit per jaar/bundel? Pas het hier aan, niet in app.js.
//
// ---------------------------------------------------------------------------
// CONTROLES STAAN BIJ HUN CATEGORIE
//
// Leerlingen dienen stapsgewijs in, per categorie (dus ook per kwartaal).
// Elke controle krijgt een veld "categorie": de app zet ze dan automatisch op
// een eigen controlepagina onderaan die categorie in het menu.
//
// Een controle hoort bij de categorie waar ze voor het eerst beantwoord kan
// worden — dus bij de láátste stap waarvan ze afhangt.
//
// Controles zonder categorie (of met een categorie die niet bestaat) komen
// op de eindcontrole terecht.
// ---------------------------------------------------------------------------

// Welke documenten de app toont bij een controle met docConfig. In deze
// bundel staat het laatste afschrift per kwartaal rechtstreeks bij de
// controle (veld "doc"), want "het laatste" verschilt per kwartaal.
const CONTROLE_CONFIG = {
  laatsteBankRef: null,
  laatsteKasRef: null,
  voorraadRef: "VR",
  beginbalansRef: "BB",
};

// Rekeningen waarvan de verwachte saldokant afwijkt van de gewone regel
// (actief en kost = debet, passief en opbrengst = credit): contrarekeningen.
// Rekeningen die op 9 eindigen (geboekte afschrijvingen) worden al
// automatisch herkend.
const SALDO_UITZONDERINGEN = {
  "604010": "C",  // Retours op aankopen (-)
  "604020": "C",  // Handelskorting op aankopen (-)
  "609400": "C",  // Voorraadwijzigingen handelsgoederen — bij een stijgende voorraad
  "704010": "D",  // Retours op verkopen (-)
  "704020": "D",  // Handelskorting op verkopen (-)
};

// Rekeningen die de app niet op saldokant controleert, omdat meer dan één
// kant een geldig resultaat is.
const SALDO_GEEN_CONTROLE = [
  "580000",  // Interne overboekingen — moet net op 0 komen, apart nagekeken
];

const INLEIDING =
  "Hieronder vind je één of meerdere controles die je zelf kunt overlopen voor je indient. " +
  "Bekijk elke controle en check of je eraan voldoet.";

// Extra's per categorie op de controlepagina: een inleidende zin en, bij de
// beginbalans, de invulbalans (de sleepoefening met enkel de openingsboeking).
const CATEGORIE_CONTROLES = {
  "Beginbalans": {
    inleiding: "Je beginboeking staat al klaar: het zijn de cijfers van vorig jaar. Leg de rubrieken op hun plaats in de balans — zo frissen je de balans van het 3e jaar op. Je toewijzing wordt bewaard en ligt straks al klaar voor de eindbalans.",
    invulbalansVoorRef: "BB",
  },
  "K1 · Aankopen": { inleiding: INLEIDING },
  "K1 · Verkopen": { inleiding: INLEIDING },
  "K1 · Btw-verwerking": { inleiding: INLEIDING },
  "K1 · Financiële verrichtingen": { inleiding: INLEIDING + " Hier komen kas, bank en je klanten en leveranciers samen. Neem er de tijd voor vóór je indient." },
  "K2 · Aankopen": { inleiding: INLEIDING },
  "K2 · Verkopen": { inleiding: INLEIDING },
  "K2 · Btw-verwerking": { inleiding: INLEIDING },
  "K2 · Financiële verrichtingen": { inleiding: INLEIDING },
  "K3 · Aankopen en verkopen": { inleiding: INLEIDING + " In dit kwartaal staan aankopen en verkopen door elkaar: bepaal bij elk document eerst of Noor koopt of verkoopt." },
  "K3 · Btw-verwerking": { inleiding: INLEIDING },
  "K3 · Financiële verrichtingen": { inleiding: INLEIDING },
  "K4 · Alle verrichtingen": { inleiding: INLEIDING + " Alles staat hier door elkaar, in de volgorde van de datum — net zoals de documenten in een echt bedrijf binnenkomen." },
  "Eindejaarsverrichtingen": { inleiding: INLEIDING },
};

// Kleine bouwstenen, omdat dezelfde vragen elk kwartaal terugkomen.
function controleLeveranciers(cat, id, refs) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Vind je op 440000 elke aankoopfactuur en creditnota terug?",
    toelichting: "Open de T-rekening van de leveranciers. Je hoort er " + refs + " te zien staan. Ontbreekt er één, ga dan terug naar die boeking en kijk na of het bedrag wel op 440000 staat. Een creditnota staat aan de andere kant dan een factuur.",
    filterTip: "Filter in het T-paneel op 440000.",
  };
}
function controleKlanten(cat, id, refs) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Vind je op 400000 elke verkoopfactuur, creditnota en dagontvangst terug?",
    toelichting: "Open de T-rekening van de klanten. Je hoort er " + refs + " te zien staan.",
    filterTip: "Filter in het T-paneel op 400000.",
  };
}
function controleKortingen(cat, id) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Staan retours en handelskortingen aan de juiste kant?",
    toelichting: "Retours en handelskortingen op aankopen verminderen je kosten: 604010 en 604020 houden een creditsaldo. Retours en handelskortingen op verkopen verminderen je omzet: 704010 en 704020 houden een debetsaldo. Kosten op een factuur (transport, levering) staan apart op 604030 of 746000.",
    filterTip: "Filter in het T-paneel op rubriek 60 en daarna op rubriek 70.",
  };
}
function controleVerpakking(cat, id) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Staan de waarborgen voor verpakking op 418000 en 488000 — zonder btw?",
    toelichting: "Een waarborg is geen kost en geen opbrengst: je krijgt hem terug (418000) of je moet hem terugbetalen (488000). Er staat geen btw op. Komt de verpakking terug met een creditnota, dan daalt die vordering of schuld weer.",
    filterTip: "Filter in het T-paneel op 418000 en daarna op 488000.",
  };
}
function controleBtwLeeg(cat, id, kw) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Zijn alle tussentijdse btw-rekeningen leeg na de btw-verwerking van het " + kw + "?",
    toelichting: "Na de btw-aangifte hoort alle btw samen te staan op 411000 (tegoed) of 451000 (schuld). De tussentijdse rekeningen (411100, 411200, 451100 en 451200) moeten dan op nul staan. Stond er van het vorige kwartaal nog een tegoed op 411000, dan is dat mee verrekend.",
    filterTip: "Filter in het T-paneel op btw.",
  };
}
function controleBtwSaldo(cat, id) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Staat er maar op één van de twee btw-saldorekeningen iets: 411000 óf 451000?",
    toelichting: "Een btw-tegoed en een btw-schuld tegelijk kan niet: de overheid verrekent ze met elkaar. Is het een tegoed, dan schuift het door naar het volgende kwartaal. Is het een schuld, dan betaal je die de 20e van de maand erna.",
    filterTip: "Filter in het T-paneel op 411000 en daarna op 451000.",
  };
}
function controleBank(cat, id, doc) {
  return {
    id: id, categorie: cat, type: "check-met-document", doc: doc,
    vraag: "Is het banksaldo op het laatste afschrift (" + doc + ") gelijk aan het saldo op 550000?",
    filterTip: "Filter in het T-paneel op 550000.",
  };
}
function controleKas(cat, id, doc) {
  return {
    id: id, categorie: cat, type: "check-met-document", doc: doc,
    vraag: "Is het kassaldo op het laatste kasstuk (" + doc + ") gelijk aan het saldo op 570000?",
    filterTip: "Filter in het T-paneel op 570000.",
  };
}
function controle580(cat, id) {
  return {
    id: id, categorie: cat, type: "check",
    vraag: "Staat 580000 (interne overboekingen) terug op 0?",
    toelichting: "Elke storting of afhaling tussen kas en bank passeert hier, één keer debet (op het kasstuk of het afschrift) en één keer credit (op het andere document). Blijft er iets staan, dan ontbreekt de tegenboeking.",
    filterTip: "Filter in het T-paneel op 580000.",
  };
}
function controleRelaties(cat, id, soort) {
  var klant = soort === "klanten";
  return {
    id: id, categorie: cat, type: "check", relatieSoort: soort,
    vraag: "Is het totaal nog open bij je " + soort + " gelijk aan het saldo op " + (klant ? "400000" : "440000") + "?",
    toelichting: "Het overzicht hieronder komt uit je eigen boekingen op de pagina Klanten & leveranciers. Punt daar ook alles af: elke betaling en creditnota hoort bij een factuur. Werd er binnen de termijn betaald met financiële korting, dan is de factuur toch volledig vereffend: het verschil staat op " + (klant ? "657000" : "757000") + ".",
    filterTip: "Filter in het T-paneel op " + (klant ? "400000" : "440000") + ".",
  };
}
function controleLening(cat, id) {
  return {
    id: id, categorie: cat, type: "check-met-document", doc: "LENING",
    vraag: "Komt het saldo van 173000 overeen met het kapitaal dat volgens de aflossingstabel nog af te lossen is?",
    toelichting: "Bij een aflossing daalt de schuld enkel met het kapitaal. De intrest is een kost (650000) en verandert niets aan de schuld.",
    filterTip: "Filter in het T-paneel op 173000.",
  };
}

// Handmatige controles: de leerling vinkt zelf "in orde" aan, met het
// T-paneel en eventueel een klein documentbeeld erbij.
//
// type "check"               gewone ja/nee-vraag
// type "check-met-document"  ja/nee-vraag + klein documentbeeld ernaast
//
// Optioneel: toelichting, uitleg (sleutel uit data-info.js), filterTip,
// doc (bestandsnaam van het document ernaast), docConfig (sleutel uit
// CONTROLE_CONFIG), docs (meerdere documenten), relatieSoort.
//
// De app toont bewust GEEN saldi bij een controle: dan valt er niets meer na
// te kijken. De leerling zoekt zelf in het T-paneel met de filtertip.
const HANDMATIGE_CONTROLES = [

  /* ---------------- Beginbalans ---------------- */
  {
    id: "beginbalans-klopt",
    categorie: "Beginbalans",
    type: "check-met-document",
    vraag: "Komt de balans die je hierboven gelegd hebt overeen met het document?",
    toelichting: "Vergelijk vak per vak met de beginbalans. Staat er een rubriek op een plaats waar ze niet hoort, verschuif ze dan.",
    docConfig: "beginbalansRef",
  },

  /* ---------------- 1e kwartaal ---------------- */
  controleLeveranciers("K1 · Aankopen", "k1-aankopen-op-leveranciers", "BB en AK01 tot en met AK07"),
  controleKortingen("K1 · Aankopen", "k1-aankopen-kortingen"),
  controleVerpakking("K1 · Aankopen", "k1-aankopen-verpakking"),
  controleKlanten("K1 · Verkopen", "k1-verkopen-op-klanten", "BB, VK01 tot en met VK07, ONTV01 en het kasstuk KAS01 (het contante deel)"),
  {
    id: "k1-dagontvangst-open",
    categorie: "K1 · Verkopen",
    type: "check-met-document", doc: "ONTV01",
    vraag: "Staat het bancontact-deel van de dagontvangst nog open op 400000?",
    toelichting: "Het dagontvangstenblad zet het volledige bedrag op 400000. Het kasstuk haalt het contante deel eraf. Het bancontact-deel komt pas later op een bankafschrift binnen — tot dan blijft het open.",
    filterTip: "Filter in het T-paneel op 400000.",
  },
  controleBtwLeeg("K1 · Btw-verwerking", "k1-btw-leeg", "1e kwartaal"),
  controleBtwSaldo("K1 · Btw-verwerking", "k1-btw-saldo"),
  controleBank("K1 · Financiële verrichtingen", "k1-bank", "BANK08"),
  controleKas("K1 · Financiële verrichtingen", "k1-kas", "KAS03"),
  controle580("K1 · Financiële verrichtingen", "k1-580"),
  {
    id: "k1-lening-opgenomen",
    categorie: "K1 · Financiële verrichtingen",
    type: "check-met-document", doc: "LENING",
    vraag: "Staat de volledige lening op 173000 Schulden aan kredietinstellingen?",
    toelichting: "Fietsatelier Noor leent het geld om in de zomer een bestelwagen te kopen. Bij de opname stijgt de bank én de schuld aan de bank.",
    filterTip: "Filter in het T-paneel op 173000.",
  },
  controleRelaties("K1 · Financiële verrichtingen", "k1-klanten-open", "klanten"),
  controleRelaties("K1 · Financiële verrichtingen", "k1-leveranciers-open", "leveranciers"),

  /* ---------------- 2e kwartaal ---------------- */
  controleLeveranciers("K2 · Aankopen", "k2-aankopen-op-leveranciers", "AK08 tot en met AK14"),
  controleKortingen("K2 · Aankopen", "k2-aankopen-kortingen"),
  controleVerpakking("K2 · Aankopen", "k2-aankopen-verpakking"),
  controleKlanten("K2 · Verkopen", "k2-verkopen-op-klanten", "VK08 tot en met VK14, ONTV02 en het kasstuk KAS04"),
  controleBtwLeeg("K2 · Btw-verwerking", "k2-btw-leeg", "2e kwartaal"),
  controleBtwSaldo("K2 · Btw-verwerking", "k2-btw-saldo"),
  controleBank("K2 · Financiële verrichtingen", "k2-bank", "BANK13"),
  controleKas("K2 · Financiële verrichtingen", "k2-kas", "KAS05"),
  controle580("K2 · Financiële verrichtingen", "k2-580"),
  controleLening("K2 · Financiële verrichtingen", "k2-lening"),
  controleRelaties("K2 · Financiële verrichtingen", "k2-klanten-open", "klanten"),
  controleRelaties("K2 · Financiële verrichtingen", "k2-leveranciers-open", "leveranciers"),

  /* ---------------- 3e kwartaal ---------------- */
  {
    id: "k3-koop-of-verkoop",
    categorie: "K3 · Aankopen en verkopen",
    type: "check",
    vraag: "Heb je bij elk document eerst bepaald of Noor koopt of verkoopt?",
    toelichting: "Kijk wie het document opmaakt. Staat Fietsatelier Noor bovenaan, dan verkoopt Noor (klant op 400000). Staat er een ander bedrijf bovenaan en Noor bij \"aan\", dan koopt Noor (leverancier op 440000). Vind je op 400000 en 440000 elk DOC-document van dit kwartaal één keer terug?",
    filterTip: "Filter in het T-paneel op 400000 en daarna op 440000.",
  },
  {
    id: "k3-vast-actief",
    categorie: "K3 · Aankopen en verkopen",
    type: "check",
    vraag: "Staat de bestelwagen op een rekening van klasse 2, en niet bij de kosten?",
    toelichting: "Een bestelwagen gebruik je jarenlang: het is een vast actief, geen kost van dit jaar.",
    filterTip: "Filter in het T-paneel op klasse 2 (Vaste activa).",
  },
  controleKortingen("K3 · Aankopen en verkopen", "k3-kortingen"),
  controleVerpakking("K3 · Aankopen en verkopen", "k3-verpakking"),
  controleBtwLeeg("K3 · Btw-verwerking", "k3-btw-leeg", "3e kwartaal"),
  controleBtwSaldo("K3 · Btw-verwerking", "k3-btw-saldo"),
  controleBank("K3 · Financiële verrichtingen", "k3-bank", "BANK18"),
  controleLening("K3 · Financiële verrichtingen", "k3-lening"),
  controleRelaties("K3 · Financiële verrichtingen", "k3-klanten-open", "klanten"),
  controleRelaties("K3 · Financiële verrichtingen", "k3-leveranciers-open", "leveranciers"),

  /* ---------------- 4e kwartaal ---------------- */
  {
    id: "k4-alles-geboekt",
    categorie: "K4 · Alle verrichtingen",
    type: "check",
    vraag: "Vind je op 400000 en 440000 elk DOC-document van dit kwartaal één keer terug?",
    toelichting: "In dit kwartaal staat alles door elkaar. Een document dat je op de verkeerde rekening boekte (koopt of verkoopt Noor?), valt hier meteen op.",
    filterTip: "Filter in het T-paneel op 400000 en daarna op 440000.",
  },
  controleKortingen("K4 · Alle verrichtingen", "k4-kortingen"),
  controleBank("K4 · Alle verrichtingen", "k4-bank", "BANK23"),
  controleKas("K4 · Alle verrichtingen", "k4-kas", "KAS07"),
  controle580("K4 · Alle verrichtingen", "k4-580"),
  controleLening("K4 · Alle verrichtingen", "k4-lening"),
  controleRelaties("K4 · Alle verrichtingen", "k4-klanten-open", "klanten"),
  controleRelaties("K4 · Alle verrichtingen", "k4-leveranciers-open", "leveranciers"),

  /* ---------------- Eindejaarsverrichtingen ---------------- */
  controleBtwLeeg("Eindejaarsverrichtingen", "af-btw-leeg", "4e kwartaal"),
  controleBtwSaldo("Eindejaarsverrichtingen", "af-btw-saldo"),
  {
    id: "af-vaste-activa-nummers",
    categorie: "Eindejaarsverrichtingen",
    type: "check-met-document", doc: "AFSCHR",
    vraag: "Hoort bij elke aanschafwaarde de afschrijving met hetzelfde nummer?",
    toelichting: "Elk soort vast actief heeft twee rekeningen die bij elkaar horen: de aanschafwaarde (bv. 241000) en de geboekte afschrijvingen met hetzelfde basisnummer, eindigend op 9 (241009). Tel ook na: is het totaal van je afschrijvingskosten (rubriek 63) gelijk aan het totaal van de afschrijvingen van dit jaar in de tabel?",
    filterTip: "Filter in het T-paneel op klasse 2 (Vaste activa) en daarna op rubriek 63.",
  },
  {
    id: "af-voorraad-klopt",
    categorie: "Eindejaarsverrichtingen",
    type: "check-met-document",
    vraag: "Klopt de voorraad met de telling?",
    toelichting: "Het saldo van 340000 Voorraad handelsgoederen moet gelijk zijn aan de waarde van de voorraadtelling op 31 december.",
    docConfig: "voorraadRef",
    filterTip: "Filter in het T-paneel op voorraad.",
  },
];
