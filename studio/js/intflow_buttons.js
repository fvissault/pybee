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
        if (check) {
            if (preview) preview.close()
            window.close()
        }
    } else {
        if (preview) preview.close()
        window.close()
    }
}

let preview = null
async function generatejsfile() {
    try {
        const session = window.opener.getSession()
        const generatedString = generate(tree)
        const response = await fileSaveAction("js", pagename, generatedString)
        if (response.status === "ok") {
            alert("Votre fichier js a bien été généré. Vous allez le visualiser...")
            if (!preview) {
                preview = window.open("", "_blank", "popup=yes,width=800,height=600")
            }
            preview.document.title = `Prévisualisation de ${pagename}.js`;
            preview.document.body.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${generatedString}</pre>`;
            preview.focus()
        } else {
            alert("Votre fichier js n'a bien été généré")
        }
    } catch(e) {
        console.error(e)
    }

}
