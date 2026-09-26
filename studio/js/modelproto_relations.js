const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);

    Object.entries(attributes).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });

    return element;
}

function getWorkspacePoint(fieldElement, tableElement, side) {
   const workspace = document.getElementById("workspace");

   const workspaceRect = workspace.getBoundingClientRect();
   const fieldRect = fieldElement.getBoundingClientRect();
   const tableRect = tableElement.getBoundingClientRect();

   let x;
   let y;

   if (side === "left") {
      x = tableRect.left;
      y = fieldRect.top + fieldRect.height / 2;
   } else if (side === "right") {
      x = tableRect.right;
      y = fieldRect.top + fieldRect.height / 2;
   } else if (side === "top") {
      x = fieldRect.left + fieldRect.width / 2;
      y = tableRect.top;
   } else {
      x = fieldRect.left + fieldRect.width / 2;
      y = tableRect.bottom;
   }

   return {
      x: x - workspaceRect.left + workspace.scrollLeft,
      y: y - workspaceRect.top + workspace.scrollTop
   };
}

/*function getRelationSides(sourceTable, targetTable) {
   const sourceRect = sourceTable.getBoundingClientRect();
   const targetRect = targetTable.getBoundingClientRect();

   // La source est entièrement à gauche de la cible.
   if (sourceRect.right <= targetRect.left) {
      return {
         sourceSide: "right",
         targetSide: "left",
         orientation: "horizontal"
      };
   }

   // La source est entièrement à droite de la cible.
   if (targetRect.right <= sourceRect.left) {
      return {
         sourceSide: "left",
         targetSide: "right",
         orientation: "horizontal"
      };
   }

   // La source est entièrement au-dessus de la cible.
   if (sourceRect.bottom <= targetRect.top) {
      return {
         sourceSide: "bottom",
         targetSide: "top",
         orientation: "vertical"
      };
   }

   // La source est entièrement en dessous de la cible.
   if (targetRect.bottom <= sourceRect.top) {
      return {
         sourceSide: "top",
         targetSide: "bottom",
         orientation: "vertical"
      };
   }

   *
    * Cas où les tables se chevauchent partiellement.
    * On choisit l'axe sur lequel leurs centres sont les plus éloignés.
    *
   const sourceCenterX = sourceRect.left + sourceRect.width / 2;
   const sourceCenterY = sourceRect.top + sourceRect.height / 2;
   const targetCenterX = targetRect.left + targetRect.width / 2;
   const targetCenterY = targetRect.top + targetRect.height / 2;

   const deltaX = targetCenterX - sourceCenterX;
   const deltaY = targetCenterY - sourceCenterY;

   if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      return {
         sourceSide: deltaX >= 0 ? "right" : "left",
         targetSide: deltaX >= 0 ? "left" : "right",
         orientation: "horizontal"
      };
   }

   return {
      sourceSide: deltaY >= 0 ? "bottom" : "top",
      targetSide: deltaY >= 0 ? "top" : "bottom",
      orientation: "vertical"
   };
}*/

function getRelationSides(sourceTable, targetTable) {
   const sourceRect = sourceTable.getBoundingClientRect();
   const targetRect = targetTable.getBoundingClientRect();

   // Tables côte à côte.
   if (sourceRect.right <= targetRect.left) {
      return {sourceSide: "right", targetSide: "left", orientation: "horizontal"};
   }

   if (targetRect.right <= sourceRect.left) {
      return {sourceSide: "left", targetSide: "right", orientation: "horizontal"};
   }

   /*
    * Tables superposées verticalement :
    * les deux liens sortent du même côté.
    */
   if (sourceRect.bottom <= targetRect.top || targetRect.bottom <= sourceRect.top) {
        const outsideSide = getOutsideSide(sourceTable, targetTable);
        return {sourceSide: outsideSide, targetSide: outsideSide, orientation: "vertical-outside"};
   }

   // Cas de chevauchement partiel.
   const sourceCenterX = sourceRect.left + sourceRect.width / 2;
   const sourceCenterY = sourceRect.top + sourceRect.height / 2;
   const targetCenterX = targetRect.left + targetRect.width / 2;
   const targetCenterY = targetRect.top + targetRect.height / 2;

   const deltaX = targetCenterX - sourceCenterX;
   const deltaY = targetCenterY - sourceCenterY;

   if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      return {sourceSide: deltaX >= 0 ? "right" : "left", targetSide: deltaX >= 0 ? "left" : "right", orientation: "horizontal"};
   }

   return {sourceSide: "right", targetSide: "right", orientation: "vertical-outside"};
}

/*function buildRelationPath(sourcePoint, targetPoint, orientation) {
   if (orientation === "vertical") {
      const middleY = (sourcePoint.y + targetPoint.y) / 2;

      return [
         `M ${sourcePoint.x} ${sourcePoint.y}`,
         `V ${middleY}`,
         `H ${targetPoint.x}`,
         `V ${targetPoint.y}`
      ].join(" ");
   }

   const middleX = (sourcePoint.x + targetPoint.x) / 2;

   return [
      `M ${sourcePoint.x} ${sourcePoint.y}`,
      `H ${middleX}`,
      `V ${targetPoint.y}`,
      `H ${targetPoint.x}`
   ].join(" ");
}*/

