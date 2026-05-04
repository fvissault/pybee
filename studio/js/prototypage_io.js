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

async function loadBST(pageid){
    if (workspaceRoot) {
        if(!confirm("Workspace will be replaced. Continue ?"))
            return
    }
    try {
        fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id : pageid
            })
        })
        .then(r => r.json())
        .then(data => {
            currentPage = pageid
            perspective = "page"
            workspaceRoot = JSON.parse(data.filecontent)||null
            if (workspaceRoot) rebuildParents(workspaceRoot, null)
            render()
            document.getElementById("workspace_content").innerText = "Lecture de la page : " + data.pagename
        });
    } catch(e) {
        console.error(e)
    }

}

async function loadComponent(componentid){
    if (workspaceRoot) {
        if(!confirm("Workspace will be replaced. Continue ?"))
            return
    }
    try {
        fetch("/pybee/studio/api/components.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id : componentid
            })
        })
        .then(r => r.json())
        .then(data => {
            currentComponent = componentid
            perspective = "component"
            workspaceRoot = JSON.parse(data.content)||null
            if (workspaceRoot) rebuildParents(workspaceRoot, null)
            render()
            document.getElementById("workspace_content").innerText = "Lecture du composant : " + data.name
        });
    } catch(e) {
        console.error(e)
    }

}

async function loadPopup(componentid, popupid){
    if (workspaceRoot) {
        if(!confirm("Workspace will be replaced. Continue ?"))
            return
    }
    try {
        fetch("/pybee/studio/api/components.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id : componentid
            })
        })
        .then(r => r.json())
        .then(data => {
            currentPopup = popupid
            currentComponent = componentid
            perspective = "component"
            workspaceRoot = JSON.parse(data.content.popups[popupid].content)||null
            if (workspaceRoot) rebuildParents(workspaceRoot, null)
            render()
            document.getElementById("workspace_content").innerText = "Lecture de la popup : " + data.content.popups[popupid].name + " du composant : " + data.name
        });
    } catch(e) {
        console.error(e)
    }

}
function serializeNode(node) {
    let out = null
    if (node.type === "widget") {
        out = {
            id: node.id,
            type: node.type,
            widgetType: node.widgetType,
            name: node.name,
            props: node.props||{},
            css: node.css||{},
            events: node.events||{},
            js: node.js||{},
            container:node.container
        }
    } else if (node.type === "container" || node.type === "layout") {
        out = {
            id: node.id,
            type: node.type,
            name: node.name,
            props: node.props||{},
            css: node.css||{},
            events: node.events||{},
            js: node.js||{},
            container:node.container
        }
    } else {
        out = {
            id: node.id,
            type: node.type,
            container:node.container
        }
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

async function saveFileBST() {
    let newfile = false
    let overwrite = false
    let pagename = ""
    let currentfilefound = null
    if (workspaceRoot.children.length === 0) {
        alert("L'espace de travail est vide")
        return
    }
    if (!currentPage) {
        if (perspective === "page") {
            pagename = prompt("Page name ?")
            if (!pagename) return
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
                    newfile = false
                } else {
                    newfile = true
                }
            });
        } else {
            await fetch("/pybee/studio/api/composants.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getbyname",
                    name: workspaceRoot.props.name,
                    id_entity: workspaceRoot.props.entity_id 
                })
            })
            .then(r => r.json())
            .then(data => {
                if (!data.error) {
                    overwrite = true
                    currentfilefound = data.id
                    newfile = false
                } else {
                    newfile = true
                }
            });
        }
    }
    if (newfile) {
        if (perspective === "page") {
            // INSERT page
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
                    document.getElementById("workspace_content").innerText = "Nouvelle page créée : " + pagename
                    loadProjectFiles()
                } else {
                    alert("Network error : file not created")
                }
            });
        } else {
            // INSERT composant
            fetch("/pybee/studio/api/composants.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    name: workspaceRoot.props.name,
                    icon: workspaceRoot.props.icon,
                    description: workspaceRoot.props.description,
                    content: JSON.stringify(serializeNode(workspaceRoot)),
                    version: workspaceRoot.props.version,
                    type: workspaceRoot.props.type,
                    id_author: workspaceRoot.props.author_id,
                    id_entity: workspaceRoot.props.entity_id,
                    active: workspaceRoot.props.active?1:0
                })
            })
            .then(r => r.json())
            .then(res => {
                if(res.status === "ok") {
                    document.getElementById("workspace_content").innerText = "Nouveau composant créé : " + workspaceRoot.props.name
                    loadProjectFiles()
                } else {
                    alert("Network error : composant not created")
                }
            });
        }
    } else {
        if (perspective === "page") {
            if (confirm("Cette page existe déjà. Voulez-vous la remplacer par celle-la?")) {
                // UPDATE
                fetch("/pybee/studio/api/projectfiles.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "filecontent",
                        id : currentPage,
                        filecontent: JSON.stringify(serializeNode(workspaceRoot))
                    })
                })
                .then(r => r.json())
                .then(res => {
                    if(res.status === "ok") {
                        document.getElementById("workspace_content").innerText = "Page sauvegardée : " + workspaceRoot.props.pagename
                    } else {
                        alert("Network error : file not saved")
                    }
                });
            }
        } else {
            if (confirm("Ce compoant existe déjà. Voulez-vous le remplacer par celui-ci?")) {
                fetch("/pybee/studio/api/composants.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "update",
                        name: workspaceRoot.props.name,
                        icon: workspaceRoot.props.icon,
                        description: workspaceRoot.props.description,
                        content: JSON.stringify(serializeNode(workspaceRoot)),
                        version: workspaceRoot.props.version,
                        type: workspaceRoot.props.type,
                        id_author: parseInt(workspaceRoot.props.author_id),
                        id_entity: workspaceRoot.props.entity_id,
                        active: workspaceRoot.props.active?1:0,
                        id : currentfilefound
                    })
                })
                .then(r => r.json())
                .then(res => {
                    if(res.status === "ok") {
                        tosave = false
                        document.getElementById("savebtn").className = ""
                        document.getElementById("workspace_content").innerText = "Composant sauvegardé : " + workspaceRoot.props.name
                    } else {
                        alert("Network error : Composant not saved")
                    }
                });
            }
        }
    }
}
