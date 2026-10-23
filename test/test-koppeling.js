/* Testharnas voor de koppeling — Boekhoudapp 4e jaar.
 *
 * Draait de echte app in jsdom en de echte Code.gs (met SleutelCase.gs) in
 * Node, met een nagemaakte Google-omgeving ertussen. Zo wordt het volledige
 * pad getest: installatie, beheer per vestiging, aanmelden, indienen,
 * automatisch nakijken met de sleutel van de case, feedback vrijgeven en
 * terug in de app — met één script voor de drie vestigingen.
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

function server(url, opts) {
  const u = new URL(url);
  let r;
  if (!opts || opts.method === "GET") {
    const parameter = {};
    u.searchParams.forEach((v, k) => (parameter[k] = v));
    r = omgeving.doGet({ parameter });
  } else {
    r = omgeving.doPost({ postData: { contents: opts.body } });
  }
  return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(r.tekst) });
}
const get = (p) => server("https://fake/exec?" + new URLSearchParams(Object.assign({ sleutel: "TEST" }, p))).then((r) => r.text()).then(JSON.parse);
const post = (d) => server("https://fake/exec", { method: "POST", body: JSON.stringify(Object.assign({ sleutel: "TEST" }, d)) }).then((r) => r.text()).then(JSON.parse);

/* ===================== de app in jsdom ===================== */

async function start(vooraf) {
  const html = fs.readFileSync(path.join(APP, "index.html"), "utf8");
  const bronnen = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  const dom = new JSDOM(html.replace(/<script src="[^"]+"><\/script>/g, ""), {
    runScripts: "dangerously", url: "https://test.local/", pretendToBeVisual: true,
  });
  dom.window.fetch = server;
  dom.window.navigator.sendBeacon = () => true;
  dom.window.scrollTo = () => {};
  // Wat een andere app op hetzelfde adres (celinetytgadt.github.io) al in de
  // browser bewaarde, bv. de app van kern 8.
  Object.keys(vooraf || {}).forEach((k) => dom.window.localStorage.setItem(k, vooraf[k]));
  const laad = (b) => {
    const s = dom.window.document.createElement("script");
    s.textContent = fs.readFileSync(path.join(APP, b), "utf8");
    dom.window.document.head.appendChild(s);
  };
  // js/koppeling.js en js/beheer.js komen pas na het opstarten van app.js,
  // zoals in de browser. js/config-koppeling.js hoort daar NIET bij: die
  // moet vóór app.js geladen zijn, net als in index.html.
  const laatst = (b) => /^js\/(koppeling|beheer)\.js$/.test(b);
  bronnen.filter((b) => !laatst(b)).forEach(laad);
  if (dom.window.document.readyState === "loading") {
    await new Promise((res) => dom.window.document.addEventListener("DOMContentLoaded", res, { once: true }));
  } else {
    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  }
  bronnen.filter(laatst).forEach(laad);
  await wacht(60);
  return dom;
}

// De sleutel van de case als boekingen: { AK01: [{rekening, dc, bedrag}], … }
const SLEUTEL = vm.runInNewContext(SLEUTEL_GS.slice(SLEUTEL_GS.indexOf("var SLEUTEL_CASE")) + "; SLEUTEL_CASE");
function boekingVolgensSleutel(ref) {
  return {
    geboekt: true,
    rows: SLEUTEL.filter((r) => r[0] === ref).map((r) => ({
      bedrag: r[3], rekening: r[1], dc: r[2], relatie: "", redenering: "", apko: "", stijgtDaalt: "",
    })),
  };
}

/* ===================== de test ===================== */

