#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *


form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

# SELECT (getByName)
if action == "getByName":
    data = normalize(form, ["name"])
    sql = "SELECT * FROM entities WHERE name=%s AND active=1"
    cursor.execute(sql, (
        data["name"],
    ))
    entity = cursor.fetchone()
    json_response(entity if entity else {"error": "Organization don't exists"})
else:
    session = require_auth()
    
    # CREATE
    if action == "create":
        data = normalize(form, ["name", "siret", "contact"])
        sql = "INSERT INTO entities (name, siret, contact_email, active) VALUES (%s,%s,%s,1)"
        cursor.execute(sql, (
            data["name"],
            data["siret"],
            data["contact"],
        ))
        db.commit()
        json_response({"status": "ok"})

    # CHANGE CONTACT EMAIL
    elif action == "change-contact":
        data = normalize(form, ["contact", "id"])
        sql = "UPDATE entities SET contact_email=%s WHERE id=%s"
        cursor.execute(sql, (
            data["contact"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})

    # CHANGE ORG NAME
    elif action == "change-orgname":
        data = normalize(form, ["newname", "id"])
        sql = "UPDATE entities SET name=%s WHERE id=%s"
        cursor.execute(sql, (
            data["newname"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})

    # DELETE
    elif action == "delete":
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM entities WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})