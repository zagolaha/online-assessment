from flask import Flask, render_template, redirect, url_for, request, g, jsonify, session, send_from_directory
import sqlite3
import random
import string

app = Flask(__name__, static_url_path='/static')
app.secret_key = '123'
DATABASE = "Datenbank.db"


@app.route('/static/<path:filename>')
def send_static(filename):
    return send_from_directory('static', filename)


@app.route('/')
def index():
    session.pop('profile_loaded', None)
    session.pop('loggedIn', False)
    close_connection()
    return render_template("Anmeldung.html")

@app.route('/Dashboard')
def Dashboard():
    session.pop('profile_loaded', None)
    session.pop('loggedIn', False)
    return render_template("Dashboard.html")

@app.route('/Test_Results', methods=['POST','GET'])
def Data():
    db = getDB()

    if request.is_json:
        data = request.get_json()
        user_id = data.get('id')
        if session.get('loggedIn'):
            if not session.get('profile_loaded'):
                user_id = load_standart_profile(db)
                session['profile_loaded'] = True

    personality, key, pattern = load_results(user_id, db)
    test_requirement, label = load_status(user_id, db,personality, pattern, key)

    data = {
        'personality': list(personality) if personality else [0,0,0,0,0,0,0,0],
        'key': list(key) if key else [0,0,0],
        'pattern': list(pattern) if pattern else [0,0,0],
        'label': label,
        'test_status': test_requirement
    }
    close_connection()
    return jsonify(data)

@app.route('/ManageUsers', methods= ['POST', 'GET'])
def ManageUsers():
    session.pop('profile_loaded', None)
    if session.get('loggedIn'):
        db = getDB()
        cur = db.cursor()
        #Add User
        pressed_button = request.form.get('Button')
        if request.method == "POST" and pressed_button == "addButton":
            add_User(db,cur)
        #Delete User
        if pressed_button == "deleteButton" and request.method == "POST":
           delete_User(db,cur)
        
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
    return redirect(url_for("LogIn"))

@app.route('/ExtendedDashboard')
def ExtendedDashboard():
    if session.get('loggedIn'):
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
        close_connection()
        return render_template("ExtendedDashboard.html", data = datas)
    return redirect(url_for("LogIn"))

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
            session['loggedIn'] = True
            close_connection()
            return redirect(url_for('ExtendedDashboard'))
    close_connection()
    return render_template("LogIn.html")

@app.route('/Persoenlichkeit', methods=['GET', 'POST'])
def Persoenlichkeit():
    return render_template("Persoenlichkeit.html")

@app.route('/ClosingPage', methods=['GET', 'POST'])
def ClosingPage():
    if request.is_json:
        data = request.get_json()
        user_id = data.get('id')
        values = data.get('points', [])
        patternValues = data.get('values', [])
        keyValues = data.get('keyValues', [])
        
        insert_Results(user_id,values,patternValues, keyValues)
    return render_template('Closing.html')

@app.route('/Anmeldung', methods=['GET'])
def Anmeldung():
    return render_template("Anmeldung.html")

@app.route("/Timed_KeySelects")
def Timed_KeySelects():
    return render_template("timed_keyselects.html")

@app.route("/Timed_KeySelects_Closing")
def Timed_KeySelects_Closing():
    return render_template("timed_keyselects_closing.html")

@app.route("/Home")
def Home():
    urls = [url_for("Persoenlichkeit"), url_for("Logicver"), url_for("Timed_KeySelects")]
    return render_template("user_index.html", urls=urls)

@app.route("/Logicver")
def Logicver():
    return render_template("Logicver.html")

@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        data = request.get_json()
        token = data.get('token')
        print(f"Received token: {token}")  # Log the received token
        
        db = getDB()
        cur = db.execute('SELECT ID, Token FROM User')
        all_users = cur.fetchall()
        print(f"All users: {all_users}")  # Log all users and their tokens
        
        cur = db.execute('SELECT ID FROM User WHERE Token = ?', (token,))
        user_id = cur.fetchone()
        print(f"Query result: {user_id}")  # Log the query result
        
        close_connection()
        
        if user_id:
            session['user_id'] = user_id[0]
            return jsonify({'success': True, 'user_id': user_id[0]})
        else:
            return jsonify({'success': False, 'message': 'Invalid token'})
    return jsonify({'success': False, 'message': 'Invalid request'})

