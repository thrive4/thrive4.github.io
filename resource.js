// style data table
function indexdatatable() {
    let text           = "";
    let filterelement  = "";
    let camera         = false;
    let svgclass       = "svglight";

     // ui label for searchbox indicates which element will filter
    if (window.localStorage.getItem('tdelement') === '1') {
       filterelement = "name";
    }
    if (window.localStorage.getItem('tdelement') === '2') {
       filterelement = "description";
    }
    if (window.localStorage.getItem('tdelement') === '3') {
       filterelement = "update";
    }
    if (window.localStorage.getItem('tdelement') === null) {
       window.localStorage.setItem('tdelement', '1');
       filterelement = "name";
    }

    // get json table
    getjson('resource.json', function(data){
    if (data)
        //console.log('json data : ' + JSON.stringify(data));
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
        text += '<th>link</th>';
        text += '</tr></thead>';
        if (window.localStorage.getItem('theme') === 'dark') {
           text += '<input class="tablesearchboxdark" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
        } else {
           text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
        }
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.private === false || value.private === 'false') {
               if (window.localStorage.getItem('theme') === 'dark') {
                    text += "<tr class='trdarkmode'><td>";
                    svgclass = "svgdarkmode";
               } else {
                    text += "<tr class='trlight'><td>";
                    svgclass = "svglight";
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
                text += "<td>" + value.description + "</td>";
                text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                text += '<td>' + value.href + 'Source</a></td>';
                text += '</tr>';
            };
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
    getjson('resource.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false || value.private === 'false') {
                text += '<div class="cardcontainer">';
                text += value.href;
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="columnlist"><div class="cardlistdarkmode"><p>';
                   svgclass = "svgdarkmode";
                } else {
                   text += '<div class="columnlist"><div class="cardlist"><p>';
                   svgclass = "svglight";
                }
                text += "<b>" + value.name + "</b><br></b>";
                text += value.description + "</p>";
                text += "last update<b> " + value.updated_at.substr(0, 10);

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
                text += '<br><br></div></div><span class="link"></span></a></div>';
            };
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
    getjson('resource.json', function(data){
    if (data)
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false || value.private === 'false') {
                text += '<div class="cardcontainer">';
                text += value.href;
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="column"><div class="carddarkmode">';
                   svgclass = "svgdarkmode";
                } else {
                   text += '<div class="column"><div class="card">';
                   svgclass = "svglight";
                }
                text += "<b>" + value.name.toUpperCase() + "</b><p>";
                text += "last update: " + value.updated_at.substr(0, 10) + "<br><br>";
                text += value.description + "</p>";
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
                text += '</div></div><span class="link"></span></a></div>';

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
