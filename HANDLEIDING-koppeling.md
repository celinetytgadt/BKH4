# Koppeling met Google Sheets — installatie en gebruik

Boekhoudapp 4e jaar (case MetWear, zes boekjaren). Dit werkt zoals in de app van kern 8,
met één groot verschil:

> **Eén Sheet en één script voor de drie vestigingen.** In kern 8 had elke
> vestiging een eigen Sheet met een eigen kopie van `Code.gs`, en moest elke
> wijziging drie keer gebeuren. Hier is er nog maar één Sheet, één script en
> één web-app-URL. De app stuurt bij elk verzoek de code van de vestiging mee
> (LEU, SKW, TW). **Elke vestiging heeft in die Sheet haar eigen
> tabbladen**, met de code achter de naam: *Klas LEU*, *Inzendingen LEU*,
> *Detail LEU*, *Instellingen LEU*, *Taken LEU*, *Zelfcontrole LEU* — en
> hetzelfde voor SKW en TW.

| | per vestiging | voor de drie samen |
|---|---|---|
| namenlijst en codes | ✓ — *Klas LEU* … | |
| inzendingen en feedback | ✓ — *Inzendingen LEU*, *Detail LEU* … | |
| links naar de taken in Classroom | ✓ — *Taken LEU* … | |
| welkomsttekst, mededeling, links cursus/handleiding | ✓ — *Instellingen LEU* … | |
| wat de leerlingen zien (jaren, categorieën, zelfcontrole) | ✓ — *Instellingen LEU*, via Beheer | |
| aanbevolen delen per leerling (remediëring) | ✓ — *Instellingen LEU*, via Beheer | |
| pogingen van de zelfcontrole | ✓ — *Zelfcontrole LEU* … | |
| expertcode voor het tabblad Beheer | ✓ — *Instellingen LEU* … | |
| werkbestanden in Drive | ✓ — `werk_LEU_lottev.json` | één map, die het script zelf aanmaakt |
| oplossingssleutel | | ✓ — tabblad *Sleutel* |

**Beheer per vestiging.** Elke vestiging heeft haar eigen expertcode. Met de
school kies je in het tabblad Beheer zelf, los van de schoolkeuze bovenaan
(die is voor de leerlingen). Met de code van Leuven opent Beheer enkel
Leuven; kies je in Beheer een andere school, dan gaat het weer op slot.

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

Je krijgt per vestiging de tabbladen **Klas**, **Inzendingen**, **Detail**,
**Instellingen**, **Taken** en **Zelfcontrole** (bv. *Klas LEU*, *Klas SKW*,
*Klas TW*), en één
gedeeld tabblad **Sleutel**. Dat is meteen gevuld met de oplossing van de case:
het automatisch nakijken werkt vanaf de eerste inzending.

### 4. Expertcode en klaslijsten

- **Boekhoudapp → Expertcode instellen…** — het script vraagt eerst de
  vestiging, dan de code. Doe het drie keer, met drie verschillende codes, en
  geef elke code enkel aan de vakexperten van die vestiging.
- De klaslijsten vullen de vakexperten het makkelijkst zelf in via het tabblad
  **Beheer** in de app (school kiezen → Beheer → expertcode van die school).
  De codes van de leerlingen worden dan automatisch aangemaakt.
- Rechtstreeks in de Sheet kan ook: tabblad **Klas LEU** (of SKW, TW), kolom A
  de naam. Daarna **Boekhoudapp → Codes genereren voor lege vakjes** (dat doet
  het voor de drie tabbladen Klas).

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

**Wat de leerling ziet.** Enkel wat de vakexperten van die vestiging in
**Beheer → Wat zien de leerlingen?** openzetten: per boekjaar, en in de jaren
met categorieën ook per categorie. In 20X2, 20X4 en 20X5 zijn aankopen en
verkopen opgesplitst in taken (lessen):

- Aankopen taak 1: eenvoudige facturen
- Aankopen taak 2: handelskorting & transportkosten
- Aankopen taak 3: diensten, diverse goederen & vaste activa
- Aankopen taak 4: creditnota's
- Verkopen taak 1: eenvoudige facturen (met de dagontvangsten)
- Verkopen taak 2: handelskorting & extra kosten
- Verkopen taak 3: creditnota's
- Verkopen taak 4: terugstuurbare verpakking

Daarna volgen Btw-verrekening, Financiële verrichtingen en Eindejaar.
*Eindejaar* opent ook de resultaatverwerking en de eindbalans. Per jaar zet
je ook apart open: *proef- en saldibalans*, *klanten & leveranciers* en
*beginbalans in T-rekeningen*. Bovenaan het menu kiest de leerling het
boekjaar.

**De beginbalans staat al klaar.** Elk jaar begint met de boeking BB. Ze
staat geboekt, maar niet meer in het menu, en gaat niet mee bij het
indienen. De T-rekeningen tonen ze standaard niet: zo ziet de leerling enkel
wat hij zelf boekt. Zet *beginbalans in T-rekeningen* aan zodra de saldi
ertoe doen (bv. bank en kas bij de financiële verrichtingen).

