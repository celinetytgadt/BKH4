# Koppeling met Google Sheets — installatie en gebruik

Boekhoudapp 4e jaar (Fietsatelier Noor). Dit werkt zoals in de app van kern 8,
met één groot verschil:

> **Eén Sheet en één script voor de drie vestigingen.** In kern 8 had elke
> vestiging een eigen Sheet met een eigen kopie van `Code.gs`, en moest elke
> wijziging drie keer gebeuren. Hier is er nog maar één Sheet, één script en
> één web-app-URL. De app stuurt bij elk verzoek de code van de vestiging mee
> (LEU, SKW, TW). In de tabbladen Klas, Inzendingen en Detail staat die code
> in een eigen kolom: filter erop om enkel je eigen vestiging te zien.

Wat per vestiging apart blijft:

| | per vestiging | voor de drie samen |
|---|---|---|
| namenlijst en codes (tabblad Klas) | ✓ | |
| links naar de taken in Classroom (tabblad Taken) | ✓ — één kolom per vestiging | |
| inzendingen en feedback | ✓ — kolom *vestiging* | |
| werkbestanden in Drive | ✓ — `werk_LEU_lottev.json` | één map, die het script zelf aanmaakt |
| welkomsttekst, mededeling, links cursus/handleiding | | ✓ |
| expertcode voor het tabblad Beheer | | ✓ |
| oplossingssleutel | | ✓ |

Twee leerlingen met dezelfde naam in twee scholen zijn geen probleem: de
vestiging hoort overal mee bij de naam.

## Zo weinig mogelijk toegang

Het script vraagt enkel deze vier toegangen (vastgelegd in
`apps-script/appsscript.json`, het "manifest"):

| Toegang | Wat het script ermee mag |
|---|---|
| *Spreadsheets bekijken en bewerken waarin deze app is geïnstalleerd* | enkel déze ene Sheet — geen andere Sheets |
| *Inhoud weergeven en uitvoeren in Google-apps* | het menu Boekhoudapp en de vensters in de Sheet |
| *Alleen de Drive-bestanden zien en beheren die met deze app zijn geopend of gemaakt* | enkel de map die het script zelf aanmaakt en de werkbestanden erin. De rest van de Drive is onzichtbaar voor het script |
| *Verbinding maken met een externe service* | nodig om de werkbestanden terug te lezen. In het manifest staat dat het script enkel het Drive-adres van Google mag aanspreken (`https://www.googleapis.com/drive/v3/files/`), geen andere adressen |

Waarom die laatste? Met de beperkte Drive-toegang kan het script bestanden
wel schrijven, maar niet lezen via de gewone Drive-dienst. Het leest ze
daarom rechtstreeks bij Google, met dezelfde beperkte toegang.

Gevolg van die beperking: **het script maakt zijn map zelf aan**. Een
bestaande map opgeven kan niet, want daar zou het script geen toegang toe
hebben. Ook de map van kern 8 is dus onbereikbaar — en dat is goed zo.

---

## Deel 1 — Eenmalig installeren (ongeveer een kwartier)

### 1. Maak de Google Sheet

Maak in de Drive van het account dat het script zal draaien (bv. een
gedeelde vakgroepsaccount) een nieuwe Google Sheet, bv. *Boekhoudapp 4e jaar —
nakijken 2027*. Deel ze met de vakexperten van de drie vestigingen (bewerken):
zij kijken erin na.

### 2. Plak de drie scriptbestanden

Open de Sheet en ga naar **Uitbreidingen → Apps Script**.

1. **Het manifest.** Klik links op het tandwiel (**Projectinstellingen**) en
   vink **Manifestbestand appsscript.json weergeven in editor** aan. Ga terug
   naar de editor (het pictogram `< >`), open `appsscript.json`, wis wat er
   staat en plak de inhoud van `apps-script/appsscript.json`. Daarmee staan de
   beperkte toegangen vast én wordt de geavanceerde dienst *Drive* aangezet.
2. Open `Code.gs`, wis wat er staat en plak de volledige inhoud van
   `apps-script/Code.gs`.
3. Klik op **+ → Script** en noem het nieuwe bestand `SleutelCase`. Plak daar de
   inhoud van `apps-script/SleutelCase.gs` (de oplossing van de case).
