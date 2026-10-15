/**
 * Génère le SQL du modèle dans une base existante.
 * Ne modifie pas modelRoot.
 *
 * @param {"mysql"|"pgsql"} typeDb
 * @param {Object} model
 * @returns {string}
 */
function generationModel(typeDb, model = modelRoot) {
    const db = String(typeDb).toLowerCase();

    if (!["mysql", "pgsql"].includes(db)) throw new Error("Type de base inconnu : " + typeDb);
    const mysql = db === "mysql";
    const fail = message => { throw new Error(message); };

    // Protection des noms de tables, colonnes et contraintes.
    const quote = value => {
        if (typeof value !== "string" || !value.trim() || /[\u0000-\u001f]/.test(value)) fail("Identifiant invalide");
        const maxLength = mysql ? 64 : 63;
        if (new TextEncoder().encode(value).length > maxLength) fail("Identifiant trop long : " + value);
        const delimiter = mysql ? "`" : '"';
        return (delimiter + value.replaceAll(delimiter, delimiter + delimiter) + delimiter);
    };

    function relationConstraintName(prefix, relation, parentName, childName) {
        const maxBytes = mysql ? 64 : 63;
        const encoder = new TextEncoder();
        if (!relation.id) fail("Identifiant manquant pour une relation");
        const suffix = "_" + String(relation.id);
        const start = prefix + "_";
        let tablesPart = parentName + "_" + childName;
        if (encoder.encode(start + suffix).length >= maxBytes) fail("Identifiant de relation trop long : " + relation.id);
        while (encoder.encode(start + tablesPart + suffix).length > maxBytes) {
            // Retire un caractère Unicode complet.
            const characters = Array.from(tablesPart);
            characters.pop();
            tablesPart = characters.join("");
        }
        return start + tablesPart + suffix;
    }

    // Littéral SQL pour les valeurs textuelles.
    const literal = value => {
        if (mysql) {
            const hex = Array.from(new TextEncoder().encode(String(value)), byte => byte.toString(16).padStart(2, "0")).join("");
            return "CONVERT(X'" + hex + "' USING utf8mb4)";
        }
        return ("E'" + String(value).replaceAll("\\", "\\\\").replaceAll("'", "''") + "'");
    };
    const present = value => value !== "" && value !== null && value !== undefined;
    const integer = (value, label, allowZero = false) => {
        if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < (allowZero ? 0 : 1)) {
            fail(label + " invalide");
        }
        return Number(value);
    };
    const statements = [];
    const indexes = [];
    const comments = [];
    const tables = new Map();
    const names = new Set();
    if (!model || !Array.isArray(model.tables) || !Array.isArray(model.relations)) fail("Modèle invalide");

    // Conversion du type ModelStudio vers le type SQL.
    function fieldType(field) {
        const original = String(field.type).trim().toLowerCase();
        const aliases = {
            integer: "int",
            bool: "boolean",
            numeric: "decimal",
            "double precision": "double"
        };
        const type = aliases[original] || original;
        // [MySQL, PostgreSQL]
        const mapping = {
            tinyint:   ["TINYINT", "SMALLINT"],
            smallint:  ["SMALLINT", "SMALLINT"],
            mediumint: ["MEDIUMINT", "INTEGER"],
            int:       ["INT", "INTEGER"],
            bigint:    ["BIGINT", "BIGINT"],
            float:     ["FLOAT", "REAL"],
            double:    ["DOUBLE", "DOUBLE PRECISION"],
            decimal:   ["DECIMAL", "NUMERIC"],
            boolean:   ["BOOLEAN", "BOOLEAN"],
            char:      ["CHAR", "CHAR"],
            varchar:   ["VARCHAR", "VARCHAR"],
            text:      ["TEXT", "TEXT"],
            tinytext:  ["TINYTEXT", "TEXT"],
            mediumtext:["MEDIUMTEXT", "TEXT"],
            longtext:  ["LONGTEXT", "TEXT"],
            date:      ["DATE", "DATE"],
            datetime:  ["DATETIME", "TIMESTAMP"],
            timestamp: ["TIMESTAMP", "TIMESTAMP"],
            time:      ["TIME", "TIME"],
            json:      ["JSON", "JSONB"],
            uuid:      ["CHAR(36)", "UUID"],
            blob:      ["BLOB", "BYTEA"],
            binary:    ["BINARY", "BYTEA"],
            varbinary: ["VARBINARY", "BYTEA"],
            enum:      ["ENUM", "TEXT"],
            set:       ["SET", null]
        };
        const dialectIndex = mysql ? 0 : 1;
        if (!mapping[type] || !mapping[type][dialectIndex]) fail("Type non pris en charge : " + original);
        let sql = mapping[type][dialectIndex];
        if (["char", "varchar"].includes(type) || (mysql && ["binary", "varbinary"].includes(type))) {
            sql += "(" + integer(field.length, "Longueur de " + field.name) + ")";
        }

        // La longueur des entiers n'est pas une taille de stockage :
        // int avec length = 11 est généré en INT / INTEGER.
        if (type === "decimal" && present(field.precision)) {
            const precision = integer(field.precision, "Précision");
            const scale = present(field.scale)? integer(field.scale, "Échelle", true): 0;
            if (scale > precision || precision > (mysql ? 65 : 1000) || (mysql && scale > 30)) {
                fail("Précision/échelle hors limites");
            }
            sql += `(${precision}, ${scale})`;
        } else if (present(field.scale)) {
            fail("Échelle sans précision décimale");
        }
        const attribute = String(field.attribute || "").trim().toLowerCase();
        if (attribute) {
            const allowedAttributes = [
                "unsigned",
                "zerofill",
                "unsigned zerofill"
            ];
            const numericTypes = [
                "tinyint",
                "smallint",
                "mediumint",
                "int",
                "bigint",
                "decimal",
                "float",
                "double"
            ];
            if (!mysql || !allowedAttributes.includes(attribute) || !numericTypes.includes(type)) {
                fail("Attribut incompatible : " + attribute);
            }
            sql += " " + attribute.toUpperCase();
        }
        let values = [];
        if (["enum", "set"].includes(type)) {
            // Accepte un tableau JS ou une chaîne contenant un tableau JSON.
            try {
                values = Array.isArray(field.values)? field.values: JSON.parse(field.values);
            } catch {
                fail("values de " + field.name + ' doit être un tableau JSON, ex. ["actif","inactif"]');
            }
            if (!Array.isArray(values) || !values.length || values.some(value => typeof value !== "string" || value.includes("\u0000")) || new Set(values).size !== values.length) {
                fail("Liste enum/set invalide");
            }
            if (mysql) {
                if (values.some(value => /[\\\u0000-\u001f]/.test(value))) fail("Membre enum/set MySQL incompatible");
                sql += "(" + values.map(value => "'" + value.replaceAll("'", "''") + "'").join(", ") + ")";
            }
        }
        return { sql, type, values };
    }

    // Génération de la valeur par défaut.
    function defaultSQL(field, info) {
        if (!present(field.defaultValue)) return "";
        const value = String(field.defaultValue);
        if (value.toUpperCase() === "NULL") {
            if (!field.nullable || field.index === "primary") {
                fail("DEFAULT NULL sur colonne obligatoire : " + field.name);
            }
            return " DEFAULT NULL";
        }
        const temporalTypes = [
            "datetime",
            "timestamp",
            "date",
            "time"
        ];
        const temporalExpression = /^(CURRENT_TIMESTAMP(?:\([0-6]\))?|CURRENT_DATE|CURRENT_TIME)$/i;
        if (temporalTypes.includes(info.type) && temporalExpression.test(value)) {
            const expression = value.toUpperCase();
            return " DEFAULT " + (mysql && /^(CURRENT_DATE|CURRENT_TIME)$/i.test(value)? "(" + expression + ")": expression);
        }
        const numericTypes = [
            "tinyint",
            "smallint",
            "mediumint",
            "int",
            "bigint",
            "decimal",
            "float",
            "double"
        ];
        if (numericTypes.includes(info.type)) {
            if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) fail("Valeur numérique invalide : " + field.name);
            return " DEFAULT " + value;
        }
        if (info.type === "boolean") {
            if (!/^(true|false|0|1)$/i.test(value)) fail("Booléen invalide");
            return " DEFAULT " + (/^(true|1)$/i.test(value) ? "TRUE" : "FALSE");
        }
        if (info.type === "enum" && !info.values.includes(value)) fail("Valeur par défaut hors enum");
        if (["blob", "binary", "varbinary"].includes(info.type)) fail("Valeur par défaut binaire non prise en charge");
        return " DEFAULT " + (mysql ? "(" + literal(value) + ")" : literal(value));
    }

    // 1. Création de toutes les tables.
    model.tables.forEach((table, tableIndex) => {
        quote(table.name);
        const nameKey = table.name.toLowerCase();
        if (tables.has(table.id) || names.has(nameKey)) fail("Table dupliquée : " + table.name);
        names.add(nameKey);
        if (!Array.isArray(table.fields) || !table.fields.length) fail("Table sans attribut : " + table.name);
        const fields = new Map();
        const fieldNames = new Set();
        const definitions = [];
        const primary = [];
        const autos = [];
        tables.set(table.id, { table, fields });
        table.fields.forEach((field, fieldIndex) => {
            const column = quote(field.name);
            const key = field.name.toLowerCase();
            if (fields.has(field.id) || fieldNames.has(key)) fail("Attribut dupliqué : " + field.name);
            if (!["", "primary", "unique", "index"].includes(field.index || "")) fail("Index non pris en charge : " + field.index);
            fieldNames.add(key);
            const info = fieldType(field);
            fields.set(field.id, { field, info });
            let definition = column + " " + info.sql;
            if (field.autoIncrement) {
                const integerTypes = [
                    "tinyint",
                    "smallint",
                    "mediumint",
                    "int",
                    "bigint"
                ];
                if (!integerTypes.includes(info.type) || present(field.defaultValue)) fail("Auto-incrément incompatible : " + field.name);
                autos.push(field);
                if (!mysql) definition += " GENERATED BY DEFAULT AS IDENTITY";
            }
            definition += (field.index === "primary" || field.autoIncrement || !field.nullable) ? " NOT NULL" : " NULL";
            if (mysql && field.autoIncrement) definition += " AUTO_INCREMENT";
            definition += defaultSQL(field, info);
            // PostgreSQL : enum représenté par TEXT + CHECK.
            if (!mysql && info.type === "enum") {
                definition += (" CHECK (" + column + " IN (" + info.values.map(literal).join(", ") + "))");
            }
            if (field.comment) {
                if (mysql) {
                    if (/[\\\u0000-\u001f]/.test(field.comment)) {
                        fail("Commentaire MySQL : antislash/caractère de contrôle non pris en charge");
                    }
                    definition += (" COMMENT '" + String(field.comment).replaceAll("'", "''") + "'");
                } else {
                    comments.push("COMMENT ON COLUMN " + quote(table.name) + "." + column + " IS " + literal(field.comment));
                }
            }
            definitions.push(definition);
            if (field.index === "primary") primary.push(field);
            if (field.index === "unique") definitions.push("UNIQUE (" + column + ")");
            if (field.index === "index") {
                const indexName = `idx_${tableIndex + 1}_${fieldIndex + 1}`;
                indexes.push(`CREATE INDEX ${quote(indexName)} ON ${quote(table.name)} (${column})`);
            }
        });

        if (
            mysql &&
            (
                autos.length > 1 ||
                autos.some(
                    field => !(
                        field.index === "unique" ||
                        field.index === "index" ||
                        primary[0] === field
                    )
                )
            )
        ) {
            fail("AUTO_INCREMENT doit être le premier champ d’un index : " + table.name);
        }

        if (primary.length) {
            definitions.push(
                "PRIMARY KEY (" +
                primary.map(field => quote(field.name)).join(", ") +
                ")"
            );
        }

        statements.push(
            "CREATE TABLE " + quote(table.name) + " (\n    " +
            definitions.join(",\n    ") +
            "\n)" +
            (mysql ? " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" : "")
        );
    });

    // 2. Création des index ordinaires.
    statements.push(...indexes);

    // 3. Ajout des relations après la création de toutes les tables.
    const seenRelations = new Set();

    model.relations.forEach((relation, relationIndex) => {
        if (!["source", "target"].includes(relation.foreignKeySide)) {
            fail("Côté de clé étrangère invalide");
        }

        const child = relation[relation.foreignKeySide];

        const parent = relation[
            relation.foreignKeySide === "source" ? "target" : "source"
        ];

        const childTable = tables.get(child?.tableId);
        const parentTable = tables.get(parent?.tableId);

        const childField = childTable?.fields.get(child?.fieldId);
        const parentField = parentTable?.fields.get(parent?.fieldId);

        if (!childField || !parentField) {
            fail(
                "Relation vers une table/un attribut absent : " +
                relation.id
            );
        }

        const identity = JSON.stringify([
            child.tableId,
            child.fieldId,
            parent.tableId,
            parent.fieldId
        ]);

        if (seenRelations.has(identity)) {
            fail("Relation dupliquée : " + relation.id);
        }

        seenRelations.add(identity);

        const parentPrimary = parentTable.table.fields.filter(
            field => field.index === "primary"
        );

        if (
            !(
                parentField.field.index === "unique" ||
                (
                    parentField.field.index === "primary" &&
                    parentPrimary.length === 1
                )
            )
        ) {
            fail(
                "La clé référencée doit être primaire simple ou unique : " +
                parentField.field.name
            );
        }

        if (childField.info.sql !== parentField.info.sql) {
            fail("Types incompatibles dans la relation : " + relation.id);
        }

        // Une cardinalité maximale 1 du côté portant la FK
        // nécessite une contrainte UNIQUE.
        const childPrimary = childTable.table.fields.filter(
            field => field.index === "primary"
        );

        const alreadyUnique =
            childField.field.index === "unique" ||
            (
                childField.field.index === "primary" &&
                childPrimary.length === 1
            );

        if (
            ["0..1", "1..1", "1"].includes(child.cardinality) &&
            !alreadyUnique
        ) {
            const uniqueName = relationConstraintName(
                "uq",
                relation,
                parentTable.table.name,
                childTable.table.name
            );

            statements.push(
                `ALTER TABLE ${quote(childTable.table.name)} ` +
                `ADD CONSTRAINT ${quote(uniqueName)} ` +
                `UNIQUE (${quote(childField.field.name)})`
            );
        }

        const foreignKeyName = relationConstraintName(
            "fk",
            relation,
            parentTable.table.name,
            childTable.table.name
        );

        statements.push(
            `ALTER TABLE ${quote(childTable.table.name)} ` +
            `ADD CONSTRAINT ${quote(foreignKeyName)} ` +
            `FOREIGN KEY (${quote(childField.field.name)}) ` +
            `REFERENCES ${quote(parentTable.table.name)} ` +
            `(${quote(parentField.field.name)})`
        );
    });

    // 4. Commentaires PostgreSQL.
    statements.push(...comments);

    return (statements.map(sql => sql + ";").join("\n\n") + (statements.length ? "\n" : ""));
}