
// hide mouse pointer with no activity
let mousetimer;
const mouseinactive = 5000; // 5 secs

function hidecursor() {
    document.body.style.cursor = 'none';
}

function showcursor() {
    document.body.style.cursor = 'default';
    clearTimeout(mousetimer);
    mousetimer = setTimeout(hidecursor, mouseinactive);
}
document.addEventListener('mousemove', showcursor);
document.addEventListener('mouseenter', showcursor);
// init
mousetimer = setTimeout(hidecursor, mouseinactive);

// courtesy https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//See: http://www.css-101.org/articles/ken-burns_effect/css-transition.php
function slide(section) {
    // todo fix tricky hack to pass json list via section
    if (section.indexOf(".json") > 0) {
        getjsonf(section, function(data2){
        if (data2)
           Object.entries(data2).forEach((entry) => {
               const [key2, value2] = entry;
               imageurl[key2] = value2;
           });
        });
     };

    // parse json image url
    Object.entries(imageurl).forEach((entry) => {
        const [key, value] = entry;
        if (value.private === false && (value.name === section || section === 'all') || section.indexOf(".json") > 0) {
            var image = new Image();
            image.src = value.href;
            image.alt = value.name;
            document.getElementById("slideshowcanvas").appendChild(image);
        };
     });

    document.getElementById('slideshow').getElementsByTagName('img')[0].className = "fx";
    // this calls the kenBurns function every 4 seconds
    // you can increase or decrease this value to get different effects
    window.setInterval(kenBurns, 6000);
    var images          = document.getElementById('slideshow').getElementsByTagName('img'),
        numberOfImages  = images.length,
        i               = 1;
    function kenBurns() {
        // hide spinner
        document.getElementsByClassName('spinner')[0].style.visibility = 'hidden';
        if(i==numberOfImages){ i = 0;}
        images[i].className = "fx";
        //document.getElementById("date").innerHTML = document.getElementById("date").innerHTML + " - " + images[i].alt;
        // we can't remove the class from the previous element or we'd get a bouncing effect so we clean up the one before last
        // (there must be a smarter way to do this though)
        if(i===0){ images[numberOfImages-2].className = "";}
        if(i===1){ images[numberOfImages-1].className = "";}
        if(i>1){ images[i-2].className = "";}
        i++;
    }
};

if (document.title === 'slide show') {
   slide(getUrlVars()["section"])
}

// shader webgl routines
let currentShaderIndex = 0;
let shaderdata         = [];
var svgplay            = false;
let animationtime      = 0;
let lastTimestamp      = performance.now();
let animationFrameId;
const shaderinterval   = 30; // screen saver interval in seconds
// svg pause
const circle           = document.getElementById('animatedCircle');

