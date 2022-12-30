/* click or press space to play / pause */
const video = document.querySelector('.viewer');
const playButton = document.querySelector('.toggle');

function togglePlay() {
    video.paused ? video.play() : video.pause();
  }

video.addEventListener('click', togglePlay);
playButton.addEventListener('click', togglePlay);
video.addEventListener('play', () => playButton.textContent = '❚ ❚');
video.addEventListener('pause', () => playButton.textContent = '►');
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        togglePlay();
    } else if (e.code === 'ArrowLeft') {
        video.currentTime -= 10;
    } else if (e.code === 'ArrowRight') {
        video.currentTime += 25;
    }
});

/* drag or click progress bar to scrub */
const progress = document.querySelector('.progress');

function scrub(e){
    if (!mousedown && e.type !== 'click') return;
    let playTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = playTime;
}

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', scrub);

let mousedown = null;
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseout', () => mousedown = false);

/* click skip buttons to skip or rewind video */
const rewindButton = document.querySelector('button[data-skip="-10"]');
const skipButton = document.querySelector('button[data-skip="25"]');

function skipVideo() {
    video.currentTime += parseFloat(this.dataset.skip);
}

rewindButton.addEventListener('click', skipVideo);
skipButton.addEventListener('click', skipVideo);

/* update progress_filled bar */
const progressFilled = document.querySelector('.progress__filled');

function progressFilledUpdate () {
    let progressPercentage = (video.currentTime / video.duration) * 100;
    progressFilled.style.flexBasis = `${progressPercentage}%`;
}

video.addEventListener('timeupdate', progressFilledUpdate);

/* handle the input change for playback speed and volume */
const volumeSlide = document.querySelector('input[name="volume"]');

function updatecControl () {
    video[this.name] = this.value;
}

volumeSlide.addEventListener('change', updatecControl);
volumeSlide.addEventListener('mousemove', updatecControl);

const speedSlide = document.querySelector('input[name="playbackRate"]')
speedSlide.addEventListener('change', updatecControl);
speedSlide.addEventListener('mousemove', updatecControl);

/* toggle betweem full screen */
let isFullscreen = false;
function toggleFullscreen(e) {
    isFullscreen = !isFullscreen;
    isFullscreen ? video.webkitExitFullscreen() : video.webkitRequestFullscreen();
}

window.addEventListener('keydown', (e) => e.code === 'KeyF' ? toggleFullscreen(e) : null);
video.addEventListener('dblclick', toggleFullscreen);