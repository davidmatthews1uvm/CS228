// Game State 1 -- Paused
function HandlePaused() {
    // hand position
    handX = oneFrameOfData.get(0, 0, 0);
    handY = oneFrameOfData.get(0, 0, 1);
    handZ = oneFrameOfData.get(0, 0, 2);

    handXPx = handX * 64 * x_grid;
    handYPx = (1-handY) * 64 * y_grid;
    console.log(handXPx, handYPx);
    
    var activeSelection = -1;

    // draw options
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(144);

    x_pos = 64/5 * x_grid;
    y_pos = 16 * y_grid;
    draw_height = 16 * y_grid;
    draw_width = draw_height;
    rotate_and_draw_image(repeatImg, x_pos, y_pos, draw_width, draw_height, 0)
    if (handXPx >= x_pos &&
        handXPx <= x_pos + draw_width &&
        handYPx >= y_pos &&
        handYPx <= y_pos + draw_height ) {
            activeSelection = 1;
    }


    y_pos = y_pos + 5 * y_grid;
    x_pos = 64 * 4/5 * x_grid;
    half_triangle_height = 5 * y_grid;
    half_triangle_width = 3 * x_grid;
    fill(100,200,100);
    strokeWeight(0);
    triangle(x_pos - half_triangle_width, y_pos - half_triangle_height,
        x_pos + half_triangle_width, y_pos,
        x_pos - half_triangle_width, y_pos + half_triangle_height);  
    if (handXPx >= x_pos - half_triangle_width &&
        handXPx <= x_pos + half_triangle_width &&
        handYPx >= y_pos - half_triangle_height&&
        handYPx <= y_pos + half_triangle_height ) {
            activeSelection = 2;
    }

    fill(0);
    textSize(96);
    x_pos = 48/2 * x_grid;
    y_pos = 48 * y_grid;
    txtStr = "";
    if (prevGameState == 3) {
        txtStr += "   <==   ";
    }  else {
        txtStr += 'a + b = ?';
    }
    text(txtStr,
        x_pos,
        y_pos);

    if (handXPx >= x_pos &&
        handXPx <= x_pos + 16 * x_grid &&
        handYPx >= y_pos - 8 * y_grid&&
        handYPx <= y_pos ) {
            activeSelection = 3;
    }

    color = [175, 175, 175];
    fill(color);
    strokeWeight(0);
    circle(handXPx, handYPx, x_grid*2);


    if (activeSelection != pauseHoverState) {
        pauseHoverBeginTime = new Date();
        pauseHoverState = activeSelection;
        return;
    }
    
    // if current state == pause hover state then draw moving bar and switch states if needed.
    if (pauseHoverState != -1) {
        x_pos = handXPx + x_grid;
        y_pos = handYPx - x_grid;
        fill(255);
        strokeWeight(1);
        stroke(0);
        rect(x_pos, y_pos, x_grid * 0.5, x_grid*2);
        fill(0);
        remainTime = getTimeFracRemaining(pauseHoverBeginTime, pauseHoverClickTime);
        y_height = x_grid*2*(1-remainTime);
        rect(x_pos, y_pos+ (x_grid*2 - y_height), x_grid * 0.5, y_height);
        if (remainTime <= 0) {
            if (pauseHoverState == 1) { // repeat current digit
                digitBeginTime = new Date();
                gameState = prevGameState;
            } else if (pauseHoverState == 2) {
                gameState = prevGameState;
            } else if (pauseHoverState == 3) {
                gameState = prevGameState == 3 ? 2 : 3;
            }
            pauseHoverState = -1;
        }

    }
}

