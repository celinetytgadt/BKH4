# Hulpmiddelen

Scripts die de inhoud van de app maken uit de Excel van de case
(*case fietsatelier noor.xlsx*). Enkel Node.js nodig, geen extra pakketten.
Voor de documenten ook Google Chrome of Microsoft Edge.

Draai ze vanuit de hoofdmap van de repo, in deze volgorde:

```
node hulpmiddelen/lees-case.js "pad/naar/case fietsatelier noor.xlsx"
node hulpmiddelen/maak-data.js
node hulpmiddelen/maak-sleutel.js
node hulpmiddelen/maak-documenten.js
```

| Script | Maakt |
|---|---|
| `lees-case.js` | `hulpmiddelen/case.json` — alles uit de Excel (documenten, lijnen, uittreksels, journaal, proefbalansen, voorraad) |
| `opbouw.js` | (geen bestand) de vertaling case → app: welke referentie (AK01, DOC05, BANK07 …) en welke categorie elk document krijgt. De andere scripts gebruiken dit allemaal |
| `maak-data.js` | `js/data-opdrachten.js`, `js/data-beginstand.js`, `js/data-relaties.js` |
| `maak-sleutel.js` | `apps-script/SleutelCase.gs` — controleert eerst dat beginbalans + alle boekingen exact de proefbalans "na afsluiting" uit de Excel geven |
| `maak-documenten.js` | `documenten/*.png` — 95 stukken. Met `AK01 BANK03` maak je er enkel die; met `--html` enkel de HTML (map `_html`) |
| `server.js` | de app lokaal bekijken op http://localhost:8080 |

Let op: `maak-data.js` overschrijft de drie data-bestanden. Heb je daar met de
hand iets in aangepast, neem dat dan opnieuw over.

De documenten zijn fictief: elk bedrijf kreeg een eigen (verzonnen) huisstijl,
de bank heet Banco Leuven. Bedragen, data, nummers en redenen komen letterlijk
uit de Excel.
