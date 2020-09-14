var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

var rawXMin = -100;
var rawXMax = 100;
var rawYMin = 50;
var rawYMax = 300;

function UpdateBounds(x, y, z) {
    if (x < rawXMin) {
        rawXMin = x;
    } else if (x > rawXMax) {
        rawXMax = x;
    }
    if (y < rawYMin) {
        rawYMin = y;
    } else if (y > rawYMax) {
        rawYMax = y;
    }
}

function TransformedCoordinates(x, y) {
    UpdateBounds(x, y);
    var scaledX  = ((x - rawXMin) / (rawXMax - rawXMin) ) * window.innerWidth;
    var scaledY  = window.innerHeight - ((y - rawYMin) / (rawYMax - rawYMin) ) * window.innerHeight;
    return [scaledX, scaledY];
}

function DrawCircle(x, y, r) {
    [x, y] = TransformedCoordinates(x, y);
    circle(x, y, r);
}

function DrawLine(x1, y1, x2, y2, weight, color) {
    [x1, y1] = TransformedCoordinates(x1, y1);
    [x2, y2] = TransformedCoordinates(x2, y2);
    strokeWeight(weight);
    stroke(color);
    line(x1, y1, x2, y2);
//    circle(scaledX, window.innerHeight - scaledY, r);
}


function HandleBone(bone) {
    [x1, y1, z1] = bone.prevJoint;
    [x2, y2, z2] = bone.nextJoint;

    DrawLine(x1, y1, x2, y2, 2*(4 - bone.type),  (4-bone.type)*40);
//    DrawCircle(x,y, 50);

}

function HandleFinger(finger) {
//    var x, y, z;
//    [x, y, z] = finger.tipPosition;
//    UpdateBounds(x, y, z);

    var bones = finger.bones
    for (var i = 0; i < bones.length; i++) {
        HandleBone(bones[i]);
    }


    // console.log(x, rawXMin, rawXMax, scaledX);
    // console.log(y, rawYMin, rawYMax, scaledY);


}

function HandleHand(hand) {
    var fingers = hand.fingers;
    for (var bone_idx = 3; bone_idx >=0; bone_idx -= 1) {
        for (var finger_idx = 0; finger_idx < fingers.length; finger_idx++) {
             HandleBone(fingers[finger_idx].bones[bone_idx]);
        }
    }

}

function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
