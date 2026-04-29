#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *
import traceback


form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

session = require_auth()

# CREATE
if action == "create":
    try:
        data = normalize(form, ["name", "icon", "description", "type", "id_entity", "id_author", "version", "content", "active"])
        sql = "INSERT INTO composants (name, icon, description, content, version, type, id_author, id_entity, active, creation_date) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s, now())"
        cursor.execute(sql, (
            data["name"],
            data["icon"],
            data["description"],
            data["content"],
            data["version"],
            data["type"],
            data["id_author"],
            data["id_entity"],
            data["active"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        traceback.print_exc()
        json_response({"status": "nok", "message": str(e)})

# UPDATE
elif action == "update":
    data = normalize(form, ["name", "icon" "description", "type", "id_entity", "id_author", "version", "content", "active", "id"])
    sql = "UPDATE composants SET name=%s, icon=%s, description=%s, content=%s, version=%s, type=%s, id_author=%s, id_entity=%s, active=%s, modif_date=now() WHERE id=%s"
    cursor.execute(sql, (
        data["name"],
        data["icon"],
        data["description"],
        data["content"],
        data["version"],
        data["type"],
        data["id_author"],
        data["id_entity"],
        data["active"],
        data["id"],
    ))
    db.commit()
    json_response({"status": "ok"})
    
elif action == "getbyname":
    try:
        data = normalize(form, ["name", "id_entity"])
        sql = "SELECT * FROM composants WHERE name=%s AND (type='public' OR (type='private' AND id_entity=%s))"
        cursor.execute(sql, (
            data["name"],
            data["id_entity"],
        ))
        composant = cursor.fetchone()
        if composant:
            composant = clean_row(composant)
        json_response(composant if composant else {"error": "Composant don't exists"})
    except Exception as e:
        #traceback.print_exc()
        json_response({"status": "nok", "message": str(e)})

# DELETE
elif action == "delete":
    data = normalize(form, ["id"])
    cursor.execute("DELETE FROM composants WHERE id=%s", (data["id"],))
    db.commit()
    json_response({"status": "ok"})