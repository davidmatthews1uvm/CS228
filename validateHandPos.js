let period = 1000/1.5;

function HandIsTooFarToTheLeft() {
    xValues = oneFrameOfData.slice([], [], [0,6,3]);
    currentMeanX = xValues.mean();
    return currentMeanX < 0.25;
}

function HandIsTooFarToTheRight() {
    xValues = oneFrameOfData.slice([], [], [0,6,3]);
    currentMeanX = xValues.mean();
    return currentMeanX > 0.75;
}
function HandIsTooFarToTheTop() {
    yValues = oneFrameOfData.slice([], [], [1,6,3]);
    currentMeanY = yValues.mean();
    return currentMeanY > 0.75;
}

function HandIsTooFarToTheBottom() {
    yValues = oneFrameOfData.slice([], [], [1,6,3]);
    currentMeanY = yValues.mean();
    return currentMeanY < 0.25;
}
function HandIsTooFarToTheScreen() {
    zValues = oneFrameOfData.slice([], [], [2,6,3]);
    currentMeanZ = zValues.mean();
    return currentMeanZ < 0.25;
}

function HandIsTooFarFromTheScreen() {
    zValues = oneFrameOfData.slice([], [], [2,6,3]);
    currentMeanZ = zValues.mean();
    return currentMeanZ > 0.75;
}


function DrawArrowRight() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    var imgSize = window.innerHeight/16;
    rotate_and_draw_image(arrowImg, 30 * x_grid - imgSize/2 - len,
                            32*y_grid , imgSize, imgSize, 0)
    rotate_and_draw_image(handImg , 30 * x_grid - imgSize/2 - len,
                            32*y_grid - imgSize, imgSize, imgSize,0)

    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandLeftImg.width/moveHandLeftImg.height);
    rotate_and_draw_image(moveHandLeftImg, img_x, img_y, draw_width, draw_height , 0);
}

function DrawArrowLeft() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, len, 32*y_grid, imgSize, imgSize, 180)
    rotate_and_draw_image(handImg , len, 32*y_grid - imgSize, imgSize, imgSize, 0)


    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandRightImg.width/moveHandRightImg.height);
    rotate_and_draw_image(moveHandRightImg, img_x, img_y, draw_width, draw_height , 0);
}

function DrawArrowUp() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, window.innerWidth/4,
                                    58*y_grid - len,
                                     imgSize, imgSize, 90)
    rotate_and_draw_image(handImg , window.innerWidth/4 - imgSize, 58*y_grid  - len, imgSize, imgSize, 0)
    
    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandUpImg.width/moveHandUpImg.height);
    rotate_and_draw_image(moveHandUpImg, img_x, img_y, draw_width, draw_height , 0);
}

function DrawArrowDown() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, window.innerWidth/4, 9*y_grid + len, imgSize, imgSize, 270)
    rotate_and_draw_image(handImg , window.innerWidth/4 - imgSize, 9*y_grid+len, imgSize, imgSize, 0)

    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandDownImg.width/moveHandDownImg.height);
    rotate_and_draw_image(moveHandDownImg, img_x, img_y, draw_width, draw_height , 0);
}

function DrawArrowIn() {
    let millisecond = millis();
    let len = 40 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    let handSize = imgSize*2+len
    rotate_and_draw_image(arrowImg, window.innerWidth/4 - 4 * imgSize/2, window.innerHeight/4 - imgSize/2, imgSize, imgSize, 90)
    rotate_and_draw_image(handImg , window.innerWidth/4 - handSize/2, window.innerHeight/4 - handSize/2, handSize, handSize, 0)

    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandTowardImg.width/moveHandTowardImg.height);
    rotate_and_draw_image(moveHandTowardImg, img_x, img_y, draw_width, draw_height , 0);
}

function DrawArrowOut() {
    let millisecond = millis();
    let len = 40 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    let handSize = (imgSize*2+len)/2
    rotate_and_draw_image(arrowImg, window.innerWidth/4 - 4 * imgSize/2, window.innerHeight/4 - imgSize/2, imgSize, imgSize, 270)
    rotate_and_draw_image(handImg , window.innerWidth/4 - handSize/2, window.innerHeight/4 - handSize/2, handSize, handSize, 0)
    
    img_x = 33 *  x_grid;
    img_y = 32 * y_grid;
    draw_height = img_y;
    draw_width = draw_height * (moveHandAwayImg.width/moveHandAwayImg.height);
    rotate_and_draw_image(moveHandAwayImg, img_x, img_y, draw_width, draw_height , 0);
}