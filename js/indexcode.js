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
       window.localStorage.setItem('listtype', 'tile');
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

    // toggle fetch
    const datafetch   = document.title === 'paper' ? getzipzarchive : getjsonf;
    const datafetchfn = document.title === 'paper' ? 'archive/test.zip' : temptype + '.json';

    // get json data per section site
    datafetch(datafetchfn, function(data) {
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.name.toUpperCase(),
              b = y.name.toUpperCase();
          return a === b ? 0 : a > b ? 1 : -1;
        });

        var k = JSON.parse(JSON.stringify( data, fields , 4));
        // map fieldnames aka columns aka keys

        if (pagetype === 'paper') {
                var keys = Object.keys(data[0]);
        } else {
                var keys = Object.keys(k[0]);
        }

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
                                    case 'file':
                                          // generic
                                          if (value.href === undefined) {
if (pagetype === 'paper') {
const folder = value[keys[i+2]];
const filepath = folder && folder.trim() ? folder + '/' + value[keys[i]] : value[keys[i]];
text += '<td><a class="pointer" onclick="showEntry(\'' + filepath + '\', this)">' + value[keys[i]].replace(/\.[^/.]+$/, "") + '</a></td>\r\n';
} else {
                                             text += '<td>' + getlink(value, 'generic');
                                             text += value[keys[i]] + '</a></td>' + '\r\n';
}
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
if (pagetype === 'paper') {
const folder = value[keys[i+2]];
const filepath = folder && folder.trim() ? folder + '/' + value[keys[i]] : value[keys[i]];
text += '<b><a class="pointer" onclick="showEntry(\'' + filepath + '\', this)">' + value[keys[i]].replace(/\.[^/.]+$/, "") + '</a></b></br>\r\n';
} else {
                                             text += getlink(value, 'generic');
                                             text += '<b>' + value[keys[i]] + '</b></a><br>' + '\r\n';
}
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
if (pagetype === 'paper') {
const folder = value[keys[i+2]];
const filepath = folder && folder.trim() ? folder + '/' + value[keys[i]] : value[keys[i]];
text += '<b><a class="pointer" onclick="showEntry(\'' + filepath + '\', this)">' + value[keys[i]].replace(/\.[^/.]+$/, "") + '</a></b><br>\r\n';
} else {
                                  text += getlink(value, 'generic');
                                  text += '<b>' + value[keys[i]] + '</a></b><br><br>' + '\r\n';
}
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
                if (trElement.getAttribute('onclick') !== null) {
                  const onclickAttribute = trElement.getAttribute('onclick');
                  const urlMatch = onclickAttribute.match(/audioplay\('([^']+)'/);
                    if (urlMatch && urlMatch[1]) {
                        urls.push(urlMatch[1]);
                        const titleElement = trElement.querySelector('td:nth-child(3)');
                        titles.push(titleElement ? titleElement.textContent : 'Unknown Title');
                    }
                }
            });
        }
    }); // end data
    // clean up
    text = "";
}

// set search field and focus on input box
function searchon(item){
   document.getElementById("srinput").placeholder = 'Search for ' + item + '..';
   document.getElementById("srinput").focus();
}

localStorage.setItem("menuitem", document.title);
// toggle list views
switchlistview(localStorage.getItem("listtype"), document.title);
