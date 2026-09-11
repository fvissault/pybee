// ---------------------------------------------------------------------------------------------------
// Encapsulation de l'action de sauvegarde d'un fichier
// Cette fonction fonctionne pour les fichiers js, css et html
// ---------------------------------------------------------------------------------------------------
async function fileSaveAction(action, filename, contentToSave) {
    const response = await fetch("/pybee/studio/api/file_access_api.py?action=save_" + action + "_file&entity=" + project_name, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file_content: contentToSave,
            file_name: filename
        })
    })
    const data = await response.json()
    return data
}

// ---------------------------------------------------------------------------------------------------
// Encapsulation de l'action de suppression d'un fichier
// Cette fonction fonctionne pour les fichiers js, css et html
// ---------------------------------------------------------------------------------------------------
async function fileDeleteAction(action, filename) {
    const response = await fetch("/pybee/studio/api/file_access_api.py?action=delete_" + action + "&entity=" + project_name, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file_name: filename
        })
    })
    const data = await response.json()
    return data
}

// ---------------------------------------------------------------------------------------------------
// Encapsulation de l'action de la lecture d'un fichier
// Cette fonction fonctionne pour les fichiers js, css et html
// ---------------------------------------------------------------------------------------------------
async function fileReadAction(action, filename) {
    const response = await fetch("/pybee/studio/api/file_access_api.py?action=read_" + action + "_file&entity=" + project_name, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file_name: filename
        })
    })
    const data = await response.json()
    return data
}