async function getSession() {
    // 1. Récupération session
    const res = await fetch("/pybee/studio/api/session.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ action: "read" })
    });
    const session = await res.json();
    //console.log(session)
    // 2. Vérification
    if(!session || session.status || !session.auth) {
        window.opener.opener.href = "signin.html";
        if (window.opener.opener.prototypageWindow) window.opener.opener.prototypageWindow.close();
        if (window.opener.opener.credentialslWindow) window.opener.opener.credentialslWindow.close();
        window.opener.close()
        window.close()
        return;
    }
    return session
}

window.addEventListener("beforeunload", function (e) {
    if (!tosave) return
    e.preventDefault()
    e.returnValue = ""
});

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const modelid = params.get("modelid")

let model_name = null
let model_description = null
let objectCounter = 1
let currenttable = null
let currentfield = null
let currentrelation = null
let tosave = false

let modelRoot = {
    objectCounter: objectCounter,
    dbcredentials: 1,
    tables: [],
    relations: []
}

let tableRoot = {
    id: "user_12",
    x: 100,
    y: 50,
    name: "user",
    fields: []
}

let relationRoot = 
{
    id: "r1",
    source: {
        tableId: "table-client",
        fieldId: "client-id",
        cardinality: "1",
        role: "client"
    },
    target: {
        tableId: "table-commande",
        fieldId: "commande-id-client",
        cardinality: "0..n",
        role: "commandes"
    },
    foreignKeySide: "target",
    comment:""
}

let fieldRoot = {
    id: "field-1",
    name: "id",
    type: "INT",
    length: null,
    precision: null,
    scale: null,
    nullable: false,
    defaultValue: null,
    index: "primary",
    autoIncrement: true,
    attribute: "unsigned",
    values: "", // uniquement pour le cas de l'énumération
    comment: ""
}

async function initModelProto() {
    const session = await getSession()
    //console.log(session)
    if (session) {
        fetch("/pybee/studio/api/models.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getById",
                id : modelid
            })
        })
        .then(r => r.json())
        .then(data => {
            model_name = data["name"]
            model_description = data["description"]
        });
    }
}

async function addTable() {
    const session = await getSession()
    const head = document.getElementById("dialogHeader")
    head.innerText = "Ajouter une nouvelle table"
    openDialog("addtable")
}

async function addRel() {
    const session = await getSession()
    openDialog("addrel")
}

async function editRel(relationId) {
    const session = await getSession()
    currentrelation = relationId
    openDialog("addrel")
}

async function openAddFieldPopup(tableId, fieldId = null) {
    const session = await getSession()
    currenttable = modelRoot.tables.find(table => table.id === tableId);
    currentfield = fieldId
    if (!currenttable) {
        alert(`Table introuvable : ${tableId}`);
        return;
    }
    const head = document.getElementById("dialogHeader")
    head.innerText = "Ajouter un nouvel attribut"
    openDialog("addattr")
}

async function openRenameTablePopup(tableId) {
    const session = await getSession()
    currenttable = modelRoot.tables.find(table => table.id === tableId);
    if (!currenttable) {
        alert(`Table introuvable : ${tableId}`);
        return;
    }
    const head = document.getElementById("dialogHeader")
    head.innerText = "Renommer une table"
    openDialog("renametable")
}

function renderModel() {
    const workspace = document.getElementById("tables-layer");
    const fragment = document.createDocumentFragment();

    for (const table of modelRoot.tables) {
        fragment.appendChild(renderTable(table));
    }

    workspace.replaceChildren(fragment);
}

function renderTable(table) {
    const tableElement = document.createElement("div");
    tableElement.draggable = true

    tableElement.className = "model-table";
    tableElement.dataset.tableId = table.id;

    tableElement.style.left = `${table.x}px`;
    tableElement.style.top = `${table.y}px`;

    const header = document.createElement("div");
    header.className = "model-table-header";

    const tableName = document.createElement("span");
    tableName.className = "model-table-name";
    tableName.textContent = table.name;

    const menuContainer = document.createElement("div");
    menuContainer.className = "model-table-menu";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "model-table-menu-button";
    menuButton.dataset.action = "toggle-table-menu";
    menuButton.draggable = false;
    menuButton.title = "Actions sur la table";
    menuButton.textContent = "⋮";

    const menu = document.createElement("div");
    menu.className = "model-table-menu-content";
    menu.hidden = true;

    menu.append(
        createTableMenuItem("add-field", "Ajouter un attribut"),
        createTableMenuItem("rename-table", "Renommer la table"),
        createTableMenuItem("delete-table", "Supprimer la table", true)
    );

    menuContainer.append(menuButton, menu);
    header.append(tableName, menuContainer);
    const fields = document.createElement("div");
    fields.className = "model-table-fields";
    for (const field of table.fields) {
        fields.appendChild(renderField(field, table));
    }

    tableElement.append(header, fields);

    return tableElement;
}

