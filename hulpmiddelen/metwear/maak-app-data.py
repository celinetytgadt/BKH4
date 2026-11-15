# -*- coding: utf-8 -*-
"""
Case MetWear (4e jaar, zes boekjaren) omzetten naar de data van de app.

Gebruik (vanuit de map BKH4):

    python3 hulpmiddelen/metwear/maak-app-data.py "pad/naar/case metwear BKH4"

Leest uit die map:
  - MetWear_4e_jaar_overzicht_en_oplossingen.xlsx   (documenten, sleutel, facturen, leningen)
  - MAR 2e graad (btw vereenvoudigd).xlsx
  - png/<jaar>_<fase>/*.png

Schrijft (en overschrijft!):
  - js/mar.js, js/data-mar-indeling.js
  - js/data-jaren.js            alle boekjaren: menu, documenten, beginbalans, relaties
  - js/data-sleutel-oefen.js    de sleutel van 20X4 en 20X5 (zelfcontrole in de app)
  - apps-script/SleutelCase.gs  de sleutel van taak en consolidaties (enkel op de server)
  - documenten/<jaar>/*.png

Pas je de case aan: eerst script/genereer.py in de casemap draaien (zie het
Word-document "Werkwijze en keuzes"), daarna dit script opnieuw.
"""
import json
import os
import re
import shutil
import sys
from collections import OrderedDict, defaultdict

from openpyxl import load_workbook

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HIER, "..", ".."))

JAREN = OrderedDict([
    ("20X1", {"fase": "Cursus", "map": "20X1_cursus", "soort": "cursus", "titel": "Cursus"}),
    ("20X2", {"fase": "Taak", "map": "20X2_taak", "soort": "taak", "titel": "Taak"}),
    ("20X3", {"fase": "Consolidatie", "map": "20X3_consolidatie", "soort": "conso", "titel": "Consolidatie"}),
    ("20X4", {"fase": "Extra oefenmateriaal", "map": "20X4_extra_oefenmateriaal", "soort": "extra", "titel": "Extra oefenmateriaal"}),
    ("20X5", {"fase": "Remediëring", "map": "20X5_remediering", "soort": "remediering", "titel": "Remediëring"}),
    ("20X6", {"fase": "Conso2", "map": "20X6_conso2", "soort": "conso", "titel": "Consolidatie 2"}),
])

# De categorieën zoals in het menu. Hoofdstuk (kolom in Documenten) -> categorie.
CATEGORIEEN = ["Aankopen", "Verkopen", "Btw-verrekening", "Financiële verrichtingen", "Eindejaar"]
CAT_KORT = {"Aankopen": "AK", "Verkopen": "VK", "Btw-verrekening": "BTW",
            "Financiële verrichtingen": "FIN", "Eindejaar": "EJ"}
CONSO_CAT = "Alle documenten"

# In de taak, het extra oefenmateriaal en de remediëring zijn aankopen en
# verkopen opgesplitst in de taken (lessen) van de klas. Dezelfde namen komen
# in het indienvenster, in de Classroom-taken en in het tabblad Beheer.
AK1 = "Aankopen taak 1: eenvoudige facturen"
AK2 = "Aankopen taak 2: handelskorting & transportkosten"
AK3 = "Aankopen taak 3: diensten, diverse goederen & vaste activa"
AK4 = "Aankopen taak 4: creditnota's"
VK1 = "Verkopen taak 1: eenvoudige facturen"
VK2 = "Verkopen taak 2: handelskorting & extra kosten"
VK3 = "Verkopen taak 3: creditnota's"
VK4 = "Verkopen taak 4: terugstuurbare verpakking"
TAKEN = [AK1, AK2, AK3, AK4, VK1, VK2, VK3, VK4]
TAAK_KORT = {AK1: "AK1", AK2: "AK2", AK3: "AK3", AK4: "AK4", VK1: "VK1", VK2: "VK2", VK3: "VK3", VK4: "VK4"}
TAAK_VAN_SOORT = {
    "AK handelsgoederen": AK1,
    "AK handelsgoederen met handelskorting": AK2,
    "AK handelsgoederen met extra kosten": AK2,
    "AK diensten & div. goederen": AK3,
    "AK materiële vaste activa": AK3,
    "AK creditnota handelsgoederen": AK4,
    "AK creditnota diensten & div. goederen": AK4,
    # Terugstuurbare verpakking leren ze enkel bij de verkopen; in de
    # consolidaties hoort een aankoop met verpakking dus ook bij VK taak 4.
    "AK handelsgoederen met terugstuurbare verpakking": VK4,
    "AK creditnota verpakking": VK4,
    "VK handelsgoederen": VK1,
    "Dagontvangsten": VK1,
    "VK handelsgoederen met handelskorting": VK2,
    "VK handelsgoederen met extra kosten": VK2,
    "VK creditnota handelsgoederen": VK3,
    "VK handelsgoederen met terugstuurbare verpakking": VK4,
    "VK creditnota verpakking": VK4,
}
PER_TAAK = ("taak", "extra", "remediering")


