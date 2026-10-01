#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *


form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

# SELECT (getByName)
if action == "getByName":
    try:
        data = normalize(form, ["name"])
        sql = "SELECT * FROM entities WHERE name=%s AND active=1"
        cursor.execute(sql, (
            data["name"],
        ))
        entity = cursor.fetchone()
        if entity:
            entity = clean_row(entity)
        json_response(entity if entity is not None else {"error": "entity by name don't exists"})
    except Exception as e:
        json_response({"status": "nok", "message": str(e)})
else:
    session = require_auth()
    
    # CREATE
    if action == "create":
        try:
            data = normalize(form, ["name", "siret", "contact"])
            sql = "INSERT INTO entities (name, siret, contact_email, active) VALUES (%s,%s,%s,1)"
            cursor.execute(sql, (
                data["name"],
                data["siret"],
                data["contact"],
            ))
            db.commit()
            json_response({"status": "ok"})
        except Exception as e:
            json_response({"status": "nok", "message": str(e)})

    # CHANGE CONTACT EMAIL
    elif action == "change-contact":
        try:
            data = normalize(form, ["contact", "id"])
            sql = "UPDATE entities SET contact_email=%s WHERE id=%s"
            cursor.execute(sql, (
                data["contact"],
                data["id"],
            ))
            db.commit()
            json_response({"status": "ok"})
        except Exception as e:
            json_response({"status": "nok", "message": str(e)})

    # CHANGE ORG NAME
    elif action == "change-orgname":
        try:
            data = normalize(form, ["newname", "id"])
            sql = "UPDATE entities SET name=%s WHERE id=%s"
            cursor.execute(sql, (
                data["newname"],
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
            cursor.execute("DELETE FROM entities WHERE id=%s", (data["id"],))
            db.commit()
            json_response({"status": "ok"})
        except Exception as e:
            json_response({"status": "nok", "message": str(e)})
