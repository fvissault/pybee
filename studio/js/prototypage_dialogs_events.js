// *******************************************************************************
// popup events
// *******************************************************************************
function popupEvents(node){

    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""

    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du widget"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label>Événements :</label>
            </div>

            <div id="events-container"></div>

            <div class="dialog-row">
                <button class="btn btn-secondary" onclick="addEventRow()">+ Ajouter un événement</button>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="saveprops" class="btn btn-primary">Appliquer</button>
            <button class="btn btn-secondary" onclick="closeDialog()">Fermer</button>
        </div>
    `
    content.querySelector("#saveprops").onclick = () => saveEvents(node)
    const container = document.getElementById("events-container")

    const events = node.events || {}

    Object.entries(events).forEach(([type, config]) => {
        const row = createEventRow({
            type,
            action: config
        })

        row.querySelector(".event-type").value = type
        row.querySelector(".event-action").value = config.type + "(" + config.params + ")"

        container.appendChild(row)
    })
}

function saveEvents(node) {
    node.events = collectEvents()
    closeDialog()
}

function addEventRow() {
    const container = document.getElementById("events-container")
    const row = createEventRow()
    container.appendChild(row)
}

function stringifyAction(config) {
    if (!config) return ""

    if (!config.params || config.params.length === 0) {
        return config.type
    }

    return `${config.type}(${config.params})`
}

const AVAILABLE_EVENTS = [
    "click",
    "dblclick",
    "mouseenter",
    "mouseleave",
    "change"
]

function createEventRow(event = {}) {
    const row = document.createElement("div")
    row.className = "dialog-row"

    row.innerHTML = `
        <select class="event-type" style="width:120px; margin-right:7px;">
            ${AVAILABLE_EVENTS.map(e => `<option value="${e}">${e}</option>`).join("")}
        </select>

        <input class="event-action" placeholder="addValue(2)" style="margin-right:7px;">

        <button class="btn btn-secondary remove-event">-</button>
    `
    if (event.type) {
        row.querySelector(".event-type").value = event.type
    }

    if (event.action) {
        row.querySelector(".event-action").value = event.action
    }

    row.querySelector(".remove-event").onclick = () => row.remove()

    return row
}

function parseAction(str) {
    const match = str.match(/^(\w+)\((.*)\)$/)

    if (!match) {
        return { type: str, params: "" }
    }

    const type = match[1]
    const params = match[2]
        //.split(",")
        //.map(p => p.trim())
        //.filter(p => p.length > 0)

    return { type, params }
}

function collectEvents() {
    const rows = document.querySelectorAll("#events-container .dialog-row")
    const events = {}

    rows.forEach(row => {
        const type = row.querySelector(".event-type").value
        const actionStr = row.querySelector(".event-action").value
        const parsed = parseAction(actionStr)

        events[type] = {
            type: parsed.type,
            params: parsed.params
        }
    })

    return events
}
