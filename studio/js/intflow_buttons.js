/*==================================================================================
 * SAVE FUNCTION
 *==================================================================================*/
function save() {
    try {
        const fileid = window.opener.jsfileid
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
                alert("Votre fichier de flus interne est sauvegardé")
            }
        });
    } catch(e) {
        console.error(e)
    }
}

function closefct(){
    if (tosave) {
        check = confirm("Etes-vous sur de fermer IntFlow sans sauvegarder votre travail ?")
        if (check) window.close()
    } else {
        window.close()
    }
}


/*==================================================================================
 * UI SAVE BUTTON
 *==================================================================================*/
/*const saveBtn = document.createElement("button")
saveBtn.innerText = "Save"
saveBtn.id = "savebtn"
saveBtn.style.position = "fixed"
saveBtn.style.bottom = "10px"
saveBtn.style.right = "60px"
saveBtn.onclick = save
document.body.appendChild(saveBtn)

const closeBtn = document.createElement("button")
closeBtn.innerText = "Close"
closeBtn.style.position = "fixed"
closeBtn.style.bottom = "10px"
closeBtn.style.right = "10px"
closeBtn.onclick = closefct
document.body.appendChild(closeBtn)
*/
/*==================================================================================
 * UI TRASH BUTTON
 *==================================================================================*/
/*const trash = document.createElement("div")
trash.innerText = "🗑️"
trash.style.alignItems = "center"
trash.style.display = "flex"
trash.style.justifyContent = "center"
trash.style.position = "fixed"
trash.style.top = "10px"
trash.style.right = "10px"
trash.style.width = "50px"
trash.style.height = "200px"
trash.style.backgroundColor = "#eee"
trash.style.border = "1px solid gray"
trash.style.borderRadius = "5px"
document.body.appendChild(trash)
*/