
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
        digit_accuracy = 0;
        background_intensity = 100;
        if (num_attempts_per_digit[idx] == 0) {
        fill(background_intensity);
        } else {
            digit_accuracy = mean_prediction_accuracies[idx];
            // background_intensity = (125) * (1-digit_accuracy);
            fill([background_intensity, (min(num_attempts_per_digit[idx], 2))*1/2*(mean_prediction_accuracies[idx])*(background_intensity) + background_intensity, background_intensity]);
        }
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
        text(idx, x_pos + 3*square_size/8 , y_pos + square_size * 4/8);
        textSize(20);
        text((digit_accuracy*num_attempts_per_digit[idx]).toFixed(0) + "/" + num_attempts_per_digit[idx],
            x_pos + 3*square_size/8 , y_pos + square_size * 7/8);


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

function DrawAccuracy() {
    x_pos = 20 * x_grid;
    y_pos = 18 * y_grid;
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(72);
    text((mean_prediction_accuracy*100).toFixed(0) + "%",
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

function DrawLeaderBoard() {
    row_x = 48 * x_grid;
    row_w = 15 * x_grid;
    row_y = 32 * y_grid;
    row_h = 4 * y_grid;
    max_users_to_show = 7;

    users = getUsersSorted();
    textSize(24);
    stroke(0);
    strokeWeight(1);
    fill(0);
    for (var idx = 0; idx < max_users_to_show; idx++) {
        if (idx >= users.length) {
            fill(255);
            rect(row_x, row_y+(idx * row_h), row_w, row_h, row_h/4);
            fill(0);
            text("#"+(idx+1) + ":", row_x+row_h/4, row_y+(idx + 3/4)* row_h);
        } else {
            fill(255);
            if (users[idx] == document.getElementById("username").value) {
                fill(200);
            }
            rect(row_x, row_y+(idx * row_h), row_w, row_h, row_h/4);
            fill(0);
            [num_a, overall_accuracy] = getPastDigitInfo(currentDigit, users[idx]);
            overall_accuracy = (overall_accuracy*100).toFixed(0) + "%"
            text("#" + (idx+1) + ": " + users[idx] + " (" + overall_accuracy +  ")", row_x + row_h/4, row_y+((idx + 3/4)  * row_h));
    
        }   
    }
}