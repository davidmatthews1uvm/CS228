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

function HandleBone(bone, finger_idx, interaction_box, acc) {
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

    color = [(2-bone.type/2)*125*(1 - acc),
             (2-bone.type/2)*125*(acc), 0];

    DrawLine(x1, y1, x2, y2, 10*(4 - bone.type),  color);


}



function HandleHand(hand, interaction_box, acc) {
    var fingers = hand.fingers;
    for (var bone_idx = 3; bone_idx >=0; bone_idx -= 1) {
        for (var finger_idx = 0; finger_idx < fingers.length; finger_idx++) {
             HandleBone(fingers[finger_idx].bones[bone_idx], finger_idx, interaction_box, acc);
        }
    }

}

function DrawHand(frame, acc) {
    if (frame.hands.length == 0) {
        return;
    }
    var hand = frame.hands[0];
    HandleHand(hand, frame.interactionBox, acc);
}
