// save the canvas for dimensions, and its 2d context for drawing to it
const FRAMES_PER_SECOND = 30;
const CAM_PAN_SPEED = 5;
const LIQUID_LAYOUT_FULLSCREEN = true; // fill any sized browser onresize?

var requireClickToStart = true; // workaround for local Chrome audio. Set false before deploying to itch

var camPanX = 0;
var camPanY = 0;

var masterFrameDelayTick = 0;

var canvas, canvasContext;
var player = new Player();
var timer = new Timer();
var intro;
var goodEnding;
var badEnding;
var outOfEngery;
var upTooLate;

var weather = new WeatherSystem(); // init weather system
// console.log("Weather system init complete.");

var items;
var interface;

var hasGameStartedByClick = false;
var isPaused = false;
var gameInterval;
var blurInterval;

//Change to false to disable main menu on open
var isMainMenuOpen = true;

function loadingDoneSoStartGame() {
    items = new Items();
    interface = new Interface();
    hasGameStartedByClick = true;
    startGameLoop();

    setupInput();
    extendBuildingCollision();

    timer.setupTimer();

    resetGame(true);  // has to be called after autoLoad or resources don't get setup correctly

    window.addEventListener('blur', windowOnBlur);
}

function resetGame(loadSave) {
    roomGrid = defaultRoomGrid.slice();
    player.reset();
    extendBuildingCollision();
    mouseClickToMoveRelease();

    setupBuckets();
    setupInventory();
    timer.resetDay();
}

function startGameLoop() {
    uiSelect.play();
    isPaused = false;
    startAudioEngine();
    timer.pauseTime(false);
    mouseClickToMoveRelease();
    // console.log("Game unpaused");

    // start the game engine's main render loop
    gameInterval = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
}

function gameLoop() {

    moveEverything();

    drawEverything();

    audioEventManager.updateEvents();
    mouseClickedThisFrame = false;
    toolKeyPressedThisFrame = false;

    //TODO add update for menus which need it (e.g. buttonMenus like mainMenu)
    if (interface.mainMenu.isVisible) {
        interface.mainMenu.update(mouseX, mouseY);
    }
    if (interface.loadGameMenu.isVisible) {
        interface.loadGameMenu.update(mouseX, mouseY);
    }
    if (interface.saveGameMenu.isVisible) {
        interface.saveGameMenu.update(mouseX, mouseY);
    }
    if (interface.ingameLoadGameMenu && interface.ingameLoadGameMenu.isVisible) {
        interface.ingameLoadGameMenu.update(mouseX, mouseY);
    }
    if (interface.ingameSaveGameMenu && interface.ingameSaveGameMenu.isVisible) {
        interface.ingameSaveGameMenu.update(mouseX, mouseY);
    }
    if (interface.creditsMenu.isVisible) {
        interface.creditsMenu.update(mouseX, mouseY);
    }

    if (intro && intro.currentlyPlaying) {
        draw(intro);
    }

    if (goodEnding && goodEnding.currentlyPlaying) {
        draw(goodEnding);
    }

    if (badEnding && badEnding.currentlyPlaying) {
        draw(badEnding);
    }

    if (outOfEngery && outOfEngery.currentlyPlaying) {
        draw(outOfEngery);
    }

    if (upTooLate && upTooLate.currentlyPlaying) {
        draw(upTooLate);
    }

}

function windowOnBlur() {
    if (gameInterval) {
        isPaused = true;
        clearInterval(gameInterval);
        gameInterval = false;
        timer.pauseTime(true);
        // @todo replace with a proper pause-screen
        colorRect(canvas.width / 2 - 100, canvas.height / 2 - 25, 200, 84, 'rgba(0,0,0,0.3)');
        canvasContext.textAlign = 'center';
        colorText('Game Paused', canvas.width / 2, canvas.height / 2, 'white');
        colorText('Press any key to continue', canvas.width / 2, canvas.height / 2 + 40, 'white');
        canvasContext.textAlign = 'left';
        // console.log("Game is now paused");
        stopAudioEngine();
        uiCancel.play();
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    canvas.addEventListener('mouseup', mouseupHandler);
    window.onresize();
    loadImages();

}  // end onload

window.onresize = function () {
    if (LIQUID_LAYOUT_FULLSCREEN) {

        // ensure canvas covers entire screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // adapt positions to new dimentsions
        if (window.interface) { // defined yet?

            // seems to work nicely
            interface.hotbarPane.hotbarItemX = HOTBAR_X();
            interface.hotbarPane.hotbarItemY = HOTBAR_Y();

            // the tab menu does not have hierarchical x,y coords for child objects
            // so we would have to adjust positions of every GUI element

            /*
            // this only moves the background
            interface.tabMenu.x = canvas.width * .25;
            interface.tabMenu.y = canvas.height * .25 - 30;

            // almost works..
            interface.audioPane.x = canvas.width * .25;
            interface.audioPane.y = canvas.height * .25
            interface.audioPane.width = canvas.width * .75;
            interface.audioPane.height = canvas.height * .75;

            // exceptthen we have to iterate through all of
            // interface.audioPane.pieces and reajust as well!
            // FORGET IT

            // same for Inventory pane
            this.inventoryPane.x = canvas.width * .14;
            this.inventoryPane.y = canvas.height * .25;
            this.inventoryPane.width = canvas.width * .855;
            this.inventoryPane.height = canvas.height * .85;

            // etc etc etc
            // this.winningInfoPane.y ...

            // what a pane
            */

        }
        // console.log("game resized to " + canvas.width + "x" + canvas.height);
    }
}

function setupInventory() {
    // player.inventory.clear();

    player.inventory.add(items.hoe.type, items.hoe.count);
    player.inventory.add(items.pickaxe.type, items.pickaxe.count);
    player.inventory.add(items.watercan.type, items.watercan.count);
    player.inventory.add(items.seedCorn.type, items.seedCorn.count);
    player.inventory.add(items.axe.type, items.axe.count);
    player.inventory.add(items.seedEggplant.type, items.seedEggplant.count);
    player.inventory.add(items.seedTomato.type, items.seedTomato.count);
    player.inventory.add(items.seedPotato.type, items.seedPotato.count);
    player.inventory.add(items.seedChili.type, items.seedChili.count);
    player.inventory.add(items.seedWheat.type, items.seedWheat.count);

    buildingStorage = new Inventory(30);
}

function moveEverything() {
    inputUpdate();
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

    updateAllEmitters(); // see ParticleSystem.js
    ParticleRenderer.renderAll(canvasContext); // particle FX

    drawRadiation();
    endCameraPan();

    drawSkyGradient();
    birds.draw(camPanX, camPanY);
    butterflies.draw(camPanX, camPanY);
    weather.draw(camPanX, camPanY);
    // drawBuildingChoiceMenu();
    // drawInterfaceForSelected();
    timer.drawTimer();
    // draw all the user interfaces
    draw(interface);
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

        0, 0, canvas.width, canvas.height); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
}
