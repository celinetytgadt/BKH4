// data-jaren.js — de zes boekjaren van de case MetWear (4e jaar).
// GEMAAKT MET hulpmiddelen/metwear/maak-app-data.py. Niet met de hand aanpassen:
// pas de Excel van de case aan en draai het script opnieuw.
//
// Per jaar: de categorieën van het menu, de opdrachten (documenten) en de
// boekingen die al klaarstaan (de beginbalans, en in 20X1 de hele cursus).
// De sleutel van taak en consolidaties staat hier NIET: die zit enkel in het
// script van de Sheet (apps-script/SleutelCase.gs).

var JAREN = {
 "20X1": {
  "jaar": "20X1",
  "soort": "cursus",
  "titel": "Cursus",
  "kort": "X1",
  "categorieVolgorde": [
   "Aankopen",
   "Verkopen",
   "Btw-verrekening",
   "Financiële verrichtingen",
   "Eindejaar"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X1 (BB)",
    "vasteBoeking": true,
    "doc": "20X1/00_beginbalans"
   },
   {
    "ref": "AK01",
    "categorie": "Aankopen",
    "titel": "Aankoop AK01",
    "vasteBoeking": true,
    "doc": "20X1/AK01",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK02",
    "categorie": "Aankopen",
    "titel": "Aankoop AK02",
    "vasteBoeking": true,
    "doc": "20X1/AK02",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK03",
    "categorie": "Aankopen",
    "titel": "Aankoop AK03",
    "vasteBoeking": true,
    "doc": "20X1/AK03",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK04",
    "categorie": "Aankopen",
    "titel": "Aankoop AK04",
    "vasteBoeking": true,
    "doc": "20X1/AK04",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK05",
    "categorie": "Aankopen",
    "titel": "Aankoop AK05",
    "vasteBoeking": true,
    "doc": "20X1/AK05",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK06",
    "categorie": "Aankopen",
    "titel": "Aankoop AK06",
    "vasteBoeking": true,
    "doc": "20X1/AK06",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK07",
    "categorie": "Aankopen",
    "titel": "Aankoop AK07",
    "vasteBoeking": true,
    "doc": "20X1/AK07",
    "relatie": "Connecto nv"
   },
   {
    "ref": "AK08",
    "categorie": "Aankopen",
    "titel": "Aankoop AK08",
    "vasteBoeking": true,
    "doc": "20X1/AK08",
    "relatie": "Stroomkracht nv"
   },
   {
    "ref": "AK09",
    "categorie": "Aankopen",
    "titel": "Aankoop AK09",
    "vasteBoeking": true,
    "doc": "20X1/AK09",
    "relatie": "Lichtpunt bv"
   },
   {
    "ref": "AK10",
    "categorie": "Aankopen",
    "titel": "Aankoop AK10",
    "vasteBoeking": true,
    "doc": "20X1/AK10",
    "relatie": "KassaTech bv"
   },
   {
    "ref": "AK11",
    "categorie": "Aankopen",
    "titel": "Aankoop AK11",
    "vasteBoeking": true,
    "doc": "20X1/AK11",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK12",
    "categorie": "Aankopen",
    "titel": "Aankoop AK12",
    "vasteBoeking": true,
    "doc": "20X1/AK12",
    "relatie": "Connecto nv"
   },
   {
    "ref": "VK01",
    "categorie": "Verkopen",
    "titel": "Verkoop VK01",
    "vasteBoeking": true,
    "doc": "20X1/VK01",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "VK02",
    "categorie": "Verkopen",
    "titel": "Verkoop VK02",
    "vasteBoeking": true,
    "doc": "20X1/VK02",
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "VK03",
    "categorie": "Verkopen",
    "titel": "Verkoop VK03",
    "vasteBoeking": true,
    "doc": "20X1/VK03",
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "VK04",
    "categorie": "Verkopen",
    "titel": "Verkoop VK04",
    "vasteBoeking": true,
    "doc": "20X1/VK04",
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "VK05",
    "categorie": "Verkopen",
    "titel": "Verkoop VK05",
    "vasteBoeking": true,
    "doc": "20X1/VK05",
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "VK06",
    "categorie": "Verkopen",
    "titel": "Verkoop VK06",
    "vasteBoeking": true,
    "doc": "20X1/VK06",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "VK07",
    "categorie": "Verkopen",
    "titel": "Verkoop VK07",
    "vasteBoeking": true,
    "doc": "20X1/VK07",
    "relatie": "Danscentrum Kowalski vzw"
   },
   {
    "ref": "VK08",
    "categorie": "Verkopen",
    "titel": "Verkoop VK08",
    "vasteBoeking": true,
    "doc": "20X1/VK08",
    "relatie": "Scouts Sint-Jan Wilsele"
   },
   {
    "ref": "ONTV01",
    "categorie": "Verkopen",
    "titel": "Dagontvangsten ONTV01",
    "vasteBoeking": true,
    "doc": "20X1/ONTV01",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "ONTV02",
    "categorie": "Verkopen",
    "titel": "Dagontvangsten ONTV02",
    "vasteBoeking": true,
    "doc": "20X1/ONTV02",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "VK09",
    "categorie": "Verkopen",
    "titel": "Verkoop VK09",
    "vasteBoeking": true,
    "doc": "20X1/VK09",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "VK10",
    "categorie": "Verkopen",
    "titel": "Verkoop VK10",
    "vasteBoeking": true,
    "doc": "20X1/VK10",
    "relatie": "Danscentrum Kowalski vzw"
   },
   {
    "ref": "BTW01",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW01",
    "vasteBoeking": true,
    "doc": "20X1/BTW01",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "BTW02",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW02",
    "vasteBoeking": true,
    "doc": "20X1/BTW02",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "FIN01",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN01",
    "vasteBoeking": true,
    "doc": "20X1/FIN01",
    "betaalstuk": true,
    "relatie": "GreenThread bv"
   },
   {
    "ref": "FIN02",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN02",
    "vasteBoeking": true,
    "doc": "20X1/FIN02",
    "betaalstuk": true,
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "FIN03",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN03",
    "vasteBoeking": true,
    "doc": "20X1/FIN03",
    "betaalstuk": true,
    "relatie": "Connecto nv"
   },
   {
    "ref": "FIN04",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN04",
    "vasteBoeking": true,
    "doc": "20X1/FIN04",
    "betaalstuk": true,
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "FIN05",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN05",
    "vasteBoeking": true,
    "doc": "20X1/FIN05",
    "betaalstuk": true,
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "FIN06",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN06",
    "vasteBoeking": true,
    "doc": "20X1/FIN06",
    "betaalstuk": true,
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "FIN07",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN07",
    "vasteBoeking": true,
    "doc": "20X1/FIN07",
    "betaalstuk": true,
    "relatie": "Danscentrum Kowalski vzw"
   },
   {
    "ref": "FIN08",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN08",
    "vasteBoeking": true,
    "doc": "20X1/FIN08",
    "betaalstuk": true,
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "KAS01",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS01",
    "vasteBoeking": true,
    "doc": "20X1/KAS01",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "KAS02",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS02",
    "vasteBoeking": true,
    "doc": "20X1/KAS02",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN09",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN09",
    "vasteBoeking": true,
    "doc": "20X1/FIN09",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN10",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN10",
    "vasteBoeking": true,
    "doc": "20X1/FIN10",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN11",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN11",
    "vasteBoeking": true,
    "doc": "20X1/FIN11",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS03",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS03",
    "vasteBoeking": true,
    "doc": "20X1/KAS03",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN12",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN12",
    "vasteBoeking": true,
    "doc": "20X1/FIN12",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS04",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS04",
    "vasteBoeking": true,
    "doc": "20X1/KAS04",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN13",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN13",
    "vasteBoeking": true,
    "doc": "20X1/FIN13",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN14",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN14",
    "vasteBoeking": true,
    "doc": "20X1/FIN14",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN15",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN15",
    "vasteBoeking": true,
    "doc": "20X1/FIN15",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "FIN16",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN16",
    "vasteBoeking": true,
    "doc": "20X1/FIN16",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "EJ01",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ01",
    "vasteBoeking": true,
    "doc": "20X1/EJ01",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ02",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ02",
    "vasteBoeking": true,
    "doc": "20X1/EJ02",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ03",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ03",
    "vasteBoeking": true,
    "doc": "20X1/EJ03",
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "4.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "800",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "12.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "18.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "400",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "8.600",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "AK01": [
    {
     "bedrag": "4.840",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "GreenThread bv"
    },
    {
     "bedrag": "840",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.000",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK02": [
    {
     "bedrag": "1.694",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "294",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.400",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK03": [
    {
     "bedrag": "11.979",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "2.079",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "11.000",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.100",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "-",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604020",
     "dc": "C",
     "relatie": ""
    }
   ],
   "AK04": [
    {
     "bedrag": "4.949",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "859",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.300",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "210",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "-",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604020",
     "dc": "C",
     "relatie": ""
    }
   ],
   "AK05": [
    {
     "bedrag": "2.541",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "441",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "2.000",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "100",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604030",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK06": [
    {
     "bedrag": "339",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "59",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "200",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "80",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604030",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK07": [
    {
     "bedrag": "121",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Connecto nv"
    },
    {
     "bedrag": "21",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "100",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "61",
     "rekening": "616000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK08": [
    {
     "bedrag": "315",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "55",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "260",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "61",
     "rekening": "612700",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK09": [
    {
     "bedrag": "6.050",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "1.050",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "5.000",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK10": [
    {
     "bedrag": "2.178",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "378",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.800",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    }
   ],
   "AK11": [
    {
     "bedrag": "121",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "D",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "21",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "100",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "-",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "604010",
     "dc": "C",
     "relatie": ""
    }
   ],
   "AK12": [
    {
     "bedrag": "12",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "D",
     "relatie": "Connecto nv"
    },
    {
     "bedrag": "2",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "10",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "-",
     "klasse": "6",
     "rubriek": "61",
     "rekening": "616000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK01": [
    {
     "bedrag": "3.812",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "662",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.150",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK02": [
    {
     "bedrag": "968",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "168",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "800",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK03": [
    {
     "bedrag": "2.759",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "479",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.400",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "120",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "-",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704020",
     "dc": "D",
     "relatie": ""
    }
   ],
   "VK04": [
    {
     "bedrag": "4.029",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "699",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.500",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "170",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "-",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704020",
     "dc": "D",
     "relatie": ""
    }
   ],
   "VK05": [
    {
     "bedrag": "6.582",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Yogastudio Lotus bv"
    },
    {
     "bedrag": "1.142",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "5.400",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "40",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "74",
     "rekening": "746000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK06": [
    {
     "bedrag": "1.972",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "342",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.600",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "30",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "74",
     "rekening": "746000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK07": [
    {
     "bedrag": "1.290",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Danscentrum Kowalski vzw"
    },
    {
     "bedrag": "210",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.000",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "80",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK08": [
    {
     "bedrag": "1.270",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "210",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.000",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "60",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "ONTV01": [
    {
     "bedrag": "14.762",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Dagontvangsten (particulieren)"
    },
    {
     "bedrag": "2.562",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "12.200",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "ONTV02": [
    {
     "bedrag": "5.566",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Dagontvangsten (particulieren)"
    },
    {
     "bedrag": "966",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "4.600",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "+",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "VK09": [
    {
     "bedrag": "762",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "132",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "630",
     "redenering": "",
     "apko": "O",
     "stijgtDaalt": "-",
     "klasse": "7",
     "rubriek": "70",
     "rekening": "704010",
     "dc": "D",
     "relatie": ""
    }
   ],
   "VK10": [
    {
     "bedrag": "80",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Danscentrum Kowalski vzw"
    },
    {
     "bedrag": "80",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "BTW01": [
    {
     "bedrag": "4.923",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.429",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "494",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451900",
     "dc": "C",
     "relatie": ""
    }
   ],
   "BTW02": [
    {
     "bedrag": "2.385",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.624",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "41",
     "rekening": "411000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "761",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451900",
     "dc": "C",
     "relatie": ""
    }
   ],
   "FIN01": [
    {
     "bedrag": "4.840",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "4.840",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "D",
     "relatie": "GreenThread bv"
    }
   ],
   "FIN02": [
    {
     "bedrag": "1.694",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.694",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "D",
     "relatie": "EthiKnit nv"
    }
   ],
   "FIN03": [
    {
     "bedrag": "109",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "109",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "D",
     "relatie": "Connecto nv"
    }
   ],
   "FIN04": [
    {
     "bedrag": "121",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "121",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    }
   ],
   "FIN05": [
    {
     "bedrag": "3.812",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "3.812",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Fietsclub De Trappers vzw"
    }
   ],
   "FIN06": [
    {
     "bedrag": "6.582",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "6.582",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Yogastudio Lotus bv"
    }
   ],
   "FIN07": [
    {
     "bedrag": "1.210",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.210",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Danscentrum Kowalski vzw"
    }
   ],
   "FIN08": [
    {
     "bedrag": "762",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "762",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    }
   ],
   "KAS01": [
    {
     "bedrag": "3.690",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "3.690",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Dagontvangsten (particulieren)"
    }
   ],
   "KAS02": [
    {
     "bedrag": "1.391",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.391",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Dagontvangsten (particulieren)"
    }
   ],
   "FIN09": [
    {
     "bedrag": "11.072",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "11.072",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Dagontvangsten (particulieren)"
    }
   ],
   "FIN10": [
    {
     "bedrag": "4.175",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.175",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "C",
     "relatie": "Dagontvangsten (particulieren)"
    }
   ],
   "FIN11": [
    {
     "bedrag": "250",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "250",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "58",
     "rekening": "580000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "KAS03": [
    {
     "bedrag": "250",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "250",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "58",
     "rekening": "580000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "FIN12": [
    {
     "bedrag": "5.430",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "5.430",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "58",
     "rekening": "580000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "KAS04": [
    {
     "bedrag": "5.430",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "5.430",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "58",
     "rekening": "580000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "FIN13": [
    {
     "bedrag": "20.000",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "20.000",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "FIN14": [
    {
     "bedrag": "2.400",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.000",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "400",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "65",
     "rekening": "650000",
     "dc": "D",
     "relatie": ""
    }
   ],
   "FIN15": [
    {
     "bedrag": "494",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "494",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451900",
     "dc": "D",
     "relatie": ""
    }
   ],
   "FIN16": [
    {
     "bedrag": "761",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "761",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "4",
     "rubriek": "45",
     "rekening": "451900",
     "dc": "D",
     "relatie": ""
    }
   ],
   "EJ01": [
    {
     "bedrag": "500",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "63",
     "rekening": "630200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.400",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "63",
     "rekening": "630300",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "500",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "800",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "600",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    }
   ],
   "EJ02": [
    {
     "bedrag": "1.800",
     "redenering": "",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.800",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "-",
     "klasse": "6",
     "rubriek": "60",
     "rekening": "609400",
     "dc": "C",
     "relatie": ""
    }
   ],
   "EJ03": [
    {
     "bedrag": "4.000",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "-",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.000",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    }
   ],
   "RESULTAAT": [
    {
     "bedrag": "12.280",
     "redenering": "",
     "apko": "K",
     "stijgtDaalt": "+",
     "klasse": "6",
     "rubriek": "69",
     "rekening": "693000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "12.280",
     "redenering": "",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    }
   ]
  },
  "controleInfo": {
   "aankoopfacturen": [
    "AK01",
    "AK02",
    "AK03",
    "AK04",
    "AK05",
    "AK06",
    "AK07",
    "AK08",
    "AK09",
    "AK10"
   ],
   "aankoopCN": [
    "AK11",
    "AK12"
   ],
   "verkoopfacturen": [
    "VK01",
    "VK02",
    "VK03",
    "VK04",
    "VK05",
    "VK06",
    "VK07",
    "VK08"
   ],
   "verkoopCN": [
    "VK09",
    "VK10"
   ],
   "dagontvangsten": [
    {
     "ontv": "ONTV01",
     "kas": [
      "KAS01"
     ],
     "bank": [
      "FIN09"
     ]
    },
    {
     "ontv": "ONTV02",
     "kas": [
      "KAS02"
     ],
     "bank": [
      "FIN10"
     ]
    }
   ],
   "kortingen": [
    "AK03",
    "AK04",
    "VK03",
    "VK04"
   ],
   "extraKosten": [
    "AK05",
    "AK06",
    "VK05",
    "VK06"
   ],
   "verpakking": [
    "VK07",
    "VK08",
    "VK10"
   ],
   "vasteActiva": [
    "AK09",
    "AK10"
   ],
   "diensten": [
    "AK07",
    "AK08",
    "AK12"
   ],
   "btw": [
    {
     "doc": "BTW01",
     "betaling": [
      "FIN15"
     ]
    },
    {
     "doc": "BTW02",
     "betaling": [
      "FIN16"
     ]
    }
   ],
   "interne": [
    "FIN11",
    "FIN12",
    "KAS03",
    "KAS04"
   ],
   "leningOpname": [
    "FIN13"
   ],
   "afbetalingen": [
    "FIN14"
   ],
   "laatsteBank": "FIN12",
   "laatsteKas": "KAS04",
   "eindejaar": {
    "afschrijvingen": "EJ01",
    "voorraad": "EJ02",
    "lening": "EJ03"
   }
  }
 },
 "20X2": {
  "jaar": "20X2",
  "soort": "taak",
  "titel": "Taak",
  "kort": "X2",
  "categorieVolgorde": [
   "Aankopen taak 1: eenvoudige facturen",
   "Aankopen taak 2: handelskorting & transportkosten",
   "Aankopen taak 3: diensten, diverse goederen & vaste activa",
   "Aankopen taak 4: creditnota's",
   "Verkopen taak 1: eenvoudige facturen",
   "Verkopen taak 2: handelskorting & extra kosten",
   "Verkopen taak 3: creditnota's",
   "Verkopen taak 4: terugstuurbare verpakking",
   "Btw-verrekening",
   "Financiële verrichtingen",
   "Eindejaar"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X2 (BB)",
    "vasteBoeking": true,
    "doc": "20X2/00_beginbalans"
   },
   {
    "ref": "AK01",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK01",
    "doc": "20X2/AK01",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK02",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK02",
    "doc": "20X2/AK02",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK03",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK03",
    "doc": "20X2/AK03",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK04",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK04",
    "doc": "20X2/AK04",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK05",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK05",
    "doc": "20X2/AK05",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK06",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK06",
    "doc": "20X2/AK06",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK07",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK07",
    "doc": "20X2/AK07",
    "relatie": "Connecto nv"
   },
   {
    "ref": "AK08",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK08",
    "doc": "20X2/AK08",
    "relatie": "WebNest bv"
   },
   {
    "ref": "AK09",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK09",
    "doc": "20X2/AK09",
    "relatie": "Winkelinrichting Rek & Co bv"
   },
   {
    "ref": "AK10",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK10",
    "doc": "20X2/AK10",
    "relatie": "Digistore bv"
   },
   {
    "ref": "AK11",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK11",
    "doc": "20X2/AK11",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK12",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK12",
    "doc": "20X2/AK12",
    "relatie": "Connecto nv"
   },
   {
    "ref": "VK01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK01",
    "doc": "20X2/VK01",
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "VK02",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK02",
    "doc": "20X2/VK02",
    "relatie": "Kinderopvang De Kleine Wereld vzw"
   },
   {
    "ref": "ONTV01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV01",
    "doc": "20X2/ONTV01",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "ONTV02",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV02",
    "doc": "20X2/ONTV02",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "VK03",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK03",
    "doc": "20X2/VK03",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "VK04",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK04",
    "doc": "20X2/VK04",
    "relatie": "Hotel De Linde bv"
   },
   {
    "ref": "VK05",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK05",
    "doc": "20X2/VK05",
    "relatie": "Scouts Sint-Jan Wilsele"
   },
   {
    "ref": "VK06",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK06",
    "doc": "20X2/VK06",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "VK07",
    "categorie": "Verkopen taak 3: creditnota's",
    "titel": "Verkoop VK07",
    "doc": "20X2/VK07",
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "VK08",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK08",
    "doc": "20X2/VK08",
    "relatie": "Basisschool De Regenboog"
   },
   {
    "ref": "VK09",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK09",
    "doc": "20X2/VK09",
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "VK10",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK10",
    "doc": "20X2/VK10",
    "relatie": "Basisschool De Regenboog"
   },
   {
    "ref": "BTW01",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW01",
    "doc": "20X2/BTW01",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "BTW02",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW02",
    "doc": "20X2/BTW02",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "FIN01",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN01",
    "doc": "20X2/FIN01",
    "betaalstuk": true,
    "relatie": "Connecto nv"
   },
   {
    "ref": "FIN02",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN02",
    "doc": "20X2/FIN02",
    "betaalstuk": true,
    "relatie": "WebNest bv"
   },
   {
    "ref": "FIN03",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN03",
    "doc": "20X2/FIN03",
    "betaalstuk": true,
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "FIN04",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN04",
    "doc": "20X2/FIN04",
    "betaalstuk": true,
    "relatie": "Connecto nv"
   },
   {
    "ref": "FIN05",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN05",
    "doc": "20X2/FIN05",
    "betaalstuk": true,
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "FIN06",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN06",
    "doc": "20X2/FIN06",
    "betaalstuk": true,
    "relatie": "Basisschool De Regenboog"
   },
   {
    "ref": "FIN07",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN07",
    "doc": "20X2/FIN07",
    "betaalstuk": true,
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "FIN08",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN08",
    "doc": "20X2/FIN08",
    "betaalstuk": true,
    "relatie": "Basisschool De Regenboog"
   },
   {
    "ref": "KAS01",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS01",
    "doc": "20X2/KAS01",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "KAS02",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS02",
    "doc": "20X2/KAS02",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN09",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN09",
    "doc": "20X2/FIN09",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN10",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN10",
    "doc": "20X2/FIN10",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN11",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN11",
    "doc": "20X2/FIN11",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS03",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS03",
    "doc": "20X2/KAS03",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN12",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN12",
    "doc": "20X2/FIN12",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS04",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS04",
    "doc": "20X2/KAS04",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN13",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN13",
    "doc": "20X2/FIN13",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN14",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN14",
    "doc": "20X2/FIN14",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN15",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN15",
    "doc": "20X2/FIN15",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN16",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN16",
    "doc": "20X2/FIN16",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN17",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN17",
    "doc": "20X2/FIN17",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "FIN18",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN18",
    "doc": "20X2/FIN18",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "EJ01",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ01",
    "doc": "20X2/EJ01",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ02",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ02",
    "doc": "20X2/EJ02",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ03",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ03",
    "doc": "20X2/EJ03",
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     },
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "20.880",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "14.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "5.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "500",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "4.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.600",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.800",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "600",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "13.800",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.972",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "2.759",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "968",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "4.029",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "1.270",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "4.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "339",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "2.178",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "6.050",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "315",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "16.928",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "60",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "59.092",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "301",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    }
   ]
  },
  "controleInfo": {
   "aankoopfacturen": [
    "AK01",
    "AK02",
    "AK03",
    "AK04",
    "AK05",
    "AK06",
    "AK07",
    "AK08",
    "AK09",
    "AK10"
   ],
   "aankoopCN": [
    "AK11",
    "AK12"
   ],
   "verkoopfacturen": [
    "VK01",
    "VK02",
    "VK03",
    "VK04",
    "VK05",
    "VK06",
    "VK08",
    "VK09"
   ],
   "verkoopCN": [
    "VK07",
    "VK10"
   ],
   "dagontvangsten": [
    {
     "ontv": "ONTV01",
     "kas": [
      "KAS01"
     ],
     "bank": [
      "FIN09"
     ]
    },
    {
     "ontv": "ONTV02",
     "kas": [
      "KAS02"
     ],
     "bank": [
      "FIN10"
     ]
    }
   ],
   "kortingen": [
    "AK03",
    "AK04",
    "VK03",
    "VK04"
   ],
   "extraKosten": [
    "AK05",
    "AK06",
    "VK05",
    "VK06"
   ],
   "verpakking": [
    "VK08",
    "VK09",
    "VK10"
   ],
   "vasteActiva": [
    "AK09",
    "AK10"
   ],
   "diensten": [
    "AK07",
    "AK08",
    "AK12"
   ],
   "btw": [
    {
     "doc": "BTW01",
     "betaling": [
      "FIN17"
     ]
    },
    {
     "doc": "BTW02",
     "betaling": [
      "FIN18"
     ]
    }
   ],
   "interne": [
    "FIN11",
    "FIN12",
    "KAS03",
    "KAS04"
   ],
   "leningOpname": [
    "FIN13"
   ],
   "afbetalingen": [
    "FIN14",
    "FIN15",
    "FIN16"
   ],
   "laatsteBank": "FIN12",
   "laatsteKas": "KAS04",
   "eindejaar": {
    "afschrijvingen": "EJ01",
    "voorraad": "EJ02",
    "lening": "EJ03"
   },
   "tRekeningen": {
    "Aankopen taak 1: eenvoudige facturen": {
     "411000": {
      "D": [
       [
        "AK01",
        231
       ],
       [
        "AK02",
        525
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK01",
        1331
       ],
       [
        "AK02",
        3025
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK01",
        1100
       ],
       [
        "AK02",
        2500
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 2: handelskorting & transportkosten": {
     "411000": {
      "D": [
       [
        "AK03",
        939
       ],
       [
        "AK04",
        359
       ],
       [
        "AK05",
        382
       ],
       [
        "AK06",
        202
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK03",
        5409
       ],
       [
        "AK04",
        2069
       ],
       [
        "AK05",
        2202
       ],
       [
        "AK06",
        1162
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK03",
        4700
       ],
       [
        "AK04",
        1800
       ],
       [
        "AK05",
        1700
       ],
       [
        "AK06",
        900
       ]
      ],
      "C": []
     },
     "604020": {
      "D": [],
      "C": [
       [
        "AK03",
        230
       ],
       [
        "AK04",
        90
       ]
      ]
     },
     "604030": {
      "D": [
       [
        "AK05",
        120
       ],
       [
        "AK06",
        60
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 3: diensten, diverse goederen & vaste activa": {
     "240000": {
      "D": [
       [
        "AK09",
        2500
       ]
      ],
      "C": []
     },
     "240200": {
      "D": [
       [
        "AK10",
        1200
       ]
      ],
      "C": []
     },
     "411000": {
      "D": [
       [
        "AK07",
        21
       ],
       [
        "AK08",
        8
       ],
       [
        "AK09",
        525
       ],
       [
        "AK10",
        252
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK07",
        121
       ],
       [
        "AK08",
        48
       ],
       [
        "AK09",
        3025
       ],
       [
        "AK10",
        1452
       ]
      ]
     },
     "613000": {
      "D": [
       [
        "AK08",
        40
       ]
      ],
      "C": []
     },
     "616000": {
      "D": [
       [
        "AK07",
        100
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 4: creditnota's": {
     "411000": {
      "D": [],
      "C": [
       [
        "AK11",
        13
       ],
       [
        "AK12",
        2
       ]
      ]
     },
     "440000": {
      "D": [
       [
        "AK11",
        73
       ],
       [
        "AK12",
        12
       ]
      ],
      "C": []
     },
     "604010": {
      "D": [],
      "C": [
       [
        "AK11",
        60
       ]
      ]
     },
     "616000": {
      "D": [],
      "C": [
       [
        "AK12",
        10
       ]
      ]
     }
    },
    "Verkopen taak 1: eenvoudige facturen": {
     "400000": {
      "D": [
       [
        "VK01",
        4840
       ],
       [
        "VK02",
        7018
       ],
       [
        "ONTV01",
        5324
       ],
       [
        "ONTV02",
        2541
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK01",
        840
       ],
       [
        "VK02",
        1218
       ],
       [
        "ONTV01",
        924
       ],
       [
        "ONTV02",
        441
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK01",
        4000
       ],
       [
        "VK02",
        5800
       ],
       [
        "ONTV01",
        4400
       ],
       [
        "ONTV02",
        2100
       ]
      ]
     }
    },
    "Verkopen taak 2: handelskorting & extra kosten": {
     "400000": {
      "D": [
       [
        "VK03",
        3267
       ],
       [
        "VK04",
        2614
       ],
       [
        "VK05",
        1016
       ],
       [
        "VK06",
        3933
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK03",
        567
       ],
       [
        "VK04",
        454
       ],
       [
        "VK05",
        176
       ],
       [
        "VK06",
        683
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK03",
        3000
       ],
       [
        "VK04",
        2400
       ],
       [
        "VK05",
        800
       ],
       [
        "VK06",
        3200
       ]
      ]
     },
     "704020": {
      "D": [
       [
        "VK03",
        300
       ],
       [
        "VK04",
        240
       ]
      ],
      "C": []
     },
     "746000": {
      "D": [],
      "C": [
       [
        "VK05",
        40
       ],
       [
        "VK06",
        50
       ]
      ]
     }
    },
    "Verkopen taak 3: creditnota's": {
     "400000": {
      "D": [],
      "C": [
       [
        "VK07",
        290
       ]
      ]
     },
     "451000": {
      "D": [
       [
        "VK07",
        50
       ]
      ],
      "C": []
     },
     "704010": {
      "D": [
       [
        "VK07",
        240
       ]
      ],
      "C": []
     }
    },
    "Verkopen taak 4: terugstuurbare verpakking": {
     "400000": {
      "D": [
       [
        "VK08",
        1532
       ],
       [
        "VK09",
        403
       ]
      ],
      "C": [
       [
        "VK10",
        80
       ]
      ]
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK08",
        252
       ],
       [
        "VK09",
        63
       ]
      ]
     },
     "488000": {
      "D": [
       [
        "VK10",
        80
       ]
      ],
      "C": [
       [
        "VK08",
        80
       ],
       [
        "VK09",
        40
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK08",
        1200
       ],
       [
        "VK09",
        300
       ]
      ]
     }
    }
   }
  }
 },
 "20X3": {
  "jaar": "20X3",
  "soort": "conso",
  "titel": "Consolidatie",
  "kort": "X3",
  "categorieVolgorde": [
   "Alle documenten"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X3 (BB)",
    "vasteBoeking": true,
    "doc": "20X3/00_beginbalans"
   },
   {
    "ref": "DOC_01",
    "categorie": "Alle documenten",
    "titel": "Document DOC_01",
    "doc": "20X3/DOC_01",
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "DOC_02",
    "categorie": "Alle documenten",
    "titel": "Document DOC_02",
    "doc": "20X3/DOC_02",
    "relatie": "Hotel De Linde bv"
   },
   {
    "ref": "DOC_03",
    "categorie": "Alle documenten",
    "titel": "Document DOC_03",
    "doc": "20X3/DOC_03",
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "DOC_04",
    "categorie": "Alle documenten",
    "titel": "Document DOC_04",
    "doc": "20X3/DOC_04",
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "DOC_05",
    "categorie": "Alle documenten",
    "titel": "Document DOC_05",
    "doc": "20X3/DOC_05",
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "DOC_06",
    "categorie": "Alle documenten",
    "titel": "Document DOC_06",
    "doc": "20X3/DOC_06",
    "relatie": "Pixelpunt bv"
   },
   {
    "ref": "DOC_07",
    "categorie": "Alle documenten",
    "titel": "Document DOC_07",
    "doc": "20X3/DOC_07",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "DOC_08",
    "categorie": "Alle documenten",
    "titel": "Document DOC_08",
    "doc": "20X3/DOC_08",
    "relatie": "Pixelpunt bv"
   },
   {
    "ref": "DOC_09",
    "categorie": "Alle documenten",
    "titel": "Document DOC_09",
    "doc": "20X3/DOC_09",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "DOC_10",
    "categorie": "Alle documenten",
    "titel": "Document DOC_10",
    "doc": "20X3/DOC_10",
    "betaalstuk": true,
    "relatie": "Hotel De Linde bv"
   },
   {
    "ref": "DOC_11",
    "categorie": "Alle documenten",
    "titel": "Document DOC_11",
    "doc": "20X3/DOC_11",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_12",
    "categorie": "Alle documenten",
    "titel": "Document DOC_12",
    "doc": "20X3/DOC_12",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "DOC_13",
    "categorie": "Alle documenten",
    "titel": "Document DOC_13",
    "doc": "20X3/DOC_13",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_14",
    "categorie": "Alle documenten",
    "titel": "Document DOC_14",
    "doc": "20X3/DOC_14",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "DOC_15",
    "categorie": "Alle documenten",
    "titel": "Document DOC_15",
    "doc": "20X3/DOC_15",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "DOC_16",
    "categorie": "Alle documenten",
    "titel": "Document DOC_16",
    "doc": "20X3/DOC_16",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_17",
    "categorie": "Alle documenten",
    "titel": "Document DOC_17",
    "doc": "20X3/DOC_17",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "DOC_18",
    "categorie": "Alle documenten",
    "titel": "Document DOC_18",
    "doc": "20X3/DOC_18",
    "relatie": "Digistore bv"
   },
   {
    "ref": "DOC_19",
    "categorie": "Alle documenten",
    "titel": "Document DOC_19",
    "doc": "20X3/DOC_19",
    "betaalstuk": true,
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "DOC_21",
    "categorie": "Alle documenten",
    "titel": "Document DOC_21",
    "doc": "20X3/DOC_21",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_22",
    "categorie": "Alle documenten",
    "titel": "Document DOC_22",
    "doc": "20X3/DOC_22",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "DOC_23",
    "categorie": "Alle documenten",
    "titel": "Document DOC_23",
    "doc": "20X3/DOC_23",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_24",
    "categorie": "Alle documenten",
    "titel": "Document DOC_24",
    "doc": "20X3/DOC_24",
    "betaalstuk": true,
    "relatie": "Pixelpunt bv"
   },
   {
    "ref": "DOC_25",
    "categorie": "Alle documenten",
    "titel": "Document DOC_25",
    "doc": "20X3/DOC_25",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "DOC_26",
    "categorie": "Alle documenten",
    "titel": "Document DOC_26",
    "doc": "20X3/DOC_26",
    "betaalstuk": true,
    "relatie": "Yogastudio Lotus bv"
   },
   {
    "ref": "DOC_27",
    "categorie": "Alle documenten",
    "titel": "Document DOC_27",
    "doc": "20X3/DOC_27",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_28",
    "categorie": "Alle documenten",
    "titel": "Document DOC_28",
    "doc": "20X3/DOC_28",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_29",
    "categorie": "Alle documenten",
    "titel": "Document DOC_29",
    "doc": "20X3/DOC_29",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_30",
    "categorie": "Alle documenten",
    "titel": "Document DOC_30",
    "doc": "20X3/DOC_30",
    "betaalstuk": true,
    "relatie": "Pixelpunt bv"
   },
   {
    "ref": "DOC_31",
    "categorie": "Alle documenten",
    "titel": "Document DOC_31",
    "doc": "20X3/DOC_31",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_32",
    "categorie": "Alle documenten",
    "titel": "Document DOC_32",
    "doc": "20X3/DOC_32",
    "betaalstuk": true,
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "DOC_33",
    "categorie": "Alle documenten",
    "titel": "Document DOC_33",
    "doc": "20X3/DOC_33",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_34",
    "categorie": "Alle documenten",
    "titel": "Document DOC_34",
    "doc": "20X3/DOC_34",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "DOC_35",
    "categorie": "Alle documenten",
    "titel": "Document DOC_35",
    "doc": "20X3/DOC_35",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_36",
    "categorie": "Alle documenten",
    "titel": "Document DOC_36",
    "doc": "20X3/DOC_36",
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_37",
    "categorie": "Alle documenten",
    "titel": "Document DOC_37",
    "doc": "20X3/DOC_37",
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_38",
    "categorie": "Alle documenten",
    "titel": "Document DOC_38",
    "doc": "20X3/DOC_38",
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     },
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     },
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "31.165",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "16.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "5.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "6.500",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "2.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.600",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "13.925",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.972",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "3.162",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "3.933",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "2.614",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Hotel De Linde bv"
    },
    {
     "bedrag": "968",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "7.018",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Kinderopvang De Kleine Wereld vzw"
    },
    {
     "bedrag": "4.029",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "2.286",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "8.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "1.452",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Digistore bv"
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "4.610",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "1.162",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "GreenThread bv"
    },
    {
     "bedrag": "2.178",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "6.050",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "315",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "25.362",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "3.025",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Winkelinrichting Rek & Co bv"
    },
    {
     "bedrag": "100",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "77.747",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "306",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    }
   ]
  },
  "controleInfo": null
 },
 "20X4": {
  "jaar": "20X4",
  "soort": "extra",
  "titel": "Extra oefenmateriaal",
  "kort": "X4",
  "categorieVolgorde": [
   "Aankopen taak 1: eenvoudige facturen",
   "Aankopen taak 2: handelskorting & transportkosten",
   "Aankopen taak 3: diensten, diverse goederen & vaste activa",
   "Aankopen taak 4: creditnota's",
   "Verkopen taak 1: eenvoudige facturen",
   "Verkopen taak 2: handelskorting & extra kosten",
   "Verkopen taak 3: creditnota's",
   "Verkopen taak 4: terugstuurbare verpakking",
   "Btw-verrekening",
   "Financiële verrichtingen",
   "Eindejaar"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X4 (BB)",
    "vasteBoeking": true,
    "doc": "20X4/00_beginbalans"
   },
   {
    "ref": "AK01",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK01",
    "doc": "20X4/AK01",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK02",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK02",
    "doc": "20X4/AK02",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK03",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK03",
    "doc": "20X4/AK03",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK04",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK04",
    "doc": "20X4/AK04",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK05",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK05",
    "doc": "20X4/AK05",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK06",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK06",
    "doc": "20X4/AK06",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK07",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK07",
    "doc": "20X4/AK07",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK08",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK08",
    "doc": "20X4/AK08",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK09",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK09",
    "doc": "20X4/AK09",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK10",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK10",
    "doc": "20X4/AK10",
    "relatie": "Drukkerij Letterwerk bv"
   },
   {
    "ref": "AK11",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK11",
    "doc": "20X4/AK11",
    "relatie": "Bureau & Co bv"
   },
   {
    "ref": "AK12",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK12",
    "doc": "20X4/AK12",
    "relatie": "Stroomkracht nv"
   },
   {
    "ref": "AK13",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK13",
    "doc": "20X4/AK13",
    "relatie": "Winkelinrichting Rek & Co bv"
   },
   {
    "ref": "AK14",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK14",
    "doc": "20X4/AK14",
    "relatie": "KassaTech bv"
   },
   {
    "ref": "AK15",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK15",
    "doc": "20X4/AK15",
    "relatie": "Lichtpunt bv"
   },
   {
    "ref": "AK16",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK16",
    "doc": "20X4/AK16",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "AK17",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK17",
    "doc": "20X4/AK17",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK18",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK18",
    "doc": "20X4/AK18",
    "relatie": "Drukkerij Letterwerk bv"
   },
   {
    "ref": "AK19",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK19",
    "doc": "20X4/AK19",
    "relatie": "Bureau & Co bv"
   },
   {
    "ref": "VK01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK01",
    "doc": "20X4/VK01",
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "VK02",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK02",
    "doc": "20X4/VK02",
    "relatie": "Danscentrum Kowalski vzw"
   },
   {
    "ref": "VK03",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK03",
    "doc": "20X4/VK03",
    "relatie": "Scouts Sint-Jan Wilsele"
   },
   {
    "ref": "ONTV01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV01",
    "doc": "20X4/ONTV01",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "ONTV02",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV02",
    "doc": "20X4/ONTV02",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "ONTV03",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV03",
    "doc": "20X4/ONTV03",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "VK04",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK04",
    "doc": "20X4/VK04",
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "VK05",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK05",
    "doc": "20X4/VK05",
    "relatie": "Kinderopvang De Kleine Wereld vzw"
   },
   {
    "ref": "VK06",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK06",
    "doc": "20X4/VK06",
    "relatie": "Basisschool De Regenboog"
   },
   {
    "ref": "VK07",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK07",
    "doc": "20X4/VK07",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "VK08",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK08",
    "doc": "20X4/VK08",
    "relatie": "Hotel De Linde bv"
   },
   {
    "ref": "VK09",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK09",
    "doc": "20X4/VK09",
    "relatie": "Bakkerij Vandenbroeck bv"
   },
   {
    "ref": "VK10",
    "categorie": "Verkopen taak 3: creditnota's",
    "titel": "Verkoop VK10",
    "doc": "20X4/VK10",
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "VK11",
    "categorie": "Verkopen taak 3: creditnota's",
    "titel": "Verkoop VK11",
    "doc": "20X4/VK11",
    "relatie": "Danscentrum Kowalski vzw"
   },
   {
    "ref": "VK12",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK12",
    "doc": "20X4/VK12",
    "relatie": "Scouts Sint-Jan Wilsele"
   },
   {
    "ref": "VK13",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK13",
    "doc": "20X4/VK13",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "VK14",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK14",
    "doc": "20X4/VK14",
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "VK15",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK15",
    "doc": "20X4/VK15",
    "relatie": "Scouts Sint-Jan Wilsele"
   },
   {
    "ref": "VK16",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK16",
    "doc": "20X4/VK16",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "BTW01",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW01",
    "doc": "20X4/BTW01",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "BTW02",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW02",
    "doc": "20X4/BTW02",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "BTW03",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW03",
    "doc": "20X4/BTW03",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "FIN01",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN01",
    "doc": "20X4/FIN01",
    "betaalstuk": true,
    "relatie": "Drukkerij Letterwerk bv"
   },
   {
    "ref": "FIN02",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN02",
    "doc": "20X4/FIN02",
    "betaalstuk": true,
    "relatie": "Winkelinrichting Rek & Co bv"
   },
   {
    "ref": "FIN03",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN03",
    "doc": "20X4/FIN03",
    "betaalstuk": true,
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "FIN04",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN04",
    "doc": "20X4/FIN04",
    "betaalstuk": true,
    "relatie": "GreenThread bv"
   },
   {
    "ref": "FIN05",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN05",
    "doc": "20X4/FIN05",
    "betaalstuk": true,
    "relatie": "Drukkerij Letterwerk bv"
   },
   {
    "ref": "FIN06",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN06",
    "doc": "20X4/FIN06",
    "betaalstuk": true,
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "FIN07",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN07",
    "doc": "20X4/FIN07",
    "betaalstuk": true,
    "relatie": "Bakkerij Vandenbroeck bv"
   },
   {
    "ref": "FIN08",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN08",
    "doc": "20X4/FIN08",
    "betaalstuk": true,
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "FIN09",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN09",
    "doc": "20X4/FIN09",
    "betaalstuk": true,
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "KAS01",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS01",
    "doc": "20X4/KAS01",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "KAS02",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS02",
    "doc": "20X4/KAS02",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "KAS03",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS03",
    "doc": "20X4/KAS03",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN10",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN10",
    "doc": "20X4/FIN10",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN11",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN11",
    "doc": "20X4/FIN11",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN12",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN12",
    "doc": "20X4/FIN12",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN13",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN13",
    "doc": "20X4/FIN13",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS04",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS04",
    "doc": "20X4/KAS04",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN14",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN14",
    "doc": "20X4/FIN14",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS05",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS05",
    "doc": "20X4/KAS05",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN15",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN15",
    "doc": "20X4/FIN15",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN16",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN16",
    "doc": "20X4/FIN16",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN17",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN17",
    "doc": "20X4/FIN17",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN18",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN18",
    "doc": "20X4/FIN18",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN19",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN19",
    "doc": "20X4/FIN19",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN20",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN20",
    "doc": "20X4/FIN20",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN21",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN21",
    "doc": "20X4/FIN21",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "FIN22",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN22",
    "doc": "20X4/FIN22",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "FIN23",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN23",
    "doc": "20X4/FIN23",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "EJ01",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ01",
    "doc": "20X4/EJ01",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ02",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ02",
    "doc": "20X4/EJ02",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ03",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ03",
    "doc": "20X4/EJ03",
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     },
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     },
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "35.016",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "9.500",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "5.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.500",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "6.500",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.200",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "2.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "15.550",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.972",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "3.961",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "10.467",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "2.614",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Hotel De Linde bv"
    },
    {
     "bedrag": "968",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "7.018",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Kinderopvang De Kleine Wereld vzw"
    },
    {
     "bedrag": "4.029",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "2.286",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "11.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Digistore bv"
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "6.219",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "4.332",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "GreenThread bv"
    },
    {
     "bedrag": "2.178",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "6.050",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "315",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "25.362",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "3.025",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Winkelinrichting Rek & Co bv"
    },
    {
     "bedrag": "100",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "77.213",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "301",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    }
   ]
  },
  "controleInfo": {
   "aankoopfacturen": [
    "AK01",
    "AK02",
    "AK03",
    "AK04",
    "AK05",
    "AK06",
    "AK07",
    "AK08",
    "AK09",
    "AK10",
    "AK11",
    "AK12",
    "AK13",
    "AK14",
    "AK15"
   ],
   "aankoopCN": [
    "AK16",
    "AK17",
    "AK18",
    "AK19"
   ],
   "verkoopfacturen": [
    "VK01",
    "VK02",
    "VK03",
    "VK04",
    "VK05",
    "VK06",
    "VK07",
    "VK08",
    "VK09",
    "VK12",
    "VK13",
    "VK14"
   ],
   "verkoopCN": [
    "VK10",
    "VK11",
    "VK15",
    "VK16"
   ],
   "dagontvangsten": [
    {
     "ontv": "ONTV01",
     "kas": [
      "KAS01"
     ],
     "bank": [
      "FIN10"
     ]
    },
    {
     "ontv": "ONTV02",
     "kas": [
      "KAS02"
     ],
     "bank": [
      "FIN11"
     ]
    },
    {
     "ontv": "ONTV03",
     "kas": [
      "KAS03"
     ],
     "bank": [
      "FIN12"
     ]
    }
   ],
   "kortingen": [
    "AK04",
    "AK05",
    "AK06",
    "VK04",
    "VK05",
    "VK06"
   ],
   "extraKosten": [
    "AK07",
    "AK08",
    "AK09",
    "VK07",
    "VK08",
    "VK09"
   ],
   "verpakking": [
    "VK12",
    "VK13",
    "VK14",
    "VK15",
    "VK16"
   ],
   "vasteActiva": [
    "AK13",
    "AK14",
    "AK15"
   ],
   "diensten": [
    "AK10",
    "AK11",
    "AK12",
    "AK18",
    "AK19"
   ],
   "btw": [
    {
     "doc": "BTW01",
     "betaling": [
      "FIN21"
     ]
    },
    {
     "doc": "BTW02",
     "betaling": [
      "FIN22"
     ]
    },
    {
     "doc": "BTW03",
     "betaling": [
      "FIN23"
     ]
    }
   ],
   "interne": [
    "FIN13",
    "FIN14",
    "KAS04",
    "KAS05"
   ],
   "leningOpname": [],
   "afbetalingen": [
    "FIN15",
    "FIN16",
    "FIN17",
    "FIN18",
    "FIN19",
    "FIN20"
   ],
   "laatsteBank": "FIN14",
   "laatsteKas": "KAS05",
   "eindejaar": {
    "afschrijvingen": "EJ01",
    "voorraad": "EJ02",
    "lening": "EJ03"
   },
   "tRekeningen": {
    "Aankopen taak 1: eenvoudige facturen": {
     "411000": {
      "D": [
       [
        "AK01",
        63
       ],
       [
        "AK02",
        126
       ],
       [
        "AK03",
        525
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK01",
        363
       ],
       [
        "AK02",
        726
       ],
       [
        "AK03",
        3025
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK01",
        300
       ],
       [
        "AK02",
        600
       ],
       [
        "AK03",
        2500
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 2: handelskorting & transportkosten": {
     "411000": {
      "D": [
       [
        "AK04",
        218
       ],
       [
        "AK05",
        359
       ],
       [
        "AK06",
        1117
       ],
       [
        "AK07",
        613
       ],
       [
        "AK08",
        1189
       ],
       [
        "AK09",
        248
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK04",
        1258
       ],
       [
        "AK05",
        2069
       ],
       [
        "AK06",
        6437
       ],
       [
        "AK07",
        3533
       ],
       [
        "AK08",
        6849
       ],
       [
        "AK09",
        1428
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK04",
        1150
       ],
       [
        "AK05",
        1900
       ],
       [
        "AK06",
        5600
       ],
       [
        "AK07",
        2800
       ],
       [
        "AK08",
        5600
       ],
       [
        "AK09",
        1100
       ]
      ],
      "C": []
     },
     "604020": {
      "D": [],
      "C": [
       [
        "AK04",
        110
       ],
       [
        "AK05",
        190
       ],
       [
        "AK06",
        280
       ]
      ]
     },
     "604030": {
      "D": [
       [
        "AK07",
        120
       ],
       [
        "AK08",
        60
       ],
       [
        "AK09",
        80
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 3: diensten, diverse goederen & vaste activa": {
     "230000": {
      "D": [
       [
        "AK15",
        1000
       ]
      ],
      "C": []
     },
     "232000": {
      "D": [
       [
        "AK14",
        2000
       ]
      ],
      "C": []
     },
     "240000": {
      "D": [
       [
        "AK13",
        1500
       ]
      ],
      "C": []
     },
     "411000": {
      "D": [
       [
        "AK10",
        46
       ],
       [
        "AK11",
        27
       ],
       [
        "AK12",
        50
       ],
       [
        "AK13",
        315
       ],
       [
        "AK14",
        420
       ],
       [
        "AK15",
        210
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK10",
        266
       ],
       [
        "AK11",
        157
       ],
       [
        "AK12",
        290
       ],
       [
        "AK13",
        1815
       ],
       [
        "AK14",
        2420
       ],
       [
        "AK15",
        1210
       ]
      ]
     },
     "612000": {
      "D": [
       [
        "AK10",
        220
       ],
       [
        "AK11",
        130
       ]
      ],
      "C": []
     },
     "612700": {
      "D": [
       [
        "AK12",
        240
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 4: creditnota's": {
     "411000": {
      "D": [],
      "C": [
       [
        "AK16",
        13
       ],
       [
        "AK17",
        13
       ],
       [
        "AK18",
        11
       ],
       [
        "AK19",
        4
       ]
      ]
     },
     "440000": {
      "D": [
       [
        "AK16",
        73
       ],
       [
        "AK17",
        73
       ],
       [
        "AK18",
        61
       ],
       [
        "AK19",
        24
       ]
      ],
      "C": []
     },
     "604010": {
      "D": [],
      "C": [
       [
        "AK16",
        60
       ],
       [
        "AK17",
        60
       ]
      ]
     },
     "612000": {
      "D": [],
      "C": [
       [
        "AK18",
        50
       ],
       [
        "AK19",
        20
       ]
      ]
     }
    },
    "Verkopen taak 1: eenvoudige facturen": {
     "400000": {
      "D": [
       [
        "VK01",
        1936
       ],
       [
        "VK02",
        5143
       ],
       [
        "VK03",
        4114
       ],
       [
        "ONTV01",
        2904
       ],
       [
        "ONTV02",
        2541
       ],
       [
        "ONTV03",
        4840
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK01",
        336
       ],
       [
        "VK02",
        893
       ],
       [
        "VK03",
        714
       ],
       [
        "ONTV01",
        504
       ],
       [
        "ONTV02",
        441
       ],
       [
        "ONTV03",
        840
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK01",
        1600
       ],
       [
        "VK02",
        4250
       ],
       [
        "VK03",
        3400
       ],
       [
        "ONTV01",
        2400
       ],
       [
        "ONTV02",
        2100
       ],
       [
        "ONTV03",
        4000
       ]
      ]
     }
    },
    "Verkopen taak 2: handelskorting & extra kosten": {
     "400000": {
      "D": [
       [
        "VK04",
        1561
       ],
       [
        "VK05",
        2021
       ],
       [
        "VK06",
        2420
       ],
       [
        "VK07",
        2226
       ],
       [
        "VK08",
        2251
       ],
       [
        "VK09",
        3642
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK04",
        271
       ],
       [
        "VK05",
        351
       ],
       [
        "VK06",
        420
       ],
       [
        "VK07",
        386
       ],
       [
        "VK08",
        391
       ],
       [
        "VK09",
        632
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK04",
        1350
       ],
       [
        "VK05",
        1850
       ],
       [
        "VK06",
        2100
       ],
       [
        "VK07",
        1800
       ],
       [
        "VK08",
        1800
       ],
       [
        "VK09",
        2950
       ]
      ]
     },
     "704020": {
      "D": [
       [
        "VK04",
        60
       ],
       [
        "VK05",
        180
       ],
       [
        "VK06",
        100
       ]
      ],
      "C": []
     },
     "746000": {
      "D": [],
      "C": [
       [
        "VK07",
        40
       ],
       [
        "VK08",
        60
       ],
       [
        "VK09",
        60
       ]
      ]
     }
    },
    "Verkopen taak 3: creditnota's": {
     "400000": {
      "D": [],
      "C": [
       [
        "VK10",
        194
       ],
       [
        "VK11",
        387
       ]
      ]
     },
     "451000": {
      "D": [
       [
        "VK10",
        34
       ],
       [
        "VK11",
        67
       ]
      ],
      "C": []
     },
     "704010": {
      "D": [
       [
        "VK10",
        160
       ],
       [
        "VK11",
        320
       ]
      ],
      "C": []
     }
    },
    "Verkopen taak 4: terugstuurbare verpakking": {
     "400000": {
      "D": [
       [
        "VK12",
        4315
       ],
       [
        "VK13",
        2722
       ],
       [
        "VK14",
        2258
       ]
      ],
      "C": [
       [
        "VK15",
        80
       ],
       [
        "VK16",
        60
       ]
      ]
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK12",
        735
       ],
       [
        "VK13",
        462
       ],
       [
        "VK14",
        378
       ]
      ]
     },
     "488000": {
      "D": [
       [
        "VK15",
        80
       ],
       [
        "VK16",
        60
       ]
      ],
      "C": [
       [
        "VK12",
        80
       ],
       [
        "VK13",
        60
       ],
       [
        "VK14",
        80
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK12",
        3500
       ],
       [
        "VK13",
        2200
       ],
       [
        "VK14",
        1800
       ]
      ]
     }
    }
   }
  }
 },
 "20X5": {
  "jaar": "20X5",
  "soort": "remediering",
  "titel": "Remediëring",
  "kort": "X5",
  "categorieVolgorde": [
   "Aankopen taak 1: eenvoudige facturen",
   "Aankopen taak 2: handelskorting & transportkosten",
   "Aankopen taak 3: diensten, diverse goederen & vaste activa",
   "Aankopen taak 4: creditnota's",
   "Verkopen taak 1: eenvoudige facturen",
   "Verkopen taak 2: handelskorting & extra kosten",
   "Verkopen taak 3: creditnota's",
   "Verkopen taak 4: terugstuurbare verpakking",
   "Btw-verrekening",
   "Financiële verrichtingen",
   "Eindejaar"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X5 (BB)",
    "vasteBoeking": true,
    "doc": "20X5/00_beginbalans"
   },
   {
    "ref": "AK01",
    "categorie": "Aankopen taak 1: eenvoudige facturen",
    "titel": "Aankoop AK01",
    "doc": "20X5/AK01",
    "relatie": "GreenThread bv"
   },
   {
    "ref": "AK02",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK02",
    "doc": "20X5/AK02",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "AK03",
    "categorie": "Aankopen taak 2: handelskorting & transportkosten",
    "titel": "Aankoop AK03",
    "doc": "20X5/AK03",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK04",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK04",
    "doc": "20X5/AK04",
    "relatie": "Connecto nv"
   },
   {
    "ref": "AK05",
    "categorie": "Aankopen taak 3: diensten, diverse goederen & vaste activa",
    "titel": "Aankoop AK05",
    "doc": "20X5/AK05",
    "relatie": "Winkelinrichting Rek & Co bv"
   },
   {
    "ref": "AK06",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK06",
    "doc": "20X5/AK06",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "AK07",
    "categorie": "Aankopen taak 4: creditnota's",
    "titel": "Aankoop AK07",
    "doc": "20X5/AK07",
    "relatie": "Connecto nv"
   },
   {
    "ref": "VK01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Verkoop VK01",
    "doc": "20X5/VK01",
    "relatie": "Kinderopvang De Kleine Wereld vzw"
   },
   {
    "ref": "ONTV01",
    "categorie": "Verkopen taak 1: eenvoudige facturen",
    "titel": "Dagontvangsten ONTV01",
    "doc": "20X5/ONTV01",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "VK02",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK02",
    "doc": "20X5/VK02",
    "relatie": "Hotel De Linde bv"
   },
   {
    "ref": "VK03",
    "categorie": "Verkopen taak 2: handelskorting & extra kosten",
    "titel": "Verkoop VK03",
    "doc": "20X5/VK03",
    "relatie": "Fietsclub De Trappers vzw"
   },
   {
    "ref": "VK04",
    "categorie": "Verkopen taak 3: creditnota's",
    "titel": "Verkoop VK04",
    "doc": "20X5/VK04",
    "relatie": "Kinderopvang De Kleine Wereld vzw"
   },
   {
    "ref": "VK05",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK05",
    "doc": "20X5/VK05",
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "VK06",
    "categorie": "Verkopen taak 4: terugstuurbare verpakking",
    "titel": "Verkoop VK06",
    "doc": "20X5/VK06",
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "BTW01",
    "categorie": "Btw-verrekening",
    "titel": "Btw-verrekening BTW01",
    "doc": "20X5/BTW01",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "FIN01",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN01",
    "doc": "20X5/FIN01",
    "betaalstuk": true,
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "FIN02",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN02",
    "doc": "20X5/FIN02",
    "betaalstuk": true,
    "relatie": "Connecto nv"
   },
   {
    "ref": "FIN03",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN03",
    "doc": "20X5/FIN03",
    "betaalstuk": true,
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "FIN04",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN04",
    "doc": "20X5/FIN04",
    "betaalstuk": true,
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "FIN05",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN05",
    "doc": "20X5/FIN05",
    "betaalstuk": true,
    "relatie": "Kinderopvang De Kleine Wereld vzw"
   },
   {
    "ref": "FIN06",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN06",
    "doc": "20X5/FIN06",
    "betaalstuk": true,
    "relatie": "Café De Fiets bv"
   },
   {
    "ref": "KAS01",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS01",
    "doc": "20X5/KAS01",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN07",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN07",
    "doc": "20X5/FIN07",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "FIN08",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN08",
    "doc": "20X5/FIN08",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS02",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS02",
    "doc": "20X5/KAS02",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN09",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN09",
    "doc": "20X5/FIN09",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "KAS03",
    "categorie": "Financiële verrichtingen",
    "titel": "Kasblad KAS03",
    "doc": "20X5/KAS03",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "FIN10",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN10",
    "doc": "20X5/FIN10",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN11",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN11",
    "doc": "20X5/FIN11",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X3/DOC_20",
      "titel": "Aflossingstabel lening KR-20X3-0388"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN12",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN12",
    "doc": "20X5/FIN12",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X2/LEN01",
      "titel": "Aflossingstabel lening KR-20X2-0263"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN13",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN13",
    "doc": "20X5/FIN13",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "FIN14",
    "categorie": "Financiële verrichtingen",
    "titel": "Bankuittreksel FIN14",
    "doc": "20X5/FIN14",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "EJ01",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ01",
    "doc": "20X5/EJ01",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ02",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ02",
    "doc": "20X5/EJ02",
    "relatie": "MetWear bv"
   },
   {
    "ref": "EJ03",
    "categorie": "Eindejaar",
    "titel": "Eindejaar EJ03",
    "doc": "20X5/EJ03",
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "47.511",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "17",
     "rekening": "173000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "6.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "2.100",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "2.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "232000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "400",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "232009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "8.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "5.800",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "3.600",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "17.275",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.198",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "2.420",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Basisschool De Regenboog"
    },
    {
     "bedrag": "3.961",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "4.756",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Danscentrum Kowalski vzw"
    },
    {
     "bedrag": "10.467",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "4.865",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Hotel De Linde bv"
    },
    {
     "bedrag": "3.226",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "9.039",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Kinderopvang De Kleine Wereld vzw"
    },
    {
     "bedrag": "5.590",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "10.635",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "7.500",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "133",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Bureau & Co bv"
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Digistore bv"
    },
    {
     "bedrag": "8.143",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "7.937",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "5.590",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "GreenThread bv"
    },
    {
     "bedrag": "4.598",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "7.260",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "605",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "38.648",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "3.025",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Winkelinrichting Rek & Co bv"
    },
    {
     "bedrag": "180",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "75.938",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "301",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    }
   ]
  },
  "controleInfo": {
   "aankoopfacturen": [
    "AK01",
    "AK02",
    "AK03",
    "AK04",
    "AK05"
   ],
   "aankoopCN": [
    "AK06",
    "AK07"
   ],
   "verkoopfacturen": [
    "VK01",
    "VK02",
    "VK03",
    "VK05"
   ],
   "verkoopCN": [
    "VK04",
    "VK06"
   ],
   "dagontvangsten": [
    {
     "ontv": "ONTV01",
     "kas": [
      "KAS01"
     ],
     "bank": [
      "FIN07"
     ]
    }
   ],
   "kortingen": [
    "AK02",
    "VK02"
   ],
   "extraKosten": [
    "AK03",
    "VK03"
   ],
   "verpakking": [
    "VK05",
    "VK06"
   ],
   "vasteActiva": [
    "AK05"
   ],
   "diensten": [
    "AK04",
    "AK07"
   ],
   "btw": [
    {
     "doc": "BTW01",
     "betaling": [
      "FIN14"
     ]
    }
   ],
   "interne": [
    "FIN08",
    "FIN09",
    "KAS02",
    "KAS03"
   ],
   "leningOpname": [],
   "afbetalingen": [
    "FIN10",
    "FIN11",
    "FIN12",
    "FIN13"
   ],
   "laatsteBank": "FIN09",
   "laatsteKas": "KAS03",
   "eindejaar": {
    "afschrijvingen": "EJ01",
    "voorraad": "EJ02",
    "lening": "EJ03"
   },
   "tRekeningen": {
    "Aankopen taak 1: eenvoudige facturen": {
     "411000": {
      "D": [
       [
        "AK01",
        168
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK01",
        968
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK01",
        800
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 2: handelskorting & transportkosten": {
     "411000": {
      "D": [
       [
        "AK02",
        330
       ],
       [
        "AK03",
        435
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK02",
        1900
       ],
       [
        "AK03",
        2505
       ]
      ]
     },
     "604000": {
      "D": [
       [
        "AK02",
        1650
       ],
       [
        "AK03",
        1950
       ]
      ],
      "C": []
     },
     "604020": {
      "D": [],
      "C": [
       [
        "AK02",
        80
       ]
      ]
     },
     "604030": {
      "D": [
       [
        "AK03",
        120
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 3: diensten, diverse goederen & vaste activa": {
     "232000": {
      "D": [
       [
        "AK05",
        1000
       ]
      ],
      "C": []
     },
     "411000": {
      "D": [
       [
        "AK04",
        21
       ],
       [
        "AK05",
        210
       ]
      ],
      "C": []
     },
     "440000": {
      "D": [],
      "C": [
       [
        "AK04",
        121
       ],
       [
        "AK05",
        1210
       ]
      ]
     },
     "616000": {
      "D": [
       [
        "AK04",
        100
       ]
      ],
      "C": []
     }
    },
    "Aankopen taak 4: creditnota's": {
     "411000": {
      "D": [],
      "C": [
       [
        "AK06",
        32
       ],
       [
        "AK07",
        2
       ]
      ]
     },
     "440000": {
      "D": [
       [
        "AK06",
        182
       ],
       [
        "AK07",
        12
       ]
      ],
      "C": []
     },
     "604010": {
      "D": [],
      "C": [
       [
        "AK06",
        150
       ]
      ]
     },
     "616000": {
      "D": [],
      "C": [
       [
        "AK07",
        10
       ]
      ]
     }
    },
    "Verkopen taak 1: eenvoudige facturen": {
     "400000": {
      "D": [
       [
        "VK01",
        847
       ],
       [
        "ONTV01",
        5808
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK01",
        147
       ],
       [
        "ONTV01",
        1008
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK01",
        700
       ],
       [
        "ONTV01",
        4800
       ]
      ]
     }
    },
    "Verkopen taak 2: handelskorting & extra kosten": {
     "400000": {
      "D": [
       [
        "VK02",
        762
       ],
       [
        "VK03",
        1319
       ]
      ],
      "C": []
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK02",
        132
       ],
       [
        "VK03",
        229
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK02",
        700
       ],
       [
        "VK03",
        1050
       ]
      ]
     },
     "704020": {
      "D": [
       [
        "VK02",
        70
       ]
      ],
      "C": []
     },
     "746000": {
      "D": [],
      "C": [
       [
        "VK03",
        40
       ]
      ]
     }
    },
    "Verkopen taak 3: creditnota's": {
     "400000": {
      "D": [],
      "C": [
       [
        "VK04",
        48
       ]
      ]
     },
     "451000": {
      "D": [
       [
        "VK04",
        8
       ]
      ],
      "C": []
     },
     "704010": {
      "D": [
       [
        "VK04",
        40
       ]
      ],
      "C": []
     }
    },
    "Verkopen taak 4: terugstuurbare verpakking": {
     "400000": {
      "D": [
       [
        "VK05",
        2238
       ]
      ],
      "C": [
       [
        "VK06",
        60
       ]
      ]
     },
     "451000": {
      "D": [],
      "C": [
       [
        "VK05",
        378
       ]
      ]
     },
     "488000": {
      "D": [
       [
        "VK06",
        60
       ]
      ],
      "C": [
       [
        "VK05",
        60
       ]
      ]
     },
     "704000": {
      "D": [],
      "C": [
       [
        "VK05",
        1800
       ]
      ]
     }
    }
   }
  }
 },
 "20X6": {
  "jaar": "20X6",
  "soort": "conso",
  "titel": "Consolidatie 2",
  "kort": "X6",
  "categorieVolgorde": [
   "Alle documenten"
  ],
  "opdrachten": [
   {
    "ref": "BB",
    "navLabel": "BEGINBALANS (BB)",
    "categorie": "Beginbalans",
    "titel": "Beginbalans 1 januari 20X6 (BB)",
    "vasteBoeking": true,
    "doc": "20X6/00_beginbalans"
   },
   {
    "ref": "DOC_01",
    "categorie": "Alle documenten",
    "titel": "Document DOC_01",
    "doc": "20X6/DOC_01",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "DOC_02",
    "categorie": "Alle documenten",
    "titel": "Document DOC_02",
    "doc": "20X6/DOC_02",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "DOC_03",
    "categorie": "Alle documenten",
    "titel": "Document DOC_03",
    "doc": "20X6/DOC_03",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "DOC_04",
    "categorie": "Alle documenten",
    "titel": "Document DOC_04",
    "doc": "20X6/DOC_04",
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "DOC_05",
    "categorie": "Alle documenten",
    "titel": "Document DOC_05",
    "doc": "20X6/DOC_05",
    "relatie": "EthiKnit nv"
   },
   {
    "ref": "DOC_06",
    "categorie": "Alle documenten",
    "titel": "Document DOC_06",
    "doc": "20X6/DOC_06",
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "DOC_07",
    "categorie": "Alle documenten",
    "titel": "Document DOC_07",
    "doc": "20X6/DOC_07",
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_08",
    "categorie": "Alle documenten",
    "titel": "Document DOC_08",
    "doc": "20X6/DOC_08",
    "relatie": "KassaTech bv"
   },
   {
    "ref": "DOC_09",
    "categorie": "Alle documenten",
    "titel": "Document DOC_09",
    "doc": "20X6/DOC_09",
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "DOC_10",
    "categorie": "Alle documenten",
    "titel": "Document DOC_10",
    "doc": "20X6/DOC_10",
    "betaalstuk": true,
    "relatie": "Geldautomaat NovaBank Leuven"
   },
   {
    "ref": "DOC_11",
    "categorie": "Alle documenten",
    "titel": "Document DOC_11",
    "doc": "20X6/DOC_11",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_12",
    "categorie": "Alle documenten",
    "titel": "Document DOC_12",
    "doc": "20X6/DOC_12",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X1/LEN01",
      "titel": "Aflossingstabel lening KR-20X1-0147"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_13",
    "categorie": "Alle documenten",
    "titel": "Document DOC_13",
    "doc": "20X6/DOC_13",
    "relatie": "Terra Outdoor bv"
   },
   {
    "ref": "DOC_14",
    "categorie": "Alle documenten",
    "titel": "Document DOC_14",
    "doc": "20X6/DOC_14",
    "relatie": "Bakkerij Vandenbroeck bv"
   },
   {
    "ref": "DOC_15",
    "categorie": "Alle documenten",
    "titel": "Document DOC_15",
    "doc": "20X6/DOC_15",
    "relatie": "Restaurant Da Rossi bv"
   },
   {
    "ref": "DOC_16",
    "categorie": "Alle documenten",
    "titel": "Document DOC_16",
    "doc": "20X6/DOC_16",
    "relatie": "WebNest bv"
   },
   {
    "ref": "DOC_18",
    "categorie": "Alle documenten",
    "titel": "Document DOC_18",
    "doc": "20X6/DOC_18",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X6/DOC_17",
      "titel": "Aflossingstabel lening KR-20X6-0412"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_19",
    "categorie": "Alle documenten",
    "titel": "Document DOC_19",
    "doc": "20X6/DOC_19",
    "betaalstuk": true,
    "relatie": "Jeugdtheater Applaus vzw"
   },
   {
    "ref": "DOC_20",
    "categorie": "Alle documenten",
    "titel": "Document DOC_20",
    "doc": "20X6/DOC_20",
    "betaalstuk": true,
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "DOC_21",
    "categorie": "Alle documenten",
    "titel": "Document DOC_21",
    "doc": "20X6/DOC_21",
    "relatie": "WebNest bv"
   },
   {
    "ref": "DOC_22",
    "categorie": "Alle documenten",
    "titel": "Document DOC_22",
    "doc": "20X6/DOC_22",
    "relatie": "FOD Financiën"
   },
   {
    "ref": "DOC_23",
    "categorie": "Alle documenten",
    "titel": "Document DOC_23",
    "doc": "20X6/DOC_23",
    "betaalstuk": true,
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "DOC_24",
    "categorie": "Alle documenten",
    "titel": "Document DOC_24",
    "doc": "20X6/DOC_24",
    "betaalstuk": true,
    "relatie": "FOD Financiën - btw"
   },
   {
    "ref": "DOC_25",
    "categorie": "Alle documenten",
    "titel": "Document DOC_25",
    "doc": "20X6/DOC_25",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_26",
    "categorie": "Alle documenten",
    "titel": "Document DOC_26",
    "doc": "20X6/DOC_26",
    "betaalstuk": true,
    "relatie": "Dagontvangsten (particulieren)"
   },
   {
    "ref": "DOC_27",
    "categorie": "Alle documenten",
    "titel": "Document DOC_27",
    "doc": "20X6/DOC_27",
    "betaalstuk": true,
    "relatie": "Architectenbureau Lindqvist bv"
   },
   {
    "ref": "DOC_28",
    "categorie": "Alle documenten",
    "titel": "Document DOC_28",
    "doc": "20X6/DOC_28",
    "betaalstuk": true,
    "relatie": "FairFabrics nv"
   },
   {
    "ref": "DOC_29",
    "categorie": "Alle documenten",
    "titel": "Document DOC_29",
    "doc": "20X6/DOC_29",
    "betaalstuk": true,
    "hulpdocs": [
     {
      "doc": "20X6/DOC_17",
      "titel": "Aflossingstabel lening KR-20X6-0412"
     }
    ],
    "relatie": "NovaBank - kredieten"
   },
   {
    "ref": "DOC_30",
    "categorie": "Alle documenten",
    "titel": "Document DOC_30",
    "doc": "20X6/DOC_30",
    "betaalstuk": true,
    "relatie": "WebNest bv"
   },
   {
    "ref": "DOC_31",
    "categorie": "Alle documenten",
    "titel": "Document DOC_31",
    "doc": "20X6/DOC_31",
    "betaalstuk": true,
    "relatie": "Stortingsautomaat NovaBank Leuven"
   },
   {
    "ref": "DOC_32",
    "categorie": "Alle documenten",
    "titel": "Document DOC_32",
    "doc": "20X6/DOC_32",
    "betaalstuk": true,
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_33",
    "categorie": "Alle documenten",
    "titel": "Document DOC_33",
    "doc": "20X6/DOC_33",
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_34",
    "categorie": "Alle documenten",
    "titel": "Document DOC_34",
    "doc": "20X6/DOC_34",
    "relatie": "MetWear bv"
   },
   {
    "ref": "DOC_35",
    "categorie": "Alle documenten",
    "titel": "Document DOC_35",
    "doc": "20X6/DOC_35",
    "relatie": "MetWear bv"
   }
  ],
  "vasteBoekingen": {
   "BB": [
    {
     "bedrag": "25.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "10",
     "rekening": "100000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "51.310",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "1",
     "rubriek": "14",
     "rekening": "140000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "6.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "2.700",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "230009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "232000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "1.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "23",
     "rekening": "232009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "8.000",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "6.600",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240009",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "3.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240200",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "3.900",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "-",
     "klasse": "2",
     "rubriek": "24",
     "rekening": "240209",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "19.050",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "3",
     "rubriek": "34",
     "rekening": "340000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "4.198",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Architectenbureau Lindqvist bv"
    },
    {
     "bedrag": "2.420",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Basisschool De Regenboog"
    },
    {
     "bedrag": "3.961",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Café De Fiets bv"
    },
    {
     "bedrag": "4.756",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Danscentrum Kowalski vzw"
    },
    {
     "bedrag": "11.786",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Fietsclub De Trappers vzw"
    },
    {
     "bedrag": "5.627",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Hotel De Linde bv"
    },
    {
     "bedrag": "3.226",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Jeugdtheater Applaus vzw"
    },
    {
     "bedrag": "9.039",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Kinderopvang De Kleine Wereld vzw"
    },
    {
     "bedrag": "5.590",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Restaurant Da Rossi bv"
    },
    {
     "bedrag": "10.635",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "40",
     "rekening": "400000",
     "dc": "D",
     "relatie": "Scouts Sint-Jan Wilsele"
    },
    {
     "bedrag": "2.000",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "42",
     "rekening": "423000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "133",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Bureau & Co bv"
    },
    {
     "bedrag": "2.541",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Digistore bv"
    },
    {
     "bedrag": "10.043",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "EthiKnit nv"
    },
    {
     "bedrag": "7.937",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "FairFabrics nv"
    },
    {
     "bedrag": "6.558",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "GreenThread bv"
    },
    {
     "bedrag": "4.598",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "KassaTech bv"
    },
    {
     "bedrag": "7.260",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Lichtpunt bv"
    },
    {
     "bedrag": "605",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Stroomkracht nv"
    },
    {
     "bedrag": "38.648",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Terra Outdoor bv"
    },
    {
     "bedrag": "4.235",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "44",
     "rekening": "440000",
     "dc": "C",
     "relatie": "Winkelinrichting Rek & Co bv"
    },
    {
     "bedrag": "180",
     "redenering": "beginbalans",
     "apko": "P",
     "stijgtDaalt": "+",
     "klasse": "4",
     "rubriek": "48",
     "rekening": "488000",
     "dc": "C",
     "relatie": ""
    },
    {
     "bedrag": "73.757",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "55",
     "rekening": "550000",
     "dc": "D",
     "relatie": ""
    },
    {
     "bedrag": "303",
     "redenering": "beginbalans",
     "apko": "A",
     "stijgtDaalt": "+",
     "klasse": "5",
     "rubriek": "57",
     "rekening": "570000",
     "dc": "D",
     "relatie": ""
    }
   ]
  },
  "controleInfo": null
 }
};

var RELATIES = {
  "klanten": [
    "Architectenbureau Lindqvist bv",
    "Bakkerij Vandenbroeck bv",
    "Basisschool De Regenboog",
    "Café De Fiets bv",
    "Dagontvangsten (particulieren)",
    "Danscentrum Kowalski vzw",
    "Fietsclub De Trappers vzw",
    "Hotel De Linde bv",
    "Jeugdtheater Applaus vzw",
    "Kinderopvang De Kleine Wereld vzw",
    "Restaurant Da Rossi bv",
    "Scouts Sint-Jan Wilsele",
    "Yogastudio Lotus bv"
  ],
  "leveranciers": [
    "Bureau & Co bv",
    "Connecto nv",
    "Digistore bv",
    "Drukkerij Letterwerk bv",
    "EthiKnit nv",
    "FairFabrics nv",
    "GreenThread bv",
    "KassaTech bv",
    "Lichtpunt bv",
    "Pixelpunt bv",
    "Stroomkracht nv",
    "Terra Outdoor bv",
    "WebNest bv",
    "Winkelinrichting Rek & Co bv"
  ]
};