def categorie_van(d, soort_jaar):
    """De categorie in het menu van een document."""
    if soort_jaar == "conso":
        return CONSO_CAT
    if soort_jaar in PER_TAAK and d["hoofdstuk"] in ("Aankopen", "Verkopen"):
        if d["soort"] not in TAAK_VAN_SOORT:
            fout("%s %s: soort %s hoort bij geen taak" % (d["jaar"], d["naam"], d["soort"]))
        return TAAK_VAN_SOORT[d["soort"]]
    return d["hoofdstuk"]


def hoofdstuk_voor_aanbeveling(d):
    """Welk deel van de remediëring past bij een fout in dit document."""
    if d["hoofdstuk"] in ("Aankopen", "Verkopen"):
        return TAAK_VAN_SOORT.get(d["soort"], d["hoofdstuk"])
    return d["hoofdstuk"]

TITEL_PREFIX = [
    ("AK", "Aankoop"), ("VK", "Verkoop"), ("ONTV", "Dagontvangsten"), ("BTW", "Btw-verrekening"),
    ("FIN", "Bankuittreksel"), ("KAS", "Kasblad"), ("EJ", "Eindejaar"), ("DOC_", "Document"),
]

# Rubriek -> vak van de balans / resultatenrekening (zie js/data-balans.js).
VAK_VOOR_RUBRIEK = {
    "10": "Kapitaal", "13": "Reserves", "14": "Overgedragen resultaat", "16": "Voorzieningen",
    "17": "Schulden op meer dan 1 jaar",
    "20": "Oprichtingskosten", "21": "Immateriële vaste activa",
    "22": "Materiële vaste activa", "23": "Materiële vaste activa", "24": "Materiële vaste activa",
    "30": "Voorraden", "34": "Voorraden",
    "40": "Vorderingen op ten hoogste 1 jaar", "41": "Vorderingen op ten hoogste 1 jaar",
    "42": "Schulden op ten hoogste 1 jaar", "43": "Schulden op ten hoogste 1 jaar",
    "44": "Schulden op ten hoogste 1 jaar", "45": "Schulden op ten hoogste 1 jaar",
    "47": "Schulden op ten hoogste 1 jaar", "48": "Schulden op ten hoogste 1 jaar",
    "55": "Liquide middelen", "57": "Liquide middelen", "58": "Liquide middelen",
    "60": "Handelsgoederen, grond- en hulpstoffen", "61": "Diensten en diverse goederen",
    "62": "Bezoldigingen en sociale lasten", "63": "Afschrijvingen", "64": "Andere bedrijfskosten",
    "65": "Financiële kosten", "67": "Belastingen op het resultaat", "69": "Resultaatverwerking",
    "70": "Omzet", "74": "Andere bedrijfsopbrengsten", "75": "Financiële opbrengsten",
    "79": "Resultaatverwerking",
}

DAGONTVANGSTEN = "Dagontvangsten (particulieren)"


def fout(tekst):
    print("FOUT: " + tekst)
    sys.exit(1)


def bedrag_tekst(n):
    n = round(abs(n), 2)
    heel = int(n + 1e-9)
    cent = int(round((n - heel) * 100))
    t = "{:,}".format(heel).replace(",", ".")
    return t + ("," + str(cent).zfill(2) if cent else "")


def titel_voor(ref):
    for prefix, woord in TITEL_PREFIX:
        if ref.startswith(prefix):
            return woord + " " + ref
    return ref


# ---------------------------------------------------------------------------
# MAR
# ---------------------------------------------------------------------------

