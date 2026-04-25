function makeIdClasses(id, classes) {
    return `<div class="dialog-row">
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
            </div>`
}

function makeDialogButtons() {
    return `<div class="dialog-actions">
                <button id="saveprops" class="btn btn-primary">Appliquer</button>
                <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
            </div>`
}

// *******************************************************************************
// popup Item de liste
// *******************************************************************************
function popupLi(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""
    const beginvalue = node.props.beginvalue||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de l'item de liste"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + 
                            `<div class="dialog-row">
                                <label for="id">Cet item de liste est pour :</label>
                            </div>
                            <div class="dialog-row">
                                <select id="for" onchange="toggleFieldSupp()">
                                    <option value="ul">Une liste non ordonnée</option>
                                    <option value="ol">Une liste ordonnée</option>
                                </select>
                            </div>
                            <div id="fieldssupp" style="display:none;">
                                <div class="dialog-row">
                                    <label for="id">Valeur de début :</label>
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
            alert("Veuillez renseigner la valeur de début")
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
function popupOl(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la liste ordonnée"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveOlProps(node)
}

function saveOlProps(node) {
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
// popup Liste non ordonnée
// *******************************************************************************
function popupUl(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de la liste non ordonnée"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `<div class="dialog-section">` + makeIdClasses(id, classes) + `</div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => saveUlProps(node)
}

function saveUlProps(node) {
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
    head.innerText = "Paramètres de l'ancre"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="href">URL de la page :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${href}" id="href"/>
            </div>
            <div class="dialog-row">
                <label for="target">Cible :</label>
            </div>
            <div class="dialog-row">
                <select id="target">
                    <option value="">Par défaut</option>
                    <option value="_blank">Nouvelle page vide</option>
                    <option value="_parent">Page parente à la page courante</option>
                    <option value="_top">Première page parente</option>
                </select>
            </div>
            <div class="dialog-row">
                <label for="type">Type de média :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${type}" id="type" placeholder="Mime type comme 'text/html'"/>
            </div>
            <div class="dialog-row">
                <label for="content">Contenu :</label>
            </div>
            <div class="dialog-row">
                <input type="text" id="content" value="${text}"/>
            </div>
            <div class="dialog-row-with-checkbox">
                <input type="checkbox" id="download"${download?" checked":""}/>
                <label for="download">Lien de téléchargement</label>
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
        alert("Le contenu de l'ancre est obligatoire")
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
    head.innerText = "Paramètres du bouton"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="content">Contenu :</label>
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
        alert("Le contenu du bouton est obligatoire")
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
    head.innerText = "Paramètres du texte brut"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="content">Contenu :</label>
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
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="content">Contenu :</label>
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
    head.innerText = "Paramètres de la page"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="layout_zone_count">Zone count in layout :</label>
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
        </div>` + makeDialogButtons()
    content.querySelector("#saveprops").onclick = () => savePageProps(workspaceRoot)
}

function savePageProps(node) {
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
// popup Image
// *******************************************************************************
function popupImage(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const src = node.props.src||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres de l'image"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
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
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="inline_style">Style en ligne :</label>
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
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
                <label for="for">Label for :</label>
            </div>
            <div class="dialog-row">
                <input type="text" value="${labelfor}" id="for"/>
            </div>
            <div class="dialog-row">
                <label for="inline_style">Style en ligne :</label>
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
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">` + makeIdClasses(id, classes) +
            `<div class="dialog-row">
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
