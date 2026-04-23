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
    render()
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
    node.props.classes = document.getElementById("classes").value.trim()
    node.props.content = document.getElementById("content").value.trim()
    render()
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
    render()
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

    node.props.title = document.getElementById("page_title").value.trim()
    render()
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
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const src = node.props.src||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de l'image"
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
            <div class="dialog-row">
                <label for="inline_style">Source :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${src}" id="src"/>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
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
    node.props.src = document.getElementById("sc").value.trim()
    render()
    closeDialog()
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
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="id">Id :</label>
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
                    <label for="value">Type :</label>
                </div>
                <div class="dialog-row">
                    <select id="type" onchange="addfields('${min}', '${max}', '${step}', ${checked}, '${maxlength}')">
                        <option value="text">Texte</option>
                        <option value="password">Password</option>
                        <option value="file">Fichier</option>
                        <option value="button">Bouton</option>
                        <option value="color">Couleur</option>
                        <option value="date">Date</option>
                        <option value="datetime-local">Date locale</option>
                        <option value="email">Email</option>
                        <option value="hidden">Non visible</option>
                        <option value="checkbox">Case à cocher</option>
                        <option value="image">Image</option>
                        <option value="month">Mois</option>
                        <option value="number">Nombre</option>
                        <option value="radio">Radio</option>
                        <option value="range">Intervalle</option>
                        <option value="reset">Réinitialisation</option>
                        <option value="search">Recherche</option>
                        <option value="submit">Soumettre</option>
                        <option value="tel">Numéro de téléphone</option>
                        <option value="time">Heure</option>
                        <option value="url">Url</option>
                    </select>
                </div>
                <div id="fieldssupp"></div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="value">Initial value :</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${value}" id="value"/>
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
                <div class="dialog-row">
                    <label for="placeholder">Placeholder :</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${placeholder}" id="placeholder"/>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="disabled"${disabled?" checked":""}/>
                    <label for="disabled">Indisponible</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="readonly"${readonly?" checked":""}/>
                    <label for="readonly">Lecture seule</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="required"${required?" checked":""}/>
                    <label for="required">Obligatoire</label>
                </div>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `

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
        createInputField(fieldsupp, "Minimum :", "min", min)
        createInputField(fieldsupp, "Maximum :", "max", max)
        if (choice == "number") {
            createInputField(fieldsupp, "Pas :", "step", step)
        }
    } else if (choice == "checkbox" || choice == "radio") {
        createCheckField(fieldsupp, "Case cochée", "cbchecked", checked)
    } else if (choice == "text") {
        createInputField(fieldsupp, "Longueur maximale :", "maxlength", maxlength)
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
    head.innerText = "Paramètres du formulaire"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="id">Id :</label>
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
                    <label for="value">Methode :</label>
                </div>
                <div class="dialog-row">
                    <select id="method">
                        <option value="post">Données cachées (POST)</option>
                        <option value="get">Données passées dans l'url (GET)</option>
                    </select>
                </div>
                <div class="dialog-row">
                    <label for="value">Cible :</label>
                </div>
                <div class="dialog-row">
                    <select id="target">
                        <option value="_self">La page courante par défaut</option>
                        <option value="_blank">Page vide</option>
                        <option value="_parent">Page parente</option>
                        <option value="_top">Première page</option>
                    </select>
                </div>
                <div class="dialog-row">
                    <label for="value">Type d'encodage :</label>
                </div>
                <div class="dialog-row">
                    <select id="enctype">
                        <option value="application/x-www-form-urlencoded">Type d'encodage par défaut</option>
                        <option value="multipart/form-data">Type d'encodage pour les textfields de type 'fichier'</option>
                        <option value="text/plain">Type d'encodage pour le débuggage</option>
                    </select>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="novalidate"${novalidate?" checked":""}/>
                    <label for="novalidate">Empêcher la validation du formulaire</label>
                </div>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `

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
