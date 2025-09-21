function openLink(evt) {
    var i, navlinks;

    navlinks = document.getElementsByClassName("navlink");
    for (i = 0; i < navlinks.length; i++) {
        navlinks[i].className = navlinks[i].className.replace(" active", "");
        navlinks[i].style.backgroundColor = "";
    }

    evt.currentTarget.className += " active";
}

function showDefault() {
    document.querySelectorAll(".defaultOpen").forEach(btn => btn.click());
}