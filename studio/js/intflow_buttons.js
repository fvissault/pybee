/*==================================================================================
 * SAVE FUNCTION
 *==================================================================================*/
function save() {
    try {
        const session = window.opener.getSession()
        fetch("/pybee/studio/api/jsfiles.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "updatecontent",
                content: JSON.stringify(tree),
                id : fileid
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === "ok") {
                tosave = false
                document.getElementById("savebtn").className = ""
                alert("Votre fichier de flux interne est sauvegardé")
            }
        });
    } catch(e) {
        console.error(e)
    }
}

function closefct() {
    if (tosave) {
        check = confirm("Etes-vous sur de fermer InternFlow sans sauvegarder votre travail ?")
        if (check) window.close()
    } else {
        window.close()
    }
}

function generatejsfile() {
    try {
        const session = window.opener.getSession()
        fetch("/pybee/studio/api/file_access_api.py?action=save_js_file&entity=" + projectname, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file_content: generate(tree),
                file_name: pagename
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === "ok") {
                alert("Votre fichier js a bien été généré")
            }
        });
    } catch(e) {
        console.error(e)
    }

}
