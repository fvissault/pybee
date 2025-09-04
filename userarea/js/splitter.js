// Classe générique pour gérer un splitter
class Splitter {
    constructor(element, target, orientation = "vertical") {
        this.element = document.getElementById(element);
        this.target = document.getElementById(target);
        this.orientation = orientation;
        this.isResizing = false;
        this.initEvents();
    }

    initEvents() {
        if (this.orientation === "vertical") {
            const savedWidth = localStorage.getItem("leftWidth");
            if (savedWidth) {
                this.target.style.width = savedWidth + "px";
            }
        } else {
            const savedHeight = localStorage.getItem("topHeight");
            if (savedHeight) {
                this.target.style.height = savedHeight + "px";
            }
        }

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
            localStorage.setItem("leftWidth", newWidth);
        } else {
            let newHeight = e.clientY - this.target.offsetTop;
            if (newHeight < 100) newHeight = 100;
            this.target.style.height = newHeight + "px";
            localStorage.setItem("topHeight", newHeight);
        }
    });

    document.addEventListener("mouseup", () => {
        this.isResizing = false;
        document.body.style.cursor = "default";
    });
    }
}
