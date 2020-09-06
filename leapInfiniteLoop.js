var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

function HandleFinger(finger) {
    console.log(finger);
    console.log(finger.tipPosition);
}

function HandleHand(hand) {
    var fingers = hand.fingers;
    for (var i = 0; i < fingers.length; i++) {
        if (fingers[i].type == 1) {
            HandleFinger(fingers[i]);
        }
    }
}

function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
    // clear();
    // x += Math.floor(Math.random() * 3) - 1;
    // y += Math.floor(Math.random() * 3) - 1;
    //
    // circle(x, y, 50);

}

Leap.loop(controllerOptions, HandleFrame);