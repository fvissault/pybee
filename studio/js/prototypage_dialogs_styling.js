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

function renderTreeGeneric(filterFn, withRootButton = false, filterType = null) {
    const properties = currentConfigNode
    const tree = document.getElementById("cssTree")

    if (!tree) return

    tree.innerHTML = ""

    if (!properties.props.css) properties.props.css = []
    const css = Array.isArray(properties.props.css) ? properties.props.css : []

    if (withRootButton) {
        const addRoot = document.createElement("div")
        addRoot.className = "tree-row"

        addRoot.innerHTML = `<button id="root-button" class="btn btn-secondary" onclick="showAddNode('${filterType}')">+</button>`

        tree.appendChild(addRoot)
    }

    css.forEach((node, i) => {
        if (!filterFn(node)) return

        // Ligne principale
        const row = document.createElement("div")
        row.className = "tree-row"

        const removeBtn = `<button class="btn btn-secondary" onclick="removeCssProperty(${i}, '${filterType}')">-</button>`

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
    renderTreeGeneric(node => node.type === "id", true, "id")
}

function renderTree() {
    renderTreeGeneric(node => node.type !== "id", true)
}

function showAddNode(filter){

    const tree = document.getElementById("cssTree")

    const rootButton = document.getElementById("root-button")
    rootButton.style.display = "none"

    const row = document.createElement("div")
    row.className="tree-row"
    if (filter === "id") {
        row.innerHTML = `<input id="newName" placeholder="Nom" style="width:210px;">
                        <button class="btn btn-secondary" onclick="addNode('${filter}')">Ajouter</button>`

    } else {
        row.innerHTML = `<select id="newType" style="width:70px;">
                            <option>tag</option>
                            <option>class</option>
                        </select>
                        <input id="newName" placeholder="Nom" style="width:210px;">
                        <button class="btn btn-secondary" onclick="addNode('${filter}')">Ajouter</button>`
    }
    tree.prepend(row)
}

function addNode(filter){
    const properties = currentConfigNode

    const name = document.getElementById("newName").value
    if (name.trim() === "") {
        alert("Veuillez renseigner le nom de la ressource")
        document.getElementById("newName").focus()
        return
    }
    if (filter === "id") {
        properties.props.css.push({
            type:"id",
            name:name,
            values:[]
        })
        renderTreeById()
    } else {
        const type = document.getElementById("newType").value
        properties.props.css.push({
            type:type,
            name:name,
            values:[]
        })
        renderTree()
    }
}

function removeCssProperty(i, filter){
    const properties = currentConfigNode
    properties.props.css.splice(i,1)
    if (filter === "id") {
        renderTreeById()
    } else {
        renderTree()
    }
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
// popup Layout zone css
// *******************************************************************************
function popupCss(node) {
    const head = document.getElementById("dialogHeader")
    head.innerText = "Style de l'objet"
    const id = node.props.id||""
    let content = null
    if (id.trim() != "") {
        content = document.getElementById("dialogContent")
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
        content = document.getElementById("dialogContent")
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
