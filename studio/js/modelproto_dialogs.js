// ----------------------------------------------------------------------------------------------------
// Mécanisme général d'appel des popups
// ----------------------------------------------------------------------------------------------------
function openDialog(cat) {
    buildPopupContent(cat)
    document.getElementById("dialogOverlay").classList.remove("hidden")
}

function closeDialog() {
    document.getElementById("dialogHeader").innerHTML = ""
    document.getElementById("dialogContent").innerHTML = ""
    document.getElementById("dialogOverlay").classList.add("hidden")
}

function buildPopupContent(cat){
    if (cat == "addtable") popupTable()
    if (cat == "renametable") popupTable(currenttable)
    if (cat == "addattr") popupAttr(currenttable)
    if (cat == "addrel") popupRelation()
    else return "<div>No content</div>"
}

// ----------------------------------------------------------------------------------------------------
// Popup pour l'ajout d'une table dans le workspace
// ----------------------------------------------------------------------------------------------------
function popupTable(node = null) {
    let tablename = ""
    if (node) {
        tablename = node.name
    }
    const dialog = document.getElementById("dialog")
    dialog.style.width = "320px"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="tablename">Nom de votre table</label>
            </div>
            <div class="dialog-row">
                <input id="tablename" type="text" value="${tablename}">
            </div>
        </div>
        <div class="dialog-actions">
            <button id="save" class="btn btn-primary">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`

        content.querySelector("#save").onclick = () => {
            addNewTable(node)
            tosave = true
            document.getElementById("savebtn").className = "tosave"
        }
}

async function addNewTable(node) {
    const session = await getSession()
    const tablename = document.getElementById("tablename")

    const result = validateDatabaseName(tablename.value.trim());

    if (!result.valid) {
        alert(result.message);
        tablename.focus()
        return;
    }

    if (tableNameExists(tablename.value.trim(), tablename)) {
        alert("Votre table existe déjà")
        tablename.focus()
        return
    }

    if (tablename.value.trim() === "") {
        alert("Le nom de votre table est obligatoire")
        tablename.focus()
        return
    } else {
        if (node === null) {
            let newtable = {
                id: `table_${objectCounter}`,
                x: 100,
                y: 50,
                name: normalizeName(tablename.value.trim()),
                fields: []
            }
            objectCounter++
            modelRoot.tables.push(newtable)
            modelRoot.objectCounter = objectCounter
            console.log(modelRoot)
        } else {
            node.name = tablename.value.trim()
        }
        tosave = true
        document.getElementById("savebtn").className = "tosave"
        // Tracer les tables du modèle
        renderModel()
    }
    closeDialog()
}

// ----------------------------------------------------------------------------------------------------
// Popup pour l'ajout d'un attribut dans une table
// ----------------------------------------------------------------------------------------------------
function popupAttr(node) {
    // il faut connaitre l'id du field pour avoir le currentField correct
    const currentField = node?.fields.find(field => field.id === currentfield);
    let attrname = ""
    let attrtype = "int"
    let attrindex = ""
    let attrattribute = ""
    let attrcomment = ""
    let attrprecision = ""
    let attrautoincrement = false
    let attrscale = ""
    let attrlength = ""
    let attrvalues = ""
    let attrnullable = false
    if (currentField) {
        attrname = currentField.name||""
        attrtype = currentField.type||""
        attrindex = currentField.index||""
        attrattribute = currentField.attribute||""
        attrcomment = currentField.comment||""
        attrautoincrement = currentField.autoIncrement||false
        attrprecision = currentField.precision||""
        attrscale = currentField.scale||""
        attrlength = currentField.length||""
        attrvalues = currentField.values||""
        attrnullable = currentField.nullable||false
    }
    const dialog = document.getElementById("dialog")
    dialog.style.width = "740px"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="attrname">Nom de l'attribut :</label>
                </div>
                <div class="dialog-row">
                    <input id="attrname" type="text" value="${attrname}">
                </div>
                <div class="dialog-row">
                    <label for="attrtype">Type de l'attribut :</label>
                </div>
                <div class="dialog-row">
                    <select id="attrtype"></select>
                </div>
                <div class="dialog-row">
                    <label for="attrdefault">Valeur par défaut :</label>
                </div>
                <div class="dialog-row">
                    <input id="attrdefault" type="text">
                </div>
                <div class="dialog-row">
                    <label for="attrindex">Index :</label>
                </div>
                <div class="dialog-row">
                    <select id="attrindex"></select>
                </div>
                <div class="dialog-row-with-checkbox">
                    <input type="checkbox" id="nullable"${attrnullable?" checked":""}/>
                    <label for="nullable">Accepte la valeur nulle</label>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div id="length" style="display:none;">
                    <div class="dialog-row">
                        <label for="attrlength">Longueur de l'attribut :</label>
                    </div>
                    <div class="dialog-row">
                        <input id="attrlength" type="text" value="${attrlength}">
                    </div>
                </div>
                <div id="values" style="display:none;">
                    <div class="dialog-row">
                        <label for="attrvalues">Valeurs de l'énumération :</label>
                    </div>
                    <div class="dialog-row">
                        <input id="attrvalues" type="text" value="${attrvalues}">
                    </div>
                </div>
                <div id="scale" style="display:none;">
                    <div class="dialog-row">
                        <label for="attrscale">Echelle de l'attribut :</label>
                    </div>
                    <div class="dialog-row">
                        <input id="attrscale" type="text" value="${attrscale}">
                    </div>
                </div>
                <div id="precision" style="display:none;">
                    <div class="dialog-row">
                        <label for="attrprecision">Précision de l'attribut :</label>
                    </div>
                    <div class="dialog-row">
                        <input id="attrprecision" type="text" value="${attrprecision}">
                    </div>
                </div>
                <div id="attribute" style="display:none;">
                    <div class="dialog-row">
                        <label for="attrattribute">Attribut :</label>
                    </div>
                    <div class="dialog-row">
                        <select id="attrattribute"></select>
                    </div>
                </div>
                <div id="autoincrement" style="display:none;">
                    <div class="dialog-row-with-checkbox">
                        <input type="checkbox" id="attrautoincrement"${attrautoincrement?" checked":""}/>
                        <label for="attrautoincrement">Incrémentation automatique</label>
                    </div>
                </div>
                <div class="dialog-row">
                    <label for="attrcomment">Commentaire :</label>
                </div>
                <div class="dialog-row">
                    <textarea id="attrcomment">${attrcomment}</textarea>
                </div>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="save" class="btn btn-primary">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`

        content.querySelector("#save").onclick = () => {
            addNewAttr(node, currentField)
            tosave = true
            document.getElementById("savebtn").className = "tosave"
        }

        const selectType = content.querySelector("#attrtype")
        ATTRIBUT_TYPES.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.value
            o.textContent = opt.label
            selectType.appendChild(o)
        })
        selectType.value = attrtype || "int"
        refresh(selectType.value)

        selectType.onchange = () => {
            refresh(selectType.value)
        }

        const selectIndex = content.querySelector("#attrindex")
        ATTRIBUT_INDEX.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.value
            o.textContent = opt.label
            selectIndex.appendChild(o)
        })
        selectIndex.value = attrindex || ""

        const selectAttribute = content.querySelector("#attrattribute")
        ATTRIBUT_ATTRIBUTE.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.value
            o.textContent = opt.label
            selectAttribute.appendChild(o)
        })
        selectAttribute.value = attrattribute || ""
}

