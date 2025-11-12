function tmdbgenreid(val) {
    switch(val) {
       case 1:
          dummy = '';
          break;
    }
    return dummy;
}

// globals todo check and move
let orgtext     = ""

function cleanuptext(text) {
    text = text.replaceAll('"', '');
    text = text.replaceAll('\'', '');
    text = text.replaceAll('\n', '');
    text = text.replaceAll(';', '<br>');
    return text;
}

// init wordcount
let words        = "";
let wordsPerPage = 300;
let currentPage  = 0;
let totalPages   = 0;
let start        = 0;
let end          = 0

// render book page
function renderpage(text) {
  // resize window size dependent
  document.getElementById("bookpage").style.columnCount = "2";
  document.getElementById("ovpage").style.top         = "-40px";
  switch (true) {
    case (window.innerWidth < 600):
      wordsPerPage = 70;
      document.getElementById("bookpage").style.columnCount = "1";
      document.getElementById("ovpage").style.top         = "10px";
      break;
    case (window.innerWidth < 900):
      wordsPerPage = 100;
      break;
    default:
      wordsPerPage = 300;
  }

  totalPages = Math.ceil(words.length / wordsPerPage);
  start = currentPage * wordsPerPage;
  end   = start + wordsPerPage;

  document.getElementById("bookpage").innerHTML = createparagraph(words.slice(start, end).join(' ')) + '<br><br><p style="text-align:right">' + (currentPage + 1) + ' / ' + totalPages + '</p>';
}

