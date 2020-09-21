var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

var rawXMin = -100;
var rawXMax = 100;
var rawYMin = 50;
var rawYMax = 300;

var previousNumHands = 0;
var currentNumHands = 0;
var oneFrameOfData = nj.zeros([5,4,6]);


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
}


function HandleBone(bone, finger_idx) {
    [x1, y1, z1] = bone.prevJoint;
    [x2, y2, z2] = bone.nextJoint;

    [xs1, ys1] = TransformedCoordinates(x1, y1);
    [xs2, ys2] = TransformedCoordinates(x2, y2);



    oneFrameOfData.set(finger_idx, bone.type, 0, xs1);
    oneFrameOfData.set(finger_idx, bone.type, 1, ys1);
    oneFrameOfData.set(finger_idx, bone.type, 2, z1);
    oneFrameOfData.set(finger_idx, bone.type, 3, xs2);
    oneFrameOfData.set(finger_idx, bone.type, 4, ys2);
    oneFrameOfData.set(finger_idx, bone.type, 5, z2);

    color = [0,0,0]
    if (currentNumHands == 1) {
        color = [0, (4-bone.type)*40, 0];
    } else if (currentNumHands == 2) {
        color = [(4-bone.type)*40, 0, 0];
    }

    DrawLine(x1, y1, x2, y2, 2*(4 - bone.type),  color);


}

function HandleFinger(finger) {
    var bones = finger.bones
    for (var i = 0; i < bones.length; i++) {
        HandleBone(bones[i], );
    }
}

function HandleHand(hand) {
    var fingers = hand.fingers;
    for (var bone_idx = 3; bone_idx >=0; bone_idx -= 1) {
        for (var finger_idx = 0; finger_idx < fingers.length; finger_idx++) {
             HandleBone(fingers[finger_idx].bones[bone_idx], finger_idx);
        }
    }

}

function RecordData() {
    background(0);
}

function HandleFrame(frame) {
    currentNumHands = frame.hands.length;
    if (currentNumHands > 0) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
    if (previousNumHands == 2 && currentNumHands == 1) {
        RecordData();
        console.log(oneFrameOfData.toString());

    }

    previousNumHands = currentNumHands;
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
