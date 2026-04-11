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

const projectSelect=document.getElementById("projectSelect")
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
            console.log(data)
            project_name = data["project_name"]
            entity_name = data["entity_name"]
            console.log(project_name)
            console.log(entity_name)
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
            console.log(projects)
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
            deleteBST(f)
        })
        el.appendChild(label)
        el.appendChild(del)
        projectTree.appendChild(el)
    })
}

async function deleteBST(file){

    if(!confirm("Delete file '"+file+"' ?"))
        return

    const res = await fetch(
        "api/file_access_api.py?action=delete_bst",
        {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({
                project: currentProject,
                file: file
            })
        }
    )

    const data = await res.json()

    if(data.status === "ok"){

        const list = projects[currentProject]
        const idx = list.indexOf(file)

        if(idx !== -1)
            list.splice(idx,1)

        if(currentFile === file)
            currentFile = null

        renderProjectFiles(currentProject)

    }

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
            console.log(data)
            console.log(JSON.parse(data.filecontent))
            currentFile = fileid
            workspaceRoot = JSON.parse(data.filecontent).workspace||null
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

function computeInsertion(zoneEl,mouseY){

    const widgets=[...zoneEl.children].filter(
        c=>c.classList.contains("widget")
    )

    for(let i=0;i<widgets.length;i++){

        const rect=widgets[i].getBoundingClientRect()

        if(mouseY>=rect.top && mouseY<=rect.top+10)
            return{index:i,rectTop:rect.top}

        if(mouseY>=rect.bottom-10 && mouseY<=rect.bottom)
            return{index:i+1,rectTop:rect.bottom}

    }

    if(widgets.length===0){

        const rect=zoneEl.getBoundingClientRect()

        return{
            index:0,
            rectTop:rect.top
        }

    }

    const lastRect=widgets[widgets.length-1].getBoundingClientRect()

    if(mouseY>lastRect.bottom)
        return{
            index:widgets.length,
            rectTop:lastRect.bottom
        }

    return{
        index:widgets.length,
        rectTop:lastRect.bottom
    }

}

function showInsertLine(rectTop){

    const workspaceRect=workspaceEl.getBoundingClientRect()
    const scrollOffset=workspaceContent.scrollTop

    const y=rectTop-workspaceRect.top+scrollOffset

    if(!insertLine){

        insertLine=document.createElement("div")
        insertLine.className="insert-line"

        workspaceEl.appendChild(insertLine)

    }

    insertLine.style.top=y+"px"

}

workspaceContent.addEventListener("dragover",e=>{

    e.preventDefault()

    let zoneEl=e.target.closest(".zone")

    if(!zoneEl){

        if(workspaceRoot && workspaceRoot.type==="layout")
            return

        zoneEl=workspaceEl
    }
    const r=computeInsertion(zoneEl,e.clientY)

    if(!r)
        return

    currentDropTarget=zoneEl
    currentDropIndex=r.index

    showInsertLine(r.rectTop)

})

workspaceContent.addEventListener("dragleave",()=>{

    if(insertLine)
        insertLine.remove()

    insertLine=null

})

workspaceContent.addEventListener("drop",e=>{

    e.preventDefault()

    if(insertLine)
        insertLine.remove()

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
        if(currentDropTarget === workspaceEl){
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
            newParent = findNodeById(
                workspaceRoot,
                currentDropTarget.dataset.nodeId
            )

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

        insertNode(
            newParent,
            widget,
            currentDropIndex??newParent.children.length
        )

        render()

    }

    if(draggedType==="move-widget" && draggedNodeRef){

        let check=newParent

        while(check){

            if(check===draggedNodeRef)
                return

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
        props: node.props||{}
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

    newfile = false

    if(!currentProject){
        alert("Select a project or create one first")
        return
    }

    if(!workspaceRoot){
        alert("Workspace is empty")
        return
    }

    if(!currentFile){
        const name = prompt("File name (.bst):")

        if(!name) return

        currentFile = name.endsWith(".bst") ? name : name + ".bst"

        newfile = true
    }

    const payload = {
        project: currentProject,
        file: currentFile,
        workspace: serializeNode(workspaceRoot)
    }

    console.log(currentProject)

    const res = await fetch(
        "api/file_access_api.py?action=save",
        {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify(payload)
        }
    )

    const data = await res.json()

    if(data.status === "ok"){
        alert("File saved")
        if (newfile)
            projects[currentProject].push(currentFile)
        renderProjectFiles(currentProject)
    }
}

function clearProjectSelect(){

    const select = document.getElementById("projectSelect")

    for(let i = select.options.length - 1; i >= 0; i--){

        if(select.options[i].value !== ""){
            select.remove(i)
        }

    }

}

