/* ============================================================
   AUDIO MODULE
   Music toggle, play/pause, volume fade
   ============================================================ */

class AudioController {
  constructor(toggleBtnId) {
    this.btn = document.getElementById(toggleBtnId);
    this.audio = null;
    this.isPlaying = false;
    this.initialized = false;

    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
    }
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Create audio element — you can replace the src with any audio file
    this.audio = new Audio();
    // Placeholder: no audio source by default
    // To add music, place an audio file in the assets folder and uncomment:
    this.audio.src = 'assets/birthday-music.mp3';
    this.audio.loop = true;
    this.audio.volume = 0;
  }

  toggle() {
    this.init();

    if (!this.audio.src || this.audio.src === window.location.href) {
      // No audio source loaded — visual feedback only
      this.isPlaying = !this.isPlaying;
      this.btn.classList.toggle('playing', this.isPlaying);
      return;
    }

    if (this.isPlaying) {
      this.fadeOut();
    } else {
      this.fadeIn();
    }
  }

  fadeIn() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.btn.classList.add('playing');

      let vol = 0;
      const fadeInterval = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.6) {
          vol = 0.6;
          clearInterval(fadeInterval);
        }
        this.audio.volume = vol;
      }, 50);
    }).catch(() => {
      // Autoplay blocked — silent fail
      console.log('Audio playback was blocked by browser.');
    });
  }

  fadeOut() {
    let vol = this.audio.volume;
    const fadeInterval = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        vol = 0;
        this.audio.pause();
        this.isPlaying = false;
        this.btn.classList.remove('playing');
        clearInterval(fadeInterval);
      }
      this.audio.volume = vol;
    }, 50);
  }
}

window.AudioController = AudioController;
