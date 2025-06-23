const MusicSheet = (() => {
  const element = document.querySelector(".music-sheet");
  let currentMusicSheet = -1;
  let currentNotes = [];
  let currentNote = 0;
  let currentPage = 1;

  function restore() {
    currentMusicSheet = -1;
    currentNotes = [];
    currentNote = 0;
    currentPage = 1;
  }

  function show(musicSheetIndex, pageIndex = 0) {
    if (pageIndex <= 0) restore();
    const isNotAllowed = !musicSheetIndex || musicSheetIndex < 0;
    element.classList.toggle("hidden", isNotAllowed);
    if (isNotAllowed) {
      element.innerHTML = "";
      return;
    }

    currentMusicSheet = musicSheetIndex;
    const musicSheet = musicSheets[currentMusicSheet];
    currentNotes = musicSheet.notes;

    if (pageIndex > currentNotes.length / 9) {
      currentPage = Math.floor(currentNotes.length / 9) + 1;
      return;
    }

    if (musicSheet) {
      element.innerHTML = "";
      if (pageIndex > 0) createPage(musicSheet, pageIndex - 1, true);
      createPage(musicSheet, pageIndex);
    }

    refresh();
  }

  function createPage(musicSheet, pageIndex, isActive = false) {
    const notes = musicSheet.notes.slice(pageIndex * 9, (pageIndex + 1) * 9);
    element.innerHTML += `
      <div class="page${isActive ? " active" : ""}" data-index="${pageIndex}">${notes.map((note, i) => `<div class="item" data-index="${i + pageIndex * 9}">${getNoteName(note)}</div>`).join("")}</div>
    `;

    if (!isActive) {
      setTimeout(() => {
        element.querySelector(`.page[data-index="${pageIndex}"]`).classList.add("active");
      }, 100);
    }
  }

  function refresh() {
    if (currentNote / 9 >= currentPage) {
      currentPage = Math.floor((currentNote + 1) / 9) + 1
      show(currentMusicSheet, currentPage - 1);
    }
    
    const activeNoteEls = element.querySelectorAll(".page .item.active");
    activeNoteEls.forEach((element) => {
      element.classList.remove("active");
    });
    element.querySelector(`.page .item[data-index="${currentNote}"]`)?.classList.add("active");
  }

  function play(noteIndex) {
    if (currentMusicSheet < 0) return;

    if (currentNotes[currentNote] === noteIndex) {
      currentNote++;
    }

    refresh();
  }

  function skip(callback) {
    if (currentMusicSheet < 0) return;

    const noteIndex = currentNotes[currentNote];
    if (noteIndex) callback(noteIndex);
  }

  return { show, play, skip };
})();
