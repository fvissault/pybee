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
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbyid)
elif action == "getbyid":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM jsfiles WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        jsfile = cursor.fetchone()
        if jsfile:
            jsfile = clean_row(jsfile)
        json_response(jsfile if jsfile else {"error": "js file by id don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbyname)
elif action == "getbyname":
    try:
        data = normalize(form, ["name"])
        sql = "SELECT * FROM jsfiles WHERE name=%s"
        cursor.execute(sql, (
            data["name"],
        ))
        jsfile = cursor.fetchone()
        if jsfile:
            jsfile = clean_row(jsfile)
        json_response(jsfile if jsfile is not None else {"error": "js file by name don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbyproject)
elif action == "getbyproject":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM jsfiles WHERE id_project=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        jsfiles = cursor.fetchall()
        jsfiles = [clean_row(c) for c in jsfiles]
        json_response(jsfiles if jsfiles is not None else {"error": "js files by project don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getbytype)
elif action == "getbytype":
    try:
        data = normalize(form, ["id", "content_type"])
        sql = "SELECT * FROM jsfiles WHERE id_project=%s and content_type=%s"
        cursor.execute(sql, (
            data["id"],
            data["content_type"],
        ))
        jsfiles = cursor.fetchall()
        jsfiles = [clean_row(c) for c in jsfiles]
        json_response(jsfiles if jsfiles is not None else {"error": "js files by type don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# UPDATE (filecontent)
elif action == "updatecontent":
    try:
        data = normalize(form, ["content", "id"])
        sql = "UPDATE jsfiles SET content=%s WHERE id=%s"
        cursor.execute(sql, (
            data["content"],
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
        cursor.execute("DELETE FROM jsfiles WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (deletebypagename)
elif action == "deletebyname":
    try:
        data = normalize(form, ["name"])
        cursor.execute("DELETE FROM jsfiles WHERE name=%s", (data["name"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})
