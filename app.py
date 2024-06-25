from flask import Flask, render_template, redirect, url_for, request, g, jsonify
import sqlite3
app = Flask (__name__)
DATABASE = "Datenbank.db"
@app.route('/')
def index():
    db = getDB()
    cur = db.execute('SELECT Nachname, Vorname, ID FROM USER')
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
    return render_template("Dashboard.html", data = datas)

default = True
@app.route('/get_id', methods=['POST'])
def get_id():
    global default
    if request.is_json:
        data = request.get_json()
        user_id = data.get('id')
        default = False
    print(user_id)
    return redirect(url_for('get_data', user_id = user_id))

@app.route('/get_data', methods=['POST','GET'])
def get_data(): 
    global default
    if default:
        user_id = "a3891"
    else:
        user_id = request.args.get('user_id')
    print("test")
    print(user_id)
    db = getDB()
    cur = db.execute('SELECT Pünktlich, Durchsetzungsfähig, Aufgabenorientiert, Ruhig, Direkt, Freundlich, Spontan, Impulsiv FROM Persoenlichkeit WHERE ID = ?', (user_id,))
    values = cur.fetchone()
    data_for_Radar = {
        'values': list(values)
    }
    print(data_for_Radar['values'])
    close_connection()
    return jsonify(data_for_Radar)

@app.route('/CreateTest')
def CreateTest():
    return render_template("CreateTest.html")

@app.route('/ExtendedDashboard')
def ExtendedDashboard():
    return render_template("ExtendedDashboard.html")

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

def getDB():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db
def close_connection():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
