const plankLeftTop = $('.plank-left-top');
const plankLeftBottom = $('.plank-left-bottom');
const plankRightTop = $('.plank-right-top');
const plankRightBottom = $('.plank-right-bottom');

const crossLockContainer = $('.cross-lock__container');

plankLeftTop.on('animationstart', {arg: 'left'}, listener);
plankLeftTop.on('animationend', {arg: 'left'}, listener);
plankLeftBottom.on('animationstart', {arg: 'left'}, listener);
plankLeftBottom.on('animationend', {arg: 'left'}, listener);

plankRightTop.on('animationstart', {arg: 'right'}, listener);
plankRightTop.on('animationend', {arg: 'right'}, listener);
plankRightBottom.on('animationstart', {arg: 'right'}, listener);
plankRightBottom.on('animationend', {arg: 'right'}, listener);

crossLockContainer.on('animationend', e => {
    if (crossLockContainer.hasClass('cross-lock__container--animate--reverse')
        && plankLeftTop.hasClass('plank--animated')) {
        doCrossLockAnimation();
    }
});


let isBlocked = false;

function listener(e) {

    const target = $(e.target);
    const arg = e.data.arg;
    const plankBottom = $(`.plank-${arg}-bottom`);

    switch (e.type) {
        case 'animationstart':

            break;

        case 'animationend':

            if (target.hasClass(`plank-${arg}-top`)) {
                if (plankBottom.hasClass(`plank--animated`)) {

                    target.removeClass('plank--animated');
                    target.removeClass(`plank-${arg}-top--animate--reverse`);

                    plankBottom.addClass(`plank-${arg}-bottom--animate--reverse`);
                } else {
                    target.addClass('plank--animated');
                    target.removeClass(`plank-${arg}-top--animate`);

                    plankBottom.addClass(`plank-${arg}-bottom--animate`);
                }
            } else if (target.hasClass(`plank-${arg}-bottom`)) {
                if (target.hasClass(`plank--animated`)) {

                    target.removeClass('plank--animated');
                    target.removeClass(`plank-${arg}-bottom--animate--reverse`);

                    isBlocked = false;
                } else {
                    target.addClass('plank--animated');
                    target.removeClass(`plank-${arg}-bottom--animate`);

                    doCrossLockContainerAnimation();
                    doDoorAnimation();

                    isBlocked = false;
                }
            }
            break;
    }
}

function doCrossLockContainerAnimation() {
    crossLockContainer.addClass('cross-lock__container--animate');
    crossLockContainer.removeClass('cross-lock__container--animate--reverse');
    crossLockContainer.addClass('cross-lock__container--animated');
}


function doCrossLockContainerAnimationReverse() {
    crossLockContainer.removeClass('cross-lock__container--animate');
    crossLockContainer.addClass('cross-lock__container--animate--reverse');
    crossLockContainer.removeClass('cross-lock__container--animated');
}


function doCrossLockAnimation() {
    if (!isBlocked) {
        if (plankLeftBottom.hasClass('plank--animated')) {

            isBlocked = true;

            plankLeftTop.addClass('plank-left-top--animate--reverse');
            plankRightTop.addClass('plank-right-top--animate--reverse');

        } else if (!plankLeftBottom.hasClass('plank--animated')) {

            isBlocked = true;

            plankLeftTop.addClass('plank-left-top--animate');
            plankRightTop.addClass('plank-right-top--animate');
        }
    }
}

lock.on('click', () => {
    if (!isBlocked) {
        if (rightDoorItems.hasClass(`door-right__item--closed`)) {
            doCrossLockAnimation()
        } else if (crossLockContainer.hasClass('cross-lock__container--animated')) {
            doDoorAnimation()
        }
    }
});