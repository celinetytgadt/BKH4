# Voor later

Eén lijn per punt volstaat. Wat klaar is, mag weg (of vink het af met `[x]`).

## Na de omschakeling naar MetWear (november 2026, nu doen)

- [ ] **`Code.gs` én `SleutelCase.gs` opnieuw plakken in de Sheet** en
  *Implementeren → Implementaties beheren → bewerken → nieuwe versie*.
  `appsscript.json` is niet gewijzigd.
- [ ] In de Sheet **Boekhoudapp → Eerste installatie** opnieuw draaien: dat
  maakt per vestiging het tabblad *Zelfcontrole*, zet de nieuwe taken
  (*20X2 · Aankopen* …) en de instellingen *zichtbaarheid* en *aanbevolen*
  klaar, en voegt de kolommen klasse en rubriek toe aan *Detail*.
- [ ] **Sleutel vervangen**: **Boekhoudapp → Sleutel van de case (opnieuw)
  invullen** (de oude sleutel van Noor moet weg).
- [ ] Oude taken van Noor (*K1 · Aankopen* …) mogen uit het tabblad *Taken*
  van elke vestiging; de nieuwe links vul je in via Beheer.
- [ ] Per vestiging in **Beheer** openzetten wat de leerlingen mogen zien.
  Tot dan zien ze niets.

## De case verbeteren

Werkwijze: eerst alle wijzigingen in de case (map *case metwear BKH4*, met
`script/genereer.py`), daarna één keer
`python3 hulpmiddelen/metwear/maak-app-data.py "pad/naar/case metwear BKH4"`
(zie `hulpmiddelen/README.md`). Daarna: versienummer in `index.html`
verhogen, de test draaien en de nieuwe `SleutelCase.gs` in de Sheet plakken.

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