def getDB():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE, timeout=10)
    return db

def close_connection():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def generate_token_ID():
    char = string.ascii_letters + string.digits
    random_char = ''.join(random.choice(char) for i in range (6))
    return random_char

def load_standart_profile(db):
    standart = db.execute('SELECT ID FROM User ORDER BY ROWID ASC')
    standart_user_id = standart.fetchone()
    return standart_user_id[0]

def load_results(user_id, db):
    cur = db.execute('SELECT Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv FROM Persoenlichkeit WHERE ID = ?', (user_id,))
    personality = cur.fetchone()
    cur = db.execute('SELECT Richtig, Unbearbeitet FROM Schlüsselaufgabe WHERE ID =?', (user_id,))
    key = cur.fetchone()
    cur = db.execute('SELECT Richtig, Falsch, Unbearbeitet FROM Musteraufgabe WHERE ID =?',(user_id,))
    pattern = cur.fetchone()
    return personality, key, pattern

def load_status(user_id, db,personality, pattern, key):
    cur = db.execute('SELECT Persönlichkeitstest, Musteraufgabe, Schlüsselaufgabe FROM user WHERE ID = ?', (user_id,))
    test_requirements = cur.fetchone()

    test_requirement = {
    'persoenlichkeitstest': "Not required",
    'musteraufgabe': "Not required",
    'schluesselaufgabe': "Not required"
    }

    test_status = {
    'persoenlichkeitstest': "Not finished",
    'musteraufgabe': "Not finished",
    'schluesselaufgabe': "Not finished"  
    }

    if test_requirements:
        if test_requirements[0] == 1:
            test_requirement['persoenlichkeitstest'] = "Required"
            if personality:
                test_status['persoenlichkeitstest'] = "Finished"
        if test_requirements[1] == 1:
            test_requirement['musteraufgabe'] = "Required"
            if pattern:
                test_status['musteraufgabe'] = "Finished"
        if test_requirements[2] == 1:
            test_requirement['schluesselaufgabe'] = "Required"
            if key:
                test_status['schluesselaufgabe'] = "Finished"

    all_required_finished = all(
        test_status[test] == "Finished" 
        for test in test_status 
        if test_requirement[test] == "Required"
    )

    if all_required_finished:
        label = "Finished"
    elif all(test_requirement[test] == "Not required" for test in test_requirement):
        label = "Not required"
    else:
        label = "Not finished"
    return test_requirement, label

def add_User(db, cur):
    name = request.form.get('nachname')
    firstname = request.form.get('vorname')
    personality = request.form.get('personality')
    pattern = request.form.get('pattern')
    key = request.form.get('key')
    if not personality:
        personality = "0"
    if not pattern:
        pattern = "0"
    if not key:
        key = "0"

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

    cur.execute('INSERT INTO USER (Nachname, Vorname, Token, ID, Persönlichkeitstest, Musteraufgabe, Schlüsselaufgabe) VALUES(?,?,?,?,?,?,?)', (name, firstname, token, id,personality,pattern,key))
    db.commit()

def delete_User(db, cur):
    selected_user = request.form.get('user_id')
    cur.execute('DELETE FROM User WHERE ID = ?', (selected_user,))
    cur.execute('DELETE FROM Persoenlichkeit WHERE ID = ?', (selected_user,))
    cur.execute('DELETE FROM Musteraufgabe WHERE ID = ?', (selected_user,))
    cur.execute('DELETE FROM Schlüsselaufgabe WHERE ID = ?', (selected_user,))
    db.commit()

def insert_Results(user_id, values, patternValues, keyValues):
        with getDB() as db:
            cur = db.cursor()
            cur.execute('INSERT OR REPLACE INTO Persoenlichkeit (ID, Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv) VALUES(?,?,?,?,?,?,?,?,?)',
                (user_id, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7]))
            cur.execute('INSERT OR REPLACE INTO Musteraufgabe (ID, Richtig, Falsch, Unbearbeitet) VALUES (?,?,?,?)', 
                (user_id, patternValues[0], patternValues[1], patternValues[2]))
            cur.execute('INSERT OR REPLACE INTO Schlüsselaufgabe (ID, Richtig, Unbearbeitet) VALUES (?,?,?)', 
                (user_id, keyValues[0], keyValues[1]))
            db.commit()

if __name__ == '__main__':
    app.run(debug=True)
