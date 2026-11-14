// mar.js — MAR 2e graad (btw vereenvoudigd), case MetWear 4e jaar.
// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py uit 'MAR 2e graad (btw vereenvoudigd).xlsx'.
// Btw: 411000 Aftrekbare btw, 451000 Verschuldigde btw, 451900 R/C btw-administratie.

const MAR = [
 {
  "nr": 100000,
  "naam": "Geplaatst kapitaal",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen & vreemd vermogen lange termijn",
  "rubriek": "10",
  "rubriek_oms": "Kapitaal"
 },
 {
  "nr": 101000,
  "naam": "Niet-opgevraagd kapitaal",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen & vreemd vermogen lange termijn",
  "rubriek": "10",
  "rubriek_oms": "Kapitaal"
 },
 {
  "nr": 140000,
  "naam": "Overgedragen winst",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen & vreemd vermogen lange termijn",
  "rubriek": "14",
  "rubriek_oms": "Overgedragen resultaat"
 },
 {
  "nr": 141000,
  "naam": "Overgedragen verlies (-)",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen & vreemd vermogen lange termijn",
  "rubriek": "14",
  "rubriek_oms": "Overgedragen resultaat"
 },
 {
  "nr": 173000,
  "naam": "Schulden aan kredietinstellingen",
  "apko": "P",
  "klasse": "1",
  "klasse_oms": "Eigen vermogen & vreemd vermogen lange termijn",
  "rubriek": "17",
  "rubriek_oms": "Schulden op meer dan 1 jaar"
 },
 {
  "nr": 220000,
  "naam": "Terreinen",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "22",
  "rubriek_oms": "Terreinen & gebouwen"
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
  "nr": 231000,
  "naam": "Machines",
  "apko": "A",
  "klasse": "2",
  "klasse_oms": "Vaste activa",
  "rubriek": "23",
  "rubriek_oms": "Installaties, machines & uitrusting"
 },
 {
  "nr": 231009,
  "naam": "Afschrijvingen op machines (-)",
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
  "nr": 300000,
  "naam": "Voorraad grondstoffen",
  "apko": "A",
  "klasse": "3",
  "klasse_oms": "Voorraden",
  "rubriek": "30",
  "rubriek_oms": "Voorraden"
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
  "nr": 407000,
  "naam": "Dubieuze debiteuren",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "40",
  "rubriek_oms": "Handelsvorderingen"
 },
 {
  "nr": 411000,
  "naam": "Aftrekbare btw",
  "apko": "A",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "41",
  "rubriek_oms": "Overige vorderingen"
 },
 {
  "nr": 412000,
  "naam": "Terug te vorderen Belgische winstbelastingen",
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
  "naam": "Binnen het jaar vervallende schulden aan kredietinst.",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "42",
  "rubriek_oms": "Schulden op meer dan 1 jaar die binnen het jaar vervallen"
 },
 {
  "nr": 424000,
  "naam": "Binnen het jaar vervallende overige leningen",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "42",
  "rubriek_oms": "Schulden op meer dan 1 jaar die binnen het jaar vervallen"
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
  "naam": "Verschuldigde btw",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "45",
  "rubriek_oms": "Schulden m.b.t. belastingen, bezoldigingen en sociale lasten"
 },
 {
  "nr": 451900,
  "naam": "R/C btw-administratie",
  "apko": "P",
  "klasse": "4",
  "klasse_oms": "Vorderingen en schulden op ten hoogste 1 jaar",
  "rubriek": "45",
  "rubriek_oms": "Schulden m.b.t. belastingen, bezoldigingen en sociale lasten"
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
  "nr": 611500,
  "naam": "Onderhoud en herstellingen machines",
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
  "nr": 612600,
  "naam": "Verbruik gas",
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
  "nr": 613000,
  "naam": "Website",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 614400,
  "naam": "Verzekering rollend materieel",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 616000,
  "naam": "Internet & telefonie",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "61",
  "rubriek_oms": "Diensten en diverse goederen"
 },
 {
  "nr": 620000,
  "naam": "Bezoldigingen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "62",
  "rubriek_oms": "Bezoldigingen, sociale lasten en pensioenen"
 },
 {
  "nr": 621000,
  "naam": "Werkgeversbijdrage RSZ",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "62",
  "rubriek_oms": "Bezoldigingen, sociale lasten en pensioenen"
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
  "nr": 640000,
  "naam": "Bedrijfsbelastingen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "64",
  "rubriek_oms": "Andere bedrijfskosten"
 },
 {
  "nr": 650000,
  "naam": "Rente en kosten verbonden aan schulden",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "65",
  "rubriek_oms": "Financiële kosten"
 },
 {
  "nr": 654000,
  "naam": "Wisselresultaten: verlies",
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
  "nr": 659000,
  "naam": "Diverse financiële kosten",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "65",
  "rubriek_oms": "Financiële kosten"
 },
 {
  "nr": 670000,
  "naam": "Verschuldigde belastingen en voorheffingen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "67",
  "rubriek_oms": "Belastingen op het resultaat"
 },
 {
  "nr": 670200,
  "naam": "Geraamde belastingen",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "67",
  "rubriek_oms": "Belastingen op het resultaat"
 },
 {
  "nr": 690000,
  "naam": "Overgedragen verlies van het vorige boekjaar",
  "apko": "K",
  "klasse": "6",
  "klasse_oms": "Kosten",
  "rubriek": "69",
  "rubriek_oms": "Resultaatverwerking"
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
  "nr": 694000,
  "naam": "Vergoeding van het kapitaal",
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
  "nr": 742000,
  "naam": "Meerwaarden op de realisatie van handelsvord.",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "74",
  "rubriek_oms": "Andere bedrijfsopbrengsten"
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
  "nr": 749000,
  "naam": "Diverse bedrijfsopbrengsten",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "74",
  "rubriek_oms": "Andere bedrijfsopbrengsten"
 },
 {
  "nr": 751000,
  "naam": "Opbrengsten uit vlottende activa",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "75",
  "rubriek_oms": "Financiële opbrengsten"
 },
 {
  "nr": 754000,
  "naam": "Wisselresultaten: winst",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "75",
  "rubriek_oms": "Financiële opbrengsten"
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
  "nr": 759000,
  "naam": "Diverse financiële opbrengsten",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "75",
  "rubriek_oms": "Financiële opbrengsten"
 },
 {
  "nr": 790000,
  "naam": "Overgedragen winst van het vorige boekjaar",
  "apko": "O",
  "klasse": "7",
  "klasse_oms": "Opbrengsten",
  "rubriek": "79",
  "rubriek_oms": "Resultaatverwerking"
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
