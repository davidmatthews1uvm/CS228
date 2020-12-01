var controllerOptions = {};

const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;

var colorMap = {0: [255, 0, 0], 1:[0, 255, 0], 2:[0, 0, 255]};
var oneFrameOfData = nj.zeros([5, 4, 6]);

var n = 0;
var m = 0;
var mean_prediction_accuracy = 0;
var d = 9;

var mean_prediction_accuracies = [0,0,0,0,0,0,0,0,0,0];
var num_attempts_per_digit     = [0,0,0,0,0,0,0,0,0,0];
var programState = 0;

var angle = 0;
let period = 1000/1.5;

var digitToShow = 0;
var strToShow = "";
var digitSeen = 0;
var digitsToShow = 1;
var maxDigitsToShow = 10;
var imageUpTime = 3;
var signDigitTime = 5;
var signDigitTimeFrac = 1;

var timeSinceLastDigitChange = new Date();

function IsReturningUser(username) {
    users = document.getElementsByTagName("li");
    for (var idx =0; idx < users.length; idx++) {
        if (username == users[idx].innerHTML) {
            return true;
        }
    }
    return false;
}

function CreateNewUser(username, list) {
    var item = document.createElement("li");
    item.innerHTML = String(username);
    item.id = String(username) + "_name"
    list.appendChild(item);

}

function createSignInItem(username, list) {
    var item = document.createElement("li");
    item.innerHTML = 1;
    item.id = String(username) + "_signins"
    list.appendChild(item);

}

function createDigitInfo(username, list,  digit) {
    var item = document.createElement("li");
    item.innerHTML = 0;
    item.id = String(username) + "_" + digit + "_attempts"
    list.appendChild(item);

    item = document.createElement("li");
    item.innerHTML = 0;
    item.id = String(username) + "_" + digit + "_accuracy"
    list.appendChild(item);
}

function addDigitAttempt(is_correct) {
    digit = digitToShow
    username = document.getElementById("username").value;
    ID = String(username) + "_" + digit + "_attempts";
    listItem = document.getElementById(ID);
    if (!listItem) {
        return
    }
    listItem.innerHTML = parseInt(listItem.innerHTML)  + 1;
    num_attempts = parseInt(listItem.innerHTML);

    ID = String(username) + "_" + digit + "_accuracy";
    listItem = document.getElementById(ID);
    curr_accuracy = parseFloat(listItem.innerHTML);
    listItem.innerHTML =  ((num_attempts-1)*curr_accuracy + (is_correct))/num_attempts;
}

function getPastDigitInfo(digit) {
    username = document.getElementById("username").value;
    return getPastDigitInfo(digit, username);
}

function getPastDigitInfo(digit, username) {
    is_correct = mean_prediction_accuracy > 0.6;
    ID = String(username) + "_" + digit + "_attempts";
    listItem = document.getElementById(ID);
    if (!listItem) {
        return [0,0]
    }
    num_attempts = parseInt(listItem.innerHTML);

    ID = String(username) + "_" + digit + "_accuracy";
    listItem = document.getElementById(ID);
    curr_accuracy = parseFloat(listItem.innerHTML);

    return [num_attempts, curr_accuracy]
}

