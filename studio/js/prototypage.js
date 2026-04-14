async function getSession() {
    // 1. Récupération session
    const res = await fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ action: "read" })
    });
    let session = await res.json();
    // 2. Vérification
    if(!session || session.status || !session.auth) {
        window.opener.location.href = "signin.html";
        window.close()
        return;
    }
    return session
}

let projects={}
let currentProject=null
let currentFile=null

let workspaceRoot = {
                        id:generateId("Container"),
                        type:"container",
                        props:[],
                        children:[]
                    }
let draggedType=null
let draggedNodeRef=null
let draggedOldParent=null
let draggedOldIndex=null
let insertLine=null
let draggedLayoutZones = 4
let draggedWidgetType = null

const widgetDefinitions = {
    Block: { container: true },
    Form: { container: true },
    Text: { container: false },
    Span: { container: false },
    Label: { container: false },
    TextField: { container: false },
    Image: { container: false },
    Button: { container: false }
}

const projectTree=document.getElementById("projectTree")
const workspaceEl=document.getElementById("workspace")
const workspaceContent=document.querySelector("#workspace-panel .panel-content")
const trashEl=document.getElementById("trash")

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")
console.log(projectid)

// récupérer le nom du projet et le nom de l'entity auquel le projet appartient
let project_name = null
let entity_name = null

async function initPrototypage() {
    const session = await getSession()
    if (session) {
        fetch("/pybee/studio/api/projects.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getprojectandentity",
                id : projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            project_name = data["project_name"]
            entity_name = data["entity_name"]
            loadProjectFiles()
        });
    }
}

function generateId(type){
    return type + "-" + crypto.randomUUID()
}

function createNode(type, options={}){
    if (type == "layout") {
        return{
            id:generateId(type),
            type:"layout",
            parent:null,
            props:{},
            children:[]
        }
    }
    if (type == "widget") {
        return{
            id:generateId(draggedWidgetType),
            type:"widget",
            parent:null,
            widgetType:draggedWidgetType,
            container: options.container,
            props:{},
            children:[]
        }
    }
    if (type == "zone") {
        return{
            id:generateId(type),
            type:"zone",
            parent:null,
            props:{},
            children:[]
        }
    }
}

function createLayout(zoneCount=4){

    const layout=createNode("layout")

    for(let i=0;i<zoneCount;i++){
        const zone=createNode("zone",{id:"z"+i})
        zone.parent=layout
        layout.children.push(zone)
    }

    return layout
}

function createWidget(){

    const def = widgetDefinitions[draggedWidgetType]

    const widget=createNode("widget", {container:def.container})

    if (def.container) {
        const zone=createNode("zone",{id:widget.id+"-zone"})

        zone.parent=widget
        widget.children.push(zone)
    }

    return widget
}

function insertNode(parent,node,index){
    node.parent=parent
    parent.children.splice(index,0,node)
}

function removeNode(node){

    if(!node || !node.parent)
        return

    const p = node.parent
    const i = p.children.indexOf(node)

    if(i !== -1)
        p.children.splice(i,1)

}

function findNodeById(node,id){

    if(!node)
        return null

    if(node.id===id)
        return node

    for(const c of node.children){
        const r=findNodeById(c,id)
        if(r) return r
    }

    return null
}

function rebuildParents(node,parent=null){
    node.parent=parent
    node.children.forEach(c => {
        rebuildParents(c,node)
    })
}

function render(){

    workspaceEl.innerHTML=""

    if(!workspaceRoot)
        return

    if (workspaceRoot.type === "layout") {
        workspaceEl.appendChild(renderLayout(workspaceRoot))
        document.getElementById("css_layout").style.display = "inline"    
    }

    workspaceRoot.children.forEach(child => {

        if(child.type==="zone")
            workspaceEl.appendChild(renderZoneLayout(child))

        if(child.type==="widget")
            workspaceEl.appendChild(renderWidget(child))

    })
}

