const piano = document.getElementById("piano");

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
  let whiteCount = 0

  for (let i = 1, midi = 21; i <= 88; i++, midi++) {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const name = noteNames[noteIndex] + octave;

    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex); // C# D# F# G# A#

    if (!isBlack) whiteCount++

    piano.innerHTML += `
      <div class="${isBlack ? "black" : "white"} key" data-note="${i}" onclick="playNote(${i})"${isBlack ? ` style="left: ${(whiteCount * 40 - 12)}px"` : ""}>
        <span>${name}</span>
      </div>
    `
  }
  // Scroll to C3 key
  piano.scrollLeft = 40 * 16
}

function playNote(index) {
  const audio = new Audio(`assets/audio/notes/${index}.mp3`);
  audio.play();
}
