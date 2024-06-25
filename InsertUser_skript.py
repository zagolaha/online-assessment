import sqlite3
import hashlib

DATABASE ="Datenbank.db"

def hashPassword(password) -> str:
    sha256 = hashlib.sha256()
    sha256.update(password.encode('utf-8'))
    return sha256.hexdigest()

def Insert_User(name,firstname, email, password):
    hashed_password = hashPassword(password)
    db = sqlite3.connect(DATABASE)
    cur = db.cursor()
    cur. execute('INSERT INTO Ausbilder (Nachname, Vorname, EMail, Passwort) VALUES(?,?,?,?)',(name,firstname, email,hashed_password))
    db.commit()
    db.close()

close = None
while close not in ["N", "n"]:
    name = input("Gib deinen Nachnamen ein:")
    firstname = input("Gib deinen Vornamen ein:")
    email = input("Gibt deine E-Mail ein:")
    password = input("Gib dein Passwort ein:")
    close = input("Möchtest du noch einen Ausbilder erstellen? (J/N)")
    Insert_User(name, firstname, email, password)


