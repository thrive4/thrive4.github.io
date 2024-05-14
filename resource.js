function switchlistview(listtype) {
    let text           = "";
    let camera         = false;
    let svgclass       = "svglight";
    let cnt            = 0;
    let dummy          = "";
    if (listtype == undefined) {
       listtype = 'list';
       localStorage.setItem("listtype", 'list');
    }
    // ui label for searchbox indicates which element will filter
    let filterelement  = "name";
    if (window.localStorage.getItem('tdelement') === '1') {
       filterelement = "name";
    }
    if (window.localStorage.getItem('tdelement') === '2') {
       filterelement = "description";
    }
    if (window.localStorage.getItem('tdelement') === '3') {
       filterelement = "update";
    }
    // get json data
    getjson('resource.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.name.toUpperCase(),
              b = y.name.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        switch (listtype){
          case 'data':
            text += "<table class='sortable' id='datatable'>";
            text += '<thead><tr><th class="thnonsticky" width=20px;>';
            text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'1\')";>name</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'2\')";>description</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'3\')";>update</a>';
            text += '</div></div></th>';
            text += '<th>name</th>';
            text += '<th>description</th>';
            text += '<th>update</th>';
            text += '</tr></thead>';
            if (window.localStorage.getItem('theme') === 'dark') {
               text += '<input class="tablesearchboxdark" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
            } else {
               text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
            }
            break;
        }

        //console.table(data);
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.private === false || value.private === 'false') {
                switch (listtype){
                  case 'data':
                        if (window.localStorage.getItem('theme') === 'dark') {
                             // todo find better solution onclick can not deal with target = _blank...
                             text += "<tr class='trdarkmode' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td>";
                            svgclass = "svgdarkmode";
                       } else {
                             text += "<tr class='trlight' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'><td>";
                            svgclass = "svglight";
                       }
                        // parse json image url
                        text += showcamera(imageurl, value.name, svgclass);
                        text += "</td><td>" + value.href + value.name + "</a></td>";
                        text += "<td>" + value.href + value.description + "</a></td>";
                        text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                        text += '</tr>';
                    break;
                  case 'list':
                        text += '<div class="cardcontainer">';
                        if (window.localStorage.getItem('theme') === 'dark') {
                           text += '<div class="columnlist"><div class="cardlistdarkmode" onmouseOver=\'' +
                                   "getdivdarkletter(" + cnt + "); trletteron();' onmouseOut='trletteroff();'>";
                           svgclass = "svgdarkmode";
                        } else {
                           text += '<div class="columnlist"><div class="cardlist" onmouseOver=\'' +
                                   "getdivletter(" + cnt + "); trletteron();' onmouseOut='trletteroff();'>";
                           svgclass = "svglight";
                        }
                        text += value.href;
                        text += "<b>" + value.name + "</a><br></b>";
                        text += value.href;
                        text += value.description + "</a></p>";
                        text += "last update <b>" + value.updated_at.substr(0, 10) + "</b>";
                        // parse json image url
                        text += showcamera(imageurl, value.name, svgclass);
                        text += '</p></div></div></div>';
                        cnt += 1;
                 break;
                case 'tile':
                      if (window.localStorage.getItem('theme') === 'dark') {
                         text += '<div class="cardcontainer"><div class="column"><div class="carddarkmode"><p>';
                      } else {
                         text += '<div class="cardcontainer"><div class="column"><div class="card"><p>';
                      }
                      text += "<b>" + value.name.toUpperCase() + "</b><p>";
                      text += "last update: " + value.updated_at.substr(0, 10) + "<br><br>";
                      text += value.description + "</p>";
                      // parse json image url
                      text += showcamera(imageurl, value.name, svgclass);
                      if (value.name.indexOf("windows") > 0) {
                        text += '<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<svg class="' + svgclass + '" viewBox="-0.5 0 257 257">' +
                                         windowslogo() +
                                '</svg>';
                      }
                      text += '</p></div></div></div>';
                  break;
              } // end if private true or false
            } // end switch
        });
        text += "</table>";
        document.getElementById("reponame").innerHTML = text;
        if (listtype == 'data') { document.getElementById("srinput").focus();}
    });
    // clean up
    text = "";
}

// toggle list views
switchlistview(localStorage.getItem("listtype"));
