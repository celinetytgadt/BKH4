
/** Menu: vervangt de inhoud van het tabblad Sleutel door de sleutel van de case. */
function sleutelCaseInvullen() {
  var ui = SpreadsheetApp.getUi();
  var ok = ui.alert("Sleutel van de case invullen",
    "Wat nu in het tabblad Sleutel staat, wordt vervangen door de oplossing van de case (" +
    SLEUTEL_CASE.length + " regels). Doorgaan?", ui.ButtonSet.YES_NO);
  if (ok !== ui.Button.YES) return;
  var blad = maakBlad_(SpreadsheetApp.getActiveSpreadsheet(), BLAD_SLEUTEL, KOP_SLEUTEL);
  schrijfSleutelCase_(blad);
  ui.alert("Klaar. Nieuwe inzendingen worden vanaf nu automatisch nagekeken. Voor wat er al binnen is: " +
    "Boekhoudapp → Open inzendingen automatisch nakijken.");
}

function schrijfSleutelCase_(blad) {
  if (blad.getLastRow() > 1) blad.getRange(2, 1, blad.getLastRow() - 1, KOP_SLEUTEL.length).clearContent();
  // Kolom D als tekst: anders maakt de Sheet van "22, 23, 24" of "1.500" iets anders.
  blad.getRange(2, 4, SLEUTEL_CASE.length, 1).setNumberFormat("@");
  blad.getRange(2, 1, SLEUTEL_CASE.length, KOP_SLEUTEL.length).setValues(SLEUTEL_CASE);
}
