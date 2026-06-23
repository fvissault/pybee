/*==================================================================================
 * Variables globales
 *==================================================================================*/
let draggedNode = null
let draggedFrom = null
let dragSource = null
let tosave = false
let tree = []
const workspaceEl = document.getElementById("workspace")

/*==================================================================================
 * Initialisation de la page
 *==================================================================================*/
function init(){
    const opener = window.opener
    if(opener && opener.getWorkspace){
        const ws = opener.getWorkspace()
        tree = ws.js || []
    }
    
    renderPalette("palette_container")
    render()
}



function isNodeAllowedInNode(parentNode, childType, targetSlotName) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    for (slot in NODE_DEFS[parentNode.type].slots) {
        let slotname = NODE_DEFS[parentNode.type].slots[slot]
        const allowed = rules[slotname].allowed ?? ["all"];
        const forbidden = rules[slotname].forbidden ?? [];
        if (targetSlotName == slotname) {
            if (forbidden.includes("all")) {
                if (!allowed.includes("all")) {
                    if (!allowed.includes(childType)) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false;
                }
            } else {
                if (!forbidden.includes(childType)) return true
            }
        }
    }
    return false
}

function isNodeAllowedInParent(parentNode, childType) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    for (slot in NODE_DEFS[parentNode.type].slots) {
        let slotname = NODE_DEFS[parentNode.type].slots[slot]
        const allowed = rules[slotname].allowed ?? ["all"];
        const forbidden = rules[slotname].forbidden ?? [];
        if (forbidden.includes("all")) {
            if (!allowed.includes("all")) {
                if (!allowed.includes(childType)) {
                    return false
                } else {
                    return true
                }
            } else {
                return false;
            }
        } else {
            if (forbidden.includes(childType)) return false
        }
    }
    return false
}

function isNodeCountAllowedInParent(parentNode, slotName) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    const node_allowed = rules[slotName].node_allowed ?? 0;
    if (parentNode.slots[slotName] && parentNode.slots[slotName].length < node_allowed) {
        return true
    } else {
        return false
    }
}

function isNodeCountAllowedInParentArray(parentNode, parentArray) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    for (slot in NODE_DEFS[parentNode.type].slots) {
        let slotname = NODE_DEFS[parentNode.type].slots[slot]
        const node_allowed = rules[slotname].node_allowed ?? 0;
        if (parentNode.slots[slotname].length === node_allowed) {
            return true
        }
    }
    return false
}

function resetDrag(){
  draggedNode = null
  draggedFrom = null
  dragSource = null
}

function handlePaletteDrag(e, type){
    e.stopPropagation()
    draggedNode = createNode(type)
    draggedFrom = null
    dragSource = "palette"
}

function addRootNode(type){
    tree.push(createNode(type))
    render()
}

function findParentArray(arr, target){
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === target){
        return arr
        }
        const node = arr[i]
        if(node.slots){
            for(const slot in node.slots){
                const res = findParentArray(node.slots[slot], target)
                if(res) return res
            }
        }
    }
    return null
}

function findParentNode(nodes, targetNode, parent = null) {
    for (const node of nodes) {

        if (node === targetNode) {
            return parent
        }

        // Parcourt récursif des propriétés contenant des enfants
        if (node.slots) {
            for (const slotName in node.slots) {
                const slot = node.slots[slotName]

                if (Array.isArray(slot)) {
                    const found = findParentNode(slot, targetNode, node)
                    if (found) return found
                }
            }
        }
    }

    return null
}

/* =========================
   STATE
========================= */
workspaceEl.ondragover = (e)=>{
    e.preventDefault()
}

workspaceEl.ondrop = (e)=>{
    //console.log("workspaceEl.ondrop", { draggedNode, draggedFrom, dragSource })
    e.preventDefault()

    if(!draggedNode) return

    // éviter duplication racine
    if(dragSource === "workspace" && draggedFrom === tree){
        resetDrag()
        return
    }

    removeNodeFromParent()

    tree.push(draggedNode)

    window.opener.savebtn.className = "tosave"
    window.opener.setToSave(true)

    resetDrag()
    render()
}

/* =========================
   NODE FACTORY
========================= */
function generateId(type){
    return type + "-" + crypto.randomUUID()
}

function createNode(type){
    const def = NODE_DEFS[type]
    
    return {
        id: generateId(type),
        type,
        props: structuredClone(def.props),
        slots: Object.fromEntries(def.slots.map(s => [s, []])),
        slotLayout: def.slotLayout?def.slotLayout:"",
        ui: { collapsed : true }
    }
}

