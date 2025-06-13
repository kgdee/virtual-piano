const piano = document.getElementById("piano");

// Pattern of black keys: skip black key after E (4) and B (11)
const hasBlackKey = [true, true, false, true, true, true, false];

document.addEventListener("DOMContentLoaded", function () {
  displayPiano();
});

window.addEventListener("error", (event) => {
  const error = `${event.type}: ${event.message}`;
  console.error(error);
  alert(error);
});

function displayPiano() {
  const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

  for (let i = 1, midi = 21; i <= 88; i++, midi++) {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const name = noteNames[noteIndex] + octave;

    const key = document.createElement("div");
    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex); // C# D# F# G# A#

    key.className = isBlack ? "black" : "white";
    key.dataset.note = i;
    key.onclick = () => playNote(i);

    const label = document.createElement("span");
    label.textContent = name;
    label.className = "note-label";
    key.appendChild(label);

    piano.appendChild(key);

    if (isBlack) {
      const prevWhite = Array.from(piano.children).filter(k => k.classList.contains("white")).length;
      key.style.left = `${(prevWhite * 40) - 12}px`;
    }
  }
}

function playNote(index) {
  const audio = new Audio(`assets/audio/notes/${index}.mp3`);
  audio.play();
}
