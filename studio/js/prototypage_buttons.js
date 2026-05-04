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
        children:[]
    }
    workspaceEl.innerHTML = ""
    currentPage = null
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
    currentPage = null
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
