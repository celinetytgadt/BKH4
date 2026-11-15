/* Testharnas voor de koppeling — Boekhoudapp 4e jaar.
 *
 * Draait de echte app in jsdom en de echte Code.gs (met SleutelCase.gs) in
 * Node, met een nagemaakte Google-omgeving ertussen. Zo wordt het volledige
 * pad getest: installatie, beheer per vestiging, aanmelden, indienen,
 * automatisch nakijken met de sleutel van de case, feedback vrijgeven en
 * terug in de app — met één script voor de drie vestigingen. De case is
 * MetWear, over zes boekjaren: zichtbaarheid per jaar en categorie, indienen
 * met het jaar voor elke ref, de zelfcontrole in het extra oefenmateriaal en
 * de aanbevelingen in de remediëring.
 *
 *   node test/test-koppeling.js
 *
 * Nodig: jsdom (npm install jsdom). Staat het niet in de gewone zoekpaden,
 * zet dan JSDOM_PAD op de map node_modules waar het wel staat.
 */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");

let JSDOM;
try { ({ JSDOM } = require(process.env.JSDOM_PAD ? path.join(process.env.JSDOM_PAD, "jsdom") : "jsdom")); }
catch (e) { console.error("jsdom niet gevonden. Installeer het met: npm install jsdom (of zet JSDOM_PAD)."); process.exit(1); }

const BRON = path.join(__dirname, "..");
const APP = path.join(os.tmpdir(), "bkh4-test-app");

/* ===================== testkopie van de app ===================== */

fs.rmSync(APP, { recursive: true, force: true });
["", "css", "js"].forEach((m) => fs.mkdirSync(path.join(APP, m), { recursive: true }));
fs.copyFileSync(path.join(BRON, "index.html"), path.join(APP, "index.html"));
fs.copyFileSync(path.join(BRON, "css/style.css"), path.join(APP, "css/style.css"));
fs.readdirSync(path.join(BRON, "js")).forEach((b) => fs.copyFileSync(path.join(BRON, "js", b), path.join(APP, "js", b)));
fs.writeFileSync(path.join(APP, "js/config-koppeling.js"), fs.readFileSync(path.join(BRON, "js/config-koppeling.js"), "utf8")
  .replace(/webAppUrl: "[^"]*"/, 'webAppUrl: "https://fake/exec"').replace(/sleutel: "[^"]*"/, 'sleutel: "TEST"'));

const CODE_GS = fs.readFileSync(path.join(BRON, "apps-script/Code.gs"), "utf8")
  .replace(/var SLEUTEL = "[^"]*";/, 'var SLEUTEL = "TEST";');
const SLEUTEL_GS = fs.readFileSync(path.join(BRON, "apps-script/SleutelCase.gs"), "utf8");

let fouten = 0;
function check(naam, voorwaarde, extra) {
  console.log((voorwaarde ? "  ok   " : "  FOUT ") + naam + (voorwaarde || extra === undefined ? "" : "  -> " + JSON.stringify(extra)));
  if (!voorwaarde) fouten++;
}
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===================== nagemaakte Google-omgeving ===================== */

class Range {
  constructor(sheet, r, c, nr, nc) { Object.assign(this, { sheet, r, c, nr, nc }); }
  getValues() {
    const uit = [];
    for (let i = 0; i < this.nr; i++) {
      const rij = [];
      for (let j = 0; j < this.nc; j++) rij.push(this.sheet.cel(this.r + i, this.c + j));
      uit.push(rij);
    }
    return uit;
  }
  setValues(v) { v.forEach((rij, i) => rij.forEach((w, j) => this.sheet.zet(this.r + i, this.c + j, w))); return this; }
  getValue() { return this.sheet.cel(this.r, this.c); }
  setValue(v) { this.sheet.zet(this.r, this.c, v); return this; }
  clearContent() { for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sheet.zet(this.r + i, this.c + j, ""); this.sheet.knip(); return this; }
  insertCheckboxes() { return this; }
  setDataValidation() { return this; }
  setNumberFormat() { return this; }
  setWrap() { return this; }
  setVerticalAlignment() { return this; }
  setFontWeight() { return this; }
  setBackground() { return this; }
  setBackgrounds() { return this; }
  setNotes(n) { this.sheet.notities = this.sheet.notities || {}; n.forEach((rij, i) => rij.forEach((t, j) => { this.sheet.notities[(this.r + i) + "," + (this.c + j)] = t; })); return this; }
  getSheet() { return this.sheet; }
  getColumn() { return this.c; }
  getNumColumns() { return this.nc; }
  createFilter() { this.sheet.filter = {}; return this; }
  getRow() { return this.r; }
}

class Sheet {
  constructor(naam) { this.naam = naam; this.rijen = []; }
  cel(r, c) { return (this.rijen[r - 1] || [])[c - 1] ?? ""; }
  zet(r, c, v) {
    while (this.rijen.length < r) this.rijen.push([]);
    const rij = this.rijen[r - 1];
    while (rij.length < c) rij.push("");
    rij[c - 1] = v;
  }
  // Lege rijen onderaan tellen niet mee in getLastRow, zoals in Sheets.
  knip() { while (this.rijen.length && this.rijen[this.rijen.length - 1].every((x) => x === "")) this.rijen.pop(); }
  getName() { return this.naam; }
  getLastRow() { this.knip(); return this.rijen.length; }
  getLastColumn() { return Math.max(0, ...this.rijen.map((r) => { let n = r.length; while (n && r[n - 1] === "") n--; return n; })); }
  getMaxRows() { return Math.max(this.rijen.length + 100, 200); }
  getRange(a, b, c, d) {
    if (typeof a === "string") return new Range(this, 1, 1, this.getMaxRows(), 20);
    return new Range(this, a, b, c ?? 1, d ?? 1);
  }
  insertColumnBefore(k) { this.rijen.forEach((r) => { if (r.length >= k) r.splice(k - 1, 0, ""); }); return this; }
  setColumnWidth() { return this; }
  setFrozenRows() { return this; }
  setConditionalFormatRules() { return this; }
  getFilter() { return this.filter || null; }
  getActiveCell() { return new Range(this, this.actieveRij || 2, 1, 1, 1); }
}

const sheets = {};
const ss = { getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => (sheets[n] = new Sheet(n)) };

/* Drive API v3 (geavanceerde dienst) met enkel toegang "drive.file": het
   script ziet enkel wat het zelf aanmaakte. De bestanden die er al stonden
   (van iemand anders) mogen dus nooit opduiken. */
const drive = {};          // id -> { id, name, mimeType, parents, inhoud, trashed, createdTime, vanScript }
let volgnr = 0;
const nu = () => new Date(Date.now() + volgnr * 1000).toISOString();
function nieuwId() { return "id" + (++volgnr); }
// Een map van iemand anders in de Drive: die mag het script niet zien.
drive.vreemd = { id: "vreemd", name: "Boekhoudapp 4e jaar werkbestanden", mimeType: "application/vnd.google-apps.folder",
  parents: [], trashed: false, createdTime: nu(), vanScript: false };
const zichtbaar = (f) => f && f.vanScript;
function voldoet(f, q) {
  return q.split(" and ").every((deel) => {
    deel = deel.trim();
    let m;
    if ((m = deel.match(/^'(.+)' in parents$/))) return f.parents.indexOf(m[1]) !== -1;
    if ((m = deel.match(/^name = '(.+)'$/))) return f.name === m[1].replace(/\\'/g, "'");
    if ((m = deel.match(/^mimeType = '(.+)'$/))) return f.mimeType === m[1];
    if ((m = deel.match(/^mimeType != '(.+)'$/))) return f.mimeType !== m[1];
    if (deel === "trashed = false") return !f.trashed;
    throw new Error("zoekvraag niet begrepen: " + deel);
  });
}
const DRIVE = {
  Files: {
    list: (o) => ({ files: Object.values(drive).filter((f) => zichtbaar(f) && voldoet(f, o.q))
      .map((f) => ({ id: f.id, name: f.name, createdTime: f.createdTime })) }),
    get: (id) => { const f = drive[id]; if (!zichtbaar(f)) throw new Error("File not found: " + id);
      return { id: f.id, name: f.name, trashed: f.trashed, webViewLink: "https://drive.google.com/drive/folders/" + f.id }; },
    create: (meta, blob) => {
      (meta.parents || []).forEach((p) => { if (!zichtbaar(drive[p])) throw new Error("geen toegang tot map " + p); });
      const f = { id: nieuwId(), name: meta.name, mimeType: meta.mimeType, parents: meta.parents || ["root"],
        inhoud: blob ? blob.tekst : "", trashed: false, createdTime: nu(), vanScript: true };
      drive[f.id] = f;
      return { id: f.id };
    },
    update: (meta, id, blob) => {
      const f = drive[id]; if (!zichtbaar(f)) throw new Error("File not found: " + id);
      if (meta.trashed) f.trashed = true;
      if (blob) f.inhoud = blob.tekst;
      return { id };
    },
  },
};
const bestandMet = (naam) => Object.values(drive).find((f) => f.name === naam && !f.trashed);
const opgehaald = [];      // welke adressen het script via UrlFetchApp opvroeg

const props = {};
let laatsteAlert = "";
let prompts = [];          // wat de "leerkracht" na elkaar in prompts tikt
let actieveRij = 2;
let actiefBlad = "Inzendingen LEU";

const omgeving = {
  console, JSON, Date, Math, String, Number, Object, Array, Error, isNaN, parseInt, parseFloat,
  SpreadsheetApp: {
    getActiveSpreadsheet: () => ss,
    getActiveSheet: () => { const s = sheets[actiefBlad]; s.actieveRij = actieveRij; return s; },
    flush: () => {},
    getUi: () => ({
      alert: (t, b, c) => { laatsteAlert = c === undefined ? t : t + "\n" + b; return "YES"; },
      prompt: () => { const t = prompts.shift() || ""; return { getSelectedButton: () => "OK", getResponseText: () => t }; },
      Button: { OK: "OK", YES: "YES", NO: "NO" },
      ButtonSet: { OK_CANCEL: "ok_cancel", YES_NO: "yes_no" },
      createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() {} }),
    }),
    newDataValidation: () => ({ requireValueInList() { return this; }, setAllowInvalid() { return this; }, build: () => ({}) }),
    newConditionalFormatRule: () => ({ whenTextEqualTo() { return this; }, setBackground() { return this; }, setRanges() { return this; }, build: () => ({}) }),
  },
  ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ tekst: t, setMimeType() { return this; } }) },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  Drive: DRIVE,
  ScriptApp: { getOAuthToken: () => "token" },
  UrlFetchApp: {
    fetch: (url) => {
      opgehaald.push(url);
      const id = decodeURIComponent((url.match(/files\/([^?]+)/) || [])[1] || "");
      const f = drive[id];
      if (!zichtbaar(f) || f.trashed) return { getResponseCode: () => 404, getContentText: () => "" };
      return { getResponseCode: () => 200, getContentText: () => f.inhoud };
    },
  },
  Session: { getScriptTimeZone: () => "Europe/Brussels" },
  Utilities: {
    newBlob: (tekst) => ({ tekst: String(tekst) }),
    formatDate: (d, tz, pat) => {
      const p = (n) => String(n).padStart(2, "0");
      return pat.replace("yyyy", d.getFullYear()).replace("MMdd", p(d.getMonth() + 1) + p(d.getDate()))
        .replace("MM", p(d.getMonth() + 1)).replace("dd", p(d.getDate()))
        .replace("HHmmss", p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()))
        .replace("HHmm", p(d.getHours()) + p(d.getMinutes())).replace("d", d.getDate());
    },
  },
};
vm.createContext(omgeving);
vm.runInContext(CODE_GS + "\n" + SLEUTEL_GS, omgeving);

