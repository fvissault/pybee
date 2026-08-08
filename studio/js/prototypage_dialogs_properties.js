function makeIdClasses(id, name, classes) {
    return `<div class="dialog-row">
                <label for="id">${t("idgen")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="name">Nom :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${name}" id="name"/>
            </div>
            <div class="dialog-row">
                <label for="classes">${t("stypeclass")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>`
}

function makeDialogButtons() {
    return `<div class="dialog-actions">
                <button id="saveprops" class="btn btn-primary">${t("apply")}</button>
                <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
            </div>`
}

// *******************************************************************************
// popup Titre H1 - H6
// *******************************************************************************
function popupTitle(node) {
    const size = node.props.size||4
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("titletitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="size">${t("sizetitle")}</label>
            </div>
            <div class="dialog-row">
                <input type="number" min="1" max="6" id="size" value="${size}"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveTitleProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveTitleProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    const classes = document.getElementById("classes").value.trim()
    if (classes != "") node.props.classes = classes
    const size = document.getElementById("size").value.trim()
    if (size == "") {
        alert(t("alertsize"))
        document.getElementById("size").focus()
        return
    }
    node.props.size = size
    render()
    closeDialog()
}

// *******************************************************************************
// popup Item de liste
// *******************************************************************************
function popupLi(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""
    const beginvalue = node.props.beginvalue||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("lititle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes) + 
                            `<div class="dialog-row">
                                <label for="for">${t("lifor")}</label>
                            </div>
                            <div class="dialog-row">
                                <select id="for" onchange="toggleFieldSupp()">
                                    <option value="ul">${t("liforul")}</option>
                                    <option value="ol">${t("liforol")}</option>
                                </select>
                            </div>
                            <div id="fieldssupp" style="display:none;">
                                <div class="dialog-row">
                                    <label for="beginvalue">${t("liforval")}</label>
                                </div>
                                <div class="dialog-row">
                                    <input type="text" id="beginvalue" value="${beginvalue}"/>
                                </div>
                            </div>
                         </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveLiProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function toggleFieldSupp() {
    const fieldsupp = document.getElementById("fieldssupp")
    const selectfor = document.getElementById("for").options[document.getElementById("for").selectedIndex].value
    if (selectfor == "ol") {
        fieldsupp.style.display = 'block'
    } else {
        fieldsupp.style.display = 'none'
        document.getElementById("beginvalue").value = ""
    }
}

function saveLiProps(node) {
    const beginvalue = document.getElementById("beginvalue").value.trim()
    const selectfor = document.getElementById("for").options[document.getElementById("for").selectedIndex].value
    if (selectfor == "ol") {
        if (beginvalue == "") {
            alert(t("alertval"))
            document.getElementById("beginvalue").focus()
            return
        }
        node.props.value = beginvalue
    } else {
        node.props.value = ""
    }

    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    node.props.classes = document.getElementById("classes").value.trim()

    render()
    closeDialog()
}

// *******************************************************************************
// popup Liste ordonnée
// *******************************************************************************
function popupGeneric(node, title) {
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = title
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveGenericProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveGenericProps(node) {
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    node.props.classes = document.getElementById("classes").value.trim()

    render()
    closeDialog()
}

// *******************************************************************************
// popup Anchor
// *******************************************************************************
function popupA(node) {
    const text = node.props.content||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""
    const href = node.props.href||""
    const target = node.props.target||""
    const type = node.props.type||""
    const download = node.props.download||false

    const head = document.getElementById("dialogHeader")
    head.innerText = t("atitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="href">${t("aurl")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${href}" id="href"/>
            </div>
            <div class="dialog-row">
                <label for="target">${t("atarget")}</label>
            </div>
            <div class="dialog-row">
                <select id="target">
                    <option value="">${t("adefault")}</option>
                    <option value="_blank">${t("ablank")}</option>
                    <option value="_parent">${t("aparent")}</option>
                    <option value="_top">${t("atop")}</option>
                </select>
            </div>
            <div class="dialog-row">
                <label for="type">${t("amedia")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${type}" id="type" placeholder="${t("amediaplaceholder")}"/>
            </div>
            <div class="dialog-row">
                <label for="content">${t("acontent")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="content" value="${text}"/>
            </div>
            <div class="dialog-row-with-checkbox">
                <input type="checkbox" id="download"${download?" checked":""}/>
                <label for="download">${t("adownload")}</label>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveAnchorProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
    const selectType = content.querySelector("#target")
    selectType.value = target || ""
}

function saveAnchorProps(node) {
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    const classes = document.getElementById("classes").value.trim()
    if (classes != "") node.props.classes = classes
    const content = document.getElementById("content").value.trim()
    if (content == "") {
        alert(t("alertacontent"))
        document.getElementById("content").focus()
        return
    }
    node.props.content = document.getElementById("content").value.trim()
    node.props.href = document.getElementById("href").value.trim()
    node.props.target = document.getElementById("target").options[document.getElementById("target").selectedIndex].value

    const type = document.getElementById("type").value.trim()
    if (type !== "") node.props.type = type
    else node.props.type = ""

    node.props.download = document.getElementById("download").checked

    render()
    closeDialog()
}

// *******************************************************************************
// popup Button
// *******************************************************************************
function popupButton(node) {
    const text = node.props.content||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("buttontitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="content">${t("buttoncontent")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="content" value="${text}"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveButtonProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveButtonProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    const classes = document.getElementById("classes").value.trim()
    if (classes != "") node.props.classes = classes
    const content = document.getElementById("content").value.trim()
    if (content == "") {
        alert(t("alertbutton"))
        document.getElementById("content").focus()
        return
    }
    node.props.content = document.getElementById("content").value.trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Text
// *******************************************************************************
function popupText(node) {
    const text=node.props.text||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("texttitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="content">${t("textcontent")}</label>
            </div>
            <div class="dialog-row">
                <textarea id="content">${text}</textarea>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveTextProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveTextProps(node){
    node.props.text=document.getElementById("content").value
    render()
    closeDialog()
}

// *******************************************************************************
// popup Span
// *******************************************************************************
function popupSpan(node) {
    const text = node.props.content||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("spantitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="content">${t("spancontent")}</label>
            </div>
            <div class="dialog-row">
                <textarea id="content">${text}</textarea>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveSpanProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveSpanProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.content = document.getElementById("content").value.trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Layout html
// *******************************************************************************
function popupLayout(node) {
    const zone_count = node.children.length
    const id = workspaceRoot.props.id||""
    const classes = workspaceRoot.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("layouttitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="layout_zone_count">${t("layoutzonecount")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${zone_count}" id="layout_zone_count" disabled/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveLayoutProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveLayoutProps(node){
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    node.props.classe = document.getElementById("classes").value.trim()
    node.props.zone_count = document.getElementById("layout_zone_count").trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Layout html
// *******************************************************************************
function popupLayoutZone(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la zone"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveLayoutZoneProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveLayoutZoneProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: ["display:grid"]}]
    }

    node.props.classe = document.getElementById("classes").value.trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Page html
// *******************************************************************************
// props.cssfiles = [{include: true|false, href: "name_of_file"}, ...]
// props.jsfiles = [{include: true|false, defer: true|false, src: "name_of_file"}, ...]
// props.metas = [{include: true|false, type: "charset"|"name"|"http-equiv", name: "", content: ""}]
// *******************************************************************************
async function popupPage() {
    let content = null
    if (perspective === "page") {
        const page_name = workspaceRoot.props.name||""
        const page_title = workspaceRoot.props.title||""
        const language = workspaceRoot.props.lang||""
        const cssfiles = workspaceRoot.props.cssfiles||[]
        const jsfiles = workspaceRoot.props.jsfiles||[]
        const metas = workspaceRoot.props.metas||[]
        
        const dialog = document.getElementById("dialog")
        dialog.style.width = "1451px"
        const head = document.getElementById("dialogHeader")
        head.innerText = t("pagetitle")
        content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="page_name">${t("pagename")}</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${page_name}" id="page_name" style="width:200px;"/>
                    </div>
                    <div class="dialog-row">
                        <label for="page_title">${t("pagepagettile")}</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${page_title}" id="page_title" style="width:200px;"/>
                    </div>
                    <div class="dialog-row">
                        <label for="lang">Langue</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${language}" id="lang" style="width:200px;"/>
                    </div>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Fichiers css utilisés</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="cssfiles" style="width:300px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addCssRow('stylesheet')">+ css</button>
                    <button class="btn btn-secondary" onclick="addCssRow('icon')">+ icon</button>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Scripts utilisés</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="scriptfiles" style="width:385px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addScriptRow()">+ script file</button>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Métadonnées</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="metatags" style="width:414px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addMetaRow('charset')">+ charset</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('name')">+ name</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('property')">+ property</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('http-equiv')">+ http-equiv</button>
                </div>
            </div>` + makeDialogButtons()
            createCssRows(cssfiles)
            createJsRows(jsfiles)
            createMetaRows(metas)
    } else {
        const session = await getSession()
        console.log(session)
        const composant_authorid = workspaceRoot.props.author_id||""
        let user = {}
        await fetch("/pybee/studio/api/users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getuser",
                userid : composant_authorid===""?session.userid:composant_authorid
            })
        })
        .then(r => r.json())
        .then(data => {
            if (!data.error) {
                user = data
            }
        });

        const composant_name = workspaceRoot.props.name||""
        const composant_desc = workspaceRoot.props.description||""
        const composant_vers = workspaceRoot.props.version||""
        const entity_name = workspaceRoot.props.entity_name||""
        const active = workspaceRoot.props.active||false
        const icon = workspaceRoot.props.icon||`<rect x="3" y="3" width="18" height="18" rx="2"/>
<rect x="6" y="6" width="5" height="5" rx="1"/>
<rect x="13" y="6" width="5" height="5" rx="1"/>
<rect x="9" y="13" width="6" height="5" rx="1"/>
<circle cx="20" cy="20" r="3" fill="var(--color-component)" stroke="none"/>`
        
        const head = document.getElementById("dialogHeader")
        head.innerText = "Paramètres du composant"
        content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="comp_name">Nom du composant :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${composant_name}" id="comp_name"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_desc">Description :</label>
                    </div>
                    <div class="dialog-row">
                        <textarea id="comp_desc" spellcheck="false" style="width:415px;"${user.id!==parseInt(session.userid)?" disabled":""}>${composant_desc}</textarea>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_vers">Version :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${composant_vers}" id="comp_vers"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row">
                        <label for="type">Type :</label>
                    </div>
                    <div class="dialog-row">
                        <select id="type"${user.id!==parseInt(session.userid)?" disabled":""}>
                            <option value="public">Public</option>
                            <option value="private">Privé</option>
                        </select>
                    </div>
                    <div class="dialog-row">
                        <label for="entity_name">Appartient à l'entreprise :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${user.name}" id="entity_name"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row-with-checkbox">
                        <input type="checkbox" id="active"${active?" checked":""}${user.id!==parseInt(session.userid)?" disabled":""}/>
                        <label for="readonly">Composant actif</label>
                    </div>
                </div>
            </div>
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="author">Auteur :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${user.firstname + ' ' + user.lastname}"${user.id!==parseInt(session.userid)?" disabled":""}/>
                        <input type="hidden" value="${user.id}" id="author"/>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_icon">Icône svg uniquement :</label>
                    </div>
                    <div class="dialog-row">
                        <div class="palette-item">
                            <svg id="example" class="icon" viewBox="0 0 24 24">
                                ${icon}
                            </svg>
                        </div>
                    </div>
                    <div class="dialog-row">
                        <textarea id="comp_icon" onchange="refreshIcon()" spellcheck="false" style="font-size:13px; width:544px; height:110px;"${user.id!==parseInt(session.userid)?" disabled":""}>${icon}</textarea>
                    </div>
                </div>
            </div>` + makeDialogButtons()
    }
    content.querySelector("#saveprops").onclick = () => {
        savePageProps(workspaceRoot)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function refreshIcon() {
    const icon = document.getElementById("comp_icon").value
    const example = document.getElementById("example")
    example.innerHTML = icon
}

let rowCount = 0

function createMetaRows(metas) {
    metas.forEach((item) => {
        addMetaRow(item.mode, item.name, item.content, item.include)
    })
}

function addMetaRow(mode, name = "", content = "", include = false) {
    const container = document.getElementById('metatags')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const modeinput = document.createElement("input")
    modeinput.type = "hidden"
    modeinput.className = "mode"
    modeinput.value = mode
    row.appendChild(modeinput)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "inc"
    input.checked = include
    row.appendChild(input)

    switch (mode) {
        case "charset": {
            const l = document.createElement("label")
            l.htmlFor = `content${rowCount}`
            l.textContent = mode + " :"
            l.style.marginTop = "9px"
            l.style.width = "165px"
            row.appendChild(l)

            const i = document.createElement("input")
            i.type = "text"
            i.id = `content${rowCount}`
            i.className = "content"
            i.value = content
            i.style.marginRight = "4px"
            i.placeholder = "Contenu"
            i.style.width = "160px"
            row.appendChild(i)
            break
        }
        case "name": {
            const l = document.createElement("label")
            l.htmlFor = `content${rowCount}`
            l.textContent = mode + " :"
            l.style.marginTop = "9px"
            l.style.width = "55px"
            row.appendChild(l)

            const nameinput = document.createElement("input")
            nameinput.type = "text"
            nameinput.id = `name${rowCount}`
            nameinput.className = "name"
            nameinput.placeholder = "Nom"
            nameinput.value = name
            nameinput.style.marginRight = "4px"
            nameinput.style.width = "90px"
            row.appendChild(nameinput)

            const contentinput = document.createElement("input")
            contentinput.type = "text"
            contentinput.id = `content${rowCount}`
            contentinput.className = "content"
            contentinput.value = content
            contentinput.style.marginRight = "4px"
            contentinput.style.width = "160px"
            contentinput.placeholder = "Contenu"
            row.appendChild(contentinput)
            break
        }
        case "property": {
            break
        }
        case "http-equiv": {
            break
        }
    }

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeMetaRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function removeMetaRow(rowid) {
    const row = document.getElementById(rowid)
    row.remove()
}

function createCssRows(cssfiles) {
    cssfiles.forEach((item) => {
        addCssRow(item.type, item.href, item.include)
    })
}

function addCssRow(type, href = "", include = false) {
    const container = document.getElementById('cssfiles')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const reltype = document.createElement("input")
    reltype.type = "hidden"
    reltype.className = "reltype"
    reltype.value = type
    row.appendChild(reltype)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "inc"
    input.checked = include
    row.appendChild(input)

    const l = document.createElement("label")
    l.htmlFor = `href${rowCount}`
    if (type === "icon") {
        l.textContent = "Icon :"
    } else {
        l.textContent = "Nom :"
    }
    l.style.marginTop = "9px"
    l.style.width = "45px"
    row.appendChild(l)
    const i = document.createElement("input")
    i.type = "text"
    i.id = `href${rowCount}`
    i.className = "href"
    i.value = href
    i.style.marginRight = "3px"
    if (type === "icon") {
        i.placeholder = "href avec extension"
    } else {
        i.placeholder = "href sans extension"
    }
    row.appendChild(i)

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeCssRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function removeCssRow(rowid) {
    const row = document.getElementById(rowid)
    row.remove()
}

function createJsRows(jsfiles) {
    jsfiles.forEach((item) => {
        addScriptRow(item.src, item.include, item.defer)
    })
}

function addScriptRow(src = "", include = false, defer = false) {
    const container = document.getElementById('scriptfiles')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const inccb = document.createElement("input")
    inccb.type = "checkbox"
    inccb.className = "inc"
    inccb.checked = include
    row.appendChild(inccb)

    const l = document.createElement("label")
    l.htmlFor = `src${rowCount}`
    l.textContent = "Source :"
    l.style.marginTop = "9px"
    row.appendChild(l)
    const i = document.createElement("input")
    i.type = "text"
    i.id = `src${rowCount}`
    i.className = "src"
    i.placeholder = "Source sans extension"
    i.style.width = "160px"
    i.value = src
    row.appendChild(i)

    const defercb = document.createElement("input")
    defercb.type = "checkbox"
    defercb.className = "defer"
    defercb.id = `defer${rowCount}`
    defercb.checked = defer
    row.appendChild(defercb)
    const labeldefer = document.createElement("label")
    labeldefer.htmlFor = `defer${rowCount}`
    labeldefer.textContent = "Reporté"
    labeldefer.style.marginTop = "9px"
    labeldefer.style.marginRight = "3px"
    row.appendChild(labeldefer)

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeCssRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function savePageProps(node) {
    if (perspective === "page") {
        const pagename = document.getElementById("page_name").value
        if (pagename == "") {
            alert(t("alertpagename"))
            document.getElementById("page_name").focus()
            return
        }
        node.props.name = pagename.trim()
        node.props.title = document.getElementById("page_title").value.trim()
        node.props.lang = document.getElementById("lang").value.trim()

        node.props.cssfiles = []
        const cssRows = document.getElementById("cssfiles")
        for (const row of cssRows.children) {
            const h = row.querySelector(".href").value;
            if (h !== "") {
                const insert = row.querySelector(".inc").checked;
                const reltype = row.querySelector(".reltype").value
                node.props.cssfiles.push({include: insert, href: h, type: reltype})
            }
        }

        node.props.jsfiles = []
        const jsRows = document.getElementById("scriptfiles")
        for (const row of jsRows.children) {
            const src = row.querySelector(".src").value;
            if (src !== "") {
                const insert = row.querySelector(".inc").checked;
                const defer = row.querySelector(".defer").checked;
                node.props.jsfiles.push({include: insert, src: src, defer: defer})
            }
        }

        closeDialog()
        const dialog = document.getElementById("dialog")
        dialog.style.width = ""
    } else {
        const composant_name = document.getElementById("comp_name").value
        if (composant_name.trim() === "") {
            alert("Le nom de votre composant est obligatoire")
            document.getElementById("comp_name").focus()
            return
        }
        const composant_authorid = document.getElementById("author").value
        const composant_description = document.getElementById("comp_desc").value
        const composant_version = document.getElementById("comp_vers").value
        const composant_icon = document.getElementById("comp_icon").value
        const composant_type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
        const composant_entity = document.getElementById("entity_name").value
        if (composant_entity.trim() === "") {
            alert("Votre composant doit appartenir à une entreprise")
            document.getElementById("entity_name").focus()
            return
        }
        try {
            fetch("/pybee/studio/api/entities.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getByName",
                    name : composant_entity
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    alert("Nous ne connaissons pas cette entreprise")
                    document.getElementById("entity_name").focus()
                    return
                } else {
                    node.props.name = composant_name
                    node.props.icon = composant_icon
                    node.props.description = composant_description
                    node.props.author_id = composant_authorid
                    node.props.type = composant_type
                    node.props.icon = composant_icon
                    node.props.entity = composant_entity
                    node.props.entity_id = data.id
                    node.props.version = composant_version
                    node.props.active = document.getElementById("active").checked
                    render()
                    closeDialog()
                }
            });
        } catch(e) {
            alert("Erreur réseau : votre composant n'a pas été sauvegardé")
        }
    }
}

// *******************************************************************************
// popup Image
// *******************************************************************************
function popupImage(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""
    const src = node.props.src||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("imgtitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="inline_style">${t("imgstyle")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
            <div class="dialog-row">
                <label for="inline_style">${t("imgsource")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${src}" id="src"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveImageProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveImageProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.src = document.getElementById("src").value.trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Block
// *******************************************************************************
function popupBlock(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("blocktitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="inline_style">${t("blockstyle")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveBlockProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveBlockProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }

    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()

    render()
    closeDialog()
}

// *******************************************************************************
// popup Label
// *******************************************************************************
function popupLabel(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const name = node.props.name||""
    const labelfor = node.props.labelfor||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("labeltitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes) +
            `<div class="dialog-row">
                <label for="for">${t("labelfor")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${labelfor}" id="for"/>
            </div>
            <div class="dialog-row">
                <label for="inline_style">${t("labelstyle")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveLabelProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveLabelProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }

    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.labelfor = document.getElementById("for").value.trim()

    render()
    closeDialog()
}

