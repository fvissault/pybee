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