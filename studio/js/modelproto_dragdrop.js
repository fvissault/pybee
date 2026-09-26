const workspace = document.getElementById("workspace");

let draggedTable = null;
let draggedField = null;

workspace.addEventListener("dragstart", event => {
    const fieldHandle = event.target.closest(".model-field-drag-handle");
    /*
     * Déplacement d’un attribut
     */
    if (fieldHandle) {
        const fieldElement = fieldHandle.closest(".model-table-field");
        const tableElement = fieldHandle.closest(".model-table");
        draggedField = {
            tableId: tableElement.dataset.tableId,
            fieldId: fieldElement.dataset.fieldId
        };
        draggedTable = null;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedField.fieldId);
        fieldElement.classList.add("model-field-dragging");
        return;
    }
    /*
     * On ne déplace pas la table lorsqu'une action commence
     * depuis le menu de la table ou celui d'un attribut.
     */
    if (event.target.closest(".model-table-menu") || event.target.closest(".model-field-menu")) {
        event.preventDefault();
        return;
    }
    const tableElement = event.target.closest(".model-table");
    if (!tableElement) return;
    const tableRect = tableElement.getBoundingClientRect();
    draggedTable = {tableId: tableElement.dataset.tableId, offsetX: event.clientX - tableRect.left, offsetY: event.clientY - tableRect.top};
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tableElement.dataset.tableId);
    tableElement.classList.add("model-table-dragging");
});

workspace.addEventListener("dragover", event => {
    /*
     * Réorganisation d’un attribut
     */
    if (draggedField) {
        const targetField = event.target.closest(".model-table-field");
        if (!targetField) return;
        const targetTable = targetField.closest(".model-table");
        if (targetTable.dataset.tableId !== draggedField.tableId) {
            return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        clearFieldDropIndicators();
        const rect = targetField.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;
        if (event.clientY < middle) {
            targetField.classList.add("model-field-drop-before");
        } else {
            targetField.classList.add("model-field-drop-after");
        }
        return;
    }
    /*
     * Déplacement d’une table
     */
    if (draggedTable) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }
});

workspace.addEventListener("drop", event => {
    event.preventDefault();

    /*
     * Drop d’un attribut
     */
    if (draggedField) {
        const targetFieldElement = event.target.closest(
            ".model-table-field"
        );

        if (!targetFieldElement) {
            clearFieldDrag();
            return;
        }

        const targetTableElement =
            targetFieldElement.closest(".model-table");

        if (
            targetTableElement.dataset.tableId !==
            draggedField.tableId
        ) {
            clearFieldDrag();
            return;
        }

        const targetFieldId =
            targetFieldElement.dataset.fieldId;

        const placeAfter =
            targetFieldElement.classList.contains(
                "model-field-drop-after"
            );

        reorderField(
            draggedField.tableId,
            draggedField.fieldId,
            targetFieldId,
            placeAfter
        );

        clearFieldDrag();
        renderModel();

        return;
    }

    /*
     * Drop d’une table
     */
    if (!draggedTable) return;

    const workspaceRect = workspace.getBoundingClientRect();

    const x = event.clientX - workspaceRect.left - workspace.clientLeft + workspace.scrollLeft - draggedTable.offsetX;
    const y = event.clientY - workspaceRect.top - workspace.clientTop + workspace.scrollTop - draggedTable.offsetY;
    const table = modelRoot.tables.find(table => table.id === draggedTable.tableId);

    if (table) {
        table.x = Math.max(0, Math.round(x));
        table.y = Math.max(0, Math.round(y));
    }

    draggedTable = null;

    renderModel();
    renderRelations();
});

workspace.addEventListener("click", event => {
    const actionElement = event.target.closest("[data-action]");

    if (!actionElement) {
        closeActionMenus();
        return;
    }

    const tableElement = actionElement.closest(".model-table");

    if (!tableElement) return;

    const tableId = tableElement.dataset.tableId;
    const action = actionElement.dataset.action;

    event.stopPropagation();

    if (action === "toggle-table-menu") {
        const menu = tableElement.querySelector(":scope > .model-table-header .model-table-menu-content");
        const mustOpen = menu.hidden;
        closeActionMenus();
        menu.hidden = !mustOpen;
        return;
    }

    if (action === "toggle-field-menu") {
        const fieldElement = actionElement.closest(".model-table-field");
        const menu = fieldElement.querySelector(".model-field-menu-content");
        const mustOpen = menu.hidden;
        closeActionMenus();
        menu.hidden = !mustOpen;
        return;
    }

    closeActionMenus();

    const fieldElement = actionElement.closest(".model-table-field");

    const fieldId = fieldElement?.dataset.fieldId;

    switch (action) {
        case "add-field":
            openAddFieldPopup(tableId);
            break;

        case "rename-table":
            openRenameTablePopup(tableId);
            break;

        case "delete-table":
            deleteTable(tableId);
            break;

        case "edit-field":
            openAddFieldPopup(tableId, fieldId);
            break;

        case "delete-field":
            deleteField(tableId, fieldId);
            break;
    }
});

workspace.addEventListener("dragend", event => {
    clearFieldDrag();
    const tableElement = event.target.closest(".model-table");
    if (tableElement) tableElement.classList.remove("model-table-dragging");
    draggedTable = null;
});

function clearFieldDropIndicators() {
    workspace.querySelectorAll(`.model-field-drop-before,.model-field-drop-after`)
        .forEach(element => {
            element.classList.remove("model-field-drop-before","model-field-drop-after");
        });
}

function reorderField(tableId, draggedFieldId, targetFieldId, placeAfter) {
    if (draggedFieldId === targetFieldId) return;
    const table = modelRoot.tables.find(table => table.id === tableId);
    if (!table) return;
    const oldIndex = table.fields.findIndex(field => field.id === draggedFieldId);
    const targetIndex = table.fields.findIndex(field => field.id === targetFieldId);
    if (oldIndex === -1 || targetIndex === -1) return;
    const [movedField] = table.fields.splice(oldIndex, 1);
    let insertionIndex = targetIndex;
    /*
     * La suppression de l’ancien élément décale l’index cible
     * lorsque l’attribut se trouvait avant celui-ci.
     */
    if (oldIndex < targetIndex) insertionIndex--;
    if (placeAfter) insertionIndex++;
    table.fields.splice(insertionIndex, 0, movedField);
}

function clearFieldDrag() {
    clearFieldDropIndicators();
    workspace.querySelectorAll(".model-field-dragging").forEach(element => {
        element.classList.remove(
            "model-field-dragging"
        );
    });
    draggedField = null;
}