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
