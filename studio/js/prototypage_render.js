function createNewButton(textcontent, title) {
    const btn = document.createElement("button")
    btn.textContent = textcontent
    btn.title = title
    btn.style.fontWeight = "bold"
    btn.className = "btn btn-secondary"
    return btn
}

function createNewZone(zoneid) {
    const zoneEl = document.createElement("div")
    zoneEl.className="zone"
    zoneEl.style.marginTop = "7px"
    zoneEl.dataset.nodeId = zoneid
    return zoneEl
}

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
    const zoneEl = createNewZone(zone.id)
    zone.children.forEach(c=>{
        zoneEl.appendChild(renderWidget(c))
    })
    return zoneEl
}

function renderZoneLayout(zone){
    const zoneEl = createNewZone(zone.id)
    const label=document.createElement("span")
    label.textContent=zone.id
    const cssBtn = createNewButton("::", "CSS")
    cssBtn.style.marginRight="6px"
    cssBtn.onclick=(e)=>{
        e.stopPropagation()
        openDialog(zone, 'css')
    }
    const htmlBtn = createNewButton("⚙", "Paramètres")
    htmlBtn.style.fontSize = "12px"
    htmlBtn.style.marginRight = "6px"
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
    const cssBtn = createNewButton("::", "CSS")
    cssBtn.style.marginRight="6px"
    cssBtn.onclick=(e) => {
        e.stopPropagation()
        openDialog(workspaceRoot, "lcss")
    }
    const htmlBtn = createNewButton("⚙", "Paramètres")
    htmlBtn.style.fontSize = "12px"
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
    const htmlBtn = createNewButton("⚙", "Paramètres")
    htmlBtn.style.fontSize = "12px"
    htmlBtn.style.marginRight = "6px"
    htmlBtn.onclick=(e) => {
        e.stopPropagation()
        openDialog(widget, "html")
    }
    let cssBtn = null
    let eventsBtn = null
    if (widget.widgetType != "Text" && widget.widgetType != "Form") {
        cssBtn = createNewButton("::", "CSS")
        cssBtn.style.marginRight="6px"
        cssBtn.onclick=(e) => {
            e.stopPropagation()
            openDialog(widget, "css")
        }   
        if (widget.widgetType != "Anchor") {
            eventsBtn = createNewButton("e", "Evènements")
            eventsBtn.style.fontSize = "14px"
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

function createItemContainer() {
    const element = document.createElement("div")
    element.className = "tree-file"
    element.style.display = "flex"
    element.style.alignItems = "center"
    return element
}

function createItemLabel(textcontent) {
    const label = document.createElement("span")
    label.textContent = textcontent
    label.style.cursor = "pointer"
    return label
}

function createDelButton(title) {
    const del = document.createElement("button")
    del.className = "btn btn-secondary btn-delete"
    del.title = title
    del.style.padding = "4px 5px 0px 7px"
    del.innerHTML = `<svg class="icon_explorer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="9" y1="5" x2="15" y2="5"/>
    <line x1="5" y1="6" x2="19" y2="6"/>
    <rect x="7" y="6" width="10" height="12" rx="2"/>
    <line x1="11" y1="10" x2="11" y2="15"/>
    <line x1="14" y1="10" x2="14" y2="15"/>
</svg>`
    del.style.marginLeft = "auto"
    return del    
}

function renderProjectFiles() {
    projectTree.innerHTML = ""
    // --- Helper pour créer une section ---
    function createSection(title, isOpen = true, commonSection = "") {
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
        if (commonSection === "common" || commonSection === "pages") {
            const newCommonFile = document.createElement("button")
            newCommonFile.className = "btn btn-primary"
            newCommonFile.title = "Nouveau fichier"
            newCommonFile.style.padding = "2px 7px 4px"
            newCommonFile.innerText = "+"
            newCommonFile.style.marginLeft = "auto"
            newCommonFile.style.marginRight = "11px"
            newCommonFile.style.width = "30px"
            newCommonFile.addEventListener("click", (e) => {
                e.stopPropagation()
                if (commonSection === "common") commonFilePopup(projectid, "commonjs")
                if (commonSection === "pages") commonFilePopup(projectid, 'pagejs')
            })
            header.appendChild(newCommonFile)
        }
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

    // --- SECTION FICHIERS COMMUNS ---
    const communsContainer = createSection("Js du projet", true, "common")

    if (!js.error) {
        js.forEach(f => {
            if (f.content_type === "commonjs") {
                const el = createItemContainer()
                const label = createItemLabel("📄 " + f.name)
                label.addEventListener("click", () => {
                    loadJS(f.id)
                })
                const del = createDelButton("Supprimer le fichier IntFlow")
                del.addEventListener("click", (e) => {
                    e.stopPropagation()
                    deleteJS(f.id)
                })
                el.appendChild(label)
                el.appendChild(del)
                communsContainer.appendChild(el)
            }
        })
    }

    // --- SECTION FICHIERS JAVASCRIPT DES PAGES ---
    const jspagesContainer = createSection("Js des pages", true)

    if (!js.error) {
        js.forEach(f => {
            if (f.content_type === "pagejs") {
                const el = createItemContainer()
                const label = createItemLabel("📄 " + f.name)
                label.addEventListener("click", () => {
                    loadJS(f.id)
                })
                el.appendChild(label)
                jspagesContainer.appendChild(el)
            }
        })
    }

    // --- SECTION FICHIERS JAVASCRIPT DES COMPOSANTS ---
    const jscomponentsContainer = createSection("Js des composants", true)

    if (!js.error) {
        js.forEach(f => {
            if (f.content_type === "componentjs") {
                const el = createItemContainer()
                const label = createItemLabel("📄 " + f.name)
                label.addEventListener("click", () => {
                    loadJS(f.name)
                })
                const del = createDelButton("Supprimer le fichier IntFlow")
                del.addEventListener("click", (e) => {
                    e.stopPropagation()
                    deleteJS(f.id)
                })
                el.appendChild(label)
                el.appendChild(del)
                jscomponentsContainer.appendChild(el)
            }
        })
    }

    // --- SECTION FICHIERS JAVASCRIPT DES PAGES ADMIN DES COMPOSANTS ---
    const jsadmcomponentsContainer = createSection("Js des admin composants", true)

    if (!js.error) {
        js.forEach(f => {
            if (f.content_type === "compadmjs") {
                const el = createItemContainer()
                const label = createItemLabel("📄 " + f.name)
                label.addEventListener("click", () => {
                    loadJS(f.name)
                })
                const del = createDelButton("Supprimer le fichier IntFlow")
                del.addEventListener("click", (e) => {
                    e.stopPropagation()
                    deleteJS(f.id)
                })
                el.appendChild(label)
                el.appendChild(del)
                jsadmcomponentsContainer.appendChild(el)
            }
        })
    }

    // --- SECTION PAGES ---
    const pagesContainer = createSection("Pages", true, "pages")

    if (!pages.error) {
        pages.forEach(f => {
            const el = createItemContainer()
            const label = createItemLabel("📄 " + f.pagename)
            label.addEventListener("click", () => {
                loadBST(f.id)
            })
            const del = createDelButton("Supprimer la page")
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
    const componentsContainer = createSection("Composants", true)

    if (typeof components !== "undefined" && !components.error) {
        components.forEach(c => {
            let popups = JSON.parse(c.popups)
            const el = createItemContainer()
            const label = createItemLabel(`🧩 ${c.name} (${popups.length})`)
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
            let comppops = JSON.parse(c.popups)
            if (comppops && comppops.length > 0) {
                const popupContainer = document.createElement("div")
                popupContainer.style.marginLeft = "16px"
                comppops.forEach((p, index) => {
                    const popupEl = createItemContainer()
                    const popupLabel = createItemLabel(`⚙️ admin ${index + 1} ${p.props.name?p.props.name:""}`)
                    popupLabel.style.opacity = "0.8" // léger différenciateur
                    popupLabel.addEventListener("click", () => {
                        loadPopup(c.id, index)
                    })
                    const del = createDelButton("Supprimer la popup")
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

async function renderComponentSection(entityid = 1) {
    const componentcontainer = document.getElementById("compcontainer")

    fetch("/pybee/studio/api/components.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getorgcomponents",
            id_entity : entityid
        })
    })
    .then(r => r.json())
    .then(res => {
        console.log(res)
        if(!res.status) {
            res.forEach(c => {
                const newcomponent = document.createElement("div")
                newcomponent.className = "palette-item"
                newcomponent.draggable = "true"
                newcomponent.dataset.type = "widget"
                newcomponent.dataset.widget = c.name
                newcomponent.title = c.name
                
                newcomponent.innerHTML = `<svg class="icon" viewbox="0 0 24 24">${c.icon}</svg>`

                componentcontainer.appendChild(newcomponent)

                widgetDefinitions[c.name] = { name: "Composant : " + c.name, container: false }

                newcomponent.addEventListener("dragstart",()=>{
                    draggedType = newcomponent.dataset.type
                    draggedWidgetType = newcomponent.dataset.widget
                    draggedNodeRef = null
                })
            })
        } else {
            alert("Network error : Composant not saved")
        }
    });
}