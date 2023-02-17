const lock = $('#doorLock');

const leftDoorItems = $('.door-left__item');
const leftDoorLastItem = $('.door-left__item:last-child');
const rightDoorItems = $('.door-right__item');
const rightDoorLastItem = $('.door-right__item:last-child');
const rightDoorFirstItem = $('.door-right__item:first-child');

leftDoorItems.on('animationstart', {arg: 'left'}, listener);
leftDoorItems.on('animationend', {arg: 'left'}, listener);

rightDoorItems.on('animationstart', {arg: 'right'}, listener);
rightDoorItems.on('animationend', {arg: 'right'}, listener);

function listener(e) {

    const arg = e.data.arg;

    switch (e.type) {
        case 'animationstart':
            console.log('animationstart')

            break;
        case 'animationend':
            console.log('animationend')

            if (arg === 'left') {
                if (leftDoorLastItem.hasClass(`door-${arg}__item--open`)) {
                    leftDoorItems.removeClass(`door-${arg}__item--closed`);
                    leftDoorItems.addClass(`door-${arg}__item--opened`);
                } else {
                    leftDoorItems.removeClass(`door-${arg}__item--opened`)
                    leftDoorItems.addClass(`door-${arg}__item--closed`)
                }
            } else {
                if (rightDoorLastItem.hasClass(`door-${arg}__item--open`)) {
                    rightDoorItems.removeClass(`door-${arg}__item--closed`);
                    rightDoorItems.addClass(`door-${arg}__item--opened`);
                } else {
                    rightDoorItems.removeClass(`door-${arg}__item--opened`)
                    rightDoorItems.addClass(`door-${arg}__item--closed`);
                    doCrossLockContainerAnimationReverse();
                }
            }


            break;
    }
};

function doDoorAnimation() {
    if (leftDoorLastItem.hasClass(`door-left__item--opened`)) {

        leftDoorItems.removeClass(`door-left__item--open`);
        leftDoorItems.addClass(`door-left__item--close`);

        rightDoorItems.removeClass(`door-right__item--open`);
        rightDoorItems.addClass(`door-right__item--close`);
    } else {
        leftDoorItems.removeClass(`door-left__item--close`);
        leftDoorItems.addClass(`door-left__item--open`);

        rightDoorItems.removeClass(`door-right__item--close`);
        rightDoorItems.addClass(`door-right__item--open`);
    }
}

