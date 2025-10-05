function openmodal(modalid, elt) {
    var modal = document.getElementById(modalid);
    var span = document.getElementById(modalid + "close");
    elt.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    elt.click();
}
