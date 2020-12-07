var controllerOptions = {};
var currentDigit = getRandomInt(10);

var y_grid = window.innerHeight / 64;
var x_grid = window.innerWidth / 64;

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
var timePerDigit = 5;
var revealDigitFrac = 0.8;
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


function SwitchDigit() {
    digitBeginTime = new Date();
    currentDigit = getRandomInt(10);

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
    } else if (getTimeDiffSeconds(handsLastSeenTime, currTime) > noHandsTimeout) {
        prevGameState = gameState;
        gameState = 0;
    }

    if (gameState == 0) {
        DrawImageToHelpUserPutTheirHandOverTheDevice();
        return;
    } else if (gameState == 1) {
        UpdateHand(frame, 0, false);
        HandlePaused();
        return;
    }
    currRevealDigitFrac = gameState == 2 ? 1.0 : revealDigitFrac;
    timeRemainFrac = getTimeFracRemaining(digitBeginTime, timePerDigit);

    revealDigit = timeRemainFrac <= currRevealDigitFrac;
    
    DrawTop(revealDigit);
    DrawSectionLines();
    DrawTimeRemaining(timeRemainFrac);
    DrawTimeRevealIcon(currRevealDigitFrac, revealDigitColor);
    DrawTimeRevealIcon(revealGestureFrac, 0);

    UpdateHand(frame, timeRemainFrac, true);
    
    DrawLeaderBoard();

    if (gameState == 3) {
        DrawEquation(currRevealDigitFrac < 1.0 ? revealDigitColor : 0, revealDigit);
    }
    if (revealDigit) {
        DrawDigit(currRevealDigitFrac < 1.0 ? revealDigitColor : 0);
    }
    if (timeRemainFrac <= revealGestureFrac) {
        DrawGesture();
    }
    if (timeRemainFrac <= 0) {
        background(0);
        SwitchDigit();
    }
}

Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});
