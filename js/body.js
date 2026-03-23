let wah = "";
wah =`
<p id="listtype"></p>
<p id="tdelement"></p>
<button onclick="topFunction()" id="backtotop" title="Go to top">
<svg fill="#ffffff" height="16px" width="16px" viewBox="0 0 512 512"><g><g>
     <path d="M505.752,358.248L271.085,123.582c-8.331-8.331-21.839-8.331-30.17,0L6.248,358.248c-8.331,8.331-8.331,21.839,
     0,30.17 s21.839,8.331,30.17,0L256,168.837l219.582,219.582c8.331,8.331,21.839,8.331,30.17,0S514.083,366.58,505.752,358.248z"/>
     </g></g>
</svg>
</button>
<div class="nav">
  <div id="mySidenav" class="sidenav">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <p id="sidenavcontent"></p>
  </div>
  <div class="nav-left">
    <a class="nav-item" style="cursor:pointer" onclick="openNav('left')">
      <svg class="svglight" viewBox="-5 -5 34 34">
           <path d="M4 6H20M4 12H20M4 18H20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    <div class="dropdown-content"><p>menu</p></div>
    <a class="nav-item" style="cursor:pointer" href="index.html">THRIVE4</a>
  </div>
  <div class="nav-right">
    <a class="nav-item" href="" onclick="switchtheme();">
        <div id="themeicon"></div>
    </a>
    <a class="nav-item" style="cursor:pointer" onclick="openNav('right')">
       <svg class="svglight" viewBox="-8 -11 52 52">
            <path d="M23.265,24.381l.9-.894c4.164.136,4.228-.01,4.411-.438l1.144-2.785L29.805,20l-.093-.231c-.049-.122-.2-.486-2.8-2.965V15.5c3-2.89,
            2.936-3.038,2.765-3.461L28.538,9.225c-.171-.422-.236-.587-4.37-.474l-.9-.93a20.166,20.166,0,0,0-.141-4.106l-.116-.263-2.974-1.3c-.438-.2-.592-.272-3.4,
            2.786l-1.262-.019c-2.891-3.086-3.028-3.03-3.461-2.855L9.149,3.182c-.433.175-.586.237-.418,4.437l-.893.89c-4.162-.136-4.226.012-4.407.438L2.285,
            11.733,2.195,12l.094.232c.049.12.194.48,2.8,2.962l0,1.3c-3,2.89-2.935,3.038-2.763,3.462l1.138,2.817c.174.431.236.584,4.369.476l.9.935a20.243,20.243,0,
            0,0,.137,4.1l.116.265,2.993,1.308c.435.182.586.247,3.386-2.8l1.262.016c2.895,3.09,3.043,3.03,3.466,2.859l2.759-1.115C23.288,28.644,23.44,
            28.583,23.265,24.381ZM11.407,17.857a4.957,4.957,0,1,1,6.488,2.824A5.014,5.014,0,0,1,11.407,17.857Z"/>
       </svg>
    </a>
  </div>
</div>
<br><br><br>
<div class="container">
     <div class="row">
        <div class="dropdown"><a href="chart.html" target="_blank">
        <svg class="svglight" id="chartview" viewBox="0 0 72 72">
            <path d="M61 49.12c0 1-.27 1.88-1.57 1.88H13.35A2.36 2.36 0 0 1 11 48.65V5.22c0-1.3.85-1.57 1.88-1.57s1.88.27 1.88 1.57v39.67a2.36 2.36
            0 0 0 2.35 2.35h42.32c1.3 0 1.57.84 1.57 1.88Z" data-name="Layer 5"/>
            <path d="M22.13 44h3.12a1.55 1.55 0 0 0 1.55-1.56V26.8a1.55 1.55 0 0 0-1.55-1.56h-3.12a1.56 1.56 0 0 0-1.56 1.56v15.59A1.56 1.56
            0 0 0 22.13 44ZM31.37 43.63h3.26A1.63 1.63 0 0 0 36.26 42V12.65A1.63 1.63 0 0 0 34.63 11h-3.26a1.63 1.63 0 0 0-1.63 1.63V42a1.63
            1.63 0 0 0 1.63 1.63ZM41.15 43.63h3.27A1.63 1.63 0 0 0 46.05 42v-9.79a1.63 1.63 0 0 0-1.63-1.63h-3.27a1.63 1.63 0 0 0-1.63 1.63V42a1.63
            1.63 0 0 0 1.63 1.63ZM50.94 43.63h3.26A1.63 1.63 0 0 0 55.83 42V19.17a1.63 1.63 0 0 0-1.63-1.63h-3.26a1.63 1.63 0 0 0-1.63 1.63V42a1.63
            1.63 0 0 0 1.63 1.63Z"/>
        </svg>
        </a><div class="dropdown-content"><p>chart view</p></div></div>

        <div class="dropdown"><a href="" onclick="switchlistview('tile'); localStorage.setItem('listtype', 'tile');">
        <svg class="svglight" id="tileview" viewBox="0 0 1400 1400">
             <path d="M313 333H153q-8 0-14-6t-6-14V153q0-8 6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zm265
             0H418q-8 0-14-6t-6-14V153q0-8 6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zm265 0H683q-8 0-14-6t-6-14V153q0-8
             6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zM313 598H153q-8 0-14-6t-6-14V418q0-8 6-14t14-6h160q8 0 14 6t6
             14v160q0 8-6 14t-14 6zm265 0H418q-8 0-14-6t-6-14V418q0-8 6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14
             6zm265 0H683q-8 0-14-6t-6-14V418q0-8 6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zM313 863H153q-8
             0-14-6t-6-14V683q0-8 6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zm265 0H418q-8 0-14-6t-6-14V683q0-8
             6-14t14-6h160q8 0 14 6t6 14v160q0 8-6 14t-14 6zm265 0H683q-8 0-14-6t-6-14V683q0-8 6-14t14-6h160q8 0 14
             6t6 14v160q0 8-6 14t-14 6z"/>
        </svg>
        </a><div class="dropdown-content"><p>tile view</p></div></div>

        <div class="dropdown"><a href="" onclick="switchlistview('list'); localStorage.setItem('listtype', 'list');">
        <svg class="svglight" id="listview" viewBox="0 0 1400 1400">
             <path d="M582 707H166v83h416v-83zm250-333H166v83h666v-83zM166 624h666v-83H166v83zm0-416v83h666v-83H166z"/>
        </svg>
        </a><div class="dropdown-content"><p>list view</p></div></div>

        <div class="dropdown"><a href="" onclick="switchlistview('data'); localStorage.setItem('listtype', 'data');">
        <svg class="svglight" id="dataview" viewBox="0 0 0020 0020">
          <path d="M2.71429 10.21429V11.5q0 .0871-.0636.15067-.0636.0636-.15067.0636H1.214306q-.08705 0-.15067-.0636Q1
          11.58706 1 11.5v-1.28571q0-.0871.06362-.15067.06362-.0636.15067-.0636H2.5q.0871 0
          .15067.0636.0636.0636.0636.15067zm0-2.57143v1.28572q0 .087-.0636.15067-.0636.0636-.15067.0636H1.214306q-.08705
          0-.15067-.0636Q1 9.01563 1 8.92858V7.64286q0-.087.06362-.15067.06362-.0636.15067-.0636H2.5q.0871
          0 .15067.0636.0636.0636.0636.15067zm0-2.57143v1.28572q0 .087-.0636.15067-.0636.0636-.15067.0636H1.214306q-.08705
          0-.15067-.0636Q1 6.4442 1 6.35715V5.07143q0-.087.06362-.15067.06362-.0636.15067-.0636H2.5q.0871
          0 .15067.0636.0636.0636.0636.15067zm0-2.57143v1.28572q0 .0871-.0636.15067-.0636.0636-.15067.0636H1.214306q-.08705
          0-.15067-.0636Q1 3.87277 1 3.78572V2.5q0-.0871.06362-.15067.06362-.0636.15067-.0636H2.5q.0871
          0 .15067.0636.0636.0636.0636.15067z"/>
          <path d="M13 10.21429V11.5q0 .0871-.0636.15067-.0636.0636-.15067.0636h-9q-.087 0-.15067-.0636-.0636-.0636-.0636-.15067v-1.28571q0-.0871.0636-.15067.0636-.0636.15067-.0636h9q.0871
          0 .15067.0636.0636.0636.0636.15067zm0-2.57143v1.28572q0 .087-.0636.15067-.0636.0636-.15067.0636h-9q-.087
          0-.15067-.0636-.0636-.0636-.0636-.15067V7.64286q0-.087.0636-.15067.0636-.0636.15067-.0636h9q.0871
          0 .15067.0636.0636.0636.0636.15067zm0-2.57143v1.28572q0 .087-.0636.15067-.0636.0636-.15067.0636h-9q-.087
          0-.15067-.0636-.0636-.0636-.0636-.15067V5.07143q0-.087.0636-.15067.0636-.0636.15067-.0636h9q.0871
          0 .15067.0636.0636.0636.0636.15067zM13 2.5v1.28572q0 .0871-.0636.15067-.0636.0636-.15067.0636h-9q-.087
          0-.15067-.0636-.0636-.0636-.0636-.15067V2.5q0-.0871.0636-.15067.0636-.0636.15067-.0636h9q.0871
          0 .15067.0636Q13 2.41293 13 2.5z"/>
        </svg>
        </a><div class="dropdown-content"><p>data view</p></div></div>
     </div>
     <div class="row">

<!-- generated table !-->
<p id="reponame"></p>
</div></div>

<!--tag indicator -->
<div id="trletter">
     <p id="trletterplace" class="trlettertext"></p>
</div>

<!-- optional audio player -->
<footer class="footer">
      <div class="container-audio">
          <audio id="audio" crossOrigin="anonymous" title="" controls>
            Your browser dose not Support the audio Tag
          </audio>
      </div>
</footer>
<!-- overlay for image navigation -->
<div id="myModal" class="modal" tabindex="-1">
     <div id="imageoverlay"></div>
     <span class="close">&times;</span>
</div>
`

