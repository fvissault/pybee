// *******************************************************************************
// popup Button
// *******************************************************************************
function popupButton(node) {
    const id = node.props.id||"" 
    const classes = node.props.classes||""
    const value = node.props.value||""
    const name = node.props.name||""
    const style = node.props.style||""
    const type = node.props.type||""
    const disabled = node.props.disabled||false
    const title = node.props.title||""
    const draggable = node.props.draggable||"auto"    
    const autofocus = node.props.autofocus||false    
    const tabindex = node.props.tabindex||""    

    const form = node.props.form||""
    const formaction = node.props.formaction||""
    const formenctype = node.props.formenctype||""
    const formmethod = node.props.formmethod||""
    const formtarget = node.props.formtarget||""
    const formnovalidate = node.props.formnovalidate||false

    const command = node.props.command||""
    const commandfor = node.props.commandfor||""
    const popovertarget = node.props.popovertarget||""
    const popovertargetaction = node.props.popovertargetaction||""

    const dialog = document.getElementById("dialog")
    dialog.style.width = "1071px"
    const head = document.getElementById("dialogHeader")
    head.innerText = "Paramètres du bouton"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">` + makeIdClasses(id, name, classes, draggable) +
                `<div class="dialog-row">
                    <label for="value">${t("tftype")}</label>
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
                    <label for="inline_style">${t("tfstyle")}</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${style}" id="inline_style"/>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="disabled"${disabled?" checked":""}/>
                    <label for="disabled">${t("tfdisabled")}</label>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="autofocus"${autofocus?" checked":""}/>
                    <label for="autofocus">Autofocus</label>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="title">Infobulle :</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${title}" id="title"/>
                </div>
                <div class="dialog-row">
                    <label for="tabindex">Index pour le parcours par tab :</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${tabindex}" id="tabindex"/>
                </div>
                <div class="dialog-row">
                    <label for="form">Id de formulaire</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${form}" id="form"/>
                </div>
                <div class="dialog-row">
                    <label for="formaction">Action du formulaire :</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${formaction}" id="formaction"/>
                </div>
                <div class="dialog-row">
                    <label for="formenctype">Type d'encodage du formulaire :</label>
                </div>
                <div class="dialog-row">
                    <select id="formenctype"></select>
                </div>
                <div class="dialog-row">
                    <label for="formmethod">Méthode du formulaire :</label>
                </div>
                <div class="dialog-row">
                    <select id="formmethod"></select>
                </div>
                <div class="dialog-row">
                    <label for="formtarget">Cible du formulaire :</label>
                </div>
                <div class="dialog-row">
                    <select id="formtarget"></select>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="formnovalidate"${formnovalidate?" checked":""}/>
                    <label for="formnovalidate">Empêcher la validation du formulaire</label>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="commandfor">Id de l'élément controlé</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${commandfor}" id="commandfor"/>
                </div>
                <div class="dialog-row">
                    <label for="command">Méthode de contrôle :</label>
                </div>
                <div class="dialog-row">
                    <select id="command"></select>
                </div>
                <div class="dialog-row">
                    <label for="popovertarget">Id de la boite de dialogue</label>
                </div>
                <div class="dialog-row">
                    <input type="text" value="${popovertarget}" id="popovertarget"/>
                </div>
                <div class="dialog-row">
                    <label for="popovertargetaction">Action à appliquer sur la boite de dialogue :</label>
                </div>
                <div class="dialog-row">
                    <select id="popovertargetaction"></select>
                </div>
            </div>
        </div>` + makeDialogButtons()

    const selectType = content.querySelector("#type")
    BUTTON_TYPES.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectType.appendChild(o)
    })
    selectType.value = type || "submit"

    const selectEnctype = content.querySelector("#formenctype")
    BUTTON_ENCTYPE.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectEnctype.appendChild(o)
    })
    selectEnctype.value = formenctype || ""

    const selectMethod = content.querySelector("#formmethod")
    BUTTON_METHOD.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectMethod.appendChild(o)
    })
    selectMethod.value = formmethod || ""

    const selectTarget = content.querySelector("#formtarget")
    BUTTON_TARGET.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectTarget.appendChild(o)
    })
    selectTarget.value = formtarget || ""

    const selectCommand = content.querySelector("#command")
    BUTTON_COMMAND.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectCommand.appendChild(o)
    })
    selectCommand.value = command || ""

    const selectPopoverTargetAction = content.querySelector("#popovertargetaction")
    BUTTON_POPOVERTARGETACTION.forEach(opt=>{
        const o = document.createElement("option")
        o.value = opt.value
        o.textContent = opt.label
        selectPopoverTargetAction.appendChild(o)
    })
    selectPopoverTargetAction.value = popovertargetaction || ""

    content.querySelector("#saveprops").onclick = () => {
        saveButtonProps(node)
        tosave = true
        document.getElementById("savebtn").className = "tosave"
    }
}

