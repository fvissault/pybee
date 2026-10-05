function save() {
    fetch("/pybee/studio/api/models.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "savemodel",
            id : modelid,
            modelcontent: JSON.stringify(modelRoot)
        })
    })
    .then(r => r.json())
    .then(response => {
        if(response.status === "ok") {
            tosave = false
            document.getElementById("savebtn").className = ""
            alert("Votre modèle a bien été sauvegardé")
        } else {
            alert("Error : votre modèle n'a pas été sauvegardé")
        }
    });
}