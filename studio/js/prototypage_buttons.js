/*************************************************************************************************************
 * Reset de page et de composant
 *************************************************************************************************************/
function resetComponent() {
    workspaceRoot = {
        id:generateId("Composant"),
        type:"container",
        props:{},
        css:{},
        js:{},
        events:{},
        children:[],
        popups:[]
    }
    workspaceEl.innerHTML = ""
    currentPage = null
    currentComponent = "new-component"
    currentPopup = null
    perspective = "component"
    document.getElementById("workspace_content").innerText = "Création d'un composant"
}

document.getElementById("newComposantBtn").addEventListener("click", ()=> {
    if (tosave) {
        let check = confirm("Voulez-vous enregistrer votre travail?")
        if (!check) {
            resetComponent()
            tosave = false
            document.getElementById("savebtn").className = ""
        }
    } else {
        resetComponent()
    }
})

function resetPage() {
    workspaceRoot = {
        id:generateId("Container"),
        type:"container",
        props:{},
        css:{},
        js:{},
        events:{},
        children:[]
    }
    workspaceEl.innerHTML = ""
    currentPage = "new-page"
    currentComponent = null
    currentPopup = null
    perspective = "page"
    document.getElementById("workspace_content").innerText = "Création d'une page"
}

document.getElementById("newPageBtn").addEventListener("click",()=>{
    if (tosave) {
        let check = confirm("Voulez-vous enregistrer votre travail?")
        if (!check) {
            resetPage()
            tosave = false
            document.getElementById("savebtn").className = ""
        }
    } else {
        resetPage()
    }
})

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