'use strict';

const l = str => console.log(str);

/*

const playlist = {

    urlArray: null,

    currentIndex: 0,

    playlistHtmlElement: null,

    init: function () {

        this.urlArray = ['./sounds/M.philips - Metheor.flac', './sounds/Namesis - Rush Machine.flac', './sounds/Black Mineral.wav'], this.playlistHtmlElement = $('#audio-player__playlist')[0];
        this.appendToUlTag();

        return this;
    },

    getPlaylist: function () {
        return this;
    },

    getTrackName: function (index) {
        const str = this.urlArray[index];
        return str.slice(str.lastIndexOf('/') + 1, str.lastIndexOf('.'))
    },

    getAllTrackNames: function () {
        const list = [];
        this.urlArray.forEach((value) => {
            list.push(value.slice(value.lastIndexOf('/') + 1, value.lastIndexOf('.')))
        });
        return list;
    },

    appendToUlTag: function () {
        const className = 'audio-player__playlist-item';
        this.getAllTrackNames().forEach((item, index) => {
            $(this.playlistHtmlElement).append(`<li class = '${className}'> ${(index + 1) + '. ' + item}</li>`);
        });
    },

    displayOrHidePlayList: function () {
        $(this.playlistHtmlElement).toggleClass('audio-player__playlist--visible');
    },

    getCurrentItem: function () {
        return this.urlArray[this.currentIndex]
    },

    getUrlArray: function () {
        return this.urlArray;
    },

    getFirst: function () {
        if (this.urlArray.length !== 0) {
            return this.urlArray[0];
        } else {
            return null;
        }
    },

    getNext: function () {
        if (this.currentIndex + 1 < this.urlArray.length) {
            this.currentIndex += 1;
        }
        return this.urlArray[this.currentIndex];
    },

    getPrevious: function () {
        if (this.currentIndex !== 0) {
            this.currentIndex -= 1;
        }
        return this.urlArray[this.currentIndex];
    },

    getItemByIndex: function (index) {
        if (this.urlArray[index] === undefined) {
            return null;
        } else {
            return this.urlArray[index];
        }
    }


};

*/