**Controles per taak.** Bij elke taak van aankopen en verkopen staat één
vraag per T-rekening die in die taak gebruikt wordt, met de T-rekening zoals
ze moet staan (enkel de documenten van die taak, zonder beginbalans). In de cursus
(20X1) staat álles al geboekt: de leerling ziet de documenten en de
T-rekeningen, zonder redeneerschema's.

**Bewaren.** Alles (de zes jaren samen) blijft in de browser én gaat elke
twee minuten naar de Drive-map. Op een andere computer aanmelden = verder
werken.

**Indienen.** Enkel in de taak (20X2) en de consolidaties (20X3, 20X6). In
de Sheet krijgt alles het jaar ervoor: *20X2 AK01*, categorie *20X2 ·
Aankopen taak 1: eenvoudige facturen*. Na het indienen toont de app de knop
naar de taak in Classroom: in 20X2 één taak per categorie (*20X2 · Aankopen
taak 1: eenvoudige facturen* … *20X2 · Eindejaar*, waar
ook de resultaatverwerking en de eindbalans bij horen), voor een
consolidatie één taak voor het hele jaar (*20X3 · Consolidatie*, *20X6 ·
Consolidatie 2*).

**Zelfcontrole (20X4 en 20X5).** Staat ze aan in Beheer, dan kan de leerling
na het boeken op *Controleer mijn boeking* klikken. De eerste keer zegt de app
enkel *klopt nog niet*; na heropenen en verbeteren ziet de leerling welke
lijnen nog fout zijn. Elke poging komt in het tabblad *Zelfcontrole* van de
vestiging. **Beheer → Hoe ging de zelfcontrole?** maakt er een overzicht van:
per document hoeveel leerlingen, hoeveel pogingen, hoeveel procent meteen
juist, wie het nog niet juist heeft, en welke rekeningen het vaakst fout
stonden.

**Aanbevolen (20X5, remediëring).** De app zet een ★ bij de hoofdstukken waar
een document van de taak of de consolidatie nog niet *In orde* is (de laatste
vrijgegeven beoordeling telt). In **Beheer → Aanbevolen in de remediëring**
vink je per leerling nog extra hoofdstukken aan. Een leerling krijgt enkel
de eigen aanbevelingen te zien.

**Klanten & leveranciers** staat bovenaan in het menu (openstaande facturen
volg je het hele jaar op) en gaat mee bij het indienen van *Financiële
verrichtingen* (in een consolidatie: met het hele jaar).

---

## Deel 3 — Nakijken

Je werkt in het tabblad **Inzendingen** van je eigen vestiging (bv.
*Inzendingen LEU*) en zet één filter:

- **is laatste** = `JA`

De kolom *boeking* toont de boeking zoals in een dagboek (rekening, bedrag,
D/C, en tussen haakjes de klant of leverancier).

**Automatisch nakijken.** Elke inzending wordt meteen naast de sleutel van de
case gelegd: per boeking het saldo per rekening. Klopt het, dan staat er al
*In orde*; klopt het niet, dan *Te remediëren* met in de kolom *automatische
controle* welke rekeningen afwijken (die kolom ziet de leerling niet). Bij de
resultaatverwerking worden opbrengsten, kosten en winst vergeleken, bij de
eindbalans in welk vak elke rubriek ligt.

**Controles van de leerling.** In de kolom *controles leerling* zie je of de
leerling de controles van die categorie had afgevinkt bij het indienen: *ja*,
*nee: 1 van 3 afgevinkt*, of *ja, maar daarna een boeking heropend*. Leeg =
die categorie heeft geen controles.

**Klasoverzicht in het tabblad Klas.** Rechts van *opmerking* zet het script
een kolom per categorie (*X2 AK*, *X2 VK* … *X2 EJ*, *X2 RES*, *X2 EB*, *X3 DOC* …). Daar staat **OK** zodra alle
verrichtingen van die categorie bij die leerling op *In orde* staan (de
nieuwste rij telt, vrijgegeven of niet). De volle naam van de categorie staat
als notitie op de kop. Het overzicht volgt vanzelf: bij elk indienen, bij het
automatisch nakijken en telkens je een beoordeling aanpast. De kolommen
verschijnen na het eerste indienen met deze versie; voor de zekerheid is er
**Boekhoudapp → Klasoverzicht (OK per categorie) bijwerken**. Tik zelf niets
in die kolommen: ze worden telkens overschreven.

**Vrijgeven.** Cursor op een rij van de leerling in *Inzendingen* van je
vestiging → **Boekhoudapp → Feedback vrijgeven voor deze leerling**. Enkel de
rijen van die leerling in dát tabblad worden vrijgegeven. *In orde* zet de verrichting op slot in de app.

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
| `apps-script/SleutelCase.gs` | de oplossing van de taak en de consolidaties, voor het tabblad Sleutel, en bij welk hoofdstuk elk document hoort (gemaakt met `hulpmiddelen/metwear/maak-app-data.py`) |
| `js/config-koppeling.js` | de web-app-URL, het sleutelwoord en de drie vestigingen |
| `js/data-klas.js` | noodlijst met namen per vestiging, normaal leeg |
| `js/koppeling.js` | alles wat de app met de Sheet doet |
| `js/beheer.js` | het tabblad Beheer voor de vakexperten, telkens voor één vestiging |
| `test/test-koppeling.js` | automatische test van dit alles |
