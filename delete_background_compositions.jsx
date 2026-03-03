/*
Skrypt: Napraw Wszystkie Obszary Kompozycji (Wersja Pełna + Zwijanie)
Opis: Przechodzi przez KAŻDĄ warstwę najwyższego poziomu. 
      Jeśli to Artboard -> ustawia tło na przezroczyste, 
      a na koniec zwija widok wszystkich grup w panelu warstw.
*/

#target photoshop

function main() {
    if (app.documents.length === 0) {
        alert("Brak otwartego dokumentu.");
        return;
    }

    var doc = app.activeDocument;
    var layersCount = doc.layers.length;
    var changeCount = 0;

    // Iterujemy od DOŁU do GÓRY (od ostatniej warstwy do pierwszej).
    // Zapobiega to błędom gubienia "focusu" na pierwszej warstwie.
    for (var i = layersCount - 1; i >= 0; i--) {
        
        var currentLayer = doc.layers[i];

        // Sprawdzamy, czy to Grupa/Artboard (LayerSet)
        if (currentLayer.typename === "LayerSet") {
            
            // 1. Zaznaczamy warstwę
            doc.activeLayer = currentLayer;

            // 2. Wykonujemy zmianę tła
            if (makeArtboardTransparent()) {
                changeCount++;
            }
        }
    }

    // 3. Po zakończeniu pracy, zwijamy wszystkie kompozycje
    collapseAllGroups();

    alert("Gotowe! Zmieniono tło w " + changeCount + " obszarach i zwinięto widok warstw.");
}

// Funkcja zmieniająca tło aktywnego Artboardu na przezroczyste
function makeArtboardTransparent() {
    try {
        var ideditArtboardEvent = stringIDToTypeID("editArtboardEvent");
        var descMain = new ActionDescriptor();

        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        descMain.putReference(charIDToTypeID("null"), ref);

        var descArtboard = new ActionDescriptor();
        var idartboardBackgroundType = stringIDToTypeID("artboardBackgroundType");
        
        // 3 = Przezroczysty (Transparent)
        descArtboard.putInteger(idartboardBackgroundType, 3);

        var idartboard = stringIDToTypeID("artboard");
        descMain.putObject(idartboard, idartboard, descArtboard);

        executeAction(ideditArtboardEvent, descMain, DialogModes.NO);
        return true;
    } catch (e) {
        return false;
    }
}

// Funkcja symulująca kliknięcie polecenia "Zwiń wszystkie grupy"
function collapseAllGroups() {
    try {
        var idcollapseAllGroupsEvent = stringIDToTypeID("collapseAllGroupsEvent");
        var desc = new ActionDescriptor();
        executeAction(idcollapseAllGroupsEvent, desc, DialogModes.NO);
    } catch (e) {
        // Ciche przechwycenie błędu, jeśli wersja PS by na to nie pozwalała
    }
}

main();