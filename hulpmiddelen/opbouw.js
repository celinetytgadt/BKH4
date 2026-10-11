// opbouw.js — de vertaling van de case naar de opdrachten in de app.
//
// Eén plaats waar beslist wordt welk document in de case welke referentie
// krijgt in de app (AK01, VK03, BANK07 …), in welke categorie het staat en
// welke boeking erbij hoort. De andere hulpmiddelen gebruiken dit allemaal,
// zodat documenten, opdrachtenlijst en sleutel nooit uit elkaar lopen.
//
// De volgorde komt uit de kolom "Volgorde in set" van de Excel (documenten
// en uittreksels samen), per kwartaal:
//   K1  in blok per soort:            Aankopen · Verkopen · Btw · Financieel
//   K2  gemixt binnen aankoop/verkoop: Aankopen · Verkopen · Btw · Financieel
//   K3  aankoop en verkoop door elkaar: Aankopen en verkopen · Btw · Financieel
//   K4  alles door elkaar, chronologisch
// en daarna de afsluiting.

"use strict";
const path = require("path");
const CASE = require(path.join(__dirname, "case.json"));

const KWARTALEN = ["K1", "K2", "K3", "K4"];

// De categorieën zoals ze in het menu staan. De naam begint met het kwartaal,
// zodat ze ook in de Sheet (kolom categorie) meteen te plaatsen zijn.
function categorieVoor(kw, soort) {
  // Alle kasstukken horen bij de financiële verrichtingen, ook het contante
  // deel van een dagontvangst: dat is een betaling, net als een uittreksel.
  const fin = soort === "BANK" || soort === "KAS-FIN" || soort === "KAS-DO";
  if (kw === "K4") return "K4 · Alle verrichtingen";
  if (soort === "MEMO") return kw + " · Btw-verwerking";
  if (fin) return kw + " · Financiële verrichtingen";
  if (kw === "K3") return "K3 · Aankopen en verkopen";
  if (soort === "AK" || soort === "CN-AK") return kw + " · Aankopen";
  return kw + " · Verkopen";   // VK, CN-VK en DO
}

const CATEGORIE_VOLGORDE = [
  "Beginbalans",
  "K1 · Aankopen", "K1 · Verkopen", "K1 · Btw-verwerking", "K1 · Financiële verrichtingen",
  "K2 · Aankopen", "K2 · Verkopen", "K2 · Btw-verwerking", "K2 · Financiële verrichtingen",
  "K3 · Aankopen en verkopen", "K3 · Btw-verwerking", "K3 · Financiële verrichtingen",
  "K4 · Alle verrichtingen",
  "Eindejaarsverrichtingen",
];

const twee = (n) => String(n).padStart(2, "0");

