function generate(node, indent = 0) {
    let jscode = ""
    const indentation = "   ".repeat(indent)
    node.forEach((item, index) => {
        if (item.type === "let") {
            jscode += indentation + `let ${item.props.name} = `
            item.props.value.forEach(val => {
                if (val.value) jscode += `${val.value}`
                if (val.op && val.op !== "") jscode += ` ${val.op} `
            })
            jscode += ";\n"
        }
        if (item.type === "log") {
            jscode += indentation + `console.log(${item.props.message});\n`
        }
        if (item.type === "warn") {
            jscode += indentation + `console.warn(${item.props.message});\n`
        }
        if (item.type === "error") {
            jscode += indentation + `console.error(${item.props.message});\n`
        }
        if (item.type === "if") {
            jscode += indentation + `if (${item.props.condition}) {\n`
            if (item.slots.then) {
                jscode += generate(item.slots.then, indent + 1)
            }
            jscode += indentation + `}\n`
        }
        if (item.type === "ifelse") {
            jscode += indentation + `if (${item.props.condition}) {\n`
            if (item.slots.then) {
                jscode += generate(item.slots.then, indent + 1)
            }
            jscode += indentation + `} else {\n`
            if (item.slots.else) {
                jscode += generate(item.slots.else, indent + 1)
            }
            jscode += indentation + `}\n`
        }
        if (item.type === "function") {
            jscode += indentation + `function ${item.props.name} (${item.props.parameters}) {\n`
            if (item.slots.body) {
                jscode += generate(item.slots.body, indent + 1)
            }
            jscode += indentation + `}\n`
        }
    })
    return jscode
}