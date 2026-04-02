#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *
import uuid


data = get_post_data()
action = data.get("action")

db = get_db()
cursor = db.cursor(dictionary=True)

def create_email_token(email):
    token = str(uuid.uuid4())
    cursor.execute("INSERT INTO email_tokens (email, token) VALUES (%s,%s)", (email, token,))
    db.commit()
    return token

def get_email_by_token(token):
    cursor.execute("SELECT email FROM email_tokens WHERE token=%s", (token,))
    user = cursor.fetchone()
    return user["email"] if user else {"error": "get email failed"}

def get_token_by_email(email):
    cursor.execute("SELECT token FROM email_tokens WHERE email=%s", (email,))
    user = cursor.fetchone()
    return user["token"] if user else {"error": "get token failed"}

# SELECT (token_by_email)
if action == "gettokenbyemail":
    sql = "SELECT token FROM email_tokens WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "get token failed"})
# SELECT (email_by_token)
elif action == "getemailbytoken":
    sql = "SELECT email FROM email_tokens WHERE token=%s"
    cursor.execute(sql, (
        data["token"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "get email failed"})
# SELECT (login)
elif action == "login":
    sql = "SELECT * FROM users WHERE email=%s AND password=%s AND active=1"
    cursor.execute(sql, (
        data["email"],
        hash_password(data["password"]),
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
    token = create_email_token(data["email"])
    if token: 
        json_response({"token": token})
    else:
        json_response({"error": "token not valid"})
# EMAIL UNIQUE
elif action == "unique_email":
    sql = "SELECT * FROM users WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "user don't exists"})
# SELECT (confirm email)
elif action == "confirm_email":
    email = get_email_by_token(data["token"])
    if email:
        sql = "SELECT * FROM users WHERE email=%s and active=0"
        cursor.execute(sql, (
            email,
        ))
        user = cursor.fetchone()
        json_response(user if user else {"error": "user don't exists"})
    else:
        json_response({"error": "email don't exists"})
# UPDATE (active)
elif action == "set_active":
    sql = "UPDATE users SET active=1 WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    db.commit()
    json_response({"status": "ok"})
# UPDATE (password)
elif action == "reset":
    sql = "UPDATE users SET password=%s WHERE email=%s"
    cursor.execute(sql, (
        hash_password(data["password"]),
        data["email"],
    ))
    db.commit()
    json_response({"status": "ok"})
else:
    session = require_auth()

    # UPDATE
    if action == "update":
        sql = "UPDATE users SET firstname=%s, lastname=%s WHERE id=%s"
        cursor.execute(sql, (
            data["firstname"],
            data["lastname"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})

    # DELETE
    elif action == "delete":
        cursor.execute("DELETE FROM users WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})