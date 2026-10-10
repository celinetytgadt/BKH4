// MAR 2e graad — selectie uit het Minimum Algemeen Rekeningenstelsel voor het 3e en 4e jaar.
// Zelfde opbouw als mar 3e graad.js. Nieuw t.o.v. 3e graad: 600000 Aankopen grondstoffen, 700000 Verkopen en dienstprestaties.

const MAR = [
 {
  "nr": 100000,
  "naam": "Geplaatst kapitaal",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen",
  "rubriek": "10",
  "rubriek_oms": "Kapitaal"
 },
 {
  "nr": 140000,
  "naam": "Overgedragen winst",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen",
  "rubriek": "14",
  "rubriek_oms": "Overgedragen resultaat"
 },
 {
  "nr": 141000,
  "naam": "Overgedragen verlies (-)",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen",
  "rubriek": "14",
  "rubriek_oms": "Overgedragen resultaat"
 },
 {
  "nr": 173000,
  "naam": "Schulden aan kredietinstellingen",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen",
  "rubriek": "17",
  "rubriek_oms": "Schulden op meer dan 1 jaar"
 },
 {
  "nr": 221000,
  "naam": "Gebouwen",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "22",
  "rubriek_oms": "Terreinen & gebouwen"
 },
 {
  "nr": 221009,
  "naam": "Afschrijvingen op gebouwen (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "22",
  "rubriek_oms": "Terreinen & gebouwen"
 },
 {
  "nr": 230000,
  "naam": "Installaties",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "23",
  "rubriek_oms": "Installaties, machines & uitrusting"
 },
 {
  "nr": 230009,
  "naam": "Afschrijvingen op installaties (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "23",
  "rubriek_oms": "Installaties, machines & uitrusting"
 },
 {
  "nr": 232000,
  "naam": "Uitrusting",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "23",
  "rubriek_oms": "Installaties, machines & uitrusting"
 },
 {
  "nr": 232009,
  "naam": "Afschrijvingen op uitrusting (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "23",
  "rubriek_oms": "Installaties, machines & uitrusting"
 },
 {
  "nr": 240000,
  "naam": "Meubilair",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 240009,
  "naam": "Afschrijvingen op meubilair (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 240200,
  "naam": "Computers",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 240209,
  "naam": "Afschrijvingen op computers (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 241000,
  "naam": "Rollend materieel",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 241009,
  "naam": "Afschrijvingen op rollend materieel (-)",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "24",
  "rubriek_oms": "Meubilair & rollend materieel"
 },
 {
  "nr": 340000,
  "naam": "Voorraad handelsgoederen",
  "apko": "A",
  "klasse": "3",
  "klasse_oms": "Voorraden",
  "rubriek": "34",
  "rubriek_oms": "Voorraden"
 },
 {
  "nr": 400000,
  "naam": "Handelsdebiteuren",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "40",
  "rubriek_oms": "Handelsvorderingen"
 },
 {
  "nr": 411000,
  "naam": "Terug te vorderen btw-saldo",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "41",
  "rubriek_oms": "Overige vorderingen"
 },
 {
  "nr": 411100,
  "naam": "Aftrekbare btw",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "41",
  "rubriek_oms": "Overige vorderingen"
 },
 {
  "nr": 411200,
  "naam": "Aftrekbare btw op uitgaande creditnota’s",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "41",
  "rubriek_oms": "Overige vorderingen"
 },
 {
  "nr": 418000,
  "naam": "Terug te vorderen verpakking",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "41",
  "rubriek_oms": "Overige vorderingen"
 },
 {
  "nr": 423000,
  "naam": "Binnen het jaar vervallende schulden aan kredietinstellingen",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "42",
  "rubriek_oms": "Schulden op maar dan 1 jaar die binnen het jaar vervallen"
 },
 {
  "nr": 440000,
  "naam": "Leveranciers",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "44",
  "rubriek_oms": "Handelsschulden"
 },
 {
  "nr": 451000,
  "naam": "Te betalen btw-saldo",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "45",
  "rubriek_oms": "Schulden mbt belastingen, ..."
 },
 {
  "nr": 451100,
  "naam": "Verschuldigde btw",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "45",
  "rubriek_oms": "Schulden mbt belastingen, ..."
 },
 {
  "nr": 451200,
  "naam": "Verschuldigde btw op inkomende creditnota’s",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "45",
  "rubriek_oms": "Schulden mbt belastingen, ..."
 },
 {
  "nr": 488000,
  "naam": "Terug te betalen verpakking",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "48",
  "rubriek_oms": "Diverse schulden"
 },
 {
  "nr": 550000,
  "naam": "Bankrekening",
  "apko": "A",
  "klasse": "5",
  "klasse_oms": "Liquide middelen",
  "rubriek": "55",
  "rubriek_oms": "Bank"
 },
 {
  "nr": 570000,
  "naam": "Kas",
  "apko": "A",
  "klasse": "5",
  "klasse_oms": "Liquide middelen",
  "rubriek": "57",
  "rubriek_oms": "Kas"
 },
 {
  "nr": 580000,
  "naam": "Interne overboekingen",
  "apko": "A",
  "klasse": "5",
  "klasse_oms": "Liquide middelen",
  "rubriek": "58",
  "rubriek_oms": "Interne overboekingen"
 },
 {
  "nr": 600000,
  "naam": "Aankopen grondstoffen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 604000,
  "naam": "Aankopen handelsgoederen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 604010,
  "naam": "Retours op aankopen (-)",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 604020,
  "naam": "Handelskorting op aankopen (-)",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 604030,
  "naam": "Aankoopkosten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 609400,
  "naam": "Voorraadwijzigingen handelsgoederen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "60",
  "rubriek_oms": "Handelsgoederen, grond- en hulpstoffen"
 },
 {
  "nr": 611000,
  "naam": "Huur en huurlasten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 611800,
  "naam": "Onderhoud en herstellingen rollend materieel",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 612000,
  "naam": "Kantoorbenodigdheden en drukwerk",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 612700,
  "naam": "Verbruik elektriciteit",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 613200,
  "naam": "Erelonen boekhouders",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 616200,
  "naam": "Telefoon, gsm",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 616300,
  "naam": "Internetkosten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 616520,
  "naam": "Publiciteitskosten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 630200,
  "naam": "Afschrijvingen op materiële vaste activa",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "63",
  "rubriek_oms": "Afschrijvingen"
 },
 {
  "nr": 630300,
  "naam": "Afschrijvingen op meubilair en rollend materieel",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "63",
  "rubriek_oms": "Afschrijvingen"
 },
 {
  "nr": 650000,
  "naam": "Rente, commissies en kosten verbonden aan schulden",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "65",
  "rubriek_oms": "Financiële kosten"
 },
 {
  "nr": 657000,
  "naam": "Betalingskortingen aan klanten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "65",
  "rubriek_oms": "Financiële kosten"
 },
 {
  "nr": 693000,
  "naam": "Over te dragen winst",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "69",
  "rubriek_oms": "Resultaatverwerking"
 },
 {
  "nr": 700000,
  "naam": "Verkopen en dienstprestaties",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "70",
  "rubriek_oms": "Omzet"
 },
 {
  "nr": 704000,
  "naam": "Verkopen handelsgoederen",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "70",
  "rubriek_oms": "Omzet"
 },
 {
  "nr": 704010,
  "naam": "Retours op verkopen (-)",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "70",
  "rubriek_oms": "Omzet"
 },
 {
  "nr": 704020,
  "naam": "Handelskorting op verkopen (-)",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "70",
  "rubriek_oms": "Omzet"
 },
 {
  "nr": 746000,
  "naam": "Doorgerekende kosten",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "74",
  "rubriek_oms": "Andere bedrijfsopbrengsten"
 },
 {
  "nr": 757000,
  "naam": "Betalingskortingen van leveranciers",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "75",
  "rubriek_oms": "Financiële opbrengsten"
 },
 {
  "nr": 793000,
  "naam": "Over te dragen verlies",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "79",
  "rubriek_oms": "Resultaatverwerking"
 }
];
