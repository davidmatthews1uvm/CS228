const knnClassifier = ml5.KNNClassifier();

var numSamples = test.shape[3];
var numFeatures = 120;
var predictedClassLabels = nj.zeros([numSamples]);
var trainingCompleted = false;
var testingCompleted = false;
var testingSampleIndex = 1;

var colorMap = {0: [255, 0, 0], 1:[0, 255, 0], 2:[0, 0, 255]};

function GotResults(err, result){
    predictedClassLabels.set(testingSampleIndex,  parseInt(result.label));
    console.log("test", result.label, testingSampleIndex);
    testingSampleIndex += 1;
    if (testingSampleIndex >= 100) {
        testingSampleIndex = 0;
        testingCompleted = true;
    }
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
    features = test.pick(null, null, null, testingSampleIndex).reshape(120);
    predictedLabel = knnClassifier.classify(features.tolist(), GotResults);
}



function draw() {
    clear();
    if (!trainingCompleted) {
        console.log("Training...");
        Train();
        trainingCompleted = true;
        console.log("Training complete!");
    } else {
        Test();
    }
}