function renderZone(zone){

    const zoneEl=document.createElement("div")

    zoneEl.className="zone"
    zoneEl.dataset.nodeId=zone.id

    zone.children.forEach(c=>{
        zoneEl.appendChild(renderWidget(c))
    })

    return zoneEl
}

function renderZoneLayout(zone){

    const zoneEl=document.createElement("div")

    zoneEl.className="zone"
    zoneEl.dataset.nodeId=zone.id

    const label=document.createElement("span")
    label.textContent=zone.id
    
    const configBtn=document.createElement("button")
    configBtn.textContent="⚙"
    configBtn.style.marginRight="6px"
    configBtn.onclick=(e)=>{
        e.stopPropagation()
        openConfigPopup(zone)
    }

    zoneEl.appendChild(configBtn)
    zoneEl.appendChild(label)

    zone.children.forEach(c=>{
        zoneEl.appendChild(renderWidget(c))
    })

    return zoneEl
}

function renderLayout(layout){

    const el = document.createElement("div")

    el.className = "layout"
    el.dataset.nodeId = layout.id

    const label=document.createElement("span")
    label.textContent=layout.id
    
    //const configBtn=document.createElement("button")
    //configBtn.textContent="⚙"
    //configBtn.style.marginRight="6px"
    //configBtn.onclick=(e)=>{
    //    e.stopPropagation()
    //    openConfigPopup(layout)
    //}

    //el.appendChild(configBtn)
    el.appendChild(label)
    el.dataset.nodeId=layout.id

    return el
}

function renderWidget(widget){

    const el=document.createElement("div")

    el.className="widget"
    
    const configBtn=document.createElement("button")
    configBtn.textContent="⚙"
    configBtn.style.marginRight="6px"
    configBtn.onclick=(e)=>{
        e.stopPropagation()
        openConfigPopup(widget)
    }

    const label=document.createElement("span")
    label.textContent=widget.id

    el.appendChild(configBtn)
    el.appendChild(label)
    el.dataset.nodeId=widget.id
    el.draggable=true

    if (widget.container)
        el.appendChild(renderZone(widget.children[0]))

    return el
}

function workspaceHasWidgets(){

    if(!workspaceRoot)
        return false

    return workspaceRoot.children.some(n => n.type === "widget")

}

async function loadProjectFiles(){
    try{
        fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id : projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            projects=data
            renderProjectFiles()
        });
    }catch(e){
        projects={}
    }
}

function renderProjectFiles() {

    projectTree.innerHTML=""
    const files=projects
    files.forEach(f=>{
        const el=document.createElement("div")
        el.className="tree-file"
        el.style.display="flex"
        el.style.alignItems="center"
        const label=document.createElement("span")
        label.textContent="📄 " + f.pagename + "_" + f.id
        label.style.cursor="pointer"
        label.addEventListener("click",()=>{
            loadBST(f.id)
        })
        const del=document.createElement("button")
        del.textContent="🗑"
        del.style.marginLeft="auto"
        del.addEventListener("click",(e)=>{
            e.stopPropagation()
            deleteBST(f.id)
        })
        el.appendChild(label)
        el.appendChild(del)
        projectTree.appendChild(el)
    })
}

async function deleteBST(file){
    await fetch("/pybee/studio/api/projectfiles.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getbyid",
            id : file
        })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.error) {
            if(!confirm("Delete file '"+ data.pagename + "_" + data.id +"' ?")) {
                return
            } else {
                fetch("/pybee/studio/api/projectfiles.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "deletebyid",
                        id : file
                    })
                })
                .then(r => r.json())
                .then(data => {
                    loadProjectFiles()
                });
            }
        }
    });
}

