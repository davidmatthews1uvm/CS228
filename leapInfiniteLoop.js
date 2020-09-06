var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;


Leap.loop(controllerOptions, function(frame){
    if (frame.hands.length == 1){
        var hand = frame.hands[0];
        var fingers = hand.fingers;
        for (var i = 0; i < fingers.length; i++)
            if (fingers[i].type == 1) {
            console.log(fingers[i]);
            }
        }
        // console.log(fingers);
    // clear();
    // x += Math.floor(Math.random() * 3) - 1;
    // y += Math.floor(Math.random() * 3) - 1;
    //
    // circle(x, y, 50);
}
);