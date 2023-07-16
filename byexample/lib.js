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

  document.getElementById("date").innerHTML=day+" "+date+" "+month+" "+year;
  document.getElementById("time").innerHTML=hour+":"+min;
}

// image and slide routines
// overlay images
var modal = document.getElementById('myModal');
if (modal == undefined) { modal = ""; }
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("ovimage");
if (modalImg == undefined) { modalImg = ""; }
var captionText = document.getElementById("caption");
img.onclick = function() {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-opacity-off w3-border-orange w3-border-bottom", "");
  }
  x[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " w3-opacity-off w3-border-orange w3-border-bottom";
}

document.onkeydown = function (event) {
    var kbpressed = event.key;
    if(kbpressed == "ArrowLeft") {
        plusDivs(-1);
    }
    if(kbpressed == "ArrowRight") {
        plusDivs(1);
    }
    if(kbpressed == "Escape") {
        modal.style.display = "none";
    }
}

// dark mode toggle
function switchtheme() {
   document.body.classList.toggle('dark');
   var data = document.getElementsByClassName("card");
   for (i = 0; i < data.length; i++) {
     //data[i].style.fontSize = "30px";
     //data[i].style.background = "green";
     data[i].classList.toggle("carddarkmode")
   }
   var data = document.getElementsByClassName("nav");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("navdarkmode")
   }
   var data = document.getElementsByClassName("footer");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("footerdarkmode")
   }
   var data = document.getElementsByClassName("nav-item");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-itemdarkmode")
   }
   var data = document.getElementsByClassName("nav-right");
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("nav-rightdarkmode")
   }
   var data = document.querySelectorAll('#myTable tr:nth-child(odd)');
   for (i = 0; i < data.length; i++) {
     data[i].classList.toggle("trdarkmode")
   }
   window.localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
   // debug feedback
   //document.getElementById("result").innerHTML =  window.localStorage.getItem('theme');
}

// play audio source
function audioplay(music, element) {
    document.getElementById("audio").pause();
    document.getElementById("audio").setAttribute('src', music);
    document.getElementById("audio").setAttribute('type', 'audio/mpeg');
    document.getElementById("audio").load();
    document.getElementById("audio").play();
    document.getElementById("audio").volume = 0.5;
    var data = document.getElementsByClassName("audiobutton");
    for (i = 0; i < data.length; i++) {
        // toggle on row id
        if (i == element.closest('tr').rowIndex - 1) {
           data[i].style.visibility = "visible";
           // get first td per row
           document.getElementById("result").innerHTML = document.getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[1].innerHTML;
           document.getElementById("audio").title = document.getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[1].innerHTML;
        } else {
           data[i].style.visibility = "hidden";
        }
    }
    var data = document.getElementsByClassName("container-audio");
    for (i = 0; i < data.length; i++) {
        data[i].style.visibility = "visible";
    }
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

// sort tablular info
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