const scriptPaths = [
    'js/lib.js',
    'js/imageviewer.js',
    'js/indexcode.js',
    'js/d3.v6.min.js',
    'js/jspdfv251.js',
    'js/mdpdf.js'
];

function loadScripts(scripts) {
    return scripts.reduce((promise, scriptPath) => {
        return promise.then(() => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = scriptPath;
                // preserve defer-like behavior
                script.async = false;
                script.onload = () => {
                    //console.log(`Loaded: ${scriptPath}`);
                    resolve();
                };
                script.onerror = () => {
                    //console.error(`Failed to load: ${scriptPath}`);
                    reject(new Error(`Script load error: ${scriptPath}`));
                };
                document.head.appendChild(script);
            });
        });
    }, Promise.resolve());
}

// sequential loading preserves order
loadScripts(scriptPaths)
    .then(() => {
        //console.log('All scripts loaded sequentially');
        // Initialize your application or run post-load logic
    })
    .catch(error => {
        console.error('Script loading failed', error);
    });

window.localStorage.setItem('tdsortelement', 1);
document.getElementById("wah").innerHTML = wah;
let totop = document.getElementById("backtotop");

// svg icons
function svgcamera() {
    return '<path d="M21,4c-1.402,0-2.867,0-2.867,0L17.2,2c-0.215-0.498-1.075-1-1.826-1H8.759' +
    'C8.008,1,7.148,1.502,6.933,2L6,4c0,0-1.517,0-3,0C0.611,4,0,6,0,6v14c0,0,1.5,2,3,2s16.406,0,18,0s3-2,3-2V6C24,6,23.496,4,21,4z' +
    'M12,19.001c-3.313,0-6-2.687-6-6.001c0-3.313,2.687-6,6-6c3.314,0,6,2.687,6,6C18,16.314,15.314,19.001,12,19.001z M12,9' +
    'c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,9,12,9z"/>';
}

