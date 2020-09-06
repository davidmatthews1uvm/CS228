var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

function HandleFinger(finger) {
    // console.log(finger);
    // console.log(finger.tipPosition);
    var x, y, z;
    [x, y, z] = finger.tipPosition;

    circle(x, y, 50);

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