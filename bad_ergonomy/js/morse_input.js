let nameMorse = '';
let surnameMorse = '';
let activeField = '';
let spacePressStartTime = 0;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let isPlaying = false;

const morseDictionary = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
  '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
  '--..': 'Z'
};

function handleSpaceInputStart() {
  spacePressStartTime = Date.now();
  if (!isPlaying && activeField != '') {
    startTone();
  }
}

function handleSpaceInputEnd() {
  const spacePressDuration = Date.now() - spacePressStartTime;
  spacePressStartTime = 0;

  const morseSymbol = spacePressDuration >= 1000 ? '_' : '.';
  if (activeField === 'name') {
    nameMorse += morseSymbol;
    document.getElementById('name-text').textContent = nameMorse;
  } else if (activeField === 'surname') {
    surnameMorse += morseSymbol;
    document.getElementById('surname-text').textContent = surnameMorse;
  }
  stopTone();
}

function startTone() {
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    isPlaying = true;
  }
  
  function stopTone() {
    if (oscillator) {
      oscillator.stop();
      oscillator = null;
      isPlaying = false;
    }
  }

function translateAndUpdateMorse(morseString) {
  let translatedPart = '';
  let morsePart = '';
  let i = morseString.length - 1;

  while (i >= 0 && (morseString[i] === '.' || morseString[i] === '_')) {
    morsePart = morseString[i] + morsePart;
    i--;
  }

  translatedPart = morseString.slice(0, i + 1);

  if (morsePart) {
    const translatedLetter = morseDictionary[morsePart.replace(/_/g, '-')];
    if (translatedLetter) {
      translatedPart += translatedLetter;
    } else {
      return { result: 'ERREUR', translated: translatedPart };
    }
  }

  return { result: translatedPart };
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && spacePressStartTime === 0) {
    handleSpaceInputStart();
  }

  if (event.code === 'Enter') {
    let translationResult;
    if (activeField === 'surname') {
      if (surnameMorse.slice(-8) === '________') {
        surnameMorse = '';
        document.getElementById('surname-text').textContent = 'Prénom';
        return;
      }

      translationResult = translateAndUpdateMorse(surnameMorse);

      if (translationResult.result === 'ERREUR') {
        if (surnameMorse === '') {
          document.getElementById('surname-text').textContent = 'Prénom'; // marche pas
        } else {
          document.getElementById('surname-text').textContent = 'ERREUR';
          setTimeout(() => {
            document.getElementById('surname-text').textContent = translationResult.translated.replace(/_/g, '-');
            surnameMorse = translationResult.translated;
          }, 1000);
        }
      } else {
        surnameMorse = translationResult.result;
        document.getElementById('surname-text').textContent = surnameMorse.replace(/_/g, '-');
      }
    } else if (activeField === 'name') {
      if (nameMorse.slice(-8) === '________') {
        nameMorse = '';
        document.getElementById('name-text').textContent = 'Nom';
        return;
      }

      translationResult = translateAndUpdateMorse(nameMorse);

      if (translationResult.result === 'ERREUR') {
        if (nameMorse === '') {
          document.getElementById('name-text').textContent = 'Nom'; // marche pas
        } else {
          document.getElementById('name-text').textContent = 'ERREUR';
          setTimeout(() => {
            document.getElementById('name-text').textContent = translationResult.translated.replace(/_/g, '-');
            nameMorse = translationResult.translated;
          }, 1000);
        }
      } else {
        nameMorse = translationResult.result;
        document.getElementById('name-text').textContent = nameMorse.replace(/_/g, '-');
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    if (spacePressStartTime > 0) {
      handleSpaceInputEnd();
    }
  }
});

document.getElementById('change-name').addEventListener('click', () => {
  activeField = 'name';
});

document.getElementById('change-surname').addEventListener('click', () => {
  activeField = 'surname';
});

document.getElementById('next-page-btn').addEventListener('click', () => {
    window.location.href = 'phone_number.html';
  });
