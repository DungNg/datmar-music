let seek_slider = document.getElementById("seek-slider");
let volume_slider = document.getElementById("volume-slider");
let curr_time = document.getElementById("current-time");
let total_duration = document.getElementById("total-duration");
let repeat_button = document.getElementById("repeat-button");
let play_button = document.getElementById("play-button");
let next_button = document.getElementById("next-button");
let previous_button = document.getElementById("previous-button");
let show_button = document.getElementById("show-button");
let hide_button = document.getElementById("hide-button");
let sidebar_left = document.getElementById("sidebar-left");

let updateTimer = null;
let categorySelected = "";
let category = {
  favorite: playlistFavorite,
  english: playlistEnglish,
  anime: playlistAnime,
  vietnam: playlistVietnam,
};

let playlist = [];
let currentPlaylistIndex = 0;
let currentPlayingCategory = "favorite";
let isPlaying = false;
let isRepeat = false;
let nowplaying = null;
let audio = new Audio();

function selectionChange() {
  categorySelected = document.getElementById("category-select").value;
  playlist = category[categorySelected];
  renderPlaylist(playlist);
  changePlayStyle();
}

function renderPlaylist(playlist) {
  const HTMLplaylist = document.getElementById("playlist");
  HTMLplaylist.innerHTML = "";
  playlist.forEach((song, index) => {
    let div = document.createElement("div");
    div.innerHTML = song.name;
    div.classList.add("song");
    div.dataset.index = index;

    let i = document.createElement("i");
    i.classList.add("fa-solid", "fa-play");
    i.dataset.index = index;

    div.addEventListener("click", (e) => {
      let playlistIndex = e.target.dataset.index;
      currentPlaylistIndex = playlistIndex;
      loadSongInfo(song);
      if (isPlaying && nowplaying == currentPlaylistIndex && categorySelected == currentPlayingCategory) {
        pause();
      } else {
        play(playlist[playlistIndex]);
      }
    });
    div.append(i);
    HTMLplaylist.append(div);
  });
}

function repeat() {
  isRepeat = !isRepeat;
}

function pause() {
  audio.pause();
  isPlaying = false;
  changePlayStyle();
}

function previous() {
  currentPlaylistIndex--;
  if (currentPlaylistIndex < 0) {
    currentPlaylistIndex = playlist.length - 1;
  }
  let song = playlist[currentPlaylistIndex];
  loadSongInfo(song);
  play(song);
}

function next() {
  currentPlaylistIndex++;
  if (currentPlaylistIndex > playlist.length - 1) {
    currentPlaylistIndex = 0;
    if (!isRepeat) {
      currentPlaylistIndex = playlist.length - 1;
      return;
    }
  }
  let song = playlist[currentPlaylistIndex];
  loadSongInfo(song);
  play(song);
}

function play(song) {
  if (!song) {
    return;
  }

  if (nowplaying != currentPlaylistIndex) {
    audio.src = song.path;
    audio.load();
  }

  if (currentPlayingCategory != categorySelected) {
    audio.src = song.path;
    audio.load();
  }

  audio.play();

  nowplaying = currentPlaylistIndex;
  currentPlayingCategory = categorySelected;

  updateTimer = setInterval(seekUpdate, 1000);
  isPlaying = true;
  changePlayStyle();
}

function loadSongInfo(song) {
  document.getElementById("song-name").innerHTML = song.name;
  document.getElementById("song-artist").innerHTML = song.artist;
  document.getElementById("song-image").src = song.image;
}

function seekTo() {
  let seekto = audio.duration * (seek_slider.value / 100);
  audio.currentTime = seekto;
}

function seekUpdate() {
  let seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    // Adding a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

function setVolume() {
  audio.volume = volume_slider.value / 100;
}

repeat_button.addEventListener("click", () => {
  repeat();
  repeat_button.classList.toggle("active");
});
play_button.addEventListener("click", () => {
  if (isPlaying && nowplaying == currentPlaylistIndex) {
    pause();
  } else {
    play(playlist[currentPlaylistIndex]);
    loadSongInfo(playlist[currentPlaylistIndex]);
  }
});
previous_button.addEventListener("click", previous);
next_button.addEventListener("click", next);

function changePlayStyle() {
  if (isPlaying) {
    play_button.children[0].classList.remove("fa-play");
    play_button.children[0].classList.add("fa-pause");
  } else {
    play_button.children[0].classList.remove("fa-pause");
    play_button.children[0].classList.add("fa-play");
  }

  let songs = document.querySelectorAll(".song");
  songs.forEach((song, index) => {
    if (
      isPlaying &&
      index == nowplaying &&
      categorySelected == currentPlayingCategory
    ) {
      song.children[0].classList.remove("fa-play");
      song.children[0].classList.add("fa-pause");
    } else {
      song.children[0].classList.remove("fa-pause");
      song.children[0].classList.add("fa-play");
    }
  });
}

audio.addEventListener("ended", () => {
  isPlaying = false;
  changePlayStyle();
  next();
});

hide_button.addEventListener("click", () => {
  sidebar_left.classList.toggle("hide");
  show_button.style.display = "block";
});

show_button.addEventListener("click", () => {
  sidebar_left.classList.toggle("hide");
  show_button.style.display = "none";
});
