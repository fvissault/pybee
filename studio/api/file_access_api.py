#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe

import json
import os
import sys
import shutil
from urllib.parse import parse_qs

ROOT = os.path.dirname(os.path.dirname(__file__))
PROJECTS_FILE = os.path.join(ROOT, "projects.json")
PROJECTS_DIR = os.path.join(ROOT, "projects")

print("Content-Type: application/json\n")

query = parse_qs(os.environ.get("QUERY_STRING", ""))
action = query.get("action", [""])[0]

length = int(os.environ.get("CONTENT_LENGTH", 0))
body = sys.stdin.read(length) if length > 0 else ""
data = json.loads(body) if body else {}


def read_projects():

    if not os.path.exists(PROJECTS_FILE):
        return {"projects": {}}

    with open(PROJECTS_FILE, "r", encoding="utf8") as f:
        return json.load(f)


def write_projects(data):

    with open(PROJECTS_FILE, "w", encoding="utf8") as f:
        json.dump(data, f, indent=2)

def delete_bst():

    project = data["project"]
    file = data["file"]

    path = os.path.join(PROJECTS_DIR, project, file)

    if os.path.exists(path):
        os.remove(path)

    projects = read_projects()

    if project in projects["projects"]:
        if file in projects["projects"][project]:
            projects["projects"][project].remove(file)

    write_projects(projects)

    return {"status":"ok"}


def load_bst(project, file):

    path = os.path.join(PROJECTS_DIR, project, file)

    if not os.path.exists(path):
        return {"error": "file not found"}

    with open(path, "r", encoding="utf8") as f:
        return json.load(f)


def save_bst():

    project = data["project"]
    file = data["file"]
    workspace = data["workspace"]

    path = os.path.join(PROJECTS_DIR, project, file)

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", encoding="utf8") as f:
        json.dump({"workspace": workspace}, f, indent=2)

    projects = read_projects()

    if project not in projects["projects"]:
        projects["projects"][project] = []

    if file not in projects["projects"][project]:
        projects["projects"][project].append(file)

    write_projects(projects)

    return {"status": "ok"}


def create_project():

    project = data["project"]

    project_path = os.path.join(PROJECTS_DIR, project)

    os.makedirs(project_path, exist_ok=True)

    projects = read_projects()

    if project not in projects["projects"]:
        projects["projects"][project] = []

    write_projects(projects)

    return {"status": "ok"}


def delete_project():

    project = data["project"]

    project_path = os.path.join(PROJECTS_DIR, project)

    if os.path.exists(project_path):
        shutil.rmtree(project_path)

    projects = read_projects()

    if project in projects["projects"]:
        del projects["projects"][project]

    write_projects(projects)

    return {"status": "ok"}


if action == "projects":

    result = read_projects()

elif action == "load":

    project = query.get("project", [""])[0]
    file = query.get("file", [""])[0]
    result = load_bst(project, file)

elif action == "save":

    result = save_bst()

elif action == "create_project":

    result = create_project()

elif action == "delete_project":

    result = delete_project()

elif action == "delete_bst":

    result = delete_bst()

else:

    result = {"error": "unknown action"}

print(json.dumps(result))