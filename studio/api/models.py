#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
from db import get_db
from utils import *
from deploy_database import execute_model_sql

form = get_post_data()
action = form.getvalue("action") or ""

db = get_db()
cursor = db.cursor(dictionary=True)

session = require_auth()

# SELECT (getByName)
if action == "getByName":
    try:
        data = normalize(form, ["name"])
        sql = "SELECT * FROM models WHERE name=%s"
        cursor.execute(sql, (
            data["name"],
        ))
        model = cursor.fetchone()
        if model:
            credential = clean_row(model)
        json_response(model if model is not None else {"error": "Model by name don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (getById)
elif action == "getById":
    try:
        data = normalize(form, ["id"])
        sql = "SELECT * FROM models WHERE id=%s"
        cursor.execute(sql, (
            data["id"],
        ))
        model = cursor.fetchone()
        if model:
            credential = clean_row(model)
        json_response(model if model is not None else {"error": "Model by id don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# CREATE
elif action == "create":
    try:
        data = normalize(form, ["id_project", "name", "description", "id_credentials"])
        sql = "INSERT INTO models (id_project, name, description, id_credentials, modelcontent) VALUES (%s,%s,%s,%s,'{}')"
        cursor.execute(sql, (
            data["id_project"],
            data["name"],
            data["description"],
            data["id_credentials"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SAVE
elif action == "savemodel":
    try:
        data = normalize(form, ["id", "modelcontent"])
        sql = "UPDATE models SET modelcontent=%s WHERE id=%s"
        cursor.execute(sql, (
            data["modelcontent"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# CHANGE DESCRIPTION
elif action == "change-description":
    try:
        data = normalize(form, ["description", "id"])
        sql = "UPDATE models SET description=%s WHERE id=%s"
        cursor.execute(sql, (
            data["description"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# UPDATE
elif action == "update":
    try:
        data = normalize(form, ["description", "id_credentials", "id"])
        sql = "UPDATE models SET description=%s, id_credentials=%s WHERE id=%s"
        cursor.execute(sql, (
            data["description"],
            data["id_credentials"],
            data["id"],
        ))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# SELECT (models of project)
elif action == "list":
    try:
        data = normalize(form, ["id_project"])
        sql = "SELECT * FROM models WHERE id_project=%s"
        cursor.execute(sql, (
            data["id_project"],
        ))
        models = cursor.fetchall()
        models = [clean_row(c) for c in models]
        json_response(models if models is not None else {"error": "Models by project don't exists"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# DELETE
elif action == "delete":
    try:
        data = normalize(form, ["id"])
        cursor.execute("DELETE FROM models WHERE id=%s", (data["id"],))
        db.commit()
        json_response({"status": "ok"})
    except Exception as e:
        json_response({"status": "ko", "message": str(e)})

# EXECUTE SQL
elif action == "execute-model":
    try:
        data = normalize(form,["id", "typeDb", "sql", "mode"])

        type_db = str(data["typeDb"]).lower()
        mode = data.get("mode") or "install"
        if type_db not in ("mysql", "pgsql"):
            raise ValueError("Type attendu : mysql ou pgsql")
        cursor.execute("SELECT * FROM models WHERE id=%s", (data["id"],))
        model = cursor.fetchone()
        if model is None:
            raise ValueError("Modèle introuvable")
        cursor.execute("""SELECT * FROM models_credentials WHERE id=%s AND id_project=%s""",
            (model["id_credentials"], model["id_project"])
        )
        credential = cursor.fetchone()
        if credential is None:
            raise ValueError("Credentials introuvables pour ce projet")
        config = {
            "host": credential["servername"],
            "port": (
                3306 if type_db == "mysql" else 5432
            ),
            "database": credential["databasename"],
            "user": credential["username"],
            "password": credential["userpass"],
            "create_database": True,
            "protected_databases": [
                getattr(db, "database", None)
                or "beetle_studio"
            ]
        }

        result = execute_model_sql(type_db, config, data["sql"], mode)

    except Exception as error:
        result = {"status": "ko", "message": str(error)}

    json_response(result)