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
    document.getElementById("dialog").style.display="block"
}

function closeDialog(){
    document.getElementById("dialog").style.display="none"
}

function buildPopupContent(node, cat){

    if(node.type==="widget"){

        switch(node.widgetType){

            case "Button":
                return popupButton(node)

            case "Text":
                return popupText(node)

            case "Span":
                return popupSpan(node)

            case "Image":
                return popupImage(node)

            case "Block":
                return popupBlock(node)

            case "Form":
                return popupForm(node)

        }

    }

    if(node.type==="layout") {
        if (cat == "html") return popupLayout(node)
        if (cat == "lcss") {
            initPropsStruct()
            return popupLayoutCss(node)
        }
        if (cat == "css") return popupWorkspaceCss(node)
        if (cat == "js") {
            return popupWorkspaceJs(node)
        }
        if (cat == "model") return popupWorkspaceModel(node)
    }

    if(node.type==="container") {
        if (cat == "html") popupWorkspace(node)
        if (cat == "css") popupWorkspaceCss(node)
        if (cat == "js") return popupWorkspaceJs(node)
        if (cat == "model") return popupWorkspaceModel(node)
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
        <button class="config_button_apply" onclick="saveButtonProps()">Apply</button>
        <button class="config_button_close" onclick="closeDialog()">Close</button>
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

    return `
        <h3 style="text-align:center;">Only text</h3>
        <div style="margin-bottom:5px;"><label for="prop_text">Text :</label></div>
        <textarea id="prop_text" style="width:275px; height:50px;">${text}</textarea>
        <br><br>
        <button class="config_button_apply" onclick="saveTextProps()">Apply</button>
        <button class="config_button_close" onclick="closeDialog()">Close</button>
    `
}

function saveTextProps(){
    const node=currentConfigNode
    node.props.text=document.getElementById("prop_text").value
    closeDialog()
    render()
}

// *******************************************************************************
// popup Span
// *******************************************************************************
function popupSpan(node){

    const text = node.props.content||""
    const id = node.props.id||""

    return `
        <h3 style="text-align:center;">Span</h3>
        <div style="margin-bottom:5px;"><label for="span_id">Id :</label></div>
        <input type="text" value="${id}" id="span_id" style="width:275px; padding:5px; background-color:#eee;"/><br><br>
        <div style="margin-bottom:5px;"><label for="span_content">Content :</label></div>
        <textarea id="span_content" style="width:275px; height:50px; padding:5px; background-color:#eee;">${text}</textarea>
        <br><br>
        <button class="config_button_apply" onclick="saveSpanProps()">Apply</button>
        <button class="config_button_close" onclick="closeDialog()">Close</button>
    `
}

function saveSpanProps(){
    const node=currentConfigNode
    node.props.id = document.getElementById("span_id").value
    node.props.content = document.getElementById("span_content").value
    closeDialog()
    render()
}

// *******************************************************************************
// popup Layout html
// *******************************************************************************
function popupLayout(node){

    const zone_count = node.children.length
    const page_name = workspaceRoot.props.name||""
    const page_title = workspaceRoot.props.title||""

    return `
        <h3 style="text-align:center;">Layout</h3>
        <div style="margin-bottom:5px;"><label for="page_name">* Page name :</label></div>
        <input type="text" value="${page_name}" id="page_name" style="width:340px; padding:5px; background-color:#eee;"/><br><br>
        <div style="margin-bottom:5px;"><label for="page_title">Page title :</label></div>
        <input type="text" value="${page_title}" id="page_title" style="width:340px; padding:5px; background-color:#eee;"/><br><br>
        <div style="margin-bottom:5px;"><label for="layout_zone_count">Layout zone count :</label></div>
        <input type="text" value="${zone_count}" id="layout_zone_count" style="width:150px; padding:5px; background-color:#eee;" disabled/><br><br>
        <button class="config_button_apply" onclick="saveLayoutProps()">Apply</button>
        <button class="config_button_close" onclick="closeDialog()">Close</button>
    `
}

function saveLayoutProps(){
    const node=currentConfigNode

    const layoutname = document.getElementById("page_name").value
    if (layoutname == "") {
        alert("Page name is mandatory")
        document.getElementById("page_name").focus()
        return
    }
    node.props.name = layoutname.trim()

    const page_title = document.getElementById("page_title").value
    node.props.title = page_title.trim()

    const layout_zone_count = parseInt(document.getElementById("layout_zone_count").value)
    node.props.count = layout_zone_count
    closeDialog()
    render()
}

// *******************************************************************************
// popup Layout css
// *******************************************************************************
function popupLayoutCss(node) {

    return `
        <h3 style="text-align:center;">Layout css</h3>
        <div style="float:left; margin-right:5px;">
            <select id="layoutgrid_cat" style="width:130px; padding:5px;">
                <option value="grid-template-columns">Template columns</option>
                <option value="grid-template-rows">Template rows</option>
                <option value="grid-column-gap">Column gap</option>
                <option value="grid-row-gap">Row gap</option>
                <option value="other">other</option>
            </select>
        </div>
        <div style="float:left; margin-right:5px;">
            <input type="text" value="" id="layoutgrid_content" style="width:165px; padding:5px; background-color:#eee;"/>
        </div>
        <div style="float:left;">
            <button class="config_button_apply" onclick="addLayoutProp()">Add</button>
        </div>
        <div style="margin-bottom:5px;"><label for="layoutgrid_props">Layoutgrid properties :</label></div>
        <ul id="layoutgrid_props" style="width:350px; padding:0px; margin:0px; list-style-type: none; border:1px solid gray; min-height:100px; background-color:#eee;">
            ${buildLayoutCss(node.props.css||[])}
        </ul>
        <button class="config_button_close" onclick="closeDialog()">Close</button>
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
        result += `<li><button class="layout-del" style="margin-left:auto">-</button> ${values[i]}</li>`
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
    del.textContent="-"
    del.style.marginLeft="auto"

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
            <button class="btn btn-primary" onclick="saveWorkspaceProps()">Apply</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Close</button>
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
            <button class="btn btn-secondary" onclick="closeDialog()">Close</button>
        </div>
    `
}

function renderTree(){
    const properties = currentConfigNode

    const tree = document.getElementById("cssTree")
    tree.innerHTML = ""

    // bouton racine
    const addRoot = document.createElement("div")
    addRoot.className = "tree-row"
    addRoot.innerHTML = `<button id="root-button" class="btn btn-secondary" onclick="showAddNode()">+</button>`
    tree.appendChild(addRoot)

    if (!properties.props.css) properties.props.css = []
    const css = Array.isArray(properties.props.css) ? properties.props.css : []

    css.forEach((node,i)=>{

        const row = document.createElement("div")
        row.className = "tree-row"

        if (node.type == "id") {
            row.innerHTML =
            `<span>${node.type} <b>${node.name}</b></span>`

        } else {
            row.innerHTML =
            `<button class="btn btn-secondary" onclick="removeCssProperty(${i})">-</button>
            <span>${node.type} <b>${node.name}</b></span>`
        }
        tree.appendChild(row)

        // valeurs
        const values = document.createElement("div")
        values.className = "tree-values"

        node.values.forEach((v,j)=>{

            const vrow = document.createElement("div")
            vrow.className="tree-row"

            if (node.type == "id") {
                vrow.innerHTML =
                `<span>${v}</span>`
            } else {
                vrow.innerHTML =
                `<button class="btn btn-secondary" onclick="removeValue(${i},${j})">-</button>
                <input value="${v}" 
                onchange="updateValue(${i},${j},this.value)"  style="width:230px;">`
            }
            values.appendChild(vrow)

        })

        // ajout value
        const addVal = document.createElement("div")
        addVal.className="tree-row"

        if (node.type !== "id") {
            addVal.innerHTML =
            `<button class="btn btn-secondary" onclick="addValue(${i})">+</button>
            <input placeholder="Nouvelle valeur" style="width:225px;">`

            addVal.querySelector("input").onchange = (e)=>{
                properties.props.css[i].values.push(e.target.value)
                renderTree()
            }
        }


        values.appendChild(addVal)

        tree.appendChild(values)

    })

}

function showAddNode(){

    const tree = document.getElementById("cssTree")

    const rootButton = document.getElementById("root-button")
    rootButton.style.display = "none"

    const row = document.createElement("div")
    row.className="tree-row"

    row.innerHTML =
    `
    <select id="newType" style="width:70px;">
        <option>tag</option>
        <option>class</option>
    </select>
    <input id="newName" placeholder="Nom" style="width:210px;">
    <button class="btn btn-secondary" onclick="addNode()">Ajouter</button>
    `

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
    renderTree()
}

function removeValue(i,j){
    const properties = currentConfigNode
    properties.props.css[i].values.splice(j,1)
    renderTree()
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
return "<h3>Block</h3><p>No props yet</p>"
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