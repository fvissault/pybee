#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *


form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

session = require_auth()

# SELECT (getByName)
if action == "getByName":
    data = normalize(form, ["name"])
    sql = "SELECT * FROM models WHERE name=%s"
    cursor.execute(sql, (
        data["name"],
    ))
    model = cursor.fetchone()
    if model:
        credential = clean_row(model)
    json_response(model if model is not None else {"error": "Model by name don't exists"})

# SELECT (getById)
elif action == "getById":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM models WHERE id=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    model = cursor.fetchone()
    if model:
        credential = clean_row(model)
    json_response(model if model is not None else {"error": "Model by id don't exists"})

# CREATE
elif action == "create":
    data = normalize(form, ["id_project", "name", "description"])
    sql = "INSERT INTO models (id_project, name, descrption, modelcontent) VALUES (%s,%s,%s,'{}')"
    cursor.execute(sql, (
        data["id_project"],
        data["name"],
        data["description"],
    ))
    db.commit()
    json_response({"status": "ok"})

# CHANGE CONTACT EMAIL
elif action == "change-description":
    data = normalize(form, ["description", "id"])
    sql = "UPDATE models SET description=%s WHERE id=%s"
    cursor.execute(sql, (
        data["description"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})

# SELECT (models of project)
elif action == "list":
    data = normalize(form, ["id_project"])
    sql = "SELECT * FROM models WHERE id_project=%s"
    cursor.execute(sql, (
        data["id_project"],
    ))
    models = cursor.fetchall()
    models = [clean_row(c) for c in models]
    json_response(models if models is not None else {"error": "Models by project don't exists"})

# DELETE
elif action == "delete":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM models WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})