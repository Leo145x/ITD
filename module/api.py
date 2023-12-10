from flask import *
import jwt
from jwt import ExpiredSignatureError
import datetime

api = Blueprint("api", __name__, static_folder="templates")


@api.route("/signin", methods=["PUT"])
def signin():
    email = request.form.get("email")
    password = request.form.get("password")
    try:
        con = current_app.connection_pool.get_connection()
        cursor = con.cursor()
        cursor.execute(
            """
            SELECT
                id, name, email, password
            FROM
                member_info
            WHERE
                email=%s
            """,
            (email,),
        )
        member_info = cursor.fetchone()
        if member_info is None:
            raise Exception("此帳號尚未註冊")
        elif member_info[3] != password:
            raise Exception("密碼錯誤")
        else:
            token = jwt.encode(
                {
                    "id": member_info[0],
                    "name": member_info[1],
                    "email": member_info[2],
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
                },
                key=current_app.secret_key,
                algorithm="HS256",
            )
            return make_response({"ok": True, "itd_token": token})
    except Exception as e:
        return make_response({"ok": False, "message": str(e)})
    finally:
        cursor.close()
        if con:
            con.close()


@api.route("/signup", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    try:
        con = current_app.connection_pool.get_connection()
        with con.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    email
                FROM
                    member_info
                WHERE email=%s
                """,
                (email,),
            )
            account = cursor.fetchone()
            if account:
                raise Exception("email 已存在")
            cursor.execute(
            """
            INSERT INTO
                member_info(name, email, password)
            VALUES
                (%s, %s, %s)
            """,
            (
                name,
                email,
                password,
            ),
            )
        con.commit()
        return make_response({"ok": True, "message": "註冊成功"})
    except Exception as e:
        return make_response({"ok": False, "message": str(e)}, 400)

    finally:
        if con:
            con.close()


@api.route("/verify")
def verify():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return make_response({"ok": False, "message": "未經授權的 token"}, 401)

    token = auth_header.split(" ")[1]
    try:
        decode = jwt.decode(token, key=current_app.secret_key, algorithms="HS256")
    except ExpiredSignatureError:
        return make_response({"ok": False, "data": None})

    except Exception:
        return make_response({"ok": False, "data": None})

    return make_response(
        {
            "ok": True,
            "data": {
                "id": decode["id"],
                "name": decode["name"],
                "email": decode["email"],
            },
        },
        200,
    )
