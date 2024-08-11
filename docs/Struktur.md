# Struktur

Unser Projekt benutzt...
- im Backend
  - Flask (Python Framework)
  - SQLite als Datenbank
- im Frontend
  - TailwindCSS
  - jQuery
  - chart.js

Wir haben uns *gegen* ein JavaScript Framework entschieden, weil die Lernkurve
für ein so simples Projekt zu steil und unsere Erfahrungen im WebDev nicht
tiefgründig genug sind, um die Vorteile aus einem Framework auszuloten.

Die Python-Dateien befinden sich im root directory, während das Frontend in
templates/ (HTML-Dateien) sowie static/ aufgeteilt ist.


## Zur Funktionsweise der Webseite

Das Online-Assessment-Center ist ein Tool für eine Personalabteilung, um die
Fähigkeiten von Bewerbern zu testen. Dafür gibt es einzelne Tests, die beliebig
kombiniert werden können. Für die Personaler existiert ein Dashboard, in dem die
Log-ins vorbereitet werden können. Der Bewerber bekommt dann sein
individualisiertes Token, um sich anzumelden.

Die Testergebnisse werden zuerst im local storage gespeichert, bis alle Tests
abgeschlossen sind. Am Ende wird alles in einem Zug übertragen und in der DB
gespeichert. Der Bewerber erhält direkt im Anschluss seine Ergebnisse in einem
reduzierten Dashboard.

Da der Test auf Tablets laufen sollen, die bei einem Bewerbertag ausgegeben
werden, wird auf Responsive Design verzichtet.

### Erstellen eines Ausbilderaccounts 

Führt man die InsertUser_skript.py Datei aus, kann man einen neuen Ausbilder
anlegen. Diese Datei ist ausschließlich für den Betrieb gedacht.
