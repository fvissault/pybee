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

function renderLayout(layout) {
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
    cssBtn.onclick=(e) => {
        e.stopPropagation()
        openDialog(workspaceRoot, "lcss")
    }
    const htmlBtn=document.createElement("button")
    htmlBtn.textContent="⚙"
    htmlBtn.title = "Paramètres"
    htmlBtn.style.fontSize = "12px"
    htmlBtn.className = "btn btn-secondary"
    htmlBtn.style.marginRight="6px"
    htmlBtn.onclick=(e) => {
        e.stopPropagation()
        openDialog(workspaceRoot, "lhtml")
    }
    el.appendChild(htmlBtn)
    el.appendChild(cssBtn)
    el.appendChild(label)
    el.dataset.nodeId = layout.id
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
        cssBtn.onclick=(e) => {
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
    if (widget.props.id) labeltext += " : id=" + widget.props.id
    if (widget.widgetType === "Text" && widget.props.text) labeltext += " : " + widget.props.text
    if (widget.widgetType === "TextField" && widget.props.type) labeltext += " : type=" + widget.props.type
    label.textContent = labeltext 
    el.appendChild(htmlBtn)
    if (widget.widgetType != "Text" && widget.widgetType != "Form") {
        el.appendChild(cssBtn)
        if (widget.widgetType != "Anchor") el.appendChild(eventsBtn)
    }
    el.appendChild(label)
    el.dataset.nodeId = widget.id
    el.draggable = true
    if (widget.container) el.appendChild(renderZone(widget.children[0]))
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
            del.title = "Supprimer la page"
            del.style.padding = "4px 6px 0px 7px"
            del.innerHTML = `<svg class="icon_explorer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="9" y1="5" x2="15" y2="5"/>
    <line x1="5" y1="6" x2="19" y2="6"/>
    <rect x="7" y="6" width="10" height="12" rx="2"/>
    <line x1="11" y1="10" x2="11" y2="15"/>
    <line x1="14" y1="10" x2="14" y2="15"/>
</svg>`
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
            let popups = JSON.parse(c.popups)
            const el = document.createElement("div")
            el.className = "tree-file"
            el.style.display = "flex"
            el.style.alignItems = "center"
            const label = document.createElement("span")
            label.textContent = `🧩 ${c.name} (${popups.length})`
            label.style.cursor = "pointer"
            label.addEventListener("click", () => {
                loadComponent(c.id) // à adapter à ton code
            })

            const newPopup = document.createElement("button")
            newPopup.className = "btn btn-secondary"
            newPopup.title = "Nouvelle fenêtre de paramétrage"
            newPopup.style.padding = "4px 5px 0px 7px"
            newPopup.innerHTML = `<svg class="icon_explorer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
    <rect x="4" y="5" width="14" height="12" rx="2"/>
    <line x1="4" y1="8" x2="18" y2="8"/>
    <line x1="8" y1="12.5" x2="14" y2="12.5"/>
    <line x1="11" y1="10" x2="11" y2="15"/>
</svg>`
            newPopup.style.marginLeft = "auto"
            newPopup.addEventListener("click", (e) => {
                e.stopPropagation()
                createPopup(c.id, c.name)
            })

            el.appendChild(label)
            el.appendChild(newPopup)
            componentsContainer.appendChild(el)
            // 🔸 POPUPS (niveau inférieur)
            if (popups && popups.length > 0) {
                const popupContainer = document.createElement("div")
                popupContainer.style.marginLeft = "16px"
                popups.forEach((p, index) => {
                    const popupEl = document.createElement("div")
                    popupEl.className = "tree-file"
                    popupEl.style.display = "flex"
                    popupEl.style.alignItems = "center"
                    const popupLabel = document.createElement("span")
                    popupLabel.textContent = `⚙️ admin ${index + 1} ${p.props.name?p.props.name:""}`
                    popupLabel.style.cursor = "pointer"
                    popupLabel.style.opacity = "0.8" // léger différenciateur
                    popupLabel.addEventListener("click", () => {
                        loadPopup(c.id, index)
                    })
                    const del = document.createElement("button")
                    del.className = "btn btn-secondary"
                    del.title = "Supprimer la popup"
                    del.style.padding = "4px 6px 0px 7px"
                    del.innerHTML = `<svg class="icon_explorer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="9" y1="5" x2="15" y2="5"/>
            <line x1="5" y1="6" x2="19" y2="6"/>
            <rect x="7" y="6" width="10" height="12" rx="2"/>
            <line x1="11" y1="10" x2="11" y2="15"/>
            <line x1="14" y1="10" x2="14" y2="15"/>
        </svg>`
                    del.style.marginLeft = "auto"
                    del.addEventListener("click", (e) => {
                        e.stopPropagation()
                        deletePopup(c.id, index)
                    })
                    popupEl.appendChild(popupLabel)
                    popupEl.appendChild(del)
                    popupContainer.appendChild(popupEl)
                })
                componentsContainer.appendChild(popupContainer)
            }
        })
    }
}
