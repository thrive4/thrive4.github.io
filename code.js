// style data table github data
function codedatatable() {
    let text           = "";
    let filterelement  = "app";
   let changelog      = "";
    let totaldownloads = 0;
    let cnt            = 0;
    //let releaseTag = "latest"; // Using tag 'latest' for latest released download count

    // get repo data
    let repouser = "thrive4"; // User name of the repository
    url = `https://api.github.com/users/${repouser}/repos`;
    //url = `github.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {
    text += "<table class='sortable' id='datatable'>";
    text += '<thead><tr><th width=20px;>';
    text += '<div class="trdropdown"><button class="trdropbtn"></button><div class="trdropdown-content">';
    text += '</div></div></th>';
    text += '<th>app</th>';
    text += '<th>update</th>';
    text += '<th>downloads</th>';
    text += '<th>repo</th>';
    text += '</tr></thead>';
    if (window.localStorage.getItem('theme') === 'dark') {
       text += '<input class="tablesearchboxdark" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
    } else {
       text += '<input class="tablesearchboxlight" type="text" id="srinput" onkeyup="searchandfilter()" placeholder="Search for ' + filterelement + '..">';
    }
        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //console.log(value.Id)
            //console.log(`${key}: ${value.Sample}`);
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                    // get release data
                    url = `https://api.github.com/repos/${repouser}/${value.name}/releases`;
                    request = new XMLHttpRequest();
                    request.open('GET', url, false);
                    request.onload = function () {
                        var objct2 = JSON.parse(this.response);
                        Object.entries(objct2).forEach((entry) => {
                            const [key2, value2] = entry;
                            if (value2.assets[0] !== undefined && value2.assets[0] !== null) {
                               totaldownloads += value2.assets[0].download_count;
                            }
                            if (cnt == 0) {
                               if (window.localStorage.getItem('theme') === 'dark') {
                                  text += "<tr class='trdarkmode'>";
                               } else {
                                  text += "<tr class='trlight'>";
                               }
                               text += "<td></td><td>" + value2.name + "</td>";
                               text += "<td>" + value.pushed_at.substr(0, 10) + "</td>";
                               cnt += 1;
                            };
                            //changelog += value2.body + "<br>";
                            document.getElementById("reponame").innerHTML        = text;
                        });
                    };
                    request.send();
                    cnt = 0;
                text += "<td>" + totaldownloads + "</td>";
                text += '<td><a href="' + value.html_url + '">Source</a>' + " | ";
                text += '<a href="' + value.html_url + '/releases">Release</a>' + "</td>";
                text += '</tr>';
                totaldownloads = 0;
                changelog = "";
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
    changelog = "";
}

function codelist() {
    let text           = "";
    let changelog      = "";
    let totaldownloads = 0;
    let cnt            = 0;
    //let releaseTag = "latest"; // Using tag 'latest' for latest released download count

    // get repo data
    let repouser = "thrive4"; // User name of the repository
    url = `https://api.github.com/users/${repouser}/repos`;
    //url = `github.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {

        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //console.log(value.Id)
            //console.log(`${key}: ${value.Sample}`);
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="cardcontainer"><div class="columnlist"><div class="cardlistdarkmode"><p>';
                } else {
                   text += '<div class="cardcontainer"><div class="columnlist"><div class="cardlist"><p>';
                }
                    // get release data
                    url = `https://api.github.com/repos/${repouser}/${value.name}/releases`;
                    request = new XMLHttpRequest();
                    request.open('GET', url, false);
                    request.onload = function () {
                        var objct2 = JSON.parse(this.response);
                        Object.entries(objct2).forEach((entry) => {
                            const [key2, value2] = entry;
                            if (value2.assets[0] !== undefined && value2.assets[0] !== null) {
                               totaldownloads += value2.assets[0].download_count;
                            }
                            if (cnt == 0) {
                               text += "<b>" + value2.name + "</b> / ";
                               cnt += 1;
                            };
                            changelog += value2.body + "<br>";
                            document.getElementById("reponame").innerHTML        = text;
                        });
                    };
                    request.send();
                    cnt = 0;
                text += value.description + "<br>";
                text += "last update<b> " + value.pushed_at.substr(0, 10) + "</b><br>";
                text += changelog.substr(0, 120) + "..<br>";
                text += "downloads: " + totaldownloads + "<br>";
                text += '<a href="' + value.html_url + '">Source</a>' + " | ";
                text += '  <a href="' + value.html_url + '/releases">Release</a>';
                text += '</p></div></div></div>';
                totaldownloads = 0;
                changelog = "";
            };
        });
        document.getElementById("reponame").innerHTML = text;
        //console.log(text)
    };
    request.send();
    // clean up
    text = "";
    changelog = "";
}

function codetile() {
    let text           = "";
    let changelog      = "";
    let totaldownloads = 0;
    let cnt            = 0;
    //let releaseTag = "latest"; // Using tag 'latest' for latest released download count

    // get repo data
    let repouser = "thrive4"; // User name of the repository
    url = `https://api.github.com/users/${repouser}/repos`;
    //url = `github.json`;
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    // work around xml parsing error in firefox, etc
    request.overrideMimeType("text/html");
    request.onload = function () {

        var objct = JSON.parse(this.response);
        Object.entries(objct).forEach((entry) => {
            const [key, value] = entry;
            //console.log(value.Id)
            //console.log(`${key}: ${value.Sample}`);
            //window.alert(`${key}${value.name}`);
            if (value.name.indexOf(".io") < 0 && value.visibility == "public" && value.private === false) {
                if (window.localStorage.getItem('theme') === 'dark') {
                   text += '<div class="cardcontainer"><div class="column"><div class="carddarkmode"><p>';
                } else {
                   text += '<div class="cardcontainer"><div class="column"><div class="card"><p>';
                }
                text += value.description + "<br>";
                text += "last update: " + value.pushed_at.substr(0, 10) + "<br>";
                    // get release data
                    url = `https://api.github.com/repos/${repouser}/${value.name}/releases`;
                    request = new XMLHttpRequest();
                    request.open('GET', url, false);
                    request.onload = function () {
                        var objct2 = JSON.parse(this.response);
                        Object.entries(objct2).forEach((entry) => {
                            const [key2, value2] = entry;
                            if (value2.assets[0] !== undefined && value2.assets[0] !== null) {
                               totaldownloads += value2.assets[0].download_count;
                            }
                            if (cnt == 0) {
                               text += "<b>" + value2.name + "</b>";
                               cnt += 1;
                            };
                            //changelog += value2.body + "<br>";
                            document.getElementById("reponame").innerHTML        = text;
                        });
                    };
                    request.send();
                    cnt = 0;
                text += "<br>downloads: " + totaldownloads + "<br>";
                //text += "<br>- changelog -<br>" + changelog + "<br>";
                text += '<a href="' + value.html_url + '">Source</a>' + " | ";
                text += '  <a href="' + value.html_url + '/releases">Release</a>' + "<br><br>";
                text += '</p></div></div></div>';
                totaldownloads = 0;
                changelog = "";
            };
        });
        document.getElementById("reponame").innerHTML = text;
        //console.log(text)
    };
    request.send();
    // clean up
    text = "";
    changelog = "";
}

// toggle list views
switchlistview(listtype)
function switchlistview(listtype) {
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