function switchtheme() {
  console.log(window.localStorage.getItem('theme'));
   if (window.localStorage.getItem('theme') === null) {
      window.localStorage.setItem('theme', 'light');
   }
   if (window.localStorage.getItem('theme') === 'light') {
      window.localStorage.setItem('theme', 'dark');
   } else {
      window.localStorage.setItem('theme', 'light');
   }
   //location.reload();
}
// needed to affect switch theme
document.documentElement.className = window.localStorage.getItem('theme');

// resize text paper view
var onresize = function(e) {
    windowwidth = window.outerWidth;
    if (document.getElementById('myModal').style.display == 'block'){
       document.getElementById('bookpage').innerHTML = createparagraph(orgtext);
    }
}
window.addEventListener("resize", onresize);

function passmusicalbum(a){
    window.localStorage.setItem('name', a);
}
function passrelaseyear(a){
    window.localStorage.setItem('year', a);
}

// Define the handleClick function
function handleClick(name, releaseDate, year) {
  document.getElementById('myModal').style.display = 'block';
  passmusicalbum(name);
  switch (window.localStorage.getItem('menuitem')){
    case 'film':
      passrelaseyear(releaseDate);
      break;
    case 'music':
      passrelaseyear(year);
      break;
  }
  imageoverlay(titlecase(name), 'paper', 'remote');
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType("text/html");
      xhttp.onload = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          //elmnt.removeAttribute("w3-include-html");
          //includeHTML();
        }
      }
      // todo set to true this is a pain in the ass....
      xhttp.open("GET", file, false);
      xhttp.send();
      return;
    }
  }
}

includeHTML();

function getjsonf(url, callback) {
  if (url.startsWith('hhttp')) {
      // Remote URL, use fetch
       fetch(url, {signal: AbortSignal.timeout(5000)})
          .then(response => response.text())
          .then(text => {
            const data = JSON.parse(text);
      });
  } else {
      // Local file, use XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', url, false);
      request.overrideMimeType("application/json");
      request.onload = function() {
          //if (request.readyState == 4 && request.status == "200") {
              callback(JSON.parse(request.responseText));
          //}
      };
      request.send();
    }
}

// get json image url
const imageurl = [];
getjsonf('json/camera.json', function(data2){
if (data2)
   Object.entries(data2).forEach((entry) => {
       const [key2, value2] = entry;
       imageurl[key2] = value2;
   });
});

// parse json image url
function showcamera(imageurl, check, svgclass){
    let camera         = false;
    let text = "";
    // parse json image url
    Object.entries(imageurl).forEach((entry) => {
        if (camera === true) {
           return;
        };
        const [key2, value2] = entry;
        if (value2.name === check) {
           camera = true;
        };
    });
    if (camera === true) {
       text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + check + '\', \'image\',\'remote\')">' +
               '<svg class="' + svgclass + '" viewBox="-20 -22 44 44">' +
                     svgcamera() +
               '</svg></a>';
               camera = false;
    };
    return text;
}

// clock time and date routines
window.onload = setInterval(clock,1000);
function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}

function clock() {
  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth();
  var montharr = ["Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
  month=montharr[month];

  var year = d.getFullYear();
  var day = d.getDay();
  var dayarr = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
  day= dayarr[day];

  var hour = addZero(d.getHours());
  var min  = addZero(d.getMinutes());
  var sec  = addZero(d.getSeconds());

  if (document.getElementById("date") !== undefined &&   document.getElementById("date") !== null) {
     document.getElementById("date").innerHTML = day+" "+date+" "+month+" "+year;
  }
  if (document.getElementById("time") !== undefined &&   document.getElementById("time") !== null) {
     document.getElementById("time").innerHTML = hour+":"+min;
  }
  if (document.getElementById("desc") !== undefined &&   document.getElementById("desc") !== null) {
     document.getElementById("desc").innerHTML = document.getElementById('slideshow').getElementsByTagName('img')[0].alt;
  }
}

// image and slide routines
// overlay images
var modal = document.getElementById('myModal');
if (modal == undefined) { modal = "flex"; }

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
if (span == undefined && span == null) {
   span = 0;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "";
    eventhandle.remove();
}

// todo needs more flexible intergration with openNav
function indexsidenav(navdir = "") {
    let text   = "";
    let dummy  = "";
    let dummy2 = "";
    let source = "json/index.json";
    if (document.title === 'playlist' && navdir === 'right') {
       source = 'json/config.json';
    }
    if (document.title != 'playlist' && navdir === 'right') {
        document.getElementById("sidenavcontent").innerHTML = '<div class="cardlist">no options</div>';
        return;
    }

    getjsonf(source, function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.name.indexOf(".io") < 0 && value.private === false) {
                text += value.href;
                text += "<b>" + value.name.toLowerCase() + "</b></a>";
            };
        });
        if (document.title === 'playlist') {
          if (shuffle) { dummy2 = ' shuffle  '; } else { dummy2 = ' linear  '; }
           dummy = '   | navigation player'
           + '<br>   next     arrow right'
           + '<br>   previous arrow left'
           + '<br>   toggle   pause / play p'
           + '<br>   volume   up +'
           + '<br>   volume   down -'
           + '<br>   seek     plus .'
           + '<br>   seek     min ,'
           + '<br><br>   | playing'
           + dummy2 + currentIndex + ' / ' + trElements.length;
           text += '<div class="cardlist"><pre style="font-family: monospace;">' + dummy + '</pre></div>'
        }
        document.getElementById("sidenavcontent").innerHTML = text;
    });
    // clean up
    text = "";
}

