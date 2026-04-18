let currentConfigNode = null

function openDialog(node, cat){
    currentConfigNode = node
    buildPopupContent(node, cat)
    if(node.type === "layout" && cat == "lcss") {
        initLayoutPopupEvents()
    }
    if((node.type === "container" || node.type === "layout") && cat == "css") {
        renderTree()
    }
    if(node.type === "zone" && cat == "css") {
        renderTreeById()
    }
    document.getElementById("dialog").style.display="block"
}

function closeDialog(){
    document.getElementById("dialog").style.display="none"
}

function buildPopupContent(node, cat){

    if(node.type==="widget"){
        if (cat == "html") {
            switch(node.widgetType){
                case "Button":
                    popupButton(node)
                    break
                case "Text":
                    popupText(node)
                    break
                case "Span":
                    popupSpan(node)
                    break
                case "Image":
                    popupImage(node)
                    break
                case "Block":
                    popupBlock(node)
                    break
                case "Form":
                    popupForm(node)
                    break
            }
        } else if (cat == "css") {
            switch(node.widgetType){
                case "Button":
                    popupButtonCss(node)
                    break
                case "Span":
                    popupLayoutZoneCss(node)
                    renderTreeById()
                    break
                case "Image":
                    popupImageCss(node)
                    break
                case "Block":
                    popupBlockCss(node)
                    break
            }
        } else if (cat == "events") {
            popupEvents(node)
        }
    } else {
        if(node.type==="zone") {
            if (cat == "css") popupLayoutZoneCss(node)
            if (cat == "html") popupLayoutZone(node)
        }
        if(node.type==="layout") {
            if (cat == "html") popupPage(node)
            if (cat == "lhtml") popupLayout(node)
            if (cat == "lcss") {
                initPropsStruct()
                popupLayoutCss(node)
            }
            if (cat == "css") popupWorkspaceCss(node)
            if (cat == "js") {
                return popupWorkspaceJs(node)
            }
            if (cat == "model") return popupWorkspaceModel(node)
        }

        if(node.type==="container") {
            if (cat == "html") popupPage(node)
            if (cat == "css") popupWorkspaceCss(node)
            if (cat == "js") return popupWorkspaceJs(node)
            if (cat == "model") return popupWorkspaceModel(node)
        }
    }
    return "<div>No configuration</div>"
}

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
            <button class="btn btn-primary" onclick="saveTextProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveTextProps(){
    const node=currentConfigNode
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
            <button class="btn btn-primary" onclick="saveSpanProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveSpanProps(){
    const node=currentConfigNode
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
            <button class="btn btn-primary" onclick="saveLayoutProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveLayoutProps(){
    const node=currentConfigNode

    const id = document.getElementById("id").value
    node.props.id = id.trim()

    const classes = document.getElementById("classes").value
    node.props.classe = classes.trim()

    const layout_zone_count = document.getElementById("layout_zone_count").value
    node.props.zone_count = layout_zone_count.trim()

    closeDialog()
    //render()
}

// *******************************************************************************
// popup Layout zone css
// *******************************************************************************
function popupLayoutZoneCss(node) {
    const head = document.getElementById("dialogHeader")
    head.innerText = "Style de l'objet'"
    const id = node.props.id||""
    if (id.trim() != "") {
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-row">
                    <div style="max-height:500px; min-width:350px; overflow:auto;">
                        <div id="cssTree" class="tree"></div>
                    </div>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
            </div>
        `
    } else {
        const content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-section">
                <div class="dialog-row">
                    Il n'y a pas d'id défini sur cette zone
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
            </div>
        `
    }
}

// *******************************************************************************
// popup Layout html
// *******************************************************************************
function popupLayoutZone(node) {
    const id = node.props.id||""
    const classes = node.props.classes||""

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
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="saveLayoutZoneProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveLayoutZoneProps() {
    const node=currentConfigNode

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
            <button class="btn btn-primary" onclick="savePageProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function savePageProps(){
    const node=currentConfigNode

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
    //render()
}

