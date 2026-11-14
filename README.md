# Boekhoudapp 4e jaar — MetWear (De MET)

Statische webapp (HTML/CSS/JS, geen build-stap, geen installatie) waarmee
leerlingen van het 4e jaar de case **MetWear bv** boeken, over zes boekjaren.
Zelfde opbouw als de app van kern 8 (`boekhouding_DeMet`): redeneerschema,
permanent zichtbare T-rekeningen, controles per categorie, klanten &
leveranciers, resultaatverwerking, eindbalans, indienen en feedback via
Google Sheets.

## De zes boekjaren

| Jaar | Wat | In de app |
|---|---|---|
| 20X1 | cursus | alles staat al geboekt: enkel documenten en T-rekeningen, geen redeneerschema's (de les gebeurt op papier) |
| 20X2 | taak | per categorie in te dienen; één Classroom-taak per categorie |
| 20X3 | consolidatie | alle documenten door elkaar (DOC_01 …), als geheel in te dienen |
| 20X4 | extra oefenmateriaal | niet indienen; zelfcontrole mogelijk |
| 20X5 | remediëring | niet indienen; zelfcontrole mogelijk; aanbevolen delen per leerling (★) |
| 20X6 | consolidatie 2 | als geheel in te dienen |

Elk jaar begint met de beginbalans (BB), al geboekt en op slot. De
leerling kiest het boekjaar bovenaan het menu.

## Wat is er bijzonder?

- **Zichtbaarheid per vestiging.** In het tabblad Beheer zet de vakexpert
  per jaar (en per categorie, waar het jaar categorieën heeft) open wat de
  leerlingen zien. Wat niet open staat, is onzichtbaar. *Eindejaar* opent
  ook de resultaatverwerking en de eindbalans.
- **Redeneerschema in vaste volgorde**: bedrag, redenering, A/P/K/O, + of −,
  klasse, rubriek, rekeningnummer, D/C. Alles is verplicht behalve de
  redenering. A/P/K/O beperkt de klassen, een klasse toont enkel haar
  rubrieken, en pas daarna kies (of typ) je het rekeningnummer.
- **Klanten en leveranciers enkel uit een lijst** (geen vrije invoer). De
  leerling boekt de lijn 400000/440000 zelf; de naam van de klant of
  leverancier vult de app al in uit het document.
- **Zelfcontrole** in 20X4 en 20X5 (aan te zetten in Beheer): de eerste keer
  enkel "klopt nog niet", vanaf de tweede keer welke lijnen nog fout zijn.
  Elke poging komt in het tabblad *Zelfcontrole* van de Sheet; Beheer toont
  een overzicht (welke documenten en rekeningen gingen vaak fout). De
  sleutel van 20X4/20X5 staat daarvoor in de app
  (`js/data-sleutel-oefen.js`); die van de taak en de consolidaties blijft
  enkel op de server.
- **Aanbevolen in de remediëring**: automatisch voor de hoofdstukken waar
  een document van 20X2 of 20X3 nog niet *In orde* was, en per leerling aan
  te vinken in Beheer. Een leerling ziet enkel de eigen aanbevelingen.
- **Controles met meer uitleg**: per vraag *waar kijk je* en *wat moet je
  zien*.
- **In de Sheet krijgt alles het jaar ervoor**: *20X2 AK01*, *20X2 ·
  Aankopen*. Het klasoverzicht heeft kolommen als *X2 AK*, *X3 DOC*.
- **Resultaatverwerking zonder vennootschapsbelasting**: de volledige winst
  gaat naar de overgedragen winst (één boeking RESULTAAT, drie getallen).
- **Eén script en één Sheet voor de drie vestigingen**, met per vestiging
  eigen tabbladen en een eigen expertcode. Zie `HANDLEIDING-koppeling.md`.
- **Zo weinig mogelijk toegang**: `apps-script/appsscript.json` legt vast dat
  het script enkel aan zijn eigen Sheet en aan zijn eigen Drive-map kan.

## Werking in het kort

- **Indienen**: enkel wat afgerond is (geboekt, of volledig ingevuld) gaat
  naar de Sheet. Wat in orde is, gaat niet meer mee.
- **Voortgangsbalk**: toont de categorie waar de leerling mee bezig is
  ("20X2 · Verkopen: 5 van 12 geboekt"), met het hele jaar erachter.
- **Namenlijst**: bij het openen haalt de app de namen van de drie
  vestigingen in één verzoek op (actie `namen`, zonder codes) en onthoudt ze
  in de browser, zodat de keuzelijst de volgende keer meteen klaarstaat.
- **Afmelden** (titelbalk): eerst gaat het werk naar de Drive, daarna wordt
  alles van die leerling uit de browser gewist — voor gedeelde computers.
  Lukt bewaren niet, dan blijft de leerling aangemeld.
- **Menu links inklappen** met « bovenaan het menu.
- **Versienummer** achter de scripts in `index.html` (`?v=…`): verander het
  bij elke update, dan halen de browsers meteen alle nieuwe bestanden op.

## Structuur

```
index.html                 app-schil
css/style.css              opmaak (huisstijl De MET)
js/mar.js                  MAR 2e graad
js/data-mar-indeling.js    klassen en rubrieken (filters)
js/data-jaren.js           de zes boekjaren: documenten, beginbalans, relaties             (*)
js/data-sleutel-oefen.js   de sleutel van 20X4 en 20X5 (zelfcontrole)                     (*)
js/data-opdrachten.js      wat per soort jaar anders werkt, resultaatverwerking
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
documenten/<jaar>/         de documenten per boekjaar als PNG                              (*)
hulpmiddelen/              scripts die (*) maken uit de Excel van de case
test/                      automatische test van app + script
```

(*) gemaakt met de hulpmiddelen — zie `hulpmiddelen/README.md`.

## Waar pas je wat aan?

Inhoud zit in de `data-*.js`-bestanden, de logica in `app.js`. Verandert
de case (de Excel), maak dan alles opnieuw met
`hulpmiddelen/metwear/maak-app-data.py`: dan blijven documenten, opdrachten,
beginbalans en sleutels gegarandeerd met elkaar in overeenstemming.

- Een controlevraag → `js/data-controles.js` (`maakControles`, per
  categorie; de bedragen en documenten komen uit de gegevens van het jaar).
- Wat een soort jaar mag (indienen, zelfcontrole, per categorie zichtbaar,
  Classroom-taken) → `JAAR_SOORTEN` in `js/data-opdrachten.js`.
- Welke opdrachten betaalstukken zijn (klanten & leveranciers) → het veld
  `betaalstuk` bij elke opdracht (gemaakt door het script).

## Bekijken en testen

- Lokaal: `node hulpmiddelen/server.js` en open http://localhost:8080.
- Automatische test: zie `test/LEESMIJ.md`.

## Publiceren op GitHub Pages

Repo `celinetytgadt/BKH4` → **Settings → Pages** → branch `main`, map `/ (root)`.
Na een paar minuten staat de app op `https://celinetytgadt.github.io/BKH4/`.
