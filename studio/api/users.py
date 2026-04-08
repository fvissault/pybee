#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *
import uuid
import sys


form = get_post_data()
action = form.getvalue("action") or ""

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
    data = normalize(form, ["email"])
    sql = "SELECT token FROM email_tokens WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "get token failed"})
# SELECT (email_by_token)
elif action == "getemailbytoken":
    data = normalize(form, ["token"])
    sql = "SELECT email FROM email_tokens WHERE token=%s"
    cursor.execute(sql, (
        data["token"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "get email failed"})
# SELECT (login)
elif action == "login":
    data = normalize(form, ["email", "password"])
    sql = "SELECT * FROM users WHERE email=%s AND password=%s AND active=1"
    cursor.execute(sql, (
        data["email"],
        hash_password(data["password"]),
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "auth_failed"})
# CREATE
elif action == "create":
    data = normalize(form, ["id_entity", "firstname", "lastname", "email", "password"])
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
    data = normalize(form, ["email"])
    sql = "SELECT * FROM users WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    user = cursor.fetchone()
    json_response(user if user else {"error": "user don't exists"})
# SELECT (confirm email)
elif action == "confirm_email":
    data = normalize(form, ["token"])
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
    data = normalize(form, ["email"])
    sql = "UPDATE users SET active=1 WHERE email=%s"
    cursor.execute(sql, (
        data["email"],
    ))
    db.commit()
    json_response({"status": "ok"})
# UPDATE (password)
elif action == "reset":
    data = normalize(form, ["password", "email"])
    sql = "UPDATE users SET password=%s WHERE email=%s"
    cursor.execute(sql, (
        hash_password(data["password"]),
        data["email"],
    ))
    db.commit()
    json_response({"status": "ok"})
else:
    session = require_auth()

    # SELECT (getmembertoadd)
    if action == "getmembertoadd":
        data = normalize(form, ["projectid"])
        sql = """SELECT DISTINCT a.id, a.firstname, a.lastname 
                 FROM users as a, entities as b 
                 WHERE a.id_entity=b.id and a.id not in (
                    SELECT a.id 
                    FROM users as a, projects_users as b 
                    WHERE b.id_project=%s and b.id_user=a.id
                 )"""
        cursor.execute(sql, (
            data["projectid"],
        ))
        users = cursor.fetchall()
        json_response(users)

    # SELECT (getuser)
    elif action == "getuser":
        data = normalize(form, ["userid"])
        sql = "SELECT a.*, b.name, b.contact_email FROM users as a, entities as b WHERE a.id=%s and b.id=a.id_entity"
        cursor.execute(sql, (
            data["userid"],
        ))
        user = cursor.fetchone()
        json_response(user if user else {"error": "user don't exists"})

    # SELECT (getuserinfo)
    elif action == "getuserinfo":
        data = normalize(form, ["userid"])
        sql = "SELECT * FROM users WHERE id=%s"
        cursor.execute(sql, (
            data["userid"],
        ))
        user = cursor.fetchone()
        json_response(user if user else {"error": "user don't exists"})

    # UPDATE
    elif action == "update":
        data = normalize(form, ["firstname", "lastname", "id"])
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
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM users WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})