function SignIn() {
    for (var idx = 0; idx < 10; idx++) {
        [num_attempts, accuracy] = getPastDigitInfo(idx);
        num_attempts_per_digit[idx] = num_attempts;
        mean_prediction_accuracies[idx] = accuracy;
    }

    username = document.getElementById("username").value;
    var list = document.getElementById("users");
    if (!IsReturningUser(username)) {
        CreateNewUser(username, list);
        createSignInItem(username, list);
        for (var idx =0; idx < 10; idx++) {
            createDigitInfo(username, list, idx);
        }
    } else {
        ID = String(username) + "_signins";
        listItem = document.getElementById(ID);
            listItem.innerHTML = parseInt(listItem.innerHTML)  + 1;
    }
    console.log(list.innerHTML);
    return false;
}

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
    mean_prediction_accuracy = ((n-1)*mean_prediction_accuracy + (parseInt(result.label) == digitToShow))/n;
    m += (parseInt(result.label) == digitToShow);

    num_attempts_per_digit[digitToShow] += 1;
    curr_accuracy = mean_prediction_accuracies[digitToShow];
    curr_n = num_attempts_per_digit[digitToShow];
    mean_prediction_accuracies[digitToShow] = ((curr_n-1)*curr_accuracy + (parseInt(result.label) == digitToShow))/curr_n

    // console.log("current", digitToShow, result.label, n, mean_prediction_accuracy, "lifetime: ", curr_n, mean_prediction_accuracies[digitToShow] );
    digitSeen = parseInt(result.label)

    // text(result.label, window.innerWidth * 3/4, window.innerHeight * 3/4 );
    addDigitAttempt((parseInt(result.label) == digitToShow))
}
function Train() {
    for (var i = 0; i < train6.shape[3] ; i++) {
        console.log(i);
        features = train0.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 0);

        features = train1.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train1Allison.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train1Bongard.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 1);

        features = train2.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Rielly.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Banaszewski.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Downs.pick(null, null, null, i).reshape(120);
        knnClassifier.addExample(features.tolist(), 2);

        features = train2Jimmo.pick(null, null, null, i).reshape(120);
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
    colorMode(RGB);
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
    // R G B
    color = [(2-bone.type/2)*125*(1 - mean_prediction_accuracy), (2-bone.type/2)*125*(mean_prediction_accuracy), 0];
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
        if (TimeToSwitchDigits()) {
            SwitchDigits();
        }    
    }
}
function TimeToSwitchDigits() {
    currentTime = new Date();
    timeDifferenceInMs = currentTime - timeSinceLastDigitChange;
    timeDifferenceInS = timeDifferenceInMs/1000;
    
    // disable current accuracy impact time to sign

    // curr_accuracy = mean_prediction_accuracies[digitToShow];
    // if (curr_accuracy > 0.3) {
    //     signDigitTimeFrac = ( 1 - curr_accuracy);
    // }

    // if (curr_accuracy > 0.7) {
    //     signDigitTimeFrac = 0.3;
    // }
    if (mean_prediction_accuracy > 0.7) {
        timeSinceLastDigitChange = currentTime;
        return true
    }
    if (timeDifferenceInS > signDigitTime - 0.2 && mean_prediction_accuracy < 0.3) {
        background([125*(1-mean_prediction_accuracy), 0, 0]);
    }
    if (timeDifferenceInS > signDigitTime ) { //signDigitTimeFrac) {
        timeSinceLastDigitChange = currentTime;
        return true;
    } else {
        return false;
    }

}

function SwitchDigits() {
    n = 0;
    m = 0;
    mean_prediction_accuracy = 0;
    digitToShow = getRandomInt(maxDigitsToShow);

    a = getRandomInt(9);
    b = digitToShow - a;
    strToShow = ""+a;
    if (b < 0) {
        strToShow += " - "+(-1)*b;
    } else {
        strToShow += " + "+b;
    }
    strToShow += " = ?";

    // disable for math work.
    // digitToShow = 0;
    // last_accuracy = 1;
    // for (var i = 0; i < digitsToShow; i++) {
    //     if (mean_prediction_accuracies[i] < last_accuracy) {
    //         last_accuracy = mean_prediction_accuracies[i];
    //         digitToShow = i;
    //     }
    // }
    // if (last_accuracy > 0.7) {
    //     if (digitsToShow < maxDigitsToShow) {
    //         digitsToShow += 1;
    //         digitToShow = digitsToShow - 1;
    //     }
    //     else {
    //         digitToShow = getRandomInt(digitsToShow);
    //     } 
    // }
}

function TrainKNNIfNotDone() {
    if (!trainingCompleted) {
        console.log("Training...");
        Train();
        trainingCompleted = true;
        console.log("Training complete!");
    }
}

function DrawImageToHelpuserPutTheirHandOverTheDevice() {
    draw_height = window.innerHeight/2;
    draw_width = draw_height * (handMissingImg.width/handMissingImg.height);
    draw_offset = window.innerWidth /2 - draw_width;

    rotate_and_draw_image(handMissingImg, draw_offset/2, 50 , draw_width, draw_height, 0);
}

function DrawLowerRightPanel() {
    currentTime = new Date();
    timeDifferenceInMs = currentTime - timeSinceLastDigitChange;
    timeDifferenceInS = timeDifferenceInMs/1000;
    var imageUpTimeFrac = 1.0;
    curr_accuracy = mean_prediction_accuracies[digitToShow];
    if (curr_accuracy > 0.3) {
            imageUpTimeFrac = ( 1- curr_accuracy);
    }
    if (curr_accuracy > 0.7) {
        imageUpTimeFrac = 0;
    }
    if (timeDifferenceInS < imageUpTime * imageUpTimeFrac) {

        var aslImage;

        switch (digitToShow) {
            case 0:  aslImage = aslZeroImg; break;
            case 1:  aslImage = aslOneImg; break;
            case 2:  aslImage = aslTwoImg; break;
            case 3:  aslImage = aslThreeImg; break;
            case 4:  aslImage = aslFourImg; break;
            case 5:  aslImage = aslFiveImg; break;
            case 6:  aslImage = aslSixImg; break;
            case 7:  aslImage = aslSevenImg; break;
            case 8:  aslImage = aslEightImg; break;
            case 9:  aslImage = aslNineImg; break;
        }
            img_x = window.innerWidth / 2;
            img_y = window.innerHeight / 2;
            draw_height = img_y;
            draw_width = draw_height * (aslImage.width/aslImage.height);
            rotate_and_draw_image(aslImage, img_x, img_y, draw_width, draw_height , 0)
        }
    textSize(32);
    strokeWeight(1);
    stroke([0,0,0]);

    timeLeft = signDigitTime * signDigitTimeFrac - timeDifferenceInS
    text(timeLeft.toFixed(2) +" s", 5 * window.innerWidth / 8,  7 * window.innerHeight / 8);
}

