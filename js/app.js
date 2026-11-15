// app.js — Boekhoudapp 4e jaar (case MetWear, zes boekjaren)
// Alle logica van de app. Inhoud die per jaar wijzigt staat NIET hier, maar
// in js/data-jaren.js (de case), js/data-opdrachten.js, js/data-controles.js,
// js/data-balans.js, js/data-info.js, js/data-mar-indeling.js en js/mar.js.
//
// Elk boekjaar is een apart stuk werk met eigen T-rekeningen, controles,
// resultaatverwerking en eindbalans. "state" is altijd het werk van het
// gekozen jaar; "werk" bundelt alle jaren van één leerling (dat wordt bewaard).
//
// De app kent zelf geen enkel bedrag: alles wat een leerling ziet komt uit
// wat de leerling zelf intikt of uit de documentafbeeldingen.

(function () {
  "use strict";

  /* ========================================================================
     0. Kleine hulpfuncties
     ======================================================================== */

  function round2(x) {
    return Math.round((x + Number.EPSILON) * 100) / 100;
  }

  function som(lijst) {
    return round2(lijst.reduce(function (a, b) { return a + b; }, 0));
  }

  // Bedragveld: gewoon tekstveld, aanvaardt komma én punt (§9).
  function parseBedrag(input) {
    if (input === null || input === undefined) return null;
    var s = String(input).trim().replace(/\s/g, "");
    if (s === "") return null;
    var heeftKomma = s.indexOf(",") !== -1;
    var heeftPunt = s.indexOf(".") !== -1;
    if (heeftKomma && heeftPunt) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (heeftKomma && !heeftPunt) {
      s = s.replace(",", ".");
    } else if (!heeftKomma && heeftPunt) {
      var delen = s.split(".");
      if (delen.length > 2) {
        s = s.replace(/\./g, "");
      } else if (delen[1] && delen[1].length === 3) {
        // waarschijnlijk duizendtal, bv. "1.234"
        s = s.replace(/\./g, "");
      }
      // anders: punt blijft decimaalteken
    }
    var num = parseFloat(s);
    return isNaN(num) ? null : num;
  }

  // Bedragen zonder overbodige ",00": in deze bundel wordt met hele euro's
  // gewerkt, en "1.250,00" leest trager dan "1.250". Komt er toch een bedrag
  // met centen voor, dan worden de twee decimalen wél getoond — anders zou
  // er informatie verloren gaan.
  function formatBedrag(num) {
    if (num === null || num === undefined || isNaN(num)) return "";
    var heelGetal = Math.abs(num - Math.round(num)) < 0.005;
    var decimalen = heelGetal ? 0 : 2;
    try {
      return new Intl.NumberFormat("nl-BE", {
        minimumFractionDigits: decimalen,
        maximumFractionDigits: decimalen,
      }).format(heelGetal ? Math.round(num) : num);
    } catch (e) {
      return heelGetal ? String(Math.round(num)) : num.toFixed(2).replace(".", ",");
    }
  }

  function escapeAttr(str) {
    return String(str === undefined || str === null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function slug(str) {
    return String(str || "onbekend")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "onbekend";
  }

  function marBij(nrIets) {
    if (nrIets === undefined || nrIets === null || String(nrIets).trim() === "") return null;
    var n = parseInt(String(nrIets).trim(), 10);
    if (isNaN(n)) return null;
    var gevonden = null;
    for (var i = 0; i < MAR.length; i++) {
      if (MAR[i].nr === n) { gevonden = MAR[i]; break; }
    }
    return gevonden;
  }

  // De omschrijving van een rubriek uit js/data-mar-indeling.js, bv. "22" →
  // "Terreinen & gebouwen". Nodig voor de kaartjes van de eindbalans.
  function rubriekOms(rubriek) {
    for (var i = 0; i < MAR_INDELING.length; i++) {
      var rr = MAR_INDELING[i].rubrieken;
      for (var j = 0; j < rr.length; j++) {
        if (rr[j].rubriek === rubriek) return rr[j].oms;
      }
    }
    return "rubriek " + rubriek;
  }

  /* ========================================================================
     1. State: aanmaken, laden, bewaren
     ======================================================================== */

  /* Alle apps op celinetytgadt.github.io delen hetzelfde geheugen in de
     browser (localStorage). Daarom begint elke sleutel van deze app met haar
     eigen voorvoegsel (OPSLAG_APP in config-koppeling.js): anders leest ze de
     aanmelding, het werk en de feedback van de app van kern 8. */
  var APP_SLEUTEL = (typeof OPSLAG_APP !== "undefined" && OPSLAG_APP) ? OPSLAG_APP : "boekhoudapp";
  var LAATSTE_LEERLING_KEY = APP_SLEUTEL + "_laatste_leerling";
  var PREFIX_KEY = APP_SLEUTEL + "_vestiging";

  /* De code van de vestiging (LEU, SKW, TW) hoort mee in de bewaarsleutel:
     twee scholen kunnen een gelijknamige leerling hebben, en op een gedeelde
     computer mogen die niet in elkaars werk terechtkomen. koppeling.js zet
     deze prefix bij het aanmelden; zonder koppeling blijft ze leeg en
     verandert er niets. */
  var opslagPrefix = "";
  try { opslagPrefix = localStorage.getItem(PREFIX_KEY) || ""; } catch (e) { opslagPrefix = ""; }

  function storageKeyVoor(student) {
    return APP_SLEUTEL + "_data_" + (opslagPrefix ? opslagPrefix + "_" : "") + slug(student);
  }

  function maakLegeRij() {
    return { bedrag: "", redenering: "", apko: "", stijgtDaalt: "", klasse: "", rubriek: "", rekening: "", dc: "", relatie: "" };
  }

  function maakLegeState(student) {
    return {
      student: student || "",
      // Zelfcontrole met de sleutel (enkel 20X4 en 20X5, als ze aanstaat):
      // per verrichting { pogingen, ok, fouteRijen, ontbreekt }.
      zelfcontrole: {},
      boekingen: {},
      controles: {},
      // Categorieën waar een boeking gewijzigd is nadat de controles al
      // afgevinkt waren. De vinkjes blijven staan (alles opnieuw aanvinken
      // was te veel werk en leidde tot blind klikken); in plaats daarvan
      // vraagt de app op de controlepagina én bij het indienen of dat deel
      // opnieuw nagekeken is.
      controlesHerbekijken: {},
      resultaat: {
        stap: { opbrengsten: "", kosten: "", winst: "", belasting: "", restwinst: "" },
        slotcontroleResultaat: false,
        slotcontroleBalans: false,
        slotcontroleMelding: null,
      },
      eindbalans: {},
      // De twee open vragen op het tabblad Klanten & leveranciers. De app
      // controleert die niet: de antwoorden worden mee ingediend en door
      // de vakexpert nagekeken.
      relatieVragen: { klanten: "", leveranciers: "" },
      // Afpuntingen op het tabblad Klanten & leveranciers: de leerling
      // koppelt zelf een betaling of creditnota aan een factuur. Elke
      // koppeling is { van: "REF:rijnummer", naar: "REF:rijnummer" } —
      // van = de betaling/creditnota, naar = de factuur.
      afpuntingen: [],
    };
  }

  /* ---------- Alle jaren samen ----------
     werk = { student, gewijzigd, jaar, jaren: { "20X2": state, … }, zelfcontroleLog: [] }
     Het jaar waar de leerling in werkt, staat in werk.jaar. activeerJaar()
     zet de gegevens van dat jaar klaar (OPDRACHTEN, controles …) en maakt
     "state" het werk van dat jaar. */
  function maakLeegWerk(student) {
    return { student: student || "", versie: 2, jaar: "", jaren: {}, zelfcontroleLog: [] };
  }

  var werk = maakLeegWerk("");
  var huidigJaar = "";
  var state = maakLegeState("");
  var laatstBewaardOm = null;

  function normaliseerWerk(w, naam) {
    // Werk zonder "jaren" is van de vorige case (Fietsatelier Noor): niet bruikbaar.
    if (!w || typeof w !== "object" || !w.jaren) w = maakLeegWerk(naam);
    w.student = naam !== undefined ? naam : (w.student || "");
    w.versie = 2;
    if (!Array.isArray(w.zelfcontroleLog)) w.zelfcontroleLog = [];
    Object.keys(w.jaren).forEach(function (j) {
      if (!JAREN[j]) delete w.jaren[j];
    });
    return w;
  }

  function jaarSoort(jaar) {
    var J = JAREN[jaar || huidigJaar];
    return (J && JAAR_SOORTEN[J.soort]) || {};
  }

  /* ---------- Zichtbaarheid ----------
     Wat de vakexpert in het tabblad Beheer openzette, per vestiging:
       { "20X2": { open: true, cats: { Aankopen: true, … }, zelfcontrole: false }, … }
     Het komt uit de Sheet (instelling "zichtbaarheid") en wordt in de browser
     onthouden, zodat het menu er bij het openen meteen staat. Zonder
     koppeling (lokaal testen) staat alles open. */
  var ZICHTBAAR_KEY = APP_SLEUTEL + "_zichtbaar";

  function koppelingIngesteld() {
    return !!(window.KOPPELING_API && window.KOPPELING_API.ingesteld && window.KOPPELING_API.ingesteld());
  }

  function leesZichtbaarheid() {
    var ruw = window.INSTELLINGEN && window.INSTELLINGEN.zichtbaarheid;
    if (ruw !== undefined) {
      try { localStorage.setItem(ZICHTBAAR_KEY + "_" + opslagPrefix, String(ruw)); } catch (e) { /* geblokkeerd */ }
    } else {
      try { ruw = localStorage.getItem(ZICHTBAAR_KEY + "_" + opslagPrefix); } catch (e2) { ruw = null; }
    }
    if (!ruw) return {};
    try { var z = JSON.parse(ruw); return z && typeof z === "object" ? z : {}; } catch (e3) { return {}; }
  }

  function alleOpen() { return !koppelingIngesteld(); }

  function jaarZichtbaar(jaar) {
    if (alleOpen()) return true;
    var z = leesZichtbaarheid()[jaar];
    return !!(z && z.open);
  }

  function categorieZichtbaar(jaar, cat) {
    if (!jaarZichtbaar(jaar)) return false;
    if (cat === "Beginbalans" || alleOpen()) return true;
    if (!jaarSoort(jaar).perCategorie) return true;
    var z = leesZichtbaarheid()[jaar];
    if (cat === "Resultaatverwerking" || cat === "Eindbalans") cat = "Eindejaar";
    return !!(z && z.cats && z.cats[cat]);
  }

  /* Wat er per jaar extra open staat (tabblad Beheer). Zonder koppeling
     staat alles open, behalve de beginbalans in de T-rekeningen: die staat
     er standaard niet in, zodat de leerling enkel ziet wat er van hem is.
       saldibalans  de pagina Proef- en saldibalans
       relaties     de pagina Klanten & leveranciers (met de vragen en controles)
       bbInT        de beginbalans mee in de T-rekeningen */
  function jaarExtra(sleutel, jaar) {
    jaar = jaar || huidigJaar;
    if (!jaar) return false;
    if (alleOpen()) return sleutel !== "bbInT";
    var z = leesZichtbaarheid()[jaar];
    return !!(z && z[sleutel]);
  }
  function saldibalansZichtbaar() { return jaarExtra("saldibalans"); }
  function relatiesZichtbaar() { return jaarExtra("relaties"); }
  function beginbalansInT() { return jaarExtra("bbInT"); }

  function zelfcontroleAan(jaar) {
    jaar = jaar || huidigJaar;
    if (!jaarSoort(jaar).zelfcontrole) return false;
    if (typeof SLEUTEL_OEFEN === "undefined" || !SLEUTEL_OEFEN[jaar]) return false;
    if (alleOpen()) return true;
    var z = leesZichtbaarheid()[jaar];
    return !!(z && z.zelfcontrole);
  }

  function zichtbareJaren() {
    return Object.keys(JAREN).filter(jaarZichtbaar);
  }

  // Afsluiten (eindcontrole, resultaatverwerking, eindbalans) is er zodra de
  // eindejaarsverrichtingen open staan. In de cursus staat alles al geboekt.
  function afsluitenZichtbaar() {
    if (!huidigJaar || jaarSoort().vooraf) return false;
    return CATEGORIE_VOLGORDE.indexOf("Eindejaar") !== -1 || CATEGORIE_VOLGORDE.indexOf("Alle documenten") !== -1;
  }

  /* De gegevens van één boekjaar klaarzetten. Ook opnieuw te roepen als de
     zichtbaarheid verandert (de instellingen komen pas na enkele seconden
     binnen). */
  function activeerJaar(jaar) {
    var zichtbaar = zichtbareJaren();
    if (!jaar || zichtbaar.indexOf(jaar) === -1) jaar = zichtbaar.indexOf(werk.jaar) !== -1 ? werk.jaar : (zichtbaar[0] || "");
    huidigJaar = jaar;
    if (!jaar) {
      OPDRACHTEN = []; CATEGORIE_VOLGORDE = []; CATEGORIE_KORT = {};
      HANDMATIGE_CONTROLES = []; CATEGORIE_CONTROLES = {};
      state = normaliseerState(maakLegeState(werk.student), werk.student);
      return;
    }
    if (werk.jaar !== jaar) werk.jaar = jaar;
    var J = JAREN[jaar];
    var cats = J.categorieVolgorde.filter(function (c) { return categorieZichtbaar(jaar, c); });
    CATEGORIE_VOLGORDE = cats;
    // De beginbalans staat niet in het menu, maar ze is wel geboekt: ze hoort
    // in de saldibalans, de eindbalans en (als dat aanstaat) de T-rekeningen.
    OPDRACHTEN = J.opdrachten.filter(function (o) { return cats.indexOf(o.categorie) !== -1 || o.ref === "BB"; });
    CATEGORIE_RELATIES = !relatiesZichtbaar() ? ""
      : cats.indexOf("Alle documenten") !== -1 ? "Alle documenten" : "Financiële verrichtingen";
    CATEGORIE_KOPPEN = {};
    // Een tussentitel boven de taken van aankopen en van verkopen.
    var kopGezet = {};
    cats.forEach(function (c) {
      var m = /^(Aankopen|Verkopen) taak /.exec(c);
      if (m && !kopGezet[m[1]]) { CATEGORIE_KOPPEN[c] = m[1]; kopGezet[m[1]] = true; }
    });
    CATEGORIE_KORT = {};
    cats.concat(["Resultaatverwerking", "Eindbalans"]).forEach(function (c) {
      CATEGORIE_KORT[c] = J.kort + " " + (CATEGORIE_AFKORTING[c] || c);
    });
    var c = maakControles(J);
    HANDMATIGE_CONTROLES = c.lijst.filter(function (x) {
      if (x.relatieSoort && !relatiesZichtbaar()) return false;
      return cats.indexOf(x.categorie) !== -1;
    });
    CATEGORIE_CONTROLES = {};
    Object.keys(c.perCategorie).forEach(function (k) {
      if (cats.indexOf(k) !== -1) CATEGORIE_CONTROLES[k] = c.perCategorie[k];
    });
    if (jaarSoort(jaar).vooraf) { HANDMATIGE_CONTROLES = []; CATEGORIE_CONTROLES = {}; }
    state = normaliseerState(werk.jaren[jaar], werk.student);
    werk.jaren[jaar] = state;
  }

  function kiesJaar(jaar) {
    if (!JAREN[jaar] || jaar === huidigJaar) return;
    werk.jaar = jaar;
    activeerJaar(jaar);
    uiState.huidigePagina = { type: "start" };
    uiState.gekozenKaarten = [];
    uiState.afpuntSelectie = null;
    uiState.relatieKeuze = { klanten: "", leveranciers: "" };
    saveState();
    renderAlles();
  }

  // Vult ontbrekende onderdelen aan en zet oud werk om naar de huidige
  // structuur. Zo blijft werk van vorige week gewoon werken.
  function normaliseerState(s, naam) {
    if (!s || typeof s !== "object") s = maakLegeState(naam);
    s.student = naam !== undefined ? naam : (s.student || "");
    if (!s.boekingen) s.boekingen = {};
    if (!s.controles) s.controles = {};
    if (!s.zelfcontrole) s.zelfcontrole = {};
    if (!s.controlesHerbekijken) s.controlesHerbekijken = {};
    if (!s.eindbalans) s.eindbalans = {};
    if (!Array.isArray(s.afpuntingen)) s.afpuntingen = [];
    s.afpuntingen = s.afpuntingen.filter(function (k) {
      return k && typeof k.van === "string" && typeof k.naar === "string";
    });
    if (!s.resultaat) s.resultaat = maakLegeState("").resultaat;
    if (!s.resultaat.stap) s.resultaat.stap = maakLegeState("").resultaat.stap;
    // De open vragen op het tabblad Klanten & leveranciers. Werk van vóór
    // die vragen bestond, mag daar niet op stuklopen.
    if (!s.relatieVragen) s.relatieVragen = { klanten: "", leveranciers: "" };

    // De referentie van de beginbalans heette vroeger BEGINBALANS en is nu
    // BB (te breed in de T-rekeningen). Werk van vóór die wijziging mag
    // daardoor niet verloren gaan.
    if (s.boekingen.BEGINBALANS && !s.boekingen.BB) {
      s.boekingen.BB = s.boekingen.BEGINBALANS;
    }
    delete s.boekingen.BEGINBALANS;

    // De eindbalans werkte eerst met losse rekeningnummers en nu met
    // rubrieken. Oude sleutels (zes cijfers) zeggen niets meer en worden
    // opgeruimd, anders blijft er onzichtbaar rommel in het bewaarde werk.
    Object.keys(s.eindbalans).forEach(function (sleutel) {
      if (String(sleutel).length > 2) delete s.eindbalans[sleutel];
    });

    // Een relatie (klant/leverancier) hoort enkel bij 400000 en 440000.
    // Stond er ooit een naam bij een rij die intussen een ander
    // rekeningnummer kreeg, dan blijft die anders onzichtbaar meeslepen.
    Object.keys(s.boekingen).forEach(function (ref) {
      var b = s.boekingen[ref];
      if (!b || !b.rows) return;
      b.rows.forEach(function (row) {
        if (row.relatie && !relatieVeldVoorRekening(row.rekening)) row.relatie = "";
      });
    });

    zetVasteBoekingen(s);
    return s;
  }

  /* Opdrachten met "vasteBoeking: true" (de beginbalans) staan al geboekt
     klaar: dat zijn de cijfers van het vorige schooljaar. Ze worden hier
     telkens opnieuw uit js/data-beginstand.js gezet, zodat een leerling ze
     nooit kan wijzigen — ook niet door oud bewaard werk — en zodat een
     correctie in dat bestand meteen bij iedereen doorkomt. Enkel de naam van
     de klant of leverancier mag de leerling aanpassen, zoals bij een boeking
     die in orde bevonden is. */
  function isVasteBoeking(ref) {
    var J = JAREN[huidigJaar];
    return !!(J && J.vasteBoekingen && J.vasteBoekingen[ref]);
  }

  // Heeft de leerling zelf al iets ingevuld? De vaste beginboeking telt niet
  // mee: die staat er voor iedereen.
  function heeftEigenBoekingen(s) {
    return Object.keys(s.boekingen || {}).some(function (ref) { return !isVasteBoeking(ref); });
  }

  // Over alle jaren heen: heeft de leerling al iets zelf gedaan?
  function werkHeeftEigenBoekingen(w) {
    return Object.keys((w && w.jaren) || {}).some(function (j) {
      var J = JAREN[j];
      return Object.keys(w.jaren[j].boekingen || {}).some(function (ref) {
        return !(J && J.vasteBoekingen && J.vasteBoekingen[ref]);
      });
    });
  }

  // De vaste boekingen van het gekozen jaar: de beginbalans, en in de
  // cursus (20X1) alles. Ze komen telkens opnieuw uit js/data-jaren.js.
  function zetVasteBoekingen(s) {
    var J = JAREN[huidigJaar];
    if (!J || !J.vasteBoekingen) return;
    Object.keys(J.vasteBoekingen).forEach(function (ref) {
      var rows = J.vasteBoekingen[ref].map(function (r) {
        var rij = maakLegeRij();
        Object.keys(r).forEach(function (k) { rij[k] = r[k]; });
        return rij;
      });
      s.boekingen[ref] = { rows: rows, geboekt: true };
    });
  }

  function boekingVoor(ref) {
    if (!state.boekingen[ref]) {
      state.boekingen[ref] = { rows: [maakLegeRij()], geboekt: false };
    }
    return state.boekingen[ref];
  }

  function saveState() {
    if (!state.student) return;
    // Tijdstip van de laatste wijziging. De koppeling met Google Sheets
    // gebruikt dit om te zien welke versie de jongste is als een leerling
    // op twee computers gewerkt heeft.
    state.gewijzigd = new Date().toISOString();
    werk.gewijzigd = state.gewijzigd;
    if (huidigJaar) werk.jaren[huidigJaar] = state;
    try {
      localStorage.setItem(storageKeyVoor(state.student), JSON.stringify(werk));
      localStorage.setItem(LAATSTE_LEERLING_KEY, state.student);
      laatstBewaardOm = new Date();
    } catch (e) {
      console.error("Kon niet bewaren:", e);
    }
    // Laat koppeling.js weten dat er iets te versturen is. Ontbreekt dat
    // bestand (of is de koppeling uitgeschakeld), dan gebeurt er niets.
    if (window.KOPPELING_HOOKS && window.KOPPELING_HOOKS.naWijziging) {
      window.KOPPELING_HOOKS.naWijziging();
    }
    updateOpslaanStatus();
  }

  function laadStudent(naam) {
    var key = storageKeyVoor(naam);
    var opgeslagen = null;
    try {
      var ruw = localStorage.getItem(key);
      if (ruw) opgeslagen = JSON.parse(ruw);
    } catch (e) { console.error(e); }
    werk = normaliseerWerk(opgeslagen, naam);
    activeerJaar(werk.jaar);
  }

  /* Afmelden staat er enkel als er echt iemand aangemeld is (en Aanmelden
     dan net niet: dat regelt koppeling.js). Zolang koppeling.js nog niet
     geladen is, weten we het niet en blijft de knop weg. */
  function isAangemeld() {
    var h = window.KOPPELING_HOOKS;
    if (h && h.aangemeld) return h.aangemeld();
    var vest = typeof VESTIGINGEN !== "undefined" && Array.isArray(VESTIGINGEN) ? VESTIGINGEN : [];
    var metKoppeling = vest.some(function (v) { return v && v.webAppUrl; }) ||
      (typeof KOPPELING !== "undefined" && KOPPELING && !!KOPPELING.webAppUrl) ||
      (typeof WEB_APP_URL !== "undefined" && !!WEB_APP_URL);
    return metKoppeling ? false : !!state.student;
  }

  function updateOpslaanStatus() {
    var knop = document.getElementById("btn-afmelden");
    if (knop) knop.hidden = !isAangemeld();
    var el = document.getElementById("opslaan-status");
    if (!el) return;
    if (!state.student) {
      el.textContent = "niet bewaard — kies eerst je naam";
    } else if (laatstBewaardOm) {
      var u = laatstBewaardOm;
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      el.textContent = "bewaard om " + pad(u.getHours()) + ":" + pad(u.getMinutes());
    } else {
      el.textContent = "";
    }
  }

  /* ========================================================================
     2. Tijdelijke UI-state (niet bewaard)
     ======================================================================== */

  var uiState = {
    huidigePagina: { type: "start" },
    tpanelZoek: "",
    tpanelDetail: true,
    tpanelToonLeeg: false,     // standaard: enkel rekeningen met boekingen
    tpanelApko: "",
    tpanelKlasse: "",
    tpanelRubriek: "",
    relatieKeuze: { klanten: "", leveranciers: "" },
    gekozenKaarten: [],        // eindbalans: aangetikte rubrieken
    afpuntSelectie: null,      // klanten & leveranciers: aangetikte betaling/creditnota
    // Welke hulpdocumenten de leerling zelf open- of dichtklapte. De pagina
    // wordt bij elke toetsaanslag opnieuw opgebouwd; zonder dit zou een
    // ingeklapte tabel telkens terugspringen.
    openDocumenten: {},
    // Welke keuzelijst bij klant/leverancier openstaat (focus-id van het
    // naamveld), of null.
    relatieOpen: null,
  };
  var docImgTeller = 0;

  // MAR-zoekpopup (losstaand van de rest, zie §"Redeneerschema-component")
  var marModal = { open: false, scope: null, row: null, zoek: "", apko: "", klasse: "", rubriek: "" };

  /* ========================================================================
     3. Grootboek opbouwen uit alle geboekte boekingen
     ======================================================================== */

  // alleenRefs (optioneel): beperk het grootboek tot deze verrichtingen.
  // De invulbalans bij de beginbalans gebruikt dat, zodat die pagina altijd
  // de openingsbalans toont — ook nadat er al aankopen geboekt zijn.
  function berekenGrootboek(alleenRefs, zonderBB) {
    var gb = {};
    OPDRACHTEN.forEach(function (o) {
      if (alleenRefs && alleenRefs.indexOf(o.ref) === -1) return;
      if (zonderBB && o.ref === "BB") return;
      var b = state.boekingen[o.ref];
      if (!b || !b.geboekt) return;
      b.rows.forEach(function (row) {
        var bedrag = parseBedrag(row.bedrag);
        if (bedrag === null || !row.rekening || !row.dc) return;
        var mar = marBij(row.rekening);
        if (!mar) return;
        var nr = String(mar.nr);
        if (!gb[nr]) gb[nr] = { D: [], C: [] };
        gb[nr][row.dc].push({ bedrag: bedrag, ref: o.ref });
      });
    });
    return gb;
  }

  function saldoVoorEntry(entry) {
    var totalD = som(entry.D.map(function (e) { return e.bedrag; }));
    var totalC = som(entry.C.map(function (e) { return e.bedrag; }));
    var saldo = round2(totalD - totalC);
    var kant = null;
    if (Math.abs(saldo) > 0.005) kant = saldo > 0 ? "D" : "C";
    return { totalD: totalD, totalC: totalC, saldo: Math.abs(saldo), kant: kant };
  }

  // Wat ontbreekt er nog aan deze rij? Vroeger bleef de knop Boeken gewoon
  // grijs met een algemene boodschap, waardoor een half ingevulde rij (of een
  // rekeningnummer dat niet in het MAR bestaat) moeilijk terug te vinden was.
  //
  // Het stappenplan is verplicht: bedrag, A/P/K/O, + of −, klasse, rubriek,
  // rekeningnummer en D/C. Enkel de redenering mag leeg blijven. Een
  // ingetikt rekeningnummer moet passen bij de gekozen soort, klasse en
  // rubriek: zo blijft het stappenplan kloppen.
  function ontbreektInRij(row) {
    var mist = [];
    var bedrag = parseBedrag(row.bedrag);
    if (bedrag === null) mist.push("bedrag");
    else if (bedrag <= 0) mist.push("bedrag groter dan 0");
    if (!row.apko) mist.push("A/P/K/O");
    if (!row.stijgtDaalt) mist.push("+ of −");
    if (!row.klasse) mist.push("klasse");
    if (!row.rubriek) mist.push("rubriek");
    var mar = marBij(row.rekening);
    if (!row.rekening) mist.push("rekeningnummer");
    else if (!mar) mist.push("bestaand rekeningnummer (" + row.rekening + " staat niet in het MAR)");
    else if (row.rubriek && mar.rubriek !== row.rubriek) mist.push("rekening uit rubriek " + row.rubriek + " (" + row.rekening + " hoort bij rubriek " + mar.rubriek + ")");
    else if (row.apko && mar.apko !== row.apko) mist.push("rekening die een " + APKO_NAAM[row.apko] + " is (" + row.rekening + " is een " + APKO_NAAM[mar.apko] + ")");
    if (row.dc !== "D" && row.dc !== "C") mist.push("debet of credit");
    var soort = mar ? relatieVeldVoorRekening(row.rekening) : "";
    if (soort && !row.relatie) mist.push(soort === "klanten" ? "de klant" : "de leverancier");
    return mist;
  }

  var APKO_NAAM = { A: "actief", P: "passief", K: "kost", O: "opbrengst" };

  function rijLeeg(row) {
    return !row.bedrag && !row.redenering && !row.rekening && !row.dc && !row.apko && !row.stijgtDaalt && !row.klasse && !row.rubriek;
  }

  function rijGeldig(row) {
    return ontbreektInRij(row).length === 0;
  }

  function berekenTotalen(rows) {
    var totaalDebet = 0, totaalCredit = 0;
    rows.forEach(function (row) {
      var bedrag = parseBedrag(row.bedrag);
      if (bedrag === null) return;
      if (row.dc === "D") totaalDebet += bedrag;
      else if (row.dc === "C") totaalCredit += bedrag;
    });
    return { totaalDebet: round2(totaalDebet), totaalCredit: round2(totaalCredit) };
  }

  function boekingKlaarOmTeBoeken(rows) {
    if (!rows.length) return false;
    if (!rows.every(rijGeldig)) return false;
    var t = berekenTotalen(rows);
    return t.totaalDebet > 0 && Math.abs(t.totaalDebet - t.totaalCredit) < 0.005;
  }

  /* ========================================================================
     4. Controles (§7)
     ======================================================================== */

  // Aan welke kant hoort het saldo van deze rekening te staan?
  // Uitzonderingen (contrarekeningen zoals retours en handelskortingen) staan
  // in data-controles.js, zodat dit per bundel bij te sturen is.
  function verwachteKant(mar) {
    if (!mar) return null;
    var nr = String(mar.nr);
    if (typeof SALDO_GEEN_CONTROLE !== "undefined" && SALDO_GEEN_CONTROLE.indexOf(nr) !== -1) return null;
    if (typeof SALDO_UITZONDERINGEN !== "undefined" && SALDO_UITZONDERINGEN[nr]) return SALDO_UITZONDERINGEN[nr];
    var contraAfschrijving = /9$/.test(nr);
    if (mar.apko === "A") return contraAfschrijving ? "C" : "D";
    if (mar.apko === "P") return "C";
    if (mar.apko === "K") return "D";
    if (mar.apko === "O") return "C";
    return null;
  }

  // Welk document hoort bij een controle? Staat er niets vast in
  // CONTROLE_CONFIG, dan nemen we het laatste document van die soort uit
  // data-opdrachten.js — zo staat er nooit een verouderd afschrift.
  function laatsteDocumentMet(prefix) {
    var kandidaten = OPDRACHTEN.filter(function (o) {
      return o.doc && String(o.ref).indexOf(prefix) === 0;
    }).map(function (o) { return o.doc; });
    if (!kandidaten.length) return null;
    kandidaten.sort();
    return kandidaten[kandidaten.length - 1];
  }

  function documentVoorControle(c) {
    if (c.doc) return c.doc;
    if (!c.docConfig) return null;
    var vast = CONTROLE_CONFIG[c.docConfig];
    if (vast) {
      var opdracht = null;
      for (var i = 0; i < OPDRACHTEN.length; i++) {
        if (OPDRACHTEN[i].ref === vast) { opdracht = OPDRACHTEN[i]; break; }
      }
      return opdracht && opdracht.doc ? opdracht.doc : vast;
    }
    if (c.docConfig === "laatsteBankRef") return laatsteDocumentMet("BANK");
    if (c.docConfig === "laatsteKasRef") return laatsteDocumentMet("KAS");
    return null;
  }

  /* De controles staan per categorie. Een categorie krijgt een eigen
     controlepagina zodra er controles voor bestaan of zodra er iets extra's
     voor ingesteld is in CATEGORIE_CONTROLES (zoals de invulbalans bij de
     beginbalans). Zie de uitleg bovenaan data-controles.js. */

  function controlesVoorCategorie(cat) {
    return HANDMATIGE_CONTROLES.filter(function (c) { return c.categorie === cat; });
  }

  function categorieHeeftControle(cat) {
    return controlesVoorCategorie(cat).length > 0 || !!CATEGORIE_CONTROLES[cat];
  }

  // Controles die bij geen enkele bestaande categorie horen, belanden op de
  // eindcontrole. Zo gaat er nooit een controle verloren door een tikfout in
  // het veld "categorie".
  function losseControles() {
    return HANDMATIGE_CONTROLES.filter(function (c) {
      return CATEGORIE_VOLGORDE.indexOf(c.categorie) === -1;
    });
  }

  function controleStand(cat) {
    var lijst = controlesVoorCategorie(cat);
    var af = lijst.filter(function (c) { return !!state.controles[c.id]; }).length;
    return { totaal: lijst.length, af: af, ok: af === lijst.length };
  }

  // Voor het indienvenster: welke categorieën hebben nog openstaande
  // controles? koppeling.js gebruikt dit voor de bevestigingsstap.
  window.controleStandVoor = function (cat) { return controleStand(cat); };

  function categorieVanRef(ref) {
    for (var i = 0; i < OPDRACHTEN.length; i++) {
      if (OPDRACHTEN[i].ref === ref) return OPDRACHTEN[i].categorie;
    }
    return null;
  }

  /* Een boeking heropenen betekent niet dat alle vinkjes weg moeten. Wel dat
     de controles van díé categorie opnieuw bekeken horen te worden. Dat
     onthouden we hier; de melding volgt op de controlepagina en bij het
     indienen. Is er in die categorie nog niets afgevinkt, dan valt er ook
     niets te herbekijken. */
  function markeerControlesTeHerbekijken(cat) {
    if (!cat) return;
    var stand = controleStand(cat);
    if (!stand.totaal || !stand.af) return;
    state.controlesHerbekijken[cat] = true;
  }

  // koppeling.js gebruikt dit bij het indienen: eerst de melding, en na een
  // geslaagde inzending gaat de markering weer uit.
  window.controlesHerbekijkenVoor = function (cat) { return !!state.controlesHerbekijken[cat]; };
  window.controlesNagekeken = function (cat) {
    if (!state.controlesHerbekijken[cat]) return;
    delete state.controlesHerbekijken[cat];
    saveState();
    renderAlles();
  };

  function controleSaldoSoort() {
    var gb = berekenGrootboek();
    var fouten = [];
    Object.keys(gb).forEach(function (nr) {
      var mar = marBij(nr);
      if (!mar) return;
      var s = saldoVoorEntry(gb[nr]);
      if (!s.kant) return;
      var verwacht = verwachteKant(mar);
      if (verwacht && verwacht !== s.kant) {
        fouten.push({ nr: nr, naam: mar.naam, verwacht: verwacht, actueel: s.kant });
      }
    });
    return { ok: fouten.length === 0, fouten: fouten };
  }

  function controleHandmatigOk() {
    return HANDMATIGE_CONTROLES.every(function (c) { return !!state.controles[c.id]; });
  }

  function alleControlesOk() {
    return controleSaldoSoort().ok && controleHandmatigOk();
  }

  // Welke categorieën hebben nog controles openstaan? Wordt gebruikt om op
  // de eindcontrole en bij de resultaatverwerking te waarschuwen — nooit om
  // iets te blokkeren.
  function categorieenMetOpenControles() {
    return CATEGORIE_VOLGORDE.filter(function (cat) {
      var s = controleStand(cat);
      return s.totaal > 0 && !s.ok;
    });
  }

  /* ========================================================================
     5. Documentafbeelding (zoekt zelf .png / .jpg, §5)
     ======================================================================== */

  window.handleDocFout = function (img) {
    if (img.dataset.stap === "0") {
      img.dataset.stap = "1";
      img.src = "documenten/" + img.dataset.doc + ".jpg";
    } else {
      img.style.display = "none";
      var missing = document.getElementById(img.dataset.missingId);
      if (missing) missing.style.display = "block";
    }
  };

  /* Klikken op een document opent het schermvullend. Sluiten met een klik of Esc.
     De overlay wordt pas aangemaakt bij de eerste klik en daarna hergebruikt. */
  var docOverlay = null;

  function maakDocOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "document-overlay";
    overlay.innerHTML =
      '<img class="document-overlay-beeld" alt="">' +
      '<button type="button" class="document-overlay-sluiten" ' +
      'aria-label="Sluiten">&times;</button>';
    overlay.addEventListener("click", sluitDocOverlay);
    document.body.appendChild(overlay);
    return overlay;
  }

  function sluitDocOverlay() {
    if (docOverlay) docOverlay.classList.remove("open");
  }

  window.vergrootDoc = function (img) {
    if (img.style.display === "none") return;
    if (!docOverlay) docOverlay = maakDocOverlay();
    var groot = docOverlay.querySelector(".document-overlay-beeld");
    groot.src = img.src;
    groot.alt = img.alt;
    docOverlay.classList.add("open");
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") sluitDocOverlay();
  });

  function htmlDocumentAfbeelding(doc, klein) {
    if (!doc) return '<div class="document-ontbreekt">Geen document ingesteld voor deze controle.</div>';
    docImgTeller++;
    var missingId = "missing-" + slug(doc) + "-" + docImgTeller;
    var klasse = klein ? "document-klein" : "document-afbeelding";
    return (
      '<img class="' + klasse + '" src="documenten/' + escapeAttr(doc) + '.png" ' +
      'data-doc="' + escapeAttr(doc) + '" data-stap="0" data-missing-id="' + missingId + '" ' +
      'onerror="handleDocFout(this)" onclick="vergrootDoc(this)" ' +
      'title="Klik om het document schermvullend te openen" ' +
      'alt="Verantwoordingsstuk ' + escapeAttr(doc) + '">' +
      '<div class="document-ontbreekt" id="' + missingId + '" style="display:none">' +
      "Document niet gevonden: documenten/" + escapeAttr(doc) + ".png (of .jpg)</div>"
    );
  }

  /* ========================================================================
     5b. Uitlegballonnetjes (i-icoontje)
     ======================================================================== */

  function htmlInfoKnop(sleutel, titelTekst) {
    if (typeof INFO_TEKSTEN === "undefined" || !INFO_TEKSTEN[sleutel]) return "";
    return '<button type="button" class="btn-info" data-role="info" data-info="' + escapeAttr(sleutel) + '" ' +
      'title="' + escapeAttr(titelTekst || "Uitleg") + '" aria-label="Uitleg">i</button>';
  }

  function openInfoModal(sleutel) {
    var info = (typeof INFO_TEKSTEN !== "undefined") ? INFO_TEKSTEN[sleutel] : null;
    if (!info) return;
    document.getElementById("info-modal-titel").textContent = info.titel;
    var html = "";
    var inLijst = false;
    info.regels.forEach(function (r) {
      if (typeof r === "string") {
        if (inLijst) { html += "</ol>"; inLijst = false; }
        html += "<p>" + escapeAttr(r) + "</p>";
      } else if (r.kop) {
        if (inLijst) { html += "</ol>"; inLijst = false; }
        html += "<h3>" + escapeAttr(r.kop) + "</h3>";
      } else if (r.stap) {
        if (!inLijst) { html += "<ol>"; inLijst = true; }
        html += "<li>" + escapeAttr(r.stap) + "</li>";
      }
    });
    if (inLijst) html += "</ol>";
    document.getElementById("info-modal-inhoud").innerHTML = html;
    document.getElementById("info-modal-overlay").hidden = false;
  }

  function sluitInfoModal() {
    document.getElementById("info-modal-overlay").hidden = true;
  }

  /* ========================================================================
     6. Redeneerschema-component (herbruikt voor elke opdracht + de resultaatverwerking)
     ======================================================================== */

  function focusId(ref, rowIdx, veld) { return ref + "__r" + rowIdx + "__" + veld; }

  function relatieVeldVoorRekening(rekening) {
    var mar = marBij(rekening);
    if (!mar) return null;
    var nr = String(mar.nr);
    if (nr === "400000") return "klanten";
    if (nr === "440000") return "leveranciers";
    return null;
  }

  var ICOON_PRULLENBAK =
    '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h4V4a1 1 0 0 1 1-1zm1 2h4V5h-4zM7 7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7zm3 3a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"/>' +
    "</svg>";

  // De namen in de keuzelijst: alle klanten of alle leveranciers van de case
  // (js/data-jaren.js). Vrij intikken kan niet: zo schrijft iedereen een
  // naam op dezelfde manier en kloppen de overzichten.
  function relatieNamen(soort) {
    return ((typeof RELATIES !== "undefined" && RELATIES[soort]) || []).slice();
  }

  function htmlKeuze(veld, ref, idx, waarde, opties, uit, extraKlasse, titel) {
    return '<select class="' + (extraKlasse || "") + '" data-focus-id="' + focusId(ref, idx, veld) + '" data-scope="' + escapeAttr(ref) +
      '" data-row="' + idx + '" data-field="' + veld + '"' + (uit ? " disabled" : "") + (titel ? ' title="' + escapeAttr(titel) + '"' : "") + ">" +
      opties.map(function (o) {
        return '<option value="' + escapeAttr(o[0]) + '"' + (String(waarde) === String(o[0]) ? " selected" : "") + ">" + escapeAttr(o[1]) + "</option>";
      }).join("") + "</select>";
  }

  // Rekeningen die passen bij de keuzes links ervan (voor de keuzelijst
  // onder het rekeningveld).
  function rekeningenVoor(row) {
    if (!row.rubriek) return [];
    return MAR.filter(function (a) {
      return a.rubriek === row.rubriek && (!row.apko || a.apko === row.apko);
    });
  }

  // relatieBewerkbaar: de boeking is geboekt én in orde bevonden, maar de
  // naam van de klant of leverancier mag nog aangepast worden.
  function htmlRedeneerschemaRij(ref, row, idx, geboekt, relatieBewerkbaar, fout) {
    var mar = marBij(row.rekening);
    var omschrijving = mar ? mar.naam : (row.rekening ? "— dit nummer staat niet in het MAR —" : "");
    var relatieSoort = relatieVeldVoorRekening(row.rekening);
    var mist = geboekt ? [] : ontbreektInRij(row);
    var leeg = rijLeeg(row);
    var klassen = [];
    if (!geboekt && mist.length && !leeg) klassen.push("rij-onvolledig");
    if (fout) klassen.push("rij-zc-fout");
    var rijKlasse = klassen.length ? ' class="' + klassen.join(" ") + '"' : "";

    var relatieHtml = "";
    if (relatieSoort) {
      var actief = !(geboekt && !relatieBewerkbaar);
      var namen = relatieNamen(relatieSoort);
      if (row.relatie && namen.indexOf(row.relatie) === -1) namen.unshift(row.relatie);
      relatieHtml = '<div class="relatie-wrap">' +
        htmlKeuze("relatie", ref, idx, row.relatie,
          [["", relatieSoort === "klanten" ? "— kies de klant —" : "— kies de leverancier —"]].concat(namen.map(function (n) { return [n, n]; })),
          !actief, "relatie-select", "Bij wie hoort dit? Zo zie je later welke facturen nog openstaan.") +
        "</div>";
    }

    // Klasse, rubriek en rekening gaan in volgorde: pas na A/P/K/O kies je
    // een klasse, pas daarna een rubriek, pas daarna de rekening.
    var klasseOpties = [["", "—"]].concat(klassenMetRekeningen(row.apko).map(function (kl) {
      return [kl.klasse, kl.klasse + " · " + kl.oms];
    }));
    var rubriekOpties = [["", "—"]].concat(row.klasse ? rubriekenVoorKlasse(row.klasse, row.apko).map(function (r) {
      return [r.rubriek, r.rubriek + " · " + r.oms];
    }) : []);
    var dlId = "dl-" + slug(ref) + "-" + idx;
    var rekeningUit = geboekt || !row.rubriek;

    return (
      "<tr" + rijKlasse + ">" +
      '<td class="kol-bedrag"><input type="text" inputmode="decimal" placeholder="0" ' +
      'data-focus-id="' + focusId(ref, idx, "bedrag") + '" data-scope="' + escapeAttr(ref) + '" data-row="' + idx + '" data-field="bedrag" ' +
      'value="' + escapeAttr(row.bedrag) + '" ' + (geboekt ? "disabled" : "") + "></td>" +

      '<td class="kol-redenering"><input type="text" placeholder="wat gebeurt hier?" ' +
      'data-focus-id="' + focusId(ref, idx, "redenering") + '" data-scope="' + escapeAttr(ref) + '" data-row="' + idx + '" data-field="redenering" ' +
      'value="' + escapeAttr(row.redenering) + '" ' + (geboekt ? "disabled" : "") + "></td>" +

      '<td class="kol-apko">' + htmlKeuze("apko", ref, idx, row.apko,
        [["", "—"], ["A", "A"], ["P", "P"], ["K", "K"], ["O", "O"]], geboekt, "", "Actief, passief, kost of opbrengst?") + "</td>" +

      '<td class="kol-stijgtdaalt">' + htmlKeuze("stijgtDaalt", ref, idx, row.stijgtDaalt,
        [["", "—"], ["+", "+"], ["-", "−"]], geboekt, "", "Wordt het meer (+) of minder (−)?") + "</td>" +

      '<td class="kol-klasse">' + htmlKeuze("klasse", ref, idx, row.klasse, klasseOpties, geboekt || !row.apko, "",
        row.apko ? "Kies de klasse" : "Kies eerst A, P, K of O") + "</td>" +

      '<td class="kol-rubriek">' + htmlKeuze("rubriek", ref, idx, row.rubriek, rubriekOpties, geboekt || !row.klasse, "",
        row.klasse ? "Kies de rubriek" : "Kies eerst de klasse") + "</td>" +

      '<td class="kol-rekening"><div class="rekening-wrap"><input type="text" placeholder="' + (row.rubriek ? "nr…" : "—") + '" autocomplete="off" ' +
      'list="' + dlId + '" title="' + (row.rubriek ? "Kies of typ het rekeningnummer" : "Kies eerst de rubriek") + '" ' +
      'data-focus-id="' + focusId(ref, idx, "rekening") + '" data-scope="' + escapeAttr(ref) + '" data-row="' + idx + '" data-field="rekening" ' +
      'value="' + escapeAttr(row.rekening) + '" ' + (rekeningUit ? "disabled" : "") + ">" +
      (rekeningUit ? "" : '<datalist id="' + dlId + '">' + rekeningenVoor(row).map(function (a) {
        return '<option value="' + a.nr + '" label="' + escapeAttr(a.naam) + '">' + a.nr + " " + escapeAttr(a.naam) + "</option>";
      }).join("") + "</datalist>") +
      "</div></td>" +

      // De klant of leverancier staat onder de naam van de rekening: daar
      // is plaats genoeg voor een lange naam.
      '<td class="kol-omschrijving"><div class="omschrijving-veld' + (mar ? "" : (row.rekening ? " omschrijving-onbekend" : " omschrijving-leeg")) + '">' +
      (omschrijving ? escapeAttr(omschrijving) : "&nbsp;") + "</div>" + relatieHtml + "</td>" +

      '<td class="kol-dc">' + htmlKeuze("dc", ref, idx, row.dc, [["", "—"], ["D", "D"], ["C", "C"]], geboekt) + "</td>" +

      '<td class="kol-verwijder">' + (geboekt ? "" : '<button type="button" class="btn-verwijder-rij" data-scope="' + escapeAttr(ref) + '" data-row="' + idx + '" data-role="verwijder-rij" title="Deze lijn verwijderen" aria-label="Deze lijn verwijderen">' + ICOON_PRULLENBAK + "</button>") + "</td>" +
      "</tr>"
    );
  }

  function htmlRedeneerschema(ref) {
    var boeking = boekingVoor(ref);
    var geboekt = boeking.geboekt;
    var totalen = berekenTotalen(boeking.rows);
    var verschil = Math.abs(round2(totalen.totaalDebet - totalen.totaalCredit));
    var gelijk = verschil < 0.005 && totalen.totaalDebet > 0;
    var klaar = boekingKlaarOmTeBoeken(boeking.rows);
    var vast = isVasteBoeking(ref);
    // Een vaste boeking gedraagt zich als een boeking die in orde is: op
    // slot, enkel de naam van de klant of leverancier blijft aanpasbaar.
    var inOrde = vast || isInOrde(ref);
    var zc = zelfcontroleVoor(ref);
    var fouteRijen = (zc && !zc.ok && zc.pogingen >= 2 && zc.fouteRijen) ? zc.fouteRijen : [];

    var html = '<div class="redeneerschema-scroll"><table class="redeneerschema">' +
      "<colgroup>" +
      '<col class="c-bedrag"><col class="c-redenering"><col class="c-apko"><col class="c-stijgtdaalt">' +
      '<col class="c-klasse"><col class="c-rubriek">' +
      '<col class="c-rekening"><col class="c-omschrijving"><col class="c-dc"><col class="c-verwijder">' +
      "</colgroup>" +
      "<thead><tr>" +
      "<th>Bedrag</th>" +
      '<th title="Niet verplicht, wel een goede hulp">Redenering</th>' +
      '<th title="Actief, passief, kost of opbrengst">A/P/K/O</th>' +
      '<th title="Wordt het meer (+) of minder (−)?">+ / −</th>' +
      "<th>Klasse</th><th>Rubriek</th>" +
      "<th>Rekeningnr.</th><th>Omschrijving</th><th>D/C</th><th></th>" +
      "</tr></thead><tbody>";
    boeking.rows.forEach(function (row, idx) { html += htmlRedeneerschemaRij(ref, row, idx, geboekt, inOrde, fouteRijen.indexOf(idx) !== -1); });
    html += "</tbody></table></div>";

    html += '<div class="redeneerschema-acties">';
    html += "<div>" + (geboekt || inOrde ? "" : '<button type="button" class="btn-rij-toevoegen" data-scope="' + escapeAttr(ref) + '" data-role="rij-toevoegen">+ rij toevoegen</button>') + "</div>";
    html += '<div class="totalen">' +
      "<span>Totaal debet: <strong>" + formatBedrag(totalen.totaalDebet) + "</strong></span>" +
      "<span>Totaal credit: <strong>" + formatBedrag(totalen.totaalCredit) + "</strong></span>" +
      '<span class="' + (gelijk ? "balans-ok" : "balans-fout") + '">' + (gelijk ? "D = C ✓" : "D ≠ C") + "</span>" +
      (verschil > 0.005 ? '<span class="balans-fout">Verschil: ' + formatBedrag(verschil) + "</span>" : "") +
      "</div>";
    html += "</div>";

    html += '<div class="boeken-blok">';
    if (vast) {
      html += '<div class="boeking-vergrendeld">' +
        '<span class="status-in-orde">Staat al klaar ✓</span>' +
        "<p>Dit is de eindbalans van vorig jaar, alsof alle documenten van dat jaar geboekt zijn. De beginboeking is al voor je gemaakt en kan niet gewijzigd worden. " +
        "Bekijk ze goed: met deze bedragen start je in de T-rekeningen.</p>" +
        "<p class=\"vergrendeld-nota\">De klanten en leveranciers die op 1 januari nog moeten betalen of betaald worden, staan elk op een eigen lijn.</p>" +
        "</div>";
    } else if (zc && zc.ok) {
      html += '<div class="boeking-vergrendeld zc-ok">' +
        '<span class="status-in-orde">Klopt ✓</span>' +
        "<p>Je zelfcontrole klopt met de oplossing. Deze boeking staat nu op slot.</p>" +
        "</div>";
    } else if (inOrde) {
      // Goedgekeurd werk gaat op slot: het hoeft niet meer gewijzigd te
      // worden en het wordt ook niet meer meegestuurd bij een volgende
      // inzending, zodat de vakexpert niet telkens hetzelfde hernakijkt.
      // De naam van de klant of leverancier blijft wel aanpasbaar.
      html += '<div class="boeking-vergrendeld">' +
        '<span class="status-in-orde">In orde ✓</span>' +
        "<p>Deze boeking is nagekeken en in orde bevonden. Ze staat op slot en gaat niet meer mee als je opnieuw indient.</p>" +
        "<p class=\"vergrendeld-nota\">Merk je op het tabblad <em>Klanten &amp; leveranciers</em> dat je de verkeerde klant of leverancier koos? Die mag je hierboven nog aanpassen.</p>" +
        "</div>";
    } else if (geboekt) {
      html += '<span class="status-geboekt">Geboekt ✓</span> ';
      // Na een foute controle eerst heropenen en verbeteren: anders kon je
      // twee keer na elkaar klikken en meteen zien welke lijn fout is.
      if (zelfcontroleMogelijk(ref) && !(zc && zc.pogingen && !zc.ok && !zc.gewijzigd)) {
        html += '<button type="button" class="btn-zelfcontrole" data-scope="' + escapeAttr(ref) + '" data-role="zelfcontrole">Controleer mijn boeking</button> ';
      }
      html += '<button type="button" class="btn-heropenen" data-scope="' + escapeAttr(ref) + '" data-role="heropenen">Heropenen om te wijzigen</button>';
      html += htmlZelfcontroleMelding(ref, zc);
    } else {
      html += '<button type="button" class="btn-boeken' + (klaar ? " btn-boeken-klaar" : "") + '" data-scope="' + escapeAttr(ref) + '" data-role="boeken" ' + (klaar ? "" : "disabled") + ">Boeken</button>";
      // Alles ingevuld en debet = credit: enkel nog op Boeken drukken. Dat
      // vergeten leerlingen weleens, en dan telt de boeking nergens mee.
      if (klaar) {
        html += '<span class="boeken-herinnering">Klaar? Druk op <strong>Boeken</strong>: pas dan telt deze boeking mee in je T-rekeningen en kan je ze indienen.</span>';
      }
      // Een schema waar nog niets in staat, krijgt nog geen lijst met wat er
      // ontbreekt: die gele kaders vóór de leerling iets deed, zijn enkel
      // ruis (op een pagina met veel schema's onder elkaar zelfs veel ruis).
      var begonnen = boeking.rows.some(function (r) {
        return r.auto ? !!String(r.relatie || "").trim() : !rijLeeg(r);
      });
      if (!klaar && begonnen) {
        // Concreet zeggen wát er nog ontbreekt, per lijn. Anders blijft de
        // knop grijs zonder dat de leerling weet waarom.
        var punten = [];
        boeking.rows.forEach(function (row, idx) {
          if (rijLeeg(row)) {
            punten.push("Lijn " + (idx + 1) + " is nog helemaal leeg — vul ze in of verwijder ze met het prullenbakje.");
            return;
          }
          var mist = ontbreektInRij(row);
          if (mist.length) punten.push("Lijn " + (idx + 1) + ": nog geen " + mist.join(", ") + ".");
        });
        if (!gelijk && punten.length === 0) {
          punten.push("Totaal debet en totaal credit zijn niet gelijk.");
        } else if (!gelijk) {
          punten.push("En daarna: totaal debet en totaal credit moeten gelijk zijn.");
        }
        html += '<ul class="boeken-waarom">' + punten.map(function (p) { return "<li>" + escapeAttr(p) + "</li>"; }).join("") + "</ul>";
      }
      html += htmlZelfcontroleMelding(ref, zc);
    }
    html += "</div>";

    return html;
  }

  /* ---------- Zelfcontrole met de sleutel (20X4 en 20X5) ----------
     Enkel als de vakexpert ze aanzette in het tabblad Beheer, en enkel voor
     jaren waarvan de sleutel in de app staat (js/data-sleutel-oefen.js).
     1e keer fout: enkel "klopt nog niet". Vanaf de 2e keer: welke lijnen
     nog fout zijn. Elke poging gaat (met de foute rekeningen) mee naar de
     Sheet, voor het overzicht van de vakexpert. */
  function sleutelVoor(ref) {
    if (!zelfcontroleAan()) return null;
    return (SLEUTEL_OEFEN[huidigJaar] || {})[ref] || null;
  }

  function zelfcontroleMogelijk(ref) {
    return !!sleutelVoor(ref) && !isVasteBoeking(ref);
  }

  function zelfcontroleVoor(ref) {
    if (!zelfcontroleMogelijk(ref)) return null;
    return state.zelfcontrole[ref] || null;
  }

  function saldiVanRijen(rows) {
    var saldi = {};
    rows.forEach(function (row) {
      var b = parseBedrag(row.bedrag);
      var mar = marBij(row.rekening);
      if (b === null || !mar || (row.dc !== "D" && row.dc !== "C")) return;
      var nr = String(mar.nr);
      saldi[nr] = round2((saldi[nr] || 0) + (row.dc === "D" ? b : -b));
    });
    return saldi;
  }

  function voerZelfcontroleUit(ref) {
    var sleutel = sleutelVoor(ref);
    if (!sleutel) return;
    var boeking = boekingVoor(ref);
    var saldi = saldiVanRijen(boeking.rows);
    var fouteRek = {};
    Object.keys(saldi).forEach(function (nr) {
      if (Math.abs((sleutel[nr] || 0) - saldi[nr]) >= 0.005) fouteRek[nr] = true;
    });
    var ontbreekt = Object.keys(sleutel).filter(function (nr) {
      return Math.abs(sleutel[nr]) >= 0.005 && !(nr in saldi);
    });
    var fouteRijen = [];
    boeking.rows.forEach(function (row, idx) {
      var mar = marBij(row.rekening);
      if (!mar || fouteRek[String(mar.nr)]) fouteRijen.push(idx);
    });
    var ok = !fouteRijen.length && !ontbreekt.length;
    var zc = state.zelfcontrole[ref] || { pogingen: 0, ok: false };
    zc.pogingen++;
    zc.ok = ok;
    zc.gewijzigd = false;
    zc.fouteRijen = fouteRijen;
    zc.ontbreekt = ontbreekt.length > 0;
    state.zelfcontrole[ref] = zc;
    werk.zelfcontroleLog.push({
      tijd: new Date().toISOString(), jaar: huidigJaar, ref: ref, categorie: categorieVanRef(ref) || "Resultaatverwerking",
      poging: zc.pogingen, ok: ok,
      fout: Object.keys(fouteRek).concat(ontbreekt.map(function (nr) { return nr + " (ontbreekt)"; })).join(", "),
    });
  }

  function htmlZelfcontroleMelding(ref, zc) {
    if (!zc || zc.ok) return "";
    var html = '<div class="zc-melding">';
    if (zc.pogingen < 2) {
      html += "<p><strong>Klopt nog niet.</strong> Kijk je boeking nog eens rustig na: heropen ze, verbeter en controleer opnieuw. " +
        "Bij de volgende controle zie je welke lijnen nog fout zijn.</p>";
    } else {
      var lijnen = (zc.fouteRijen || []).map(function (i) { return "lijn " + (i + 1); });
      html += "<p><strong>Klopt nog niet.</strong> " +
        (lijnen.length ? "Nog fout: " + lijnen.join(", ") + " (in het rood). Kijk bij die lijnen naar de rekening, het bedrag en de kant (D/C). " : "") +
        (zc.ontbreekt ? "Er ontbreekt ook nog een lijn: een rekening die in deze boeking hoort, staat er nog niet in." : "") +
        "</p>";
    }
    html += "</div>";
    return html;
  }

  /* ========================================================================
     7. Pagina's
     ======================================================================== */

  /* ---------- Feedback van de vakexpert ----------
     Komt uit koppeling.js, die de feedback uit de Google Sheet haalt. Ze
     verschijnt pas nadat de vakexpert ze vrijgegeven heeft. Zonder koppeling
     bestaat window.feedbackVoor niet en blijft alles zoals het was.

     window.feedbackVoor(ref) geeft een lijst terug, nieuwste eerst: alle
     ronden die al vrijgegeven zijn. De oudste rondes blijven leesbaar, zodat
     de leerling ziet wat er al opgemerkt was. */

  var IN_ORDE = "In orde";

  function feedbackLijst(ref) {
    if (typeof window.feedbackVoor !== "function") return [];
    var lijst = window.feedbackVoor(ref);
    return Array.isArray(lijst) ? lijst : (lijst ? [lijst] : []);
  }

  function laatsteBeoordeling(ref) {
    var lijst = feedbackLijst(ref);
    return lijst.length ? String(lijst[0].beoordeling || "") : "";
  }

  // Een verrichting die in orde bevonden is, hoeft niet meer gewijzigd of
  // opnieuw ingediend te worden. Enkel de naam van de klant of leverancier
  // blijft aanpasbaar: die kijkt de vakexpert niet na, dat doet de leerling
  // zelf op het tabblad Klanten & leveranciers.
  function isInOrde(ref) {
    if (laatsteBeoordeling(ref) === IN_ORDE) return true;
    var zc = zelfcontroleVoor(ref);
    return !!(zc && zc.ok);
  }

  function beoordelingKlasse(beoordeling) {
    return String(beoordeling || "").toLowerCase()
      .replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "") || "algemeen";
  }

  function htmlFeedbackRonde(f, oud) {
    var html = '<div class="feedback-ronde' + (oud ? " oud" : "") + " feedback-" + beoordelingKlasse(f.beoordeling) + '">';
    html += '<div class="feedback-kop">';
    if (f.beoordeling) html += '<span class="feedback-oordeel">' + escapeAttr(f.beoordeling) + "</span>";
    if (f.ingediend) html += '<span class="feedback-datum">op je inzending van ' + escapeAttr(f.ingediend) + "</span>";
    html += "</div>";
    if (f.feedback) html += "<p>" + escapeAttr(f.feedback) + "</p>";
    html += "</div>";
    return html;
  }

  function htmlFeedbackBlok(ref) {
    var lijst = feedbackLijst(ref);
    if (!lijst.length) return "";

    var nieuwste = lijst[0];
    var ouder = lijst.slice(1);

    var html = '<div class="feedback-blok feedback-' + beoordelingKlasse(nieuwste.beoordeling) + '">';
    html += '<div class="feedback-titel"><strong>Feedback van je vakexpert</strong></div>';
    html += htmlFeedbackRonde(nieuwste, false);

    // Alle eerdere ronden staan er gewoon onder. Geen inklapknop meer: wat
    // weggeklikt staat, wordt niet gelezen. Lang worden die lijstjes niet —
    // een verrichting die "In orde" is, gaat op slot.
    if (ouder.length) {
      html += '<div class="feedback-historiek">' +
        '<div class="feedback-historiek-titel">Eerdere feedback (' + ouder.length + ")</div>" +
        ouder.map(function (f) { return htmlFeedbackRonde(f, true); }).join("") +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  function htmlBannerNaamOntbreekt() {
    if (state.student) return "";
    return '<div class="paneel" style="border-color:var(--kleur-fout);background:#ffece9;">' +
      "Vul bovenaan je naam in (voornaam, eventueel met eerste letter achternaam) — anders wordt je werk niet bewaard." +
      "</div>";
  }

  /* De tekst op de startpagina. Staat er een welkomsttekst in het tabblad
     Instellingen van de Sheet (de vakexpert zet ze daar via het
     beheertabblad), dan wint die. Anders de standaardtekst hieronder. */
  function renderStart() {
    var html = htmlBannerNaamOntbreekt();
    html += '<h1 class="pagina-titel">Boekhoudapp 4e jaar — MetWear</h1>';
    if (!huidigJaar) {
      html += '<div class="paneel paneel-tip"><p>Je vakexpert heeft nog geen boekjaar opengezet. Kom later terug, of vraag in de les welk deel je mag maken.</p></div>';
    } else {
      html += htmlJaarUitleg();
    }
    html += '<div class="paneel">' + welkomstHtml() + "</div>";
    return html;
  }

  // Wat de leerling in het gekozen boekjaar doet, in twee zinnen.
  function htmlJaarUitleg() {
    var J = JAREN[huidigJaar];
    var soort = jaarSoort();
    var tekst = {
      cursus: "Dit is het jaar van de cursus. Die boekingen maak je in de les op papier; hier staan ze al geboekt. Je ziet de documenten en de T-rekeningen, zodat je je eigen werk kan vergelijken.",
      taak: "Dit is je taak. Boek de documenten per categorie, doe de controle van die categorie en dien ze in bij je vakexpert.",
      conso: "Dit is een consolidatie: alle soorten documenten door elkaar, in de volgorde van de datum. Bepaal bij elk document eerst wat het is. Dien in als je klaar bent.",
      extra: "Extra oefenmateriaal: oefen zoveel je wil. Je dient dit niet in.",
      remediering: "Remediëring: oefen de delen die nog moeilijk gaan. Je dient dit niet in.",
    }[J.soort] || "";
    if (zelfcontroleAan()) {
      tekst += " Na het boeken kan je met <strong>Controleer mijn boeking</strong> nagaan of je boeking klopt.";
    }
    var html = '<div class="paneel paneel-tip"><h2>' + huidigJaar + " · " + escapeAttr(J.titel) + "</h2><p>" + tekst + "</p>";
    if (soort.aanbevelen) {
      var aanb = CATEGORIE_VOLGORDE.filter(isAanbevolen);
      if (aanb.length) html += "<p><strong>Aanbevolen voor jou:</strong> " + aanb.map(escapeAttr).join(", ") + ". Je vindt ze met een ★ in het menu.</p>";
    }
    html += "</div>";
    return html;
  }

  /* Aanbevolen delen van de remediëring. De lijst komt van de server (zie
     koppeling.js): wat de vakexpert per leerling aanduidde, plus de
     hoofdstukken waar de taak of de consolidatie nog niet in orde was. */
  function isAanbevolen(cat) {
    if (!jaarSoort().aanbevelen) return false;
    var lijst = window.AANBEVOLEN || [];
    return lijst.indexOf(cat) !== -1;
  }

  function welkomstHtml() {
    var eigen = window.INSTELLINGEN && window.INSTELLINGEN.welkomsttekst;
    if (eigen && String(eigen).trim()) return opmaakTekst(eigen);
    return STANDAARD_WELKOM;
  }

  var STANDAARD_WELKOM =
    "<p>Welkom. Hier boek je de verantwoordingsstukken in, met je T-rekeningen altijd naast je.</p>" +
    "<p>Kies links bovenaan het boekjaar en daarna een document. Vul het redeneerschema in, van links naar rechts: " +
    "bedrag, redenering, A/P/K/O, + of −, klasse, rubriek, rekeningnummer en debet of credit. Alles is verplicht behalve de redenering. " +
    "De keuzelijsten helpen je: kies je K, dan zie je enkel klasse 6; kies je een klasse, dan zie je enkel haar rubrieken.</p>" +
    "<p>Rechts staan altijd je T-rekeningen, zodat je die kan gebruiken terwijl je boekt. Boeken kan pas als debet en credit gelijk zijn.</p>" +
    "<p>De app zegt niet of iets inhoudelijk juist is — dat kijkt je vakexpert na. Ze controleert wel of debet en credit kloppen.</p>" +
    "<p>Bij elke categorie staat in het menu een <strong>Controle</strong>. Doe die vóór je indient: daar vind je zelf de meeste fouten terug.</p>" +
    "<p>Met <strong>Indienen</strong> bovenaan stuur je een categorie door naar je vakexpert. Dien daarna diezelfde taak ook in " +
    "in Classroom — anders krijg je er geen feedback op.</p>" +
    "<p>Overal waar je een <span class=\"btn-info btn-info-voorbeeld\">i</span> ziet staan, vind je uitleg over hoe dat onderdeel werkt.</p>" +
    "<p>Zodra je aangemeld bent, wordt je werk automatisch bewaard. Je kan dus gerust op een andere computer verder werken.</p>";

  /* Kleine opmaaktaal voor teksten die de vakexpert zelf intikt (de
     welkomsttekst, de mededeling). Alles wordt eerst ontdaan van HTML, zodat
     er nooit code uit de Sheet in de pagina belandt. Daarna:
       lege regel      -> nieuwe alinea
       [tekst](https://…) -> een link die in een nieuw venster opent
       **vet**         -> vet
     Meer is er niet, en meer is er ook niet nodig. */
  function opmaakTekst(ruw) {
    var veilig = escapeAttr(String(ruw || "")).replace(/\r\n?/g, "\n");
    var alineas = veilig.split(/\n{2,}/);
    return alineas.map(function (a) {
      var t = a.replace(/\n/g, "<br>");
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, function (_, tekst, url) {
        return '<a href="' + url + '" target="_blank" rel="noopener">' + tekst + "</a>";
      });
      t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return "<p>" + t + "</p>";
    }).join("");
  }

  /* Een korte mededeling van de vakexpert, bovenaan elke pagina. Leeg in het
     tabblad Instellingen = geen kader. */
  function htmlMededeling() {
    var t = window.INSTELLINGEN && window.INSTELLINGEN.mededeling;
    if (!t || !String(t).trim()) return "";
    return '<div class="mededeling">' + opmaakTekst(t) + "</div>";
  }

  function renderSaldibalans() {
    var gb = berekenGrootboek();
    var nrs = Object.keys(gb).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
    var html = '<h1 class="pagina-titel">Proef- en saldibalans</h1>';
    html += '<p class="pagina-subtitel">Alle rekeningen met bewegingen, met hun totaal debet, totaal credit en het saldo.</p>';
    html += '<div class="paneel">';
    if (!nrs.length) {
      html += "<p>Nog geen boekingen.</p>";
    } else {
      var totD = 0, totC = 0, totSD = 0, totSC = 0;
      html += '<table class="saldibalans"><thead><tr><th>Rekening</th><th>Naam</th><th>Totaal debet</th><th>Totaal credit</th><th>Saldo debet</th><th>Saldo credit</th></tr></thead><tbody>';
      nrs.forEach(function (nr) {
        var mar = marBij(nr);
        var s = saldoVoorEntry(gb[nr]);
        totD += s.totalD; totC += s.totalC;
        if (s.kant === "D") totSD += s.saldo;
        if (s.kant === "C") totSC += s.saldo;
        html += "<tr><td>" + nr + "</td><td>" + escapeAttr(mar ? mar.naam : "") + "</td>" +
          "<td>" + formatBedrag(s.totalD) + "</td><td>" + formatBedrag(s.totalC) + "</td>" +
          "<td>" + (s.kant === "D" ? formatBedrag(s.saldo) : "") + "</td>" +
          "<td>" + (s.kant === "C" ? formatBedrag(s.saldo) : "") + "</td></tr>";
      });
      html += "</tbody><tfoot><tr><td colspan='2'>Totaal</td><td>" + formatBedrag(round2(totD)) + "</td><td>" + formatBedrag(round2(totC)) +
        "</td><td>" + formatBedrag(round2(totSD)) + "</td><td>" + formatBedrag(round2(totSC)) + "</td></tr></tfoot>";
      html += "</table>";
    }
    html += "</div>";
    return html;
  }

  function renderOpdracht(ref) {
    var def = null;
    for (var i = 0; i < OPDRACHTEN.length; i++) { if (OPDRACHTEN[i].ref === ref) { def = OPDRACHTEN[i]; break; } }
    if (!def) return "<p>Opdracht niet gevonden.</p>";
    var html = htmlBannerNaamOntbreekt();
    html += '<h1 class="pagina-titel">' + escapeAttr(def.titel) + "</h1>";
    html += '<p class="pagina-subtitel">' + escapeAttr(def.categorie) + "</p>";
    html += htmlFeedbackBlok(ref);

    if (def.instructie) {
      html += '<div class="paneel" style="border-color:var(--kleur-primair);background:#e9eaf7;"><h2>Uitleg</h2><p>' + escapeAttr(def.instructie) + "</p></div>";
    }

    // Het redeneerschema staat boven het verantwoordingsstuk: dat is waar de
    // leerling aan het werk is. De documenten staan eronder, zodat er niet
    // elke keer langs een grote afbeelding gescrold moet worden.
    if (jaarSoort().vooraf && def.categorie !== "Beginbalans") {
      // De cursus: de boeking staat al in de T-rekeningen, maar het
      // redeneerschema blijft verborgen. Anders zou het overgenomen worden.
      html += '<div class="paneel paneel-tip"><p>Deze boeking maak je in de les, op papier. Ze staat al in je T-rekeningen (referentie <strong>' +
        escapeAttr(ref) + "</strong>): vergelijk daar je eigen oplossing.</p></div>";
    } else {
      html += '<div class="paneel"><h2>Redeneerschema ' + htmlInfoKnop("redeneerschema", "Hoe vul je dit in?") + "</h2>";
      // Een korte tip staat gewoon boven het schema, niet in een popup.
      if (def.tip) html += '<p class="opdracht-tip">' + escapeAttr(def.tip) + "</p>";
      html += htmlRedeneerschema(ref) + "</div>";
    }

    if (!def.geenDocument) {
      html += htmlUitklapbaarDocument("doc-" + ref, "Verantwoordingsstuk", def.doc, true);
    }
    hulpdocumenten(def).forEach(function (h, i) {
      html += htmlUitklapbaarDocument("hulp-" + ref + "-" + i, h.titel || "Hulpdocument", h.doc, true);
    });
    return html;
  }

  /* De hulpdocumenten bij een opdracht, altijd als lijst. Eén hulpdocument
     mag met "hulpdoc"/"hulpdocTitel"; meerdere met "hulpdocs". */
  function hulpdocumenten(def) {
    if (def.hulpdocs && def.hulpdocs.length) return def.hulpdocs;
    if (def.hulpdoc) return [{ doc: def.hulpdoc, titel: def.hulpdocTitel }];
    return [];
  }

  /* Een document in een inklapbaar paneel. Of het open of dicht staat, wordt
     onthouden in uiState: de pagina wordt bij elke toetsaanslag opnieuw
     opgebouwd, en zonder dat geheugen zou een ingeklapte tabel telkens
     terugspringen zodra de leerling iets intikt. */
  function htmlUitklapbaarDocument(sleutel, titel, doc, standaardOpen) {
    var bewaard = uiState.openDocumenten[sleutel];
    var open = bewaard === undefined ? !!standaardOpen : bewaard;
    return '<details class="paneel" data-doc-sleutel="' + escapeAttr(sleutel) + '"' + (open ? " open" : "") + ">" +
      '<summary class="hulpdoc-titel">' + escapeAttr(titel) + "</summary>" +
      htmlDocumentAfbeelding(doc, false) + "</details>";
  }

  /* ---------- Controles ----------
     De app toont hier bewust geen saldi: dan valt er niets meer na te kijken.
     Wat de leerling wél krijgt, is een filtertip om de juiste rekeningen
     zelf in het T-paneel terug te vinden. */

  // Compact tabelletje bij de zelfcontrole van 400000/440000: per relatie
  // het bedrag dat nog openstaat, met het totaal eronder.
  function htmlControleRelatieTabel(soort) {
    var isKlant = soort === "klanten";
    var perRelatie = boekingenPerRelatie(soort);
    var namen = Object.keys(perRelatie).sort();
    if (!namen.length) {
      return '<p class="controle-toelichting">Nog geen boekingen met een naam op ' +
        (isKlant ? "400000" : "440000") + " — vul de namen aan in je redeneerschema's.</p>";
    }
    var totaal = 0;
    var rijen = namen.map(function (naam) {
      var open = openBedragVoor(koppelFacturen(perRelatie[naam], isKlant));
      totaal = round2(totaal + open);
      return "<tr><td>" + escapeAttr(naam) + "</td><td>" + formatBedrag(open) + "</td></tr>";
    }).join("");
    return '<table class="relatie-overzicht controle-relatie-tabel"><thead><tr>' +
      "<th>" + (isKlant ? "Klant" : "Leverancier") + "</th><th>Nog open</th></tr></thead>" +
      "<tbody>" + rijen + "</tbody>" +
      "<tfoot><tr><td>Totaal nog open</td><td>" + formatBedrag(totaal) + "</td></tr></tfoot></table>";
  }

  // De T-rekening zoals ze moet staan na een taak (zonder beginbalans), bij
  // de controles van aankopen en verkopen. Altijd met de documentnummers.
  function htmlTVerwacht(t) {
    var mar = marBij(t.nr) || { nr: t.nr, naam: "", apko: "" };
    var entry = {
      D: (t.D || []).map(function (x) { return { ref: x[0], bedrag: x[1] }; }),
      C: (t.C || []).map(function (x) { return { ref: x[0], bedrag: x[1] }; }),
    };
    var detail = uiState.tpanelDetail;
    uiState.tpanelDetail = true;
    var html = htmlTrekBlok(String(t.nr), mar, entry).replace(' id="trek-' + t.nr + '"', "");
    uiState.tpanelDetail = detail;
    return '<div class="controle-t-verwacht">' + html + "</div>";
  }

  // Eén afvinkbare controle. Wordt zowel op de controlepagina van een
  // categorie als op de eindcontrole gebruikt.
  function htmlControleRij(c) {
    var doc = c.type === "check-met-document" ? documentVoorControle(c) : null;
    var html = '<div class="controle-rij' + (state.controles[c.id] ? " controle-af" : "") + '">';
    html += '<div class="controle-vraag">';
    html += '<label><input type="checkbox" data-role="controle-check" data-controle-id="' + escapeAttr(c.id) + '" ' + (state.controles[c.id] ? "checked" : "") + "> <span>" + escapeAttr(c.vraag) + "</span></label>";
    if (c.uitleg) html += " " + htmlInfoKnop(c.uitleg, "Meer uitleg");
    if (c.waar) html += '<p class="controle-waar"><strong>Waar kijk je?</strong> ' + escapeAttr(c.waar) + "</p>";
    if (c.zien) html += '<p class="controle-zien"><strong>Wat moet je zien?</strong> ' + escapeAttr(c.zien) + "</p>";
    if (c.toelichting) html += '<p class="controle-toelichting">' + escapeAttr(c.toelichting) + "</p>";
    if (c.filterTip) html += '<p class="controle-filtertip">' + escapeAttr(c.filterTip) + "</p>";
    // Zelfcontrole van de subadministratie: toon per klant/leverancier wat
    // er nog openstaat, zodat de leerling dat naast het saldo van
    // 400000/440000 in het T-paneel kan leggen zonder van scherm te
    // wisselen. Deze cijfers komen uit hun eigen boekingen.
    if (c.relatieSoort) html += htmlControleRelatieTabel(c.relatieSoort);
    if (c.tVerwacht) html += htmlTVerwacht(c.tVerwacht);
    html += "</div>";
    if (c.docs && c.docs.length) {
      html += '<div class="controle-docs">' + c.docs.map(function (d) {
        return '<div class="controle-doc"><div class="controle-doc-titel">' + escapeAttr(d.titel || d.doc) + "</div>" +
          htmlDocumentAfbeelding(d.doc, true) + "</div>";
      }).join("") + "</div>";
    } else if (doc) {
      html += "<div>" + htmlDocumentAfbeelding(doc, true) + "</div>";
    }
    html += "</div>";
    return html;
  }

  /* De controlepagina van één categorie. Ze staat in het menu onder de
     verrichtingen van die categorie, zodat er nagekeken kan worden vóór het
     indienen — en niet pas helemaal op het einde. */
  function renderCategorieControle(cat) {
    var extra = CATEGORIE_CONTROLES[cat] || {};
    var lijst = controlesVoorCategorie(cat);
    var stand = controleStand(cat);

    var html = '<h1 class="pagina-titel">Controle — ' + escapeAttr(cat) + "</h1>";
    html += '<p class="pagina-subtitel">Kijk dit na vóór je deze categorie indient. Niets is verplicht, maar wat je hier vindt, hoeft je vakexpert niet meer aan te wijzen.</p>';
    html += htmlFeedbackBlok("CONTROLE:" + cat);
    html += htmlBannerNaamOntbreekt();

    if (extra.inleiding) {
      html += '<div class="paneel paneel-tip"><p>' + escapeAttr(extra.inleiding) + "</p></div>";
    }

    // Er is hier iets gewijzigd nadat de controles afgevinkt waren. De
    // vinkjes blijven staan, maar dit blokje vraagt om ze nog eens na te
    // lopen — en dezelfde vraag komt terug bij het indienen.
    if (state.controlesHerbekijken[cat]) {
      html += '<div class="paneel paneel-herbekijken">' +
        "<p><strong>Je hebt een boeking van deze categorie heropend nadat je hier afvinkte.</strong> " +
        "Je vinkjes zijn blijven staan, maar loop ze nog eens na: klopt alles nog met je nieuwe boeking?</p>" +
        '<button type="button" class="btn-secundair" data-role="controles-nagekeken" data-cat="' +
        escapeAttr(cat) + '">Ik heb ze opnieuw nagekeken</button>' +
        "</div>";
    }

    // De invulbalans bij de beginbalans: dezelfde sleepoefening als op het
    // tabblad Eindbalans, maar met enkel de rubrieken uit die ene boeking.
    // De plaatsingen zijn gedeeld, dus dit werk telt straks gewoon mee.
    if (extra.invulbalansVoorRef) {
      html += renderEindbalans({
        delen: ["balans"],
        titel: "Leg je beginbalans",
        toonRegel: false,
        info: "eindbalans",
        alleenRefs: [extra.invulbalansVoorRef],
        hint: "Klik één of meer rubrieken aan en klik daarna op het vak waar ze thuishoren. Slepen mag ook. Enkel je openingsboeking telt hier mee, dus dit blijft je beginbalans tonen — ook later in het jaar.",
      });
    }

    if (lijst.length) {
      html += '<div class="paneel"><h2>Zelf nakijken en aanvinken</h2>';
      html += '<p class="paneel-hint">' + stand.af + " van de " + stand.totaal + " nagekeken.</p>";
      lijst.forEach(function (c) { html += htmlControleRij(c); });
      html += "</div>";
    }

    return html;
  }

  /* De eindcontrole. Bewust slank: alle afvinkvragen staan nu bij hun eigen
     categorie. Wat hier overblijft is de automatische saldocontrole, die pas
     zinvol is als alles geboekt is. */
  function renderControles() {
    var saldoC = controleSaldoSoort();
    var open = categorieenMetOpenControles();
    var los = losseControles();

    var html = '<h1 class="pagina-titel">Eindcontrole ' + htmlInfoKnop("controles", "Wat wordt hier gevraagd?") + "</h1>";
    html += '<p class="pagina-subtitel">Een laatste blik op het geheel, vóór je aan de resultaatverwerking begint.</p>';

    html += '<div class="paneel"><h2>Automatisch nagekeken</h2>';
    html += '<div class="controle-rij"><div class="controle-vraag">Heeft elke rekening het juiste soort saldo? (afschrijvingen op …009 credit, aanschafwaarden debet, retours en kortingen aan de omgekeerde kant van hun klasse)' +
      (saldoC.fouten.length ? "<ul class='controle-lijst-fouten'>" + saldoC.fouten.map(function (f) { return "<li>" + f.nr + " " + escapeAttr(f.naam) + " — verwacht " + f.verwacht + "-saldo, staat nu " + f.actueel + "</li>"; }).join("") + "</ul>" : "") +
      "</div><div class='controle-status-auto " + (saldoC.ok ? "ok" : "fout") + "'>" + (saldoC.ok ? "in orde" : "nog niet") + "</div></div>";
    html += "</div>";

    if (los.length) {
      html += '<div class="paneel"><h2>Zelf nakijken en aanvinken</h2>';
      los.forEach(function (c) { html += htmlControleRij(c); });
      html += "</div>";
    }

    if (open.length) {
      html += '<div class="paneel paneel-tip"><p>Er staan nog controles open bij ' +
        open.map(function (cat) {
          var s = controleStand(cat);
          return '<button type="button" class="link-knop" data-role="ga-naar-controle" data-cat="' + escapeAttr(cat) + '">' +
            escapeAttr(cat) + " (" + (s.totaal - s.af) + ")</button>";
        }).join(", ") + ".</p></div>";
    }

    return html;
  }

  /* ---------- Klanten & leveranciers ---------- */

  // Is dit verantwoordingsstuk een betaalstuk (bankafschrift, kasblad)? Dat
  // staat in CATEGORIE_BETALINGEN in data-opdrachten.js, niet in de code, en
  // wordt bewust niet afgeleid uit de rekeningen die de leerling koos: boekt
  // die een factuur rechtstreeks op de bank, dan blijft het document hier een
  // factuur en blijft de fout zichtbaar.
  function isBetaalstuk(opdracht) {
    // In een consolidatie staat alles door elkaar in één categorie. Daarom geldt eerst het
    // veld "betaalstuk" bij de opdracht zelf, en pas daarna de categorie.
    if (opdracht.betaalstuk !== undefined) return !!opdracht.betaalstuk;
    return typeof CATEGORIE_BETALINGEN !== "undefined" &&
      CATEGORIE_BETALINGEN.indexOf(opdracht.categorie) !== -1;
  }

  // Alle boekingen op 400000 / 440000, per relatie, in de volgorde waarin de
  // opdrachten in data-opdrachten.js staan. Zo kan een leerling factuur en
  // betaling naast elkaar leggen. Elke regel krijgt een vaste id
  // ("REF:rijnummer") waarmee de afpuntingen ze terugvinden.
  function boekingenPerRelatie(soort) {
    var nrDoel = soort === "klanten" ? "400000" : "440000";
    var perRelatie = {};
    OPDRACHTEN.forEach(function (o) {
      var b = state.boekingen[o.ref];
      if (!b || !b.geboekt) return;
      var betaalstuk = isBetaalstuk(o);
      b.rows.forEach(function (row, idx) {
        var mar = marBij(row.rekening);
        if (!mar || String(mar.nr) !== nrDoel) return;
        var bedrag = parseBedrag(row.bedrag);
        if (bedrag === null || !row.dc) return;
        var naam = (row.relatie || "").trim() || "— geen naam ingevuld —";
        if (!perRelatie[naam]) perRelatie[naam] = [];
        perRelatie[naam].push({ id: o.ref + ":" + idx, ref: o.ref, dc: row.dc, bedrag: bedrag, betaalstuk: betaalstuk });
      });
    });
    return perRelatie;
  }

  // Namen die op elkaar lijken (enkel verschil in hoofdletters, spaties of
  // leestekens) zijn bijna zeker tikfouten: "bloomwear " en "Bloomwear"
  // worden anders twee aparte relaties.
  function normaliseerNaam(n) {
    return String(n || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  // Bouwt het klantenrekening-/leveranciersrekeningbeeld van één relatie op.
  // Elke regel krijgt een soort:
  //   - normale kant (klant debet, leverancier credit) → FACTUUR, links;
  //   - tegenkant, van een betaalstuk (zie CATEGORIE_BETALINGEN in
  //     data-opdrachten.js) → BETALING;
  //   - tegenkant, van een ander document → CREDITNOTA.
  //
  // Het afpunten gebeurt NIET automatisch: de leerling koppelt zelf elke
  // betaling en creditnota aan de factuur waar ze bij hoort (klik de
  // betaling aan, klik dan de factuur). De koppelingen staan in
  // state.afpuntingen; het toegewezen bedrag rekent de app zelf uit als het
  // maximum dat op beide nog openstaat. Zo kan één betaling over meerdere
  // facturen gespreid worden door ze meermaals te koppelen.
  function koppelFacturen(regels, isKlant) {
    var factuurKant = isKlant ? "D" : "C";
    var facturen = [];
    var verminderingen = [];   // betalingen én creditnota's
    var perId = {};

    regels.forEach(function (r) {
      var item = { id: r.id, ref: r.ref, bedrag: r.bedrag, rest: r.bedrag };
      if (r.dc === factuurKant) {
        item.koppelingen = [];
        facturen.push(item);
      } else {
        item.soortItem = r.betaalstuk ? "betaling" : "creditnota";
        verminderingen.push(item);
      }
      perId[item.id] = item;
    });

    state.afpuntingen.forEach(function (k) {
      var van = perId[k.van];
      var naar = perId[k.naar];
      // Enkel koppelingen die binnen deze relatie vallen én de juiste kant
      // op gaan (vermindering → factuur). De rest hoort bij een andere
      // relatie of is ongeldig geworden en wordt gewoon overgeslagen.
      if (!van || !naar || !van.soortItem || !naar.koppelingen) return;
      var deel = round2(Math.min(van.rest, naar.rest));
      if (deel < 0) deel = 0;
      naar.koppelingen.push({ van: van, bedrag: deel, kVan: k.van, kNaar: k.naar });
      van.rest = round2(van.rest - deel);
      naar.rest = round2(naar.rest - deel);
    });

    return { facturen: facturen, verminderingen: verminderingen };
  }

  // Wat staat er bedragmatig nog open bij één relatie? Facturen min alle
  // betalingen en creditnota's — onafhankelijk van het afpunten, zodat dit
  // altijd overeenkomt met wat die relatie bijdraagt aan het saldo van
  // 400000/440000.
  function openBedragVoor(koppeling) {
    return round2(
      som(koppeling.facturen.map(function (f) { return f.bedrag; })) -
      som(koppeling.verminderingen.map(function (v) { return v.bedrag; }))
    );
  }

  // Detail van één relatie: de facturen in een tabel, met per factuur de
  // betalingen en creditnota's die de leerling er zelf aan koppelde.
  // Daaronder de nog af te punten betalingen/creditnota's als klikbare
  // knoppen. Geen loopsaldo per regel — enkel het totaal onderaan.
  function htmlRelatieDetail(naam, regels, isKlant) {
    var koppeling = koppelFacturen(regels, isKlant);
    var facturen = koppeling.facturen;
    var teKoppelen = koppeling.verminderingen.filter(function (v) { return v.rest > 0.005; });
    var totaalOpen = openBedragVoor(koppeling);

    var selectie = uiState.afpuntSelectie;
    var selectieHier = !!selectie && teKoppelen.some(function (v) { return v.id === selectie; });

    var html = '<p class="paneel-hint">Punt zelf af: klik onderaan een betaling of creditnota aan en klik daarna op de factuur waar ze bij hoort. ' +
      "Met het kruisje maak je een koppeling weer los.</p>";

    html += '<table class="relatie-detail' + (selectieHier ? " afpunt-actief" : "") + '"><thead><tr>' +
      "<th>Factuur</th><th>Bedrag</th><th>Afgepunt met</th><th>Nog open</th>" +
      "</tr></thead><tbody>";

    if (!facturen.length) {
      html += '<tr><td colspan="4" class="relatie-leeg">Er staat geen enkele factuur van ' + escapeAttr(naam) +
        " op deze rekening. Kijk na of je ze wel geboekt hebt.</td></tr>";
    }

    facturen.forEach(function (f) {
      var openRegel = f.rest > 0.005;
      var chips = f.koppelingen.map(function (kop) {
        var cn = kop.van.soortItem === "creditnota";
        return '<span class="afpunt-chip' + (cn ? " creditnota" : "") + '">' +
          escapeAttr(kop.van.ref) + " (" + formatBedrag(kop.bedrag) + ")" + (cn ? " cn" : "") +
          '<button type="button" class="afpunt-x" data-role="afpunt-verwijder" ' +
          'data-van="' + escapeAttr(kop.kVan) + '" data-naar="' + escapeAttr(kop.kNaar) + '" ' +
          'title="Koppeling losmaken" aria-label="Koppeling losmaken">×</button></span>';
      }).join(" ");
      if (!chips) chips = '<span class="relatie-niet-betaald">nog niet afgepunt</span>';

      html += '<tr class="' + (openRegel ? "factuur-open" : "factuur-vereffend") + (selectieHier ? " afpunt-doelbaar" : "") + '" ' +
        'data-role="afpunt-doel" data-item="' + escapeAttr(f.id) + '">' +
        "<td>" + escapeAttr(f.ref) + "</td>" +
        "<td>" + formatBedrag(f.bedrag) + "</td>" +
        '<td class="relatie-betaling">' + chips + "</td>" +
        "<td>" + (openRegel ? formatBedrag(f.rest) : '<span class="relatie-status betaald">vereffend</span>') + "</td></tr>";
    });

    // Geen totaal onder Bedrag: een opgetelde factuurkolom leest te makkelijk
    // als een openstaand saldo. Enkel wat er nog openstaat, met een label
    // ernaast zodat het cijfer niet los onderaan zweeft.
    html += "</tbody><tfoot><tr>" +
      '<td colspan="3">Totaal nog open</td>' +
      '<td class="' + (Math.abs(totaalOpen) < 0.005 ? "" : (totaalOpen > 0 ? "totaal-open" : "totaal-fout")) + '">' +
      (Math.abs(totaalOpen) < 0.005 ? formatBedrag(0) : formatBedrag(Math.abs(totaalOpen))) +
      "</td></tr></tfoot></table>";

    // De nog af te punten betalingen en creditnota's.
    if (teKoppelen.length) {
      html += '<div class="afpunt-bak"><div class="afpunt-bak-titel">Nog af te punten</div><div class="afpunt-bak-inhoud">' +
        teKoppelen.map(function (v) {
          var deels = v.rest < round2(v.bedrag) - 0.005;
          return '<button type="button" class="afpunt-item' + (v.id === selectie ? " gekozen" : "") + '" ' +
            'data-role="afpunt-bron" data-item="' + escapeAttr(v.id) + '">' +
            escapeAttr(v.ref) + " · " + (v.soortItem === "creditnota" ? "creditnota" : (isKlant ? "ontvangst" : "betaling")) + " · " +
            (deels ? "nog " + formatBedrag(v.rest) + " van " + formatBedrag(v.bedrag) : formatBedrag(v.rest)) +
            "</button>";
        }).join("") +
        "</div></div>";
    }

    // Conclusie onder de tabel.
    var openFacturen = facturen.filter(function (f) { return f.rest > 0.005; });
    if (teKoppelen.length && !openFacturen.length) {
      html += '<p class="relatie-conclusie verkeerd">' +
        (teKoppelen.length > 1 ? "Deze verrichtingen kunnen" : "Deze verrichting kan") + " nergens meer aan gekoppeld worden: " +
        teKoppelen.map(function (v) { return escapeAttr(v.ref) + " (" + formatBedrag(v.rest) + ")"; }).join(", ") +
        ". Er is meer " + (isKlant ? "ontvangen of gecrediteerd" : "betaald of gecrediteerd") +
        " dan er aan facturen geboekt is — kijk na of een factuur ontbreekt of te laag geboekt is.</p>";
    } else if (teKoppelen.length) {
      html += '<p class="relatie-conclusie openstaand">Nog niet alles is afgepunt. Koppel ' +
        teKoppelen.map(function (v) { return escapeAttr(v.ref); }).join(", ") +
        " aan de juiste factuur, of stel vast dat er iets niet klopt.</p>";
    } else if (openFacturen.length) {
      html += '<p class="relatie-conclusie openstaand">Er staat nog ' + formatBedrag(totaalOpen) + " open over " +
        openFacturen.length + (openFacturen.length === 1 ? " factuur." : " facturen.") +
        " Zou die al vereffend moeten zijn? Kijk dan je boekingen van die factuur nog eens na.</p>";
    } else if (facturen.length) {
      html += '<p class="relatie-conclusie betaald">Alle facturen van ' + escapeAttr(naam) + " zijn vereffend en afgepunt.</p>";
    }

    return html;
  }

  function htmlRelatieBlok(soort) {
    var isKlant = soort === "klanten";
    var nrDoel = isKlant ? "400000" : "440000";
    var titel = isKlant ? "Klanten — 400000 Handelsdebiteuren" : "Leveranciers — 440000 Leveranciers";
    var perRelatie = boekingenPerRelatie(soort);
    var namen = Object.keys(perRelatie).sort();
    var gekozen = uiState.relatieKeuze[soort];
    if (gekozen && namen.indexOf(gekozen) === -1) gekozen = "";

    var html = '<div class="paneel"><h2>' + escapeAttr(titel) + "</h2>";

    if (!namen.length) {
      html += "<p>Nog geen geboekte verrichtingen op " + nrDoel + ". Boek je een factuur of een betaling op deze rekening, vul dan in het redeneerschema ook de naam van de " +
        (isKlant ? "klant" : "leverancier") + " in — dan verschijnt hier het overzicht.</p></div>";
      return html;
    }

    // Overzichtstabel van alle relaties, met openstaand saldo. De kolom
    // Creditnota's verschijnt enkel als er in deze bundel creditnota's zijn.
    var perNaam = {};
    var ergensCreditnota = false;
    namen.forEach(function (naam) {
      var k = koppelFacturen(perRelatie[naam], isKlant);
      var facturen = som(k.facturen.map(function (f) { return f.bedrag; }));
      var creditnotas = som(k.verminderingen.filter(function (v) { return v.soortItem === "creditnota"; }).map(function (v) { return v.bedrag; }));
      var betalingen = som(k.verminderingen.filter(function (v) { return v.soortItem === "betaling"; }).map(function (v) { return v.bedrag; }));
      if (creditnotas > 0.005) ergensCreditnota = true;
      perNaam[naam] = {
        facturen: facturen,
        creditnotas: creditnotas,
        betalingen: betalingen,
        open: round2(facturen - creditnotas - betalingen),
        openRefs: k.facturen.filter(function (f) { return f.rest > 0.005; }).map(function (f) { return f.ref; }),
        // Hoeveel betalingen/creditnota's hangen er nog nergens aan vast?
        nietAfgepunt: k.verminderingen.filter(function (v) { return v.rest > 0.005; }).length,
      };
    });

    // Vermoedelijke tikfouten: twee namen die enkel in hoofdletters, spaties
    // of leestekens verschillen, zijn bijna zeker dezelfde relatie.
    var perNorm = {};
    var dubbels = [];
    namen.forEach(function (n) {
      var sleutel = normaliseerNaam(n);
      if (perNorm[sleutel]) dubbels.push([perNorm[sleutel], n]);
      else perNorm[sleutel] = n;
    });
    if (dubbels.length) {
      html += '<p class="relatie-conclusie verkeerd">Vermoedelijke tikfout: ' +
        dubbels.map(function (p) { return "„" + escapeAttr(p[0]) + "” en „" + escapeAttr(p[1]) + "”"; }).join(", ") +
        " lijken dezelfde " + (isKlant ? "klant" : "leverancier") +
        ". Maak de schrijfwijze gelijk in je boekingen, anders tellen ze apart.</p>";
    }

    html += '<table class="relatie-overzicht"><thead><tr><th>Naam</th><th>Facturen</th>' +
      (ergensCreditnota ? "<th>Creditnota's</th>" : "") +
      "<th>Betalingen</th><th>Openstaand</th><th>Status</th></tr></thead><tbody>";
    namen.forEach(function (naam) {
      var cijfers = perNaam[naam];
      var facturen = cijfers.facturen;
      var betalingen = cijfers.betalingen;
      var open = cijfers.open;
      var openRefs = open > 0.005 ? cijfers.openRefs : [];
      // Zolang niet alles afgepunt is, zegt de app niet of er nog iets
      // openstaat: dan zou ze het antwoord van de oefening weggeven. Eerst
      // zelf koppelen, daarna pas de conclusie.
      var status;
      if (cijfers.nietAfgepunt) {
        status = '<span class="relatie-status afpunten">nog ' + cijfers.nietAfgepunt +
          (cijfers.nietAfgepunt === 1 ? " af te punten" : " af te punten") + "</span>";
      } else if (Math.abs(open) < 0.005) {
        status = '<span class="relatie-status betaald">alles betaald</span>';
      } else if (open > 0) {
        status = '<span class="relatie-status openstaand">nog open' + (openRefs.length ? ": " + escapeAttr(openRefs.join(", ")) : "") + "</span>";
      } else {
        status = '<span class="relatie-status teveel">' + formatBedrag(Math.abs(open)) + " te veel " + (isKlant ? "ontvangen" : "betaald") + "</span>";
      }
      html += '<tr class="' + (naam === gekozen ? "relatie-gekozen" : "") + '">' +
        '<td><button type="button" class="link-knop" data-role="kies-relatie" data-soort="' + soort + '" data-naam="' + escapeAttr(naam) + '">' + escapeAttr(naam) + "</button></td>" +
        "<td>" + formatBedrag(facturen) + "</td>" +
        (ergensCreditnota ? "<td>" + (cijfers.creditnotas > 0.005 ? "− " + formatBedrag(cijfers.creditnotas) : "") + "</td>" : "") +
        "<td>" + formatBedrag(betalingen) + "</td>" +
        "<td>" + formatBedrag(Math.abs(open)) + "</td>" +
        "<td>" + status + "</td></tr>";
    });
    html += "</tbody></table>";

    // Keuzelijst + detail van één relatie
    html += '<div class="relatie-kiezer"><label for="relatie-select-' + soort + '">Toon in detail:</label>' +
      '<select id="relatie-select-' + soort + '" data-role="relatie-select" data-soort="' + soort + '">' +
      '<option value="">— kies een ' + (isKlant ? "klant" : "leverancier") + " —</option>" +
      namen.map(function (n) { return '<option value="' + escapeAttr(n) + '"' + (n === gekozen ? " selected" : "") + ">" + escapeAttr(n) + "</option>"; }).join("") +
      "</select></div>";

    if (gekozen) {
      html += htmlRelatieDetail(gekozen, perRelatie[gekozen], isKlant);
    }

    html += "</div>";
    return html;
  }

  function renderRelaties() {
    var html = '<h1 class="pagina-titel">Klanten &amp; leveranciers ' + htmlInfoKnop("klantenLeveranciers", "Hoe lees je dit?") + "</h1>";
    html += '<p class="pagina-subtitel">Wie moet er nog betalen, en wat staat er bij jou nog open?</p>';
    html += '<div class="paneel paneel-tip"><p>Dit overzicht is opgebouwd uit de namen die je zelf bij je boekingen op 400000 en 440000 invulde. Ontbreekt er een naam, ga dan terug naar die boeking en vul ze aan.</p></div>';
    html += htmlFeedbackBlok("RELATIES");
    html += htmlRelatieBlok("klanten");
    html += htmlRelatieBlok("leveranciers");
    html += htmlRelatieVragen();
    return html;
  }

  /* De twee open vragen die samen met dit tabblad ingediend worden. De app
     controleert er niets aan: het overzicht hierboven is een hulpmiddel, het
     antwoord is wat de vakexpert nakijkt. */
  function htmlRelatieVragen() {
    var inOrde = isInOrde("RELATIES");
    var html = '<div class="paneel relatie-vragen">';
    html += "<h2>Wat staat er nog open? " + htmlInfoKnop("klantenLeveranciers", "Hoe lees je dit?") + "</h2>";
    html += "<p>Beantwoord de twee vragen hieronder. Ze worden samen ingediend als <em>Klanten &amp; leveranciers</em>.</p>";

    [
      { veld: "klanten", vraag: "Welke facturen van welke klanten zijn nog openstaand?" },
      { veld: "leveranciers", vraag: "Welke facturen van welke leveranciers zijn nog openstaand?" },
    ].forEach(function (v) {
      html += '<label class="relatie-vraag">' +
        "<span>" + escapeAttr(v.vraag) + "</span>" +
        '<textarea rows="4" data-role="relatie-vraag" data-veld="' + v.veld + '" ' +
        'data-focus-id="relatievraag-' + v.veld + '" ' +
        'placeholder="bv. Snelpost bv — factuur VK07 van 4.506"' + (inOrde ? " disabled" : "") + ">" +
        escapeAttr(state.relatieVragen[v.veld] || "") + "</textarea></label>";
    });

    if (inOrde) html += '<p class="vergrendeld-nota">Deze vraag is nagekeken en in orde bevonden en staat nu op slot.</p>';
    html += "</div>";
    return html;
  }

  /* ---------- Eindbalans ---------- */

  // De kaartjes zijn RUBRIEKEN, niet losse rekeningen: anders wordt het een
  // lange lijst met veel klikwerk, en het is net de bedoeling dat ze leren
  // dat een rubriek als geheel op een bepaalde plaats van de balans komt.
  // Het saldo van een rubriek is het netto saldo van al die rekeningen —
  // bij rubriek 23 dus de aanschafwaarde min de geboekte afschrijvingen.
  function balansKaarten(alleenRefs) {
    var gb = berekenGrootboek(alleenRefs);
    var perRubriek = {};
    Object.keys(gb).forEach(function (nr) {
      var mar = marBij(nr);
      if (!mar) return;
      var s = saldoVoorEntry(gb[nr]);
      if (!s.kant) return;
      var r = mar.rubriek;
      if (!perRubriek[r]) perRubriek[r] = { netto: 0, rekeningen: [] };
      perRubriek[r].netto = round2(perRubriek[r].netto + (s.kant === "D" ? s.saldo : -s.saldo));
      perRubriek[r].rekeningen.push(nr + " " + mar.naam);
    });
    return Object.keys(perRubriek)
      .sort()
      .map(function (r) {
        var e = perRubriek[r];
        if (Math.abs(e.netto) < 0.005) return null;  // rubriek valt helemaal weg
        return {
          id: r,
          naam: rubriekOms(r),
          saldo: Math.abs(e.netto),
          kant: e.netto > 0 ? "D" : "C",
          rekeningen: e.rekeningen,
        };
      })
      .filter(Boolean);
  }

  function htmlKaart(kaart, geplaatst) {
    var gekozen = uiState.gekozenKaarten.indexOf(kaart.id) !== -1;
    // Een kaartje dat al op de balans ligt, is "afgewerkt": het wordt kleiner
    // en grijzer, zodat de vaknamen en de bedragen bovenaan blijven staan en
    // de balans leesbaar blijft.
    return '<div class="balans-kaart' + (geplaatst ? " geplaatst" : "") + (gekozen ? " gekozen" : "") + '" draggable="true" ' +
      'data-role="balans-kaart" data-kaart="' + escapeAttr(kaart.id) + '" ' +
      'title="' + escapeAttr("Rubriek " + kaart.id + " — " + kaart.rekeningen.join(", ")) + '">' +
      '<span class="kaart-nr">' + kaart.id + "</span>" +
      '<span class="kaart-naam">' + escapeAttr(kaart.naam) + "</span>" +
      '<span class="kaart-saldo">' + kaart.kant + " " + formatBedrag(kaart.saldo) + "</span>" +
      (geplaatst ? '<button type="button" class="kaart-terug" data-role="kaart-terug" data-kaart="' + escapeAttr(kaart.id) + '" title="Terug naar de lijst" aria-label="Terug naar de lijst">↩</button>' : "") +
      "</div>";
  }

  // Optelling van alles wat in één kolom (activa, passiva, kosten of
  // opbrengsten) gelegd is. Een kaartje dat aan de andere kant staat dan de
  // kolom, telt af — zo gaan de geboekte afschrijvingen van de vaste activa af.
  function kolomTotaal(kol, kaarten) {
    var t = 0;
    kaarten.forEach(function (k) {
      var vakId = state.eindbalans[k.id];
      if (!vakId) return;
      var hoortHier = kol.groepen.some(function (g) {
        return g.vakken.some(function (v) { return v.id === vakId; });
      });
      if (!hoortHier) return;
      t = round2(t + (k.kant === kol.kant ? k.saldo : -k.saldo));
    });
    return t;
  }

  // Welke boekingen horen bij de resultaatverwerking, en welke getallen
  // berekent de leerling vooraf? Dat verschilt per bundel en staat daarom in
  // RESULTAAT_CONFIG (data-opdrachten.js). Zonder die instelling: zoals in
  // kern 8, met vennootschapsbelasting.
  var RES = (typeof RESULTAAT_CONFIG !== "undefined" && RESULTAAT_CONFIG) || {
    refs: ["BELASTING", "RESULTAAT"],
    titel: "Resultaatverwerking — BELASTING + RESULTAAT",
    subtitel: "Bouw eerst de resultatenrekening op, bereken daarna de winst en de vennootschapsbelasting, en boek BELASTING en RESULTAAT.",
    stappen: [
      ["opbrengsten", "1. Hoeveel opbrengsten maakte het bedrijf? (klasse 7)"],
      ["kosten", "2. Hoeveel kosten maakte het bedrijf? (klasse 6)"],
      ["winst", "3. Bereken de winst"],
      ["belasting", "4. Bereken de vennootschapsbelasting (20 %)"],
      ["restwinst", "5. Hoeveel winst blijft er over?"],
    ],
    boekingen: [
      { ref: "BELASTING", titel: "BELASTING — Vennootschapsbelasting" },
      { ref: "RESULTAAT", titel: "RESULTAAT — Toewijzing van het resultaat",
        uitleg: "Het resultaat wordt, na eventuele allocatie aan de reserves, overgedragen naar volgend jaar. Bereken zelf of er nog reserves moeten toegewezen worden." },
    ],
  };
  var RES_NAMEN = RES.refs.join(" en ");

  function resultaatverwerkingGeboekt() {
    return RES.refs.every(function (r) {
      var b = state.boekingen[r];
      return !!(b && b.geboekt);
    });
  }

  // Is de eindbalans afgewerkt? Alle rubrieken geplaatst én de optelling
  // klopt. Welke optelling dat is, hangt ervan af of de resultaatverwerking
  // al geboekt is (zie htmlBalansEvenwichtsregel).
  function balansAf() {
    var kaarten = balansKaarten();
    if (!kaarten.length) return false;
    var alleGeplaatst = kaarten.every(function (k) { return !!state.eindbalans[k.id]; });
    if (!alleGeplaatst) return false;
    var b = BALANS_STRUCTUUR.balans.kolommen;
    var r = BALANS_STRUCTUUR.resultatenrekening.kolommen;
    var activa = kolomTotaal(b[0], kaarten);
    var passiva = kolomTotaal(b[1], kaarten);
    var kosten = kolomTotaal(r[0], kaarten);
    var opbrengsten = kolomTotaal(r[1], kaarten);
    if (resultaatverwerkingGeboekt()) {
      return Math.abs(activa - passiva) < 0.005 && Math.abs(kosten - opbrengsten) < 0.005;
    }
    return Math.abs(activa + kosten - passiva - opbrengsten) < 0.005;
  }

  function htmlBalansDeel(deelNaam, kaarten, toonEvenwicht) {
    var deel = BALANS_STRUCTUUR[deelNaam];
    var perVak = {};
    kaarten.forEach(function (k) {
      var vakId = state.eindbalans[k.id];
      if (!vakId) return;
      if (!perVak[vakId]) perVak[vakId] = [];
      perVak[vakId].push(k);
    });

    var html = '<div class="balans-deel"><h3 class="balans-deel-titel">' + escapeAttr(deel.titel) + "</h3>";
    html += '<div class="balans-kolommen">';
    deel.kolommen.forEach(function (kol) {
      var kolomHtml = "";
      kol.groepen.forEach(function (groep) {
        kolomHtml += '<div class="balans-groep"><div class="balans-groep-titel">' + escapeAttr(groep.titel) + "</div>";
        groep.vakken.forEach(function (vak) {
          var inhoud = perVak[vak.id] || [];
          var vakTotaal = 0;
          inhoud.forEach(function (k) {
            vakTotaal = round2(vakTotaal + (k.kant === kol.kant ? k.saldo : -k.saldo));
          });
          kolomHtml += '<div class="balans-vak' + (inhoud.length ? " gevuld" : "") + '" data-role="balans-vak" data-vak="' + escapeAttr(vak.id) + '">' +
            '<div class="balans-vak-kop">' +
            '<span class="balans-vak-naam">' + escapeAttr(vak.naam) + "</span>" +
            '<span class="balans-vak-totaal">' + (inhoud.length ? formatBedrag(vakTotaal) : "") + "</span>" +
            "</div>";
          kolomHtml += '<div class="balans-vak-inhoud">' +
            inhoud.map(function (k) { return htmlKaart(k, true); }).join("") +
            "</div></div>";
        });
        kolomHtml += "</div>";
      });
      html += '<div class="balans-kolom"><div class="balans-kolom-titel">' + escapeAttr(kol.titel) + "</div>" +
        kolomHtml +
        '<div class="balans-kolom-totaal">Totaal ' + escapeAttr(kol.titel.toLowerCase()) + ": <strong>" + formatBedrag(kolomTotaal(kol, kaarten)) + "</strong></div></div>";
    });
    html += "</div>";

    if (toonEvenwicht) {
      var t0 = kolomTotaal(deel.kolommen[0], kaarten);
      var t1 = kolomTotaal(deel.kolommen[1], kaarten);
      var inEvenwicht = Math.abs(t0 - t1) < 0.005 && t0 !== 0;
      html += '<div class="balans-evenwicht ' + (inEvenwicht ? "ok" : "nog-niet") + '">' +
        (inEvenwicht
          ? "In evenwicht: " + escapeAttr(deel.kolommen[0].titel.toLowerCase()) + " = " + escapeAttr(deel.kolommen[1].titel.toLowerCase()) + " = " + formatBedrag(t0)
          : "Verschil: " + formatBedrag(Math.abs(round2(t0 - t1)))) +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  // Twee verschillende controles, naargelang de resultaatverwerking al
  // geboekt is. Zolang de winst nog niet toegewezen is, kan de balans op
  // zichzelf niet kloppen — dan geldt activa + kosten = passiva + opbrengsten.
  function htmlBalansEvenwichtsregel(kaarten) {
    var klaar = resultaatverwerkingGeboekt();
    var balansKol = BALANS_STRUCTUUR.balans.kolommen;
    var resKol = BALANS_STRUCTUUR.resultatenrekening.kolommen;
    var activa = kolomTotaal(balansKol[0], kaarten);
    var passiva = kolomTotaal(balansKol[1], kaarten);
    var kosten = kolomTotaal(resKol[0], kaarten);
    var opbrengsten = kolomTotaal(resKol[1], kaarten);

    var uitleg, links, rechts, labelLinks, labelRechts;
    if (klaar) {
      uitleg = "Je hebt de resultaatverwerking geboekt: de winst staat al bij het overgedragen resultaat. " +
        "Nu moet totaal activa gelijk zijn aan totaal passiva, én totaal kosten aan totaal opbrengsten.";
      links = round2(activa - passiva);
      rechts = round2(kosten - opbrengsten);
      labelLinks = "activa − passiva";
      labelRechts = "kosten − opbrengsten";
    } else {
      uitleg = "Je hebt de resultaatverwerking (" + RES_NAMEN + ") nog niet geboekt, dus de winst zit nog in de resultatenrekening. " +
        "Zolang dat zo is, moet activa + kosten gelijk zijn aan passiva + opbrengsten.";
      links = round2(activa + kosten - passiva - opbrengsten);
      rechts = 0;
      labelLinks = "activa + kosten − passiva − opbrengsten";
      labelRechts = null;
    }

    var geplaatst = kaarten.filter(function (k) { return !!state.eindbalans[k.id]; }).length;
    var allesGeplaatst = geplaatst === kaarten.length && kaarten.length > 0;
    var klopt = allesGeplaatst && Math.abs(links) < 0.005 && Math.abs(rechts) < 0.005;

    // Bovenaan staat nooit een groene "het klopt"-boodschap: die hoort
    // onderaan, ná de slotcontrole. Hier staat enkel welke regel op dit
    // moment geldt en wat er nog te doen is.
    var html = '<div class="balans-regel ' + (klopt ? "neutraal" : "nog-niet") + '">';
    html += "<p>" + escapeAttr(uitleg) + "</p>";
    if (!allesGeplaatst) {
      html += "<p><strong>Nog " + (kaarten.length - geplaatst) + " van de " + kaarten.length + " rubrieken te plaatsen.</strong></p>";
    } else if (klopt) {
      html += "<p><strong>Alle rubrieken staan op een plaats. Kijk zelf na of de totalen kloppen en rond af met de slotcontrole onderaan.</strong></p>";
    } else {
      html += "<p><strong>Er zit nog een verschil van " + formatBedrag(Math.abs(links)) + " op " + escapeAttr(labelLinks) + ".</strong>";
      if (labelRechts && Math.abs(rechts) >= 0.005) {
        html += " En een verschil van " + formatBedrag(Math.abs(rechts)) + " op " + escapeAttr(labelRechts) + ".";
      }
      html += "</p>";
    }
    html += "</div>";
    return html;
  }

  // De sleepoefening. Ze wordt op twee tabbladen gebruikt en verschilt daar
  // enkel in wát er getoond wordt:
  //   opties.delen       welke delen van BALANS_STRUCTUUR er staan
  //                      (["resultatenrekening"] of ["balans","resultatenrekening"])
  //   opties.titel       de titel boven het paneel
  //   opties.toonRegel   de evenwichtsregel bovenaan tonen of niet
  // De plaatsingen zelf zitten in één en dezelfde state.eindbalans: legt de
  // leerling een rubriek op het ene tabblad, dan staat ze op het andere
  // meteen mee.
  function renderEindbalans(opties) {
    var o = opties || {};
    var delen = o.delen || ["balans", "resultatenrekening"];
    var titel = o.titel || "Eindbalans en resultatenrekening";
    var toonRegel = o.toonRegel !== false;
    var infoSleutel = o.info || "eindbalans";

    var kaarten = balansKaarten(o.alleenRefs);
    var teplaatsen = kaarten.filter(function (k) { return !state.eindbalans[k.id]; });
    var klaar = resultaatverwerkingGeboekt();

    var html = '<div class="paneel" id="paneel-eindbalans"><h2>' + escapeAttr(titel) + " " + htmlInfoKnop(infoSleutel, "Hoe werkt dit?") + "</h2>";
    if (!kaarten.length) {
      html += "<p>Zodra je boekingen hebt, verschijnen hier alle rubrieken met een saldo.</p></div>";
      return html;
    }

    if (toonRegel) html += htmlBalansEvenwichtsregel(kaarten);

    html += '<p class="paneel-hint">' + escapeAttr(o.hint ||
      "Klik één of meer rubrieken aan en klik daarna op het vak waar ze thuishoren. Slepen mag ook. Je krijgt álle rubrieken met een saldo te zien — kies zelf welke je hier nodig hebt.") + "</p>";

    html += '<div class="balans-voorraad" data-role="balans-vak" data-vak="">' +
      '<div class="balans-voorraad-titel">Nog te plaatsen (' + teplaatsen.length + " van " + kaarten.length + ")</div>" +
      '<div class="balans-voorraad-inhoud">' +
      (teplaatsen.length
        ? teplaatsen.map(function (k) { return htmlKaart(k, false); }).join("")
        : '<span class="balans-vak-leeg">Alle rubrieken hebben een plaats.</span>') +
      "</div></div>";

    delen.forEach(function (deelNaam) {
      html += htmlBalansDeel(deelNaam, kaarten, toonRegel && klaar);
    });

    html += '<div class="balans-acties"><button type="button" class="btn-secundair" data-role="balans-leegmaken">Alles terug naar de lijst</button></div>';
    html += "</div>";
    return html;
  }

  function renderResultaat() {
    var ok = alleControlesOk();
    var html = '<h1 class="pagina-titel">' + escapeAttr(RES.titel) + "</h1>";
    html += '<p class="pagina-subtitel">' + escapeAttr(RES.subtitel) + "</p>";
    html += htmlFeedbackBlok("RESULTAATVERWERKING");

    if (!ok) {
      var openCat = categorieenMetOpenControles();
      html += '<div class="paneel" style="border-color:var(--kleur-fout);background:#ffece9;">' +
        "<p>Oops, ben je zeker dat je hier al verder kunt? Zolang er controles nog niet nagekeken zijn, kan het zijn dat dit nog niet de juiste cijfers zijn.</p>" +
        (openCat.length
          ? "<p>Nog open bij " + openCat.map(function (cat) {
              return '<button type="button" class="link-knop" data-role="ga-naar-controle" data-cat="' + escapeAttr(cat) + '">' + escapeAttr(cat) + "</button>";
            }).join(", ") + ".</p>"
          : '<p>Kijk de <button type="button" class="link-knop" data-role="ga-naar" data-page-type="controles">eindcontrole</button> nog eens na.</p>') +
        "</div>";
    }

    html += htmlBannerNaamOntbreekt();

    // Enkel de resultatenrekening: die heeft de leerling nodig om de winst
    // te kunnen berekenen. De rubrieken van de balans blijven wel in de
    // lijst staan — de leerling kiest zelf wat hier nodig is.
    // Geen evenwichtscontrole: zolang de resultaatverwerking niet geboekt
    // is, hoort er logischerwijs een verschil te staan.
    html += renderEindbalans({
      delen: ["resultatenrekening"],
      titel: "Resultatenrekening opbouwen",
      toonRegel: false,
      info: "resultatenrekeningOpbouw",
    });

    html += '<div class="paneel"><h2>Stapsgewijze berekening</h2><p class="paneel-hint">De resultatenrekening hierboven beantwoordt de eerste 2 vragen als je de rubrieken juist hebt geordend. Reken de rest zelf uit.</p>';
    RES.stappen.forEach(function (s) {
      html += '<div class="stap-rij"><label for="stap-' + s[0] + '">' + s[1] + "</label>" +
        '<input type="text" id="stap-' + s[0] + '" inputmode="decimal" placeholder="0" data-focus-id="stap-' + s[0] + '" data-role="stap-veld" data-veld="' + s[0] + '" value="' + escapeAttr(state.resultaat.stap[s[0]]) + '"></div>';
    });
    html += "</div>";

    RES.boekingen.forEach(function (bk) {
      html += '<div class="paneel"><h2>' + escapeAttr(bk.titel) + " " + htmlInfoKnop("redeneerschema", "Hoe vul je dit in?") + "</h2>" +
        htmlFeedbackBlok(bk.ref) +
        (bk.uitleg ? '<p class="paneel-hint">' + escapeAttr(bk.uitleg) + "</p>" : "") +
        htmlRedeneerschema(bk.ref) + "</div>";
    });
    if (RES.hulpdoc) html += htmlUitklapbaarDocument("hulp-RESULTAAT", RES.hulpdoc.titel, RES.hulpdoc.doc, true);

    return html;
  }

  // Tabblad Eindbalans: de volledige sleepoefening (balans én
  // resultatenrekening) met daaronder de slotcontrole.
  function renderEindbalansPagina() {
    // Is er sinds de geslaagde slotcontrole iets gewijzigd (een boeking, een
    // kaartje op de balans …) waardoor ze niet meer klopt? Dan verdwijnen de
    // melding en de vinkjes weer. Klopt alles nog, dan blijven ze staan.
    if (state.resultaat.slotcontroleMelding && state.resultaat.slotcontroleMelding.type === "goed") {
      var g0 = berekenSlotcontroleGetallen();
      var nogOk = alleControlesOk() && balansAf() && g0.resD === g0.resC && g0.actD === g0.pasC;
      if (!nogOk) {
        state.resultaat.slotcontroleMelding = null;
        state.resultaat.slotcontroleResultaat = false;
        state.resultaat.slotcontroleBalans = false;
        saveState();
      }
    }

    var html = '<h1 class="pagina-titel">Eindbalans</h1>';
    html += '<p class="pagina-subtitel">Zet elke rubriek op de juiste plaats in de eindbalans en de resultatenrekening, en rond af met de slotcontrole.</p>';
    html += htmlFeedbackBlok("EINDBALANS");

    html += htmlBannerNaamOntbreekt();

    html += renderEindbalans();

    var getallen = berekenSlotcontroleGetallen();
    html += '<div class="paneel"><h2>Slotcontrole</h2><p class="paneel-hint">De app oordeelt hier niet — kijk zelf na of het klopt en bevestig het.</p>';

    // Na het boeken van de resultaatverwerking verandert de balans nog: de
    // winst verhuist naar het overgedragen resultaat. Ze moeten dus eerst
    // terug naar boven vóór ze hier kunnen afronden.
    if (resultaatverwerkingGeboekt() && !balansAf()) {
      html += '<div class="slotcontrole-terug">' +
        "<p><strong>Je hebt de resultaatverwerking geboekt. Werk nu eerst de eindbalans en de resultatenrekening bovenaan af.</strong></p>" +
        "<p>Door " + RES_NAMEN + " verschuift de winst naar het overgedragen resultaat, dus de bedragen op je balans zijn veranderd. Pas als activa gelijk is aan passiva én kosten aan opbrengsten, kan je hier afronden.</p>" +
        '<button type="button" class="btn-secundair" data-role="naar-eindbalans">Naar de eindbalans</button>' +
        "</div>";
    }

    html += '<div class="slotcontrole-blok">' +
      '<div class="slotcontrole-vraag"><label><input type="checkbox" data-role="slot-check" data-veld="slotcontroleResultaat" ' + (state.resultaat.slotcontroleResultaat ? "checked" : "") + "> Is de resultatenrekening in evenwicht?</label></div>" +
      '<div class="slotcontrole-detail">Totaal klasse 6: ' + formatBedrag(getallen.resD) + "</div>" +
      '<div class="slotcontrole-detail">Totaal klasse 7: ' + formatBedrag(getallen.resC) + "</div>" +
      "</div>";
    html += '<div class="slotcontrole-blok">' +
      '<div class="slotcontrole-vraag"><label><input type="checkbox" data-role="slot-check" data-veld="slotcontroleBalans" ' + (state.resultaat.slotcontroleBalans ? "checked" : "") + "> Is de balans in evenwicht?</label></div>" +
      '<div class="slotcontrole-detail">Totaal activa: ' + formatBedrag(getallen.actD) + "</div>" +
      '<div class="slotcontrole-detail">Totaal passiva: ' + formatBedrag(getallen.pasC) + "</div>" +
      "</div>";
    if (state.resultaat.slotcontroleMelding) {
      var melding = state.resultaat.slotcontroleMelding;
      html += '<div class="slotcontrole-melding ' + (melding.type === "goed" ? "goed" : "fout") + '">' + melding.tekst + "</div>";
    }
    html += "</div>";

    return html;
  }

  function berekenSlotcontroleGetallen() {
    var gb = berekenGrootboek();
    var resD = 0, resC = 0, actD = 0, pasC = 0;
    Object.keys(gb).forEach(function (nr) {
      var mar = marBij(nr);
      if (!mar) return;
      var s = saldoVoorEntry(gb[nr]);
      if (mar.klasse === "6" || mar.klasse === "7") { resD += s.totalD; resC += s.totalC; }
      if (mar.apko === "A") { if (s.kant === "D") actD += s.saldo; else if (s.kant === "C") pasC += s.saldo; }
      if (mar.apko === "P") { if (s.kant === "C") pasC += s.saldo; else if (s.kant === "D") actD += s.saldo; }
    });
    return { resD: round2(resD), resC: round2(resC), actD: round2(actD), pasC: round2(pasC) };
  }

  /* ========================================================================
     8. T-panel
     ======================================================================== */

  function htmlTrekBlok(nr, mar, entry) {
    var s = saldoVoorEntry(entry);
    var detail = uiState.tpanelDetail;
    var heeftBoekingen = entry.D.length > 0 || entry.C.length > 0;
    var debetInhoud = "";
    var creditInhoud = "";

    if (detail) {
      entry.D.forEach(function (e) { debetInhoud += '<div class="trek-regel"><span class="ref">' + e.ref + "</span><span>" + formatBedrag(e.bedrag) + "</span></div>"; });
      entry.C.forEach(function (e) { creditInhoud += '<div class="trek-regel"><span class="ref">' + e.ref + "</span><span>" + formatBedrag(e.bedrag) + "</span></div>"; });
    } else {
      if (s.totalD > 0) debetInhoud += '<div class="trek-regel"><span>totaal</span><span>' + formatBedrag(s.totalD) + "</span></div>";
      if (s.totalC > 0) creditInhoud += '<div class="trek-regel"><span>totaal</span><span>' + formatBedrag(s.totalC) + "</span></div>";
    }

    if (s.kant === "D") {
      debetInhoud += '<div class="trek-regel trek-saldo-rij"><span>D-saldo</span><span>' + formatBedrag(s.saldo) + "</span></div>";
    } else if (s.kant === "C") {
      creditInhoud += '<div class="trek-regel trek-saldo-rij"><span>C-saldo</span><span>' + formatBedrag(s.saldo) + "</span></div>";
    } else if (heeftBoekingen) {
      // Debet en credit heffen elkaar precies op. Vroeger stond er dan
      // helemaal geen saldo, wat verwarrend was ("ben ik iets vergeten?").
      // Nu tonen we een nulsaldo aan de kant waar deze rekening normaal
      // staat — bv. 400000 een D-saldo van 0, 440000 een C-saldo van 0.
      var kant = verwachteKant(mar) || (mar.apko === "P" || mar.apko === "O" ? "C" : "D");
      var nulRegel = '<div class="trek-regel trek-saldo-rij trek-saldo-nul"><span>' + kant + "-saldo</span><span>0</span></div>";
      if (kant === "D") debetInhoud += nulRegel; else creditInhoud += nulRegel;
    }

    if (!debetInhoud) debetInhoud = '<div class="trek-leeg">—</div>';
    if (!creditInhoud) creditInhoud = '<div class="trek-leeg">—</div>';

    return '<div class="trek-blok' + (heeftBoekingen ? "" : " trek-blok-leeg") + '" id="trek-' + nr + '">' +
      '<div class="trek-titel"><span>' + nr + " " + escapeAttr(mar.naam) + "</span></div>" +
      '<div class="trek-body"><div class="trek-kant debet">' + debetInhoud + '</div><div class="trek-kant credit">' + creditInhoud + "</div></div></div>";
  }

  // Suggesties voor het relatieveld (klant/leverancier): het optionele
  // startlijstje uit data-relaties.js, aangevuld met namen die de leerling
  // zelf al eerder intikte bij andere boekingen op dezelfde rekening.
  // zonderRef/zonderIdx (optioneel): sla die ene lijn over — de naam die daar
  // net getypt wordt, hoort zelf niet in de keuzelijst.


  /* ========================================================================
     8b. Filters op klasse en rubriek (T-paneel + zoekscherm)
     ======================================================================== */

  // apko (optioneel): enkel klassen en rubrieken tonen waarin rekeningen van
  // die soort zitten. Kies je K, dan blijft er bv. enkel klasse 6 over.
  function klassenMetRekeningen(apko) {
    return MAR_INDELING.filter(function (kl) {
      return MAR.some(function (a) { return a.klasse === kl.klasse && (!apko || a.apko === apko); });
    });
  }

  function rubriekenVoorKlasse(klasse, apko) {
    var lijst = [];
    MAR_INDELING.forEach(function (kl) {
      if (klasse && kl.klasse !== klasse) return;
      kl.rubrieken.forEach(function (r) {
        if (!MAR.some(function (a) { return a.rubriek === r.rubriek && (!apko || a.apko === apko); })) return;
        lijst.push({ rubriek: r.rubriek, oms: r.oms, klasse: kl.klasse });
      });
    });
    return lijst;
  }

  function vulKlasseSelect(selectEl, gekozen, apko) {
    if (!selectEl) return;
    var html = '<option value="">alle klassen</option>';
    klassenMetRekeningen(apko).forEach(function (kl) {
      html += '<option value="' + kl.klasse + '"' + (kl.klasse === gekozen ? " selected" : "") + ">klasse " + kl.klasse + " — " + escapeAttr(kl.oms) + "</option>";
    });
    selectEl.innerHTML = html;
  }

  function vulRubriekSelect(selectEl, klasse, gekozen, apko) {
    if (!selectEl) return;
    var rubrieken = rubriekenVoorKlasse(klasse, apko);
    var html = '<option value="">alle rubrieken</option>';
    rubrieken.forEach(function (r) {
      html += '<option value="' + r.rubriek + '"' + (r.rubriek === gekozen ? " selected" : "") + ">" + r.rubriek + " — " + escapeAttr(r.oms) + "</option>";
    });
    selectEl.innerHTML = html;
    selectEl.disabled = rubrieken.length === 0;
  }

  // Na een klik op A/P/K/O: de klasse- en rubriekkeuze opnieuw vullen met
  // enkel wat bij die soort past. Een gekozen klasse of rubriek die er niet
  // meer bij hoort, valt weg — anders blijft de lijst leeg zonder dat
  // duidelijk is waarom.
  function pasKlasseRubriekAanApko(filter, klasseId, rubriekId) {
    var klassen = klassenMetRekeningen(filter.apko).map(function (kl) { return kl.klasse; });
    if (filter.klasse && klassen.indexOf(filter.klasse) === -1) { filter.klasse = ""; filter.rubriek = ""; }
    var rubrieken = rubriekenVoorKlasse(filter.klasse, filter.apko).map(function (r) { return r.rubriek; });
    if (filter.rubriek && rubrieken.indexOf(filter.rubriek) === -1) filter.rubriek = "";
    vulKlasseSelect(document.getElementById(klasseId), filter.klasse, filter.apko);
    vulRubriekSelect(document.getElementById(rubriekId), filter.klasse, filter.rubriek, filter.apko);
  }

  function rekeningPastBijFilter(a, filter) {
    if (filter.apko && a.apko !== filter.apko) return false;
    if (filter.klasse && a.klasse !== filter.klasse) return false;
    if (filter.rubriek && a.rubriek !== filter.rubriek) return false;
    var query = (filter.zoek || "").trim().toLowerCase();
    if (query && String(a.nr).indexOf(query) === -1 && a.naam.toLowerCase().indexOf(query) === -1) return false;
    return true;
  }

  /* ========================================================================
     8c. MAR-zoekpopup — zoeken op nummer/naam + filteren
     ======================================================================== */

  function openMarModal(scope, row) {
    marModal.open = true;
    marModal.scope = scope;
    marModal.row = row;
    marModal.zoek = "";
    marModal.apko = "";
    marModal.klasse = "";
    marModal.rubriek = "";
    document.getElementById("mar-modal-overlay").hidden = false;
    document.getElementById("mar-modal-zoek").value = "";
    vulKlasseSelect(document.getElementById("mar-modal-klasse"), "");
    vulRubriekSelect(document.getElementById("mar-modal-rubriek"), "", "");
    renderFilterKnoppen("mar-modal-apko-knoppen", marModal.apko);
    renderMarModalLijst();
    setTimeout(function () { document.getElementById("mar-modal-zoek").focus(); }, 0);
  }

  function closeMarModal() {
    marModal.open = false;
    document.getElementById("mar-modal-overlay").hidden = true;
  }

  function renderFilterKnoppen(containerId, actieveWaarde) {
    var knoppen = document.querySelectorAll("#" + containerId + " [data-apko]");
    Array.prototype.forEach.call(knoppen, function (b) {
      b.classList.toggle("actief", b.dataset.apko === actieveWaarde);
    });
  }

  function renderMarModalLijst() {
    var el = document.getElementById("mar-modal-lijst");
    if (!el) return;
    var resultaten = MAR.filter(function (a) { return rekeningPastBijFilter(a, marModal); });
    if (!resultaten.length) {
      el.innerHTML = '<p class="lijst-leeg">Geen rekening gevonden met deze filters.</p>';
      el.scrollTop = 0;
      return;
    }
    el.innerHTML = resultaten
      .map(function (a) {
        return (
          '<div class="mar-modal-item" data-nr="' + a.nr + '">' +
          '<span class="mar-modal-item-nr">' + a.nr + "</span>" +
          '<span class="mar-modal-item-naam">' + escapeAttr(a.naam) + "</span>" +
          '<span class="mar-modal-item-rubriek">' + a.rubriek + "</span>" +
          '<span class="mar-modal-item-apko">' + a.apko + "</span>" +
          "</div>"
        );
      })
      .join("");
    // Na elke filterwijziging terug bovenaan beginnen. Zonder dit bleef de
    // lijst staan waar ze stond en leek een filter "ergens halverwege" uit
    // te komen.
    el.scrollTop = 0;
  }

  function renderTpanel() {
    var lijst = document.getElementById("tpanel-lijst");
    if (!lijst) return;
    // Standaard zonder de beginbalans: zo ziet de leerling enkel wat hij
    // zelf boekte. De vakexpert kan ze per jaar aanzetten (tabblad Beheer).
    var gb = berekenGrootboek(null, !beginbalansInT());
    var filter = {
      zoek: uiState.tpanelZoek,
      apko: uiState.tpanelApko,
      klasse: uiState.tpanelKlasse,
      rubriek: uiState.tpanelRubriek,
    };
    var heeftFilter = !!(filter.zoek || filter.apko || filter.klasse || filter.rubriek);

    var accounts = MAR
      .filter(function (a) { return rekeningPastBijFilter(a, filter); })
      .map(function (a) {
        var nr = String(a.nr);
        return { nr: nr, mar: a, entry: gb[nr] || { D: [], C: [] } };
      })
      .filter(function (a) {
        var heeftBoekingen = a.entry.D.length > 0 || a.entry.C.length > 0;
        return heeftBoekingen || uiState.tpanelToonLeeg;
      });

    accounts.sort(function (a, b) { return parseInt(a.nr, 10) - parseInt(b.nr, 10); });

    if (!accounts.length) {
      var boodschap;
      if (uiState.tpanelToonLeeg || heeftFilter) boodschap = "Geen rekening gevonden met deze filters.";
      else boodschap = "Nog geen boekingen. Vink <em>lege rekeningen tonen</em> aan als je toch alle rekeningen wil zien.";
      lijst.innerHTML = '<p class="lijst-leeg">' + boodschap + "</p>";
      lijst.scrollTop = 0;
      return;
    }
    lijst.innerHTML = accounts.map(function (a) { return htmlTrekBlok(a.nr, a.mar, a.entry); }).join("");
  }

  /* ========================================================================
     9. Navigatie en voortgang
     ======================================================================== */

  function voortgang() {
    // De vaste beginboeking telt niet mee: die heeft de leerling niet zelf gedaan.
    var eigen = OPDRACHTEN.filter(function (o) { return !o.vasteBoeking; });
    var totaal = eigen.length;
    var klaar = eigen.filter(function (o) {
      return state.boekingen[o.ref] && state.boekingen[o.ref].geboekt;
    }).length;
    return { klaar: klaar, totaal: totaal, percent: totaal ? Math.round((klaar / totaal) * 100) : 0 };
  }

  /* De voortgang van het deel waar de leerling nu mee bezig is: de eerste
     categorie (Aankopen, Verkopen …) die nog niet volledig geboekt is.
     "5 van 15" in de eigen categorie motiveert meer dan "5 van 55" voor het
     hele jaar; het totaal staat er klein achter. */
  function deelVan(cat) {
    return cat;
  }

  function voortgangHuidigDeel() {
    var delen = [], perDeel = {};
    OPDRACHTEN.forEach(function (o) {
      if (o.vasteBoeking) return;
      var d = deelVan(o.categorie);
      if (!perDeel[d]) { perDeel[d] = { naam: d, klaar: 0, totaal: 0 }; delen.push(perDeel[d]); }
      perDeel[d].totaal++;
      if (state.boekingen[o.ref] && state.boekingen[o.ref].geboekt) perDeel[d].klaar++;
    });
    for (var i = 0; i < delen.length; i++) {
      if (delen[i].klaar < delen[i].totaal) return delen[i];
    }
    return null;   // alles geboekt
  }

  function renderVoortgang() {
    var v = voortgang();
    var deel = voortgangHuidigDeel();
    var vulling = document.getElementById("voortgang-vulling");
    var tekst = document.getElementById("voortgang-tekst");
    var pct = deel ? Math.round((deel.klaar / deel.totaal) * 100) : v.percent;
    var balk = document.getElementById("voortgang");
    // Onzichtbaar maar niet weg: de balk hoort bij de hoogte van de kop.
    if (balk) balk.style.visibility = (!huidigJaar || jaarSoort().vooraf) ? "hidden" : "";
    if (vulling) vulling.style.width = pct + "%";
    if (tekst) {
      tekst.textContent = deel
        ? huidigJaar + " · " + deel.naam + ": " + deel.klaar + " van " + deel.totaal + " geboekt · jaar: " + v.klaar + " van " + v.totaal
        : huidigJaar + " · " + v.klaar + " van " + v.totaal + " geboekt";
    }
    if (balk) {
      balk.classList.toggle("voortgang-af", v.klaar === v.totaal && v.totaal > 0);
      balk.title = deel
        ? "Hoeveel stukken van " + deel.naam.toLowerCase() + " heb je al geboekt? Achteraan: het hele jaar."
        : "Alles geboekt.";
    }
  }

  /* Het bolletje rechts van een verrichting in het menu. Zolang er geen
     feedback is, betekent het gewoon "geboekt of niet". Zodra de vakexpert
     iets beoordeeld heeft, neemt die kleur het over — anders zou een
     verrichting groen blijven staan terwijl ze niet in orde is. */
  /* Begonnen maar nog niet geboekt: er staat iets in het schema, maar de
     leerling drukte (nog) niet op Boeken. Zo'n boeking telt niet mee in de
     T-rekeningen en gaat niet mee bij het indienen — daarom tonen het menu
     en het indienvenster ze apart. */
  function isBegonnenNietGeboekt(ref) {
    var b = state.boekingen[ref];
    if (!b || b.geboekt || !b.rows) return false;
    return b.rows.some(function (r) {
      return r.auto ? !!String(r.relatie || "").trim() : !rijLeeg(r);
    });
  }

  var BOLLETJE_BEGONNEN = '<span class="status-bolletje begonnen" title="Begonnen, maar nog niet geboekt"></span>';

  function htmlNavBolletje(ref, geboekt) {
    // Eerst: moet de leerling hier nog op Boeken drukken? Dat is wat nu te
    // doen is (bv. na het heropenen van een boeking met feedback); na het
    // boeken komt de kleur van de feedback terug.
    if (!geboekt && isBegonnenNietGeboekt(ref)) return BOLLETJE_BEGONNEN;
    var zc = zelfcontroleVoor(ref);
    if (zc && zc.ok) return '<span class="status-bolletje oordeel-in-orde" title="Zelfcontrole: klopt"></span>';
    if (zc && zc.pogingen && geboekt) return '<span class="status-bolletje oordeel-te-remedieren" title="Zelfcontrole: klopt nog niet"></span>';
    var beoordeling = laatsteBeoordeling(ref);
    if (beoordeling) {
      return '<span class="status-bolletje oordeel-' + beoordelingKlasse(beoordeling) + '" title="' +
        escapeAttr(beoordeling) + '"></span>';
    }
    return '<span class="status-bolletje' + (geboekt ? " geboekt" : "") + '"></span>';
  }

  function renderNav() {
    var el = document.getElementById("nav-links");
    if (!el) return;
    var html = "";

    var jaren = zichtbareJaren();
    if (jaren.length) {
      html += '<div class="jaar-kiezer"><label for="jaar-select">Boekjaar</label>' +
        '<select id="jaar-select" data-role="kies-jaar">' +
        jaren.map(function (j) {
          return '<option value="' + j + '"' + (j === huidigJaar ? " selected" : "") + ">" + j + " · " + escapeAttr(JAREN[j].titel) + "</option>";
        }).join("") + "</select></div>";
    }

    html += '<div class="nav-top-item' + (uiState.huidigePagina.type === "start" ? " actief" : "") + '" data-page-type="start">Start</div>';
    // Nog geen jaar open: enkel Start en Beheer. Beheer moet er altijd
    // staan, anders kan de vakexpert niets openzetten.
    if (!huidigJaar) { el.innerHTML = html + htmlNavBeheer(); return; }
    if (saldibalansZichtbaar()) {
      html += '<div class="nav-top-item' + (uiState.huidigePagina.type === "saldibalans" ? " actief" : "") + '" data-page-type="saldibalans">Proef- en saldibalans</div>';
    }
    // Openstaande facturen volg je het hele jaar op, dus de pagina staat
    // bovenaan en niet pas bij één categorie (zie RELATIES_BOVENAAN).
    var relatiesBovenaan = typeof RELATIES_BOVENAAN !== "undefined" && RELATIES_BOVENAAN;
    if (relatiesBovenaan && relatiesZichtbaar()) {
      html += '<div class="nav-top-item' + (uiState.huidigePagina.type === "relaties" ? " actief" : "") + '" data-page-type="relaties">' +
        "<span>Klanten &amp; leveranciers</span>" +
        (laatsteBeoordeling("RELATIES") ? htmlNavBolletje("RELATIES", true) : "") + "</div>";
    }

    var koppen = typeof CATEGORIE_KOPPEN !== "undefined" ? CATEGORIE_KOPPEN : {};
    var onderKop = false;
    CATEGORIE_VOLGORDE.forEach(function (cat) {
      var items = OPDRACHTEN.filter(function (o) { return o.categorie === cat && !o.verborgenInNav; });
      if (!items.length) return;
      // Een tussentitel per kwartaal. Daaronder valt het voorvoegsel "K1 · "
      // van de categorie weg: dat staat al in de titel erboven.
      if (koppen[cat]) {
        html += '<div class="nav-groep">' + escapeAttr(koppen[cat]) + "</div>";
        onderKop = true;
      }
      var label = onderKop ? String(cat).replace(/^K\d\s*·\s*/, "").replace(/^(Aankopen|Verkopen) taak/, "Taak") : cat;
      html += '<div class="nav-categorie">' + escapeAttr(label) +
        (isAanbevolen(cat) ? ' <span class="nav-aanbevolen" title="Je vakexpert raadt je aan dit deel te oefenen">★ aanbevolen</span>' : "") + "</div>";
      items.forEach(function (o) {
        var geboekt = state.boekingen[o.ref] && state.boekingen[o.ref].geboekt;
        var actief = uiState.huidigePagina.type === "opdracht" && uiState.huidigePagina.ref === o.ref;
        html += '<div class="nav-link' + (actief ? " actief" : "") + '" data-page-type="opdracht" data-page-ref="' + escapeAttr(o.ref) + '">' +
          "<span>" + escapeAttr(o.navLabel || o.ref) + "</span>" +
          htmlNavBolletje(o.ref, geboekt) + "</div>";
      });

      // Klanten & leveranciers hoort bij de financiële verrichtingen: pas
      // daar is er iets af te punten, en de controles erover staan in
      // dezelfde categorie.
      if (cat === CATEGORIE_RELATIES && !relatiesBovenaan) {
        var actiefRel = uiState.huidigePagina.type === "relaties";
        html += '<div class="nav-link nav-extra' + (actiefRel ? " actief" : "") + '" data-page-type="relaties">' +
          "<span>Klanten &amp; leveranciers</span></div>";
      }

      if (categorieHeeftControle(cat)) {
        var stand = controleStand(cat);
        var actiefC = uiState.huidigePagina.type === "controle" && uiState.huidigePagina.cat === cat;
        html += '<div class="nav-link nav-controle' + (actiefC ? " actief" : "") + '" data-page-type="controle" data-page-cat="' + escapeAttr(cat) + '">' +
          "<span>✓ Controle</span>" +
          (stand.totaal
            ? '<span class="nav-controle-stand' + (stand.ok ? " af" : "") + '">' + stand.af + "/" + stand.totaal + "</span>"
            : "") +
          "</div>";
      }
    });

    if (afsluitenZichtbaar()) {
    html += '<div class="nav-categorie">Afsluiten</div>';
    var slot = [
      { type: "controles", label: "Eindcontrole", ref: null },
      { type: "resultaat", label: "Resultaatverwerking", ref: "RESULTAATVERWERKING" },
      { type: "eindbalans", label: "Eindbalans", ref: "EINDBALANS" },
    ];
    slot.forEach(function (s) {
      html += '<div class="nav-top-item' + (uiState.huidigePagina.type === s.type ? " actief" : "") + '" data-page-type="' + s.type + '">' +
        "<span>" + s.label + "</span>" +
        (s.ref && laatsteBeoordeling(s.ref) ? htmlNavBolletje(s.ref, true) : "") + "</div>";
    });
    }

    el.innerHTML = html + htmlNavBeheer();
  }

  // Het beheertabblad voor de vakexperten. Het staat er voor iedereen,
  // maar zonder de expertcode valt er niets te zien: die wordt op de
  // server gecontroleerd.
  function htmlNavBeheer() {
    if (!(window.BEHEER && window.BEHEER.beschikbaar())) return "";
    return '<div class="nav-categorie">Voor vakexperten</div>' +
      '<div class="nav-top-item nav-beheer' + (uiState.huidigePagina.type === "beheer" ? " actief" : "") +
      '" data-page-type="beheer">Beheer</div>';
  }

  /* ========================================================================
     10. Alles samen renderen (met focus- en scrollbehoud)
     ======================================================================== */

  function renderPagina() {
    var el = document.getElementById("pagina-inhoud");
    if (!el) return;
    var p = uiState.huidigePagina;
    var html = htmlMededeling();
    if (p.type === "start") html += renderStart();
    else if (p.type === "saldibalans" && saldibalansZichtbaar()) html += renderSaldibalans();
    else if (p.type === "opdracht") html += renderOpdracht(p.ref);
    else if (p.type === "relaties" && relatiesZichtbaar()) html += renderRelaties();
    else if (p.type === "controle") html += renderCategorieControle(p.cat);
    else if (p.type === "controles") html += renderControles();
    else if (p.type === "resultaat") html += renderResultaat();
    else if (p.type === "eindbalans") html += renderEindbalansPagina();
    // Het beheertabblad zit in js/beheer.js: het hoort niet bij het werk van
    // de leerling en app.js hoeft er niets van te weten. Ontbreekt dat
    // bestand, dan bestaat de pagina gewoon niet.
    else if (p.type === "beheer") html += (window.BEHEER ? window.BEHEER.html() : "");
    else html += renderStart();
    el.innerHTML = html;
    if (p.type === "beheer" && window.BEHEER) window.BEHEER.naRender(el);
  }

  function metBehoudVanFocus(fn) {
    var actief = document.activeElement;
    var info = null;
    if (actief && actief.dataset && actief.dataset.focusId) {
      info = { id: actief.dataset.focusId, start: actief.selectionStart, end: actief.selectionEnd };
    }
    var main = document.getElementById("main-content");
    var scroll = main ? main.scrollTop : 0;
    var vensterScroll = window.pageYOffset;

    fn();

    if (main) main.scrollTop = scroll;
    if (vensterScroll) window.scrollTo(0, vensterScroll);
    if (info) {
      var el = null;
      try { el = document.querySelector('[data-focus-id="' + CSS.escape(info.id) + '"]'); } catch (e) {}
      if (el) {
        el.focus();
        if (typeof el.setSelectionRange === "function" && info.start !== null && info.start !== undefined) {
          try { el.setSelectionRange(info.start, info.end); } catch (e2) {}
        }
      }
    }
  }

  function renderAlles() {
    // Indienen enkel in de jaren die naar de vakexpert gaan (taak en
    // consolidaties). Zonder koppeling bestaat de knop niet.
    var btnIndienen = document.getElementById("btn-indienen");
    if (btnIndienen && koppelingIngesteld()) btnIndienen.hidden = !jaarSoort().indienen;
    metBehoudVanFocus(function () {
      renderNav();
      renderPagina();
    });
    renderTpanel();
    renderVoortgang();
    updateOpslaanStatus();
  }

  /* ========================================================================
     11. Event handling
     ======================================================================== */

  function opState(scope, rowIdx, veld, waarde) {
    var boeking = boekingVoor(scope);
    var row = boeking.rows[rowIdx];
    if (!row) return;
    row[veld] = waarde;
    // Het stappenplan gaat van links naar rechts. Verandert een keuze, dan
    // vallen de keuzes rechts ervan weg die er niet meer bij passen.
    if (veld === "apko") {
      if (row.klasse && !klassenMetRekeningen(row.apko).some(function (k) { return k.klasse === row.klasse; })) row.klasse = "";
      veld = "klasse";
    }
    if (veld === "klasse") {
      if (row.rubriek && !rubriekenVoorKlasse(row.klasse, row.apko).some(function (r) { return r.rubriek === row.rubriek; })) row.rubriek = "";
      if (!row.klasse) row.rubriek = "";
      veld = "rubriek";
    }
    if (veld === "rubriek") {
      var mar = marBij(row.rekening);
      if (row.rekening && (!mar || !row.rubriek || mar.rubriek !== row.rubriek || (row.apko && mar.apko !== row.apko))) row.rekening = "";
      veld = "rekening";
      waarde = row.rekening;
    }
    // Een klant-/leveranciersnaam hoort enkel bij 400000 en 440000. Wijzigt
    // het rekeningnummer naar iets anders, dan verdwijnt de keuzelijst — de
    // naam mag dan niet onzichtbaar blijven meeslepen.
    if (veld === "rekening") {
      var soort = relatieVeldVoorRekening(waarde);
      if (!soort) row.relatie = "";
      else if (!row.relatie) {
        // De naam afleiden uit het document: die staat er toch op.
        var def = opdrachtVoor(scope);
        if (def && def.relatie && relatieNamen(soort).indexOf(def.relatie) !== -1) row.relatie = def.relatie;
      }
    }
  }

  function opdrachtVoor(ref) {
    for (var i = 0; i < OPDRACHTEN.length; i++) if (OPDRACHTEN[i].ref === ref) return OPDRACHTEN[i];
    return null;
  }

  // Eén of meer aangetikte kaartjes in een vak leggen (of terug in de lijst
  // als vakId leeg is).
  function plaatsKaarten(ids, vakId) {
    if (!ids || !ids.length) return;
    ids.forEach(function (id) {
      if (vakId) state.eindbalans[id] = vakId;
      else delete state.eindbalans[id];
    });
    uiState.gekozenKaarten = [];
    saveState();
    renderAlles();
  }

  /* Afmelden: koppeling.js bewaart eerst het laatste werk op de server en
     vergeet de aanmelding; daarna begint de app opnieuw met een leeg
     aanmeldscherm. Het werk zelf blijft in deze browser (en op de Drive)
     staan: wie zich opnieuw aanmeldt, vindt alles terug. */
  function afmelden() {
    if (!state.student) return;
    if (!window.confirm("Afmelden als " + state.student + "?\n\nJe werk wordt eerst op de server bewaard en daarna " +
        "uit deze browser gewist, zodat de volgende leerling er niet aan kan. Je kan je later gewoon opnieuw aanmelden.")) return;
    var hooks = window.KOPPELING_HOOKS;
    var klaar = hooks && hooks.afmelden ? hooks.afmelden() : Promise.resolve(true);
    klaar.then(function (ok) {
      if (!ok) return;
      // Het werk staat veilig op de server (koppeling.js wachtte daarop):
      // nu mag het weg uit deze browser, voor een gedeelde computer.
      try {
        localStorage.removeItem(storageKeyVoor(state.student));
        localStorage.removeItem(LAATSTE_LEERLING_KEY);
      } catch (e) { /* geblokkeerde opslag: dan valt er niets te vergeten */ }
      window.location.reload();
    });
  }

  function initEvents() {
    var paginaEl = document.getElementById("pagina-inhoud");
    var btnAfmelden = document.getElementById("btn-afmelden");
    if (btnAfmelden) btnAfmelden.addEventListener("click", afmelden);

    paginaEl.addEventListener("input", function (e) {
      var t = e.target;
      if (t.dataset && t.dataset.scope !== undefined && t.dataset.row !== undefined && t.dataset.field) {
        opState(t.dataset.scope, parseInt(t.dataset.row, 10), t.dataset.field, t.value);
        saveState();
        renderAlles();
        return;
      }
      if (t.dataset && t.dataset.role === "stap-veld") {
        state.resultaat.stap[t.dataset.veld] = t.value;
        saveState();
        renderAlles();
        return;
      }
      // De open vragen bij klanten & leveranciers. Bewust zonder renderAlles:
      // er verandert niets aan het scherm, en opnieuw opbouwen zou de cursor
      // in een lange tekst doen verspringen.
      if (t.dataset && t.dataset.role === "relatie-vraag") {
        state.relatieVragen[t.dataset.veld] = t.value;
        saveState();
      }
    });

    // Tab in het laatste veld (D/C) van de laatste lijn = een nieuwe lijn
    // erbij, met de cursor meteen in het bedrag. Sneller dan telkens naar
    // "+ rij toevoegen" te grijpen. Shift+Tab blijft gewoon terugspringen.
    paginaEl.addEventListener("keydown", function (e) {
      var t = e.target;
      if (e.key !== "Tab" || e.shiftKey || e.ctrlKey || e.altKey) return;
      if (!t.dataset || t.dataset.field !== "dc" || t.dataset.scope === undefined) return;
      var scope = t.dataset.scope;
      var boeking = boekingVoor(scope);
      if (boeking.geboekt || isInOrde(scope)) return;
      if (parseInt(t.dataset.row, 10) !== boeking.rows.length - 1) return;
      e.preventDefault();
      // Een keuze die nog niet via "change" binnen was, eerst bewaren.
      opState(scope, parseInt(t.dataset.row, 10), "dc", t.value);
      boeking.rows.push(maakLegeRij());
      saveState();
      renderAlles();
      var nieuw = null;
      try { nieuw = document.querySelector('[data-focus-id="' + CSS.escape(focusId(scope, boeking.rows.length - 1, "bedrag")) + '"]'); } catch (e2) {}
      if (nieuw) nieuw.focus();
    });

    // <details> stuurt geen bubbelend event, vandaar de derde parameter.
    // Zo onthouden we of de leerling een document open- of dichtklapte.
    paginaEl.addEventListener("toggle", function (e) {
      var d = e.target;
      if (d && d.tagName === "DETAILS" && d.dataset && d.dataset.docSleutel) {
        uiState.openDocumenten[d.dataset.docSleutel] = d.open;
      }
    }, true);

    paginaEl.addEventListener("change", function (e) {
      var t = e.target;
      // Zelfde afhandeling als bij "input": nodig omdat <select>-velden
      // (A/P/K/O, stijgt/daalt, D/C) in sommige browsers enkel "change"
      // vuren. Opnieuw dezelfde waarde wegschrijven is onschadelijk.
      if (t.dataset && t.dataset.scope !== undefined && t.dataset.row !== undefined && t.dataset.field) {
        var waarde = t.value;
        // Bedragen netjes wegschrijven zodra de leerling het veld verlaat:
        // met een punt als duizendtalscheiding. Zo hoeft de leerling dat
        // niet zelf in te tikken — "1250" wordt "1.250".
        if (t.dataset.field === "bedrag") {
          var getal = parseBedrag(waarde);
          if (getal !== null) waarde = formatBedrag(getal);
        }
        opState(t.dataset.scope, parseInt(t.dataset.row, 10), t.dataset.field, waarde);
        saveState();
        renderAlles();
        return;
      }
      if (t.dataset && t.dataset.role === "relatie-select") {
        uiState.relatieKeuze[t.dataset.soort] = t.value;
        renderAlles();
        return;
      }
      if (t.dataset && t.dataset.role === "controle-check") {
        state.controles[t.dataset.controleId] = t.checked;
        saveState();
        renderAlles();
      } else if (t.dataset && t.dataset.role === "slot-check") {
        state.resultaat[t.dataset.veld] = t.checked;
        if (state.resultaat.slotcontroleResultaat && state.resultaat.slotcontroleBalans) {
          var getallen = berekenSlotcontroleGetallen();
          var cijfersKloppen = getallen.resD === getallen.resC && getallen.actD === getallen.pasC;
          if (!alleControlesOk()) {
            state.resultaat.slotcontroleMelding = { type: "fout", tekst: "Er staan nog fouten of openstaande punten in het tabblad Controles. Los die eerst op vóór je de slotcontrole kan afronden." };
            state.resultaat.slotcontroleResultaat = false;
            state.resultaat.slotcontroleBalans = false;
          } else if (!balansAf()) {
            state.resultaat.slotcontroleMelding = { type: "fout", tekst: "Je eindbalans en resultatenrekening bovenaan zijn nog niet af. Zet elke rubriek op de juiste plaats en zorg dat activa gelijk is aan passiva én kosten aan opbrengsten." };
            state.resultaat.slotcontroleResultaat = false;
            state.resultaat.slotcontroleBalans = false;
          } else if (cijfersKloppen) {
            state.resultaat.slotcontroleMelding = { type: "goed", tekst: "Hoera, je bent er geraakt! Laat de vakexpert dit nog even nakijken, want deze app kan maar beperkte controles doorvoeren. Ondertussen mag jij alvast trots zijn op jezelf!" };
          } else {
            state.resultaat.slotcontroleMelding = { type: "fout", tekst: "Helaas, dat klopt niet. Check je cijfers nog eens." };
            state.resultaat.slotcontroleResultaat = false;
            state.resultaat.slotcontroleBalans = false;
          }
        } else {
          state.resultaat.slotcontroleMelding = null;
        }
        saveState();
        renderAlles();
      }
    });

    paginaEl.addEventListener("click", function (e) {
      var knop = e.target.closest ? e.target.closest("[data-role]") : null;
      if (!knop) return;
      var role = knop.dataset.role;

      if (role === "controles-nagekeken") {
        // De leerling bevestigt dat de controles van deze categorie opnieuw
        // bekeken zijn na een wijziging. Het waarschuwingsblokje verdwijnt
        // dan, ook bij het indienen.
        delete state.controlesHerbekijken[knop.dataset.cat];
        saveState(); renderAlles();
      } else if (role === "zelfcontrole") {
        voerZelfcontroleUit(knop.dataset.scope);
        saveState(); renderAlles();
      } else if (role === "rij-toevoegen") {
        boekingVoor(knop.dataset.scope).rows.push(maakLegeRij());
        saveState(); renderAlles();
      } else if (role === "verwijder-rij") {
        var b = boekingVoor(knop.dataset.scope);
        b.rows.splice(parseInt(knop.dataset.row, 10), 1);
        // De rode lijnen van de zelfcontrole kloppen niet meer na het schuiven.
        if (state.zelfcontrole[knop.dataset.scope]) state.zelfcontrole[knop.dataset.scope].fouteRijen = [];
        if (!b.rows.length) b.rows.push(maakLegeRij());
        saveState(); renderAlles();
      } else if (role === "boeken") {
        var bk = boekingVoor(knop.dataset.scope);
        if (!boekingKlaarOmTeBoeken(bk.rows)) return;
        bk.geboekt = true; saveState(); renderAlles();
      } else if (role === "heropenen") {
        var refH = knop.dataset.scope;
        boekingVoor(refH).geboekt = false;
        if (state.zelfcontrole[refH]) state.zelfcontrole[refH].gewijzigd = true;
        // Wijzigen = opnieuw controleren, maar de vinkjes blijven staan: ze
        // allemaal opnieuw laten aanzetten was te veel werk en zorgde vooral
        // voor blind doorklikken. In plaats daarvan wordt deze categorie
        // gemarkeerd als "opnieuw na te kijken". De slotcontrole hoeft hier
        // niet gewist te worden: het tabblad Eindbalans herrekent die bij elk
        // bezoek en laat ze vanzelf vallen zodra iets niet meer klopt.
        // Afpuntingen die op deze boeking steunen vervallen wél — de rijen
        // kunnen immers veranderen.
        markeerControlesTeHerbekijken(categorieVanRef(refH));
        state.afpuntingen = state.afpuntingen.filter(function (k) {
          return k.van.split(":")[0] !== refH && k.naar.split(":")[0] !== refH;
        });
        saveState(); renderAlles();
      } else if (role === "afpunt-bron") {
        var bronId = knop.dataset.item;
        uiState.afpuntSelectie = uiState.afpuntSelectie === bronId ? null : bronId;
        renderAlles();
      } else if (role === "afpunt-doel") {
        if (uiState.afpuntSelectie) {
          var vanId = uiState.afpuntSelectie;
          var naarId = knop.dataset.item;
          var bestaatAl = state.afpuntingen.some(function (k) { return k.van === vanId && k.naar === naarId; });
          if (!bestaatAl) state.afpuntingen.push({ van: vanId, naar: naarId });
          uiState.afpuntSelectie = null;
          saveState(); renderAlles();
        }
      } else if (role === "afpunt-verwijder") {
        var wegVan = knop.dataset.van;
        var wegNaar = knop.dataset.naar;
        state.afpuntingen = state.afpuntingen.filter(function (k) {
          return !(k.van === wegVan && k.naar === wegNaar);
        });
        saveState(); renderAlles();
      } else if (role === "mar-zoeken") {
        openMarModal(knop.dataset.scope, parseInt(knop.dataset.row, 10));
      } else if (role === "info") {
        openInfoModal(knop.dataset.info);
      } else if (role === "naar-eindbalans") {
        var doel = document.getElementById("paneel-eindbalans");
        if (doel && doel.scrollIntoView) doel.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (role === "ga-naar") {
        uiState.huidigePagina = { type: knop.dataset.pageType };
        renderAlles();
        window.scrollTo(0, 0);
      } else if (role === "ga-naar-controle") {
        uiState.huidigePagina = { type: "controle", cat: knop.dataset.cat };
        renderAlles();
        window.scrollTo(0, 0);
      } else if (role === "kies-relatie") {
        uiState.relatieKeuze[knop.dataset.soort] = knop.dataset.naam;
        renderAlles();
      } else if (role === "kaart-terug") {
        e.stopPropagation();
        plaatsKaarten([knop.dataset.kaart], null);
      } else if (role === "balans-kaart") {
        // Meerdere kaartjes tegelijk mogen: aantikken zet ze in of uit de
        // selectie, daarna volstaat één klik op het juiste vak.
        var id = knop.dataset.kaart;
        var pos = uiState.gekozenKaarten.indexOf(id);
        if (pos === -1) uiState.gekozenKaarten.push(id);
        else uiState.gekozenKaarten.splice(pos, 1);
        renderAlles();
      } else if (role === "balans-vak") {
        if (uiState.gekozenKaarten.length) plaatsKaarten(uiState.gekozenKaarten.slice(), knop.dataset.vak || null);
      } else if (role === "balans-leegmaken") {
        state.eindbalans = {};
        uiState.gekozenKaarten = [];
        saveState(); renderAlles();
      }
    });

    // Slepen van de balanskaartjes. Tikken werkt ook (zie hierboven), zodat
    // dit ook bruikbaar blijft op een tablet zonder drag-ondersteuning.
    paginaEl.addEventListener("dragstart", function (e) {
      var kaart = e.target.closest ? e.target.closest('[data-role="balans-kaart"]') : null;
      if (!kaart) return;
      e.dataTransfer.setData("text/plain", kaart.dataset.kaart);
      e.dataTransfer.effectAllowed = "move";
      kaart.classList.add("sleept");
    });
    paginaEl.addEventListener("dragend", function (e) {
      var kaart = e.target.closest ? e.target.closest('[data-role="balans-kaart"]') : null;
      if (kaart) kaart.classList.remove("sleept");
    });
    paginaEl.addEventListener("dragover", function (e) {
      var vak = e.target.closest ? e.target.closest('[data-role="balans-vak"]') : null;
      if (!vak) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      vak.classList.add("sleep-over");
    });
    paginaEl.addEventListener("dragleave", function (e) {
      var vak = e.target.closest ? e.target.closest('[data-role="balans-vak"]') : null;
      if (vak) vak.classList.remove("sleep-over");
    });
    paginaEl.addEventListener("drop", function (e) {
      var vak = e.target.closest ? e.target.closest('[data-role="balans-vak"]') : null;
      if (!vak) return;
      e.preventDefault();
      vak.classList.remove("sleep-over");
      var id = e.dataTransfer.getData("text/plain");
      plaatsKaarten([id], vak.dataset.vak || null);
    });

    // MAR-zoekpopup: eigen, vaste DOM-elementen buiten #pagina-inhoud, dus
    // die worden niet telkens herbouwd en verliezen geen focus/scrollpositie.
    document.getElementById("mar-modal-zoek").addEventListener("input", function (e) {
      marModal.zoek = e.target.value;
      renderMarModalLijst();
    });
    document.getElementById("mar-modal-apko-knoppen").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-apko]") : null;
      if (!b) return;
      marModal.apko = b.dataset.apko;
      renderFilterKnoppen("mar-modal-apko-knoppen", marModal.apko);
      pasKlasseRubriekAanApko(marModal, "mar-modal-klasse", "mar-modal-rubriek");
      renderMarModalLijst();
    });
    document.getElementById("mar-modal-klasse").addEventListener("change", function (e) {
      marModal.klasse = e.target.value;
      marModal.rubriek = "";
      vulRubriekSelect(document.getElementById("mar-modal-rubriek"), marModal.klasse, "", marModal.apko);
      renderMarModalLijst();
    });
    document.getElementById("mar-modal-rubriek").addEventListener("change", function (e) {
      marModal.rubriek = e.target.value;
      renderMarModalLijst();
    });
    document.getElementById("mar-modal-lijst").addEventListener("click", function (e) {
      var item = e.target.closest ? e.target.closest(".mar-modal-item") : null;
      if (!item) return;
      opState(marModal.scope, marModal.row, "rekening", item.dataset.nr);
      closeMarModal();
      saveState();
      renderAlles();
    });
    document.getElementById("mar-modal-sluiten").addEventListener("click", closeMarModal);
    document.getElementById("mar-modal-overlay").addEventListener("click", function (e) {
      if (e.target.id === "mar-modal-overlay") closeMarModal();
    });

    // Uitlegvenster
    document.body.addEventListener("click", function (e) {
      var knop = e.target.closest ? e.target.closest('[data-role="info"]') : null;
      if (!knop) return;
      if (document.getElementById("pagina-inhoud").contains(knop)) return; // al afgehandeld
      openInfoModal(knop.dataset.info);
    });
    document.getElementById("info-modal-sluiten").addEventListener("click", sluitInfoModal);
    document.getElementById("info-modal-overlay").addEventListener("click", function (e) {
      if (e.target.id === "info-modal-overlay") sluitInfoModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (marModal.open) closeMarModal();
      sluitInfoModal();
    });

    // De keuze van het boekjaar bovenaan het menu.
    document.getElementById("nav-links").addEventListener("change", function (e) {
      var t = e.target;
      if (t && t.dataset && t.dataset.role === "kies-jaar") kiesJaar(t.value);
    });

    document.getElementById("nav-links").addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-page-type]") : null;
      if (!t) return;
      var type = t.dataset.pageType;
      if (type === "opdracht") uiState.huidigePagina = { type: type, ref: t.dataset.pageRef };
      else if (type === "controle") uiState.huidigePagina = { type: type, cat: t.dataset.pageCat };
      else uiState.huidigePagina = { type: type };
      document.getElementById("layout").classList.remove("sidebar-open");
      renderAlles();
      document.getElementById("main-content").scrollTop = 0;
      window.scrollTo(0, 0);
    });

    // T-panel
    document.getElementById("tpanel-zoek").addEventListener("input", function (e) {
      uiState.tpanelZoek = e.target.value;
      renderTpanel();
    });
    document.getElementById("tpanel-apko-knoppen").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-apko]") : null;
      if (!b) return;
      uiState.tpanelApko = b.dataset.apko;
      renderFilterKnoppen("tpanel-apko-knoppen", uiState.tpanelApko);
      var tf = { apko: uiState.tpanelApko, klasse: uiState.tpanelKlasse, rubriek: uiState.tpanelRubriek };
      pasKlasseRubriekAanApko(tf, "tpanel-klasse", "tpanel-rubriek");
      uiState.tpanelKlasse = tf.klasse;
      uiState.tpanelRubriek = tf.rubriek;
      renderTpanel();
    });
    document.getElementById("tpanel-klasse").addEventListener("change", function (e) {
      uiState.tpanelKlasse = e.target.value;
      uiState.tpanelRubriek = "";
      vulRubriekSelect(document.getElementById("tpanel-rubriek"), uiState.tpanelKlasse, "", uiState.tpanelApko);
      renderTpanel();
    });
    document.getElementById("tpanel-rubriek").addEventListener("change", function (e) {
      uiState.tpanelRubriek = e.target.value;
      renderTpanel();
    });
    document.getElementById("tpanel-detail-check").addEventListener("change", function (e) {
      uiState.tpanelDetail = !e.target.checked; // aangevinkt = enkel saldi
      renderTpanel();
    });
    document.getElementById("tpanel-leeg-check").addEventListener("change", function (e) {
      uiState.tpanelToonLeeg = e.target.checked;
      renderTpanel();
    });
    document.getElementById("tpanel-filter-reset").addEventListener("click", function () {
      uiState.tpanelZoek = "";
      uiState.tpanelApko = "";
      uiState.tpanelKlasse = "";
      uiState.tpanelRubriek = "";
      uiState.tpanelToonLeeg = false;
      document.getElementById("tpanel-zoek").value = "";
      document.getElementById("tpanel-leeg-check").checked = false;
      vulKlasseSelect(document.getElementById("tpanel-klasse"), "");
      vulRubriekSelect(document.getElementById("tpanel-rubriek"), "", "");
      renderFilterKnoppen("tpanel-apko-knoppen", "");
      renderTpanel();
    });
    document.getElementById("tpanel-collapse").addEventListener("click", function () {
      document.getElementById("layout").classList.add("tpanel-verborgen");
    });
    // Zonder deze knop waren de T-rekeningen niet meer terug te halen na een
    // klik op «.
    document.getElementById("tpanel-heropen").addEventListener("click", function () {
      document.getElementById("layout").classList.remove("tpanel-verborgen");
    });

    // Het menu links inklappen. De keuze blijft bewaard in deze browser,
    // zodat het menu bij een volgend bezoek niet opnieuw openspringt.
    var MENU_KEY = APP_SLEUTEL + "_menu_ingeklapt";
    function zetMenuIngeklapt(dicht) {
      document.getElementById("layout").classList.toggle("sidebar-verborgen", dicht);
      try { if (dicht) localStorage.setItem(MENU_KEY, "1"); else localStorage.removeItem(MENU_KEY); } catch (e) {}
    }
    try { if (localStorage.getItem(MENU_KEY) === "1") document.getElementById("layout").classList.add("sidebar-verborgen"); } catch (e) {}
    document.getElementById("sidebar-collapse").addEventListener("click", function () { zetMenuIngeklapt(true); });
    document.getElementById("sidebar-heropen").addEventListener("click", function () { zetMenuIngeklapt(false); });

    // Topbar: leerlingnaam
    var naamInput = document.getElementById("leerling-naam-input");
    naamInput.addEventListener("keydown", function (e) { if (e.key === "Enter") naamInput.blur(); });
    naamInput.addEventListener("change", function (e) {
      var naam = e.target.value.trim();
      if (!naam) { state = normaliseerState(maakLegeState(""), ""); renderAlles(); return; }
      // Als er al werk gedaan was vóór er een naam ingevuld was (en dus nog
      // niet bewaard kon worden), en er bestaat nog geen bewaard bestand
      // voor deze naam: neem dat niet-bewaarde werk over in plaats van het
      // te laten verdwijnen.
      var onbewaardWerk = !state.student && heeftEigenBoekingen(state) ? state : null;
      laadStudent(naam);
      if (onbewaardWerk && !heeftEigenBoekingen(state)) {
        state.boekingen = onbewaardWerk.boekingen;
        state.controles = onbewaardWerk.controles;
        state.resultaat = onbewaardWerk.resultaat;
        state.eindbalans = onbewaardWerk.eindbalans || {};
        state.student = naam;
      }
      saveState();
      renderAlles();
    });

    // Mobiel: menu / T-panel toggles
    document.getElementById("btn-nav-toggle").addEventListener("click", function () {
      document.getElementById("layout").classList.toggle("sidebar-open");
    });
    document.getElementById("btn-tpanel-toggle").addEventListener("click", function () {
      document.getElementById("layout").classList.toggle("tpanel-open");
    });
  }

  /* ========================================================================
     12. Opstarten
     ======================================================================== */

  function init() {
    var laatsteNaam = null;
    try { laatsteNaam = localStorage.getItem(LAATSTE_LEERLING_KEY); } catch (e) {}
    if (laatsteNaam) {
      laadStudent(laatsteNaam);
      document.getElementById("leerling-naam-input").value = laatsteNaam;
    } else {
      activeerJaar("");
    }
    vulKlasseSelect(document.getElementById("tpanel-klasse"), "");
    vulRubriekSelect(document.getElementById("tpanel-rubriek"), "", "");
    initEvents();
    renderAlles();
  }

  /* ========================================================================
     13. Brug naar koppeling.js

     app.js houdt alles voor zichzelf; dit is het enige luikje naar buiten.
     koppeling.js gebruikt het om werk op te halen, te bewaren en in te
     dienen. Ontbreekt koppeling.js, dan verandert er niets aan de app.
     ======================================================================== */

  window.APP = {
    // Het werk van het gekozen boekjaar (om in te dienen) …
    getState: function () { return state; },
    // … en alles samen (om te bewaren).
    getWerk: function () {
      if (huidigJaar) werk.jaren[huidigJaar] = state;
      return werk;
    },
    setState: function (nieuw, naam) {
      werk = normaliseerWerk(nieuw, naam !== undefined ? naam : (nieuw && nieuw.student) || "");
      activeerJaar(werk.jaar);
    },
    huidigJaar: function () { return huidigJaar; },
    jaarSoort: function () { return jaarSoort(); },
    // De instellingen (zichtbaarheid) zijn binnen: menu en jaar opnieuw opbouwen.
    herlaadZichtbaarheid: function () {
      activeerJaar(werk.jaar || huidigJaar);
      renderAlles();
    },
    // Pogingen van de zelfcontrole die nog naar de Sheet moeten.
    zelfcontroleLog: function () { return werk.zelfcontroleLog.slice(); },
    zelfcontroleVerstuurd: function (aantal) {
      werk.zelfcontroleLog.splice(0, aantal);
      saveState();
    },
    zetOpslagPrefix: function (code) {
      opslagPrefix = code ? slug(code) : "";
      try {
        if (opslagPrefix) localStorage.setItem(PREFIX_KEY, opslagPrefix);
        else localStorage.removeItem(PREFIX_KEY);
      } catch (e) { /* geblokkeerde opslag: dan werkt de app gewoon zonder */ }
    },
    laadStudent: function (naam) {
      laadStudent(naam);
      var veld = document.getElementById("leerling-naam-input");
      if (veld) veld.value = naam || "";
    },
    saveState: saveState,
    renderAlles: renderAlles,
    marBij: marBij,
    formatBedrag: formatBedrag,
    parseBedrag: parseBedrag,
    slug: slug,
    opmaakTekst: opmaakTekst,
    huidigePagina: function () { return uiState.huidigePagina.type; },
    // Voor het indienen: heeft elke rubriek met een saldo een plaats op de
    // eindbalans? Zo niet, dan is die nog niet af en gaat ze niet mee.
    isBegonnenNietGeboekt: isBegonnenNietGeboekt,
    // Naar een verrichting springen (vanuit het indienvenster).
    toonOpdracht: function (ref) {
      var def = null;
      OPDRACHTEN.forEach(function (o) { if (o.ref === ref) def = o; });
      if (!def) return;
      uiState.huidigePagina = def.categorie === "Resultaatverwerking" ? { type: "resultaat" } : { type: "opdracht", ref: ref };
      renderAlles();
      document.getElementById("main-content").scrollTop = 0;
      if (window.scrollTo) window.scrollTo(0, 0);
    },
    eindbalansVolledig: function () {
      var kaarten = balansKaarten();
      return kaarten.length > 0 && kaarten.every(function (k) { return !!state.eindbalans[k.id]; });
    },
    // Voor koppeling.js: de vaste beginboeking gaat niet mee bij het indienen
    // en telt niet als eigen werk van de leerling.
    isVasteBoeking: isVasteBoeking,
    heeftEigenBoekingen: function () { return werkHeeftEigenBoekingen(werk); },
    resultaatConfig: function () { return RES; },
  };

  document.addEventListener("DOMContentLoaded", init);
})();