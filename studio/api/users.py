#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *


data = get_post_data()
action = data.get("action")

db = get_db()
cursor = db.cursor(dictionary=True)

# SELECT (login)
if action == "login":
    sql = "SELECT * FROM users WHERE email=%s AND password=%s AND active=1"
    cursor.execute(sql, (
        data["email"],
        hash_password(data["password"])
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "auth_failed"})
# CREATE
elif action == "create":
    sql = "INSERT INTO users (id_entity, firstname, lastname, email, password, active) VALUES (%s,%s,%s,%s,%s,0)"
    cursor.execute(sql, (
        data["id_entity"],
        data["firstname"],
        data["lastname"],
        data["email"],
        hash_password(data["password"])
    ))
    db.commit()
    json_response({"status": "ok"})
# EMAIL UNIQUE
elif action == "unique_email":
    sql = "SELECT * FROM users WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "user don't exists"})
else:
    session = require_auth()

    # UPDATE
    if action == "update":
        sql = "UPDATE users SET firstname=%s, lastname=%s WHERE id=%s"
        cursor.execute(sql, (
            data["firstname"],
            data["lastname"],
            data["id"]
        ))
        db.commit()
        json_response({"status": "ok"})

    # DELETE
    elif action == "delete":
        cursor.execute("DELETE FROM users WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})