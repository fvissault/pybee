function createPopup(componentid, componentname) {
    fetch("/pybee/studio/api/components.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getbyid",
            id : componentid
        })
    })
    .then(r => r.json())
    .then(async data => {
        //console.log(data)
        if(!data.error) {
            const popupname = `${componentname}_adm_${JSON.parse(data.popups).length + 1}`
            popupRoot = {
                id:generateId("Popup"),
                type:"container",
                props:{
                    instanceCounter : 0,
                    name: popupname
                },
                css:[],
                js:{},
                events:{},
                children:[]
            }

            // créer le fichier css de la page
            const responsepagecss = await fileSaveAction("css", `${popupname}`, "")
            if (responsepagecss.status === "ok") {
                console.log(`Création du fichier css de la popup ${popupname} : ok`)
                insertFile(popupRoot, "css", popupname)
            } else {
                console.log(`Création du fichier css de la popup ${popupname} : nok`)
            }

            // créer le fichier js de la page
            const responsepagejs = await fileSaveAction("js", `${popupname}`, "")
            if (responsepagejs.status === "ok") {
                console.log(`Création du fichier javascript de la page ${popupname} : ok`)
                insertFile(popupRoot, "js", popupname)
            } else {
                console.log(`Création du fichier javascript de la page ${popupname} : nok`)
            }

            // créer le fichier d'initialisation des composants de la page
            const response = await fileSaveAction("js", `${popupname}_components_init`, "// DON'T MODIFY THIS FILE\n")
            if (response.status === "ok") {
                console.log(`Création du fichier d'initialisation des composants de la page ${popupname} : ok`)
                insertFile(popupRoot, "js", popupname)
            } else {
                console.log(`Création du fichier d'initialisation des composants de la page ${popupname} : nok`)
            }

            fetch("/pybee/studio/api/components.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "update",
                    name: componentname,
                    icon: data.icon,
                    description: data.description || "",
                    content: data.content,
                    version: data.version,
                    popups: JSON.stringify([popupRoot]),
                    type: data.type,
                    id_author: parseInt(data.id_author),
                    id_entity: data.id_entity,
                    active: data.active,
                    id : componentid
                })
            })
            .then(r => r.json())
            .then(res => {
                if(res.status === "ok") {
                    console.log("La page d'administration du composant " + componentname + " a été ajouté au composant")
                } else {
                    console.log("Error : La page d'administration du composant " + componentname + " n'a pas été ajouté au composant")
                }
            })

            fetch("/pybee/studio/api/jsfiles.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    id_project: projectid,
                    content_type: "compadmjs",
                    name: `${componentname}_adm_${JSON.parse(data.popups).length + 1}`,
                    content: "[]"
                })
            })
            .then(r => r.json())
            .then(res => {
                //console.log(res)
                if(res.status === "ok") {
                    tosave = false
                    document.getElementById("savebtn").className = ""
                    document.getElementById("workspace_content").innerText = "Popup sauvegardée du composant : " + componentname
                    loadProjectFiles()
                } else {
                    alert("Network error : New file not created")
                }
            });
        }
    })
}

let pagepreview = null
async function preview() {
    if (currentPage != null) {
        fetch("/pybee/studio/api/projectfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyid",
                id : currentPage
            })
        })
        .then(r => r.json())
        .then(data => {
            //console.log(data)
            if (!data.error) {
                // générer l'encapsulation du composant dont le nom est dans component
                const pageComponents = getPageComponents(workspaceRoot)
                if (pageComponents.length > 0) {
                    for (const component of pageComponents) {
                        // 1. on va chercher le code js du composant
                        fetch("/pybee/studio/api/jsfiles.py", {
                            method: "POST",
                            credentials: "include",
                            body: new URLSearchParams({
                                action: "getbyname",
                                name: component
                            })
                        })
                        .then(r => r.json())
                        .then(async res => {
                            //console.log(res)
                            if(!res.error) {
                                // 2. générer le code js
                                const componentjs = generate(JSON.parse(res.content), 1)
                                // 3. encapsuler ce qui a été généré : le nom de l'encapsulation pourrait être component[component_name]
                                const encapsulation = `const component${component} = (() => {\n${componentjs}\n   return { createComponent };\n})();` 
                                // 4. sauvegarder le fichier
                                const response = await fileSaveAction("js", `component${component}`, encapsulation)
                                if (response.status === "ok") {
                                    // on vérifie qu'il fait bien partie des jsfiles
                                    if (!workspaceRoot.props.jsfiles) workspaceRoot.props.jsfiles = []
                                    const jsexists = workspaceRoot.props.jsfiles.some(f => f.src === `component${component}`);
                                    if (!jsexists) workspaceRoot.props.jsfiles.push({include:true, src:`component${component}`, defer:true})
                                }
                            }
                        })
                    }
                }
                generatepage()
                if (pagepreview) pagepreview.close()
                pagepreview = window.open(`projects/${project_name}/${data.pagename}.html`, "_blank", "popup=yes,width=1200,height=800")
                pagepreview.onload = () => {
                    let title = pagepreview.document.querySelector("title")
                    if (!title) {
                        title = pagepreview.document.createElement("title")
                        title.textContent = `Prévisualisation de ${data.pagename}.html`
                        pagepreview.document.head.appendChild(title)
                    }
                    
                }
            } else {
                alert("Problème de réseau : impossible d'afficher la page")
            }
        })
    } else {
        alert("Sélectionner une page pour la prévisualiser")
    }
}

function getPageComponents(node) {
    const components = new Set();
    function scan(node) {
        if (!node) return;
        if (node.type === "widget" && node.widgetType === "Component") components.add(node.name);
        if (Array.isArray(node.children)) node.children.forEach(scan);
    }
    scan(node);
    return [...components];
}