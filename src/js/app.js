const musics = [
  {
    name: 'Fur Elise',
    artist: 'Beethoven',
    imageURL: 'images/piano.jpg',
    musicURL: 'musics/fur-elise.mp3'
  },
  {
    name: 'Rondo Alla Turca',
    artist: 'Mozart',
    imageURL: 'images/piano2.jpg',
    musicURL: 'musics/rondo-alla-turca.mp3'
  },
  {
    name: 'Moonlight',
    artist: 'Beethoven',
    imageURL: 'images/moonlight.jpg',
    musicURL: 'musics/moonlight.mp3'
  }
];

const THEMES_ICONS = {
  sun: '<i class="fas fa-sun"></i>',
  moon: '<i class="fas fa-moon"></i>'
}

const REPRODUCTION_STATE_ICONS = {
  pause: '<i class="fas fa-pause"></i>',
  play: '<i class="fas fa-play"></i>'
}

class MusicPlayer {

  constructor() {

    this.currentIndexMusic = 0;
    this.currentMusic = musics[this.currentIndexMusic];
    this.musicAudio = new Audio(this.currentMusic.musicURL);
    this.isPaused = true;
    this.isRandom = false;
    this.isLoop = false;

    this.isLight = true;

    this.time = 0;
    this.timerProgress = null;

    this.menuBtn = document.querySelector('#menu-btn');
    this.changeTheme = document.querySelector('#change-theme');

    this.musicImage = document.querySelector('#music-image');
    this.musicName = document.querySelector('#music-name');
    this.musicArtist = document.querySelector('#music-artist');

    this.currentTime = document.querySelector('#current-time');
    this.progressTimeMusic = document.querySelector('#progress-time-music');
    this.totalTime = document.querySelector('#total-time');

    this.randomBtn = document.querySelector('#random');
    this.backwardBtn = document.querySelector('#backward');
    this.reproductionStateBtn = document.querySelector('#reproduction-state');
    this.forwardBtn = document.querySelector('#forward');
    this.loopBtn = document.querySelector('#loop');

    this.changeTheme.addEventListener('click', () => {

      this.isLight = !this.isLight;
      this.changeTheme.innerHTML = this.isLight ? THEMES_ICONS.moon : THEMES_ICONS.sun;
      document.body.dataset.theme = this.isLight ? 'light' : 'dark'

    });

    this.progressTimeMusic.addEventListener('change', () => this.changeDuration());

    this.randomBtn.addEventListener('click', () => {
      this.isRandom = toggleBtn(this.isRandom, this.randomBtn, 'btn--inset');
    });
    this.backwardBtn.addEventListener('click', () => this.loadNewMusic(--this.currentIndexMusic));
    this.reproductionStateBtn.addEventListener('click', () => this.playOrPause());
    this.forwardBtn.addEventListener('click', () => this.loadNewMusic(++this.currentIndexMusic));
    this.loopBtn.addEventListener('click', () => {
      this.isLoop = toggleBtn(this.isLoop, this.loopBtn, 'btn--inset');
    });

    this.musicAudio.addEventListener('ended', () => this.nextMusic());

    this.displayMusic();
  }

  nextMusic() {

    let newIndex = this.currentIndexMusic;

    if (this.isLoop) newIndex = this.currentIndexMusic;
    else if (this.isRandom) newIndex = rand(0, musics.length);
    else {
      newIndex++;
      if (newIndex >= musics.length) newIndex = 0;
    }

    this.loadNewMusic(newIndex);

  }

  loadNewMusic(musicIndex) {

    if (musicIndex >= musics.length || musicIndex < 0) musicIndex = 0;

    // Exclude old music
    this.musicAudio.pause();
    clearInterval(this.timerProgress);

    // Reset states
    this.currentIndexMusic = musicIndex;
    this.currentMusic = musics[this.currentIndexMusic];
    this.musicAudio = new Audio(this.currentMusic.musicURL);
    this.isPaused = true;
    this.time = 0;
    this.timerProgress = null;

    this.playOrPause();
    this.displayMusic();
    
    this.musicAudio.addEventListener('ended', () => this.nextMusic());
  }

  changeDuration() {

    let seconds = this.progressTimeMusic.value;
    this.currentTime.innerText = formatTime(seconds);
    this.musicAudio.currentTime = seconds;
    this.time = seconds;

  }

  playOrPause() {

    this.isPaused = !this.isPaused;
    this.reproductionStateBtn.innerHTML = this.isPaused ? REPRODUCTION_STATE_ICONS.play 
      : REPRODUCTION_STATE_ICONS.pause;
    
    if (this.isPaused) {
      this.musicAudio.pause();
      clearInterval(this.timerProgress);
    } else {
      this.musicAudio.play();

      this.timerProgress = setInterval(() => {
        this.updateTime();
      }, 1000);
    }

  }

  updateTime() {
    
    this.time++;
    this.currentTime.innerText = formatTime(this.time);
    this.progressTimeMusic.value = this.time;

  }

  displayMusic() {

    this.musicImage.src = this.currentMusic.imageURL;
    this.musicName.innerText = this.currentMusic.name;
    this.musicArtist.innerText = this.currentMusic.artist;

    this.musicAudio.addEventListener('loadeddata', () => {
      this.totalTime.innerText = formatTime(this.musicAudio.duration);
      this.progressTimeMusic.max = Math.round(this.musicAudio.duration);
    });

  }

}

let musicPlayer = new MusicPlayer();

function formatTime(time) {

  let minutes = Math.trunc(time / 60);
  let seconds = Math.trunc(time % 60);

  minutes = (minutes < 10 ? '0' : '') + minutes;
  seconds = (seconds < 10 ? '0' : '') + seconds;

  return `${minutes}:${seconds}`;
}

function toggleBtn(toggle, button, className) {
  toggle = !toggle;
  if (toggle) button.classList.add(className);
  else button.classList.remove(className);

  return toggle;
}

function rand(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}