function buildRelationPath(
   sourcePoint,
   targetPoint,
   orientation,
   sourceSide
) {
   if (orientation === "vertical-outside") {
      const outsideMargin = 40;

      const outsideX = sourceSide === "right"
         ? Math.max(sourcePoint.x, targetPoint.x) + outsideMargin
         : Math.min(sourcePoint.x, targetPoint.x) - outsideMargin;

      return [
         `M ${sourcePoint.x} ${sourcePoint.y}`,
         `H ${outsideX}`,
         `V ${targetPoint.y}`,
         `H ${targetPoint.x}`
      ].join(" ");
   }

   const middleX = (sourcePoint.x + targetPoint.x) / 2;

   return [
      `M ${sourcePoint.x} ${sourcePoint.y}`,
      `H ${middleX}`,
      `V ${targetPoint.y}`,
      `H ${targetPoint.x}`
   ].join(" ");
}

function createCardinalityText(cardinality, point, side) {
   const offsets = {
      left:   { x: -10, y: -7, anchor: "end" },
      right:  { x:  10, y: -7, anchor: "start" },
      top:    { x:  8,  y: -10, anchor: "start" },
      bottom: { x:  8,  y:  18, anchor: "start" }
   };

   const offset = offsets[side];

   const text = createSvgElement("text", {
      x: point.x + offset.x,
      y: point.y + offset.y,
      class: "relation-cardinality",
      "text-anchor": offset.anchor
   });

   text.textContent = cardinality;

   return text;
}

function renderRelation(relation, svg) {
    const sourceField = getFieldElement(relation.source.tableId, relation.source.fieldId);
    const targetField = getFieldElement(relation.target.tableId, relation.target.fieldId);
    if (!sourceField || !targetField) return;

    const sourceTable = getTableElement(relation.source.tableId);
    const targetTable = getTableElement(relation.target.tableId);
    if (!sourceTable || !targetTable) return;

    const {sourceSide, targetSide, orientation} = getRelationSides(sourceTable, targetTable);

    const sourcePoint = getWorkspacePoint(sourceField, sourceTable, sourceSide);
    const targetPoint = getWorkspacePoint(targetField, targetTable, targetSide);
    //const pathData = buildRelationPath(sourcePoint, targetPoint, orientation);
    const pathData = buildRelationPath(sourcePoint, targetPoint, orientation, sourceSide);

    const group = createSvgElement("g", {
        class: "relation",
        "data-relation-id": relation.id
    });

    const hitbox = createSvgElement("path", {
        d: pathData,
        class: "relation-hitbox"
    });

    const line = createSvgElement("path", {
        d: pathData,
        class: "relation-line"
    });

    const sourceCardinality = createCardinalityText(relation.source.cardinality, sourcePoint, sourceSide);
    const targetCardinality = createCardinalityText(relation.target.cardinality, targetPoint, targetSide);

    group.append(hitbox, line, sourceCardinality, targetCardinality);

    group.addEventListener("click", event => {
        event.stopPropagation();
        // Remplace le nom si ta fonction s’appelle autrement.
        openRelationPopup(relation);
    });
    svg.appendChild(group);
}

function renderRelations() {
    const workspace = document.getElementById("workspace");
    const svg = document.getElementById("relations-layer");

    svg.replaceChildren();

    svg.setAttribute("width", workspace.scrollWidth);
    svg.setAttribute("height", workspace.scrollHeight);
    svg.setAttribute(
        "viewBox",
        `0 0 ${workspace.scrollWidth} ${workspace.scrollHeight}`
    );

    modelRoot.relations.forEach(relation => {
        renderRelation(relation, svg);
    });
}

function getTableElement(tableId) {
    return document.querySelector(`.model-table[data-table-id="${tableId}"]`);
}

function getFieldElement(tableId, fieldId) {
   return document.querySelector(
      `[data-table-id="${tableId}"][data-field-id="${fieldId}"]`
   );
}

function getOutsideSide(sourceTable, targetTable) {
    const workspace = document.getElementById("workspace");
    const workspaceRect = workspace.getBoundingClientRect();

    const sourceRect = sourceTable.getBoundingClientRect();
    const targetRect = targetTable.getBoundingClientRect();

    const leftEdge = Math.min(
        sourceRect.left,
        targetRect.left
    ) - workspaceRect.left;

    const rightEdge = Math.max(
        sourceRect.right,
        targetRect.right
    ) - workspaceRect.left;

    const leftSpace = leftEdge;
    const rightSpace = workspace.clientWidth - rightEdge;

    return rightSpace >= leftSpace ? "right" : "left";
}