function removeNodeFromParent(){
    if(dragSource !== "workspace") return

    const index = draggedFrom.indexOf(draggedNode)
    if(index !== -1){
        draggedFrom.splice(index, 1)

        window.opener.savebtn.className = "tosave"
        window.opener.setToSave(true)
    }
}

function createCheckbox(node, key, label, el) {
    const wrapper = document.createElement("label")
    wrapper.style.marginRight = "5px"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = node.props[key] ?? false

    checkbox.onchange = (e) => {
        node.props[key] = e.target.checked
        refreshNode(el)
    }

    wrapper.appendChild(checkbox)
    wrapper.append(" " + label)

    return wrapper
}

function createSelect(node, key, options, el){
    const select = document.createElement("select")

    options.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        select.appendChild(o)
    })
    select.value = node.props[key] ?? options[0].value

    select.onchange = (e)=>{
        node.props[key] = e.target.value
        refreshNode(el)
    }

    return select
}

function handleDropAtPosition(targetNode, position){

    if(!draggedNode) return

    const parentArray = findParentArray(tree, targetNode)
    if(!parentArray) return
    const parentNode = findParentNode(tree, targetNode)

    let index = parentArray.indexOf(targetNode)

    if(dragSource === "workspace" && draggedFrom === parentArray){
        const oldIndex = draggedFrom.indexOf(draggedNode)
        const newIndex = parentArray.indexOf(targetNode)

        if(draggedNode === targetNode){
            resetDrag()
            return
        }

        if(oldIndex !== -1){
            draggedFrom.splice(oldIndex, 1)

            if(oldIndex < index){
                index--
            }
        }
    }

    if (!isNodeAllowedInParent(parentNode, draggedNode.type)) {
        alert(`${draggedNode.type} est interdit dans ${parentNode?.type ?? "root"}`)
        render()
        resetDrag()
        return
    }

    if (isNodeCountAllowedInParentArray(parentNode, parentArray)) {
        alert("Ce slot est complet")
        render()
        resetDrag()
        return
    }
    
    const insertIndex = position === "before" ? index : index + 1

    parentArray.splice(insertIndex, 0, draggedNode)

    window.opener.savebtn.className = "tosave"
    window.opener.setToSave(true)

    resetDrag()
    render()
}

function refreshNode(el){
    const parent = el.parentNode
    const newEl = renderNode(el._node)
    parent.replaceChild(newEl, el)
}

function preserveFocusAndRefresh(el, key, cursorPos){
    const parent = el.parentNode
    const node = el._node
    const newEl = renderNode(node)
    parent.replaceChild(newEl, el)
    // retrouver l'input correspondant
    const inputs = newEl.querySelectorAll("input")
    inputs.forEach(input => {
        if(input.dataset.key === key){
            input.focus()
            if(cursorPos != null) input.setSelectionRange(cursorPos, cursorPos)
        }
    })
}

function createInput(node, key, el, refresh = false){
    const input = document.createElement("input")
    if (node.props[key] === "") {
        input.placeholder = key ?? ""
    } else {
        input.value = node.props[key]
    }
    let vallength = input.value.length
    if (vallength > 0) {
        input.style.width = `${vallength * 8 + 10}px`
    } else {
        input.style.width = "100px"
    }
    input.type = "text"
    input.dataset.key = key
    input.draggable = false
    input.addEventListener("pointerdown", (e) => {
        let el = input
        while (el) {
            if (el.classList?.contains("node")) {
                el.draggable = false
            }
            el = el.parentElement
        }
    }, true)
    input.addEventListener("blur", () => {
        restoreDraggable(document.getElementById("workspace"))
    })
    input.oninput = (e) => {
        node.props[key] = e.target.value
        let vallength = input.value.length
        if (vallength > 0) {
            input.style.width = `${vallength * 8 + 10}px`
        } else {
            input.placeholder = key ?? ""
            input.style.width = "100px"
        }
        if (refresh) preserveFocusAndRefresh(el, key, e.target.selectionStart)

        window.opener.savebtn.className = "tosave"
        window.opener.setToSave(true)
    }
    return input
}

function restoreDraggable(root) {
    root.querySelectorAll(".node").forEach(n => {
        if (n.draggable === false) n.draggable = true
    })
}
/*==================================================================================
 * DROP ON TRASH
 *==================================================================================*/
const trash = document.getElementById("trash")
trash.ondragover = e => e.preventDefault()
trash.ondrop = ()=>{
    removeNodeFromParent()
    resetDrag()
    render()
}
