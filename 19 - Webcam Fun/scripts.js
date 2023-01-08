const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// this function requests camera access and load the camera data to the video DOM
function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error('ERROR', err);
        });
}

// this functions enhance the red rbg of each pixel
function redEffect(pixels){
    // note: pixels.data values are capped between 0 and 255
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 100 // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 100 // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // BLUE
    }
    return pixels
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 100] = pixels.data[i] // RED
        pixels.data[i - 150] = pixels.data[i + 1] // GREEN
        pixels.data[i - 200] = pixels.data[i + 2] // BLUE
    }
    return pixels
}

// set alpha value to be 0 for every pixel that falls between the max and min of rgb
function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('input').forEach(input => levels[input.name] = input.value);
    
    for (let i = 0; i < pixels.data.length; i += 4) {
        let red = pixels.data[i];
        let green = pixels.data[i + 1];
        let blue = pixels.data[i + 2];

        if (
            red >= levels.rmin
            && red <= levels.rmax
            && green >= levels.gmin
            && green <= levels.gmax
            && blue >= levels.bmin
            && blue <= levels.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    };
}

/* 
this function loads the image from the video to the canvas every 16 ms
filter can be applied by manipulating the pixels loaded into the canvas every 16 ms interval
*/
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    
    return setInterval(() => {
        // draw the image on canvas
        ctx.scale(-1, 1);
        ctx.drawImage(video, width * -1, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with the pixels
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.2;
        // put the pixels back
        greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);
        // console.log(pixels);
        // debugger;
    }, 16);
}

/* 
this function first converts the canvas image to a jpeg
then create a new DOM element <a> for use to download
*/
function takePhoto() {
    // play sound
    snap.currentTime = 0;
    snap.play();

    // collect data
    const data = canvas.toDataURL('image/jpeg');

    // create the <a> DOM element for download
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.download = "handsome";
    link.textContent = 'Download Image';
    link.innerHTML = `<img src=${data} alt="cute kid" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);


