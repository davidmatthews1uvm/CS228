var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;


Leap.loop(controllerOptions, function(frame){
    if (frame.hands.length == 1){
        var hand = frame.hands[0];
        var fingers = hand.fingers
        console.log(fingers);
    }
    // clear();
    // x += Math.floor(Math.random() * 3) - 1;
    // y += Math.floor(Math.random() * 3) - 1;
    //
    // circle(x, y, 50);
}
);