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

    const isInlineExpr = [
        "function",
        "await",
        "call"
    ].includes(node.type)

    const el = document.createElement("div")
    el.className = `node ${node.type}`
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

    const node_header = document.createElement("div")
    node_header.className = "node-header"
    const toggle = document.createElement("button")
    toggle.className = "collapse-btn"
    toggle.textContent = node.ui?.collapsed ? "▾" : "▴"

    toggle.onclick = (e) => {
        e.stopPropagation()
        node.ui.collapsed = !node.ui.collapsed
        render()
    }
    if (COLLAPSIBLE.has(node.type)) {
        node_header.appendChild(toggle)
        el.appendChild(node_header)
    }

    // ID
    const idEl = document.createElement("div")
    idEl.className = "nodeid"
    idEl.innerText = node.id
    el.appendChild(idEl)

    if (node.ui?.collapsed && COLLAPSIBLE.has(node.type)) {
        const summary = document.createElement("div")
        summary.textContent = getCollapsedLabel(node)
        node_header.appendChild(summary)
    } else {
        renderNodeContent(node, el)
    }
    el.appendChild(dropAfter)
    return el
}

function getCollapsedLabel(node) {
    switch(node.type) {
        case "let":
            return `let ${node.props.name || "?"} = ...`
        case "function":
            return `function ${node.props.name || "anonymous"}(...)`
        case "fetch":
            return `fetch("${node.props.url || "?"}", {...})...`
        case "object_create":
            return `{...}`
        case "array_create":
            return `[...]`
        case "ifelse":
            return `if (${node.props.condition || "?"}) {...} else {...}`
        case "if":
            return `if (${node.props.condition || "?"}) {...}`
        case "for":
            return `for (${node.props.varName || "?"}) {...}`
        case "while":
            return `while (${node.props.condition || "?"}) {...}`
        case "foreach":
            return `${node.props.array || "?"}.forEach (item => {...})`
        case "dowhile":
            return `do {...} while (${node.props.condition || "?"})`
        default:
            return node.type
    }
}