// *******************************************************************************
// popup Layout css
// *******************************************************************************
function popupLayoutCss(node) {

    const head = document.getElementById("dialogHeader")
    head.innerText = "Css du layout"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <div class="tree-row">
                    <select id="layoutgrid_cat" style="width:130px;">
                        <option value="grid-template-columns">Template columns</option>
                        <option value="grid-template-rows">Template rows</option>
                        <option value="grid-column-gap">Column gap</option>
                        <option value="grid-row-gap">Row gap</option>
                        <option value="other">other</option>
                    </select>
                    <input type="text" id="layoutgrid_content" style="width:165px;"/>
                    <button class="btn btn-secondary" onclick="addLayoutProp()">Ajouter</button>
                </div>
            </div>
            <div class="dialog-row">
                <label for="layoutgrid_props">Layoutgrid properties :</label>
            </div>
            <div class="dialog-row">
                <ul id="layoutgrid_props" style="width:397px; min-height:100px;">
                    ${buildLayoutCss(node.props.css||[])}
                </ul>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function initPropsStruct() {
    const properties = currentConfigNode

    if (!properties.props.css) properties.props.css = []
    const css = Array.isArray(properties.props.css) ? properties.props.css : []
    let found = false
    for (let i = 0; i < css.length; i++) {
        if (css[i].name == "parentlayout") {
            found = true
            const index = css[i].values.indexOf("display:grid");
            if (index === -1) {
                css[i].values.push("display:grid")
                break
            }
        }
    }
    if (!found) {
        css.push({type : "id", name : "parentlayout", values : ["display:grid"]})
    }
}

function buildLayoutCss(cssprops) {
    console.log(workspaceRoot)
    let result = ""
    let values = []
    for (let i = 0; i < cssprops.length; i++) {
        if (cssprops[i].name == "parentlayout") {
            values = cssprops[i].values
            break
        }
    }
    
    for (let i = 0; i < values.length; i++) {
        result += `<li><button class="btn btn-ternary" style="margin-left:auto">-</button> ${values[i]}</li>`
    }

    return result
}

function initLayoutPopupEvents() {
    const list = document.getElementById("layoutgrid_props")

    list.addEventListener("click", (e)=>{
        if (e.target.classList.contains("layout-del")) {
            e.stopPropagation()
            deleteLine(e.target)
        }
    })
}

function addLayoutProp(){
    const list_props = document.getElementById("layoutgrid_props")
    const lg_cat = document.getElementById("layoutgrid_cat").options[document.getElementById("layoutgrid_cat").selectedIndex].value
    const lg_content = document.getElementById("layoutgrid_content").value
    document.getElementById("layoutgrid_content").value = ""
    const li = document.createElement("li")

    const del = document.createElement("button")
    del.className = "btn btn-ternary"
    del.textContent="-"

    del.addEventListener("click",(e)=>{
        e.stopPropagation()
        deleteLine(e.currentTarget)
    })
    if (lg_cat == "other") {
        li.append(del, ` ${lg_content}`)
    } else {
        li.append(del, `  ${lg_cat}:${lg_content}`)
    }
    list_props.appendChild(li)

    const properties = currentConfigNode
    for (let i = 0; i < properties.props.css.length; i++) {
        if (properties.props.css[i].name == "parentlayout") {
            properties.props.css[i].values.push(lg_cat +":"+lg_content)
            break
        }
    }
}

function deleteLine(line) {
    let check = confirm("Are you sure to delete this property?")
    if (check) {
        line.parentElement.remove()
        const css = currentConfigNode.props.css
        for (let i = 0; i < css.length; i++) {
            if (css[i].name == "parentlayout") {
                const index = css[i].values.indexOf(line.parentElement.childNodes[1].data.trim());
                if (index !== -1) {
                    css[i].values.splice(index, 1);
                    break
                }
            }
        }
    }
}

// *******************************************************************************
// popup workspace html
// *******************************************************************************
function popupWorkspace(node){

    const page_name = node.props.name||""
    const page_title = node.props.title||""

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
            <button class="btn btn-primary" onclick="saveWorkspaceProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveWorkspaceProps() {
    const node=currentConfigNode

    const name = document.getElementById("page_name").value
    if (name.trim() == "") {
        alert("Page name is mandatory")
        name.focus()
        return
    }
    node.props.name = name.trim()

    const page_title = document.getElementById("page_title").value
    node.props.title = page_title.trim()

    closeDialog()
    render()

}

// *******************************************************************************
// popup workspace css
//
// props.css [
//      { 
//          type : "tag", 
//          name : "name1", 
//          value : ["value11", "value12", ...] 
//      },
//      { 
//          type : "class", 
//          name : "name2", 
//          value : ["value21", "value22", ...] 
//      },
//      ... 
// ]
// *******************************************************************************
function popupWorkspaceCss(node) {

    const head = document.getElementById("dialogHeader")
    head.innerText = "Workspace css"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <div style="max-height:500px; min-width:350px; overflow:auto;">
                    <div id="cssTree" class="tree"></div>
                </div>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function renderTreeGeneric(filterFn, withRootButton = false) {
    const properties = currentConfigNode
    const tree = document.getElementById("cssTree")

    if (!tree) return

    tree.innerHTML = ""

    if (withRootButton) {
        const addRoot = document.createElement("div")
        addRoot.className = "tree-row"
        addRoot.innerHTML = `<button id="root-button" class="btn btn-secondary" onclick="showAddNode()">+</button>`
        tree.appendChild(addRoot)
    }

    if (!properties.props.css) properties.props.css = []
    const css = Array.isArray(properties.props.css) ? properties.props.css : []

    css.forEach((node, i) => {
        if (!filterFn(node)) return

        // Ligne principale
        const row = document.createElement("div")
        row.className = "tree-row"

        const removeBtn = node.type !== "id"
            ? `<button class="btn btn-secondary" onclick="removeCssProperty(${i})">-</button>`
            : ""

        row.innerHTML = `
            ${removeBtn}
            <span>${node.type} <b>${node.name}</b></span>
        `
        tree.appendChild(row)

        // Valeurs
        const values = createValuesBlock(node, i, properties)
        tree.appendChild(values)
    })
}

function createValuesBlock(node, i, properties) {
    const values = document.createElement("div")
    values.className = "tree-values"
    values.id = `values-${i}`   // 👈 clé importante

    renderValuesContent(values, node, i, properties)

    return values
}

function renderValuesContent(container, node, i, properties) {
    container.innerHTML = ""

    node.values.forEach((v, j) => {
        const vrow = document.createElement("div")
        vrow.className = "tree-row"
        vrow.innerHTML = `
            <button class="btn btn-secondary" onclick="removeValue(${i}, ${j})">-</button>
            <input value="${v}" onchange="updateValue(${i}, ${j},this.value)" style="width:230px;">
        `
        container.appendChild(vrow)
    })

    const addVal = document.createElement("div")
    addVal.className = "tree-row"
    addVal.innerHTML = `
        <button class="btn btn-secondary" onclick="addValue(${i})">+</button>
        <input placeholder="Nouvelle valeur" style="width:225px;">
    `

    addVal.querySelector("input").onchange = (e) => {
        properties.props.css[i].values.push(e.target.value)
        refreshValues(i)
    }

    container.appendChild(addVal)
}

function refreshValues(i) {
    const properties = currentConfigNode
    const node = properties.props.css[i]

    const container = document.getElementById(`values-${i}`)
    if (!container) return

    renderValuesContent(container, node, i, properties)
}

function renderTreeById() {
    renderTreeGeneric(node => node.type === "id", false)
}

function renderTree() {
    renderTreeGeneric(node => node.type !== "id", true)
}

function showAddNode(){

    const tree = document.getElementById("cssTree")

    const rootButton = document.getElementById("root-button")
    rootButton.style.display = "none"

    const row = document.createElement("div")
    row.className="tree-row"

    row.innerHTML = `<select id="newType" style="width:70px;">
                        <option>tag</option>
                        <option>class</option>
                     </select>
                     <input id="newName" placeholder="Nom" style="width:210px;">
                     <button class="btn btn-secondary" onclick="addNode()">Ajouter</button>`

    tree.prepend(row)
}

function addNode(){
    const properties = currentConfigNode

    const type = document.getElementById("newType").value
    const name = document.getElementById("newName").value

    if (name.trim() === "") {
        alert("Veuillez renseigner le nom de la ressource")
        document.getElementById("newName").focus()
        return
    }
    properties.props.css.push({
        type:type,
        name:name,
        values:[]
    })

    renderTree()
}

function removeCssProperty(i){
    const properties = currentConfigNode
    properties.props.css.splice(i,1)
    renderTree()
}

function addValue(i){
    const properties = currentConfigNode
    properties.props.css[i].values.push("")
    refreshValues(i)
}

function removeValue(i,j){
    const properties = currentConfigNode
    properties.props.css[i].values.splice(j,1)
    refreshValues(i)
}

function updateValue(i,j,val){
    const properties = currentConfigNode
    properties.props.css[i].values[j]=val
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
            <button class="btn btn-primary" onclick="saveBlockProps()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
}

function saveBlockProps() {
    const node = currentConfigNode
    const id = document.getElementById("id").value
    if (id.trim() !== "") {
        node.props.id = id
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
// popup events
// *******************************************************************************
function popupEvents(node){

    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label>Événements :</label>
            </div>

            <div id="events-container"></div>

            <div class="dialog-row">
                <button class="btn btn-secondary" onclick="addEventRow()">+ Ajouter un événement</button>
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="saveEvents()">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
        const container = document.getElementById("events-container")

        const events = node.events || {}

        Object.entries(events).forEach(([type, config]) => {
            const row = createEventRow({
                type,
                action: config
            })

            row.querySelector(".event-type").value = type
            row.querySelector(".event-action").value = config.type + "(" + config.params + ")"

            container.appendChild(row)
        })
}

function saveEvents() {
    const node = currentConfigNode
    node.events = collectEvents()
    closeDialog()
}

function addEventRow() {
    const container = document.getElementById("events-container")
    const row = createEventRow()
    container.appendChild(row)
}

function stringifyAction(config) {
    if (!config) return ""

    if (!config.params || config.params.length === 0) {
        return config.type
    }

    return `${config.type}(${config.params})`
}

const AVAILABLE_EVENTS = [
    "click",
    "dblclick",
    "mouseenter",
    "mouseleave",
    "change"
]

function createEventRow(event = {}) {
    const row = document.createElement("div")
    row.className = "dialog-row"

    row.innerHTML = `
        <select class="event-type" style="width:120px; margin-right:7px;">
            ${AVAILABLE_EVENTS.map(e => `<option value="${e}">${e}</option>`).join("")}
        </select>

        <input class="event-action" placeholder="addValue(2)" style="margin-right:7px;">

        <button class="btn btn-secondary remove-event">-</button>
    `
    if (event.type) {
        row.querySelector(".event-type").value = event.type
    }

    if (event.action) {
        row.querySelector(".event-action").value = event.action
    }

    row.querySelector(".remove-event").onclick = () => row.remove()

    return row
}

function parseAction(str) {
    const match = str.match(/^(\w+)\((.*)\)$/)

    if (!match) {
        return { type: str, params: "" }
    }

    const type = match[1]
    const params = match[2]
        //.split(",")
        //.map(p => p.trim())
        //.filter(p => p.length > 0)

    return { type, params }
}

function collectEvents() {
    const rows = document.querySelectorAll("#events-container .dialog-row")
    const events = {}

    rows.forEach(row => {
        const type = row.querySelector(".event-type").value
        const actionStr = row.querySelector(".event-action").value
        const parsed = parseAction(actionStr)

        events[type] = {
            type: parsed.type,
            params: parsed.params
        }
    })

    return events
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

function updateWorkspaceJS(jsTree){
  workspaceRoot.props.js = jsTree
  console.log("JS updated:", jsTree)
}

function openIntFlow(){
  window.open("intflow.html")
}