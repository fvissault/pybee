/*******************************************************
 * Filtrage sur les colonnes d'un tableau
 *******************************************************/
function filter(idtable, elt, columnnum) {
  // Declare variables
  var filter, table, tr, td, i, txtValue;
  filter = elt.value.toUpperCase();
  table = document.getElementById(idtable);
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    td = tr[i].querySelectorAll("td, th")[columnnum];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

/*******************************************************
 * Tri d'un tableau
 *******************************************************/
function sort(idtable, elt, n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(idtable);
  switching = true;

  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].querySelectorAll("td, th")[n];
      y = rows[i + 1].querySelectorAll("td, th")[n];
      if (dir == "asc") {
        elt.src = "userarea/img/sort-up-solid-full.svg";
        if (String(x.innerHTML).toLowerCase() > String(y.innerHTML).toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        elt.src = "userarea/img/sort-down-solid-full.svg";
        if (String(x.innerHTML).toLowerCase() < String(y.innerHTML).toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