(async () => {
  console.log("\n1. Installatie van de ene Sheet");
  omgeving.installeer();
  const TABS = ["Klas", "Inzendingen", "Detail", "Instellingen", "Taken"];
  check("eigen tabbladen per vestiging", ["LEU", "SKW", "TW"].every((v) => TABS.every((t) => sheets[t + " " + v])),
    Object.keys(sheets));
  check("geen gedeelde tabbladen Klas of Inzendingen", !sheets.Klas && !sheets.Inzendingen, Object.keys(sheets));
  check("Klas: naam | code | opmerking", sheets["Klas LEU"].cel(1, 1) === "naam", sheets["Klas LEU"].rijen[0]);
  check("Inzendingen zonder kolom vestiging", sheets["Inzendingen LEU"].cel(1, 2) === "leerling", sheets["Inzendingen LEU"].rijen[0]);
  check("Taken bevat de categorieën per kwartaal", sheets["Taken TW"].rijen.some((r) => r[0] === "K3 · Aankopen en verkopen"));
  check("sleutel van de case ingevuld", sheets.Sleutel.getLastRow() - 1 === SLEUTEL.length, sheets.Sleutel.getLastRow());
  check("melding vermeldt de sleutel", /sleutel van de case staat al klaar/.test(laatsteAlert), laatsteAlert.slice(0, 200));

  // Een expertcode per vestiging, via het menu.
  [["LEU", "1111"], ["SKW", "2222"], ["TW", "3333"]].forEach(([v, c]) => { prompts = [v, c]; omgeving.zetExpertcode(); });
  const expert = (v) => sheets["Instellingen " + v].rijen.find((x) => x[0] === "expertcode")[1];
  check("expertcode per vestiging", expert("LEU") === "1111" && expert("SKW") === "2222" && expert("TW") === "3333",
    [expert("LEU"), expert("SKW"), expert("TW")]);

  console.log("\n2. Beheer per vestiging");
  let r = await post({ actie: "beheerBewaren", vestiging: "LEU", expertcode: "1111",
    klas: [{ naam: "Lotte V." }, { naam: "Youssef B." }],
    taken: [{ categorie: "K1 · Aankopen", link: "https://classroom.google.com/c/LEU/a/1/details" }] });
  check("bewaren voor Leuven lukt", r.ok === true, r);
  r = await post({ actie: "beheerBewaren", vestiging: "TW", expertcode: "1111", klas: [] });
  check("code van Leuven geeft geen toegang tot Tielt-Winge", !r.ok, r);
  r = await post({ actie: "beheerBewaren", vestiging: "TW", expertcode: "3333",
    klas: [{ naam: "Lotte V." }], taken: [{ categorie: "K1 · Aankopen", link: "https://classroom.google.com/c/TW/a/9/details" }],
    instellingen: { mededeling: "Indienen tot vrijdag (TW)" } });
  check("bewaren voor Tielt-Winge lukt", r.ok === true, r);
  const klasLeu = sheets["Klas LEU"].rijen.slice(1).filter((x) => x[0]);
  const klasTw = sheets["Klas TW"].rijen.slice(1).filter((x) => x[0]);
  check("Leuven in Klas LEU, Tielt-Winge in Klas TW", klasLeu.length === 2 && klasTw.length === 1, [klasLeu, klasTw]);
  const codeLeu = String(klasLeu.find((x) => x[0] === "Lotte V.")[1]);
  const codeTw = String(klasTw[0][1]);
  check("codes aangemaakt", /^\d{4}$/.test(codeLeu) && /^\d{4}$/.test(codeTw), [codeLeu, codeTw]);
  check("taken in het eigen tabblad", sheets["Taken LEU"].rijen.some((x) => x[0] === "K1 · Aankopen" && /LEU/.test(x[1])) &&
    sheets["Taken TW"].rijen.some((x) => x[0] === "K1 · Aankopen" && /TW/.test(x[1])));
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
  check("taaklink per vestiging", /LEU/.test(iLeu.taken["K1 · Aankopen"]) && /TW/.test(iTw.taken["K1 · Aankopen"]), [iLeu.taken, iTw.taken]);
  check("geen codes naar buiten", !JSON.stringify(iLeu).includes(codeLeu));
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
  check("beginbalans staat al geboekt", w.APP.getState().boekingen.BB && w.APP.getState().boekingen.BB.geboekt === true);
  check("beginbalans telt niet als eigen werk", w.APP.heeftEigenBoekingen() === false);
  const vestSel = doc.getElementById("vestiging-select");
  check("vestigingskeuze zichtbaar met drie scholen", vestSel.hidden === false && vestSel.options.length === 4, vestSel.options.length);
  vestSel.value = "LEU";
  vestSel.dispatchEvent(new w.Event("change"));
  await wacht(60);
  const sel = doc.getElementById("leerling-select");
  check("namen van Leuven in de keuzelijst", sel.options.length === 3, [...sel.options].map((o) => o.value));
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
  check("BB nog steeds aanwezig na aanmelden", !!w.APP.getState().boekingen.BB);
  check("bewaart onder het eigen voorvoegsel bkh4_",
    JSON.parse(w.localStorage.getItem("bkh4_aanmelding")).naam === "Lotte V." &&
      Object.keys(w.localStorage).filter((k) => /^boekhoudapp_/.test(k)).length === 5,
    Object.keys(w.localStorage));
  check("kern 8-gegevens in de browser bleven onaangeroerd", JSON.parse(w.localStorage.getItem("boekhoudapp_aanmelding")).naam === "test");

  console.log("\n5. Boeken en indienen van K1 · Aankopen");
  const st = w.APP.getState();
  ["AK01", "AK02", "AK03", "AK04", "AK05", "AK06", "AK07"].forEach((ref) => { st.boekingen[ref] = boekingVolgensSleutel(ref); });
  // AK03 met een fout: de transportkosten op 604000 in plaats van 604030.
  st.boekingen.AK03.rows.forEach((x) => { if (x.rekening === "604030") x.rekening = "604000"; });
  w.APP.saveState();
  doc.getElementById("btn-indienen").click();
  await wacht(40);
  const venster = doc.querySelector(".koppeling-overlay");
  const cats = [...venster.querySelectorAll("[data-cat]")].map((v) => v.dataset.cat);
  check("Beginbalans staat niet in het indienvenster", cats.indexOf("Beginbalans") === -1, cats);
  check("kwartaalcategorieën en afsluiting in het indienvenster",
    ["K1 · Aankopen", "K4 · Alle verrichtingen", "Eindejaarsverrichtingen", "Resultaatverwerking", "Eindbalans"].every((c) => cats.includes(c)), cats);
  const vink = venster.querySelector('[data-cat="K1 · Aankopen"]');
  vink.checked = true;
  vink.dispatchEvent(new w.Event("change"));
  venster.querySelector("#btn-indienen-bevestig").click();
  await wacht(40);
  venster.querySelector('[data-role="bevestig-ja"]').click();
  await wacht(150);
  check("ingediend", !!venster.querySelector(".melding-ok"), venster.textContent.slice(0, 120));
  check("Classroom-knop met de link van Leuven", /c\/LEU\//.test(venster.innerHTML), venster.innerHTML.match(/classroom[^"]*/));

  const inz = sheets["Inzendingen LEU"];
  const inzTw = sheets["Inzendingen TW"];
  const rij = (ref) => inz.rijen.find((x) => x[3] === ref);
  check("zeven rijen in Inzendingen LEU", inz.getLastRow() === 8, inz.getLastRow());
  check("Inzendingen TW is nog leeg", inzTw.getLastRow() === 1, inzTw.getLastRow());
  check("AK01 automatisch In orde", rij("AK01")[6] === "In orde", rij("AK01")[11]);
  check("AK05 (financiële korting) automatisch In orde", rij("AK05")[6] === "In orde", rij("AK05")[11]);
  check("AK03 automatisch Te remediëren", rij("AK03")[6] === "Te remediëren" && /604030/.test(rij("AK03")[11]), rij("AK03")[11]);
  check("Detail LEU gevuld, Detail TW leeg", sheets["Detail LEU"].getLastRow() > 1 && sheets["Detail TW"].getLastRow() === 1);
  check("werkbestand met vestiging in de naam", !!bestandMet("werk_LEU_lottev.json"),
    Object.values(drive).map((f) => f.name));
  const eigenMap = Object.values(drive).find((f) => f.name === "Boekhoudapp 4e jaar werkbestanden" && f.vanScript);
  check("het script maakte zelf een map en negeert de map van iemand anders",
    eigenMap && eigenMap.vanScript && bestandMet("werk_LEU_lottev.json").parents[0] === eigenMap.id, eigenMap);

  console.log("\n6. Gelijknamige leerling in Tielt-Winge");
  let a = await get({ actie: "werk", vestiging: "TW", naam: "Lotte V.", code: codeTw });
  check("Lotte van Tielt-Winge ziet het werk van Leuven niet", a.ok && a.gevonden === false, a);
  a = await post({ actie: "bewaren", vestiging: "TW", naam: "Lotte V.", code: codeTw, state: { student: "Lotte V.", boekingen: {} } });
  check("eigen werkbestand voor Tielt-Winge", a.ok && !!bestandMet("werk_TW_lottev.json"));
  a = await get({ actie: "werk", vestiging: "LEU", naam: "Lotte V.", code: codeLeu });
  check("bewaard werk wordt teruggelezen", a.ok && a.gevonden && !!a.state.boekingen.AK01, a.ok);
  check("lezen enkel via het toegelaten Drive-adres",
    opgehaald.length > 0 && opgehaald.every((u) => u.indexOf("https://www.googleapis.com/drive/v3/files/") === 0), opgehaald);
  a = await post({ actie: "indienen", vestiging: "TW", naam: "Lotte V.", code: codeTw,
    items: [{ ref: "AK01", categorie: "K1 · Aankopen", status: "niet begonnen", boeking: "", lijnen: [] }] });
  check("inzending Tielt-Winge aanvaard", a.ok === true, a);
  check("inzending van Tielt-Winge in Inzendingen TW", inzTw.getLastRow() === 2 && inzTw.cel(2, 4) === "AK01", inzTw.rijen);
  check("Leuven-rij AK01 blijft de laatste van Leuven", rij("AK01")[9] === "JA", rij("AK01"));

  console.log("\n7. Feedback vrijgeven");
  actiefBlad = "Klas LEU";
  omgeving.geefVrijVoorLeerling();
  check("vrijgeven vraagt een tabblad Inzendingen", /Inzendingen LEU/.test(laatsteAlert), laatsteAlert);
  actiefBlad = "Inzendingen LEU";
  actieveRij = inz.rijen.findIndex((x) => x[3] === "AK01") + 1;
  omgeving.geefVrijVoorLeerling();
  check("melding noemt de vestiging", /\(LEU\)/.test(laatsteAlert), laatsteAlert);
  check("rij van Tielt-Winge niet vrijgegeven", inzTw.cel(2, 9) !== true, inzTw.rijen[1]);
  const fbLeu = await get({ actie: "feedback", vestiging: "LEU", naam: "Lotte V.", code: codeLeu });
  const fbTw = await get({ actie: "feedback", vestiging: "TW", naam: "Lotte V.", code: codeTw });
  check("Leuven krijgt 7 beoordelingen", fbLeu.ok && fbLeu.feedback.length === 7, fbLeu.feedback && fbLeu.feedback.length);
  check("Tielt-Winge krijgt niets", fbTw.ok && fbTw.feedback.length === 0, fbTw);

  doc.getElementById("btn-feedback").click();
  await wacht(120);
  const ovl = doc.querySelector(".koppeling-overlay:last-of-type [data-role='modal-sluit']");
  if (ovl) ovl.click();
  doc.querySelector('[data-page-ref="AK01"]').click();
  await wacht(30);
  check("AK01 op slot in de app", /In orde ✓/.test(doc.getElementById("pagina-inhoud").textContent));
  check("AK03 toont de feedback", (() => {
    doc.querySelector('[data-page-ref="AK03"]').click();
    return /Te remediëren/.test(doc.getElementById("pagina-inhoud").textContent);
  })());

  console.log("\n8. Resultaatverwerking zonder belasting");
  doc.querySelector('[data-page-type="resultaat"]').click();
  await wacht(30);
  const pag = doc.getElementById("pagina-inhoud").textContent;
  check("geen vennootschapsbelasting op de pagina", !/BELASTING —|vennootschapsbelasting \(20/.test(pag), (pag.match(/.{40}belasting.{40}/i) || [""])[0]);
  check("drie stappen", doc.querySelectorAll('[data-role="stap-veld"]').length === 3);
  const st2 = w.APP.getState();
  st2.resultaat.stap = { opbrengsten: "76.100", kosten: "57.225", winst: "18.875" };
  st2.boekingen.RESULTAAT = boekingVolgensSleutel("RESULTAAT");
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
  const rv = inz.rijen.filter((x) => x[3] === "RESULTAATVERWERKING").pop();
  const rr = inz.rijen.filter((x) => x[3] === "RESULTAAT").pop();
  check("berekening automatisch In orde", rv && rv[6] === "In orde", rv);
  check("boeking RESULTAAT automatisch In orde", rr && rr[6] === "In orde", rr);
  check("geen rij BELASTING meer", !inz.rijen.some((x) => x[3] === "BELASTING"));

  console.log("\n9. Beperkte toegang (appsscript.json)");
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

  console.log("\n10. Menu's in de Sheet");
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

  console.log("\n11. Beheer in de app is per vestiging");
  doc.querySelector('[data-page-type="beheer"]').click();
  await wacht(30);
  const pagina = () => doc.getElementById("pagina-inhoud");
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
  vestSel.value = "TW";
  vestSel.dispatchEvent(new w.Event("change"));
  await wacht(80);
  w.APP.renderAlles();
  check("andere school gekozen: beheer weer op slot", !!veld() && /expertcode van Tielt-Winge/.test(pagina().textContent) &&
    !/Youssef/.test(pagina().innerHTML), pagina().textContent.slice(0, 300));


  console.log("\n12. Afmelden");
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
  wa.APP.getState().boekingen.VK01 = { geboekt: true, rows: [{ bedrag: "4321", rekening: "700000", dc: "C" }] };
  wa.APP.saveState();
  wa.confirm = () => true;
  knopA.click();
  await wacht(200);
  check("aanmelding en laatste leerling vergeten",
    !wa.localStorage.getItem("bkh4_aanmelding") && !wa.localStorage.getItem("bkh4_laatste_leerling"), Object.keys(wa.localStorage));
  check("laatste werk vóór het afmelden op de server bewaard", /4321/.test(bestandMet("werk_LEU_lottev.json").inhoud || ""));
  check("werk blijft in de browser staan", /4321/.test(Object.keys(wa.localStorage).filter((k) => /^bkh4_data_/.test(k))
    .map((k) => wa.localStorage.getItem(k)).join("")));
  const naAfmelden = {};
  Object.keys(wa.localStorage).forEach((k) => { naAfmelden[k] = wa.localStorage.getItem(k); });
  const domB = await start(naAfmelden);
  await wacht(100);
  check("na herladen: niemand aangemeld, knop verborgen",
    domB.window.APP.getState().student === "" && domB.window.document.getElementById("btn-afmelden").hidden === true,
    domB.window.APP.getState().student);

  console.log(fouten ? "\n" + fouten + " controle(s) mislukt." : "\nAlle controles geslaagd.");
  process.exit(fouten ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
