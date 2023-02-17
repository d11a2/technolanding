class SliderController {

    constructor(element, player, property) {

        this.player = player;
        this.property = property;
        this.element = element;
        this.parent = element.parentNode;

        this.element.onmouseover = () => {
            this.element.onmousedown = this.onmousedownHandler.bind(this);
            this.element.style.backgroundColor = 'red';
        }

        this.element.onmouseout = () => {
            this.element.onmousedown = null;
            document.onmousemove = null;

            this.element.style.backgroundColor = 'black';
        }
        console.log('constructor')
    }

    onmousedownHandler(event) {

        ondragstart = function () {
            return false;
        }

        const shiftX = event.clientX - this.element.getBoundingClientRect().left;
        const parentX = this.parent.getBoundingClientRect().left;

        const moveAt = pageX => {

            const elementWidth = this.element.getBoundingClientRect().width
            const parentWidth = this.parent.getBoundingClientRect().width;

            const percent = (pageX - shiftX - parentX) / (parentWidth);

            let propertyPercent = (pageX - shiftX - parentX) / (parentWidth - elementWidth);

            if (0 <= propertyPercent && propertyPercent <= 1) {
                this.position = percent;
                this.player[this.property] = propertyPercent > 1 ? 1 : propertyPercent;
            } else {
                this.element.onmouseup();
                return;
            }
        };

        function onMouseMove(event) {
            moveAt(event.pageX);
        }

        document.onmousemove = onMouseMove;

        this.element.onmouseup = function () {
            document.onmousemove = null;
        };
    };

    set position(percent) {
        this.element.style.left = percent * 100 + '%';
    };

    static convertSeconds = totalSeconds => {

        const hours = parseInt(totalSeconds / 3600);
        const minutes = parseInt((totalSeconds - hours * 3600) / 60);
        const seconds = parseInt(totalSeconds - hours * 3600 - minutes * 60);
        return {
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    static setTime = (seconds, element) => {
        const currentTimeObj = SliderController.convertSeconds(seconds);

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

    static interval = null;

    static watchCurrentTime = player => {

        clearInterval(SliderController.interval);

        SliderController.interval = setInterval(function () {
            SliderController.setTime(player.currentTime, player.currentTimeElement);
            SliderController.setTime(player.duration, player.durationElement);

        }, 500);
    };
};
