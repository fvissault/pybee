// *******************************************************************************
// popup Page html
// *******************************************************************************
// props.cssfiles = [{include: true|false, href: "name_of_file"}, ...]
// props.jsfiles = [{include: true|false, defer: true|false, src: "name_of_file"}, ...]
// props.metas = [{include: true|false, type: "charset"|"name"|"http-equiv", name: "", content: ""}]
// *******************************************************************************
async function popupPage() {
    let content = null
    if (perspective === "page") {
        const page_name = workspaceRoot.props.name||""
        const page_title = workspaceRoot.props.title||""
        const language = workspaceRoot.props.lang||""
        const cssfiles = workspaceRoot.props.cssfiles||[]
        const jsfiles = workspaceRoot.props.jsfiles||[]
        const metas = workspaceRoot.props.metas||[]
        
        const dialog = document.getElementById("dialog")
        dialog.style.width = "1455px"
        const head = document.getElementById("dialogHeader")
        head.innerText = t("pagetitle")
        content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="page_name">${t("pagename")}</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${page_name}" id="page_name" style="width:200px;"/>
                    </div>
                    <div class="dialog-row">
                        <label for="page_title">${t("pagepagettile")}</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${page_title}" id="page_title" style="width:200px;"/>
                    </div>
                    <div class="dialog-row">
                        <label for="lang">Langue</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${language}" id="lang" style="width:200px;"/>
                    </div>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Fichiers css utilisés</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="cssfiles" style="width:300px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addCssRow('stylesheet')">+ css</button>
                    <button class="btn btn-secondary" onclick="addCssRow('icon')">+ icon</button>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Scripts utilisés</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="scriptfiles" style="width:385px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addScriptRow()">+ script file</button>
                </div>
            </div>
            <div class="dialog-column" style="border:1px solid gray; height:240px; border-radius:10px; padding-left:10px;">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label>Métadonnées</label>
                    </div>
                    <div style="height:170px; overflow:scroll; margin-bottom:4px;">
                        <div id="metatags" style="width:414px;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="addMetaRow('charset')">+ charset</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('name')">+ name</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('property')">+ property</button>
                    <button class="btn btn-secondary" onclick="addMetaRow('http-equiv')">+ directive</button>
                </div>
            </div>` + makeDialogButtons()
            createCssRows(cssfiles)
            createJsRows(jsfiles)
            createMetaRows(metas)
    } else {
        const session = await getSession()
        console.log(session)
        const composant_authorid = workspaceRoot.props.author_id||""
        let user = {}
        await fetch("/pybee/studio/api/users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getuser",
                userid : composant_authorid===""?session.userid:composant_authorid
            })
        })
        .then(r => r.json())
        .then(data => {
            if (!data.error) {
                user = data
            }
        });

        const composant_name = workspaceRoot.props.name||""
        const composant_desc = workspaceRoot.props.description||""
        const composant_vers = workspaceRoot.props.version||""
        const entity_name = workspaceRoot.props.entity_name||""
        const active = workspaceRoot.props.active||false
        const icon = workspaceRoot.props.icon||`<rect x="3" y="3" width="18" height="18" rx="2"/>
<rect x="6" y="6" width="5" height="5" rx="1"/>
<rect x="13" y="6" width="5" height="5" rx="1"/>
<rect x="9" y="13" width="6" height="5" rx="1"/>
<circle cx="20" cy="20" r="3" fill="var(--color-component)" stroke="none"/>`
        
        const head = document.getElementById("dialogHeader")
        head.innerText = "Paramètres du composant"
        content = document.getElementById("dialogContent")
        content.innerHTML = `
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="comp_name">Nom du composant :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${composant_name}" id="comp_name"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_desc">Description :</label>
                    </div>
                    <div class="dialog-row">
                        <textarea id="comp_desc" spellcheck="false" style="width:415px;"${user.id!==parseInt(session.userid)?" disabled":""}>${composant_desc}</textarea>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_vers">Version :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${composant_vers}" id="comp_vers"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row">
                        <label for="type">Type :</label>
                    </div>
                    <div class="dialog-row">
                        <select id="type"${user.id!==parseInt(session.userid)?" disabled":""}>
                            <option value="public">Public</option>
                            <option value="private">Privé</option>
                        </select>
                    </div>
                    <div class="dialog-row">
                        <label for="entity_name">Appartient à l'entreprise :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${user.name}" id="entity_name"${user.id!==parseInt(session.userid)?" disabled":""}/>
                    </div>
                    <div class="dialog-row-with-checkbox">
                        <input type="checkbox" id="active"${active?" checked":""}${user.id!==parseInt(session.userid)?" disabled":""}/>
                        <label for="readonly">Composant actif</label>
                    </div>
                </div>
            </div>
            <div class="dialog-column">
                <div class="dialog-section">
                    <div class="dialog-row">
                        <label for="author">Auteur :</label>
                    </div>
                    <div class="dialog-row">
                        <input type="text" value="${user.firstname + ' ' + user.lastname}"${user.id!==parseInt(session.userid)?" disabled":""}/>
                        <input type="hidden" value="${user.id}" id="author"/>
                    </div>
                    <div class="dialog-row">
                        <label for="comp_icon">Icône svg uniquement :</label>
                    </div>
                    <div class="dialog-row">
                        <div class="palette-item">
                            <svg id="example" class="icon" viewBox="0 0 24 24">
                                ${icon}
                            </svg>
                        </div>
                    </div>
                    <div class="dialog-row">
                        <textarea id="comp_icon" onchange="refreshIcon()" spellcheck="false" style="font-size:13px; width:544px; height:110px;"${user.id!==parseInt(session.userid)?" disabled":""}>${icon}</textarea>
                    </div>
                </div>
            </div>` + makeDialogButtons()
    }
    content.querySelector("#saveprops").onclick = () => {
        savePageProps(workspaceRoot)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function refreshIcon() {
    const icon = document.getElementById("comp_icon").value
    const example = document.getElementById("example")
    example.innerHTML = icon
}

let rowCount = 0

function createMetaRows(metas) {
    metas.forEach((item) => {
        addMetaRow(item.type, item.name, item.content, item.include)
    })
}

function addMetaRow(mode, name = "", content = "", include = false) {
    const container = document.getElementById('metatags')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const modeinput = document.createElement("input")
    modeinput.type = "hidden"
    modeinput.className = "mode"
    modeinput.value = mode
    row.appendChild(modeinput)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "inc"
    input.checked = include
    row.appendChild(input)

    switch (mode) {
        case "charset": {
            const l = document.createElement("label")
            l.htmlFor = `content${rowCount}`
            l.textContent = mode + " :"
            l.style.marginTop = "9px"
            l.style.width = "165px"
            row.appendChild(l)

            const i = document.createElement("input")
            i.type = "text"
            i.id = `content${rowCount}`
            i.className = "content"
            i.value = content
            i.style.marginRight = "4px"
            i.placeholder = "Contenu"
            i.style.width = "160px"
            row.appendChild(i)
            break
        }
        case "name": {
            const l = document.createElement("label")
            l.htmlFor = `name${rowCount}`
            l.textContent = mode + " :"
            l.style.marginTop = "9px"
            l.style.width = "55px"
            row.appendChild(l)

            const nameinput = document.createElement("input")
            nameinput.type = "text"
            nameinput.id = `name${rowCount}`
            nameinput.className = "name"
            nameinput.placeholder = "Nom"
            nameinput.value = name
            nameinput.style.marginRight = "4px"
            nameinput.style.width = "90px"
            row.appendChild(nameinput)

            const contentinput = document.createElement("input")
            contentinput.type = "text"
            contentinput.className = "content"
            contentinput.value = content
            contentinput.style.marginRight = "4px"
            contentinput.style.width = "160px"
            contentinput.placeholder = "Contenu"
            row.appendChild(contentinput)
            break
        }
        case "property": {
            const l = document.createElement("label")
            l.htmlFor = `property${rowCount}`
            l.textContent = mode + " :"
            l.style.marginTop = "9px"
            l.style.width = "70px"
            row.appendChild(l)

            const nameselect = document.createElement("select")
            nameselect.id = `property${rowCount}`
            nameselect.className = "name"
            nameselect.style.marginRight = "4px"
            PROPERTY_OPTIONS.forEach(opt => {
                const o = document.createElement("option")
                o.value = opt.value
                o.textContent = opt.label
                nameselect.appendChild(o)
            })
            row.appendChild(nameselect)

            const contentinput = document.createElement("input")
            contentinput.type = "text"
            contentinput.className = "content"
            contentinput.value = content
            contentinput.style.marginRight = "4px"
            contentinput.style.width = "160px"
            contentinput.placeholder = "Contenu"
            row.appendChild(contentinput)
            break
        }
        case "http-equiv": {
            const l = document.createElement("label")
            l.htmlFor = `httpequiv${rowCount}`
            l.textContent = "directive :"
            l.style.marginTop = "9px"
            l.style.width = "70px"
            row.appendChild(l)

            const nameselect = document.createElement("select")
            nameselect.id = `httpequiv${rowCount}`
            nameselect.className = "name"
            nameselect.style.marginRight = "4px"
            HTTPEQUIV_OPTIONS.forEach(opt => {
                const o = document.createElement("option")
                o.value = opt.value
                o.textContent = opt.label
                nameselect.appendChild(o)
            })
            row.appendChild(nameselect)

            const contentinput = document.createElement("input")
            contentinput.type = "text"
            contentinput.id = `content${rowCount}`
            contentinput.className = "content"
            contentinput.value = content
            contentinput.style.marginRight = "4px"
            contentinput.style.width = "160px"
            contentinput.placeholder = "Contenu"
            row.appendChild(contentinput)
            break
        }
    }

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeMetaRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function removeMetaRow(rowid) {
    const row = document.getElementById(rowid)
    row.remove()
}

function createCssRows(cssfiles) {
    cssfiles.forEach((item) => {
        addCssRow(item.type, item.href, item.include)
    })
}

function addCssRow(type, href = "", include = false) {
    const container = document.getElementById('cssfiles')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const reltype = document.createElement("input")
    reltype.type = "hidden"
    reltype.className = "reltype"
    reltype.value = type
    row.appendChild(reltype)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "inc"
    input.checked = include
    row.appendChild(input)

    const l = document.createElement("label")
    l.htmlFor = `href${rowCount}`
    if (type === "icon") {
        l.textContent = "Icon :"
    } else {
        l.textContent = "Nom :"
    }
    l.style.marginTop = "9px"
    l.style.width = "45px"
    row.appendChild(l)
    const i = document.createElement("input")
    i.type = "text"
    i.id = `href${rowCount}`
    i.className = "href"
    i.value = href
    i.style.marginRight = "3px"
    if (type === "icon") {
        i.placeholder = "href avec extension"
    } else {
        i.placeholder = "href sans extension"
    }
    row.appendChild(i)

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeCssRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function removeCssRow(rowid) {
    const row = document.getElementById(rowid)
    row.remove()
}

function createJsRows(jsfiles) {
    jsfiles.forEach((item) => {
        addScriptRow(item.src, item.include, item.defer)
    })
}

function addScriptRow(src = "", include = false, defer = false) {
    const container = document.getElementById('scriptfiles')
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    row.id = `row${rowCount}`

    const inccb = document.createElement("input")
    inccb.type = "checkbox"
    inccb.className = "inc"
    inccb.checked = include
    row.appendChild(inccb)

    const l = document.createElement("label")
    l.htmlFor = `src${rowCount}`
    l.textContent = "Source :"
    l.style.marginTop = "9px"
    row.appendChild(l)
    const i = document.createElement("input")
    i.type = "text"
    i.id = `src${rowCount}`
    i.className = "src"
    i.placeholder = "Source sans extension"
    i.style.width = "160px"
    i.value = src
    row.appendChild(i)

    const defercb = document.createElement("input")
    defercb.type = "checkbox"
    defercb.className = "defer"
    defercb.id = `defer${rowCount}`
    defercb.checked = defer
    row.appendChild(defercb)
    const labeldefer = document.createElement("label")
    labeldefer.htmlFor = `defer${rowCount}`
    labeldefer.textContent = "Reporté"
    labeldefer.style.marginTop = "9px"
    labeldefer.style.marginRight = "3px"
    row.appendChild(labeldefer)

    const button = document.createElement("button")
    button.className = "btn btn-secondary"
    button.onclick = () => removeCssRow(row.id);
    button.textContent = "-"
    row.appendChild(button)

    container.appendChild(row)
    rowCount++
}

function savePageProps(node) {
    if (perspective === "page") {
        const pagename = document.getElementById("page_name").value
        if (pagename == "") {
            alert(t("alertpagename"))
            document.getElementById("page_name").focus()
            return
        }
        node.props.name = pagename.trim()
        node.props.title = document.getElementById("page_title").value.trim()
        node.props.lang = document.getElementById("lang").value.trim()

        node.props.cssfiles = []
        const cssRows = document.getElementById("cssfiles")
        for (const row of cssRows.children) {
            const h = row.querySelector(".href").value;
            if (h !== "") {
                const insert = row.querySelector(".inc").checked;
                const reltype = row.querySelector(".reltype").value
                node.props.cssfiles.push({include: insert, href: h, type: reltype})
            }
        }

        node.props.jsfiles = []
        const jsRows = document.getElementById("scriptfiles")
        for (const row of jsRows.children) {
            const src = row.querySelector(".src").value;
            if (src !== "") {
                const insert = row.querySelector(".inc").checked;
                const defer = row.querySelector(".defer").checked;
                node.props.jsfiles.push({include: insert, src: src, defer: defer})
            }
        }

        node.props.metas = []
        const metaRows = document.getElementById("metatags")
        for (const row of metaRows.children) {
            const mode = row.querySelector(".mode").value;
            switch (mode) {
                case "charset": {
                    const insert = row.querySelector(".inc").checked;
                    const content = row.querySelector(".content").value;
                    node.props.metas.push({include: insert, type: mode, name: "", content: content})
                    break
                }
                case "name": {
                    const insert = row.querySelector(".inc").checked;
                    const name = row.querySelector(".name").value;
                    const content = row.querySelector(".content").value;
                    node.props.metas.push({include: insert, type: mode, name: name, content: content})
                    break
                }
                case "http-equiv":
                case "property": {
                    const insert = row.querySelector(".inc").checked;
                    const selectname = row.querySelector(".name")
                    const name = selectname.options[selectname.options.selectedIndex].value;
                    const content = row.querySelector(".content").value;
                    node.props.metas.push({include: insert, type: mode, name: name, content: content})
                    break
                }
            }
        }

        closeDialog()
        const dialog = document.getElementById("dialog")
        dialog.style.width = ""
    } else {
        const composant_name = document.getElementById("comp_name").value
        if (composant_name.trim() === "") {
            alert("Le nom de votre composant est obligatoire")
            document.getElementById("comp_name").focus()
            return
        }
        const composant_authorid = document.getElementById("author").value
        const composant_description = document.getElementById("comp_desc").value
        const composant_version = document.getElementById("comp_vers").value
        const composant_icon = document.getElementById("comp_icon").value
        const composant_type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
        const composant_entity = document.getElementById("entity_name").value
        if (composant_entity.trim() === "") {
            alert("Votre composant doit appartenir à une entreprise")
            document.getElementById("entity_name").focus()
            return
        }
        try {
            fetch("/pybee/studio/api/entities.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "getByName",
                    name : composant_entity
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    alert("Nous ne connaissons pas cette entreprise")
                    document.getElementById("entity_name").focus()
                    return
                } else {
                    node.props.name = composant_name
                    node.props.icon = composant_icon
                    node.props.description = composant_description
                    node.props.author_id = composant_authorid
                    node.props.type = composant_type
                    node.props.icon = composant_icon
                    node.props.entity = composant_entity
                    node.props.entity_id = data.id
                    node.props.version = composant_version
                    node.props.active = document.getElementById("active").checked
                    render()
                    closeDialog()
                }
            });
        } catch(e) {
            alert("Erreur réseau : votre composant n'a pas été sauvegardé")
        }
    }
}

const PROPERTY_OPTIONS = [
    { value: "og:title", label: "og Title" },
    { value: "og:type", label: "og Type" },
    { value: "og:image", label: "og Image" },
    { value: "og:image:url", label: "og Image url" },
    { value: "og:image:secure_url", label: "og Image secure url" },
    { value: "og:image:type", label: "og Image type" },
    { value: "og:image:width", label: "og Image width" },
    { value: "og:image:height", label: "og Image height" },
    { value: "og:image:alt", label: "og Image alt" },
    { value: "og:video", label: "og Video" },
    { value: "og:video:url", label: "og Video url" },
    { value: "og:video:secure_url", label: "og Video secure url" },
    { value: "og:video:type", label: "og Video type" },
    { value: "og:video:width", label: "og Video width" },
    { value: "og:video:height", label: "og Video height" },
    { value: "og:audio", label: "og Audio" },
    { value: "og:audio:url", label: "og Audio url" },
    { value: "og:audio:secure_url", label: "og Audio secure url" },
    { value: "og:audio:type", label: "og Audio type" },
    { value: "og:url", label: "og Url" },
    { value: "og:description", label: "og Description" },
    { value: "og:site_name", label: "og Site name" },
    { value: "og:locale", label: "og Locale" },
    { value: "og:locale:alternate", label: "og Alternate locale" },
    { value: "article:section", label: "Article section" },
    { value: "article:published_time", label: "Article published time" },
    { value: "article:modified_time", label: "Article modified time" },
    { value: "article:expiration_time", label: "Article expiration time" },
    { value: "article:author", label: "Article author" },
    { value: "article:tag", label: "Article tag" }
]

const HTTPEQUIV_OPTIONS = [
    { value: "content-security-policy", label: "Content Security Policy" },
    { value: "default-style", label: "Default Style" },
    { value: "refresh", label: "Refresh" }
]