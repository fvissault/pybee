async function getSession() {
    // 1. Récupération session
    const res = await fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ action: "read" })
    });
    const session = await res.json();
    //console.log(session)
    // 2. Vérification
    if(!session || session.status || !session.auth) {
        if (intflow && !intflow.closed) intflow.close()
        window.opener.location.href = "signin.html";
        window.opener.focus()
        window.close()
        return;
    }
    return session
}

let pages = {}
let components = {}
let js = {}
var jsfileid = null
var project_name = null
let currentProject = null
let currentPage = null
let currentComponent = null
let currentPopup = null
let tosave = false
let perspective = "page"
let intflow = null

let workspaceRoot = {
    id:generateId("Container"),
    type:"container",
    props:{
        instanceCounter: 0,
        cssfiles: [],
        jsfiles: [],
        metas: []
    },
    css:[],
    js:[],
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
let draggedWidgetId = null

document.getElementById("workspace_content").innerText = "Création d'une page"

const widgetDefinitions = {
    Block: {
        name: t("block"), 
        container: true, 
        allowSelf: true,
        allowedChildren: ["all"] 
    },
    Form: { 
        name: t("form"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["all"] 
    },
    Ul: { 
        name: t("ul"), 
        container: true, 
        allowSelf: true,
        allowedChildren: ["Li"] 
    },
    Ol: { 
        name: t("ol"), 
        container: true, 
        allowSelf: true,
        allowedChildren: ["Li"] 
    },
    Li: { 
        name: t("li"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["all"] 
    },
    Paragraph: { 
        name: t("paragraph"), 
        container: true, 
        allowSelf: true,
        allowedChildren: ["all"] 
    },
    Fieldset: { 
        name: t("fieldset"), 
        container: true, 
        allowSelf: true,
        allowedChildren: ["all"] 
    },
    Article: { 
        name: t("article"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["all"]
    },
    Header: { 
        name: t("header"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["all"] 
    },
    Footer: { 
        name: t("footer"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["all"] 
    },
    Text: { 
        name: t("text"), 
        container: false 
    },
    Span: { 
        name: t("span"), 
        container: true,
        allowSelf: true,
        allowedChildren: ["Text", "Strong", "Em", "Anchor", "Image", "Br"] 
    },
    Label: { 
        name: t("label"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["Text", "Span", "Strong", "Em", "Anchor", "Image", "Br"] 
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
        container: true, 
        allowSelf: false,
        allowedChildren: ["Text", "Image"] 
    },
    Anchor: { 
        name: t("anchor"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["Text", "Image", "Title", "Span", "Paragraph"] 
    },
    Title: { 
        name: t("htitle"), 
        container: true, 
        allowSelf: false,
        allowedChildren: ["Text", "Image", "Span"] 
    },
    Component: { 
        name: "Composant", 
        container: true, 
        allowSelf: true,
        allowedChildren: ["all"] 
    }
}

function isNodeAllowed(parent, widget) {
    if (parent === workspaceRoot) return true
    const parentAllowedChildren = widgetDefinitions[parent.parent.widgetType].allowedChildren
    const parentAllowSelf = widgetDefinitions[parent.parent.widgetType].allowSelf
    if (parentAllowedChildren.includes("all")) {
        if (parent.parent.widgetType === widget.widgetType && parentAllowSelf === false)
            return parentAllowSelf
        else
            return true
    } else {
        return parentAllowedChildren.includes(widget.widgetType)
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
let entity_name = null

async function initPrototypage() {
    const session = await getSession()
    //console.log(session)
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
            entity_id = data["entity_id"]
            //console.log(entity_id)
            loadProjectFiles()

            document.querySelectorAll(".palette_section").forEach(item=>{
                item.onclick = () => {
                    item.classList.toggle("collapsed");
                };
            })

            renderComponentSection(parseInt(entity_id))
        });
    }
}

window.addEventListener("beforeunload", function (e) {
    if (pagepreview) pagepreview.close()
    if (!tosave) return
    e.preventDefault()
    e.returnValue = ""
});

function generateId(type) {
    return type + "-" + crypto.randomUUID()
}

function createNode(type, options={}) {
    if (type == "widget") {
        return {
            id:generateId(draggedWidgetType),
            type:"widget",
            name: options.name,
            parent:null,
            widgetType: draggedWidgetType,
            container: options.container,
            props: {},
            children: [],
            ui: { collapsed : true }
        }
    }
    if (type == "zone") {
        return {
            id:generateId(type),
            type: "zone",
            parent: null,
            props: { id: options.id },
            css: options.css,
            children: []
        }
    }
}

async function createWidget() {
    const def = widgetDefinitions[draggedWidgetType]
    if (draggedWidgetType === "Component") {
        const response = await fetch("/pybee/studio/api/components.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id: parseInt(draggedWidgetId)
            })
        })
        const data = await response.json()
        //console.log(data)
        const widget = createNode("widget", { container: def.container, name: data.name })
        if (def.container) {
            //on insère le widget dans la feuille
            const instanceId = workspaceRoot.props.instanceCounter
            const zone = createNode("zone")
            const content = JSON.parse(data.content)
            updateInstanceIds(content, instanceId)
            rebuildParents(content)
            zone.children = content.children
            zone.parent = widget
            widget.children.push(zone)

            // créer le fichier global css du composant seulement si du css existe
            // si du css existe, on l'ajoute au cssfiles de la page ou le composant est insérer
            saveGlobalcss(workspaceRoot, content)

            // création du fichier js spécifique à l'instance du composant
            // je créé le fichier d'encapsulation du code du composant : component[component_name].js
            // 1. lecture en base du code du composant
            await fetch("/pybee/studio/api/jsfiles.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getbyname",
                    name: content.props.name
                })
            })
            .then(r => r.json())
            .then(res => {
                //console.log(res)
                if(!res.error) {
                    saveJsEncapsulation(workspaceRoot, content, res)
                    saveInitComponents(workspaceRoot, content, instanceId)
                }
            });

        }
        return widget
    }
    const widget = createNode("widget", { container: def.container, name: def.name })
    if (def.container) {
        const zone = createNode("zone")
        zone.parent = widget
        widget.children.push(zone)
    }
    return widget
}

async function saveInitComponents(node, content, instanceId) {
    // lire le contenu du fichier init de node
    const response = await fileReadAction("js", `${node.props.name}_components_init`)
    if (response.status === "ok") {
        const initcontent =  `${reponse.file_content}component${content.props.name}.createComponent(${instanceId});\n`
        const filesave = await fileSaveAction("js", `${node.props.name}_components_init`, initcontent)
        if (filesave.status === "ok") {
            console.log(`Insertion de l'initialisation de l'instance du composant ${content.props.name} : ok`)
            insertFile(node, "js", `${node.props.name}_components_init`)
        } else {
            console.log(`Insertion de l'initialisation de l'instance du composant ${content.props.name} : nok`)
        }
    }
}

function saveJsEncapsulation(node, content, jsToEncapsulate) {
    fetch("/pybee/studio/api/jsfiles.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getbyname",
            name: content.props.name
        })
    })
    .then(r => r.json())
    .then(async res => {
        //console.log(res)
        if(!res.error) {
            // 2. générer le code js
            const componentjs = generate(JSON.parse(jsToEncapsulate.content), 1)
            // 3. encapsuler ce qui a été généré : le nom de l'encapsulation pourrait être component[component_name]
            const encapsulation = `const component${content.props.name} = (() => {\n${componentjs}\n   return { createComponent };\n})();` 
            // 4. sauvegarder le fichier
            const response = await fileSaveAction("js", `component${content.props.name}`, encapsulation)
            if (response.status === "ok") {
                console.log(`Encapsulation du composant ${content.props.name} : ok`)
                insertFile(node, "js", `component${content.props.name}`) 
            } else {
                console.log(`Encapsulation du composant ${content.props.name} : nok`)
            }
        }
    });
}

