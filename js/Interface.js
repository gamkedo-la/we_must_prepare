//TODO these colors match the weather UI image
//var backgroundUIColor = "#fefcc9";
//var borderUIColor = "#c69c6d";

var backgroundInterfaceColor = "beige";
var borderInterfaceColor = "#c69c6d";
var borderInterfaceWidth = 3;
var tabInterfaceBackgroundDark = "#eaeaae";

// Text for in-game menu pane, Controls Info tab
const CONTROLS_INFO_TEXT = ['------Keyboard Controls------',
    'Menu - ESC',
    'Movement - WASD, Arrow Keys',
    'Use Selected Tool - C',
    'Open Inventory - E',
    'Cycle Hotbar Forward - TAB',
    'Cycle Hotbar Back - SHIFT+TAB',
    '',
    '------Mouse Controls------',
    'Select - Mouse Left-Click',
    'Move Character - Mouse Left-Click (only when clicking in area current tool cannot work',
    'Stop Character Movement - Mouse Right-Click',
    'Move Inventory Item - Mouse Left-Click Drag',
    'Cycle Hotbar - Mouse Scroll',
    '',
    '------Temporary Controls------',
    'End Day - P',
    'Pause Time - O'];


// Only one Interface (instanced in Main.js) in the game, with many Panes on it.
function Interface() {
    // Main Menu pane instance
    this.mainMenu = Flow( new MainMenuPane("Main Menu", 0, 0, canvas.width, canvas.height, true), RectangleUpdater( obj=>0, obj=>0, obj=>canvas.width, obj=>canvas.height) );

    // put a test button on the Main Menu pane instance
    var gapY = 10;
    var buttonHeight = 40;
    var buttonSkip = gapY + buttonHeight;
    var buttonNum = 0;

    //////////////
    // To be short: interface position and width determination is decided by this set of functions.
    // Technique used here: we calculate the positions and sizes
    // relative to several other variables, so we store the way we are calculating these
    // in functions instead of values, then call them to update the positions and sizes. - Klaim
    MENU_TOP_Y = function(){ return (canvas.height * 0.5) - 20; };
    MENU_BUTTON_LEFT = function(){ return (canvas.width * 0.5) - 50; };
    MENU_BUTTON_TOP = function(buttonNum){ return MENU_TOP_Y() + buttonSkip * buttonNum; };
    MENU_BUTTON_WIDTH = function(){ return 100; };
    MENU_BUTTON_HEIGHT = function(buttonNum){ return buttonHeight; };

    MENU_BUTTON_POSITION_UPDATER = function(buttonNum){ // Generate position/size updater for menu buttons.
        return RectangleUpdater( obj => MENU_BUTTON_LEFT()         // how x is determined
                               , obj => MENU_BUTTON_TOP(buttonNum) // how y is determined
                               , obj => MENU_BUTTON_WIDTH()        // how width is determined
                               , obj => MENU_BUTTON_HEIGHT()       // how height is determined
                               );
    };
    //////////////

    this.newGame = Flow( new Button(this.mainMenu, "New Game"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
    buttonNum++;
    if (hasAnySaveState()) {
        this.loadGame = Flow( new Button(this.mainMenu, "Continue"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        buttonNum++;
    }
    this.credits = Flow( new Button(this.mainMenu, "Credits"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );

    this.newGame.action = function () {
        this.isVisible = false; // make this test button invisible
        this.parentInterface.isVisible = false; // make the pane this test button is on invisible
        audioEventManager.addFadeEvent(menu_music_track, 0.5, 0);
        inGame_music_master.play();
        musicPastMainMenu = true;

        // queue up an intro
        intro = new StoryTeller();
        intro.tellIntro();

        // Don't enable auto-save until you exit the menu
        activateAutoSave();

        interface.allowPlayerToSave();
    };

    if (this.loadGame) {
        this.loadGame.action = function () {
            this.parentInterface.isVisible = false;
            interface.loadGameMenu.isVisible = true;
        }
    }

    CANVAS_SIZE_POSITION_UPDATER = function(){ return new RectangleUpdater(pane=>0, pane=>0, pane=>canvas.width, pane=>canvas.height); };

    this.loadGameMenu = Flow( new LoadGamePane(this, 0, 0, canvas.width, canvas.height, false), CANVAS_SIZE_POSITION_UPDATER() );

    buttonNum = 0;
    if (hasAutoSaveState()) {

        this.autoLoadButton = Flow( new Button(this.loadGameMenu, "Load Auto-Save"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        this.autoLoadButton.action = function () {

            // This is different for each slot
            autoLoad();

            this.parentInterface.startTheGame();
        };
        buttonNum++;
    }

    if (hasManualSaveState(1)) {
        this.loadButton1 = Flow( new Button(this.loadGameMenu, "Load Slot 1"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        this.loadButton1.action = function () {
            // This is different for each slot
            load(1);

            this.parentInterface.startTheGame();
        };
        buttonNum++;
    }

    if (hasManualSaveState(2)) {
        this.loadButton2 = Flow( new Button(this.loadGameMenu, "Load Slot 2"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        this.loadButton2.action = function () {
            // This is different for each slot
            load(2);

            this.parentInterface.startTheGame();
        };
        buttonNum++;
    }

    if (hasManualSaveState(3)) {
        this.loadButton3 = Flow( new Button(this.loadGameMenu, "Load Slot 3"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        this.loadButton3.action = function () {
            // This is different for each slot
            load(3);

            this.parentInterface.startTheGame();
        };
    }
    // this.miniSaveGame = Flow( new Button(this.gameStatePane, "Save Game"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );

    this.saveGameMenu = Flow( new SaveGamePane(this, 0, 0, canvas.width, canvas.height, false), CANVAS_SIZE_POSITION_UPDATER() );

    // Get the save button to appear
    this.allowPlayerToSave = function () {
        buttonNum = 1;

        this.saveGame = Flow( new Button(this.mainMenu, "Save"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
        this.saveGame.action = function () {
            interface.saveGameMenu.isVisible = true;
            interface.mainMenu.isVisible = false;
        };

        if (!hasAnySaveState()) {
            this.credits.y += buttonSkip;
        }

        // Hide the load button so that it doesn't intercept clicks
        if (this.loadGame) {
            this.loadGame.isVisible = false;
        }

        // Hide the new game button if you haven't already
        this.newGame.isVisible = false;
    };

    this.credits.action = function () {
        this.parentInterface.isVisible = false;
        interface.creditsMenu.isVisible = true;
    };

    // Credits menu
    this.creditsMenu = Flow( new CreditPane("Credits Menu", 0, 0, canvas.width, canvas.height, false), RectangleUpdater( obj=>0, obj=>0, obj=>canvas.width, obj=>canvas.height) );

    this.backButton = Flow( new Button(this.creditsMenu, "Main Menu"), RectangleUpdater( obj=>(canvas.width/2) - (MENU_BUTTON_WIDTH()/2)
                                                                                       , obj=>canvas.height - MENU_BUTTON_HEIGHT(0) - 40
                                                                                       , obj=>MENU_BUTTON_WIDTH()
                                                                                       , obj=>MENU_BUTTON_HEIGHT(0))
                                                                                       );
    this.backButton.action = function () {
        this.parentInterface.isVisible = false;
        interface.mainMenu.isVisible = true;
    };

    PANE_X = function(pane){ return canvas.width * .25; };
    PANE_Y = function(pane){ return canvas.height * .25; };
    PANE_WIDTH = function(pane){ return (canvas.width * .75) - PANE_X(pane); };
    PANE_HEIGHT = function(pane){ return (canvas.height * .75) - PANE_Y(pane); };
    DEFAULT_PANE_POSITION_UPDATER = function() { return new RectangleUpdater( PANE_X, PANE_Y, PANE_WIDTH, PANE_HEIGHT ); };

    // In-game Menu pane instance
    this.tabMenu = Flow( new TabMenuPane(this.inventoryPane, 30), RectangleUpdater(pane=> PANE_X(), pane=>PANE_Y() - 30) );

    // Controls Info pane instance as a tab in the in-game Menu pane instance
    this.controlsInfoPane = Flow( new ControlsInfoPane('Controls', CONTROLS_INFO_TEXT), DEFAULT_PANE_POSITION_UPDATER() );
    this.tabMenu.push(this.controlsInfoPane);

    // Audio Settings pane instance as a tab in the in-game Menu pane instance
    this.audioPane = Flow( new AudioPane('Audio'), DEFAULT_PANE_POSITION_UPDATER() );
    this.tabMenu.push(this.audioPane);

    // Inventory pane instance as a tab in the in-game Menu pane instance
    INVENTORY_X = function(pane) { return canvas.width * .14; };
    INVENTORY_Y = function(pane) { return canvas.height * .25; };
    INVENTORY_WIDTH = function(pane) { return (canvas.width * .855) - INVENTORY_X(pane); };
    INVENTORY_HEIGHT = function(pane) { return (canvas.height * .85) - INVENTORY_Y(pane); };
    INVENTORY_POSITION_UPDATER = function(){ return new RectangleUpdater(INVENTORY_X, INVENTORY_Y, INVENTORY_WIDTH, INVENTORY_HEIGHT); };

    this.inventoryPane = Flow( new InventoryPane('Inventory'), INVENTORY_POSITION_UPDATER() );
    this.tabMenu.push(this.inventoryPane);

    // Winning Info pane instance as a tab in the in-game Menu pane instance
    this.winningInfoPane = Flow( new WinningPane('Objective'), DEFAULT_PANE_POSITION_UPDATER() );
    this.tabMenu.push(this.winningInfoPane);

    // Game State (load/save/main menu) pane instance as a tab in the in-game Menu pane instance
    this.gameStatePane = Flow( new GameManagementPane('Mini-Main Menu'), DEFAULT_PANE_POSITION_UPDATER() );
    this.tabMenu.push(this.gameStatePane);
    buttonNum = 0;

    this.miniLoadGame = Flow( new Button(this.gameStatePane, "Load Game"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );
    buttonNum++;
    this.miniSaveGame = Flow( new Button(this.gameStatePane, "Save Game"), MENU_BUTTON_POSITION_UPDATER(buttonNum) );

    // Tab-switching code for the in-game Menu pane instance
    this.tabMenu.switchTabIndex(0);
    const SCROLL_TO_THE_LEFT = true;
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT, false);
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT);

    // In-game Hotbar pane instance
    this.hotbarPane = Flow( new HotbarPane(), RectangleUpdater() );

    // In-game instance of item picked up from the Inventory or Hotbar pane, attached to the mouse cursor.
    this.itemsHeldAtMouse = Flow( new ItemsHeldAtMouse(), RectangleUpdater() );
    // Draw everything on the Interface (called from drawEverything() in Main.js)
    this.draw = function () {
        player.drawPlayerHUD();
        draw(this.hotbarPane);
        draw(this.tabMenu);
        draw(this.mainMenu);
        draw(this.loadGameMenu);
        draw(this.saveGameMenu);
        draw(this.itemsHeldAtMouse);
        draw(this.creditsMenu);
        colorText('press ESC to toggle menu', canvas.width - 200, canvas.height - 15, 'white');
        colorText('press E to toggle inventory', canvas.width - 200, canvas.height - 25, 'white');
    };

}

// Tool animation function

var toolAnimList = [];

var toolAnimatorAtAngle = function (itemX, itemY, itemKind, spritesPerRow) {
    this.framesLeft = 30;
    this.animAng = 0;
    if (typeof spritesPerRow === "undefined") {
        spritesPerRow = 10;
    }
    this.draw = function () {
        this.framesLeft--;
        let row = 0;
        let col = itemKind % spritesPerRow;

        if (itemKind >= spritesPerRow || itemKind % spritesPerRow == 0) {
            row++;   // move one row down
        }
        // this.animAng += 0.02;
        inventorySlotInterfaceHelper.itemSpriteSheet.drawExtended(itemX, itemY, col, row, 0, false, 0.5, 0.5);
        // inventorySlotInterfaceHelper.itemSpriteSheet.draw(itemX, itemY, col, row);
    }
};

// utility and helper Interface functions
var inventorySlotInterfaceHelper = new InventorySlotInterfaceHelper();

function InventorySlotInterfaceHelper() {
    this.isAudioInterfaceInventorySelectPlaying = false;
    this.mouseHoveredXInventorySlot = mouseX;
    this.mouseHoveredYInventorySlot = mouseY;
    this.itemSpriteSheet = new SpriteSheet(itemSheet, 50, 50);// TODO maybe put the image size somewhere else
    this.selectedSlotSprite = new Sprite(targetTilePic, 64, 64);

    this.drawInventorySlot = function (itemX, itemY, slot, spritesPerRow) {
        if (typeof spritesPerRow === "undefined") {
            spritesPerRow = 10;
        };
        let row = 0;
        let col = slot.item % spritesPerRow;

        if (slot.item >= spritesPerRow || slot.item % spritesPerRow == 0) {
            row++;   // move one row down
        }

        // draw item graphic
        if (slot.count > 0) {
            let offsetY = itemY;

            switch (slot.item) {
                case items.seedCorn.type:
                case items.seedTomato.type:
                case items.seedEggplant.type:
                case items.seedPotato.type:
                case items.seedChili.type:
                case items.seedWheat.type:
                    offsetY = itemY - 10;
                    break;
            }

            this.itemSpriteSheet.draw(itemX, offsetY, col, row);

            switch (slot.item) {
                case items.watercan.type:
                    const WATERCAN_BAR_W = 32;
                    const WATERCAN_BAR_H = 4;

                    var waterLeftIndicator = (items.watercan.waterLeft / items.watercan.waterCapcity) * WATERCAN_BAR_W;
                    var waterCapacityIndicator = (WATERCAN_BAR_W * items.watercan.waterCapcity) / items.watercan.waterCapcity;

                    colorRect(itemX - WATERCAN_BAR_W * 0.5, itemY - 20, waterCapacityIndicator, WATERCAN_BAR_H, "rgba(0,0,127,0.25)");
                    colorRect(itemX - WATERCAN_BAR_W * 0.5, itemY - 20, waterLeftIndicator, WATERCAN_BAR_H, "rgba(0,0,255,1.0)");
                    break;
            }
        }

        // draw stackable item count
        if (slot.count > 1) {
            let circleRadius = slot.count > 99 ? 14 : (slot.count > 9 ? 12 : 10);
            let textOffset = slot.count > 99 ? 1 : (slot.count > 9 ? 5 : 7);
            colorCircle(itemX + 13, itemY + 12, circleRadius, 'brown');
            outlineCircle(itemX + 13, itemY + 12, circleRadius, 'beige');
            colorText("x" + slot.count, itemX + textOffset, itemY + 16, 'beige');
        }
    };

    this.drawInventorySlotBackground = function (inventory, itemX, itemY, i) {
        if (inventory.selectedSlotIndex === i) {
            colorRect(itemX - 25, itemY - 25, 50, 50, 'grey', 4);
            this.selectedSlotSprite.draw(itemX, itemY);
        } else {
            colorRect(itemX - 25, itemY - 25, 50, 50, 'grey', 4);
        }
    };

    this.drawToolTips = function (inventory, itemX, itemY, i) {
        if (inventory.selectedSlotIndex === i) {
            let itemTypeAtThisIndex = inventory.slots[i].item;

            for (let j = 0; j < itemTrackingArray.length; j++) {
                if (itemTypeAtThisIndex == itemTrackingArray[j].type && itemTypeAtThisIndex != items.nothing.type) {
                    itemTrackingArray[j].drawToolTip(mouseX + 20, mouseY + 30);
                    break;
                }
            }
        }
    }

    this.mouseHoverInventorySlotToSelect = function (inventory, itemX, itemY, i) {
        if (mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {
            inventory.selectedSlotIndex = i;

            if (this.mouseHoveredXInventorySlot != mouseX || this.mouseHoveredYInventorySlot != mouseY) {
                if (this.mouseHoveredXInventorySlot > itemX - 25 && this.mouseHoveredXInventorySlot < itemX + 25 && this.mouseHoveredYInventorySlot > itemY - 25 && this.mouseHoveredYInventorySlot < itemY + 25) {
                    this.isAudioInterfaceInventorySelectPlaying = false;
                }
                else if (!this.isAudioInterfaceInventorySelectPlaying) {
                    uiInventorySelect.play();
                    this.isAudioInterfaceInventorySelectPlaying = true;
                }
            }

            this.mouseHoveredXInventorySlot = mouseX;
            this.mouseHoveredYInventorySlot = mouseY;
        }
    };
}

function isInPane(pane, x, y) {
    if (pane === null) {
        console.log("No pane detected");
        return false; //no pane referenced
    }
    var topLeftX = pane.x;
    var topLeftY = pane.y;
    var bottomRightX = topLeftX + pane.width;
    var bottomRightY = topLeftY + pane.height;
    var boolResult = (x >= topLeftX && x <= bottomRightX &&
        y >= topLeftY && y <= bottomRightY);
    // console.log("topLeftX: " + topLeftX + " TopeLeftY: " + topLeftY + " bottomRightX: " + bottomRightX + " bottomRightY: " + bottomRightY);
    return boolResult;
}

function drawInterfacePaneBackground(pane, backgroundColor = backgroundInterfaceColor, borderColor = borderInterfaceColor) {
    colorRect(pane.x, pane.y, pane.width, pane.height, backgroundColor);
    drawInterfacePaneBorder(pane, borderInterfaceWidth, borderColor);
}

function drawInterfacePaneBorder(pane, borderWidth, color) {
    //draw border lines -
    colorRect(pane.x, pane.y - borderWidth, pane.width, borderWidth, color);
    colorRect(pane.x + pane.width, pane.y, borderWidth, pane.height, color);
    colorRect(pane.x, pane.y + pane.height, pane.width, borderWidth, color);
    colorRect(pane.x - borderWidth, pane.y, borderWidth, pane.height, color);
    //draw round corners
    //color *should* be the same from previous calls
    canvasContext.beginPath();
    canvasContext.arc(pane.x + pane.width, pane.y, borderWidth, -0.5 * Math.PI, 0);
    canvasContext.lineTo(pane.x + pane.width, pane.y);
    canvasContext.fill();

    canvasContext.beginPath();
    canvasContext.arc(pane.x + pane.width, pane.y + pane.height, borderWidth, 0, 0.5 * Math.PI);
    canvasContext.lineTo(pane.x + pane.width, pane.y + pane.height);
    canvasContext.fill();

    canvasContext.beginPath();
    canvasContext.arc(pane.x, pane.y + pane.height, borderWidth, 0.5 * Math.PI, Math.PI);
    canvasContext.lineTo(pane.x, pane.y + pane.height);
    canvasContext.fill();

    canvasContext.beginPath();
    canvasContext.arc(pane.x, pane.y, borderWidth, Math.PI, -0.5 * Math.PI);
    canvasContext.lineTo(pane.x, pane.y);
    canvasContext.fill();
}

function HOTBAR_X() { return canvas.width * 0.5 - 115 }
function HOTBAR_Y() { return canvas.height - 50; }

var mouseOverBuildingInterfaceIndex = -1;
var mouseOverButtonPerBuildingInterfaceIndex = -1;

function placeBuildingAtPixelCoord(building_type) {
    if (DEBUG_MOUSE) { console.log('placeBuildingAtPixelCoord mouseX=' + mouseX + ' mouseY=' + mouseY); }
    var indexToPlaceBuildingAt = getTileIndexAtPixelCoord(mouseWorldX, mouseWorldY);
    var indexForPlayer = getTileIndexAtPixelCoord(player.x, player.y);
    if (indexToPlaceBuildingAt == indexForPlayer) {
        console.log("Can't build on player!")
        badBuildingPlacement = true;
        return;
    } else {
        roomGrid[indexToPlaceBuildingAt] = building_type;
    }
}

function drawBuildingTileIndicator() {
    var mouseOverIndex = getTileIndexAtPixelCoord(mouseWorldX, mouseWorldY);
    var mouseOverRow = Math.floor(mouseOverIndex / ROOM_COLS);
    var mouseOverCol = mouseOverIndex % ROOM_COLS;
    var topLeftX = mouseOverCol * TILE_W;
    var topLeftY = mouseOverRow * TILE_H;

    coloredOutlineRectCornerToCorner(topLeftX, topLeftY, topLeftX + TILE_W, topLeftY + TILE_H, 'yellow');
}

function drawBuildingChoiceMenu() {

    var buttonCount = buildingDefs.length;
    var topLeftX = canvas.width - BUTTON_DIM * buttonCount;
    var topLeftY = canvas.height - BUTTON_DIM;
    var buttonColor;
    mouseOverBuildingInterfaceIndex = -1;
    for (var i = 0; i < buttonCount; i++) {
        var buttonTLX = topLeftX + BUTTON_MARGIN;
        var buttonTLY = topLeftY + BUTTON_MARGIN;
        var buttonDrawDim = BUTTON_DIM - BUTTON_MARGIN * 2;
        var buttonBRX = buttonTLX + buttonDrawDim;
        var buttonBRY = buttonTLY + buttonDrawDim;

        if (resourcesAvailableToBuild(i)) {
            buttonColor = 'pink';
        } else {
            buttonColor = 'grey';
        }
        colorRect(buttonTLX, buttonTLY, buttonDrawDim, buttonDrawDim, buttonColor);
        colorText(buildingDefs[i].name, buttonTLX, buttonTLY + 10, 'black');
        if (mouseX > buttonTLX && mouseY > buttonTLY && mouseX < buttonBRX && mouseY < buttonBRY) {
            coloredOutlineRectCornerToCorner(buttonTLX, buttonTLY, buttonBRX, buttonBRY, 'black');
            mouseOverBuildingInterfaceIndex = i;
        }
        topLeftX += BUTTON_DIM;
    }
}

function drawInterfaceForSelected() {
    var topLeftY = canvas.height - BUTTON_DIM;
    var textBoxLeft = BUTTON_MARGIN;
    var textBoxTop = topLeftY + BUTTON_MARGIN;
    var buttonDrawDim = BUTTON_DIM - BUTTON_MARGIN * 2;
    var textInfoWidth = 3 * BUTTON_DIM - BUTTON_MARGIN * 2;
    var buttonCount = perBuildingButtonDefs.length;

    colorRect(textBoxLeft, textBoxTop, textInfoWidth, buttonDrawDim, 'yellow');
    textBoxTop += 10;
    var textLineY = textBoxTop + 15;
    var textLineX = textBoxLeft;

    if (selectedIndex == PLAYER_SELECTED) {
        colorText('right-click to deselect player', textLineX, textLineY, 'black');
        return;
    }
    var buildingDataToShow = undefined;
    if (selectedIndex != -1) {
        buildingDataToShow = tileKindToBuildingDef(roomGrid[selectedIndex]);
        colorText('Stats for ' + buildingDataToShow.name, textBoxLeft, textBoxTop, 'black');
    } else if (mouseOverBuildingInterfaceIndex != -1) {
        buildingDataToShow = buildingDefs[mouseOverBuildingInterfaceIndex];
        colorText('Cost to Build ' + buildingDataToShow.name, textBoxLeft, textBoxTop, 'black');
    } else {
        colorText('Click player or building to select', textBoxLeft, textBoxTop, 'black');
    }
    mouseOverButtonPerBuildingInterfaceIndex = -1;
    if (buildingDataToShow != undefined) {

        if (selectedIndex != -1) {
            var buttonTLX = textInfoWidth + textBoxLeft + BUTTON_MARGIN;
            var buttonTLY = topLeftY + BUTTON_MARGIN;
            var buttonBRX = buttonTLX + buttonDrawDim;
            var buttonBRY = buttonTLY + buttonDrawDim;
            var buildingDefsAtTile = tileKindToBuildingDef(roomGrid[selectedIndex]);
            for (var i = 0; i < buttonCount; i++) {
                colorRect(buttonTLX, buttonTLY, buttonDrawDim, buttonDrawDim, 'gray');
                colorText(perBuildingButtonDefs[i].name, buttonTLX, buttonTLY + 10, 'black');
                if (perBuildingButtonDefs[i].label == 'sell') {

                    colorText('M: ' + Math.ceil(buildingDefsAtTile.Metal * PERCENTAGE_REFUND), buttonTLX, buttonTLY + 20, 'black');
                    colorText('W: ' + Math.ceil(buildingDefsAtTile.Wood * PERCENTAGE_REFUND), buttonTLX, buttonTLY + 30, 'black');
                    colorText('S: ' + Math.ceil(buildingDefsAtTile.Stone * PERCENTAGE_REFUND), buttonTLX, buttonTLY + 40, 'black');
                }
                if (mouseX > buttonTLX && mouseY > buttonTLY && mouseX < buttonBRX && mouseY < buttonBRY) {
                    coloredOutlineRectCornerToCorner(buttonTLX, buttonTLY, buttonBRX, buttonBRY, 'black');
                    mouseOverBuildingInterfaceIndex = -1;
                    mouseOverButtonPerBuildingInterfaceIndex = i;
                }
                buttonTLX += BUTTON_DIM;
                buttonBRX += BUTTON_DIM;
            }
        } else {
            for (var key in buildingDataToShow) {
                if (key == 'name' || key == 'onClick' || key == 'label' || key == 'tile') {
                    continue;
                }
                var costString = key + ': ' + buildingDataToShow[key] + ' ';
                canvasContext.fillText(costString, textLineX, textLineY);
                textLineX += canvasContext.measureText(costString).width;
            }
        } // end if selectedIndex != -1
    }
}
