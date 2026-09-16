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
        if (intflow && !intflow.closed) intflow.close()
        window.opener.location.href = "signin.html";
        window.opener.focus()
        window.close()
        return;
    }
    return session
}

// récupérer l'identifiant du projet
const params = new URLSearchParams(window.location.search)
const modelid = params.get("modelid")

let model_name = null
let model_description = null
let objectCounter = 1
let currenttable = null
let currentfield = null
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
    name: "commandes_client",
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
    foreignKeySide: "target"
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

async function openAddFieldPopup(tableId) {
    const session = await getSession()
    currenttable = modelRoot.tables.find(table => table.id === tableId);
    currentfield = null
    if (!currenttable) {
        alert(`Table introuvable : ${tableId}`);
        return;
    }
    const head = document.getElementById("dialogHeader")
    head.innerText = "Ajouter un nouvel attribut"
    openDialog("addattr")
}

function renderModel() {
    const workspace = document.getElementById("workspace");
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
        fields.appendChild(renderField(field));
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

function renderField(field) {
    const fieldElement = document.createElement("div");

    fieldElement.className = "model-table-field";
    fieldElement.dataset.fieldId = field.id;

    const keyContainer = document.createElement("span");
    keyContainer.className = "model-field-key";

    if (field.index === "primary") {
        keyContainer.appendChild(createPrimaryKeyIcon());
    }

    const fieldName = document.createElement("span");
    fieldName.className = "model-field-name";
    fieldName.textContent = field.name;

    const fieldType = document.createElement("span");
    fieldType.className = "model-field-type";
    fieldType.textContent = formatFieldType(field);

    fieldElement.append(
        keyContainer,
        fieldName,
        fieldType
    );

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

workspace.addEventListener("click", event => {
    const actionElement = event.target.closest("[data-action]");

    if (!actionElement) {
        closeTableMenus();
        return;
    }

    const tableElement = actionElement.closest(".model-table");

    if (!tableElement) return;

    const tableId = tableElement.dataset.tableId;
    const action = actionElement.dataset.action;

    event.stopPropagation();

    if (action === "toggle-table-menu") {
        const menu = tableElement.querySelector(".model-table-menu-content");
        const mustOpen = menu.hidden;
        closeTableMenus();
        menu.hidden = !mustOpen;
        return;
    }

    closeTableMenus();

    switch (action) {
        case "add-field":
            openAddFieldPopup(tableId);
            break;

        case "rename-table":
            openRenameTablePopup(tableId);
            break;

        case "delete-table":
            deleteTable(tableId);
            break;
    }
});

document.addEventListener("click", () => {
    closeTableMenus();
});

function closeTableMenus() {
    document
        .querySelectorAll(".model-table-menu-content")
        .forEach(menu => {
            menu.hidden = true;
        });
}