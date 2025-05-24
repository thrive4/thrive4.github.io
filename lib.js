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
      currentPage  = 0;
      totalPages   = 0;
      start        = 0;
      end          = 0
      renderpage(orgtext);
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
      // reset column letter indicator
      window.localStorage.setItem('tdsortelement', 1);
      return;
    }
  }
}

includeHTML();

function getjsonf(url, callback) {

  const controller = new AbortController();
  const signal = controller.signal;
  // abort the fetch request workaround
  const timeoutId = setTimeout(() => {
      controller.abort();
  }, 5000);

  if (url.startsWith('hhttp')) {
    fetch(url, {signal})
          .then(response => response.text())
          .then(text => {
            const data = JSON.stringify(JSON.parse(text));
            //console.log('Response Text:', data); // Log the response text
            callback(data);
      });
  } else {
      // local file, use XMLHttpRequest
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

// <span> (x), close the modal
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
        document.getElementById("sidenavcontent").innerHTML = '<div class="cardlist">| no options | items ' +
        window.localStorage.getItem('nritems') + ' </div>';
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
           + '<br>   toggle   drc on / off d'
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
        navth('open');
    } else {
        document.getElementById("mySidenav").style.width = "0px";
    }
    indexsidenav(navdir);
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  navth('close');
}

// work around hide headers
function navth(state) {

  const thelm = document.getElementsByTagName("th");
  for (let i = 1; i < thelm.length; i++) {
      if (state === 'close') {
         thelm[i].style.zIndex = "1";
      } else {
         thelm[i].style.zIndex = "0";
      }
  }

}

// play audio source
function toggleplaytype(playtype) {
    if (playtype === 'shuffle') {
       shuffle = true;
       document.getElementById("playtype").innerHTML = 'shuffle';
    } else {
       shuffle = false;
       document.getElementById("playtype").innerHTML = 'linear';
    }
    closeNav();
}

function toggledrc(state) {
    autoGainEnabled = !autoGainEnabled;
    autoGainToggle.textContent = autoGainEnabled ? 'Disable Auto Gain' : 'Enable Auto Gain';
    if (!autoGainEnabled) {
      // Optionally reset gain to unity when disabling
       gainNode.gain.value = 1;
       volumeSlider.value  = 1;
      // updateGainIndicator();
    }
    closeNav();
}

function audioplay(music, element) {
    currentIndex = element.closest('tr').rowIndex -1;
    const audio  = document.getElementById("audio");
    //console.log(element);
    //console.log('Playing:', titles[element.closest('tr').rowIndex - 1]);
    // reset gain
    gainNode.gain.value = 1;
    volumeSlider.value  = 1;

    audio.pause();
    audio.setAttribute('src', music);
    audio.setAttribute('type', 'audio/mpeg');
    audio.load();
    audio.play();
    audio.style.visibility = "visible";
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

    // get mp3 tags and cover art
    const tagsDiv = document.getElementById('tags');
    const img     = document.getElementById('coverArt');
    const spinner = document.getElementById('spinner');
    let text = "";

    img.src               = "";
    img.style.display     = 'none';
    spinner.style.display = 'block';
    document.getElementById("svg").innerHTML = "";
    tagsDiv.innerHTML     = "";
    text = '<svg class="svglight" viewBox="0 0 28 28">';
    text += svgnoinfo();
    text += '</svg>';

//if (!('body' in Response.prototype && 'getReader' in ReadableStream.prototype)) {
//  alert('Your browser does not fully support streaming downloads. For the best experience, please use a modern browser like Firefox or Chrome.');
  // Optionally, disable or simplify features that require streaming
//} else {
  // Your existing fetch + stream reading code here
//}
    if (audio.src.indexOf('127.0.0.1') === -1 ) {
      // tricky
      const controller = new AbortController();
      const signal = controller.signal;
      const timeoutId = setTimeout(() => {
          controller.abort();
          //console.log('wah');
          spinner.style.display = 'none';
      }, 10000);

      fetch(audio.src, {signal})
        .then(response => {
          var contentLength   = +response.headers.get('Content-Length');
          const reader          = response.body.getReader();
          let receivedLength    = 0;
          let chunks            = [];
          // hack some browsers can report 0 for content length
          if (contentLength < 1) { contentLength = 100000;}
          //console.log(contentLength);
          function read() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                return;
              }
              chunks.push(value);
              receivedLength += value.length;
              // todo tricky 0.25 might be better = 450KB @ 3MB mp3; 0.10 = 150KB @ 3MB mp3
              if (contentLength && receivedLength >= contentLength * 0.10) {
                reader.cancel();
                const partial = new Blob(chunks);
                processPartial(partial, text);
                spinner.style.display = 'none';
                return;
              }
              return read();
            });
          }
          return read();
      });
    } else {
      var request = new XMLHttpRequest();
      request.open('GET', audio.src, true);
  
      request.onerror = function() {
          console.log('Request error');
          spinner.style.display = 'none';
      };
  
      request.responseType = 'blob';
      request.onload = function() {
          spinner.style.display = 'none';
          img.style.display = 'none';
          svg.style.display = 'none';
          var reader = new FileReader();
          reader.readAsArrayBuffer(request.response);
          reader.onload =  function(e){
              const arrayBuffer = e.target.result;
  
              const tags = {
                title:  getMp3Tag('TITLE', arrayBuffer),
                album:  getMp3Tag('ALBUM', arrayBuffer),
                artist: getMp3Tag('ARTIST', arrayBuffer),
                track:  getMp3Tag('TRACK', arrayBuffer),
                genre:  getMp3Tag('GENRE', arrayBuffer),
                year:   getMp3Tag('YEAR', arrayBuffer)
              };
  
              tagsDiv.innerHTML = `
                 title  ${tags.title}
                 album  ${tags.album}
                 artist ${tags.artist}
                 track  ${tags.track}
                 genre  ${tags.genre}
                 year   ${tags.year}
              `;
  
            const dataView = new DataView(arrayBuffer);
            const id3Header = readID3Header(dataView);
            if (id3Header) {
                const coverArt = extractCoverArt(dataView, id3Header);
                document.getElementById("svg").innerHTML = text;
                if (coverArt) {
                    img.src = coverArt.url;
                    img.style.display = 'block';
                }
            }
         };
      };
      request.send();
    } // end if fetch or xmlhttprequest
    currentIndex++;
}

