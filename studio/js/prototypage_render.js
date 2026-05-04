function render(){

    workspaceEl.innerHTML=""

    if(!workspaceRoot)
        return

    if (workspaceRoot.type === "layout") {
        layout = renderLayout(workspaceRoot)
        workspaceEl.appendChild(layout)
        workspaceRoot.children.forEach(child => {
            if(child.type==="zone")
                layout.appendChild(renderZoneLayout(child))
        })
    } else {
        workspaceRoot.children.forEach(child => {
            //if(child.type==="zone")
            //    workspaceEl.appendChild(renderZoneLayout(child))
            if(child.type==="widget")
                workspaceEl.appendChild(renderWidget(child))

        })
    }
}

function renderZone(zone){

    const zoneEl=document.createElement("div")

    zoneEl.className="zone"
    zoneEl.style.marginTop = "7px"
    zoneEl.dataset.nodeId=zone.id

    zone.children.forEach(c=>{
        zoneEl.appendChild(renderWidget(c))
    })

    return zoneEl
}

function renderZoneLayout(zone){

    const zoneEl=document.createElement("div")

    zoneEl.className="zone"
    zoneEl.style.marginTop = "7px"
    zoneEl.dataset.nodeId=zone.id

    const label=document.createElement("span")
    label.textContent=zone.id
    
    const cssBtn=document.createElement("button")
    cssBtn.textContent="::"
    cssBtn.title = "CSS"
    cssBtn.style.fontWeight = "bold"
    cssBtn.className = "btn btn-secondary"
    cssBtn.style.marginRight="6px"
    cssBtn.onclick=(e)=>{
        e.stopPropagation()
        openDialog(zone, 'css')
    }
    
    const htmlBtn=document.createElement("button")
    htmlBtn.textContent="⚙"
    htmlBtn.title = "Paramètres"
    htmlBtn.style.fontSize = "12px"
    htmlBtn.className = "btn btn-secondary"
    htmlBtn.style.marginRight="6px"
    htmlBtn.onclick=(e)=>{
        e.stopPropagation()
        openDialog(zone, 'html')
    }

    zoneEl.appendChild(htmlBtn)
    zoneEl.appendChild(cssBtn)
    zoneEl.appendChild(label)

    zone.children.forEach(c=>{
        zoneEl.appendChild(renderWidget(c))
    })

    return zoneEl
}

function renderLayout(layout){

    const el = document.createElement("div")

    el.className = "layout"
    el.dataset.nodeId = layout.id

    const label=document.createElement("span")
    label.textContent=layout.id
    
    const cssBtn=document.createElement("button")
    cssBtn.textContent="::"
    cssBtn.title = "CSS"
    cssBtn.style.fontWeight = "bold"
    cssBtn.className = "btn btn-secondary"
    cssBtn.style.marginRight="6px"
    cssBtn.onclick=(e)=>{
        e.stopPropagation()
        openDialog(workspaceRoot, "lcss")
    }
    
    const htmlBtn=document.createElement("button")
    htmlBtn.textContent="⚙"
    htmlBtn.title = "Paramètres"
    htmlBtn.style.fontSize = "12px"
    htmlBtn.className = "btn btn-secondary"
    htmlBtn.style.marginRight="6px"
    htmlBtn.onclick=(e)=>{
        e.stopPropagation()
        openDialog(workspaceRoot, "lhtml")
    }

    el.appendChild(htmlBtn)
    el.appendChild(cssBtn)
    el.appendChild(label)
    el.dataset.nodeId=layout.id

    return el
}

