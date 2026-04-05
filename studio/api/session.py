#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
import json
import time
import os
from utils import *

form = get_post_data()
action = form.getvalue("action") or ""

cookie = http.cookies.SimpleCookie()

if action == "create":
    data = normalize(form, ["email", "userid"])
    session = {
        "email": data["email"],
        "userid": data["userid"],
        "auth": 1,
        "exp": int(time.time()) + 1800
    }
    payload = json.dumps(session)
    signature = sign(payload)

    cookie = http.cookies.SimpleCookie()
    cookie["bee_session"] = payload
    cookie["bee_session_sig"] = signature    
    cookie["bee_session"]["path"] = "/"
    cookie["bee_session_sig"]["path"] = "/"
    cookie["bee_session"]["httponly"] = True
    cookie["bee_session_sig"]["httponly"] = True
    cookie["bee_session"]["max-age"] = 1800
    cookie["bee_session_sig"]["max-age"] = 1800
    print("Content-Type: application/json")
    for morsel in cookie.values():
        print("Set-Cookie:", morsel.OutputString())
    print()
    print(json.dumps({"status": "session_created"}))

elif action == "read":
    cookie = http.cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))

    # Vérification présence des cookies
    if "bee_session" not in cookie or "bee_session_sig" not in cookie:
        json_response({"status": "cookie manquant"})
    payload = cookie["bee_session"].value
    sig = cookie["bee_session_sig"].value
    # Vérification signature
    if sign(payload) != sig:
        json_response({"status": "cookie corrompu"})
    # Lecture session
    session_data = json.loads(payload)
    # Vérification expiration
    if session_data.get("exp", 0) < int(time.time()):
        json_response({"status": "session expirée"})
    # 🔄 Renouvellement (session glissante)
    session_data["exp"] = int(time.time()) + 1800
    new_payload = json.dumps(session_data)
    new_sig = sign(new_payload)
    # Réécriture des cookies
    new_cookie = http.cookies.SimpleCookie()
    new_cookie["bee_session"] = new_payload
    new_cookie["bee_session_sig"] = new_sig
    for key in ["bee_session", "bee_session_sig"]:
        new_cookie[key]["path"] = "/"
        new_cookie[key]["httponly"] = True
        new_cookie[key]["max-age"] = 1800
        # Optionnel mais recommandé en prod :
        # new_cookie[key]["secure"] = True
        # new_cookie[key]["samesite"] = "Lax"

    # Réponse HTTP
    print("Content-Type: application/json")
    for morsel in new_cookie.values():
        print("Set-Cookie:", morsel.OutputString())
    print()

    # On renvoie la session mise à jour
    print(json.dumps(session_data))
elif action == "destroy":
    cookie = http.cookies.SimpleCookie()
    # On vide les cookies
    cookie["bee_session"] = ""
    cookie["bee_session_sig"] = ""
    for key in ["bee_session", "bee_session_sig"]:
        cookie[key]["path"] = "/"
        cookie[key]["httponly"] = True
        cookie[key]["max-age"] = 0
    print("Content-Type: application/json")
    for morsel in cookie.values():
        print("Set-Cookie:", morsel.OutputString())
    print()
    print(json.dumps({"status": "logged_out"}))