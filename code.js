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
       filterelement = "update";
    }
    if (window.localStorage.getItem('tdelement') === '3') {
       filterelement = "downloads";
    }
    if (window.localStorage.getItem('tdelement') === '4') {
       filterelement = "repo";
    }
    if (window.localStorage.getItem('tdelement') === null) {
       window.localStorage.setItem('tdelement', '1');
    }
    // get json data
    getjson('code.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.current.toUpperCase(),
              b = y.current.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        switch (listtype){
          case 'data':
            text += "<table class='sortable' id='datatable'>";
            text += '<thead><tr><th class="thnonsticky" width=20px;>';
            text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'1\')";>app</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'2\')";>update</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'4\')";>repo</a>';
            text += '</div></div></th>';
            text += '<th>name</th>';
            text += '<th>update</th>';
            text += '<th>repo</th>';
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
                        text += "</td><td>" + value.name + "</td>";
                        text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                        text += '<td><a href="' + value.html_url + '">Source</a>' + " | ";
                        text += '<a href="' + value.html_url + '/releases">Release</a>' + "</td>";
                        text += '</tr>';
                    break;
                  case 'list':
                        if (window.localStorage.getItem('theme') === 'dark') {
                           text += '<div class="columnlist"><div class="cardlistdarkmode" onmouseOver=\'' +
                                   "getdivdarkletter(" + cnt + "); trletteron();' onmouseOut='trletteroff();'>";
                           svgclass = "svgdarkmode";
                        } else {
                           text += '<div class="columnlist"><div class="cardlist" onmouseOver=\'' +
                                   "getdivletter(" + cnt + "); trletteron();' onmouseOut='trletteroff();'>";
                           svgclass = "svglight";
                        }
                        text += "<b>" + value.current + "</b> / ";
                        text += value.description + "<br>";
                        text += "last update<b> " + value.updated_at.substr(0, 10) + "</b><br>";
                        text += '<a href="' + value.html_url + '">Source</a>' + " | ";
                        text += '  <a href="' + value.html_url + '/releases">Release</a>';
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
                        text += value.description + "<br>";
                        text += "last update: " + value.updated_at.substr(0, 10) + "<br><br>";
                        text += "<b>" + value.current + "</b><br><br><br>";
                        text += '<a href="' + value.html_url + '">Source</a>' + " | ";
                        text += '  <a href="' + value.html_url + '/releases">Release</a>' + "<br><br>";
                          // parse json image url
                          text += showcamera(imageurl, value.name, svgclass);
                        if (value.current.indexOf("windows") > 0) {
                          text += '<br><br><svg class="' + svgclass + ' svgbottom" viewBox="-0.5 0 257 257">' +
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