4. Bewaar (het diskettepictogram).

Kijk bovenaan `Code.gs` het sleutelwoord na — het moet hetzelfde zijn als in
`js/config-koppeling.js`:

```js
var SLEUTEL = "DEMET";
```

> Staat links onder **Services** nu *Drive*? Dan is het manifest goed
> ingeladen. Zie je het niet, plak `appsscript.json` dan opnieuw.

De lijst `VESTIGINGEN` bovenaan staat al juist (LEU, SKW, TW). Komt er een
vestiging bij, dan zet je ze daar én in `js/config-koppeling.js`.

### 3. Maak de tabbladen aan

Herlaad de Sheet (F5). Er verschijnt een menu **Boekhoudapp**. Kies
**Boekhoudapp → Eerste installatie** en geef de eerste keer toestemming
(*Geavanceerd → Ga naar … (onveilig)* — het is je eigen script).

In het toestemmingsvenster staan **precies de vier toegangen** uit de tabel
hierboven. Staat er iets als *alle bestanden in je Google Drive bekijken,
bewerken, maken en verwijderen*, dan is het manifest niet ingeladen: stop,
en kijk stap 2 na.

De installatie maakt ook de map *Boekhoudapp 4e jaar werkbestanden* aan in de
Drive van dit account. Via **Boekhoudapp → Waar staan de werkbestanden?**
vind je de link.

Je krijgt de tabbladen **Klas**, **Inzendingen**, **Detail**, **Instellingen**,
**Taken** en **Sleutel**. Het tabblad Sleutel is meteen gevuld met de oplossing
van de case: het automatisch nakijken werkt vanaf de eerste inzending.

### 4. Expertcode en klaslijsten

- **Boekhoudapp → Expertcode instellen…** — met die code openen de vakexperten
  het tabblad *Beheer* in de app. Eén code voor de drie vestigingen.
- De klaslijsten vullen de vakexperten het makkelijkst zelf in, elk voor de
  eigen vestiging, via het tabblad **Beheer** in de app (school kiezen →
  Beheer → expertcode). De codes worden dan automatisch aangemaakt.
- Rechtstreeks in de Sheet kan ook: tabblad **Klas**, kolom A de vestiging
  (LEU, SKW of TW), kolom B de naam. Daarna **Boekhoudapp → Codes genereren
  voor lege vakjes**.

### 5. Publiceer het script als web-app

In de Apps Script-editor: **Implementeren → Nieuwe implementatie**.

- Type: **Web-app**
- Uitvoeren als: **Ik**
- Wie heeft toegang: **Iedereen**

Kopieer de **web-app-URL** (eindigt op `/exec`).

> "Iedereen" betekent: iedereen mag het script *aanspreken*. Wat het
> teruggeeft, hangt af van de naam, de code en de vestiging die meegestuurd
> worden.

### 6. Zet de URL in de app

Open `js/config-koppeling.js` en plak de URL bij `webAppUrl`:

```js
const KOPPELING = {
  webAppUrl: "https://script.google.com/macros/s/AKfy…/exec",
  sleutel: "DEMET",
  …
};
```

Eén URL voor de drie vestigingen. Zet het bestand op GitHub; klaar.

---

## Deel 2 — Hoe het werkt voor de leerling

**Aanmelden.** School kiezen, naam kiezen, persoonlijke code tikken. Eén keer
per computer.

**De beginbalans staat al klaar.** De boeking BB (1 januari 2027) is de
eindbalans van het 3e jaar na afsluiting. Ze staat geboekt en op slot; de
leerling kan ze niet wijzigen en ze gaat niet mee bij het indienen. Op de
controlepagina van de beginbalans legt de leerling ze wel als oefening in de
balans.

**Bewaren.** Alles blijft in de browser én gaat elke twee minuten naar de
Drive-map. Op een andere computer aanmelden = verder werken.

**Indienen.** Per categorie, dus per kwartaal: *K1 · Aankopen*, *K1 ·
Verkopen*, … *K4 · Alle verrichtingen*, *Eindejaarsverrichtingen*,
*Resultaatverwerking* en *Eindbalans*. Na het indienen toont de app de knop
naar de taak in Classroom van díé vestiging.