function DrawLowerLeftPanel() {
    currentTime = new Date();
    timeDifferenceInMs = currentTime - timeSinceLastDigitChange;
    timeDifferenceInS = timeDifferenceInMs/1000;
    timeLeft = signDigitTime * signDigitTimeFrac - timeDifferenceInS
    textSize(32);
    strokeWeight(1);

    // a + b = ?
    // ? = digitToShow


    stroke([0,0,0]);

    // math equation
    text(strToShow,  window.innerWidth / 16,  10 * window.innerHeight / 16);

    text((mean_prediction_accuracy*100).toFixed(1) + "% ( " + m + " / " + n + " )",  
                window.innerWidth / 16,
                12 * window.innerHeight / 16);
    text((mean_prediction_accuracies[digitToShow]*100).toFixed(1) + "% (  " + " / " + num_attempts_per_digit[digitToShow] + " )",
                window.innerWidth / 16, 
                13 * window.innerHeight / 16);

    // between 0 and window.innerWidth/2 into 16 segments.
    square_size = window.innerWidth / 32;
    round_radius = square_size/4;
    y_pos = 14 *  window.innerHeight / 16 

    // boxes for each digit accuracy.
    for (var idx =0; idx < 10; idx++) {
        x_pos = square_size* (2 + idx);
        digit_accuracy = 0;
        if (num_attempts_per_digit[idx] == 0) {
            fill([125, 125, 125]);
        } else {
            digit_accuracy = mean_prediction_accuracies[idx];
            background_intensity = (125) * (1-digit_accuracy);
            fill([background_intensity, (mean_prediction_accuracies[idx])*(255 - background_intensity) + background_intensity, background_intensity]);
        }
        square(x_pos, y_pos, square_size, round_radius);
        fill([0,0,0])
        textSize(24)
        text(idx, x_pos + square_size/4 , y_pos + square_size * 4/8);
        textSize(14)
        text((digit_accuracy*num_attempts_per_digit[idx]).toFixed(0) + "/" + num_attempts_per_digit[idx], x_pos + square_size/8 , y_pos + square_size * 7/8);
    }

    fill(0,0,0);
    DrawRankingPanel();
}

function orderUsers(a ,b) {
    [num_a, acc_a] = getPastDigitInfo(digitToShow, a);
    [num_b, acc_b] = getPastDigitInfo(digitToShow, b);
    return acc_a < acc_b;
}

function DrawRankingPanel() {
    row_x = 8 * window.innerWidth / 32;
    row_w = 4 * window.innerWidth / 32;
    row_y = 10 * window.innerHeight / 16;
    row_h = window.innerWidth / 32;
    max_users_to_show = 4;

    users = [];
    usersHTML = document.getElementsByTagName("li");
    
    for (var idx =0; idx < usersHTML.length; idx++) {
        if (usersHTML[idx].id.includes("_name")) {
            users.push(usersHTML[idx].innerHTML)
        }
    }
    users.sort(orderUsers);
    console.log(users.length, users);
    textSize(24)

    for (var idx = 0; idx < max_users_to_show; idx++) {
        if (idx >= users.length) {
            fill(255);
            rect(row_x, row_y+(idx * row_h), row_w, row_h, row_h/4);
            fill(0);
            text("#"+(idx+1) + ":", row_x+row_h/4, row_y+(idx + 3/4)* row_h);
        } else {
            fill(255);
            if (users[idx] == document.getElementById("username").value) {
                fill(200);
            }
            rect(row_x, row_y+(idx * row_h), row_w, row_h, row_h/4);
            fill(0);
            [num_a, overall_accuracy] = getPastDigitInfo(digitToShow, users[idx]);
            overall_accuracy = (overall_accuracy*100).toFixed(0) + "%"
            text("#" + (idx+1) + ": " + users[idx] + " (" + overall_accuracy +  ")", row_x + row_h/4, row_y+((idx + 3/4)  * row_h));
    
        }
    }
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
    // if (mean_prediction_accuracy > 0.3) {
    //     background([0, 255 * mean_prediction_accuracy, 0]);
    // }

    DrawHand(frame);
    DrawLowerRightPanel();
    DrawLowerLeftPanel();
    if (trainingCompleted) {
        Test();
    }
    
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
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
