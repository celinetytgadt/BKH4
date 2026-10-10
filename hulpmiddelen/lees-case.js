// lees-case.js — leest de Excel van de case en zet ze om naar case.json
//
//   node hulpmiddelen/lees-case.js "pad/naar/case fietsatelier noor.xlsx"
//
// Enkel Node.js nodig, geen extra pakketten: een .xlsx is een zip-bestand met
// XML erin. Het uitpakken gebeurt met het programma "unzip" (zit bij Git voor
// Windows) of, als dat er niet is, met PowerShell.
//
// Alle andere hulpmiddelen (documenten, sleutel, opdrachtenlijst) lezen
// case.json, zodat de Excel maar één keer ingelezen hoeft te worden.

"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const bron = process.argv[2];
if (!bron || !fs.existsSync(bron)) {
  console.error('Gebruik: node hulpmiddelen/lees-case.js "pad/naar/case.xlsx"');
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "case-"));
try {
  execFileSync("unzip", ["-o", "-q", bron, "-d", tmp]);
} catch (e) {
  execFileSync("powershell", ["-NoProfile", "-Command",
    `Copy-Item -LiteralPath '${bron}' '${tmp}\\c.zip'; Expand-Archive -Force '${tmp}\\c.zip' '${tmp}'`]);
}

const dec = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const lees = (p) => fs.readFileSync(path.join(tmp, p), "utf8");

