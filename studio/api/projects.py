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
        data = normalize(form, ["name", "description", "id_entity", "owner"])
        sql = "INSERT INTO projects (name, description, id_entity, owner, active) VALUES (%s,%s,%s,%s,0)"
        cursor.execute(sql, (
            data["name"],
            data["description"],
            data["id_entity"],
            data["owner"]
        ))
        db.commit()

        project_id = cursor.lastrowid
        json_response({
            "status": "ok",
            "id": project_id
        })
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getprojectbyid)
elif action == "getprojectbyid":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM projects WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        project = cursor.fetchone()
        if project:
            project = clean_row(project)
        json_response(project if project is not None else {"error": "project by id don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (getprojectandentity)
elif action == "getprojectandentity":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT DISTINCT a.name AS project_name, b.name AS entity_name, b.id AS entity_id FROM projects AS a, entities AS b WHERE a.id=%s AND a.id_entity=b.id"
        cursor.execute(sql, (
            data["id"],
        ))
        project = cursor.fetchone()
        if project:
            project = clean_row(project)
        json_response(project if project is not None else {"error": "project and entity by id don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (projects from user)
elif action == "getproject":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT a.*, b.firstname as owner_fn, b.lastname as owner_ln, c.name as entity_name, c.contact_email FROM projects as a, users as b, entities as c WHERE a.id=%s AND b.id=a.owner and a.id_entity = c.id"
        cursor.execute(sql, (
            data["id"],
        ))
        project = cursor.fetchone()
        if project:
            project = clean_row(project)
        json_response(project if project is not None else {"error": "project by user don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# SELECT (projects from user)
elif action == "list":
    try:
        data = normalize(form, ["userid"])
        sql = "SELECT a.* FROM projects as a, projects_users as b WHERE b.id_user=%s AND a.active=1"
        cursor.execute(sql, (
            data["userid"],
        ))
        projects = cursor.fetchall()
        projects = [clean_row(c) for c in projects]
        json_response(projects if projects is not None else {"error": "projects by user don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# UPDATE (active/deactive)
elif action == "updateactive":
    try:
        data = normalize(form, ["active", "id"])
        sql = "UPDATE projects SET active=%s WHERE id=%s"
        cursor.execute(sql, (
            data["active"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})

# DELETE
elif action == "delete":
    try:
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM projects WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})