def lees_mar(pad):
    ws = load_workbook(pad, data_only=True)["MAR 2e graad"]
    rekeningen, klassen = [], OrderedDict()
    for kolom in (0, 4):
        klasse = rubriek = None
        for r in ws.iter_rows(min_row=4, values_only=True):
            nr, naam, apko = r[kolom], r[kolom + 1], r[kolom + 2]
            if nr is None:
                continue
            if isinstance(nr, str):
                m = re.match(r"Klasse (\d)\s+(.*)", nr)
                if m:
                    klasse = m.group(1)
                    klassen[klasse] = {"oms": m.group(2).strip(), "rubrieken": OrderedDict()}
                    continue
                m = re.match(r"(\d\d)\s+(.*)", nr)
                if m:
                    rubriek = m.group(1)
                    klassen[klasse]["rubrieken"][rubriek] = m.group(2).strip()
                    continue
                continue
            rekeningen.append({
                "nr": int(nr), "naam": naam.strip(), "apko": apko.strip(),
                "klasse": klasse, "klasse_oms": klassen[klasse]["oms"],
                "rubriek": rubriek, "rubriek_oms": klassen[klasse]["rubrieken"][rubriek],
            })
    rekeningen.sort(key=lambda a: a["nr"])
    klassen = OrderedDict(sorted(klassen.items()))
    return rekeningen, klassen


def schrijf_mar(rekeningen, klassen):
    with open(os.path.join(REPO, "js", "mar.js"), "w", encoding="utf-8") as f:
        f.write("// mar.js — MAR 2e graad (btw vereenvoudigd), case MetWear 4e jaar.\n")
        f.write("// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py uit 'MAR 2e graad (btw vereenvoudigd).xlsx'.\n")
        f.write("// Btw: 411000 Aftrekbare btw, 451000 Verschuldigde btw, 451900 R/C btw-administratie.\n\n")
        f.write("const MAR = " + json.dumps(rekeningen, ensure_ascii=False, indent=1) + ";\n")
    with open(os.path.join(REPO, "js", "data-mar-indeling.js"), "w", encoding="utf-8") as f:
        f.write("// data-mar-indeling.js — klassen en rubrieken van het MAR 2e graad.\n")
        f.write("// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py. Voedt de keuzelijsten klasse en\n")
        f.write("// rubriek in het redeneerschema en de filters van het T-paneel.\n\n")
        lijst = [{"klasse": k, "oms": v["oms"],
                  "rubrieken": [{"rubriek": r, "oms": o} for r, o in v["rubrieken"].items()]}
                 for k, v in klassen.items()]
        f.write("const MAR_INDELING = " + json.dumps(lijst, ensure_ascii=False, indent=2) + ";\n")


# ---------------------------------------------------------------------------
# De case
# ---------------------------------------------------------------------------

def lees_case(pad):
    wb = load_workbook(pad, data_only=True)
    docs = OrderedDict()
    for r in wb["Documenten"].iter_rows(min_row=2, values_only=True):
        if not r[0]:
            continue
        jaar, naam = r[0], r[2]
        docs[(jaar, naam)] = {
            "jaar": jaar, "naam": naam, "code": r[3], "hoofdstuk": r[4], "soort": r[5],
            "datum": r[6], "nummer": r[7], "partij": r[8], "gekoppeld": r[13], "bestand": r[15],
        }
    sleutel = OrderedDict()
    huidig = None
    for r in wb["Oplossingen"].iter_rows(min_row=2, values_only=True):
        if r[1]:
            huidig = (r[0], r[1])
            sleutel[huidig] = []
        if r[5] and huidig:
            d = r[7] or 0
            c = r[8] or 0
            sleutel[huidig].append({"rekening": str(r[5]), "D": d, "C": c})
    facturen = [r for r in wb["Opvolging facturen"].iter_rows(min_row=2, values_only=True) if r[0]]
    leningen = [r for r in wb["Leningen"].iter_rows(min_row=2, values_only=True) if r[0]]
    return docs, sleutel, facturen, leningen


def relatie_voor(doc, rekening):
    """Welke klant of leverancier hoort bij een lijn op 400000/440000."""
    soort = doc["soort"] or ""
    if soort in ("Dagontvangsten", "DO via kas", "DO via bank"):
        return DAGONTVANGSTEN
    return doc["partij"] or ""


def apko_info(mar_per_nr, rekening, dc):
    a = mar_per_nr[int(rekening)]
    plus = (dc == "D") if a["apko"] in ("A", "K") else (dc == "C")
    return a["apko"], ("+" if plus else "-"), a["klasse"], a["rubriek"]


