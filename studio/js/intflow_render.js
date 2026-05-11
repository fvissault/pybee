/* =========================
   RENDER
========================= */
function render(){
    workspaceEl.innerHTML = ""
    tree.forEach(node => {
        workspaceEl.appendChild(renderNode(node))
    })

}

function renderNode(node){
    const dropBefore = document.createElement("div")
    const dropAfter = document.createElement("div")
    dropBefore.style.height = "10px"
    dropAfter.style.height = "10px"
    dropBefore.style.cursor = "pointer"
    dropAfter.style.cursor = "pointer"
    dropBefore.style.background = "transparent"
    dropAfter.style.background = "transparent"

    dropBefore.ondrop = ()=> handleDropAtPosition(node, "before")
    dropAfter.ondrop = ()=> handleDropAtPosition(node, "after")

    dropBefore.ondragover = (e) => {
        e.preventDefault()
        dropBefore.style.background = "#4CAF50"
    }

    dropBefore.ondragleave = () => {
        dropBefore.style.background = "transparent"
    }

    dropAfter.ondragover = (e) => {
        e.preventDefault()
        dropAfter.style.background = "#4CAF50"
    }

    dropAfter.ondragleave = () => {
        dropAfter.style.background = "transparent"
    }

    const el = document.createElement("div")
    el.className = "node"
    el._node = node

    // d&d
    el.draggable = true
    el.ondragstart = (e)=>{
        e.stopPropagation()
        draggedNode = node
        draggedFrom = findParentArray(tree, node)
        dragSource = "workspace"
    }

    el.prepend(dropBefore)

    // ID
    const idEl = document.createElement("div")
    idEl.className = "nodeid"
    //idEl.style.fontSize = "10px"
    //idEl.style.color = "#666"
    //idEl.style.padding = "0px 0px 10px 0px"
    idEl.innerText = node.id
    el.appendChild(idEl)

    // SWITCH TYPE
    switch (node.type) {
        /* ================= FUNCTION ================= */
        case "function": {
            const line = document.createElement("div")
            const nameInput = createInput(node, "name", el)
            const paramsInput = createInput(node, "parameters", el)
            line.append("function ", nameInput, " ( ", paramsInput, " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= EVENT LISTENER ================= */
        case "listener": {
            const options = document.createElement("div")
            const selectorSelect = createSelect(node, "selectorType", [
                { value: "id", label: "getElementById" },
                { value: "query", label: "querySelector" }
            ], el)
            options.append("Selector: ", selectorSelect)
            el.appendChild(options)

            const line = document.createElement("div")
            const targetInput = createInput(node, "target", el)
            targetInput.placeholder = node.props.selectorType === "id"? "buttonId": ".class, #id, div > span"
            const eventInput = createSelect(node, "event", [
                { value: "click", label: "click"},
                { value: "input", label: "input"},
                { value: "change", label: "change"}
            ], el)
            if(node.props.selectorType === "id"){
                line.append("document.getElementById(\"", targetInput, "\").addEventListener(\"", eventInput, "\", () => {")
            } else {
                line.append("document.querySelector(\"", targetInput, "\").addEventListener(\"", eventInput, "\", () => {")
            }
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "})"
            el.appendChild(close)
            break
        }
        /* ================= LOG ================= */
        case "log": {
            const line = document.createElement("div")
            const messageInput = createInput(node, "message", el)
            line.append("console.log(", messageInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= WARN ================= */
        case "warn": {
            const line = document.createElement("div")
            const messageInput = createInput(node, "message", el)
            line.append("console.warn(", messageInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= ERROR ================= */
        case "error": {
            const line = document.createElement("div")
            const messageInput = createInput(node, "message", el)
            line.append("console.error(", messageInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= IFELSE ================= */
        case "ifelse": {
            const line = document.createElement("div")
            const condInput = createInput(node, "condition", el)
            line.append("if ( ", condInput, " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "then"))
            const elseLine = document.createElement("div")
            elseLine.innerText = "} else {"
            el.appendChild(elseLine)
            el.appendChild(renderSlot(node, "else"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= IF ================= */
        case "if": {
            const line = document.createElement("div")
            const condInput = createInput(node, "condition", el)
            line.append("if ( ", condInput, " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "then"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= RETURN ================= */
        case "return": {
            const line = document.createElement("div")
            const valueInput = createInput(node, "value", el)
            line.append("return ", valueInput)
            el.appendChild(line)
            break
        }
        /* ================= LET ================= */
        case "let": {

            const line = document.createElement("div")

            const name = createInput(node, "name", el)

            if(!node.props.value){
                node.props.value = [
                    { slots: [] },
                    { op: "" }
                ]
            }

            const exprUI = renderExpression(node.props.value)

            line.append("let ", name, " = ", exprUI)

            el.appendChild(line)
            break
        }
        /* ================= CONST ================= */
        case "const": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            const rightexp = createInput(node, "value", el)
            line.append("const ", name, " = ", rightexp)
            el.appendChild(line)
            break
        }
        /* ================= BYID ================= */
        case "objbyid": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            const id = createInput(node, "id", el)
            line.append("const ", name, " = document.getElementById('", id, "')")
            el.appendChild(line)
            break
        }
        /* ================= FOR ================= */
        case "for": {
            const { varName, from, to } = node.props
            const isAsc = Number(from ?? 0) <= Number(to ?? 0)
            const line = document.createElement("div")
            const varInput = createInput(node, "varName", el, true)
            const fromInput = createInput(node, "from", el, true)
            const toInput = createInput(node, "to", el, true)
            const conditionText = isAsc ? "<" : ">"
            const incrementText = isAsc ? "++" : "--"
            line.append("for (let ", varInput, " = ", fromInput, " ; ", document.createTextNode(node.props.varName), " ", conditionText, " ", toInput, " ; ", document.createTextNode(node.props.varName),incrementText, ") {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= WHILE ================= */
        case "while": {
            const line = document.createElement("div")
            const condInput = createInput(node, "condition", el)
            line.append("while ( ", condInput, " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= DOWHILE ================= */
        case "dowhile": {
            const openLine = document.createElement("div")
            openLine.innerText = "do {"
            el.appendChild(openLine)
            el.appendChild(renderSlot(node, "body"))
            const closeLine = document.createElement("div")
            const condInput = createInput(node, "condition", el)
            closeLine.append("} while ( ", condInput, " )")
            el.appendChild(closeLine)
            break
        }        
        case "foreach": {

            // OPTIONS
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useIndex", "index", el))
            options.appendChild(createCheckbox(node, "useArray", "array", el))
            options.appendChild(createCheckbox(node, "useThisArg", "thisArg", el))
            el.appendChild(options)

            // LIGNE PRINCIPALE
            const line = document.createElement("div")
            const arrayInput = createInput(node, "array", el, true) // <-- tableau parcouru

            // paramètres
            const params = ["item"]

            if(node.props.useIndex){
                params.push("index")
            }

            if(node.props.useArray){
                // ici EDITABLE
                const arrayParamInput = createInput(node, "arrayName", el, true)
                params.push(arrayParamInput)
            }

            // construction des paramètres
            let paramsNode

            if(params.length === 1){
                paramsNode = document.createTextNode("item")
            } else {
                paramsNode = document.createDocumentFragment()
                paramsNode.append("(")

                params.forEach((p, i) => {
                if(i > 0) paramsNode.append(", ")

                if(typeof p === "string"){
                    paramsNode.append(p)
                } else {
                    paramsNode.append(p)
                }
                })

                paramsNode.append(")")
            }

            line.append(
                arrayInput,
                ".forEach(",
                paramsNode,
                " => {"
            )

            el.appendChild(line)

            // BODY
            el.appendChild(renderSlot(node, "body"))

            // FERMETURE
            const close = document.createElement("div")

            if(node.props.useThisArg){
                const thisArgInput = createInput(node, "thisArg", el, true)
                close.append("}, ", thisArgInput, ")")
            } else {
                close.innerText = "})"
            }

            el.appendChild(close)

            break
        }
        /* ================= BREAK ================= */
        case "break": {
            const line = document.createElement("div")
            line.append("break")
            el.appendChild(line)
            break
        }
        /* ================= CONTINUE ================= */
        case "continue": {
            const line = document.createElement("div")
            line.append("continue")
            el.appendChild(line)
            break
        }
    }
    el.appendChild(dropAfter)
    return el
}

function renderExpression(exprArray) {

    const container = document.createElement("span")

    exprArray.forEach((item, index) => {

        // SLOT
        if (item.slots !== undefined) {
            container.appendChild(renderExprSlot(item))
        }

        // OPERATOR
        if (item.op !== undefined) {
            container.appendChild(renderOperator(exprArray, index))
        }

    })

    return container
}

function renderExprSlot(item) {

    const slotEl = document.createElement("span")
    slotEl.className = "slot"

    if (item.slots.length > 0) {
        slotEl.appendChild(renderNode(item.slots[0]))
    } else {
        const input = document.createElement("input")
        input.placeholder = "value"
        if (item.value) input.value = item.value
        input.oninput = e => {
            item.value = e.target.value
        }
        slotEl.appendChild(input)
    }

    // D&D (important : remplacement, pas push)
    slotEl.ondragover = e => e.preventDefault()

    slotEl.ondrop = () => {
        if(!draggedNode) return

        item.slots = [draggedNode]

        draggedNode = null
        render()
    }

    return slotEl
}

function renderOperator(exprArray, index){

    const item = exprArray[index]

    const select = document.createElement("select");

    ["", "+", "-", "*", "/"].forEach(op=>{
        const o = document.createElement("option")
        o.value = op
        o.textContent = op || "..."
        select.appendChild(o)
    })

    select.value = item.op

    select.onchange = () => {

        item.op = select.value

        // AJOUT dynamique
        if (item.op && index === exprArray.length - 1) {
            exprArray.push({ slots: [] })
            exprArray.push({ op: "" })
        }

        // SUPPRESSION
        if (!item.op) {
            exprArray.splice(index + 1)
        }

        render()
    }

    return select
}

function renderSlot(node, slotName) {
    const slotEl = document.createElement("div")
    slotEl.className = "slot"

    slotEl.ondragover = (e) => {
        e.preventDefault()
        slotEl.style.background = "#eef"
    }

    slotEl.ondragleave = () => {
        slotEl.style.background = ""
    }

    slotEl.ondrop = (e) => {
        e.preventDefault()
        slotEl.style.background = ""

        if(!draggedNode) return
        if(draggedNode === node) return

        // validation (très important)
        if (!isNodeAllowedInParent(node, draggedNode.type)) {
            alert("Non autorisé ici")
            return
        }

        removeNodeFromParent()

        if (dragSource === "workspace") {
            const index = draggedFrom.indexOf(draggedNode)
            if (index !== -1) {
                draggedFrom.splice(index, 1)
            }
        }

        // ajouter ici
        node.slots[slotName].push(draggedNode)

        draggedNode = null
        draggedFrom = null

        render()
    }

    node.slots[slotName].forEach(child=>{
        slotEl.appendChild(renderNode(child))
    })
    return slotEl
}

/*==================================================================================
 * Définition de la palette
 *==================================================================================*/
const PALETTE = [
  {
    category: "Functions",
    items: [
      { type: "function", label: "Function" },
      { type: "call", label: "Call function" },
      { type: "arrow", label: "Arrow function" }
    ]
  },
  {
    category: "Flow",
    items: [
      { type: "if", label: "If" },
      { type: "ifelse", label: "If / Else" },
      { type: "switch", label: "Switch" },
      { type: "for", label: "For loop" },
      { type: "foreach", label: "ForEach loop" },
      { type: "while", label: "While loop" },
      { type: "dowhile", label: "Do while" },
      { type: "break", label: "Break" },
      { type: "continue", label: "Continue" },
      { type: "return", label: "Return" }
    ]
  },
  {
    category: "Variables & constants",
    items: [
      { type: "let", label: "Let" },
      { type: "const", label: "Const" },
      { type: "assign", label: "Assign (=)" }
    ]
  },
  {
    category: "Expressions",
    items: [
      { type: "add", label: "+" },
      { type: "sub", label: "-" },
      { type: "mul", label: "*" },
      { type: "div", label: "/" },
      { type: "equals", label: "===" },
      { type: "notequals", label: "!==" },
      { type: "and", label: "&&" },
      { type: "or", label: "||" },
      { type: "not", label: "!" }
    ]
  },
  {
    category: "Data",
    items: [
      { type: "array_create", label: "Array []" },
      { type: "array_push", label: "Array push" },
      { type: "array_get", label: "Array get" },
      { type: "object_create", label: "Object {}" },
      { type: "object_get", label: "Object get" },
      { type: "object_set", label: "Object set" }
    ]
  },
  {
    category: "Async",
    items: [
      { type: "async", label: "Async function" },
      { type: "await", label: "Await" },
      { type: "then", label: "Then" },
      { type: "catch", label: "Catch" },
      { type: "fetch", label: "Fetch" }
    ]
  },
  {
    category: "DOM",
    items: [
      { type: "objbyid", label: "Get by id" },
      { type: "query", label: "Query selector" },
      { type: "listener", label: "Event listener" },
      { type: "set_text", label: "Set text" },
      { type: "set_html", label: "Set HTML" },
      { type: "append", label: "Append child" }
    ]
  },
  {
    category: "Debug",
    items: [
      { type: "log", label: "Log" },
      { type: "warn", label: "Warn" },
      { type: "error", label: "Error" }
    ]
  }
];

/*==================================================================================
 * Construction de la palette
 *==================================================================================*/
function renderPalette(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "<h3>Palette</h3>";

    PALETTE.forEach(group => {
        const section = document.createElement("div");
        section.className = "palette_section";

        const header = document.createElement("div");
        header.className = "palette_header";
        header.textContent = group.category;

        // toggle
        header.onclick = () => {
            section.classList.toggle("collapsed");
        };

        const content = document.createElement("div");
        content.className = "palette_content";

        group.items.forEach(item => {
            const btn = document.createElement("button");
            btn.className = "palette-item";
            btn.textContent = item.label;

            btn.draggable = true;

            btn.ondragstart = (e) => handlePaletteDrag(e, item.type);
            btn.onclick = () => addRootNode(item.type);

            content.appendChild(btn);
        });

        section.appendChild(header);
        section.appendChild(content);
        container.appendChild(section);
    });
}
