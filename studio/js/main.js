async function getSession() {
    // 1. Récupération session
    const res = await fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ action: "read" })
    });
    let session = await res.json();
    // 2. Vérification
    if(!session || session.status || !session.auth) {
        if (prototypageWindow && !prototypageWindow.closed) {
            prototypageWindow.close();
        }
        location.href = "signin.html";
        return;
    }
    return session
}


async function initMain() {
    const session = await getSession()

    const res2 = await fetch("/pybee/studio/api/projects_users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "list",
            userid: session.userid
        })
    });
    const projects = await res2.json();
    //console.log(projects)
    renderCard(projects, session)
}

function renderCard(projects, session) {
    let html = "";
    projects.forEach(p => {
        if (p.active == 1) {
            if (p.owner == session.userid) {
                html += `<div class="card owner">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="active_project(${p.id}, 0);" title="Activer/Désactiver">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <rect x="6" y="4" width="4" height="16"></rect>
                                            <rect x="14" y="4" width="4" height="16"></rect>
                                        </svg>
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" title="Informations">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" title="Prototypage">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M8 6l-6 6 6 6"></path>
                                            <path d="M16 6l6 6-6 6"></path>
                                            <path d="M10 20l4-16"></path>
                                        </svg>
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" title="Supprimer">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6l-1 14H6L5 6"></path>
                                            <path d="M10 11v6"></path>
                                            <path d="M14 11v6"></path>
                                            <path d="M9 6V4h6v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            } else {
                html += `<div class="card active">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="details_project(${p.id});" title="Informations">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" title="Prototypage">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M8 6l-6 6 6 6"></path>
                                            <path d="M16 6l6 6-6 6"></path>
                                            <path d="M10 20l4-16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
        } else {
            if (p.owner == session.userid) {
                html += `<div class="card deactive">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="active_project(${p.id}, 1);" title="Activer/Désactiver">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" title="Informations">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" title="Supprimer">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6l-1 14H6L5 6"></path>
                                            <path d="M10 11v6"></path>
                                            <path d="M14 11v6"></path>
                                            <path d="M9 6V4h6v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            } else {
                html += `<div class="card deactive">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="details_project(${p.id});" title="Informations">
                                        <svg class="icon" viewBox="0 0 24 24">
                                            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
        }
    });
    document.getElementById("projects").innerHTML = html;
}

let prototypageWindow = null

async function prototypage(projectid) {
    const session = await getSession()
    prototypageWindow = window.open(`prototypage.html?projectid=${projectid}`, "_blank");
}

async function active_project(projectid, activevalue) {
    const session = await getSession()

    await fetch("/pybee/studio/api/projects.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "updateactive",
            active: activevalue,
            id: projectid
        })
    })

    initMain()
    if (activevalue == 1) {
        alert("L'activation du projet a bien été effectuée")
    } else {
        alert("La désactivation du projet a bien été effectuée")
        if (prototypageWindow && !prototypageWindow.closed) {
            prototypageWindow.close();
        }
    }
}

async function suppress(projectid) {
    const session = await getSession()

    const check = confirm("Dois-je vraiment supprimer ce projet?")
    if (check) {
        await fetch("/pybee/studio/api/projects.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "delete",
                id: projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            fetch("/pybee/studio/api/projects_users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "deletebyproject",
                    idproject: projectid
                })
            })
            .then(r => r.json())
            .then(res => {
                alert("Le projet a été correctement supprimé")
                initMain()
            });
        });
    }
}

let project_id = 0
let user_id = 0

async function displayProfile() {
    const session = await getSession()
    user_id = session.userid
    const head = document.getElementById("dialogHeader")
    head.innerText = "Informations du compte"
    openDialog("profile")
}

async function details_project(projectid) {
    const session = await getSession()
    project_id = projectid
    const head = document.getElementById("dialogHeader")
    head.innerText = "Détails"
    openDialog("details")
}

async function createProject() {
    const session = await getSession()
    openDialog("create")
}

function openDialog(cat) {
    buildPopupContent(cat)
    document.getElementById("dialog").style.display="block"
}

function closeDialog() {
    document.getElementById("dialogHeader").innerHTML = ""
    document.getElementById("dialogContent").innerHTML = ""
    document.getElementById("dialog").style.display="none"
}

function buildPopupContent(cat){
    if (cat == "details") popupProject()
    if (cat == "profile") popupProfile()
    if (cat == "create") popupCreateProject()
    return "<div>No content</div>"
}

