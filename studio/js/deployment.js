async function getSession() {
    // 1. Récupération session
    const res = await fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ action: "read" })
    });
    let session = await res.json();
    // 2. Vérification
    if(!session || session.status || !session.auth) {
        if (window.opener.modelWindow) window.opener.modelWindow.close();
        if (window.opener.prototypageWindow) window.opener.prototypageWindow.close();
        if (window.opener.credentialslWindow) window.opener.credentialslWindow.close();
        window.opener.href = "signin.html";
        window.close();
        return;
    }
    return session
}

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")

async function initDeployment() {
    const session = await getSession()
}

async function displayProfiles(element, idproject) {

}
