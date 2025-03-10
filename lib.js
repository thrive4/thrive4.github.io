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

/*
const includeHTMLj = async () => {
    const response = await fetch('./body.html');
    document.getElementById("w3-include-html").innerHTML = await response.text();
}
const includeHTMLg = fetch('./body.html').then(res => res.text()).then(json => document.getElementById("wah").innerHTML = json);

async function includeHTMLi() {
  try {
    const requestoptions = {
        method: "GET",
            headers: { "Content-Type": "text/html" },
            //body: JSON.stringify(data),
            keepalive: true,
    };
    let response = await fetch('./body.html', requestoptions); // Gets a promise
    if (response.status === 200) {
       document.getElementById("w3-include-html").innerHTML = await response.text(); // Replaces body with response
    }
  } catch (err) {
    console.log('Fetch error:' + err); // Error handling
  }
}
*/

includeHTML();

// get json data
/*
function getjson(url, callback) {
    var request = new XMLHttpRequest();
    // issue not advisable but will only work in some cases...
    request.open('GET', url, true);
    request.overrideMimeType("application/json");
    request.onload = function () {
        if (request.readyState == 4 && request.status == "200") {
          callback(JSON.parse(request.responseText));
        }
    };
    request.send();
}
*/
/*
async function getjsonf(url, callback) {
  if (url.startsWith('http')) {
    // Remote URL, use fetch
    try {
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);

      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }

  } else {
      // Local file, use XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', url, false);
      request.overrideMimeType("application/json");
      request.onload = function() {
          if (request.readyState == 4 && request.status == "200") {
              callback(JSON.parse(request.responseText));
          }
      };
      request.send();
    }
}
*/


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

// style sidenav
function indexsidenav() {
    let text           = "";
    getjsonf('json/index.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
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
    if (document.getElementById("mySidenav").style.width == "0px" || document.getElementById("mySidenav").style.width == "") {
        document.getElementById("mySidenav").style.width = "250px";
    } else {
        document.getElementById("mySidenav").style.width = "0px";
    }
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
