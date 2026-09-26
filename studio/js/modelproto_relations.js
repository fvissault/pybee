const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);

    Object.entries(attributes).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });

    return element;
}

function getWorkspacePoint(element, side) {
    const workspace = document.getElementById("workspace");
    const workspaceRect = workspace.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    let x;

    if (side === "left") {
        x = elementRect.left - workspaceRect.left;
    } else {
        x = elementRect.right - workspaceRect.left;
    }

    return {
        x: x + workspace.scrollLeft,
        y: elementRect.top
            - workspaceRect.top
            + workspace.scrollTop
            + elementRect.height / 2
    };
}

function getRelationSides(sourceElement, targetElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const sourceCenter = sourceRect.left + sourceRect.width / 2;
    const targetCenter = targetRect.left + targetRect.width / 2;

    if (sourceCenter <= targetCenter) {
        return {
            sourceSide: "right",
            targetSide: "left"
        };
    }

    return {
        sourceSide: "left",
        targetSide: "right"
    };
}

function buildRelationPath(sourcePoint, targetPoint) {
    const middleX = (sourcePoint.x + targetPoint.x) / 2;

    return [
        `M ${sourcePoint.x} ${sourcePoint.y}`,
        `H ${middleX}`,
        `V ${targetPoint.y}`,
        `H ${targetPoint.x}`
    ].join(" ");
}

function createCardinalityText(cardinality, point, side) {
    const offset = side === "right" ? 10 : -10;

    const text = createSvgElement("text", {
        x: point.x + offset,
        y: point.y - 7,
        class: "relation-cardinality",
        "text-anchor": side === "right" ? "start" : "end"
    });

    text.textContent = cardinality;

    return text;
}

function renderRelation(relation, svg) {
    const sourceElement = getFieldElement(
        relation.source.tableId,
        relation.source.fieldId
    );

    const targetElement = getFieldElement(
        relation.target.tableId,
        relation.target.fieldId
    );

    if (!sourceElement || !targetElement) {
        console.warn(
            `Impossible de tracer la relation ${relation.id} : attribut introuvable`
        );
        return;
    }

    const { sourceSide, targetSide } = getRelationSides(
        sourceElement,
        targetElement
    );

    const sourcePoint = getWorkspacePoint(sourceElement, sourceSide);
    const targetPoint = getWorkspacePoint(targetElement, targetSide);

    const pathData = buildRelationPath(sourcePoint, targetPoint);

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

    const sourceCardinality = createCardinalityText(
        relation.source.cardinality,
        sourcePoint,
        sourceSide
    );

    const targetCardinality = createCardinalityText(
        relation.target.cardinality,
        targetPoint,
        targetSide
    );

    group.append(
        hitbox,
        line,
        sourceCardinality,
        targetCardinality
    );

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