// get mp3 tags and cover art
function processPartial(blob, text) {
    const tagsDiv     = document.getElementById('tags');
    const img         = document.getElementById('coverArt');
    const reader      = new FileReader();

    reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      const tags = {
        title:  getMp3Tag('TITLE', arrayBuffer),
        album:  getMp3Tag('ALBUM', arrayBuffer),
        artist: getMp3Tag('ARTIST', arrayBuffer),
        track:  getMp3Tag('TRACK', arrayBuffer),
        genre:  getMp3Tag('GENRE', arrayBuffer),
        year:   getMp3Tag('YEAR',  arrayBuffer)
      };

      tagsDiv.innerHTML = `
         title  ${tags.title}
         album  ${tags.album}
         artist ${tags.artist}
         track  ${tags.track}
         genre  ${tags.genre}
         year   ${tags.year}
      `;

      const dataView  = new DataView(arrayBuffer);
      const id3Header = readID3Header(dataView);
      if (id3Header) {
          const coverArt = extractCoverArt(dataView, id3Header);
          document.getElementById("svg").innerHTML = text;
          if (coverArt) {
              img.src = coverArt.url;
              img.style.display = 'block';
              document.getElementById("svg").innerHTML = "";
          }
      }
  };

  reader.readAsArrayBuffer(blob);

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

function wordcount(text) {
    // split words
    words = text.split(/\s+/);
    totalPages = Math.ceil(words.length / wordsPerPage);
    start = currentPage * wordsPerPage;
    end = start + wordsPerPage;
    return words.slice(start, end).join(' ');

}

function createparagraph(text) {
  const paragraphs = [];
  let currentParagraph = '';
  let paragraphLength = 0;
  let insideSentence = false;

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

  paragraphs.push(currentParagraph.trim() + '<br><br>');

  // join paragraphs
  return paragraphs.join('');
}

// tag indicator list first letter selected search td or div element
function gettrletter(x) {
   const tdsort = window.localStorage.getItem('tdsortelement');
   let dummy = document.getElementById("datatable").rows[x.rowIndex].cells[tdsort].innerHTML;
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
// go to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// sort table data
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

function svgwindowslogo() {
    return '<path d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302' +
    '104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z"/>';
}

function svginfobox() {
    return '<path d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 ' +
           '2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"></path>' +
           '<path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C">' +
           '</path> <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#1C274C"></path>';
}

function svgnoinfo() {
    return `<path d="M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,
           2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z"/></path>
           <path d="M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z"/>`;
}

function svgplay() {
    return `<path d="M1,14c0,0.547,0.461,1,1,1c0.336,0,0.672-0.227,1-0.375L14.258,9C14.531,8.867,15,8.594,15,8s-0.469-0.867-0.742-1L3,
            1.375  C2.672,1.227,2.336,1,2,1C1.461,1,1,1.453,1,2V14z"/>`;
}