def rij(mar_per_nr, rekening, bedrag, dc, redenering="", relatie=""):
    apko, pm, klasse, rubriek = apko_info(mar_per_nr, rekening, dc)
    return OrderedDict([
        ("bedrag", bedrag_tekst(bedrag)), ("redenering", redenering), ("apko", apko),
        ("stijgtDaalt", pm), ("klasse", klasse), ("rubriek", rubriek),
        ("rekening", str(rekening)), ("dc", dc), ("relatie", relatie),
    ])


def datum_sleutel(d):
    dd, mm, jj = (d or "01/01/20X0").split("/")
    return (jj, mm, dd)


def controle_info(jaar_docs):
    """Wat de controles van een jaar nodig hebben: welke documenten waarbij horen."""
    per_soort = defaultdict(list)
    for d in jaar_docs:
        per_soort[d["soort"]].append(d)

    def refs(*soorten):
        uit = []
        for so in soorten:
            uit += [d["naam"] for d in per_soort.get(so, [])]
        return sorted(uit)

    def laatste(prefix_soorten):
        kand = [d for d in jaar_docs if d["hoofdstuk"] == "Financiële verrichtingen" and prefix_soorten(d)]
        if not kand:
            return None
        return sorted(kand, key=lambda d: (datum_sleutel(d["datum"]), d["naam"]))[-1]["naam"]

    kas_soorten = ("DO via kas",)
    def is_kas(d):
        return d["soort"] in kas_soorten or (d["soort"].startswith("Interne") and d["partij"] == "MetWear bv")
    def is_bank(d):
        return not is_kas(d) and d["soort"] != "Lening: aflossingstabel (info)"

    ontv = []
    for d in per_soort.get("Dagontvangsten", []):
        kas = [x["naam"] for x in jaar_docs if x["soort"] == "DO via kas" and (x["gekoppeld"] or "").startswith(d["naam"] + " ")]
        bank = [x["naam"] for x in jaar_docs if x["soort"] == "DO via bank" and (x["gekoppeld"] or "").startswith(d["naam"] + " ")]
        ontv.append({"ontv": d["naam"], "kas": kas, "bank": bank})
    btw = []
    for d in per_soort.get("Btw-verrekening", []):
        bet = [x["naam"] for x in jaar_docs if x["soort"] == "Betaling btw" and (x["gekoppeld"] or "").startswith(d["naam"] + " ")]
        btw.append({"doc": d["naam"], "betaling": bet})
    ej = {}
    for so, sl in (("Eindejaar: afschrijvingen", "afschrijvingen"), ("Eindejaar: voorraadwijziging", "voorraad"),
                   ("Eindejaar: lening LT naar KT", "lening")):
        if per_soort.get(so):
            ej[sl] = per_soort[so][0]["naam"]
    return OrderedDict([
        ("aankoopfacturen", refs("AK handelsgoederen", "AK handelsgoederen met handelskorting",
                                 "AK handelsgoederen met extra kosten", "AK handelsgoederen met terugstuurbare verpakking",
                                 "AK diensten & div. goederen", "AK materiële vaste activa")),
        ("aankoopCN", refs("AK creditnota handelsgoederen", "AK creditnota verpakking", "AK creditnota diensten & div. goederen")),
        ("verkoopfacturen", refs("VK handelsgoederen", "VK handelsgoederen met handelskorting",
                                 "VK handelsgoederen met extra kosten", "VK handelsgoederen met terugstuurbare verpakking")),
        ("verkoopCN", refs("VK creditnota handelsgoederen", "VK creditnota verpakking")),
        ("dagontvangsten", ontv),
        ("kortingen", refs("AK handelsgoederen met handelskorting", "VK handelsgoederen met handelskorting")),
        ("extraKosten", refs("AK handelsgoederen met extra kosten", "VK handelsgoederen met extra kosten")),
        ("verpakking", refs("AK handelsgoederen met terugstuurbare verpakking", "VK handelsgoederen met terugstuurbare verpakking",
                            "AK creditnota verpakking", "VK creditnota verpakking")),
        ("vasteActiva", refs("AK materiële vaste activa")),
        ("diensten", refs("AK diensten & div. goederen", "AK creditnota diensten & div. goederen")),
        ("btw", btw),
        ("interne", refs("Interne overboeking bank naar kas", "Interne overboeking kas naar bank")),
        ("leningOpname", refs("Lening aangaan")),
        ("afbetalingen", refs("Afbetaling lening")),
        ("laatsteBank", laatste(is_bank)),
        ("laatsteKas", laatste(is_kas)),
        ("eindejaar", ej),
    ])


