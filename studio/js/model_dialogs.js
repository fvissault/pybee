let project_id = null
let model_id = null

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
    if (cat == "addmodel") popupModel()
    if (cat == "editmodel") popupModel()
    return "<div>No content</div>"
}

async function addModel(idproject) {
    const session = await getSession()
    project_id = idproject
    model_id = null
    openDialog("addmodel")
}

async function editModel(idproject, modelid) {
    const session = await getSession()
    project_id = idproject
    model_id = modelid
    openDialog("editmodel")
}

async function popupModel() {
    const head = document.getElementById("dialogHeader")
    head.innerText = t("newmodeltitle")

    let modelname = ""
    let modeldescription = ""
    let modelcredential = ""

    if (model_id) {
        await fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getById",
                id: model_id
            })
        })
        .then(r => r.json())
        .then(data => {
            //console.log(data)
            if (!data.status) {
                modelname = data.name
                modeldescription = data.description
                modelcredential = data.id_credentials
            }
        });
    }

    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="modelname">${t("namelabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="modelname" type="text" value="${modelname}" maxlength="50"${model_id?" disabled":""}>
            </div>
            <div class="dialog-row">
                <label for="modeldescription">${t("descriptionlabel")}</label>
            </div>
            <div class="dialog-row">
                <input id="modeldescription" type="text" value="${modeldescription}" maxlength="250">
            </div>
            <div class="dialog-row">
                <label for="modelcredentials">${t("setlabel")}</label>
            </div>
            <div class="dialog-row">
                <select id="modelcredentials"></select>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="saveModel()">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`

        const credentialSelect = document.getElementById("modelcredentials")
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id: project_id
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (!data.status) {
                data.forEach(opt => {
                    const o = document.createElement("option")
                    o.value = opt.id
                    o.textContent = opt.name
                    credentialSelect.appendChild(o)
                })
                if (modelcredential === "") {
                    credentialSelect.options.selectedIndex = 0
                } else {
                    credentialSelect.value = modelcredential
                }
            }
        });

}

async function saveModel() {
    const session = await getSession()
    const modelname = document.getElementById("modelname")
    if (modelname.value.trim() === "") {
        alert(t("saveerror"))
        modelname.focus()
        return
    }

    const modeldescription = document.getElementById("modeldescription")
    const modelcredentials = document.getElementById("modelcredentials").options[document.getElementById("modelcredentials").options.selectedIndex]

    if (model_id) {
        // cas de l'update
        await fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "update",
                description: modeldescription.value.trim(),
                id_credentials: modelcredentials.value,
                id: model_id
            })
        })
        .then(r => r.json())
        .then(async data => {
            //console.log(data)
            if (data.status === "ok") {
                alert(t("saveok"))
                const response = await fetch("/pybee/studio/api/models.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "list",
                        id_project: projectid
                    })
                });
                const models = await response.json();
                renderCard(models, session)
            } else {
                alert(t("saveko"))
            }
            closeDialog()
        });
    } else {
        await fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                id_project: project_id,
                name: normalizeName(modelname.value.trim()),
                description: modeldescription.value.trim(),
                id_credentials: modelcredentials.value
            })
        })
        .then(r => r.json())
        .then(async data => {
            //console.log(data)
            if (data.status === "ok") {
                alert(t("createok"))
                const response = await fetch("/pybee/studio/api/models.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "list",
                        id_project: projectid
                    })
                });
                const models = await response.json();
                renderCard(models, session)
            } else {
                alert(t("createko"))
            }
            closeDialog()
        });
    }
}

