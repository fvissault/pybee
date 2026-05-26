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
    },
    arrow: { // ( [input parameters] ) => { [slot body] }
        props: { parameters: [] },
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
        slotLayout:"slot-inline"
    }
}

/*==================================================================================
 * Règles d'ajout entre les nodes
 *==================================================================================*/
const RULES = {
  foreach: {
    forbidden: ["break"],
    allowed: ["all"],
    node_allowed: Infinity
  },
  object_create: {
    forbidden: ["all"],
    allowed: ["object_set"],
    node_allowed: Infinity
  },
  object_set: {
    forbidden: ["all"],
    allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create"],
    node_allowed: 1
  },
  array_create: {
    forbidden: ["all"],
    allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create"],
    node_allowed: Infinity
  },
  let: {
    forbidden: ["all"],
    allowed: ["literal", "call", "add", "sub", "mul", "div", "and", "or", "not", "object_create", "array_create", "await", "fetch"],
    node_allowed: 1
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
            { type: "array_get", label: "Array get" },
            { type: "object_create", label: "Object {}" },
            { type: "object_get", label: "Object get" },
            { type: "object_set", label: "Object set" },
            { type: "literal", label: "Literal" }
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
