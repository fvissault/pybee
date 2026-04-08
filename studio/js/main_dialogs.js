
let project_id = 0
let user_id = 0

async function displayProfile() {
    const session = await getSession()
    user_id = session.userid
    const head = document.getElementById("dialogHeader")
    head.innerText = t("accountinfos")
    openDialog("profile")
}

async function details_project(projectid) {
    const session = await getSession()
    project_id = projectid
    const head = document.getElementById("dialogHeader")
    head.innerText = t("details")
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
    if (cat == "addmember") popupAddMember()
    if (cat == "delmember") popupDelMember()
    return "<div>No content</div>"
}

async function addmember(idproject) {
    const session = await getSession()
    project_id = idproject
    openDialog("addmember")
}

function popupAddMember() {
    const head = document.getElementById("dialogHeader")
    head.innerText = t("addmemberproj")

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getmembertoadd",
            projectid: project_id
        })
    })
    .then(r => r.json())
    .then(data => {
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-section-title">${t("memchoice")}</div>
                <div class="dialog-row">
                    <select id="members">
                        <option value="">${t("selectmem")}</option>
                    </select>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-primary" onclick="addNewMember(${project_id})">${t("validate")}</button>
                <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
            </div>
        `
        const select = document.getElementById("members")
        data.forEach(user => {
            const option = document.createElement("option")
            option.value = user.id
            option.textContent = `${user.firstname} ${user.lastname}`
            select.appendChild(option)
        });
    });

}

async function addNewMember(idproject) {
    const session = await getSession()
    const selectedmember = document.getElementById("members").options[document.getElementById("members").selectedIndex].value
    if (selectedmember === "") {
        alert(t("alertaddmem"))
    } else {
        // Ajouter le lien entre l'utilisateur et le projet
        console.log(selectedmember)
        fetch("/pybee/studio/api/projects_users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                id_user: selectedmember,
                id_project: idproject
            })
        })
        .then(r => r.json())
        .then(res1 => {
            // rechercher les informations de l'utilisateur
            console.log(res1)
            fetch("/pybee/studio/api/users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getuserinfo",
                    userid: selectedmember
                })
            })
            .then(r => r.json())
            .then(data => {
                // Envoyer un mail
                console.log(data)
                fetch("/pybee/studio/api/mail.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        lang: currentLang,
                        predname: "addmember",
                        email: data["email"],
                        toreplace: JSON.stringify({ 
                            name: data["firstname"]
                        }),
                    })
                })
                .then(r => r.json())
                .then(res => {
                    if (res.error) {
                        alert(t("alertemailnotsent"))
                    } else {
                        alert(t("alertemailsent"))
                        closeDialog()
                    }
                });
            });
        });
    }
}

async function delmember(idproject) {
    const session = await getSession()
    project_id = idproject
    openDialog("delmember")

}

function popupDelMember() {
    const head = document.getElementById("dialogHeader")
    head.innerText = t("delmemberproj")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
                <div class="dialog-section-title">${t("memchoice")}</div>
            <div class="dialog-row">
                <select id="members">
                    <option value="">${t("selectmem")}</option>
                </select>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="delThisMember(${project_id})">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>
    `

    fetch("/pybee/studio/api/projects_users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "listuserswithoutowner",
            projectid: project_id
        })
    })
    .then(r => r.json())
    .then(data2 => {
        const select = document.getElementById("members")
        data2.forEach(user => {
            const option = document.createElement("option")
            option.value = user.id
            option.textContent = `${user.firstname} ${user.lastname}`
            select.appendChild(option)
        });
    });
}

async function delThisMember(idproject) {
    const session = await getSession()
    const selectedmember = document.getElementById("members").options[document.getElementById("members").selectedIndex].value
    if (selectedmember === "") {
        alert(t("alertdelmem"))
    } else {
        // Ajouter le lien entre l'utilisateur et le projet
        console.log(selectedmember)
        fetch("/pybee/studio/api/projects_users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "deletebyprojectanduser",
                idproject: project_id,
                iduser: selectedmember
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            alert(t("alertdelthismem"))
            closeDialog()
        });
    }
}