function svgwindowslogo() {
    return '<path d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302' +
    '104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z"/>';
}

function svginfobox() {
    return '<path d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 ' +
           '2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"></path>' +
           '<path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C">' +
           '</path> <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#1C274C"></path>';
}

function svgnoinfo() {
    return `<path d="M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,
           2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z"/></path>
           <path d="M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z"/>`;
}

function svgplay() {
    return `<path d="M1,14c0,0.547,0.461,1,1,1c0.336,0,0.672-0.227,1-0.375L14.258,9C14.531,8.867,15,8.594,15,8s-0.469-0.867-0.742-1L3,
            1.375  C2.672,1.227,2.336,1,2,1C1.461,1,1,1.453,1,2V14z"/>`;
}

function svgmd() {
    return `<rect
        width="32"
        height="38"
        rx="10"
    />
    <path
        d="M10 0 H80 L100 20 V140 H10 V0 Z"
        fill="#90392B"
    />
    <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="36"
        text-anchor="middle"
        alignment-baseline="middle"
    >
        MD
    </text>`;
}

function svgpdf() {
    return `<rect
        width="32"
        height="38"
        rx="10"
    />
    <path
        d="M10 0 H80 L100 20 V140 H10 V0 Z"
        fill="#90392B"
    />
    <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="36"
        text-anchor="middle"
        alignment-baseline="middle"
    >
        PDF
    </text>`;
}
function svgdownload() {
    // courtesy Solar Icons  https://www.svgrepo.com/svg/524035/download-minimalistic
    return `<path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21
    20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    </path> <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    </path>`;
}
