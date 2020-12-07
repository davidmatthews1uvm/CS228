var controllerOptions = {};
var currentDigit = getRandomInt(10);

var y_grid = window.innerHeight / 64;
var x_grid = window.innerWidth / 64;

/**
 * 0: no hands 
 * 1: paused
 * 2: normal play
 * 3: math mode
 */
var gameState = 0;
var noHandsTimeout = 10;
var handsLastSeenTime;

var beginTime;
var timePerDigit = 5;
var revealDigitFrac = 0.8;
var revealDigitColor = [150, 0, 150];

var revealGestureFrac = 0.6;

var currNumHands = 0;

var oneFrameOfData = nj.zeros([5, 4, 6]);

// Math Equation Things
var mathEqToShow = "";

/**
 * x_grid: 3*4 - 12*4
 * y_grid: 0-8
 * 
 */
function DrawTop(revealDigit) {
    square_spacing = 4 * x_grid;
    square_size = square_spacing * 0.9;
    round_radius = square_size / 4;
    y_pos = 1 * y_grid;

    for (var idx = 0; idx < 10; idx++) {

        x_pos = square_spacing * (3 + idx);
        // digit_accuracy = 0;
        // if (num_attempts_per_digit[idx] == 0) {
        fill([175, 175, 175]);
        // } else {
        //     digit_accuracy = mean_prediction_accuracies[idx];
        //     background_intensity = (125) * (1-digit_accuracy);
        //     fill([background_intensity, (mean_prediction_accuracies[idx])*(255 - background_intensity) + background_intensity, background_intensity]);
        // }
        if(revealDigit && idx == currentDigit) {
            stroke(revealDigitColor)
            strokeWeight(10);
        } else {
            strokeWeight(0);
        }
        square(x_pos, y_pos, square_size, round_radius);
        stroke(0);
        strokeWeight(1);
        fill(0);
        textSize(32);
        text(idx, x_pos + 3*square_size/8 , y_pos + square_size * 5/8);
    }
}

/**
 * x_grid 0-63
 * y_grid 8-9
 */
function DrawTimeRemaining(remainTimeFrac) {
    rect_y = 8
    rect_height = 1;

    fill([100, 100 + 100*remainTimeFrac, 100]);
    strokeWeight(0);
    rect(0*x_grid, (rect_y)*y_grid, 64*x_grid*remainTimeFrac, rect_height*y_grid);
}

function DrawTimeRevealIcon(iconRevealTime, color) {
    if (iconRevealTime == 1) {
        return;
    }
    triangle_height = 1 * y_grid;
    half_triangle_width = 0.25 * x_grid;
    x_pos = iconRevealTime * 64 * x_grid; // top point
    y_pos = 9 * y_grid;
    
    fill(color);
    strokeWeight(0);
    triangle(x_pos, y_pos,
            x_pos - half_triangle_width, y_pos + triangle_height,
            x_pos + half_triangle_width, y_pos + triangle_height);
}

function DrawDigit(color) {
    x_pos = 5 * x_grid;
    y_pos = 18 * y_grid;
    stroke(0);
    strokeWeight(1);
    fill(color);
    textSize(72);
    text(currentDigit,
        x_pos,
        y_pos);

}
function DrawEquation(color, revealDigit) {
    x_pos = 36 * x_grid;
    y_pos = 18 * y_grid;
    stroke(0);
    strokeWeight(1);
    fill(color);
    textSize(72);
    textToAdd = revealDigit ? currentDigit : "?";
    text(mathEqToShow + textToAdd,
        x_pos,
        y_pos);

}

function DrawGesture() {
    var aslImage;

    switch (currentDigit) {
        case 0:  aslImage = aslZeroImg; break;
        case 1:  aslImage = aslOneImg; break;
        case 2:  aslImage = aslTwoImg; break;
        case 3:  aslImage = aslThreeImg; break;
        case 4:  aslImage = aslFourImg; break;
        case 5:  aslImage = aslFiveImg; break;
        case 6:  aslImage = aslSixImg; break;
        case 7:  aslImage = aslSevenImg; break;
        case 8:  aslImage = aslEightImg; break;
        case 9:  aslImage = aslNineImg; break;
    }
        img_x = 33 *  x_grid;
        img_y = 32 * y_grid;
        draw_height = img_y;
        draw_width = draw_height * (aslImage.width/aslImage.height);
        rotate_and_draw_image(aslImage, img_x, img_y, draw_width, draw_height , 0)
    }


