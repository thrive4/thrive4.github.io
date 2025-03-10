// dark mode toggle
function switchtheme() {
   document.body.classList.toggle('dark');
   var data = document.getElementsByClassName("card");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("carddarkmode")
   }
   var data = document.getElementsByClassName("nav");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("navdarkmode")
   }
   var data = document.getElementsByClassName("nav-item");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-itemdarkmode")
   }
   var data = document.getElementsByClassName("nav-right");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-rightdarkmode")
   }
   var data = document.getElementsByClassName("svglight");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("svgdarkmode")
   }
   var data = document.getElementsByClassName("footer");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("footerdarkmode")
   }
   window.localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
   // debug feedback
   //document.getElementById("result").innerHTML =  window.localStorage.getItem('theme');
}

if ( window.localStorage.getItem('theme') === 'dark') {
   document.body.classList.add('dark');
   var data = document.getElementsByClassName("card");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("carddarkmode")
   }
   var data = document.getElementsByClassName("nav");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("navdarkmode")
   }
   var data = document.getElementsByClassName("nav-item");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-itemdarkmode")
   }
   var data = document.getElementsByClassName("nav-right");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-rightdarkmode")
   }
   var data = document.getElementsByClassName("svglight");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("svgdarkmode")
   }
   var data = document.getElementsByClassName("footer");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("footerdarkmode")
   }
   window.localStorage.setItem('theme', 'dark');
}

// sort table data
// todo figure out why these functions can not be placed in lib.js
// in lib.js music dataview no longer sorts...
/**
 * sortable 1.0
 * Makes html tables sortable, ie9+
 * Styling is done in css.
 * Copyleft 2017 Jonas Earendel
 * This is free and unencumbered software released into the public domain.
 * more info see https://github.com/tofsjonas/sortable/blob/main/sortable.js
*/

document.addEventListener('click', function (e) {
  var down_class  = ' dir-d '
  var up_class    = ' dir-u '
  var regex_dir   = / dir-(u|d) /
  var regex_table = /\bsortable\b/
  var element     = e.target

  if (element.nodeName === 'TH') {

    function reClassify(element, dir) {
      element.className = element.className.replace(regex_dir, '') + dir
    }

    function getValue(element) {
      // If you aren't using data-sort and want to make it just the tiniest bit smaller/faster
      // comment this line and uncomment the next one
      return element.getAttribute('data-sort') || element.innerText
    }

    try {
      var tr = element.parentNode
      // var table = element.offsetParent; // Fails with positioned table elements
      // this is the only way to make really, really sure. A few more bytes though... 😡
      var table = tr.parentNode.parentNode
      if (regex_table.test(table.className)) {
        var column_index
        var nodes = tr.cells
        // reset thead cells and get column index
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i] === element) {
            column_index = i
          } else {
            reClassify(nodes[i], '')
          }
        }
        // pass selected column aka td to tag indicator
        window.localStorage.setItem('tdsortelement', column_index);
        var dir = down_class
        // check if we're sorting up or down, and update the css accordingly
        if (element.className.indexOf(down_class) !== -1) {
          dir = up_class
        }
        reClassify(element, dir)
        // extract all table rows, so the sorting can start.
        var org_tbody = table.tBodies[0]
        // get the array rows in an array, so we can sort them...
        var rows = [].slice.call(org_tbody.rows, 0)
        var reverse = dir === up_class
        // sort them using custom built in array sort.
        rows.sort(function (a, b) {
          var x = getValue((reverse ? a : b).cells[column_index])
          var y = getValue((reverse ? b : a).cells[column_index])
          // var y = (reverse ? b : a).cells[column_index].innerText
          // var x = (reverse ? a : b).cells[column_index].innerText
          return isNaN(x - y) ? x.localeCompare(y) : x - y
        })
        // Make a clone without content
        var clone_tbody = org_tbody.cloneNode()
        // Build a sorted table body and replace the old one.
        while (rows.length) {
          clone_tbody.appendChild(rows.splice(0, 1)[0])
        }
        // And finally insert the end result
        table.replaceChild(clone_tbody, org_tbody)
      }
    } catch (error) {
      // console.log(error)
    }
  }
})

// group and filter table data
// via https://www.w3schools.com/howto/howto_js_filter_table.asp
function searchandfilter() {
  var input, filter, table, tr, td, i, txtValue;
  input  = document.getElementById("srinput");
  filter = input.value.toUpperCase();
  table  = document.getElementById("datatable");
  tr     = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[window.localStorage.getItem('tdelement')];
    // todo allow for grouping by column
    //td = tr[i].getElementsByTagName("td")[0];
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

// svg icons
function svgcamera() {
    return '<path d="M21,4c-1.402,0-2.867,0-2.867,0L17.2,2c-0.215-0.498-1.075-1-1.826-1H8.759' +
    'C8.008,1,7.148,1.502,6.933,2L6,4c0,0-1.517,0-3,0C0.611,4,0,6,0,6v14c0,0,1.5,2,3,2s16.406,0,18,0s3-2,3-2V6C24,6,23.496,4,21,4z' +
    'M12,19.001c-3.313,0-6-2.687-6-6.001c0-3.313,2.687-6,6-6c3.314,0,6,2.687,6,6C18,16.314,15.314,19.001,12,19.001z M12,9' +
    'c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,9,12,9z"/>';

}

function windowslogo() {
    return '<path d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302' +
    '104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z"/>';

}

function svginfobox() {
    return '<path d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"></path>' +
           '<path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C">' +
           '</path> <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#1C274C"></path>';

}

function svgdocument() {
    return '<path d="M5.112.011c-2.802 0-5.073 2.273-5.073 5.074v53.841c0 2.803 2.272 5.074 5.073 5.074h45.775c2.801 0 5.074-2.271' +
    ' 5.074-5.074v-38.605l-18.904-20.31h-31.945z" ' +
    'fill-rule="evenodd" clip-rule="evenodd" fill="#00a1e0"/>' +
    '<path d="M10.133 37.439h21.564v2.059h-21.564zm0 4.801h21.564v2.057h-21.564zm0 4.801h21.564v2.057h-21.564zm0 4.8h12.233v2.058h-12.233z" fill="#ffffff"/>' +
      '<g fill-rule="evenodd" clip-rule="evenodd">' +
      '  <path d="M55.96 20.377v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#2D6FE4"/>' +
      '  <path d="M37.058.025v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"/>' +
      '</g>';
}