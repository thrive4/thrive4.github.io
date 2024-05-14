function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType("text/html");
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, false);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();

// get json data
function getjson(url, callback) {
    var request = new XMLHttpRequest();
    // issue not advisable but will only work in some cases...
    request.open('GET', url, true);
    request.overrideMimeType("application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
          callback(JSON.parse(request.responseText));
        }
    };
    request.send();
}

function getjsonf(url, callback) {
    var request = new XMLHttpRequest();
    // issue not advisable but will only work in some cases...
    request.open('GET', url, false);
    //request.open('GET', url, true);
    request.overrideMimeType("application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
          callback(JSON.parse(request.responseText));
        }
    };
    request.send();
}

// get json image url
const imageurl = [];
getjsonf('imageviewer.json', function(data2){
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
    modal.style.display = "none";
    eventhandle.remove();
}

// style sidenav
function indexsidenav() {
    let text           = "";

    // get json
    getjson('index.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += value.href;
                } else {
                   text += value.href;
                }
                text += "<b>" + value.name.toLowerCase() + "</b></a>";
            };
        });
        document.getElementById("sidenavcontent").innerHTML = text;
    });
    // clean up
    text = "";
}
// sidebar navigation slide open and close from left to right
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// used for main menu navigation
indexsidenav();

// play audio source
function audioplay(music, element) {
    document.getElementById("audio").pause();
    document.getElementById("audio").setAttribute('src', music);
    document.getElementById("audio").setAttribute('type', 'audio/mpeg');
    document.getElementById("audio").load();
    document.getElementById("audio").play();
    document.getElementById("audio").volume = 0.5;
    document.getElementById("audio").style.visibility = "visible";
    // set or remove play button
    var data = document.getElementsByClassName("audiobutton");
    // reset selected up and down
    for (i = 0; i < data.length; i++) {
           data[i].style.visibility = "hidden";
    }
    for (i = 0; i < data.length; i++) {
        // toggle on row id
        if (i == element.closest('tr').rowIndex - 1) {
           data[i].style.visibility = "visible";
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

// courtesy https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript by somthinghere
function titlecase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

// create paragraphs in text block
function createparagraph(dummy) {
  let dummy2 = "";
  let i = 0;

  // build array on punctuation .!? ignore pattern T.S.Elliot, St.Louis etc
  dummy = dummy.split(/([!?.]\s)/);
  while (i < dummy.length) {
        if (dummy[i].length > 100) {
           dummy2 += dummy[i];
           // last line
           if (dummy[i+1] === undefined) {
              dummy2 += "<br><br>";
           } else {
              dummy2 += dummy[i+1] + "<br><br>";
           }
        } else {
           if (dummy[i].length =! 1) {
              dummy2 += dummy[i] + dummy[i+1];
           }
        }
        i++;
  }

  return dummy2;
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
// todo needs better handling darkmode
function getdivletter(x) {
   let dummy = document.getElementsByClassName('cardlist')[x].innerHTML.toUpperCase();
   dummy = document.getElementsByClassName('cardlist')[x].innerHTML.charAt(dummy.indexOf("<B>") + 3).toUpperCase();
   document.getElementById("trletterplace").innerHTML = dummy;
}

function getdivdarkletter(x) {
   let dummy = document.getElementsByClassName('cardlistdarkmode')[x].innerHTML.toUpperCase();
   dummy = document.getElementsByClassName('cardlistdarkmode')[x].innerHTML.charAt(dummy.indexOf("<B>") + 3).toUpperCase();
   document.getElementById("trletterplace").innerHTML = dummy;
}

function trletteron() {
   document.getElementById("trletter").style.display = "block";
}

function trletteroff() {
   document.getElementById("trletter").style.display = "none";
}