function refresh(value) {
    document.getElementById("precision").style.display = "none"
    document.getElementById("attrprecision").value = ""
    document.getElementById("scale").style.display = "none"
    document.getElementById("attrscale").value = ""
    document.getElementById("length").style.display = "none"
    document.getElementById("attrlength").value = ""
    document.getElementById("attribute").style.display = "none"
    document.getElementById("autoincrement").style.display = "none"
    document.getElementById("values").style.display = "none"
    if (value === "decimal") {
        document.getElementById("precision").style.display = "block"
        document.getElementById("scale").style.display = "block"
    }
    if (value === "int") {
        document.getElementById("attrlength").value = "11"
        document.getElementById("attribute").style.display = "block"
        document.getElementById("autoincrement").style.display = "block"
        document.getElementById("length").style.display = "block"
    }
    if (value === "varchar") {
        document.getElementById("attrlength").value = "50"
        document.getElementById("length").style.display = "block"
    }
    if (value === "enum") {
        document.getElementById("values").style.display = "block"
    }
}

function addNewAttr(node, field) {
    // il faut connaitre l'id du field pour avoir le currentField correct
    const currentField = field
    if (document.getElementById("attrname").value.trim() === "") {
        alert("Le nom de votre attribut est obligatoire")
        document.getElementById("attrname").focus()
        return
    }
    if (fieldNameExists(node, document.getElementById("attrname").value.trim(), currentField?currentField.id:null)) {
        alert("Votre attribut existe déjà")
        document.getElementById("attrname").focus()
        return
    }
    const result = validateDatabaseName(document.getElementById("attrname").value.trim());

    if (!result.valid) {
        alert(result.message);
        document.getElementById("attrname").focus()
        return;
    }
    
    if (currentField) {
        // modification du champ
        currentField.name = normalizeName(document.getElementById("attrname").value.trim())
        currentField.type = document.getElementById("attrtype").options[document.getElementById("attrtype").selectedIndex].value
        currentField.length = document.getElementById("attrlength").value
        currentField.precision = document.getElementById("attrprecision").value
        currentField.scale = document.getElementById("attrscale").value
        currentField.nullable = document.getElementById("nullable").checked?true:false
        currentField.defaultValue = document.getElementById("attrdefault").value
        currentField.index = document.getElementById("attrindex").options[document.getElementById("attrindex").selectedIndex].value
        currentField.autoIncrement = document.getElementById("attrautoincrement").checked?true:false
        currentField.attribute = document.getElementById("attrattribute").options[document.getElementById("attrattribute").selectedIndex].value
        currentField.values = document.getElementById("attrvalues").value
        currentField.comment = document.getElementById("attrcomment").value
    } else {
        // ajout pur et simple
        const newfield = {
            id: `field_${objectCounter}`,
            name: normalizeName(document.getElementById("attrname").value.trim()),
            type: document.getElementById("attrtype").options[document.getElementById("attrtype").selectedIndex].value,
            length: document.getElementById("attrlength").value,
            precision: document.getElementById("attrprecision").value,
            scale: document.getElementById("attrscale").value,
            nullable: document.getElementById("nullable").checked?true:false,
            defaultValue: document.getElementById("attrdefault").value,
            index: document.getElementById("attrindex").options[document.getElementById("attrindex").selectedIndex].value,
            autoIncrement: document.getElementById("attrautoincrement").checked?true:false,
            attribute: document.getElementById("attrattribute").options[document.getElementById("attrattribute").selectedIndex].value,
            values: document.getElementById("attrvalues").value, // uniquement pour le cas de l'énumération
            comment: document.getElementById("attrcomment").value
        }
        objectCounter++
        node.fields.push(newfield)
    }
    renderModel()
    closeDialog()
}