function opdrachten() {
  const docs = CASE.j2.documenten;
  const utr = CASE.j2.uittreksels;
  const lijst = [];
  const teller = { AK: 0, VK: 0, DOC: 0, ONTV: 0, KAS: 0 };
  let btwNr = 0;

  KWARTALEN.forEach((kw) => {
    const begin = lijst.length;
    const items = [];
    docs.filter((d) => d.set === kw).forEach((d) => items.push({ volgorde: d.volgorde, doc: d }));
    const nrs = [...new Set(utr.filter((u) => u.set === kw).map((u) => u.nr))];
    nrs.forEach((nr) => {
      const regels = utr.filter((u) => u.nr === nr);
      items.push({ volgorde: regels[0].volgorde, uittreksel: nr, regels });
    });
    items.sort((a, b) => a.volgorde - b.volgorde);

    items.forEach((it) => {
      if (it.uittreksel) {
        const ref = "BANK" + twee(it.uittreksel);
        lijst.push({
          ref, kwartaal: kw, soort: "BANK", categorie: categorieVoor(kw, "BANK"),
          uittreksel: it.uittreksel, regels: it.regels,
          journaalDocs: it.regels.map((r) => "U2027-" + twee(it.uittreksel) + "/" + r.lijn),
        });
        return;
      }
      const d = it.doc;
      let ref, soort = d.soort;
      // In K3 en K4 staan aankopen en verkopen door elkaar: de leerling moet
      // dan zelf uitmaken of Noor koopt of verkoopt. Een referentie AK of VK
      // zou dat al verklappen, dus daar heten ze neutraal DOC01, DOC02 …
      const gemengd = kw === "K3" || kw === "K4";
      if (gemengd && /^(CN-)?(AK|VK)$/.test(d.soort)) ref = "DOC" + twee(++teller.DOC);
      else if (d.soort === "AK" || d.soort === "CN-AK") ref = "AK" + twee(++teller.AK);
      else if (d.soort === "VK" || d.soort === "CN-VK") ref = "VK" + twee(++teller.VK);
      else if (d.soort === "DO") ref = "ONTV" + twee(++teller.ONTV);
      else if (d.soort === "KAS") {
        ref = "KAS" + twee(++teller.KAS);
        // Het contante deel van een dagontvangst (KAS-DO) en een storting of
        // afhaling (KAS-FIN) komen allebei bij de financiële verrichtingen.
        soort = d.subsoort === "ontvangst" ? "KAS-DO" : "KAS-FIN";
      } else if (d.soort === "MEMO") ref = "BTW" + (++btwNr);
      else throw new Error("Onbekende soort " + d.soort + " bij " + d.id);
      lijst.push({ ref, kwartaal: kw, soort, categorie: categorieVoor(kw, soort), doc: d, journaalDocs: [d.id] });
    });

    // Binnen de financiële verrichtingen in volgorde van de datum: het
    // kasstuk van een dagontvangst stond in de Excel in het verkoopblok en
    // komt zo op zijn plaats tussen de uittreksels (KAS01 na BANK01). Bij
    // dezelfde datum blijft de volgorde van de Excel.
    const fin = kw + " · Financiële verrichtingen";
    const plaatsen = [];
    for (let i = begin; i < lijst.length; i++) if (lijst[i].categorie === fin) plaatsen.push(i);
    const datum = (o) => (o.regels ? o.regels[0].datum : o.doc.datum);
    const gesorteerd = plaatsen.map((i) => lijst[i])
      .map((o, n) => ({ o, n }))
      .sort((a, b) => (datum(a.o) < datum(b.o) ? -1 : datum(a.o) > datum(b.o) ? 1 : a.n - b.n))
      .map((x) => x.o);
    plaatsen.forEach((i, n) => { lijst[i] = gesorteerd[n]; });
  });

  // De afsluiting: btw van het 4e kwartaal, voorraad, afschrijvingen. Het
  // resultaat staat op de eigen pagina Resultaatverwerking.
  const af = (id) => docs.find((d) => d.id === id);
  lijst.push({ ref: "BTW4", kwartaal: "AF", soort: "MEMO", categorie: "Eindejaarsverrichtingen", doc: af("AF2-1"), journaalDocs: ["AF2-1"] });
  lijst.push({ ref: "VR", kwartaal: "AF", soort: "VR", categorie: "Eindejaarsverrichtingen", doc: af("AF2-2"), journaalDocs: ["AF2-2"] });
  lijst.push({ ref: "AFSCHR", kwartaal: "AF", soort: "AFSCHR", categorie: "Eindejaarsverrichtingen", doc: af("AF2-3"), journaalDocs: ["AF2-3"] });
  lijst.push({ ref: "RESULTAAT", kwartaal: "AF", soort: "RESULTAAT", categorie: "Resultaatverwerking", doc: af("AF2-4"), journaalDocs: ["AF2-4"] });
  return lijst;
}

// De boeking van één opdracht volgens de sleutel, samengevat per rekening:
// { "604000": 11000, "440000": -11979, … } — debet positief, credit negatief.
function saldiVoor(op) {
  const s = {};
  CASE.j2.journaal.filter((j) => op.journaalDocs.indexOf(j.doc) !== -1).forEach((j) => {
    s[j.rekening] = Math.round(((s[j.rekening] || 0) + j.debet - j.credit) * 100) / 100;
  });
  Object.keys(s).forEach((k) => { if (Math.abs(s[k]) < 0.005) delete s[k]; });
  return s;
}

// De journaalregels van één opdracht, in de volgorde van de sleutel.
function journaalVoor(op) {
  return CASE.j2.journaal.filter((j) => op.journaalDocs.indexOf(j.doc) !== -1);
}

// De beginbalans 1/1/2027 = de eindbalans 2026 na afsluiting (enkel klasse 1–5).
function beginbalans() {
  return CASE.j1.proefbalans
    .filter((r) => /^[1-5]/.test(r.rekening) && Math.abs(r.slot) > 0.005)
    .map((r) => ({ rekening: r.rekening, naam: r.naam, apko: r.apko, saldo: r.slot }));
}

// De twee facturen van eind december die op 31/12/2026 nog openstaan.
function openFacturen2026() {
  return CASE.j1.documenten.filter((d) => d.set === "BOEKHOUDER" && (d.soort === "AK" || d.soort === "VK"));
}

function bedrijf(naam) {
  return CASE.bedrijven.find((b) => b.naam === naam) || null;
}

module.exports = { CASE, CATEGORIE_VOLGORDE, opdrachten, saldiVoor, journaalVoor, beginbalans, openFacturen2026, bedrijf, twee };
