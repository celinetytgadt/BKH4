// maak-documenten.js — maakt alle verantwoordingsstukken van de case als PNG
// in de map documenten/.
//
//   node hulpmiddelen/maak-documenten.js            alle documenten
//   node hulpmiddelen/maak-documenten.js AK01 BANK03 enkel deze
//   node hulpmiddelen/maak-documenten.js --html     enkel de HTML (map _html)
//
// Werkwijze: elk document wordt als HTML-pagina opgebouwd uit case.json en
// daarna door Google Chrome (of Microsoft Edge) zonder venster gefotografeerd.
// Er is geen extra pakket nodig: Node praat rechtstreeks met de browser.
//
// De bestandsnaam is de referentie in de app (AK01.png, BANK07.png …), volledig
// in HOOFDLETTERS — GitHub Pages is hoofdlettergevoelig.

"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const { CASE, opdrachten, beginbalans, openFacturen2026, bedrijf } = require("./opbouw.js");

const ROOT = path.join(__dirname, "..");
const DOEL = path.join(ROOT, "documenten");
const BREEDTE = 1000;          // CSS-pixels; de PNG wordt 2x zo groot (scherp)

/* ======================================================================
   Opmaakhulpjes
   ====================================================================== */

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus",
  "september", "oktober", "november", "december"];
