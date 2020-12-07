var controllerOptions = {};
var currentDigit = getRandomInt(10);

var y_grid = window.innerHeight / 64;
var x_grid = window.innerWidth / 64;

var beginTime;
var timePerDigit = 5;

var prevNumHands = 0;
var currNumHands = 0;

var oneFrameOfData = nj.zeros([5, 4, 6]);

/**
 * x_grid: 3*4 - 12*4
 * y_grid: 0-8
 * 
 */
function DrawTop() {
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
        if(idx == currentDigit) {
            stroke([100, 100, 100])
            strokeWeight(10);
        } else {
            strokeWeight(0);
        }
        square(x_pos, y_pos, square_size, round_radius);
        stroke(0);
        strokeWeight(1);
        fill([0,0,0]);
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

    fill([0, 100 + 100*remainTimeFrac, 0]);
    strokeWeight(0);
    rect(0*x_grid, (rect_y)*y_grid, 64*x_grid*remainTimeFrac, rect_height*y_grid);
}

function DrawTimeGestureAppear(gestureTimeFrac, color) {
    triangle_height = 1 * y_grid;
    half_triangle_width = 0.25 * x_grid;
    x_pos = gestureTimeFrac * 64 * x_grid; // top point
    y_pos = 9 * y_grid;
    
    fill(color);
    strokeWeight(0);
    triangle(x_pos, y_pos,
            x_pos - half_triangle_width, y_pos + triangle_height,
            x_pos + half_triangle_width, y_pos + triangle_height);
}


function DrawSectionLines() {
    x_pos = 32 * x_grid;
    y_pos_top = 9 * y_grid;
    y_pos_bottom = 64 * y_grid;
    DrawLine(0, y_pos_top, x_grid * 64, y_pos_top, 3, 0);
    DrawLine(x_pos, y_pos_top,
            x_pos, y_pos_bottom,
            3, 0);
}

function SwitchDigit() {
    beginTime = new Date();
    currentDigit = getRandomInt(10);
}


function HandleFrame(frame) {
    currNumHands = frame.hands.length;
    if (currNumHands == 1 && prevNumHands == 0) {
       SwitchDigit();
    }
    if (currNumHands == 1) {
        var hand = frame.hands[0];
        timeRemainFrac = getTimeFracRemaining(beginTime, timePerDigit);

        DrawTop();
        DrawSectionLines();
        DrawTimeRemaining(timeRemainFrac);
        DrawTimeGestureAppear(0.7, [0,0,0]);
        DrawTimeGestureAppear(0.4, [170, 0, 170]);

        DrawHand(frame, timeRemainFrac);

        if (timeRemainFrac <= 0) {
            SwitchDigit();
        }
    }
    prevNumHands = currNumHands;
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