async function loadBST(fileid){

    if(workspaceRoot){
        if(!confirm("Workspace will be replaced. Continue ?"))
            return
    }

    try{
        fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id : fileid
            })
        })
        .then(r => r.json())
        .then(data => {
            currentFile = fileid
            workspaceRoot = JSON.parse(data.filecontent)||null
            if(workspaceRoot){
                rebuildParents(workspaceRoot, null)
            }
            render()
        });
    }catch(e){

        console.error(e)

    }

}



document.getElementById("newPageBtn").addEventListener("click",()=>{

    workspaceRoot=null
    workspaceEl.innerHTML=""
    currentFile=null
})

document.querySelectorAll(".palette-item").forEach(item=>{

    item.addEventListener("dragstart",()=>{

        draggedType=item.dataset.type

        if(draggedType==="layout"){
            draggedLayoutZones=parseInt(item.dataset.zones)
        }

        if(draggedType === "widget"){
            draggedWidgetType = item.dataset.widget
        }
        draggedNodeRef=null

        // fermer la fénêtre de configuration éventuellement ouverte
        document.getElementById("configPopup").style.display="none"
    })

})

document.addEventListener("dragstart",e=>{

    const widgetEl=e.target.closest(".widget")

    console.log(widgetEl)

    if(!widgetEl)
        return

    draggedType="move-widget"

    draggedNodeRef=findNodeById(
        workspaceRoot,
        widgetEl.dataset.nodeId
    )

    if(!draggedNodeRef)
        return

    draggedOldParent=draggedNodeRef.parent
    draggedOldIndex=draggedOldParent.children.indexOf(draggedNodeRef)

})

let currentDropTarget=null
let currentDropIndex=null

function showInsertLine(zoneEl, index){
    if (!insertLine) {
        insertLine = document.createElement("div")
        insertLine.className = "insert-line"
    }
    const widgets = [...zoneEl.querySelectorAll(":scope > .widget")]
    let referenceNode = null
    if (index < widgets.length) {
        referenceNode = widgets[index]
    }
    if (insertLine.parentNode === zoneEl) {
        if (
            (referenceNode && insertLine.nextSibling === referenceNode) ||
            (!referenceNode && insertLine === zoneEl.lastChild)
        ) {
            return // déjà au bon endroit → on ne fait rien
        }
    }
    if (referenceNode) {
        zoneEl.insertBefore(insertLine, referenceNode)
    } else {
        zoneEl.appendChild(insertLine)
    }
}

workspaceContent.addEventListener("dragover", e => {
    e.preventDefault()
    let element = document.elementFromPoint(e.clientX, e.clientY)
    let zoneEl = element?.closest(".zone")
    if (!zoneEl) {
        // fallback : workspace principal
        zoneEl = workspaceEl
    }
    if (!zoneEl) return
    const widgets = [...zoneEl.querySelectorAll(":scope > .widget")]
    element = document.elementFromPoint(e.clientX, e.clientY)
    const widget = element?.closest(".widget")
    let index = widgets.length
    if (widget && zoneEl.contains(widget)) {
        const rect = widget.getBoundingClientRect()
        const middle = rect.top + rect.height / 2
        if (e.clientY < middle) {
            index = widgets.indexOf(widget)
        } else {
            index = widgets.indexOf(widget) + 1
        }
    } else {
        for (let i = 0; i < widgets.length; i++) {
            const rect = widgets[i].getBoundingClientRect()
            if (e.clientY < rect.top) {
                index = i
                break
            }
        }
    }
    currentDropTarget = zoneEl
    currentDropIndex = index
    showInsertLine(zoneEl, index)
})

workspaceContent.addEventListener("dragleave",()=>{
    if(insertLine) insertLine.remove()
    insertLine=null
})

