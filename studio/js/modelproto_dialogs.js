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
    if (cat == "addtable") popupAddTable()
    if (cat == "addattr") popupAddAttr(currenttable)
    else return "<div>No content</div>"
}

// ----------------------------------------------------------------------------------------------------
// Popup pour l'ajout d'une table dans le workspace
// ----------------------------------------------------------------------------------------------------
function popupAddTable() {
    const content = document.getElementById("dialogContent")
    content.innerHTML = `
        <div class="dialog-section">
            <div class="dialog-row">
                <label for="tablename">Nom de votre table</label>
            </div>
            <div class="dialog-row">
                <input id="tablename" type="text">
            </div>
        </div>
        <div class="dialog-actions">
            <button class="btn btn-primary" onclick="addNewTable()">${t("validate")}</button>
            <button class="btn btn-secondary" onclick="closeDialog()">${t("close")}</button>
        </div>`
}

async function addNewTable() {
    const session = await getSession()
    const tablename = document.getElementById("tablename")

    if (tableNameExists(tablename.value.trim())) {
        alert("Votre table existe déjà")
        tablename.focus()
        return
    }
    const result = validateDatabaseName(tablename.value.trim());

    if (!result.valid) {
        alert(result.message);
        tablename.focus()
        return;
    }

    if (tablename.value.trim() === "") {
        alert("Le nom de votre table est obligatoire")
        tablename.focus()
        return
    } else {
        let newtable = {
            id: `table_${objectCounter}`,
            x: 100,
            y: 50,
            name: normalizeDatabaseName(tablename.value.trim()),
            fields: []
        }
        objectCounter++
        modelRoot.tables.push(newtable)
        modelRoot.objectCounter = objectCounter
        console.log(modelRoot)
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
function popupAddAttr(node) {
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
                        <label for="autoincrement">Incrémentation automatique</label>
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
        selectIndex.value = attrindex || "primary"

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
    if (fieldNameExists(node, document.getElementById("attrname").value.trim())) {
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
    } else {
        // ajout pur et simple
        const newfield = {
            id: `field_${objectCounter}`,
            name: normalizeDatabaseName(document.getElementById("attrname").value.trim()),
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
        renderModel()
    }
    closeDialog()
}

// ----------------------------------------------------------------------------------------------------
// Normalise tous les noms utilisés : transforme l'espace en _
// ----------------------------------------------------------------------------------------------------
function normalizeDatabaseName(name) {
    let normalizedName = name
        .trim()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

    // Un identifiant ne doit pas commencer par un chiffre
    if (/^\d/.test(normalizedName)) {
        normalizedName = `_${normalizedName}`;
    }

    return normalizedName;
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
    const normalizedName = normalizeDatabaseName(name);
    if (!normalizedName) return {valid: false, name: "", message: "Le nom est obligatoire."};
    if (isSqlReservedWord(normalizedName)) return {valid: false, name: normalizedName, message: `"${normalizedName}" est un mot réservé SQL.`};
    return {valid: true, name: normalizedName, message: ""};
}