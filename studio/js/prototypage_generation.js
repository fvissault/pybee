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
    })
    return jscode
}