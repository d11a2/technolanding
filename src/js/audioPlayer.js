'use strict';

const l = str => console.log(str);

function AudioPlayer(audioElementSelector,
                     canvasElementSelector,
                     playlistElementSelector,
                     progressElementSelector,
                     volumeElementSelector,
                     currentTimeElementSelector,
                     durationElementSelector
) {
    this.audioElement = document.querySelector(audioElementSelector);
    this.canvasElement = document.querySelector(canvasElementSelector);
    this.playlistElement = document.querySelector(playlistElementSelector);

    const progressElement = document.querySelector(progressElementSelector);
    const volumeElement = document.querySelector(volumeElementSelector);

    this.progressController = new SliderController(progressElement, this, 'currentTime');
    this.volumeController = new SliderController(volumeElement, this, 'volume');
    this.currentTimeElement = document.querySelector(currentTimeElementSelector);
    this.durationElement = document.querySelector(durationElementSelector);

    this.isPlaying = false;

    this.playlist = {
        playlistElement: this.playlistElement,
        tracks: ['./sounds/M.philips - Metheor.flac', './sounds/Namesis - Rush Machine.flac', './sounds/Black Mineral.wav'],
        index: 0,

        [Symbol.iterator]() {
            this.index = -1;
            return this;
        },
        next() {
            l("next:" + this.index)
            if (this.index < this.tracks.length - 1) {
                return {done: false, value: this.tracks[++this.index]};
            }
            this.index = 0;
            return {done: true, value: this.tracks[this.index]};
        },

        prev() {
            l("prev:" + this.index)
            if (this.index > 0) {
                return {done: null, value: this.tracks[--this.index]};
            }
            this.index = this.tracks.length - 1;
            return {done: null, value: this.tracks[this.index]};
        },

        current() {
            return {done: null, value: this.tracks[this.index]};
        }
    };

    this.setTrackSource = value => this.audioElement.src = value;

    // create audio context
    this.createAudioContext = () => new Promise((resolve, reject) => {
        const context = new (AudioContext || webkitAudioContext)();
        //this.volumeNode = context.createGain();
        const destination = context.destination;
        const analyserNode = context.createAnalyser();
        const sourceNode = context.createMediaElementSource(this.audioElement);
        sourceNode.connect(analyserNode);

        // this.volumeNode.connect(analyserNode);
        analyserNode.connect(destination);
        l('createAudioContext done')

        this.setTrackSource(this.playlist.current().value);

        resolve(analyserNode);
    });

    this.canvasObject = this.createAudioContext().then(analyserNode => {

            // append canvas element
            let canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'visualizer');
            canvas.setAttribute('width', this.canvasElement.getBoundingClientRect().width + 'px');
            canvas.setAttribute('height', this.canvasElement.getBoundingClientRect().height + 'px');

            this.canvasElement = this.canvasElement.appendChild(canvas);

            // create anonymous canvas object
            return {
                context: this.canvasElement.getContext("2d"),
                WIDTH: this.canvasElement.width,
                HEIGHT: this.canvasElement.height,
                barGap: 0.5,
                analyserNode: analyserNode,
            };
        }
    ).then(canvasObject =>

        // create function field visualize for AudioPlayer
        this.visualize = () => {

            canvasObject.analyserNode.fftSize = 128;
            const bufferLength = canvasObject.analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            console.log('bufferLength:', bufferLength);

            canvasObject.context.clearRect(0, 0, canvasObject.WIDTH, canvasObject.HEIGHT);

            l('width: ' + this.canvasElement.width)

            let drawVisual;

            const barWidth = canvasObject.WIDTH / (2 * bufferLength) - canvasObject.barGap;
            l('barWidth: ' + barWidth)

            const draw = function () {
                drawVisual = requestAnimationFrame(draw);
                let barHeight;
                //   l('isPlaying' + this.player.isPlaying)
                try {
                    canvasObject.analyserNode.getByteFrequencyData(dataArray);
                    canvasObject.context.fillStyle = 'rgb(0, 0, 0)';
                    canvasObject.context.fillRect(0, 0, canvasObject.WIDTH, canvasObject.HEIGHT);
                    //   console.log('(width / bufferLength) ' + bufferLength)

                    //    console.log("max: " + Math.max(...dataArray) + " barWidth " + barWidth)
                    let xr = canvasObject.WIDTH / 2;
                    let xl = canvasObject.WIDTH / 2;
                    for (let i = 1; i < bufferLength; i++) {

                        barHeight = dataArray[i];

                        canvasObject.context.fillStyle = `rgb( 
                    ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                        canvasObject.context.fillRect(xr, canvasObject.HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                        xr += barWidth + canvasObject.barGap;

                        canvasObject.context.fillStyle = `rgb( 
                    ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                        canvasObject.context.fillRect(xl, canvasObject.HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                        xl -= barWidth + canvasObject.barGap;
                    }
                    //  l('drow')

                    if (!this.isPlaying) {
                        cancelAnimationFrame(drawVisual);
                    }
                } catch (e) {
                    cancelAnimationFrame(drawVisual);
                    console.error(e);
                }
            }.bind(this);
            draw();
        })

    this.play = () => {
        l("readyState: " + this.audioElement.readyState.toString())
        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;

        } else {
            this.audioElement.play();
            this.isPlaying = true;
            SliderController.watchCurrentTime(this);
            this.visualize();
        }
    };


    this.playNext = () => {

        this.progressController.position = 0;
        this.isPlaying = false;
        this.setTrackSource(this.playlist.next().value);
        this.play();

    };

    this.playPrev = () => {

        this.progressController.position = 0;
        this.isPlaying = false;
        this.setTrackSource(this.playlist.prev().value);
        this.play();

    };


    Object.defineProperties(this, {
            volume: {
                configurable: false,
                enumerable: false,
                // percent
                set: function (value) {
                    this.audioElement.volume = value;
                }
            },
            currentTime: {
                configurable: false,
                enumerable: false,
                get: function () {
                    return this.audioElement.currentTime;
                },
                // seconds
                set: function (value) {
                    l("duration:   " + this.duration);
                    this.audioElement.currentTime = this.duration * value;
                }
            },
            duration: {
                configurable: false,
                enumerable: false,
                get: function () {
                    return this.audioElement.duration;
                }
            },
            error: {
                configurable: false,
                enumerable: false,
                get: function () {
                    return this.audioElement.error;
                },
            },
        }
    );

    /* this.convertSeconds = totalSeconds => {
         const hours = parseInt(totalSeconds / 3600);
         const minutes = parseInt((totalSeconds - hours * 3600) / 60);
         const seconds = parseInt(totalSeconds - hours * 3600 - minutes * 60);
         return {
             'hours': hours,
             'minutes': minutes,
             'seconds': seconds
         };
     }

     this.setTime = (time, element) => {
         const currentTimeObj = this.convertSeconds(time);
         l(currentTimeObj)
         element.innerHTML =
             (currentTimeObj.hours ?
                 ((currentTimeObj.hours > 9) ? `${currentTimeObj.hours}:` : `0${currentTimeObj.hours}:`)
                 : '00:') +
             (currentTimeObj.minutes ?
                 ((currentTimeObj.minutes > 9) ? `${currentTimeObj.minutes}:` : `0${currentTimeObj.minutes}:`)
                 : '00:') +
             (currentTimeObj.seconds ?
                 ((currentTimeObj.seconds > 9) ? `${currentTimeObj.seconds}` : `0${currentTimeObj.seconds}`)
                 : '00');
     };

     this.watchCurrentTime = (time, element) => {
         l(time);
         setInterval(() => {
             this.setTime(time, element);
         }, 500);


     }
 */
    /* this.setCurrentTime = seconds => this.audioElement.currentTime = seconds;

     this.setVolume = (value) =>  = value;

     this.seekTo = (seconds) => this.audioElement.currentTime = seconds;

     this.getDuration = () => this.audioElement.duration;

     this.getCurrentTime = () => this.audioElement.currentTime;

 */
}

const params = [
    '#audio-element',
    '#visualizer__wrapper',
    '#audio-player__playlist',
    '#progress-bar__audio',
    '#audio-player-volume-slider__handle',
    '#audio-player-time__current',
    '#audio-player-time__duration'
]


let player1 = new AudioPlayer(...params);
for (const t of player1.playlist) {
    l(t)
}
/*
setTimeout(() => {
    player1['volume'] = 0.1;
    l("duration: " + player1.duration);
    player1.currentTime = 0.5

}, 5000)*/

$('#audio-player__play-btn').on('click', e => {
    player1.play();
});

$('#audio-player__next-btn').on('click', e => {
    player1.playNext();
});


$('#audio-player__prev-btn').on('click', e => {
    player1.playPrev();
});


$('#audio-player__playlist-btn').on('click', e => {
});
