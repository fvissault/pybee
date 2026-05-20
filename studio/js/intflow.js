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


/*==================================================================================
 * Définition des objets de la palette
 *==================================================================================*/
const NODE_DEFS = {
    function: {
        props: { name: "newFunction", parameters: "parameters" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    call: {
        props: { name: "functionName", parameters: "parameters" },
        slots: []
    },
    listener: {
        props: { selectorType: "id", target: "objectId", event: "click" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    log: {
        props: { message: "message" },
        slots: []
    },
    warn: {
        props: { message: "message" },
        slots: []
    },
    error: {
        props: { message: "message" },
        slots: []
    },
    for: {
        props: { varName: "i", from: 0, to: 10 },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    forin: {
        props: { varName: "varName", object: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    forof: {
        props: { varName: "varName", object: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    foreach: {
        props: { 
            array: "items", useIndex: false, useArray: false, arrayName: "array", useThisArg: false, thisArg: "object" 
        },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    while: {
        props: { condition: "condition" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    dowhile: {
        props: { condition: "condition" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    break: {
        props: {},
        slots: []
    },
    continue: {
        props: {},
        slots: []
    },
    if: {
        props: { condition: "condition" },
        slots: ["then"],
        slotLayout:"slot-block"
    },
    ifelse: {
        props: { condition: "condition" },
        slots: ["then", "else"],
        slotLayout:"slot-block"
    },
    return: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    let: {
        props: { name: "varName" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    assign: {
        props: { name: "varName" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    const: {
        props: { name: "constName" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    objbyid: {
        props: { name: "constName", id: "objectId" },
        slots: []
    },
    await: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    async: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-block"
    },
    literal: {
        props: { value: "value" },
        slots: []
    },
    add: {
        props: { op: "+", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    sub: {
        props: { op: "-", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    mul: {
        props: { op: "*", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    div: {
        props: { op: "/", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    and: {
        props: { op: "&&", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    or: {
        props: { op: "||", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    try: {
        props: { hasFinally: false },
        slots: ["body", "catch-body", "finally-body"],
        slotLayout:"slot-block"
    }
}

const RULES = {
  foreach: {
    forbidden: ["break"]
  }
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
        slotLayout: def.slotLayout?def.slotLayout:""
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

function createCheckbox(node, key, label, el){
    const wrapper = document.createElement("label")
    wrapper.style.marginRight = "10px"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = node.props[key] ?? false

    checkbox.onchange = (e)=>{
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
    } else if (dragSource === "workspace") {
        const oldIndex = draggedFrom.indexOf(draggedNode)
        removeNodeFromParent()
        if(draggedFrom === parentArray && oldIndex < index){
            index--
        }

        if(oldIndex !== -1){
            draggedFrom.splice(oldIndex, 1)
        }
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
    input.placeholder = node.props[key] ?? ""
    input.style.width = "200px"
    input.type = "text"
    input.dataset.key = key
    input.oninput = (e) => {
        node.props[key] = e.target.value
        if (refresh) preserveFocusAndRefresh(el, key, e.target.selectionStart)

        window.opener.savebtn.className = "tosave"
        window.opener.setToSave(true)
    }
    return input
}

function isNodeAllowedInParent(parentNode, childType){
  const rules = RULES[parentNode.type]

  if(!rules) return true

  if(rules.forbidden?.includes(childType)){
    return false
  }

  return true
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

/*==================================================================================
 * Initialisation de l'ide
 *==================================================================================*/
//init()