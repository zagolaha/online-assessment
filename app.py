from flask import Flask, render_template, redirect, url_for, request, g, jsonify, session
import sqlite3
import random
import string
import os

app = Flask(__name__, template_folder='templates')
app.secret_key = '123'
DATABASE = "Datenbank.db"

loggedIn = False

def init_db():
    with app.app_context():
        db = get_db()
        with open('schema.sql', 'r') as f:
            db.executescript(f.read())
        db.commit()

DATABASE = os.path.join(os.path.dirname(__file__), "Datenbank.db")

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def close_connection(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.executescript(f.read())
        db.commit()

@app.route('/')
def index():
    global loggedIn
    loggedIn = False
    close_connection()
    return '''
    <h1>Welcome</h1>
    <p><a href="/ExtendedDashboard">Go to Extended Dashboard</a></p>
    <p><a href="/anmeldung">Go to Anmeldung</a></p>
    '''

@app.route('/get_data', methods=['POST', 'GET'])
def get_data():
    db = get_db()
    standart = db.execute('SELECT ID FROM User ORDER BY ROWID ASC')
    standart_user_id = standart.fetchone()
    if request.is_json:
        data = request.get_json()
        user_id = data.get('id')
    elif session.get('user_id'):
        user_id = session.get('user_id')
    else:
        user_id = standart_user_id[0]

    cur = db.execute('SELECT Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv FROM Persoenlichkeit WHERE ID = ?', (user_id,))
    personality = cur.fetchone()
    cur = db.execute('SELECT Richtig, Falsch, Unbearbeitet FROM Schlüsselaufgabe WHERE ID =?', (user_id,))
    key = cur.fetchone()
    cur = db.execute('SELECT Richtig, Falsch, Unbearbeitet FROM Musteraufgabe WHERE ID =?', (user_id,))
    pattern = cur.fetchone()
    data = {
        'personality': list(personality) if personality else [0, 0, 0, 0, 0, 0, 0, 0],
        'key': list(key) if key else [0, 0, 0],
        'pattern': list(pattern) if pattern else [0, 0, 0],
        'label': "Finished" if personality and key and pattern else "Not started" if not personality and not key and not pattern else "Not finished"
    }
    close_connection()
    return jsonify(data)

@app.route('/ManageUsers', methods=['POST', 'GET'])
def ManageUsers():
    db = get_db()
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
    return render_template("ManageUsers.html", data=datas)

@app.route('/ExtendedDashboard')
def ExtendedDashboard():
    if loggedIn:
        db = get_db()
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
        return render_template("ExtendedDashboard.html", data=datas)
    return redirect(url_for("LogIn"))

@app.route('/LogIn', methods=['GET', 'POST'])
def LogIn():
    global loggedIn
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        db = get_db()
        cur = db.execute('SELECT Passwort, ID FROM Ausbilder WHERE EMail = ?', (username,))
        result = cur.fetchone()
        if result and result[0] == password:
            session['user_id'] = result[1]
            loggedIn = True
            return redirect(url_for('ExtendedDashboard'))
        else:
            return render_template("LogIn.html", error=True)
    return render_template("LogIn.html")

@app.route('/Persoenlichkeit', methods=['GET', 'POST'])
def Persoenlichkeit():
    return render_template("Persoenlichkeit.html")

@app.route('/LandingPage', methods=['GET', 'POST'])
def LandingPage():
    user_id = session.get('user_id')
    db = get_db()
    if request.is_json:
        points = request.get_json()
        values = points.get('points', [])
        patternValues = points.get('values', [])
        keyValues = points.get('keyValues', [])
        cur = db.cursor()
        cur.execute('INSERT INTO Persoenlichkeit (ID, Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv) VALUES(?,?,?,?,?,?,?,?,?)',
            (user_id, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7]))
        cur.execute('INSERT INTO Musteraufgabe (ID, Richtig, Falsch, Unbearbeitet) VALUES (?,?,?,?)', 
            (user_id, patternValues[0], patternValues[1], patternValues[2]))
        cur.execute('INSERT INTO Schlüsselaufgabe (ID, Richtig, Falsch, Unbearbeitet) VALUES (?,?,?,?)', 
            (user_id, keyValues[0], keyValues[1], keyValues[2]))
        db.commit()
    return render_template('LandingPage.html')

@app.route('/validate_token', methods=['POST'])
def validate_token():
    input_token = request.form.get('token', '').strip()
    print(f"Received token: {input_token}")
    
    try:
        db = get_db()
        cur = db.execute('SELECT ID, Token FROM User')
        all_tokens = cur.fetchall()
        print(f"All tokens in database: {[row['Token'] for row in all_tokens]}")
        
        for row in all_tokens:
            if input_token.lower() == row['Token'].lower():
                user_id = row['ID']
                session['user_id'] = user_id
                return jsonify({'success': True, 'user_id': user_id, 'token': input_token})
        
        return jsonify({'success': False, 'message': 'Invalid token'})

    except Exception as e:
        print(f"Error in validate_token: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


#@app.route('/dashboard')
#def dashboard():
    #return render_template('Dashboard.html')

@app.route('/anmeldung')
def anmeldung():
    return render_template('Anmeldung.html')

@app.route('/user_login', methods=['GET', 'POST'])
def user_login():
    if request.method == 'POST':
        token = request.form.get('token')
        db = get_db()
        cur = db.execute('SELECT ID, Token FROM User WHERE Token = ?', (token,))
        result = cur.fetchone()
        if result:
            user_id, token = result
            session['user_id'] = user_id
            return jsonify({'success': True, 'user_id': user_id, 'token': token})
        return jsonify({'success': False})
    return render_template('user_login.html')

@app.route('/store_user_data', methods=['POST'])
def store_user_data():
    user_id = request.form.get('user_id')
    token = request.form.get('token')
    if user_id and token:
        session['user_id'] = user_id
        return jsonify({'success': True})
    return jsonify({'success': False})

@app.route('/user_dashboard')
def user_dashboard():
    user_id = session.get('user_id')
    if user_id:
        return render_template('user_dashboard.html', user_id=user_id)
    return redirect(url_for('user_login'))

def generate_token_ID():
    char = string.ascii_letters + string.digits
    random_char = ''.join(random.choice(char) for i in range(6))
    return random_char

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def close_connection(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True)
