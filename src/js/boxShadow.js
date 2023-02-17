/* offset-x | offset-y | blur-radius | spread-radius | color */
function increaseSpreadRadius(selector, spreadRadius) {
    currentBoxShadow = $(selector).css("box-shadow")

    const splitStr = currentBoxShadow.split("px");

    if (currentBoxShadow.lastIndexOf("inset") !== 1) {
        splitStr[splitStr.length - 2] = " " + spreadRadius;
    } else {
        splitStr[splitStr.length - 1] = " " + spreadRadius;
    }
    return splitStr.join("px");
}

//  increaseSpreadRadius(".techno-title", 20)