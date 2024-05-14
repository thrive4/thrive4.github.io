function switchlistview(listtype) {
    let text           = "";
    let filterelement  = "title";
    let camera         = false;
    let svgclass       = "svglight";
    let cnt            = 0;

    let film           = "";

    if (listtype == undefined) {
       listtype = 'list';
       localStorage.setItem("listtype", 'list');
    }
    // ui label for searchbox indicates which element will filter
    if (window.localStorage.getItem('tdelement') === '1') {
       filterelement = "title";
    }
    if (window.localStorage.getItem('tdelement') === null) {
       window.localStorage.setItem('tdelement', '1');
    }

    // get json table
    getjson('gallery.json', function(data){
    if (data)
        // inital page load sort data
        data.sort(function (x, y) {
          let a = x.title.toUpperCase(),
              b = y.title.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        switch (listtype){
          case 'data':
            text += "<table class='sortable' id='datatable'>";
            text += '<thead><tr><th class="thnonsticky" width=20px;>';
            text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
            text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'1\')";>title</a>';
            text += '</div></div></th>';
            text += '<th>title</th>';
            text += '<th>update</th>';
            text += '</tr></thead>';
            if (window.localStorage.getItem('theme') === 'dark') {
               text += '<input class="tablesearchboxdark" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
            } else {
               text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
            }
        }
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            film = value.title;//.split('.').slice(0, -1).join('.');
            //if (value.private === false || value.private === 'false') {
                switch (listtype){
                  case 'data':
                      if (window.localStorage.getItem('theme') === 'dark') {
                           // todo find better solution onclick can not deal with target = _blank...
                           text += "<tr class='trdarkmode' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'>";
                      } else {
                           text += "<tr class='trlight' onmouseOver='gettrletter(this); trletteron();' onmouseOut='trletteroff();'>";
                      }
                      // parse json image url
                      //text += showcamera(imageurl, value.name, svgclass);
                      text += "<td></td><td>";
                      //text += '<a href="https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
                      text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                      text += film + "</a></td>";
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
                      text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                      text += "<b>" + film + "</b></a><br>";
                      // parse json image url
                      //text += showcamera(imageurl, value.name, svgclass);
                      text += '</div></div><span class="link"></span></a></div>';
                      cnt += 1;
                      break;
                 case 'tile':
                      text += '<div class="cardcontainer">';
                      if (window.localStorage.getItem('theme') === 'dark') {
                         text += '<div class="column"><div class="carddarkmode">';
                      } else {
                         text += '<div class="column"><div class="card">';
                      }
                      text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.href + '\', \'image\',\'local\')">';
                      text += "<b>" + film + "</b></a><p>";
                      // parse json image url
                      //text += showcamera(imageurl, value.name, svgclass);
                      text += '</div></div><span class="link"></span></a></div>';
                      break;
                 } // end switch
             //} // end if private true or false
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