workspaceContent.addEventListener("drop",e=>{
    e.preventDefault()
    if(insertLine) insertLine.remove()
    insertLine=null
    if(draggedType==="layout"){
        if(workspaceHasWidgets()){
            alert("Workspace already contains widgets.")
            return
        }
        workspaceRoot = createLayout(draggedLayoutZones)       
        document.getElementById("css_layout").style.display = "inline"
        render()
        return
    }
    let newParent = null
    // drop dans un container existant
    if(currentDropTarget){
        // cas spécial : drop directement dans le workspace
        if(currentDropTarget === workspaceEl) {
            if(!workspaceRoot){
                workspaceRoot = {
                    id: generateId("Container"),
                    type: "container",
                    props: [],
                    children: []
                }
            }
            newParent = workspaceRoot
        } else {
            newParent = findNodeById(workspaceRoot, currentDropTarget.dataset.nodeId)
            if(!newParent)
                return
        }
    }
    if(newParent.parent && newParent.parent.type === "widget" && !newParent.parent.container){
        return
    }
    if(draggedType==="widget"){
        if(workspaceRoot && workspaceRoot.type === "layout" && newParent === workspaceRoot) {
            alert("Cannot add root widgets when a layout exists.")
            return
        }
        const widget=createWidget("widget")
        insertNode(newParent, widget, currentDropIndex??newParent.children.length)
        render()
    }
    if(draggedType === "move-widget" && draggedNodeRef){
        let check = newParent
        while(check) {
            if(check === draggedNodeRef) return
            check=check.parent
        }
        removeNode(draggedNodeRef)
        let idx=currentDropIndex??newParent.children.length
        insertNode(newParent,draggedNodeRef,idx)
        render()
    }
    currentDropTarget=null
    currentDropIndex=null
})

trashEl.addEventListener("dragover",e=>{
    e.preventDefault()
})

trashEl.addEventListener("drop",e=>{
    e.preventDefault()
    if(draggedType==="move-widget" && draggedNodeRef){
        removeNode(draggedNodeRef)
        render()
    }
})

function serializeNode(node){
    const out = {
        id: node.id,
        type: node.type,
        props: node.props||{},
        container:node.container
    }
    if(node.zones){
        out.zones = node.zones.map(zone =>
            zone.map(child => serializeNode(child))
        )
    }
    if(node.children){
        out.children = node.children.map(child =>
            serializeNode(child)
        )
    }
    return out
}

async function saveFileBST(){
    let newfile = false
    let overwrite = false
    let pagename = ""
    let currentfilefound = null
    if(!workspaceRoot){
        alert("Workspace is empty")
        return
    }
    if(!currentFile){
        pagename = prompt("Page name ?")
        if(!pagename) return
        await fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbypagename",
                pagename: pagename
            })
        })
        .then(r => r.json())
        .then(data => {
            if (!data.error) {
                overwrite = true
                currentfilefound = data.id
            }
        });
        newfile = true
    }
    if (newfile) {
        if (overwrite) {
            if (confirm("File already exists. Overwrite?")) {
                // UPDATE
                fetch("/pybee/studio/api/projectfiles.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "filecontent",
                        id : currentfilefound,
                        filecontent: JSON.stringify(serializeNode(workspaceRoot))
                    })
                })
                .then(r => r.json())
                .then(res => {
                    if(res.status === "ok") {
                        alert("File saved")
                    } else {
                        alert("Network error : file not saved")
                    }
                });
            }
        } else {
            // INSERT
            fetch("/pybee/studio/api/projectfiles.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    id_project : projectid,
                    pagename: pagename,
                    filecontent: JSON.stringify(serializeNode(workspaceRoot))
                })
            })
            .then(r => r.json())
            .then(res => {
                if(res.status === "ok") {
                    alert("New file created")
                    loadProjectFiles()
                } else {
                    alert("Network error : file not created")
                }
            });
        }
    } else {
        // UPDATE
        fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "filecontent",
                id : currentFile,
                filecontent: JSON.stringify(serializeNode(workspaceRoot))
            })
        })
        .then(r => r.json())
        .then(res => {
            if(res.status === "ok") {
                alert("File saved")
            } else {
                alert("Network error : file not saved")
            }
        });
    }
}
