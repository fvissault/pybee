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
            if(!confirm("Delete file '"+ data.pagename + "' ?")) {
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
                .then(res1 => {
                    fetch("/pybee/studio/api/jsfiles.py", {
                        method: "POST",
                        credentials: "include",
                        body: new URLSearchParams({
                            action: "deletebyname",
                            name : data.pagename
                        })
                    })
                    .then(r => r.json())
                    .then(res2 => {
                        loadProjectFiles()
                    });
                });
            }
        }
    });
}

async function loadJS(id) {
    const session = await getSession()
    if (session) {
        jsfileid = id
        openIntFlow()
    } else {
        alert("Session de travail expirée")
    }
}

async function loadBST(pageid){
    const session = await getSession()
    if (session) {
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
                //console.log("data = ", data)
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
    } else {
        alert("Session de travail expirée")
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
            console.log(data)
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
    //console.log(componentid, popupid)
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
                    fetch("/pybee/studio/api/jsfiles.py", {
                        method: "POST",
                        credentials: "include",
                        body: new URLSearchParams({
                            action: "deletebyname",
                            name : `${data.name}_admin_${popupid + 1}`
                        })
                    })
                    .then(r => r.json())
                    .then(res => {
                        if(res.status === "ok") {
                            document.getElementById("workspace_content").innerText = `Suppression de la popup : admin ${popupid + 1} du composant : ${data.name} effectuée`
                            loadProjectFiles()
                        } else {
                            alert("Network error : Admin popup not deleted")
                        }
                    });
                } else {
                    alert("Network error : Composant not correctly updated")
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
            container:node.container,
            ui: node.ui||{}
        }
    } else if (node.type === "container") {
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
    let pagename = ""
    let currentfilefound = null
    if (workspaceRoot.children.length === 0) {
        alert("L'espace de travail est vide")
        return
    }
    // ---------------------------------------------------------------
    // je sauve une page ou un composant non identifié
    // dans un premier temps, je regarde si cette page ou ce composant
    // se trouve en base
    // ---------------------------------------------------------------
    if (perspective === "page") {
        pagename = prompt("Page name ?")
        if (!pagename) return
        // ---------------------------------------------------------------
        // ma page existe t-elle dans la base?
        // si oui, newfile est à false
        // si non, newfile est à true
        // ---------------------------------------------------------------
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
                currentfilefound = data.id
                newfile = false
            }
        });
    } else if (perspective === "component") {
        // ---------------------------------------------------------------
        // mon composant existe t-il dans la base?
        // si oui, newfile est à false
        // si non, newfile est à true
        // ---------------------------------------------------------------
        await fetch("/pybee/studio/api/components.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyname",
                name: workspaceRoot.props.name,
                id_entity: workspaceRoot.props.id_entity 
            })
        })
        .then(r => r.json())
        .then(data => {
            if (!data.error) {
                currentfilefound = data.id
                newfile = false
            }
        });
    }
    // ---------------------------------------------------------------
    // La page ou le composant sont bien nouveaux
    // ---------------------------------------------------------------
    if (newfile) {
        // ---------------------------------------------------------------
        // Traitement pour une page uniquement
        // Pas besoin de faire ce type de traitement pour un composant
        // ---------------------------------------------------------------
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
                    fetch("/pybee/studio/api/jsfiles.py", {
                        method: "POST",
                        credentials: "include",
                        body: new URLSearchParams({
                            action: "create",
                            id_project: projectid,
                            content_type: "pagejs",
                            name: pagename,
                            content: "[]"
                        })
                    })
                    .then(r => r.json())
                    .then(res => {
                        console.log(res)
                        if(res.status === "ok") {
                            tosave = false
                            document.getElementById("savebtn").className = ""
                            document.getElementById("workspace_content").innerText = "Nouvelle page créée : " + pagename
                            loadProjectFiles()
                        } else {
                            alert("Network error : New file not created")
                        }
                    });
                } else {
                    alert("Network error : file not created")
                }
            });
        }
    } 
    else 
    // ---------------------------------------------------------------
    // La page ou le composant ne sont pas nouveaux
    // ---------------------------------------------------------------
    {
        // ---------------------------------------------------------------
        // Traitement pour une page
        // 1. demande de remplacement
        // 2. si oui, enregistrement du contenu de la page dans projectfiles
        //    si non, on ne fait rien, on abandonne
        // ---------------------------------------------------------------
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
        } else 
        // ---------------------------------------------------------------
        // Traitement pour un composant
        // 1. demande de remplacement
        // 2. si oui, update du contenu du composant dans la table composants
        //    si non, on ne fait rien, on abandonne
        // ---------------------------------------------------------------
        if (perspective === "component") {
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
                        popups: JSON.stringify([]),
                        type: workspaceRoot.props.type,
                        id_author: parseInt(workspaceRoot.props.id_author),
                        id_entity: workspaceRoot.props.id_entity,
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
                        //console.log(res)
                        if(res.status === "ok") {
                            fetch("/pybee/studio/api/jsfiles.py", {
                                method: "POST",
                                credentials: "include",
                                body: new URLSearchParams({
                                    action: "create",
                                    id_project: projectid,
                                    content_type: "compadmjs",
                                    name: data.name + "_admin_" + pops.length,
                                    content: "[]"
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
                                    alert("Network error : New file not created")
                                }
                            });
                        } else {
                            alert("Network error : Popup not saved")
                        }
                    });
                }
            });
        }
    }
}