function AudioPlayer(audioElementSelector, controlsElementSelector, canvasElementSelector, playlistElementSelector) {
    this.audioElement = document.querySelector(audioElementSelector);
    this.controls = document.querySelector(controlsElementSelector);
    this.canvasElement = document.querySelector(canvasElementSelector);
    this.playlistElement = document.querySelector(playlistElementSelector);
    this.isPlaying = false;
    this.isLoaded = false;
    /* Object.defineProperty(this, "isPlaying", {
     get() {
         if (!this.isPlaying) {
             this.isPlaying = false;
         }
         return this.isPlaying;

     }
   });*/

    this.createAudioContext = () => new Promise((resolve, reject) => {
        try {
            const context = new (AudioContext || webkitAudioContext)();
            const volumeNode = context.createGain();
            const destination = context.destination;
            const analyserNode = context.createAnalyser();
            const sourceNode = context.createMediaElementSource(this.audioElement);
            sourceNode.connect(volumeNode);
            volumeNode.connect(analyserNode);
            analyserNode.connect(destination);
            l('createAudioContext done')
            l('audioElement ' + audioElementSelector + ' ' + this.audioElement.width)

            this.isLoaded = true;
            resolve(analyserNode);
        } catch (e) {
            console.log(e.message);
            reject(e)
        }
    });

    this.canvasObject = {
        context: this.canvasElement.getContext("2d"),
        WIDTH: this.canvasElement.width,
        HEIGHT: this.canvasElement.height,
        barGap: 1,
        player: this,

        setAnalyserNode(value) {
            this.analyserNode = value;
        },
        /*get analyserNode() {
            return this.analyserNode;
        },*/

        visualize() {

            this.analyserNode.fftSize = 128;
            const bufferLength = this.analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            console.log('bufferLength:', bufferLength);

            this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);

            const width = this.WIDTH - this.barGap * bufferLength * 2;
            const barWidth = Math.floor((width / bufferLength) / 2);
            let drawVisual;

            const draw = function () {
                drawVisual = requestAnimationFrame(draw);
                let barHeight;
                //   l('isPlaying' + this.player.isPlaying)
                try {
                    this.analyserNode.getByteFrequencyData(dataArray);
                    this.context.fillStyle = 'rgb(0, 0, 0)';
                    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                    //   console.log('(width / bufferLength) ' + bufferLength)

                    //    console.log("max: " + Math.max(...dataArray) + " barWidth " + barWidth)
                    let xr = this.WIDTH / 2;
                    let xl = this.WIDTH / 2;
                    for (let i = 1; i < bufferLength; i++) {
                        barHeight = dataArray[i] / 2;

                        this.context.fillStyle = `rgb( 
                    ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                        this.context.fillRect(xr, this.HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                        xr += barWidth + this.barGap;

                        this.context.fillStyle = `rgb( 
                    ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                        this.context.fillRect(xl, this.HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                        xl -= barWidth + this.barGap;
                    }
                    //  l('drow')
                    //setTimeout(() => cancelAnimationFrame(drawVisual), 3000);

                    if (!this.player.isPlaying) {
                        cancelAnimationFrame(drawVisual);
                    }
                } catch (e) {
                    cancelAnimationFrame(drawVisual);
                    console.error(e);
                }
            }.bind(this);
            draw();

        }
    };

    this.playlist = {
        playlistElement: this.playlistElement,
        tracks: ['./sounds/M.philips - Metheor.flac', './sounds/Namesis - Rush Machine.flac', './sounds/Black Mineral.wav'],
        current: 0,

        [Symbol.iterator]() {
            this.current = 0;
            return this;
        },
        next() {
            l("next:" + this.current)
            if (this.current < this.tracks.length) {
                return {done: false, value: this.tracks[this.current++]};
            }
            this.current = 0;
            return {done: true, value: null};
        },

        prev() {
            l("prev:" + this.current)
            if (this.current > 0) {
                return {done: false, value: this.tracks[--this.current]};
            }
            this.current = this.tracks.length - 1;
            return {done: true, value: null};
        },

    };

    this.setTrackSource = value => this.audioElement.setAttribute('src', value);

    this.play = () => {
        if (this.isLoaded) {
            if (this.isPlaying) {
                this.audioElement.pause();
                this.isPlaying = false;

            } else {
                this.audioElement.play();
                this.isPlaying = true;
                this.canvasObject.visualize();
            }
        } else {
            this.setTrackSource(this.playlist.next().value);
            // l(this.playlist.next());
            this.createAudioContext().then(analyserNode => {
                this.canvasObject.setAnalyserNode(analyserNode);
                this.isLoaded = true;
                this.play();
            });
        }
    };

    this.playNext = () => {
       // this.isLoaded = false;


        this.setTrackSource(this.playlist.next().value);
        //  l(this.playlist.next());
        // this.createAudioContext().then(analyserNode => {
        //   this.canvasObject.setAnalyserNode(analyserNode);
        //   this.isLoaded = true;
       this.audioElement.play();
                this.isPlaying = true;
                this.canvasObject.visualize();
    };


}

/*

const audioPlayer = {
    audioElement: null,
    context: null,
    volumeNode: null,
    destination: null,
    sourceNode: null,
    analyserNode: null,
    isLooped: false,

    isReady: false,
    isFirstPlayback: true,
    playlist: null,
    playlistHtmlElement: null,
    controls: null,
    //isVisible: true,
    isPlaying: false,

    canvas: null,
    canvasContext: null,

    drawVisual: null,

    createContext() {


        return this;
    },

    setTrackUrlToAudioElement: function (url) {
        this.isReady = false;
        this.audioElement.setAttribute('src', url);
    },

    readyListener: function (e) {
        console.log('ready');
        this.isReady = true;
        this.play();
        $(this).off('canplay', this.readyListener);
    },

    play: function () {
        if (this.isFirstPlayback) {
            this.setTrackUrlToAudioElement(playlist.getCurrentItem());
            $(this.audioElement).on('canplay', this.readyListener);
            this.isFirstPlayback = false;
            this.isPlaying = true;
            listenTimeProgress();

        } else {
            this.audioElement.play();
            this.isPlaying = true;
            listenTimeProgress();
        }
    },

    playNext: function () {
        audioPlayer.setTrackUrlToAudioElement(playlist.getNext());
        $(this.audioElement).on('canplay', this.readyListener);
    },

    playPrevious: function () {
        audioPlayer.setTrackUrlToAudioElement(playlist.getPrevious());
        $(this.audioElement).on('canplay', this.readyListener);
    },

    stop: function () {
        this.audioElement.pause();
        this.isPlaying = false;
    },

    setCurrentTime(seconds) {
        this.audioElement.currentTime = seconds;
    },

    setVolumeValue(value) {
        this.volumeNode.gain.value = value;
    },

    seekTo: function (seconds) {
        this.audioElement.currentTime = seconds;
    },

    getDuration: function () {
        return this.audioElement.duration;
    },

    getCurrentTime: function () {
        return this.audioElement.currentTime;
    },

    isPaused: function () {
        return this.audioElement.paused;
    },

    isVisible: function () {
        return this.isVisible;
    },

    hideControls: function () {
        $(this.controls).removeClass('audio-player__controls--visible');
        return true;
    },

    displayControls: function () {
        $(this.controls).addClass('audio-player__controls--visible');
    },

    /!* visualize() {
         const WIDTH = this.canvas.width;
         const HEIGHT = this.canvas.height;
         this.analyserNode.fftSize = 128;
         const bufferLength = this.analyserNode.frequencyBinCount;

         console.log('bufferLength:', bufferLength);

         const dataArray = new Uint8Array(bufferLength);
         this.canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

         const barGap = 1;
         const width = WIDTH - barGap * bufferLength * 2;
         const barWidth = Math.floor((width / bufferLength) / 2);

         const draw = function () {
             try {
                 audioPlayer.drawVisual = requestAnimationFrame(draw);

                 audioPlayer.analyserNode.getByteFrequencyData(dataArray);
                 audioPlayer.canvasContext.fillStyle = 'rgb(0, 0, 0)';
                 audioPlayer.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

                 //   console.log('(width / bufferLength) ' + bufferLength)
                 let barHeight;
                 //    console.log("max: " + Math.max(...dataArray) + " barWidth " + barWidth)
                 let xr = WIDTH / 2;
                 let xl = WIDTH / 2;
                 for (let i = 1; i < bufferLength; i++) {
                     barHeight = dataArray[i] / 2;

                     audioPlayer.canvasContext.fillStyle = `rgb(
                     ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                     audioPlayer.canvasContext.fillRect(xr, HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                     xr += barWidth + barGap;

                     audioPlayer.canvasContext.fillStyle = `rgb(
                     ${(barHeight + 100)} ,${(barHeight + 700)},${(barHeight + 700)})`;
                     audioPlayer.canvasContext.fillRect(xl, HEIGHT / 2 - barHeight / 2, barWidth, barHeight);

                     xl -= barWidth + barGap;
                 }

             } catch (e) {
                 cancelAnimationFrame(audioPlayer.drawVisual);
                 console.error(e);
             }
         }

         draw(audioPlayer.analyserNode);
     }*!/

}
*/


let s1 = '#audio-element';
let s2 = '#audio-player__controls';
let s3 = '#visualizer';
let s4 = '#audio-player__playlist';

let player1 = new AudioPlayer(s1, s2, s3, s4);

for (const t of player1.playlist) {
    l(t)
}

//player1.setTrackSource(player1.playlist.next());


$('#audio-player__play-btn').on('click', e => {
    player1.play();

});

$('#audio-player__next-btn').on('click', e => {
    player1.playNext();
});

/*
$('#audio-player__prev-btn').on('click', e => {
    audioPlayer.playPrevious();
});



$('#audio-player__playlist-btn').on('click', e => {
    audioPlayer.playlist.displayOrHidePlayList();
});*/
