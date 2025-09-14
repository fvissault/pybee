function openTab(evt, name, element, color, dir) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName(dir + "tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(name).style.display = "block";
    document.getElementById(name).style.backgroundColor = color;
    element.style.backgroundColor = color;
    evt.currentTarget.className += " active";
}

function showDefault() {
    document.querySelectorAll(".defaultOpen").forEach(btn => btn.click());
}