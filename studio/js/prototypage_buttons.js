function resetPopup(componentid, componentname) {
    workspaceRoot = {
        id:generateId("Popup"),
        type:"container",
        props:{},
        css:{},
        js:{},
        events:{},
        children:[]
    }
    workspaceEl.innerHTML = ""
    currentPage = null
    currentComponent = componentid
    currentPopup = "new-popup"
    perspective = "popup"
    document.getElementById("workspace_content").innerText = "Création d'une fenêtre de paramétrage pour le composant : " + componentname
}

function createPopup(componentid, componentname) {
    if (tosave) {
        let check = confirm("Voulez-vous enregistrer votre travail?")
        if (!check) {
            resetPopup(componentid, componentname)
            tosave = false
            document.getElementById("savebtn").className = ""
        }
    } else {
        resetPopup(componentid, componentname)
    }
}

let pagepreview = null
function preview() {
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
            console.log(data)
            if (!data.error) {
                generatepage()
                if (!pagepreview) {
                    pagepreview = window.open(`projects/${project_name}/${data.pagename}.html`, "_blank", "popup=yes,width=800,height=600")
                }
                pagepreview.document.title = `Prévisualisation de ${data.pagename}.js`;
                //pagepreview.document.body.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${generatedString}</pre>`;
                pagepreview.focus()
            } else {
                alert("Problème de réseau : impossible d'afficher la page")
            }
        })
    } else {
        alert("Sélectionner une page pour la prévisualiser")
    }
}