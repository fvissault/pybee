#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *

session = require_auth()

form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

# CREATE
if action == "create":
    data = normalize(form, ["id_project", "name", "content", "content_type"])
    sql = "INSERT INTO jsfiles (id_project, content_type, name, content) VALUES (%s,%s,%s,%s)"
    cursor.execute(sql, (
        data["id_project"],
        data["content_type"],
        data["name"],
        data["content"]
    ))
    db.commit()

    jsfile_id = cursor.lastrowid
    json_response({
        "status": "ok",
        "id": jsfile_id
    })

# SELECT (getbyid)
elif action == "getbyid":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM jsfiles WHERE id=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    jsfile = cursor.fetchone()
    json_response(jsfile if jsfile else {"error": "file don't exists"})

# SELECT (getbyname)
elif action == "getbyname":
    data = normalize(form, ["name"])
    sql = "SELECT * FROM jsfiles WHERE name=%s"
    cursor.execute(sql, (
        data["name"],
    ))
    jsfile = cursor.fetchone()
    json_response(jsfile if jsfile else {"error": "file don't exists"})

# SELECT (getbyproject)
elif action == "getbyproject":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM jsfiles WHERE id_project=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    jsfiles = cursor.fetchall()
    json_response(jsfiles if jsfiles else {"error": "files don't exists"})

# SELECT (getbytype)
elif action == "getbytype":
    data = normalize(form, ["id", "content_type"])
    sql = "SELECT * FROM jsfiles WHERE id_project=%s and content_type=%s"
    cursor.execute(sql, (
        data["id"],
        data["content_type"],
    ))
    jsfiles = cursor.fetchall()
    json_response(jsfiles if jsfiles else {"error": "files don't exists"})

# UPDATE (filecontent)
elif action == "updatecontent":
    data = normalize(form, ["content", "id"])
    sql = "UPDATE jsfiles SET content=%s WHERE id=%s"
    cursor.execute(sql, (
        data["content"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebyid)
elif action == "deletebyid":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM jsfiles WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebypagename)
elif action == "deletebyname":
    data = normalize(form, ["name"])
    cursor.execute("DELETE FROM jsfiles WHERE name=%s", (data["name"],))
    db.commit()
    json_response({"status": "ok"})