// sidebar navigation
function openNav(navdir) {
    // technique change css element on the fly
    const nav = document.querySelector('.sidenav');
    if (navdir === 'left') {
        nav.classList.remove('right');
        nav.classList.add('left');
    } else {
        nav.classList.remove('left');
        nav.classList.add('right');
    }
    if (document.getElementById("mySidenav").style.width == "0px" || document.getElementById("mySidenav").style.width == "") {
        document.getElementById("mySidenav").style.width = "250px";
    } else {
        document.getElementById("mySidenav").style.width = "0px";
    }
    indexsidenav(navdir);
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// play audio source
function toggleplaytype(playtype) {
    if (playtype === 'shuffle') {
       shuffle = true;
    } else {
       shuffle = false;
    }
    closeNav();
}

function audioplay(music, element) {
    currentIndex = element.closest('tr').rowIndex -1;
    //console.log(element);
    //console.log('Playing:', titles[element.closest('tr').rowIndex - 1]);
    document.getElementById("audio").pause();
    document.getElementById("audio").setAttribute('src', music);
    document.getElementById("audio").setAttribute('type', 'audio/mpeg');
    document.getElementById("audio").load();
    document.getElementById("audio").play();
    //document.getElementById("audio").volume = 0.5;
    document.getElementById("audio").style.visibility = "visible";
    // set or remove play button
    var data = document.getElementsByClassName("audiobutton");
    for (i = 0; i < data.length; i++) {
           data[i].style.visibility = "hidden";
    }
    for (i = 0; i < data.length; i++) {
        if (i == element.closest('tr').rowIndex - 1) {
           data[i].style.visibility = "visible";
        }
    }
    var data = document.getElementsByClassName("container-audio");
    for (i = 0; i < data.length; i++) {
        data[i].style.visibility = "visible";
    }

    currentIndex++;
}

// play youtube audio source
function ytaudioplay(music, element) {
    var data = document.getElementById("ytplayer");
    for (i = 0; i < data.length; i++) {
        data[i].style.visibility = "visible";
        data[i].src = music
    }
    document.getElementById("result").innerHTML = music;
}

// courtesy https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript by somthinghere
function titlecase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

function createparagraph(text) {
  const paragraphs = [];
  let currentParagraph = '';
  let paragraphLength = 0;
  let insideSentence = false;
  let p = false;

  // todo needs some form of paging
  if (text.length > window.outerWidth * 2) {
    text = text.substring(0, window.outerWidth * 2);
    p = true;
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
      if (insideSentence) {
        currentParagraph += char;
        paragraphLength++;
      }
    } else {
      currentParagraph += char;
      paragraphLength++;
      if (char === '.' || char === '!' || char === '?') {
        insideSentence = false;
      } else {
        insideSentence = true;
      }
      if (paragraphLength > 100 + text[i]) {
        paragraphs.push(currentParagraph.trim() + '<br><br>');
        currentParagraph = '';
        paragraphLength = 0;
      }
    }
  }
  // check text size and add the last paragraph to the list of paragraphs
  if (p) {
    paragraphs.push(currentParagraph.trim() + '<br>   .....');
  } else {
    paragraphs.push(currentParagraph.trim() + '<br><br>');
  }
  // Join the paragraphs into a single string and return the result
  return paragraphs.join('');
}

// tag indicator list first letter selected search td or div element
function gettrletter(x) {
   //let dummy = document.getElementById("datatable").rows[x.rowIndex].cells[window.localStorage.getItem('tdelement')].innerHTML;
   if (window.localStorage.getItem('tdsortelement') === null) {
      window.localStorage.setItem('tdsortelement', 1);
   }
   let dummy = document.getElementById("datatable").rows[x.rowIndex].cells[window.localStorage.getItem('tdsortelement')].innerHTML;
   // reduce to anchor text filter out ahref
   dummy = dummy.slice(dummy.indexOf(">") + 1, dummy.lastIndexOf("<"));
   document.getElementById("trletterplace").innerHTML = dummy.charAt(0).toUpperCase();
}

function getdivletter(x) {
   let dummy = document.getElementsByClassName('cardlist')[x].innerHTML.toUpperCase();
   dummy = document.getElementsByClassName('cardlist')[x].innerHTML.charAt(dummy.indexOf("<B>") + 3).toUpperCase();
   document.getElementById("trletterplace").innerHTML = dummy;
}

function trletteron() {
   document.getElementById("trletter").style.display = "block";
}

function trletteroff() {
   document.getElementById("trletter").style.display = "none";
}

// back to top button todo filterout modal mode better
let totop = document.getElementById("backtotop");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && modal.style.display === "") {
    totop.style.display = "block";
  } else {
    totop.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
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
    return '<path d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 ' +
           '2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"></path>' +
           '<path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C">' +
           '</path> <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#1C274C"></path>';
}
