#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *

ROOT = os.path.dirname(os.path.dirname(__file__))
def debug(*args):
    with open(os.path.join(ROOT, "logs", "debug.log"), "a", encoding="utf8") as f:
        print(*args, file=f)

session = require_auth()

form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

# CREATE
if action == "create":
    data = normalize(form, ["id_project", "name", "servername", "databasename", "username", "userpass"])
    sql = "INSERT INTO models_credentials (id_project, name, servername, databasename, username, userpass) VALUES (%s,%s,%s,%s,%s,%s)"
    cursor.execute(sql, (
        data["id_project"],
        data["name"],
        data["servername"],
        data["databasename"],
        data["username"],
        data["userpass"],
    ))
    db.commit()

    models_credentials_id = cursor.lastrowid
    json_response({
        "status": "ok",
        "id": models_credentials_id
    })

# SELECT (getbyid)
elif action == "getbyid":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM models_credentials WHERE id=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    credential = cursor.fetchone()
    if credential:
        credential = clean_row(credential)
    json_response(credential if credential is not None else {"error": "credential by id don't exists"})

# SELECT (getbyname)
elif action == "getbyname":
    data = normalize(form, ["name"])
    sql = "SELECT * FROM models_credentials WHERE name=%s"
    cursor.execute(sql, (
        data["name"],
    ))
    credential = cursor.fetchone()
    if credential:
        credential = clean_row(credential)
    json_response(credential if credential is not None else {"error": "credential by name don't exists"})

# SELECT (getbyproject)
elif action == "getbyproject":
    data = normalize(form, ["id"])
    sql = "SELECT * FROM models_credentials WHERE id_project=%s"
    cursor.execute(sql, (
        data["id"],
    ))
    credentials = cursor.fetchall()
    credentials = [clean_row(c) for c in credentials]

    debug("action =", action)
    debug("sql =", sql)
    debug("id =", data["id"])
    debug("credentials =", credentials)

    json_response(credentials if credentials is not None else {"error": "credentials by project don't exists"})

# UPDATE (credentials)
elif action == "update":
    data = normalize(form, ["name", "servername", "databasename", "username", "userpass", "id"])
    sql = "UPDATE models_credentials SET name=%s, servername=%s, databasename=%s, username=%s, userpass=%s WHERE id=%s"
    cursor.execute(sql, (
        data["name"],
        data["servername"],
        data["databasename"],
        data["username"],
        data["userpass"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebyid)
elif action == "deletebyid":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM models_credentials WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})

# DELETE (deletebypagename)
elif action == "deletebyname":
    data = normalize(form, ["name"])
    cursor.execute("DELETE FROM models_credentials WHERE name=%s", (data["name"],))
    db.commit()
    json_response({"status": "ok"})