function renderWidget(widget){

    const el=document.createElement("div")

    el.className="widget"
    
    const htmlBtn=document.createElement("button")
    htmlBtn.textContent="⚙"
    htmlBtn.title = "Paramètres"
    htmlBtn.style.fontSize = "12px"
    htmlBtn.className = "btn btn-secondary"
    htmlBtn.style.marginRight = "6px"
    htmlBtn.onclick=(e) => {
        e.stopPropagation()
        openDialog(widget, "html")
    }
    
    let cssBtn = null
    let eventsBtn = null
    if (widget.widgetType != "Text" && widget.widgetType != "Form") {
        cssBtn=document.createElement("button")
        cssBtn.textContent="::"
        cssBtn.title = "CSS"
        cssBtn.style.fontWeight = "bold"
        cssBtn.className = "btn btn-secondary"
        cssBtn.style.marginRight="6px"
        cssBtn.onclick=(e)=>{
            e.stopPropagation()
            openDialog(widget, "css")
        }
        
        if (widget.widgetType != "Anchor") {
            eventsBtn=document.createElement("button")
            eventsBtn.textContent="e"
            eventsBtn.title = "Paramètres"
            eventsBtn.style.fontSize = "14px"
            eventsBtn.className = "btn btn-secondary"
            eventsBtn.style.marginRight = "6px"
            eventsBtn.onclick=(e) => {
                e.stopPropagation()
                openDialog(widget, "events")
            }
        }
    }
    const label=document.createElement("span")
    let labeltext = widget.name
    if (widget.props.id) {
        labeltext += " : id=" + widget.props.id
    }
    if (widget.widgetType === "Text" && widget.props.text) {
        labeltext += " : " + widget.props.text
    }
    if (widget.widgetType === "TextField" && widget.props.type) {
        labeltext += " : type=" + widget.props.type
    }
    label.textContent = labeltext 

    el.appendChild(htmlBtn)
    if (widget.widgetType != "Text" && widget.widgetType != "Form") {
        el.appendChild(cssBtn)
        if (widget.widgetType != "Anchor") {
            el.appendChild(eventsBtn)
        }
    }
    el.appendChild(label)
    el.dataset.nodeId = widget.id
    el.draggable = true

    if (widget.container)
        el.appendChild(renderZone(widget.children[0]))

    return el
}

function renderProjectFiles() {
    projectTree.innerHTML = ""

    // --- Helper pour créer une section ---
    function createSection(title, isOpen = true) {
        const section = document.createElement("div")
        section.className = "tree-section"

        const header = document.createElement("div")
        header.className = "tree-section-header"
        header.style.cursor = "pointer"
        header.style.display = "flex"
        header.style.alignItems = "center"

        const arrow = document.createElement("span")
        arrow.style.marginRight = "5px"
        arrow.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" style="transition: transform 0.2s;">
        <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>`

        const label = document.createElement("span")
        label.style.fontWeight = "bold"
        label.textContent = title

        header.appendChild(arrow)
        header.appendChild(label)

        const content = document.createElement("div")
        content.style.display = isOpen ? "block" : "none"

        header.addEventListener("click", () => {
            const open = content.style.display === "block"
            content.style.display = open ? "none" : "block"

            arrow.firstChild.style.transform = open
                ? "rotate(-90deg)"
                : "rotate(0deg)"
        })

        section.appendChild(header)
        section.appendChild(content)

        projectTree.appendChild(section)

        return content
    }

    // --- SECTION PAGES ---
    const pagesContainer = createSection("Pages", true)

    if (!pages.error) {
        pages.forEach(f => {
            const el = document.createElement("div")
            el.className = "tree-file"
            el.style.display = "flex"
            el.style.alignItems = "center"

            const label = document.createElement("span")
            label.textContent = "📄 " + f.pagename
            label.style.cursor = "pointer"

            label.addEventListener("click", () => {
                loadBST(f.id)
            })

            const del = document.createElement("button")
            del.className = "btn btn-secondary"
            del.textContent = "🗑"
            del.style.marginLeft = "auto"

            del.addEventListener("click", (e) => {
                e.stopPropagation()
                deleteBST(f.id)
            })

            el.appendChild(label)
            el.appendChild(del)
            pagesContainer.appendChild(el)
        })
    }

    // --- SECTION COMPONENTS ---
    const componentsContainer = createSection("Components", true)

    if (typeof components !== "undefined" && !components.error) {
        components.forEach(c => {
            const el = document.createElement("div")
            el.className = "tree-file"
            el.style.display = "flex"
            el.style.alignItems = "center"

            const label = document.createElement("span")
            label.textContent = `🧩 ${c.name} (${c.popup?c.popup.length:"0"})`
            label.style.cursor = "pointer"

            label.addEventListener("click", () => {
                loadComponent(c.id) // à adapter à ton code
            })

            el.appendChild(label)
            componentsContainer.appendChild(el)

            // 🔸 POPUPS (niveau inférieur)
            if (c.popup && c.popup.length > 0) {
                const popupContainer = document.createElement("div")
                popupContainer.style.marginLeft = "16px"

                c.popup.forEach(p => {
                    const popupEl = document.createElement("div")
                    popupEl.className = "tree-file"
                    popupEl.style.display = "flex"
                    popupEl.style.alignItems = "center"

                    const popupLabel = document.createElement("span")
                    popupLabel.textContent = "⚙️ " + p.name
                    popupLabel.style.cursor = "pointer"
                    popupLabel.style.opacity = "0.8" // léger différenciateur

                    popupLabel.addEventListener("click", () => {
                        openPopupEditor(p)
                    })

                    popupEl.appendChild(popupLabel)
                    popupContainer.appendChild(popupEl)
                })

                componentsContainer.appendChild(popupContainer)
            }
        })
    }
}
