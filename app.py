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

loggedIn = False

@app.route('/')
def index():
    global loggedIn
    loggedIn = False
    close_connection()
    return render_template("Anmeldung.html")

@app.route('/Dashboard')
def Dashboard():
    return render_template("Dashboard.html")

@app.route('/Test_Results', methods=['POST','GET'])
def Data():
    global loggedIn 
    db = getDB()
    standart = db.execute('SELECT ID FROM User ORDER BY ROWID ASC')
    standart_user_id = standart.fetchone()
    if request.is_json:
            data = request.get_json()
            user_id = data.get('id')
    # elif loggedIn:
    #     print("test")
    #     user_id = standart_user_id[0]
    else: 
        user_id = standart_user_id[0]
    cur = db.execute('SELECT Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv FROM Persoenlichkeit WHERE ID = ?', (user_id,))
    personality = cur.fetchone()
    cur = db.execute('SELECT Richtig, Unbearbeitet FROM Schlüsselaufgabe WHERE ID =?', (user_id,))
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
    if loggedIn:
        db = getDB()
        cur = db.cursor()
        #Add User
        pressed_button = request.form.get('Button')
        if request.method == "POST" and pressed_button == "addButton":
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
        #Delete User
        if pressed_button == "deleteButton" and request.method == "POST":
            selected_user = request.form.get('user_id')
            cur.execute('DELETE FROM User WHERE ID = ?', (selected_user,))
            cur.execute('DELETE FROM Persoenlichkeit WHERE ID = ?', (selected_user,))
            cur.execute('DELETE FROM Musteraufgabe WHERE ID = ?', (selected_user,))
            cur.execute('DELETE FROM Schlüsselaufgabe WHERE ID = ?', (selected_user,))
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
    return redirect(url_for("LogIn"))

@app.route('/ExtendedDashboard')
def ExtendedDashboard():
    if loggedIn:
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
    global loggedIn
    if request.is_json:
        data = request.get_json()
        username = data.get('username')
        hashed_pw = data.get('password')
        db = getDB()
        cur = db.execute('SELECT Passwort FROM Ausbilder WHERE EMail = ?', (username,))
        saved_password = cur.fetchone()
        if saved_password and saved_password[0] == hashed_pw:
            loggedIn = True
            close_connection()
            return redirect(url_for('ExtendedDashboard'))
    close_connection()
    return render_template("LogIn.html")

@app.route('/Persoenlichkeit', methods=['GET', 'POST'])
def Persoenlichkeit():
    return render_template("Persoenlichkeit.html")

@app.route('/LandingPage', methods=['GET', 'POST'])
def LandingPage():
    if request.is_json:
        data = request.get_json()
        user_id = data.get('id')
        values = data.get('points', [])
        patternValues = data.get('values', [])
        keyValues = data.get('keyValues', [])
        with getDB() as db:
            cur = db.cursor()
            cur.execute('INSERT INTO Persoenlichkeit (ID, Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv) VALUES(?,?,?,?,?,?,?,?,?)',
                (user_id, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7]))
            cur.execute('INSERT INTO Musteraufgabe (ID, Richtig, Falsch, Unbearbeitet) VALUES (?,?,?,?)', 
                (user_id, patternValues[0], patternValues[1], patternValues[2]))
            cur.execute('INSERT INTO Schlüsselaufgabe (ID, Richtig, Unbearbeitet) VALUES (?,?,?)', 
                (user_id, keyValues[0], keyValues[1]))
            db.commit()
    return render_template('LandingPage.html')

# @app.route('/save_results', methods=['POST'])
# def save_results():
#     if request.is_json:
#         data = request.get_json()
#         user_id = session.get('user_id')
#         db = getDB()
#         cur = db.cursor()
#         cur.execute('INSERT INTO Musteraufgabe (ID, Richtig, Falsch, Unbearbeitet) VALUES (?,?,?,?)', 
#             (user_id, data['richtig'], data['falsch'], data['unbearbeitet']))
#         db.commit()
#         close_connection()
#         return jsonify({'success': True})
#     return jsonify({'success': False})

@app.route('/Anmeldung', methods=['GET'])
def Anmeldung():
    return render_template("Anmeldung.html")

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

if __name__ == '__main__':
    app.run(debug=True)
