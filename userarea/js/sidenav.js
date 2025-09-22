function openNavPush() {
  document.getElementById("openbtn").style.display = "none";
  document.getElementById("closebtn").style.display = "block";
  document.getElementById("sidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNavPush() {
  document.getElementById("openbtn").style.display = "block";
  document.getElementById("closebtn").style.display = "none";
  document.getElementById("sidenav").style.width = "40px";
  document.getElementById("main").style.marginLeft= "40px";
}

function openNavOverlay() {
  document.getElementById("openbtn").style.display = "none";
  document.getElementById("closebtn").style.display = "block";
  document.getElementById("sidenav").style.width = "250px";
}

function closeNavOverlay() {
  document.getElementById("openbtn").style.display = "block";
  document.getElementById("closebtn").style.display = "none";
  document.getElementById("sidenav").style.width = "40px";
}

function openLink(evt) {
    var i, navlinks;

    navlinks = document.getElementsByClassName("navlink");
    for (i = 0; i < navlinks.length; i++) {
        navlinks[i].className = navlinks[i].className.replace(" active", "");
        navlinks[i].style.backgroundColor = "";
    }

    evt.currentTarget.className += " active";
}
