#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe

import json
import os
import sys
import shutil
from urllib.parse import parse_qs

ROOT = os.path.dirname(os.path.dirname(__file__))

print("Content-Type: application/json\n")

query = parse_qs(os.environ.get("QUERY_STRING", ""))
action = query.get("action", [""])[0]
entity = query.get("entity", [""])[0]

PROJECTS_DIR = os.path.join(ROOT, "projects/" + entity)

length = int(os.environ.get("CONTENT_LENGTH", 0))
body = sys.stdin.read(length) if length > 0 else ""
data = json.loads(body) if body else {}

def save_file(dir):
    file = data["file_name"]
    file_content = data["file_content"]
    directory = os.path.join(PROJECTS_DIR, dir)
    os.makedirs(directory, exist_ok=True)
    filepath = os.path.join(directory, file + ".js")
    with open(filepath, "w", encoding="utf8") as f:
        f.write(file_content)
    return {"status": "ok"}

def create_project():
    project = data["project"]
    project_path = os.path.join(PROJECTS_DIR, project)
    os.makedirs(project_path, exist_ok=True)
    project_path = os.path.join(PROJECTS_DIR, project, "js")
    os.makedirs(project_path, exist_ok=True)
    project_path = os.path.join(PROJECTS_DIR, project, "css")
    os.makedirs(project_path, exist_ok=True)
    return {"status": "ok"}


def delete_project():
    project = data["project"]
    project_path = os.path.join(PROJECTS_DIR, project)
    if os.path.exists(project_path):
        shutil.rmtree(project_path)
    return {"status": "ok"}


if action == "save_js_file":
    result = save_file("js")
elif action == "save_css_file":
    result = save_file("css")
elif action == "save_css_file":
    result = save_file("css")
elif action == "create_project":
    result = create_project()
elif action == "delete_project":
    result = delete_project()
else:
    result = {"error": "unknown action"}

print(json.dumps(result))