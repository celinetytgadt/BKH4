/* beheer.js — Boekhoudapp 4e jaar, De MET
 *
 * Het tabblad Beheer: wat de vakexperten zelf kunnen instellen zonder dat
 * er iets op GitHub gewijzigd hoeft te worden.
 *
 *   • de namen van de leerlingen van hun vestiging, met hun persoonlijke code
 *   • welke boekjaren en categorieën de leerlingen zien, en waar de
 *     zelfcontrole aan staat (extra oefenmateriaal en remediëring)
 *   • per leerling wat aanbevolen is in de remediëring
 *   • de link naar de taak in Classroom, per categorie of per jaar
 *   • de welkomsttekst, een mededeling, en de links naar de cursus en de
 *     handleiding
 *   • een overzicht van de zelfcontrole: wat ging vaak fout?
 *
 * Alles komt terecht in de tabbladen van díé vestiging in de Google Sheet
 * ("Klas LEU", "Taken LEU", "Instellingen LEU" …). Alles is per vestiging:
 * wie in Leuven een leerling toevoegt of een welkomsttekst zet, verandert
 * niets in Tielt-Winge. Ook de expertcode is per vestiging, en het tabblad
 * gaat weer op slot zodra er bovenaan een andere school gekozen wordt.
 *
 * Het tabblad gaat pas open met de expertcode. Die wordt op de server
 * gecontroleerd — een controle in dit bestand zou niets waard zijn, want het
 * staat publiek leesbaar op GitHub Pages. Wat de leerling te zien krijgt
 * (namen, teksten, taken) haalt koppeling.js zelf op; de codes van de
 * leerlingen verlaten de Sheet enkel na een geslaagde controle.
 *
 * Dit bestand staat los van app.js en koppeling.js. Laat je het weg, dan
 * verdwijnt het tabblad en werkt de rest gewoon verder.
 */

