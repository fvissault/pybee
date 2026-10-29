let project_id = 0
let profile_id = 0

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
    if (cat == "addprofile") popupProfile()
    if (cat == "editprofile") popupProfile(profile_id)
    return "<div>No content</div>"
}

async function addprofile(idproject) {
    const session = await getSession()
    project_id = idproject
    profile_id = null
    openDialog("addprofile")
}

async function editprofile(idproject, profileid) {
    const session = await getSession()
    project_id = idproject
    profile_id = profileid
    openDialog("editprofile")
}

async function delprofile(idproject, profileid) {
    const session = await getSession()
    profile_id = profileid
    const check = confirm(t("checkdel"))
    if (check) {
        await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "deletebyid",
                id: profile_id
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("delok"))
                renderProfiles(document.getElementById("profiles"))
            } else {
                alert(t("delko"))
            }
        });
    }
}

async function popupProfile(profileid = null) {
    const head = document.getElementById("dialogHeader")
    head.innerText = "Création d'un nouveau profil"

    let profilename = ""
    let profiledescription = ""
    let profileenv = "development"

    if (profileid) {
        // édition
        await fetch("/pybee/studio/api/deployments_profiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id: profileid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (!data.status) {
                profilename = data.name
                profiledescription = data.description
                const profilecontent = JSON.parse(data.profilecontent)
                profileenv = profilecontent.environment
            }
        });
    }

    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="profileenv">${t("env")}</label>
            </div>
            <div class="dialog-row">
                <select id="environnement">
                    <option value="development"${profileenv==="development"?" selected":""}>${t("dev")}</option>
                    <option value="staging"${profileenv==="staging"?" selected":""}>${t("preprod")}</option>
                    <option value="production"${profileenv==="production"?" selected":""}>${t("prod")}</option>
                </select>
            </div>
            <div class="dialog-row">
                <label for="profilename">${t("profname")}</label>
            </div>
            <div class="dialog-row">
                <input id="profilename" type="text" value="${profilename}" maxlength="50">
            </div>
            <div class="dialog-row">
                <label for="profiledescription">${t("profdesc")}</label>
            </div>
            <div class="dialog-row">
                <input id="profiledescription" type="text" value="${profiledescription}" maxlength="250">
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="saveProfile(${project_id})">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`
}

async function saveProfile(idproject) {
    const session = await getSession()
    const profilename = document.getElementById("profilename")
    if (profilename.value.trim() === "") {
        alert(t("namemandatory"))
        profilename.focus()
        return
    }
    const profiledescription = document.getElementById("profiledescription")
    const profileenv = document.getElementById("profileenv")
    profileRoot.environment = profileenv.options[profileenv.options.selectedIndex].value

    if (profile_id) {
        // cas de l'update
        await fetch("/pybee/studio/api/deployments_profiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "update",
                name: profilename.value.trim(),
                description: profiledescription.value.trim(),
                profilecontent: JSON.stringify(profileRoot),
                id: profile_id
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("updateok"))
            } else {
                alert(t("updateko"))
            }
        });
    } else {
        await fetch("/pybee/studio/api/deployments_profiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                id_project: idproject,
                name: profilename.value.trim(),
                description: profiledescription.value.trim(),
                profilecontent: JSON.stringify(profileRoot)
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            if (data.status === "ok") {
                alert(t("createok"))
            } else {
                alert(t("createko"))
            }
        });
    }
    displayProfiles(document.getElementById("profiles"))
    closeDialog()
}
