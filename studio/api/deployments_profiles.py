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
    try:
        data = normalize(form, ["id_project", "name", "description"])
        sql = "INSERT INTO deployments_profiles (id_project, name, description, profilecontent) VALUES (%s,%s,%s,'{}')"
        cursor.execute(sql, (
            data["id_project"],
            data["name"],
            data["description"],
        ))
        db.commit()

        json_response({"status": "ok", "id": cursor.lastrowid})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyid)
elif action == "getbyid":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM deployments_profiles WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        profile = cursor.fetchone()
        if profile:
            profile = clean_row(profile)
        json_response(profile if profile is not None else {"error": "deployment profile by id don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyname)
elif action == "getbyname":
    try:
        data = normalize(form, ["name"])
        sql = "SELECT * FROM deployments_profiles WHERE name=%s"
        cursor.execute(sql, (
            data["name"],
        ))
        profile = cursor.fetchone()
        if profile:
            profile = clean_row(profile)
        json_response(profile if profile is not None else {"error": "deployment profile by name don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getbyproject)
elif action == "getbyproject":
    try:
        data = normalize(form, ["id_project"])
        sql = "SELECT * FROM deployments_profiles WHERE id_project=%s"
        cursor.execute(sql, (
            data["id_project"],
        ))
        profiles = cursor.fetchall()
        profiles = [clean_row(c) for c in profiles]

        debug("action =", action)
        debug("sql =", sql)
        debug("id =", data["id"])
        debug("profiles =", profiles)

        json_response(profiles if profiles is not None else {"error": "deployment profiles by project don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# UPDATE (profiles)
elif action == "update":
    try:
        data = normalize(form, ["name", "description", "id"])
        sql = "UPDATE deployments_profiles SET name=%s, description=%s WHERE id=%s"
        cursor.execute(sql, (
            data["name"],
            data["description"],
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
        cursor.execute("DELETE FROM deployments_profiles WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# DELETE (deletebypagename)
elif action == "deletebyname":
    try:
        data = normalize(form, ["name"])
        cursor.execute("DELETE FROM deployments_profiles WHERE name=%s", (data["name"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})
