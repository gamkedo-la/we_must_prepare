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
                    'Toggle Inventory - I',
                    'Use Tool - C',
                    'Plant Seeds - O',
                    'Open Inventory - E',
                    'Cycle Hotbar Forward - TAB',
                    'Cycle Hotbar Back - SHIFT+TAB',
                    'Build? - B',
                    '',
                    '------Mouse Controls------',
                    'Select - Mouse Left-Click',
                    'Move Inventory Item - Mouse Left-Click Drag',
                    'Cycle Hotbar - Mouse Scroll',
                    '',
                    '------Temporary Controls------',
                    'End Day - P',
                    'Pause Time - O'];

// Only one Interface (instanced in Main.js) in the game, with many Panes on it.
function Interface() {
    // Main Menu pane instance
    this.mainMenu = new MainMenuPane("Main Menu", 0, 0, canvas.width, canvas.height, true);    

    // put a test button on the Main Menu pane instance
    this.testButton = new Button(this.mainMenu, "Test Button", (canvas.width * 0.5) - 50, (canvas.height * 0.5) - 20, (canvas.width * 0.5) + 50, (canvas.height * 0.5) + 20);
    this.testButton.action = function () {
        this.isVisible = false; // make this test button invisible
        this.parentInterface.isVisible = false; // make the pane this test button is on invisible
        audioEventManager.addFadeEvent(menu_music_track, 0.5, 0);
        inGame_music_master.play();
        musicPastMainMenu = true;
    };

    // In-game Menu pane instance
    this.tabMenu = new TabMenuPane(this.inventoryPane, canvas.width * .25, canvas.height * .25 - 30);

    // Controls Info pane instance as a tab in the in-game Menu pane instance
    this.controlsInfoPane = new ControlsInfoPane('Controls', CONTROLS_INFO_TEXT, canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    this.tabMenu.push(this.controlsInfoPane);

    // Inventory pane instance as a tab in the in-game Menu pane instance
    this.inventoryPane = new InventoryPane('Inventory', canvas.width * .14, canvas.height * .25, canvas.width * .855, canvas.height * .85);
    this.tabMenu.push(this.inventoryPane);

    // Audio Settings pane instance as a tab in the in-game Menu pane instance
    this.audioPane = new AudioPane('Audio', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    this.tabMenu.push(this.audioPane);

    // Tab-switching code for the in-game Menu pane instance
    this.tabMenu.switchTabIndex(0);    
    const SCROLL_TO_THE_LEFT = true;
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT, false);
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT);

    // In-game Hotbar pane instance
    this.hotbarPane = new HotbarPane();

    // In-game instance of item picked up from the Inventory or Hotbar pane, attached to the mouse cursor.
    this.holdingSlot = new InventoryItemHeldAtMouseCursor();

    // Draw everything on the Interface (called from drawEverything() in Main.js)
    this.draw = function () {
        this.hotbarPane.draw();
        this.tabMenu.draw();
        this.mainMenu.draw();
        this.holdingSlot.draw();

        colorText('press ESC to toggle menu', canvas.width - 200, canvas.height - 15, 'white');
        colorText('press E to toggle inventory', canvas.width - 200, canvas.height - 25, 'white');
    };    
}

// utility and helper Interface functions
var inventorySlotInterfaceHelper = new InventorySlotInterfaceHelper();

function InventorySlotInterfaceHelper() {
    this.isAudioInterfaceInventorySelectPlaying = false;
    this.mouseHoveredXInventorySlot = mouseX;
    this.mouseHoveredYInventorySlot = mouseY;
    this.itemSpriteSheet = new SpriteSheet(itemSheet, 50, 50);// TODO maybe put the image size somewhere else
    this.selectedSlotSprite = new Sprite(targetTilePic, 64, 64);

    this.drawInventorySlot = function (itemX, itemY, slot) {
        if (slot.count > 0) {
            this.itemSpriteSheet.draw(itemX, itemY, slot.item, 0);
        }

        if (slot.count > 1) {
            colorText(slot.count, itemX - 3, itemY - 15, 'white');
        }
    };

    this.drawInventorySlotBackground = function (inventory, itemX, itemY, i) {
        if (inventory.selectedSlotIndex === i) {
            this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
            this.selectedSlotSprite.draw(itemX, itemY);
        } else {
            this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
        }
    };

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

function isInPane (pane, x, y) {
    if ( pane === null ) {
        return false; //no pane referenced
    }
    var topLeftX = pane.x;
    var topLeftY = pane.y;
    var bottomRightX = topLeftX + pane.width;
    var bottomRightY = topLeftY + pane.height;
    var boolResult = (x >= topLeftX && x <= bottomRightX &&
                      y >= topLeftY && y <= bottomRightY);
    return boolResult;
}

function drawInterfacePaneBackground(pane, backgroundColor = backgroundInterfaceColor, borderColor = borderInterfaceColor) {
    colorRect(pane.x, pane.y, pane.width, pane.height, backgroundColor)
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

const INTERFACE_Y = 500; // hacky please change
var mouseOverBuildingInterfaceIndex = -1;
var mouseOverButtonPerBuildingInterfaceIndex = -1;

function placeBuildingAtPixelCoord(building_type) {
    var indexToPlaceBuildingAt = getTileIndexAtPixelCoord(mouseX, mouseY);
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
    var mouseOverIndex = getTileIndexAtPixelCoord(mouseX, mouseY);
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
