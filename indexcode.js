// todo move to lib.js
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function switchlistview(listtype, pagetype, extatype = "") {
    let text            = "";
    let camera          = false;
    let svgclass        = "svglight";
    let cnt             = 0;
    let dummy           = "";
    let item            = 1;
    const filterelement = [];
    var fields          = [];

    if (window.localStorage.getItem('tdelement') === null) {
       window.localStorage.setItem('tdelement', '1');
    }
    if (listtype == undefined) {
       listtype = 'tile';
    }

    // setup fields displayed and used from index.json file
    getjsonf('json/atlas.json', function(data){
      if (data) {
          Object.entries(data).forEach((entry) => {
              const [key, value] = entry;
              if (pagetype === value.name) {
                 fields = value.displayfields.slice();
              }
          });
      }
    });
    data = [];
    entry = [];

    let temptype = 'json/' + pagetype;
    if (extatype != "") {
        temptype = 'playlist/' + extatype;
    }

    // get json data per section site
    getjsonf(temptype + '.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.name.toUpperCase(),
              b = y.name.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        var k = JSON.parse(JSON.stringify( data, fields , 4));
        // map fieldnames aka columns aka keys
        var keys = Object.keys(k[0]);
        // use k to reorder json file then save on os
        //download('hello.json', JSON.stringify(k, null, 2));

// todo needs better handling when using audioplayer
//console.table(data.map(item => item.file));
// create a temporary data structure without the 'file' column
// syntax file, album, ...rest  add columns if needed
if (pagetype === 'musiclist'){
    const tempdata = data.map(item => {
        const { file, ...rest } = item;
        return rest;
    });
    keys = Object.keys(tempdata[0]);
}
        switch (listtype){
          case 'data':
            text += "<table class='sortable' id='datatable'>";
            text += '<thead><tr><th class="thnonsticky" width=20px;>';
            text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">' + '\r\n';
            for (let i = 0; i < keys.length; i++) {
                   text += '<a href="#" onclick="localStorage.setItem(\'tdelement\',' + item + '); searchon(\'' + keys[i] + '\')' + '\";>' + keys[i] + '</a>' + '\r\n';
                   filterelement[i + 1] = keys[i];
                   item += 1;
            }
            text += '</div></div></th>' + '\r\n';

            for (let i = 0; i < keys.length; i++) {
                text += '<th>' + keys[i] + '</th>' + '\r\n';
            }
            text += '</tr></thead>';
            text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement[window.localStorage.getItem('tdelement')] + '..">';
            break;
        }

        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false || value.private === 'false' || value.private === null || value.private == undefined) {
                switch (listtype){
                  case 'data':
                         // todo tricky way of bypassing audioplayer if no file is defined
                         if (value.file != undefined) {
                            text += "<tr class='trlight' onclick=\"audioplay('" + value.file + "', this);\"; onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td><div class=\'audiobutton\'></td>";
                         } else {
                            text += "<tr class='trlight' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td>";
                             svgclass = "svglight";
                            // parse json image url
                            text += showcamera(imageurl, value.name, svgclass);
                            text += "</td>";
                         }
                        for (let i = 0; i < keys.length; i++) {
                              switch (keys[i]){
                                     case 'private':
                                     case 'topics':
                                     case 'extract':
                                          // nop
                                     break;
                                     case 'updated':
                                          text += '<td>' + value[keys[i]].substr(0, 10) + '</td>' + '\r\n';
                                     break;
                                     case 'href':
                                        text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                        text += value.name + "</a></td>";
                                     break;
                                     case 'name':
                                          if (value.href === undefined) {
                                             text += '<td><a class="cardcontainer" onclick="handleClick(\'' + value.name + '\', \'' + value.release_date + '\', \'' + value.year + '\')">';
                                             text += value[keys[i]] + '</a></td>' + '\r\n';
                                          } else {
                                             if (value.href.indexOf("<a") != -1){
                                                text += '<td>' + value.href + value.name + '</a></td>' + '\r\n';
                                             } else {
                                                if (pagetype === 'playlist') {
                                                   text += '<td><a class="cardcontainer" onclick="switchlistview(\'' + listtype + '\', \'musiclist\', \'' + value.name + '\')">'
                                                } else {
                                                text += '<td><a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                                }
                                                text += value.name + "</a></td>" + '\r\n';
                                             }
                                          }
                                     break;
                                     case 'album':
                                         text += '<td><a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); + imageoverlay(\''
                                         text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a></td>' + '\r\n';
                                     break;
                                     case 'genre':
                                         text += '<td><a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicgenre(\'' + value.genre + '\'); + imageoverlay(\''
                                         text += titlecase(value.genre) + '\', \'paper\',\'remote\')">' + value.genre + '</a></td>' + '\r\n';
                                     break;
                                     default:
                                          text += '<td>' + value[keys[i]] + '</td>' + '\r\n';
                                     break;
                              }
                        }
                        text += '</tr>';
                  break;
                  case 'list':
                           text += '<div class="columnlist"><div class="cardlist" onmouseOver=\'' +
                                   "getdivletter(" + cnt + "); trletteron();' onmouseOut='trletteroff();'>";
                           svgclass = "svglight";
                        for (let i = 0; i < keys.length; i++) {
                              switch (keys[i]){
                                     case 'private':
                                     case 'file':
                                     case 'topics':
                                     case 'extract':
                                          // nop
                                     break;
                                     case 'updated':
                                          text += "<br>last update <b>" + value.updated.substr(0, 10) + "</b>&nbsp;&nbsp;";
                                     break;
                                     case 'href':
                                        text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                        text += value.name + "</a></td>";
                                     break;
                                     case 'name':
                                          if (value.href === undefined) {
                                             text += '<a class="cardcontainer" onclick="handleClick(\'' + value.name + '\', \'' + value.release_date + '\', \'' + value.year + '\')">';
                                             //text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); imageoverlay(\'' + titlecase(value.name) + '\', \'paper\',\'remote\')">';
                                             text += '<b>' + value[keys[i]] + '</a></b><br>' + '\r\n';
                                          } else {
                                             if (value.href.indexOf("<a") != -1){
                                                text += '<b>' + value.href + value.name + '</b></a><br>' + '\r\n';
                                             } else {
                                                text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                                text += '<b>' + value.name + "</b></a><br>";
                                             }
                                          }
                                     break;
                                     case 'album':
                                         text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); + imageoverlay(\''
                                         text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a><br>';
                                     break;
                                     case 'genre':
                                         text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicgenre(\'' + value.genre + '\'); + imageoverlay(\''
                                         text += titlecase(value.genre) + '\', \'paper\',\'remote\')">' + value.genre + '</a><br>';
                                     break;
                                     default:
                                          text += value[keys[i]] + '<br>' + '\r\n';
                                     break;
                              }
                        }
                        // parse json image url
                        text += showcamera(imageurl, value.name, svgclass);
                        text += '</p></div></div></div>';
                        cnt += 1;
                break;
                case 'tile':
                      text += '<div class="cardcontainer"><div class="column"><div class="card"><p>';
                      for (let i = 0; i < keys.length; i++) {
                            switch (keys[i]){
                                   case 'private':
                                   case 'file':
                                   case 'topics':
                                   case 'extract':
                                        // nop
                                   break;
                                   case 'updated':
                                        text += "<br>last update <b>" + value.updated.substr(0, 10) + "</b><br>";
                                   break;
                                   case 'href':
                                      text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                      text += value.name + "</a></td>";
                                   break;
                                   case 'name':
                                        if (value.href === undefined) {
                                           text += '<a class="cardcontainer" onclick="handleClick(\'' + value.name + '\', \'' + value.release_date + '\', \'' + value.year + '\')">';
                                           //text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); imageoverlay(\'' + titlecase(value.name) + '\', \'paper\',\'remote\')">';
                                           text += '<b>' + value[keys[i]] + '</a></b><br><br>' + '\r\n';
                                        } else {
                                           if (value.href.indexOf("<a") != -1){
                                              text += '<b>' + value.href + value.name.toUpperCase() + '</b></a><br><br>' + '\r\n';
                                           } else {
                                              text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                                              text += '<b>' + value.name + "</b></a><br><br>";
                                           }
                                        }
                                   break;
                                     case 'album':
                                         text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); + imageoverlay(\''
                                         text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a><br>';
                                     break;
                                     case 'genre':
                                         text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicgenre(\'' + value.genre + '\'); + imageoverlay(\''
                                         text += titlecase(value.genre) + '\', \'paper\',\'remote\')">' + value.genre + '</a><br>';
                                     break;
                                   case 'description':
                                        text += value.description + "<br>" + '\r\n';
                                   break;
                                   default:
                                        text += value[keys[i]] + '<br>' + '\r\n';
                                   break;
                            }
                      }
                      text += showcamera(imageurl, value.name, svgclass);
                      if (value.current != undefined){
                          if (value.current.indexOf("windows") > 0) {
                            text += '<br><br><br><br><svg class="' + svgclass + ' svgbottom" viewBox="-0.5 0 257 257">' +
                                             windowslogo() +
                                    '</svg>';
                          }
                      }
                      text += '</p></div></div></div>';
                  break;
              } // end if private true or false
            } // end switch
        });
        text += "</table>";
        document.getElementById("reponame").innerHTML = text;
        //if (listtype == 'data') { document.getElementById("srinput").focus();}

        // todo resolve hack for audioplayer reset playlist
        if (typeof trElements != 'undefined') {
            trElements = document.querySelectorAll('tr.trlight');
            trElements.forEach(trElement => {
                const onclickAttribute = trElement.getAttribute('onclick');
                const urlMatch = onclickAttribute.match(/audioplay\('([^']+)'/);
                if (urlMatch && urlMatch[1]) {
                    urls.push(urlMatch[1]);
                    const titleElement = trElement.querySelector('td:nth-child(3)');
                    titles.push(titleElement ? titleElement.textContent : 'Unknown Title');
                }
            });
        }

    });
    //console.log(text);
    // clean up
    text = "";
}

// set search field and focus on input box
function searchon(item){
   document.getElementById("srinput").placeholder = 'Search for ' + item + '..'; //filterelement[window.localStorage.getItem('tdelement')] + '..';
   document.getElementById("srinput").focus();
}

localStorage.setItem("menuitem", document.title);
// toggle list views
switchlistview(localStorage.getItem("listtype"), document.title);
