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
function HandleFinger(finger) {
    var x, y, z;
    [x, y, z] = finger.tipPosition;
    UpdateBounds(x, y, z);

    var scaledX  = ((x - rawXMin) / (rawXMax - rawXMin) ) * window.innerWidth;
    var scaledY  = ((y - rawYMin) / (rawYMax - rawYMin) ) * window.innerHeight;
    // console.log(x, rawXMin, rawXMax, scaledX);
    // console.log(y, rawYMin, rawYMax, scaledY);

    circle(scaledX, window.innerHeight - scaledY, 50);

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
