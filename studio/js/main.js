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
    if (session) {
        const res2 = await fetch("/pybee/studio/api/projects_users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "list",
                userid: session.userid
            })
        });
        const projects = await res2.json();

        renderCard(projects, session)
    }
}

const active_deactive_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>`;

const details_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

const prototypage_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M8 6l-6 6 6 6"></path>
        <path d="M16 6l6 6-6 6"></path>
        <path d="M10 20l4-16"></path>
    </svg>`;

const trash_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4h6v2"></path>
    </svg>`;

const addmember_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
        <line x1="21" y1="8" x2="21" y2="14"></line>
        <line x1="18" y1="11" x2="24" y2="11"></line>
    </svg>`;

const delmember_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
        <line x1="18" y1="11" x2="24" y2="11"></line>
    </svg>`;

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
                                    <button class="card_button" onclick="active_project(${p.id}, 0);" data-i18n="title:activ">
                                        ${active_deactive_icon}
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" data-i18n="title:proto">
                                        ${prototypage_icon}
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" data-i18n="title:delproj">
                                        ${trash_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
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
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" data-i18n="title:proto">
                                        ${prototypage_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
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
                                    <button class="card_button" onclick="active_project(${p.id}, 1);" data-i18n="title:activ">
                                        ${active_deactive_icon}
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" data-i18n="title:delproj" title="Supprimer">
                                        ${trash_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
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
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
        }
    });
    document.getElementById("projects").innerHTML = html;
    renderUI()
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
        alert(t("alertactiv"))
    } else {
        alert(t("alertdeactiv"))
        if (prototypageWindow && !prototypageWindow.closed) {
            prototypageWindow.close();
        }
    }
}

async function suppress(projectid) {
    const session = await getSession()

    const check = confirm(t("confirmdelproj"))
    if (check) {
        fetch("/pybee/studio/api/projects.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getprojectbyid",
                id: projectid
            })
        })
        .then(r => r.json())
        .then(data1 => {
            console.log(data1)
            fetch("/pybee/studio/api/projects.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "delete",
                    id: projectid
                })
            })
            .then(r => r.json())
            .then(data2 => {
                console.log(data2)
                fetch("/pybee/studio/api/projects_users.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "deletebyproject",
                        idproject: projectid
                    })
                })
                .then(r => r.json())
                .then(data3 => {
                    console.log(data3)
                    fetch("api/file_access_api.py?action=delete_project", {
                        method:"POST",
                        headers:{ "Content-Type":"application/json" },
                        body: JSON.stringify({ project:data1["name"] })
                    })
                    .then(r => r.json())
                    .then(data4 => {
                        console.log(data4)
                        alert(t("alertdelproj"))
                        initMain()
                    });
                });
            });
        });
    }
}


function disconnect() {
    fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ action: "destroy" })
    })
    .then(() => location.href = "signin.html");
}
