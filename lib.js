// include routine todo deprecate if possible
function include(filename)
{
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.src = filename;
   script.type = 'text/javascript';
   head.appendChild(script)
}

// get json data
function getjson(url, callback) {
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
if (modal == undefined) { modal = ""; }
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("ovimage");
if (modalImg == undefined) { modalImg = ""; }
var captionText = document.getElementById("caption");
img.onclick = function() {
  modal.style.display = "block";
  modalImg.src = this.src;
  if (captionText !== undefined && captionText !== null) {
     captionText.innerHTML = this.alt;
  }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
if (span == undefined && span == null) {
   span = 0;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

var slideIndex = 2;

if (slideIndex == undefined || slideIndex == null) {
   slideIndex = 2;
}

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
  var lastslide = x.length - 1;
  if (n > lastslide) {slideIndex = 1}
  if (n < 1) {slideIndex = lastslide}
  for (i = 0; i < lastslide; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < lastslide; i++) {
    dots[i].className = dots[i].className.replace(" w3-opacity-off w3-border-orange w3-border-bottom", "");
  }
  x[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " w3-opacity-off w3-border-orange w3-border-bottom";
}

// keyboard navigation
document.onkeydown = function (event) {
    var kbpressed = event.key;
    if(kbpressed == "ArrowLeft") {
        plusDivs(-1);
    }
    if(kbpressed == "ArrowRight") {
        plusDivs(1);
    }
    if(kbpressed == "ArrowUp") {
        // simulate mouse click todo only does first image
        var simclick = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        }), element = document.getElementById(slideIndex);
        element.dispatchEvent(simclick);
    }
    if(kbpressed == "Escape") {
        if (modal.style == undefined) {
           modal.style = "";
        }
        modal.style.display = "none";
    }
}

// mousescroll image navigation
window.addEventListener('wheel', function (scrollnav) {
    if (document.getElementById('myModal').style.display === 'block') {
        if (scrollnav.deltaY < 100) {
             plusDivs(1);
        }
        if (scrollnav.deltaY > 100) {
             plusDivs(-1);
        }
    }
});

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

// sidebar navigation slide open and close from left to right
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("sidenavmain").style.marginLeft = "250px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("sidenavmain").style.marginLeft= "0";
}

// svg icons
function svgcamera() {

    return '<path d="M21,4c-1.402,0-2.867,0-2.867,0L17.2,2c-0.215-0.498-1.075-1-1.826-1H8.759' +
    'C8.008,1,7.148,1.502,6.933,2L6,4c0,0-1.517,0-3,0C0.611,4,0,6,0,6v14c0,0,1.5,2,3,2s16.406,0,18,0s3-2,3-2V6C24,6,23.496,4,21,4z' +
    'M12,19.001c-3.313,0-6-2.687-6-6.001c0-3.313,2.687-6,6-6c3.314,0,6,2.687,6,6C18,16.314,15.314,19.001,12,19.001z M12,9' +
    'c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,9,12,9z"/>';

}
