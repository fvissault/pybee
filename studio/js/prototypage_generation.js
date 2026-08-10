function generate(node, indent = 0) {
    let jscode = ""
    const indentation = "   ".repeat(indent)
    node.forEach((item, index) => {
        if (item.type === "let") {
            jscode += indentation + `let ${item.props.name}`
        }
        if (item.type === "const") {
            jscode += indentation + `const ${item.props.name}`
        }
        if (item.type === "literal") {
            jscode += `${item.props.value}`
        }
        if (item.type === "log") {
            jscode += indentation + `console.log(`
            jscode += generate(item.slots.body)
            jscode += `);\n`
        }
        if (item.type === "warn") {
            jscode += indentation + `console.warn(`
            jscode += generate(item.slots.body)
            jscode += `);\n`
        }
        if (item.type === "error") {
            jscode += indentation + `console.error(`
            if (item.slots.body) jscode += generate(item.slots.body)
            jscode += `);\n`
        }
        if (item.type === "sup" || item.type === "inf" || item.type === "equals" || item.type === "add" || 
            item.type === "sub" || item.type === "mul" || item.type === "div" || item.type === "equal" || 
            item.type === "notequals" || item.type === "notequal" || item.type === "infequal" || item.type === "supequal" || 
            item.type === "and" || item.type === "or") {
            if (item.props.parenthesis) jscode += `(`
            if (item.slots.left) jscode += generate(item.slots.left)
            jscode += `${item.props.op}`
            if (item.slots.right) jscode += generate(item.slots.right)
            if (item.props.parenthesis) jscode += `)`
        }
        if (item.type === "not") {
            jscode += indentation + `${item.props.op}`
            if (item.slots.body) jscode += generate(item.slots.body)
        }
        if (item.type === "if") {
            jscode += indentation + `if (`
            if (item.slots.condition) jscode += generate(item.slots.condition)
            jscode += `) {\n`
            if (item.slots.then) jscode += generate(item.slots.then, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "ifelse") {
            jscode += indentation + `if (`
            if (item.slots.condition) jscode += generate(item.slots.condition)
            jscode += `) {\n`
            if (item.slots.then) jscode += generate(item.slots.then, indent + 1)
            jscode += indentation + `} else {\n`
            if (item.slots.else) jscode += generate(item.slots.else, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "function") {
            jscode += indentation + `function ${item.props.name}(${item.props.parameters}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "async") {
            jscode += indentation + `async function ${item.props.name}(${item.props.parameters}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "call") {
            jscode += indentation + `${item.props.name}(${item.props.parameters})`
        }
        if (item.type === "listener") {
            jscode += indentation + `addEventListener("${item.props.event}", (event) => {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `})\n`
        }
        if (item.type === "for") {
            const isAsc = Number(item.props.from ?? 0) <= Number(item.props.to ?? 0)
            const conditionText = isAsc ? "<" : ">"
            const incrementText = isAsc ? "++" : "--"
            jscode += indentation + `for (let ${item.props.varName} = ${item.props.from}; ${item.props.varName} ${conditionText} ${item.props.to}; ${item.props.varName}${incrementText}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "forin" || item.type === "forof") {
            if (item.type === "forin")
                jscode += indentation + `for (${item.props.variable} in ${item.props.object}) {\n`
            else
                jscode += indentation + `for (${item.props.variable} of ${item.props.array}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "foreach") {
            let idx = "item"
            if (item.props.useIndex) idx += ", index"
            if (item.props.useArray) idx += `, ${item.props.arrayName}`
            if (idx !== "item") idx = "(" + idx + ")"
            jscode += indentation + `${item.props.array}.forEach(${idx} => {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}`
            if (item.props.useThisArg) jscode += `, ${item.props.thisArg}`
            jscode += `)\n`
        }
        if (item.type === "while") {
            jscode += indentation + `while (`
            if (item.slots.condition) jscode += generate(item.slots.condition)
            jscode += `) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "dowhile") {
            jscode += indentation + `do {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `} while (`
            if (item.slots.condition) jscode += generate(item.slots.condition)
            jscode += `)\n`
        }
        if (item.type === "break") {
            jscode += indentation + `break\n`
        }
        if (item.type === "continue") {
            jscode += indentation + `continue\n`
        }
        if (item.type === "return") {
            jscode += indentation + `return `
            if (item.slots.body) jscode += generate(item.slots.body)
            jscode += `;\n`
        }
        if (item.type === "assign") {
            jscode += indentation
            if (item.slots.left) jscode += generate(item.slots.left)
            jscode += ` = `
            if (item.slots.right) jscode += generate(item.slots.right)
            jscode += `;\n`
        }
        if (item.type === "await") {
            jscode += indentation + `await `
            if (item.slots.body) jscode += generate(item.slots.body)
        }
        if (item.type === "try") {
            jscode += indentation + `try {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
            jscode += indentation + `catch (e) {\n`
            if (item.slots.catch_body) jscode += generate(item.slots.catch_body, indent + 1)
            jscode += indentation + `}\n`
            if (item.props.hasFinally) {
                jscode += indentation + `finally {\n`
                if (item.slots.finally_body) jscode += generate(item.slots.finally_body, indent + 1)
                jscode += indentation + `}\n`    
            }
        }
        if (item.type === "arrow") {
            jscode += `(element`
            if (item.props.useIndex) jscode += `, ${item.props.indexName}`
            if (item.props.useArray) jscode += `, ${item.props.arrayName}`
            jscode += `) => {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += `}`
        }
        if (item.type === "fetch") {
            jscode += indentation + `fetch ("${item.props.url}", {\n`
            if (item.slots.options) jscode += generate(item.slots.options, indent + 1)
            jscode += indentation + `})\n`
            for (let i = 1; i <= item.props.slotsthencount; i++) {
                if (item.props[`hasThen_body_${i}`]) {
                    jscode += `.then(\n`
                    if (item.slots[`then_body_${i}`]) jscode += generate(item.slots[`then_body_${i}`], indent + 1)
                    jscode += `)\n`
                }
            }
            if (item.props.hasCatch) {
                jscode += indentation + `.catch ((e) => {\n`
                if (item.slots.catch_body) jscode += generate(item.slots.catch_body, indent + 1)
                jscode += indentation + `})\n`
            }
            if (item.props.hasFinally) {
                jscode += indentation + `.finally (() => {\n`
                if (item.slots.finally_body) jscode += generate(item.slots.finally_body, indent + 1)
                jscode += indentation + `})\n`
            }
        }
        if (item.type === "object_create") {
            jscode += indentation + "{\n"
            if (item.slots.body) jscode += generateSeparated(item.slots.body, indent + 1, ",\n");
            jscode += "\n" + indentation + "}\n"
        }
        if (item.type === "object_set") {
            jscode += indentation + `${item.props.key}: `
            if (item.slots.body) jscode += generate(item.slots.body)
        }
        if (item.type === "object_get") {
            jscode += indentation + `${item.props.arrayName}[${item.props.key}]`
        }
        if (item.type === "array_create") {
            jscode += indentation + "["
            if (item.slots.body) jscode += generateSeparated(item.slots.body, indent + 1, ",");
            jscode += indentation + "]"
        }
        if (item.type === "chain") {
            jscode += indentation + `${item.props.arrayname}`
            if (item.slots.body) jscode += "." + generate(item.slots.body)
            for (let i = 1; i <= item.props.dotslotcount; i++) {
                if (item.props[`hasdotplus_${i}`]) {
                    if (item.slots[`dotplus_${i}`]) {
                        jscode += "." + generate(item.slots[`dotplus_${i}`])
                    }
                }
            }
        }
        if (item.type === "join") {
            jscode += indentation + `join(${item.props.separator})`
        }
        if (item.type === "split") {
            jscode += indentation + `split(${item.props.separator})`
        }
        if (item.type === "map" || item.type === "flatmap" || item.type === "find" || item.type === "findindex" || 
            item.type === "findlast" || item.type === "some" || item.type === "every" || item.type === "filter") {
            let t = item.type
            if (t === "flatmap") t = "flatMap" 
            if (t === "findindex") t = "findIndex" 
            if (t === "findlast") t = "findLast" 
            jscode += indentation + `${t}(`
            if (item.slots.body) jscode += generate(item.slots.body)
            if (item.props.useThisArg) jscode += `, ${item.props.thisArg}`
            jscode += ")"
        }
        if (item.type === "flat") {
            jscode += indentation + `flat(${item.props.depth})`
        }
        if (item.type === "pop" || item.type === "shift" || item.type === "reverse") {
            jscode += indentation + `${item.type}()`
        }
        if (item.type === "entries" || item.type === "values" || item.type === "keys") {
            jscode += indentation + `Object.${item.type}(${item.props.object})`
        }
        if (item.type === "includes" || item.type === "indexof" || item.type === "lastindexof") {
            let t = item.type
            if (t === "indexof") t = "indexOf" 
            if (t === "lastindexof") t = "lastIndexOf" 
            jscode += indentation + `${t}(${item.props.object}`
            if (item.props.useFrom) jscode += `, ${item.props.from}`
            jscode += ")"
        }
        if (item.type === "push" || item.type === "unshift" || item.type === "concat") {
            console.log(item.props.inputcount)
            jscode += indentation + `${item.type}(${item.props.element}`
            for (let i = 1; i <= item.props.inputcount; i++) {
                jscode += ", " + item.props[`element_${i}`]
            }
            jscode += ")"
        }
        if (item.type === "class") {
            jscode += indentation + `class ${item.props.classname} `
            if (item.props.useExtends) jscode += `extends ${item.props.extends} {\n`
            else jscode += "{\n"
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + "}\n"
        }
        if (item.type === "constructor") {
            jscode += indentation + `constructor(${item.props.parameters}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + "}\n"
        }
        if (item.type === "method") {
            let precode = ""
            if (item.props.useStatic) precode += "static "
            if (item.props.useAsync) precode += "async "
            if (item.props.usePrivate) precode += "#"
            jscode += indentation + `${precode}${item.props.methodname}(${item.props.parameters}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + "}\n"
        }
        if (item.type === "new") {
            jscode += indentation + `new ${item.props.classname}(${item.props.parameters})`
        }
        if (item.type === "super") {
            jscode += indentation + `super(${item.props.parameters});\n`
        }
        if (item.type === "property") {
            let precode = ""
            if (item.props.useStatic) precode += "static "
            if (item.props.usePrivate) precode += "#"
            if (!item.props.usePrivate) precode += "_"
            jscode += indentation + `${precode}${item.props.name}`
            if (item.slots.body) jscode += " = " + generate(item.slots.body) + "\n"
            else jscode += "\n"
            // génération des accesseurs. On génère les 2 accesseurs get et set
            precode = ""
            useStatic = ""
            if (item.props.useStatic) useStatic += "static "
            if (item.props.useGetterSetter) {
                // getter
                jscode += indentation + `${useStatic}get ${item.props.name}() {\n`
                if (!item.props.usePrivate) precode = "_"
                else precode = "#"
                jscode += indentation + `   return this.${precode}${item.props.name};\n`
                jscode += indentation + "}\n"

                // setter
                jscode += indentation + `${useStatic}set ${item.props.name}(value) {\n`
                if (!item.props.usePrivate) precode = "_"
                else precode = "#"
                jscode += indentation + `   this.${precode}${item.props.name} = value;\n`
                jscode += indentation + "}\n"
            }
        }
        if (item.type === "switch") {
            jscode += indentation + `switch (${item.props.varname}) {\n`
            if (item.slots.body) jscode += generate(item.slots.body, indent + 1)
            jscode += indentation + `}\n`
        }
        if (item.type === "case") {
            jscode += indentation + `case ${item.props.varvalue}:`
            if (item.slots.body.length > 0) {
                jscode += " {\n" + generate(item.slots.body, indent + 1)
                jscode += indentation + `   break\n`
                jscode += indentation + `}\n`
            } else {
                jscode += `\n`
            }
        }
        if (item.type === "default") {
            jscode += indentation + `default:`
            if (item.slots.body.length > 0) {
                jscode += " {\n" + generate(item.slots.body, indent + 1)
                jscode += indentation + `   break\n`
                jscode += indentation + `}\n`
            } else {
                jscode += `\n`
            }
        }
        if (item.type === "doc_selector" || item.type === "el_selector") {
            let seltype = ""
            if (item.type === "doc_selector") {
                jscode += indentation + `document.`
                seltype = "getElementById"
            } else {
                jscode += indentation + `${item.props.element}.`
                seltype = ""
            }
            if (item.props.selectorType === "name") seltype = "getElementsByName"
            if (item.props.selectorType === "class") seltype = "getElementsByClassName"
            if (item.props.selectorType === "tag") seltype = "getElementsByTagName"
            if (item.props.selectorType === "query") seltype = "querySelector"
            if (item.props.selectorType === "queryall") seltype = "querySelectorAll"
            jscode += `${seltype}("${item.props.target}")`
            if (item.slots.body) jscode += "." + generate(item.slots.body)
        }
        if (item.type === "DOMproperty" || item.type === "WINproperty") {
            jscode += indentation + `${item.props.property}`
        }
        if (item.type === "Window") {
            jscode += indentation + `Window.`
            if (item.slots.body) jscode += generate(item.slots.body)
        }
        if (item.type === "DOMmethod" || item.type === "WINmethod") {
            jscode += indentation + `${item.props.method}(${item.props.parameters})`
        }
        if (item.type === "DOMobject") {
            jscode += indentation + `${item.props.property}.${item.props.subproperty}`
        }
        if (item.type === "DOMcollectionProperty") {
            if (item.props.hasCollection) {
                jscode += indentation + `${item.props.collectionName}.${item.props.property}`
            } else {
                jscode += indentation + generate(item.slots.body) + `.${item.props.property}`
            }
        }
        if (item.type === "DOMcollectionIndexed") {
            jscode += indentation + `${item.props.collectionName}[`
            if (item.slots.index.length == 1) jscode += generate(item.slots.index)
            jscode += indentation + `]`
        }
        if (item.type === "DOMcommand") {
            jscode += indentation + `${item.props.propertyName}`
            if (item.slots.command.length == 1) jscode += "." + generate(item.slots.command)
        }
        if (item.type === "comment") {
            jscode += indentation + `// ${item.props.comment}\n`
        }
    })
    return jscode
}

function generateSeparated(nodes, indent, separator) {
    return nodes.map(node => generate([node], indent)).join(separator);
}

function generatecss(node) {
    let csscode = ""
    const indentation = "   "
    let prefix = ""
    if (node.type !== "zone") {
        node.css.forEach(item => {
            if (item.type === "id") prefix = "#"
            if (item.type === "class") prefix = "."
            csscode += `${prefix}${item.name} {\n`
            item.values.forEach(value => {
                csscode += indentation + `${value};\n`
            })
            csscode += `}\n\n`
            node.children.forEach(child => {
                csscode += generatecss(child)
            })
        })
    } else {
        node.children.forEach(item => {
            csscode += generatecss(item)
        })
    }
    return csscode
}

function generatehtml(node, indent = 0) {
    let htmlcode = ""
    const indentation = "   "
    const dblindentation = "   ".repeat(2)
    htmlcode += `<!DOCTYPE html>\n`
    htmlcode += `<html`
    if (node.props.lang && node.props.lang !== "") htmlcode += ` lang="${node.props.lang}">\n`
    else htmlcode += `>\n`
    htmlcode += indentation + `<head>\n`
    const metas = node.props.metas
    metas.forEach(meta => {
        switch (meta.type) {
            case "charset": {
                if (meta.include) htmlcode += dblindentation + `<meta charset="${meta.content}">\n`
                break
            }
            case "name": {
                if (meta.include) htmlcode += dblindentation + `<meta name="${meta.name}" content="${meta.content}">\n`
                break
            }
            case "property": {
                if (meta.include) htmlcode += dblindentation + `<meta property="${meta.name}" content="${meta.content}">\n`
                break
            }
            case "http-equiv": {
                if (meta.include) htmlcode += dblindentation + `<meta http-equiv="${meta.name}" content="${meta.content}">\n`
                break
            }
        }
    })
    if (node.props.title && node.props.title !== "") htmlcode += indentation + indentation + `<title>${node.props.title}</title>\n`
    const cssfiles = node.props.cssfiles
    cssfiles.forEach(cssfile => {
        if (cssfile.type === "stylesheet") {
            if (cssfile.include) htmlcode += dblindentation + `<link rel="stylesheet" href="css/${cssfile.href}.css"/>\n`
        }
        if (cssfile.type === "icon") {
            if (cssfile.include) htmlcode += dblindentation + `<link rel="icon" href="${cssfile.href}"/>\n`
        }
    })
    const jsfiles = node.props.jsfiles
    jsfiles.forEach(jsfile => {
        if (jsfile.include) htmlcode += dblindentation + `<script${jsfile.defer?" defer":""} src="js/${jsfile.src}.js"></script>\n`
    })
    htmlcode += indentation + `</head>\n`
    htmlcode += indentation + `<body>\n`
    node.children.forEach(child => {
        htmlcode += generatebody(child, indent + 2) + "\n"
    })
    htmlcode += indentation + `</body>\n`
    htmlcode += `</html>`
    return htmlcode
}

function generatebody(node, indent = 0) {
    let htmlcode = ""
    const indentation = "   ".repeat(indent)
    let prefix = ""
    if (node.type !== "zone") {
        let tagname = ""
        switch(node.widgetType) {
            case "Block": {
                tagname = "div"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                const nodestyle = node.props.style||""
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}${nodestyle !== ""?" style='" + nodestyle + "'":""}>\n`
                break
            }
            case "Span": {
                tagname = "span"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}>\n`
                if (node.props.content !== "") htmlcode += indentation + `   ${node.props.content}\n`
                break
            }
            case "Image": {
                tagname = "img"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                const nodestyle = node.props.style||""
                const nodesrc = node.props.src||"error:no src"
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}${nodestyle !== ""?" style='" + nodestyle + "'":""}${nodesrc !== ""?" src='" + nodesrc + "'":""}`
                break
            }
            case "Text": {
                const nodetext = node.props.text||""
                htmlcode += indentation + `${nodetext}\n`
                break
            }

            case "TextField": {
                tagname = "input"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                const nodestyle = node.props.style||""
                const nodevalue = node.props.value||""
                const nodeplaceholder = node.props.placeholder||""
                const nodetype = node.props.type||""
                const nodedisabled = node.props.disabled||false
                const nodereadonly = node.props.readonly||false
                const noderequired = node.props.required||false
                const nodeautofocus = node.props.autofocus||false
                const nodeautocomplete = node.props.autocomplete||false
                const nodeform = node.props.form||""
                const nodelist = node.props.list||""
                const nodetitle = node.props.title||""
                const nodetabindex = node.props.tabindex||""

                const nodemin = node.props.min||""
                const nodemax = node.props.max||""
                const nodestep = node.props.step||""
                const nodechecked = node.props.checked||false
                const nodemaxlength = node.props.maxlength||""
                const nodeminlength = node.props.minlength||""
                const nodepattern = node.props.pattern||""
                const nodesize = node.props.size||""
                const nodemultiple = node.props.multiple||false
                const nodeaccept = node.props.accept||""
                const nodecapture = node.props.capture||""
                const nodeformaction = node.props.formaction||""
                const nodeformenctype = node.props.formenctype||""
                const nodeformmethod = node.props.formmethod||""
                const nodeformnovalidate = node.props.formnovalidate||false
                const nodeformtarget = node.props.formtarget||""
                const nodesrc = node.props.src||""
                const nodealt = node.props.alt||""
                const nodewidth = node.props.width||""
                const nodeheight = node.props.height||""
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}${nodestyle !== ""?" style='" + nodestyle + "'":""}${nodevalue !== ""?" value='" + nodevalue + "'":""}${nodeplaceholder !== ""?" placeholder='" + nodeplaceholder + "'":""}${nodetype !== ""?" type='" + nodetype + "'":""}${nodeform !== ""?" form='" + nodeform + "'":""}${nodelist !== ""?" list='" + nodelist + "'":""}${nodetitle !== ""?" title='" + nodetitle + "'":""}${nodetabindex !== ""?" tabindex='" + nodetabindex + "'":""}${nodemaxlength !== ""?" maxlength='" + nodemaxlength + "'":""}${nodeminlength !== ""?" minlength='" + nodeminlength + "'":""}${nodepattern !== ""?" pattern='" + nodepattern + "'":""}${nodesize !== ""?" size='" + nodesize + "'":""}${nodemultiple?" multiple":""}${nodeaccept !== ""?" accept='" + nodeaccept + "'":""}${nodecapture !== ""?" capture='" + nodecapture + "'":""}${nodeformaction !== ""?" formaction='" + nodeformaction + "'":""}${nodeformenctype !== ""?" formenctype='" + nodeformenctype + "'":""}${nodeformmethod !== ""?" formmethod='" + nodeformmethod + "'":""}${nodeformtarget !== ""?" formtarget='" + nodeformtarget + "'":""}${nodeformnovalidate?" formnovalidate":""}${nodesrc !== ""?" src='" + nodesrc + "'":""}${nodealt !== ""?" alt='" + nodealt + "'":""}${nodewidth !== ""?" width='" + nodewidth + "'":""}${nodeheight !== ""?" height='" + nodeheight + "'":""}${nodemin !== ""?" min='" + nodemin + "'":""}${nodemax !== ""?" max='" + nodemax + "'":""}${nodestep !== ""?" step='" + nodestep + "'":""}${nodeautofocus?" autofocus":""}${nodeautocomplete?" autocomplete":""}${nodedisabled?" disabled":""}${nodereadonly?" readonly":""}${noderequired?" required":""}${nodechecked?" checked":""}`
                break
            }
            case "Label": {
                tagname = "label"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                const nodestyle = node.props.style||""
                const nodefor = node.props.labelfor||""
                const nodecontent = node.props.content||""
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}${nodestyle !== ""?" style='" + nodestyle + "'":""}${nodefor !== ""?" for='" + nodefor + "'":""}>\n`
                if (nodecontent !== "") htmlcode += indentation + `   ${nodecontent}\n`
                break
            }
            case "Paragraph": {
                tagname = "p"
                const nodeid = node.props.id||""
                const nodename = node.props.name||""
                const nodeclass = node.props.classes||""
                const nodestyle = node.props.style||""
                htmlcode += indentation + `<${tagname}${nodeid !== ""?" id='" + nodeid + "'":""}${nodename !== ""?" name='" + nodename + "'":""}${nodeclass !== ""?" class='" + nodeclass + "'":""}${nodestyle !== ""?" style='" + nodestyle + "'":""}>\n`
                break
            }
        }
        if (node.children) {
            node.children.forEach(child => {
                htmlcode += generatebody(child, indent + 1)
            })
        }
        if (node.container) {
            // c'est un container
            htmlcode += indentation + `</${tagname}>`
        } else {
            // ce n'est pas un container
            if (node.widgetType === "Span" || node.widgetType === "Label") {
                htmlcode += indentation + `</${tagname}>`
                if (node.widgetType === "Span" ) htmlcode += "\n"
            } else {
                if (node.widgetType === "Text") htmlcode += ""
                else htmlcode += "/>"
            }
        }
    } else {
        node.children.forEach(item => {
            htmlcode += generatebody(item, indent)
        })
    }
    return htmlcode
}