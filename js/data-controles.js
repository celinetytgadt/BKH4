// data-controles.js
// Alles wat bij de controles hoort. Wijzigt dit? Pas het hier aan, niet in app.js.
//
// De controles hangen af van het boekjaar: welke documenten er zijn, welk
// uittreksel het laatste is … Daarom maakt maakControles(jaar) ze telkens op
// basis van js/data-jaren.js (veld controleInfo). app.js roept die functie op
// bij het kiezen van een boekjaar en zet het resultaat in
// HANDMATIGE_CONTROLES en CATEGORIE_CONTROLES.
//
// Elke controle zegt drie dingen:
//   vraag        WAT je controleert
//   waar         WAAR je kijkt (rekening in het T-paneel, document)
//   zien         WAT je daar moet zien als alles klopt
// De app toont bewust geen saldi: dan valt er niets meer na te kijken.
//
// In de consolidaties noemen de controles geen DOC-nummers: die zouden
// verraden wat voor document het is.

var HANDMATIGE_CONTROLES = [];
var CATEGORIE_CONTROLES = {};

var CONTROLE_CONFIG = {
  laatsteBankRef: null,
  laatsteKasRef: null,
  voorraadRef: null,
  beginbalansRef: "BB",
};

// Rekeningen waarvan de verwachte saldokant afwijkt van de gewone regel
// (actief en kost = debet, passief en opbrengst = credit): contrarekeningen.
// Rekeningen die op 9 eindigen (geboekte afschrijvingen) worden al
// automatisch herkend.
var SALDO_UITZONDERINGEN = {
  "604010": "C",  // Retours op aankopen (-)
  "604020": "C",  // Handelskorting op aankopen (-)
  "609400": "C",  // Voorraadwijzigingen handelsgoederen — bij een stijgende voorraad
  "704010": "D",  // Retours op verkopen (-)
  "704020": "D",  // Handelskorting op verkopen (-)
};

// Rekeningen die de app niet op saldokant controleert, omdat meer dan één
// kant een geldig resultaat is.
var SALDO_GEEN_CONTROLE = [
  "580000",  // Interne overboekingen — moet net op 0 komen, apart nagekeken
  "609400",  // Voorraadwijziging: credit bij een stijging, debet bij een daling
];

var INLEIDING =
  "Loop elke controle na vóór je indient. Bij elke vraag staat waar je kijkt en wat je daar moet zien. " +
  "Klopt het, vink ze dan aan. Klopt het niet, ga dan terug naar de boeking en zoek de fout.";

