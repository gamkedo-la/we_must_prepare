// Player
const KEY_USE_TOOL = "KeyC";
const KEY_INVENTORY = "KeyE";
const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 3;
const NO_SELECTION = -1;
const PLAYER_SELECTED = -2;

var mouseClickedThisFrame = false;
var mouseDblClickedThisFrame = false;
var rightMouseClickedThisFrame = false;
var toolKeyPressedThisFrame = false;
var mouseHeld = false;
var toolKeyHeld = false;
var shiftKeyHeld = false;
var mouseX = 0;
var mouseY = 0;
var mouseWorldX = 0;
var mouseWorldY = 0;
var isBuildModeEnabled = false;
var badBuildingPlacement = false;
var selectedIndex = NO_SELECTION;


function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
    mouseWorldX = mouseX + camPanX;
    mouseWorldY = mouseY + camPanY;
}

function setupInput() {
    canvas.addEventListener('mousemove', mousemoveHandler);
    canvas.addEventListener('mousedown', mousedownHandler);
    canvas.addEventListener('dblclick', mousedblclickHandler);
    canvas.addEventListener('wheel', mousewheelHandler);
    // note for init reason canvas.addEventListener('mouseup', mouseupHandler); is in the onload handler for the main window

    document.addEventListener('keydown', keyPress);
    document.addEventListener('keyup', keyReleased);

    player.setupInput("KeyA","KeyW","KeyS","KeyD", "ArrowLeft","ArrowUp","ArrowDown","ArrowRight");
}


function mousemoveHandler(evt) {
    calculateMousePos(evt);
}


function mousedownHandler(evt) {
    calculateMousePos(evt);
    if (evt.which === MOUSE_LEFT_CLICK) {
        mouseHeld = true;
        mouseClickedThisFrame = true;
    } else {
        if (evt.which === MOUSE_RIGHT_CLICK) {
            rightMouseClickedThisFrame = true;
        }
        selectedIndex = NO_SELECTION;
    }
}

function mousedblclickHandler(evt) {    
    calculateMousePos(evt);
    if (evt.which === MOUSE_LEFT_CLICK) {        
        mouseHeld = true;
        mouseDblClickedThisFrame = true;
    }
}

function mouseupHandler(evt) {
    if (hasGameStartedByClick == false) {
        console.log('we are in hasGameStartedByClick == false in mouseupHandler: num pics to load ' + picsToLoad);
        if (picsToLoad == 0) {
            loadingDoneSoStartGame();
        }
        return;
    }
    if (isPaused) {
        startGameLoop();
        return;
    }

    calculateMousePos(evt);
    mouseHeld = false;
} // end mouse up handler

function mousewheelHandler(evt) {
    if (!TabMenu.isVisible) {        
        player.hotbar.scrollThrough(evt.deltaY > 0);        
    }
    evt.preventDefault();
}

function isMouseOverInterface() {
    return mouseY > INTERFACE_Y;
}


function inputUpdate() {
    // TODO here is where we are are going to check on where mouse is etc. to make sure menus and player actions don't
    // overlap.  Things mouse does: player moves, player harvests, menu interactions
    
    var centralMenuOpen = TabMenu.isVisible;
    var inputHandled = false;
    if (mouseClickedThisFrame) {
        // Central Menu //
        inputHandled = TabMenu.leftMouseClick(mouseX, mouseY) || hotbarPane.leftMouseClick(mouseX, mouseY);
    }
    if (mouseDblClickedThisFrame) {
        inputHandled = hotbarPane.leftMouseDblClick(mouseX, mouseY);
    }
    if ((!inputHandled) && isMouseOverInterface()) {
        // will be handled by interface code
        if (mouseClickedThisFrame) {
            //if we're clicking on a building and we have the resources     
            if (mouseOverBuildingInterfaceIndex != -1 &&
                resourcesAvailableToBuild(mouseOverBuildingInterfaceIndex)) {

                toBuild = buildingDefs[mouseOverBuildingInterfaceIndex];
                console.log("I clicked " + toBuild.label);
                toBuild.onClick();
                isBuildModeEnabled = true;
                
            //if we're clicking one the buttons in a submenu
            } else if (mouseOverButtonPerBuildingInterfaceIndex != -1) {
                perBuildingButtonDefs[mouseOverButtonPerBuildingInterfaceIndex].onClick();
            }
        }
    } else if (!inputHandled && isBuildModeEnabled) {
        if (mouseClickedThisFrame) {
            placeBuildingAtPixelCoord(toBuild.tile);
            if (badBuildingPlacement) {
                badBuildingPlacement = false;
                return;
            } else {
            removeResourcesForBuilding(player.storageList, toBuild);
            isBuildModeEnabled = !isBuildModeEnabled;
            mouseHeld = false;
            }
        }
    } else if (!inputHandled) { // this means we aren't in build mode
            var indexUnderMouse = getTileIndexAtPixelCoord(mouseWorldX, mouseWorldY);

            if (indexUnderMouse != undefined && isTileKindBuilding(roomGrid[indexUnderMouse])) {
                if (mouseClickedThisFrame) {
                    if (selectedIndex != PLAYER_SELECTED) {
                        console.log('Clicked on a building!');
                        selectedIndex = indexUnderMouse;
                    }
                }
            } 
        if(toolKeyPressedThisFrame) {
            player.collectResourcesIfAble();
        }
    }
    if(rightMouseClickedThisFrame) {
        inputHandled = TabMenu.rightMouseClick(mouseX, mouseY) || hotbarPane.rightMouseClick(mouseX, mouseY);
        rightMouseClickedThisFrame = false;
    }
    if ( !centralMenuOpen ) {
        player.move();
    }
}


