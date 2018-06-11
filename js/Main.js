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

var hasGameStartedByClick = false;
var isPaused = false;
var gameInterval;
var blurInterval;

//Change to false to disable main menu on open
var isMainMenuOpen = true;

//Central Menu
var InventoryPane;
var HotbarPane;
var TabMenu;
var MainMenu;
var HoldingSlot;

function loadingDoneSoStartGame() {
    hasGameStartedByClick = true;
    startGameLoop();

    setupInput();
    setupUI(); //interface.js
    extendBuildingCollision();
    
    timer.setupTimer();

    resetGame(true);  // has to be called after autoLoad or resources don't get setup correctly
    
    
    window.addEventListener('blur', windowOnBlur);
}

function resetGame(loadSave) {
    roomGrid = defaultRoomGrid.slice();
    player.reset();
    
    if (loadSave) {
        if (autoSaveEnabled) {
            autoLoad();
        }
    }
    setupBuckets();
    setupInventory();
    timer.resetDay();
}

function startGameLoop() {
    uiSelect.play();
    isPaused = false;
    startAudioEngine();
    gameInterval = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
    timer.pauseTime(false);
    console.log("Game unpaused");
}

function gameLoop() {
    moveEverything();
    drawEverything();
    AudioEventManager.updateEvents();
    mouseClickedThisFrame = false;
    mouseDblClickedThisFrame = false;
    toolKeyPressedThisFrame = false;
    //TODO add update for menus which need it (e.g. buttonMenus like mainMenu)
    if (MainMenu.isVisible) {
        MainMenu.update(mouseX, mouseY);
    }
}

function windowOnBlur() {
    if (gameInterval) {
        isPaused = true;
        clearInterval(gameInterval);
        gameInterval = false;
        timer.pauseTime(true);
        // @todo replace with a proper pause-screen
        colorRect(canvas.width / 2 - 100, canvas.height / 2 - 25, 200, 75, 'black');
        canvasContext.textAlign = 'center';
        colorText('Game Paused', canvas.width / 2, canvas.height / 2, 'white');
        colorText('Press any key to continue', canvas.width / 2, canvas.height / 2 + 40, 'white');
        canvasContext.textAlign = 'left';
        console.log("Game is now paused");
        stopAudioEngine();
        uiCancel.play();
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    canvas.addEventListener('mouseup', mouseupHandler);
    loadImages();

}  // end onload

function setupUI() {
    MainMenu = new buttonMenuUI("Main Menu", 0, 0, canvas.width, canvas.height);
    var button = new buttonUI("Test Button", (canvas.width * 0.5) - 50, (canvas.height * 0.5) - 20, (canvas.width * 0.5) + 50, (canvas.height * 0.5) + 20);
    button.action = function () {
        MainMenu.isVisible = false;
        AudioEventManager.addFadeEvent(menu_music_track, 0.5, 0);
        inGame_music_master.play();
        musicPastMainMenu = true;
    };
    MainMenu.push(button);

    TabMenu = new tabMenuUI(canvas.width * .25, canvas.height * .25 - 30);
    //var pane = new paneUI('Test Pane', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    //TabMenu.push(pane);
    pane = new controlsInfoPaneUI('Controls', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    TabMenu.push(pane);

    pane = new inventoryPaneUI('Inventory', canvas.width * .14, canvas.height * .25, canvas.width * .855, canvas.height * .85);
    InventoryPane = pane;
    TabMenu.push(pane);

    var pane = new audioPaneUI('Audio', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    TabMenu.push(pane);

    TabMenu.switchTabIndex(0);
    //TabMenu.switchTabName('Controls');
    const SCROLL_TO_THE_LEFT = true;
    TabMenu.switchTab(SCROLL_TO_THE_LEFT, false);
    TabMenu.switchTab(SCROLL_TO_THE_LEFT);

    HotbarPane = new hotbarPaneUI();
    HoldingSlot = new holdingSlotUI();
}

function setupInventory() {
    // player.inventory.clear();
    player.inventory.add(items.hoe, 1);
    player.inventory.add(items.pickaxe, 1);
    player.inventory.add(items.watercan, 1);
    player.inventory.add(items.wheatSeedOne, 3);
    player.inventory.add(items.axe, 1);
    player.inventory.add(items.wheatSeedTwo, 3);
}

function moveEverything() {
    inputUpdate();
    interfaceUpdate();
    handleRadiationGrowth();
}
var camDeltaX;
var camDeltaY;

function startCameraPan() {
    var cameraRightMax = ROOM_COLS * TILE_W - canvas.width;
    var cameraBottomMax = ROOM_ROWS * TILE_H - canvas.height;
    var campanXWas = camPanX;
    var campanYWas = camPanY;
    camPanX = player.x - canvas.width / 2;
    camPanY = player.y - canvas.height / 2;
    camDeltaX = camPanX - campanXWas;
    camDeltaY = camPanY - campanYWas;
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
    drawRadiation();
    endCameraPan();
    drawSkyGradient();
    wildlife.draw(camPanX, camPanY);
    //console.log("DID WE GET HERE");
    if (weather)
        weather.draw(camPanX, camPanY);         /// FIXME this is never run... WHY?!
    else
        console.log("No weather system found!");
    //console.log("YES WE DID");
    player.drawPlayerHUD();
    // drawBuildingChoiceMenu();
    // drawInterfaceForSelected();
    timer.drawTimer();
    // main UI
    drawUI(); //interface.js
}

function drawSkyGradient() {
    var dayPercent = timer.secondsInDay / SECONDS_PER_DAY;
    var skyX = Math.floor(dayPercent * timeOfDayGradient.width);
    //console.log("day %:" + dayPercent);
    //console.log("sky x:" + skyX);

    canvasContext.drawImage(
        timeOfDayGradient,

        // old way: frame locked, mismatched with weather sun etc
        // (Math.floor(masterFrameDelayTick * 0.2) % timeOfDayGradient.width), 0, 1, 100, // source x,y,w,d (scroll source x over time)

        // new way: uses timer current value for % of day elapsed
        skyX, 0, 1, 100, // source x,y,w,d (scroll source x over time)

        0, 0, 800, 600); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
}

function drawUI() {
    HotbarPane.draw();
    TabMenu.draw();
    MainMenu.draw();
    HoldingSlot.draw();

    //TODO placeholder - display instructions
    colorText('press ESC to toggle menu', canvas.width - 200, canvas.height - 15, 'white');
    colorText('press E to toggle inventory', canvas.width - 200, canvas.height - 25, 'white');
}
