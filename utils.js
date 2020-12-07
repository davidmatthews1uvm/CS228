function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getTimeDiffSeconds(prevTime, currTime){
    timeDifferenceInMs = currTime - prevTime;
    timeDifferenceInS = timeDifferenceInMs/1000;
    return timeDifferenceInS;
}

function getTimeFracRemaining(prevTime, totalTime) {
    return 1 - Math.max(getTimeDiffSeconds(prevTime, new Date())/totalTime, 0);
}

// generic graphics
function DrawLine(x1, y1, x2, y2, weight, color) {
    [x1, y1] = TransformedCoordinatesHand(x1, y1);
    [x2, y2] = TransformedCoordinatesHand(x2, y2);
    colorMode(RGB);
    strokeWeight(weight);
    stroke(color);
    line(x1, y1, x2, y2);
}

function rotate_and_draw_image(img, img_x, img_y, img_width, img_height, img_angle) {
    imageMode(CENTER);
    translate(img_x + img_width / 2, img_y + img_width / 2);
    rotate(PI / 180 * img_angle);
    image(img, 0, 0, img_width, img_height);
    rotate(-PI / 180 * img_angle);
    translate(-(img_x + img_width / 2), -(img_y + img_width / 2));
    imageMode(CORNER);
}

// Hand Drawing
function TransformedCoordinatesHand(x, y) {
    var scaledX  = x * window.innerWidth * 31/64;
    var scaledY  = (1 - y) * window.innerHeight * (64-11)/64;
    scaledY += window.innerHeight*11/64;
    return [scaledX, scaledY];
}

function HandleBone(bone, finger_idx, interaction_box, acc, toDraw) {
    normalizedPrevJoint = interaction_box.normalizePoint(bone.prevJoint, true);
    normalizedNextJoint = interaction_box.normalizePoint(bone.nextJoint, true);

    [x1, y1, z1] = normalizedPrevJoint;
    [x2, y2, z2] = normalizedNextJoint;

    [xs1, ys1] = TransformedCoordinatesHand(x1, y1);
    [xs2, ys2] = TransformedCoordinatesHand(x2, y2);



    oneFrameOfData.set(finger_idx, bone.type, 0, x1);
    oneFrameOfData.set(finger_idx, bone.type, 1, y1);
    oneFrameOfData.set(finger_idx, bone.type, 2, z1);
    oneFrameOfData.set(finger_idx, bone.type, 3, x2);
    oneFrameOfData.set(finger_idx, bone.type, 4, y2);
    oneFrameOfData.set(finger_idx, bone.type, 5, z2);

    if (toDraw) {
        color = [(2-bone.type/2)*125*(1 - acc),
                (2-bone.type/2)*125*(acc), 0];

        DrawLine(x1, y1, x2, y2, 10*(4 - bone.type),  color);
    }
}



function HandleHand(hand, interaction_box, acc,  toDraw) {
    var fingers = hand.fingers;
    for (var bone_idx = 3; bone_idx >=0; bone_idx -= 1) {
        for (var finger_idx = 0; finger_idx < fingers.length; finger_idx++) {
             HandleBone(fingers[finger_idx].bones[bone_idx], finger_idx, interaction_box, acc, toDraw);
        }
    }

}

function UpdateHand(frame, acc, toDraw) {
    if (frame.hands.length == 0) {
        return;
    }
    var hand = frame.hands[0];
    HandleHand(hand, frame.interactionBox, acc, toDraw);
}

// Game State 0 -- No Hands / Welcome
function DrawImageToHelpUserPutTheirHandOverTheDevice() {
    draw_height = window.innerHeight * 3/4;
    draw_width = draw_height * (handMissingImg.width/handMissingImg.height);
    draw_offset_x = (window.innerWidth  - draw_width)/2;
    draw_offset_y = (window.innerHeight - draw_height)/2;

    rotate_and_draw_image(handMissingImg, draw_offset_x, draw_offset_y, draw_width, draw_height, 0);
}



function DrawLeaderBoard() {
    row_x = 48 * x_grid;
    row_w = 15 * x_grid;
    row_y = 32 * y_grid;
    row_h = 4 * y_grid;
    max_users_to_show = 7;

    textSize(24);
    stroke(0);
    strokeWeight(1);
    fill(0);
    for (var idx = 0; idx < max_users_to_show; idx++) {
        fill(255);
        rect(row_x, row_y+(idx * row_h), row_w, row_h* 0.9, row_h/4);
        fill(0);
        text("#"+(idx+1) + ":", row_x+row_h/4, row_y+(idx + 3/4)* row_h);
    }

}