if (document.title === 'webgl') {
    function startAutoAdvance() {
      setInterval(() => {
        if (shaderdata.length === 0) return;
        // increment and wrap around
        currentShaderIndex++;
        if (currentShaderIndex >= shaderdata.length) {
          currentShaderIndex = 0;
        }
        loadShader(shaderdata[currentShaderIndex]);
      }, shaderinterval * 1000);
    }
    
    // SVG pulse animation synchronized with the animation loop
    function updateSVG(time) {
      const radius = 30 + 20 * Math.abs(Math.sin(time * 2));
      circle.setAttribute('r', radius);
    }
    
    // conrtol SVG animation
    function animate(time) {
      if (svgplay) {
        updateSVG(time / 1000);
        animationFrameId = requestAnimationFrame(animate);
      }
    }
    
    function getanimationtime() {
      const now = performance.now();
      if (!svgplay) {
        animationtime += (now - lastTimestamp) / 1000;
      }
      lastTimestamp = now;
      return animationtime;
    }

    // init circle on load
    circle.setAttribute('fill', 'rgba(255, 255, 255, 0.0)');
    // setup imouse xy
    let mousePressed         = false;
    let mousePressPosition   = { x: 0, y: 0 };
    let mouseCurrentPosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (event) => {
      mousePressed = true;
      mousePressPosition = { x: event.clientX, y: event.clientY };
    });

    document.addEventListener('mouseup', (event) => {
      mousePressed = false;
      mousePressPosition = { x: event.clientX, y: event.clientY };
    });

    document.addEventListener('mousemove', (event) => {
      mouseCurrentPosition = { x: event.clientX, y: event.clientY };
    });

    async function loadShaderData() {
      try {
        const response = await fetch('../json/shaders.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allData = await response.json();

        shaderdata = allData.filter(shader => !shader.private);

        if (shaderdata.length > 0) {
          loadShader(shaderdata[currentShaderIndex]);
          startAutoAdvance();
        } else {
          // handle if no public shaders are available
          console.warn('no public shaders available');
        }
      } catch (error) {
        console.error('failed loading shader data:', error);
      }
    }

    async function loadShader(shaderData) {
      if (!shaderData) {
        //console.error('No shaderData provided to loadShader');
        return;
      }

      const response = await fetch(shaderData.href);
      const shadercode = await response.text();

      document.getElementById('shadername').textContent = shaderData.name;
      document.getElementById('shaderid').textContent   = shaderData.extract;
      const shader = document.getElementById('Image');

      // remove old canvas should be in library
      // check with: document.querySelectorAll('canvas')
      // in console should only be one node list
      const oldCanvas = document.getElementById('shader-web-background');
      if (oldCanvas) {
        const gl = oldCanvas.getContext('webgl2') || oldCanvas.getContext('webgl');
        if (gl) {
          //console.log('WebGL Version:', gl.getParameter(gl.VERSION));
          const loseContextExt = gl.getExtension('WEBGL_lose_context');
          if (loseContextExt) {
            loseContextExt.loseContext();
          }
        }
        oldCanvas.parentNode.removeChild(oldCanvas);
      }

      shader.textContent = `
        precision highp float;

        uniform vec2  iResolution;
        uniform float iTime;
        uniform vec4  iDate;
        uniform vec4  iMouse;

        // -- paste your Shadertoy code here:
        ${shadercode}
        // -- End of Shadertoy code

        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `;

      // Use shaderWebBackground.shade() to set uniforms:
      shaderWebBackground.shade({
        shaders: {
          Image: {
            uniforms: {
              iResolution: (gl, loc, ctx) => {
                gl.uniform2f(loc, ctx.width, ctx.height);
              },
              iTime: (gl, loc) => {
                gl.uniform1f(loc, getanimationtime());
              },
              iDate: (gl, loc) => {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const day = now.getDate();
                const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
                gl.uniform4f(loc, year, month, day, secondsSinceMidnight);
              },
              iMouse: (gl, loc) => {
                gl.uniform4f(loc, mouseCurrentPosition.x, mouseCurrentPosition.y, mousePressPosition.x, mousePressPosition.y);
              }
            }
          }
        }
      });
    }

    loadShaderData();

    document.addEventListener('keydown', (event) => {
      if (shaderdata.length === 0) {
        // data not loaded yet, ignore input or show a message
        return;
      }

      if (event.key === 'ArrowLeft') {
        currentShaderIndex--;
        if (currentShaderIndex < 0) {
          currentShaderIndex = shaderdata.length - 1;  // wrap to last
        }
        loadShader(shaderdata[currentShaderIndex]);
      } else if (event.key === 'ArrowRight') {
        currentShaderIndex++;
        if (currentShaderIndex >= shaderdata.length) {
          currentShaderIndex = 0;  // wrap to first
        }
        loadShader(shaderdata[currentShaderIndex]);
      }
    });

    // start animation loop
    animationFrameId = requestAnimationFrame(animate);

    // play pause button svg
    circle.addEventListener('click', () => {
      if (svgplay) {
        // pause
        svgplay = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId == null;
        }
        circle.setAttribute('fill', 'rgba(255, 255, 255, 0.0)');
      } else {
        // resume
        svgplay = true;
        circle.setAttribute('fill', 'rgba(255, 255, 255, 0.5)');
        animationFrameId = requestAnimationFrame(animate);
      }
    });

} //end webgl
