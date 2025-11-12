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

function getlink(value, linktype) {
    switch (linktype) {
        case 'image':
             return '<a class="pointer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
        break;
        case 'generic':
             return '<a class="pointer" onclick="handleClick(\'' + value.name + '\', \'' + value.year + '\')">';
        break;
        case 'album':
             return '<a class="pointer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicalbum(\'' + value.name + '\'); + imageoverlay(\'';
        break;
        case 'genre':
             return '<a class="pointer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; passmusicgenre(\'' + value.genre + '\'); + imageoverlay(\'';
        break;
    }
}

function getsearchbox(keys, filterelement, item, listtype) {
    let text = "";
    text += '<div style="display:flex;align-items:top;gap:3px;margin-bottom:1px;width:100%;">';
    text += '<input class="tablesearchboxlight" type="text" id="srinput" placeholder="Search for ' +
            (filterelement[window.localStorage.getItem('tdelement')] || keys[0]) +
            '..">';
    text += '<select class="trfilterselect" id="filterdropdown" style="max-width:200px;margin-left:auto" ' +
            'onchange="localStorage.setItem(\'tdelement\', this.options[this.selectedIndex].getAttribute(\'data-item\'));' +
            'searchon(this.value);' +
            'document.getElementById(\'srinput\').placeholder = \'Search for \' + this.value + \'..\'">';
            for (let i = 0; i < keys.length; i++) {
                if (listtype !== 'data' && i < 2){
                    text += '<option value="' + keys[i] + '" data-item="' + item + '">all</option>';
                    break;
                } else {
                    text += '<option value="' + keys[i] + '" data-item="' + item + '">' + keys[i] + '</option>';
                    filterelement[i + 1] = keys[i];
                    item += 1;
                }
            }
    text += '</select></div>';
    return text;
}

