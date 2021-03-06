oneFrameOfData = nj.array([[[0.49547,0.44725, 1,0.49547,0.44725, 1],
        [0.49547,0.44725, 1,0.38713,0.51581, 1],
        [0.38713,0.51581, 1,0.34834,0.54307,0.83578],
        [0.34834,0.54307,0.83578,0.33346,0.55511,0.68276]],
       [[0.5516,0.52911, 1,0.47177,0.67857,0.90196],
        [0.47177,0.67857,0.90196,0.44407,0.76042,0.65074],
        [0.44407,0.76042,0.65074,0.41598,0.75657,0.49605],
        [0.41598,0.75657,0.49605,0.39277,0.7258,0.40009]],
       [[0.6,0.52948, 1,0.56171,0.66406,0.875],
        [0.56171,0.66406,0.875,0.57493,0.75268,0.58705],
        [0.57493,0.75268,0.58705,0.555,0.7505,0.40018],
        [0.555,0.7505,0.40018,0.52931,0.71949,0.29254]],
       [[0.6465,0.51642, 1,0.64955,0.6268,0.87632],
        [0.64955,0.6268,0.87632,0.66711,0.70952,0.61061],
        [0.66711,0.70952,0.61061,0.64532,0.70755,0.42923],
        [0.64532,0.70755,0.42923,0.61561,0.67667,0.32502]],
       [[0.68377,0.4745, 1,0.72187,0.57381,0.87554],
        [0.72187,0.57381,0.87554,0.74256,0.63337,0.66224],
        [0.74256,0.63337,0.66224,0.72329,0.63125,0.53555],
        [0.72329,0.63125,0.53555,0.68838,0.60472,0.44428]]]);


anotherFrameOfData = nj.array([[[ 364.43738, 194.12608,   222.017, 364.43738, 194.12608,   222.017],
        [ 364.43738, 194.12608,   222.017, 246.16255, 180.02048,   176.395],
        [ 246.16255, 180.02048,   176.395, 217.55425, 176.53632,   142.657],
        [ 217.55425, 176.53632,   142.657, 248.33423, 180.09728,   119.845]],
       [[ 458.55584,  169.3376,   220.044, 391.87251,    139.68,   150.879],
        [ 391.87251,    139.68,   150.879, 295.46756, 143.40864,   110.316],
        [ 295.46756, 143.40864,   110.316, 246.56265,   168.928,   98.5976],
        [ 246.56265,   168.928,   98.5976, 231.69001, 190.52672,   100.222]],
       [[ 542.40735,   170.016,    217.57,  543.5318, 144.57984,   150.692],
        [  543.5318, 144.57984,   150.692, 527.81374, 144.63488,   102.545],
        [ 527.81374, 144.63488,   102.545, 459.62602, 170.59456,   85.1872],
        [ 459.62602, 170.59456,   85.1872, 406.58441, 192.57856,   85.0263]],
       [[ 622.84721, 174.73408,   215.647, 687.03356, 155.29088,   155.581],
        [ 687.03356, 155.29088,   155.581, 676.25406, 153.62816,   110.947],
        [ 676.25406, 153.62816,   110.947, 603.60824,  176.2304,   92.3295],
        [ 603.60824,  176.2304,   92.3295,  541.8479,  197.0624,   89.9986]],
       [[  688.1283, 188.29824,   214.143, 805.01928,    170.88,   160.338],
        [ 805.01928,    170.88,   160.338, 803.49402, 167.41504,   125.084],
        [ 803.49402, 167.41504,   125.084, 741.47448, 180.80512,   111.167],
        [ 741.47448, 180.80512,   111.167, 668.99149,  197.8624,   107.848]]]);


var frameIndex =  0;
function draw() {

    clear();

    currFrame = test.pick(null, null, null, frameIndex);

    for (var finger_id = 0; finger_id < 5; finger_id++) {
        for (var bone_id = 0; bone_id < 4; bone_id++) {

            xStart = currFrame.get(finger_id, bone_id, 0);
            yStart = currFrame.get(finger_id, bone_id, 1);
            zStart = currFrame.get(finger_id, bone_id, 2);
            xEnd = currFrame.get(finger_id, bone_id, 3);
            yEnd = currFrame.get(finger_id, bone_id, 4);
            zStart = currFrame.get(finger_id, bone_id, 5);


            xStart *=  window.innerWidth;
            xEnd *=  window.innerWidth;

            yStart = (1-yStart) * window.innerHeight;
            yEnd = (1-yEnd) * window.innerHeight;

            line(xStart, yStart, xEnd, yEnd);
        }
    }
    frameIndex += 1 ;

    if (frameIndex == 100) {
        frameIndex = 0;
    }

}
