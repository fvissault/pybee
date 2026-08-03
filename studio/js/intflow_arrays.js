/*==================================================================================
 * Définition des objets de la palette
 *==================================================================================*/
const NODE_DEFS = {
    function: {
        props: { name: "", parameters: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    call: {
        props: { name: "", parameters: "" },
        slots: []
    },
    listener: {
        props: { event: "click" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    log: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    warn: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    error: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    for: {
        props: { varName: "", from: 0, to: 10 },
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
    forin: {
        props: { object: "", variable: "" },
        slots: ["body"],
        slotLayout: "slot-block"
    },
    forof: {
        props: { array: "", variable: "" },
        slots: ["body"],
        slotLayout: "slot-block"
    },
    while: {
        props: {},
        slots: ["condition", "body"],
        slotLayout: {
            condition: "slot-inline",
            body: "slot-block"
        }
    },
    dowhile: {
        props: {},
        slots: ["condition", "body"],
        slotLayout: {
            condition: "slot-inline",
            body: "slot-block"
        }
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
        props: {},
        slots: ["condition", "then"],
        slotLayout: {
            condition: "slot-inline",
            then: "slot-block"
        }
    },
    ifelse: {
        props: {},
        slots: ["condition", "then", "else"],
        slotLayout: {
            condition: "slot-inline",
            then: "slot-block",
            else: "slot-block"
        }
    },
    return: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    let: {
        props: { name: "" },
        slots: []
    },
    assign: {
        props: {  op: "=", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    const: {
        props: { name: "" },
        slots: []
    },
    await: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    async: {
        props: { name: "", parameters: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    literal: {
        props: { value: "" },
        slots: []
    },
    add: {
        props: { op: " + ", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    sub: {
        props: { op: " - ", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    mul: {
        props: { op: " * ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    div: {
        props: { op: " / ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    and: {
        props: { op: " && ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    or: {
        props: { op: " || ", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    not: {
        props: { op: "!", parenthesis: false },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    equals: {
        props: { op: " === ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    notequals: {
        props: { op: " !== ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    equal: {
        props: { op: " == ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    notequal: {
        props: { op: " != ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    inf: {
        props: { op: " < ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    infequal: {
        props: { op: " <= ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    sup: {
        props: { op: " > ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    supequal: {
        props: { op: " >= ", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    try: {
        props: { hasFinally: false },
        slots: ["body", "catch_body", "finally_body"],
        slotLayout:"slot-block"
    },
    arrow: { 
        props: { indexName: "", arrayName:"", useIndex: false, useArray: false },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    fetch: { 
        props: { url: "", hasFinally: false, hasCatch: false, slotsthencount: 0 },
        slots: ["options", "catch_body", "finally_body"],
        slotLayout:"slot-block"
    },
    object_create: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-block"
    },
    object_get: {
        props: { arrayName: "", key: ""},
        slots: []
    },
    object_set: {
        props: { key: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    array_create: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-block"
    },
    chain: { 
        props: { arrayname: "", dotslotcount: 0 },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    join: { 
        props: { separator: "" },
        slots: []
    },
    split: { 
        props: { separator: "" },
        slots: []
    },
    map: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    flatmap: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    filter: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    flat: { 
        props: { depth: 1 },
        slots: []
    },
    find: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    findindex: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    findlast: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    some: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    every: { 
        props: { useThisArg: false, thisArg: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    pop: { 
        props: {},
        slots: []
    },
    shift: { 
        props: {},
        slots: []
    },
    reverse: { 
        props: {},
        slots: []
    },
    keys: { 
        props: { object: "" },
        slots: []
    },
    values: { 
        props: { object: "" },
        slots: []
    },
    entries: { 
        props: { object: "" },
        slots: []
    },
    includes: { 
        props: { search: "", useFrom: false, from: "0" },
        slots: []
    },
    indexof: { 
        props: { search: "", useFrom: false, from: "0" },
        slots: []
    },
    lastindexof: { 
        props: { search: "", useFrom: false, from: "0" },
        slots: []
    },
    push: { 
        props: { element: "", inputcount: 0 },
        slots: []
    },
    unshift: { 
        props: { element: "", inputcount: 0 },
        slots: []
    },
    concat: { 
        props: { element: "", inputcount: 0 },
        slots: []
    },
    class: { 
        props: { classname: "", useExtends: "", extends: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    constructor: { 
        props: { parameters: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    method: { 
        props: { methodname: "", parameters: "", useStatic: false, usePrivate: false, useAsync: false },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    new: { 
        props: { classname: "", parameters: "" },
        slots: []
    },
    super: { 
        props: { parameters: "" },
        slots: []
    },
    property: {
        props: { name: "", useStatic: "", usePrivate: "", useGetterSetter: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    switch: {
        props: { varname: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    case: {
        props: { varvalue: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    default: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-block"
    },
    doc_selector: {
        props: { selectorType: "id", target: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    el_selector: {
        props: { element: "", selectorType: "query", target: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    Window: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    WINproperty: {
        props: { property: "location" },
        slots: []
    },
    WINmethod: {
        props: { method: "open", parameters: "" },
        slots: []
    },
    DOMproperty: {
        props: { property: "id" },
        slots: []
    },
    DOMobject: {
        props: { property: "style", subproperty: "" },
        slots: []
    },
    DOMcollectionProperty: {
        props: { hasCollection: true, collectionName: "options", property: "value" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    DOMcollectionIndexed: {
        props: { collectionName: "children" },
        slots: ["index"],
        slotLayout:"slot-inline"
    },
    DOMcommand: {
        props: { propertyname: "" },
        slots: ["command"],
        slotLayout:"slot-inline"
    },
    DOMmethod: {
        props: { method: "append", parameters: "" },
        slots: []
    }
}

const statements = ["log", "warn", "error", "for", "forin", "forof", "foreach", "while", "dowhile", "if", "ifelse", "return", "let", "assign", "const", "switch"]
const operators = ["add", "sub", "mul", "div"]
const logicals = ["and", "or", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"]
const transformers = ["join", "split", "map", "flatmap", "filter", "flat", "find", "findndex", "findlast", "some", "every", "pop", "shift", "reverse", "entries", "includes", "indexof", "lastindexof", "push", "unshift", "concat"]
const decomposers = ["keys", "values"]
const classes = ["constructor", "method", "property"]
const switchcases = ["case", "default"]
const DOMselector = ["doc_selector", "el_selector"]
const DOMexpr = ["listener", "DOMproperty", "DOMobject", "DOMcollectionProperty", "DOMcollectionIndexed", "DOMcommand", "DOMmethod"]

const FAMILIES = {
    statements: statements,
    operators: operators,
    logicals: logicals,
    transformers: transformers,
    classes: classes,
    switchcases: switchcases,
    DOMselector: DOMselector,
    DOMexpr: DOMexpr,
    decomposers: decomposers
};

function computeNodesAllowedRules() {
    for (const node in RULES) {
        for (const slot in RULES[node]) {
            const a = RULES[node][slot].allowed;
            if (Array.isArray(a)) continue;
            const allowed = [];
            for (const token of a.split("+")) {
                if (token.startsWith("@")) {
                    const family = token.substring(1);
                    if (FAMILIES[family]) {
                        allowed.push(...FAMILIES[family]);
                    } else {
                        console.warn(`Famille inconnue : ${family}`);
                    }
                } else {
                    allowed.push(token);
                }
            }
            // Suppression des doublons
            RULES[node][slot].allowed = [...new Set(allowed)];
        }
    }
}
/*==================================================================================
 * Règles d'ajout entre les nodes
 *==================================================================================*/
const RULES = {
    function: {
        body: {
            allowed: "function+async+call+@statements+try+fetch+new+@DOMselector",
            node_allowed: Infinity
        }
    },
    async: {
        body: {
            allowed: "function+async+call+@statements+try+fetch+new+@DOMselector+await",
            node_allowed: Infinity
        }
    },
    return: {
        body: {
            allowed: "@operators+@logicals+literal+@decomposers+@DOMselector+call",
            node_allowed: 1
        }
    },
    assign: {
        left: {
           allowed: "literal+const+let+@DOMexpr+@DOMselector",
            node_allowed: 1
        },
        right: {
            allowed: "Window+array_create+object_get+literal+@decomposers+@operators+call+async+arrow+@DOMselector+@logicals+new+chain+DOMcollectionProperty+await",
            node_allowed: 1
        }
    },
    foreach: {
        body: {
            allowed: "call+@statements+continue+try+fetch+new+@DOMselector",
            node_allowed: Infinity
        }
    },
    forin: {
        body: {
            allowed: "call+@statements+continue+try+fetch+new+@DOMselector",
            node_allowed: Infinity
        }
    },
    forof: {
        body: {
            allowed: "call+@statements+continue+try+fetch+new+@DOMselector",
            node_allowed: Infinity
        }
    },
    object_create: {
        body: {
            allowed: ["object_set"],
            node_allowed: Infinity
        }
    },
    object_set: {
        body: {
            allowed: "object_get+call+literal+@operators+object_create+array_create+new+@DOMexpr",
            node_allowed: 1
        }
    },
    array_create: {
        body: {
            allowed: "object_get+call+literal+@operators+object_create+object_set+array_create+chain+new+@DOMexpr",
            node_allowed: Infinity
        }
    },
    chain: {
        body: {
            allowed: "call+@transformers",
            node_allowed: 1
        }
    },
    map: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    flatmap: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    filter: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    find: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    findindex: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    findlast: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    some: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    every: {
        body: {
            allowed: ["arrow"],
            node_allowed: 1
        }
    },
    if: {
        condition: {
            allowed: "call+literal+@logicals",
            node_allowed: 1
        },
        then: {
            allowed: "function+async+call+@statements+try+fetch+new",
            node_allowed: Infinity
        }
    },
    ifelse: {
        condition: {
            allowed: "call+literal+@logicals",
            node_allowed: 1
        },
        then: {
            allowed: "function+async+call+@statements+try+fetch+new",
            node_allowed: Infinity
        },
        else: {
            allowed: "function+async+call+@statements+try+fetch+new",
            node_allowed: Infinity
        }
    },
    and: {
        left: {
           allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    or: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    not: {
        body: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    equals: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    equal: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    notequals: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    notequal: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    inf: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    infequal: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    sup: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    supequal: {
        left: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal+call",
            node_allowed: 1
        }
    },
    add: {
        left: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        },
        right: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        }
    },
    sub: {
        left: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        },
        right: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        }
    },
    mul: {
        left: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        },
        right: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        }
    },
    div: {
        left: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        },
        right: {
            allowed: "call+literal+@operators",
            node_allowed: 1
        }
    },
    class: {
        body: {
            allowed: "@classes",
            node_allowed: Infinity
        }
    },
    constructor: {
        body: {
            allowed: "call+@statements+await+try+fetch+new+super",
            node_allowed: Infinity
        }
    },
    method: {
        body: {
            allowed: "call+@statements+await+try+fetch+new",
            node_allowed: Infinity
        }
    },
    property: {
        body: {
            allowed: "call+literal+@operators+arrow+object_create+array_create+chain+new+@DOMexpr",
            node_allowed: 1
        }
    },
    switch: {
        body: {
            allowed: "@switchcases",
            node_allowed: Infinity
        }
    },
    case: {
        body: {
            allowed: "call+@statements+break+await+try+fetch+new",
            node_allowed: Infinity
        }
    },
    default: {
        body: {
            allowed: "call+@statements+break+await+try+fetch+new",
            node_allowed: Infinity
        }
    },
    log: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@DOMexpr",
            node_allowed: 1
        }
    },
    warn: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@DOMexpr",
            node_allowed: 1
        }
    },
    error: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@DOMexpr",
            node_allowed: 1
        }
    },
    doc_selector: {
        body: {
            allowed: "call+@DOMexpr",
            node_allowed: 1
        }
    },
    el_selector: {
        body: {
            allowed: "call+@DOMexpr",
            node_allowed: 1
        }
    },
    Window: {
        body: {
            allowed: "WINproperty+WINmethod+fetch",
            node_allowed: 1
        }
    },
    DOMcollectionIndexed: {
        index: {
            allowed: "literal+@DOMselector+DOMproperty",
            node_allowed: 1
        }
    },
    DOMcommand: {
        command: {
            allowed: "call",
            node_allowed: 1
        }
    },
    DOMcollectionProperty: {
        body: {
            allowed: "@DOMselector",
            node_allowed: 1
        }
    }
}

function isNodeAllowedInNode(parentNode, childType, targetSlotName) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    for (slot in parentNode.slots) {
        const allowed = rules[slot].allowed ?? ["all"];
        if (targetSlotName == slot) {
            if (allowed.includes(childType)) {
                return true
            } else {
                return false
            }
        }
    }
    // si pas trouvé, alors pas autorisé
    return false
}

function isNodeAllowedInParent(parentNode, childType) {
    const rules = RULES[parentNode.type];
    if (!rules) return true;
    for (slot in parentNode.slots) {
        const allowed = rules[slot].allowed ?? ["all"];
        if (allowed.includes(childType)) {
            return true
        } else {
            return false
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
            { type: "case", label: "Case" },
            { type: "default", label: "Default" },
            { type: "for", label: "For loop" },
            { type: "forin", label: "Forin loop (object)" },
            { type: "forof", label: "Forof loop (array)" },
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
            { type: "assign", label: "Assign (=)" },
            { type: "chain", label: "Chain (.)" },
            { type: "literal", label: "Literal" }
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
            { type: "equal", label: "==" },
            { type: "notequals", label: "!==" },
            { type: "notequal", label: "!=" },
            { type: "sup", label: ">" },
            { type: "supequal", label: ">=" },
            { type: "inf", label: "<" },
            { type: "infequal", label: "<=" },
            { type: "and", label: "&&" },
            { type: "or", label: "||" },
            { type: "not", label: "!" }
        ]
    },
    {
        category: "Arrays",
        items: [
            { type: "array_create", label: "Array []" },
            { type: "array_get", label: "Array get" },
            { type: "join", label: "Join" },
            { type: "split", label: "Split" },
            { type: "map", label: "Map" },
            { type: "filter", label: "Filter" },
            { type: "flat", label: "Flat" },
            { type: "flatmap", label: "Flat map" },
            { type: "find", label: "Find" },
            { type: "findindex", label: "Find index" },
            { type: "findlast", label: "Find last" },
            { type: "some", label: "Some" },
            { type: "every", label: "Every" },
            { type: "pop", label: "Pop" },
            { type: "shift", label: "Shift" },
            { type: "keys", label: "Keys" },
            { type: "values", label: "Values" },
            { type: "entries", label: "Entries" },
            { type: "reverse", label: "Reverse" },
            { type: "includes", label: "Includes" },
            { type: "indexof", label: "indexOf" },
            { type: "lastindexof", label: "lastIndexOf" },
            { type: "push", label: "Push" },
            { type: "unshift", label: "Unshift" },
            { type: "concat", label: "Concat" }
        ]
    },
    {
        category: "Objects",
        items: [
            { type: "object_create", label: "Object {}" },
            { type: "object_get", label: "Object get" },
            { type: "object_set", label: "Object set" },
            { type: "object_keys", label: "Keys" },
            { type: "object_values", label: "Values" },
            { type: "object_entries", label: "Entries" },
        ]
    },
    {
        category: "Classes",
        items: [
            { type: "class", label: "Class" },
            { type: "property", label: "Property" },
            { type: "constructor", label: "Constructor" },
            { type: "method", label: "Method" },
            { type: "super", label: "Super" },
            { type: "new", label: "New" }
        ]
    },
    {
        category: "Async",
        items: [
            { type: "async", label: "Async function" },
            { type: "await", label: "Await" },
            { type: "try", label: "Try" },
            { type: "fetch", label: "Fetch" }
        ]
    },
    {
        category: "DOM",
        items: [
            { type: "Window", label: "Window" },
            { type: "WINproperty", label: "Window property" },
            { type: "WINmethod", label: "Window method" },
            { type: "doc_selector", label: "Document selector" },
            { type: "el_selector", label: "Element selector" },
            { type: "listener", label: "Event listener" },
            { type: "DOMproperty", label: "DOM Property" },
            { type: "DOMobject", label: "DOM Object" },
            { type: "DOMcollectionProperty", label: "DOM collection property" },
            { type: "DOMcollectionIndexed", label: "DOM collection indexed" },
            { type: "DOMcommand", label: "DOM Command" },
            { type: "DOMmethod", label: "DOM Method" }
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

const COLLAPSIBLE = new Set([
    "function", "async", "arrow", "fetch", "try", "if", "ifelse", "switch", "case", "default",
    "object_create", "array_create", "for", "forin", "forof", "foreach", "while", "dowhile",
    "chain", "map", "flatmap", "filter", "join", "split", "flat", "find", "findindex", "findlast", "some", "every", "includes", "indexof", "lastindexof", "push", "unshift", "concat",
    "class", "constructor", "method", "property", "log", "warn", "error", "listener", "doc_selector","el_selector"
])

/* ===================================================================================
 * Définition des selects utilisées dans Intflow
 */
const EVENTS = [
    { value: "click", label: "click"},
    { value: "dblclick", label: "dblclick"},
    { value: "input", label: "input"},
    { value: "change", label: "change"},
    { value: "focus", label: "focus"},
    { value: "focusin", label: "focusin"},
    { value: "focusout", label: "focusout"},
    { value: "blur", label: "blur"},
    { value: "mousedown", label: "mousedown"},
    { value: "mouseup", label: "mouseup"},
    { value: "mousemove", label: "mousemove"},
    { value: "mouseenter", label: "mouseenter"},
    { value: "mouseleave", label: "mouseleave"},
    { value: "mouseover", label: "mouseover"},
    { value: "mouseout", label: "mouseout"},
    { value: "contextmenu", label: "contextmenu"},
    { value: "wheel", label: "wheel"},
    { value: "keydown", label: "keydown"},
    { value: "keyup", label: "keyup"},
    { value: "submit", label: "submit"},
    { value: "reset", label: "reset"},
    { value: "invalid", label: "invalid"},
    { value: "beforeinput", label: "beforeinput"},
    { value: "copy", label: "copy"},
    { value: "cut", label: "cut"},
    { value: "paste", label: "paste"},
    { value: "pointerdown", label: "pointerdown"},
    { value: "pointerup", label: "pointerup"},
    { value: "pointermove", label: "pointermove"},
    { value: "pointerenter", label: "pointerenter"},
    { value: "pointerleave", label: "pointerleave"},
    { value: "pointerover", label: "pointerover"},
    { value: "pointerout", label: "pointerout"},
    { value: "pointercancel", label: "pointercancel"},
    { value: "touchstart", label: "touchstart"},
    { value: "touchmove", label: "touchmove"},
    { value: "touchend", label: "touchend"},
    { value: "touchcancel", label: "touchcancel"},
    { value: "beforeunload", label: "beforeunload"},
    { value: "unload", label: "unload"},
    { value: "hashchange", label: "hashchange"},
    { value: "popstate", label: "popstate"},
    { value: "online", label: "online"},
    { value: "offline", label: "offline"},
    { value: "dragstart", label: "dragstart"},
    { value: "drag", label: "drag"},
    { value: "dragend", label: "dragend"},
    { value: "dragenter", label: "dragenter"},
    { value: "dragover", label: "dragover"},
    { value: "dragleave", label: "dragleave"},
    { value: "drop", label: "drop"},
    { value: "resize", label: "resize"},
    { value: "scroll", label: "scroll"},
    { value: "load", label: "load"},
    { value: "DOMContentLoaded", label: "DOMContentLoaded"}
]

const DOC_SELECTORS = [
    { value: "id", label: "getElementById" },
    { value: "name", label: "getElementsByName" },
    { value: "class", label: "getElementsByClassName" },
    { value: "tag", label: "getElementsByTagName" },
    { value: "query", label: "querySelector" },
    { value: "queryall", label: "querySelectorAll" }
]

const EL_SELECTORS = [
    { value: "nosel", label: "No selector" },
    { value: "class", label: "getElementsByClassName" },
    { value: "tag", label: "getElementsByTagName" },
    { value: "closest", label: "closest" },
    { value: "query", label: "querySelector" },
    { value: "queryall", label: "querySelectorAll" }
]

const PROPERTIES = [
    { value: "id", label: "id" },
    { value: "className", label: "className" },
    { value: "innerText", label: "innerText" },
    { value: "value", label: "value" },
    { value: "checked", label: "checked" },
    { value: "innerHTML", label: "innerHTML" },
    { value: "textContent", label: "textContent" },
    { value: "selected", label: "selected" },
    { value: "selectedIndex", label: "selectedIndex" },
    { value: "disabled", label: "disabled" },
    { value: "readOnly", label: "readOnly" },
    { value: "required", label: "required" },
    { value: "multiple", label: "multiple" },
    { value: "placeholder", label: "placeholder" },
    { value: "min", label: "min" },
    { value: "max", label: "max" },
    { value: "step", label: "step" },
    { value: "hidden", label: "hidden" },
    { value: "draggable", label: "draggable" },
    { value: "contentEditable", label: "contentEditable" },
    { value: "isContentEditable", label: "isContentEditable" },
    { value: "href", label: "href" },
    { value: "src", label: "src" },
    { value: "alt", label: "alt" },
    { value: "target", label: "target" },
    { value: "lang", label: "lang" },
    { value: "dir", label: "dir" },
    { value: "name", label: "name" },
    { value: "type", label: "type" },
    { value: "htmlFor", label: "htmlFor" },
    { value: "tabIndex", label: "tabIndex" },
    { value: "title", label: "title" },
    { value: "accessKey", label: "accessKey" },
    { value: "spellcheck", label: "spellcheck" },
    { value: "translate", label: "translate" },
    { value: "autofocus", label: "autofocus" },
    { value: "open", label: "open" },
    { value: "clientWidth", label: "clientWidth" },
    { value: "clientHeight", label: "clientHeight" },
    { value: "offsetWidth", label: "offsetWidth" },
    { value: "offsetHeight", label: "offsetHeight" },
    { value: "offsetTop", label: "offsetTop" },
    { value: "offsetLeft", label: "offsetLeft" },
    { value: "scrollWidth", label: "scrollWidth" },
    { value: "scrollHeight", label: "scrollHeight" },
    { value: "clientWidth", label: "clientWidth" },
    { value: "scrollTop", label: "scrollTop" },
    { value: "scrollLeft", label: "scrollLeft" }
]

const WINDOW_PROPERTIES = [
    { value: "caches", label: "caches" },
    { value: "clientInformation", label: "clientInformation" },
    { value: "closed", label: "closed" },
    { value: "cookieStore", label: "cookieStore" },
    { value: "crashReport", label: "crashReport" },
    { value: "credentialless", label: "credentialless" },
    { value: "crossOriginIsolated", label: "crossOriginIsolated" },
    { value: "crypto", label: "crypto" },
    { value: "customElements", label: "customElements" },
    { value: "devicePixelRatio", label: "devicePixelRatio" },
    { value: "document", label: "document" },
    { value: "documentPictureInPicture", label: "documentPictureInPicture" },
    { value: "fence", label: "fence" },
    { value: "frameElement", label: "frameElement" },
    { value: "frames", label: "frames" },
    { value: "fullScreen", label: "fullScreen" },
    { value: "history", label: "history" },
    { value: "indexedDB", label: "indexedDB" },
    { value: "innerHeight", label: "innerHeight" },
    { value: "innerWidth", label: "innerWidth" },
    { value: "isSecureContext", label: "isSecureContext" },
    { value: "launchQueue", label: "launchQueue" },
    { value: "length", label: "length" },
    { value: "localStorage", label: "localStorage" },
    { value: "location", label: "location" },
    { value: "locationbar", label: "locationbar" },
    { value: "menubar", label: "menubar" },
    { value: "mozInnerScreenX", label: "mozInnerScreenX" },
    { value: "mozInnerScreenY", label: "mozInnerScreenY" },
    { value: "name", label: "name" },
    { value: "navigation", label: "navigation" },
    { value: "navigator", label: "navigator" },
    { value: "origin", label: "origin" },
    { value: "originAgentCluster", label: "originAgentCluster" },
    { value: "outerHeight", label: "outerHeight" },
    { value: "pageXOffset", label: "pageXOffset" },
    { value: "pageYOffset", label: "pageYOffset" },
    { value: "parent", label: "parent" },
    { value: "performance", label: "performance" },
    { value: "scheduler", label: "scheduler" },
    { value: "screen", label: "screen" },
    { value: "screenX", label: "screenX" },
    { value: "screenY", label: "screenY" },
    { value: "scrollbars", label: "scrollbars" },
    { value: "scrollMaxX", label: "scrollMaxX" },
    { value: "scrollMaxY", label: "scrollMaxY" },
    { value: "scrollX", label: "scrollX" },
    { value: "scrollY", label: "scrollY" },
    { value: "self", label: "self" },
    { value: "sessionStorage", label: "sessionStorage" },
    { value: "sharedStorage", label: "sharedStorage" },
    { value: "speechSynthesis", label: "speechSynthesis" },
    { value: "statusbar", label: "statusbar" },
    { value: "toolbar", label: "toolbar" },
    { value: "top", label: "top" },
    { value: "trustedTypes", label: "trustedTypes" },
    { value: "viewport", label: "viewport" },
    { value: "visualViewport", label: "visualViewport" },
    { value: "window", label: "window" }
]

const WINDOW_METHODS = [
    { value: "atob", label: "atob" },
    { value: "alert", label: "alert" },
    { value: "blur", label: "blur" },
    { value: "btoa", label: "btoa" },
    { value: "cancelAnimationFrame", label: "cancelAnimationFrame" },
    { value: "cancelIdleCallback", label: "cancelIdleCallback" },
    { value: "clearInterval", label: "clearInterval" },
    { value: "clearTimeout", label: "clearTimeout" },
    { value: "close", label: "close" },
    { value: "confirm", label: "confirm" },
    { value: "createImageBitmap", label: "createImageBitmap" },
    { value: "dump", label: "dump" },
    { value: "find", label: "find" },
    { value: "focus", label: "focus" },
    { value: "getComputedStyle", label: "getComputedStyle" },
    { value: "getDefaultComputedStyle", label: "getDefaultComputedStyle" },
    { value: "getScreenDetails", label: "getScreenDetails" },
    { value: "getSelection", label: "getSelection" },
    { value: "matchMedia", label: "matchMedia" },
    { value: "moveBy", label: "moveBy" },
    { value: "moveTo", label: "moveTo" },
    { value: "open", label: "open" },
    { value: "postMessage", label: "postMessage" },
    { value: "print", label: "print" },
    { value: "prompt", label: "prompt" },
    { value: "queryLocalFonts", label: "queryLocalFonts" },
    { value: "queueMicrotask", label: "queueMicrotask" },
    { value: "reportError", label: "reportError" },
    { value: "requestAnimationFrame", label: "requestAnimationFrame" },
    { value: "requestIdleCallback", label: "requestIdleCallback" },
    { value: "requestResize", label: "requestResize" },
    { value: "resizeBy", label: "resizeBy" },
    { value: "resizeTo", label: "resizeTo" },
    { value: "scroll", label: "scroll" },
    { value: "scrollBy", label: "scrollBy" },
    { value: "scrollByLines", label: "scrollByLines" },
    { value: "scrollByPages", label: "scrollByPages" },
    { value: "scrollTo", label: "scrollTo" },
    { value: "setInterval", label: "setInterval" },
    { value: "setTimeout", label: "setTimeout" },
    { value: "showDirectoryPicker", label: "showDirectoryPicker" },
    { value: "showOpenFilePicker", label: "showOpenFilePicker" },
    { value: "showSaveFilePicker", label: "showSaveFilePicker" },
    { value: "sizeToContent", label: "sizeToContent" },
    { value: "stop", label: "stop" },
    { value: "structuredClone", label: "structuredClone" }
]

const OBJECTS = [
    { value: "style", label: "style" },
    { value: "dataset", label: "dataset" },
    { value: "document", label: "document" },
    { value: "history", label: "history" },
    { value: "navigator", label: "navigator" },
    { value: "screen", label: "screen" },
    { value: "location", label: "location" }
]

const COLLECTIONS = [
    { value: "children", label: "children" },
    { value: "childNodes", label: "childNodes" },
    { value: "attributes", label: "attributes" },
    { value: "files", label: "files" },
    { value: "options", label: "options" },
    { value: "forms", label: "forms" },
    { value: "images", label: "images" },
    { value: "links", label: "links" },
    { value: "scripts", label: "scripts" },
    { value: "styleSheets", label: "styleSheets" },
    { value: "elements", label: "elements" },
    { value: "selectedOptions", label: "selectedOptions" },
    { value: "labels", label: "labels" },
    { value: "rows", label: "rows" },
    { value: "cells", label: "cells" },
    { value: "tBodies", label: "tBodies" },
    { value: "tHead", label: "tHead" },
    { value: "tFoot", label: "tFoot" }
]

const COMMANDS = [
    { value: "classList", label: "classList" },
    { value: "relList", label: "relList" },
    { value: "part", label: "part" }
]

const METHODS = [
    { value: "closest", label: "closest" },
    { value: "matches", label: "matches" },
    { value: "append", label: "append" },
    { value: "prepend", label: "prepend" },
    { value: "appendChild", label: "appendChild" },
    { value: "remove", label: "remove" },
    { value: "removeChild", label: "removeChild" },
    { value: "replaceChild", label: "replaceChild" },
    { value: "insertBefore", label: "insertBefore" },
    { value: "cloneNode", label: "cloneNode" },
    { value: "removeEventListener", label: "removeEventListener" },
    { value: "dispatchEvent", label: "dispatchEvent" },
    { value: "click", label: "click" },
    { value: "focus", label: "focus" },
    { value: "blur", label: "blur" },
    { value: "getBoundingClientRect", label: "getBoundingClientRect" },
    { value: "getClientRects", label: "getClientRects" },
    { value: "scroll", label: "scroll" },
    { value: "scrollTo", label: "scrollTo" },
    { value: "scrollBy", label: "scrollBy" },
    { value: "scrollIntoView", label: "scrollIntoView" },
    { value: "contains", label: "contains" },
    { value: "getAttribute", label: "getAttribute" },
    { value: "setAttribute", label: "setAttribute" },
    { value: "hasAttribute", label: "hasAttribute" },
    { value: "toggleAttribute", label: "toggleAttribute" },
    { value: "removeAttribute", label: "removeAttribute" }
]
