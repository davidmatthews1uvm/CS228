var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;

var colorMap = {0: [255, 0, 0], 1:[0, 255, 0], 2:[0, 0, 255]};
var oneFrameOfData = nj.zeros([5, 4, 6]);

var n = 0;
var m = 0;
var d = 9;

var programState = 0;

var angle = 0;
let period = 1000/1.5;

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

    console.log(result.label);

    // text(result.label, window.innerWidth * 3/4, window.innerHeight * 3/4 );

}
function Train() {
    for (var i = 0; i < train6.shape[3]; i++) {
        console.log(i);
        features = train0.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 0);

        features = train1.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train1Allison.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train2.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Rielly.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Banaszewski.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Downs.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train3.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 3);

        features = train4.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 4);

        features = train4Makovsky.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 4);

        features = train4Bertschinger.pick(null, null, null, i).reshape(120);
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



function TransformedCoordinatesHand(x, y) {
    var scaledX  = x * window.innerWidth/2;
    var scaledY  = (1 - y) * window.innerHeight/2;
    return [scaledX, scaledY];
}

function DrawLine(x1, y1, x2, y2, weight, color) {
    [x1, y1] = TransformedCoordinatesHand(x1, y1);
    [x2, y2] = TransformedCoordinatesHand(x2, y2);
    strokeWeight(weight);
    stroke(color);
    line(x1, y1, x2, y2);
}


function HandleBone(bone, finger_idx, interaction_box) {
    normalizedPrevJoint = interaction_box.normalizePoint(bone.prevJoint, true);
    normalizedNextJoint = interaction_box.normalizePoint(bone.nextJoint, true);

    [x1, y1, z1] = normalizedPrevJoint;
    [x2, y2, z2] = normalizedNextJoint;

    [xs1, ys1] = TransformedCoordinatesHand(x1, y1);
    [xs2, ys2] = TransformedCoordinatesHand(x2, y2);



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

function rotate_and_draw_image(img, img_x, img_y, img_width, img_height, img_angle) {
    imageMode(CENTER);
    translate(img_x + img_width / 2, img_y + img_width / 2);
    rotate(PI / 180 * img_angle);
    image(img, 0, 0, img_width, img_height);
    rotate(-PI / 180 * img_angle);
    translate(-(img_x + img_width / 2), -(img_y + img_width / 2));
    imageMode(CORNER);
}

function HandIsTooFarToTheLeft() {
    xValues = oneFrameOfData.slice([], [], [0,6,3]);
    currentMeanX = xValues.mean();
    return currentMeanX < 0.25;
}

function HandIsTooFarToTheRight() {
    xValues = oneFrameOfData.slice([], [], [0,6,3]);
    currentMeanX = xValues.mean();
    return currentMeanX > 0.75;
}
function HandIsTooFarToTheTop() {
    yValues = oneFrameOfData.slice([], [], [1,6,3]);
    currentMeanY = yValues.mean();
    return currentMeanY > 0.75;
}

function HandIsTooFarToTheBottom() {
    yValues = oneFrameOfData.slice([], [], [1,6,3]);
    currentMeanY = yValues.mean();
    return currentMeanY < 0.25;
}
function HandIsTooFarToTheScreen() {
    zValues = oneFrameOfData.slice([], [], [2,6,3]);
    currentMeanZ = zValues.mean();
    return currentMeanZ < 0.25;
}

function HandIsTooFarFromTheScreen() {
    zValues = oneFrameOfData.slice([], [], [2,6,3]);
    currentMeanZ = zValues.mean();
    return currentMeanZ > 0.75;
}

function HandIsUncentered() {
    return (HandIsTooFarToTheLeft() ||
            HandIsTooFarToTheRight() || 
            HandIsTooFarToTheBottom() ||
            HandIsTooFarToTheTop() ||
            HandIsTooFarToTheScreen() ||
            HandIsTooFarFromTheScreen() );
}


function DrawArrowRight() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    var imgSize = window.innerHeight/16;
    rotate_and_draw_image(arrowImg, window.innerWidth/2 - imgSize/2 - len, window.innerHeight/4, imgSize, imgSize, 0)
    rotate_and_draw_image(handImg , window.innerWidth/2 - imgSize/2 - len, window.innerHeight/4 - imgSize, imgSize, imgSize,0)

    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandLeftImg.width/moveHandLeftImg.height);
    rotate_and_draw_image(moveHandLeftImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);
}

