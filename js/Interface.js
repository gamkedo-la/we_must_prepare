
var TabMenu;

function setupUI() {
    TabMenu = new tabMenuUI(canvas.width*.25, canvas.height*.25-30);
    //create a pane for testing
    var pane = new paneUI('Test Pane', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    TabMenu.push(pane, true);
    pane = new controlsInfoPaneUI('Controls', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    TabMenu.push(pane);
    pane = new paneUI('Inventory', canvas.width*.25, canvas.height*.25, canvas.width*.75, canvas.height*.75);
    TabMenu.push(pane);
    TabMenu.switchTabIndex(0);
    //TabMenu.switchTabName('Controls');
    TabMenu.switchTabLeft(false);
    TabMenu.switchTabLeft();

}

function drawUI() {
    //test
    //setupUI();
    
    TabMenu.draw();
    //placeholder - display instructions
    colorText('press ENTER to toggle menu', canvas.width - 200, canvas.height - 25, 'white');
}

function tabMenuUI(X=0, Y=0, tabHeight=30) {
    this.x = X;
    this.y = Y;
    this.tabHeight = tabHeight;
    this.tabTextPadding = 15;
    this.panes = [];
    this.activePane = null;
    this.activeIndex = -1;
    
    this.isVisible = false;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if (this.isVisible && isInPane(activePane, x, y)) {
            activePane.leftMouseClick(x, y);
            return true;
        } else if (this.isVisible) {
            var clickedPane = this.getTabPaneAt(x, y);
            if ( clickedPane !== null ) {
                this.switchTabName(clickedPane.name);
                return true;
            } else {
                return false;
            }
        } else {
            return false; //Input was not handled by this
        }
    }
    
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
    }
    
    this.draw = function() {
        if (this.isVisible) {
            var length = this.panes.length;
            var i;
            var tabX = this.x;
            var tabY = this.y
            var str;
            for(i=0; i < length; i++) {
                var pane = this.panes[i];
                //draw tab
                str = pane.name;
                var textWidth = canvasContext.measureText(str).width;
                var tabWidth = (this.tabTextPadding*2)+textWidth;
                var textColor;
                if  (i == activeIndex) {
                    canvasContext.fillStyle = 'beige';
                    canvasContext.fillRect(tabX, tabY, tabWidth, this.tabHeight);
                    textColor = 'black';
                } else {
                    canvasContext.fillStyle = '#eaeaae';
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
        }
    }
    
    this.push = function(pane, isVisible=false) {
        this.panes.push(pane);
        pane.isVisible = isVisible;
    }
    
    this.switchTabIndex = function(index) {
        var i;
        var pane=null;
        for(i=0; i < this.panes.length; i++) {
            pane = this.panes[i];
            if( i == index) {
                activePane = pane;
                activeIndex = index;
                pane.isVisible = true;
            } else {
                pane.isVisible = false;
            }
        }
    }
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
    }
    this.switchTabRight = function(doWrap=true) {
        var i = activeIndex+1;
        if (doWrap) {
            i = Math.abs(i%this.panes.length); //wrap index
        } else if (i >= this.panes.length-1) {
            i = this.panes.length-1;
        }
        this.switchTabIndex(i);
    }
    this.switchTabLeft = function(doWrap=true) {
        var i = activeIndex-1;
        if (doWrap) { 
            i = Math.abs(i%this.panes.length); //wrap index
        } else if (i < 0) {
            i = 0;
        }
        this.switchTabIndex(i);
    }
}

function paneUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    
    this.isVisible = true;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        return true;
    }
    
    this.draw = function() {
        canvasContext.fillStyle = 'beige';
        canvasContext.fillRect(this.x,this.y,this.width,this.height);
    }
}

function controlsInfoPaneUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {

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
    this.textLine = ['------Main Controls------',
                    'Toggle Menu - ENTER',
                    'Movement - WASD, Arrow Keys',
                    'Toggle Inventory - I',
                    'Interact - C',
                    'Plant Seeds - O',
                    '',
                    '------Temporary Controls------',
                    'Change Day - P'];
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        return true;
    }

    this.draw = function() {
        canvasContext.fillStyle = 'beige';
        canvasContext.fillRect(this.x,this.y,this.width,this.height);
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
    }
}

//utility functions for panes
var isInPane = function(pane, x, y) {
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

const INTERFACE_Y = 500; // hacky please change
var mouseOverBuildingInterfaceIndex = -1;
var mouseOverButtonPerBuildingInterfaceIndex = -1;

function interfaceUpdate() {
    

}

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