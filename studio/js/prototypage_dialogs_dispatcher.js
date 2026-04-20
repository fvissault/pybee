let currentConfigNode = null

function openDialog(node, cat){
    currentConfigNode = node
    buildPopupContent(node, cat)
    if(node.type === "layout" && cat == "lcss") {
        initLayoutPopupEvents()
    }
    if((node.type === "container" || node.type === "layout") && cat == "css") {
        renderTree()
    }
    if((node.type === "zone" || node.type === "widget") && cat == "css") {
        renderTreeById()
    }
    document.getElementById("dialog").style.display="block"
}

function closeDialog(){
    document.getElementById("dialog").style.display="none"
}

function buildPopupContent(node, cat){

    if(node.type==="widget"){
        if (cat == "html") {
            switch(node.widgetType){
                case "Button":
                    popupButton(node)
                    break
                case "Text":
                    popupText(node)
                    break
                case "Span":
                    popupSpan(node)
                    break
                case "Image":
                    popupImage(node)
                    break
                case "Block":
                    popupBlock(node)
                    break
                case "Label":
                    popupLabel(node)
                    break
                case "Textfield":
                    popupTextfield(node) // A faire
                    break
                case "Form":
                    popupForm(node)
                    break
            }
        } else if (cat == "css") {
            popupCss(node)
        } else if (cat == "events") {
            popupEvents(node)
        }
    } else {
        if(node.type==="zone") {
            if (cat == "css") popupCss(node)
            if (cat == "html") popupLayoutZone(node)
        }
        if(node.type==="layout") {
            if (cat == "html") popupPage(node)
            if (cat == "lhtml") popupLayout(node)
            if (cat == "lcss") {
                initPropsStruct()
                popupLayoutCss(node)
            }
            if (cat == "css") popupWorkspaceCss(node)
            if (cat == "js") {
                return popupWorkspaceJs(node)
            }
            if (cat == "model") return popupWorkspaceModel(node)
        }

        if(node.type==="container") {
            if (cat == "html") popupPage(node)
            if (cat == "css") popupWorkspaceCss(node)
            if (cat == "js") return popupWorkspaceJs(node)
            if (cat == "model") return popupWorkspaceModel(node)
        }
    }
}


function openIntFlow(){
  window.open("intflow.html")
}