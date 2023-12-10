from flask import *

member = Blueprint("member_page", __name__, template_folder="templates")


@member.route("/")
def index():
    return render_template("member.html")
