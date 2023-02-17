const videoControls = {

    controls: $('.video-controls'),
    spin: $('.video-controls__spinning-container'),
    btn: $('.video-controls__play-button'),
    bar: $('#video-controls__bar'),
    elements: $('#video-controls__elements'),
    cells: $('.video-controls__cell-container'),

    init: function () {

        this.btn.on('click', e => {
            if (this.bar.hasClass('video-controls__plank--stretch')) {
                this.bar.removeClass('video-controls__plank--stretch');
                this.elements.removeClass('video-controls__plank--stretch');
                this.spin.removeClass('video-controls__spinning-container--rotate');
            } else {
                this.bar.addClass('video-controls__plank--stretch');
                this.elements.addClass('video-controls__plank--stretch');
                this.spin.addClass('video-controls__spinning-container--rotate');

                this.bar.addClass('video-controls__plank--init');
            }
            if (this.cells.hasClass('video-controls__cell-container--opened')) {
                this.cells.removeClass('video-controls__cell-container--opened')
            } else {
                this.cells.addClass('video-controls__cell-container--opened')
            }
        });

        this.bar.on('transitionend', e => {
            if (this.bar.hasClass('video-controls__plank--stretch')) {
                console.log('bar transitionend')
                this.bar.addClass('video-controls__plank--init');
                // this.bar.addClass('video-controls__plank--initialized');
            }
        });
        this.bar.on('animationend', e => {

        });
    },

    destroy: function () {
        this.controls.off('click', btn);
    },

};
videoControls.init();
