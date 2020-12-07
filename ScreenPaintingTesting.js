var controllerOptions = {};
var currentDigit = getRandomInt(10);

var y_grid = window.innerHeight / 64;
var x_grid = window.innerWidth / 64;

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
function DrawTimeRemaining(frac) {
    rect_y = 8
    rect_height = 1;

    fill([0,200*frac,0]);
    strokeWeight(0);
    rect(0*x_grid, (rect_y)*y_grid, 64*x_grid, rect_height*y_grid);
}

function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        DrawTop();
        DrawTimeRemaining(0.7);
    }
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
