// save the canvas for dimensions, and its 2d context for drawing to it
const PLAYER_START_UNITS = 1;
const ENEMY_START_UNITS = 20;
const CAM_PAN_SPEED = 5;
var camPanX = 0;
var camPanY = 0;

var canvas, canvasContext;
var player = new playerClass();
var timer = new TimerClass();

function loadingDoneSoStartGame() {
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
        mouseClickedThisFrame = false;
    }, 1000 / framesPerSecond);

    setupInput();
    player.reset();
    setupBuckets();
    timer.setupTimer();
}

window.onload = function() {
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
    camPanX = player.x - canvas.width  / 2;
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
    // clear the game view by filling it with black
    // colorRect(0, 0, canvas.width, canvas.height, 'black');
    startCameraPan();
    drawGroundTiles();
    player.draw();
    draw3DTiles();
    if (isBuildModeEnabled) {
        drawBuildingTileIndicator();
    }
    endCameraPan();
    player.drawPlayerHUD();
    drawBuildingChoiceMenu();
    drawInterfaceForSelected();
    timer.drawTimer();
}
