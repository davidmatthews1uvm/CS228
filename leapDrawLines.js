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

function HandleBone(bone) {
    var tip = bone.nextJoint;
    [x,y,z] = tip;

    DrawCircle(x,y, 50);

//    console.log(tip)
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