const d = (iso) => new Date(iso + "T12:00:00Z");
const datumLang = (iso) => { const x = d(iso); return x.getUTCDate() + " " + MAANDEN[x.getUTCMonth()] + " " + x.getUTCFullYear(); };
const datumKort = (iso) => { const x = d(iso); const p = (n) => String(n).padStart(2, "0"); return p(x.getUTCDate()) + "-" + p(x.getUTCMonth() + 1) + "-" + x.getUTCFullYear(); };
const datumSlash = (iso) => datumKort(iso).replace(/-/g, "/");
const plusDagen = (iso, n) => { const x = d(iso); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

function bedrag(n, metTeken) {
  const neg = n < 0;
  const a = Math.abs(Math.round(n * 100) / 100);
  const heel = Math.abs(a - Math.round(a)) < 0.005;
  const t = new Intl.NumberFormat("nl-BE", { minimumFractionDigits: heel ? 0 : 2, maximumFractionDigits: 2 }).format(a);
  return (neg ? "- " : (metTeken ? "+ " : "")) + t;
}
const eur = (n) => (n < 0 ? "- € " + bedrag(-n) : "€ " + bedrag(n));
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pct = (p) => Math.round(p * 100) + "%";

/* ======================================================================
   Huisstijl per bedrijf (fictief)
   ====================================================================== */

const STIJL = {
  NOOR: { kleur: "#1f7a4d", donker: "#14422b", letter: "N", slogan: "fietsenwinkel en -herstelling · Leuven" },
  VELO: { kleur: "#e8590c", donker: "#2b2d31", letter: "V", slogan: "groothandel in fietsen sinds 1994" },
  SPAAK: { kleur: "#1c64c4", donker: "#13294b", letter: "S", slogan: "onderdelen en accessoires voor de vakhandel" },
  HELM: { kleur: "#7048e8", donker: "#2a1f55", letter: "H", slogan: "helmen en sloten · groothandel" },
  STROOM: { kleur: "#e0a100", donker: "#3b3000", letter: "⚡", slogan: "groene stroom voor ondernemers" },
  NET: { kleur: "#0b7285", donker: "#062f37", letter: "n", slogan: "internet en telefonie voor kmo's" },
  MOREAU: { kleur: "#c92a2a", donker: "#25262b", letter: "M", slogan: "bedrijfswagens · verkoop en onderhoud" },
};
function stijlVan(naam) {
  const b = bedrijf(naam);
  return { b, s: (b && STIJL[b.code]) || STIJL.NOOR };
}

/* ======================================================================
   Gemeenschappelijke CSS
   ====================================================================== */

const CSS = `
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;overflow:hidden}
::-webkit-scrollbar{display:none}
body{min-height:100vh;display:flex;flex-direction:column;width:${BREEDTE}px;font-family:Arial,"Liberation Sans",Helvetica,sans-serif;color:#22252a;font-size:17px;line-height:1.35}
.kop{display:flex;justify-content:space-between;align-items:center;padding:34px 56px 30px 56px;color:#fff}
.logo{display:flex;align-items:center;gap:20px}
.logo .blok{width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:700;color:#fff}
.logo .naam{font-size:40px;font-weight:700;letter-spacing:.5px}
.logo .slogan{font-size:15px;opacity:.75;margin-top:2px}
.kop .gegevens{text-align:right;font-size:15px;opacity:.9;line-height:1.6}
.inhoud{padding:30px 56px 20px 56px}
.titelrij{display:flex;justify-content:space-between;align-items:flex-start}
h1{font-size:40px;margin:0 0 6px 0;letter-spacing:.5px}
.streep{height:6px;width:120px;margin-bottom:22px}
.meta{display:grid;grid-template-columns:auto auto;gap:4px 34px;font-size:17px}
.meta .l{color:#8a8178;font-weight:700}
.adres .l{color:#8a8178;font-weight:700;font-size:14px;letter-spacing:.5px;margin-bottom:4px}
table{width:100%;border-collapse:collapse}
th{font-size:14px;letter-spacing:.4px;text-align:left;padding:9px 6px;border-bottom:2px solid #d6d2cc}
td{padding:9px 6px;border-bottom:1px solid #e6e2dc;vertical-align:top}
.r{text-align:right}
.zacht{color:#7a746c}
.voet{margin-top:auto;padding:14px 56px;color:#c9c5bf;font-size:13px;text-align:center;line-height:1.6}
.totaal-blok{display:flex;justify-content:space-between;gap:30px;margin-top:22px;align-items:flex-start}
.totaal-blok .uitleg{font-size:15px;color:#5a554f;max-width:430px}
.totalen{background:#f1efec;padding:18px 24px;min-width:400px}
.totalen .rij{display:flex;justify-content:space-between;padding:4px 0}
.totalen .groot{border-top:1px solid #bdb8b1;margin-top:8px;padding-top:12px;font-size:21px;font-weight:700}
.reden{margin-top:14px;padding:12px 16px;border-left:5px solid;background:#faf8f6;font-size:16px}
.sterretje{font-size:14px;color:#5a554f;margin-top:6px}
`;

function pagina(inhoud, extraCss) {
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${CSS}${extraCss || ""}</style></head><body>${inhoud}</body></html>`;
}

const FICTIEF = "Dit is een fictief document, gemaakt voor de lessen boekhouden in het secundair onderwijs.";

/* ======================================================================
   Factuur en creditnota
   ====================================================================== */

function factuurHtml(doc, lijnen) {
  const cn = /^CN-/.test(doc.soort);
  const uitgaand = doc.van === "Fietsatelier Noor bv";
  const { b: van, s } = stijlVan(doc.van);
  const aan = bedrijf(doc.aan);

  const fk = lijnen.find((l) => l.soort === "financiële korting");
  const tabelLijnen = lijnen.filter((l) => l.soort !== "financiële korting");

  const rij = (l) => {
    if (l.soort === "handelskorting") {
      return `<tr><td>${esc(l.oms)}</td><td class="r"></td><td class="r"></td><td class="r">${pct(l.btwPct)}</td><td class="r">${eur(l.bedrag)}</td></tr>`;
    }
    const btw = l.soort === "verpakking" ? "geen" : pct(l.btwPct);
    return `<tr><td>${esc(l.oms)}</td><td class="r">${bedrag(l.aantal)}</td><td class="r">${eur(l.prijs)}</td><td class="r">${btw}</td><td class="r">${eur(l.bedrag)}</td></tr>`;
  };

  const tot = [];
  if (fk) {
    const brutoGoed = tabelLijnen.filter((l) => l.btwPct > 0).reduce((t, l) => t + l.bedrag, 0);
    tot.push(["Totaal excl. btw", eur(brutoGoed)]);
    tot.push(["Financiële korting " + pct(fk.aantal) + " (*)", eur(fk.bedrag)]);
  }
  if (doc.mvh21) { tot.push(["Maatstaf van heffing 21%", eur(doc.mvh21)]); tot.push(["Btw 21%", eur(doc.btw21)]); }
  if (doc.mvh6) { tot.push(["Maatstaf van heffing 6%", eur(doc.mvh6)]); tot.push(["Btw 6%", eur(doc.btw6)]); }
  if (doc.waarborg) tot.push(["Waarborg verpakking (geen btw)", eur(doc.waarborg)]);

  const iban = van && van.iban ? van.iban : "";
  let uitleg;
  if (cn) {
    uitleg = uitgaand
      ? "Dit bedrag wordt verrekend met uw factuur " + esc(doc.verwijst) + ". Is die al betaald, dan storten wij het terug."
      : "Dit bedrag mag u in mindering brengen op onze factuur " + esc(doc.verwijst) + ". Is die al betaald, dan storten wij het terug.";
  } else {
    uitleg = "Betaalbaar uiterlijk op " + datumLang(doc.vervaldag) + " op rekening " + esc(iban) +
      " van " + esc(doc.van) + ". Vermeld het factuurnummer.";
    if (doc.waarborg) uitleg += "<br><br>De waarborg krijgt u terug wanneer u de verpakking ongeschonden terugbezorgt.";
  }
  const sterretje = fk
    ? `<div class="sterretje">(*) Betaalt u binnen 10 dagen, uiterlijk op ${datumLang(plusDagen(doc.datum, 10))}, dan mag u de financiële korting aftrekken en betaalt u ${eur(doc.binnenTermijn)}. ` +
      `Betaalt u later, dan betaalt u het volledige bedrag. De btw is berekend op het bedrag na korting.</div>`
    : "";

  const meta = cn
    ? [["Nummer", doc.nr], ["Datum", datumLang(doc.datum)], ["Bij factuur", doc.verwijst]]
    : [["Factuurnummer", doc.nr], ["Factuurdatum", datumLang(doc.datum)], ["Vervaldag", datumLang(doc.vervaldag)]];

  const html = `
<div class="kop" style="background:${s.donker}">
  <div class="logo"><div class="blok" style="background:${s.kleur}">${s.letter}</div>
    <div><div class="naam">${esc(doc.van)}</div><div class="slogan">${esc(s.slogan)}</div></div></div>
  <div class="gegevens">${esc(van.adres)} · ${esc(van.gemeente)}<br>Btw ${esc(van.btw)}<br>IBAN ${esc(van.iban)}</div>
</div>
<div class="inhoud">
  <div class="titelrij">
    <div><h1>${cn ? "CREDITNOTA" : "FACTUUR"}</h1><div class="streep" style="background:${s.kleur}"></div>
      <div class="adres"><div class="l">${cn ? "AAN" : "GEFACTUREERD AAN"}</div>
        ${esc(aan.naam)}<br>${esc(aan.adres)}<br>${esc(aan.gemeente)}<br>Btw ${esc(aan.btw)}</div></div>
    <div class="meta">${meta.map((m) => `<div class="l">${m[0]}</div><div>${esc(m[1])}</div>`).join("")}</div>
  </div>
  ${cn && doc.reden ? `<div class="reden" style="border-color:${s.kleur}"><strong>Reden:</strong> ${esc(doc.reden)}</div>` : ""}
  <table style="margin-top:24px">
    <thead><tr style="color:${s.kleur}"><th>OMSCHRIJVING</th><th class="r">AANTAL</th><th class="r">EENHEIDSPRIJS</th><th class="r">BTW</th><th class="r">BEDRAG</th></tr></thead>
    <tbody>${tabelLijnen.map(rij).join("")}</tbody>
  </table>
  <div class="totaal-blok">
    <div class="uitleg">${uitleg}</div>
    <div class="totalen">
      ${tot.map((t) => `<div class="rij"><span>${t[0]}</span><span>${t[1]}</span></div>`).join("")}
      <div class="rij groot"><span style="color:${s.kleur}">${cn ? "IN UW VOORDEEL" : "TOTAAL TE BETALEN"}</span><span>${eur(doc.totaal)}</span></div>
    </div>
  </div>
  ${sterretje}
</div>
<div class="voet" style="background:${s.donker}">${esc(doc.van)} · ${esc(van.adres)}, ${esc(van.gemeente)} · Btw ${esc(van.btw)}<br>${FICTIEF}</div>`;
  return pagina(html);
}

/* ======================================================================
   Dagontvangstenblad
   ====================================================================== */

function dagontvangstHtml(doc, lijnen) {
  const s = STIJL.NOOR;
  const noor = bedrijf("Fietsatelier Noor bv");
  const groep21 = lijnen.filter((l) => l.btwPct === 0.21);
  const groep6 = lijnen.filter((l) => l.btwPct === 0.06);
  const rij = (l) => `<tr><td>${esc(l.oms)}</td><td class="r">${bedrag(l.aantal)}</td><td class="r">${eur(l.prijs * (1 + l.btwPct))}</td>` +
    `<td class="r">${pct(l.btwPct)}</td><td class="r">${eur(l.bedrag + l.btw)}</td></tr>`;
  const html = `
<div class="kop" style="background:${s.donker}">
  <div class="logo"><div class="blok" style="background:${s.kleur}">${s.letter}</div>
    <div><div class="naam">Fietsatelier Noor bv</div><div class="slogan">${esc(s.slogan)}</div></div></div>
  <div class="gegevens">${esc(noor.adres)} · ${esc(noor.gemeente)}<br>Btw ${esc(noor.btw)}</div>
</div>
<div class="inhoud">
  <div class="titelrij">
    <div><h1>DAGONTVANGSTENBLAD</h1><div class="streep" style="background:${s.kleur}"></div>
      <div class="zacht">Verkopen aan particulieren in de winkel (kastickets)</div></div>
    <div class="meta"><div class="l">Nummer</div><div>${esc(doc.nr)}</div><div class="l">Datum</div><div>${datumLang(doc.datum)}</div></div>
  </div>
  <table style="margin-top:22px">
    <thead><tr style="color:${s.kleur}"><th>VERKOCHT (KASTICKETS)</th><th class="r">AANTAL</th><th class="r">PRIJS INCL. BTW</th><th class="r">BTW</th><th class="r">TOTAAL INCL. BTW</th></tr></thead>
    <tbody>${groep21.concat(groep6).map(rij).join("")}</tbody>
  </table>
  <table style="margin-top:26px">
    <thead><tr style="color:${s.kleur}"><th>SAMENVATTING</th><th class="r">BTW</th><th class="r">EXCL. BTW</th><th class="r">BTW</th><th class="r">INCL. BTW</th></tr></thead>
    <tbody>
      ${doc.mvh21 ? `<tr><td>Verkopen fietsen en accessoires</td><td class="r">21%</td><td class="r">${eur(doc.mvh21)}</td><td class="r">${eur(doc.btw21)}</td><td class="r">${eur(doc.mvh21 + doc.btw21)}</td></tr>` : ""}
      ${doc.mvh6 ? `<tr><td>Herstellingen</td><td class="r">6%</td><td class="r">${eur(doc.mvh6)}</td><td class="r">${eur(doc.btw6)}</td><td class="r">${eur(doc.mvh6 + doc.btw6)}</td></tr>` : ""}
      <tr style="font-weight:700"><td>Totaal</td><td></td><td class="r">${eur(doc.mvh21 + doc.mvh6)}</td><td class="r">${eur(doc.btw21 + doc.btw6)}</td><td class="r">${eur(doc.totaal)}</td></tr>
      <tr><td>Waarvan contant ontvangen (in de kassa)</td><td></td><td></td><td></td><td class="r">${eur(doc.contant)}</td></tr>
      <tr><td>Waarvan met bancontact ontvangen (komt later op de bankrekening)</td><td></td><td></td><td></td><td class="r">${eur(doc.bancontact)}</td></tr>
    </tbody>
  </table>
</div>
<div class="voet" style="background:${s.donker}">Fietsatelier Noor bv · ${esc(noor.adres)}, ${esc(noor.gemeente)} · Btw ${esc(noor.btw)}<br>${FICTIEF}</div>`;
  return pagina(html);
}

/* ======================================================================
   Kasstuk
   ====================================================================== */

function kasHtml(doc, vorig, nieuw) {
  const s = STIJL.NOOR;
  const bedr = doc.contant;   // + ontvangst, - uitgave
  const soort = doc.subsoort === "ontvangst" ? "Ontvangst" : doc.subsoort === "storting" ? "Uitgave" : "Ontvangst";
  let oms = doc.reden;
  if (doc.subsoort === "ontvangst") oms = "Contant ontvangen bij de dagontvangsten van " + datumLang(doc.datum) + " (dagontvangstenblad " + doc.verwijst + ")";
  if (doc.subsoort === "storting") oms = "Contanten uit de kassa naar de bank gebracht (storting op de bankrekening)";
  if (doc.subsoort === "afhaling") oms = "Wisselgeld afgehaald van de bankrekening en in de kassa gelegd";
  const html = `
<div class="kop" style="background:${s.donker}">
  <div class="logo"><div class="blok" style="background:${s.kleur}">${s.letter}</div>
    <div><div class="naam">Fietsatelier Noor bv</div><div class="slogan">kasboek van de winkel</div></div></div>
  <div class="gegevens">Kasstuk ${esc(doc.nr)}<br>${datumLang(doc.datum)}</div>
</div>
<div class="inhoud">
  <div class="titelrij">
    <div><h1>KASSTUK</h1><div class="streep" style="background:${s.kleur}"></div></div>
    <div class="meta"><div class="l">Nummer</div><div>${esc(doc.nr)}</div><div class="l">Datum</div><div>${datumLang(doc.datum)}</div>
      <div class="l">Opgemaakt door</div><div>Noor Benali</div></div>
  </div>
  <table style="margin-top:20px;font-size:19px">
    <thead><tr style="color:${s.kleur}"><th style="width:60%">OMSCHRIJVING</th><th class="r">ONTVANGST</th><th class="r">UITGAVE</th></tr></thead>
    <tbody>
      <tr style="background:#eef6f1;font-weight:700"><td>Kassaldo vóór deze verrichting</td><td class="r" colspan="2">${eur(vorig)}</td></tr>
      <tr><td><strong>${soort}</strong><br>${esc(oms)}</td><td class="r">${bedr > 0 ? eur(bedr) : ""}</td><td class="r">${bedr < 0 ? eur(-bedr) : ""}</td></tr>
      <tr style="background:#eef6f1;font-weight:700"><td>Nieuw kassaldo</td><td class="r" colspan="2">${eur(nieuw)}</td></tr>
    </tbody>
  </table>
  <div class="sterretje" style="margin-top:22px">Handtekening voor ontvangst / uitgave: &nbsp; <em style="font-family:'Segoe Script','Brush Script MT',cursive;font-size:24px;color:#2b3a8f">N. Benali</em></div>
</div>
<div class="voet" style="background:${s.donker}">Fietsatelier Noor bv · intern document<br>${FICTIEF}</div>`;
  return pagina(html);
}

/* ======================================================================
   Rekeninguittreksel
   ====================================================================== */

const BANK = { kleur: "#7a1f3d", licht: "#f6e9ee", naam: "Banco Leuven" };

function bankLabel(r) {
  const o = r.oms.toLowerCase();
  if (o.indexOf("bancontact") === 0) return "Bancontact-ontvangsten";
  if (o.indexOf("storting") === 0) return "Storting contanten";
  if (o.indexOf("afhaling") === 0) return "Geldopname";
  if (o.indexOf("opname lening") === 0) return "Kredietopname in uw voordeel";
  if (o.indexOf("aflossing") === 0) return "Aflossing krediet";
  return r.bedrag > 0 ? "Overschrijving in uw voordeel" : "Overschrijving in uw nadeel";
}

function bankHtml(nr, regels, vorig) {
  const noor = bedrijf("Fietsatelier Noor bv");
  const nieuw = regels[regels.length - 1].saldo;
  const html = `
<div style="height:40px;background:${BANK.kleur}"></div>
<div class="inhoud" style="padding-top:26px">
  <div class="titelrij">
    <div style="display:flex;align-items:center;gap:18px">
      <div style="width:64px;height:64px;border-radius:50%;background:${BANK.kleur};color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700">BL</div>
      <div><div style="font-size:34px;font-weight:700;color:#2a1720">${BANK.naam}</div>
        <div class="zacht">${esc(noor.naam)} · ${esc(noor.adres)} · ${esc(noor.gemeente)}<br>Rekening ${esc(noor.iban)}</div></div>
    </div>
    <div style="text-align:right"><div style="font-size:26px;font-weight:700;color:#2a1720">REKENINGUITTREKSEL NR. ${nr}</div>
      <div style="font-size:22px;margin-top:6px">${datumSlash(regels[0].datum)}</div></div>
  </div>
  <table style="margin-top:30px;font-size:18px">
    <tbody>
      <tr style="background:${BANK.licht};font-weight:700"><td style="width:140px"></td><td>Vorig saldo</td><td class="r">${bedrag(vorig)} €</td></tr>
      ${regels.map((r) => `<tr><td>${datumKort(r.datum)}</td><td><strong style="color:${r.bedrag > 0 ? "#1f6f4a" : "#a61e1e"}">${bankLabel(r)}</strong><br>${esc(r.oms)}</td>` +
        `<td class="r" style="white-space:nowrap">${bedrag(r.bedrag, true)} €</td></tr>`).join("")}
      <tr style="background:${BANK.licht};font-weight:700"><td></td><td>Nieuw saldo</td><td class="r">${bedrag(nieuw)} €</td></tr>
    </tbody>
  </table>
</div>
<div class="voet" style="color:${BANK.kleur}">Banco Leuven nv · Ladeuzeplein 1, 3000 Leuven · BIC BALEBE22<br>${FICTIEF}</div>`;
  return pagina(html);
}

/* ======================================================================
   Beginbalans, lening, afschrijvingen, voorraad
   ====================================================================== */

function balansKop(titel, sub, meta) {
  const s = STIJL.NOOR;
  return `
<div class="kop" style="background:${s.donker}">
  <div class="logo"><div class="blok" style="background:${s.kleur}">${s.letter}</div>
    <div><div class="naam">Fietsatelier Noor bv</div><div class="slogan">${esc(s.slogan)}</div></div></div>
  <div class="gegevens">Fietsstraat 12 · 3000 Leuven<br>Btw BE 0999.000.101</div>
</div>
<div class="inhoud">
  <div class="titelrij">
    <div><h1>${titel}</h1><div class="streep" style="background:${s.kleur}"></div><div class="zacht">${sub}</div></div>
    <div class="meta">${meta.map((m) => `<div class="l">${m[0]}</div><div>${esc(m[1])}</div>`).join("")}</div>
  </div>`;
}
const balansVoet = () => `</div><div class="voet" style="background:${STIJL.NOOR.donker}">Fietsatelier Noor bv · Fietsstraat 12, 3000 Leuven<br>${FICTIEF}</div>`;

function beginbalansHtml() {
  const bb = {};
  beginbalans().forEach((r) => { bb[r.rekening] = r.saldo; });
  const v = (nr) => bb[nr] || 0;
  const imu = v("230000") + v("230009") + v("232000") + v("232009");
  const mrm = v("240200") + v("240209") + v("241000") + v("241009");
  const act = [
    ["h", "VASTE ACTIVA", imu + mrm],
    ["s", "III. Materiële vaste activa", imu + mrm],
    ["r", "Installaties, machines en uitrusting", imu, "aanschaf " + bedrag(v("230000") + v("232000")) + " − afschr. " + bedrag(-(v("230009") + v("232009")))],
    ["r", "Meubilair en rollend materieel", mrm, "aanschaf " + bedrag(v("240200") + v("241000")) + " − afschr. " + bedrag(-(v("240209") + v("241009")))],
    ["x"],
    ["h", "VLOTTENDE ACTIVA", v("340000") + v("400000") + v("550000") + v("570000")],
    ["s", "VI. Voorraden", v("340000")],
    ["r", "Handelsgoederen", v("340000")],
    ["s", "VII. Vorderingen op ten hoogste 1 jaar", v("400000")],
    ["r", "Handelsvorderingen", v("400000"), "factuur 2026-018 aan Velocity Deelfietsen bv"],
    ["s", "IX. Liquide middelen", v("550000") + v("570000")],
    ["r", "Bank", v("550000")],
    ["r", "Kas", v("570000")],
  ];
  const pas = [
    ["h", "EIGEN VERMOGEN", -(v("100000") + v("140000"))],
    ["s", "I. Kapitaal", -v("100000")],
    ["r", "Geplaatst kapitaal", -v("100000")],
    ["s", "V. Overgedragen winst", -v("140000")],
    ["r", "Overgedragen winst", -v("140000"), "winst van 2026"],
    ["x"],
    ["h", "SCHULDEN", -(v("440000") + v("451000"))],
    ["s", "IX. Schulden op ten hoogste 1 jaar", -(v("440000") + v("451000"))],
    ["r", "Leveranciers", -v("440000"), "factuur 2026-1288 van Velomax bv"],
    ["r", "Te betalen btw", -v("451000"), "btw 2026, te betalen in januari"],
  ];
  const totA = act.filter((r) => r[0] === "h").reduce((t, r) => t + r[2], 0);
  const totP = pas.filter((r) => r[0] === "h").reduce((t, r) => t + r[2], 0);
  const kol = (rijen) => rijen.map((r) => {
    if (r[0] === "x") return `<tr><td colspan="2" style="border:0;height:14px"></td></tr>`;
    const stijl = r[0] === "h" ? "font-weight:700;color:#14422b" : r[0] === "s" ? "font-weight:700" : "";
    const ins = r[0] === "r" ? "padding-left:22px" : "";
    return `<tr style="${stijl}"><td style="${ins};border:0;padding-top:5px;padding-bottom:5px">${esc(r[1])}${r[3] ? `<div class="zacht" style="font-size:13px;font-weight:400">${esc(r[3])}</div>` : ""}</td>` +
      `<td class="r" style="border:0;padding-top:5px;padding-bottom:5px">${bedrag(r[2])}</td></tr>`;
  }).join("");
  const html = balansKop("BEGINBALANS", "toestand op 1 januari 2027 · alle bedragen in euro",
    [["Boekjaar", "2027"], ["Situatie op", "1 januari 2027"], ["Bron", "eindbalans 2026 na afsluiting"]]) + `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:20px;border-top:2px solid #14422b;padding-top:8px">
    <table><thead><tr><th>ACTIVA</th><th class="r">BEDRAG</th></tr></thead><tbody>${kol(act)}</tbody></table>
    <table><thead><tr><th>PASSIVA</th><th class="r">BEDRAG</th></tr></thead><tbody>${kol(pas)}</tbody></table>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:2px solid #14422b;margin-top:10px;padding-top:10px;font-weight:700;font-size:19px">
    <div style="display:flex;justify-content:space-between"><span>TOTAAL ACTIVA</span><span>${bedrag(totA)}</span></div>
    <div style="display:flex;justify-content:space-between"><span>TOTAAL PASSIVA</span><span>${bedrag(totP)}</span></div>
  </div>` + balansVoet();
  if (Math.abs(totA - totP) > 0.005) throw new Error("Beginbalans niet in evenwicht: " + totA + " / " + totP);
  return pagina(html);
}

function leningHtml() {
  const opname = CASE.j2.uittreksels.find((u) => /opname lening/i.test(u.oms));
  const aflossingen = CASE.j2.uittreksels.filter((u) => /aflossing lening/i.test(u.oms));
  const kapitaal = opname.bedrag;
  const kapPerKw = 1500;
  const n = Math.round(kapitaal / kapPerKw);
  const rente = Math.round((Number((aflossingen[0].oms.match(/intrest ([\d.]+)/) || [])[1].replace(/\./g, "")) / kapitaal) * 10000) / 10000;
  const rijen = [];
  let rest = kapitaal;
  const start = d(opname.datum);
  for (let i = 1; i <= n; i++) {
    const x = new Date(start); x.setUTCMonth(x.getUTCMonth() + 3 * i);
    const intrest = Math.round(rest * rente * 100) / 100;
    rest = Math.round((rest - kapPerKw) * 100) / 100;
    rijen.push({ nr: i, datum: x.toISOString().slice(0, 10), kap: kapPerKw, intrest, rest });
  }
  // Nazicht met de afschriften uit de case.
  aflossingen.forEach((a, i) => {
    const t = rijen[i].kap + rijen[i].intrest;
    if (Math.abs(t + a.bedrag) > 0.005) throw new Error("Aflossing " + (i + 1) + " klopt niet met de tabel: " + t + " vs " + a.bedrag);
  });
  const html = `
<div style="height:40px;background:${BANK.kleur}"></div>
<div class="inhoud" style="padding-top:26px">
  <div class="titelrij">
    <div style="display:flex;align-items:center;gap:18px">
      <div style="width:64px;height:64px;border-radius:50%;background:${BANK.kleur};color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700">BL</div>
      <div><div style="font-size:34px;font-weight:700;color:#2a1720">${BANK.naam}</div><div class="zacht">Kredietovereenkomst nr. 2027-0042 · investeringskrediet</div></div>
    </div>
    <div class="meta"><div class="l">Kredietnemer</div><div>Fietsatelier Noor bv</div>
      <div class="l">Bedrag</div><div>${eur(kapitaal)}</div>
      <div class="l">Opname</div><div>${datumLang(opname.datum)}</div>
      <div class="l">Doel</div><div>aankoop bestelwagen</div>
      <div class="l">Rentevoet</div><div>${Math.round(rente * 400 * 100) / 100}% per jaar (${Math.round(rente * 10000) / 100}% per kwartaal)</div>
      <div class="l">Aflossing</div><div>${n} kwartalen, telkens ${eur(kapPerKw)} kapitaal + intrest</div></div>
  </div>
  <h2 style="margin:22px 0 4px 0;color:#2a1720">AFLOSSINGSTABEL</h2>
  <div class="zacht" style="font-size:15px">De intrest wordt elk kwartaal berekend op het kapitaal dat nog openstaat. Het bedrag wordt automatisch van uw rekening gehaald op de vervaldag.</div>
  <table style="margin-top:10px;font-size:15px">
    <thead><tr style="color:${BANK.kleur}"><th>NR.</th><th>VERVALDAG</th><th class="r">KAPITAAL</th><th class="r">INTREST</th><th class="r">TE BETALEN</th><th class="r">NOG AF TE LOSSEN KAPITAAL</th></tr></thead>
    <tbody>
      <tr><td></td><td>${datumSlash(opname.datum)} (opname)</td><td></td><td></td><td></td><td class="r">${bedrag(kapitaal)}</td></tr>
      ${rijen.map((r) => `<tr><td>${r.nr}</td><td>${datumSlash(r.datum)}</td><td class="r">${bedrag(r.kap)}</td><td class="r">${bedrag(r.intrest)}</td><td class="r">${bedrag(r.kap + r.intrest)}</td><td class="r">${bedrag(r.rest)}</td></tr>`).join("")}
    </tbody>
  </table>
</div>
<div class="voet" style="color:${BANK.kleur}">Banco Leuven nv · Ladeuzeplein 1, 3000 Leuven<br>${FICTIEF}</div>`;
  return pagina(html);
}

function afschrijvingHtml() {
  // De vaste activa en hun aankoop, uit jaar 1 en jaar 2 van de case.
  const j1 = (id) => CASE.j1.documenten.find((x) => x.id === id);
  const items = [
    { oms: "Bakfiets voor leveringen", aanschaf: "bij de opstart (2026)", waarde: 6000, jaren: 5, reeds: 1200 },
    { oms: "Werkbank met bankschroef en gereedschapswand", aanschaf: datumSlash(j1("C03").datum), waarde: 1500, jaren: 5, reeds: 300 },
    { oms: "Kassasysteem met touchscreen", aanschaf: datumSlash(j1("A5").datum), waarde: 1200, jaren: 3, reeds: 400 },
    { oms: "Montagestandaard voor fietsen", aanschaf: datumSlash(j1("Q2A3").datum), waarde: 500, jaren: 5, reeds: 100 },
    { oms: "Laptop voor administratie en webshop", aanschaf: datumSlash(j1("Q4A2").datum), waarde: 900, jaren: 3, reeds: 300 },
    { oms: "Bestelwagen (lichte vracht), elektrisch", aanschaf: datumSlash(CASE.j2.documenten.find((x) => x.id === "J2A2").datum), waarde: 24000, jaren: 5, reeds: 0 },
  ];
  items.forEach((i) => { i.dit = i.waarde / i.jaren; i.cumul = i.reeds + i.dit; i.boek = i.waarde - i.cumul; });
  // Nazicht met de sleutel: totaal van de afschrijvingen 2027.
  const sleutel = CASE.j2.journaal.filter((j) => j.doc === "AF2-3").reduce((t, j) => t + j.debet, 0);
  const tot = (k) => items.reduce((t, i) => t + i[k], 0);
  if (Math.abs(tot("dit") - sleutel) > 0.005) throw new Error("Afschrijvingen " + tot("dit") + " ≠ sleutel " + sleutel);
  const html = balansKop("AFSCHRIJVINGSTABEL", "boekjaar 2027 · alle bedragen in euro",
    [["Tabel", "AFSCHR"], ["Periode", "01/01 – 31/12/2027"], ["Methode", "lineair"]]) + `
  <table style="margin-top:22px;font-size:15.5px">
    <thead><tr style="color:#1f7a4d"><th>OMSCHRIJVING</th><th>AANGEKOCHT</th><th class="r">AANSCHAF</th><th class="r">JAREN</th><th class="r">%</th>
      <th class="r">REEDS AFGE&shy;SCHREVEN</th><th class="r">AFSCHR. 2027</th><th class="r">CUMUL</th><th class="r">BOEK&shy;WAARDE</th></tr></thead>
    <tbody>${items.map((i) => `<tr><td>${esc(i.oms)}</td><td>${esc(i.aanschaf)}</td><td class="r">${bedrag(i.waarde)}</td><td class="r">${i.jaren}</td>` +
      `<td class="r">${bedrag(Math.round(10000 / i.jaren) / 100)}</td><td class="r">${bedrag(i.reeds)}</td><td class="r"><strong>${bedrag(i.dit)}</strong></td>` +
      `<td class="r">${bedrag(i.cumul)}</td><td class="r">${bedrag(i.boek)}</td></tr>`).join("")}
      <tr style="font-weight:700"><td>TOTAAL</td><td></td><td class="r">${bedrag(tot("waarde"))}</td><td></td><td></td><td class="r">${bedrag(tot("reeds"))}</td>
        <td class="r">${bedrag(tot("dit"))}</td><td class="r">${bedrag(tot("cumul"))}</td><td class="r">${bedrag(tot("boek"))}</td></tr>
    </tbody>
  </table>
  <p style="font-size:15px;margin-top:18px">Alle vaste activa worden lineair afgeschreven over hun gebruiksduur. Fietsatelier Noor schrijft altijd per volledig jaar af:
  ook een actief dat in de loop van het jaar gekocht werd (zoals de bestelwagen in juli), krijgt in het jaar van aankoop een volledige jaarafschrijving.</p>` + balansVoet();
  return pagina(html);
}

function voorraadHtml() {
  const v = CASE.j2.voorraad;
  const totaal = v.reduce((t, r) => t + r.waarde, 0);
  const html = balansKop("VOORRAADTELLING", "inventaris van de handelsgoederen · alle bedragen in euro",
    [["Telling op", "31 december 2027"], ["Geteld door", "Noor Benali"], ["Waardering", "aankoopprijs per stuk"]]) + `
  <table style="margin-top:22px;font-size:17px">
    <thead><tr style="color:#1f7a4d"><th>CODE</th><th>ARTIKEL</th><th class="r">GETELD</th><th class="r">AANKOOPPRIJS</th><th class="r">WAARDE</th></tr></thead>
    <tbody>${v.map((r) => `<tr><td>${esc(r.artikel)}</td><td>${esc(r.oms)}</td><td class="r">${bedrag(r.inventaris)}</td><td class="r">${eur(r.prijs)}</td><td class="r">${eur(r.waarde)}</td></tr>`).join("")}
      <tr style="font-weight:700;font-size:19px"><td></td><td>TOTALE WAARDE VAN DE VOORRAAD</td><td></td><td></td><td class="r">${eur(totaal)}</td></tr>
    </tbody>
  </table>
  <p style="font-size:15px;margin-top:18px">De voorraad is op 31 december 2027 na sluitingstijd geteld in de winkel en in het magazijn.</p>` + balansVoet();
  return pagina(html);
}

/* ======================================================================
   Alles samenzetten
   ====================================================================== */

function alleDocumenten() {
  const docs = [];
  const lijnenVan = (lijst, id) => lijst.filter((l) => l.id === id).sort((a, b) => a.lijn - b.lijn);

  docs.push({ naam: "BEGINBALANS", html: beginbalansHtml() });
  openFacturen2026().forEach((doc) => {
    docs.push({ naam: doc.soort === "AK" ? "BBAK" : "BBVK", html: factuurHtml(doc, lijnenVan(CASE.j1.lijnen, doc.id)) });
  });
  docs.push({ naam: "LENING", html: leningHtml() });

  let kas = beginbalans().find((r) => r.rekening === "570000").saldo;
  let bank = beginbalans().find((r) => r.rekening === "550000").saldo;

  opdrachten().forEach((o) => {
    if (o.soort === "BANK") {
      docs.push({ naam: o.ref, html: bankHtml(o.uittreksel, o.regels, bank) });
      bank = o.regels[o.regels.length - 1].saldo;
    } else if (/^KAS/.test(o.soort)) {
      const nieuw = Math.round((kas + o.doc.contant) * 100) / 100;
      docs.push({ naam: o.ref, html: kasHtml(o.doc, kas, nieuw) });
      kas = nieuw;
    } else if (o.soort === "DO") {
      docs.push({ naam: o.ref, html: dagontvangstHtml(o.doc, lijnenVan(CASE.j2.lijnen, o.doc.id)) });
    } else if (/^(CN-)?(AK|VK)$/.test(o.soort)) {
      docs.push({ naam: o.ref, html: factuurHtml(o.doc, lijnenVan(CASE.j2.lijnen, o.doc.id)) });
    } else if (o.soort === "VR") {
      docs.push({ naam: "VR", html: voorraadHtml() });
    } else if (o.soort === "AFSCHR") {
      docs.push({ naam: "AFSCHR", html: afschrijvingHtml() });
    }
  });

  // Nazicht: het kassaldo op het laatste kasstuk = de proefbalans.
  const kasSlot = CASE.j2.proefbalans.find((r) => r.rekening === "570000").slot;
  if (Math.abs(kas - kasSlot) > 0.005) throw new Error("Kassaldo " + kas + " ≠ proefbalans " + kasSlot);
  return docs;
}

/* ======================================================================
   Fotograferen met Chrome / Edge (DevTools-protocol, zonder extra pakket)
   ====================================================================== */

function zoekBrowser() {
  const kandidaten = [
    process.env.CHROME_PAD,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
  ].filter(Boolean);
  return kandidaten.find((p) => fs.existsSync(p));
}

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

async function fotografeer(docs) {
  const exe = zoekBrowser();
  if (!exe) throw new Error("Geen Chrome of Edge gevonden. Zet het pad in de omgevingsvariabele CHROME_PAD.");
  const profiel = fs.mkdtempSync(path.join(os.tmpdir(), "docs-chrome-"));
  const poort = 9300 + Math.floor(Math.random() * 500);
  const proc = spawn(exe, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--remote-debugging-port=" + poort, "--user-data-dir=" + profiel, "about:blank"], { stdio: "ignore" });

  let doel = null;
  for (let i = 0; i < 50 && !doel; i++) {
    await wacht(200);
    try {
      const lijst = await (await fetch("http://127.0.0.1:" + poort + "/json")).json();
      doel = lijst.find((t) => t.type === "page");
    } catch (e) { /* nog niet klaar */ }
  }
  if (!doel) { proc.kill(); throw new Error("De browser startte niet."); }

  const ws = new WebSocket(doel.webSocketDebuggerUrl);
  await new Promise((r, f) => { ws.onopen = r; ws.onerror = f; });
  let id = 0;
  const wachtend = {};
  const gebeurtenissen = [];
  ws.onmessage = (m) => {
    const b = JSON.parse(m.data);
    if (b.id && wachtend[b.id]) { wachtend[b.id](b); delete wachtend[b.id]; }
    else if (b.method) gebeurtenissen.push(b.method);
  };
  const cdp = (method, params) => new Promise((r, f) => {
    const n = ++id;
    wachtend[n] = (b) => (b.error ? f(new Error(method + ": " + b.error.message)) : r(b.result));
    ws.send(JSON.stringify({ id: n, method, params: params || {} }));
  });

  await cdp("Page.enable");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docs-html-"));
  for (const doc of docs) {
    const htmlPad = path.join(tmp, doc.naam + ".html");
    fs.writeFileSync(htmlPad, doc.html);
    await cdp("Emulation.setDeviceMetricsOverride", { width: BREEDTE, height: 800, deviceScaleFactor: 2, mobile: false });
    gebeurtenissen.length = 0;
    await cdp("Page.navigate", { url: "file:///" + htmlPad.replace(/\\/g, "/") });
    for (let i = 0; i < 100 && gebeurtenissen.indexOf("Page.loadEventFired") === -1; i++) await wacht(30);
    await cdp("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    const h = await cdp("Runtime.evaluate", { expression: "Math.ceil(document.documentElement.scrollHeight)", returnByValue: true });
    // Minstens liggend A4-formaat, zoals de documenten van kern 8.
    const hoogte = Math.max(760, h.result.value);
    await cdp("Emulation.setDeviceMetricsOverride", { width: BREEDTE, height: hoogte, deviceScaleFactor: 2, mobile: false });
    const foto = await cdp("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: BREEDTE, height: hoogte, scale: 1 } });
    fs.writeFileSync(path.join(DOEL, doc.naam + ".png"), Buffer.from(foto.data, "base64"));
    process.stdout.write(doc.naam + " ");
  }
  ws.close();
  proc.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
  try { fs.rmSync(profiel, { recursive: true, force: true }); } catch (e) { /* de browser houdt soms nog iets vast */ }
  console.log("\nKlaar: " + docs.length + " documenten in documenten/");
}

/* ====================================================================== */

(async () => {
  const args = process.argv.slice(2);
  let docs = alleDocumenten();
  const enkel = args.filter((a) => !a.startsWith("--")).map((a) => a.toUpperCase());
  if (enkel.length) docs = docs.filter((x) => enkel.indexOf(x.naam) !== -1);
  if (args.indexOf("--html") !== -1) {
    const map = path.join(__dirname, "_html");
    fs.mkdirSync(map, { recursive: true });
    docs.forEach((x) => fs.writeFileSync(path.join(map, x.naam + ".html"), x.html));
    console.log("HTML geschreven in " + map);
    return;
  }
  fs.mkdirSync(DOEL, { recursive: true });
  await fotografeer(docs);
})().catch((e) => { console.error(e); process.exit(1); });
