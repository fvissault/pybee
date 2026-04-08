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
        if (prototypageWindow && !prototypageWindow.closed) {
            prototypageWindow.close();
        }
        location.href = "signin.html";
        return;
    }
    return session
}


async function initMain() {
    const session = await getSession()
    if (session) {
        const res2 = await fetch("/pybee/studio/api/projects_users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "list",
                userid: session.userid
            })
        });
        const projects = await res2.json();

        renderCard(projects, session)
    }
}

const active_deactive_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>`;

const details_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

const prototypage_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M8 6l-6 6 6 6"></path>
        <path d="M16 6l6 6-6 6"></path>
        <path d="M10 20l4-16"></path>
    </svg>`;

const trash_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4h6v2"></path>
    </svg>`;

const addmember_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
        <line x1="21" y1="8" x2="21" y2="14"></line>
        <line x1="18" y1="11" x2="24" y2="11"></line>
    </svg>`;

const delmember_icon = `
    <svg class="icon" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
        <line x1="18" y1="11" x2="24" y2="11"></line>
    </svg>`;

function renderCard(projects, session) {
    let html = "";
    projects.forEach(p => {
        if (p.active == 1) {
            if (p.owner == session.userid) {
                html += `<div class="card owner">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="active_project(${p.id}, 0);" data-i18n="title:activ">
                                        ${active_deactive_icon}
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" data-i18n="title:proto">
                                        ${prototypage_icon}
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" data-i18n="title:delproj">
                                        ${trash_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
                                    </button>
                                </div>
                            </div>
                        </div>`;
            } else {
                html += `<div class="card active">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button" onclick="prototypage(${p.id});" data-i18n="title:proto">
                                        ${prototypage_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
        } else {
            if (p.owner == session.userid) {
                html += `<div class="card deactive">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="active_project(${p.id}, 1);" data-i18n="title:activ">
                                        ${active_deactive_icon}
                                    </button>
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                    <button class="card_button btn-delete" onclick="suppress(${p.id})" data-i18n="title:delproj" title="Supprimer">
                                        ${trash_icon}
                                    </button>
                                    <button class="card_button" onclick="addmember(${p.id})" data-i18n="title:addmember">
                                        ${addmember_icon}
                                    </button>
                                    <button class="card_button btn-danger" onclick="delmember(${p.id})" data-i18n="title:delmember">
                                        ${delmember_icon}
                                    </button>
                                </div>
                            </div>
                        </div>`;
            } else {
                html += `<div class="card deactive">
                            <div class="container">
                                <div class="card_title">${p.name}</div>
                                <div class="card_desc">${p.description}</div>
                                <div class="block_buttons">
                                    <button class="card_button" onclick="details_project(${p.id});" data-i18n="title:infos">
                                        ${details_icon}
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
        }
    });
    document.getElementById("projects").innerHTML = html;
    renderUI()
}

let prototypageWindow = null

async function prototypage(projectid) {
    const session = await getSession()
    prototypageWindow = window.open(`prototypage.html?projectid=${projectid}`, "_blank");
}

async function active_project(projectid, activevalue) {
    const session = await getSession()

    await fetch("/pybee/studio/api/projects.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "updateactive",
            active: activevalue,
            id: projectid
        })
    })

    initMain()
    if (activevalue == 1) {
        alert(t("alertactiv"))
    } else {
        alert(t("alertdeactiv"))
        if (prototypageWindow && !prototypageWindow.closed) {
            prototypageWindow.close();
        }
    }
}

async function suppress(projectid) {
    const session = await getSession()

    const check = confirm(t("confirmdelproj"))
    if (check) {
        await fetch("/pybee/studio/api/projects.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "delete",
                id: projectid
            })
        })
        .then(r => r.json())
        .then(data => {
            fetch("/pybee/studio/api/projects_users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "deletebyproject",
                    idproject: projectid
                })
            })
            .then(r => r.json())
            .then(res => {
                alert(t("alertdelproj"))
                initMain()
            });
        });
    }
}


