# Hulpmiddelen

## De case MetWear in de app zetten

De case zelf (Excel, documenten, bundels) wordt gemaakt in de map
*case metwear BKH4* met `script/genereer.py` (zie *Werkwijze en keuzes case
BKH4.docx* in die map). Daarna zet één script alles in de app:

```
python3 hulpmiddelen/metwear/maak-app-data.py "pad/naar/case metwear BKH4"
```

Nodig: Python 3 met `openpyxl`. Het script stopt met een foutmelding als een
boeking niet in evenwicht is, een rekening niet in het MAR staat of de
beginbalans per klant of leverancier niet klopt.

| Maakt | Wat |
|---|---|
| `js/mar.js`, `js/data-mar-indeling.js` | het MAR 2e graad (btw vereenvoudigd) met klassen en rubrieken |
| `js/data-jaren.js` | de zes boekjaren: menu, documenten, beginbalans, de cursus 20X1 (al geboekt), relaties |
| `js/data-sleutel-oefen.js` | de sleutel van 20X4 en 20X5, voor de zelfcontrole in de app |
| `apps-script/SleutelCase.gs` | de sleutel van 20X2, 20X3 en 20X6: die blijft op de server |
| `documenten/<jaar>/` | de documenten |

Na het script: het versienummer in `index.html` verhogen, de test draaien
(`test/LEESMIJ.md`) en de nieuwe `SleutelCase.gs` in de Sheet plakken.

`metwear/SleutelCase-staart.gs` is het vaste stuk onderaan `SleutelCase.gs`
(het menu om de sleutel in te vullen); het script plakt het er telkens achter.

## De app lokaal bekijken

```
node hulpmiddelen/server.js
```

en surf naar http://localhost:8080.
