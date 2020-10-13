var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;

var colorMap = {0: [255, 0, 0], 1:[0, 255, 0], 2:[0, 0, 255]};
var oneFrameOfData = nj.zeros([5, 4, 6]);

var n = 0;
var m = 0;
var d = 9;

function CenterData() {
    xValues = oneFrameOfData.slice([], [], [0,6,3]);
    currentMeanX = xValues.mean();
    horizontalShift = 0.5 - currentMeanX;

    for (var rowId = 0; rowId < 5; rowId++) {
        for (var colId = 0; colId < 4; colId++) {
            currentX = oneFrameOfData.get(rowId, colId, 0);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(rowId, colId, 0, shiftedX);

            currentX = oneFrameOfData.get(rowId, colId, 3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(rowId, colId, 3, shiftedX);
        }
    }

    yValues = oneFrameOfData.slice([], [], [1,6,3]);
    currentMeanY = yValues.mean();
    horizontalShift = 0.5 - currentMeanY;

    for (var rowId = 0; rowId < 5; rowId++) {
        for (var colId = 0; colId < 4; colId++) {
            currentY = oneFrameOfData.get(rowId, colId, 1);
            shiftedY = currentY + horizontalShift;
            oneFrameOfData.set(rowId, colId, 1, shiftedY);

            currentY = oneFrameOfData.get(rowId, colId, 4);
            shiftedY = currentY + horizontalShift;
            oneFrameOfData.set(rowId, colId, 4, shiftedY);
        }
    }
    zValues = oneFrameOfData.slice([], [], [2,6,3]);
    currentMeanZ = zValues.mean();
    horizontalShift = 0.5 - currentMeanZ;

    for (var rowId = 0; rowId < 5; rowId++) {
        for (var colId = 0; colId < 4; colId++) {
            currentZ = oneFrameOfData.get(rowId, colId, 2);
            shiftedZ = currentZ + horizontalShift;
            oneFrameOfData.set(rowId, colId, 2, shiftedZ);

            currentZ = oneFrameOfData.get(rowId, colId, 5);
            shiftedZ = currentZ + horizontalShift;
            oneFrameOfData.set(rowId, colId, 5, shiftedZ);
        }
    }
    // console.log(currentMeanX, xValues.mean(), currentMeanY,  yValues.mean(), currentMeanZ,  zValues.mean());
}

function GotResults(err, result){
    n += 1;
    m = ((n-1)*m + (parseInt(result.label) == d))/n;

    console.log(n, m, result.label);
}
function Train() {
    for (var i = 0; i < train6.shape[3]; i++) {
        features = train0.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 0);

        features = train1.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train2.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train3.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 3);

        features = train4.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 4);

        features = train5.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 5);

        features = train6.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 6);

        features = train7.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 7);

        features = train8.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 8);

        features = train9.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 9);
    }
}

function Test() {
    CenterData();
    predictedLabel = knnClassifier.classify(oneFrameOfData.reshape(120).tolist(), GotResults);
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



    oneFrameOfData.set(finger_idx, bone.type, 0, x1);
    oneFrameOfData.set(finger_idx, bone.type, 1, y1);
    oneFrameOfData.set(finger_idx, bone.type, 2, z1);
    oneFrameOfData.set(finger_idx, bone.type, 3, x2);
    oneFrameOfData.set(finger_idx, bone.type, 4, y2);
    oneFrameOfData.set(finger_idx, bone.type, 5, z2);

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
    //             console.log(oneFrameOfData.toString());
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
