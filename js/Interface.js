//TODO these colors match the weather UI image
//var BackgroundUIColor = "#fefcc9";
//var BorderUIColor = "#c69c6d";

var BackgroundUIColor = "beige";
var BorderUIColor = "#c69c6d";
var BorderUIWidth = 3;
var TabUIBackgroundDark = "#eaeaae";

var ControlsText = ['------Keyboard Controls------',
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

function Interface() {
    this.mainMenu = new MainMenuPane("Main Menu", 0, 0, canvas.width, canvas.height, true);    

    // put a test button on the main menu pane
    this.testButton = new Button(this.mainMenu, "Test Button", (canvas.width * 0.5) - 50, (canvas.height * 0.5) - 20, (canvas.width * 0.5) + 50, (canvas.height * 0.5) + 20);
    this.testButton.action = function () {
        this.isVisible = false;
        this.parentInterface.isVisible = false;
        audioEventManager.addFadeEvent(menu_music_track, 0.5, 0);
        inGame_music_master.play();
        musicPastMainMenu = true;
    };
    this.mainMenu.push(this.testButton);

    this.tabMenu = new TabMenuPane(this.inventoryPane, canvas.width * .25, canvas.height * .25 - 30);

    this.controlsInfoPane = new ControlsInfoPane('Controls', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    this.tabMenu.push(this.controlsInfoPane);

    this.inventoryPane = new InventoryPaneInterface('Inventory', canvas.width * .14, canvas.height * .25, canvas.width * .855, canvas.height * .85);
    this.tabMenu.push(this.inventoryPane);

    this.audioPane = new AudioPaneInterface('Audio', canvas.width * .25, canvas.height * .25, canvas.width * .75, canvas.height * .75);
    this.tabMenu.push(this.audioPane);

    this.tabMenu.switchTabIndex(0);
    //this.tabMenu.switchTabName('Controls');
    const SCROLL_TO_THE_LEFT = true;
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT, false);
    this.tabMenu.switchTab(SCROLL_TO_THE_LEFT);

    this.hotbarPane = new HotbarPaneInterface();
    this.holdingSlot = new HoldingSlotInterface();

    this.draw = function () {
        this.hotbarPane.draw();
        this.tabMenu.draw();
        this.mainMenu.draw();
        this.holdingSlot.draw();

        colorText('press ESC to toggle menu', canvas.width - 200, canvas.height - 15, 'white');
        colorText('press E to toggle inventory', canvas.width - 200, canvas.height - 25, 'white');
    };    
}

function MainMenuPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY, visible) {    
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = visible;

    this.buttons = [];

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (this.isVisible && isInPane(this, x, y)) {
            //checks for *first* button in array that mouse can click
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                return button.leftMouseClick(x, y);
            }
        }
        return false;
    };

    this.draw = function () {
        if (this.isVisible) {
            drawInterfacePaneBackground(this);

            //draw buttons
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                button.draw();
            }
        }
    };

    // this menu needs to be updated every frame 
    this.update = function (x = mouseX, y = mouseY) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.mouseOver(x, y);
        }
    };

    this.push = function (button) {
        this.buttons.push(button);
    };
}

