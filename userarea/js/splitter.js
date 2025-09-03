// Classe générique pour gérer un splitter
class Splitter {
    constructor(name, element, target, orientation = "vertical") {
        this.name = name;
        this.element = element;
        this.target = target;
        this.orientation = orientation;
        this.isResizing = false;
        this.initEvents();
    }

    initEvents() {
        this.element.addEventListener("mousedown", () => {
            this.isResizing = true;
            document.body.style.cursor =
            this.orientation === "vertical" ? "col-resize" : "row-resize";
    });

    document.addEventListener("mousemove", (e) => {
        if (!this.isResizing) return;
        if (this.orientation === "vertical") {
            let newWidth = e.clientX;
            if (newWidth < 100) newWidth = 100;
            this.target.style.width = newWidth + "px";
        } else {
            let newHeight = e.clientY - this.target.offsetTop;
            if (newHeight < 100) newHeight = 100;
            this.target.style.height = newHeight + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        this.isResizing = false;
        document.body.style.cursor = "default";
    });
    }
}
