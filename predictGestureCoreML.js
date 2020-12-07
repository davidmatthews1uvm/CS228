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
    observedDigit = parseInt(result.label);
    currDigitAccuracies.set(frameIdx%frameIdxMaxSize, observedDigit == currentDigit);
    frameIdx += 1;

    mean_prediction_accuracy = currDigitAccuracies.mean();
}

function Train() {
    for (var i = 0; i < train6.shape[3] && i < 10; i++) {
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

function TrainKNNIfNotDone() {
    if (!trainingCompleted) {
        Train();
        trainingCompleted = true;
    }
}