let werkVertraging = 0;   // ms: het werk komt traag terug van de server
let serverHangt = false;  // nagebootst: Google laat de web-app wachten
let serverWeg = false;    // nagebootst: de web-app is onbereikbaar
function server(url, opts) {
  const u = new URL(url);
  if (serverHangt) return new Promise(() => {});
  if (serverWeg) return Promise.reject(new Error("netwerkfout"));
  let r;
  if (!opts || opts.method === "GET") {
    const parameter = {};
    u.searchParams.forEach((v, k) => (parameter[k] = v));
    r = omgeving.doGet({ parameter });
  } else {
    r = omgeving.doPost({ postData: { contents: opts.body } });
  }
  const antwoord = { ok: true, status: 200, text: () => Promise.resolve(r.tekst) };
  if (werkVertraging && u.searchParams.get("actie") === "werk") {
    return new Promise((klaar) => setTimeout(() => klaar(antwoord), werkVertraging));
  }
  return Promise.resolve(antwoord);
}
const get = (p) => server("https://fake/exec?" + new URLSearchParams(Object.assign({ sleutel: "TEST" }, p))).then((r) => r.text()).then(JSON.parse);
const post = (d) => server("https://fake/exec", { method: "POST", body: JSON.stringify(Object.assign({ sleutel: "TEST" }, d)) }).then((r) => r.text()).then(JSON.parse);

/* ===================== de app in jsdom ===================== */

async function start(vooraf) {
  const html = fs.readFileSync(path.join(APP, "index.html"), "utf8");
  const bronnen = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  const dom = new JSDOM(html.replace(/<script src="[^"]+"><\/script>/g, ""), {
    runScripts: "dangerously", url: "https://test.local/", pretendToBeVisual: true,
    // Onthouden of jsdom DOMContentLoaded al vuurde: readyState staat soms
    // al op "interactive" vóór het event komt. Dan óók zelf dispatchen liet
    // init() van app.js twee keer lopen (elke klik telde dubbel).
    beforeParse(win) { win.document.addEventListener("DOMContentLoaded", () => { win.__dclGevuurd = true; }); },
  });
  dom.window.fetch = server;
  dom.window.navigator.sendBeacon = () => true;
  dom.window.scrollTo = () => {};
  // Wat een andere app op hetzelfde adres (celinetytgadt.github.io) al in de
  // browser bewaarde, bv. de app van kern 8.
  Object.keys(vooraf || {}).forEach((k) => dom.window.localStorage.setItem(k, vooraf[k]));
  const laad = (b) => {
    const s = dom.window.document.createElement("script");
    // Zonder het versienummer (?v=…) dat achter elk script staat.
    s.textContent = fs.readFileSync(path.join(APP, b.split("?")[0]), "utf8");
    dom.window.document.head.appendChild(s);
  };
  // js/koppeling.js en js/beheer.js komen pas na het opstarten van app.js,
  // zoals in de browser. js/config-koppeling.js hoort daar NIET bij: die
  // moet vóór app.js geladen zijn, net als in index.html.
  const laatst = (b) => /^js\/(koppeling|beheer)\.js(\?|$)/.test(b);
  bronnen.filter((b) => !laatst(b)).forEach(laad);
  if (!dom.window.__dclGevuurd) {
    await new Promise((res) => dom.window.document.addEventListener("DOMContentLoaded", res, { once: true }));
  } else {
    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  }
  bronnen.filter(laatst).forEach(laad);
  await wacht(60);
  return dom;
}

// De sleutel van de case als boekingen, voor één ref met het jaar ervoor
// ("20X2 AK01").
const SLEUTEL = vm.runInNewContext(SLEUTEL_GS.slice(SLEUTEL_GS.indexOf("var SLEUTEL_CASE"), SLEUTEL_GS.indexOf("var RESULTAATVERWERKING") > 0 ? SLEUTEL_GS.indexOf("var RESULTAATVERWERKING") : undefined) + "; SLEUTEL_CASE");
function boekingVolgensSleutel(sleutelRef) {
  return {
    geboekt: true,
    rows: SLEUTEL.filter((r) => r[0] === sleutelRef).map((r) => ({
      bedrag: r[3], rekening: r[1], dc: r[2], relatie: "", redenering: "", apko: "", stijgtDaalt: "", klasse: "", rubriek: "",
    })),
  };
}

// Wat Leuven openzet: de cursus, de taak (zonder btw), de consolidatie, het
// extra oefenmateriaal met zelfcontrole en de remediëring.
// De taken van aankopen en verkopen (zie js/data-opdrachten.js).
const AK1 = "Aankopen taak 1: eenvoudige facturen";
const AK2 = "Aankopen taak 2: handelskorting & transportkosten";
const VK1 = "Verkopen taak 1: eenvoudige facturen";
const VK2 = "Verkopen taak 2: handelskorting & extra kosten";
const ZICHT_LEU = {
  "20X1": { open: true, cats: { Aankopen: true } },
  "20X2": { open: true, cats: { [AK1]: true, [AK2]: true, [VK1]: true, [VK2]: true, "Financiële verrichtingen": true, Eindejaar: true },
    saldibalans: true, relaties: true },
  "20X3": { open: true, relaties: true },
  "20X4": { open: true, cats: { [AK1]: true }, zelfcontrole: true },
  "20X5": { open: true, cats: { [AK1]: true, [VK1]: true } },
};

async function kiesJaar(win, jaar) {
  const sel = win.document.querySelector('[data-role="kies-jaar"]');
  sel.value = jaar;
  sel.dispatchEvent(new win.Event("change", { bubbles: true }));
  await wacht(20);
}

/* ===================== de test ===================== */

