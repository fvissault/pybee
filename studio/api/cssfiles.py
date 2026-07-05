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
    data = normalize(form, ["id_project", "name", "content"])
    sql = "INSERT INTO cssfiles (id_project, name, content) VALUES (%s,%s,%s)"
    cursor.execute(sql, (
        data["id_project"],
        data["name"],
        data["content"]
    ))
    db.commit()

    cssfile_id = cursor.lastrowid
    json_response({
        "status": "ok",
        "id": cssfile_id
    })

# SELECT (getbyid)
elif action == "getbyid":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM cssfiles WHERE id=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    cssfile = cursor.fetchone()
    json_response(cssfile if cssfile else {"error": "file don't exists"})

# SELECT (getbyname)
elif action == "getbyname":
    data = normalize(form, ["name"])
    sql = "SELECT * FROM cssfiles WHERE name=%s"
    cursor.execute(sql, (
        data["name"],
    ))
    cssfile = cursor.fetchone()
    json_response(cssfile if cssfile else {"error": "file don't exists"})

# SELECT (getbyproject)
elif action == "getbyproject":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM cssfiles WHERE id_project=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    cssfiles = cursor.fetchall()
    json_response(cssfiles if cssfiles else {"error": "files don't exists"})

# UPDATE (filecontent)
elif action == "updatecontent":
    data = normalize(form, ["content", "id"])
    sql = "UPDATE cssfiles SET content=%s WHERE id=%s"
    cursor.execute(sql, (
        data["content"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebyid)
elif action == "deletebyid":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM cssfiles WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebypagename)
elif action == "deletebyname":
    data = normalize(form, ["name"])
    cursor.execute("DELETE FROM cssfiles WHERE name=%s", (data["name"],))
    db.commit()
    json_response({"status": "ok"})