const gedeeld = [...lees("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)]
  .map((m) => dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join("")));
const namen = [...lees("xl/workbook.xml").matchAll(/<sheet name="([^"]+)"/g)].map((m) => dec(m[1]));

function kolom(ref) {
  let c = 0;
  for (const ch of ref.match(/[A-Z]+/)[0]) c = c * 26 + ch.charCodeAt(0) - 64;
  return c - 1;
}

function blad(naam) {
  const i = namen.indexOf(naam);
  if (i === -1) throw new Error("Tabblad niet gevonden: " + naam);
  const xml = lees(`xl/worksheets/sheet${i + 1}.xml`);
  const rijen = [];
  for (const r of xml.matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)) {
    const rij = [];
    for (const c of r[1].matchAll(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const t = (c[2].match(/t="(\w+)"/) || [])[1];
      const binnen = c[3] || "";
      const v = binnen.match(/<v>([\s\S]*?)<\/v>/);
      let w = "";
      if (t === "s" && v) w = gedeeld[+v[1]];
      else if (t === "inlineStr") w = dec((binnen.match(/<t[^>]*>([\s\S]*?)<\/t>/) || ["", ""])[1]);
      else if (t === "str" && v) w = dec(v[1]);
      else if (v) w = Number(v[1]);
      rij[kolom(c[1])] = w;
    }
    rijen.push(Array.from(rij, (x) => (x === undefined ? "" : x)));
  }
  return rijen;
}

// Een tabblad als lijst objecten, met de eerste rij als kolomnamen.
function tabel(naam) {
  const [kop, ...rest] = blad(naam);
  return rest.filter((r) => r.some((x) => x !== "")).map((r) => {
    const o = {};
    kop.forEach((k, i) => { if (k !== "") o[k] = r[i] === undefined ? "" : r[i]; });
    return o;
  });
}

// Excel-datum (dagen sinds 1900) naar "2027-01-16".
function datum(n) {
  if (typeof n !== "number") return "";
  return new Date(Math.round((n - 25569) * 86400000)).toISOString().slice(0, 10);
}
const rond = (x) => Math.round(Number(x || 0) * 100) / 100;

const bedrijven = tabel("Bedrijven");
const artikelen = tabel("Artikelen").filter((a) => a.Code && a.Omschrijving);

function documenten(naam) {
  return tabel(naam).map((d) => ({
    volgorde: d["Volgorde in set"], id: d.ID, set: d.Set, kwartaal: d.Kwartaal,
    soort: d.Soort, subsoort: d.Subsoort, datum: datum(d.Datum), vervaldag: datum(d.Vervaldag),
    nr: String(d.Documentnr), van: d.Van, aan: d.Aan, verwijst: String(d["Verwijst naar"] || ""),
    reden: d["Reden / omschrijving"],
    mvh21: rond(d["MvH 21%"]), btw21: rond(d["Btw 21%"]), mvh6: rond(d["MvH 6%"]), btw6: rond(d["Btw 6%"]),
    waarborg: rond(d.Waarborg), finKorting: rond(d["Fin. korting (niet afgetrokken)"]),
    totaal: rond(d["Totaal (te betalen)"]), binnenTermijn: rond(d["Te betalen binnen kortingstermijn"]),
    contant: rond(d["Contant (kas)"]), bancontact: rond(d.Bancontact),
    opmerking: d.Opmerking || "",
  }));
}

function lijnen(naam) {
  return tabel(naam).map((l) => ({
    id: l.ID, nr: String(l.Documentnr), lijn: l.Lijn, soort: l["Soort lijn"], artikel: l.Artikel,
    oms: l.Omschrijving, aantal: rond(l.Aantal), prijs: rond(l.Eenheidsprijs),
    bedrag: rond(l["Bedrag excl. btw"]), btwPct: rond(l["Btw %"]), btw: rond(l.Btw),
  }));
}

function journaal(naam) {
  return tabel(naam).map((j) => ({
    volgnr: j.Volgnr, datum: datum(j.Datum), set: j.Set, kwartaal: j.Kwartaal, doc: String(j.Document),
    rekening: String(j.Rekening), naam: j.Rekeningnaam, debet: rond(j.Debet), credit: rond(j.Credit),
    redenering: j.Redenering, afsluiting: j.Afsluiting === "ja",
  }));
}

function uittreksels(naam) {
  return tabel(naam).filter((u) => u.Uittreksel !== "").map((u) => ({
    volgorde: u["Volgorde in set"], nr: u.Uittreksel, set: u.Set, kwartaal: u.Kwartaal,
    datum: datum(u.Datum), lijn: u.Lijn, oms: u["Omschrijving op het uittreksel"],
    verwijst: String(u["Verwijst naar (ID)"] || ""), bedrag: rond(u.Bedrag), saldo: rond(u["Saldo na lijn"]),
  }));
}

function proefbalans(naam) {
  return tabel(naam).filter((r) => /^\d{6}$/.test(String(r.Rekening))).map((r) => ({
    rekening: String(r.Rekening), naam: r.Naam, apko: r["A/P/K/O"],
    opening: rond(r.Openingsbalans), k1: rond(r["Saldo einde K1"]), k2: rond(r["Saldo einde K2"]),
    k3: rond(r["Saldo einde K3"]), k4: rond(r["Saldo einde K4 vóór afsluiting"]),
    slot: rond(r["Na afsluiting 31/12"]),
  }));
}

function voorraad(naam) {
  return tabel(naam).filter((r) => r.Artikel && r.Omschrijving).map((r) => ({
    artikel: r.Artikel, oms: r.Omschrijving, begin: r.Begin, aankopen: r["+ aankopen"],
    retoursAankoop: r["- retours aankoop"], verkopen: r["- verkopen (factuur)"],
    retoursVerkoop: r["+ retours verkoop"], dagontvangsten: r["- dagontvangsten"],
    inventaris: r["Inventaris 31/12"], prijs: r.Aankoopprijs, waarde: rond(r["Waarde inventaris"]),
  }));
}

const uit = {
  bron: path.basename(bron),
  gelezen: new Date().toISOString(),
  bedrijven: bedrijven.map((b) => ({
    code: b.Code, naam: b.Naam, rol: b.Rol, adres: b.Adres, gemeente: b["Postcode en gemeente"],
    btw: b["Btw-nummer"], iban: b.IBAN, wat: b["Wat doet het bedrijf?"],
  })),
  artikelen: artikelen.map((a) => ({
    code: a.Code, oms: a.Omschrijving, aankoop: rond(a["Aankoopprijs excl. btw"]),
    verkoop: rond(a["Verkoopprijs excl. btw"]), btw: rond(a.Btw),
  })),
  j1: {
    documenten: documenten("J1 Documenten"),
    lijnen: lijnen("J1 Lijnen"),
    proefbalans: proefbalans("J1 Proefbalans"),
    journaal: journaal("J1 Journaal"),
  },
  j2: {
    documenten: documenten("J2 Documenten"),
    lijnen: lijnen("J2 Lijnen"),
    uittreksels: uittreksels("J2 Uittreksels"),
    journaal: journaal("J2 Journaal"),
    proefbalans: proefbalans("J2 Proefbalans"),
    voorraad: voorraad("J2 Voorraad"),
  },
};

const doel = path.join(__dirname, "case.json");
fs.writeFileSync(doel, JSON.stringify(uit, null, 1));
fs.rmSync(tmp, { recursive: true, force: true });
console.log("Geschreven: " + doel);
console.log("  J2: " + uit.j2.documenten.length + " documenten, " + uit.j2.uittreksels.length +
  " uittrekselregels, " + uit.j2.journaal.length + " journaalregels");
