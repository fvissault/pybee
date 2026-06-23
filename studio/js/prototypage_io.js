async function deleteJS(fileid){
    await fetch("/pybee/studio/api/jsfiles.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getbyid",
            id : fileid
        })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.error) {
            if(!confirm("Supprimer le fichier de flux interne '" + data.name + "' ?")) {
                return
            } else {
                fetch("/pybee/studio/api/jsfiles.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        action: "deletebyid",
                        id : fileid
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

async function loadJS(nameoffile) {
    fetch("/pybee/studio/api/jsfiles.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getbyname",
            name: nameoffile
        })
    })
    .then(r => r.json())
    .then(res => {
        console.log(res)
        if(!res.error) {
            jsfileid = res.id
            window.jsfileid = jsfileid
            openIntFlow()
        } else {
            alert("Network error : New file not created")
        }
    });
}

async function loadBST(pageid){
    if (tosave) {
        if(!confirm("Votre espace de travail va être remplacé. On continue quand même ?"))
            return
    }
    tosave = false
    document.getElementById("savebtn").className = ""
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
    if (tosave) {
        if(!confirm("Votre espace de travail va être remplacé. On continue quand même ?"))
            return
    }
    tosave = false
    document.getElementById("savebtn").className = ""
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
    if (tosave) {
        if(!confirm("Votre espace de travail va être remplacé. On continue quand même ?"))
            return
    }
    tosave = false
    document.getElementById("savebtn").className = ""
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
            let popups = JSON.parse(data.popups)
            workspaceRoot = popups[popupid] || null
            if (workspaceRoot) rebuildParents(workspaceRoot, null)
            render()
            document.getElementById("workspace_content").innerText = `Lecture de la popup : admin ${popupid + 1} ${popups[popupid].props.name?popups[popupid].props.name:""} du composant : ${data.name}`
        });
    } catch(e) {
        console.error(e)
    }
}

function deletePopup(componentid, popupid) {
    console.log(componentid, popupid)
    if(!confirm("Souhaitez-vous vraiment supprimer cette popup ?"))
        return
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
            let popups = JSON.parse(data.popups)
            popups.splice(popupid, 1)
            // mettre popups dans la base
            fetch("/pybee/studio/api/components.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "updatepopups",
                    popups: JSON.stringify(popups.map(p => serializeNode(p))),
                    id : componentid
                })
            })
            .then(r => r.json())
            .then(res => {
                if(res.status === "ok") {
                    document.getElementById("workspace_content").innerText = `Suppression de la popup : admin ${popupid + 1} du composant : ${data.name} effectuée`
                    loadProjectFiles()
                } else {
                    alert("Network error : Composant not saved")
                }
            });
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
        } else if (perspective === "component") {
            await fetch("/pybee/studio/api/components.py", {
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
                    tosave = false
                    document.getElementById("savebtn").className = ""
                    document.getElementById("workspace_content").innerText = "Nouvelle page créée : " + pagename
                    loadProjectFiles()
                } else {
                    alert("Network error : file not created")
                }
            });
        } else if (perspective === "component") {
            // INSERT composant
            fetch("/pybee/studio/api/components.py", {
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
                    tosave = false
                    document.getElementById("savebtn").className = ""
                    document.getElementById("workspace_content").innerText = "Nouveau composant créé : " + workspaceRoot.props.name
                    loadProjectFiles()
                } else {
                    alert("Network error : component not created")
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
                        tosave = false
                        document.getElementById("savebtn").className = ""
                        document.getElementById("workspace_content").innerText = "Page sauvegardée : " + workspaceRoot.props.name
                        loadProjectFiles()
                    } else {
                        alert("Network error : file not saved")
                    }
                });
            }
        } else if (perspective === "component") {
            if (confirm("Ce composant existe déjà. Voulez-vous le remplacer par celui-ci?")) {
                fetch("/pybee/studio/api/components.py", {
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
                        loadProjectFiles()
                    } else {
                        alert("Network error : Composant not saved")
                    }
                });
            }
        } else {
            // sauvegarde d'une popup
            fetch("/pybee/studio/api/components.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getbyid",
                    id : currentComponent
                })
            })
            .then(r => r.json())
            .then(data => {
                if(!data.error) {
                    let pops = JSON.parse(data.popups)
                    if (currentPopup === "new-popup") {
                        // création d'un popup
                        pops.push(workspaceRoot)
                    } else {
                        pops[currentPopup] = workspaceRoot
                    }
                    fetch("/pybee/studio/api/components.py", {
                        method: "POST",
                        credentials: "include",
                        body: new URLSearchParams({
                            action: "update",
                            name: data.name,
                            icon: data.icon,
                            description: data.description,
                            content: data.content,
                            popups: JSON.stringify(pops.map(p => serializeNode(p))),
                            version: data.version,
                            type: data.type,
                            id_author: data.id_author,
                            id_entity: data.id_entity,
                            active: data.active?1:0,
                            id : currentComponent
                        })
                    })
                    .then(r => r.json())
                    .then(res => {
                        console.log(res)
                        if(res.status === "ok") {
                            tosave = false
                            document.getElementById("savebtn").className = ""
                            document.getElementById("workspace_content").innerText = "Popup sauvegardée du composant : " + data.name
                            loadProjectFiles()
                        } else {
                            alert("Network error : Popup not saved")
                        }
                    });
                }
            });
        }
    }
}
