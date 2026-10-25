# Voor later

Eén lijn per punt volstaat. Wat klaar is, mag weg (of vink het af met `[x]`).

## Na de technische update van oktober 2026 (nu doen)

- [ ] **`Code.gs` opnieuw plakken in de Sheet** en *Implementeren →
  Implementaties beheren → bewerken → nieuwe versie*. Nodig voor de
  namenlijst die meteen klaarstaat (nieuwe actie `namen`) en de juiste
  volgorde van de feedbackrondes. `SleutelCase.gs` en `appsscript.json` zijn
  niet gewijzigd.

## De case verbeteren — alles in één keer

Werkwijze: eerst alle wijzigingen in de Excel (*case fietsatelier
noor.xlsx*), daarna één keer de hulpmiddelen draaien (zie
`hulpmiddelen/README.md`), dan pas de punten onder *daarna*.

**In de Excel**

- [ ] **Lening bij de afsluiting**: het deel dat binnen het jaar vervalt
  (6.000) van 173000 naar 423000 boeken. Als extra boeking bij de
  eindejaarsverrichtingen (naast BTW4, VR en AFSCHR), met de aflossingstabel
  (het document LENING bestaat al) als hulpdocument.
- [ ] **Werklast nakijken**: nu 96 opdrachten (K1 27, K2 23, K3 20, K4 22,
  afsluiting 4). Haalbaar voor de 4es? Anders per kwartaal een paar
  documenten schrappen — liefst stukken die niets nieuws oefenen.
- [ ] Je eigen inhoudelijke aanpassingen van deze week:
  - [ ] …
  - [ ] …

**Daarna, in deze volgorde**

- [ ] `node hulpmiddelen/lees-case.js "pad/naar/case fietsatelier noor.xlsx"`
- [ ] `node hulpmiddelen/maak-data.js` (overschrijft `js/data-opdrachten.js`,
  `js/data-beginstand.js` en `js/data-relaties.js`)
- [ ] `node hulpmiddelen/maak-sleutel.js` — stopt met een fout als de
  boekingen niet exact de proefbalans "na afsluiting" uit de Excel geven
- [ ] `node hulpmiddelen/maak-documenten.js` (enkel de gewijzigde stukken
  mag ook: `node hulpmiddelen/maak-documenten.js LENING DOC05 …`)
- [ ] Een controlevraag voor de lening toevoegen in `js/data-controles.js`
  (categorie `"Eindejaarsverrichtingen"`), bv. "Staat het deel van de lening
  dat volgend jaar vervalt op 423000?"
- [ ] Nieuwe `SleutelCase.gs` in de Sheet plakken en een nieuwe versie
  implementeren.
- [ ] Het versienummer achter de scripts in `index.html` (`?v=…`) verhogen.
- [ ] De test draaien (`test/LEESMIJ.md`).

## Om de app in gebruik te nemen

- [x ] Google Sheet maken, `appsscript.json` + `Code.gs` + `SleutelCase.gs` plakken, Eerste
  installatie, publiceren als web-app (zie `HANDLEIDING-koppeling.md`).
- [x ] De web-app-URL invullen in `js/config-koppeling.js`.
- [x ] GitHub Pages aanzetten voor deze repo.
- [x ] Bij de eerste toestemming nakijken dat er enkel de vier beperkte
  toegangen gevraagd worden (zie de handleiding).
- [ ] Moet de werkmap op een gedeelde Drive staan? Dan na het verplaatsen
  testen of bewaren nog lukt.
- [x ] Expertcode instellen en de klaslijsten per vestiging invullen (tabblad Beheer).
- [x ] Classroom-links per categorie en per vestiging invullen (tabblad Beheer).

## Beslist

- [x ] Btw-aangifte als document bij BTW1–BTW4? NEE, geen btw-document: zoals
  in kern 8 enkel een uitleg, de leerling rekent vanuit de T-rekeningen.

## Losse ideeën

- pas te bekijken in zomer 2027: mogen er afschrijvingen in J1? indien neen kunnen de 4es wel een openingsbalans boeken. Lijkt wel ok zo voor dit jaar
