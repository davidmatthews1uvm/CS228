var controllerOptions = {};

// ML training
const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;

//  graphics layout
var y_grid = window.innerHeight / 64;
var x_grid = window.innerWidth / 64;

// track current digit
var currentDigit = getRandomInt(10);
var observedDigit;
var n = 0;
var m = 0;
var mean_prediction_accuracy = 0;

var mean_prediction_accuracies = [0,0,0,0,0,0,0,0,0,0];
var num_attempts_per_digit     = [0,0,0,0,0,0,0,0,0,0];
var consecutiveErrors = 0;
var consecutiveSuccesses = 0;

/**
 * 0: no hands 
 * 1: paused
 * 2: normal play
 * 3: math mode
 */
var prevGameState = 0;
var gameState = 0;
var noHandsTimeout = 10;
var handsLastSeenTime;

var digitBeginTime;
var frameIdx = 0;
var frameIdxMaxSize = 30;
var currDigitAccuracies = nj.zeros([frameIdxMaxSize]);
var timePerDigit = 5;
var timePerDigitMin = 3;
var timePerDigitRange = 4;
var revealDigitFrac = 0.8;
var revealDigitFracMin = 0.4;
var revealDigitFracRange = 0.6;
var revealDigitColor = [150, 0, 150];

var revealGestureFrac = 0.6;

var currNumHands = 0;

var oneFrameOfData = nj.zeros([5, 4, 6]);

// pause hover states
var pauseHoverState = -1;
var pauseHoverBeginTime;
var pauseHoverClickTime = 1;

// Math Equation Things
var mathEqToShow = "";
var showedMathEnterWarning = false;
var showedMathExitWarning = false;


function SwitchDigit() {
    frameIdx = 0;
    currDigitAccuracies = nj.zeros([frameIdxMaxSize]);
    n = 0;
    m = 0;
    mean_prediction_accuracy = 0;
    
    digitBeginTime = new Date();
    currentDigit = getRandomInt(3); //(10);

    // update math equation if needed;
    a = getRandomInt(9);
    b = currentDigit - a;
    mathEqToShow = ""+a;
    if (b < 0) {
        mathEqToShow += " - "+(-1)*b;
    } else {
        mathEqToShow += " + "+b;
    }
    mathEqToShow += " = ";

    var ttlAttempts = num_attempts_per_digit.reduce(function(a, b){
        return a + b;
    }, 0);
    
    var sumPredAcc = mean_prediction_accuracies.reduce(function(a, b){
        return a + b;
    }, 0);
    overallAcc = sumPredAcc / (ttlAttempts);
    if (ttlAttempts < 10) {
        timePerDigit = timePerDigitMin + timePerDigitRange * 0.5;
    } else {
        timePerDigit = timePerDigitMin + timePerDigitRange * (1-overallAcc); // longer if doing worse, shorter if doing well.
    }
    if (num_attempts_per_digit[currentDigit] < 3) {
        revealDigitFrac = 1.0;
        revealGestureFrac = 1.0;
    }  else {
        revealDigitFrac = revealDigitFracMin + (1-mean_prediction_accuracies[currentDigit])*revealDigitFracRange;
        revealGestureFrac =  revealDigitFrac - 0.2;
    }
}

function HandleFrame(frame) {
    currNumHands = frame.hands.length;
    currTime = new Date();
    
    // update state if needed.
    if (currNumHands == 1) {
        handsLastSeenTime = currTime;
        if (gameState == 0) {
            prevGameState = gameState;
            gameState = 2;
            SwitchDigit();
        }
    } else if (currNumHands == 2 && gameState != 1) {
        prevGameState = gameState;
        gameState = 1; // paused!
    } else if (getTimeDiffSeconds(handsLastSeenTime, currTime) > noHandsTimeout && gameState != 0) {
        prevGameState = gameState;
        gameState = 0;
    }

    if (gameState == 0) {
        DrawImageToHelpUserPutTheirHandOverTheDevice();
        TrainKNNIfNotDone();
        return;
    } else if (gameState == 1) {
        UpdateHand(frame, 0, false);
        HandlePaused();
        return;
    }
    // in an active game mode. Launch call to determine current digit type.
    if (trainingCompleted) {
        Test();
    }
    console.log(observedDigit);

    currRevealDigitFrac = gameState == 2 ? 1.0 : revealDigitFrac;
    timeRemainFrac = getTimeFracRemaining(digitBeginTime, timePerDigit);

    revealDigit = timeRemainFrac <= currRevealDigitFrac;
    
    DrawTop(revealDigit);
    DrawSectionLines();
    DrawTimeRemaining(timeRemainFrac);
    DrawTimeRevealIcon(currRevealDigitFrac, revealDigitColor);
    DrawTimeRevealIcon(revealGestureFrac, 0);
    DrawLeaderBoard();
    DrawAccuracy();

    if (gameState == 3) {
        DrawEquation(currRevealDigitFrac < 1.0 ? revealDigitColor : 0, revealDigit);
    }
    if (revealDigit) {
        DrawDigit(currRevealDigitFrac < 1.0 ? revealDigitColor : 0);
    }
    if (timeRemainFrac <= revealGestureFrac) {
        DrawGesture();
    }
    signedDigitCorrectly =  mean_prediction_accuracy >= 0.7
    if (signedDigitCorrectly || (timeRemainFrac <= 0)) { // if accurate then user got the digit right.
        num_attempts_per_digit[currentDigit] += 1;
        curr_accuracy = mean_prediction_accuracies[currentDigit];
        curr_n = num_attempts_per_digit[currentDigit];
        mean_prediction_accuracies[currentDigit] = ((curr_n-1)*curr_accuracy + signedDigitCorrectly)/curr_n;
    
        // addDigitAttempt(signedDigitCorrectly)
    }
     if (signedDigitCorrectly || timeRemainFrac <= 0) {
        if (!signedDigitCorrectly) {
            consecutiveSuccesses = 0;
            consecutiveErrors += 1;
            if (consecutiveErrors >= 2) {
                 if (gameState == 3 && !showedMathExitWarning) {
                        prevGameState = 3;
                        gameState = 1;
                        showedMathExitWarning = true;
                }
            }
            background(200, 0, 0);
        } else {
            consecutiveErrors = 0;
            consecutiveSuccesses += 1;
            if (consecutiveSuccesses >= 3) {
                if (gameState == 2 && !showedMathEnterWarning) {
                    prevGameState = 2;
                    gameState = 1;
                    showedMathEnterWarning = true;
                }
            }
            background(0, 200, 0);
        }
        if (gameState != 1) {
            SwitchDigit();            
        }
    }
    UpdateHand(frame, currDigitAccuracies.mean(), true);
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