function DrawArrowLeft() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, len, window.innerHeight/4, imgSize, imgSize, 180)
    rotate_and_draw_image(handImg , len, window.innerHeight/4 - imgSize, imgSize, imgSize, 0)

    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandRightImg.width/moveHandRightImg.height);
    rotate_and_draw_image(moveHandRightImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);
}

function DrawArrowUp() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, window.innerWidth/4, window.innerHeight/2 - len, imgSize, imgSize, 90)
    rotate_and_draw_image(handImg , window.innerWidth/4 - imgSize, window.innerHeight/2  - len, imgSize, imgSize, 0)

    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandUpImg.width/moveHandUpImg.height);
    rotate_and_draw_image(moveHandUpImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);
}

function DrawArrowDown() {
    let millisecond = millis();
    let len = 20 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    rotate_and_draw_image(arrowImg, window.innerWidth/4,  len, imgSize, imgSize, 270)
    rotate_and_draw_image(handImg , window.innerWidth/4 - imgSize, len, imgSize, imgSize, 0)

    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandDownImg.width/moveHandDownImg.height);
    rotate_and_draw_image(moveHandDownImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);
}

function DrawArrowIn() {
    let millisecond = millis();
    let len = 40 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    let handSize = imgSize*2+len
    rotate_and_draw_image(arrowImg, window.innerWidth/4 - 4 * imgSize/2, window.innerHeight/4 - imgSize/2, imgSize, imgSize, 90)
    rotate_and_draw_image(handImg , window.innerWidth/4 - handSize/2, window.innerHeight/4 - handSize/2, handSize, handSize, 0)

    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandTowardImg.width/moveHandTowardImg.height);
    rotate_and_draw_image(moveHandTowardImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);
}

function DrawArrowOut() {
    let millisecond = millis();
    let len = 40 * (sin(millisecond / period) + 1)
    let imgSize = window.innerHeight/16
    let handSize = (imgSize*2+len)/2
    rotate_and_draw_image(arrowImg, window.innerWidth/4 - 4 * imgSize/2, window.innerHeight/4 - imgSize/2, imgSize, imgSize, 270)
    rotate_and_draw_image(handImg , window.innerWidth/4 - handSize/2, window.innerHeight/4 - handSize/2, handSize, handSize, 0)
    
    draw_height = window.innerHeight/2;
    draw_width = draw_height * (moveHandAwayImg.width/moveHandAwayImg.height);
    rotate_and_draw_image(moveHandAwayImg, window.innerWidth/2 + draw_width/2, 50 , draw_width, draw_height, 0);

}


function DetermineState(frame) {
    if (frame.hands.length  == 0) {
        programState = 0;
    }
    else if (HandIsUncentered()) {
        programState = 1;
    } 
    else if  (frame.hands.length == 1){
        programState = 2;
    }
}
function TrainKNNIfNotDone() {
    // if (!trainingCompleted) {
    //     console.log("Training...");
    //     Train();
    //     trainingCompleted = true;
    //     console.log("Training complete!");
    // }
}

function DrawImageToHelpuserPutTheirHandOverTheDevice() {
    draw_height = window.innerHeight/2;
    draw_width = draw_height * (handMissingImg.width/handMissingImg.height);
    draw_offset = window.innerWidth /2 - draw_width;

    rotate_and_draw_image(handMissingImg, draw_offset/2, 50 , draw_width, draw_height, 0);
}

function HandleState0(frame) {
    TrainKNNIfNotDone();
    DrawImageToHelpuserPutTheirHandOverTheDevice();
}

function DrawHand(frame) {
    var hand = frame.hands[0];
    HandleHand(hand, frame.interactionBox);
}
function HandleState1(frame) {
    DrawHand(frame);
    if (HandIsTooFarToTheLeft()) {
        DrawArrowLeft();
    } else if (HandIsTooFarToTheRight()) {
        DrawArrowRight();
    } else if (HandIsTooFarToTheBottom()) {
        DrawArrowUp();
    } else if (HandIsTooFarToTheTop()) {
        DrawArrowDown();
    } else if (HandIsTooFarToTheScreen()) {
        DrawArrowOut();
    } else if (HandIsTooFarFromTheScreen()) {
        DrawArrowIn();
    }
}

function HandleState2(frame) {
    DrawHand(frame);
    if (trainingCompleted) {
        // Test();
    }
}



Leap.loop(controllerOptions, function(frame){
    clear();
    DetermineState(frame);
    // console.log(programState);
    if (programState == 0) {
        HandleState0(frame);
    }
    else if (programState == 1) {
        HandleState1(frame);
    }
    else if (programState == 2) {
        HandleState2(frame);
    }
})
