// style data table github data
function codedatatable() {
    let text           = "";
    let filterelement  = "app";
    let camera         = false;
    let svgclass       = "svglight";

    // ui label for searchbox indicates which element will filter
    if (window.localStorage.getItem('tdelement') === '1') {
       filterelement = "app";
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
       filterelement = "app";
    }

    // get repo data
    getjson('code.json', function(data){
    if (data)
        text += "<table class='sortable' id='datatable'>";
        text += '<thead><tr><th class="thnonsticky" width=20px;>';
        text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
        text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'1\')";>app</a>';
        text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'2\')";>update</a>';
        text += '<a href="" onclick="localStorage.setItem(\'tdelement\', \'4\')";>repo</a>';
        text += '</div></div></th>';
        text += '<th>app</th>';
        text += '<th>update</th>';
        text += '<th>repo</th>';
        text += '</tr></thead>';
        if (window.localStorage.getItem('theme') === 'dark') {
           text += '<input class="tablesearchboxdark" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
        } else {
           text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
        }
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                    text += "<tr class='trdarkmode'><td>";
                } else {
                    text += "<tr class='trlight'><td>";
                }
                // parse json image url
                Object.entries(imageurl).forEach((entry) => {
                    if (camera === true) {
                       return;
                    };
                    const [key2, value2] = entry;
                    if (value2.name === value.name) {
                       camera = true;
                    };
                });
                if (camera === true) {
                   text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.name + '\')">' +
                           '<svg class="' + svgclass + '" viewBox="-1 -12 44 44">' +
                                 svgcamera() +
                           '</svg></a>';
                           camera = false;
                };
                text += "</td><td>" + value.name + "</td>";
                text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                text += '<td><a href="' + value.html_url + '">Source</a>' + " | ";
                text += '<a href="' + value.html_url + '/releases">Release</a>' + "</td>";
                text += '</tr>';
            };
        });
        text += "</table>";
        document.getElementById("reponame").innerHTML = text;
        document.getElementById("srinput").focus();
        //console.log(text);
    });
    // clean up
    text = "";
}

function codelist() {
    let text           = "";
    let camera         = false;
    let svgclass       = "svglight";

    // get repo data
    getjson('code.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="cardcontainer"><div class="columnlist"><div class="cardlistdarkmode"><p>';
                } else {
                   text += '<div class="cardcontainer"><div class="columnlist"><div class="cardlist"><p>';
                }
                text += "<b>" + value.current + "</b> / ";
                text += value.description + "<br>";
                text += "last update<b> " + value.updated_at.substr(0, 10) + "</b><br>";
                text += '<a href="' + value.html_url + '">Source</a>' + " | ";
                text += '  <a href="' + value.html_url + '/releases">Release</a>';
                // parse json image url
                Object.entries(imageurl).forEach((entry) => {
                    if (camera === true) {
                       return;
                    };
                    const [key2, value2] = entry;
                    if (value2.name === value.name) {
                       camera = true;
                    };
                });
                if (camera === true) {
                   text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.name + '\')">' +
                           '<svg class="' + svgclass + '" viewBox="-20 -22 44 44">' +
                                 svgcamera() +
                           '</svg></a>';
                           camera = false;
                };
                text += '</p></div></div></div>';
            };
        });
        document.getElementById("reponame").innerHTML = text;
    });
    // clean up
    text = "";
    changelog = "";
}

function codetile() {
    let text           = "";
    let camera         = false;
    let svgclass       = "svglight";

    // get repo data
    getjson('code.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false) {
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
                Object.entries(imageurl).forEach((entry) => {
                    if (camera === true) {
                       return;
                    };
                    const [key2, value2] = entry;
                    if (value2.name === value.name) {
                       camera = true;
                    };
                });
                if (camera === true) {
                   text += '<a class="cardcontainer" onclick="document.getElementById(\'myModal\').style.display=\'block\'; imageoverlay(\'' + value.name + '\')">' +
                           '<svg class="' + svgclass + '" viewBox="-20 -22 44 44">' +
                                 svgcamera() +
                           '</svg></a>';
                           camera = false;
                };
                text += '</p></div></div></div>';
            };
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
            codetile();
            break;
       case 'list':
            codelist();
            break;
       case 'data':
            codedatatable();
            break;
       default:
            codelist();
            localStorage.setItem("listtype", 'list');
            break;
    }
}