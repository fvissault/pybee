function makeIdClasses(id, classes) {
    return `<div class="dialog-row">
                <label for="id">${t("idgen")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("titletitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="size">${t("sizetitle")}</label>
            </div>
            <div class="dialog-row">
                <input type="number" min="1" max="6" id="size" value="${size}"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveTitleProps(node)
}

function saveTitleProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("lititle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + 
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
    content.querySelector("#saveprops").onclick = () => saveLiProps(node)
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
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    const head = document.getElementById("dialogHeader")
    head.innerText = title
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveGenericProps(node)
}

function saveGenericProps(node) {
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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
    const href = node.props.href||""
    const target = node.props.target||""
    const type = node.props.type||""
    const download = node.props.download||false

    const head = document.getElementById("dialogHeader")
    head.innerText = t("atitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
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
    content.querySelector("#saveprops").onclick = () => saveAnchorProps(node)

    const selectType = content.querySelector("#target")
    selectType.value = target || ""
}

function saveAnchorProps(node) {
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("buttontitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="content">${t("buttoncontent")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="content" value="${text}"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveButtonProps(node)
}

function saveButtonProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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
    content.querySelector("#saveprops").onclick = () => saveTextProps(node)
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("spantitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="content">${t("spancontent")}</label>
            </div>
            <div class="dialog-row">
                <textarea id="content">${text}</textarea>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveSpanProps(node)
}

function saveSpanProps(node){
    id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("layouttitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="layout_zone_count">${t("layoutzonecount")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${zone_count}" id="layout_zone_count" disabled/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveLayoutProps(node)
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

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la zone"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveLayoutZoneProps(node)
}

function saveLayoutZoneProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: ["display:grid"]}]
    }

    node.props.classe = document.getElementById("classes").value.trim()
    render()
    closeDialog()
}

// *******************************************************************************
// popup Page html
// *******************************************************************************
function popupPage() {
    const page_name = workspaceRoot.props.name||""
    const page_title = workspaceRoot.props.title||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("pagetitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="page_name">${t("pagename")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${page_name}" id="page_name"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">${t("pagepagettile")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${page_title}" id="page_title"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => savePageProps(workspaceRoot)
}

function savePageProps(node) {
    const pagename = document.getElementById("page_name").value
    if (pagename == "") {
        alert(t("alertpagename"))
        document.getElementById("page_name").focus()
        return
    }
    node.props.name = pagename.trim()
    node.props.title = document.getElementById("page_title").value.trim()
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
    const src = node.props.src||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("imgtitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
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
    content.querySelector("#saveprops").onclick = () => saveImageProps(node)
}

function saveImageProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    const head = document.getElementById("dialogHeader")
    head.innerText = t("blocktitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="inline_style">${t("blockstyle")}</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveBlockProps(node)
}

function saveBlockProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()
    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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
    const labelfor = node.props.labelfor||""

    const head = document.getElementById("dialogHeader")
    head.innerText = t("labeltitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
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
    content.querySelector("#saveprops").onclick = () => saveLabelProps(node)
}

function saveLabelProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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
            <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                    <label for="name">${t("tfname")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${name}" id="name"/>
                </div>
                <div class="dialog-row">
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

    content.querySelector("#saveprops").onclick = () => saveTextfieldProps(node)
}

function saveTextfieldProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
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

    content.querySelector("#saveprops").onclick = () => saveFormProps(node)
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
