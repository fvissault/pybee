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
        window.opener.href = "signin.html";
        window.opener.credentialslWindow = null;
        window.close();
        return;
    }
    return session
}

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const projectid = params.get("projectid")

async function initCreds() {
    const session = await getSession()
    if (session) {
        // lire le contenu de la table models_credentials
        const response = await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id: projectid
            })
        });
        const credentials = await response.json();
        console.log(credentials)
    }
}