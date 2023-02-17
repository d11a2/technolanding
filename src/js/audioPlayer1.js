const playlist = {

    urlArray: null,

    currentIndex: 0,

    playlistHtmlElement: null,

    init: function () {

        this.urlArray = ['./sounds/M.philips - Metheor.flac',
            './sounds/Namesis - Rush Machine.flac', './sounds/Black Mineral.wav'],
            this.playlistHtmlElement = $('#audio-player__playlist')[0];
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
            $(this.playlistHtmlElement).append(
                `<li class = '${className}'> ${(index + 1) + '. ' + item}</li>`
            );
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
    isVisible: true,
    isPlaying: false,

    canvas: null,
    canvasContext: null,

    drawVisual: null,

    init: function () {

        this.playlist = playlist.init();
        this.controls = $('#audio-player__controls')[0];

        this.context = new (AudioContext || webkitAudioContext)();
        this.volumeNode = this.context.createGain();
        this.destination = this.context.destination;
        this.analyserNode = this.context.createAnalyser();

        this.audioElement = $('#audio-element')[0];

        this.sourceNode = this.context.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.volumeNode);
        this.volumeNode.connect(this.analyserNode);
        this.analyserNode.connect(this.destination);
        this.canvas = $(".visualizer")[0];
        this.canvasContext = this.canvas.getContext("2d");
        this.visualize();

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

    visualize: function () {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;
        this.analyserNode.fftSize = 128;
        const bufferLength = this.analyserNode.frequencyBinCount;

        console.log('bufferLength:',bufferLength);

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
    }

}

let player1 = new AudioPlayer(s1,s2,s3,s4);
player1.setTrackSource(player.playlist.next());

$('#audio-player__play-btn').on('click', e => {
    if (audioPlayer.isPaused()) {
        audioPlayer.play();
        setTimeout(audioPlayer.hideControls(), 10000);

    } else {
        audioPlayer.stop();
    }
});

$('#audio-player__prev-btn').on('click', e => {
    audioPlayer.playPrevious();
});

$('#audio-player__next-btn').on('click', e => {
    audioPlayer.playNext();
});

$('#audio-player__playlist-btn').on('click', e => {
    audioPlayer.playlist.displayOrHidePlayList();
});