def t_rekeningen(opdrachten, jaar_sleutel):
    """Per taak van aankopen en verkopen: de T-rekeningen zoals ze moeten staan
    na die taak (zonder beginbalans). Voor de controles van die taak."""
    uit = OrderedDict()
    for taak in TAKEN:
        refs = [o["ref"] for o in opdrachten if o["categorie"] == taak]
        if not refs:
            continue
        per = OrderedDict()
        for ref in refs:
            for nr, b in jaar_sleutel[ref].items():
                if abs(b) < 0.005:
                    continue
                per.setdefault(nr, {"D": [], "C": []})["D" if b > 0 else "C"].append([ref, round(abs(b), 2)])
        uit[taak] = OrderedDict((nr, per[nr]) for nr in sorted(per))
    return uit


def main():
    if len(sys.argv) < 2:
        fout("geef de map van de case mee, bv. \"../case metwear BKH4\"")
    casemap = sys.argv[1]
    rekeningen, klassen = lees_mar(os.path.join(casemap, "MAR 2e graad (btw vereenvoudigd).xlsx"))
    mar_per_nr = {a["nr"]: a for a in rekeningen}
    docs, sleutel, facturen, leningen = lees_case(os.path.join(casemap, "MetWear_4e_jaar_overzicht_en_oplossingen.xlsx"))

    # Elke rekening uit de sleutel moet in het MAR staan, en elke boeking in evenwicht zijn.
    for (jaar, naam), lijnen in sleutel.items():
        for l in lijnen:
            if int(l["rekening"]) not in mar_per_nr:
                fout("%s %s: rekening %s staat niet in het MAR" % (jaar, naam, l["rekening"]))
        d = round(sum(l["D"] for l in lijnen), 2)
        c = round(sum(l["C"] for l in lijnen), 2)
        if abs(d - c) > 0.005:
            fout("%s %s: debet %s ≠ credit %s" % (jaar, naam, d, c))

    # Namen van klanten en leveranciers (alle jaren samen: de lijst verraadt zo niets).
    klanten, leveranciers = set([DAGONTVANGSTEN]), set()
    for d in docs.values():
        if d["hoofdstuk"] == "Aankopen":
            leveranciers.add(d["partij"])
        elif d["hoofdstuk"] == "Verkopen" and d["soort"] != "Dagontvangsten":
            klanten.add(d["partij"])

    # Aflossingstabellen: per lening het document (in het jaar van opname).
    lening_doc = {}
    for d in docs.values():
        if d["soort"] == "Lening: aflossingstabel (info)":
            m = re.search(r"(KR-[\w-]+)", d["gekoppeld"] or "")
            if m and m.group(1) not in lening_doc:
                lening_doc[m.group(1)] = (d["jaar"], d["naam"])
    loopt_tot = defaultdict(str)   # lening -> laatste boekjaar met een termijn
    for r in leningen:
        if r[7]:
            loopt_tot[r[0]] = max(loopt_tot[r[0]], r[7])

    # Open facturen per partij aan het einde van elk jaar (voor de beginbalans).
    def open_bedrag(r):
        # totaal - creditnota - betaald; een terugbetaalde creditnota telt terug mee.
        return round((r[4] or 0) - (r[6] or 0) - (r[8] or 0) + ((r[6] or 0) if r[9] else 0), 2)

    def resultaat_rijen(jaar):
        """Winst en de boeking RESULTAAT uit de grootboeksaldi van dat jaar."""
        saldi = defaultdict(float)
        for (j, naam), lijnen in sleutel.items():
            if j != jaar or naam == "RES":
                continue
            for l in lijnen:
                saldi[l["rekening"]] += l["D"] - l["C"]
        kosten = sum(v for k, v in saldi.items() if k[0] == "6")
        opbrengsten = -sum(v for k, v in saldi.items() if k[0] == "7")
        return round(opbrengsten, 2), round(kosten, 2), round(opbrengsten - kosten, 2), saldi

    js_jaren = OrderedDict()
    sleutel_oefen = OrderedDict()
    sleutel_server = []
    hoofdstuk_server = []

    for jaar, info in JAREN.items():
        conso = info["soort"] == "conso"
        cursus = info["soort"] == "cursus"
        opdrachten = []
        vaste = OrderedDict()
        jaar_sleutel = OrderedDict()

        jaar_docs = [d for (j, n), d in docs.items() if j == jaar]
        for d in jaar_docs:
            ref = "BB" if d["naam"] == "BB" else d["naam"]
            if d["soort"] == "Lening: aflossingstabel (info)":
                continue   # komt als hulpdocument bij de lening
            if (jaar, d["naam"]) not in sleutel:
                fout("%s %s heeft geen oplossing" % (jaar, d["naam"]))
            bestand = os.path.basename(d["bestand"])
            o = OrderedDict()
            o["ref"] = ref
            if ref == "BB":
                o["navLabel"] = "BEGINBALANS (BB)"
                o["categorie"] = "Beginbalans"
                o["titel"] = "Beginbalans 1 januari " + jaar + " (BB)"
                o["vasteBoeking"] = True
            else:
                o["categorie"] = categorie_van(d, info["soort"])
                o["titel"] = titel_voor(ref)
                if cursus:
                    o["vasteBoeking"] = True
            o["doc"] = jaar + "/" + os.path.splitext(bestand)[0]
            if d["hoofdstuk"] == "Financiële verrichtingen":
                o["betaalstuk"] = True
            # Aflossingstabel bij een lening of bij de eindejaarsboeking van de leningen.
            hulp = []
            m = re.search(r"(KR-[\w-]+)", d["gekoppeld"] or "")
            if m and m.group(1) in lening_doc:
                lj, ln = lening_doc[m.group(1)]
                hulp.append({"doc": lj + "/" + ln, "titel": "Aflossingstabel lening " + m.group(1)})
            if d["soort"] == "Eindejaar: lening LT naar KT":
                for lening, (lj, ln) in sorted(lening_doc.items()):
                    if lj <= jaar and loopt_tot[lening] > jaar:
                        hulp.append({"doc": lj + "/" + ln, "titel": "Aflossingstabel lening " + lening})
            if hulp:
                o["hulpdocs"] = hulp
            # De klant of leverancier die bij dit document hoort.
            if ref != "BB":
                o["relatie"] = relatie_voor(d, None)
            opdrachten.append(o)

            # Sleutel en (voor de cursus en de beginbalans) de vaste boeking.
            lijnen = sleutel[(jaar, d["naam"])]
            saldi = OrderedDict()
            for l in lijnen:
                saldi[l["rekening"]] = round(saldi.get(l["rekening"], 0) + l["D"] - l["C"], 2)
            jaar_sleutel[ref] = saldi
            if ref == "BB" or cursus:
                rijen = []
                for l in lijnen:
                    dc = "D" if l["D"] else "C"
                    bedrag = l["D"] or l["C"]
                    rel = ""
                    if l["rekening"] in ("400000", "440000") and ref != "BB":
                        rel = relatie_voor(d, l["rekening"])
                    if ref == "BB" and l["rekening"] in ("400000", "440000"):
                        # De beginbalans per klant/leverancier opsplitsen, zodat het
                        # afpunten op het tabblad Klanten & leveranciers klopt.
                        per = OrderedDict()
                        teken = 1 if dc == "D" else -1
                        for (vj, vn), vl in sleutel.items():
                            if vj >= jaar or vn in ("BB", "RES"):
                                continue
                            for x in vl:
                                if x["rekening"] != l["rekening"]:
                                    continue
                                p = relatie_voor(docs[(vj, vn)], None)
                                per[p] = round(per.get(p, 0) + teken * (x["D"] - x["C"]), 2)
                        per = OrderedDict((p, b) for p, b in per.items() if abs(b) >= 0.005)
                        if abs(sum(per.values()) - bedrag) > 0.005:
                            fout("%s BB %s: open facturen %s ≠ %s" % (jaar, l["rekening"], sum(per.values()), bedrag))
                        for p, b in sorted(per.items()):
                            rijen.append(rij(mar_per_nr, l["rekening"], b, dc, "beginbalans", p))
                        continue
                    rijen.append(rij(mar_per_nr, l["rekening"], bedrag, dc,
                                     "beginbalans" if ref == "BB" else "", rel))
                vaste[ref] = rijen

        # Resultaatverwerking en eindbalans.
        opbr, kost, winst, saldi = resultaat_rijen(jaar)
        res = OrderedDict()
        if winst >= 0:
            res["693000"] = winst
            res["140000"] = -winst
        else:
            res["790000"] = winst   # verlies: niet in deze case, maar voor de volledigheid
            res["141000"] = -winst
        jaar_sleutel["RESULTAAT"] = res
        if cursus:
            vaste["RESULTAAT"] = [rij(mar_per_nr, nr, abs(b), "D" if b > 0 else "C", "") for nr, b in res.items()]
        for nr, b in res.items():
            saldi[nr] += b
        vakken = OrderedDict()
        for nr in sorted(saldi):
            if abs(saldi[nr]) < 0.005:
                continue
            rb = mar_per_nr[int(nr)]["rubriek"]
            vakken.setdefault(VAK_VOOR_RUBRIEK[rb], set()).add(rb)
        # Rubrieken met netto saldo 0 (bv. 23 als alles afgeschreven is) vallen weg.
        netto = defaultdict(float)
        for nr, b in saldi.items():
            netto[mar_per_nr[int(nr)]["rubriek"]] += b
        for vak in list(vakken):
            vakken[vak] = sorted(r for r in vakken[vak] if abs(netto[r]) >= 0.005)
            if not vakken[vak]:
                del vakken[vak]

        # Controle tegen het tabblad Controles van de Excel gebeurt hieronder bij het afdrukken.
        print("%s: %d opdrachten, opbrengsten %s, kosten %s, winst %s" % (
            jaar, len(opdrachten), bedrag_tekst(opbr), bedrag_tekst(kost), bedrag_tekst(winst)))

        # De beginbalans staat niet meer in het menu: ze is geboekt en komt
        # enkel nog in de T-rekeningen als de vakexpert dat aanzet.
        if conso:
            volgorde = [CONSO_CAT]
        else:
            alle = TAKEN + CATEGORIEEN
            volgorde = [c for c in alle if any(o["categorie"] == c for o in opdrachten)]

        # Opdrachten in de volgorde van het menu (de beginbalans vooraan).
        if not conso:
            opdrachten.sort(key=lambda o: -1 if o["ref"] == "BB" else volgorde.index(o["categorie"]))

        j = OrderedDict()
        j["jaar"] = jaar
        j["soort"] = info["soort"]
        j["titel"] = info["titel"]
        j["kort"] = "X" + jaar[-1]
        j["categorieVolgorde"] = volgorde
        j["opdrachten"] = opdrachten
        j["vasteBoekingen"] = vaste
        # In de consolidaties zou deze lijst verraden welk DOC_.. wat is.
        j["controleInfo"] = None if conso else controle_info(jaar_docs)
        if not conso and not cursus:
            j["controleInfo"]["tRekeningen"] = t_rekeningen(opdrachten, jaar_sleutel)
        js_jaren[jaar] = j

        if info["soort"] in ("extra", "remediering"):
            sleutel_oefen[jaar] = jaar_sleutel
        # De server krijgt de sleutel van elk jaar (automatisch voorstel bij het nakijken).
        if info["soort"] in ("taak", "conso"):
            for ref, s in jaar_sleutel.items():
                if ref == "BB":
                    continue
                for nr, b in s.items():
                    if abs(b) < 0.005:
                        continue
                    sleutel_server.append([jaar + " " + ref, nr, "D" if b > 0 else "C", bedrag_tekst(b), ""])
            sleutel_server.append([jaar + " RESULTAATVERWERKING", "Opbrengsten", "", bedrag_tekst(opbr), ""])
            sleutel_server.append([jaar + " RESULTAATVERWERKING", "Kosten", "", bedrag_tekst(kost), ""])
            sleutel_server.append([jaar + " RESULTAATVERWERKING", "Winst", "", bedrag_tekst(winst), ""])
            for vak, rb in vakken.items():
                sleutel_server.append([jaar + " EINDBALANS", vak, "", ", ".join(rb), ""])
        if info["soort"] in ("taak", "conso"):
            for o in opdrachten:
                if o["ref"] == "BB":
                    continue
                hs = hoofdstuk_voor_aanbeveling(docs[(jaar, o["ref"])])
                hoofdstuk_server.append([jaar + " " + o["ref"], hs])

    relaties = OrderedDict([("klanten", sorted(klanten)), ("leveranciers", sorted(leveranciers))])

    # ---- schrijven ----
    schrijf_mar(rekeningen, klassen)

    with open(os.path.join(REPO, "js", "data-jaren.js"), "w", encoding="utf-8") as f:
        f.write("// data-jaren.js — de zes boekjaren van de case MetWear (4e jaar).\n")
        f.write("// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py. Niet met de hand aanpassen:\n")
        f.write("// pas de Excel van de case aan en draai het script opnieuw.\n")
        f.write("//\n")
        f.write("// Per jaar: de categorieën van het menu, de opdrachten (documenten) en de\n")
        f.write("// boekingen die al klaarstaan (de beginbalans, en in 20X1 de hele cursus).\n")
        f.write("// De sleutel van taak en consolidaties staat hier NIET: die zit enkel in het\n")
        f.write("// script van de Sheet (apps-script/SleutelCase.gs).\n\n")
        f.write("var JAREN = " + json.dumps(js_jaren, ensure_ascii=False, indent=1) + ";\n\n")
        f.write("var RELATIES = " + json.dumps(relaties, ensure_ascii=False, indent=2) + ";\n")

    with open(os.path.join(REPO, "js", "data-sleutel-oefen.js"), "w", encoding="utf-8") as f:
        f.write("// data-sleutel-oefen.js — de sleutel van 20X4 (extra oefenmateriaal) en 20X5 (remediëring).\n")
        f.write("// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py.\n")
        f.write("//\n")
        f.write("// Enkel voor de zelfcontrole in de app (aan te zetten in het tabblad Beheer). Alles in\n")
        f.write("// dit bestand is leesbaar voor wie de broncode opent: daarom staat hier enkel de\n")
        f.write("// sleutel van het oefenmateriaal, nooit die van de taak of de consolidaties.\n")
        f.write("// Per document: saldo per rekening (debet positief, credit negatief).\n\n")
        f.write("var SLEUTEL_OEFEN = " + json.dumps(sleutel_oefen, ensure_ascii=False) + ";\n")

    with open(os.path.join(REPO, "apps-script", "SleutelCase.gs"), "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(" * SleutelCase.gs — de oplossingssleutel van de case MetWear (4e jaar): de taak\n")
        f.write(" * (20X2) en de twee consolidaties (20X3 en 20X6). Hoort in hetzelfde Apps\n")
        f.write(" * Script-project als Code.gs.\n")
        f.write(" *\n")
        f.write(" * GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py uit de Excel van de case.\n")
        f.write(" * Pas je de case aan, maak dit bestand dan opnieuw en plak het over het oude.\n")
        f.write(" *\n")
        f.write(" * De sleutel komt in het tabblad Sleutel van de Sheet:\n")
        f.write(" *   - bij de eerste installatie automatisch (als dat tabblad nog leeg is);\n")
        f.write(" *   - of via het menu Boekhoudapp → Sleutel van de case (opnieuw) invullen.\n")
        f.write(" *\n")
        f.write(" * Per verrichting: \"jaar ref\" | rekening | D/C | saldo van de boeking op die rekening.\n")
        f.write(" * RESULTAATVERWERKING: de getallen die de leerling berekent.\n")
        f.write(" * EINDBALANS: welke rubrieken in welk vak horen (na de resultaatverwerking).\n")
        f.write(" *\n")
        f.write(" * HOOFDSTUK_PER_DOC: bij welk hoofdstuk elk document van de taak en de\n")
        f.write(" * consolidaties hoort. Daarmee beveelt de app de juiste delen van de\n")
        f.write(" * remediëring aan. Het staat hier (en niet in de app) omdat de namen\n")
        f.write(" * DOC_01 … in de consolidaties net niet mogen verraden wat voor document het is.\n")
        f.write(" */\n\n")
        f.write("var SLEUTEL_CASE = [\n")
        for r in sleutel_server:
            f.write("  " + json.dumps(r, ensure_ascii=False) + ",\n")
        f.write("];\n\n")
        f.write("var HOOFDSTUK_PER_DOC = {\n")
        for ref, hs in hoofdstuk_server:
            f.write("  " + json.dumps(ref, ensure_ascii=False) + ": " + json.dumps(hs, ensure_ascii=False) + ",\n")
        f.write("};\n")
        with open(os.path.join(HIER, "SleutelCase-staart.gs"), encoding="utf-8") as staart:
            f.write("\n" + staart.read())

    # Documenten
    doelmap = os.path.join(REPO, "documenten")
    for jaar, info in JAREN.items():
        bron = os.path.join(casemap, "png", info["map"])
        doel = os.path.join(doelmap, jaar)
        if os.path.isdir(doel):
            shutil.rmtree(doel)
        os.makedirs(doel)
        for naam in sorted(os.listdir(bron)):
            if naam.lower().endswith(".png"):
                shutil.copy2(os.path.join(bron, naam), os.path.join(doel, naam))
    print("Klaar: %d regels sleutel op de server, %d klanten, %d leveranciers." % (
        len(sleutel_server), len(klanten), len(leveranciers)))


if __name__ == "__main__":
    main()
