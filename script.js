document.addEventListener("DOMContentLoaded", () => {
  const audioPlayer = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const currentTimeElem = document.getElementById("currentTime");
  const durationElem = document.getElementById("duration");
  const fileInput = document.getElementById("fileInput");
  const playlist = document.getElementById("playlist");
  const addMusicBtn = document.getElementById("addMusicBtn");

  let tracks = [];
  let currentTrackIndex = -1;

  addMusicBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("audio/")) {
        const track = {
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
        };
        tracks.push(track);
        addTrackToPlaylist(track);
      }
    }
  });

  function addTrackToPlaylist(track) {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.dataset.url = track.url;
    li.classList.add("playlist-item");

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = tracks.findIndex((t) => t.url === track.url);
      if (index !== -1) {
        if (currentTrackIndex === index) {
          if (tracks.length > 1) {
            if (index === tracks.length - 1) {
              currentTrackIndex--;
            } else {
              currentTrackIndex++;
            }
            playTrack(tracks[currentTrackIndex].url);
          } else {
            audioPlayer.pause();
            audioPlayer.src = "";
            currentTrackIndex = -1;
          }
        }
    
        tracks.splice(index, 1);
        playlist.removeChild(li);
    
        if (tracks.length === 0) {
          playPauseBtn.classList.remove("fa-circle-pause");
          playPauseBtn.classList.add("fa-circle-play");
          currentTrackIndex = -1; 
        } else if (currentTrackIndex > index) {
          currentTrackIndex--;
        }
    
        updatePlaylist();
      }
    });

    li.appendChild(removeBtn);
    li.addEventListener("click", () => {
      playTrack(track.url);
      currentTrackIndex = tracks.findIndex((t) => t.url === track.url);
      updatePlaylist();
      scrollToTrack(currentTrackIndex);
    });

    playlist.appendChild(li);
  }

  function playTrack(url) {
    playPauseBtn.classList.remove("fa-circle-play");
    playPauseBtn.classList.add("fa-circle-pause");
    audioPlayer.src = url;
    audioPlayer.play();
    updatePlaylist();
  }

  function updatePlaylist() {
    Array.from(playlist.children).forEach((li, index) => {
      if (index === currentTrackIndex) {
        li.classList.add("playing");
      } else {
        li.classList.remove("playing");
      }
    });
  }

  function scrollToTrack(index) {
    const selectedTrack = playlist.children[index];
    selectedTrack.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.classList.remove("fa-circle-play");
      playPauseBtn.classList.add("fa-circle-pause");

      playPauseBtn.classList.add("animate__animated", "animate__rubberBand");

      playPauseBtn.addEventListener(
        "animationend",
        () => {
          playPauseBtn.classList.remove("animate__rubberBand");
        },
        { once: true }
      );
    } else {
      audioPlayer.pause();
      playPauseBtn.classList.remove("fa-circle-pause");
      playPauseBtn.classList.add("fa-circle-play");

      playPauseBtn.classList.add("animate__animated", "animate__rubberBand");

      playPauseBtn.addEventListener(
        "animationend",
        () => {
          playPauseBtn.classList.remove("animate__rubberBand");
        },
        { once: true }
      );
    }
  });

  prevBtn.addEventListener("click", () => {
    if (tracks.length > 0) {
      if (currentTrackIndex > 0) {
        currentTrackIndex--;
      } else {
        currentTrackIndex = tracks.length - 1;
      }
      playTrack(tracks[currentTrackIndex].url);
      updatePlaylist();
      scrollToTrack(currentTrackIndex);

      prevBtn.classList.add("animate__animated", "animate__pulse");

      prevBtn.addEventListener(
        "animationend",
        () => {
          prevBtn.classList.remove("animate__pulse");
        },
        { once: true }
      );
    }
  });

  nextBtn.addEventListener("click", () => {
    if (tracks.length > 0) {
      if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
      } else {
        currentTrackIndex = 0;
      }
      playTrack(tracks[currentTrackIndex].url);
      updatePlaylist();
      scrollToTrack(currentTrackIndex);

      nextBtn.classList.add("animate__animated", "animate__pulse");

      nextBtn.addEventListener(
        "animationend",
        () => {
          nextBtn.classList.remove("animate__pulse");
        },
        { once: true }
      );
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (tracks.length > 0) {
      if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
      } else {
        currentTrackIndex = 0; // Volver al inicio si está en la última canción
      }
      playTrack(tracks[currentTrackIndex].url);
      updatePlaylist();
      scrollToTrack(currentTrackIndex);
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
      progressBar.value = percent;
      currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
      durationElem.textContent = formatTime(audioPlayer.duration);
    } else {
      progressBar.value = 0;
      currentTimeElem.textContent = "00:00";
      durationElem.textContent = "00:00";
    }
  });
  
  progressBar.addEventListener("input", () => {
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
});
