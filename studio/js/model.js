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
        window.opener.location.href = "signin.html"
        window.opener.focus()
        window.close()
        return;
    }
    return session
}

const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")

async function initModels() {
    const session = await getSession()
    if (session) {
        const response = await fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "list",
                id_project: projectid
            })
        });
        const models = await response.json();
        console.log(models)
        renderCard(models, session)
    }
}

const details_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

const model_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <g transform="translate(0 2)">
            <ellipse cx="9" cy="5" rx="6" ry="2.5"/>
            <path d="M3 5v5c0 1.4 2.7 2.5 6 2.5"/>
            <path d="M3 10v5c0 1.4 2.7 2.5 6 2.5"/>
            <path d="M15 5v5"/>
            <path d="M14 16h7"/>
            <path d="M18 13l3 3-3 3"/>
        </g>
    </svg>`;

const trash_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4h6v2"></path>
    </svg>`;

function renderCard(models, session) {
    let html = "";
    models.forEach(model => {
        html += `<div class="card">
                    <div class="container">
                        <div class="card_title">${model.name}</div>
                        <div class="card_desc">${model.description}</div>
                        <div class="block_buttons">
                            <button class="card_button" onclick="details_project(${model.id});" data-i18n="title:infos">
                                ${details_icon}
                            </button>
                            <button class="card_button" onclick="model(${model.id});" data-i18n="title:model">
                                ${model_icon}
                            </button>
                            <button class="card_button btn-delete" onclick="suppress(${model.id})" data-i18n="title:delmodel">
                                ${trash_icon}
                            </button>
                        </div>
                    </div>
                </div>`;
    });
    document.getElementById("models").innerHTML = html;
    renderUI()
}