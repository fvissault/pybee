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
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyid)
elif action == "getbyid":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM cssfiles WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        cssfile = cursor.fetchone()
        if cssfile:
            cssfile = clean_row(cssfile)
        json_response(cssfile if cssfile is not None else {"error": "css file by id don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyname)
elif action == "getbyname":
    try:
        data = normalize(form, ["name"])
        sql = "SELECT * FROM cssfiles WHERE name=%s"
        cursor.execute(sql, (
            data["name"],
        ))
        cssfile = cursor.fetchone()
        if cssfile:
            cssfile = clean_row(cssfile)
        json_response(cssfile if cssfile is not None else {"error": "css file by name don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyproject)
elif action == "getbyproject":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM cssfiles WHERE id_project=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        cssfiles = cursor.fetchall()
        cssfiles = [clean_row(c) for c in cssfiles]
        json_response(cssfiles if cssfiles is not None else {"error": "css files by project don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# UPDATE (filecontent)
elif action == "updatecontent":
    try:
        data = normalize(form, ["content", "id"])
        sql = "UPDATE cssfiles SET content=%s WHERE id=%s"
        cursor.execute(sql, (
            data["content"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# DELETE (deletebyid)
elif action == "deletebyid":
    try:
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM cssfiles WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# DELETE (deletebypagename)
elif action == "deletebyname":
    try:
        data = normalize(form, ["name"])
        cursor.execute("DELETE FROM cssfiles WHERE name=%s", (data["name"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})
