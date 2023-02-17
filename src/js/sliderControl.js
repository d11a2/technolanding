function SliderController(player, progressBar, progressBarHandle, volumeSlider, volumeSliderHandle) {

    this.player = player;
    this.progressBar = progressBar;//$('#audio-player__controls .progress-bar');
    this.progressBarHandle = progressBarHandle;  //$('#audio-player__controls .progress-bar__handle');

    this.volumeSlider = volumeSlider;
    //$('#audio-player__controls .volume-slider');
    this.volumeSliderHandle = volumeSliderHandle;//$('#audio-player__controls .volume-slider__handle');


    this.playVideoAt = function playVideoAt(index) {
        this.player.playVideoAt(index);
    }

    this.getDuration = function getDuration() {
        return this.player.getDuration();
    }

    this.getCurrentTime = function getCurrentTime() {
        return this.player.getCurrentTime();
    }

    this.setCurrentTime = function setCurrentTime(seconds) {
        return this.player.setCurrentTime(seconds);
    }

    this.convertSeconds = function convertSeconds(totalSeconds) {
        const hours = parseInt(totalSeconds / 3600);
        const minutes = parseInt((totalSeconds - hours * 3600) / 60);
        const seconds = parseInt(totalSeconds - hours * 3600 - minutes * 60);
        return {
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    this.getCurrentTime = function getCurrentTime() {
        return convertSeconds(this.player.getCurrentTime());
    }

    this.getTotalTime = function getTotalTime() {
        return convertSeconds(this.player.getDuration());
    }


    this.seekTo = function seekTo(seconds, allowSeekAhead) {
        this.player.seekTo(seconds, allowSeekAhead);
    }

    this.setVolume = function setVolume(number) {
        this.player.setVolumeValue(number);
    }

    this.calcTimeOffset = function calcTimeOffset(offset) {
        const offsetPercent = offset / (parseFloat(progressBar.css('width')) - parseFloat(progressBarHandle.css('width')));
        const timeOffset = parseInt(offsetPercent * this.getDuration());
        return timeOffset;
    }

    this.calcVolumeOffset = function calcVolumeOffset(offset) {
        const offsetPercent = offset / (parseFloat(this.volumeSlider.css('width')) - parseFloat(this.volumeSliderHandle.css('width')));
        const volumeOffset = offsetPercent;
        console.log(volumeOffset)
        return volumeOffset;
    }

    this.listenTimeProgress = function listenTimeProgress() {

        const parentWidth = parseFloat(this.progressBar.css('width'));
        const intervalId = setInterval(function () {

            if (this.player.isPlaying) {
                const left = parseInt(parentWidth * this.getTimeProgressPercent()) + '%';
                this.progressBarHandle.css('left', left);
            } else {
                clearInterval(intervalId);
            }
        }, 500)
    }

    this.getTimeProgressPercent = function getTimeProgressPercent() {
        return this.player.getCurrentTime() / this.player.getDuration();
    }

    this.listenBar = function listenBar(e) {

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

            if (controlType === 'time') {
                this.seekTo(calcTimeOffset(offset), false);
            } else if (controlType === 'volume') {
                this.setVolume(calcVolumeOffset(offset));
            }
        }

        target.on('mousemove', moveAt);

        $(document).on('mouseup', e => {

            if (controlType === 'time') {
                seekTo(calcTimeOffset(offset), true);
            } else if (controlType === 'volume') {
                setVolume(calcVolumeOffset(offset));
            }

            target.off('mousemove', moveAt);
            $(document).off('mouseup');
        });

    }

    progressBarHandle.on('mousedown', {type: 'time'}, listenBar);
    volumeSliderHandle.on('mousedown', {type: 'volume'}, listenBar);

}

let player = audioPlayer;
const progressBar = $('#audio-player__controls .progress-bar');
const progressBarHandle = $('#audio-player__controls .progress-bar__handle');

const volumeSlider = $('#audio-player__controls .volume-slider');
const volumeSliderHandle = $('#audio-player__controls .volume-slider__handle');


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
    return convertSeconds(player.getCurrentTime());
}

function getTotalTime() {
    return convertSeconds(player.getDuration());
}


function seekTo(seconds, allowSeekAhead) {
    player.seekTo(seconds, allowSeekAhead);
}

function setVolume(number) {
    player.setVolumeValue(number);
}

function calcTimeOffset(offset) {
    const offsetPercent = offset / (parseFloat(progressBar.css('width')) - parseFloat(progressBarHandle.css('width')));
    const timeOffset = parseInt(offsetPercent * getDuration());
    return timeOffset;
}

function calcVolumeOffset(offset) {
    const offsetPercent = offset / (parseFloat(volumeSlider.css('width')) - parseFloat(volumeSliderHandle.css('width')));
    const volumeOffset = offsetPercent;
    console.log(volumeOffset)
    return volumeOffset;
}

function listenTimeProgress() {

    const parentWidth = parseFloat(progressBar.css('width'));
    const intervalId = setInterval(function () {

        if (player.isPlaying) {
            const left = parseInt(parentWidth * getTimeProgressPercent()) + '%';
            progressBarHandle.css('left', left);
        } else {
            clearInterval(intervalId);
        }
    }, 500)
}

function getTimeProgressPercent() {
    return player.getCurrentTime() / player.getDuration();
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

        if (controlType === 'time') {
            seekTo(calcTimeOffset(offset), false);
        } else if (controlType === 'volume') {
            setVolume(calcVolumeOffset(offset));
        }
    }
    const boundedMoveAt = moveAt.bind(this);
    target.on('mousemove', boundedMoveAt);

    $(document).on('mouseup', e => {

        if (controlType === 'time') {
            seekTo(calcTimeOffset(offset), true);
        } else if (controlType === 'volume') {
            setVolume(calcVolumeOffset(offset));
        }

        target.off('mousemove', moveAt);
        $(document).off('mouseup');
    });

}

progressBarHandle.on('mousedown', {type: 'time'}, listenBar);
volumeSliderHandle.on('mousedown', {type: 'volume'}, listenBar);
