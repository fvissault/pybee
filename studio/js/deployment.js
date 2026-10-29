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
        if (window.opener.modelWindow) window.opener.modelWindow.close();
        if (window.opener.prototypageWindow) window.opener.prototypageWindow.close();
        if (window.opener.credentialslWindow) window.opener.credentialslWindow.close();
        window.opener.location.href = "signin.html";
        window.close();
        return;
    }
    return session
}

const profileRoot = {
    "environment": "production",

    "target": {
        "kind": "server", // select : local, shared, server, container, managed
        "provider": "generic",
        "os": "linux", // select : linux, windows
        "host": "serveur.exemple.fr"
    },

    "transport": {
        "type": "sftp", // select : local, sftp, ftps, provider_api
        "port": 22,
        "username": "",
        "auth": {
            "method": "ssh_key",
            "secretRef": "deployment_secret_1"
        }
    },

    "execution": {
        "type": "ssh", // select : local, ssh, agent, provider_api, manual
        "port": 22,
        "username": "",
        "auth": {
            "method": "ssh_key",
            "secretRef": "deployment_secret_1"
        }
    },

    "paths": {
        "staging": "",
        "application": "",
        "public": "",
        "private": ""
    },

    "web": {
        "server": "apache", // select : apache, iis, nginx, managed
        "baseUrl": "https://www.exemple.fr",
        "pythonApiMode": "cgi",
        "configurationMode": "existing"
    },

    "python": {
        "executable": "/usr/bin/python3", // tf
        "environment": "venv",
        "venvPath": "/var/www/mon_site/private/venv", 
        "installDependencies": true,
        "requirementsFile": "requirements.txt"
    },

    "database": {
        "enabled": true,
        "type": "mysql", // select : mysql, pgsql
        "modelIds": [3],
        "credentialsRef": 7,
        "createIfMissing": true,
        "mode": "install" // select : install, rebuild
    },

    "deployment": {
        "archiveFormat": "zip",
        "overwriteFiles": true,
        "backupBeforeDeploy": true,
        "cleanupOnSuccess": true,
        "keepFilesOnFailure": true
    },

    "healthCheck": {
        "enabled": true,
        "url": "https://www.exemple.fr/api/health.py",
        "expectedStatus": 200,
        "timeoutSeconds": 15
    }
};

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")

async function initDeployment() {
    const session = await getSession()
    renderProfiles(document.getElementById("profiles"))
}

async function renderProfiles(element) {
    try {
        const response = await fetch("/pybee/studio/api/deployments_profiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id_project: parseInt(projectid)
            })
        });
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const profiles = await response.json();
        if (!Array.isArray(profiles)) throw new Error(profiles.error || t("error"));

        element.replaceChildren();

        if (profiles.length === 0) {
            element.textContent = t("noprofile");
            return;
        }
        console.log(profiles)
        for(p of profiles) {
            const profilecontent = JSON.parse(p.profilecontent)
            let panel_header = document.createElement("div")
            panel_header.className = "accordion"
            let name = document.createElement("div")
            name.append(`${p.name}`)
            let env = document.createElement("div")
            env.append(`${profilecontent.environment}`)
            let desc = document.createElement("div")
            desc.append(`${p.description}`)
            panel_header.append(name, "-", env, "-", desc)
            element.append(panel_header)

            let actions = document.createElement("div")
            actions.className = "accordion-actions"
            let editbutton = document.createElement("button")
            editbutton.type = "button"
            editbutton.innerText = "Editer"
            editbutton.className = "btn btn-primary"
            actions.append(editbutton)

            let delbutton = document.createElement("button")
            delbutton.type = "button"
            delbutton.innerText = "Supprimer"
            delbutton.className = "btn btn-primary"
            actions.append(delbutton)

            let testbutton = document.createElement("button")
            testbutton.type = "button"
            testbutton.innerText = "Tester la connexion"
            testbutton.className = "btn btn-primary"
            actions.append(testbutton)

            panel_header.append(actions)

            let panel_content = document.createElement("div")
            panel_content.className = "accordion-panel"
            panel_content.innerHTML = `
                <div class="dialog-column">
                    <div class="dialog-section" style="margin-left:10px; margin-bottom:10px;">
                        <div class="dialog-row">
                            <label>Cible</label>
                        </div>
                        <div class="dialog-row">
                            <label for="kind-${p.id}">Serveur cible :</label>
                        </div>
                        <div class="dialog-row">
                            <select id="kind-${p.id}">
                                <option value="local">Serveur local</option>
                                <option value="shared">Server partagé</option>
                                <option value="server">Server dédié</option>
                                <option value="container">Container</option>
                                <option value="managed">Server géré</option>
                            </select>
                        </div>
                        <div class="dialog-row">
                            <label for="os-${p.id}">Système cible :</label>
                        </div>
                        <div class="dialog-row">
                            <select id="os-${p.id}">
                                <option value="linux">Linux</option>
                                <option value="windows">Windows</option>
                            </select>
                        </div>
                        <div class="dialog-row">
                            <label for="host-${p.id}">Serveur hôte :</label>
                        </div>
                        <div class="dialog-row">
                            <input id="host-${p.id}" type="text" value="">
                        </div>
                    </div>
                </div>
                <div class="dialog-column">
                    <div class="dialog-section" style="margin-left:10px; margin-bottom:10px;">
                        <div class="dialog-row">
                            <label>Transport</label>
                        </div>
                    </div>
                </div>`
            element.append(panel_content)

            // les listeners
            testbutton.addEventListener("click", () => {
                connectionTest(projectid, p.id)
            })
            editbutton.addEventListener("click", () => {
                editprofile(projectid, p.id)
            })
            delbutton.addEventListener("click", () => {
                delprofile(projectid, p.id)
            })
            actions.addEventListener("click", event => {
                event.stopPropagation();
            });
            panel_header.addEventListener("click", function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                    panel.style.borderBottom = "0px"
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    panel.style.borderBottom = "1px solid #eee"
                } 
            });
        }
    } catch (error) {
        console.error(t("errorload"), error);
        element.textContent = t("errorreason");
    }
}
