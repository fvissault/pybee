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
    try:
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
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbyid)
elif action == "getbyid":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM projectfiles WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        projectfile = cursor.fetchone()
        if projectfile:
            projectfile = clean_row(projectfile)
        json_response(projectfile if projectfile is not None else {"error": "project file by id don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbypagename)
elif action == "getbypagename":
    try:
        data = normalize(form, ["pagename"])
        sql = "SELECT * FROM projectfiles WHERE pagename=%s"
        cursor.execute(sql, (
            data["pagename"],
        ))
        projectfile = cursor.fetchone()
        if projectfile:
            projectfile = clean_row(projectfile)
        json_response(projectfile if projectfile is not None else {"error": "project file by pagename don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbyproject)
elif action == "getbyproject":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM projectfiles WHERE id_project=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        projectfiles = cursor.fetchall()
        projectfiles = [clean_row(c) for c in projectfiles]
        json_response(projectfiles if projectfiles is not None else {"error": "project files by project id don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# UPDATE (filecontent)
elif action == "filecontent":
    try:
        data = normalize(form, ["filecontent", "id"])
        sql = "UPDATE projectfiles SET filecontent=%s WHERE id=%s"
        cursor.execute(sql, (
            data["filecontent"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (deletebyid)
elif action == "deletebyid":
    try:
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM projectfiles WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (deletebypagename)
elif action == "deletebypagename":
    try:
        data = normalize(form, ["pagename"])
        cursor.execute("DELETE FROM projectfiles WHERE pagename=%s", (data["pagename"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})
