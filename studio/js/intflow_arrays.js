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
        props: { element: "", fromType: "document", selectorType: "query", target: "", event: "click" },
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
    forin: {
        props: { varName: "", object: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    forof: {
        props: { varName: "", object: "" },
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
        props: { condition: "" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    dowhile: {
        props: { condition: "" },
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
        slotLayout:"slot-block"
    },
    return: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    let: {
        props: { name: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    assign: {
        props: {  op: "=", parenthesis: false },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    const: {
        props: { name: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
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
    equals: {
        props: { op: "===", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    notequals: {
        props: { op: "!==", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    equal: {
        props: { op: "==", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    notequal: {
        props: { op: "!=", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    inf: {
        props: { op: "<", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    infequal: {
        props: { op: "<=", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    sup: {
        props: { op: ">", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    supequal: {
        props: { op: ">=", parenthesis: true },
        slots: ["left", "right"],
        slotLayout:"slot-inline"
    },
    try: {
        props: { hasFinally: false },
        slots: ["body", "catch-body", "finally-body"],
        slotLayout:"slot-block"
    },
    arrow: { 
        props: { indexName: "", arrayName:"", useIndex: false, useArray: false },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    fetch: { 
        props: { url: "", hasFinally: false, hasCatch: false, slotsthencount: 0 },
        slots: ["options", "catch-body", "finally-body"],
        slotLayout:"slot-block"
    },
    object_create: {
        props: {},
        slots: ["body"],
        slotLayout:"slot-block"
    },
    object_set: {
        props: { key: "key" },
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
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    flatmap: { 
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    filter: { 
        props: { array: "", useIndex: false, useArray: false },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    flat: { 
        props: { depth: 1 },
        slots: []
    },
    find: { 
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    findindex: { 
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    findlast: { 
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    some: { 
        props: { useThisArg: false, thisArg: "this argument" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    every: { 
        props: { useThisArg: false, thisArg: "this argument" },
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
    keys: { 
        props: { object: "" },
        slots: []
    },
    values: { 
        props: { object: "" },
        slots: []
    },
    reverse: { 
        props: {},
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
        props: { methodname: "", parameters: "", useStatic: "", usePrivate: "" },
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
        props: { selectorType: "query", target: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    el_selector: {
        props: { element: "", selectorType: "query", target: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    }
}

const statements = ["listener", "log", "warn", "error", "for", "forin", "forof", "foreach", "while", "dowhile", "if", "ifelse", "return", "let", "assign", "const", "switch"]
const operators = ["add", "sub", "mul", "div"]
const logicals = ["and", "or", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal"]
const transformers = ["join", "split", "map", "flatmap", "filter", "flat", "find", "findndex", "findlast", "some", "every", "pop", "shift", "keys", "values", "reverse", "entries", "includes", "indexof", "lastindexof", "push", "unshift", "concat"]
const classes = ["constructor", "method", "property"]
const switchcases = ["case", "default"]
const dom = ["doc_selector", "el_selector"]

const FAMILIES = {
    statements: statements,
    operators: operators,
    logicals: logicals,
    transformers: transformers,
    classes: classes,
    switchcases: switchcases,
    dom: dom
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
            allowed: "function+async+call+@statements+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    foreach: {
        body: {
            allowed: "call+@statements+continue+try+fetch+new+@dom",
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
            allowed: "call+literal+@operators+object_create+array_create+new+@dom",
            node_allowed: 1
        }
    },
    array_create: {
        body: {
            allowed: "call+literal+@operators+object_create+object_set+array_create+chain+new+@dom",
            node_allowed: Infinity
        }
    },
    let: {
        body: {
            allowed: "function+async+call+literal+@operators+arrow+object_create+array_create+chain+new+@dom",
            node_allowed: 1
        }
    },
    const: {
        body: {
            allowed: "function+async+call+literal+@operators+arrow+object_create+array_create+chain+new+@dom",
            node_allowed: 1
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
            allowed: "function+async+call+@statements+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    ifelse: {
        condition: {
            allowed: "call+literal+@logicals",
            node_allowed: 1
        },
        then: {
            allowed: "function+async+call+@statements+try+fetch+new+@dom",
            node_allowed: Infinity
        },
        else: {
            allowed: "function+async+call+@statements+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    and: {
        left: {
           allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    or: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    equals: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    equal: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    notequals: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    notequal: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    inf: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    infequal: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    sup: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        }
    },
    supequal: {
        left: {
            allowed: "@logicals+@operators+literal",
            node_allowed: 1
        },
        right: {
            allowed: "@logicals+@operators+literal",
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
            allowed: "call+@statements+await+try+fetch+new+super+@dom",
            node_allowed: Infinity
        }
    },
    method: {
        body: {
            allowed: "call+@statements+await+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    property: {
        body: {
            allowed: "call+literal+@operators+arrow+object_create+array_create+chain+new+@dom",
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
            allowed: "call+@statements+break+await+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    default: {
        body: {
            allowed: "call+@statements+break+await+try+fetch+new+@dom",
            node_allowed: Infinity
        }
    },
    log: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@dom",
            node_allowed: 1
        }
    },
    warn: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@dom",
            node_allowed: 1
        }
    },
    error: {
        body: {
            allowed: "call+await+@operators+@logicals+literal+new+@dom",
            node_allowed: 1
        }
    },
    doc_selector: {
        body: {
            allowed: "litteral+call",
            node_allowed: 1
        }
    },
    el_selector: {
        body: {
            allowed: "litteral+call",
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
            { type: "document", label: "Document" },                    // document.[slot]
            { type: "window", label: "Window" },                        // window.[slot]
            { type: "element", label: "Element" },                      // [input element_name].[slot]
            { type: "doc_selector", label: "Document selector" },       // [select fct] on [input name].[slot]
            { type: "el_selector", label: "Element selector" },         // [select fct] on [input name].[slot]
            { type: "listener", label: "Event listener" },
            { type: "set_style", label: "Set style property" },         // style.[input property] = [input value]
            { type: "set_text", label: "Set text" },                    // innerText = [input value]
            { type: "set_html", label: "Set HTML" },                    // innerHTML = [input value]
            { type: "create_element", label: "Create element" },        // create element [input tag name]
            { type: "append", label: "Append" },                        // [input object].append([slot] [button +]) OU [input object].append([slot 1], [slot 2] [button supp][button +])
            { type: "append_child", label: "Append child" }             // [input object].appendChild([slot])
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
    "function",
    "async",
    "arrow",
    "fetch",
    "try",
    "if",
    "ifelse",
    "switch",
    "case",
    "default",
    "object_create",
    "array_create",
    "let",
    "for",
    "foreach",
    "while",
    "dowhile",
    "chain",
    "map",
    "flatmap",
    "filter",
    "join",
    "split",
    "flat",
    "find",
    "findindex",
    "findlast",
    "some",
    "every",
    "includes",
    "indexof",
    "lastindexof",
    "push",
    "unshift",
    "concat",
    "class",
    "constructor",
    "method",
    "property",
    "log",
    "warn",
    "error",
    "listener",
    "doc_selector",
    "el_selector"
])

const EVENTS = [
    { value: "click", label: "click"},
    { value: "input", label: "input"},
    { value: "change", label: "change"},
    { value: "focus", label: "focus"},
    { value: "focusin", label: "focusin"},
    { value: "focusout", label: "focusout"},
    { value: "blur", label: "blur"},
    { value: "dblclick", label: "dblclick"},
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
    { value: "class", label: "getElementByClassName" },
    { value: "tag", label: "getElementByTagName" },
    { value: "query", label: "querySelector" },
    { value: "queryall", label: "querySelectorAll" }
]

const EL_SELECTORS = [
    { value: "nosel", label: "No selector" },
    { value: "class", label: "getElementByClassName" },
    { value: "tag", label: "getElementByTagName" },
    { value: "query", label: "querySelector" },
    { value: "queryall", label: "querySelectorAll" }
]