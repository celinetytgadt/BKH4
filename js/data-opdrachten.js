// data-opdrachten.js
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

  // K1 · Aankopen
  { ref: "AK01", categorie: "K1 · Aankopen", titel: "Aankoop AK01", doc: "AK01" },
  { ref: "AK02", categorie: "K1 · Aankopen", titel: "Aankoop AK02", doc: "AK02" },
  { ref: "AK03", categorie: "K1 · Aankopen", titel: "Aankoop AK03", doc: "AK03" },
  { ref: "AK04", categorie: "K1 · Aankopen", titel: "Aankoop AK04", doc: "AK04" },
  { ref: "AK05", categorie: "K1 · Aankopen", titel: "Aankoop AK05", doc: "AK05" },
  { ref: "AK06", categorie: "K1 · Aankopen", titel: "Aankoop AK06", doc: "AK06" },
  { ref: "AK07", categorie: "K1 · Aankopen", titel: "Aankoop AK07", doc: "AK07" },

  // K1 · Verkopen
  { ref: "VK01", categorie: "K1 · Verkopen", titel: "Verkoop VK01", doc: "VK01" },
  { ref: "VK02", categorie: "K1 · Verkopen", titel: "Verkoop VK02", doc: "VK02" },
  { ref: "VK03", categorie: "K1 · Verkopen", titel: "Verkoop VK03", doc: "VK03" },
  { ref: "VK04", categorie: "K1 · Verkopen", titel: "Verkoop VK04", doc: "VK04" },
  { ref: "VK05", categorie: "K1 · Verkopen", titel: "Verkoop VK05", doc: "VK05" },
  { ref: "VK06", categorie: "K1 · Verkopen", titel: "Verkoop VK06", doc: "VK06" },
  { ref: "VK07", categorie: "K1 · Verkopen", titel: "Verkoop VK07", doc: "VK07" },
  { ref: "ONTV01", categorie: "K1 · Verkopen", titel: "Dagontvangsten ONTV01", doc: "ONTV01" },

  // K1 · Financiële verrichtingen
  { ref: "BANK01", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK01", doc: "BANK01", betaalstuk: true, hulpdocs: [{"doc":"BBVK","titel":"Openstaande verkoopfactuur 2026-018 (van vorig jaar)"},{"doc":"BBAK","titel":"Openstaande aankoopfactuur 2026-1288 (van vorig jaar)"}] },

  // K1 · Btw-verwerking
  { ref: "BTW1", categorie: "K1 · Btw-verwerking", titel: "Btw-verwerking BTW1 (1e kwartaal)", geenDocument: true, instructie: "Kijk in de T-rekeningen rechts naar het saldo van de tussentijdse btw-rekeningen (de 411- en 451-rekeningen die niet op 000 eindigen). Na de btw-aangifte van het kwartaal worden die rekeningen leeggemaakt: de btw komt samen op 411000 Terug te vorderen btw-saldo (een tegoed) of op 451000 Te betalen btw-saldo (een schuld). Staat er van het vorige kwartaal nog een tegoed op 411000, verreken dat dan mee. Boek je in volgorde, dan staat in de T-rekeningen precies de btw van dit kwartaal." },

  // K1 · Financiële verrichtingen
  { ref: "KAS01", categorie: "K1 · Financiële verrichtingen", titel: "Kasstuk KAS01", doc: "KAS01", betaalstuk: true },
  { ref: "KAS02", categorie: "K1 · Financiële verrichtingen", titel: "Kasstuk KAS02", doc: "KAS02", betaalstuk: true },
  { ref: "BANK02", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK02", doc: "BANK02", betaalstuk: true },
  { ref: "BANK03", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK03", doc: "BANK03", betaalstuk: true },
  { ref: "BANK04", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK04", doc: "BANK04", betaalstuk: true, hulpdoc: "LENING", hulpdocTitel: "Kredietovereenkomst en aflossingstabel" },
  { ref: "BANK05", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK05", doc: "BANK05", betaalstuk: true },
  { ref: "BANK06", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK06", doc: "BANK06", betaalstuk: true },
  { ref: "KAS03", categorie: "K1 · Financiële verrichtingen", titel: "Kasstuk KAS03", doc: "KAS03", betaalstuk: true },
  { ref: "BANK07", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK07", doc: "BANK07", betaalstuk: true },
  { ref: "BANK08", categorie: "K1 · Financiële verrichtingen", titel: "Bankafschrift BANK08", doc: "BANK08", betaalstuk: true },

  // K2 · Aankopen
  { ref: "AK08", categorie: "K2 · Aankopen", titel: "Aankoop AK08", doc: "AK08" },
  { ref: "AK09", categorie: "K2 · Aankopen", titel: "Aankoop AK09", doc: "AK09" },
  { ref: "AK10", categorie: "K2 · Aankopen", titel: "Aankoop AK10", doc: "AK10" },
  { ref: "AK11", categorie: "K2 · Aankopen", titel: "Aankoop AK11", doc: "AK11" },
  { ref: "AK12", categorie: "K2 · Aankopen", titel: "Aankoop AK12", doc: "AK12" },
  { ref: "AK13", categorie: "K2 · Aankopen", titel: "Aankoop AK13", doc: "AK13" },
  { ref: "AK14", categorie: "K2 · Aankopen", titel: "Aankoop AK14", doc: "AK14" },

  // K2 · Verkopen
  { ref: "VK08", categorie: "K2 · Verkopen", titel: "Verkoop VK08", doc: "VK08" },
  { ref: "VK09", categorie: "K2 · Verkopen", titel: "Verkoop VK09", doc: "VK09" },
  { ref: "VK10", categorie: "K2 · Verkopen", titel: "Verkoop VK10", doc: "VK10" },
  { ref: "VK11", categorie: "K2 · Verkopen", titel: "Verkoop VK11", doc: "VK11" },
  { ref: "VK12", categorie: "K2 · Verkopen", titel: "Verkoop VK12", doc: "VK12" },
  { ref: "ONTV02", categorie: "K2 · Verkopen", titel: "Dagontvangsten ONTV02", doc: "ONTV02" },

  // K2 · Financiële verrichtingen
  { ref: "BANK09", categorie: "K2 · Financiële verrichtingen", titel: "Bankafschrift BANK09", doc: "BANK09", betaalstuk: true },

  // K2 · Verkopen
  { ref: "VK13", categorie: "K2 · Verkopen", titel: "Verkoop VK13", doc: "VK13" },
  { ref: "VK14", categorie: "K2 · Verkopen", titel: "Verkoop VK14", doc: "VK14" },

  // K2 · Btw-verwerking
  { ref: "BTW2", categorie: "K2 · Btw-verwerking", titel: "Btw-verwerking BTW2 (2e kwartaal)", geenDocument: true, instructie: "Kijk in de T-rekeningen rechts naar het saldo van de tussentijdse btw-rekeningen (de 411- en 451-rekeningen die niet op 000 eindigen). Na de btw-aangifte van het kwartaal worden die rekeningen leeggemaakt: de btw komt samen op 411000 Terug te vorderen btw-saldo (een tegoed) of op 451000 Te betalen btw-saldo (een schuld). Staat er van het vorige kwartaal nog een tegoed op 411000, verreken dat dan mee. Boek je in volgorde, dan staat in de T-rekeningen precies de btw van dit kwartaal." },

  // K2 · Financiële verrichtingen
  { ref: "BANK10", categorie: "K2 · Financiële verrichtingen", titel: "Bankafschrift BANK10", doc: "BANK10", betaalstuk: true, hulpdoc: "LENING", hulpdocTitel: "Kredietovereenkomst en aflossingstabel" },
  { ref: "BANK11", categorie: "K2 · Financiële verrichtingen", titel: "Bankafschrift BANK11", doc: "BANK11", betaalstuk: true },
  { ref: "KAS04", categorie: "K2 · Financiële verrichtingen", titel: "Kasstuk KAS04", doc: "KAS04", betaalstuk: true },
  { ref: "BANK12", categorie: "K2 · Financiële verrichtingen", titel: "Bankafschrift BANK12", doc: "BANK12", betaalstuk: true },
  { ref: "KAS05", categorie: "K2 · Financiële verrichtingen", titel: "Kasstuk KAS05", doc: "KAS05", betaalstuk: true },
  { ref: "BANK13", categorie: "K2 · Financiële verrichtingen", titel: "Bankafschrift BANK13", doc: "BANK13", betaalstuk: true },

  // K3 · Aankopen en verkopen
  { ref: "DOC01", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC01", doc: "DOC01" },
  { ref: "DOC02", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC02", doc: "DOC02" },
  { ref: "DOC03", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC03", doc: "DOC03" },
  { ref: "DOC04", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC04", doc: "DOC04" },
  { ref: "DOC05", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC05", doc: "DOC05" },
  { ref: "DOC06", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC06", doc: "DOC06" },
  { ref: "DOC07", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC07", doc: "DOC07" },
  { ref: "DOC08", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC08", doc: "DOC08" },
  { ref: "DOC09", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC09", doc: "DOC09" },
  { ref: "DOC10", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC10", doc: "DOC10" },
  { ref: "DOC11", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC11", doc: "DOC11" },
  { ref: "DOC12", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC12", doc: "DOC12" },
  { ref: "DOC13", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC13", doc: "DOC13" },
  { ref: "DOC14", categorie: "K3 · Aankopen en verkopen", titel: "Document DOC14", doc: "DOC14" },

  // K3 · Btw-verwerking
  { ref: "BTW3", categorie: "K3 · Btw-verwerking", titel: "Btw-verwerking BTW3 (3e kwartaal)", geenDocument: true, instructie: "Kijk in de T-rekeningen rechts naar het saldo van de tussentijdse btw-rekeningen (de 411- en 451-rekeningen die niet op 000 eindigen). Na de btw-aangifte van het kwartaal worden die rekeningen leeggemaakt: de btw komt samen op 411000 Terug te vorderen btw-saldo (een tegoed) of op 451000 Te betalen btw-saldo (een schuld). Staat er van het vorige kwartaal nog een tegoed op 411000, verreken dat dan mee. Boek je in volgorde, dan staat in de T-rekeningen precies de btw van dit kwartaal." },

  // K3 · Financiële verrichtingen
  { ref: "BANK14", categorie: "K3 · Financiële verrichtingen", titel: "Bankafschrift BANK14", doc: "BANK14", betaalstuk: true },
  { ref: "BANK15", categorie: "K3 · Financiële verrichtingen", titel: "Bankafschrift BANK15", doc: "BANK15", betaalstuk: true, hulpdoc: "LENING", hulpdocTitel: "Kredietovereenkomst en aflossingstabel" },
  { ref: "BANK16", categorie: "K3 · Financiële verrichtingen", titel: "Bankafschrift BANK16", doc: "BANK16", betaalstuk: true },
  { ref: "BANK17", categorie: "K3 · Financiële verrichtingen", titel: "Bankafschrift BANK17", doc: "BANK17", betaalstuk: true },
  { ref: "BANK18", categorie: "K3 · Financiële verrichtingen", titel: "Bankafschrift BANK18", doc: "BANK18", betaalstuk: true },

  // K4 · Alle verrichtingen
  { ref: "DOC15", categorie: "K4 · Alle verrichtingen", titel: "Document DOC15", doc: "DOC15" },
  { ref: "DOC16", categorie: "K4 · Alle verrichtingen", titel: "Document DOC16", doc: "DOC16" },
  { ref: "DOC17", categorie: "K4 · Alle verrichtingen", titel: "Document DOC17", doc: "DOC17" },
  { ref: "DOC18", categorie: "K4 · Alle verrichtingen", titel: "Document DOC18", doc: "DOC18" },
  { ref: "DOC19", categorie: "K4 · Alle verrichtingen", titel: "Document DOC19", doc: "DOC19" },
  { ref: "DOC20", categorie: "K4 · Alle verrichtingen", titel: "Document DOC20", doc: "DOC20" },
  { ref: "BANK19", categorie: "K4 · Alle verrichtingen", titel: "Bankafschrift BANK19", doc: "BANK19", betaalstuk: true },
  { ref: "DOC21", categorie: "K4 · Alle verrichtingen", titel: "Document DOC21", doc: "DOC21" },
  { ref: "DOC22", categorie: "K4 · Alle verrichtingen", titel: "Document DOC22", doc: "DOC22" },
  { ref: "BANK20", categorie: "K4 · Alle verrichtingen", titel: "Bankafschrift BANK20", doc: "BANK20", betaalstuk: true, hulpdoc: "LENING", hulpdocTitel: "Kredietovereenkomst en aflossingstabel" },
  { ref: "DOC23", categorie: "K4 · Alle verrichtingen", titel: "Document DOC23", doc: "DOC23" },
  { ref: "DOC24", categorie: "K4 · Alle verrichtingen", titel: "Document DOC24", doc: "DOC24" },
  { ref: "DOC25", categorie: "K4 · Alle verrichtingen", titel: "Document DOC25", doc: "DOC25" },
  { ref: "DOC26", categorie: "K4 · Alle verrichtingen", titel: "Document DOC26", doc: "DOC26" },
  { ref: "BANK21", categorie: "K4 · Alle verrichtingen", titel: "Bankafschrift BANK21", doc: "BANK21", betaalstuk: true },
  { ref: "DOC27", categorie: "K4 · Alle verrichtingen", titel: "Document DOC27", doc: "DOC27" },
  { ref: "DOC28", categorie: "K4 · Alle verrichtingen", titel: "Document DOC28", doc: "DOC28" },
  { ref: "BANK22", categorie: "K4 · Alle verrichtingen", titel: "Bankafschrift BANK22", doc: "BANK22", betaalstuk: true },
  { ref: "ONTV03", categorie: "K4 · Alle verrichtingen", titel: "Dagontvangsten ONTV03", doc: "ONTV03" },
  { ref: "KAS06", categorie: "K4 · Alle verrichtingen", titel: "Kasstuk KAS06", doc: "KAS06", betaalstuk: true },
  { ref: "KAS07", categorie: "K4 · Alle verrichtingen", titel: "Kasstuk KAS07", doc: "KAS07", betaalstuk: true },
  { ref: "BANK23", categorie: "K4 · Alle verrichtingen", titel: "Bankafschrift BANK23", doc: "BANK23", betaalstuk: true },

  // Eindejaarsverrichtingen
  { ref: "BTW4", categorie: "Eindejaarsverrichtingen", titel: "Btw-verwerking BTW4 (4e kwartaal)", geenDocument: true, instructie: "Kijk in de T-rekeningen rechts naar het saldo van de tussentijdse btw-rekeningen (de 411- en 451-rekeningen die niet op 000 eindigen). Na de btw-aangifte van het kwartaal worden die rekeningen leeggemaakt: de btw komt samen op 411000 Terug te vorderen btw-saldo (een tegoed) of op 451000 Te betalen btw-saldo (een schuld). Staat er van het vorige kwartaal nog een tegoed op 411000, verreken dat dan mee. Boek je in volgorde, dan staat in de T-rekeningen precies de btw van dit kwartaal." },
  { ref: "VR", categorie: "Eindejaarsverrichtingen", titel: "Voorraad VR", doc: "VR" },
  { ref: "AFSCHR", categorie: "Eindejaarsverrichtingen", titel: "Afschrijvingen AFSCHR", doc: "AFSCHR" },

  // RESULTAAT staat niet in het menu maar op de eigen pagina
  // Resultaatverwerking. Het moet wel meetellen in de T-rekeningen.
  { ref: "RESULTAAT", categorie: "Resultaatverwerking", titel: "Resultaatverwerking", geenDocument: true, verborgenInNav: true },
];

// Volgorde van de categorieën in het menu.
const CATEGORIE_VOLGORDE = [
  "Beginbalans",
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
  "Eindejaarsverrichtingen"
];

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