function renderNodeContent(node, el) {
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
        /* ================= CALL ================= */
        case "call": {
            const line = document.createElement("div")
            const nameInput = createInput(node, "name", el)
            const paramsInput = createInput(node, "parameters", el)
            line.append(nameInput, " ( ", paramsInput, " )")
            el.appendChild(line)
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
            line.append("return ", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= LET ================= */
        case "let": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            line.append("let ", name, " = ", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= ASSIGN ================= */
        case "assign": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            line.append(name, " = ", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= CONST ================= */
        case "const": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            line.append("const ", name, " = ", renderSlot(node, "body"))
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
            if (node.props.useIndex) {
                params.push("index")
            }
            if (node.props.useArray) {
                // ici EDITABLE
                const arrayParamInput = createInput(node, "arrayName", el, true)
                params.push(arrayParamInput)
            }
            // construction des paramètres
            let paramsNode
            if (params.length === 1) {
                paramsNode = document.createTextNode("item")
            } else {
                paramsNode = document.createDocumentFragment()
                paramsNode.append("(")

                params.forEach((p, i) => {
                    if(i > 0) paramsNode.append(", ")
                    if (typeof p === "string") {
                        paramsNode.append(p)
                    } else {
                        paramsNode.append(p)
                    }
                })
                paramsNode.append(")")
            }
            line.append(arrayInput, ".forEach(", paramsNode, " => {")
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
        /* ================= AWAIT ================= */
        case "await": {
            const line = document.createElement("div")
            line.className = "await-expr"
            line.append("await", renderSlot(node, "body"))
            el.appendChild(line)
            // BODY
            //el.appendChild(renderSlot(node, "body"))
            break
        }
        /* ================= ASYNC ================= */
        case "async": {
            const line = document.createElement("div")
            const nameInput = createInput(node, "name", el)
            const paramsInput = createInput(node, "parameters", el)
            line.append("async function ", nameInput, " ( ", paramsInput, " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "}"
            el.appendChild(close)
            break
        }
        /* ================= LITERAL ================= */
        case "literal": {
            const line = document.createElement("div")
            const input = createInput(node, "value", el)
            line.append(input)
            el.appendChild(line)
            break
        }
        /* ================= ADD ================= */
        case "add": {
            node.props.parenthesis = true
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " + ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= SUB ================= */
        case "sub": {
            node.props.parenthesis = true
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " - ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= MUL ================= */
        case "mul": {
            node.props.parenthesis = false
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " * ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= DIV ================= */
        case "div": {
            node.props.parenthesis = false
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " / ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= AND ================= */
        case "and": {
            node.props.parenthesis = false
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " && ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= OR ================= */
        case "or": {
            node.props.parenthesis = true
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " || ", renderSlot(node, "right"))
            el.appendChild(line)
            break
        }
        /* ================= TRY ================= */
        case "try": {
            const line = document.createElement("div")
            line.append("try {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            const catchentry = document.createElement("div")
            catchentry.innerText = "catch (e) {"
            el.appendChild(catchentry)
            el.appendChild(renderSlot(node, "catch-body"))
            el.appendChild(closingBracket())
            const finallyentry = document.createElement("div")
            finallyentry.appendChild(createCheckbox(node, "hasFinally", "finally", el))
            el.appendChild(finallyentry)
            if (node.props.hasFinally) {
                finallyentry.append("{")
                el.appendChild(renderSlot(node, "finally-body"))
                el.appendChild(closingBracket())
            }
            break
        }
        /* ================= ARROW ================= */
        case "arrow": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "parameters", el, true)
            line.append("(", paramInput, ") => {", renderSlot(node, "body"), "}")
            el.appendChild(line)
            break
        }
        /* ================= FETCH ================= */
        case "fetch": {
            const line = document.createElement("div")
            const urlInput = createInput(node, "url", el, true)
            line.append("fetch (", urlInput, ", {", )
            el.appendChild(line)
            el.appendChild(renderSlot(node, "options"))
            const endfetch = document.createElement("div")
            endfetch.innerText = "})"
            el.appendChild(endfetch)

            for(let i = 1; i <= node.props.slotsthencount; i++) {
                let thenentry = document.createElement("div")
                if (node.props[`hasThen-body-${i}`]) {
                    thenentry.appendChild(createCheckbox(node, `hasThen-body-${i}`, ".then", el))
                    thenentry.append("(")
                    el.appendChild(thenentry)
                    el.appendChild(renderSlot(node, `then-body-${i}`))
                    el.appendChild(closingParenthesis())
                } else {
                    thenentry.appendChild(createCheckbox(node, `hasThen-body-${i}`, ".then", el))
                    el.appendChild(thenentry)
                }
            }

            // bouton +then
            const thenplus = document.createElement("button")
            thenplus.innerText = "+then"
            thenplus.onclick = () => {
                node.props.slotsthencount += 1
                node.slots[`then-body-${node.props.slotsthencount}`] = []
                node.props[`hasThen-body-${node.props.slotsthencount}`] = false
                render()
            }
            el.appendChild(thenplus)

            const catchentry = document.createElement("div")
            if (node.props.hasCatch) {
                catchentry.appendChild(createCheckbox(node, "hasCatch", ".catch", el))
                catchentry.append("((e) => {")
                el.appendChild(catchentry)
                el.appendChild(renderSlot(node, "catch-body"))
                let div = document.createElement("div")
                div.innerText = "})"
                el.appendChild(div)
            } else {
                catchentry.appendChild(createCheckbox(node, "hasCatch", ".catch", el))
                el.appendChild(catchentry)
            }
            const finallyentry = document.createElement("div")
            finallyentry.appendChild(createCheckbox(node, "hasFinally", ".finally", el))
            el.appendChild(finallyentry)
            if (node.props.hasFinally) {
                finallyentry.append("(() => {")
                el.appendChild(renderSlot(node, "finally-body"))
                let div = document.createElement("div")
                div.innerText = "})"
                el.appendChild(div)
            }
            break
        }
        /* ================= OBJECT_CREATE ================= */
        case "object_create": {
            const line = document.createElement("div")
            line.append("{")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            let div = document.createElement("div")
            div.innerText = "}"
            el.appendChild(div)
            break
        }
        /* ================= OBJECT_SET ================= */
        case "object_set": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "key", el, true)
            line.append(paramInput, ":", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= ARRAY_CREATE ================= */
        case "array_create": {
            const line = document.createElement("div")
            line.append("[")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            let div = document.createElement("div")
            div.innerText = "]"
            el.appendChild(div)
            break
        }
    }
}

function closingBracket() {
    const div = document.createElement("div")
    div.innerText = "}"
    return div
}

function closingParenthesis() {
    const div = document.createElement("div")
    div.innerText = ")"
    return div
}

function renderSlot(node, slotName) {
    const slotEl = document.createElement("div")
    slotEl.className = node.slotLayout

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
            alert(`${draggedNode.type} est interdit dans ${node.type}`)
            resetDrag()
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
