# Boekhoudapp 4e jaar — Fietsatelier Noor (De MET)

Statische webapp (HTML/CSS/JS, geen build-stap, geen installatie) waarmee
leerlingen van het 4e jaar de case **Fietsatelier Noor bv** boeken: jaar 2 van
de case (2027), als consolidatieopdracht. Zelfde opbouw en werking als de app
van kern 8 (`boekhouding_DeMet`): redeneerschema, permanent zichtbare
T-rekeningen, controles per categorie, klanten & leveranciers, resultaat-
verwerking, eindbalans, indienen en feedback via Google Sheets.

## Wat is er anders dan in kern 8?

- **De cijfers van het 3e jaar staan al in de app.** De beginbalans
  1/1/2027 is de eindbalans 2026 na de afsluiting door de boekhouder. De
  boeking BB staat al geboekt en op slot (`js/data-beginstand.js`), met de
  twee facturen van eind december die nog openstaan (Velocity Deelfietsen en
  Velomax). Leerlingen kunnen ze niet wijzigen; op de controlepagina leggen
  ze de beginbalans wel als oefening.
- **Het menu volgt de kwartalen** van de case, met een tussentitel per
  kwartaal:
  - K1 (in blok per soort): Aankopen · Verkopen · Btw-verwerking · Financiële verrichtingen
  - K2 (gemixt binnen aankoop en binnen verkoop): idem
  - K3: Aankopen en verkopen (door elkaar) · Btw-verwerking · Financiële verrichtingen
  - K4: Alle verrichtingen (chronologisch)
  - Afsluiting: Eindejaarsverrichtingen (btw K4, voorraad, afschrijvingen),
    Resultaatverwerking, Eindbalans

  In K3 en K4 heten facturen en creditnota's neutraal **DOC01, DOC02 …**: een
  referentie AK of VK zou verklappen of Noor koopt of verkoopt.
- **Resultaatverwerking zonder vennootschapsbelasting**: de volledige winst
  gaat naar de overgedragen winst (één boeking RESULTAAT, drie getallen).
  Instelbaar in `RESULTAAT_CONFIG` (`js/data-opdrachten.js`).
- **Eén script en één Sheet voor de drie vestigingen**, met per vestiging
  eigen tabbladen (*Klas LEU*, *Inzendingen LEU* …) en een eigen expertcode:
  het tabblad Beheer in de app opent telkens maar één vestiging. Zie
  `HANDLEIDING-koppeling.md`.
- **Zo weinig mogelijk toegang**: `apps-script/appsscript.json` legt vast dat
  het script enkel aan zijn eigen Sheet en aan de Drive-map die het zelf
  aanmaakt kan — niet aan de rest van de Drive.
- **De sleutel van de case zit in het script** (`apps-script/SleutelCase.gs`):
  het automatisch nakijken werkt vanaf de eerste inzending, zonder eerst als
  "test" alles te boeken.
- **MAR 2e graad** (57 rekeningen) in `js/mar.js`.

## Structuur

```
index.html                 app-schil
css/style.css              opmaak (huisstijl De MET)
js/mar.js                  MAR 2e graad
js/data-mar-indeling.js    klassen en rubrieken (filters)
js/data-opdrachten.js      de opdrachten per kwartaal, categorieën, resultaatverwerking   (*)
js/data-beginstand.js      de vaste beginboeking BB = eindbalans 2026                     (*)
js/data-relaties.js        startlijst klanten/leveranciers                                (*)
js/data-controles.js       de controlevragen per categorie
js/data-balans.js          vakken van balans en resultatenrekening
js/data-info.js            teksten achter de i-icoontjes
js/config-koppeling.js     web-app-URL, sleutelwoord, vestigingen
js/data-klas.js            noodlijst namen (normaal leeg)
js/app.js                  alle logica
js/koppeling.js            praat met Google Sheets
js/beheer.js               tabblad Beheer voor vakexperten
apps-script/appsscript.json manifest: de beperkte toegangen
apps-script/Code.gs        serverkant (één script voor de drie vestigingen)
apps-script/SleutelCase.gs de oplossing van de case                                       (*)
documenten/                95 verantwoordingsstukken als PNG                               (*)
hulpmiddelen/              scripts die (*) maken uit de Excel van de case
test/                      automatische test van app + script
```

(*) gemaakt met de hulpmiddelen — zie `hulpmiddelen/README.md`.

## Waar pas je wat aan?

Zoals in kern 8: inhoud zit in de `data-*.js`-bestanden, de logica in
`app.js`. Verandert de case (de Excel), maak dan alles opnieuw met de
hulpmiddelen: dan blijven documenten, opdrachten, beginbalans en sleutel
gegarandeerd met elkaar in overeenstemming.

- Een controlevraag → `js/data-controles.js` (veld `categorie` = de
  categorie in het menu, bv. `"K2 · Financiële verrichtingen"`).
- De tussentitels in het menu → `CATEGORIE_KOPPEN` in `js/data-opdrachten.js`.
- Welke opdrachten betaalstukken zijn (klanten & leveranciers) → het veld
  `betaalstuk` bij elke opdracht.

## Bekijken en testen

- Lokaal: `node hulpmiddelen/server.js` en open http://localhost:8080.
- Automatische test: zie `test/LEESMIJ.md`.

## Publiceren op GitHub Pages

Repo `celinetytgadt/BKH4` → **Settings → Pages** → branch `main`, map `/ (root)`.
Na een paar minuten staat de app op `https://celinetytgadt.github.io/BKH4/`.
