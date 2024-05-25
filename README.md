# WebEngineering: Online-Assessment
Repository für das Modul WebEngineering der DHBW-KA.

## Online-Assessment Tool
Diese WebApp soll eine neue Plattform für HR bieten, um Assessment-Tests für
Bewerber durchzuführen.

### Wie startet man das Tool?
`python app.py`. Flask muss installiert sein.

### Architektur
Die App ist funktional getrennt zwischen der Bewerber- und Admin-Seite. Bewerber
erhalten einen personalisierten Login-Token, mit dem sie ihren Test starten
können. Nach der Login-Seite ist eine Parent-Seite dauerhaft sichtbar, die den
Test orchestriert, Daten sammelt und abschickt. Die Fragen selbst werden als
Children in das iFrame geladen, somit sollen die Fragenkataloge wie Module
strukturiert werden.

Das Admin-Panel benötigt einen Login und bietet alle Funktionalitäten für das
Erstellen und Auswerten der Tests an.

### Tech-Stack Auswahl
Wir verwenden Flask und SQLite im Backend, weil das die für uns niedrigste
Lernkurve hat. Im Frontend setzen wir auf TailwindCSS und jQuery.