var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;


Leap.loop(controllerOptions, function(frame){
    clear();
    x += Math.floor(Math.random() * 3) - 1;
    y += Math.floor(Math.random() * 3) - 1;

    circle(x, y, 50);
}
);