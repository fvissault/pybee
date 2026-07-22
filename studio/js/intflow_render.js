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
    toggle.className = "btn btn-primary"
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
        case "const":
            return `${node.type} ${node.props.name || "?"}`
        case "function":
            return `function ${node.props.name || "anonymous"} (${node.props.parameters || ""}) {...}`
        case "async":
            return `async function ${node.props.name || "anonymous"} (${node.props.parameters || ""}) {...}`
        case "fetch":
            return `fetch("${node.props.url || "?"}", {...})...`
        case "object_create":
            return `{...}`
        case "array_create":
            return `[...]`
        case "ifelse":
            return `if (...) {...} else {...}`
        case "if":
            return `if (...) {...}`
        case "for":
            return `for (${node.props.varName || "?"}) {...}`
        case "forin":
            return `for (... in ${node.props.array || "?"}) {...}`
        case "forof":
            return `for (... of ${node.props.array || "?"}) {...}`
        case "while":
            return `while (${node.props.condition || "?"}) {...}`
        case "foreach":
            return `${node.props.array || "?"}.forEach (item => {...})`
        case "dowhile":
            return `do {...} while (${node.props.condition || "?"})`
        case "chain":
            return `${node.props.arrayname || "?"}.chain`
        case "arrow":
            return `(element, ...) => {...}`
        case "flat":
            return `flat (depth = ${node.props.depth || "?"})`
        case "flatmap":
            return `flatMap (...)`
        case "findindex":
            return `findIndex (...)`
        case "findlast":
            return `findLast (...)`
        case "filter":
        case "map":
        case "find":
        case "some":
        case "every":
            return `${node.type} (...)`
        case "split":
        case "join":
            return `${node.type} (${node.props.separator || "?"})` 
        case "indexof":
            return `indexOf (${node.props.search || "?"}, ...)` 
        case "lastindexof":
            return `lastIndexOf (${node.props.search || "?"}, ...)` 
        case "includes":
            return `${node.type} (${node.props.search || "?"}, ...)` 
        case "concat":
        case "unshift":
        case "push":
            return `${node.type} (${node.props.element || "?"}${node.props.inputcount==0?"":", ..."})` 
        case "method":
            return `${node.type} ${node.props.useStatic?"static ":""}${node.props.usePrivate?"#":""}${node.props.methodname || "?"} (${node.props.parameters || "?"})` 
        case "constructor":
            return `${node.type} (${node.props.parameters || "?"})` 
        case "class":
            return `${node.type} ${node.props.classname || "?"} ${node.props.useExtends?" extends " + (node.props.extends!=""?node.props.extends:"?"):""}` 
        case "property":
            return `${node.type} ${node.props.useStatic?"static ":""}${node.props.usePrivate?"#":""}${node.props.name || "?"}${node.props.useGetterSetter?" with accessors":""}` 
        case "switch":
            return `${node.type} on ${node.props.varname || "?"} {...}` 
        case "case":
            return `in ${node.type} ${node.props.varvalue || "?"}: {...}` 
        case "default":
            return `by ${node.type}: {...}` 
        case "log":
        case "warn":
        case "error":
            return `${node.type} (...)` 
        case "listener":
            return `add an event ${node.type} with ${node.props.event} event` 
        case "doc_selector":
            return `on document, get element ${node.props.target!==""?(node.props.target + " by " + node.props.selectorType):(" ? by " + node.props.selectorType)}` 
        case "el_selector":
            return `on element ${node.props.element !== "" ? node.props.element : "?"}${node.props.selectorType !== "nosel"? `, get element ${node.props.target !== ""? node.props.target + " by " + node.props.selectorType: "? by " + node.props.selectorType}`: " by any selector"}` 
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
            el.appendChild(closingBracket())
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
        /* ================= LOG, WARN, ERROR ================= */
        case "error":
        case "warn":
        case "log": {
            const line = document.createElement("div")
            line.append(node.type, "(", renderSlot(node, "body"), ")")
            el.appendChild(line)
            break
        }
        /* ================= IFELSE ================= */
        case "ifelse": {
            const line = document.createElement("div")
            line.append("if ( ", renderSlot(node, "condition"), " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "then"))
            const elseLine = document.createElement("div")
            elseLine.innerText = "} else {"
            el.appendChild(elseLine)
            el.appendChild(renderSlot(node, "else"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= IF ================= */
        case "if": {
            const line = document.createElement("div")
            line.append("if ( ", renderSlot(node, "condition"), " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "then"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= RETURN ================= */
        case "return": {
            const line = document.createElement("div")
            line.append("return ", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= CONST, LET ================= */
        case "const":
        case "let": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            line.append(node.type, " ", name)
            el.appendChild(line)
            break
        }
        /* ================= ASSIGN ================= */
        case "assign": {
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), " = ", renderSlot(node, "right"))
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
            el.appendChild(closingBracket())
            break
        }
        /* ================= FORIN, FOROF ================= */
        case "forin":
        case "forof": {
            const line = document.createElement("div")
            const arrayInput = createInput(node, "array", el, true)
            if (node.type === "forin") {
                line.append("for (", renderSlot(node, "variable"), " in ", arrayInput, ") {")
            } else {
                line.append("for (", renderSlot(node, "variable"), " of ", arrayInput, ") {")
            }
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= WHILE ================= */
        case "while": {
            const line = document.createElement("div")
            line.append("while ( ", renderSlot(node, "condition"), " ) {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= DOWHILE ================= */
        case "dowhile": {
            const openLine = document.createElement("div")
            openLine.innerText = "do {"
            el.appendChild(openLine)
            el.appendChild(renderSlot(node, "body"))
            const closeLine = document.createElement("div")
            closeLine.append("} while ( ", renderSlot(node, "condition"), " )")
            el.appendChild(closeLine)
            break
        }        
        /* ================= FOREACH ================= */
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
        /* ================= BREAK, CONTINUE ================= */
        case "continue":
        case "break": {
            const line = document.createElement("div")
            line.append(node.type)
            el.appendChild(line)
            break
        }
        /* ================= AWAIT ================= */
        case "await": {
            const line = document.createElement("div")
            line.className = "await-expr"
            line.append("await", renderSlot(node, "body"))
            el.appendChild(line)
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
            el.appendChild(closingBracket())
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
        /* ================= ADD, SUB, MUL, DIV, AND, OR, EQUALS, NOTEQUALS, EQUAL, NOTEQUAL, INFEQUAL, INF, SUPEQUAL, SUP ================= */
        case "infequal":
        case "inf":
        case "supequal":
        case "sup":
        case "notequal":
        case "equal":
        case "notequals":
        case "equals":
        case "or":
        case "and":
        case "div":
        case "mul":
        case "sub":
        case "add": {
            let op = ""
            if (node.type === "add") op = " + "
            if (node.type === "sub") op = " - "
            if (node.type === "mul") op = " * "
            if (node.type === "div") op = " / "
            if (node.type === "and") op = " && "
            if (node.type === "or") op = " || "
            if (node.type === "equals") op = " === "
            if (node.type === "notequals") op = " !== "
            if (node.type === "equal") op = " == "
            if (node.type === "notequal") op = " != "
            if (node.type === "inf") op = " < "
            if (node.type === "infequal") op = " <= "
            if (node.type === "sup") op = " > "
            if (node.type === "supequal") op = " >= "
            node.props.parenthesis = true
            const line = document.createElement("div")
            line.append(renderSlot(node, "left"), op, renderSlot(node, "right"))
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
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useIndex", "index", el))
            options.appendChild(createCheckbox(node, "useArray", "array", el))
            el.appendChild(options)

            const params = ["element"]
            if (node.props.useIndex) {
                const indexParamInput = createInput(node, "indexName", el, true)
                params.push(indexParamInput)
            }
            if (node.props.useArray) {
                // ici EDITABLE
                const arrayParamInput = createInput(node, "arrayName", el, true)
                params.push(arrayParamInput)
            }
            let paramsNode = document.createDocumentFragment()
            paramsNode.append("(")

            params.forEach((p, i) => {
                if(i > 0) paramsNode.append(", ")
                paramsNode.append(p)
            })
            paramsNode.append(")")

            const line = document.createElement("div")
            line.append(paramsNode, " => {")
            el.appendChild(line)

            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
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
            thenplus.className = "btn btn-primary"
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
        /* ================= CHAIN ================= */
        case "chain": {
            const dotplus = document.createElement("button")
            dotplus.className = "btn btn-primary"
            dotplus.innerText = "+"
            dotplus.onclick = () => {
                node.props.dotslotcount += 1
                node.slots[`dotplus-${node.props.dotslotcount}`] = []
                node.props[`hasdotplus-${node.props.dotslotcount}`] = false
                RULES["chain"][`dotplus-${node.props.dotslotcount}`] = RULES["chain"]["body"]
                render()
            }
            const dotdel = document.createElement("button")
            dotdel.className = "btn btn-secondary"
            dotdel.innerText = "🗑"
            dotdel.onclick = () => {
                delete node.slots[`dotplus-${node.props.dotslotcount}`]
                delete node.props[`hasdotplus-${node.props.dotslotcount}`]
                delete RULES["chain"][`dotplus-${node.props.dotslotcount}`]
                node.props.dotslotcount -= 1
                render()
            }

            const line = document.createElement("div")
            const paramInput = createInput(node, "arrayname", el, true)
            line.append(paramInput, " .", renderSlot(node, "body"))

            for(let i = 1; i <= node.props.dotslotcount; i++) {
                const slot = renderSlot(node, `dotplus-${i}`)
                slot.onclick = (e) => {
                    if (e.target.closest("input, button, select, textarea, label")) return
                    e.stopPropagation();
                    if (node.props[`hasdotplus-${i}`]) {
                        node.props[`hasdotplus-${i}`] = false
                        slot.classList.add("slot-disabled")
                    } else {
                        node.props[`hasdotplus-${i}`] = true
                        slot.classList.remove("slot-disabled")
                    }
                    render()
                }

                if (!node.props[`hasdotplus-${i}`]) {
                    node.props[`hasdotplus-${i}`] = false
                    slot.classList.add("slot-disabled")
                    line.append(slot)
                }
                line.append(".", slot)
            }
            line.append(node.props.dotslotcount > 0?dotdel:"", dotplus)
            el.appendChild(line)
            break
        }
        /* ================= JOIN(INPUT), SPLIT ================= */
        case "split":
        case "join": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "separator", el, true)
            line.append(node.type, " ( ", paramInput, " )")
            el.appendChild(line)
            break
        }
        /* ================= FLAT ================= */
        case "flat": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "depth", el, true)
            line.append("flat ( ", paramInput, " )")
            el.appendChild(line)
            break
        }
        /* ================= FINDINDEX, FIND, FILTER, MAP, FLATMAP, FINDLAST, SOME, EVERY ================= */
        case "every":
        case "some":
        case "findlast":
        case "filter":
        case "map":
        case "flatmap":
        case "find":
        case "findindex": {
            let typetext = ""
            switch (node.type) {
                case "flatmap":{
                    typetext = "flatMap"
                    break
                }
                case "findindex":{
                    typetext = "findIndex"
                    break
                }
                case "findlast":{
                    typetext = "findLast"
                    break
                }
                default: {
                    typetext = node.type
                }
            }
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useThisArg", "thisArg", el))
            el.appendChild(options)
            // LIGNE PRINCIPALE
            const line = document.createElement("div")
            if (node.props.useThisArg){
                const thisArgInput = createInput(node, "thisArg", el, true)
                line.append(typetext, " (", renderSlot(node, "body"), ", ", thisArgInput, " )")
            } else {
                line.append(typetext, " (", renderSlot(node, "body"), ")")
            }
            el.appendChild(line)
            break
        }
        /* ================= POP, SHIFT, REVERSE ================= */
        case "reverse":
        case "pop":
        case "shift": {
            const line = document.createElement("div")
            line.append(node.type, "()")
            el.appendChild(line)
            break
        }
        /* ================= ENTRIES, KEYS, VALUES ================= */
        case "entries":
        case "values":
        case "keys": {
            const line = document.createElement("div")
            const objInput = createInput(node, "object", el, true)
            line.append(node.type, "(", objInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= LASTINDEXOF, INDEXOF, INCLUDES ================= */
        case "lastindexof":
        case "indexof":
        case "includes": {
            const line = document.createElement("div")
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useFrom", "Use from", el))
            el.appendChild(options)
            const searchInput = createInput(node, "search", el, true)
            let typetext = node.type
            if (node.type === "indexof") typetext = "indexOf"
            if (node.type === "lastindexof") typetext = "lastIndexOf"
            if (node.props.useFrom) {
                const fromInput = createInput(node, "from", el, true)
                line.append(typetext, " ( ", searchInput, ", ", fromInput, " )")
            } else {
                line.append(typetext, " ( ", searchInput, " )")
            }
            el.appendChild(line)
            break
        }
        /* ================= UNSHIFT, PUSH ================= */
        case "concat":
        case "unshift":
        case "push": {
            const plusbtn = document.createElement("button")
            plusbtn.className = "btn btn-primary"
            plusbtn.innerText = "+"
            plusbtn.onclick = () => {
                node.props.inputcount += 1
                node.props[`hasinput-${node.props.inputcount}`] = false
                node.props[`element-${node.props.inputcount}`] = ""
                render()
            }
            const delbtn = document.createElement("button")
            delbtn.className = "btn btn-secondary"
            delbtn.innerText = "🗑"
            delbtn.onclick = () => {
                delete node.props[`hasinput-${node.props.inputcount}`]
                delete node.props[`element-${node.props.inputcount}`]
                node.props.inputcount -= 1
                render()
            }

            const line = document.createElement("div")
            const elementInput = createInput(node, "element", el, true)
            line.append(node.type, " (", elementInput)

            for(let i = 1; i <= node.props.inputcount; i++) {
                const elInput = createInput(node, `element-${i}`, el, true)
                elInput.placeholder = "element"
                line.append(", ", elInput)
            }
            line.append(")")
            line.append(node.props.inputcount > 0?delbtn:"", plusbtn)
            el.appendChild(line)
            break
        }

        /* ================= CLASS ================= */
        case "class": {
            const line = document.createElement("div")
            const classNameInput = createInput(node, "classname", el, true)
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useExtends", "Extends", el))
            el.appendChild(options)
            if (node.props.useExtends) {
                const extendsInput = createInput(node, "extends", el, true)
                line.append("class ", classNameInput, " extends ", extendsInput, " {")
            } else {
                line.append("class ", classNameInput, " {")
            }
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= CONSTRUCTOR ================= */
        case "constructor": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "parameters", el, true)
            line.append(node.type, " (", paramInput, ") {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= CLASS METHOD ================= */
        case "method": {
            const line = document.createElement("div")
            const methodInput = createInput(node, "methodname", el, true)
            const paramInput = createInput(node, "parameters", el, true)
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useStatic", "Static", el))
            options.appendChild(createCheckbox(node, "usePrivate", "Private", el))
            el.appendChild(options)
            line.append(node.props.useStatic?"static ":"", node.props.usePrivate?"#":"", methodInput , " (", paramInput, ") {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= SUPER ================= */
        case "super": {
            const line = document.createElement("div")
            const paramInput = createInput(node, "parameters", el, true)
            line.append(node.type, " (", paramInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= NEW ================= */
        case "new": {
            const line = document.createElement("div")
            const classNameInput = createInput(node, "classname", el, true)
            const paramInput = createInput(node, "parameters", el, true)
            line.append("new ", classNameInput , " (", paramInput, ")")
            el.appendChild(line)
            break
        }
        /* ================= PROPERTY ================= */
        case "property": {
            const line = document.createElement("div")
            const name = createInput(node, "name", el)
            const options = document.createElement("div")
            options.appendChild(createCheckbox(node, "useStatic", "Static", el))
            options.appendChild(createCheckbox(node, "usePrivate", "Private", el))
            options.appendChild(createCheckbox(node, "useGetterSetter", "Accessors", el))
            el.appendChild(options)
            line.append(node.props.useStatic?"static ":"", node.props.usePrivate?"#":"", name, " = ", renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= SWITCH ================= */
        case "switch": {
            const line = document.createElement("div")
            const varname = createInput(node, "varname", el)
            line.append("switch on ", varname, " {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= CASE ================= */
        case "case": {
            const line = document.createElement("div")
            const varvalue = createInput(node, "varvalue", el)
            line.append("in case ", varvalue, ": {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= DEFAULT ================= */
        case "default": {
            const line = document.createElement("div")
            line.append("by default: {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            el.appendChild(closingBracket())
            break
        }
        /* ================= EVENT LISTENER ================= */
        case "listener": {
            const line = document.createElement("div")
            const eventInput = createSelect(node, "event", EVENTS, el)
            line.append("addEventListener(", eventInput, ", (event) => {")
            el.appendChild(line)
            el.appendChild(renderSlot(node, "body"))
            const close = document.createElement("div")
            close.innerText = "})"
            el.appendChild(close)
            break
        }
        /* ================= DOC_SELECTOR ================= */
        case "doc_selector": {
            const options = document.createElement("div")
            const line = document.createElement("div")
            const selectorSelect = createSelect(node, "selectorType", DOC_SELECTORS, el)
            options.append("Selector: ", selectorSelect)
            el.appendChild(options)

            const targetInput = createInput(node, "target", el)
            if (node.props.selectorType === "id")
                targetInput.placeholder = "id"
            if (node.props.selectorType === "class")
                targetInput.placeholder = "class"
            if (node.props.selectorType === "tag")
                targetInput.placeholder = "tag"
            if (node.props.selectorType === "query" || node.props.selectorType === "queryall")
                targetInput.placeholder = ".class, #id, div > span"

            line.append("on document, ")
            if (node.props.selectorType === "id")
                line.append("get element by id(")
            if (node.props.selectorType === "class")
                line.append("get element by class(")
            if (node.props.selectorType === "tag")
                line.append("get element by tag(")
            if (node.props.selectorType === "query")
                line.append("get element by query(")
            if (node.props.selectorType === "queryall")
                line.append("get element by queryall(")
            line.append(targetInput, ").")
            line.append(renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= EL_SELECTOR ================= */
        case "el_selector": {
            const options = document.createElement("div")
            const line = document.createElement("div")
            const selectorSelect = createSelect(node, "selectorType", EL_SELECTORS, el)
            options.append("Selector: ", selectorSelect)
            el.appendChild(options)

            const targetInput = createInput(node, "target", el)
            if (node.props.selectorType === "id")
                targetInput.placeholder = "id"
            if (node.props.selectorType === "class")
                targetInput.placeholder = "class"
            if (node.props.selectorType === "tag")
                targetInput.placeholder = "tag"
            if (node.props.selectorType === "query" || node.props.selectorType === "queryall")
                targetInput.placeholder = ".class, #id, div > span"

            const elementInput = createInput(node, "element", el)
            line.append("on element ", elementInput)
            if (node.props.selectorType !== "nosel") {
                line.append(", ")
                if (node.props.selectorType === "class")
                    line.append("get element by class(")
                if (node.props.selectorType === "tag")
                    line.append("get element by tag(")
                if (node.props.selectorType === "query")
                    line.append("get element by query(")
                if (node.props.selectorType === "queryall")
                    line.append("get element by queryall(")
                line.append(targetInput, ").")
            } else {
                line.append(".")
            }
            line.append(renderSlot(node, "body"))
            el.appendChild(line)
            break
        }
        /* ================= DOCUMENT, WINDOW ================= */
        case "window": {
            const line = document.createElement("div")
            if (node.type !== "element")
                line.append(`on ${node.type} get `, renderSlot(node, "body"))
            else {
                const elementInput = createInput(node, "elementName", el)
                line.append("on element ", elementInput, " get ", renderSlot(node, "body"))
            }
            el.appendChild(line)
            break
        }
        /* ================= DOMproperty ================= */
        case "DOMproperty": {
            const line = document.createElement("div")
            const selectorSelect = createSelect(node, "property", PROPERTIES, el)
            line.append(selectorSelect)
            el.appendChild(line)
            break
        }
        /* ================= DOMobject ================= */
        case "DOMobject": {
            const line = document.createElement("div")
            const selectorSelect = createSelect(node, "property", OBJECTS, el)
            const subpropertyInput = createInput(node, "subproperty", el)
            line.append(selectorSelect, " . ", subpropertyInput)
            el.appendChild(line)
            break
        }
        /* ================= DOMcollectionIndexed ================= */
        case "DOMcollectionIndexed": {
            const line = document.createElement("div")
            const collectionSelect = createSelect(node, "collectionName", COLLECTIONS, el)
            const subpropertyInput = createInput(node, "subproperty", el)
            line.append(collectionSelect, " [", renderSlot(node, "index"), "]")
            el.appendChild(line)
            break
        }
        /* ================= DOMcollectionProperty ================= */
        case "DOMcollectionProperty": {
            const line = document.createElement("div")
            el.appendChild(createCheckbox(node, "hasCollection", "Apply to collection", el))
            const collectionSelect = createSelect(node, "collectionName", COLLECTIONS, el)
            const propertySelect = createSelect(node, "property", PROPERTIES, el)
            if (node.props.hasCollection) {
                line.append(collectionSelect, " . ", propertySelect)
            } else {
                line.append(renderSlot(node, "body"), " . ", propertySelect)
            }
            el.appendChild(line)
            break
        }
        /* ================= DOMcommand ================= */
        case "DOMcommand": {
            const line = document.createElement("div")
            const propertySelect = createSelect(node, "propertyName", COMMANDS, el)
            line.append(propertySelect, " . ", renderSlot(node, "command"))
            el.appendChild(line)
            break
        }

        /* ================= REDUCE(ARROW, INPUT(initialvalue)) ================= */
        /* ================= SLICE(INPUT(start), INPUT(end)) ================= */
        /* ================= SORT(INPUT(comparefct)) ================= */
        /* ================= SPLICE(INPUT(start), INPUT(deletecount), INPUT(itemtoadd)) ================= */
        /* ================= WITH(INPUT(index), INPUT(value)) ================= */
        /* ================= AT(INPUT(index)) ================= */
        /* ================= CONCAT(INPUT(values)) ================= */
        /* ================= FILL(INPUT(value), INPUT(start), INPUT(end)) ================= */
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
    const layout = typeof node.slotLayout === "string"? node.slotLayout: node.slotLayout[slotName];
    slotEl.className = layout

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
        if (!isNodeAllowedInNode(node, draggedNode.type, slotName)) {
            alert(`${draggedNode.type} est interdit dans le slot ${slotName} de ${node.type}`)
            render()
            resetDrag()
            return
        }
        if (!isNodeCountAllowedInParent(node, slotName)) {
            alert("Ce slot est complet")
            render()
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
