const toggleButton = document.getElementById('tocmodal-toggle');
const toggleSymbol = document.getElementById('toggle-symbol');
var modaltoc       = document.getElementById('tocmodal');

toggleButton.onclick = () => {
  modaltoc.classList.toggle('open');
  toggleSymbol.textContent = modaltoc.classList.contains('open') ? "-" : "+";
};

// scroll inside viewmodal to target element smoothly
function scroll_to_id(id) {
  const container = document.getElementById('viewmodal');
  const target = container.querySelector('#' + CSS.escape(id));
  if(target) {
    container.scrollTo({top: target.offsetTop, behavior: 'smooth'});
  }
}

// display html, toc/index modal content
document.getElementById('loadbtn').addEventListener('click', async() => {
    getstopwords(document.getElementById('mdinput').value);
    initviewmd();
    const navmhtmodal       = document.getElementById('navmhtmodal');
    navmhtmodal.innerHTML   = '<svg viewBox="-20 -0 64 24" fill="none">' + svgdownload() + '</g></svg>';
    navmhtmodal.innerHTML  += `<button class="docbutton" id="download-pdf-btn">pdf</button>
                               <span id="modal-close" class="closenavmht">&times;</span>`;
    navmhtmodal.style.display  = 'block';
    document.getElementById('modal-close').onclick = () => {
      viewmodal.style.display = 'none';
      viewmodal.innerHTML = '';
      navmhtmodal.style.display = 'none';
    };

    window.localStorage.setItem('pagedata', document.getElementById('mdinput').value);
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
      initpdfdownload();
    });
});

// navigate in tocmodal
document.getElementById('tocmodal').addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'a') {
    e.preventDefault();
    const id = e.target.getAttribute('href').substring(1);
    scroll_to_id(id);
  }
});

const zipinput   = document.getElementById('zipinput');
const statusEl   = document.getElementById('status');
const filesEl    = document.getElementById('files');
const tocEl      = document.getElementById('heading-index');
const previewEl  = document.getElementById('preview');

let zip = null;

function clearActive() {
  [...filesEl.querySelectorAll('li')].forEach(li => li.classList.remove('active'));
}

function renderFileList() {
  filesEl.innerHTML = '';
  if (!zip) return;

  const names = Object.keys(zip.files).filter(name => !zip.files[name].dir);
  if (names.length === 0) {
    filesEl.innerHTML = '<li>No files found in archive.</li>';
    return;
  }

  for (const name of names) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#'; // or javascript:void(0)
    a.textContent = name;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showEntry(name, li);
    });
    li.appendChild(a);
    filesEl.appendChild(li);
  }
}

async function showEntry(name, li) {
  clearActive();
  li.classList.add('active');  // Fixed: was 'element', should be 'li'

  const entry = zip.file(name);
  let text = await entry.async('text');

  switch (name.split('.').pop()) {
    case 'txt':
      document.getElementById('input-text').value = text;
      getstopwords(document.getElementById('input-text').value);
      text = cleanupascii(text);
      text = createparagraph(text).join('\n\n');
      text = text2md(text);
      document.getElementById('mdinput').value = text;
      initviewmd(false);
      break;
    case 'md':
      document.getElementById('mdinput').value = text;
      getstopwords(document.getElementById('mdinput').value);
      initviewmd();
      break;
    default:
      // nop
  }

  const navmhtmodal = document.getElementById('navmhtmodal');
  navmhtmodal.innerHTML = '<svg viewBox="-20 -0 64 24" fill="none">' + svgdownload() + '</g></svg>';
  navmhtmodal.innerHTML += `<button class="docbutton" id="download-pdf-btn">pdf</button>
                             <span id="modal-close" class="closenavmht">&times;</span>`;
  navmhtmodal.style.display = 'block';
  document.getElementById('modal-close').onclick = () => {
    viewmodal.style.display = 'none';
    viewmodal.innerHTML = '';
    navmhtmodal.style.display = 'none';
  };

  window.localStorage.setItem('pagedata', document.getElementById('mdinput').value);
  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    initpdfdownload();
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}


async function loadZipFile(file) {
  if (!file) return;

  document.getElementById('status').textContent =
    'loading zip archive ' + file.name;

  let compressedTotal   = 0;
  let uncompressedTotal = 0;

  try {
    zip = await JSZip.loadAsync(file);

    // Count + size tally
    const entries = Object.values(zip.files).filter(entry => !entry.dir);

    for (const entry of entries) {
      // JSZip stores sizes inside _data only after loadAsync()
      compressedTotal   += entry._data.compressedSize;
      uncompressedTotal += entry._data.uncompressedSize;
    }

    // Render UI only when not in "paper" mode
    if (document.title !== 'paper') {
      renderFileList();
    }

    document.getElementById('status').textContent =
      'loaded ' + entries.length + ' file(s)';

    // Update totals
    document.getElementById('ziparchivecompressed').textContent =
      formatBytes(compressedTotal);

    document.getElementById('ziparchiveuncompressed').textContent =
      formatBytes(uncompressedTotal);

  } catch (err) {
    zip = null;
    document.getElementById('status').textContent =
      'loading zip archive aborted';
  }
}

