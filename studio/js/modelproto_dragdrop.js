let draggedTable = null;

const workspace = document.getElementById("workspace");

workspace.addEventListener("dragstart", event => {
    if (event.target.closest(".model-table-menu")) {
        event.preventDefault();
        return;
    }
    const tableElement = event.target.closest(".model-table");
    if (!tableElement) return;
    const rect = tableElement.getBoundingClientRect();
    draggedTable = {
        tableId: tableElement.dataset.tableId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
    };
    event.dataTransfer.effectAllowed = "move";
    // Nécessaire notamment pour Firefox
    event.dataTransfer.setData(
        "text/plain",
        tableElement.dataset.tableId
    );
    tableElement.classList.add("model-table-dragging");
});

workspace.addEventListener("dragover", event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
});

workspace.addEventListener("drop", event => {
    event.preventDefault();
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
});

workspace.addEventListener("dragend", event => {
    const tableElement = event.target.closest(".model-table");
    if (tableElement) tableElement.classList.remove("model-table-dragging");
    draggedTable = null;
});