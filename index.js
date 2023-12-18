// style data table
function indexdatatable() {
    let text           = "";
    let filterelement  = "item";

    // get json data
    url = `index.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {
    text += "<table class='sortable' id='datatable'>";
    text += '<thead><tr><th class="thnonsticky" width=20px;>';
    text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
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
        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                     // todo find better solution onclick can not deal with target = _blank...
                     text += "<tr class='trdarkmode'>";
                     text += "<td></td><td>" + value.name + "</td>";
                     text += "<td>" + value.description + "</td>";
                     text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                     text += '<td>' + value.href + 'Source</a></td>';
               } else {
                     text += "<tr class='trlight'>";
                     text += "<td></td><td>" + value.name + "</td>";
                     text += "<td>" + value.description + "</td>";
                     text += "<td>" + value.updated_at.substr(0, 10) + "</td>";
                     text += '<td>' + value.href + 'Source</a></td>';
                }
                text += '</tr>';
            };
        });
        text += "</table>";
        document.getElementById("reponame").innerHTML = text;
        document.getElementById("srinput").focus();
        //window.alert(text);
    };
    request.send();
    // clean up
    text = "";
}

// style data list
function indexlist() {
    let text           = "";

    // get json data
    url = `index.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {
        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="cardcontainer">';
                   text += value.href;
                   text += '<div class="columnlist"><div class="cardlistdarkmode"><p>';
                } else {
                   text += '<div class="cardcontainer">';
                   text += value.href;
                   text += '<div class="columnlist"><div class="cardlist"><p>';
                }
                text += "<b>" + value.name + "</b><br>";
                text += value.description + "<br><br></p>";
                text += "last update<b> " + value.updated_at.substr(0, 10) + "</b><br>";
                text += '</div></div><span class="link"></span></a></div>';
            };
        });
        document.getElementById("reponame").innerHTML = text;
        //window.alert(text);
    };
    request.send();
    // clean up
    text = "";
}

// style data tile
function indextile() {
    let text           = "";

    // get json data
    url = `index.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {
        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="cardcontainer">';
                   text += value.href;
                   text += '<div class="column"><div class="carddarkmode">';
                } else {
                   text += '<div class="cardcontainer">';
                   text += value.href;
                   text += '<div class="column"><div class="card">';
                }
                text += "<b>" + value.name.toUpperCase() + "</b><p>";
                text += "last update: " + value.updated_at.substr(0, 10) + "<br><br>";
                text += value.description + "</p>";
                text += '</div></div><span class="link"></span></a></div>';
            };
        });
        document.getElementById("reponame").innerHTML = text;
        //window.alert(text);
    };
    request.send();
    // clean up
    text = "";
}

// style sidenav
function indexsidenav() {
    let text           = "";

    // get json data
    url = `index.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {
        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   //text += '<div class="cardcontainer">';
                   text += value.href;
                   //text += '<div class="column"><div class="carddarkmode">';
                } else {
                   //text += '<div class="cardcontainer">';
                   text += value.href;
                   //text += '<div class="column"><div class="card">';
                }
                text += "<b>" + value.name.toLowerCase() + "</b></a>";
                //text += "last update: " + value.updated_at.substr(0, 10) + "<br><br>";
                //text += value.description + "</p>";
                //text += '</div></div><span class="link"></span></a></div>';
            };
        });
        document.getElementById("sidenavcontent").innerHTML = text;
        //window.alert(text);
    };
    request.send();
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
