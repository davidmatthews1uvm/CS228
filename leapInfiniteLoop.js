var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

var rawXMin = 0;
var rawXMax = 1;
var rawYMin = 0;
var rawYMax = 1;

function UpdateBounds(x,y,z) {
    if (x < rawXMin) {
        rawXMin = x;
    } else if (x > rawXMax) {
        rawXMax = x;
    }
    if (y < rawYMin) {
        rawYMin = y;
    } else if (y > rawXMax) {
        rawYMax = y;
    }
}
function HandleFinger(finger) {
    // console.log(finger);
    // console.log(finger.tipPosition);
    var x, y, z;
    [x, y, z] = finger.tipPosition;
    UpdateBounds(x, y, z);

    circle(x, window.innerHeight/2 - y, 50);

}

function HandleHand(hand) {
    HandleFinger(hand.indexFinger);
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