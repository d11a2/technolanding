let player;
let videoPlayer;

const params1 = [
    '#video-player-progress-bar__handle',
    '#video-player-slider__handle',
    '#video-player-time__current',
    '#video-player-time__duration'
]

onYouTubeIframeAPIReady = () => {
    player = new YT.Player('video-player', {
        height: '315',
        width: '560',
        videoId: 'IVAWy1s7RGQ',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
};

onPlayerReady = (e) => {
    console.log('onPlayerReady')
    videoPlayer = new VideoPlayer(...params1)
    //this.player.cuePlaylist(['IVAWy1s7RGQ', 'n2-mEHiHoYY'], 0)
    player.setVolume(100);
};

onPlayerStateChange = (e) => {

    if (e.data == -1) {
        console.log('state: unstarted');
    }
    if (e.data == YT.PlayerState.PAUSED) {
        console.log('state: paused');
    }
    if (e.data == YT.PlayerState.ENDED) {
        console.log('state: ended');
    }
    if (e.data == YT.PlayerState.BUFFERING) {
        console.log('state: buffering');
    }
    if (e.data == YT.PlayerState.PLAYING) {
        console.log('state: playing');
    } else if (e.data == YT.PlayerState.CUED) {
        console.log('state: cued');
    }
};

function VideoPlayer(
    progressElementSelector,
    volumeElementSelector,
    currentTimeElementSelector,
    durationElementSelector) {

    const progressElement = document.querySelector(progressElementSelector);
    const volumeElement = document.querySelector(volumeElementSelector);

    this.progressController = new SliderController(progressElement, this, 'currentTime');
    this.volumeController = new SliderController(volumeElement, this, 'volume');

    this.currentTimeElement = document.querySelector(currentTimeElementSelector);
    this.durationElement = document.querySelector(durationElementSelector);

    this.isPlaying = false;

    Object.defineProperties(this, {
            volume: {
                configurable: false,
                enumerable: false,
                // 1 - 100
                set: function (value) {
                    player.setVolume(value * 100);
                }
            },
            currentTime: {
                configurable: false,
                enumerable: false,
                get: function () {
                    return player.getCurrentTime();
                },
                // seconds
                set: function (value) {
                    player.seekTo(this.duration * value);
                }
            },
            duration: {
                configurable: false,
                enumerable: false,
                get: function () {
                    return player.getDuration();
                }
            },
        }
    );

    this.playVideo = () => {
        if (this.isPlaying) {
            player.pauseVideo();
            this.isPlaying = false;
        } else {
            player.playVideo();
            SliderController.watchCurrentTime(this);
            this.isPlaying = true;
        }
    };
}

const playBtn = document.querySelector('#video-controls__play-button');
playBtn.onclick = () => videoPlayer.playVideo();
