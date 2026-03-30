#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *

session = require_auth()

data = get_post_data()
action = data.get("action")

db = get_db()
cursor = db.cursor(dictionary=True)

# CREATE
if action == "create":
    sql = "INSERT INTO projects_users (id_user, id_project) VALUES (%s,%s)"
    cursor.execute(sql, (
        data["id_user"],
        data["id_project"]
    ))
    db.commit()
    json_response({"status": "ok"})

# SELECT (projects from user)
elif action == "list":
    sql = "SELECT a.* FROM projects as a, projects_users as b WHERE b.id_user=%s AND a.active=1"
    cursor.execute(sql, (
        data["userid"],
    ))
    projects = cursor.fetchall()
    json_response(projects)

# UPDATE
elif action == "update":
    sql = "UPDATE projects_users SET id_user=%s, id_project=%s WHERE id=%s"
    cursor.execute(sql, (
        data["id_user"],
        data["id_project"],
        data["id"]
    ))
    db.commit()
    json_response({"status": "ok"})

# DELETE
elif action == "delete":
    cursor.execute("DELETE FROM projects_users WHERE id=%s", (data["id"]))
    db.commit()
    json_response({"status": "ok"})