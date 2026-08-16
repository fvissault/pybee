function makeIdClasses(id, name, classes, draggable) {
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
            </div>
            <div class="dialog-row">
                <label for="value">Déplacement :</label>
            </div>
            <div class="dialog-row">
                <select id="draggable">
                    <option value="auto"${draggable==="auto"??" selected"}>Comportement par défaut</option>
                    <option value="true"${draggable==="true"??" selected"}>Déplaçable</option>
                    <option value="false"${draggable==="false"??" selected"}>Non déplaçable</option>
                </select>
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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("titletitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
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
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.name = document.getElementById("name").value.trim()
    node.props.size = document.getElementById("size").value.trim()
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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("lititle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) + 
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
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = title
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) + `</div>` + makeDialogButtons()
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
    node.props.name = document.getElementById("name").value.trim()
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("atitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
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
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("spantitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) + `</div>` + makeDialogButtons()
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
    node.props.name = document.getElementById("name").value.trim()
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

    render()
    closeDialog()
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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("imgtitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
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
    node.props.name = document.getElementById("name").value.trim()
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.src = document.getElementById("src").value.trim()
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

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
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("blocktitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
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
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

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
    const labelcontent = node.props.content||""
    const draggable = node.props.draggable||"auto"

    const head = document.getElementById("dialogHeader")
    head.innerText = t("labeltitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
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

    node.props.name = document.getElementById("name").value.trim()
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.labelfor = document.getElementById("for").value.trim()
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value

    render()
    closeDialog()
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
                    <label for="name">Action</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${action}" id="action"/>
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
                        <option value="">Pas de cible</option>
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
                        <option value="">Pas d'encodage</option>
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

    content.querySelector("#saveprops").onclick = () => {
        saveFormProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveFormProps(node) {
    node.props.id = document.getElementById("id").value.trim()
    node.props.name = document.getElementById("name").value.trim()
    node.props.action = document.getElementById("action").value.trim()
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
