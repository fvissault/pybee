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

let currentcreds = null

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
        displayCredentials(document.getElementById("credentials"), projectid)
    }
}

async function displayCredentials(element, idProject) {
    element.replaceChildren();
    element.textContent = "Chargement des credentials…";

    try {
        const response = await fetch("/pybee/studio/api/models_credentials.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getbyproject",
                id: idProject
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const credentials = await response.json();

        if (!Array.isArray(credentials)) {
            throw new Error(credentials.error || "Réponse inattendue du serveur");
        }

        element.replaceChildren();

        if (credentials.length === 0) {
            element.textContent = "Aucun credential pour ce projet.";
            return;
        }

        const colonnes = [
            ["name", "Nom"],
            ["servername", "Serveur"],
            ["databasename", "Base de données"],
            ["username", "Utilisateur"]
        ];

        const tableau = document.createElement("table");
        tableau.className = "credentials-table";

        const entete = tableau.createTHead().insertRow();

        for (const titre of [...colonnes.map(([, titre]) => titre), "Actions"]) {
            const cellule = document.createElement("th");
            cellule.scope = "col";
            cellule.textContent = titre;
            entete.append(cellule);
        }

        const corps = tableau.createTBody();

        for (const credential of credentials) {
            const ligne = corps.insertRow();

            for (const [attribut] of colonnes) {
                ligne.insertCell().textContent = credential[attribut] ?? "";
            }

            const actions = ligne.insertCell();
            actions.className = "credentials-actions";

            const boutonEditer = document.createElement("button");
            boutonEditer.className = "credential-action credential-action-edit";
            boutonEditer.type = "button";
            boutonEditer.title = "Éditer ce jeu de credentials";
            boutonEditer.setAttribute("aria-label", boutonEditer.title);
            boutonEditer.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                    <path d="m16 3 5 5-12 12-6 1 1-6Z"/>
                    <path d="m14 5 5 5"/>
                </svg>
            `;
            boutonEditer.addEventListener("click", () => {
                editCredential(credential);
            });

            const boutonSupprimer = document.createElement("button");
            boutonSupprimer.className = "credential-action credential-action-delete";
            boutonSupprimer.type = "button";
            boutonSupprimer.title = "Supprimer ce jeu de credentials";
            boutonSupprimer.setAttribute("aria-label", boutonSupprimer.title);
            boutonSupprimer.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24"
                     fill="none" stroke="#dc2626" stroke-width="2"
                     stroke-linecap="round" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18"/>
                </svg>
            `;
            boutonSupprimer.addEventListener("click", () => {
                deleteCredential(credential);
            });

            actions.append(boutonEditer, boutonSupprimer);
        }

        element.append(tableau);
    } catch (error) {
        console.error("Chargement des credentials :", error);
        element.textContent = "Impossible de charger les credentials.";
    }
}