function disconnect() {
    fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ action: "destroy" })
    })
    .then(() => location.href = "signin.html");
}


const translations = {
    fr : { 
        title: "Beetle studio principale",
        header : "Beetle Studio", 
        disconnect : "Déconnexion", 
        menu : "Menu", 
        help : "Aide", 
        profile : "Profil",
        password: "Mot de passe",
        newproject: "Nouveau projet",
        myprojects: "Mes projets",
        activ: "Activer/Désactiver",
        infos: "Informations",
        proto: "Prototypage",
        delproj: "Supprimer le projet",
        addmember: "Ajouter un membre",
        delmember: "Supprimer un membre",
        alertactiv: "L'activation du projet a bien été effectuée",
        alertdeactiv: "La désactivation du projet a bien été effectuée",
        confirmdelproj: "Dois-je vraiment supprimer ce projet?",
        alertdelproj: "Le projet a été correctement supprimé",
        accountinfos: "Informations du compte",
        details: "Détails",
        addmemberproj: "Ajouter un membre dans un projet",
        memchoice: "Choix d'un membre",
        selectmem: "-- Sélectionner un membre --",
        validate: "Appliquer",
        close: "Fermer",
        alertaddmem: "Sélectionnez le membre que vous souhaitez ajouter",
        alertemailnotsent: "Email non envoyé",
        alertemailsent: "Un mail a été envoyé au nouveau membre",
        delmemberproj: "Supprimer un membre d'un projet",
        newproj: "Créer un nouveau projet",
        yournewproj: "Votre nouveau projet",
        projname: "Nom",
        newprojname: "Nom de votre projet",
        optionaldesc: "Description (optionnel)",
        placeholderdesc: "Donnez une description à votre projet",
        projnamemand: "Le nom de votre nouveau projet est obligatoire",
        alertprojcreated: "Votre projet a bien été créé",
        accountinfosof: "Informations du compte de",
        youraccount: "Votre compte",
        firstname: "Prénom",
        lastname: "Nom",
        email: "Email",
        org: "Organisation",
        orgname: "Nom",
        orgresp: "Responsable",
        project: "Projet",
        projstatus: "Statut",
        projactiv: "Actif",
        projinactiv: "Inactif",
        projdesc: "Description",
        noprojdesc: "Aucune description",
        orgcontact: "Contact",
        orgowner: "Propriétaire",
        projmembers: "Intervenants sur le projet",
        projdetails: "Détails du projet"
    } , 

    en : { 
        title: "Beetle Studio main",
        header : "Beetle Studio", 
        disconnect : "Sign out", 
        menu : "Menu", 
        help : "Help", 
        profile : "Profile",
        password: "Password",
        newproject: "New project",
        myprojects: "My projects",
        activ: "Activate/Deactivate",
        infos: "Information",
        proto: "Prototyping",
        delproj: "Delete project",
        addmember: "Add member",
        delmember: "Remove member",
        alertactiv: "Project has been activated",
        alertdeactiv: "Project has been deactivated",
        confirmdelproj: "Do you really want to delete this project?",
        alertdelproj: "Project has been successfully deleted",
        accountinfos: "Account information",
        details: "Details",
        addmemberproj: "Add a member to a project",
        memchoice: "Select a member",
        selectmem: "-- Select a member --",
        validate: "Apply",
        close: "Close",
        alertaddmem: "Please select a member to add",
        alertemailnotsent: "Email not sent",
        alertemailsent: "An email has been sent to the new member",
        delmemberproj: "Remove a member from a project",
        newproj: "Create a new project",
        yournewproj: "Your new project",
        projname: "Name",
        newprojname: "Project name",
        optionaldesc: "Description (optional)",
        placeholderdesc: "Provide a description for your project",
        projnamemand: "Project name is required",
        alertprojcreated: "Your project has been created",
        accountinfosof: "Account information of",
        youraccount: "Your account",
        firstname: "First name",
        lastname: "Last name",
        email: "Email",
        org: "Organization",
        orgname: "Name",
        orgresp: "Manager",
        project: "Project",
        projstatus: "Status",
        projactiv: "Active",
        projinactiv: "Inactive",
        projdesc: "Description",
        noprojdesc: "No description",
        orgcontact: "Contact",
        orgowner: "Owner",
        projmembers: "Project members",
        projdetails: "Project details"
    },

    it : {
        title: "Beetle Studio principale",
        header : "Beetle Studio", 
        disconnect : "Disconnettersi", 
        menu : "Menu", 
        help : "Aiuto", 
        profile : "Profilo",
        password: "Password",
        newproject: "Nuovo progetto",
        myprojects: "I miei progetti",
        activ: "Attiva/Disattiva",
        infos: "Informazioni",
        proto: "Prototipazione",
        delproj: "Elimina progetto",
        addmember: "Aggiungi membro",
        delmember: "Rimuovi membro",
        alertactiv: "Progetto attivato",
        alertdeactiv: "Progetto disattivato",
        confirmdelproj: "Vuoi davvero eliminare questo progetto?",
        alertdelproj: "Progetto eliminato correttamente",
        accountinfos: "Informazioni account",
        details: "Dettagli",
        addmemberproj: "Aggiungi un membro al progetto",
        memchoice: "Seleziona un membro",
        selectmem: "-- Seleziona un membro --",
        validate: "Applica",
        close: "Chiudi",
        alertaddmem: "Seleziona un membro da aggiungere",
        alertemailnotsent: "Email non inviata",
        alertemailsent: "Email inviata al nuovo membro",
        delmemberproj: "Rimuovi un membro dal progetto",
        newproj: "Crea un nuovo progetto",
        yournewproj: "Il tuo nuovo progetto",
        projname: "Nome",
        newprojname: "Nome del progetto",
        optionaldesc: "Descrizione (opzionale)",
        placeholderdesc: "Inserisci una descrizione del progetto",
        projnamemand: "Il nome del progetto è obbligatorio",
        alertprojcreated: "Progetto creato con successo",
        accountinfosof: "Informazioni account di",
        youraccount: "Il tuo account",
        firstname: "Nome",
        lastname: "Cognome",
        email: "Email",
        org: "Organizzazione",
        orgname: "Nome",
        orgresp: "Responsabile",
        project: "Progetto",
        projstatus: "Stato",
        projactiv: "Attivo",
        projinactiv: "Inattivo",
        projdesc: "Descrizione",
        noprojdesc: "Nessuna descrizione",
        orgcontact: "Contatto",
        orgowner: "Proprietario",
        projmembers: "Membri del progetto",
        projdetails: "Dettagli del progetto"
    },

    de : {
        title: "Beetle Studio Startseite",
        header : "Beetle Studio", 
        disconnect : "Abmelden", 
        menu : "Menü", 
        help : "Hilfe", 
        profile : "Profil",
        password: "Passwort",
        newproject: "Neues Projekt",
        myprojects: "Meine Projekte",
        activ: "Aktivieren/Deaktivieren",
        infos: "Informationen",
        proto: "Prototyping",
        delproj: "Projekt löschen",
        addmember: "Mitglied hinzufügen",
        delmember: "Mitglied entfernen",
        alertactiv: "Projekt wurde aktiviert",
        alertdeactiv: "Projekt wurde deaktiviert",
        confirmdelproj: "Möchten Sie dieses Projekt wirklich löschen?",
        alertdelproj: "Projekt wurde erfolgreich gelöscht",
        accountinfos: "Kontoinformationen",
        details: "Details",
        addmemberproj: "Mitglied zum Projekt hinzufügen",
        memchoice: "Mitglied auswählen",
        selectmem: "-- Mitglied auswählen --",
        validate: "Anwenden",
        close: "Schließen",
        alertaddmem: "Bitte wählen Sie ein Mitglied aus",
        alertemailnotsent: "E-Mail nicht gesendet",
        alertemailsent: "E-Mail wurde an das neue Mitglied gesendet",
        delmemberproj: "Mitglied aus Projekt entfernen",
        newproj: "Neues Projekt erstellen",
        yournewproj: "Ihr neues Projekt",
        projname: "Name",
        newprojname: "Projektname",
        optionaldesc: "Beschreibung (optional)",
        placeholderdesc: "Geben Sie eine Beschreibung ein",
        projnamemand: "Projektname ist erforderlich",
        alertprojcreated: "Projekt wurde erstellt",
        accountinfosof: "Kontoinformationen von",
        youraccount: "Ihr Konto",
        firstname: "Vorname",
        lastname: "Nachname",
        email: "E-Mail",
        org: "Organisation",
        orgname: "Name",
        orgresp: "Verantwortlicher",
        project: "Projekt",
        projstatus: "Status",
        projactiv: "Aktiv",
        projinactiv: "Inaktiv",
        projdesc: "Beschreibung",
        noprojdesc: "Keine Beschreibung",
        orgcontact: "Kontakt",
        orgowner: "Eigentümer",
        projmembers: "Projektmitglieder",
        projdetails: "Projektdetails"
    } ,

    es : {
        title: "Beetle Studio principal",
        header : "Beetle Studio", 
        disconnect : "Cerrar sesión", 
        menu : "Menú", 
        help : "Ayuda", 
        profile : "Perfil",
        password: "Contraseña",
        newproject: "Nuevo proyecto",
        myprojects: "Mis proyectos",
        activ: "Activar/Desactivar",
        infos: "Información",
        proto: "Prototipado",
        delproj: "Eliminar proyecto",
        addmember: "Añadir miembro",
        delmember: "Eliminar miembro",
        alertactiv: "El proyecto ha sido activado",
        alertdeactiv: "El proyecto ha sido desactivado",
        confirmdelproj: "¿Deseas eliminar este proyecto?",
        alertdelproj: "El proyecto ha sido eliminado correctamente",
        accountinfos: "Información de la cuenta",
        details: "Detalles",
        addmemberproj: "Añadir miembro al proyecto",
        memchoice: "Seleccionar miembro",
        selectmem: "-- Seleccionar un miembro --",
        validate: "Aplicar",
        close: "Cerrar",
        alertaddmem: "Selecciona un miembro para añadir",
        alertemailnotsent: "Correo no enviado",
        alertemailsent: "Se ha enviado un correo al nuevo miembro",
        delmemberproj: "Eliminar miembro del proyecto",
        newproj: "Crear nuevo proyecto",
        yournewproj: "Tu nuevo proyecto",
        projname: "Nombre",
        newprojname: "Nombre del proyecto",
        optionaldesc: "Descripción (opcional)",
        placeholderdesc: "Añade una descripción al proyecto",
        projnamemand: "El nombre del proyecto es obligatorio",
        alertprojcreated: "El proyecto ha sido creado",
        accountinfosof: "Información de la cuenta de",
        youraccount: "Tu cuenta",
        firstname: "Nombre",
        lastname: "Apellido",
        email: "Correo electrónico",
        org: "Organización",
        orgname: "Nombre",
        orgresp: "Responsable",
        project: "Proyecto",
        projstatus: "Estado",
        projactiv: "Activo",
        projinactiv: "Inactivo",
        projdesc: "Descripción",
        noprojdesc: "Sin descripción",
        orgcontact: "Contacto",
        orgowner: "Propietario",
        projmembers: "Miembros del proyecto",
        projdetails: "Detalles del proyecto"
    }
}

renderUI()