const projectName = "virtual-piano";
const piano = document.getElementById("piano");
const volumeInput = document.querySelector(".volume-input input");
const keyLabelToggle = document.querySelector(".key-label-toggle input");
const keySizeInput = document.querySelector(".key-size-input select");

let currentVolume = getStoredValue("currentVolume", 0.5);
let isKeyLabelHidden = getStoredValue("isKeyLabelHidden", true);
let keySize = getStoredValue("keySize", 60);

function getStoredValue(key, defaultValue) {
  const stored = localStorage.getItem(`${projectName}_${key}`);

  if (stored == null) return defaultValue;

  return JSON.parse(stored);
}

document.addEventListener("DOMContentLoaded", function () {
  volumeInput.value = currentVolume;
  keyLabelToggle.checked = isKeyLabelHidden;
  keySizeInput.value = keySize;
  displayPiano();
});

window.addEventListener("error", (event) => {
  const error = `${event.type}: ${event.message}`;
  console.error(error);
  alert(error);
});

function displayPiano() {
  const noteNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  let whiteCount = 0;

  piano.innerHTML = "";
  for (let i = 1, midi = 21; i <= 88; i++, midi++) {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const name = noteNames[noteIndex] + octave;

    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex); // C# D# F# G# A#

    if (!isBlack) whiteCount++;
    piano.innerHTML += `
      <div class="${isBlack ? "black" : "white"} key" data-note="${i}" onclick="playNote(${i})" style="${isBlack ? `left: ${whiteCount * keySize - keySize / 4}px; ` : ""} width: ${isBlack ? keySize / 2 : keySize}px;">
        <span class="key-label" style="font-size: ${keySize / 4}px">${name}</span>
      </div>
    `;
  }
  // Scroll to C3 key, 16 white keys before C3
  piano.scrollLeft = keySize * 16;

  piano.classList.toggle("hidden-label", !isKeyLabelHidden);
}

function playNote(index) {
  const audio = new Audio(`assets/audio/notes/${index}.mp3`);
  audio.volume = currentVolume;
  audio.play();
}

function changeVolume(value) {
  currentVolume = value;
  localStorage.setItem(`${projectName}_currentVolume`, currentVolume);
}

function toggleKeyLabel(state) {
  isKeyLabelHidden = state;
  piano.classList.toggle("hidden-label", !isKeyLabelHidden);
  localStorage.setItem(`${projectName}_isKeyLabelHidden`, isKeyLabelHidden);
}

function changeKeySize(value) {
  keySize = parseInt(value);
  localStorage.setItem(`${projectName}_keySize`, keySize);
  displayPiano();
}
