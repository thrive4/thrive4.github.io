    // audio player routines todo needs optimization and further tweaks
    let trElements = document.querySelectorAll('tr.trlight');
    let currentIndex = 0;
    let urls         = [];
    let titles       = [];
    let shuffle      = false;
    let lastPickIndex = -1;
    let previousPicks = [];
    audio.volume     = 0.5;

    if (typeof onclickAttribute != 'undefined') {
      trElements.forEach(trElement => {
          const onclickAttribute = trElement.getAttribute('onclick');
          const urlMatch = onclickAttribute.match(/audioplay\('([^']+)'/);
          if (urlMatch && urlMatch[1]) {
              urls.push(urlMatch[1]);
              const titleElement = trElement.querySelector('td:nth-child(3)');
              titles.push(titleElement ? titleElement.textContent : 'Unknown Title');
          }
      });
    }

    function shuffleplay(set) {
        if (previousPicks.length === set) {
            // reset picks
            previousPicks = [];
            lastPickIndex = -1;
        }
    
        let shuffleindex;
        do {
            shuffleindex = Math.floor(Math.random() * set);
        } while (previousPicks.includes(shuffleindex));

        previousPicks.push(shuffleindex);
        lastPickIndex = previousPicks.length - 1;
        //console.log('pick: ', shuffleindex);
        return shuffleindex;
    }

    audio.addEventListener('ended', () => {
        //console.log('Playback ended!');
        if (currentIndex === trElements.length) {
           currentIndex = 0;
        }
        // shuffle play
        if (shuffle) {
           currentIndex = shuffleplay(trElements.length);
        }
        audioplay(urls[currentIndex], trElements[currentIndex]);
    });

    // keyboard navigation audio player
    document.onkeydown = function (event) {
        var kbpressed = event.key;
        // tricky overrides browser shortcut keys
        event.preventDefault();
        // todo harmonize with audio end
        if (currentIndex === trElements.length) {
           currentIndex = 0;
        }

        // audio previous
        if(kbpressed === "ArrowLeft") {
            if (shuffle) {
               if (lastPickIndex > 0) {
                   lastPickIndex--;
                   currentIndex = previousPicks[lastPickIndex];
                   audioplay(urls[currentIndex], trElements[currentIndex]);
               }
            } else {
                if (currentIndex >  1) {
                   audioplay(urls[currentIndex - 2], trElements[currentIndex - 2]);
                }
            }
        }

        // audio next
        if(kbpressed === "ArrowRight") {
            if (shuffle) {
               currentIndex = shuffleplay(trElements.length);
            }
            audioplay(urls[currentIndex], trElements[currentIndex]);
        }

        // audio pause / play
        if(kbpressed === "p" || kbpressed === " ") {
            if (audio.paused) {
               audio.play();
            } else {
               audio.pause();
            }
        }

        // audio drc on / off todo harmonize with click
        if(kbpressed === "d") {
            autoGainEnabled = !autoGainEnabled;
            autoGainToggle.textContent = autoGainEnabled ? 'Disable Auto Gain' : 'Enable Auto Gain';
            if (!autoGainEnabled) {
              // Optionally reset gain to unity when disabling
               gainNode.gain.value = 1;
               volumeSlider.value  = 1;
              // updateGainIndicator();
            }
        }

        // audio seek
        if(kbpressed === ".") {
            audio.currentTime = audio.currentTime + 5;
        }
        if(kbpressed === ",") {
            audio.currentTime = audio.currentTime - 5;
        }

        // audio volume
        if(kbpressed === "+") {
            if (audio.volume < 0.9) {
               audio.volume = audio.volume + 0.1;
            }
        }
        if(kbpressed === "-") {
            if (audio.volume >= 0.1) {
               audio.volume = audio.volume - 0.1;
            }
        }
    }

   // audio gain routines
    const volumeSlider   = document.getElementById('volumeSlider');
    const rmsValue       = document.getElementById('rmsValue');
    const gainIndicator  = document.getElementById('gainIndicator');
    const autoGainToggle = document.getElementById('autoGainToggle');

    // web Audio API setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sourceNode   = audioContext.createMediaElementSource(audio);
    const gainNode     = audioContext.createGain();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;

    // connect the nodes: source -> gain -> analyser -> destination
    sourceNode.connect(gainNode);
    gainNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    // visualization setup
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray    = new Uint8Array(bufferLength);

    // gain indicator
    function updateGainIndicator() {
      const val = parseFloat(gainNode.gain.value);
      const diff = val - 1;
      if (Math.abs(diff) < 0.01) {
        gainIndicator.textContent = '0';
      } else if (diff > 0) {
        gainIndicator.textContent = '+' + diff.toFixed(2);
      } else {
        gainIndicator.textContent = '–' + Math.abs(diff).toFixed(2);
      }
    }

    // draw waveform and RMS
    function draw() {
      requestAnimationFrame(draw);
      analyserNode.getByteTimeDomainData(dataArray);

      // calculate RMS amplitude
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        let normalized = (dataArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      rmsValue.textContent = 'RMS: ' + rms.toFixed(3);

      updateGainIndicator();
    }
    draw();

    // manual gain control
    volumeSlider.addEventListener('input', function() {
      gainNode.gain.value = this.value;
      updateGainIndicator();
    });

    // auto gain control
    let autoGainEnabled = false;
    autoGainToggle.addEventListener('click', function() {
      autoGainEnabled = !autoGainEnabled;
      autoGainToggle.textContent = autoGainEnabled ? 'Disable Auto Gain' : 'Enable Auto Gain';
      if (!autoGainEnabled) {
        // Optionally reset gain to unity when disabling
         gainNode.gain.value = 1;
         volumeSlider.value  = 1;
         //updateGainIndicator();
      }
    });

    const targetRMS       = 0.1;  // Target loudness (tweak as needed)
    const gainAdjustSpeed = 0.01; // How quickly gain adjusts

    function autoGainControl() {
      if (autoGainEnabled) {
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          let normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);

        if (rms < targetRMS * 0.98) {
          gainNode.gain.value = Math.min(gainNode.gain.value + gainAdjustSpeed, 2);
        } else if (rms > targetRMS * 1.02) {
          gainNode.gain.value = Math.max(gainNode.gain.value - gainAdjustSpeed, 0);
        }
        volumeSlider.value = gainNode.gain.value;
        updateGainIndicator();
      }
      requestAnimationFrame(autoGainControl);
    }
    autoGainControl();

    // initial gain
    gainNode.gain.value = volumeSlider.value;
    updateGainIndicator();

    // mp3 tags
    function getMp3Tag(searchTag, arrayBuffer) {
      const tagMap = {
        "TITLE": "TIT2",
        "ARTIST": "TPE1",
        "ALBUM": "TALB",
        "TRACK": "TRCK",
        "YEAR": "TYER",
        "GENRE": "TCON"
      };

      const dataView = new DataView(arrayBuffer);
      
      // check for id3 header
      if (dataView.getUint8(0) === 0x49 && dataView.getUint8(1) === 0x44 && dataView.getUint8(2) === 0x33) {
        //console.log("ID3 tag found at the start of the file.");
        const tagLength = ((dataView.getUint8(6) & 0x7F) << 21) |
                          ((dataView.getUint8(7) & 0x7F) << 14) |
                          ((dataView.getUint8(8) & 0x7F) << 7) |
                          (dataView.getUint8(9) & 0x7F);

        let offset = 10; // Start after the ID3 header
    
        while (offset < 10 + tagLength) {
          const frameId = String.fromCharCode(
            dataView.getUint8(offset), 
            dataView.getUint8(offset + 1), 
            dataView.getUint8(offset + 2), 
            dataView.getUint8(offset + 3)
          );

          if (frameId === tagMap[searchTag]) {
            const frameSize = dataView.getUint32(offset + 4, false);
            const frameData = new Uint8Array(arrayBuffer, offset + 10, frameSize);
            return decodeFrameData(frameData); // Pass only frameData
          }
    
          // Move to the next frame
          const frameSize = dataView.getUint32(offset + 4, false) + 10; // 10 bytes for the frame header
          offset += frameSize;
        }
      }
    
      return "----";
    }
    
    function decodeFrameData(frameData) {
      // Check if the frame is a genre index
      if (frameData[0] === 0x00 && frameData[1] === 0x00) {
        // if first two bytes are null, it indicates a genre index
        const genreIndex = frameData[2]; // genre index is the third byte
        return genreIndex;
      }

      // determine encoding
      const encoding = frameData[0];
      let decodedString = '';

      if (encoding === 0x00) {
        // ISO-8859-1 (Latin-1)
        decodedString = String.fromCharCode.apply(null, frameData.subarray(1));
      } else if (encoding === 0x01) {
        // UTF-16LE
        for (let i = 1; i < frameData.length; i += 2) {
          const charCode = frameData[i] + (frameData[i + 1] << 8);
          if (charCode === 0) break; // Null terminator
          decodedString += String.fromCharCode(charCode);
        }
      } else if (encoding === 0x02) {
        // UTF-16BE
        for (let i = 1; i < frameData.length; i += 2) {
          const charCode = (frameData[i] << 8) + frameData[i + 1];
          if (charCode === 0) break;
          decodedString += String.fromCharCode(charCode);
        }
      } else {
        decodedString = new TextDecoder('utf-8').decode(frameData.subarray(1));
      }

      return decodedString.trim();
    }

    // parse synchsafe integer (for ID3 tag size)
    function readSynchsafeInt(dataView, offset) {
        return (
            (dataView.getUint8(offset) << 21) |
            (dataView.getUint8(offset + 1) << 14) |
            (dataView.getUint8(offset + 2) << 7) |
            (dataView.getUint8(offset + 3))
        );
    }

    // coverart
    function readID3Header(dataView) {
        if (
            dataView.getUint8(0) === 0x49 && // 'I'
            dataView.getUint8(1) === 0x44 && // 'D'
            dataView.getUint8(2) === 0x33    // '3'
        ) {
            const version = dataView.getUint8(3);
            const flags   = dataView.getUint8(5);
            const size    = readSynchsafeInt(dataView, 6);
            return { version, flags, size };
        }
        return null;
    }

    function extractCoverArt(dataView, id3Header) {
        let offset = 10; // after id3 header
        const end  = offset + id3Header.size;
        while (offset + 10 < end) {
            // read frame header
            const frameId = String.fromCharCode(
                dataView.getUint8(offset),
                dataView.getUint8(offset + 1),
                dataView.getUint8(offset + 2),
                dataView.getUint8(offset + 3)
            );
            let frameSize;
            if (id3Header.version === 4) {
                // ID3v2.4 uses synchsafe ints for frame size
                frameSize = readSynchsafeInt(dataView, offset + 4);
            } else {
                // ID3v2.3 uses normal 32-bit int
                frameSize = dataView.getUint32(offset + 4);
            }
            // If frameId is empty, break
            if (!frameId.trim()) break;
            if (frameId === 'APIC') {
                let ptr = offset + 10;
                const encoding = dataView.getUint8(ptr); ptr++;
                // read mime type (null-terminated string)
                let mime = '';
                while (dataView.getUint8(ptr) !== 0) {
                    mime += String.fromCharCode(dataView.getUint8(ptr));
                    ptr++;
                }
                ptr++; // Skip null
                if (!mime) mime = 'image/jpeg'; // fallback
                // Picture type (1 byte)
                const picType = dataView.getUint8(ptr); ptr++;
                // null-terminated string, encoding-dependent
                if (encoding === 0) { // ISO-8859-1
                    while (dataView.getUint8(ptr) !== 0) ptr++;
                    ptr++; // Skip null
                } else { // UTF-16
                    while (!(dataView.getUint8(ptr) === 0 && dataView.getUint8(ptr+1) === 0)) ptr += 2;
                    ptr += 2; // Skip null
                }
                // image data
                const imgDataStart = ptr;
                const imgDataEnd = offset + 10 + frameSize;
                const imgData = new Uint8Array(dataView.buffer, imgDataStart, imgDataEnd - imgDataStart);
                let ext = '.jpg';
                if (mime === 'image/png') ext = '.png';
                const blob = new Blob([imgData], { type: mime });
                const url = URL.createObjectURL(blob);
                return { url, ext };
            }
            offset += 10 + frameSize;
        }
        return null;
    }

