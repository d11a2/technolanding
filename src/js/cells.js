const cells = {

    init: function () {
        const openButton = $('.cells__open');
        const cellCols = $('.cell-col');
        console.log(cellCols.length + " cellCols");

        const leftCols = cellCols.slice(0, parseInt(cellCols.length / 2));
        const leftLastCol = $(leftCols[leftCols.length - 1]);
        const leftFirstCol = $(leftCols[0]);

        const rightCols = cellCols.slice(parseInt(cellCols.length / 2), cellCols.length);
        const rightLastCol = $(rightCols[rightCols.length - 1]);
        const rightFirstCol = $(rightCols[0]);

        const leftColHiddenClass = 'cell-col--hidden-left';
        const rightColHiddenClass = 'cell-col--hidden-right';

        let leftCounter = 0;
        let rightCounter = 0;

        let isOpen = false;

        const isBlocked = () => {
            return ((leftCounter + rightCounter) < cellCols.length) &&
                (leftCounter + rightCounter) != 0;
        };

        function checkCells() {
            if ((leftCounter + rightCounter) == cellCols.length) {
                isOpen = true;
            } else {
                isOpen = false;
            }
        }

        openButton.on('click', e => {

            if (!isOpen) {
                if (isBlocked()) {
                    console.log('Button is blocked')
                } else {
                    checkCells();

                    if (isOpen) {
                        showLeftCol(leftFirstCol);
                        showRightCol(rightLastCol);
                    } else {
                        hideLeftCol(leftLastCol);
                        hideRightCol(rightFirstCol);
                    }
                }

              //  isOpen = true;
            } else {

                isOpen = false;
            }

        });

        function hideLeftCol(elem) {
            elem.addClass(leftColHiddenClass);
        }

        function hideRightCol(elem) {
            elem.addClass(rightColHiddenClass);
        }

        function showLeftCol(elem) {
            elem.removeClass(leftColHiddenClass);
        }

        function showRightCol(elem) {
            elem.removeClass(rightColHiddenClass);
        }


        leftCols.on('transitionend', e => {

            const target = $(e.target);

            if (isOpen) {
                showLeftCol(target.next());
                leftCounter--;
            } else {
                hideLeftCol(target.prev());
                leftCounter++;
            }
        });

        rightCols.on('transitionend', e => {

            const target = $(e.target);

            if (isOpen) {
                showRightCol(target.prev());
                rightCounter--;
            } else {
                hideRightCol(target.next());
                rightCounter++;
            }
        });


        const leftColCount = leftCols.length;
        const colCount = cellCols.length;
        const ColHeight = $('.cell-col:first-child').find('.cell').length;

        console.log("colCount = " + colCount);
        console.log("leftColCount = " + leftColCount);
        console.log("ColHeight = " + ColHeight);


    },

    getCellByIndex: function (i, j) {
        return cell = $(`.cell-col:nth-child(${i})`)
            .find(`.cell:nth-child(${j})`)
        //  .css('background-color', 'black');
    },

    shiftCell: function (i, j, direction) {
        this.getCellByIndex(i, j).addClass(`cell--shifted-${direction}`);
    },
    shiftLeftTop: function (i, j) {
        console.log('shiftLeftTop 2')

        let k = j;
        if (i == cells.baseIndexI && j == cells.baseIndexJ) {
            // this.shiftCell(i, j, direction.top);
        }

        for (let n = i; n < cells.baseIndexI; n++) {
            console.log(n)

            if (j === cells.baseIndexJ) {
                if (n > 0) {
                    this.shiftCell(n, j, direction.left);
                    this.shiftCell(2 * cells.baseIndexI - n, j, direction.right);
                }
            } else if (n === cells.baseIndexI) {
                this.shiftCell(n, j, direction.top);
                this.shiftCell(n, j, direction.bottom);
            } else {
                if (n > 0) {
                    this.shiftCell(n, j, direction.leftTop);
                    this.shiftCell(n, k, direction.leftBottom);

                    this.shiftCell(2 * cells.baseIndexI - n, j, direction.rightTop);
                    this.shiftCell(2 * cells.baseIndexI - n, k, direction.rightBottom);
                }
            }
            this.shiftCell(cells.baseIndexI, j, direction.top);
            this.shiftCell(cells.baseIndexI, cells.baseIndexJ + 1, direction.bottom);
            if (n % 2 === 0) {
                j--;
                console.log(cells.baseIndexJ + 1);
            } else {
                k++;
            }
        }
    },

    shiftReverse: function (i, j) {

    }


};

const direction = {
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    leftTop: 'left-top',
    leftBottom: 'left-bottom',
    right: 'right',
    rightTop: 'right-top',
    rightBottom: 'right-bottom'
}

cells.init();