// ----------------------------------------------------------------------------------------------------
// Popup pour l'ajout d'une relation entre 2 tables
// ----------------------------------------------------------------------------------------------------
function popupRelation() {
    const head = document.getElementById("dialogHeader")
    head.innerText = "Ajouter une nouvelle relation"

    // il faut connaitre l'id du field pour avoir le currentField correct
    const currentRelation = modelRoot?.relations.find(relation => relation.id === currentrelation);
    let relsourcetableid = ""
    let relsourcefieldid = ""
    let relsourcecardinality = ""
    let relsourcerole = ""
    let reltargettableid = ""
    let reltargetfieldid = ""
    let reltargetcardinality = ""
    let reltargetrole = ""
    let relforeignkeyside = ""
    let relcomment = ""
    if (currentRelation) {
        head.innerText = "Modifier une relation"
        relsourcetableid = currentRelation.source.tableId||""
        relsourcefieldid = currentRelation.source.fieldId||""
        relsourcecardinality = currentRelation.source.cardinality||""
        relsourcerole = currentRelation.source.role||""
        reltargettableid = currentRelation.target.tableId||""
        reltargetfieldid = currentRelation.target.fieldId||""
        reltargetcardinality = currentRelation.target.cardinality||""
        reltargetrole = currentRelation.target.role||""
        relforeignkeyside = currentRelation.foreignKeySide||""
        relcomment = currentRelation.comment||""
    }
    const dialog = document.getElementById("dialog")
    dialog.style.width = "740px"
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="relsourcetableid">Table source :</label>
                </div>
                <div class="dialog-row">
                    <select id="relsourcetableid"></select>
                </div>
                <div class="dialog-row">
                    <label for="relsourcefieldid">Attribut source :</label>
                </div>
                <div class="dialog-row">
                    <select id="relsourcefieldid"></select>
                </div>
                <div class="dialog-row">
                    <label for="relsourcecardinality">Cardinalité de la source :</label>
                </div>
                <div class="dialog-row">
                    <select id="relsourcecardinality"></select>
                </div>
                <div class="dialog-row">
                    <label for="relsourcerole">Rôle de la source :</label>
                </div>
                <div class="dialog-row">
                    <input id="relsourcerole" type="text" value="${relsourcerole}">
                </div>
                <div id="fkside" sytle="display:none;">
                    <div class="dialog-row">
                        <label for="relforeignkeyside">Extrémité de la clé étrangère :</label>
                    </div>
                    <div class="dialog-row">
                        <select id="relforeignkeyside">
                            <option value="">Aucune extrémité</option>
                            <option value="source">Source</option>
                            <option value="target">Cible</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-column">
            <div class="dialog-section">
                <div class="dialog-row">
                    <label for="reltargettableid">Table cible :</label>
                </div>
                <div class="dialog-row">
                    <select id="reltargettableid"></select>
                </div>
                <div class="dialog-row">
                    <label for="reltargetfieldid">Attribut cible :</label>
                </div>
                <div class="dialog-row">
                    <select id="reltargetfieldid"></select>
                </div>
                <div class="dialog-row">
                    <label for="reltargetcardinality">Cardinalité de la cible :</label>
                </div>
                <div class="dialog-row">
                    <select id="reltargetcardinality"></select>
                </div>
                <div class="dialog-row">
                    <label for="reltargetrole">Rôle de la cible :</label>
                </div>
                <div class="dialog-row">
                    <input id="reltargetrole" type="text" value="${reltargetrole}">
                </div>
                <div class="dialog-row">
                    <label for="relcomment">Commentaire :</label>
                </div>
                <div class="dialog-row">
                    <textarea id="relcomment">${relcomment}</textarea>
                </div>
            </div>
        </div>
        <div class="dialog-actions">
            <button id="save" class="btn btn-primary">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`

        content.querySelector("#save").onclick = () => {
            addRelation(currentRelation)
            tosave = true
            document.getElementById("savebtn").className = "tosave"
        }

        const relstableid = content.querySelector("#relsourcetableid")
        modelRoot.tables.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.id
            o.textContent = opt.name
            relstableid.appendChild(o)
        })
        if (relsourcetableid === "") {
            relstableid.options.selectedIndex = 0
        } else {
            relstableid.value = relsourcetableid
        }
        refreshFieldElement(relstableid, content, "#relsourcefieldid")
        const relsourcefield = content.querySelector("#relsourcefieldid")
        if (relsourcefieldid === "") {
            relsourcefield.options.selectedIndex = 0
        } else {
            relsourcefield.value = relsourcefieldid
        }
        relstableid.onchange = () => {
            refreshFieldElement(relstableid, content, "#relsourcefieldid")
        }

        const relttableid = content.querySelector("#reltargettableid")
        modelRoot.tables.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.id
            o.textContent = opt.name
            relttableid.appendChild(o)
        })
        if (reltargettableid === "") {
            relttableid.options.selectedIndex = 0
        } else {
            relttableid.value = reltargettableid
        }
        refreshFieldElement(relttableid, content, "#reltargetfieldid")
        const reltargetfield = content.querySelector("#reltargetfieldid")
        if (reltargetfieldid === "") {
            reltargetfield.options.selectedIndex = 0
        } else {
            reltargetfield.value = reltargetfieldid
        }

        relttableid.onchange = () => {
            refreshFieldElement(relttableid, content, "#reltargetfieldid")
        }

        const selectSourceCardinality = content.querySelector("#relsourcecardinality")
        CARDINALITY.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.value
            o.textContent = opt.label
            selectSourceCardinality.appendChild(o)
        })
        selectSourceCardinality.value = relsourcecardinality || "0..1"

        const selectTargetCardinality = content.querySelector("#reltargetcardinality")
        CARDINALITY.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.value
            o.textContent = opt.label
            selectTargetCardinality.appendChild(o)
        })
        selectTargetCardinality.value = reltargetcardinality || "0..1"

        refreshForeignKeySideElement(content)
        selectSourceCardinality.onchange = () => {
            refreshForeignKeySideElement(content)
        }
        selectTargetCardinality.onchange = () => {
            refreshForeignKeySideElement(content)
        }

}

function refreshFieldElement(reltableElement, content, relfieldId) {
    if (reltableElement.options.selectedIndex !== -1) {
        const selectedtableId = reltableElement.options[reltableElement.options.selectedIndex].value
        const selectedtable = modelRoot.tables.find(table => table.id === selectedtableId);
        const relationfieldid = content.querySelector(relfieldId)
        relationfieldid.options.length = 0
        selectedtable.fields.forEach(opt=>{
            const o = document.createElement("option")
            o.value = opt.id
            o.textContent = opt.name
            relationfieldid.appendChild(o)
        })
    }
}

function refreshForeignKeySideElement(content) {
    const relforeignkeyside = content.querySelector("#relforeignkeyside")
    relforeignkeyside.value = ""
    const fkside = content.querySelector("#fkside")
    const selectSourceCardinality = content.querySelector("#relsourcecardinality")
    const selectTargetCardinality = content.querySelector("#reltargetcardinality")
    const sourceCardinality = selectSourceCardinality.options[selectSourceCardinality.options.selectedIndex].value
    const targetCardinality = selectTargetCardinality.options[selectTargetCardinality.options.selectedIndex].value
    if ((sourceCardinality === "0..1" || sourceCardinality === "1..1") && (targetCardinality === "0..1" || targetCardinality === "1..1")) {
        fkside.style.display = "block"
    } else {
        fkside.style.display = "none"
    }
    if (sourceCardinality === "0..n" || sourceCardinality === "1..n") {
        relforeignkeyside.value = "source"
    }
    if (targetCardinality === "0..n" || targetCardinality === "1..n") {
        relforeignkeyside.value = "target"
    }
    if ((sourceCardinality === "0..n" || sourceCardinality === "1..n")  && (targetCardinality === "0..n" || targetCardinality === "1..n")) {
        relforeignkeyside.value = ""
    }
}

const CARDINALITY = [
    { value: "0..1", label: "0..1 — Zéro ou un" },
    { value: "1..1", label: "1..1 — Exactement un" },
    { value: "0..n", label: "0..n — Zéro ou plusieurs" },
    { value: "1..n", label: "1..n — Un ou plusieurs" }
]

function addRelation(node) {
    // contrôles indispensables
    if (document.getElementById("relsourcefieldid").options[document.getElementById("relsourcefieldid").selectedIndex].value === document.getElementById("reltargetfieldid").options[document.getElementById("reltargetfieldid").selectedIndex].value) {
            alert("L'attribut de la source ne peut pas identique à l'attribut de la cible")
            return
        }
    if (node) {
        // modification de la relation
        node.source.tableId = document.getElementById("relsourcetableid").options[document.getElementById("relsourcetableid").selectedIndex].value
        node.source.fieldId = document.getElementById("relsourcefieldid").options[document.getElementById("relsourcefieldid").selectedIndex].value
        node.source.cardinality = document.getElementById("relsourcecardinality").options[document.getElementById("relsourcecardinality").selectedIndex].value
        node.source.role = document.getElementById("relsourcerole").value
        node.target.tableId = document.getElementById("reltargettableid").options[document.getElementById("reltargettableid").selectedIndex].value
        node.target.fieldId = document.getElementById("reltargetfieldid").options[document.getElementById("reltargetfieldid").selectedIndex].value
        node.target.cardinality = document.getElementById("reltargetcardinality").options[document.getElementById("reltargetcardinality").selectedIndex].value
        node.target.role = document.getElementById("reltargetrole").value
        node.foreignKeySide = document.getElementById("relforeignkeyside").options[document.getElementById("relforeignkeyside").selectedIndex].value
        node.comment = document.getElementById("relcomment").value
    } else {
        // ajout pur et simple
        const newrelation = {
            id: `relation_${objectCounter}`,
            source : {
                tableId: document.getElementById("relsourcetableid").options[document.getElementById("relsourcetableid").selectedIndex].value,
                fieldId: document.getElementById("relsourcefieldid").options[document.getElementById("relsourcefieldid").selectedIndex].value,
                cardinality: document.getElementById("relsourcecardinality").options[document.getElementById("relsourcecardinality").selectedIndex].value,
                role: document.getElementById("relsourcerole").value
            },
            target : {
                tableId: document.getElementById("reltargettableid").options[document.getElementById("reltargettableid").selectedIndex].value,
                fieldId: document.getElementById("reltargetfieldid").options[document.getElementById("reltargetfieldid").selectedIndex].value,
                cardinality: document.getElementById("reltargetcardinality").options[document.getElementById("reltargetcardinality").selectedIndex].value,
                role: document.getElementById("reltargetrole").value
            },
            foreignKeySide : document.getElementById("relforeignkeyside").options[document.getElementById("relforeignkeyside").selectedIndex].value,
            comment: document.getElementById("relcomment").value
        }
        objectCounter++
        modelRoot.relations.push(newrelation)
        console.log(newrelation)
    }
    renderRelations()
    renderModel()
    closeDialog()
}

// ----------------------------------------------------------------------------------------------------
// Interdit les doublons de noms des tables
// ----------------------------------------------------------------------------------------------------
function tableNameExists(name, excludedTableId = null) {
    const normalizedName = name.toLowerCase();

    return modelRoot.tables.some(table =>
        table.id !== excludedTableId &&
        table.name.toLowerCase() === normalizedName
    );
}

// ----------------------------------------------------------------------------------------------------
// Interdit les doublons de noms des attributs
// ----------------------------------------------------------------------------------------------------
function fieldNameExists(table, name, excludedFieldId = null) {
    const normalizedName = name.toLowerCase();

    return table.fields.some(field =>
        field.id !== excludedFieldId &&
        field.name.toLowerCase() === normalizedName
    );
}

// ----------------------------------------------------------------------------------------------------
// Les tableaux nécessaires à la création des select dans les popups
// ----------------------------------------------------------------------------------------------------
const ATTRIBUT_TYPES = [
    { value: "tinyint", label: "Booléen" },
    { value: "int", label: "Entier" },
    { value: "varchar", label: "Chaine de caractères" },
    { value: "decimal", label: "Nombre à décimale" },
    { value: "text", label: "Texte" },
    { value: "date", label: "Date" },
    { value: "time", label: "Heure" },
    { value: "datetime", label: "Date et heure" },
    { value: "timestamp", label: "Timestamp" },
    { value: "enum", label: "Enumération" }
]

const ATTRIBUT_INDEX = [
    { value: "", label: "Pas d'index" },
    { value: "primary", label: "🔑 Clé primaire" },
    { value: "unique", label: "Clé unique" },
    { value: "index", label: "Index" }
]

const ATTRIBUT_ATTRIBUTE = [
    { value: "", label: "Pas d'attribut" },
    { value: "binary", label: "Binaire" },
    { value: "unsigned", label: "Non signé" }
]

const SQL_RESERVED_WORDS = new Set(`
    ACCESSIBLE ADD ALL ALTER ANALYZE AND AS ASC ASENSITIVE
    BEFORE BETWEEN BIGINT BINARY BLOB BOTH BY
    CALL CASCADE CASE CHANGE CHAR CHARACTER CHECK COLLATE COLUMN
    CONDITION CONSTRAINT CONTINUE CONVERSION CONVERT CREATE CROSS
    CURRENT_DATE CURRENT_ROLE CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER
    CURSOR DATABASE DATABASES
    DAY_HOUR DAY_MICROSECOND DAY_MINUTE DAY_SECOND
    DEC DECIMAL DECLARE DEFAULT DELAYED DELETE DESC DESCRIBE
    DETERMINISTIC DISTINCT DISTINCTROW DIV DOUBLE DROP DUAL
    EACH ELSE ELSEIF ENCLOSED ESCAPED EXCEPT EXISTS EXIT EXPLAIN
    FALSE FETCH FLOAT FLOAT4 FLOAT8 FOR FORCE FOREIGN FROM FULLTEXT
    GENERAL GRANT GROUP HAVING HIGH_PRIORITY
    HOUR_MICROSECOND HOUR_MINUTE HOUR_SECOND
    IF IGNORE IN INDEX INFILE INNER INOUT INSENSITIVE INSERT
    INT INT1 INT2 INT3 INT4 INT8 INTEGER INTERSECT INTERVAL INTO IS ITERATE
    JOIN KEY KEYS KILL LEADING LEAVE LEFT LIKE LIMIT LINEAR LINES LOAD
    LOCALTIME LOCALTIMESTAMP LOCK LONG LONGBLOB LONGTEXT LOOP LOW_PRIORITY
    MATCH MAXVALUE MEDIUMBLOB MEDIUMINT MEDIUMTEXT MIDDLEINT
    MINUTE_MICROSECOND MINUTE_SECOND MOD MODIFIES NATURAL NOT
    NO_WRITE_TO_BINLOG NULL NUMERIC OFFSET ON OPTIMIZE OPTION OPTIONALLY
    OR ORDER OUT OUTER OUTFILE OVER PARTITION PRECISION PRIMARY PROCEDURE
    PURGE RANGE READ READS READ_WRITE REAL RECURSIVE REFERENCES REGEXP
    RELEASE RENAME REPEAT REPLACE REQUIRE RESIGNAL RESTRICT RETURN
    RETURNING REVOKE RIGHT RLIKE ROW_NUMBER ROWS
    SCHEMA SCHEMAS SECOND_MICROSECOND SELECT SENSITIVE SEPARATOR SET
    SHOW SIGNAL SLOW SMALLINT SPATIAL SPECIFIC SQL SQLEXCEPTION SQLSTATE
    SQLWARNING SQL_BIG_RESULT SQL_CALC_FOUND_ROWS SQL_SMALL_RESULT SSL
    STARTING STRAIGHT_JOIN TABLE TERMINATED THEN
    TINYBLOB TINYINT TINYTEXT TO TO_DATE TRAILING TRIGGER TRUE
    UNDO UNION UNIQUE UNLOCK UNSIGNED UPDATE USAGE USE USING
    UTC_DATE UTC_TIME UTC_TIMESTAMP VALUES VARBINARY VARCHAR VARCHARACTER
    VARYING VECTOR WHEN WHERE WHILE WINDOW WITH WRITE XOR YEAR_MONTH ZEROFILL
`.trim().split(/\s+/));

function isSqlReservedWord(name) {
    return SQL_RESERVED_WORDS.has(name.toUpperCase());
}

function validateDatabaseName(name) {
    const normalizedName = normalizeName(name);
    if (!normalizedName) return {valid: false, name: "", message: "Le nom est obligatoire."};
    if (isSqlReservedWord(normalizedName)) return {valid: false, name: normalizedName, message: `"${normalizedName}" est un mot réservé SQL.`};
    return {valid: true, name: normalizedName, message: ""};
}