function DrawSectionLines() {
    x_pos = 32 * x_grid;
    y_pos_top = 9 * y_grid;
    y_pos_bottom = 64 * y_grid;
    strokeWeight(3);
    fill(0);
    line(0, y_pos_top, x_grid * 64, y_pos_top);
    line(x_pos, y_pos_top,
            x_pos, y_pos_bottom);
}

function SwitchDigit() {
    beginTime = new Date();
    currentDigit = getRandomInt(10);

    // update math equation if needed;
    a = getRandomInt(9);
    b = currentDigit - a;
    mathEqToShow = ""+a;
    if (b < 0) {
        mathEqToShow += " - "+(-1)*b;
    } else {
        mathEqToShow += " + "+b;
    }
    mathEqToShow += " = ";
}

// Game State 1 -- Paused
function HandlePaused() {
    // draw options
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(144);

    x_pos = 64/3 * x_grid;
    y_pos = 24 * y_grid;
    text('🔁',
        x_pos,
        y_pos);

    y_pos = y_pos - 3 * y_grid;
    x_pos = 64 * 2/3 * x_grid;
    half_triangle_height = 5 * y_grid;
    half_triangle_width = 3 * x_grid;
    fill(100,200,100);
    strokeWeight(0);
    triangle(x_pos - half_triangle_width, y_pos - half_triangle_height,
        x_pos + half_triangle_width, y_pos,
        x_pos - half_triangle_width, y_pos + half_triangle_height);

    fill(0);
    textSize(96);
    x_pos = 48/2 * x_grid;
    y_pos = 48 * y_grid;
    text('a + b = ?',
        x_pos,
        y_pos);

    // draw hand.
    handX = oneFrameOfData.get(0, 0, 0);
    handY = oneFrameOfData.get(0, 0, 1);
    handZ = oneFrameOfData.get(0, 0, 2);
    fill([175, 175, 175]);
    strokeWeight(0);
    circle(handX*64*x_grid, (1-handY)*64*y_grid, x_grid*2);
}


function HandleFrame(frame) {
    currNumHands = frame.hands.length;
    currTime = new Date();
    
    // update state if needed.
    if (currNumHands == 1) {
        handsLastSeenTime = currTime;
        if (gameState == 0) {
            gameState = 2;
            SwitchDigit();
        }
    } else if (currNumHands == 2) {
        gameState = 1; // paused!
    } else if (getTimeDiffSeconds(handsLastSeenTime, currTime) > noHandsTimeout) {
        gameState = 0;
    }

    if (gameState == 0) {
        DrawImageToHelpUserPutTheirHandOverTheDevice();
        return;
    } else if (gameState == 1) {
        UpdateHand(frame, 0, false);
        HandlePaused();
        return;
    } 


    timeRemainFrac = getTimeFracRemaining(beginTime, timePerDigit);

    revealDigit = timeRemainFrac <= revealDigitFrac;
    
    DrawTop(revealDigit);
    DrawSectionLines();
    DrawTimeRemaining(timeRemainFrac);
    DrawTimeRevealIcon(revealDigitFrac, revealDigitColor);
    DrawTimeRevealIcon(revealGestureFrac, 0);

    UpdateHand(frame, timeRemainFrac, true);
    
    DrawLeaderBoard();

    if (gameState == 3) {
        DrawEquation(revealDigitFrac < 1.0 ? revealDigitColor : 0, revealDigit);
    }
    if (revealDigit) {
        DrawDigit(revealDigitFrac < 1.0 ? revealDigitColor : 0);
    }
    if (timeRemainFrac <= revealGestureFrac) {
        DrawGesture();
    }
    if (timeRemainFrac <= 0) {
        SwitchDigit();
    }
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