function keySet(keyEvent, whichUnit, setTo) {
    if (keyEvent.code == whichUnit.controlKeyLeft || keyEvent.code == whichUnit.controlKeyLeft2)
    {
        whichUnit.keyHeld_West = setTo;
    }
    if (keyEvent.code == whichUnit.controlKeyUp || keyEvent.code == whichUnit.controlKeyUp2)
    {
        whichUnit.keyHeld_North = setTo;
    } 
    if (keyEvent.code == whichUnit.controlKeyDown || keyEvent.code == whichUnit.controlKeyDown2)
    {
        whichUnit.keyHeld_South = setTo;
    } 
    if (keyEvent.code == whichUnit.controlKeyRight || keyEvent.code == whichUnit.controlKeyRight2)
    {
        whichUnit.keyHeld_East = setTo;
    }  
}

function keyPress(evt) {
    if (isPaused) {
        return;
    }
    
    // Stop eating the console display key
    if(evt.code === "F12") {
        return;
    }
    
    var keyUsedByGame = true;

    keySet(evt, player, true);

    // console.log("evt keycode " + evt.keyCode);
    // Menu Context Controls - if the menu is open, menu keys take priorty
    var centralMenuOpen = TabMenu.isVisible;
    const SCROLL_TO_THE_LEFT = true;
    
    if( centralMenuOpen ) {
        switch (evt.code) {
            case "Tab":
                TabMenu.switchTab(shiftKeyHeld);
                break;
            default:
                keyUsedByGame = false;
                break;
        }
    }
    // Common Controls (These are always checked)
    switch (evt.code) {
        case "ShiftLeft":
        case "ShiftRight":
            shiftKeyHeld = true;
            break;
        case "Tab":
            if (!TabMenu.isVisible) {
                player.hotbar.scrollThrough(shiftKeyHeld);
            }
            break;
        case "KeyB":
            isBuildModeEnabled = !isBuildModeEnabled;
            console.log("Build mode enabled is " + isBuildModeEnabled);
            break;
        case "Escape":
				case "Esc":
            console.log("Escape pressed");
            if (isBuildModeEnabled) {
                isBuildModeEnabled = !isBuildModeEnabled;
            } else {
                //toggle menu
                TabMenu.switchTabName("Audio");
                TabMenu.isVisible = !TabMenu.isVisible;
                if(TabMenu.isVisible) {
                    uiSelect.play();
                } else {
                    uiCancel.play();
                }
            }
            break;
        case KEY_USE_TOOL:
            toolKeyPressedThisFrame = true;
            toolKeyHeld = true;
            player.workingLand(getTileIndexAtPixelCoord(player.x, player.y), true);
            player.plantAtFeet();
            break;
        case KEY_INVENTORY:
            //Switch central menu to inventory tab
						if(TabMenu.activePane.name != "Inventory") {
                TabMenu.switchTabName("Inventory");
                TabMenu.isVisible = true;
            } else {
                TabMenu.isVisible = !TabMenu.isVisible;
            }
            break;
        case "0":
            keyPressForSaving(evt);
            break;
        case "KeyP":
            timer.endOfDay();
            break;
        case "KeyO":
            console.log("Pressed the O Key");
            timer.pauseTime();
            break;
        default:
            console.log("keycode press is " + evt.keyCode);
            keyUsedByGame = false;
            break;
    }

    if (keyUsedByGame) {
        evt.preventDefault();
    }

    //put this line just to prevent browser from scrolling with up/down arrows.
    evt.preventDefault();
}

function keyReleased(evt) {
    if (isPaused) {
        startGameLoop();
        return;
    }

    keySet(evt, player, false);
    
    evt.preventDefault();
    
    switch(evt.code) {
        case KEY_USE_TOOL:
            toolKeyHeld = false;            
            break;
        case "ShiftLeft":
        case "ShiftRight":
            shiftKeyHeld = false;
            break;
    }
}