function TabMenuPane(inventoryPane, X=0, Y=0, tabHeight=30) {
    this.x = X;
    this.y = Y;
    this.tabHeight = tabHeight;
    this.tabTextPadding = 15;
    this.panes = [];
    this.activePane = null;
    this.activeIndex = -1;
    
    this.isVisible = false;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if (this.isVisible && isInPane(this.activePane, x, y)) {
            this.activePane.leftMouseClick(x, y);
            return true;
        } else if (this.isVisible) {
            var clickedPane = this.getTabPaneAt(x, y);
            if ( clickedPane !== null ) {
                this.switchTabName(clickedPane.name);
                uiSelect.play();
                return true;
            } else {
                return false;
            }
        } else {
            return false; //Input was not handled by this
        }
    };
    
    this.rightMouseClick = function(x=mouseX, y=mouseY) {
        if (inventoryPane.isVisible) {
            return inventoryPane.rightMouseClick(x, y);
        }
        return false;
    };
    
    this.getTabPaneAt = function(x=mouseX, y=mouseY) {
        var clickedPane = null;
        var tabX = this.x;
        var tabY = this.y; //bottom of tab
        var i;
        for(i=0; i < this.panes.length; i++) {
            var pane = this.panes[i];
            //draw tab
            str = pane.name;
            var textWidth = canvasContext.measureText(str).width;
            var tabWidth = (this.tabTextPadding*2)+textWidth;
            //check if inside current tab
            if ( x >= tabX && x <= tabX+tabWidth && 
                 y >= tabY && y <= tabY+this.tabHeight )
            {
                clickedPane = pane;
                break;
                //Terminate loop early, no need to check further tabs
            }
            tabX += tabWidth;
        }
        return clickedPane; //returns null if no pane clicked
    };
    
    this.draw = function() {
        if (this.isVisible) {
            var length = this.panes.length;
            var i;
            var tabX = this.x;
            var tabY = this.y
            var activeTabX=0;
            var activeTabY=0;
            var activeTabWidth=0;
            var activeTabStr="";
            var str;
            
            // draw inactive tabs
            for(i=0; i < length; i++) {
                var pane = this.panes[i];
                //draw tab
                str = pane.name;
                var textWidth = canvasContext.measureText(str).width;
                var tabWidth = (this.tabTextPadding*2)+textWidth;
                var textColor;
                if  (i == this.activeIndex) {
                    //active tab, skip drawing (will draw at end over other elements)
                    activeTabX = tabX;
                    activeTabY = tabY;
                    activeTabWidth = tabWidth;
                    activeTabStr = str;
                } else {
                    //inactive tab
                    canvasContext.fillStyle = TabUIBackgroundDark;
                    canvasContext.fillRect(tabX, tabY, tabWidth, this.tabHeight);
                    textColor = 'LightSlateGray';
                }
                colorText(str, tabX+this.tabTextPadding, tabY+this.tabTextPadding, textColor);
                tabX += tabWidth;
                //draw only panes set as visible
                if(pane.isVisible) {
                    pane.draw();
                }
            }
            // draw active pane
            var pane = this.activePane;
            if(pane.isVisible) {
                pane.draw();
            }
            //draw active tab on top
            canvasContext.fillStyle = BackgroundUIColor;
            canvasContext.fillRect(activeTabX, activeTabY, activeTabWidth, this.tabHeight);
            var textColor = 'black';
            colorText(activeTabStr, activeTabX+this.tabTextPadding, activeTabY+this.tabTextPadding, textColor);
        }
    };
    
    this.push = function(pane, isVisible=false) {
        this.panes.push(pane);
        pane.isVisible = isVisible;
    };
    
    this.switchTabIndex = function(index) {
        var i;
        var pane=null;
        for(i=0; i < this.panes.length; i++) {
            pane = this.panes[i];
            if( i == index) {
                this.activePane = pane;
                this.activeIndex = index;
                pane.isVisible = true;
            } else {
                pane.isVisible = false;
            }
        }
    };
    this.switchTabName = function(name) {
        //search panes to find next one that matches name
        var i;
        var pane;
        for(i=0; i < this.panes.length; i++) {
            pane = this.panes[i];
            if (pane.name == name) {
                this.switchTabIndex(i);
            }
        }
    };
    this.switchTab = function(scrollLeftIfTrue = false, doWrap=true) {
        var i;
        if (scrollLeftIfTrue) {
            i = this.activeIndex-1;
            if (doWrap) { 
                if (i < 0) {
                    i = this.panes.length-1;
                }
            }                        
        }
        else {
            i = this.activeIndex+1;
            if (doWrap) {
                i = Math.abs(i%this.panes.length); //wrap index
            } else if (i >= this.panes.length-1) {
                i = this.panes.length-1;
            }
        }
        this.switchTabIndex(i);
    };
}

function ControlsInfoPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {

    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    
    this.isVisible = true;
    
    this.padding = 20;
    this.columnPadding = 40;
    this.lineHeight = 15;
    this.textColor = 'black';
    this.textLine = ControlsText;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        return false;
    };

    this.draw = function() {
        drawInterfacePaneBackground(this);

        var lines = this.textLine.length;
        var columnWidth = 0;
        var textX = this.x+this.padding;
        var startTextY = this.y+this.padding;
        var textY = startTextY;
        var i;
        for(i=0; i < lines; i++) {
            // check if at bottom of pane; If so start new column
            if (textY > this.y+this.height-this.padding)
            {
                textX += columnWidth+this.columnPadding;
                columnWidth = 0;
                textY = startTextY;
            }
            var line = this.textLine[i];
            colorText(line, textX, textY, this.textColor);
            var textWidth = canvasContext.measureText(line).width;
            if (textWidth > columnWidth) {
                columnWidth = textWidth;
            }
            textY += this.lineHeight;
        }
    };
}

function Pane(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        return false;
    };
    
    this.draw = function() {
        drawInterfacePaneBackground(this);
    };
}

//utility functions for panes
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
};

function drawInterfacePaneBackground(pane, backgroundColor = BackgroundUIColor, borderColor = BorderUIColor) {
    colorRect(pane.x, pane.y, pane.width, pane.height, backgroundColor)
    drawInterfacePaneBorder(pane, BorderUIWidth, borderColor);
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
