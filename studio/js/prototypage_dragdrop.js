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

let pages = {}
let components = {}
let currentProject = null
let currentPage = null
let currentComponent = null
let currentPopup = null
let tosave = false
let perspective = "page"

let workspaceRoot = {
    id:generateId("Container"),
    type:"container",
    props:{},
    css:{},
    js:{},
    events:{},
    children:[]
}

let draggedType=null
let draggedNodeRef=null
let draggedOldParent=null
let draggedOldIndex=null
let insertLine=null
let draggedLayoutZones = 4
let draggedWidgetType = null

document.getElementById("workspace_content").innerText = "Création d'une page"

const widgetDefinitions = {
    Block: {
        name: t("block"), 
        container: true 
    },
    Form: { 
        name: t("form"), 
        container: true 
    },
    Ul: { 
        name: t("ul"), 
        container: true 
    },
    Ol: { 
        name: t("ol"), 
        container: true 
    },
    Li: { 
        name: t("li"), 
        container: true 
    },
    Paragraph: { 
        name: t("paragraph"), 
        container: true 
    },
    Fieldset: { 
        name: t("fieldset"), 
        container: true 
    },
    Article: { 
        name: t("article"), 
        container: true 
    },
    Header: { 
        name: t("header"), 
        container: true 
    },
    Footer: { 
        name: t("footer"), 
        container: true 
    },
    Text: { 
        name: t("text"), 
        container: false 
    },
    Span: { 
        name: t("span"), 
        container: false 
    },
    Label: { 
        name: t("label"), 
        container: false 
    },
    TextField: { 
        name: t("textfield"), 
        container: false 
    },
    Image: { 
        name: t("img"), 
        container: false 
    },
    Button: { 
        name: t("button"), 
        container: false 
    },
    Anchor: { 
        name: t("anchor"), 
        container: false 
    },
    Title: { 
        name: t("htitle"), 
        container: false 
    }
}

const projectTree=document.getElementById("projectTree")
const workspaceEl=document.getElementById("workspace")
const workspaceContent=document.querySelector("#workspace-panel .panel-content")
const trashEl=document.getElementById("trash")

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")
//console.log(projectid)

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

            document.querySelectorAll(".palette_section").forEach(item=>{
                item.onclick = () => {
                    item.classList.toggle("collapsed");
                };
            })

        });
    }
}

window.addEventListener("beforeunload", function (e) {
    if (!tosave) return
    e.preventDefault()
    e.returnValue = ""
});

function generateId(type){
    return type + "-" + crypto.randomUUID()
}

function createNode(type, options={}){
    if (type == "layout") {
        return {
            id:generateId(type),
            type:"layout",
            parent:null,
            props:{"id": "parentLayout"},
            children:[]
        }
    }
    if (type == "widget") {
        return {
            id:generateId(draggedWidgetType),
            type:"widget",
            name: options.name,
            parent:null,
            widgetType:draggedWidgetType,
            container: options.container,
            props:{},
            children:[]
        }
    }
    if (type == "zone") {
        return {
            id:generateId(type),
            type:"zone",
            parent:null,
            props: options,
            children:[]
        }
    }
}

function createLayout(zoneCount=4){

    const layout=createNode("layout")

    for(let i=0;i<zoneCount;i++){
        const zone=createNode("zone",{id:"z"+i, css: [{name: "z"+i, type:"id", values:["display:grid"]}]})

        zone.parent=layout
        layout.children.push(zone)
    }

    return layout
}

function createWidget(){

    const def = widgetDefinitions[draggedWidgetType]

    const widget=createNode("widget", {container:def.container, name:def.name})

    if (def.container) {
        const zone=createNode("zone")

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

function workspaceHasWidgets(){
    if(!workspaceRoot) return false
    return workspaceRoot.children.some(n => n.type === "widget")
}

async function loadProjectFiles(){
    const session = await getSession()
    try{
        await fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id : projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            pages=data
        });

        await fetch("/pybee/studio/api/components.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getallcomponents"
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            components=data
        });
        renderProjectFiles()
    }catch(e){
        pages={}
        components={}
    }
}

document.querySelectorAll(".palette-item").forEach(item=>{
    item.addEventListener("dragstart",()=>{
        draggedType=item.dataset.type
        if(draggedType==="layout"){
            draggedLayoutZones = parseInt(item.dataset.zones)
        }
        if(draggedType === "widget"){
            draggedWidgetType = item.dataset.widget
        }
        draggedNodeRef=null
    })
})

document.addEventListener("dragstart",e=>{
    const session = getSession()
    const widgetEl=e.target.closest(".widget")
    //console.log(widgetEl)
    if(!widgetEl) return

    draggedType="move-widget"
    draggedNodeRef=findNodeById(
        workspaceRoot,
        widgetEl.dataset.nodeId
    )
    if(!draggedNodeRef) return

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
                    props: {},
                    css:{},
                    js:{},
                    events:{},
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
    if (newParent.parent && newParent.parent.type === "widget" && !newParent.parent.container) return

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

    tosave = true
    document.getElementById("savebtn").className = "tosave"
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
    tosave = true
    document.getElementById("savebtn").className = "tosave"
})