function switchlistview(listtype, pagetype = document.title, extatype = "") {
    let text            = "";
    let camera          = false;
    let svgclass        = "svglight";
    let cnt             = 0;
    let dummy           = "";
    let item            = 1;
    let tileCount       = 0;
    const filterelement = [];
    var fields          = [];

    if (window.localStorage.getItem('tdelement') == null) {
       window.localStorage.setItem('tdelement', '1');
    }
    if (listtype == null) {
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
    if (extatype !== "") {
        temptype = 'playlist/' + extatype;
    }

    // get json data per section site
    getjsonf(temptype + '.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.name.toUpperCase(),
              b = y.name.toUpperCase();
          return a === b ? 0 : a > b ? 1 : -1;
        });

        var k = JSON.parse(JSON.stringify( data, fields , 4));
        // map fieldnames aka columns aka keys
        var keys = Object.keys(k[0]);
        // use k to reorder json file then save on os
        //download('hello.json', JSON.stringify(k, null, 2));

        window.localStorage.setItem('nritems', data.length)
        // todo needs better handling when using audioplayer
        //console.table(data.map(item => item.file));
        // create a temporary data structure without the 'file' column
        // syntax file, album, ...rest  add columns if needed
        // filters out unwanted column for displaying but still usable
        if (pagetype === 'musiclist'){
            const tempdata = data.map(item => {
                const { file,length, ...rest } = item;
                return rest;
            });
            keys = Object.keys(tempdata[0]);
        }

        // hack force listtype to data for external music
        if (document.title === 'playlist') { listtype = 'data'; }

        switch (listtype){
            case 'data':
              text += "<table class='sortable' id='datatable'>";
              text += '<thead><tr><th class="thnonsticky" width=20px;>';
              for (let i = 0; i < keys.length; i++) {
                  text += '<th>' + keys[i] + '</th>' + '\r\n';
              }
              text += '</tr></thead>';
              text += getsearchbox(keys, filterelement, item, listtype);
              break;
           case 'list':
                text += "<table class='sortable' id='datatable'>";
                text += getsearchbox(keys, filterelement, item, listtype);
           break;
           case 'tile':
                text = "<div class='tile-view-mode'><table class='sortable' id='datatable'><tbody><tr>";
                text += getsearchbox(keys, filterelement, item, listtype);
           break;
        }

        svgclass = "svglight";
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false || value.private === 'false' || value.private == null) {
                switch (listtype){
                  case 'data':
                         // todo tricky way of bypassing audioplayer if no file is defined
                         if (value.file !== undefined) {
                            text += "<tr class='trlight' onclick=\"audioplay('" + value.file + "', this);\"; onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td><div class=\'audiobutton\'></td>";
                         } else {
                            text += "<tr class='trlight' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td>";
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
                                        text += getlink(value, 'image');
                                        text += value.name + "</a></td>";
                                     break;
                                     case 'name':
                                          // generic
                                          if (value.href === undefined) {
                                             text += '<td>' + getlink(value, 'generic');
                                             text += value[keys[i]] + '</a></td>' + '\r\n';
                                          } else {
                                             if (value.href.indexOf("<a") !== -1){
                                                text += '<td>' + value.href + value.name + '</a></td>' + '\r\n';
                                             } else {
                                                if (pagetype === 'playlist') {
                                                   text += '<td><a class="tilecontainer" onclick="switchlistview(\'' + listtype + '\', \'musiclist\', \'' + value.name + '\')">'
                                                } else {
                                                   // gallery
                                                   text += '<td>' + getlink(value, 'image');
                                                }
                                                text += value.name + "</a></td>" + '\r\n';
                                             }
                                          }
                                     break;
                                     case 'album':
                                         text +=  '<td>' + getlink(value, 'album');
                                         text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a></td>' + '\r\n';
                                     break;
                                     case 'genre':
                                         text +=  '<td>' + getlink(value, 'genre');
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
                        text += "<tr class='trlight' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td width='7%'>";
                        text += showcamera(imageurl, value.name, svgclass);
                        text += "</td><td>";
                        for (let i = 0; i < keys.length; i++) {
                              switch (keys[i]){
                                     case 'private':
                                     case 'file':
                                     case 'topics':
                                     case 'extract':
                                          // nop
                                     break;
                                     case 'updated':
                                          text += "<br>last update <b>" + value.updated.substr(0, 10) + "</b>";
                                     break;
                                     case 'href':
                                        text += getlink(value, 'image');
                                        text += value.name + "</a>";
                                     break;
                                     case 'name':
                                          if (value.href === undefined) {
                                             text += getlink(value, 'generic');
                                             text += '<b>' + value[keys[i]] + '</b></a><br>' + '\r\n';
                                          } else {
                                             if (value.href.indexOf("<a") !== -1){
                                                text += '<b>' + value.href + value.name + '</b></a><br>' + '\r\n';
                                             } else {
                                                text += getlink(value, 'image');
                                                text += '<b>' + value.name + "</b></a><br>";
                                             }
                                          }
                                     break;
                                     case 'album':
                                         text += getlink(value, 'album');
                                         text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a><br>';
                                     break;
                                     case 'genre':
                                         text += getlink(value, 'album');
                                         text += titlecase(value.genre) + '\', \'paper\',\'remote\')">' + value.genre + '</a><br>';
                                     break;
                                     default:
                                          text += value[keys[i]] + '<br>' + '\r\n';
                                     break;
                              }
                        }
                        text += '</td></tr>';
                        cnt += 1;
                break;
                case 'tile':
                    text += `<td class="tilecontainer"><table style="width:100%"><tr onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td class="tile"><p>`;
                    for (let i = 0; i < keys.length; i++) {
                        switch (keys[i]) {
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
                              text += getlink(value, 'image');
                              text += value.name + "</a>";
                              break;
                          case 'name':
                              if (value.href === undefined) {
                                  text += getlink(value, 'generic');
                                  text += '<b>' + value[keys[i]] + '</a></b><br><br>' + '\r\n';
                              } else {
                                  if (value.href.indexOf("<a") !== -1) {
                                      text += '<b>' + value.href + value.name + '</b></a><br><br>' + '\r\n';
                                  } else {
                                      text += getlink(value, 'image');
                                      text += '<b>' + value.name + "</b></a><br>";
                                  }
                              }
                              break;
                          case 'album':
                              text += getlink(value, 'album');
                              text += titlecase(value.name) + '\', \'paper\',\'remote\')">' + value.album + '</a><br>';
                              break;
                          case 'genre':
                              text += getlink(value, 'genre');
                              text += titlecase(value.genre) + '\', \'paper\',\'remote\')">' + value.genre + '</a><br>';
                              break;
                            default:
                                text += value[keys[i]] + '<br>' + '\r\n';
                                break;
                        }
                    }
                    text += showcamera(imageurl, value.name, svgclass);
                    if (value.current?.indexOf("windows") > 0) {
                        text += '<br><br><br><br><svg class="' + svgclass + ' svgbottom" viewBox="-0.5 0 257 257">' + svgwindowslogo() + '</svg>';
                    }
                    text += `</p></td></tr></table></td>`;
                
                    tileCount++;
                
                    if (tileCount % 3 === 0 && tileCount < Object.keys(data).length) {
                        text += '</tr><tr>';
                    }
                    break;
              } // end if private true or false
            } // end switch
        });

        switch (listtype){
          case 'data':
          case 'list':
               text += "</table>";
          case 'tile':
              // close the last row if needed
              if (tileCount % 3 !== 0) {
                  text += '</tr>';
              }
              text += '</tbody></table></div>';
          break;
        }

        document.getElementById("reponame").innerHTML = text;

        // todo resolve hack for audioplayer reset playlist
        if (typeof trElements !== 'undefined') {
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
    // clean up
    text = "";
}

