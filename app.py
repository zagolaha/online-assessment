from flask import Flask, render_template, redirect, url_for, request, g, jsonify
import sqlite3
import random
import string
app = Flask (__name__)
DATABASE = "Datenbank.db"

@app.route('/')
def index():
    close_connection()
    return render_template("Dashboard.html")


@app.route('/get_data', methods=['POST','GET'])
def get_data(): 
    db = getDB()
    standart = db.execute('SELECT ID FROM User ORDER BY ROWID ASC')
    standart_user_id = standart.fetchone()
    if request.is_json:
            data = request.get_json()
            user_id = data.get('id')
    else: 
        user_id = standart_user_id[0]
        
    cur = db.execute('SELECT Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv FROM Persoenlichkeit WHERE ID = ?', (user_id,))
    personality = cur.fetchone()
    cur = db.execute('SELECT Richtig, Falsch, Unbearbeitet FROM Schlüsselaufgabe WHERE ID =?', (user_id,))
    key = cur.fetchone()
    cur = db.execute('SELECT Richtig, Falsch, Unbearbeitet FROM Musteraufgabe WHERE ID =?',(user_id,))
    pattern = cur.fetchone()
    data = {
        'personality': list(personality) if personality else [0,0,0,0,0,0,0,0],
        'key': list(key) if key else [0,0,0],
        'pattern': list(pattern) if pattern else [0,0,0],
        'label': "Finished" if personality and key and pattern else "Not started" if not personality and not key and not pattern else "Not finished"
    }
    close_connection()
    return jsonify(data)

@app.route('/ManageUsers', methods= ['POST', 'GET'])
def ManageUsers():
    #ADD USER
    db = getDB()
    cur = db.cursor()
    pressed_button = request.form.get('Button')
    if request.method == "POST" and pressed_button == "addButton":
        name = request.form.get('nachname')
        firstname = request.form.get('vorname')

        tokens = cur.execute('SELECT (Token) FROM User')
        tokens = tokens.fetchall()
        tokens_values = [row[0] for row in tokens]
        token = generate_token_ID()
        while token in tokens_values:
            token = generate_token_ID()

        ids = cur.execute('SELECT (ID) FROM User')
        ids = ids.fetchall()
        id_values = [row[0] for row in ids]
        id = generate_token_ID()
        while id in id_values:
            id = generate_token_ID()

        cur.execute('INSERT INTO USER (Nachname, Vorname, Token, ID) VALUES(?,?,?,?)', (name, firstname, token, id))
        db.commit()

    #DELET USER
    
    if request.method == "POST" and pressed_button == "deleteButton":
        selected_user = request.form.get('user_id')
        cur.execute('DELETE FROM User WHERE ID = ?', (selected_user,))
        db.commit()
    values = cur.execute('SELECT Nachname, Vorname, ID FROM User')
    data = values.fetchall()
    nachnamen = [row[0] for row in data]
    vornamen = [row[1] for row in data]
    ID = [row[2] for row in data]
    datas = {
    'nachnamen': nachnamen,
    'vornamen': vornamen,
    'ID': ID
    }
    close_connection()
    return render_template("ManageUsers.html", data = datas)

@app.route('/ExtendedDashboard')
def ExtendedDashboard():
    db = getDB()
    cur = db.execute('SELECT Nachname, Vorname, ID FROM User')
    data = cur.fetchall()
    nachnamen = [row[0] for row in data]
    vornamen = [row[1] for row in data]
    ID = [row[2] for row in data]
    datas = {
        'nachnamen': nachnamen,
        'vornamen': vornamen,
        'ID': ID
    }
    return render_template("ExtendedDashboard.html", data = datas)

@app.route('/LogIn', methods=['GET', 'POST'])
def LogIn():
    if request.is_json:
        data = request.get_json()
        username = data.get('username')
        hashed_pw = data.get('password')
        db = getDB()
        cur = db.execute('SELECT Passwort FROM Ausbilder WHERE EMail = ?', (username,))
        saved_password = cur.fetchone()
        if saved_password and saved_password[0] == hashed_pw:
            close_connection()
            return redirect(url_for('ExtendedDashboard'))
    close_connection()
    return render_template("LogIn.html")

@app.route('/Persoenlichkeit', methods=['POST'])
def Persoenlichkeit():
    if request.is_json:
        points = request.get_json()
        values = points.get('points', [])
        print(values)
        #TODO Zwischen Seite bevor Dashboard und Daten in db eintrage
    return redirect(url_for('index'))

def getDB():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db
def close_connection():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def generate_token_ID():
    char = string.ascii_letters + string.digits
    random_char = ''.join(random.choice(char) for i in range (6))
    return random_char
