var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

var rawXMin = -100;
var rawXMax = 100;
var rawYMin = 50;
var rawYMax = 300;

function UpdateBounds(x,y,z) {
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

function DrawCircle(x, y, r) {
    var scaledX  = ((x - rawXMin) / (rawXMax - rawXMin) ) * window.innerWidth;
    var scaledY  = ((y - rawYMin) / (rawYMax - rawYMin) ) * window.innerHeight;
    circle(scaledX, window.innerHeight - scaledY, r);
}

function DrawLine(x1, y1, x2, y2) {
    var scaledX1  = ((x1 - rawXMin) / (rawXMax - rawXMin) ) * window.innerWidth;
    var scaledY1  = window.innerHeight - ((y1 - rawYMin) / (rawYMax - rawYMin) ) * window.innerHeight;
    var scaledX2  = ((x2 - rawXMin) / (rawXMax - rawXMin) ) * window.innerWidth;
    var scaledY2  = window.innerHeight -((y2 - rawYMin) / (rawYMax - rawYMin) ) * window.innerHeight;

    line(scaledX1,  scaledY1, scaledX2, scaledY2);
//    circle(scaledX, window.innerHeight - scaledY, r);
}


function HandleBone(bone) {
    [x1, y1, z1] = bone.prevJoint;
    [x2, y2, z2] = bone.nextJoint;

    DrawLine(x1, y1, x2, y2);
//    DrawCircle(x,y, 50);

}

function HandleFinger(finger) {
    var x, y, z;
    [x, y, z] = finger.tipPosition;
    UpdateBounds(x, y, z);

    var bones = finger.bones
    for (var i = 0; i < bones.length; i++) {
        HandleBone(bones[i]);
    }


    // console.log(x, rawXMin, rawXMax, scaledX);
    // console.log(y, rawYMin, rawYMax, scaledY);


}

function HandleHand(hand) {
    var fingers = hand.fingers;
    for (var i = 0; i < fingers.length; i++) {
         HandleFinger(fingers[i]);
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