function popupCreateProject() {
    const head = document.getElementById("dialogHeader")
    head.innerText = t("newproj")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-section-title">${t("yournewproj")}</div>
            <div class="dialog-row">
                <label for="name">${t("projname")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="name" value="" placeholder="${t("newprojname")}"/>
            </div>
            <div class="dialog-row">
                <label for="description">${t("optionaldesc")}</label>
            </div>
            <div class="dialog-row">
                <textarea id="description" placeholder="${t("placeholderdesc")}"></textarea>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="createNewProject()">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>
    `
}

async function createNewProject() {
    const session = await getSession()

    const name = document.getElementById("name")
    const desc = document.getElementById("description")

    if (name.value.trim() === "") {
        alert(t("projnamemand"))
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
                fetch("api/file_access_api.py?action=create_project", {
                        method:"POST",
                        headers:{ "Content-Type":"application/json" },
                        body: JSON.stringify({ project:name.value })
                })
                .then(r => r.json())
                .then(res3 => {
                    console.log(res3)
                    alert(t("alertprojcreated"))
                    initMain()
                    closeDialog()
                });
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
        const head = document.getElementById("dialogHeader")
        head.innerText = `${t("accountinfosof")} ${data["firstname"]}`
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-section-title">${t("youraccount")}</div>
                <div class="dialog-row">
                    <span class="label">${t("firstname")}</span>
                    <span class="value">${data["firstname"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">${t("lastname")}</span>
                    <span class="value">${data["lastname"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">${t("email")}</span>
                    <span class="value">${data["email"]}</span>
                </div>
            </div>
            <div class="dialog-divider"></div>
            <div class="dialog-section">
                <div class="dialog-section-title">${t("org")}</div>
                <div class="dialog-row">
                    <span class="label">${t("orgname")}</span>
                    <span class="value">${data["name"]}</span>
                </div>
                <div class="dialog-row">
                    <span class="label">${t("orgresp")}</span>
                    <span class="value">${data["contact_email"]}</span>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
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
    .then(data1 => {
        fetch("/pybee/studio/api/projects_users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "listusers",
                projectid: project_id
            })
        })
        .then(r => r.json())
        .then(data2 => {
            console.log(data2)
            const head = document.getElementById("dialogHeader")
            head.innerText = `${t("projdetails")} Détails du projet '${data1["name"]}'`
            const content = document.getElementById("dialogContent")
            content.innerHTML = `
                <div class="dialog-section">
                    <div class="dialog-section-title">${t("project")}</div>
                    <div class="dialog-row">
                        <span class="label">${t("projname")}</span>
                        <span class="value">${data1["name"]}</span>
                    </div>
                    <div class="dialog-row">
                        <span class="label">${t("projstatus")}</span>
                        <span class="value ${data1["active"]==1 ? 'status-active' : 'status-inactive'}">
                            ${data1["active"]==1 ? `${t("projactiv")}` : `${t("projinactiv")}`}
                        </span>
                    </div>
                </div>
                <div class="dialog-section">
                    <div class="dialog-section-title">${t("projdesc")}</div>
                    <div class="dialog-description">
                        ${data1["description"] || `${t("projdesc")}`}
                    </div>
                </div>
                <div class="dialog-divider"></div>
                <div class="dialog-section">
                    <div class="dialog-section-title">${t("org")}</div>
                    <div class="dialog-row">
                        <span class="label">${t("orgname")}</span>
                        <span class="value">${data1["entity_name"]}</span>
                    </div>
                    <div class="dialog-row">
                        <span class="label">${t("orgcontact")}</span>
                        <span class="value">${data1["contact_email"]}</span>
                    </div>
                    <div class="dialog-row">
                        <span class="label">${t("orgowner")}</span>
                        <span class="value">${data1["owner_fn"]} ${data1["owner_ln"]}</span>
                    </div>
                </div>
                <div class="dialog-divider"></div>
                <div class="dialog-section">
                    <div class="dialog-section-title">${t("projmembers")}</div>
                    <div style="height:100px; overflow:auto; margin-bottom:10px;" id="members"></div>
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
                </div>
            `
            const div = document.getElementById("members")
            data2.forEach(user => {
                const row = document.createElement("div")
                row.className = "dialog-row"
                const span = document.createElement("span")
                span.className = "value"
                span.innerHTML = `
                    <div class="user-mail">
                        <svg class="icon" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                            <polyline points="3 7 12 13 21 7"></polyline>
                        </svg>
                        <a href="mailto:${user["email"]}">
                            ${user["firstname"]} ${user["lastname"]}
                        </a>
                    </div>`
                row.appendChild(span)
                div.appendChild(row)
            });
        });
    });
}