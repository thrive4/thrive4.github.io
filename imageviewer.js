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
let windowwidth = window.outerWidth;

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
    text += '            <svg class="svglight" viewBox="0 0 32 3" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    text += '            <path d="M1,14c0,0.547,0.461,1,1,1c0.336,0,0.672-0.227,1-0.375L14.258,9C14.531,8.867,15,8.594,15,8s-0.469-0.867-0.742-1L3,1.375  C2.672,1.227,2.336,1,2,1C1.461,1,1,1.453,1,2V14z"/>';
    text += '            </svg>';
    text += '         </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '  </span>';
    //text += '   <p id="time"></p>';
    //text += '   <p id="date"></p>';
    text += '<div class="lightbox" id="lightbox-1">';

    // generate paper overlay data
    if (overlay == 'paper'){
        // if needed get misc info
        if (section != 'all'){
            text += '<br><br><br><a class="w3-left" style="cursor:pointer" onclick="document.getElementById(\'bookpage\').innerHTML = createparagraph(orgtext) ";>';
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
//for (i = 0; i < sourcename.length; i += 1) {
//    console.log(sourcename[i])
//    ref[sourcename[i]] = "test" + i;
//    console.log(ref[sourcename[i]]);
//}

            // get sources
            for (i = 0; i < sourcename.length; i += 1) {
                if (sourcename[i] === "ducky") {
                  extdummy = "";
                  url =  'https://corsproxy.io/?' +
                         'http://api.duckduckgo.com/?q=' + window.localStorage.getItem('name') + '&format=json&pretty=1';
                  getjsonf(url, function(data){
                      if (data) {
                      // get related info if present
                      if (typeof data.RelatedTopics === 'object' && data.RelatedTopics !== null) {
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
                                    refducky += entry[key] + '<br>';
                                  }
                                }
                              }
                            }
                          });
                      }
                      if (typeof data.Infobox.content === 'object' && data.Infobox.content !== null) {
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
                                //extimage =  data.Image;
                                extdummy = extdummy.replaceAll('"', '');
                                extdummy = extdummy.replaceAll('\'', '');
                                extdummy = extdummy.replaceAll('\n', '');
                                extdummy = extdummy.replaceAll(';', '<br>');
                                //console.log(key, entry[key]);
                              }
                            }
                          });
                        } else {
                          console.log('data.Infobox.content is not an object');
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
                              //extimage =  IMG_URL + data.results[0].poster_path;
                              extdummy = extdummy.replaceAll('"', '');
                              extdummy = extdummy.replaceAll('\'', '');
                              extdummy = extdummy.replaceAll('\n', '');
                              extdummy = extdummy.replaceAll(';', '<br>');
                              //cnt += 1;
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
                  extdummy = extdummy.replaceAll('"', '');
                  extdummy = extdummy.replaceAll('\'', '');
                  extdummy = extdummy.replaceAll('\n', '');
                  extdummy = extdummy.replaceAll(';', '<br>');
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
                            if (data.results[0] === undefined) {
                               extdummy = 'No info found at tmdb';
                            } else {
                                extdummy =  data.results[0].name + '<br>';
                                //extdummy += '<i>genre&nbsp;</i>'      + data.results[0].id + '<br>';
                                extdummy += '<i>aired on: </i>'      + data.results[0].first_air_date + '<br>';
                                extdummy += '<i>original name: </i>' + data.results[0].original_name + '<br><br>';
                                extdummy += data.results[0].overview;
                                extimage =  iu + data.results[0].poster_path;
                                extdummy = extdummy.replaceAll('"', '');
                                extdummy = extdummy.replaceAll('\'', '');
                                extdummy = extdummy.replaceAll('\n', '')
                            }
                        });
                    }
                  });
                  data  = [];
                  entry = [];
                  cnt   = 0;
                } // end if
                text += '<a style="cursor:pointer; color:white" onclick="document.getElementById(\'bookpage\').innerHTML = \'' + extdummy + '\'";>' + sourcename[i] + '</a><br>';
            } // end for get sources
            data  = [];
            entry = [];
            dummy = '';
        } // not all
        if (locale == 'local'){ url = 'json/paper.json';}
        if (locale == 'remote'){
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

        }
        text += '              <div class="canvascenter click-zoom">';
        text += '                   <label>';
        text += '                      <input type="checkbox"  id="zoomcanvas">';
        text += '                      <img src="" alt="" id="canvas">';
        text += '                   </label>';
        text += '              </div>';
        text += '              <div class="w3-text-white w3-display-top"><p id="title"></p></div>';

        getjsonf(url, function(data){
            if (data) {
                textb += '         <div class="mySlides" id="paper">';
                textb += '              <div class="centerpaper w3-animate-left ovpage">';
                textb += '                   <div id="bookpage">';
                if (locale == 'remote'){
                    Object.entries(data.query.pages).forEach((entry) => {
                        const [key, value] = entry;
                        text += textb;
                        text += value.title + '<br><br>';
                        orgtext += value.title;
                        if (value.extract === undefined) { value.extract = "no info"; }
                        orgtext += '<br><br>' + value.extract;
                        text += createparagraph(value.extract);
                        text += '                   </div>';
                        text += '              </div>';
                        text += '        </div>';
                        cnt += 1;
                    });
                };
                if (locale == 'local'){
                    Object.entries(data).forEach((entry) => {
                        const [key, value] = entry;
                        if (value.private === false && value.name == section || section == 'all') {
                            text += textb;
                            text += value.name + '<br><br>';
                            orgtext += value.name;
                            text += createparagraph(value.extract);
                            orgtext += '<br><br>' + value.extract;
                            text += '                   </div>';
                            text += '              </div>';
                            text += '        </div>';
                            cnt += 1;
                        };
                    });
                };
            };
        }); // getjson
    }; // paper

    // generate image overlay data
    if (overlay == 'image'){
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
          //window.alert(`${key}${value.name}`);
          if (value.private === false && (value.name == section || section == 'all' && cnt == 0) || (section.indexOf(".json") > 0 && cnt == 0) ) {
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
    text += '       <div class="w3-left w3-hover-text-khaki"  onclick="navimage.direction(\'ArrowLeft\')">&#10094;</div>';
    text += '       <div class="w3-right w3-hover-text-khaki" onclick="navimage.direction(\'ArrowRight\')">&#10095;</div>';
    text += '  </div>';

    text += '  <div class="carousel">';
    text += '     <div class="carousel--wrap">';
    // todo figure out missing thumbnail this.$items[0] is undefined
    if (window.localStorage.getItem('menuitem') != 'paper'){
        Object.entries(imageurl).forEach((entry) => {
            const [key, value] = entry;
            if (value.private === false && (value.name == section || section == 'all') || section.indexOf(".json") > 0) {
              text += '          <div class="carousel--item">';
              text += '               <figure><img src="' + value.href + '" alt="' + value.description + '" id="' + cnt + '"/></figure>';
              text += '          </div>';
              cnt += 1;
            };
        });
    }
    // get media
    url = 'https://corsproxy.io/?' + 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=600&pilicense=any&titles=' +
          encodeURIComponent(dummy);
    // default no image
    if (extimage != "") {
        image = extimage;
    } else {
        //image = 'images/noimage.jpg';
    }
    cnt = 0;
    getjsonf(url, function(data){
        if (data) {
           if (data.query === undefined) {
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
        if (image != "") {
            text += '          <div class="carousel--item">';
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
    // clean up
    text = "";
    // reset toggle image and paper todo fix paper canvas issue
    if (overlay === 'paper'){
       document.getElementById("paper").style.display = 'block';
       document.getElementById("paper").style.visibilty = 'visible';
       document.getElementById("canvas").style.display = "none";
       document.getElementById("canvas").style.visibilty = "hidden";
    }

    // image carousel logic
    // courtesy https://codepen.io/supah/pen/VweRLrQ
    const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

    class dragscroll {
      constructor(obj) {
        this.$el = document.querySelector(obj.el);
        this.$wrap = this.$el.querySelector(obj.wrap);
        this.$items = this.$el.querySelectorAll(obj.item);
        this.$bar = this.$el.querySelector(obj.bar);
        this.init();
      }

      init() {
        this.progress = 0;
        this.speed = 0;
        this.oldX = 0;
        this.x = 0;
        this.playrate = 0;
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
            normalized = (e.wheelDelta % 120 - 0) == -0 ? e.wheelDelta / 120 : e.wheelDelta / 12;
        } else {
            var rawAmmount = e.deltaY ? e.deltaY : e.detail;
            normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
        }
        if (normalized == 1 ){
            if (Number(this.currentid) < this.$items.length - 1) {
               this.currentid = Number(this.currentid) + 1;
            } else {
               this.currentid = this.$items.length - 1;
            }
            dummy = 100;
        }
        if (normalized == -1 ){
            if (Number(this.currentid) > 0) {
               this.currentid = Number(this.currentid) - 1;
            } else {
               this.currentid = 0;
            }
            dummy = -100;
        }
        document.getElementById('canvas').setAttribute('src', this.$items[this.currentid].querySelector('img').src);
        document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
        this.progress += dummy;
        this.move();
      }

      handleclick(e) {
        if (e.target.src == undefined) {
            // todo refine to broad responds to all links onpage console.log(e.target.src);
            document.getElementById("paper").style.display = "block";
            document.getElementById("paper").style.visibilty = "visible";
            document.getElementById("canvas").style.display = "none";
            document.getElementById("canvas").style.visibilty = "hidden";
          // nop
        } else {
          if (e.target.id == 'zoomcanvas' || e.target.id == 'canvas') {
              if (document.getElementById("zoomcanvas").checked) {
                document.getElementById("zoomcanvas").checked = false;
                document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
              } else {
                document.getElementById("zoomcanvas").checked = true;
                document.getElementById('canvas').style.transform = 'translate(0, 0) scale(2)';
              }
          } else {
              if (overlay == 'paper'){
                  if (document.getElementById("paper").style.display == 'block'){
                     document.getElementById("paper").style.display = "none";
                     document.getElementById("paper").style.visibilty = "hidden";
                     document.getElementById("canvas").style.display = "block";
                     document.getElementById("canvas").style.visibilty = "visible";
                  } else {
                     document.getElementById("paper").style.display = "block";
                     document.getElementById("paper").style.visibilty = "visible";
                     document.getElementById("canvas").style.display = "none";
                     document.getElementById("canvas").style.visibilty = "hidden";
                 }
              }
              document.getElementById('canvas').setAttribute('src', e.target.src);
              document.getElementById("title").innerHTML = e.target.alt.split('_').join(' ');
              document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
              this.currentid = e.target.id;
          }
        }
      }

      handletest(e) {
        if (e == 'ArrowRight') {
           if (Number(this.currentid) < this.$items.length - 1) {
             this.currentid = Number(this.currentid) + 1;
           } else {
             this.currentid = this.$items.length - 1;
           }
           document.getElementById('canvas').setAttribute('src', this.$items[Number(this.currentid)].querySelector('img').src);
           document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
           document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
           this.progress += this.$el.clientWidth * 0.05;
           this.move();
        }
        if (e == 'ArrowLeft') {
           if (Number(this.currentid) > 0) {
             this.currentid = Number(this.currentid) - 1;
           } else {
             this.currentid = 0;
           }
           document.getElementById('canvas').setAttribute('src', this.$items[this.currentid].querySelector('img').src);
           document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
           document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
           this.progress -= this.$el.clientWidth * 0.05;
           this.move();
        }
      }

      handlekey(e) {
        if (e.key == 'ArrowRight') {
           if (Number(this.currentid) < this.$items.length) {
             this.currentid = Number(this.currentid) + 1;
           } else {
             this.currentid = this.$items.length - 1;
           }
           document.getElementById('canvas').setAttribute('src', this.$items[Number(this.currentid)].querySelector('img').src);
           document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
           document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
           this.progress += this.$el.clientWidth * 0.05;
           this.move();
        }
        if (e.key == 'ArrowLeft') {
           if (Number(this.currentid) > 0) {
             this.currentid = Number(this.currentid) - 1;
           } else {
             this.currentid = 0;
           }
           document.getElementById('canvas').setAttribute('src', this.$items[this.currentid].querySelector('img').src);
           document.getElementById("title").innerHTML = this.$items[this.currentid].querySelector('img').alt;
           document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
           this.progress -= this.$el.clientWidth * 0.05;
           this.move();
        }
        if(e.key == "ArrowUp") {
            if (document.getElementById("zoomcanvas").checked) {
              document.getElementById("zoomcanvas").checked = false;
              document.getElementById('canvas').style.transform = 'translate(0, 0) scale(1)';
            } else {
              document.getElementById("zoomcanvas").checked = true;
              document.getElementById('canvas').style.transform = 'translate(0, 0) scale(2)';
            }
        }
        if(e.key == "Escape") {
            if (modal.style == undefined) {
               modal.style = "";
            }
            modal.style.display = "";
            this.removeevents();
        }
      }

      handleTouchStart(e) {
        e.preventDefault();
        this.dragging = true;
        this.startX = e.clientX || e.touches[0].clientX;
        this.$el.classList.add('dragging');
      }

      handleTouchMove(e) {
        // zoom main image and move if needed
        const image = document.querySelector('img');
        const rect = image.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            const imageCenterX = rect.left + rect.width / 2;
            const imageCenterY = rect.top + rect.height / 2;
            const deltaX = e.clientX - imageCenterX;
            const deltaY = e.clientY - imageCenterY;
            const moveX = -deltaX * 0.1; // Adjust the multiplier for sensitivity
            const moveY = -deltaY * 0.1; // Adjust the multiplier for sensitivity
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const scaleFactor = 2 + Math.min(distance / 10, 0.125); // Scale up to 1.5x at a distance of 200px
            //const scaleFactor = 2 + Math.min(distance / 200, 0.5); // Scale up to 1.5x at a distance of 200px
            image.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;
        } else {
            image.style.transform = 'translate(0, 0)';
            image.style.transform = 'translate(0, 0) scale(1)';
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

      events() {
        window.addEventListener('resize',  this.calculate);
        window.addEventListener('wheel',   this.handleWheel);
        window.addEventListener('keydown', this.handlekey);
        window.addEventListener('click',   this.handleclick);
        if (overlay !== 'paper'){ // bypass to keep text selectable
            window.addEventListener('mousedown',         this.handleTouchStart);
            window.addEventListener('mousemove',         this.handleTouchMove);
            window.addEventListener('mouseup',           this.handleTouchEnd);
            window.addEventListener('mouseleave',        this.handleTouchEnd);
        }
      }

      removeevents() {
        window.removeEventListener('resize',     this.calculate);
        window.removeEventListener('wheel',      this.handleWheel);
        window.removeEventListener('keydown',    this.handlekey);
        window.removeEventListener('click',      this.handleclick);
        window.removeEventListener('mousedown',  this.handleTouchStart);
        window.removeEventListener('mousemove',  this.handleTouchMove);
        window.removeEventListener('mouseup',    this.handleTouchEnd);
        window.removeEventListener('mouseleave',    this.handleTouchEnd);
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
