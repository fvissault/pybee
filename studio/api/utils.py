import http.cookies
import os
import json
import hashlib
import cgi
import time

SECRET = "cle_secrete"

def get_post_data():
    form = cgi.FieldStorage()
    data = {}
    for key in form.keys():
        data[key] = form.getvalue(key)
    return data

def json_response(data):
    print("Content-Type: application/json\n")
    print(json.dumps(data))

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

def sign(data):
    return hashlib.sha256((data + SECRET).encode()).hexdigest()

def get_session(cookie_header=None):
    """
    Récupère et vérifie la session à partir du cookie.
    
    Args:
        cookie_header (str, optional): chaîne brute de l'en-tête Cookie.
            Si None, on prend os.environ["HTTP_COOKIE"] (CGI/WSGI).
    
    Returns:
        dict | None : session valide ou None si non valide.
    """
    if cookie_header is None:
        cookie_header = os.environ.get("HTTP_COOKIE", "")

    cookies = http.cookies.SimpleCookie(cookie_header)

    if "bee_session" not in cookies or "bee_session_sig" not in cookies:
        return None

    payload = cookies["bee_session"].value
    sig = cookies["bee_session_sig"].value

    # Vérification de la signature
    if sign(payload) != sig:
        return None

    try:
        session = json.loads(payload)
    except json.JSONDecodeError:
        return None

    # Vérification de l'expiration
    if session.get("exp", 0) < int(time.time()):
        return None

    return session


def require_auth(cookie_header=None):
    """
    Vérifie qu'une session existe et est valide.
    Renvoie la session ou renvoie une erreur JSON + exit.
    
    Args:
        cookie_header (str, optional): chaîne brute Cookie à passer.
    """
    session = get_session(cookie_header)
    if not session:
        json_response({"error": "API error: unauthorized"})
        exit()
    return session