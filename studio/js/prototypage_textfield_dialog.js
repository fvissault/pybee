// *******************************************************************************
// popup Textfield
// *******************************************************************************
function popupTextfield(node) {
    const style = node.props.style||""
    const id = node.props.id||""
    const classes = node.props.classes||""
    const value = node.props.value||""
    const name = node.props.name||""
    const type = node.props.type||""
    const placeholder = node.props.placeholder||""
    const disabled = node.props.disabled||false
    const readonly = node.props.readonly||false
    const required = node.props.required||false
    const autofocus = node.props.autofocus||false
    const autocomplete = node.props.autocomplete||false
    const form = node.props.form||""
    const list = node.props.list||""
    const title = node.props.title||""
    const tabindex = node.props.tabindex||""
    const draggable = node.props.draggable||"auto"

    const customProperties = {
        "min": node.props.min||"",
        "max": node.props.max||"",
        "step": node.props.step||"",
        "maxlength": node.props.maxlength||"",
        "minlength": node.props.minlength||"",
        "pattern": node.props.pattern||"",
        "size": node.props.size||"",
        "checked": node.props.checked||false,
        "multiple": node.props.multiple||false,
        "accept": node.props.accept||"", // peut prendre les valeurs : image/*, image/png, image/jpeg, .pdf, audio/*, video/*
        "capture": node.props.capture||"", // peut prendre les valeurs : user ou environment et est associé à accept
        "formaction": node.props.formaction||"",
        "formenctype": node.props.formenctype||"",
        "formmethod": node.props.formmethod||"",
        "formnovalidate": node.props.formnovalidate||false,
        "formtarget": node.props.formtarget||"",
        "src": node.props.src||"",
        "alt": node.props.alt||"",
        "width": node.props.width||"",
        "height": node.props.height||""
    }


    const dialog = document.getElementById("dialog")
    dialog.style.width = "1071px"
    const head = document.getElementById("dialogHeader")
    head.innerText = t("tftitle")
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
                `<div class="dialog-row">
                    <label for="type">${t("tftype")}</label>
                </div>
                <div class="dialog-row">
                    <select id="type"></select>
                </div>
                <div class="dialog-row">
                    <label for="value">${t("tfinitialval")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${value}" id="value"/>
                </div>
                <div class="dialog-row">
                    <label for="inline_style">${t("style")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${style}" id="inline_style"/>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="placeholder">${t("tfplaceholder")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${placeholder}" id="placeholder"/>
                </div>
                <div class="dialog-row">
                    <label for="form">Id de formulaire</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${form}" id="form"/>
                </div>
                <div class="dialog-row">
                    <label for="list">Id de liste de données</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${list}" id="list"/>
                </div>
                <div class="dialog-row">
                    <label for="title">Infobulle</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${title}" id="title"/>
                </div>
                <div class="dialog-row">
                    <label for="tabindex">Index pour le parcours par tab</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${tabindex}" id="tabindex"/>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="disabled"${disabled?" checked":""}/>
                    <label for="disabled">${t("tfdisabled")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="readonly"${readonly?" checked":""}/>
                    <label for="readonly">${t("tfreadonly")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="required"${required?" checked":""}/>
                    <label for="required">${t("tfrequired")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="autofocus"${autofocus?" checked":""}/>
                    <label for="autofocus">Autofocus</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="autocomplete"${autocomplete?" checked":""}/>
                    <label for="autocomplete">Autocompletion</label>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div id="fieldssupp"></div>
            </div>
        </div>` + makeDialogButtons()

    const selectType = content.querySelector("#type")
    TEXTFIELD_TYPES.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectType.appendChild(o)
    })
    selectType.value = type || "text"

    selectType.onchange = () => {
        addfields(resetCustomProperties(customProperties))
    }

    addfields(customProperties)    


    content.querySelector("#saveprops").onclick = () => {
        saveTextfieldProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveTextfieldProps(node) {
    const id = document.getElementById("id").value
    node.props.id = id.trim()

    if (id.trim() == "") {
        node.css = []
    } else {
        node.css = [{name: id.trim(), type: "id", values: []}]
    }

    node.props.classes = document.getElementById("classes").value.trim()
    node.props.style = document.getElementById("inline_style").value.trim()
    node.props.value = document.getElementById("value").value.trim()
    node.props.name = document.getElementById("name").value.trim()
    node.props.placeholder = document.getElementById("placeholder").value.trim()
    node.props.type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
    node.props.disabled = document.getElementById("disabled").checked
    node.props.readonly = document.getElementById("readonly").checked
    node.props.required = document.getElementById("required").checked
    node.props.autofocus = document.getElementById("autofocus").checked
    node.props.autocomplete = document.getElementById("autocomplete").checked
    node.props.form = document.getElementById("form").value.trim()
    node.props.list = document.getElementById("list").value.trim()
    node.props.title = document.getElementById("title").value.trim()
    node.props.tabindex = document.getElementById("tabindex").value.trim()
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value
    if (document.getElementById("min")) node.props.min = document.getElementById("min").value.trim()
    if (document.getElementById("max")) node.props.max = document.getElementById("max").value.trim()
    if (document.getElementById("step")) node.props.step = document.getElementById("step").value.trim()
    if (document.getElementById("checked")) node.props.checked = document.getElementById("checked").checked
    if (document.getElementById("maxlength")) node.props.maxlength = document.getElementById("maxlength").value.trim()
    if (document.getElementById("minlength")) node.props.minlength = document.getElementById("minlength").value.trim()
    if (document.getElementById("pattern")) node.props.pattern = document.getElementById("pattern").value.trim()
    if (document.getElementById("size")) node.props.size = document.getElementById("size").value.trim()
    if (document.getElementById("multiple")) node.props.multiple = document.getElementById("multiple").checked
    if (document.getElementById("accept")) node.props.accept = document.getElementById("accept").value.trim()
    if (document.getElementById("capture")) node.props.capture = document.getElementById("capture").value.trim()
    if (document.getElementById("formaction")) node.props.formaction = document.getElementById("formaction").value.trim()
    if (document.getElementById("formenctype")) node.props.formenctype = document.getElementById("formenctype").options[document.getElementById("formenctype").selectedIndex].value
    if (document.getElementById("formmethod")) node.props.formmethod = document.getElementById("formmethod").options[document.getElementById("formmethod").selectedIndex].value
    if (document.getElementById("formtarget")) node.props.formtarget = document.getElementById("formtarget").options[document.getElementById("formtarget").selectedIndex].value
    if (document.getElementById("formnovalidate")) node.props.formnovalidate = document.getElementById("formnovalidate").checked
    if (document.getElementById("src")) node.props.src = document.getElementById("src").value.trim()
    if (document.getElementById("alt")) node.props.alt = document.getElementById("alt").value.trim()
    if (document.getElementById("width")) node.props.width = document.getElementById("width").value.trim()
    if (document.getElementById("height")) node.props.height = document.getElementById("height").value.trim()
     render()
    closeDialog()
}

function createInputField(container, label, inputid, inputvalue) {
    const row = document.createElement("div")
    row.className = "dialog-row"
    const l = document.createElement("label")
    l.for = inputid
    l.textContent = label
    row.appendChild(l)
    container.appendChild(row)

    const rowinput = document.createElement("div")
    rowinput.className = "dialog-row"
    const i = document.createElement("input")
    i.type = "text"
    i.id = inputid
    i.value = inputvalue
    rowinput.appendChild(i)
    container.appendChild(rowinput)
}

function createCheckField(container, label, inputid, inputvalue) {
    const row = document.createElement("div")
    row.className = "dialog-row-with-checkbox"
    const input = document.createElement("input")
    input.type = "checkbox"
    input.id = inputid
    input.checked = inputvalue
    row.appendChild(input)
    const labelcheck = document.createElement("label")
    labelcheck.for = inputid
    labelcheck.textContent = label
    row.appendChild(labelcheck)
    container.appendChild(row)
}

function createSelectField(container, label, selectid) {
    const labelrow = document.createElement("div")
    labelrow.className = "dialog-row"
    const l = document.createElement("label")
    l.for = selectid
    l.textContent = label
    labelrow.appendChild(l)
    container.appendChild(labelrow)

    const row = document.createElement("div")
    row.className = "dialog-row"
    const s = document.createElement("select")
    s.id = selectid
    row.appendChild(s)
    container.appendChild(row)
}

function addfields(customprop) {
    const fieldsupp = document.getElementById("fieldssupp")
    fieldsupp.textContent = ""
    const choice = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
    switch(choice) {
        case "search":
        case "tel":
        case "url":
        case "password":
        case "text": {
            createInputField(fieldsupp, "Longueur minimale :", "minlength", customprop.minlength)
            createInputField(fieldsupp, t("tflongmax"), "maxlength", customprop.maxlength)
            createInputField(fieldsupp, "Pattern", "pattern", customprop.pattern)
            createInputField(fieldsupp, "Size", "size", customprop.size)
            break
        }
        case "email": {
            createInputField(fieldsupp, "Longueur minimale :", "minlength", customprop.minlength)
            createInputField(fieldsupp, t("tflongmax"), "maxlength", customprop.maxlength)
            createInputField(fieldsupp, "Pattern :", "pattern", customprop.pattern)
            createInputField(fieldsupp, "Size:", "size", customprop.size)
            createCheckField(fieldsupp, "Multiple", "multiple", customprop.multiple)
            break
        }
        case "datetime-local":
        case "time":
        case "month":
        case "date":
        case "range":
        case "number": {
            createInputField(fieldsupp, "Borne inférieure :", "min", customprop.min)
            createInputField(fieldsupp, "Borne supérieure :", "max", customprop.max)
            createInputField(fieldsupp, "Pas :", "step", customprop.step)
            break
        }
        case "radio":
        case "checkbox": {
            createCheckField(fieldsupp, "Coché", "checked", customprop.checked)
            break
        }
        case "file": {
            createInputField(fieldsupp, "Fichiers acceptés :", "accept", customprop.accept)
            createInputField(fieldsupp, "Fichiers issus d'une capture :", "capture", customprop.capture)
            createCheckField(fieldsupp, "Multiple", "multiple", customprop.multiple)
            break
        }
        case "submit": {
            createInputField(fieldsupp, "Action du formulaire :", "formaction", customprop.formaction)
            createSelectField(fieldsupp, "Type d'encodage du formulaire :", "formenctype")
            const selectEnctype = document.getElementById("formenctype")
            TEXTFIELD_ENCTYPE.forEach(opt=>{
                const o = document.createElement("option")
                o.value = opt.value
                o.textContent = opt.label
                selectEnctype.appendChild(o)
            })
            selectEnctype.value = customprop.formenctype || ""
            createSelectField(fieldsupp, "Méthode du formulaire :", "formmethod")
            const selectMethod = document.getElementById("formmethod")
            TEXTFIELD_METHOD.forEach(opt=>{
                const o = document.createElement("option")
                o.value = opt.value
                o.textContent = opt.label
                selectMethod.appendChild(o)
            })
            selectMethod.value = customprop.formmethod || ""
            createSelectField(fieldsupp, "Cible du formulaire :", "formtarget")
            const selectTarget = document.getElementById("formtarget")
            TEXTFIELD_TARGET.forEach(opt=>{
                const o = document.createElement("option")
                o.value = opt.value
                o.textContent = opt.label
                selectTarget.appendChild(o)
            })
            selectTarget.value = customprop.formtarget || ""
            createCheckField(fieldsupp, "Pas de validation possible", "formnovalidate", customprop.formnovalidate)
            break
        }
        case "image": {
            createInputField(fieldsupp, "Source :", "src", customprop.src)
            createInputField(fieldsupp, "Alternative :", "alt", customprop.alt)
            createInputField(fieldsupp, "Largeur de l'image :", "width", customprop.width)
            createInputField(fieldsupp, "Hateur de l'image :", "height", customprop.height)
            break
        }
    }
}
    
function resetCustomProperties(customProperties) {
    customProperties.min = ""
    customProperties.max = ""
    customProperties.step = ""
    customProperties.maxlength = ""
    customProperties.minlength = ""
    customProperties.pattern = ""
    customProperties.size = ""
    customProperties.checked = false
    customProperties.multiple = false
    customProperties.accept = ""
    customProperties.capture = ""
    customProperties.formaction = ""
    customProperties.formenctype = ""
    customProperties.formmethod = ""
    customProperties.formnovalidate = false
    customProperties.formtarget = ""
    customProperties.src = ""
    customProperties.alt = ""
    customProperties.width = ""
    customProperties.height = ""
    return customProperties
}

const TEXTFIELD_TYPES = [
    { value: "text", label: t("tftype1") },
    { value: "password", label: t("tftype2") },
    { value: "file", label: t("tftype3") },
    { value: "button", label: t("tftype4") },
    { value: "color", label: t("tftype5") },
    { value: "date", label: t("tftype6") },
    { value: "datetime-local", label: t("tftype7") },
    { value: "email", label: t("tftype8") },
    { value: "hidden", label: t("tftype9") },
    { value: "checkbox", label: t("tftype10") },
    { value: "image", label: t("tftype11") },
    { value: "month", label: t("tftype12") },
    { value: "number", label: t("tftype13") },
    { value: "radio", label: t("tftype14") },
    { value: "range", label: t("tftype15") },
    { value: "reset", label: t("tftype16") },
    { value: "search", label: t("tftype17") },
    { value: "submit", label: t("tftype18") },
    { value: "tel", label: t("tftype19") },
    { value: "time", label: t("tftype20") },
    { value: "url", label: t("tftype21") }
]

const TEXTFIELD_ENCTYPE = [
    { value: "", label: "Pas d'encodage" },
    { value: "application/x-www-form-urlencoded", label: "Type d'encodage par défaut" },
    { value: "multipart/form-data", label: "Type d'encodage pour découper les données" },
    { value: "text/plain", label: "Type d'encodage texte simple pour le débuggage" }
]

const TEXTFIELD_METHOD = [
    { value: "", label: "Pas de méthode" },
    { value: "post", label: "Données cachées (POST)" },
    { value: "get", label: "Données passées dans l'url (GET)" },
    { value: "dialog", label: "Données passées à une boite de dialogue (DIALOG)" }
]

const TEXTFIELD_TARGET = [
    { value: "", label: "Pas de cible" },
    { value: "_self", label: "La page courante par défaut" },
    { value: "_blank", label: "Page vide" },
    { value: "_parent", label: "Page parente" },
    { value: "_top", label: "Première page" }
]

