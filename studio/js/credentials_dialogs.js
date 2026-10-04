let project_id = 0
let creds_id = 0

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
    if (cat == "addcreds") popupCredentials()
    if (cat == "editcreds") popupCredentials(creds_id)
    return "<div>No content</div>"
}

async function addcreds(idproject) {
    const session = await getSession()
    project_id = idproject
    creds_id = null
    openDialog("addcreds")
}

async function editcreds(idproject, credsid) {
    const session = await getSession()
    project_id = idproject
    creds_id = credsid
    openDialog("editcreds")
}

async function delcreds(idproject, credsid) {
    const session = await getSession()
    creds_id = credsid
    const check = confirm(t("checkdel"))
    if (check) {
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "deletebyid",
                id: credsid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("delok"))
                displayCredentials(document.getElementById("credentials"), idproject)
            } else {
                alert(t("delko"))
            }
        });
    }
}

async function popupCredentials(credentialsid = null) {
    const head = document.getElementById("dialogHeader")
    head.innerText = t("addtitle")

    let credname = ""
    let credservername = ""
    let creddbname = ""
    let credusername = ""
    let creduserpass = ""

    if (credentialsid) {
        // édition
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id: credentialsid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (!data.status) {
                credname = data.name
                credservername = data.servername
                creddbname = data.databasename
                credusername = data.username
                creduserpass = data.userpass
            }
        });
    }

    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="credname">${t("namelabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="credname" type="text" value="${credname}" maxlength="50">
            </div>
            <div class="dialog-row">
                <label for="credservername">${t("serverlabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="credservername" type="text" value="${credservername}" placeholder="localhost" maxlength="250">
            </div>
            <div class="dialog-row">
                <label for="creddbname">${t("modelnamelabel")}</label>
            </div>
            <div class="dialog-row">
                <select id="creddbname"></select>
            </div>
            <div class="dialog-row">
                <label for="credusername">${t("usernamelabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="credusername" type="text" value="${credusername}" placeholder="root" maxlength="50">
            </div>
            <div class="dialog-row">
                <label for="creduserpass">${t("userpasslabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="creduserpass" type="password" value="${creduserpass}" maxlength="50">
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="saveCredentials(${project_id})">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`

        const credDbNameSelect = document.getElementById("creddbname")
        await fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "list",
                id_project: projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (!data.status) {
                data.forEach(opt => {
                    const o = document.createElement("option")
                    o.value = opt.name
                    o.textContent = opt.name
                    credDbNameSelect.appendChild(o)
                })
                if (creddbname === "") {
                    credDbNameSelect.options.selectedIndex = 0
                } else {
                    credDbNameSelect.value = creddbname
                }
            }
        });
}

async function saveCredentials(idproject) {
    const session = await getSession()
    const credname = document.getElementById("credname")
    if (credname.value.trim() === "") {
        alert(t("namemandatory"))
        credname.focus()
        return
    }
    const credservername = document.getElementById("credservername")
    const creddbname = document.getElementById("creddbname")
    const credusername = document.getElementById("credusername")
    const creduserpass = document.getElementById("creduserpass")

    if (creds_id) {
        // cas de l'update
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "update",
                name: credname.value.trim(),
                servername: credservername.value.trim(),
                databasename: creddbname.value.trim(),
                username: credusername.value.trim(),
                userpass: creduserpass.value,
                id: creds_id
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("recordok"))
            } else {
                alert(t("recordko"))
            }
        });
    } else {
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                id_project: idproject,
                name: credname.value.trim(),
                servername: credservername.value.trim(),
                databasename: creddbname.value.trim(),
                username: credusername.value.trim(),
                userpass: creduserpass.value
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("recordok"))
            } else {
                alert(t("recordko"))
            }
        });
    }
    displayCredentials(document.getElementById("credentials"), idproject)
    closeDialog()
}
