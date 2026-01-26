// index related
    function detectlanguage(text) {
      const lower = text.toLowerCase();
      const scores = { en: 0, fr: 0, de: 0, nl: 0 };
      const markers = {
        en: [" the ", " and ", " of ", " to ", " for ", " with ", " that ", " have ", " from ", " this "],
        fr: [" le ", " la ", " l'", " les ", " et ", " de ", " d'", " un ", " une ", " est "],
        de: [" und ", " die ", " der ", " das ", " den ", " dem ", " ein ", " eine ", " ist ", " nicht "],
        nl: [" de ", " het ", " en ", " een ", " van ", " in ", " op ", " te ", " is ", " zijn "]
      };

      for (const [lang, words] of Object.entries(markers)) {
        for (const w of words) {
          if (lower.includes(w)) scores[lang]++;
        }
      }
      let bestLang = "en";
      let bestScore = -1;
      for (const [lang, score] of Object.entries(scores)) {
        if (score > bestScore) {
          bestScore = score;
          bestLang = lang;
        }
      }
      return bestLang;
    }

    let stopwords = new Set();

    function getstopwords(text) {
        const lang = detectlanguage(text);
        const url = `json/${lang}-stop.json`;
        
        getjsonf(url, function(words) {
            stopwords = new Set(words);
            const el = document.getElementById('output');
            if (el) el.textContent = 'loaded stopwords (' + lang + ')';
        });
        
        // Fallback if getjsonf was sync/async and nothing loaded yet
        if (stopwords.size === 0) {
              stopwords = new Set([
                "the", "and", "a", "of", "to", "in", "he", "she", "for",
                "was", "with", "as", "by", "on", "at", "an", "it", "is",
                "his", "her", "or", "from", "that", "their", "they",
                "this", "who",
              ]);
            const el = document.getElementById('output');
            if (el) el.textContent = 'defaulted to stopwords (en)';
        }
    }

    // ner: find capitalized multi-word entities & dates/years
    function getner(text) {
      getstopwords(text);
      const entities = new Set();
      const capitalizedPattern = /\b([A-Z][a-z]*(?:\s+[A-Z][a-z]*)*)\b/g;
      let match;
      while ((match = capitalizedPattern.exec(text)) !== null) entities.add(match[1]);
      const yearPattern = /\b(19|20)\d{2}\b/g;
      while ((match = yearPattern.exec(text)) !== null) entities.add(match[0]);
      const datePattern = /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/g;
      while ((match = datePattern.exec(text)) !== null) entities.add(match[0]);
      return Array.from(entities);
    }
// end index related