function maakControles(J) {
  var jaar = J.jaar;
  var info = J.controleInfo;          // null in de consolidaties
  var conso = !info;
  var lijst = [];
  var perCat = {};

  function doc(ref) { return jaar + "/" + ref; }
  function opsomming(refs) {
    refs = refs || [];
    if (!refs.length) return "";
    if (refs.length === 1) return refs[0];
    return refs.slice(0, -1).join(", ") + " en " + refs[refs.length - 1];
  }
  function voeg(cat, c) {
    c.categorie = cat;
    c.id = jaar + "-" + c.id;
    if (!c.type) c.type = c.docs ? "check-met-document" : "check";
    lijst.push(c);
  }

  /* ---------------- Beginbalans ---------------- */
  perCat["Beginbalans"] = {
    inleiding: "Je beginboeking staat al klaar: het is de eindbalans van vorig jaar. Leg de rubrieken op hun plaats in de balans. Je toewijzing wordt bewaard en ligt straks al klaar voor de eindbalans.",
    invulbalansVoorRef: "BB",
  };
  voeg("Beginbalans", {
    id: "beginbalans-klopt",
    vraag: "Komt de balans die je hierboven legde overeen met het document Beginbalans?",
    waar: "Het document hieronder en je gelegde balans.",
    zien: "Elk vak heeft hetzelfde bedrag als op het document, en totaal activa = totaal passiva. Bij de vaste activa staat de aanschafwaarde min de afschrijvingen (bv. rubriek 24 = 240000 − 240009 + 240200 − 240209).",
    docs: [{ doc: doc("00_beginbalans"), titel: "Beginbalans" }],
  });

  var catAK = conso ? "Alle documenten" : "Aankopen";
  var catVK = conso ? "Alle documenten" : "Verkopen";
  var catBTW = conso ? "Alle documenten" : "Btw-verrekening";
  var catFIN = conso ? "Alle documenten" : "Financiële verrichtingen";
  var catEJ = conso ? "Alle documenten" : "Eindejaar";

  if (conso) {
    perCat["Alle documenten"] = { inleiding: INLEIDING + " Alles staat hier door elkaar, in de volgorde van de datum. Bepaal bij elk document eerst: wie maakt het op, koopt of verkoopt MetWear, of is het een betaling?" };
    voeg(catAK, {
      id: "koop-of-verkoop",
      vraag: "Heb je bij elke factuur en creditnota de juiste kant gekozen: koopt of verkoopt MetWear?",
      waar: "De kop van elk document, en in het T-paneel 400000 en 440000.",
      zien: "Staat MetWear bovenaan het document, dan verkoopt MetWear: de factuur staat debet op 400000, een creditnota credit. Staat een ander bedrijf bovenaan en MetWear bij \"aan\", dan koopt MetWear: de factuur staat credit op 440000, een creditnota debet. Elke factuur en creditnota vind je precies één keer terug op één van beide rekeningen.",
      filterTip: "Filter in het T-paneel op 400000 en daarna op 440000.",
    });
  } else {
    perCat["Aankopen"] = { inleiding: INLEIDING };
    perCat["Verkopen"] = { inleiding: INLEIDING };
    perCat["Btw-verrekening"] = { inleiding: INLEIDING + " Boek eerst alle aankopen en verkopen: pas dan kloppen deze controles." };
    perCat["Financiële verrichtingen"] = { inleiding: INLEIDING + " Hier komen kas, bank, de leningen en je klanten en leveranciers samen. Neem er de tijd voor." };
    perCat["Eindejaar"] = { inleiding: INLEIDING + " Boek eerst alle andere categorieën van dit jaar: de eindejaarsboekingen vertrekken van de saldi op 31 december." };
  }

  /* ---------------- Aankopen ---------------- */
  voeg(catAK, {
    id: "aankopen-440000",
    vraag: "Staat elke aankoopfactuur credit en elke creditnota van een leverancier debet op 440000 Leveranciers?",
    waar: "T-rekening 440000.",
    zien: conso
      ? "Credit het totaal (te betalen) van elke aankoopfactuur, debet het totaal van elke creditnota van een leverancier. Het bedrag is telkens het totaal onderaan het document, met btw en verpakking erbij."
      : "Credit: " + opsomming(info.aankoopfacturen) + ". Debet: " + opsomming(info.aankoopCN) +
        ". Het bedrag is telkens het totaal onderaan het document (met btw en verpakking erbij). Ontbreekt er een document, of staat het aan de verkeerde kant, ga dan terug naar die boeking.",
    filterTip: "Filter in het T-paneel op 440000.",
  });
  voeg(catAK, {
    id: "aankopen-411000",
    vraag: "Staat de btw van de aankopen op 411000 Aftrekbare btw — debet bij een factuur, credit bij een creditnota?",
    waar: "T-rekening 411000.",
    zien: "Per document het btw-bedrag van de factuur (21% van de maatstaf van heffing, dus ná de handelskorting). Een waarborg voor verpakking krijgt geen btw. Een creditnota geeft btw terug: die staat credit.",
    filterTip: "Filter in het T-paneel op 411000.",
  });
  voeg(catAK, {
    id: "aankopen-korting-kosten",
    vraag: "Staan handelskortingen en extra kosten op hun eigen rekening?",
    waar: "T-rekeningen 604000, 604020 en 604030.",
    zien: (conso ? "" : "Bij " + opsomming(info.kortingen.filter(function (r) { return r.indexOf("AK") === 0; })) + ": ") +
      "604000 debet met het bruto bedrag (vóór de korting) en 604020 Handelskorting op aankopen credit. " +
      (conso ? "" : "Bij " + opsomming(info.extraKosten.filter(function (r) { return r.indexOf("AK") === 0; })) + ": ") +
      "transport- of leveringskosten debet op 604030 Aankoopkosten, niet bij de handelsgoederen. Een retour (creditnota handelsgoederen) staat credit op 604010.",
    filterTip: "Filter in het T-paneel op rubriek 60.",
  });
  voeg(catAK, {
    id: "aankopen-verpakking",
    vraag: "Staan de waarborgen voor verpakking op 418000 Terug te vorderen verpakking, zonder btw?",
    waar: "T-rekening 418000.",
    zien: (conso
      ? "Debet de waarborg op elke aankoopfactuur met terugstuurbare verpakking; credit wanneer de verpakking teruggaat met een creditnota."
      : "Debet bij de facturen met verpakking (" + opsomming(info.verpakking.filter(function (r) { return r.indexOf("AK") === 0 && info.aankoopCN.indexOf(r) === -1; })) +
        "), credit bij de creditnota voor teruggestuurde verpakking (" + opsomming(info.verpakking.filter(function (r) { return info.aankoopCN.indexOf(r) !== -1; })) + ").") +
      " Een waarborg is geen kost: je krijgt hem terug.",
    filterTip: "Filter in het T-paneel op 418000.",
  });
  voeg(catAK, {
    id: "aankopen-vaste-activa",
    vraag: "Staan de investeringen op een rekening van klasse 2, en niet bij de kosten?",
    waar: "T-rekeningen van klasse 2.",
    zien: (conso ? "Een aankoop die je jarenlang gebruikt (installatie, meubilair, computer …)" : "De aankopen " + opsomming(info.vasteActiva)) +
      " staan debet op de juiste rekening van rubriek 23 (installaties, uitrusting) of 24 (meubilair, computers). Enkel het bedrag zonder btw; de btw staat op 411000.",
    filterTip: "Filter in het T-paneel op klasse 2.",
  });
  voeg(catAK, {
    id: "aankopen-diensten",
    vraag: "Staan diensten en diverse goederen op rubriek 61, met de creditnota aan de andere kant?",
    waar: "T-rekeningen van rubriek 61.",
    zien: (conso ? "Internet, elektriciteit, drukwerk, kantoorbenodigdheden …" : "De facturen " + opsomming(info.diensten.filter(function (r) { return info.aankoopCN.indexOf(r) === -1; }))) +
      " staan debet op de rekening die past bij wat er gekocht is (bv. 616000 Internet & telefonie, 612700 Verbruik elektriciteit). " +
      "Een creditnota daarop staat credit op diezelfde rekening.",
    filterTip: "Filter in het T-paneel op rubriek 61.",
  });

  /* ---------------- Verkopen ---------------- */
  voeg(catVK, {
    id: "verkopen-400000",
    vraag: "Staat elke verkoopfactuur en dagontvangst debet en elke creditnota aan een klant credit op 400000 Handelsdebiteuren?",
    waar: "T-rekening 400000.",
    zien: conso
      ? "Debet het totaal van elke verkoopfactuur en van het dagontvangstenblad (contant én bancontact samen), credit het totaal van elke creditnota aan een klant."
      : "Debet: " + opsomming(info.verkoopfacturen.concat(info.dagontvangsten.map(function (o) { return o.ontv; }))) +
        ". Credit: " + opsomming(info.verkoopCN) + ". Het bedrag is het totaal van het document. Bij een dagontvangst is dat het volledige bedrag, contant en bancontact samen.",
    filterTip: "Filter in het T-paneel op 400000.",
  });
  voeg(catVK, {
    id: "verkopen-451000",
    vraag: "Staat de btw van de verkopen credit op 451000 Verschuldigde btw, en die van een creditnota debet?",
    waar: "T-rekening 451000.",
    zien: "Per verkoopfactuur en dagontvangst het btw-bedrag van het document credit. Bij een creditnota aan een klant staat de btw debet: die hoef je niet meer te betalen.",
    filterTip: "Filter in het T-paneel op 451000.",
  });
  voeg(catVK, {
    id: "verkopen-korting-kosten",
    vraag: "Staan handelskortingen, retours en doorgerekende kosten op hun eigen rekening?",
    waar: "T-rekeningen van rubriek 70 en 746000.",
    zien: "704000 credit met het bruto bedrag en 704020 Handelskorting op verkopen debet. Een retour (creditnota) staat debet op 704010. " +
      "Kosten die MetWear aan de klant aanrekent (transport, levering) staan credit op 746000 Doorgerekende kosten.",
    filterTip: "Filter in het T-paneel op rubriek 70 en daarna op 746000.",
  });
  voeg(catVK, {
    id: "verkopen-verpakking",
    vraag: "Staan de waarborgen voor verpakking van klanten credit op 488000 Terug te betalen verpakking, zonder btw?",
    waar: "T-rekening 488000.",
    zien: "Credit de waarborg op de verkoopfacturen met terugstuurbare verpakking, debet wanneer de klant de verpakking terugbrengt (creditnota). Het is een schuld: MetWear moet het geld teruggeven.",
    filterTip: "Filter in het T-paneel op 488000.",
  });

  /* ---------------- Btw-verrekening ---------------- */
  voeg(catBTW, {
    id: "btw-leeg",
    vraag: "Staan 411000 Aftrekbare btw en 451000 Verschuldigde btw op nul na de btw-verrekening?",
    waar: "T-rekeningen 411000 en 451000.",
    zien: (conso ? "Na elk btw-overzicht" : "Na " + opsomming(info.btw.map(function (b) { return b.doc; }))) +
      " is alle btw van dat kwartaal weggeboekt: 451000 debet en 411000 credit, met de bedragen van het overzicht. Staat er nog iets op, dan ontbreekt een aankoop of verkoop of klopt het bedrag van het overzicht niet.",
    filterTip: "Filter in het T-paneel op 411000 en daarna op 451000.",
  });
  voeg(catBTW, {
    id: "btw-451900",
    vraag: "Staat het saldo van elk btw-overzicht op 451900 R/C btw-administratie?",
    waar: "T-rekening 451900 en het btw-overzicht.",
    zien: "Het verschil tussen verschuldigde en aftrekbare btw staat credit op 451900: dat moet MetWear aan de btw-administratie betalen. Het bedrag is het saldo onderaan het btw-overzicht.",
    filterTip: "Filter in het T-paneel op 451900.",
  });

  /* ---------------- Financiële verrichtingen ---------------- */
  voeg(catFIN, {
    id: "fin-bank",
    vraag: "Is het saldo van 550000 Bankrekening gelijk aan het nieuwe saldo op het laatste rekeninguittreksel?",
    waar: "T-rekening 550000 en " + (conso ? "het uittreksel met de laatste datum van het jaar." : "uittreksel " + info.laatsteBank + " (het laatste van het jaar)."),
    zien: "Saldo debet = het nieuwe saldo onderaan dat uittreksel. Klopt het niet, zoek dan het uittreksel waar het verschil begint: vergelijk het saldo na elk uittreksel.",
    docs: conso ? null : [{ doc: doc(info.laatsteBank), titel: info.laatsteBank }],
    filterTip: "Filter in het T-paneel op 550000.",
  });
  voeg(catFIN, {
    id: "fin-kas",
    vraag: "Is het saldo van 570000 Kas gelijk aan het saldo op het laatste kasblad?",
    waar: "T-rekening 570000 en " + (conso ? "het kasblad met de laatste datum van het jaar." : "kasblad " + info.laatsteKas + "."),
    zien: "Saldo debet = het saldo onderaan dat kasblad. Een kas kan nooit credit staan.",
    docs: conso ? null : [{ doc: doc(info.laatsteKas), titel: info.laatsteKas }],
    filterTip: "Filter in het T-paneel op 570000.",
  });
  voeg(catFIN, {
    id: "fin-580000",
    vraag: "Staat 580000 Interne overboekingen terug op nul?",
    waar: "T-rekening 580000.",
    zien: (conso ? "Elke storting en afhaling" : "Elke storting en afhaling (" + opsomming(info.interne) + ")") +
      " staat er twee keer: één keer debet en één keer credit, telkens hetzelfde bedrag. Het uittreksel en het kasblad van dezelfde verrichting heffen elkaar op.",
    filterTip: "Filter in het T-paneel op 580000.",
  });
  voeg(catFIN, {
    id: "fin-dagontvangsten",
    vraag: "Is elke dagontvangst volledig weggeboekt van 400000?",
    waar: "T-rekening 400000.",
    zien: conso
      ? "Het contante deel gaat eraf met het kasblad, het bancontact-deel met het uittreksel. Samen zijn ze precies het totaal van het dagontvangstenblad."
      : info.dagontvangsten.map(function (o) {
          return o.ontv + ": debet het totaal, credit " + opsomming(o.kas) + " (contant, kasblad) en " + opsomming(o.bank) + " (bancontact, uittreksel)";
        }).join("; ") + ". Samen moeten de twee credits precies het totaal van het dagontvangstenblad zijn.",
    filterTip: "Filter in het T-paneel op 400000.",
  });
  voeg(catFIN, {
    id: "fin-btw-betaald",
    vraag: "Staat 451900 R/C btw-administratie op nul nadat de btw betaald is?",
    waar: "T-rekening 451900.",
    zien: (conso ? "De betaling aan de btw-administratie" : "De betaling" + (info.btw.length > 1 ? "en " : " ") + opsomming([].concat.apply([], info.btw.map(function (b) { return b.betaling; })))) +
      " staat debet op 451900, met hetzelfde bedrag als het saldo van het btw-overzicht. Zo valt 451900 weg.",
    filterTip: "Filter in het T-paneel op 451900.",
  });
  voeg(catFIN, {
    id: "fin-lening",
    vraag: "Zijn de leningen juist geboekt: kapitaal op de schuld, intrest als kost?",
    waar: "T-rekeningen 173000, 423000 en 650000, met de aflossingstabel.",
    zien: (conso ? "" : (info.leningOpname.length ? "Opname " + opsomming(info.leningOpname) + ": credit op 173000. " : "") +
      (info.afbetalingen.length ? "Aflossingen " + opsomming(info.afbetalingen) + ": " : "")) +
      "per aflossing staat het kapitaal debet op de schuld en de intrest debet op 650000 Rente en kosten. Is de lening van dit jaar, dan daalt 173000; " +
      "is ze van een vorig jaar, dan daalt 423000 (daar staat sinds 31/12 het deel dat dit jaar vervalt).",
    filterTip: "Filter in het T-paneel op 173000, 423000 en daarna op 650000.",
  });
  voeg(catFIN, {
    id: "fin-klanten-open", relatieSoort: "klanten",
    vraag: "Is het totaal nog open bij je klanten gelijk aan het saldo van 400000?",
    waar: "Het overzicht hieronder (uit de pagina Klanten & leveranciers) en T-rekening 400000.",
    zien: "Totaal nog open = saldo debet van 400000. Punt op de pagina Klanten & leveranciers eerst alles af: elke ontvangst en creditnota hoort bij een factuur. Wat dan nog openstaat, zijn de facturen die nog niet betaald zijn.",
    filterTip: "Filter in het T-paneel op 400000.",
  });
  voeg(catFIN, {
    id: "fin-leveranciers-open", relatieSoort: "leveranciers",
    vraag: "Is het totaal nog open bij je leveranciers gelijk aan het saldo van 440000?",
    waar: "Het overzicht hieronder (uit de pagina Klanten & leveranciers) en T-rekening 440000.",
    zien: "Totaal nog open = saldo credit van 440000. Bij een betaling \"min creditnota\" punt je zowel de betaling als de creditnota af op de factuur.",
    filterTip: "Filter in het T-paneel op 440000.",
  });

  /* ---------------- Eindejaar ---------------- */
  var ej = info ? info.eindejaar : {};
  voeg(catEJ, {
    id: "ej-afschrijvingen",
    vraag: "Klopt de afschrijving van elk vast actief met de afschrijvingstabel?",
    waar: "T-rekeningen van rubriek 63 en de …9-rekeningen van klasse 2" + (conso ? ", met de afschrijvingstabel." : ", met " + ej.afschrijvingen + "."),
    zien: "Per soort vast actief staat de afschrijving van dit jaar credit op de rekening met hetzelfde nummer en een 9 achteraan (bv. 240000 Meubilair → 240009). " +
      "Het totaal staat debet op 630200 (rubriek 23) of 630300 (rubriek 24). Tel na: totaal rubriek 63 = totaal van de kolom afschrijving van dit jaar in de tabel.",
    docs: conso ? null : [{ doc: doc(ej.afschrijvingen), titel: ej.afschrijvingen }],
    filterTip: "Filter in het T-paneel op rubriek 63 en daarna op klasse 2.",
  });
  voeg(catEJ, {
    id: "ej-voorraad",
    vraag: "Is het saldo van 340000 Voorraad handelsgoederen gelijk aan de voorraad op de inventaris?",
    waar: "T-rekening 340000 en 609400" + (conso ? ", met de voorraadtelling." : ", met " + ej.voorraad + "."),
    zien: "Saldo 340000 = de voorraad op 31 december volgens de telling. Het verschil met de beginvoorraad staat op 609400: credit bij een stijging, debet bij een daling.",
    docs: conso ? null : [{ doc: doc(ej.voorraad), titel: ej.voorraad }],
    filterTip: "Filter in het T-paneel op rubriek 34 en daarna op 609400.",
  });
  voeg(catEJ, {
    id: "ej-lening",
    vraag: "Staat het deel van de leningen dat volgend jaar vervalt op 423000?",
    waar: "T-rekeningen 173000 en 423000, met de aflossingstabellen" + (conso ? "." : " bij " + ej.lening + "."),
    zien: "Tel in elke aflossingstabel het kapitaal van de termijnen van volgend jaar op: dat totaal staat credit op 423000. Op 173000 blijft enkel het kapitaal dat later dan volgend jaar vervalt.",
    filterTip: "Filter in het T-paneel op 173000 en daarna op 423000.",
  });

  return { lijst: lijst, perCategorie: perCat };
}