function createTableMenuItem(action, label, danger = false) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "model-table-menu-item";
    button.dataset.action = action;
    button.draggable = false;
    button.textContent = label;

    if (danger) {
        button.classList.add("danger");
    }

    return button;
}

function renderField(field, table) {
    const fieldElement = document.createElement("div");

    fieldElement.className = "model-table-field";
    fieldElement.dataset.fieldId = field.id;
    fieldElement.dataset.tableId = table.id;

    const keyContainer = document.createElement("span");
    keyContainer.className = "model-field-key";

    if (field.index === "primary") {
        keyContainer.appendChild(createPrimaryKeyIcon());
    }

    const fieldName = document.createElement("span");
    fieldName.className = "model-field-name";
    fieldName.textContent = field.name;
    fieldName.title = field.name;

    const fieldType = document.createElement("span");
    fieldType.className = "model-field-type";
    fieldType.textContent = formatFieldType(field);

    const menuContainer = document.createElement("div");
    menuContainer.className = "model-field-menu";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "model-field-menu-button";
    menuButton.dataset.action = "toggle-field-menu";
    menuButton.draggable = false;
    menuButton.title = "Actions sur l’attribut";
    menuButton.textContent = "⋮";

    const menu = document.createElement("div");
    menu.className = "model-field-menu-content";
    menu.hidden = true;

    menu.append(
        createTableMenuItem("edit-field", "Modifier l'attribut"),
        createTableMenuItem("delete-field", "Supprimer l'attribut", true)
    );

    menuContainer.append(menuButton, menu);

    const dragHandle = document.createElement("span");

    dragHandle.className = "model-field-drag-handle";
    dragHandle.draggable = true;
    dragHandle.title = "Déplacer l'attribut";

    dragHandle.innerHTML = `
        <svg viewBox="0 0 12 18" width="12" height="18">
            <circle cx="3" cy="4" r="1.2"></circle>
            <circle cx="9" cy="4" r="1.2"></circle>
            <circle cx="3" cy="9" r="1.2"></circle>
            <circle cx="9" cy="9" r="1.2"></circle>
            <circle cx="3" cy="14" r="1.2"></circle>
            <circle cx="9" cy="14" r="1.2"></circle>
        </svg>
    `;
    fieldElement.append(dragHandle, keyContainer, fieldName, fieldType,menuContainer);

    return fieldElement;
}

function formatFieldType(field) {
    const type = field.type.toUpperCase();

    if (field.precision) {
        const scale = field.scale
            ? `,${field.scale}`
            : "";

        return `${type}(${field.precision}${scale})`;
    }

    if (field.length) {
        return `${type}(${field.length})`;
    }

    return type;
}

function createPrimaryKeyIcon() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    svg.setAttribute("aria-label", "Clé primaire");

    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", "8");
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#e6ad00");
    circle.setAttribute("stroke-width", "2.5");

    const shaft = document.createElementNS(svgNamespace, "path");
    shaft.setAttribute("d", "M11 11 L20 20 M16 16 L19 13 M18 18 L21 15");
    shaft.setAttribute("fill", "none");
    shaft.setAttribute("stroke", "#e6ad00");
    shaft.setAttribute("stroke-width", "2.5");
    shaft.setAttribute("stroke-linecap", "round");
    shaft.setAttribute("stroke-linejoin", "round");

    svg.append(circle, shaft);

    return svg;
}

function deleteTable(tableId) {
    const table = modelRoot.tables.find(
        table => table.id === tableId
    );

    if (!table) return;

    const confirmed = confirm(`Supprimer la table "${table.name}" ?`);

    if (!confirmed) return;

    modelRoot.tables = modelRoot.tables.filter(
        table => table.id !== tableId
    );

    renderModel();
}

function deleteField(tableId, fieldId) {
    const table = modelRoot.tables.find(table => table.id === tableId);
    if (!table) return;
    const field = table.fields.find(
        field => field.id === fieldId
    );
    if (!field) return;
    const confirmed = confirm(`Supprimer l’attribut "${field.name}" ` + `de la table "${table.name}" ?`);
    if (!confirmed) return;
    table.fields = table.fields.filter(field => field.id !== fieldId);
    renderModel();
}

function closeActionMenus() {
    document
        .querySelectorAll(`
            .model-table-menu-content,
            .model-field-menu-content
        `)
        .forEach(menu => {
            menu.hidden = true;
        });
}

document.addEventListener("click", () => {
    closeActionMenus();
});