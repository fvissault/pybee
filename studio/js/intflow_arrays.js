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
        props: { selectorType: "id", target: "objectId", event: "click" },
        slots: ["body"],
        slotLayout:"slot-block"
    },
    log: {
        props: { message: "" },
        slots: []
    },
    warn: {
        props: { message: "" },
        slots: []
    },
    error: {
        props: { message: "" },
        slots: []
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
        slotLayout:"slot-inline"
    },
    ifelse: {
        props: {},
        slots: ["condition", "then", "else"],
        slotLayout:"slot-inline"
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
        props: { name: "" },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    const: {
        props: { name: "" },
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
    arrow: { // ( [input parameters] ) => { [slot body] }
        props: { indexName: "", arrayName:"", useIndex: false, useArray: false },
        slots: ["body"],
        slotLayout:"slot-inline"
    },
    fetch: { // fetch( [input url] )
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
        props: {},
        slots: []
    },
    values: { 
        props: {},
        slots: []
    },
    reverse: { 
        props: {},
        slots: []
    },
    entries: { 
        props: {},
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
    }
}

/*==================================================================================
 * Règles d'ajout entre les nodes
 *==================================================================================*/
const RULES = {
    foreach: {
        body: {
            forbidden: ["break"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    object_create: {
        body: {
            forbidden: ["all"],
            allowed: ["object_set"],
            node_allowed: Infinity
        }
    },
    object_set: {
        body: {
            forbidden: ["all"],
            allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create"],
            node_allowed: 1
        }
    },
    array_create: {
        body: {
            forbidden: ["all"],
            allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create"],
            node_allowed: Infinity
        }
    },
    let: {
        body: {
            forbidden: ["all"],
            allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create", "await", "fetch", "chain", "arrow"],
            node_allowed: 1
        }
    },
    const: {
        body: {
            forbidden: ["all"],
            allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create", "await", "fetch", "chain", "arrow"],
            node_allowed: 1
        }
    },
    chain: {
        body: {
            forbidden: ["all"],
            allowed: ["call", "map", "join", "split", "filter", "flat", "flatmap", "find", "findindex", "findlast", "some", "every", "pop", "shift", "keys", "values", "reverse", "includes", "indexof", "entries", "push", "unshift", "concat"],
            node_allowed: 1
        }
    },
    map: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    flatmap: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    filter: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    find: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    findindex: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    findlast: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    some: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    every: {
        body: {
            forbidden: ["all"],
            allowed: ["arrow", "literal"],
            node_allowed: 1
        }
    },
    if: {
        condition: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        then: {
            forbidden: ["map", "join", "split", "filter", "flat", "flatmap", "find", "findindex", "findlast", "some", "every", "pop", "shift", "keys", "values", "reverse", "includes", "indexof", "entries", "push", "unshift", "concat"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    ifelse: {
        condition: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        then: {
            forbidden: ["map", "join", "split", "filter", "flat", "flatmap", "find", "findindex", "findlast", "some", "every", "pop", "shift", "keys", "values", "reverse", "includes", "indexof", "entries", "push", "unshift", "concat"],
            allowed: ["all"],
            node_allowed: Infinity
        },
        else: {
            forbidden: ["map", "join", "split", "filter", "flat", "flatmap", "find", "findindex", "findlast", "some", "every", "pop", "shift", "keys", "values", "reverse", "includes", "indexof", "entries", "push", "unshift", "concat"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    and: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    or: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    equals: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    equal: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    notequals: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    notequal: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    inf: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    infequal: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    sup: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    supequal: {
        left: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["and", "or", "literal", "add", "sub", "mul", "div", "equals", "notequals", "equal", "notequal", "inf", "infequal", "sup", "supequal", "not"],
            node_allowed: 1
        }
    },
    add: {
        left: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        }
    },
    sub: {
        left: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        }
    },
    mul: {
        left: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        }
    },
    div: {
        left: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        },
        right: {
            forbidden: ["all"],
            allowed: ["literal", "add", "sub", "mul", "div"],
            node_allowed: 1
        }
    },
    class: {
        body: {
            forbidden: ["all"],
            allowed: ["constructor", "method", "property"],
            node_allowed: Infinity
        }
    },
    constructor: {
        body: {
            forbidden: ["constructor", "method"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    method: {
        body: {
            forbidden: ["constructor", "super", "method"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    property: {
        body: {
            forbidden: ["constructor", "super", "method"],
            allowed: ["all"],
            node_allowed: 1
        }
    },
    switch: {
        body: {
            forbidden: ["all"],
            allowed: ["case", "default"],
            node_allowed: Infinity
        }
    },
    case: {
        body: {
            forbidden: ["class", "property", "super", "constructor", "method", "function", "break", "continue", "async"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    },
    default: {
        body: {
            forbidden: ["class", "property", "super", "constructor", "method", "function", "break", "continue", "async"],
            allowed: ["all"],
            node_allowed: Infinity
        }
    }
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
            { type: "chain", label: "Chain (.)" }
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
            { type: "concat", label: "Concat" },
            { type: "literal", label: "Literal" }
        ]
    },
    {
        category: "Objects",
        items: [
            { type: "object_create", label: "Object {}" },
            { type: "object_get", label: "Object get" },
            { type: "object_set", label: "Object set" },
            { type: "object_keys", label: "Keys" }, // méthode statique
            { type: "object_values", label: "Values" }, // méthode statique
            { type: "object_entries", label: "Entries" }, // méthode statique
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
    "property"
])

