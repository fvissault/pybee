#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe

import json
import os
import sys
import shutil
from urllib.parse import parse_qs

ROOT = os.path.dirname(os.path.dirname(__file__))

def debug(*args):
    with open(os.path.join(ROOT, "logs", "debug.log"), "a", encoding="utf8") as f:
        print(*args, file=f)

print("Content-Type: application/json\n")

query = parse_qs(os.environ.get("QUERY_STRING", ""))
action = query.get("action", [""])[0]
entity = query.get("entity", [""])[0]

PROJECTS_DIR = os.path.join(ROOT, "projects/" + entity)

length = int(os.environ.get("CONTENT_LENGTH", 0))
body = sys.stdin.buffer.read(length) if length > 0 else b""
data = json.loads(body) if body else {}

debug("action =", action)
debug("entity =", entity)
debug("data =", repr(data))

def read_file(dir, ext):
    try:
        file = data["file_name"]
        directory = os.path.join(PROJECTS_DIR, dir)
        filepath = os.path.join(directory, file + "." + ext)
        if not os.path.exists(filepath):
            return {"status": "nok", "error": "file not found"}
        with open(filepath, "r", encoding="utf8") as f:
            file_content = f.read()
        debug("reading " + filepath + " status = ok")
        return {"status": "ok", "file_content": file_content}
    except:
        debug("reading " + filepath + " status = nok")
        return {"status": "nok", "error": "file not found"}

def save_file(dir, ext):
    try:
        file = data["file_name"]
        file_content = data["file_content"]
        directory = os.path.join(PROJECTS_DIR, dir)
        os.makedirs(directory, exist_ok=True)
        filepath = os.path.join(directory, file + "." + ext)
        with open(filepath, "w", encoding="utf8") as f:
            f.write(file_content)
        debug("saving " + filepath + " status = ok")
        return {"status": "ok"}
    except:
        debug("saving " + filepath + " status = nok")
        return {"status": "nok", "error": "file not saved"}

def create_project():
    try:
        project = data["project"]
        project_path = os.path.join(PROJECTS_DIR, project)
        os.makedirs(project_path, exist_ok=True)
        project_path = os.path.join(PROJECTS_DIR, project, "js")
        os.makedirs(project_path, exist_ok=True)
        project_path = os.path.join(PROJECTS_DIR, project, "css")
        os.makedirs(project_path, exist_ok=True)
        debug("creating project " + project + " status = ok")
        return {"status": "ok"}
    except:
        debug("creating project " + project + " status = nok")
        return {"status": "nok", "error": "project not created"}


def delete_project():
    try:
        project = data["project"]
        project_path = os.path.join(PROJECTS_DIR, project)
        if os.path.exists(project_path):
            shutil.rmtree(project_path)
        debug("deleting project " + project + " status = ok")
        return {"status": "ok"}
    except:
        debug("deleting project " + project + " status = nok")
        return {"status": "nok", "error": "project not deleted"}

def delete_file(dir, ext):
    try:
        file = data["file_name"]
        directory = os.path.join(PROJECTS_DIR, dir)
        filepath = os.path.join(directory, file + "." + ext)
        if os.path.exists(filepath):
            os.remove(filepath)
        debug("deleting file " + filepath + " status = ok")
        return {"status": "ok"}
    except:
        debug("deleting file " + filepath + " status = nok")
        return {"status": "nok"}

if action == "save_js_file":
    result = save_file("js", "js")
elif action == "save_css_file":
    result = save_file("css", "css")
elif action == "save_html_file":
    result = save_file("", "html")
elif action == "read_js_file":
    result = read_file("js", "js")
elif action == "read_css_file":
    result = read_file("css", "css")
elif action == "read_html_file":
    result = read_file("", "html")
elif action == "create_project":
    result = create_project()
elif action == "delete_project":
    result = delete_project()
elif action == "delete_css":
    result = delete_file("css", "css")
elif action == "delete_js":
    result = delete_file("js", "js")
elif action == "delete_html":
    result = delete_file("", "html")
else:
    result = {"error": "unknown action"}

print(json.dumps(result))