// set search field and focus on input box
function searchon(item){
   document.getElementById("srinput").placeholder = 'Search for ' + item + '..';
   document.getElementById("srinput").focus();
}

// switch theme icon
let themeicon = "";
switch (window.localStorage.getItem('theme')) {
    case 'dark':
          themeicon = `<svg class="svglight" viewBox="-5 -5 34 34">
            <circle cx="12" cy="12" r="5"/>
            <path d="M21,13H20a1,1,0,0,1,0-2h1a1,1,0,0,1,0,2Z
            M4,13H3a1,1,0,0,1,0-2H4a1,1,0,0,1,0,2Z
            M17.66,7.34A1,1,0,0,1,17,7.05a1,1,0,0,1,0-1.41l.71-.71a1,1,0,1,1,1.41,1.41l-.71.71A1,1,0,0,1,17.66,7.34Z
            M5.64,19.36a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.41L5.64,17a1,1,0,0,1,1.41,1.41l-.71.71A1,1,0,0,1,5.64,19.36Z
            M12,5a1,1,0,0,1-1-1V3a1,1,0,0,1,2,0V4A1,1,0,0,1,12,5Z
            M12,22a1,1,0,0,1-1-1V20a1,1,0,0,1,2,0v1A1,1,0,0,1,12,22Z
            M6.34,7.34a1,1,0,0,1-.7-.29l-.71-.71A1,1,0,0,1,6.34,4.93l.71.71a1,1,0,0,1,0,1.41A1,1,0,0,1,6.34,7.34Z
            M18.36,19.36a1,1,0,0,1-.7-.29L17,18.36A1,1,0,0,1,18.36,17l.71.71a1,1,0,0,1,0,1.41A1,1,0,0,1,18.36,19.36Z"/>
          </svg>`
    break;
    case null:
    case 'light':
          themeicon = `<svg class="svglight" viewBox="-5 -5 34 34">
            <path d="M21 12.79A9 9 0 1 1 11.21 3
            7 7 0 0 0 21 12.79z"></path>
          </svg>`
    break;
}
document.getElementById("themeicon").innerHTML = themeicon;

localStorage.setItem("menuitem", document.title);
// toggle list views
switchlistview(localStorage.getItem("listtype"), document.title);
