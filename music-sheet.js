const MusicSheet = (() => {
  const element = document.querySelector(".music-sheet");
  let currentMusicSheet = -1;
  let currentNotes = [];
  let currentNote = 0;
  let currentPage = 1;

  function reset() {
    currentNotes = [];
    currentNote = 0;
    currentPage = 1;
    element.innerHTML = "";
  }

  function show(musicSheetIndex, page = 1) {
    const isNotAllowed = !musicSheetIndex || musicSheetIndex < 0;
    element.classList.toggle("hidden", isNotAllowed);
    if (isNotAllowed) {
      currentMusicSheet = -1;
      reset();
      return;
    }

    currentPage = page;
    const isNew = currentMusicSheet !== musicSheetIndex;
    if (isNew) reset();
    currentMusicSheet = musicSheetIndex;
    const musicSheet = musicSheets[currentMusicSheet];
    currentNotes = musicSheet.notes;

    if (musicSheet) {
      element.innerHTML = "";
      if (currentPage > 1) displayPage(musicSheet, currentPage - 1, true);
      else if (!isNew) displayPage(musicSheet, Math.floor(currentNotes.length / 9) + 1, true);
      displayPage(musicSheet, currentPage);
    }

    refresh();
  }

  function displayPage(musicSheet, page, isActive = false) {
    const notes = musicSheet.notes.slice((page - 1) * 9, page * 9);
    element.innerHTML += `
      <div class="page${isActive ? " active" : ""}" data-page="${page}">${notes.map((note, i) => `<div class="item" data-index="${i + (page - 1) * 9}" onclick="playNote(${note})">${getNoteName(note, false)}</div>`).join("")}</div>
    `;

    if (!isActive) {
      setTimeout(() => {
        element.querySelector(`.page[data-page="${page}"]`).classList.add("active");
      }, 100);
    }
  }

  function refresh() {
    if (currentNote + 1 > currentNotes.length) {
      reset();
      show(currentMusicSheet);
    } else if ((currentNote + 1) / 9 > currentPage) {
      const page = Math.floor((currentNote + 1) / 9) + 1;
      show(currentMusicSheet, page);
    }

    const activeNoteEls = element.querySelectorAll(".page .item.active");
    activeNoteEls.forEach((element) => {
      element.classList.remove("active");
    });
    element.querySelector(`.page .item[data-index="${currentNote}"]`)?.classList.add("active");
  }

  function play(noteIndex) {
    if (currentMusicSheet < 0) return;

    if (currentNotes[currentNote] % 12 === noteIndex % 12) {
      currentNote++;
    }

    refresh();
  }

  function skip() {
    if (currentMusicSheet < 0) return;

    const noteIndex = currentNotes[currentNote];
    if (noteIndex) playNote(noteIndex);
    else refresh();
  }

  return { show, play, skip };
})();
