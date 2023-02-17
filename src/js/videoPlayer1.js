/*

var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
*/

let player;

const progressBar = $('#progress-bar');
const progressBarHandle = $('#progress-bar__handle');

const volumeSlider = $('#volume-slider');
const volumeSliderHandle = $('#volume-slider__handle');


function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
        height: '315',
        width: '560',
        videoId: 'IVAWy1s7RGQ',
        playerVars: {
            'autoplay': 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

var done = false;

function onPlayerReady(e) {
    console.log('onPlayerReady')

    cuePlaylist(['IVAWy1s7RGQ', 'n2-mEHiHoYY'], 0)
    setVolume(100);

}

function onPlayerStateChange(e) {
    console.log('onPlayerStateChange');
    if (e.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 5000);
        console.log('PLAYING');
        done = true;
    }
}

function playVideo() {
    player.playVideo();
}

function stopVideo() {
    player.stopVideo();
}

function pauseVideo() {
    player.pauseVideo();
}

function cuePlaylist(playlist) {
    player.cuePlaylist(playlist);
}

function loadVideoById(id) {
    player.loadVideoById(id, 0, "large");
}

function nextVideo() {
    player.nextVideo();
}

function previousVideo() {
    player.previousVideo();
}

function playVideoAt(index) {
    player.playVideoAt(index);
}

function getDuration() {
    return player.getDuration();
}

function getCurrentTime() {
    return player.getCurrentTime();
}

function setCurrentTime(seconds) {
    return player.setCurrentTime(seconds);
}

function convertSeconds(totalSeconds) {
    const hours = parseInt(totalSeconds / 3600);
    const minutes = parseInt((totalSeconds - hours * 3600) / 60);
    const seconds = parseInt(totalSeconds - hours * 3600 - minutes * 60);
    return {
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function getCurrentTime() {
    return convertSeconds(getCurrentTime());
}

function getTotalTime() {
    return convertSeconds(getDuration());
}


function seekTo(seconds, allowSeekAhead) {
    player.seekTo(seconds, allowSeekAhead);
}

function setVolume(number) {
    player.setVolume(number);
}

function calcTimeOffset(offset) {
    const offsetPercent = offset / (parseFloat(progressBar.css('width')) - parseFloat(progressBarHandle.css('width')));
    const timeOffset = parseInt(offsetPercent * getDuration());
    return timeOffset;
}

function calcVolumeOffset(offset) {
    const offsetPercent = offset / (parseFloat(volumeSlider.css('width')) - parseFloat(volumeSliderHandle.css('width')));
    const volumeOffset = parseInt(offsetPercent * 100);
    return volumeOffset;
}

function listenBar(e) {

    const controlType = e.data.type;

    const target = $(e.target);
    const parent = target.parent();

    const targetWidth = parseInt(target.css('width'));
    const parentWidth = parseFloat(parent.css('width'));
    const objectOffsetLeft = parent.offset().left;
    const shiftX = e.pageX - target.offset().left;
    let offset = 0;

    function moveAt(e) {

        const target = $(e.target);
        offset = e.pageX - objectOffsetLeft - shiftX;

        if (offset < 0) {
            offset = 0;
        } else if (offset >= parentWidth - targetWidth) {
            offset = parentWidth - targetWidth;
        }

        target.css('left', offset);

        if (controlType === 'video') {
            seekTo(calcTimeOffset(offset), false);
        } else if (controlType === 'audio') {
            setVolume(calcVolumeOffset(offset));
        }
    }

    target.on('mousemove', moveAt);

    $(document).on('mouseup', e => {

        if (controlType === 'video') {
            seekTo(calcTimeOffset(offset), true);
        } else if (controlType === 'audio') {
            setVolume(calcVolumeOffset(offset));
        }

        target.off('mousemove', moveAt);
        $(document).off('mouseup');
    });

}

progressBarHandle.on('mousedown', {type: 'video'}, listenBar);
volumeSliderHandle.on('mousedown', {type: 'audio'}, listenBar);