// init functions
    function initviewmd() {
        let md          = document.getElementById('mdinput').value;
        md              = fixMojibake(md, _mojibakeMap);
        md              = mdtohtmlfencedcode(md);
        md              = mdtohtmltable(md);
        const lines     = md.split(/\r?\n/);
        const html      = convertmarkdown(lines);
        const viewmodal = document.getElementById('viewmodal');
        viewmodal.innerHTML     = html;
        viewmodal.style.display = 'block';
        const tocmodal          = document.getElementById('tocmodal');
        tocmodal.innerHTML      = generate_toc(viewmodal);
        tocmodal.style.display  = 'block';
    }

    function  inittext2md() {
      let text = document.getElementById('input-text').value;
      text = cleanupascii(text);
      text = createparagraph(text).join('\n\n');
      text = text2md(text);
      document.getElementById('markdown-output').value = text;
    }

    function initmddownload() {
      let markdownContent = "";
      if (window.localStorage.getItem('pagedata') !== null) {
        markdownContent = window.localStorage.getItem('pagedata');
        markdownContent = cleanupascii(markdownContent);
        markdownContent = createparagraph(markdownContent).join('\n\n');
        markdownContent = text2md(markdownContent);
        //markdownContent = text;
      } else {
        markdownContent = document.getElementById('markdown-output').value;
      }
      //const markdownContent = document.getElementById('markdown-output').value;
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const link = document.createElement('a');
      const filename = (window.localStorage.getItem('name')?.replace(/[^a-zA-Z0-9]/g, '') + '.md' || 'document.md');
      //const filename = window.localStorage.getItem('name') > 0 ?? 'document.md';
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      // required for older versions of firefox and seamonkey
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    let linkPositions = [];
    let indexpdf      = [];

    function initpdfdownload() {
      const pdf               = new jsPDF('p', 'pt', 'a4');
      const { width, height } = pdf.internal.pageSize;
      const base_font         = 'helvetica';
      /* jspdf fonts
        case "sans-serif":
        case "verdana":
        case "arial":
        case "helvetica":
        case "fixed":
        case "monospace":
        case "terminal":
        case "courier":
        default:
        "times";
      */
      const base_font_style   = 'normal';
      const base_font_size    = 10;
      const line_height       = base_font_size * 1.5;
      const margins           = { l_margin: 40, r_margin: 40, t_margin: 40, b_margin: 40 };

      pdf.setFont(base_font, base_font_style);
      pdf.setFontSize(base_font_size);
      let mdtext = "";
      if (window.localStorage.getItem('pagedata') !== null) {
        mdtext = window.localStorage.getItem('pagedata');
        mdtext = cleanupascii(mdtext);
        mdtext = createparagraph(mdtext).join('\n\n');
        mdtext = text2md(mdtext);
      } else {
        mdtext = document.getElementById('markdown-output').value;
      }
      // needed to correct paragraph creation in md
      //let mdtext = document.getElementById('markdown-output').value;
      mdtext = mdtext.replace(/^(#{1,6} .+)\n(?!\n)/gm, '$1\n\n');
      const pdfdata = {
        pdf: pdf,
        text: mdtext, 
        title: (window.localStorage.getItem('name')?.replace(/[^a-zA-Z0-9]/g, '') || 'document'),
        width: width,
        height: height,
        l_margin: margins.l_margin,
        r_margin: margins.r_margin,
        t_margin: margins.t_margin,
        b_margin: margins.b_margin,
        line_height: line_height,
        base_font: base_font,
        base_font_style: base_font_style,
        base_font_size: base_font_size,
        page: 1,
        top: margins.t_margin,
        add_footer: function () {
          pdf.setFont(pdfdata.base_font, pdfdata.base_font_style);
          pdf.setFontSize(pdfdata.base_font_size);
          let page_text = '' + pdfdata.page;
          let text_width = pdf.getTextDimensions(page_text).w;
          pdf.text(page_text, pdfdata.width - pdfdata.r_margin - text_width / 2, pdfdata.height - 16);
        },
        add_page: function() {
          pdf.addPage();
          this.page++;
          this.top = this.t_margin;
        }
      };

      md2pdf(pdfdata);
      genbookmarks(pdf, linkPositions, 'toc');
      genbookmarks(pdf, indexpdf, 'idx');
      linkPositions = [];
      indexpdf      = [];

      const nerpool = getner(pdfdata.text) || [];
      let nerfilter = nerpool.filter(e => !stopwords.has(e.toLowerCase()));
      // remove duplicates keying on lowercase
      nerfilter = [...new Map(nerfilter.map(e => [e.toLowerCase(), e])).values()];
      // sort and keep top 10
      const nerkeyword = nerfilter
        .sort((a, b) => b.length - a.length)
        .slice(0, 10);

      pdf.setProperties({
        title: pdfdata.title || "jspdf generated pdf",
        subject: nerkeyword.length > 0 ? "no chapters" : "Content Headings",
        author: window.location.hostname || "jspdf lib",
        keywords: nerkeyword.map(e => e.toLowerCase()).join(", "),
        creator: "jspdf lib"
      });

      pdf.save(pdfdata.title + '.pdf');
    }
// end init functions

// cleanup and preprocessing
    function cleanupascii(text) {
      // ascii art
      text = text.replace(/@{2,}/g, match => ''.repeat(match.length));
      text = text.replace(/^[\s\/\\|_\-\.]{6,}$/gm, '');
      // markdown specific
      text = text.replace(/={3,}/g, match => '-'.repeat(match.length));
      text = text.replace(/_{3,}/g, match => '-'.repeat(match.length));
      text = text.replace(/\*{2,}/g, match => ''.repeat(match.length));
      text = text.replace(/-+\s*([a-zA-Z0-9.\s]+?)\s*-+/g, (match, group) => group);
      // todo evaluate
      text = text.replace(/\. - {1,}/g, match => '.'.repeat(match.length));
      return text;
    }

    function cleanMarkdownLinks(text) {
      text = text.replace(/!\[.*?\]\(.*?\)/g, '').trim();
      let prev;
      do {
        prev = text;
        text = text.replace(/\[([^\[\]]*?)\]\([^\)]*?\)/g, '$1').trim();
      } while (text !== prev);
      return text.replace(/[\[\]\(\)]/g, '').trim();
    }

    // esoteric ... cleans up garbled text that results when
    // text is decoded with the wrong character encoding aka mojibake
    // from and kudos to https://github.com/habanada/ByteBadger
    function buildFullMojibakeMap() {
        //console.time("buildFullMojibakeMap");
        const encoder = new TextEncoder();
        const map = {};
  
        // Basis: Windows-1252 (Deutsch, Englisch, Französisch, Spanisch etc.)
        const decoders = [
            new TextDecoder("windows-1252"),
            new TextDecoder("windows-1251"), // Kyrillisch
            new TextDecoder("windows-1254"), // Türkisch 🇹🇷
            new TextDecoder("iso-8859-1")    // Alt-Französisch 🇫🇷
        ];
    
        for (let code = 0x00A0; code <= 0xFFFF; code++) {
            const ch = String.fromCharCode(code);
            const utf8Bytes = encoder.encode(ch);
    
            for (const decoder of decoders) {
                try {
                    const broken = decoder.decode(utf8Bytes);
                    if (broken !== ch && !map[broken]) {
                        map[broken] = ch;
                    }
                } catch {}
            }
        }
        //console.timeEnd("buildFullMojibakeMap");
        return map;
    }
  
    function fixMojibake(str, map) {
        if (!/[ÃÂâ€ÐÑ]/.test(str)) return str;
        let result = str;
        for (const bad in map) {
            if (result.indexOf(bad) !== -1) {
                result = result.split(bad).join(map[bad]);
            }
        }
        return result;
    }
  
    const _mojibakeMap = buildFullMojibakeMap();

    function createparagraph(text, maxlength = 600, doctype = 'text') {
      const roughparagraphs = text.split(/\n\s*\n+/).filter(p => p.trim());
      const paragraphs = [];
    
      roughparagraphs.forEach(paragraph => {
        const sentences      = paragraph.match(/[^.!?]+[.!?]?\s*/g) || [];
        let currentparagraph = '';
        let currentlength    = 0;
    
        sentences.forEach(sentence => {
          const s = sentence.trim();
          if (!s) return;
    
          const sentencelen = s.length + 1; // +1 for space
    
          if (currentlength + sentencelen > maxlength && currentparagraph) {
            paragraphs.push(currentparagraph.trim());
            currentparagraph = s + ' ';
            currentlength = sentencelen;
          } else {
            currentparagraph += s + ' ';
            currentlength += sentencelen;
          }
        });
    
        if (currentparagraph.trim()) {
          paragraphs.push(currentparagraph.trim());
        }
      });
    
      // return based on doctype
      if (doctype === 'html') {
        return paragraphs.map(p => p + '<br><br>').join('');
      }
    
      return paragraphs; // default: array of plain text paragraphs
    }
// end cleanup and preprocessing

    // pdf render from markdown
    function md2pdf(pdfdata) {
        const { pdf, text, width, height, l_margin, r_margin, t_margin, b_margin, line_height, base_font, base_font_style, base_font_size } = pdfdata;
        pdf.setFont(base_font, base_font_style);
        pdf.setFontSize(base_font_size);

        // Split on double newlines to separate paragraphs correctly
        let y = pdfdata.top, page = pdfdata.page - 1, paragraphs = text.split('\n\n');

        for (let para of paragraphs) {
          let trimmed = para.trim();
          if (!trimmed) continue;
          // filter out too many hashes
          if ((trimmed.trim().match(/#/g) || []).length > 4) continue;
          if (trimmed.indexOf("##") > -1) {
              let heading = trimmed.slice(trimmed.indexOf("##") + 3);
              // if needed clean up extra whitespace
              heading = heading.replace(/\s+/g, " ").trim();
              if (y + line_height > height - b_margin) {
                  pdfdata.add_page();
                  y = t_margin;
                  page = pdfdata.page;
              }
              pdf.setFont(base_font, "bold");
              let headingFontSize = base_font_size + 2 * 1.5;
              pdf.setFontSize(headingFontSize);
              linkPositions.push({
                  text: heading,
                  level: 2,
                  page,
                  x: l_margin * 7,
                  y: (pdf.internal.pageSize.height - y) + 4// convert top-down to bottom-up
              });
              y += headingFontSize;

              pdf.text(heading.replace(/\*\*/g, ''), l_margin, y);
              //pdf.text(heading, l_margin, y);
              y += headingFontSize * 1.2;
              pdf.setFont(base_font, base_font_style);
              pdf.setFontSize(base_font_size);
              continue;
          }

          // wrap paragraph into lines fitting width
          let wrapped_lines = pdf.splitTextToSize(para, width - l_margin - r_margin);
          for (let line of wrapped_lines) {
              if (!line.trim()) continue;
              if (y + line_height > height - b_margin) {
                  pdfdata.add_page();
                  y = t_margin;
                  page = pdfdata.page;
              }
              let xCursor = l_margin;
              const segments = getmdstyle(line.trim());
              segments.forEach(seg => {
                  if (seg.style === "hr") {
                      const lineY = y - line_height / 3;
                      pdf.setDrawColor(0, 0, 0);
                      pdf.setLineWidth(0.2);
                      pdf.line(l_margin + 100, lineY, width - r_margin - 100, lineY);
                      y += line_height * 0.5;
                  } else {
                      pdf.setFont(base_font, seg.style === "normal" ? base_font_style : seg.style);
                      const textWidth = pdf.getTextWidth(seg.text);
                      if (seg.style === "bold") {
                          level = 2;
                          indexpdf.push({
                              text: seg.text,
                              level,
                              page,
                              x: l_margin + (level - 2) * 7, 
                              y: (pdf.internal.pageSize.height - y) + base_font_size + 4// Convert top-down to bottom-up
                          });
                      }
                      pdf.text(seg.text, xCursor, y);
                      xCursor += textWidth;
                  }
              });
              y += line_height;
          }
          // extra space after paragraph
          y += line_height * 0.5;
          // add page number
          pdfdata.add_footer();
        }
        return y;
    }

    function genbookmarks(pdf, linkPositions, type = 'toc') {
        if (!linkPositions || linkPositions.length === 0) return null;
        let title = "";
        switch (type){
          case 'toc':
               title = "Table of Contents";
               const seentoc = new Set();
               const temppostoc = linkPositions
                  .slice() // Make a shallow copy if you don't want to mutate original
                  .reverse()
                  .filter(item => {
                    const key = item.text.toLowerCase();
                    if (seentoc.has(key)) return false;
                    seentoc.add(key);
                    return true;
               });
               // natural sort
               temppostoc.sort((a, b) =>
                  a.text.localeCompare(b.text, undefined, { numeric: true, sensitivity: "base" })
               );
               linkPositions = temppostoc;
               tempostoc = [];
               break;
          case 'idx':
               title = "Index";
               const seen = new Set();
               const alphanumRegex = /^[a-z0-9]+$/i; // only alphanumeric strings case-insensitive
               const temppos = linkPositions.filter(item => {
                   const key = item.text.toLowerCase();
                   if (seen.has(key) || !alphanumRegex.test(key)) return false;
                   seen.add(key);
                   return true;
               });
               temppos.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
               linkPositions = temppos;
               tempos = [];
               break;
          default:
               title = "Table of Contents";
               break;
        }
       const rootNode = pdf.outline.add(null, title, null);

        linkPositions.forEach(pos => {
            const pageNumber = pos.page;
            const yPdf = pdf.internal.pageSize.height - pos.y;
            pdf.outline.add(rootNode, pos.text.replace(/\*\*/g, ''), { dest: { pageNumber, x: pos.x || 0, y: yPdf } });
            //pdf.outline.add(rootNode, pos.text, { dest: { pageNumber, x: pos.x || 0, y: yPdf } });
        });
        tempos        = [];
        return rootNode;
    }

    // markdown
    function text2md(text) {
        const lines = text.split('\n');
        const allEntities = getner(text);
        let filteredEntities = allEntities.filter(e => !stopwords.has(e.toLowerCase()));
        filteredEntities.sort((a, b) => b.length - a.length);

        function isAlreadyBold(token) {
          return token.startsWith('**') && token.endsWith('**');
        }

        const convertedLines = lines.map(line => {
          //if (/^\s*\(?\s*[-\u2013\u2014]?\s*Chapter\b.*\)?$/i.test(line.trim())) {
          // pattern > sting contains chapter at beginning of line case insensitive
          if (/^Chapter\b/i.test(line.trim())) {
            return '## ' + line.trim();
          }
          // pattern > 13. LOURVE REVISITED
          if (/^(\d+)\.\s*([A-Z][\w\s]+)$/i.test(line.trim())) {
            return '## ' + line.trim();
          }
          // pattern > XIII. LOURVE REVISITED
          if (/^([IVXLCDM]+|\d+)\.\s*([A-Z][\w\s]+)$/i.test(line.trim())) {
            return '## ' + line.trim();
          }
          if (/^part\b/i.test(line.trim())) {
            return '## ' + line.trim();
          }
          let tokens = line.split(' ');
          tokens = tokens.map(token => {
            let rawToken = token.replace(/[\W_]+$/, ''); // Remove punctuation from end
            // Remove bold markers for checking
            let checkToken = rawToken.replace(/^\*\*|\*\*$/g, '');
            if (
              filteredEntities.includes(checkToken) &&
              !isAlreadyBold(token)
            ) {
              // Preserve any attached punctuation
              let punctuation = token.slice(rawToken.length);
              return `**${checkToken}**${punctuation}`;
            }
            return token;
          });
          return tokens.join(' ');
        });

        return convertedLines.join('\n');
    }

    function getmdstyle(line) {
      line = line.trim();
      if (/^\s?-{3,}\s?$/.test(line)) return [{ text: null, style: "hr" }];
      const regex = /(\*\*\*([\s\S]+?)\*\*\*|___([\s\S]+?)___|\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|\*([\s\S]+?)\*|_([\s\S]+?)_)/g;
      let segments = [], lastIndex = 0, match;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) segments.push({ text: line.slice(lastIndex, match.index), style: "normal" });
        if (match[2] || match[3]) segments.push({ text: match[2] ?? match[3], style: "bolditalic" });
        else if (match[4] || match[5]) segments.push({ text: match[4] ?? match[5], style: "bold" });
        else if (match[6] || match[7]) segments.push({ text: match[6] ?? match[7], style: "italic" });
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < line.length) segments.push({ text: line.slice(lastIndex), style: "normal" });
      return segments;
    }

  function mdtohtmltable(md) {
      return md.replace(
        /((?:^\|.*\|\s*(?:\r?\n|$)){2,})/gm,
        function (match) {
          const lines = match.trim().split(/\r?\n/).filter(l => l.trim() !== '');
          if (lines.length < 2) return match;
    
          const headerLine    = lines[0];
          const separatorLine = lines[1];
          const bodyLines     = lines.slice(2);

          if (!/^\|?[\s:\-\|]+\|?$/.test(separatorLine.trim())) return match;

          // column alignments
          const aligns = separatorLine
            .split('|')
            .filter(Boolean)
            .map(s => {
              s = s.trim();
              if (/^:\-+:$/.test(s)) return 'center';
              if (/^:-+$/.test(s)) return 'left';
              if (/^-+:$/.test(s)) return 'right';
              return null;
            });

          const headers = headerLine
            .split('|')
            .filter(Boolean)
            .map((c, i) => {
              const align = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
              return `<th class="thmd"${align}>${c.trim()}</th>`;
            })
            .join('');

          const bodyRows = bodyLines
            .map(row => {
              const cols = row
                .split('|')
                .filter(Boolean)
                .map((c, i) => {
                  const align = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
                  return `<td class="tdmd"${align}>${c.trim()}</td>`;
                })
                .join('');
              return `<tr class="trmd">${cols}</tr>`;
            })
            .join('');
    
          return `<table class="tablemd"><thead><tr class="trmd">${headers}</tr></thead><tbody>${bodyRows}</tbody></table>\n\n`;
        }
      );
  }

  function mdtohtml(content) {
      // Regular Expressions
      const h1 = /^#{1}[^#].*$/gm;
      const h2 = /^#{2}[^#].*$/gm;
      const h3 = /^#{3}[^#].*$/gm;
      const bold = /\*\*[^\*\n]+\*\*/gm;
      const italics = /\*([^\*\n]+)\*/gm;
      const link = /\[[\w|\(|\)|\s|\*|\?|\-|\.|\,]*(\]\(){1}[^\)]*\)/gm;
      const lists = /^((\s*((\*|\-)|\d(\.|\))) [^\n]+))+$/gm;
      const unorderedList = /^[\*|\+|\-]\s.*$/;
      const unorderedSubList = /^\s\s\s*[\*|\+|\-]\s.*$/;
      const orderedList = /^\d\.\s.*$/;
      const orderedSubList = /^\s\s+\d\.\s.*$/;
      const blockquote = /^>\s?.+$/gm;
      const inlinecode = /`([^`]+)`/gm;
      const hr = /^(\*\s*\*\s*\*|-{3,}|_{3,})$/gm; // horizontal line
      const image = /!\[([^\]]*)\]\(([^)]+)\)/gm;
      const strikethrough = /~~([^~]+)~~/gm;
      const highlight = /==([^=]+)==/gm;

      if (h1.test(content)) {
        const matches = content.match(h1);
        matches.forEach(element => {
          const extractedText = element.slice(1);
          content = content.replace(element, '<h1>' + extractedText + '</h1>');
        });
      }

      if (h2.test(content)) {
        const matches = content.match(h2);
        matches.forEach(element => {
          const extractedText = element.slice(2);
          content = content.replace(element, '<h2>' + extractedText + '</h2>');
        });
      }

      if (h3.test(content)) {
        const matches = content.match(h3);
        matches.forEach(element => {
          const extractedText = element.slice(3);
          content = content.replace(element, '<h3>' + extractedText + '</h3>');
        });
      }

      if (bold.test(content)) {
        const matches = content.match(bold);
        matches.forEach(element => {
          const extractedText = element.slice(2, -2);
          // add id attribute on bold **text** for index linking
          const id = slugify(extractedText);
          content = content.replace(element, `<b id="${id}">${extractedText}</b>`);
        });
      }

      if (italics.test(content)) {
        const matches = content.match(italics);
        matches.forEach(element => {
          const extractedText = element.slice(1, -1);
          content = content.replace(element, ' <em>' + extractedText + '</em>');
        });
      }

      // needs to be before inline link parsing
      if (image.test(content)) {
        const matches = content.match(image);
        matches.forEach(element => {
          const alt = element.match(/!\[([^\]]*)\]/)[1];
          const url = element.match(/\(([^)]+)\)/)[1];
          content = content.replace(element, `<img src="${url}" alt="${alt}">`);
        });
      }

      // [an inline-style link](https://www.google.com)
      if (link.test(content)) {
        const links = content.match(link);
        links.forEach(element => {
          const text = element.match(/^\[.*\]/)[0].slice(1, -1);
          const url = element.match(/\]\(.*\)/)[0].slice(2, -1);
          content = content.replace(element, '<a href=&quot;' + url + '&quot;>' + text + '</a>');
        });
      }

      if (blockquote.test(content)) {
        const matches = content.match(blockquote);
        if (matches) {
          let combined = matches.map(line => line.replace(/^>\s?/, '')).join(' ');
          const fullBlock = matches.join('\n');
          content = content.replace(fullBlock, '<blockquote>' + combined + '</blockquote>');
        }
      }

      if (inlinecode.test(content)) {
        const matches = content.match(inlinecode);
        matches.forEach(element => {
          const extractedText = element.slice(1, -1);
          const escaped = extractedText
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'); // prevent HTML injection
          content = content.replace(element, '<code>' + escaped + '</code>');
        });
      }

      if (hr.test(content)) {
        const matches = content.match(hr);
        matches.forEach(element => {
          content = content.replace(element, '<hr>');
        });
      }

      if (strikethrough.test(content)) {
        const matches = content.match(strikethrough);
        matches.forEach(element => {
          const extractedText = element.slice(2, -2);
          content = content.replace(element, '<del>' + extractedText + '</del>');
        });
      }

      if (highlight.test(content)) {
        const matches = content.match(highlight);
        matches.forEach(element => {
          const extracted = element.slice(2, -2);
          content = content.replace(element, '<mark>' + extracted + '</mark>');
        });
      }

      if (lists.test(content)) {
        const matches = content.match(lists);
        matches.forEach(list => {
          const listArray = list.split('\n');
          const formattedList = listArray.map((currentValue, index, array) => {
            if (unorderedList.test(currentValue)) {
              currentValue = '<li>' + currentValue.slice(2) + '</li>';
              if (!unorderedList.test(array[index - 1]) && !unorderedSubList.test(array[index - 1])) {
                currentValue = '<ul>' + currentValue;
              }
              if (!unorderedList.test(array[index + 1]) && !unorderedSubList.test(array[index + 1])) {
                currentValue = currentValue + '</ul>';
              }
              if (unorderedSubList.test(array[index + 1]) || orderedSubList.test(array[index + 1])) {
                currentValue = currentValue.replace('</li>', '');
              }
            }

            if (unorderedSubList.test(currentValue)) {
              currentValue = currentValue.trim();
              currentValue = '<li>' + currentValue.slice(2) + '</li>';
              if (!unorderedSubList.test(array[index - 1])) {
                currentValue = '<ul>' + currentValue;
              }
              if (!unorderedSubList.test(array[index + 1]) && unorderedList.test(array[index + 1])) {
                currentValue = currentValue + '</ul></li>';
              }
              if (!unorderedSubList.test(array[index + 1]) && !unorderedList.test(array[index + 1])) {
                currentValue = currentValue + '</ul></li></ul>';
              }
            }

            if (orderedList.test(currentValue)) {
              currentValue = '<li>' + currentValue.slice(2) + '</li>';
              if (!orderedList.test(array[index - 1]) && !orderedSubList.test(array[index - 1])) {
                currentValue = '<ol>' + currentValue;
              }
              if (!orderedList.test(array[index + 1]) && !orderedSubList.test(array[index + 1]) && !orderedList.test(array[index + 1])) {
                currentValue = currentValue + '</ol>';
              }
              if (unorderedSubList.test(array[index + 1]) || orderedSubList.test(array[index + 1])) {
                currentValue = currentValue.replace('</li>', '');
              }
            }

            if (orderedSubList.test(currentValue)) {
              currentValue = currentValue.trim();
              currentValue = '<li>' + currentValue.slice(2) + '</li>';
              if (!orderedSubList.test(array[index - 1])) {
                currentValue = '<ol>' + currentValue;
              }
              if (orderedList.test(array[index + 1]) && !orderedSubList.test(array[index + 1])) {
                currentValue = currentValue + '</ol>';
              }
              if (!orderedList.test(array[index + 1]) && !orderedSubList.test(array[index + 1])) {
                currentValue = currentValue + '</ol></li></ol>';
              }
            }

            return currentValue;
          }).join('');
          content = content.replace(list, formattedList);
        });
      }

      return content.split('\n').map(line => {
        if (!h1.test(line) && !h2.test(line) && !h3.test(line) && !unorderedList.test(line) &&
            !unorderedSubList.test(line) && !orderedList.test(line) && !orderedSubList.test(line)) {
               return line;
        }
      }).join('');
  }

  // slugify heading or text to create id
  function slugify(str) {
    return str.trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // build a list of index items from bold **text** elements with IDs in html dom
  function extract_index_items(container) {
    // select all bold elements with id attribute
    const bolds = container.querySelectorAll('b[id]');
    const seen = new Set();
    let items = [];
    bolds.forEach(b => {
      const text = b.textContent.trim();
      const id = b.id;
      if(!seen.has(id)) {
        seen.add(id);
        items.push({text, id});
      }
    });
    // sort alphabetically case-insensitive
    items.sort((a, b) => a.text.localeCompare(b.text, undefined, {sensitivity: 'base'}));
    return items;
  }

  // generate html toc and index content based on bold for mht
  function generatemhttoc(container) {
    const chapters = container.querySelectorAll('b[id]');
    if (chapters.length === 0) {
      return '<p>no chapters found.</p>';
    }
    let toc = '<br><b>chapters</b><ul>';
    chapters.forEach(b => {
      toc += `<li><a href="#${b.id}">${b.textContent}</a></li>`;
    });
    toc += '</ul>';
    return toc;
  }

  // generate html toc and index content based on headings + index items
  function generate_toc(container) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const indexitems = extract_index_items(container);
    if(headings.length === 0 && indexitems.length === 0) return '<p>no headings or index items found.</p>';

    let toc = '<br><b>chapters</b><ul>';
    headings.forEach(h => {
      toc += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
    });
    toc += '</ul>';
    if(indexitems.length > 0) {
      toc += '<b>index</b><ul>';
      indexitems.forEach(item => {
        toc += `<li><a href="#${item.id}">${item.text}</a></li>`;
      });
      toc += '</ul>';
    }
    return toc;
  }

  // convert markdown lines to html string with headings assigned ids
  function convertmarkdown(lines) {
    return lines.map(line => {
      line = line.trim();
      if(/^\s*#+\s/.test(line)) {
        const level = line.match(/^#+/)[0].length;
        const content = line.replace(/^#+\s*/, '');
        const id = slugify(content);
        return `<h${level} id="${id}">${mdtohtml(content)}</h${level}>`;
      }
      return `<p>${mdtohtml(line)}</p>`;
    }).join('\n');
  }

  function mdtohtmlfencedcode(md) {
    return md.replace(/```(\w+)?([\s\S]*?)```/g, (match, lang, code) => {
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `<div id="fence">${escapedCode.trim()}</div>`;
    });
  }

// mht2html related

function htmltable2md(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const tables = doc.querySelectorAll('table');
  if (!tables.length) return html; // no tables

  function convertTable(table) {
    let md = '';

    const rows = table.querySelectorAll('tr');
    rows.forEach((tr, rowIndex) => {
      const cells = tr.querySelectorAll('th, td');
      let rowContent = '|';

      cells.forEach(cell => {
        // map cell child nodes to markdown-compatible text
        let text = Array.from(cell.childNodes).map(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim();
          } else if (node.nodeName.toLowerCase() === 'br') {
            return ' '; // replace <br> with space
          } else if (node.nodeName.toLowerCase() === 'img') {
            // Convert <img> to markdown image syntax
            const src = node.getAttribute('src') || '';
            const alt = node.getAttribute('alt') || '';
            return `![${alt}](${src})`;
          } else {
            return node.textContent.trim();
          }
        }).join('');

        text = text.replace(/\s+/g, ' ').trim();
        rowContent += ' ' + text + ' |';
      });

      md += rowContent + '\n';

      if (rowIndex === 0) {
        md += '|' + Array(cells.length).fill(' --- ').join('|') + '|\n';
      }
    });
    return md;
  }

  let result = html;
  tables.forEach(table => {
    const mdTable = convertTable(table);
    result = result.split(table.outerHTML).join(mdTable);
    result = result
      .split('\n')
      .map(line => line.replace(/^\s*\|/, '|'))
      .join('\n')
      .trim();
  });

  return result;
}

function html2md(html) {
  // create a DOM parser
  const container = document.createElement('div');
  html = html.replace(/ {2,}/g, ' ').trim();
  // removes tabs todo maybe replace with div indent in html covnversion
  html = html.replace(/\t+/g, ' ');
  container.innerHTML = html.replace(/&nbsp;/g, ' ');
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();
    let content = Array.from(node.childNodes).map(processNode).join('');

    switch(tag) {
      case 'h1': return '# ' + content + '\n\n';
      case 'h2': return '## ' + content + '\n\n';
      case 'h3': return '### ' + content + '\n\n';
      case 'b':
      case 'strong': return '**' + content + '**';
      case 'i':
      case 'em': return '_' + content + '_';
      case 'a': return `[${content}](${node.getAttribute('href')})`;
      case 'ul': return '\n' + Array.from(node.children).map(li => '- ' + processNode(li)).join('\n') + '\n';
      case 'ol': return '\n' + Array.from(node.children).map((li, i) => `${i+1}. ${processNode(li)}`).join('\n') + '\n';
      case 'blockquote': return '> ' + content.replace(/\n/g, '\n> ') + '\n\n';
      case 'code': return '`' + content + '`';
      case 'hr': return '\n---\n';
      case 'img': return `![](${node.getAttribute('src')})`;
      case 'del': return '~~' + content + '~~';
      case 'mark': return '==' + content + '==';
      default: return content;
    }
  }
  return processNode(container).replace(/\n{3,}/g, '\n\n');
}

function isfrontpage(html) {
  const checkgenerator = /<meta[^>]+name\s*=\s*["']?generator["']?[^>]+content\s*=\s*["']?Microsoft FrontPage/i.test(html);
  const checkprogid    = /<meta[^>]+content\s*=\s*["']?FrontPage\.Editor\.Document["']?[^>]+name\s*=\s*["']?ProgId["']?/i.test(html);
  const check3d        = (html => (html.match(/3D/g) || []).length > 50); // todo might need percentage for more accruacy
  return checkgenerator || checkprogid || check3d;
}

function cleanupfrontpage(html) {
  // deal with frontpage linefeeds
  html              = html.replace(/<\/p\s*>/gi, '<br>');
  const tempDiv     = document.createElement('div');
  tempDiv.innerHTML = html;

  const allowedTags = new Set([
        'b', 'br', 'em', 'i', 'img',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ol', 'li', 'strong', 'table', 'td',
        'th', 'tr', 'u', 'ul']);
  // filter out 'blockquote' frontpage has the habit
  // of not adding a closing tag.
  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();
    let innerContent = Array.from(node.childNodes).map(cleanNode).join('');

    if (allowedTags.has(tag)) {
      if (tag === 'img') {
        const src = node.getAttribute('src') || '';
        // optionally, validate that src is a data URL or normal URL here if you want
        return `<img src="${src}">`;
      }
// todo used for ahref evaluate this one...
/*
if (tag === 'a') {
  const href = node.getAttribute('href') || '#';
  const title = node.getAttribute('title');
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}>${innerContent}</a>`;
}
*/
      // other allowed tags, return tag without attributes
      return `<${tag}>${innerContent}</${tag}>`;
    } else {
      // flatten disallowed tags to their children content
      return innerContent;
    }
  }

  return Array.from(tempDiv.childNodes).map(cleanNode).join('');
}

