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
    data = normalize(form, ["id_project", "pagename", "filecontent"])
    sql = "INSERT INTO projectfiles (id_project, pagename, filecontent) VALUES (%s,%s,%s)"
    cursor.execute(sql, (
        data["id_project"],
        data["pagename"],
        data["filecontent"]
    ))
    db.commit()

    projectfile_id = cursor.lastrowid
    json_response({
        "status": "ok",
        "id": projectfile_id
    })

# SELECT (getbyid)
elif action == "getbyid":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM projectfiles WHERE id=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    projectfile = cursor.fetchone()
    json_response(projectfile if projectfile else {"error": "file don't exists"})

# SELECT (getbypagename)
elif action == "getbypagename":
    data = normalize(form, ["pagename"])
    sql = "SELECT * FROM projectfiles WHERE pagename=%s"
    cursor.execute(sql, (
        data["pagename"],
    ))
    projectfile = cursor.fetchone()
    json_response(projectfile if projectfile else {"error": "file don't exists"})

# SELECT (getbyproject)
elif action == "getbyproject":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM projectfiles WHERE id_project=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    projectfiles = cursor.fetchall()
    json_response(projectfiles if projectfiles else {"error": "files don't exists"})

# UPDATE (filecontent)
elif action == "filecontent":
    data = normalize(form, ["filecontent", "id"])
    sql = "UPDATE projectfiles SET filecontent=%s WHERE id=%s"
    cursor.execute(sql, (
        data["filecontent"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebyid)
elif action == "deletebyid":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM projectfiles WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebypagename)
elif action == "deletebypagename":
    data = normalize(form, ["pagename"])
    cursor.execute("DELETE FROM projectfiles WHERE pagename=%s", (data["pagename"],))
    db.commit()
    json_response({"status": "ok"})