async function saveGlobalcss(node, content) {
    // créer le fichier global css du composant seulement si du css existe
    // si du css existe, on l'ajoute au cssfiles de la page ou le composant est insérer
    const globalcss = generateglobalcss(content)
    //console.log(globalcss)
    if (globalcss != "") {
        const response = await fileSaveAction("css", content.props.name, globalcss)
        //console.log(response)
        if (response.status === "ok") {
            console.log(`Génération du css global du composant ${content.props.name} : ok`)
            insertFile(node, "css", content.props.name)
        } else {
            console.log(`Génération du css global du composant ${content.props.name} : nok`)
        }
    }

}

function insertFile(node, fileType, filename) {
    if (fileType === "css") {
        if (!node.props.cssfiles) node.props.cssfiles = []
        const exists = node.props.cssfiles.some(f => f.href === filename);
        if (!exists) node.props.cssfiles.push({include:true, href:filename, type:"stylesheet"})
    }
    if (fileType === "js") {
        if (!node.props.jsfiles) node.props.jsfiles = []
        const exists = node.props.jsfiles.some(f => f.href === filename);
        if (!exists) node.props.jsfiles.push({include:true, src:filename, defer:true})
    }
}

function updateInstanceIds(node, instanceId) {
    if (!node || typeof node !== "object")
        return

    // ID HTML
    if (node.props?.id)
        node.props.id = `${node.props.id}_${instanceId}`

    // Sélecteur CSS de type ID
    if (Array.isArray(node.css)) {
        node.css.forEach(rule => {
            if (rule.type === "id" && rule.name)
                rule.name = `${rule.name}_${instanceId}`
        })
    }

    if (Array.isArray(node.children)) {
        node.children.forEach(child => {
            updateInstanceIds(child, instanceId)
        })
    }
}

function insertNode(parent, node, index) {
    node.parent=parent
    parent.children.splice(index,0,node)
}