// generate image overlay data
function imageoverlay(section, overlay, locale) {
    let text           = "";
    let textb          = "";
    let image          = "";
    let cnt            = 0;
    let dummy          = "";
    let extdummy       = "";
    let extimage       = "";
    let refducky       = "";
    let url            = "";
    let vrl            = "";
    let wikifilter     = "";
    orgtext            = "";

    var sourcename      = [];
    var sourcehref      = [];

    text += '  <span class="playslide">';
    text += '        <a href="slide.html?section=' + section + '" style="text-decoration: none;" target="_blank">';
    text += '            <svg class="svglight" viewBox="0 0 32 3" height="16px" width="16px">';
    text += svgplay();
    text += '            </svg>';
    text += '         </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '  </span>';
    //text += '   <p id="time"></p>';
    //text += '   <p id="date"></p>';
    text += '<div class="lightbox" id="lightbox-1">';

    // generate paper overlay data
    if (overlay === 'paper'){
        // if needed get misc info
        if (section !== 'all'){
            text += '<br><a class="" href="text2md.html" target="_blank";>';
            text += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<svg class="svglight" viewBox="-4 0 102 102">';
            text += svgpdf();
            text += '</svg></a>';
            text += '<a class="" href="text2md.html" target="_blank";>';
            text += '&nbsp;&nbsp;<svg class="svglight" viewBox="-4 0 102 102">' + svgmd() + '</svg></a>';

            text += '<br><br><a class="w3-left" style="cursor:pointer" onclick="document.getElementById(\'bookpage\').innerHTML = createparagraph(orgtext) ";>';
            text += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<svg class="svglight" viewBox="-4 0 32 32">';
            text += svginfobox();
            text += '</svg></a>';

            // parse atlas get external data sources
            getjsonf('json/atlas.json', function(data){
              if (data) {
                  Object.entries(data).forEach((entry) => {
                      const [key, value] = entry;
                      if (window.localStorage.getItem('menuitem') === value.name) {
                         sourcename = value.sourcename.slice();
                         sourcehref = value.sourcehref.slice();
                      }
                  });
              }
            });
            data = [];
            entry = [];

// todo abstract various sources extdummy
//let ref = {};
//for (let i = 0; i < sourcename.length; i += 1) {
//    console.log(sourcename[i])
//    ref[sourcename[i]] = "test" + i;
//    console.log(ref[sourcename[i]]);
//}

            // get sources
            for (i = 0; i < sourcename.length; i += 1) {
                if (sourcename[i] === "ducky") {
                  extdummy = "";
                  url =  'https://corsproxy.io/?' +
                         'http://api.duckduckgo.com/?q=' + window.localStorage.getItem('name').replaceAll(" ", "%20") + '&format=json&pretty=1';
                  getjsonf(url, function(data){
                      if (data) {
                      // get related info if present
                      if (typeof data.RelatedTopics === 'object' && data.RelatedTopics != null) {
                          data.RelatedTopics.forEach((entry) => {
                            for (const key in entry) {
                              if (entry.hasOwnProperty(key)) {
                                if (key === 'FirstURL') {
                                  refducky += '<i><a href="' + entry[key] + '" target="blank"></i> ';
                                } else if (key === 'Text') {
                                  if (Array.isArray(entry[key])) {
                                    refducky += entry[key].join(', ') + '<br>';
                                  } else if (typeof entry[key] === 'object') {
                                    refducky += Object.values(entry[key]).join(', ') + '<br>';
                                  } else {
                                    if (cnt < 7) {
                                       refducky += entry[key] + '<br>';
                                       cnt ++;
                                    }
                                  }
                                }
                              }
                            }
                          });
                      }
                      if (typeof data.Infobox.content === 'object' && data.Infobox.content != null) {
                          data.Infobox.content.forEach((entry) => {
                            for (const key in entry) {
                              if (entry.hasOwnProperty(key)) {
                                if (key === 'label') {
                                  extdummy += '<i>' + entry[key] + ':</i> ';
                                } else if (key === 'value') {
                                  if (Array.isArray(entry[key])) {
                                    extdummy += entry[key].join(', ') + '<br>';
                                  } else if (typeof entry[key] === 'object') {
                                    extdummy += Object.values(entry[key]).join(', ') + '<br>';
                                  } else {
                                    extdummy += entry[key] + '<br>';
                                  }
                                }
                                extummy = cleanuptext(extdummy);
                              }
                            }
                          });
                        } else {
                          extdummy = 'No info at duck duck';
                          //console.log('data.Infobox.content is not an object');
                        }
                      } // data
                  });
                  data  = [];
                  entry = [];
                  cnt   = 0;
                } // end if
                if (sourcename[i] === "musicbrainz") {
                  extdummy = "";
                  url = 'https://musicbrainz.org/ws/2/release-group/?fmt=json&query=artist:' + window.localStorage.getItem('name').replaceAll(' ', '%20') + '%20AND%20primarytype:album';
                  getjsonf(url, function(data){
                      if (data) {
                          Object.entries(data["release-groups"]).forEach((entry) => {
                              const [key, value] = entry;
                              extdummy += value.title + '<br>';
                              extdummy += '<i>' + value["primary-type"] + ' ';
                              extdummy += value["first-release-date"] + '</i><br><br>';
                              extdummy = cleanuptext(extdummy);
                          });
                      }
                  });
                  data  = [];
                  entry = [];
                  cnt   = 0;
                } // end if
                if (sourcename[i] === "reference") {
                  // todo refducky needs to be abstracted and number of br's is a bit funky
                  let br = '<br>';
                  switch (window.localStorage.getItem('menuitem')){
                         case 'paper':
                         case 'docu':
                              wikifilter = '';
                              extdummy = window.localStorage.getItem('name') + '<br><br><br><br><br><br>' + br.repeat(refducky.split('<br>').length + 5);
                              extdummy += '<a href=https://www.youtube.com/results?search_query=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+') +
                                          '+music+hq target="_blank">' + 'youtube video list<br>';
                              extdummy += '<a href=https://music.youtube.com/search?q=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+').toLowerCase() +
                                          ' target="_blank">' + 'youtube music list<br>';
                              break;
                         case 'film':
                              extdummy = window.localStorage.getItem('name') + '<br><br><br><br><br><br>' + br.repeat(refducky.split('<br>').length + 5);
                              extdummy += '<a href=https://www.youtube.com/results?search_query=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+') +
                                          '+' + window.localStorage.getItem('year') +
                                          '+music+hq target="_blank">' + 'youtube video list<br>';
                              extdummy += '<a href=https://music.youtube.com/search?q=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+').toLowerCase() +
                                          '+' + window.localStorage.getItem('year') +
                                          ' target="_blank">' + 'youtube music list<br>';
                              break;
                         case 'game':
                              wikifilter = 'game';
                              break;
                         case 'playlist':
                         case 'music':
                              extdummy = window.localStorage.getItem('name') + '<br><br><br><br><br><br>' + br.repeat(refducky.split('<br>').length + 5);
                              extdummy += '<a href=https://www.youtube.com/results?search_query=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+') +
                                          '+music+hq target="_blank">' + 'youtube video list<br>';
                              extdummy += '<a href=https://music.youtube.com/search?q=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '+').toLowerCase() +
                                          ' target="_blank">' + 'youtube music list<br>';
                              extdummy += '<a href=https://genius.com/search?q=' +
                                          window.localStorage.getItem('name').replaceAll(' ', '%20') +
                                          ' target="_blank">' + 'genius lyrics list<br>';
                              // todo need song title see passmusicalbum
                              //extdummy += '<a href=https:///genius.com/' + window.localStorage.getItem('name').replaceAll(' ', '-') +
                              //            '-' + window.localStorage.getItem('title').replaceAll(' ', '%20') + 'target="_blank">' + 'genius lyrics list<br>';
                              //https://genius.com/search?q=diana%20ross
                              break;
                  }
                  // generic
                  switch (window.localStorage.getItem('menuitem')){
                         case 'docu':
                         case 'film':
                         case 'paper':
                         case 'playlist':
                         case 'music':
                              extdummy += '<a href=https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&namespace=0&format=json&search=' +
                                           window.localStorage.getItem('year') +
                                          ' target="_blank">' + 'historic events year ' + window.localStorage.getItem('year') + '<br>';
                              extdummy += '<a href=https://en.wikipedia.org/wiki/' + window.localStorage.getItem('year') + '_in_film' +
                                          ' target="_blank">' + 'movies year ' + window.localStorage.getItem('year') + '<br>';
                              extdummy += '<a href=https://en.wikipedia.org/wiki/' + window.localStorage.getItem('year') + '_in_music' +
                                          ' target="_blank">' + 'music year ' + window.localStorage.getItem('year') + '<br>';
                              extdummy += '<a href=https://en.wikipedia.org/wiki/' + window.localStorage.getItem('year') + '_in_video_games' +
                                          ' target="_blank">' + 'video games year ' + window.localStorage.getItem('year') + '<br>';
                              extdummy += '<br>' + refducky;
                              break;
                  }
                  extdummy = cleanuptext(extdummy);
                  data  = [];
                  entry = [];
                  cnt   = 0;
                } // end if
                if (sourcename[i] === "tmdb") {
                  extdummy = "";
                  const iu = "https://image.tmdb.org/t/p/w500/";
                  let query = window.localStorage.getItem('name');
                  query = query.replaceAll(' ', '%20');
                  url = atob('aHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvdHY/YXBpX2tleT1hOTE0NWNlNGQ5ZTgwYmI4OTk3YWQ4NjA3MDI2Mzc1YSZxdWVyeT0=') + query;
                  // parse atlas get external data sources
                  getjsonf(url, function(data){
                    if (data) {
                        Object.entries(data).forEach((entry) => {
                            const [key, value] = entry;
                            if (data.results[0] == null) {
                               extdummy = 'No info found at tmdb';
                            } else {
                                extdummy =  data.results[0].name + '<br>';
                                //extdummy += '<i>genre&nbsp;</i>'      + data.results[0].id + '<br>';
                                extdummy += '<i>aired on: </i>'      + data.results[0].first_air_date + '<br>';
                                extdummy += '<i>original name: </i>' + data.results[0].original_name + '<br><br>';
                                extdummy += data.results[0].overview;
                                extimage =  iu + data.results[0].poster_path;
                                extdummy = cleanuptext(extdummy);
                            }
                        });
                    }
                  });
                  data  = [];
                  entry = [];
                  cnt   = 0;
                } // end if
                extdummy = cleanuptext(extdummy);
                text += '<a style="cursor:pointer; color:white" onclick="document.getElementById(\'bookpage\').innerHTML = \'' + extdummy + '\'";>' + sourcename[i] + '</a><br>';
            } // end for get sources
            data  = [];
            entry = [];
            dummy = '';
        } // not all
        if (locale === 'local'){ url = 'json/paper.json';}
        if (locale === 'remote'){
            //todo deal with & etc .replaceAll('&', ' and ') also check tears for fears
            //url = 'https://corsproxy.io/?https%3A%2F%2Fen.wikipedia.org%2Fw%2Fapi.php%3Fformat%3Djson%26action%3Dquery%26prop%3Dextracts%26exintro%26explaintext%26redirects%3D1%26titles%3D' + encodeURIComponent(section);
            // filter out year
            dummy = section.replace(/[0-9]{4}/g, '');
            vrl = 'https://corsproxy.io/?' +
                  'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&namespace=0&format=json&search=' +
                  encodeURIComponent(dummy.replaceAll(' ', '_'));
            // todo still funky can result in false postives or no results when actually present at sources
            getjsonf(vrl, function(data){
                if (data) {
                    switch (window.localStorage.getItem('menuitem')){
                           case 'docu':
                                wikifilter = 'docu';
                                break;
                           case 'film':
                                wikifilter = 'film';
                                break;
                           case 'game':
                                wikifilter = 'game';
                                break;
                           case 'music':
                                wikifilter = 'band';
                                //musician
                                break;
                    }
                    Object.entries(data).forEach((entry) => {
                        const [key, value] = entry;
                        if (data[0][0] !== undefined){
                           section = data[0].replaceAll(' ', '_');
                        }
                        if (data[3][1] !== undefined && data[3][key] !== undefined){
                          if (data[3][1].indexOf(wikifilter) > 0) {
                             section = data[3][1].substr(data[3][1].lastIndexOf('/') + 1);
                          } else {
                              if (data[3][key].indexOf(wikifilter) > 0) {
                                 section = data[3][key].substr(data[3][key].lastIndexOf('/') + 1);
                              } else {
                                 section = data[1][0];
                              }
                          }
                       } else {
                           if (data[1][0] !== undefined){
                              section = data[1][0];
                           }
                           if (data[3][0] !== undefined){
                              section = data[3][0].substr(data[3][0].lastIndexOf('/') + 1);
                           }
                       }
                    });
                }
            });
            url = 'https://corsproxy.io/?' +
                  'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' +
                  encodeURIComponent(section);
        } // end remote

        text += '              <div class="canvascenter click-zoom">';
        text += '                   <label>';
        text += '                      <input type="checkbox" id="zoomcanvas">';
        text += '                      <img src="" alt="" id="canvas">';
        text += '                   </label>';
        text += '              </div>';
        text += '              <div class="w3-text-white w3-display-top"><p id="title"></p></div>';

 // todo fix clunky method of passing text to pdf and md conversion
 let pagedatatemp = "";
        getjsonf(url, function(data){
            if (data) {
                textb += '         <div class="mySlides" id="paper">';
                textb += '              <div class="centerpaper w3-animate-left ovpage" id="ovpage">';
                textb += '                   <div id="bookpage">';
                if (locale === 'remote'){
                    Object.entries(data.query.pages).forEach((entry) => {
                        const [key, value] = entry;
                        text += textb;
                        text += value.title + '<br><br>';
                        if (value.extract === undefined) { value.extract = "no info"; }
                        orgtext += wordcount(value.extract)  + '<br><br><p style="text-align:right">' + (currentPage + 1) + ' / ' + totalPages + '</p>';
                        pagedatatemp = value.extract;
                    });
                };
                if (locale === 'local'){
                    Object.entries(data).forEach((entry) => {
                        const [key, value] = entry;
                        if (value.private === false && value.name === section || section === 'all') {
                            text += textb;
                            text += value.name + '<br><br>';
                            orgtext += wordcount(value.extract)  + '<br><br><p style="text-align:right">' + (currentPage + 1) + ' / ' + totalPages + '</p>';
                        pagedatatemp = value.extract;
                        };
                    });
                };
                text += '                   </div>';
                text += '              </div>';
                text += '        </div>';
                //cnt += 1;
            };
        }); // getjson
 window.localStorage.setItem('pagedata', pagedatatemp);
   }; // paper

    // generate image overlay data
    if (overlay === 'image'){
     // todo fix tricky hack to pass json list via section
      if (section.indexOf(".json") > 0) {
          // clear the imageurl
          Object.keys(imageurl).forEach(key => delete imageurl[key]);

          getjsonf(section, function(data2){
          if (data2)
             Object.entries(data2).forEach((entry) => {
                 const [key2, value2] = entry;
                 imageurl[key2] = value2;
             });
          });
      };

      Object.entries(imageurl).forEach((entry) => {
          const [key, value] = entry;
          // crucial condition can really screw up flow
          if (value.private === false && ((value.name === section || section === 'all') || section.indexOf(".json") > 0) && cnt === 0 ) {
              text += '              <div class="canvascenter click-zoom">';
              text += '                   <label>';
              text += '                      <input type="checkbox"  id="zoomcanvas">';
              text += '                      <img src="' + value.href + '" alt="' + value.description + '" id="canvas">';
              text += '                   </label>';
              text += '              </div>';
              text += '              <div class="w3-text-white w3-display-top"><p id="title">' + value.description + '</p></div>';
              cnt += 1;
          };
      });
    }; // image
    cnt = 0;

    text += '  <!-- image navigation left and right -->';
    text += '  <div class="w3-text-white w3-display-middle" style="width:90%;">';
    text += '       <div class="w3-left w3-hover-text-khaki"  onclick="navimage.direction(\'ArrowLeft\')"  id = "prev">&#10094;</div>';
    text += '       <div class="w3-right w3-hover-text-khaki" onclick="navimage.direction(\'ArrowRight\')" id = "next">&#10095;</div>';
    text += '  </div>';

    text += '  <div class="carousel" id="carousel">';
    text += '     <div class="carousel--wrap">';
    if (window.localStorage.getItem('menuitem') !== 'paper'){
        Object.entries(imageurl).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false && (value.name === section || section === 'all') || section.indexOf(".json") > 0) {
              text += '          <div class="carousel--item" id="caritem">';
              text += '               <figure><img src="' + value.href + '" alt="' + value.description + '" id="' + cnt + '"/></figure>';
              text += '          </div>';
              cnt += 1;
            };
        });
    }
    // get media external
    url = 'https://corsproxy.io/?' + 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=600&pilicense=any&titles=' +
          encodeURIComponent(dummy);
    // default no image
    if (extimage !== "") {
        image = extimage;
    } else {
        //image = 'images/noimage.jpg';
    }
    cnt = 0;
    getjsonf(url, function(data){
        if (data) {
           if (data.query == null) {
              // nop
           } else {
              Object.entries(data.query.pages).forEach((entry) => {
                const [key3, value3] = entry;
                if (value3.thumbnail != null) {
                   image = value3.thumbnail.source;
                }
              });
            }
        }
        if (image !== "") {
            text += '          <div class="carousel--item" id="caritem">';
            text += '               <figure><img src="' + image + '" alt="' + section + '" id="' + cnt + '"/></figure>';
            text += '          </div>';
            cnt += 1;
        }
    }); // get json

    text += '     </div>';
    text += '     <div class="carousel--progress">';
    text += '          <div class="carousel--progress-bar"></div>';
    text += '     </div>';
    text += '</div>';
    document.getElementById("imageoverlay").innerHTML = text;
    // force focus on first image when loading page
    document.getElementById('myModal').focus();
    // clean up
    text = "";
    // reset toggle image and paper important affects zoom
    if (overlay === 'paper'){
       document.getElementById("paper").style.display     = 'block';
       document.getElementById("paper").style.visibility  = 'visible';
       document.getElementById("canvas").style.display    = "none";
       document.getElementById("canvas").style.visibility = "hidden";
       renderpage();
    }  else {
       document.getElementById("canvas").style.display    = "block";
       document.getElementById("canvas").style.visibility = "visible";
    }

    // image carousel logic
    // courtesy https://codepen.io/supah/pen/VweRLrQ
    const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

    class dragscroll {
      constructor(obj) {
        this.$el    = modal.querySelector(obj.el);
        this.$wrap  = this.$el.querySelector(obj.wrap);
        this.$items = this.$el.querySelectorAll(obj.item);
        this.$bar   = this.$el.querySelector(obj.bar);
        this.modal  = document.getElementById("myModal");
        this.init();
      }

      init() {
        this.progress  = 0;
        this.speed     = 0;
        this.oldX      = 0;
        this.x         = 0;
        this.playrate  = 0;
        this.currentid = 0;
        //
        this.bindings();
        this.events();
        this.calculate();
        this.raf();
      }

      bindings() {
        [
        'events',
        'calculate',
        'raf',
        'handleWheel',
        'handlekey',
        'handleclick',
        'thumbactive',
        'move',
        'raf',
        'handleTouchStart',
        'handleTouchMove',
        'handleTouchEnd'].
        forEach(i => {this[i] = this[i].bind(this);});
      }

      calculate() {
        if (this.$items[0] != null) {
          this.wrapWidth = this.$items[0].clientWidth * this.$items.length;
          this.$wrap.style.width = `${this.wrapWidth}px`;
          //this.maxScroll = this.wrapWidth - this.$el.clientWidth;
          this.maxScroll = this.wrapWidth * 1.035 - this.$el.clientWidth;
        }
      }

     handleWheel(e) {
        // work around for small scroll delta seamonkey and possibly other browsers
        var dummy = e.deltaY;
        var normalized;
        if (e.wheelDelta) {
            normalized = (e.wheelDelta % 120 - 0) === -0 ? e.wheelDelta / 120 : e.wheelDelta / 12;
        } else {
            var rawAmmount = e.deltaY ? e.deltaY : e.detail;
            normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
        }
        if (normalized === 1 ){
            if (this.currentid < this.$items.length - 1) {
               this.currentid = this.currentid + 1;
            } else {
               this.currentid = this.$items.length - 1;
            }
            dummy = 100;
        }
        if (normalized === -1 ){
            if (this.currentid > 0) {
               this.currentid = this.currentid - 1;
            } else {
               this.currentid = 0;
            }
            dummy = -100;
        }
        document.getElementById('canvas').setAttribute('src', this.$items[this.currentid].querySelector('img').src);
        document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
        this.progress += dummy;
        this.thumbactive(this.currentid);
        this.move();
      }

      handleclick(e) {
        if (e.target instanceof HTMLImageElement) {
            this.thumbactive(e.target.id);
        } else {
            //console.log('e.target is not an image element, it is:', e.target.tagName);
            return;
        }
        if (overlay === 'paper'){
            if (document.getElementById("paper").style.display === 'block'){
               document.getElementById("paper").style.display     = "none";
               document.getElementById("paper").style.visibility  = "hidden";
               document.getElementById("canvas").style.display    = "block";
               document.getElementById("canvas").style.visibility = "visible";
            } else {
               document.getElementById("paper").style.display     = "block";
               document.getElementById("paper").style.visibility  = "visible";
               document.getElementById("canvas").style.display    = "none";
               document.getElementById("canvas").style.visibility = "hidden";
           }
        }
        document.getElementById('canvas').setAttribute('src', e.target.src);
        document.getElementById("title").innerHTML = e.target.alt.split('_').join(' ');
        document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
        this.currentid = e.target.id;
        this.events();
      }

      // arrows beside image
      handletest(e) {
          if (e === 'ArrowRight') {
             this.navright();
           }
          if (e === 'ArrowLeft') {
             this.navleft();
          }
      }

      handlekey(e) {
        e.preventDefault();
        if (e.key === 'ArrowRight') {
           this.navright();
        }
        if (e.key === 'ArrowLeft') {
           this.navleft();
        }
        if(e.key === "ArrowUp") {
            if (document.getElementById("zoomcanvas").checked) {
              document.getElementById("zoomcanvas").checked = false;
              document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
            } else {
              document.getElementById("zoomcanvas").checked = true;
              document.getElementById('canvas').style.transform = 'translate(0, 0) scale(2)';
            }
        }
        if(e.key === "Escape" || e.key === "Backspace") {
            if (modal.style === undefined) {
               modal.style = "";
            }
            modal.style.display = "";
            this.removeevents();
        }
      }

      navright() {
        if (document.getElementById("canvas").style.visibility !== "visible") {
            // page text
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderpage();
            }
        }
        if (Number(this.currentid) < Number(this.$items.length) - 1) {
          this.currentid = Number(this.currentid) + 1;
        } else {
          this.currentid = Number(this.$items.length) - 1;
        }
        this.progress += this.$el.clientWidth * 0.05;
        this.navchange();
      }

      navleft() {
        if (document.getElementById("canvas").style.visibility !== "visible") {
            // page text
            if (currentPage > 0) {
                currentPage--;
                renderpage();
            }
        }
        if (Number(this.currentid) > 0) {
          this.currentid = Number(this.currentid) - 1;
        } else {
          this.currentid = 0;
        }
        this.progress -= this.$el.clientWidth * 0.05;
        this.navchange();
      }

      navchange() {
        if (this.$items[this.currentid] == null) return;
        document.getElementById('canvas').setAttribute('src', this.$items[this.currentid].querySelector('img').src);
        // todo needs better method
        document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt.replaceAll('_', ' ');
        document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
        this.thumbactive(this.currentid);
        this.move();
      }

      handleTouchStart(e) {
        e.preventDefault();
        this.dragging = true;
        this.startX = e.clientX || e.touches[0].clientX;
        this.$el.classList.add('dragging');
      }

      handleTouchMove(e) {
        // zoom main image and move if needed
        const image = document.querySelector('#canvas');
        const rect = image.getBoundingClientRect();
        // multiplier shrinks active zone where magnification starts
        if (e.clientX >= rect.left * 1.25 && e.clientX <= rect.right * 0.95 && e.clientY >= rect.top * 1.25 && e.clientY <= rect.bottom * 0.95) {
            const imageCenterX = rect.left + rect.width / 2;
            const imageCenterY = rect.top + rect.height / 2;
            const deltaX = e.clientX - imageCenterX;
            const deltaY = e.clientY - imageCenterY;
            const moveX = -deltaX * 0.1;   // adjust the multiplier for sensitivity
            const moveY = -deltaY * 0.333; // ditto
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const scaleFactor = 2 + Math.min(distance / 10, 0.125); // scale up to 1.5x at a distance of 200px
            image.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;
            document.getElementById("carousel").style.bottom = '-10vh';
        } else {
            image.style.transform = 'translate(0, 0)';
            image.style.transform = 'translate(0, 0) scale(1)';
            document.getElementById("carousel").style.bottom = '10vh';
        }
        // move thumbnails
        if (!this.dragging) return false;
        const x = e.clientX || e.touches[0].clientX;
        this.progress += (this.startX - x) * 1.5;
        this.startX = x;
        this.move();
      }

      handleTouchEnd() {
        this.dragging = false;
        this.$el.classList.remove('dragging');
      }

      move() {
        this.progress = clamp(this.progress, 0, this.maxScroll);
      }

      thumbactive(e) {
          // highlight active thumb
          for (let i = 0; i < this.$items.length; i += 1) {
              if (i === e){
                 this.$items[e].querySelector('img').style.borderBottom = '5px solid #ff9800';
              } else {
                  this.$items[i].querySelector('img').style.borderBottom = '';
              }
          }
      }

      events() {
        if (this.$items.length === 0) return;
        this.modal.addEventListener('resize',  this.calculate);
        this.modal.addEventListener('wheel',   this.handleWheel);
        this.modal.addEventListener('keydown', this.handlekey);
        this.modal.addEventListener('click',   this.handleclick, {capture: true});
        // bypass to keep text selectable
        if (document.getElementById("canvas").style.visibility === 'visible') {
            this.modal.addEventListener('mousedown',         this.handleTouchStart);
            this.modal.addEventListener('mousemove',         this.handleTouchMove);
            this.modal.addEventListener('mouseup',           this.handleTouchEnd);
            this.modal.addEventListener('mouseleave',        this.handleTouchEnd);
        } else {
            this.modal.removeEventListener('mousedown',  this.handleTouchStart);
            this.modal.removeEventListener('mousemove',  this.handleTouchMove);
            this.modal.removeEventListener('mouseup',    this.handleTouchEnd);
            this.modal.removeEventListener('mouseleave', this.handleTouchEnd);
        }
      }

      removeevents() {
        this.modal.removeEventListener('resize',     this.calculate);
        this.modal.removeEventListener('wheel',      this.handleWheel);
        this.modal.removeEventListener('keydown',    this.handlekey);
        this.modal.removeEventListener('click',      this.handleclick, {capture: true});
        this.modal.removeEventListener('mousedown',  this.handleTouchStart);
        this.modal.removeEventListener('mousemove',  this.handleTouchMove);
        this.modal.removeEventListener('mouseup',    this.handleTouchEnd);
        this.modal.removeEventListener('mouseleave', this.handleTouchEnd);
        this.modal = null;
      }

      raf() {
        // requestAnimationFrame(this.raf)
        this.x = lerp(this.x, this.progress, 0.1);
        this.playrate = this.x / this.maxScroll;
        //
        this.$wrap.style.transform = `translateX(${-this.x}px)`;
        this.$bar.style.transform = `scaleX(${.18 + this.playrate * .82})`;
        //
        this.speed = Math.min(100, this.oldX - this.x);
        this.oldX = this.x;
        //
        this.scale = lerp(this.scale, this.speed, 0.1);
        this.$items.forEach(i => {
          i.style.transform = `scale(${1 - Math.abs(this.speed) * 0.002})`;
          i.querySelector('img').style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`;
        });
    }} // end class

    // Instances
    const scroll = new dragscroll({
      el: '.carousel',
      wrap: '.carousel--wrap',
      item: '.carousel--item',
      bar: '.carousel--progress-bar' });

    // One raf to rule em all
    const raf = () => {
      requestAnimationFrame(raf);
      scroll.raf();
    };

    raf();
    // call a class instance via a function
    navimage = new function(section) {
        this.direction = function(section) {
          scroll.handletest(section);
        };
    };
    eventhandle = new function() {
        this.remove = function(){
           scroll.removeevents();
        };
    };
} // end overlay
