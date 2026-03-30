#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
import json
import time
import os
from utils import *

data = get_post_data()
action = data.get("action")

cookie = http.cookies.SimpleCookie()

if action == "create":
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
    if "bee_session" not in cookie or "bee_session_sig" not in cookie:
        json_response({"status": "cookie manquant"})    
    payload = cookie["bee_session"].value
    sig = cookie["bee_session_sig"].value
    if sign(payload) != sig:
        json_response({"status": "cookie corrompu"})
    session_data = json.loads(payload)
    if session_data.get("exp", 0) < int(time.time()):
        json_response({"status": "session expirée"})
    if "bee_session" in cookie:
        json_response(json.loads(cookie["bee_session"].value))
    else:
        json_response({})
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