**Klanten & leveranciers** staat bovenaan in het menu (openstaande facturen
volg je het hele jaar op) en gaat mee bij het indienen van *K4 · Alle
verrichtingen*.

---

## Deel 3 — Nakijken

In het tabblad **Inzendingen** zet je twee filters:

- **vestiging** = jouw vestiging
- **is laatste** = `JA`

De kolom *boeking* toont de boeking zoals in een dagboek (rekening, bedrag,
D/C, en tussen haakjes de klant of leverancier).

**Automatisch nakijken.** Elke inzending wordt meteen naast de sleutel van de
case gelegd: per boeking het saldo per rekening. Klopt het, dan staat er al
*In orde*; klopt het niet, dan *Te remediëren* met in de kolom *automatische
controle* welke rekeningen afwijken (die kolom ziet de leerling niet). Bij de
resultaatverwerking worden opbrengsten, kosten en winst vergeleken, bij de
eindbalans in welk vak elke rubriek ligt.

**Vrijgeven.** Cursor op een rij van de leerling → **Boekhoudapp → Feedback
vrijgeven voor deze leerling**. Enkel de rijen van die leerling van díé
vestiging worden vrijgegeven. *In orde* zet de verrichting op slot in de app.

**Sleutel aanpassen.** Wijzig het tabblad Sleutel gerust zelf. Alles kwijt of
de case gewijzigd? **Boekhoudapp → Sleutel van de case (opnieuw) invullen**.
Daarna **Open inzendingen automatisch nakijken** voor wat al binnen was.

---

## Deel 4 — Praktische zaken

**Werk terugzetten.** **Boekhoudapp → Werk terugzetten uit een versie…** vraagt
eerst de vestiging, dan de naam. De vorige versies staan in de submap
*versies* (hoogstens één per uur, de vijf nieuwste).

**Waar staan de werkbestanden?** **Boekhoudapp → Waar staan de werkbestanden?**
toont de link naar de map en het aantal bestanden per vestiging. Wil je dat
een collega mee in de werkbestanden kan kijken, deel dan die map met hem of
haar in Drive.

**De map verplaatsen.** Het script onthoudt de map aan haar ID, dus verplaatsen
binnen Drive mag. Verplaats je ze naar een **gedeelde Drive**, test dan meteen
of bewaren nog lukt (meld je aan als testleerling en kijk of er een
werkbestand bijkomt). Dat kon ik niet uitproberen buiten jullie
Google-omgeving.

**Een leerling opnieuw laten beginnen.** Verwijder
`werk_<vestiging>_<naam>.json` uit de map en laat de leerling opnieuw
aanmelden.

**Na een wijziging aan Code.gs, SleutelCase.gs of appsscript.json:** **Implementeren →
Implementaties beheren → potlood → Versie: Nieuwe versie → Implementeren.**
De URL blijft dezelfde. Dat moet nu nog maar één keer in plaats van drie keer.

**Veiligheid.** Enkel wie toegang heeft tot de Sheet en de map ziet het werk.
Leerlingen krijgen enkel terug wat bij hun eigen vestiging, naam én code
hoort. Het sleutelwoord in `config-koppeling.js` is een drempel, geen
wachtwoord.

---

## Wat waar staat

| Bestand | Waarvoor |
|---|---|
| `apps-script/appsscript.json` | het manifest: de vier beperkte toegangen, de dienst Drive en de web-app-instellingen |
| `apps-script/Code.gs` | de serverkant; bovenaan `SLEUTEL` en `VESTIGINGEN` |
| `apps-script/SleutelCase.gs` | de oplossing van de case, voor het tabblad Sleutel (gemaakt met `hulpmiddelen/maak-sleutel.js`) |
| `js/config-koppeling.js` | de web-app-URL, het sleutelwoord en de drie vestigingen |
| `js/data-klas.js` | noodlijst met namen per vestiging, normaal leeg |
| `js/koppeling.js` | alles wat de app met de Sheet doet |
| `js/beheer.js` | het tabblad Beheer voor de vakexperten |
| `test/test-koppeling.js` | automatische test van dit alles |
