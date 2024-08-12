import 'animate.css';

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
          name: file.name
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

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.addEventListener("click", () => {
      const index = tracks.findIndex(t => t.url === track.url);
      if (index !== -1) {
        tracks.splice(index, 1);
        playlist.removeChild(li);
        if (currentTrackIndex === index) {
          audioPlayer.pause();
          currentTrackIndex = -1;
        }
      }
    });

    li.appendChild(removeBtn);
    li.addEventListener("click", () => {
      playTrack(track.url);
      currentTrackIndex = tracks.findIndex(t => t.url === track.url);
      updatePlaylist();
    });

    playlist.appendChild(li);
  }

  function playTrack(url) {
    audioPlayer.src = url;
    audioPlayer.play();
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

  playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.classList.remove("fa-circle-play");
        playPauseBtn.classList.add("fa-circle-pause");
    } else {
        audioPlayer.pause();
        playPauseBtn.classList.remove("fa-circle-pause"); 
        playPauseBtn.classList.add("fa-circle-play");
    }
});


  prevBtn.addEventListener("click", () => {
    if (currentTrackIndex > 0) {
      currentTrackIndex--;
      playTrack(tracks[currentTrackIndex].url);
      updatePlaylist();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentTrackIndex < tracks.length - 1) {
      currentTrackIndex++;
      playTrack(tracks[currentTrackIndex].url);
      updatePlaylist();
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    progressBar.value = percent;
    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
    durationElem.textContent = formatTime(audioPlayer.duration);
  });

  progressBar.addEventListener("input", () => {
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
});
