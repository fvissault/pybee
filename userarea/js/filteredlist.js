/*******************************************************************************
 * listfilter pour filtrer les éléments d'une liste
 * Les éléments de la liste peuvent normalement être composés d'autres éléments
 *******************************************************************************/
function listfilter(listid, elt) {
    var filter, ul, li, a, i, txtValue;
    filter = elt.value.toUpperCase();
    ul = document.getElementById(listid);
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        txtValue = traverse(li[i]);
        //txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function traverse(node) {
    var text;
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            text = traverse(child);
            return;
        }
        if (child.nodeType === Node.TEXT_NODE) {
            text = child.nodeValue.trim();
            return;
        }
    });
    return text;
}