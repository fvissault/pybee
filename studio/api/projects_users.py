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
        data = normalize(form, ["id_user", "id_project"])
        sql = "INSERT INTO projects_users (id_user, id_project) VALUES (%s,%s)"
        cursor.execute(sql, (
            data["id_user"],
            data["id_project"]
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (users from project)
elif action == "listusers":
    try:
        data = normalize(form, ["projectid"])
        sql = "SELECT DISTINCT a.* FROM users as a, projects_users as b WHERE b.id_project=%s and a.id=b.id_user"
        cursor.execute(sql, (
            data["projectid"],
        ))
        users = cursor.fetchall()
        users = [clean_row(c) for c in users]
        json_response(users if users is not None else {"error": "users by project don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (users from project without owner)
elif action == "listuserswithoutowner":
    try:
        data = normalize(form, ["projectid"])
        sql = "SELECT DISTINCT a.* FROM users as a, projects_users as b, projects as c WHERE b.id_project=%s and a.id=b.id_user and c.owner<>a.id"
        cursor.execute(sql, (
            data["projectid"],
        ))
        users = cursor.fetchall()
        users = [clean_row(c) for c in users]
        json_response(users if users is not None else {"error": "users by project without owner don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (projects from user)
elif action == "list":
    try:
        data = normalize(form, ["userid"])
        sql = "SELECT DISTINCT a.* FROM projects as a, projects_users as b WHERE b.id_user=%s"
        cursor.execute(sql, (
            data["userid"],
        ))
        projects = cursor.fetchall()
        projects = [clean_row(c) for c in projects]
        json_response(projects if projects is not None else {"error": "projects by user don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# UPDATE
elif action == "update":
    try:
        data = normalize(form, ["id_user", "id_project", "id"])
        sql = "UPDATE projects_users SET id_user=%s, id_project=%s WHERE id=%s"
        cursor.execute(sql, (
            data["id_user"],
            data["id_project"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (withid)
elif action == "delete":
    try:
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM projects_users WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (withid)
elif action == "deletebyproject":
    try:
        data = normalize(form, ["idproject"])
        cursor.execute("DELETE FROM projects_users WHERE id_project=%s", (data["idproject"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE (by id_project and id_user)
elif action == "deletebyprojectanduser":
    try:
        data = normalize(form, ["idproject", "iduser"])
        cursor.execute("DELETE FROM projects_users WHERE id_project=%s and id_user=%s", (data["idproject"], data["iduser"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})
