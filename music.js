// style data table
function indexdatatable() {
    let text           = "";
    let filterelement  = "";
    let camera         = false;
    let svgclass       = "svglight";

    // ui label for searchbox indicates which element will filter
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
       filterelement = "artist";
    }

    // get json table
    getjson('music.json', function(data){
    if (data)
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
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            //if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                     // todo find better solution onclick can not deal with target = _blank...
                     text += "<tr class='trdarkmode'>";
               } else {
                     text += "<tr class='trlight'>";
               }
               text += "<td></td><td>";
               //text += '<a href="https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
               text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; paperoverlay(\'' + value.artist.replaceAll(' ', '_') + '\')">';
               //text += value.artist.replaceAll(' ', '_') + '" target=_blank </a>' + value.artist + "</td>";
               text += value.artist + "</a></td>";
               text += "<td>" + value.title + "</td>";
               text += '<td><a href=\'http://musicbrainz.org/ws/2/release-group/?query=artist:"' + value.artist + '" AND primarytype:"album"\' target="_blank">';
               text += value.album + "</a></td>";
               //text += "<td>" + value.album + "</td>";
               text += '<td><a href=\'http://musicbrainz.org/ws/2/tag/?query="' + value.genre + '\' target="_blank">';
               text += value.genre + "</a></td>";
               //text += "<td>" + value.genre + "</td>";
               text += '<td>' + value.year.substring(0, 4) + '</td>';
               text += '</tr>';
            //};
        });
        text += "</table>";
        document.getElementById("reponame").innerHTML = text;
        document.getElementById("srinput").focus();
        //window.alert(text);
    });
    // clean up
    text = "";
}

// style data list
function indexlist() {
    let text           = "";
    let camera         = false;
    let svgclass       = "svglight";

    // get json list
    getjson('music.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            text += '<div class="cardcontainer">';
            if (window.localStorage.getItem('theme') === 'dark') {
               text += '<div class="columnlist"><div class="cardlistdarkmode">';
            } else {
               text += '<div class="columnlist"><div class="cardlist">';
            }
            text += "<b>" + value.title + "</b><br>";
            text += value.artist + "<br>";
            text += value.album + " / " + value.year + "<br>";
            text += value.genre;
            text += '</div></div><span class="link"></span></a></div>';
        });
        document.getElementById("reponame").innerHTML = text;
    });
    // clean up
    text = "";
}

// style data tile
function indextile() {
    let text           = "";
     let camera         = false;
    let svgclass       = "svglight";

    // get json tile
    getjson('music.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            text += '<div class="cardcontainer">';
            if (window.localStorage.getItem('theme') === 'dark') {
               text += '<div class="column"><div class="carddarkmode">';
            } else {
               text += '<div class="column"><div class="card">';
            }
            text += "<b>" + value.title.toUpperCase() + "</b><p>";
            text += value.artist + "<br>";
            text += value.album + " / " + value.year + "<br>";
            text += value.genre + "<br>";
            text += '</div></div><span class="link"></span></a></div>';
        });
        document.getElementById("reponame").innerHTML = text;
    });
    // clean up
    text = "";
}

// toggle list views
switchlistview(listtype)
function switchlistview(listtype) {
   // used for main menu navigation
   indexsidenav();
   switch(localStorage.getItem("listtype")) {
      case 'tile':
            indextile();
            break;
       case 'list':
            indexlist();
            break;
       case 'data':
            indexdatatable();
            break;
       default:
            indextile();
            localStorage.setItem("listtype", 'tile');
            break;
    }
}