function loadzipfilef(arrayBuffer, url) {
    //let compressedTotal = 0;
    //let uncompressedTotal = 0;

    // Convert ArrayBuffer → Blob → File
    const blob = new Blob([arrayBuffer], { type: 'application/zip' });
    const file = new File([blob], url.split('/').pop(), { type: 'application/zip' });

    // Load ZIP for UI
    loadZipFile(file);

    return JSZip.loadAsync(arrayBuffer).then(zip => {
        const fileList = Object.values(zip.files)
            .filter(entry => !entry.dir)
            .map(entry => {
                const parts = entry.name.split('/');
                const filename = parts.pop();
                const folder = parts.join('/');
                const extension = filename.includes('.') ? filename.split('.').pop() : '';

                //compressedTotal += entry._data.compressedSize;
                //uncompressedTotal += entry._data.uncompressedSize;

                return {
                    name: filename,
                    extension,
                    folder,
                    size: entry._data.uncompressedSize,
                    date:
                        entry.date.getFullYear() + '-' +
                        String(entry.date.getMonth() + 1).padStart(2, '0') + '-' +
                        String(entry.date.getDate()).padStart(2, '0') + ' ' +
                        String(entry.date.getHours()).padStart(2, '0') + ':' +
                        String(entry.date.getMinutes()).padStart(2, '0')
                };
            });

        //document.getElementById('ziparchivecompressed').textContent = formatBytes(compressedTotal);
        //document.getElementById('ziparchiveuncompressed').textContent = formatBytes(uncompressedTotal);

        return fileList;
    });
}

zipinput.addEventListener('change', e => {
  loadZipFile(e.target.files[0]);
});

document.getElementById('mht-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    let text = ev.target.result;
    let html = parsemhtparts(text);

    if (html) {
        const viewmodal = document.getElementById('viewmodal');
        if (isfrontpage(html)) {
           html = cleanupfrontpage(html);
        }
        html = fixinlinetaglines(html, ['b', 'i', 'em', 'u']);
        const bold = /<b>(.*?)<\/b>/g;
        let match;
        while ((match = bold.exec(html)) !== null) {
          const extractedText = match[1];
          const id = slugify(extractedText);
          // careful replace only current match
          html = html.replace(match[0], `<b id="${id}">${extractedText}</b>`);
        }

        viewmodal.innerHTML     = html;
        viewmodal.style.display = 'block';
        const tocmodal          = document.getElementById('tocmodal');
        tocmodal.innerHTML      = generatemhttoc(viewmodal);
        tocmodal.style.display  = 'block';
        const navmhtmodal       = document.getElementById('navmhtmodal');
        navmhtmodal.innerHTML   = '<svg viewBox="-20 -0 64 24" fill="none">' + svgdownload() + '</g></svg>';
        navmhtmodal.innerHTML   += `<button class="docbutton" id="download-html-btn">html</button><br><br>
                                   <button class="docbutton" id="download-md-btn"  >md&nbsp;&nbsp;</button><br><br>
                                   <span id="modal-close" class="closenavmht">&times;</span>`;

        navmhtmodal.style.display  = 'block';

        document.getElementById('download-html-btn').addEventListener('click', () => {
          let html              = viewmodal.innerHTML;
          const blob            = new Blob([html], { type: 'text/html' });
          const link            = document.createElement('a');
          const tempfile        = (filename + '.html' || 'document.html');
          link.href             = URL.createObjectURL(blob);
          link.download         = tempfile;
          // required for older versions of firefox and seamonkey
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        });

        document.getElementById('download-md-btn').addEventListener('click', () => {
          let markdown        = viewmodal.innerHTML;
          markdown            = htmltable2md(markdown);
          markdown            = html2md(markdown);
          const blob          = new Blob([markdown], { type: 'text/markdown' });
          const link          = document.createElement('a');
          const tempfile      = (filename + '.md' || 'document.md');
          link.href           = URL.createObjectURL(blob);
          link.download       = tempfile;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        });

        document.getElementById('modal-close').onclick = () => {
          viewmodal.style.display = 'none';
          viewmodal.innerHTML = '';
          navmhtmodal.style.display = 'none';
        };
    } else {
      //showModal("<em>Could not parse MHT or no HTML content found.</em>");
    }
  };
  filename = file.name.substring(0, file.name.lastIndexOf('.'));
  reader.readAsText(file);
});
