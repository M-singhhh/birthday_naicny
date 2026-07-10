// Background Music Player
// Handles autoplay (with graceful fallback for browsers that block it)
// and a floating toggle button so the music never feels forced on the visitor.

class MusicPlayer {
    constructor(audioSrc) {
        this.audio = new Audio(audioSrc);
        this.audio.loop = true;
        this.audio.volume = 0;
        this.targetVolume = 0.5;
        this.fadeInterval = null;
        this.isPlaying = false;

        this.button = null;
        this.hint = null;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createButton();
        this.attemptAutoplay();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.id = 'musicToggle';
        this.button.setAttribute('aria-label', 'Toggle background music');
        this.button.innerHTML = '<span class="musicIcon">&#9834;</span>';
        this.button.addEventListener('click', () => this.toggle());
        document.body.appendChild(this.button);

        this.hint = document.createElement('div');
        this.hint.id = 'musicHint';
        this.hint.textContent = 'Click for music';
        document.body.appendChild(this.hint);
    }

    attemptAutoplay() {
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.button.classList.add('playing');
                    this.fadeVolume(this.targetVolume, 2000);
                })
                .catch(() => {
                    // Autoplay was blocked by the browser.
                    // Show a small hint and wait for the visitor to click.
                    this.isPlaying = false;
                    this.showHint();
                });
        }
    }

    showHint() {
        if (!this.hint) return;
        this.hint.classList.add('show');
        setTimeout(() => {
            if (this.hint) this.hint.classList.remove('show');
        }, 4000);
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.button.classList.add('playing');
                this.hint.classList.remove('show');
                this.fadeVolume(this.targetVolume, 800);
            })
            .catch(() => {
                // Still blocked or file missing; nothing more we can do here.
            });
    }

    pause() {
        this.fadeVolume(0, 500, () => {
            this.audio.pause();
        });
        this.isPlaying = false;
        this.button.classList.remove('playing');
    }

    fadeVolume(target, duration, callback = null) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);

        const steps = 20;
        const stepTime = duration / steps;
        const startVolume = this.audio.volume;
        const volumeStep = (target - startVolume) / steps;
        let currentStep = 0;

        this.fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = startVolume + volumeStep * currentStep;
            this.audio.volume = Math.min(Math.max(newVolume, 0), 1);

            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.audio.volume = target;
                if (callback) callback();
            }
        }, stepTime);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer('audio/song.mp3');
});
