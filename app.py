from flask import *

app = Flask(__name__)


@app.route("/")
def user_index():
    return render_template("user_index.html")

@app.route("/persoenlichkeit")
def personality():
    return render_template("Persoenlichkeit.html")
