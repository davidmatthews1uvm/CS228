var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;

var colorMap = {0: [255, 0, 0], 1:[0, 255, 0], 2:[0, 0, 255]};
var framesOfData = nj.zeros([5, 4, 6]);

function GotResults(err, result){
    console.log("test", result.label);
}
function Train() {
    for (var i = 0; i < train6.shape[3]; i++) {
        features = train6.pick(null, null, null, i).reshape(120);
        // console.log(i, 6, features.toString());
        knnClassifier.addExample(features.tolist(), 6);

        features = train8.pick(null, null, null, i).reshape(120);
        // console.log(i, 8, features.toString());
        knnClassifier.addExample(features.tolist(), 8);
    }
}

function Test() {
    predictedLabel = knnClassifier.classify(framesOfData.reshape(120).tolist(), GotResults);
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



    framesOfData.set(finger_idx, bone.type, 0, x1);
    framesOfData.set(finger_idx, bone.type, 1, y1);
    framesOfData.set(finger_idx, bone.type, 2, z1);
    framesOfData.set(finger_idx, bone.type, 3, x2);
    framesOfData.set(finger_idx, bone.type, 4, y2);
    framesOfData.set(finger_idx, bone.type, 5, z2);

    // color = [160, 160, 160]
    // if (currentNumHands == 1) {
    color = [(4-bone.type)*40, (4-bone.type)*40, (4-bone.type)*40];
    // } else if (currentNumHands == 2) {
    //     color = [(4-bone.type)*40, 0, 0];
    // }

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
    // if (previousNumHands == 1 && currentNumHands == 2 || previousNumHands == 2 && currentNumHands == 1) {
    //         background(0);
    //         if (currentNumHands == 1) {
    //             console.log(framesOfData.toString());
    //         }
    // }
    // if (currentNumHands == 2) {
    //     currentSample = (currentSample+1)%numSamples;
    //
    // }

}

function HandleFrame(frame) {
    if (frame.hands.length > 0) {
        var hand = frame.hands[0];
        HandleHand(hand, frame.interactionBox);
        Test();
    }
}

Leap.loop(controllerOptions, function(frame){
    clear();

    if (!trainingCompleted) {
        console.log("Training...");
        Train();
        trainingCompleted = true;
        console.log("Training complete!");
    }
        HandleFrame(frame);
})
