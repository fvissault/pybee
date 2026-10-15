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

async function executeModel(modelId, typeDb, mode = "install") {
    const sql = generationModel(typeDb);
    const response = await fetch("/pybee/studio/api/models.py",
        {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "execute-model",
                id: String(modelId),
                typeDb,
                mode,
                sql
            })
        }
    );
    if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
    const result = await response.json();
    if (result.status !== "ok") {
        const step = result.step? ` (${result.step})`: "";
        throw new Error(
            (result.message || "Erreur de déploiement de la base") + step
        );
    }
    return result;
}