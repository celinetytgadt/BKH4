// data-beginstand.js
// De beginboeking (BB) op 1 januari 2027. Ze staat al klaar in de app en kan
// door de leerling niet gewijzigd worden: dit zijn de cijfers van het 3e jaar
// (2026), na de afsluiting door de boekhouder. De beginbalans 2027 is dus de
// eindbalans 2026.
//
// GEMAAKT MET hulpmiddelen/maak-data.js uit de case (tabblad J1 Proefbalans,
// kolom "Na afsluiting 31/12"). De namen bij 400000 en 440000 zijn de twee
// facturen van eind december die nog openstaan: die worden in januari betaald.

const BEGINSTAND = {
  ref: "BB",
  rows: [
    {
      "bedrag": "20.000",
      "redenering": "beginbalans 1/1/2027",
      "apko": "P",
      "stijgtDaalt": "",
      "rekening": "100000",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "21.570",
      "redenering": "beginbalans 1/1/2027",
      "apko": "P",
      "stijgtDaalt": "",
      "rekening": "140000",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "1.500",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "230000",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "300",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "230009",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "500",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "232000",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "100",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "232009",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "2.100",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "240200",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "700",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "240209",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "6.000",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "241000",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "1.200",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "241009",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "11.720",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "340000",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "9.196",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "400000",
      "dc": "D",
      "relatie": "Velocity Deelfietsen bv"
    },
    {
      "bedrag": "7.260",
      "redenering": "beginbalans 1/1/2027",
      "apko": "P",
      "stijgtDaalt": "",
      "rekening": "440000",
      "dc": "C",
      "relatie": "Velomax bv"
    },
    {
      "bedrag": "1.428",
      "redenering": "beginbalans 1/1/2027",
      "apko": "P",
      "stijgtDaalt": "",
      "rekening": "451000",
      "dc": "C",
      "relatie": ""
    },
    {
      "bedrag": "18.162",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "550000",
      "dc": "D",
      "relatie": ""
    },
    {
      "bedrag": "3.380",
      "redenering": "beginbalans 1/1/2027",
      "apko": "A",
      "stijgtDaalt": "",
      "rekening": "570000",
      "dc": "D",
      "relatie": ""
    }
  ],
};
