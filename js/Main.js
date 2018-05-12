// save the canvas for dimensions, and its 2d context for drawing to it
const FRAMES_PER_SECOND = 30;
const PLAYER_START_UNITS = 1;
const ENEMY_START_UNITS = 20;
const CAM_PAN_SPEED = 5;
var camPanX = 0;
var camPanY = 0;

var masterFrameDelayTick = 0;

var canvas, canvasContext;
var player = new playerClass();
var timer = new TimerClass();

var isPaused = false;
var gameInterval;

//Central Menu
var TabMenu; 
var InventoryPane;
var hotbarPane;

function loadingDoneSoStartGame() {
    startGameLoop();

    setupInput();
	setupUI(); //interface.js
    player.reset();
    setupBuckets();
    timer.setupTimer();
    if (autoSaveEnabled) {
        autoLoad();
    }
    startAudioEngine();
    //TODO remove this, it doesn't appear to be needed anymore.
		//inventoryUI = new inventoryUITest();
    setupInventory();
    window.addEventListener('blur', windowOnBlur);
}

function startGameLoop() {
    isPaused = false;
    gameInterval = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
}

function gameLoop() {
    moveEverything();
    drawEverything();
    AudioEventManager.updateEvents();
    mouseClickedThisFrame = false;
    toolKeyPressedThisFrame = false;
}

function windowOnBlur() {
    if (gameInterval) {
        isPaused = true;
        clearInterval(gameInterval);
        gameInterval = false;

        // @todo replace with a proper pause-screen
        colorRect(canvas.width / 2 - 100, canvas.height / 2 - 25, 200, 75, 'black');
        canvasContext.textAlign = 'center';
        colorText('Game Paused', canvas.width / 2, canvas.height  / 2, 'white');
        colorText('Press any key to continue', canvas.width / 2, canvas.height / 2 + 40, 'white');
        canvasContext.textAlign = 'left';
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    loadImages();

}  // end onload

function setupUI() {
    TabMenu = new tabMenuUI(canvas.width*.25, canvas.height*.25-30);
    //create a pane for testing
    var pane = new paneUI('Test Pane', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    TabMenu.push(pane);
    
    pane = new controlsInfoPaneUI('Controls', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    TabMenu.push(pane);
    
    pane = new inventoryPaneUI('Inventory', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    InventoryPane = pane;
    TabMenu.push(pane);

    TabMenu.switchTabIndex(0);
    //TabMenu.switchTabName('Controls');
    TabMenu.switchTabLeft(false);
    TabMenu.switchTabLeft();

    hotbarPane = new hotbarPaneUI();
}
function setupInventory() {
    inventory.add(items.hoe,1);
    inventory.add(items.axe,1);
    inventory.add(items.watercan,1);
}

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
    // drawBuildingChoiceMenu();
    // drawInterfaceForSelected();
    timer.drawTimer();
	// main UI
	drawUI(); //interface.js
}

function drawSkyGradient() {
        canvasContext.drawImage(
            timeOfDayGradient,
            (Math.floor(masterFrameDelayTick * 0.2) % timeOfDayGradient.width), 0, 1, 100, // source x,y,w,d (scroll source x over time)
            0, 0, 800, 600); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
}

function drawUI() {
    hotbarPane.draw();
    TabMenu.draw();
    //inventoryUI.draw(); // TODO DEBUG do not ship
    //TODO placeholder - display instructions
    colorText('press ENTER to toggle menu', canvas.width - 200, canvas.height - 25, 'white');
}
