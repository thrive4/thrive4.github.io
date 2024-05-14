localStorage.setItem("menuitem", 'music');
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
    let filterelement  = "artist";
    if (window.localStorage.getItem('tdelement') === '1') {
       filterelement = "artist";
    }
    if (window.localStorage.getItem('tdelement') === '2') {
       filterelement = "title";
    }
    if (window.localStorage.getItem('tdelement') === '3') {
       filterelement = "album";
    }
    if (window.localStorage.getItem('tdelement') === '4') {
       filterelement = "genre";
    }
    if (window.localStorage.getItem('tdelement') === '5') {
       filterelement = "year";
    }
    if (window.localStorage.getItem('tdelement') === null) {
       window.localStorage.setItem('tdelement', '1');
    }
    // get json data
    getjson('music.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.artist.toUpperCase(),
              b = y.artist.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        switch (listtype){
          case 'data':
            text += "<table class='sortable' id='datatable'>";
            text += '<thead><tr><th class="thnonsticky" width=20px;>';
            text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'1\')";>artist</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'2\')";>title</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'3\')";>album</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'4\')";>genre</a>';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'5\')";>year</a>';
            text += '</div></div></th>';
            text += '<th>artist</th>';
            text += '<th>title</th>';
            text += '<th>album</th>';
            text += '<th>genre</th>';
            text += '<th>year</th>';
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
            film = value.artist.split('.').slice(0, -1).join('.');
            //window.alert(`${key}${value.name}`);
            //if (value.private === false || value.private === 'false') {
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
                       //text += '<a href="https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
                       text += '<td>';
                       text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + titlecase(value.artist) + '\', \'paper\',\'remote\')">';
                       text += value.artist + "</a></td>";
                       text += "<td>" + value.title + "</td>";
                       text += '<td><a href=\'http://musicbrainz.org/ws/2/release-group/?query=artist:"' + value.artist + '" AND primarytype:"album"\' target="_blank">';
                       text += value.album + "</a></td>";
                       text += '<td><a href=\'http://musicbrainz.org/ws/2/tag/?query="' + value.genre + '\' target="_blank">';
                       text += value.genre + "</a></td>";
                       text += '<td>' + value.year.substring(0, 4) + '</td>';
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
                        text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + titlecase(value.artist) + '\', \'paper\',\'remote\')">';
                        text += "<b>" + value.artist + "</b></a><br>";
                        text += value.title + "<br>";
                        text += '<a href=\'http://musicbrainz.org/ws/2/release-group/?query=artist:"' + value.artist + '" AND primarytype:"album"\' target="_blank">';
                        text += value.album + "</a> / " + value.year + "<br>";
                        text += '<a href=\'http://musicbrainz.org/ws/2/tag/?query="' + value.genre + '\' target="_blank">';
                        text += value.genre;
                        text += '</div></div><span class="link"></span></a></div>';
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
                        text += "<b>" + value.title.toUpperCase() + "</b><p>";
                        text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + titlecase(value.artist) + '\', \'paper\',\'remote\')">';
                        text += value.artist + "</a><br>";
                        text += '<a href=\'http://musicbrainz.org/ws/2/release-group/?query=artist:"' + value.artist + '" AND primarytype:"album"\' target="_blank">';
                        text += value.album + "</a> / " + value.year + "<br>";
                        text += '<a href=\'http://musicbrainz.org/ws/2/tag/?query="' + value.genre + '\' target="_blank">';
                        text += value.genre + "</a><br>";
                        // parse json image url
                        text += showcamera(imageurl, value.name, svgclass);
                      if (value.artist.indexOf("windows") > 0) {
                        text += '<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<svg class="' + svgclass + '" viewBox="-0.5 0 257 257">' +
                                         windowslogo() +
                                '</svg>';
                      }
                      text += '</p></div></div></div>';
                  break;
              //} // end if private true or false
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
