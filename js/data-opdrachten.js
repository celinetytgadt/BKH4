// data-opdrachten.js
// Wat per boekjaar anders werkt, en de resultaatverwerking.
//
// De documenten zelf staan per jaar in js/data-jaren.js (gemaakt met
// hulpmiddelen/metwear/maak-app-data.py). Hier staat enkel wat je met de hand
// kiest: welk jaar ingediend wordt, waar zelfcontrole mogelijk is, de korte
// namen voor het tabblad Klas, de taken in Classroom.
//
// De variabelen hieronder (OPDRACHTEN, CATEGORIE_VOLGORDE …) vult app.js bij
// het kiezen van een boekjaar met de gegevens van dat jaar. Ze staan hier met
// "var" zodat de andere bestanden ze gewoon bij naam kunnen gebruiken.

var OPDRACHTEN = [];
var CATEGORIE_VOLGORDE = [];
var CATEGORIE_KOPPEN = {};
var CATEGORIE_KORT = {};
var CATEGORIE_RELATIES = "";
var RELATIES_BOVENAAN = true;
var CATEGORIE_BETALINGEN = [];

// Per soort jaar (zie "soort" in data-jaren.js):
//   indienen        de leerling dient in bij de vakexpert (Indienen bovenaan)
//   zelfcontrole    in het tabblad Beheer kan de sleutel in de app aangezet
//                   worden (enkel waar die sleutel in de app mag staan)
//   vooraf          alles staat al geboekt; enkel documenten en T-rekeningen
//   perCategorie    in Beheer per categorie zichtbaar te maken (anders per jaar)
//   taakPer         één Classroom-taak per categorie, of één voor het hele jaar
//   aanbevelen      de app duidt aan welke delen aanbevolen zijn per leerling
//   controles       false = geen controlepagina's en geen eindcontrole
//   opnieuwMaken    een juiste zelfcontrole gaat niet op slot: de leerling mag ze opnieuw maken
var JAAR_SOORTEN = {
  cursus:      { indienen: false, zelfcontrole: false, vooraf: true,  perCategorie: true,  taakPer: null },
  taak:        { indienen: true,  zelfcontrole: false, vooraf: false, perCategorie: true,  taakPer: "categorie" },
  conso:       { indienen: true,  zelfcontrole: false, vooraf: false, perCategorie: false, taakPer: "jaar" },
  extra:       { indienen: false, zelfcontrole: true,  vooraf: false, perCategorie: true,  taakPer: null, controles: false, opnieuwMaken: true },
  remediering: { indienen: false, zelfcontrole: true,  vooraf: false, perCategorie: true,  taakPer: null, aanbevelen: true },
};

// De taken (lessen) van aankopen en verkopen in de taak, het extra
// oefenmateriaal en de remediëring. Dezelfde namen staan in het indienvenster
// en horen ook zo in Classroom te staan. Ze komen uit js/data-jaren.js.
var TAKEN_AK_VK = [
  "Aankopen taak 1: eenvoudige facturen",
  "Aankopen taak 2: handelskorting & transportkosten",
  "Aankopen taak 3: diensten, diverse goederen & vaste activa",
  "Aankopen taak 4: creditnota's",
  "Verkopen taak 1: eenvoudige facturen",
  "Verkopen taak 2: handelskorting & extra kosten",
  "Verkopen taak 3: creditnota's",
  "Verkopen taak 4: terugstuurbare verpakking",
];

// De categorieën waarop zichtbaarheid en aanbeveling werken. "Eindejaar"
// opent ook de resultaatverwerking en de eindbalans van dat jaar. Elk jaar
// gebruikt enkel de categorieën die in zijn menu staan.
var ZICHTBAAR_CATEGORIEEN = TAKEN_AK_VK.concat(["Aankopen", "Verkopen", "Btw-verrekening", "Financiële verrichtingen", "Eindejaar"]);
var CATEGORIE_AFKORTING = {
  "Aankopen taak 1: eenvoudige facturen": "AK1",
  "Aankopen taak 2: handelskorting & transportkosten": "AK2",
  "Aankopen taak 3: diensten, diverse goederen & vaste activa": "AK3",
  "Aankopen taak 4: creditnota's": "AK4",
  "Verkopen taak 1: eenvoudige facturen": "VK1",
  "Verkopen taak 2: handelskorting & extra kosten": "VK2",
  "Verkopen taak 3: creditnota's": "VK3",
  "Verkopen taak 4: terugstuurbare verpakking": "VK4",
  "Beginbalans": "BB", "Aankopen": "AK", "Verkopen": "VK", "Btw-verrekening": "BTW",
  "Financiële verrichtingen": "FIN", "Eindejaar": "EJ", "Alle documenten": "DOC",
  "Resultaatverwerking": "RES", "Eindbalans": "EB",
};

// De resultaatverwerking. In deze case is er geen vennootschapsbelasting en
// geen toevoeging aan de reserves: de volledige winst gaat naar de
// overgedragen winst. Daarom is er maar één boeking (RESULTAAT).
var RESULTAAT_CONFIG = {
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
      uitleg: "MetWear houdt de volledige winst in het bedrijf: ze wordt overgedragen naar volgend jaar (693000 Over te dragen winst en 140000 Overgedragen winst). Er is geen vennootschapsbelasting en er gaat niets naar de reserves." },
  ],
};