function popupCreateProject() {
    const head = document.getElementById("dialogHeader")
    head.innerText = `Créer un nouveau projet`
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-section-title">Votre nouveau projet</div>
            <div class="dialog-row">
                <label for="name">Nom</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="name" value="" placeholder="Nom de votre projet"/>
            </div>
            <div class="dialog-row">
                <label for="description">Description (optionnel)</label>
            </div>
            <div class="dialog-row">
                <textarea id="description" placeholder="Donnez une description à votre projet"></textarea>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="createNewProject()">Apliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

async function createNewProject() {
    const session = await getSession()

    const name = document.getElementById("name")
    const desc = document.getElementById("description")

    if (name.value.trim() === "") {
        alert("Le nom de votre nouveau projet est obligatoire")
        name.focus()
        return
    }

    await fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getuserinfo",
            userid: session.userid
        })
    })
    .then(r => r.json())
    .then(data => {
        fetch("/pybee/studio/api/projects.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                name: name.value,
                description: desc.value,
                id_entity: data["id_entity"],
                owner: data["id"]
            })
        })
        .then(r => r.json())
        .then(res => {
            lastid = res.id
            fetch("/pybee/studio/api/projects_users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    id_user: session.userid,
                    id_project: lastid
                })
            })
            .then(r => r.json())
            .then(res2 => {
                alert("Votre projet a bien été créé")
                initMain()
                closeDialog()
            });
        });
    });
}

function popupProfile() { 
    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getuser",
            userid: user_id
        })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data)
        const head = document.getElementById("dialogHeader")
        head.innerText = `Informations du compte de ${data["firstname"]}`
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-section-title">Votre compte</div>
                <div class="dialog-row">
                    <span class="label">Prénom</span>
                    <span class="value">${data["firstname"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">Nom</span>
                    <span class="value">${data["lastname"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">Email</span>
                    <span class="value">${data["email"]}</span>
                </div>
            </div>
            <div class="dialog-divider"></div>
            <div class="dialog-section">
                <div class="dialog-section-title">Organisation</div>
                <div class="dialog-row">
                    <span class="label">Nom</span>
                    <span class="value">${data["name"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">Responsable</span>
                    <span class="value">${data["contact_email"]}</span>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
            </div>
        `
    });
}

function popupProject(){
    fetch("/pybee/studio/api/projects.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getproject",
            id: project_id
        })
    })
    .then(r => r.json())
    .then(data => {
        const head = document.getElementById("dialogHeader")
        head.innerText = `Détails du projet '${data["name"]}'`
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-section-title">Projet</div>

                <div class="dialog-row">
                    <span class="label">Nom</span>
                    <span class="value">${data["name"]}</span>
                </div>

                <div class="dialog-row">
                    <span class="label">Statut</span>
                    <span class="value ${data["active"]==1 ? 'status-active' : 'status-inactive'}">
                        ${data["active"]==1 ? "Actif" : "Inactif"}
                    </span>
                </div>
            </div>

            <div class="dialog-section">
                <div class="dialog-section-title">Description</div>

                <div class="dialog-description">
                    ${data["description"] || "Aucune description"}
                </div>
            </div>

            <div class="dialog-divider"></div>

            <div class="dialog-section">
                <div class="dialog-section-title">Organisation</div>

                <div class="dialog-row">
                    <span class="label">Nom</span>
                    <span class="value">${data["entity_name"]}</span>
                </div>

                <div class="dialog-row">
                    <span class="label">Contact</span>
                    <span class="value">${data["contact_email"]}</span>
                </div>

                <div class="dialog-row">
                    <span class="label">Propriétaire</span>
                    <span class="value">${data["owner_fn"]} ${data["owner_ln"]}</span>
                </div>
            </div>

            <div class="dialog-actions">
                <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
            </div>
        `
    });

}

function disconnect() {
    fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ action: "destroy" })
    })
    .then(() => location.href = "signin.html");
}


const translations = {
    fr : { 
        title: "Beetle studio principale",
        header : "Beetle Studio", 
        disconnect : "Déconnexion", 
        menu : "Menu", 
        help : "Aide", 
        profile : "Profil",
        password: "Mot de passe",
        newproject: "Nouveau projet",
        myprojects: "Mes projets"
    } , 
    en : { 
    },
    it : {
    },
    de : {
    } ,
    es : {
    }
}

renderUI()