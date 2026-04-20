// *******************************************************************************
// popup Button
// *******************************************************************************
function popupButton(node){

    const text=node.props.content||"Button"
    const id = node.props.id||""
    const onclick = node.props.onclick||""

    return `
        <h3 style="text-align:center;">Button</h3>
        <div style="margin-bottom:5px;"><label for="button_id">Id :</label></div>
        <input type="text" value="${id}" id="button_id" style="width:275px; padding:5px; background-color:#eee;"/><br><br>
        <div style="margin-bottom:5px;"><label for="button_content">Content :</label></div>
        <input id="button_content" value="${text}" style="width:275px; padding:5px; background-color:#eee;"/><br><br>
        <div style="margin-bottom:5px;"><label for="button_onclick">Onclick function :</label></div>
        <input type="text" value="${onclick}" id="button_onclick" style="width:275px; padding:5px; background-color:#eee;"/><br><br>
        <button class="config_button_apply" onclick="saveButtonProps()">Appliquer</button>
        <button class="config_button_close" onclick="closeDialog()">Fermer</button>
    `
}

function saveButtonProps(){
    const node=currentConfigNode
    node.props.id = document.getElementById("button_id").value
    node.props.content = document.getElementById("button_content").value
    node.props.onclick = document.getElementById("button_onclick").value
    closeDialog()
    render()
}

// *******************************************************************************
// popup Text
// *******************************************************************************
function popupText(node){

    const text=node.props.text||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="content">Contenu :</label>
            </div>
            <div class="dialog-row">
                <textarea id="content">${text}</textarea>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => saveTextProps(node)
}

function saveTextProps(node){
    node.props.text=document.getElementById("content").value
    closeDialog()
}

// *******************************************************************************
// popup Span
// *******************************************************************************
function popupSpan(node){

    const text = node.props.content||""
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="page_name">Id :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">Classe(s) de style :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">Contenu :</label>
            </div>
            <div class="dialog-row">
                <textarea id="content">${text}</textarea>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary" onclick="saveSpanProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
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
    node.props.classes = document.getElementById("classes").value
    node.props.content = document.getElementById("content").value
    closeDialog()
}

// *******************************************************************************
// popup Layout html
// *******************************************************************************
function popupLayout(node){

    const zone_count = node.children.length
    const id = workspaceRoot.props.id||""
    const classes = workspaceRoot.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la page"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="page_name">Id :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">Classe(s) de style :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>
            <div class="dialog-row">
                <label for="layout_zone_count">Zone count in layout :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${zone_count}" id="layout_zone_count" disabled/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => saveLayoutProps(node)
}

function saveLayoutProps(node){
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    const classes = document.getElementById("classes").value
    node.props.classe = classes.trim()

    const layout_zone_count = document.getElementById("layout_zone_count").value
    node.props.zone_count = layout_zone_count.trim()
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
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="page_name">Id :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">Classe(s) de style :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
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

    const classes = document.getElementById("classes").value
    node.props.classe = classes.trim()
    closeDialog()
}

// *******************************************************************************
// popup Page html
// *******************************************************************************
function popupPage(){

    const page_name = workspaceRoot.props.name||""
    const page_title = workspaceRoot.props.title||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la page"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="page_name">Page name :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${page_name}" id="page_name"/>
            </div>
            <div class="dialog-row">
                <label for="page_title">Page title :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${page_title}" id="page_title"/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => savePageProps(workspaceRoot)
}

function savePageProps(node){
    const pagename = document.getElementById("page_name").value
    if (pagename == "") {
        alert("Le nom de la page est obligatoire")
        document.getElementById("page_name").focus()
        return
    }
    node.props.name = pagename.trim()

    const page_title = document.getElementById("page_title").value
    node.props.title = page_title.trim()
    closeDialog()
}


// *******************************************************************************
// popup js
// *******************************************************************************
function popupWorkspaceJs(node) {
    return `<h3>Image</h3><p>No props yet</p>`
}

// *******************************************************************************
// popup Image
// *******************************************************************************
function popupImage(node){
return "<h3>Image</h3><p>No props yet</p>"
}

// *******************************************************************************
// popup Block
// *******************************************************************************
function popupBlock(node){

    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="id">Id :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="classes">Classe(s) de style :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>
            <div class="dialog-row">
                <label for="inline_style">Style en ligne :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => saveBlockProps(node)
}

function saveBlockProps(node) {
    const id = document.getElementById("id").value
    if (id.trim() !== "") {
        node.props.id = id
    }
    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
    }
    const classes = document.getElementById("classes").value
    if (classes.trim() !== "") {
        node.props.classes = classes
    }
    const style = document.getElementById("inline_style").value
    if (style.trim() !== "") {
        node.props.style = style
    }
    closeDialog()
}

// *******************************************************************************
// popup Label
// *******************************************************************************
function popupLabel(node){

    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const labelfor = node.props.labelfor||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="id">Id :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${id}" id="id"/>
            </div>
            <div class="dialog-row">
                <label for="for">Label for :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${labelfor}" id="for"/>
            </div>
            <div class="dialog-row">
                <label for="classes">Classe(s) de style :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${classes}" id="classes"/>
            </div>
            <div class="dialog-row">
                <label for="inline_style">Style en ligne :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${style}" id="inline_style"/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => saveLabelProps(node)
}

function saveLabelProps(node) {
    const id = document.getElementById("id").value
    if (id.trim() !== "") {
        node.props.id = id
    }
    if (id.trim() == "") {
        node.props.css = []
    } else {
        node.props.css = [{name: id.trim(), type: "id", values: []}]
    }
    const classes = document.getElementById("classes").value
    if (classes.trim() !== "") {
        node.props.classes = classes
    }
    const style = document.getElementById("inline_style").value
    if (style.trim() !== "") {
        node.props.style = style
    }
    const labelfor = document.getElementById("for").value
    if (labelfor.trim() !== "") {
        node.props.labelfor = labelfor
    }
    closeDialog()
}


// *******************************************************************************
// popup Form
// *******************************************************************************
function popupForm(node){
return "<h3>Form</h3><p>No props yet</p>"
}

function getWorkspace(){
  return workspaceRoot
}
