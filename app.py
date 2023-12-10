from flask import *
from dotenv import load_dotenv
from App.mysqlPool import Mysql
from module.member import member
from module.api import api
from module.fileAdmin import fileAdmin
from module.config import socketio
import os

app = Flask(__name__, static_folder="static", static_url_path="/")
socketio.init_app(app)

# 先初始化 socket 再註冊 blueprint
app.register_blueprint(member, url_prefix="/member")
app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(fileAdmin, url_prefix="/fileAdmin")
mysql_pool = Mysql()
connection_pool = mysql_pool.create_connect_pool()
app.connection_pool = connection_pool


@app.route("/")
def index():
    return render_template("index.html")
    

if __name__ == "__main__":
    app.secret_key = os.getenv("FLASK_SECRET_KEY")
    app.json.ensure_ascii = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.config["JSON_SORT_KEYS"] = False
    # app.run(host="0.0.0.0", port=3000, debug=True)
    socketio.run(app, host="0.0.0.0", port=3000, debug=True)
    # socketio.run(app, host="127.0.0.1", port=3000, debug=True)