(function () {
  "use strict";

  var ontgrendeld = false;
  // Voor welke vestiging het tabblad open staat. Een expertcode geldt maar
  // voor één vestiging: wordt bovenaan een andere school gekozen, dan gaat
  // het tabblad weer op slot (zie opSlotAlsAndereVestiging).
  var ontgrendeldVoor = "";
  var expertcode = "";
  var bezig = false;
  var melding = null;     // { soort: "ok" | "fout" | "info", tekst: "…" (platte tekst) }

  // Het element waarop de luisteraars al liggen. app.js bouwt de pagina bij
  // elke wijziging opnieuw op, maar hergebruikt daarvoor altijd hetzelfde
  // #pagina-inhoud. De luisteraars hangen aan dát element en overleven het
  // vervangen van de inhoud — ze mogen er dus maar één keer op.
  var gebondenAan = null;

  // Wat er in de velden staat. Bewust apart van het scherm: app.js bouwt de
  // pagina soms opnieuw op (bv. als er intussen feedback binnenkomt), en dan
  // mag er niets ingetikts verloren gaan.
  //   zicht       { "20X2": { open, cats: { Aankopen: true }, zelfcontrole } }
  //   aanbevolen  { genormaliseerde naam: ["Aankopen", …] }  (door de expert)
  //   auto        idem, maar uitgerekend door de server uit de feedback
  //   zc          de pogingen van de zelfcontrole (enkel om te lezen)
  var model = leegModel();

  function leegModel() {
    return { instellingen: {}, taken: [], klas: [], zicht: {}, aanbevolen: {}, auto: {}, zc: [] };
  }

  function api() { return window.KOPPELING_API || null; }

  // De luisteraars blijven liggen als de leerling naar een ander tabblad
  // gaat. Ze mogen dan niets doen.
  function opBeheerpagina() {
    return !!(window.APP && window.APP.huidigePagina && window.APP.huidigePagina() === "beheer");
  }

  function zegOk(tekst) { melding = { soort: "ok", tekst: tekst }; }
  function zegFout(tekst) { melding = { soort: "fout", tekst: tekst }; }
  function zegBezig(tekst) { melding = { soort: "info", tekst: tekst }; }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function herteken() { window.APP.renderAlles(); }

  /* ======================================================================
     De categorieën waarvoor er een taak in Classroom bestaat

     Ze komen uit data-opdrachten.js, zodat de lijst automatisch meegroeit
     als de bundel verandert. Staat er in de Sheet nog een oude categorie met
     een ingevulde link, dan blijft die onderaan staan: liever een regel te
     veel dan een link die stilletjes verdwijnt.
     ====================================================================== */
  function taakCategorieen() {
    var lijst = [];
    Object.keys(JAREN).forEach(function (jaar) {
      var J = JAREN[jaar];
      var soort = JAAR_SOORTEN[J.soort] || {};
      if (soort.taakPer === "jaar") lijst.push(jaar + " · " + J.titel);
      if (soort.taakPer === "categorie") {
        ZICHTBAAR_CATEGORIEEN.forEach(function (cat) {
          if (J.categorieVolgorde.indexOf(cat) !== -1) lijst.push(jaar + " · " + cat);
        });
      }
    });
    model.taken.forEach(function (t) {
      if (t.link && lijst.indexOf(t.categorie) === -1) lijst.push(t.categorie);
    });
    return lijst;
  }

  function taakVoor(categorie) {
    for (var i = 0; i < model.taken.length; i++) {
      if (model.taken[i].categorie === categorie) return model.taken[i];
    }
    var nieuw = { categorie: categorie, link: "", opmerking: "" };
    model.taken.push(nieuw);
    return nieuw;
  }

  /* ======================================================================
     Het scherm
     ====================================================================== */

  // De tekst wordt hier ontsmet en niet bij het instellen: zo kan een
  // boodschap van de server nooit als HTML in de pagina belanden, ook niet
  // als er later ergens een zeg…() vergeten wordt.
  function htmlMelding() {
    if (!melding) return "";
    return '<p class="beheer-melding beheer-' + melding.soort + '">' + esc(melding.tekst) + "</p>";
  }

  function htmlSlot() {
    var a = api();
    var label = a ? a.vestigingLabel() : "";
    var html = '<h1 class="pagina-titel">Beheer</h1>' +
      '<p class="pagina-subtitel">' + (label ? esc(label) + " — " : "") + "voor vakexperten</p>" +
      '<div class="paneel beheer-slot">' +
      "<p>Hier stel je in wat de leerlingen van jouw vestiging te zien krijgen: " +
      "de namenlijst, de taken in Classroom, de welkomsttekst en de links naar de cursus en de handleiding.</p>";

    // Alles staat per vestiging apart. Zolang er geen school gekozen is,
    // weet de app niet welke ze moet openen.
    if (!a || !a.actief()) {
      return html + "<p><strong>Kies eerst bovenaan je school.</strong> Elke vestiging heeft haar eigen instellingen en haar eigen expertcode.</p></div>";
    }

    return html +
      "<p>Je hebt de expertcode van " + esc(label) + " nodig. Ken je ze niet, vraag ze aan Céline.</p>" +
      '<p class="beheer-rij"><input type="password" data-role="expertcode" placeholder="expertcode" ' +
      'autocomplete="new-password" value="' + esc(expertcode) + '"> ' +
      '<button type="button" class="btn-primair" data-role="ontgrendel"' + (bezig ? " disabled" : "") + ">" +
      (bezig ? "Even geduld…" : "Openen") + "</button></p>" +
      htmlMelding() +
      "</div>";
  }

  function htmlKlas() {
    var rijen = model.klas.map(function (l, i) {
      return '<tr class="' + (l.weg ? "beheer-weg" : "") + '">' +
        '<td><input type="text" data-role="klas-naam" data-i="' + i + '" value="' + esc(l.naam) + '" ' +
        'placeholder="voornaam + eerste letter achternaam"></td>' +
        '<td class="beheer-code">' + (l.code ? esc(l.code) : '<span class="beheer-nog">wordt aangemaakt</span>') + "</td>" +
        '<td><input type="text" data-role="klas-opm" data-i="' + i + '" value="' + esc(l.opmerking) + '"></td>' +
        '<td><button type="button" class="btn-mini" data-role="klas-weg" data-i="' + i + '" ' +
        'title="' + (l.weg ? "Toch behouden" : "Deze leerling verwijderen") + '">' +
        (l.weg ? "↩" : "✕") + "</button></td></tr>";
    }).join("");

    return '<div class="paneel">' +
      "<h2>Leerlingen</h2>" +
      "<p>Deze namen staan in de keuzelijst bovenaan de app. Elke leerling krijgt automatisch een " +
      "code van vier cijfers; die geef je persoonlijk door, want daarmee komt de leerling aan zijn eigen werk. " +
      "Schrijf de naam zoals de leerling zichzelf zou intikken — hoofdletters, punten en spaties maken niet uit.</p>" +
      '<table class="beheer-tabel beheer-klas">' +
      "<thead><tr><th>naam</th><th>code</th><th>opmerking</th><th></th></tr></thead>" +
      "<tbody>" + (rijen || '<tr><td colspan="4">Nog geen leerlingen.</td></tr>') + "</tbody></table>" +
      '<p class="beheer-rij"><button type="button" data-role="klas-erbij">+ leerling toevoegen</button></p>' +
      "<details><summary>Meerdere namen tegelijk plakken</summary>" +
      "<p>Eén naam per regel. Namen die er al staan, worden overgeslagen.</p>" +
      '<textarea data-role="klas-plak" rows="5" placeholder="Lotte V.&#10;Youssef B."></textarea>' +
      '<p class="beheer-rij"><button type="button" data-role="klas-plak-doen">Toevoegen aan de lijst</button></p>' +
      "</details>" +
      '<p class="keuze-nota">Een leerling verwijderen haalt enkel de naam uit de lijst. Het werk blijft op de ' +
      "Drive staan; zet je de naam er later weer bij, dan krijgt die leerling een nieuwe code maar hetzelfde werk terug.</p>" +
      "</div>";
  }

  function htmlTaken() {
    var rijen = taakCategorieen().map(function (cat) {
      var t = taakVoor(cat);
      return "<tr><th>" + esc(cat) + "</th>" +
        '<td><input type="text" data-role="taak" data-cat="' + esc(cat) + '" value="' + esc(t.link) + '" ' +
        'placeholder="https://classroom.google.com/c/…/a/…/details"></td></tr>';
    }).join("");

    return '<div class="paneel">' +
      "<h2>Taken in Classroom</h2>" +
      "<p>Zodra een leerling een categorie indient, toont de app een knop naar de bijbehorende taak in Classroom, " +
      "met de herinnering dat die daar ook nog ingediend moet worden. Zonder link blijft die herinnering staan, " +
      "maar dan zonder knop.</p>" +
      "<details><summary>Waar vind ik die link?</summary>" +
      "<ol>" +
      "<li>Open in Classroom de klas en het tabblad <em>Klaswerk</em>.</li>" +
      "<li>Klik de taak open.</li>" +
      "<li>Klik rechtsboven op de drie puntjes (⋮) en kies <em>Link kopiëren</em>.</li>" +
      "<li>Plak die link hieronder.</li>" +
      "</ol>" +
      "<p>Zo'n link ziet er ongeveer zo uit: " +
      "<code>https://classroom.google.com/c/NzQyMzE4Mzk2ODVa/a/MjIzMjUyNDA3MTVa/details</code>. " +
      "Het moet de volledige link zijn — enkel het stuk na <code>/a/</code> volstaat niet.</p>" +
      "</details>" +
      '<table class="beheer-tabel beheer-taken"><tbody>' + rijen + "</tbody></table>" +
      '<p class="keuze-nota">In de taak is er één Classroom-taak per categorie; de resultaatverwerking en de eindbalans ' +
      "horen bij Eindejaar. Een consolidatie is één taak voor het hele jaar. De andere jaren worden niet ingediend.</p>" +
      "</div>";
  }

  /* ---------- Zichtbaarheid ---------- */

  function zichtVoor(jaar) {
    if (!model.zicht[jaar]) model.zicht[jaar] = { open: false, cats: {}, zelfcontrole: false };
    if (!model.zicht[jaar].cats) model.zicht[jaar].cats = {};
    return model.zicht[jaar];
  }

  function vinkje(rol, jaar, cat, aan, uit, label) {
    return '<label class="beheer-vink' + (uit ? " beheer-vink-uit" : "") + '"><input type="checkbox" data-role="' + rol + '" data-jaar="' + esc(jaar) + '"' +
      (cat ? ' data-cat="' + esc(cat) + '"' : "") + (aan ? " checked" : "") + (uit ? " disabled" : "") + "> " + esc(label) + "</label>";
  }

  function htmlZichtbaarheid() {
    var rijen = Object.keys(JAREN).map(function (jaar) {
      var J = JAREN[jaar];
      var soort = JAAR_SOORTEN[J.soort] || {};
      var z = zichtVoor(jaar);
      var html = "<tr><th>" + esc(jaar + " · " + J.titel) + "</th>" +
        "<td>" + vinkje("zicht-jaar", jaar, "", z.open, false, "zichtbaar") + "</td><td>";
      if (soort.perCategorie) {
        html += ZICHTBAAR_CATEGORIEEN.filter(function (c) { return J.categorieVolgorde.indexOf(c) !== -1; })
          .map(function (c) { return vinkje("zicht-cat", jaar, c, !!z.cats[c], !z.open, c); }).join("");
      } else {
        html += '<span class="beheer-nog">alle documenten door elkaar: het hele jaar in één keer</span>';
      }
      html += "</td><td>";
      if (soort.zelfcontrole) html += vinkje("zicht-zc", jaar, "", !!z.zelfcontrole, !z.open, "zelfcontrole aan");
      else html += '<span class="beheer-nog">' + (soort.vooraf ? "staat al geboekt" : "via jou") + "</span>";
      return html + "</td></tr>";
    }).join("");

    return '<div class="paneel">' +
      "<h2>Wat zien de leerlingen?</h2>" +
      "<p>Wat je hier niet aanvinkt, is voor de leerlingen van deze vestiging onzichtbaar. Zet een jaar zichtbaar en kies daarna " +
      "welke categorieën al open staan. <em>Eindejaar</em> opent ook de resultaatverwerking en de eindbalans van dat jaar.</p>" +
      '<table class="beheer-tabel beheer-zicht"><thead><tr><th>boekjaar</th><th></th><th>categorieën</th><th>controle</th></tr></thead>' +
      "<tbody>" + rijen + "</tbody></table>" +
      '<p class="keuze-nota">Met <em>zelfcontrole aan</em> kan de leerling een geboekt document laten controleren tegen de oplossing. ' +
      "De eerste keer zegt de app enkel of het klopt; vanaf de tweede keer welke lijnen nog fout zijn. Dat kan enkel in het extra oefenmateriaal " +
      "en de remediëring: van de taak en de consolidaties staat de oplossing niet in de app.</p>" +
      "</div>";
  }

  /* ---------- Aanbevolen per leerling (remediëring) ---------- */

  function remedieringJaren() {
    return Object.keys(JAREN).filter(function (j) { return (JAAR_SOORTEN[JAREN[j].soort] || {}).aanbevelen; });
  }

  function htmlAanbevolen() {
    var jaren = remedieringJaren();
    if (!jaren.length) return "";
    var jaar = jaren[0];
    var cats = ZICHTBAAR_CATEGORIEEN.filter(function (c) { return JAREN[jaar].categorieVolgorde.indexOf(c) !== -1; });
    var leerlingen = model.klas.filter(function (l) { return !l.weg && String(l.naam || "").trim(); });
    var rijen = leerlingen.map(function (l) {
      var sl = sleutelNaam(l.naam);
      var eigen = model.aanbevolen[sl] || [];
      var auto = model.auto[sl] || [];
      return "<tr><th>" + esc(l.naam) + "</th>" + cats.map(function (c) {
        var a = auto.indexOf(c) !== -1;
        return '<td class="beheer-midden"><input type="checkbox" data-role="aanbevolen" data-naam="' + esc(sl) + '" data-cat="' + esc(c) + '"' +
          (eigen.indexOf(c) !== -1 ? " checked" : "") + ' title="Aanbevelen voor ' + esc(l.naam) + '">' +
          (a ? ' <span class="beheer-auto" title="Ook automatisch aanbevolen: dit deel was in de taak of de consolidatie nog niet in orde">auto</span>' : "") +
          "</td>";
      }).join("") + "</tr>";
    }).join("");

    return '<div class="paneel">' +
      "<h2>Aanbevolen in de remediëring (" + esc(jaar) + ")</h2>" +
      "<p>De leerling ziet in het menu een ★ bij wat aanbevolen is. De app doet dat al vanzelf voor de hoofdstukken waar een " +
      "document van de taak (20X2) of de consolidatie (20X3) nog niet <em>In orde</em> was (aangeduid met <em>auto</em>). " +
      "Vink hier aan wat je daarnaast nog aanraadt. Andere leerlingen zien dit niet.</p>" +
      (rijen
        ? '<table class="beheer-tabel beheer-aanbevolen"><thead><tr><th>leerling</th>' +
          cats.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" + rijen + "</tbody></table>"
        : "<p>Nog geen leerlingen.</p>") +
      "</div>";
  }

  /* ---------- Overzicht van de zelfcontrole ---------- */

  function htmlZelfcontrole() {
    var perJaar = {};
    model.zc.forEach(function (p) {
      if (!p || !p.jaar || !p.ref) return;
      var j = perJaar[p.jaar] || (perJaar[p.jaar] = { refs: {}, leerlingen: {}, fout: {} });
      var r = j.refs[p.ref] || (j.refs[p.ref] = { ref: p.ref, categorie: p.categorie, pogingen: 0, leerlingen: {}, eersteJuist: 0, eersteTotaal: 0 });
      r.pogingen++;
      var sl = sleutelNaam(p.leerling);
      j.leerlingen[sl] = true;
      // Per leerling: de laatste poging telt voor "nog niet juist".
      var vorige = r.leerlingen[sl];
      if (!vorige || String(vorige.tijd) <= String(p.tijd)) r.leerlingen[sl] = { tijd: p.tijd, ok: !!p.ok, naam: p.leerling };
      if (Number(p.poging) === 1) { r.eersteTotaal++; if (p.ok) r.eersteJuist++; }
      String(p.fout || "").split(",").forEach(function (f) {
        f = f.trim();
        if (f) j.fout[f] = (j.fout[f] || 0) + 1;
      });
    });

    var jaren = Object.keys(perJaar).sort();
    var inhoud = jaren.length ? jaren.map(function (jaar) {
      var j = perJaar[jaar];
      var refs = Object.keys(j.refs).map(function (k) { return j.refs[k]; });
      var volgorde = (JAREN[jaar] ? JAREN[jaar].opdrachten.map(function (o) { return o.ref; }) : []);
      refs.sort(function (a, b) { return volgorde.indexOf(a.ref) - volgorde.indexOf(b.ref); });
      var fouten = Object.keys(j.fout).sort(function (a, b) { return j.fout[b] - j.fout[a]; }).slice(0, 10);

      var rijen = refs.map(function (r) {
        var ll = Object.keys(r.leerlingen).map(function (k) { return r.leerlingen[k]; });
        var nietOk = ll.filter(function (x) { return !x.ok; });
        var pct = r.eersteTotaal ? Math.round(100 * r.eersteJuist / r.eersteTotaal) : null;
        return "<tr" + (pct !== null && pct < 50 ? ' class="beheer-zc-zwak"' : "") + "><th>" + esc(r.ref) + "</th><td>" + esc(r.categorie || "") + "</td>" +
          '<td class="beheer-midden">' + ll.length + '</td><td class="beheer-midden">' + r.pogingen + "</td>" +
          '<td class="beheer-midden">' + (pct === null ? "—" : pct + "%") + "</td>" +
          "<td>" + (nietOk.length ? esc(nietOk.map(function (x) { return x.naam; }).join(", ")) : "—") + "</td></tr>";
      }).join("");

      return "<details class=\"beheer-zc-jaar\"" + (jaren.length === 1 ? " open" : "") + "><summary>" + esc(jaar) +
        (JAREN[jaar] ? " · " + esc(JAREN[jaar].titel) : "") + " — " + Object.keys(j.leerlingen).length + " leerling(en)</summary>" +
        (fouten.length ? "<p><strong>Vaakst fout:</strong> " + fouten.map(function (f) {
          var m = /^(\d+)(.*)$/.exec(f) || [f, f, ""];
          var mar = window.APP && APP.marBij ? APP.marBij(m[1]) : null;
          return esc(m[1]) + (mar ? " " + esc(mar.naam) : "") + esc(m[2]) + " ×" + j.fout[f];
        }).join(" · ") + "</p>" : "") +
        '<table class="beheer-tabel beheer-zc"><thead><tr><th>document</th><th>categorie</th><th>leerlingen</th><th>pogingen</th>' +
        "<th>1e keer juist</th><th>nog niet juist</th></tr></thead><tbody>" + rijen + "</tbody></table></details>";
    }).join("") : "<p>Nog geen zelfcontroles. Ze verschijnen hier zodra leerlingen in het extra oefenmateriaal of de remediëring op <em>Controleer mijn boeking</em> klikken.</p>";

    return '<div class="paneel">' +
      "<h2>Hoe ging de zelfcontrole?</h2>" +
      "<p>Per document: hoeveel leerlingen het controleerden, hoe vaak, hoeveel procent het de eerste keer juist had, en wie het nog niet juist heeft. " +
      "Bij <em>vaakst fout</em> staan de rekeningen die het vaakst verkeerd stonden (of ontbraken). Documenten waar minder dan de helft het meteen juist had, staan in het rood.</p>" +
      inhoud +
      '<p class="keuze-nota">Alle pogingen staan ook in de Google Sheet, in het tabblad <em>Zelfcontrole ' + esc(api() ? api().vestigingCode() : "") + "</em>.</p>" +
      "</div>";
  }

  function veld(sleutel, titel, uitleg, plaatshouder) {
    return '<label class="beheer-veld"><span class="beheer-label">' + esc(titel) + "</span>" +
      '<input type="text" data-role="inst" data-sleutel="' + sleutel + '" value="' +
      esc(model.instellingen[sleutel] || "") + '" placeholder="' + esc(plaatshouder || "") + '">' +
      '<span class="beheer-uitleg">' + uitleg + "</span></label>";
  }

  function htmlTeksten() {
    return '<div class="paneel">' +
      "<h2>Teksten en links</h2>" +
      '<label class="beheer-veld"><span class="beheer-label">Welkomsttekst op de startpagina</span>' +
      '<textarea data-role="inst" data-sleutel="welkomsttekst" rows="10" ' +
      'placeholder="Laat leeg voor de standaardtekst van de app.">' +
      esc(model.instellingen.welkomsttekst || "") + "</textarea>" +
      '<span class="beheer-uitleg">Een lege regel begint een nieuwe alinea. Een link maak je zo: ' +
      "<code>[naar de cursus](https://…)</code>, vet zo: <code>**belangrijk**</code>. " +
      "Laat je dit leeg, dan toont de app haar eigen uitleg over het redeneerschema, de T-rekeningen en het indienen.</span></label>" +

      veld("mededeling", "Mededeling bovenaan elke pagina",
        "Een gekleurd kadertje dat op elk tabblad meekomt, bv. \"Indienen kan tot vrijdag 17 u\". Leeg = geen kader.",
        "Leeg laten als er niets te melden valt") +

      veld("cursusUrl", "Link naar de cursus",
        "Komt als knop <em>Cursus</em> bovenaan te staan, op elk tabblad. Leerlingen die vastzitten kunnen zo meteen opzoeken.",
        "https://…") +

      veld("handleidingUrl", "Link naar de handleiding",
        "Komt als knop <em>Handleiding</em> bovenaan te staan. Leeg = geen knop.",
        "https://…") +
      "</div>";
  }

  function htmlOpen() {
    var a = api();
    return '<h1 class="pagina-titel">Beheer</h1>' +
      '<p class="pagina-subtitel">' + esc(a ? a.vestigingLabel() : "") +
      " — deze instellingen gelden enkel voor deze vestiging</p>" +
      htmlZichtbaarheid() + htmlKlas() + htmlAanbevolen() + htmlTaken() + htmlTeksten() + htmlZelfcontrole() +
      '<div class="paneel beheer-voet">' +
      '<button type="button" class="btn-primair" data-role="bewaren"' + (bezig ? " disabled" : "") + ">" +
      (bezig ? "Bezig met bewaren…" : "Bewaren") + "</button> " +
      '<button type="button" data-role="opnieuw"' + (bezig ? " disabled" : "") + ">Wijzigingen ongedaan maken</button>" +
      htmlMelding() +
      '<p class="keuze-nota">Alles komt in de Google Sheet terecht, in de tabbladen Klas, Taken en Instellingen ' +
      "van deze vestiging (bv. <em>Klas " + esc(a ? a.vestigingCode() : "") + "</em>). Je kan het daar ook rechtstreeks " +
      "aanpassen. De leerlingen zien de wijziging zodra ze de app opnieuw openen.</p>" +
      "</div>";
  }

  /* ======================================================================
     Praten met de server
     ====================================================================== */

  function ontgrendel(code) {
    var a = api();
    if (bezig) return;                       // dubbelklik of Enter erbovenop
    if (!a || !a.actief()) {
      zegFout("Voor deze vestiging is de koppeling met Google Sheets nog niet ingesteld.");
      herteken();
      return;
    }
    bezig = true;
    zegBezig("Even geduld — het script van Google moet eerst wakker worden. De eerste keer duurt dat vlot tien seconden.");
    herteken();
    var voorVestiging = a.vestigingCode();
    a.haal({ actie: "beheer", sleutel: a.sleutel(), expertcode: code })
      .then(function (r) {
        bezig = false;
        if (!r || !r.ok) {
          zegFout(r && r.uitleg ? r.uitleg : "Die code klopt niet voor deze vestiging.");
          herteken();
          return;
        }
        // Intussen een andere school gekozen? Dan hoort dit antwoord niet
        // meer bij wat er bovenaan staat.
        if (a.vestigingCode() !== voorVestiging) { herteken(); return; }
        expertcode = code;
        ontgrendeld = true;
        ontgrendeldVoor = voorVestiging;
        melding = null;
        neemOver(r);
        herteken();
      })
      .catch(function (err) {
        bezig = false;
        console.error(err);
        zegFout(a.foutUitleg(err));
        herteken();
      });
  }

  function leesJson(ruw) {
    if (ruw && typeof ruw === "object") return ruw;
    try { var x = JSON.parse(ruw || "{}"); return x && typeof x === "object" ? x : {}; } catch (e) { return {}; }
  }

  function neemOver(r) {
    model.instellingen = r.instellingen || {};
    model.zicht = leesJson(model.instellingen.zichtbaarheid);
    model.aanbevolen = leesJson(r.aanbevolen || model.instellingen.aanbevolen);
    model.auto = leesJson(r.aanbevolenAuto);
    model.zc = Array.isArray(r.zelfcontrole) ? r.zelfcontrole : [];
    // Die twee gaan als tekst (JSON) naar de Sheet; hier werken we met het object.
    delete model.instellingen.aanbevolen;
    model.taken = (r.taken || []).map(function (t) {
      return { categorie: t.categorie, link: t.link || "", opmerking: t.opmerking || "" };
    });
    model.klas = (r.klas || []).map(function (l) {
      return { naam: l.naam, code: l.code || "", opmerking: l.opmerking || "", weg: false };
    });
  }

  // Wordt bovenaan een andere school gekozen, dan gaat het tabblad op slot
  // en wordt alles vergeten: anders zou de lijst van Leuven bewaard worden
  // in de tabbladen van Tielt-Winge.
  function opSlotAlsAndereVestiging() {
    var a = api();
    if (!ontgrendeld || !a || a.vestigingCode() === ontgrendeldVoor) return;
    ontgrendeld = false;
    ontgrendeldVoor = "";
    expertcode = "";
    model = leegModel();
    zegBezig("Je koos een andere school. Geef de expertcode van die vestiging in.");
  }

  function bewaar() {
    var a = api();
    if (!a || bezig) return;                 // één keer tegelijk, nooit meer
    opSlotAlsAndereVestiging();
    if (!ontgrendeld) { herteken(); return; }
    bezig = true;
    zegBezig("Bezig met bewaren…");
    herteken();

    var klas = model.klas
      .filter(function (l) { return !l.weg && String(l.naam || "").trim(); })
      .map(function (l) { return { naam: l.naam.trim(), code: l.code, opmerking: l.opmerking }; });

    var taken = taakCategorieen().map(function (cat) {
      var t = taakVoor(cat);
      return { categorie: cat, link: String(t.link || "").trim(), opmerking: t.opmerking || "" };
    });

    var instellingen = {};
    Object.keys(model.instellingen).forEach(function (k) { instellingen[k] = model.instellingen[k]; });
    instellingen.zichtbaarheid = JSON.stringify(model.zicht);
    instellingen.aanbevolen = JSON.stringify(model.aanbevolen);

    a.stuur({
      actie: "beheerBewaren",
      sleutel: a.sleutel(),
      expertcode: expertcode,
      instellingen: instellingen,
      taken: taken,
      klas: klas,
    })
      .then(function (r) {
        bezig = false;
        if (!r || !r.ok) {
          // De foutmelding van de server erbij: anders valt er niet te
          // achterhalen wát er misliep (een ontbrekend tabblad, een
          // verkeerde code …).
          zegFout(r && r.uitleg ? r.uitleg
            : "Bewaren lukte niet" + (r && r.fout ? " (melding van de server: " + r.fout + ")" : "") + ". Probeer het opnieuw.");
          herteken();
          return;
        }
        // De server geeft de klaslijst terug mét de codes die ze zopas
        // aangemaakt heeft, zodat de expert ze meteen kan doorgeven. De
        // ingetikte teksten en taken blijven staan zoals ze hier staan: wie
        // tijdens het bewaren nog iets wijzigde, mag dat niet kwijtspelen.
        model.klas = (r.klas || klas).map(function (l) {
          return { naam: l.naam, code: l.code || "", opmerking: l.opmerking || "", weg: false };
        });
        // De app zelf (welkomsttekst, knoppen, namenlijst) meteen bijwerken
        // met wat de server terugstuurde. Vroeger werd daarvoor nóg eens
        // opgehaald, en dat verdubbelde de wachttijd bij elke bewaarbeurt.
        a.neemBeheerOver(r);
        zegOk("Bewaard. De leerlingen zien dit zodra ze de app opnieuw openen.");
        herteken();
      })
      .catch(function (err) {
        // Het verzoek is onderweg misgelopen. Dat betekent níét dat er niets
        // bewaard is: Apps Script schrijft gewoon door en laat soms enkel het
        // antwoord vallen. Voor we iets beweren, gaan we in de Sheet kijken.
        console.error(err);
        zegBezig("De verbinding viel weg. Even nakijken of het toch bewaard is…");
        herteken();
        kijkNaOfHetBewaardIs(klas, taken);
      });
  }

  /* Haalt opnieuw op wat er in de Sheet staat en vergelijkt dat met wat we
     net probeerden te bewaren. Staat het er, dan is er niets aan de hand. */
  function kijkNaOfHetBewaardIs(klas, taken) {
    var a = api();
    if (!a) { bezig = false; return; }
    setTimeout(function () {
      a.haal({ actie: "beheer", sleutel: a.sleutel(), expertcode: expertcode })
        .then(function (r) {
          bezig = false;
          if (r && r.ok && komtOvereen(r, klas, taken)) {
            neemOver(r);
            a.neemBeheerOver(r);
            zegOk("Toch bewaard. Het antwoord van de server bleef onderweg steken, maar alles staat in de Sheet.");
          } else {
            zegFout("Bewaren is niet gelukt. Probeer het opnieuw — wat je hier ingevuld hebt, blijft staan.");
          }
          herteken();
        })
        .catch(function (err) {
          bezig = false;
          console.error(err);
          zegFout(a.foutUitleg(err) + " Kijk in de Sheet na of je wijziging er toch staat voor je opnieuw op Bewaren klikt.");
          herteken();
        });
    }, 2000);
  }

  function komtOvereen(r, klas, taken) {
    var namenDaar = (r.klas || []).map(function (l) { return sleutelNaam(l.naam); }).sort().join("|");
    var namenHier = klas.map(function (l) { return sleutelNaam(l.naam); }).sort().join("|");
    if (namenDaar !== namenHier) return false;

    var links = {};
    (r.taken || []).forEach(function (t) { links[t.categorie] = String(t.link || ""); });
    for (var i = 0; i < taken.length; i++) {
      if (String(links[taken[i].categorie] || "") !== String(taken[i].link || "")) return false;
    }
    var inst = r.instellingen || {};
    if (String(inst.zichtbaarheid || "") !== JSON.stringify(model.zicht)) return false;
    var sleutels = Object.keys(model.instellingen).filter(function (k) { return k !== "zichtbaarheid"; });
    for (var j = 0; j < sleutels.length; j++) {
      if (String(inst[sleutels[j]] || "") !== String(model.instellingen[sleutels[j]] || "")) return false;
    }
    return true;
  }

  /* ======================================================================
     Wat app.js van dit bestand gebruikt
     ====================================================================== */

  window.BEHEER = {
    // Het tabblad staat er zodra er een koppeling is. Wat erachter zit,
    // wordt op de server afgeschermd met de expertcode.
    beschikbaar: function () {
      var a = api();
      return !!(a && a.ingesteld());
    },

    html: function () {
      opSlotAlsAndereVestiging();
      return ontgrendeld ? htmlOpen() : htmlSlot();
    },

    naRender: function (el) {
      /* app.js bouwt de pagina telkens opnieuw op, maar altijd binnen
         hetzelfde #pagina-inhoud. De luisteraars hieronder hangen aan dát
         element en blijven dus gewoon liggen als de inhoud vervangen wordt.
         Ze hier elke keer opnieuw leggen betekende dat één klik op Bewaren
         evenveel keer verstuurd werd als de pagina intussen hertekend was —
         bij twintig leerlingen toevoegen dus twintig gelijktijdige verzoeken
         naar Google. Vandaar: één keer binden, en niet meer. */
      if (gebondenAan === el) return;
      gebondenAan = el;

      el.addEventListener("input", function (e) {
        if (!opBeheerpagina()) return;
        var t = e.target;
        var rol = t.dataset && t.dataset.role;
        if (rol === "expertcode") { expertcode = t.value; return; }
        if (rol === "inst") { model.instellingen[t.dataset.sleutel] = t.value; return; }
        if (rol === "taak") { taakVoor(t.dataset.cat).link = t.value; return; }
        if (rol === "klas-naam") { model.klas[+t.dataset.i].naam = t.value; return; }
        if (rol === "klas-opm") { model.klas[+t.dataset.i].opmerking = t.value; return; }
      });

      el.addEventListener("change", function (e) {
        if (!opBeheerpagina()) return;
        var t = e.target;
        var rol = t.dataset && t.dataset.role;
        if (rol === "zicht-jaar") { zichtVoor(t.dataset.jaar).open = t.checked; herteken(); return; }
        if (rol === "zicht-cat") { zichtVoor(t.dataset.jaar).cats[t.dataset.cat] = t.checked; return; }
        if (rol === "zicht-zc") { zichtVoor(t.dataset.jaar).zelfcontrole = t.checked; return; }
        if (rol === "aanbevolen") {
          var lijst = model.aanbevolen[t.dataset.naam] || [];
          lijst = lijst.filter(function (c) { return c !== t.dataset.cat; });
          if (t.checked) lijst.push(t.dataset.cat);
          if (lijst.length) model.aanbevolen[t.dataset.naam] = lijst;
          else delete model.aanbevolen[t.dataset.naam];
          return;
        }
      });

      el.addEventListener("keydown", function (e) {
        if (!opBeheerpagina()) return;
        if (e.key === "Enter" && e.target.dataset && e.target.dataset.role === "expertcode") {
          ontgrendel(e.target.value.trim());
        }
      });

      el.addEventListener("click", function (e) {
        if (!opBeheerpagina()) return;
        var knop = e.target.closest ? e.target.closest("[data-role]") : null;
        if (!knop || knop.tagName !== "BUTTON") return;
        var rol = knop.dataset.role;

        if (rol === "ontgrendel") {
          var veldje = el.querySelector('[data-role="expertcode"]');
          ontgrendel(veldje ? veldje.value.trim() : "");
          return;
        }
        if (rol === "klas-erbij") {
          model.klas.push({ naam: "", code: "", opmerking: "", weg: false });
          herteken();
          // Meteen in het nieuwe veld staan: anders is het toevoegen van
          // twintig namen twintig keer klikken en scrollen.
          var velden = document.querySelectorAll('[data-role="klas-naam"]');
          if (velden.length) velden[velden.length - 1].focus();
          return;
        }
        if (rol === "klas-weg") {
          var l = model.klas[+knop.dataset.i];
          if (l) l.weg = !l.weg;
          herteken();
          return;
        }
        if (rol === "klas-plak-doen") {
          var vak = el.querySelector('[data-role="klas-plak"]');
          if (!vak) return;
          var bestaand = {};
          model.klas.forEach(function (x) { bestaand[sleutelNaam(x.naam)] = true; });
          vak.value.split(/\r?\n/).forEach(function (regel) {
            var naam = regel.trim();
            if (!naam || bestaand[sleutelNaam(naam)]) return;
            bestaand[sleutelNaam(naam)] = true;
            model.klas.push({ naam: naam, code: "", opmerking: "", weg: false });
          });
          vak.value = "";
          melding = null;
          herteken();
          return;
        }
        if (rol === "bewaren") { bewaar(); return; }
        if (rol === "opnieuw") { ontgrendel(expertcode); return; }
      });
    },
  };

  function sleutelNaam(n) {
    return String(n || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }
})();