function fixinlinetaglines(html, tagnames) {
  if (!html) return html;

  let result = '';
  let i = 0;
  while (i < html.length) {
    // Find the next opening tag for any of the given tagNames
    let ntidx = -1;
    let ntname = null;

    for (const name of tagnames) {
      const open = html.indexOf('<' + name + '>', i);
      if (open !== -1 && (ntidx === -1 || open < ntidx)) {
        ntidx  = open;
        ntname = name;
      }
    }

    if (ntidx === -1) {
      // No more of these tags
      result += html.slice(i);
      break;
    }

    result += html.slice(i, ntidx);

    const openTag  = '<' + ntname + '>';
    const closeTag = '</' + ntname + '>';

    const openIdx = ntidx;
    const closeIdx = html.indexOf(closeTag, openIdx);
    if (closeIdx === -1) {
      // malformed, no closing tag; append rest and stop
      result += html.slice(openIdx);
      break;
    }

    // content between <tag> and </tag>
    let inside = html.slice(openIdx + openTag.length, closeIdx);

    // if newline, remove newline(s) and surrounding spaces inside
    if (inside.indexOf('\n') !== -1 || inside.indexOf('\r') !== -1) {
      let cleaned = '';
      let j = 0;
      while (j < inside.length) {
        const ch = inside[j];

        if (ch === '\n' || ch === '\r') {
          j++;
          // skip whitespace/newlines following the newline
          while (
            j < inside.length &&
            (inside[j] === ' ' ||
             inside[j] === '\t' ||
             inside[j] === '\n' ||
             inside[j] === '\r')
          ) {
            j++;
          }
          // nop
        } else {
          cleaned += ch;
          j++;
        }
      }
      inside = cleaned;
    }

    result += openTag + inside + closeTag;
    i = closeIdx + closeTag.length;
  }

  return result;
}

