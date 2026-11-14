# Automatische test van de koppeling

Draait de echte app in een nagebootste browser (jsdom) tegen de echte
`Code.gs` + `SleutelCase.gs`, met een nagemaakte Google-omgeving ertussen.
Getest wordt: de installatie van de ene Sheet, het beheer per vestiging,
aanmelden met de vestigingskeuze, indienen, automatisch nakijken met de
sleutel van de case, gelijknamige leerlingen in twee vestigingen, feedback
vrijgeven, de resultaatverwerking zonder belasting en de menu's in de Sheet.
Voor de case MetWear ook: de zichtbaarheid per jaar en categorie, de cursus
zonder redeneerschema's, de volgorde van het redeneerschema, de zelfcontrole
in 20X4 met het overzicht in Beheer, en de aanbevelingen in de remediëring.

## Draaien

Node.js nodig, en eenmalig in deze map of hoger:

    npm install jsdom

Daarna, vanuit de hoofdmap van de repo:

    node test/test-koppeling.js

Staat jsdom ergens anders, zet dan `JSDOM_PAD` op die map `node_modules`.
Alles goed? Dan eindigt het met "Alle controles geslaagd."