// *******************************************************************************
// popup Textfield
// *******************************************************************************
function popupTextfield(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const value = node.props.value||""
    const name = node.props.name||""
    const type = node.props.type||""
    const placeholder = node.props.placeholder||""
    const min = node.props.min||""
    const max = node.props.max||""
    const step = node.props.step||""
    const maxlength = node.props.maxlength||""
    const checked = node.props.checked||false
    const disabled = node.props.disabled||false
    const readonly = node.props.readonly||false
    const required = node.props.required||false

    const head = document.getElementById("dialogHeader")
    head.innerText = t("tftitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">` + makeIdClasses(id, name, classes) +
                `<div class="dialog-row">
                    <label for="value">${t("tftype")}</label>
                </div>
                <div class="dialog-row">
                    <select id="type" onchange="addfields('${min}', '${max}', '${step}', ${checked}, '${maxlength}')">
                        <option value="text">${t("tftype1")}</option>
                        <option value="password">${t("tftype2")}</option>
                        <option value="file">${t("tftype3")}</option>
                        <option value="button">${t("tftype4")}</option>
                        <option value="color">${t("tftype5")}</option>
                        <option value="date">${t("tftype6")}</option>
                        <option value="datetime-local">${t("tftype7")}</option>
                        <option value="email">${t("tftype8")}</option>
                        <option value="hidden">${t("tftype9")}</option>
                        <option value="checkbox">${t("tftype10")}</option>
                        <option value="image">${t("tftype11")}</option>
                        <option value="month">${t("tftype12")}</option>
                        <option value="number">${t("tftype13")}</option>
                        <option value="radio">${t("tftype14")}</option>
                        <option value="range">${t("tftype15")}</option>
                        <option value="reset">${t("tftype16")}</option>
                        <option value="search">${t("tftype17")}</option>
                        <option value="submit">${t("tftype18")}</option>
                        <option value="tel">${t("tftype19")}</option>
                        <option value="time">${t("tftype20")}</option>
                        <option value="url">${t("tftype21")}</option>
                    </select>
                </div>
                <div id="fieldssupp"></div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="value">${t("tfinitialval")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${value}" id="value"/>
                </div>
                <div class="dialog-row">
                    <label for="inline_style">${t("tfstyle")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${style}" id="inline_style"/>
                </div>
                <div class="dialog-row">
                    <label for="placeholder">${t("tfplaceholder")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${placeholder}" id="placeholder"/>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="disabled"${disabled?" checked":""}/>
                    <label for="disabled">${t("tfdisabled")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="readonly"${readonly?" checked":""}/>
                    <label for="readonly">${t("tfreadonly")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="required"${required?" checked":""}/>
                    <label for="required">${t("tfrequired")}</label>
                </div>
            </div>
        </div>` + makeDialogButtons()

    const selectType = content.querySelector("#type")
    selectType.value = type || "text"

    addfields(min, max, step, checked, maxlength)    

    content.querySelector("#saveprops").onclick = () => {
        saveTextfieldProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveTextfieldProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }

    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.value = document.getElementById("value").value.trim()
    node.props.name = document.getElementById("name").value.trim()
    node.props.placeholder = document.getElementById("placeholder").value.trim()
    node.props.type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
    node.props.disabled = document.getElementById("disabled").checked
    node.props.readonly = document.getElementById("readonly").checked
    node.props.required = document.getElementById("required").checked
    if (node.props.type === "range" || node.props.type === "number") {
        node.props.min = document.getElementById("min").value.trim()
        node.props.max = document.getElementById("max").value.trim()
    } else {
        node.props.min = ""
        node.props.max = ""
    }
    if (node.props.type === "number") {
        node.props.step = document.getElementById("step").value.trim()
    } else {
        node.props.step = ""
    }
    if (node.props.type === "checkbox") {
        node.props.checked = document.getElementById("cbchecked").checked
    } else {
        node.props.checked = false
    }
    if (node.props.type === "text") {
        node.props.maxlength = document.getElementById("maxlength").value.trim()
    } else {
        node.props.maxlength = ""
    }
    render()
    closeDialog()
}

function createInputField(container, label, inputid, inputvalue) {
    const row = document.createElement("div")
    row.className = "dialog-row"
    const l = document.createElement("label")
    l.for = inputid
    l.textContent = label
    row.appendChild(l)
    container.appendChild(row)

    const rowinput = document.createElement("div")
    rowinput.className = "dialog-row"
    const i = document.createElement("input")
    i.type = "text"
    i.id = inputid
    i.value = inputvalue
    rowinput.appendChild(i)
    container.appendChild(rowinput)
}

function createCheckField(container, label, inputid, inputvalue) {
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    const input = document.createElement("input")
    input.type = "checkbox"
    input.id = inputid
    input.checked = inputvalue
    row.appendChild(input)
    const labelcheck = document.createElement("label")
    labelcheck.for = inputid
    labelcheck.textContent = label
    row.appendChild(labelcheck)
    container.appendChild(row)
}

function addfields(min, max, step, checked, maxlength) {
    const fieldsupp = document.getElementById("fieldssupp")
    fieldsupp.textContent = ""
    const choice = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
    if (choice === "range" || choice === "number") {
        createInputField(fieldsupp, t("tfmin"), "min", min)
        createInputField(fieldsupp, t("tfmax"), "max", max)
        if (choice == "number") {
            createInputField(fieldsupp, t("tfstep"), "step", step)
        }
    } else if (choice == "checkbox" || choice == "radio") {
        createCheckField(fieldsupp, t("tfcheck"), "cbchecked", checked)
    } else if (choice == "text") {
        createInputField(fieldsupp, t("tflongmax"), "maxlength", maxlength)
    } else {
        fieldsupp.textContent = ""
    }
}

// *******************************************************************************
// popup Form
// *******************************************************************************
function popupForm(node){
    const action = node.props.action||""
    const method = node.props.method||""
    const id = node.props.id||""
    const name = node.props.name||""
    const enctype = node.props.enctype||""
    const target = node.props.target||""
    const novalidate = node.props.novalidate||false

    const head = document.getElementById("dialogHeader")
    head.innerText = t("formtitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="id">${t("formid")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${id}" id="id"/>
                </div>
                <div class="dialog-row">
                    <label for="name">${t("formname")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${name}" id="name"/>
                </div>
                <div class="dialog-row">
                    <label for="value">${t("formmethod")}</label>
                </div>
                <div class="dialog-row">
                    <select id="method">
                        <option value="post">${t("formpost")}</option>
                        <option value="get">${t("formget")}</option>
                    </select>
                </div>
                <div class="dialog-row">
                    <label for="value">${t("formtarget")}</label>
                </div>
                <div class="dialog-row">
                    <select id="target">
                        <option value="_self">${t("formself")}</option>
                        <option value="_blank">${t("formblank")}</option>
                        <option value="_parent">${t("formparent")}</option>
                        <option value="_top">${t("formtop")}</option>
                    </select>
                </div>
                <div class="dialog-row">
                    <label for="value">${t("formenc")}</label>
                </div>
                <div class="dialog-row">
                    <select id="enctype">
                        <option value="application/x-www-form-urlencoded">${t("formencdef")}</option>
                        <option value="multipart/form-data">${t("formencfile")}</option>
                        <option value="text/plain">${t("formencplain")}</option>
                    </select>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="novalidate"${novalidate?" checked":""}/>
                    <label for="novalidate">${t("formnoval")}</label>
                </div>
            </div>
        </div>` + makeDialogButtons()

    const selectEnctype = content.querySelector("#enctype")
    selectEnctype.value = enctype || "application/x-www-form-urlencoded"
    const selectTarget = content.querySelector("#target")
    selectTarget.value = target || "_self"
    const selectMethod = content.querySelector("#method")
    selectMethod.value = method || "post"

    content.querySelector("#saveprops").onclick = () => {
        saveFormProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveFormProps(node) {
    node.props.id = document.getElementById("id").value.trim()
    node.props.name = document.getElementById("name").value.trim()
    node.props.method = document.getElementById("method").options[document.getElementById("method").selectedIndex].value
    node.props.target = document.getElementById("target").options[document.getElementById("target").selectedIndex].value
    node.props.enctype = document.getElementById("enctype").options[document.getElementById("enctype").selectedIndex].value
    node.props.novalidate = document.getElementById("novalidate").checked
    render()
    closeDialog()
}

function getWorkspace(){
  return workspaceRoot
}

async function commonFilePopup(projectid, type) {
    const session = await getSession()
    document.getElementById("dialogOverlay").classList.remove("hidden")
    const head = document.getElementById("dialogHeader")
    head.innerText = "Création d'un nouveau fichier de flux interne"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="id">Nom de votre nouveau fichier (sans extension)</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="" id="filename"/>
                </div>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => {
        saveFilePopup(type)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

async function saveFilePopup(type) {
    const nameoffile = document.getElementById("filename").value.trim()
    if (nameoffile !== "") {
        if (type === "pagejs") {
            const content = { id: generateId("Container"), type:'container', props:{}, css:{}, events:{}, children:[]}
            await fetch("/pybee/studio/api/projectfiles.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    id_project: projectid,
                    filecontent: JSON.stringify(serializeNode(content)),
                    pagename: nameoffile
                })
            })
            .then(r => r.json())
            .then(res => {
                console.log(res)
                if(res.status === "ok") {
                    alert("Votre nouvelle page est bien créée")
                } else {
                    alert("Network error : New file not created")
                }
            });
        }

        await fetch("/pybee/studio/api/jsfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "create",
                id_project: projectid,
                content_type: type,
                name: nameoffile,
                content: "[]"
            })
        })
        .then(r => r.json())
        .then(res => {
            console.log(res)
            if(res.status === "ok") {
                alert("Votre nouveau fichier de flux interne est bien créé")
                loadProjectFiles()
                closeDialog()
            } else {
                alert("Network error : New file not created")
            }
        });
    } else {
        document.getElementById("filename").focus()
    }
}