function decodequotedprintable(str) {
  str = str.replace(/=\r?\n/g, ''); // Remove soft line breaks
  return str.replace(/=([A-Fa-f0-9]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

function parsemhtparts(text) {
  text = text.replace(/\r\n/g, '\n');
  const boundaryMatch = text.match(/boundary="([^"]+)"/);
  if (!boundaryMatch) return null;
  const boundary = boundaryMatch[1];
  const parts = text.split('--' + boundary).filter(p => p.trim() && !p.startsWith('--'));

  let htmlContent = '';
  const resources = {
    images: {},
    css: {},
    js: {},
    fonts: {}
  };

  for (const part of parts) {
    const splitIndex = part.indexOf('\n\n');
    if (splitIndex === -1) continue;
    const rawHeaders = part.substring(0, splitIndex);
    let body = part.substring(splitIndex + 2).trim();

    const headers = {};
    rawHeaders.split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const value = line.substring(idx + 1).trim();
        headers[key] = value;
      }
    });

    if (headers['content-transfer-encoding'] && headers['content-transfer-encoding'].toLowerCase() === 'quoted-printable') {
      body = decodequotedprintable(body);
    }

    let contentType = headers['content-type'] ? headers['content-type'].toLowerCase() : '';

    // strip parameters to get main type only
    if (contentType.includes(';')) {
      contentType = contentType.split(';')[0].trim();
    }

    const resourceKeyRaw = headers['content-location'] || headers['content-id'] || '';
    const resourceKey    = resourceKeyRaw.replace(/[<>]/g, '').trim();
    const filename       = resourceKey.split(/[\\/]/).pop().toLowerCase();

    switch(contentType) {
      case 'text/html':
      case 'text/plain':
        // prefer first HTML part only
        if (!htmlContent) {
          htmlContent = body;
        }
        break;
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp':
        const mimeType = contentType;
        const base64Data = body.replace(/\s/g, '');
        if (filename) {
          resources.images[filename] = `data:${mimeType};base64,${base64Data}`;
        }
        break;
      case 'text/css':
        if (filename) {
          resources.css[filename] = body;
        }
        break;

      case 'text/javascript':
      case 'application/javascript':
        if (filename) {
          resources.js[filename] = body;
        }
        break;
      case 'font/woff':
      case 'font/woff2':
      case 'application/font-woff':
      case 'application/font-woff2':
      case 'application/x-font-ttf':
      case 'font/ttf':
        // Fonts stored as base64 similar to image, embed via CSS rewriting usually
        if (filename) {
          const base64FontData = body.replace(/\s/g, '');
          resources.fonts[filename] = `data:${contentType};base64,${base64FontData}`;
        }
        break;
      default:
        // unknown content types, do nothing or optionally log.
    }
  }

  if (!htmlContent) return null;

  const parser = new DOMParser();
  const doc    = parser.parseFromString(htmlContent, 'text/html');

  doc.querySelectorAll('img[src]').forEach(img => {
    let src = img.getAttribute('src');
    if (!src) return;
    let srcFilename = src.split(/[\\/]/).pop().split('?')[0].toLowerCase();
    if (resources.images[srcFilename]) {
      img.setAttribute('src', resources.images[srcFilename]);
    }
  });

  // inject CSS
  Object.values(resources.css).forEach(cssText => {
    const styleEl = doc.createElement('style');
    styleEl.textContent = cssText;
    doc.head.appendChild(styleEl);
  });

  // inject JS
  Object.values(resources.js).forEach(jsText => {
    const scriptEl = doc.createElement('script');
    scriptEl.textContent = jsText;
    doc.body.appendChild(scriptEl);
  });

  return doc.documentElement.outerHTML;
}
// end mht2html related

// reset text2md input if text is pasted
const el = document.getElementById('input-text');
if (el){
  document.getElementById('input-text').addEventListener('change', e => {
     localStorage.removeItem("pagedata");
     localStorage.setItem("name", "document");
  });
}