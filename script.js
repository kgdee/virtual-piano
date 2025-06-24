const piano = document.getElementById("piano");
const volumeInput = document.querySelector(".volume-input input");
const keyLabelToggle = document.querySelector(".key-label-toggle input");
const keySizeInput = document.querySelector(".key-size-input select");

let currentVolume = load("currentVolume", 1);
let isKeyLabelHidden = load("isKeyLabelHidden", true);
let keySize = load("keySize", 60);

function save(key, value) {
  localStorage.setItem(`${projectName}_${key}`, JSON.stringify(value));
}

function load(key, defaultValue) {
  const savedValue = localStorage.getItem(`${projectName}_${key}`);
  if (savedValue == null) return defaultValue;
  return JSON.parse(savedValue);
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
  let whiteCount = 0;

  piano.innerHTML = "";
  for (let i = 0; i < 88; i++) {
    const keyName = getNoteName(i);

    const isBlack = [1, 4, 6, 9, 11].includes(i % 12); // C# D# F# G# A#

    if (!isBlack) whiteCount++;
    piano.innerHTML += `
      <div class="${isBlack ? "black" : "white"} key" data-note="${i}" onclick="playNote(${i})" style="${isBlack ? `left: ${whiteCount * keySize - keySize / 4}px; ` : ""} width: ${isBlack ? keySize / 2 : keySize}px;">
        <span class="key-label" style="font-size: ${keySize / 4}px">${keyName}</span>
      </div>
    `;
  }
  // Scroll to C3 key, 16 white keys before C3
  piano.scrollLeft = keySize * 16;

  piano.classList.toggle("hidden-label", !isKeyLabelHidden);
}

function getNoteName(index, includeOctave = true) {
  const noteNames = ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"];
  
  const octave = includeOctave ? Math.floor((21 + index) / 12) - 1 : ""
  const keyName = noteNames[index % 12] + octave;
  return keyName;
}

function playNote(index) {
  const audio = new Audio(`assets/audio/notes/${index + 1}.mp3`);
  audio.volume = currentVolume;
  audio.play();
  MusicSheet.play(index);
}

function changeVolume(value) {
  currentVolume = value;
  save("currentVolume", currentVolume);
}

function toggleKeyLabel(state) {
  isKeyLabelHidden = state;
  piano.classList.toggle("hidden-label", !isKeyLabelHidden);
  save("isKeyLabelHidden", isKeyLabelHidden);
}

function changeKeySize(value) {
  keySize = parseInt(value);
  save("keySize", keySize);
  displayPiano();
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    MusicSheet.skip();
  }
});