(async () => {
  console.log("\n1. Installatie van de ene Sheet");
  omgeving.installeer();
  const TABS = ["Klas", "Inzendingen", "Detail", "Instellingen", "Taken", "Zelfcontrole"];
  check("eigen tabbladen per vestiging", ["LEU", "SKW", "TW"].every((v) => TABS.every((t) => sheets[t + " " + v])),
    Object.keys(sheets));
  check("geen gedeelde tabbladen Klas of Inzendingen", !sheets.Klas && !sheets.Inzendingen, Object.keys(sheets));
  check("Klas: naam | code | opmerking", sheets["Klas LEU"].cel(1, 1) === "naam", sheets["Klas LEU"].rijen[0]);
  check("Inzendingen zonder kolom vestiging", sheets["Inzendingen LEU"].cel(1, 2) === "leerling", sheets["Inzendingen LEU"].rijen[0]);
  check("Taken: per categorie van de taak, de consolidaties als geheel",
    ["20X2 · " + AK1, "20X2 · Eindejaar", "20X3 · Consolidatie", "20X6 · Consolidatie 2"].every((t) => sheets["Taken TW"].rijen.some((r) => r[0] === t)) &&
    !sheets["Taken TW"].rijen.some((r) => /^20X[145]/.test(r[0])), sheets["Taken TW"].rijen.map((r) => r[0]));
  check("Instellingen: zichtbaarheid en aanbevolen", ["zichtbaarheid", "aanbevolen"].every((k) => sheets["Instellingen LEU"].rijen.some((x) => x[0] === k)));
  check("sleutel van de case ingevuld", sheets.Sleutel.getLastRow() - 1 === SLEUTEL.length, [sheets.Sleutel.getLastRow(), SLEUTEL.length]);
  check("sleutel bevat enkel de taak en de consolidaties", SLEUTEL.every((r) => /^20X[236] /.test(r[0])), SLEUTEL.find((r) => !/^20X[236] /.test(r[0])));
  check("melding vermeldt de sleutel", /sleutel van de case staat al klaar/.test(laatsteAlert), laatsteAlert.slice(0, 200));

  // Een expertcode per vestiging, via het menu.
  [["LEU", "1111"], ["SKW", "2222"], ["TW", "3333"]].forEach(([v, c]) => { prompts = [v, c]; omgeving.zetExpertcode(); });
  const expert = (v) => sheets["Instellingen " + v].rijen.find((x) => x[0] === "expertcode")[1];
  check("expertcode per vestiging", expert("LEU") === "1111" && expert("SKW") === "2222" && expert("TW") === "3333",
    [expert("LEU"), expert("SKW"), expert("TW")]);

  console.log("\n2. Beheer per vestiging");
  let r = await post({ actie: "beheerBewaren", vestiging: "LEU", expertcode: "1111",
    klas: [{ naam: "Lotte V." }, { naam: "Youssef B." }],
    taken: [{ categorie: "20X2 · " + AK1, link: "https://classroom.google.com/c/LEU/a/1/details" }],
    instellingen: { zichtbaarheid: JSON.stringify(ZICHT_LEU), aanbevolen: JSON.stringify({ lottev: [VK1], youssefb: ["Eindejaar"] }) } });
  check("bewaren voor Leuven lukt", r.ok === true, r);
  check("antwoord van beheer geeft geen aanbevelingen mee in de instellingen", !("aanbevolen" in r.instellingen), r.instellingen);
  r = await post({ actie: "beheerBewaren", vestiging: "TW", expertcode: "1111", klas: [] });
  check("code van Leuven geeft geen toegang tot Tielt-Winge", !r.ok, r);
  r = await post({ actie: "beheerBewaren", vestiging: "TW", expertcode: "3333",
    klas: [{ naam: "Lotte V." }], taken: [{ categorie: "20X2 · " + AK1, link: "https://classroom.google.com/c/TW/a/9/details" }],
    instellingen: { mededeling: "Indienen tot vrijdag (TW)" } });
  check("bewaren voor Tielt-Winge lukt", r.ok === true, r);
  const klasLeu = sheets["Klas LEU"].rijen.slice(1).filter((x) => x[0]);
  const klasTw = sheets["Klas TW"].rijen.slice(1).filter((x) => x[0]);
  check("Leuven in Klas LEU, Tielt-Winge in Klas TW", klasLeu.length === 2 && klasTw.length === 1, [klasLeu, klasTw]);
  const codeLeu = String(klasLeu.find((x) => x[0] === "Lotte V.")[1]);
  const codeTw = String(klasTw[0][1]);
  check("codes aangemaakt", /^\d{4}$/.test(codeLeu) && /^\d{4}$/.test(codeTw), [codeLeu, codeTw]);
  check("taken in het eigen tabblad", sheets["Taken LEU"].rijen.some((x) => x[0] === "20X2 · " + AK1 && /LEU/.test(x[1])) &&
    sheets["Taken TW"].rijen.some((x) => x[0] === "20X2 · " + AK1 && /TW/.test(x[1])));
  check("mededeling enkel bij Tielt-Winge",
    sheets["Instellingen TW"].rijen.some((x) => x[0] === "mededeling" && /TW/.test(x[1])) &&
    !sheets["Instellingen LEU"].rijen.some((x) => x[0] === "mededeling" && x[1]));
  r = await post({ actie: "beheerBewaren", vestiging: "LEU", expertcode: "fout", klas: [] });
  check("verkeerde expertcode geweigerd, klas onaangeroerd", !r.ok && sheets["Klas LEU"].rijen.slice(1).filter((x) => x[0]).length === 2, r);
  sheets["Klas SKW"].zet(2, 1, "Amal T.");
  omgeving.genereerCodes();
  check("codes genereren werkt in elke Klas", /^\d{4}$/.test(String(sheets["Klas SKW"].cel(2, 2))), sheets["Klas SKW"].rijen);
  sheets["Klas SKW"].zet(2, 1, ""); sheets["Klas SKW"].zet(2, 2, "");

  console.log("\n3. Instellingen per vestiging");
  let iLeu = await get({ actie: "instellingen", vestiging: "LEU" });
  let iTw = await get({ actie: "instellingen", vestiging: "TW" });
  let iSkw = await get({ actie: "instellingen", vestiging: "SKW" });
  check("mededeling per vestiging", iTw.instellingen.mededeling === "Indienen tot vrijdag (TW)" && !iLeu.instellingen.mededeling,
    [iLeu.instellingen.mededeling, iTw.instellingen.mededeling]);
  check("Leuven ziet enkel haar leerlingen", JSON.stringify(iLeu.klas) === JSON.stringify(["Lotte V.", "Youssef B."]), iLeu.klas);
  check("Tielt-Winge ziet enkel haar leerling", JSON.stringify(iTw.klas) === JSON.stringify(["Lotte V."]), iTw.klas);
  check("Katelijne heeft nog niemand", iSkw.klas.length === 0, iSkw.klas);
  check("taaklink per vestiging", /LEU/.test(iLeu.taken["20X2 · " + AK1]) && /TW/.test(iTw.taken["20X2 · " + AK1]), [iLeu.taken, iTw.taken]);
  check("geen codes naar buiten", !JSON.stringify(iLeu).includes(codeLeu));
  check("zichtbaarheid publiek, per vestiging", JSON.parse(iLeu.instellingen.zichtbaarheid)["20X4"].zelfcontrole === true &&
    JSON.stringify(JSON.parse(iTw.instellingen.zichtbaarheid)) === "{}", [iLeu.instellingen.zichtbaarheid, iTw.instellingen.zichtbaarheid]);
  check("aanbevelingen (met namen) nooit publiek", !JSON.stringify(iLeu).includes("lottev") && !("aanbevolen" in iLeu.instellingen), iLeu);
  const zonder = await get({ actie: "instellingen" });
  check("verzoek zonder vestiging geweigerd", !zonder.ok && /vestiging/.test(zonder.fout), zonder);

  console.log("\n4. Aanmelden in de app");
  const dom = await start({
    boekhoudapp_aanmelding: JSON.stringify({ vestiging: "LEU", naam: "test", code: "1234" }),
    boekhoudapp_laatste_leerling: "test",
    boekhoudapp_vestiging: "leu",
    boekhoudapp_data_leu_test: JSON.stringify({ student: "test", boekingen: { AK01: { geboekt: true, rows: [] } } }),
    boekhoudapp_feedback_LEU_test: JSON.stringify({ AK01: [{ beoordeling: "In orde" }] }),
  });
  const w = dom.window;
  check("negeert de aanmelding en het werk van een andere app",
    w.APP.getState().student === "" && !w.APP.getState().boekingen.AK01 && w.document.getElementById("leerling-code").value === "",
    [w.APP.getState().student, Object.keys(w.APP.getState().boekingen)]);
  const doc = w.document;
  check("niets zichtbaar zolang de school niet gekozen is", w.APP.huidigJaar() === "" && !doc.querySelector('[data-role="kies-jaar"]'), w.APP.huidigJaar());
  check("beginbalans telt niet als eigen werk", w.APP.heeftEigenBoekingen() === false);
  check("Beheer staat in het menu, ook als er nog niets open staat", !!doc.querySelector('[data-page-type="beheer"]'));
  const vestSel = doc.getElementById("vestiging-select");
  const selVoor = doc.getElementById("leerling-select");
  check("vóór de schoolkeuze: grijze keuzelijst, geen vrij naamveld",
    !selVoor.hidden && selVoor.disabled && /kies eerst je school/.test(selVoor.textContent) &&
    doc.getElementById("leerling-naam-input").hidden && doc.getElementById("btn-aanmelden").disabled, selVoor.outerHTML);
  check("vestigingskeuze zichtbaar met drie scholen", vestSel.hidden === false && vestSel.options.length === 4, vestSel.options.length);
  vestSel.value = "LEU";
  vestSel.dispatchEvent(new w.Event("change"));
  await wacht(60);
  const jaarOpties = [...doc.querySelectorAll('[data-role="kies-jaar"] option')].map((o) => o.value);
  check("enkel de opengezette jaren in de keuzelijst", jaarOpties.join(",") === "20X1,20X2,20X3,20X4,20X5", jaarOpties);
  const sel = doc.getElementById("leerling-select");
  check("namen van Leuven in de keuzelijst", sel.options.length === 3, [...sel.options].map((o) => o.value));
  check("niet aangemeld: Aanmelden zichtbaar, Afmelden verborgen",
    doc.getElementById("btn-aanmelden").hidden === false && doc.getElementById("btn-afmelden").hidden === true);
  sel.value = "Lotte V.";
  doc.getElementById("leerling-code").value = codeTw;   // code van de andere school
  doc.getElementById("btn-aanmelden").click();
  await wacht(80);
  check("code van een andere vestiging geweigerd", /klopt niet/.test(doc.getElementById("koppeling-status").textContent),
    doc.getElementById("koppeling-status").textContent);
  doc.getElementById("leerling-code").value = codeLeu;
  doc.getElementById("btn-aanmelden").click();
  await wacht(120);
  check("aangemeld als Lotte V. van Leuven", w.APP.getState().student === "Lotte V.", w.APP.getState().student);
  check("aangemeld: Afmelden zichtbaar, Aanmelden en codeveld weg, naam vast",
    doc.getElementById("btn-afmelden").hidden === false && doc.getElementById("btn-aanmelden").hidden === true &&
    doc.getElementById("leerling-code").hidden === true && doc.getElementById("leerling-select").disabled === true,
    [doc.getElementById("btn-afmelden").hidden, doc.getElementById("btn-aanmelden").hidden]);
  check("bewaart onder het eigen voorvoegsel bkh4_",
    JSON.parse(w.localStorage.getItem("bkh4_aanmelding")).naam === "Lotte V." &&
      Object.keys(w.localStorage).filter((k) => /^boekhoudapp_/.test(k)).length === 5,
    Object.keys(w.localStorage));
  check("kern 8-gegevens in de browser bleven onaangeroerd", JSON.parse(w.localStorage.getItem("boekhoudapp_aanmelding")).naam === "test");

  console.log("\n5. De cursus (20X1)");
  await kiesJaar(w, "20X1");
  check("20X1: enkel de opengezette categorie", w.eval("CATEGORIE_VOLGORDE").join("|") === "Aankopen", w.eval("CATEGORIE_VOLGORDE"));
  check("20X1: alles staat al geboekt", w.eval("OPDRACHTEN").every((o) => w.APP.getState().boekingen[o.ref] && w.APP.getState().boekingen[o.ref].geboekt));
  doc.querySelector('.nav-link[data-page-ref="AK01"]').click();
  await wacht(20);
  check("20X1: document zonder redeneerschema", !doc.querySelector("table.redeneerschema") && !!doc.querySelector(".pagina-titel"),
    doc.getElementById("pagina-inhoud").textContent.slice(0, 200));
  check("20X1: geen indienknop", doc.getElementById("btn-indienen").hidden === true);

  console.log("\n6. Het redeneerschema (20X2)");
  await kiesJaar(w, "20X2");
  check("20X2: beginbalans staat al geboekt", w.APP.getState().boekingen.BB && w.APP.getState().boekingen.BB.geboekt === true);
  check("20X2: btw-verrekening nog niet opengezet", w.eval("CATEGORIE_VOLGORDE").indexOf("Btw-verrekening") === -1, w.eval("CATEGORIE_VOLGORDE"));
  check("20X2: indienknop zichtbaar", doc.getElementById("btn-indienen").hidden === false);
  check("20X2: geen beginbalans meer in het menu", w.eval("CATEGORIE_VOLGORDE").indexOf("Beginbalans") === -1 &&
    !doc.querySelector('.nav-link[data-page-ref="BB"]'), w.eval("CATEGORIE_VOLGORDE"));
  check("20X2: taken in het menu onder de kop Aankopen", [...doc.querySelectorAll(".nav-groep")].map((x) => x.textContent).join("|") === "Aankopen|Verkopen" &&
    [...doc.querySelectorAll(".nav-categorie")].some((x) => /^Taak 1: eenvoudige facturen/.test(x.textContent)),
    [...doc.querySelectorAll(".nav-groep, .nav-categorie")].map((x) => x.textContent));
  check("20X2: proef- en saldibalans en klanten & leveranciers opengezet", !!doc.querySelector('[data-page-type="saldibalans"]') &&
    !!doc.querySelector('[data-page-type="relaties"]'));
  const tRefs = () => [...doc.querySelectorAll("#tpanel-lijst .trek-regel .ref")].map((x) => x.textContent);
  w.APP.renderAlles();
  check("T-rekeningen standaard zonder beginbalans", !tRefs().includes("BB"), tRefs().slice(0, 10));
  doc.querySelector('.nav-link[data-page-type="controle"][data-page-cat="' + AK1 + '"]').click();
  await wacht(20);
  const vragenAK1 = [...doc.querySelectorAll(".controle-vraag label span")].map((x) => x.textContent);
  check("controles AK taak 1: één vraag per T-rekening", vragenAK1.join("|") ===
    "Staat elke aankoopfactuur op de rekening 440000 Leveranciers?|Staat de btw van elke aankoopfactuur op de rekening 411000 Aftrekbare btw?|" +
    "Staan de aangekochte handelsgoederen op de rekening 604000 Aankopen handelsgoederen?", vragenAK1);
  const tV = doc.querySelectorAll(".controle-t-verwacht");
  check("controles AK taak 1: de T-rekening zoals ze moet staan", tV.length === 3 && /440000/.test(tV[0].textContent) &&
    /AK01/.test(tV[0].querySelector(".trek-kant.credit").textContent) && /AK02/.test(tV[0].querySelector(".trek-kant.credit").textContent) &&
    !/BB/.test(tV[0].textContent), tV.length && tV[0].textContent);
  doc.querySelector('.nav-link[data-page-ref="AK01"]').click();
  await wacht(20);
  const koppen = [...doc.querySelectorAll("table.redeneerschema thead th")].map((t) => t.textContent.trim().toLowerCase());
  check("kolommen in de volgorde van het stappenplan",
    /bedrag.*redenering.*a\/p\/k\/o.*\+.*klasse.*rubriek.*rekening.*d\/c/.test(koppen.join("|")), koppen);
  const veldIn = (f) => doc.querySelector('[data-scope="AK01"][data-row="0"][data-field="' + f + '"]');
  check("klasse, rubriek en rekening dicht tot A/P/K/O gekozen is", veldIn("klasse").disabled && veldIn("rubriek").disabled && veldIn("rekening").disabled);
  const kies = (f, v) => { const e = veldIn(f); e.value = v; e.dispatchEvent(new w.Event("change", { bubbles: true })); };
  kies("apko", "K");
  const klassen = [...veldIn("klasse").options].map((o) => o.value).filter(Boolean);
  check("K: enkel klasse 6", klassen.join(",") === "6", klassen);
  kies("klasse", "6");
  const rubrieken = [...veldIn("rubriek").options].map((o) => o.value).filter(Boolean);
  check("klasse 6: enkel rubrieken 6x", rubrieken.length > 1 && rubrieken.every((x) => /^6/.test(x)), rubrieken);
  check("rekening nog dicht zonder rubriek", veldIn("rekening").disabled);
  kies("rubriek", "60");
  check("rekening open na de rubriek, met de rekeningen van 60", !veldIn("rekening").disabled &&
    [...doc.querySelectorAll("datalist option")].every((o) => /^60/.test(o.value)));
  const rij0 = w.APP.getState().boekingen.AK01.rows[0];
  rij0.bedrag = "1100"; rij0.rekening = "604000"; rij0.dc = "D";
  w.APP.renderAlles();
  check("lijn zonder + of − is onvolledig", !!doc.querySelector("tr.rij-onvolledig"));
  kies("stijgtDaalt", "+");
  check("lijn volledig (redenering mag leeg)", !doc.querySelector("tr.rij-onvolledig"), doc.querySelector("tr.rij-onvolledig") && doc.querySelector("tr.rij-onvolledig").textContent);
  w.APP.getState().boekingen.AK01.rows.push({ bedrag: "1331", rekening: "440000", dc: "C", apko: "P", stijgtDaalt: "+", klasse: "4", rubriek: "44", redenering: "", relatie: "" });
  w.APP.renderAlles();
  const relSel = doc.querySelector('[data-scope="AK01"][data-row="1"][data-field="relatie"]');
  check("leverancier kies je uit een lijst (geen vrij veld)", relSel && relSel.tagName === "SELECT" && relSel.options.length > 5,
    relSel && relSel.outerHTML.slice(0, 120));
  check("leveranciersregel wordt niet automatisch toegevoegd", w.APP.getState().boekingen.AK01.rows.length === 2);
  check("zonder leverancier nog niet volledig", !!doc.querySelector("tr.rij-onvolledig"));

  console.log("\n7. Boeken en indienen van 20X2 · Aankopen taak 1");
  const st = w.APP.getState();
  const akRefs = w.eval("OPDRACHTEN").filter((o) => o.categorie === AK1).map((o) => o.ref);
  check("aankopen taak 1: AK01 en AK02", akRefs.join(",") === "AK01,AK02", akRefs);
  akRefs.forEach((ref) => { st.boekingen[ref] = boekingVolgensSleutel("20X2 " + ref); });
  // AK02 met een fout: de eerste rekening vervangen.
  const foutRek = st.boekingen.AK02.rows[0].rekening;
  st.boekingen.AK02.rows[0].rekening = foutRek === "604000" ? "600000" : "604000";
  w.APP.saveState();
  doc.getElementById("btn-indienen").click();
  await wacht(40);
  const venster = doc.querySelector(".koppeling-overlay");
  const cats = [...venster.querySelectorAll("[data-cat]")].map((v) => v.dataset.cat);
  check("Beginbalans staat niet in het indienvenster", cats.indexOf("Beginbalans") === -1, cats);
  check("de opengezette categorieën en de afsluiting in het indienvenster",
    [AK1, AK2, VK1, VK2, "Financiële verrichtingen", "Eindejaar", "Resultaatverwerking", "Eindbalans"].every((c) => cats.includes(c)) &&
    !cats.includes("Btw-verrekening"), cats);
  const vink = [...venster.querySelectorAll("[data-cat]")].find((v) => v.dataset.cat === AK1);
  vink.checked = true;
  vink.dispatchEvent(new w.Event("change"));
  venster.querySelector("#btn-indienen-bevestig").click();
  await wacht(40);
  venster.querySelector('[data-role="bevestig-ja"]').click();
  await wacht(150);
  check("ingediend", !!venster.querySelector(".melding-ok"), venster.textContent.slice(0, 120));
  check("Classroom-knop met de link van Leuven en de naam van de taak", /c\/LEU\//.test(venster.innerHTML) && venster.textContent.includes("20X2 · " + AK1 + " in Classroom"),
    venster.textContent.slice(0, 300));
  const inz = sheets["Inzendingen LEU"];
  const inzTw = sheets["Inzendingen TW"];
  const rij = (ref) => inz.rijen.find((x) => x[3] === ref);
  check("één rij per document in Inzendingen LEU", inz.getLastRow() === akRefs.length + 1, inz.getLastRow());
  check("ref en categorie met het jaar ervoor", rij("20X2 AK01") && rij("20X2 AK01")[2] === "20X2 · " + AK1, inz.rijen[1]);
  check("Inzendingen TW is nog leeg", inzTw.getLastRow() === 1, inzTw.getLastRow());
  check("AK01 automatisch In orde", rij("20X2 AK01")[6] === "In orde", rij("20X2 AK01")[11]);
  check("alle andere aankopen ook In orde", akRefs.filter((x) => x !== "AK02").every((x) => rij("20X2 " + x)[6] === "In orde"),
    akRefs.filter((x) => rij("20X2 " + x)[6] !== "In orde").map((x) => [x, rij("20X2 " + x)[11]]));
  check("AK02 automatisch Te remediëren", rij("20X2 AK02")[6] === "Te remediëren" && new RegExp(foutRek).test(rij("20X2 AK02")[11]), rij("20X2 AK02")[11]);
  check("Detail LEU gevuld, Detail TW leeg", sheets["Detail LEU"].getLastRow() > 1 && sheets["Detail TW"].getLastRow() === 1);
  check("Detail: kolommen klasse en rubriek", sheets["Detail LEU"].cel(1, 14) === "klasse" && sheets["Detail LEU"].cel(1, 15) === "rubriek", sheets["Detail LEU"].rijen[0]);
  check("controles leerling: kolom in Inzendingen", inz.cel(1, 13) === "controles leerling", inz.rijen[0]);
  check("controles leerling: niets afgevinkt", /^nee: 0 van \d+ afgevinkt$/.test(rij("20X2 AK01")[12]), rij("20X2 AK01")[12]);
  const klasL = sheets["Klas LEU"];
  const kolom = (kop) => klasL.rijen[0].indexOf(kop) + 1;
  const klasRij = (naam) => klasL.rijen.findIndex((x) => x[0] === naam) + 1;
  check("Klas LEU: kolommen per categorie na opmerking", klasL.cel(1, 4) === "X2 AK1" && kolom("X2 VK1") === 6 && kolom("X2 EB") > 5, klasL.rijen[0]);
  check("Klas LEU: volle naam van de categorie als notitie", klasL.notities && klasL.notities["1,4"] === "20X2 · " + AK1, klasL.notities);
  check("Klas TW: nog geen kolommen (geen inzending)", !sheets["Klas TW"].cel(1, 4), sheets["Klas TW"].rijen[0]);
  check("X2 AK1 nog niet OK (AK02 te remediëren)", klasL.cel(klasRij("Lotte V."), kolom("X2 AK1")) === "", klasL.rijen);
  const rijAk02 = inz.rijen.findIndex((x) => x[3] === "20X2 AK02") + 1;
  inz.zet(rijAk02, 7, "In orde");
  omgeving.onEdit({ range: inz.getRange(rijAk02, 7) });
  check("na In orde voor AK02: OK bij X2 AK1", klasL.cel(klasRij("Lotte V."), kolom("X2 AK1")) === "OK", klasL.rijen[klasRij("Lotte V.") - 1]);
  check("X2 VK blijft leeg", klasL.cel(klasRij("Lotte V."), kolom("X2 VK1")) === "");
  check("andere leerling geen OK", klasL.rijen.slice(1).filter((x) => x[0] && x[0] !== "Lotte V.").every((x) => !x[3]), klasL.rijen);
  inz.zet(rijAk02, 7, "Te remediëren");
  omgeving.onEdit({ range: inz.getRange(rijAk02, 1, 1, 9) });
  check("terug op Te remediëren: OK verdwijnt", klasL.cel(klasRij("Lotte V."), kolom("X2 AK1")) === "");
  check("controles-tekst: alles afgevinkt = ja", omgeving.controlesTekst_({ totaal: 3, af: 3 }) === "ja" &&
    /heropend/.test(omgeving.controlesTekst_({ totaal: 3, af: 3, herbekijken: true })) &&
    omgeving.controlesTekst_({ totaal: 0, af: 0 }) === "" && omgeving.controlesTekst_(undefined) === "");
  check("werkbestand met vestiging in de naam", !!bestandMet("werk_LEU_lottev.json"),
    Object.values(drive).map((f) => f.name));
  const eigenMap = Object.values(drive).find((f) => f.name === "Boekhoudapp 4e jaar werkbestanden" && f.vanScript);
  check("het script maakte zelf een map en negeert de map van iemand anders",
    eigenMap && eigenMap.vanScript && bestandMet("werk_LEU_lottev.json").parents[0] === eigenMap.id, eigenMap);

  console.log("\n8. Gelijknamige leerling in Tielt-Winge");
  let a = await get({ actie: "werk", vestiging: "TW", naam: "Lotte V.", code: codeTw });
  check("Lotte van Tielt-Winge ziet het werk van Leuven niet", a.ok && a.gevonden === false, a);
  a = await post({ actie: "bewaren", vestiging: "TW", naam: "Lotte V.", code: codeTw, state: { student: "Lotte V.", jaren: {} } });
  check("eigen werkbestand voor Tielt-Winge", a.ok && !!bestandMet("werk_TW_lottev.json"));
  a = await get({ actie: "werk", vestiging: "LEU", naam: "Lotte V.", code: codeLeu });
  check("bewaard werk (alle jaren) wordt teruggelezen", a.ok && a.gevonden && !!a.state.jaren["20X2"].boekingen.AK01, a.ok && Object.keys(a.state));
  check("lezen enkel via het toegelaten Drive-adres",
    opgehaald.length > 0 && opgehaald.every((u) => u.indexOf("https://www.googleapis.com/drive/v3/files/") === 0), opgehaald);
  a = await post({ actie: "indienen", vestiging: "TW", naam: "Lotte V.", code: codeTw,
    items: [{ ref: "20X2 AK01", categorie: "20X2 · " + AK1, status: "niet begonnen", boeking: "", lijnen: [] }] });
  check("inzending Tielt-Winge aanvaard", a.ok === true, a);
  check("inzending van Tielt-Winge in Inzendingen TW", inzTw.getLastRow() === 2 && inzTw.cel(2, 4) === "20X2 AK01", inzTw.rijen);
  check("Leuven-rij AK01 blijft de laatste van Leuven", rij("20X2 AK01")[9] === "JA", rij("20X2 AK01"));

  console.log("\n9. Feedback vrijgeven en aanbevelingen");
  actiefBlad = "Klas LEU";
  omgeving.geefVrijVoorLeerling();
  check("vrijgeven vraagt een tabblad Inzendingen", /Inzendingen LEU/.test(laatsteAlert), laatsteAlert);
  actiefBlad = "Inzendingen LEU";
  actieveRij = inz.rijen.findIndex((x) => x[3] === "20X2 AK01") + 1;
  omgeving.geefVrijVoorLeerling();
  check("melding noemt de vestiging", /\(LEU\)/.test(laatsteAlert), laatsteAlert);
  check("rij van Tielt-Winge niet vrijgegeven", inzTw.cel(2, 9) !== true, inzTw.rijen[1]);
  const fbLeu = await get({ actie: "feedback", vestiging: "LEU", naam: "Lotte V.", code: codeLeu });
  const fbTw = await get({ actie: "feedback", vestiging: "TW", naam: "Lotte V.", code: codeTw });
  check("Leuven krijgt een beoordeling per aankoop", fbLeu.ok && fbLeu.feedback.length === akRefs.length, fbLeu.feedback && fbLeu.feedback.length);
  check("Tielt-Winge krijgt niets", fbTw.ok && fbTw.feedback.length === 0, fbTw);
  check("aanbevolen: eigen keuze van de expert + automatisch uit de taak",
    JSON.stringify((fbLeu.aanbevolen || []).slice().sort()) === JSON.stringify([AK1, VK1]), fbLeu.aanbevolen);
  check("aanbevolen bevat geen namen of gegevens van anderen", !/youssef|Eindejaar/i.test(JSON.stringify(fbLeu.aanbevolen)), fbLeu.aanbevolen);

  doc.getElementById("btn-feedback").click();
  await wacht(120);
  const ovl = doc.querySelector(".koppeling-overlay:last-of-type [data-role='modal-sluit']");
  if (ovl) ovl.click();
  doc.querySelector('[data-page-ref="AK01"]').click();
  await wacht(30);
  check("AK01 op slot in de app", /In orde ✓/.test(doc.getElementById("pagina-inhoud").textContent));
  doc.querySelector('[data-page-ref="AK02"]').click();
  check("AK02 toont de feedback", /Te remediëren/.test(doc.getElementById("pagina-inhoud").textContent));
  await kiesJaar(w, "20X5");
  const navTekst = doc.getElementById("nav-links") ? doc.getElementById("nav-links").textContent : doc.getElementById("sidebar").textContent;
  check("remediëring: ★ bij Aankopen en Verkopen", (navTekst.match(/aanbevolen/g) || []).length === 2, navTekst.slice(0, 400));
  check("remediëring: geen zelfcontrole (niet aangezet)", w.APP.jaarSoort().zelfcontrole === true && !doc.querySelector('[data-role="zelfcontrole"]'));
  await kiesJaar(w, "20X2");

  console.log("\n10. Resultaatverwerking zonder belasting");
  doc.querySelector('[data-page-type="resultaat"]').click();
  await wacht(30);
  const pag = doc.getElementById("pagina-inhoud").textContent;
  check("geen vennootschapsbelasting op de pagina", !/BELASTING —|vennootschapsbelasting \(20/.test(pag), (pag.match(/.{40}belasting.{40}/i) || [""])[0]);
  check("drie stappen", doc.querySelectorAll('[data-role="stap-veld"]').length === 3);
  const st2 = w.APP.getState();
  st2.resultaat.stap = { opbrengsten: "26.510", kosten: "16.225", winst: "10.285" };
  st2.boekingen.RESULTAAT = boekingVolgensSleutel("20X2 RESULTAAT");
  w.APP.saveState();
  doc.getElementById("btn-indienen").click();
  await wacht(40);
  const v2 = [...doc.querySelectorAll(".koppeling-overlay")].pop();
  const vr = v2.querySelector('[data-cat="Resultaatverwerking"]');
  vr.checked = true;
  vr.dispatchEvent(new w.Event("change"));
  v2.querySelector("#btn-indienen-bevestig").click();
  await wacht(40);
  v2.querySelector('[data-role="bevestig-ja"]').click();
  await wacht(150);
  const rv = inz.rijen.filter((x) => x[3] === "20X2 RESULTAATVERWERKING").pop();
  const rr = inz.rijen.filter((x) => x[3] === "20X2 RESULTAAT").pop();
  check("berekening automatisch In orde", rv && rv[6] === "In orde", rv);
  check("boeking RESULTAAT automatisch In orde", rr && rr[6] === "In orde", rr);
  check("resultaatverwerking hoort bij de taak Eindejaar", rv && rv[2] === "20X2 · Resultaatverwerking", rv);
  check("geen rij BELASTING", !inz.rijen.some((x) => /BELASTING/.test(x[3])));

  console.log("\n11. Zelfcontrole in het extra oefenmateriaal (20X4)");
  await kiesJaar(w, "20X4");
  check("20X4: geen indienknop", doc.getElementById("btn-indienen").hidden === true);
  check("20X4: geen controlepagina's en geen eindcontrole in het menu",
    !doc.querySelector('#nav-links [data-page-type="controle"]') && !doc.querySelector('#nav-links [data-page-type="controles"]'));
  check("20X4: proef- en saldibalans en klanten & leveranciers niet opengezet", !doc.querySelector('[data-page-type="saldibalans"]') &&
    !doc.querySelector('[data-page-type="relaties"]'));
  const sl4 = w.eval("SLEUTEL_OEFEN")["20X4"].AK01;
  const st4 = w.APP.getState();
  const MAR4 = w.eval("MAR");
  // Volledig ingevulde lijnen (zoals een leerling ze invult), zodat de knop
  // Bewaren echt aan staat.
  const lijn = (nr, bedrag, dc) => {
    const m = MAR4.find((x) => String(x.nr) === String(nr));
    return { bedrag: String(bedrag), rekening: String(nr), dc, relatie: nr === "440000" ? "FairFabrics nv" : "", redenering: "",
      apko: m.apko, stijgtDaalt: "+", klasse: m.klasse, rubriek: m.rubriek };
  };
  const goed = Object.keys(sl4).map((nr) => lijn(nr, Math.abs(sl4[nr]), sl4[nr] > 0 ? "D" : "C"));
  const fout = JSON.parse(JSON.stringify(goed));
  const i411 = fout.findIndex((r) => r.rekening === "411000");
  fout[i411] = lijn("418000", fout[i411].bedrag, fout[i411].dc);   // fout rekeningnummer, zelfde aantal lijnen
  const bewaarAK01 = async (rows) => {
    st4.boekingen.AK01 = { geboekt: false, rows: JSON.parse(JSON.stringify(rows)) };
    w.APP.renderAlles();
    const knopB = doc.querySelector('[data-role="boeken"][data-scope="AK01"]');
    if (!knopB || knopB.disabled) return "knop Bewaren staat niet aan";
    knopB.click();
    await wacht(40);
    const m = doc.querySelector(".zc-melding");
    return m ? m.textContent : "";
  };
  w.APP.saveState();
  doc.querySelector('.nav-link[data-page-ref="AK01"]').click();
  await wacht(20);
  const zc1 = await bewaarAK01(fout);
  check("1e keer bewaren = 1e controle: enkel 'klopt nog niet'", /Klopt nog niet/.test(zc1) && !/lijn \d/.test(zc1), zc1);
  check("geen aparte knop 'Controleer mijn boeking' meer", !doc.querySelector('[data-role="zelfcontrole"]'));
  await wacht(80);
  check("de poging staat meteen in de Sheet (zonder indienen)", sheets["Zelfcontrole LEU"] && sheets["Zelfcontrole LEU"].getLastRow() === 2,
    sheets["Zelfcontrole LEU"] && sheets["Zelfcontrole LEU"].rijen);
  const zc2 = await bewaarAK01(fout);
  check("2e controle: welke lijn fout is", new RegExp("lijn " + (i411 + 1)).test(zc2) && !!doc.querySelector("tr.rij-zc-fout"), zc2);
  check("fout rekeningnummer, juist aantal lijnen: geen 'er ontbreekt een lijn'", !/ontbreekt/.test(zc2), zc2);
  // Zonder de btw-lijn, en 440000 aangepast zodat debet = credit blijft.
  const teWeinig = goed.filter((r, i) => i !== i411).map((r) =>
    r.rekening === "440000" ? lijn("440000", Math.abs(sl4["440000"]) - Math.abs(sl4["411000"]), "C") : r);
  const zcMin = await bewaarAK01(teWeinig);
  check("een lijn te weinig: 'er ontbreekt nog een lijn'", /ontbreekt ook nog een lijn/.test(zcMin), zcMin);
  await bewaarAK01(goed);
  check("4e controle juist: op slot", /Klopt ✓/.test(doc.getElementById("pagina-inhoud").textContent) && !doc.querySelector('[data-role="heropenen"]'));
  await wacht(80);
  check("alle vier de pogingen al verstuurd bij het bewaren", w.APP.zelfcontroleLog().length === 0 && sheets["Zelfcontrole LEU"].getLastRow() === 5,
    [w.APP.zelfcontroleLog(), sheets["Zelfcontrole LEU"].getLastRow()]);
  await w.KOPPELING_API.bewaarNu();
  const zcBlad = sheets["Zelfcontrole LEU"];
  check("pogingen in het tabblad Zelfcontrole LEU", zcBlad.getLastRow() === 5 && zcBlad.cel(2, 3) === "20X4" && zcBlad.cel(2, 4) === "AK01" &&
    zcBlad.cel(5, 7) === "JA", zcBlad.rijen);
  check("na het bewaren leeg in de app", w.APP.zelfcontroleLog().length === 0, w.APP.zelfcontroleLog());

  console.log("\n12. Beperkte toegang (appsscript.json)");
  const manifest = JSON.parse(fs.readFileSync(path.join(BRON, "apps-script/appsscript.json"), "utf8"));
  const scopes = (manifest.oauthScopes || []).slice().sort();
  check("enkel de vier beperkte toegangen", JSON.stringify(scopes) === JSON.stringify([
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
  ]), scopes);
  check("UrlFetch beperkt tot het Drive-adres", JSON.stringify(manifest.urlFetchWhitelist) === JSON.stringify(["https://www.googleapis.com/drive/v3/files/"]));
  check("geavanceerde dienst Drive v3 aan", (manifest.dependencies.enabledAdvancedServices || []).some((d) => d.userSymbol === "Drive" && d.version === "v3"));
  const code = CODE_GS + SLEUTEL_GS;
  const verboden = ["DriveApp.", "SpreadsheetApp.openById", "SpreadsheetApp.openByUrl", "GmailApp", "MailApp", "DocumentApp", "CalendarApp", "FormApp"];
  check("geen diensten die meer toegang vragen", verboden.every((v) => code.indexOf(v) === -1), verboden.filter((v) => code.indexOf(v) !== -1));
  const appCode = ["js/data-jaren.js", "js/data-sleutel-oefen.js", "js/data-opdrachten.js"].map((b) => fs.readFileSync(path.join(BRON, b), "utf8")).join("\n");
  check("de oplossing van de taak en de consolidaties staat niet in de app",
    !/"20X[236]"\s*:\s*\{\s*"?(AK|VK|DOC)/.test(fs.readFileSync(path.join(BRON, "js/data-sleutel-oefen.js"), "utf8")) && !/HOOFDSTUK_PER_DOC/.test(appCode));

  console.log("\n13. Menu's in de Sheet");
  laatsteAlert = "";
  omgeving.nakijkenOpenInzendingen();
  check("open inzendingen nakijken loopt", /Klaar/.test(laatsteAlert), laatsteAlert);
  omgeving.toonWerkMap();
  check("werkmap toont aantallen per vestiging", /LEU \(Leuven\): 1/.test(laatsteAlert) && /TW \(Tielt-Winge\): 1/.test(laatsteAlert), laatsteAlert);
  prompts = ["LEU", "Lotte V."];
  omgeving.zetVersieTerug();
  check("versie terugzetten vraagt eerst de vestiging", /Geen bewaarde versies|Klaar|nieuwste/.test(laatsteAlert), laatsteAlert);
  sheets.Sleutel.zet(2, 4, "999");
  omgeving.sleutelCaseInvullen();
  check("sleutel opnieuw invullen herstelt de case", sheets.Sleutel.cel(2, 4) === SLEUTEL[0][3], sheets.Sleutel.cel(2, 4));

  console.log("\n14. Beheer in de app is per vestiging");
  doc.querySelector('[data-page-type="beheer"]').click();
  await wacht(30);
  const pagina = () => doc.getElementById("pagina-inhoud");
  const beheerSchool = () => pagina().querySelector('[data-role="beheer-school"]');
  check("beheer heeft een eigen schoolkeuze, nog leeg", !!beheerSchool() && beheerSchool().value === "" &&
    /Kies eerst je school/.test(pagina().textContent) && !pagina().querySelector('[data-role="expertcode"]'), pagina().textContent.slice(0, 300));
  beheerSchool().value = "LEU";
  beheerSchool().dispatchEvent(new w.Event("change", { bubbles: true }));
  await wacht(30);
  check("beheer vraagt de expertcode van Leuven", /expertcode van Leuven/.test(pagina().textContent), pagina().textContent.slice(0, 200));
  const veld = () => pagina().querySelector('[data-role="expertcode"]');
  veld().value = "3333";
  veld().dispatchEvent(new w.Event("input", { bubbles: true }));
  pagina().querySelector('[data-role="ontgrendel"]').click();
  await wacht(80);
  check("code van Tielt-Winge opent Leuven niet", !!veld() && /klopt niet/.test(pagina().textContent), pagina().textContent.slice(0, 300));
  veld().value = "1111";
  veld().dispatchEvent(new w.Event("input", { bubbles: true }));
  pagina().querySelector('[data-role="ontgrendel"]').click();
  await wacht(80);
  check("Leuven open met de code van Leuven", /Leerlingen/.test(pagina().textContent) && /Youssef/.test(pagina().innerHTML),
    pagina().textContent.slice(0, 300));
  check("zichtbaarheid: 20X4 zelfcontrole aangevinkt", pagina().querySelector('[data-role="zicht-zc"][data-jaar="20X4"]').checked === true &&
    pagina().querySelector('[data-role="zicht-cat"][data-jaar="20X2"][data-cat="Btw-verrekening"]').checked === false);
  check("zichtbaarheid: extra pagina's per jaar", pagina().querySelector('[data-role="zicht-extra"][data-jaar="20X2"][data-cat="saldibalans"]').checked === true &&
    pagina().querySelector('[data-role="zicht-extra"][data-jaar="20X2"][data-cat="bbInT"]').checked === false &&
    pagina().querySelector('[data-role="zicht-extra"][data-jaar="20X4"][data-cat="relaties"]').checked === false);
  const bbVink = pagina().querySelector('[data-role="zicht-extra"][data-jaar="20X2"][data-cat="bbInT"]');
  bbVink.checked = true;
  bbVink.dispatchEvent(new w.Event("change", { bubbles: true }));
  check("zichtbaarheid: geen categorieën bij een consolidatie", !pagina().querySelector('[data-role="zicht-cat"][data-jaar="20X3"]'));
  check("aanbevolen: eigen vinkje en automatisch", pagina().querySelector('[data-role="aanbevolen"][data-naam="lottev"][data-cat="' + VK1 + '"]').checked === true &&
    /auto/.test(pagina().querySelector('[data-role="aanbevolen"][data-naam="lottev"][data-cat="' + AK1 + '"]').parentNode.textContent));
  check("overzicht zelfcontrole: 20X4 AK01 met Lotte", /20X4/.test(pagina().textContent) && /AK01/.test(pagina().querySelector(".beheer-zc").textContent) &&
    /0%/.test(pagina().querySelector(".beheer-zc").textContent), pagina().querySelector(".beheer-zc") && pagina().querySelector(".beheer-zc").textContent);
  check("taken: de nieuwe namen", !!pagina().querySelector('[data-role="taak"][data-cat="20X3 · Consolidatie"]') &&
    !pagina().querySelector('[data-role="taak"][data-cat="20X4 · Aankopen"]'));
  // Btw-verrekening van 20X2 openzetten en bewaren.
  const btw = pagina().querySelector('[data-role="zicht-cat"][data-jaar="20X2"][data-cat="Btw-verrekening"]');
  btw.checked = true;
  btw.dispatchEvent(new w.Event("change", { bubbles: true }));
  const aanb = pagina().querySelector('[data-role="aanbevolen"][data-naam="lottev"][data-cat="' + VK1 + '"]');
  aanb.checked = false;
  aanb.dispatchEvent(new w.Event("change", { bubbles: true }));
  pagina().querySelector('[data-role="bewaren"]').click();
  await wacht(100);
  const instL = (k) => sheets["Instellingen LEU"].rijen.find((x) => x[0] === k)[1];
  check("zichtbaarheid bewaard in de Sheet", JSON.parse(instL("zichtbaarheid"))["20X2"].cats["Btw-verrekening"] === true, instL("zichtbaarheid"));
  check("aanbevolen bewaard in de Sheet", !JSON.parse(instL("aanbevolen")).lottev && JSON.parse(instL("aanbevolen")).youssefb.length === 1, instL("aanbevolen"));
  await kiesJaar(w, "20X2");
  check("de app volgt meteen: btw-verrekening nu zichtbaar", w.eval("CATEGORIE_VOLGORDE").indexOf("Btw-verrekening") !== -1, w.eval("CATEGORIE_VOLGORDE"));
  w.APP.renderAlles();
  check("beginbalans in T-rekeningen aangezet: BB staat erin",
    [...doc.querySelectorAll("#tpanel-lijst .trek-regel .ref")].some((x) => x.textContent === "BB"));
  doc.querySelector('[data-page-type="beheer"]').click();
  await wacht(30);
  vestSel.value = "TW";
  vestSel.dispatchEvent(new w.Event("change"));
  await wacht(80);
  w.APP.renderAlles();
  check("schoolkeuze bovenaan verandert niets aan beheer", !veld() && /Youssef/.test(pagina().innerHTML), pagina().textContent.slice(0, 300));
  beheerSchool().value = "TW";
  beheerSchool().dispatchEvent(new w.Event("change", { bubbles: true }));
  await wacht(30);
  check("andere school gekozen in beheer: weer op slot", !!veld() && /expertcode van Tielt-Winge/.test(pagina().textContent) &&
    !/Youssef/.test(pagina().innerHTML), pagina().textContent.slice(0, 300));
  veld().value = "3333";
  veld().dispatchEvent(new w.Event("input", { bubbles: true }));
  pagina().querySelector('[data-role="ontgrendel"]').click();
  await wacht(80);
  check("Tielt-Winge open in beheer", !veld() && /Tielt-Winge/.test(pagina().querySelector(".pagina-subtitel").textContent), pagina().textContent.slice(0, 300));

  console.log("\n15. Afmelden");
  const domA = await start({
    bkh4_aanmelding: JSON.stringify({ vestiging: "LEU", naam: "Lotte V.", code: codeLeu }),
    bkh4_vestiging: "leu",
    bkh4_laatste_leerling: "Lotte V.",
  });
  await wacht(150);
  const wa = domA.window;
  const knopA = wa.document.getElementById("btn-afmelden");
  check("afmeldknop zichtbaar voor wie aangemeld is", !!knopA && knopA.hidden === false && wa.APP.getState().student === "Lotte V.",
    wa.APP.getState().student);
  await kiesJaar(wa, "20X2");
  wa.APP.getState().boekingen.VK01 = { geboekt: true, rows: [{ bedrag: "4321", rekening: "700000", dc: "C" }] };
  wa.APP.saveState();
  wa.confirm = () => true;
  knopA.click();
  await wacht(200);
  check("aanmelding en laatste leerling vergeten",
    !wa.localStorage.getItem("bkh4_aanmelding") && !wa.localStorage.getItem("bkh4_laatste_leerling"), Object.keys(wa.localStorage));
  check("laatste werk vóór het afmelden op de server bewaard", /4321/.test(bestandMet("werk_LEU_lottev.json").inhoud || ""));
  check("werk daarna gewist uit de browser (gedeelde computer)",
    !Object.keys(wa.localStorage).some((k) => /^bkh4_data_/.test(k) || /^bkh4_feedback_/.test(k)), Object.keys(wa.localStorage));
  const naAfmelden = {};
  Object.keys(wa.localStorage).forEach((k) => { naAfmelden[k] = wa.localStorage.getItem(k); });
  const domB = await start(naAfmelden);
  await wacht(100);
  check("na herladen: niemand aangemeld, knop verborgen",
    domB.window.APP.getState().student === "" && domB.window.document.getElementById("btn-afmelden").hidden === true,
    domB.window.APP.getState().student);

  console.log("\n16. Namen meteen klaar");
  const nm = await get({ actie: "namen" });
  check("actie namen: de namen van elke vestiging, zonder codes",
    nm.ok && (nm.klas.LEU || []).includes("Lotte V.") && (nm.klas.TW || []).includes("Lotte V.") && !/\d{4}/.test(JSON.stringify(nm)), nm);
  const domN = await start({});
  await wacht(100);
  const bewaardeNamen = JSON.parse(domN.window.localStorage.getItem("bkh4_namen") || "{}");
  check("de browser onthoudt de namen", (bewaardeNamen.LEU || []).includes("Lotte V."), bewaardeNamen);

  console.log("\n17. Enkel afgerond werk gaat naar de Sheet");
  const domI = await start({
    bkh4_aanmelding: JSON.stringify({ vestiging: "LEU", naam: "Lotte V.", code: codeLeu }),
    bkh4_vestiging: "leu",
  });
  await wacht(150);
  const wi = domI.window;
  await kiesJaar(wi, "20X2");
  const stI = wi.APP.getState();
  stI.boekingen.VK01 = { geboekt: false, rows: [{ bedrag: "100", rekening: "", dc: "" }] };   // half af
  stI.boekingen.VK02 = boekingVolgensSleutel("20X2 VK02");
  wi.APP.saveState();
  wi.document.getElementById("btn-indienen").click();
  await wacht(40);
  const vI = wi.document.querySelector(".koppeling-overlay");
  check("een categorie zonder iets afgerond kan je niet aanvinken",
    vI.querySelector('[data-cat="Financiële verrichtingen"]').disabled === true);
  const vinkI = [...vI.querySelectorAll("[data-cat]")].find((v) => v.dataset.cat === VK1);
  vinkI.checked = true;
  vinkI.dispatchEvent(new wi.Event("change"));
  vI.querySelector("#btn-indienen-bevestig").click();
  await wacht(40);
  const voorI = sheets["Inzendingen LEU"].getLastRow();
  vI.querySelector('[data-role="bevestig-ja"]').click();
  await wacht(150);
  const nieuwI = sheets["Inzendingen LEU"].rijen.slice(voorI).map((r) => r[3]);
  check("enkel de geboekte VK02 gaat mee", nieuwI.join("|") === "20X2 VK02", nieuwI);

  console.log("\n18. Voortgang per categorie");
  const vtekst = wi.document.getElementById("voortgang-tekst").textContent;
  check("de balk toont de categorie waar de leerling mee bezig is", /^20X2 · (Aankopen|Verkopen) taak \d: [^:]+: \d+ van \d+ geboekt · jaar: \d+ van \d+$/.test(vtekst), vtekst);

  console.log("\n19. Typen terwijl het werk nog geladen wordt");
  werkVertraging = 150;
  const domR = await start({
    bkh4_aanmelding: JSON.stringify({ vestiging: "LEU", naam: "Lotte V.", code: codeLeu }),
    bkh4_vestiging: "leu",
  });
  domR.window.APP.getState().boekingen.AK10 = { geboekt: false, rows: [{ bedrag: "9", rekening: "", dc: "" }] };
  domR.window.APP.saveState();
  await wacht(300);
  werkVertraging = 0;
  const wR = domR.window.APP.getWerk();
  check("het werk van de server wint (de browser was leeg bij het aanmelden)",
    !!(wR.jaren["20X2"] && wR.jaren["20X2"].boekingen.AK01), Object.keys(wR.jaren));

  console.log("\n20. Feedback met een tijdstip als tekst in de Sheet");
  const dT = omgeving.alsDatum_("17/10/2026 15:35:51");
  check("tekst-tijdstip wordt gelezen", dT && dT.getTime() === new Date(2026, 9, 17, 15, 35, 51).getTime(), dT);

  console.log("\n21. Vergeten op Boeken te drukken");
  // In wi (sectie 17): VK01 begonnen maar niet geboekt.
  const stV = wi.APP.getState();
  wi.APP.renderAlles();
  const bolV = (ref) => [...wi.document.querySelectorAll(".nav-link")].find((n) => n.dataset.pageRef === ref).querySelector(".status-bolletje").className;
  check("menu: open oranje ringetje bij VK01", /begonnen/.test(bolV("VK01")), bolV("VK01"));
  wi.document.querySelector('.nav-link[data-page-ref="VK03"]').click();
  await wacht(30);
  const klant = wi.eval("RELATIES").klanten[0];
  stV.boekingen.VK03 = { geboekt: false, rows: [
    { bedrag: "100", rekening: "400000", dc: "D", relatie: klant, apko: "A", stijgtDaalt: "+", klasse: "4", rubriek: "40" },
    { bedrag: "100", rekening: "700000", dc: "C", relatie: "", apko: "O", stijgtDaalt: "+", klasse: "7", rubriek: "70" }] };
  wi.APP.renderAlles();
  check("klaar om te boeken: herinnering bij de knop", !!wi.document.querySelector(".btn-boeken-klaar.btn-boeken") &&
    !!wi.document.querySelector(".boeken-herinnering"));
  const indienV = async (cat) => {
    wi.document.querySelectorAll(".koppeling-overlay").forEach((o) => o.remove());   // vensters van sectie 17
    wi.document.getElementById("btn-indienen").click();
    await wacht(30);
    const v = wi.document.querySelector(".koppeling-overlay");
    const vk = [...v.querySelectorAll("[data-cat]")].find((x) => x.dataset.cat === cat);
    vk.checked = true;
    vk.dispatchEvent(new wi.Event("change"));
    v.querySelector("#btn-indienen-bevestig").click();
    await wacht(30);
    return v;
  };
  let vV = await indienV(AK1);
  check("Aankopen indienen: geen melding over VK01", !/Nog niet geboekt/.test(vV.textContent));
  vV.remove();
  vV = await indienV(VK2);
  check("Verkopen taak 2 indienen: melding met VK03", !!vV.querySelector('[data-ref="VK03"]') && !vV.querySelector('[data-ref="VK01"]'),
    vV.textContent.slice(0, 300));
  vV.remove();
  vV = await indienV(VK1);
  check("Verkopen taak 1 indienen: melding met VK01", !!vV.querySelector('[data-ref="VK01"]'), vV.textContent.slice(0, 300));
  vV.querySelector('[data-ref="VK01"]').click();
  await wacht(30);
  check("klik: naar VK01", !wi.document.querySelector(".koppeling-overlay") &&
    /VK01/.test(wi.document.querySelector(".pagina-titel").textContent));

  console.log("\n22. Naam kiezen: nooit een vrij naamveld");
  const naamVeldTest = async (beschrijving, verwacht) => {
    const d = await start({});
    await wacht(30);
    const ws = d.window, ds = ws.document;
    const vs = ds.getElementById("vestiging-select");
    vs.value = "LEU";
    vs.dispatchEvent(new ws.Event("change"));
    await wacht(30);
    const s = ds.getElementById("leerling-select");
    check(beschrijving, !s.hidden && s.disabled && verwacht.test(s.textContent) &&
      ds.getElementById("leerling-naam-input").hidden &&
      ds.getElementById("leerling-code").disabled && ds.getElementById("btn-aanmelden").disabled, s.outerHTML);
    return ds;
  };
  serverHangt = true;
  await naamVeldTest("trage server: 'Namen worden geladen…', alles grijs", /Namen worden geladen/);
  serverHangt = false;
  serverWeg = true;
  const dsWeg = await naamVeldTest("onbereikbare server: 'Geen namen gevonden', nog steeds grijs", /Geen namen gevonden/);
  check("met een melding om de pagina te herladen", /Herlaad de pagina/.test(dsWeg.getElementById("koppeling-status").textContent),
    dsWeg.getElementById("koppeling-status").textContent);
  serverWeg = false;

  console.log(fouten ? "\n" + fouten + " controle(s) mislukt." : "\nAlle controles geslaagd.");
  process.exit(fouten ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
