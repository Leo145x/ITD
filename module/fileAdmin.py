from flask import *
from module.config import socketio

fileAdmin = Blueprint("fileAdmin", __name__, static_folder="templates")


@fileAdmin.route("/fileInfoPort", methods=["PUT"])
def receive_file_info():
    data = request.get_json()

    if data.get("ok"):
        client_file_name = data.get("client_file_name")
        file_link = data.get("file_uuid")
        file_size = data.get("file_size")
        file_label = data.get("file_label")
        id = data.get("id")
        try:
            con = current_app.connection_pool.get_connection()
            with con.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO
                        video(member_id, video_name, video_link, video_label, video_size)
                    VALUES
                        (%s, %s, %s, %s, %s)
                    """,
                    (
                        id,
                        client_file_name,
                        file_link,
                        file_label,
                        file_size,
                    ),
                )
            con.commit()
            socketio.emit(
                "file_processed", {"user_id": id, "file_name": client_file_name}
            )
            return jsonify({"ok": True, "message": "Data inserted successfully"})
        except Exception as e:
            print("Receive file information error:", str(e))
            return jsonify({"ok": False, "message": str(e)}), 500
        finally:
            if con:
                con.close()
    else:
        return jsonify({"ok": False, "message": "Invalid data"}), 400


@fileAdmin.route("/fileSummary", methods=["PUT"])
def file_summary():
    data = request.get_json()
    user_id = data.get("id")

    try:
        con = current_app.connection_pool.get_connection()
        with con.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    video_name, video_link, video_size, video_label, create_time
                FROM
                    video
                WHERE
                    member_id = %s
                """,
                (user_id,),
            )
            result = cursor.fetchall()
        if not result:
            raise Exception("Empty file")
        else:
            file_info = {}
            for index, row in enumerate(result):
                file_info[index] = {
                    "video_name": row[0],
                    "video_link": row[1],
                    "video_size": row[2],
                    "video_label": row[3],
                    "create_time": row[4].strftime("%Y-%m-%d"),
                }
            return make_response({"ok": True, "data": file_info})
    except Exception as e:
        return make_response({"ok": False, "message": str(e)})
    finally:
        if con:
            con.close()
