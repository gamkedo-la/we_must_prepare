// save the canvas for dimensions, and its 2d context for drawing to it
const PLAYER_START_UNITS = 1;
const ENEMY_START_UNITS = 20;
const CAM_PAN_SPEED = 5;
var camPanX = 0;
var camPanY = 0;

var masterFrameDelayTick = 0;

var renderSkyGradient = false;

var canvas, canvasContext;
var player = new playerClass();
var timer = new TimerClass();

function loadingDoneSoStartGame() {
    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
        AudioEventManager.updateEvents();
        mouseClickedThisFrame = false;
        toolKeyPressedThisFrame = false;
    }, 1000 / framesPerSecond);

    setupInput();
    player.reset();
    setupBuckets();
    timer.setupTimer();
    inGame_music_master.play();
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    loadImages();

}  // end onload

function moveEverything() {
    inputUpdate();
    interfaceUpdate();
}

function startCameraPan() {
    var cameraRightMax = ROOM_COLS * TILE_W - canvas.width;
    var cameraBottomMax = ROOM_ROWS * TILE_H - canvas.height;
    camPanX = player.x - canvas.width / 2;
    camPanY = player.y - canvas.height / 2;
    if (camPanX < 0) {
        camPanX = 0;
    }
    if (camPanX > cameraRightMax) {
        camPanX = cameraRightMax;
    }
    if (camPanY < 0) {
        camPanY = 0;
    }
    if (camPanY > cameraBottomMax) {
        camPanY = cameraBottomMax;
    }
    canvasContext.save();
    canvasContext.translate(Math.floor(-camPanX), Math.floor(-camPanY));
}

function endCameraPan() {
    canvasContext.restore();
}

function drawEverything() {
    masterFrameDelayTick++;
    // clear the game view by filling it with black
    // colorRect(0, 0, canvas.width, canvas.height, 'black');
    startCameraPan();
    drawGroundTiles();
    //player.draw(); // now drawn in world.js under draw3DTiles();
    draw3DTiles();
    if (isBuildModeEnabled) {
        drawBuildingTileIndicator();
    }
    endCameraPan();
    drawSkyGradient();
    weather.draw();
    player.drawPlayerHUD();
    drawBuildingChoiceMenu();
    drawInterfaceForSelected();
    timer.drawTimer();
}

function drawSkyGradient() {
    if (renderSkyGradient) {
        canvasContext.drawImage(
            timeOfDayGradient,
            (Math.floor(masterFrameDelayTick * 0.2) % timeOfDayGradient.width), 0, 1, 100, // source x,y,w,d (scroll source x over time)
            0, 0, 800, 600); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
    }
}
