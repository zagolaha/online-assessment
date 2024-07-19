CREATE TABLE IF NOT EXISTS User (
    ID TEXT PRIMARY KEY,
    Nachname TEXT,
    Vorname TEXT,
    Token TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS Ausbilder (
    ID TEXT PRIMARY KEY,
    EMail TEXT UNIQUE,
    Passwort TEXT
);

CREATE TABLE IF NOT EXISTS Persoenlichkeit (
    ID TEXT PRIMARY KEY,
    Pünktlich INTEGER,
    Durchsetzungsfähig INTEGER,
    Aufgabenorientiert INTEGER,
    Ruhig INTEGER,
    Direkt INTEGER,
    Freundlich INTEGER,
    Spontan INTEGER,
    Impulsiv INTEGER
);

CREATE TABLE IF NOT EXISTS Schlüsselaufgabe (
    ID TEXT PRIMARY KEY,
    Richtig INTEGER,
    Falsch INTEGER,
    Unbearbeitet INTEGER
);

CREATE TABLE IF NOT EXISTS Musteraufgabe (
    ID TEXT PRIMARY KEY,
    Richtig INTEGER,
    Falsch INTEGER,
    Unbearbeitet INTEGER
);