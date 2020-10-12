nj.config.printThreshold = 1000;

var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

var rawXMin = -100;
var rawXMax = 100;
var rawYMin = 50;
var rawYMax = 300;

var previousNumHands = 0;
var currentNumHands = 0;
var numSamples = 100;
var currentSample = 0;
var framesOfData = nj.zeros([5, 4, 6, numSamples]);


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



function DrawCircle(x, y, r) {
    [x, y] = TransformedCoordinates(x, y);
    circle(x, y, r);
}

function HandleFinger(finger) {
    var bones = finger.bones
    for (var i = 0; i < bones.length; i++) {
        HandleBone(bones[i], );
    }
}


function TransformedCoordinates(x, y) {
    var scaledX  = x * window.innerWidth;
    var scaledY  = (1 - y) * window.innerHeight;
    return [scaledX, scaledY];
}

function DrawLine(x1, y1, x2, y2, weight, color) {
    [x1, y1] = TransformedCoordinates(x1, y1);
    [x2, y2] = TransformedCoordinates(x2, y2);
    strokeWeight(weight);
    stroke(color);
    line(x1, y1, x2, y2);
}


function HandleBone(bone, finger_idx, interaction_box) {
    normalizedPrevJoint = interaction_box.normalizePoint(bone.prevJoint, true);
    normalizedNextJoint = interaction_box.normalizePoint(bone.nextJoint, true);

    [x1, y1, z1] = normalizedPrevJoint;
    [x2, y2, z2] = normalizedNextJoint;

    [xs1, ys1] = TransformedCoordinates(x1, y1);
    [xs2, ys2] = TransformedCoordinates(x2, y2);



    framesOfData.set(finger_idx, bone.type, 0, currentSample, x1);
    framesOfData.set(finger_idx, bone.type, 1, currentSample, y1);
    framesOfData.set(finger_idx, bone.type, 2, currentSample, z1);
    framesOfData.set(finger_idx, bone.type, 3, currentSample, x2);
    framesOfData.set(finger_idx, bone.type, 4, currentSample, y2);
    framesOfData.set(finger_idx, bone.type, 5, currentSample, z2);

    color = [0,0,0]
    if (currentNumHands == 1) {
        color = [0, (4-bone.type)*40, 0];
    } else if (currentNumHands == 2) {
        color = [(4-bone.type)*40, 0, 0];
    }

    DrawLine(x1, y1, x2, y2, 10*(4 - bone.type),  color);


}



function HandleHand(hand, interaction_box) {
    var fingers = hand.fingers;
    for (var bone_idx = 3; bone_idx >=0; bone_idx -= 1) {
        for (var finger_idx = 0; finger_idx < fingers.length; finger_idx++) {
             HandleBone(fingers[finger_idx].bones[bone_idx], finger_idx, interaction_box);
        }
    }

}

function RecordData(previousNumHands, currentNumHands) {
    if (previousNumHands == 1 && currentNumHands == 2 || previousNumHands == 2 && currentNumHands == 1) {
            background(0);
            if (currentNumHands == 1) {
                console.log(framesOfData.toString());
            }
    }
    if (currentNumHands == 2) {
        currentSample = (currentSample+1)%numSamples;

    }

}

function HandleFrame(frame) {
    currentNumHands = frame.hands.length;
    if (currentNumHands > 0) {
        var hand = frame.hands[0];
        HandleHand(hand, frame.interactionBox);
    }
    RecordData(previousNumHands, currentNumHands);


    previousNumHands = currentNumHands;
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