function removeNode(node) {

    if (!node || !node.parent)
        return

    const p = node.parent
    const i = p.children.indexOf(node)

    if (i !== -1)
        p.children.splice(i,1)

}

function findNodeById(node,id) {
    if (!node) return null
    if (node.id === id) return node
    for(const c of node.children){
        const r = findNodeById(c,id)
        if (r) return r
    }
    return null
}

function rebuildParents(node,parent=null) {
    node.parent = parent
    node.children.forEach(c => {
        rebuildParents(c,node)
    })
}

function workspaceHasWidgets() {
    if (!workspaceRoot) return false
    return workspaceRoot.children.some(n => n.type === "widget")
}

async function loadProjectFiles() {
    const session = await getSession()
    try {
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
            //console.log(data)
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
            //console.log(data)
            components=data
        });

        await fetch("/pybee/studio/api/jsfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id : projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            //console.log(data)
            js=data
        });
        renderProjectFiles()
    } catch(e) {
        console.log(e)
        pages = {}
        components = {}
        js = {}
    }
}

document.querySelectorAll(".palette-item").forEach(item => {
    item.addEventListener("dragstart",() => {
        draggedType = item.dataset.type
        if(draggedType === "widget") {
            draggedWidgetType = item.dataset.widget
            draggedWidgetId = item.dataset.id
        }
        draggedNodeRef = null
    })
})

document.addEventListener("dragstart", e => {
    const session = getSession()
    const widgetEl = e.target.closest(".widget")
    //console.log(widgetEl)
    if (!widgetEl) return

    draggedType = "move-widget"
    draggedNodeRef = findNodeById(workspaceRoot, widgetEl.dataset.nodeId)
    if (!draggedNodeRef) return

    draggedOldParent = draggedNodeRef.parent
    draggedOldIndex = draggedOldParent.children.indexOf(draggedNodeRef)
})

let currentDropTarget = null
let currentDropIndex = null

function showInsertLine(zoneEl, index) {
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

workspaceContent.addEventListener("dragleave",() => {
    if(insertLine) insertLine.remove()
    insertLine=null
})

workspaceContent.addEventListener("drop", async e => {
    e.preventDefault()
    if (insertLine) insertLine.remove()
    insertLine=null
    let newParent = null
    // drop dans un container existant
    if (currentDropTarget) {
        // cas spécial : drop directement dans le workspace
        if (currentDropTarget === workspaceEl) {
            if (!workspaceRoot) {
                workspaceRoot = {
                    id: generateId("Container"),
                    type: "container",
                    props: {
                        instanceCounter: 0,
                        jsfiles: [],
                        cssfiles: [],
                        metas: []
                    },
                    css:[],
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

    workspaceRoot.props.instanceCounter++

    if (newParent.parent && newParent.parent.type === "widget" && !newParent.parent.container) return

    if (draggedType==="widget") {
        const widget = await createWidget()
        if (isNodeAllowed(newParent, widget)) {
            insertNode(newParent, widget, currentDropIndex??newParent.children.length)
        } else {
            alert(`${widget.widgetType} n'est pas autorisé dans ${newParent.parent.widgetType}`)
        }
        render()
    }
    if(draggedType === "move-widget" && draggedNodeRef) {
        let check = newParent
        while (check) {
            if (check === draggedNodeRef) return
            check=check.parent
        }
        if (isNodeAllowed(newParent, draggedNodeRef)) {
            removeNode(draggedNodeRef)
            insertNode(newParent, draggedNodeRef, currentDropIndex??newParent.children.length)
        } else {
            alert(`${draggedNodeRef.widgetType} n'est pas autorisé dans ${newParent.parent.widgetType}`)
        }
        render()
    }
    currentDropTarget = null
    currentDropIndex = null

    tosave = true
    document.getElementById("savebtn").className = "tosave"
})

function hasComponent(node, name) {
    if (!node?.children) return false;
    return node.children.some(child => (child.type === "widget" && child.widgetType === "Component" && child.name === name) || hasComponent(child, name));
}

trashEl.addEventListener("dragover",e => {
    e.preventDefault()
})

trashEl.addEventListener("drop",e => {
    e.preventDefault()
    if(draggedType === "move-widget" && draggedNodeRef) {
        removeNode(draggedNodeRef)
        if (draggedWidgetType === "Component") {
            // c'est un composant que je suis en train de mettre à la poubelle
            if (!hasComponent(workspaceRoot, draggedNodeRef.name)) {
                // le composant n'existe plus dans la page
                console.log("le composant n'existe plus dans la page")
                const index = workspaceRoot.props.cssfiles.findIndex(f => f.href === draggedNodeRef.name);
                if (index !== -1) workspaceRoot.props.cssfiles.splice(index, 1);
            }
        }
        render()
    }
    tosave = true
    document.getElementById("savebtn").className = "tosave"
})

function setToSave(value){
    tosave = value
}