function saveButtonProps(node){
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
    node.props.type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value
    node.props.disabled = document.getElementById("disabled").checked
    node.props.autofocus = document.getElementById("autofocus").checked
    node.props.draggable = document.getElementById("draggable").options[document.getElementById("draggable").selectedIndex].value
    node.props.form = document.getElementById("form").value.trim()
    node.props.title = document.getElementById("title").value.trim()
    node.props.tabindex = document.getElementById("tabindex").value.trim()
    node.props.formaction = document.getElementById("formaction").value.trim()
    node.props.formenctype = document.getElementById("formenctype").options[document.getElementById("formenctype").selectedIndex].value
    node.props.formmethod = document.getElementById("formmethod").options[document.getElementById("formmethod").selectedIndex].value
    node.props.formtarget = document.getElementById("formtarget").options[document.getElementById("formtarget").selectedIndex].value
    node.props.formnovalidate = document.getElementById("formnovalidate").checked
    node.props.commandfor = document.getElementById("commandfor").value.trim()
    node.props.command = document.getElementById("command").options[document.getElementById("command").selectedIndex].value
    node.props.popovertarget = document.getElementById("popovertarget").value.trim()
    node.props.popovertargetaction = document.getElementById("popovertargetaction").options[document.getElementById("popovertargetaction").selectedIndex].value
     render()
    closeDialog()
}

const BUTTON_TYPES = [
    { value: "submit", label: "Validation" },
    { value: "reset", label: "Réinitialisation" },
    { value: "button", label: "Bouton" }
]

const BUTTON_ENCTYPE = [
    { value: "", label: "Pas d'encodage" },
    { value: "application/x-www-form-urlencoded", label: "Type d'encodage par défaut" },
    { value: "multipart/form-data", label: "Type d'encodage pour découper les données" },
    { value: "text/plain", label: "Type d'encodage texte simple pour le débuggage" }
]

const BUTTON_METHOD = [
    { value: "", label: "Pas de méthode" },
    { value: "post", label: "Données cachées (POST)" },
    { value: "get", label: "Données passées dans l'url (GET)" },
    { value: "dialog", label: "Données passées à une boite de dialogue (DIALOG)" }
]

const BUTTON_TARGET = [
    { value: "", label: "Pas de cible" },
    { value: "_self", label: "La page courante par défaut" },
    { value: "_blank", label: "Page vide" },
    { value: "_parent", label: "Page parente" },
    { value: "_top", label: "Première page" }
]

const BUTTON_POPOVERTARGETACTION = [
    { value: "", label: "Pas d'action" },
    { value: "toggle", label: "Alterner" },
    { value: "show", label: "Montrer" },
    { value: "hide", label: "Cacher" }
]

const BUTTON_COMMAND = [
    { value: "", label: "Pas de commande" },
    { value: "toggle-popover", label: "Alterner" },
    { value: "show-popover", label: "Montrer" },
    { value: "hide-popover", label: "Cacher" },
    { value: "close", label: "Fermer" },
    { value: "request-close", label: "Demande de fermeture" }
]
