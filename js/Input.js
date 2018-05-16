// save the canvas for dimensions, and its 2d context for drawing to it
const KEY_TAB = 9;
const KEY_0 = 48;
const KEY_A = 65;
const KEY_B = 66;
const KEY_D = 68;
const KEY_E = 69;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_S = 83;
const KEY_W = 87;
const KEY_P = 80;
const KEY_Q = 81;
const KEY_O = 79;
// Player
const KEY_C = 67;
const KEY_USE_TOOL = 67;
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_ESCAPE = 27;
const MOUSE_LEFT_CLICK = 0;
const NO_SELECTION = -1;
const PLAYER_SELECTED = -2;
// Central Menu
const KEY_ENTER = KEY_TOGGLE_MENU = 13;
const KEY_SWITCH_TAB_LEFT = KEY_Q;
const KEY_SWITCH_TAB_RIGHT = KEY_E;

var mouseClickedThisFrame = false;
var toolKeyPressedThisFrame = false;
var mouseHeld = false;
var toolKeyHeld = false;
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
    canvas.addEventListener('mouseup', mouseupHandler);
    
    document.addEventListener('keydown', keyPress);
    document.addEventListener('keyup', keyReleased);

    player.setupInput(KEY_A,KEY_W,KEY_S,KEY_D, KEY_LEFT_ARROW,KEY_UP_ARROW,KEY_DOWN_ARROW,KEY_RIGHT_ARROW);
}


function mousemoveHandler(evt) {
    calculateMousePos(evt);
}


function mousedownHandler(evt) {
    calculateMousePos(evt);
    if (evt.button == MOUSE_LEFT_CLICK) {
        mouseHeld = true;
        mouseClickedThisFrame = true;
    } else {
        selectedIndex = NO_SELECTION;
    }

}


function mouseupHandler(evt) {
    if (isPaused) {
        startGameLoop();
        return;
    }

    calculateMousePos(evt);
    mouseHeld = false;
} // end mouse up handler

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
    if ( !centralMenuOpen ) {
        player.move();
    }
}


function keySet(keyEvent, whichUnit, setTo) 
{
    if (keyEvent.keyCode == whichUnit.controlKeyLeft || keyEvent.keyCode == whichUnit.controlKeyLeft2)
    {
        whichUnit.keyHeld_West = setTo;
    }
    if (keyEvent.keyCode == whichUnit.controlKeyUp || keyEvent.keyCode == whichUnit.controlKeyUp2)
    {
        whichUnit.keyHeld_North = setTo;
    } 
    if (keyEvent.keyCode == whichUnit.controlKeyDown || keyEvent.keyCode == whichUnit.controlKeyDown2)
    {
        whichUnit.keyHeld_South = setTo;
    } 
    if (keyEvent.keyCode == whichUnit.controlKeyRight || keyEvent.keyCode == whichUnit.controlKeyRight2)
    {
        whichUnit.keyHeld_East = setTo;
    }  
}

function keyPress(evt) {
    if (isPaused) {
        return;
    }

    var keyUsedByGame = true;

    keySet(evt, player, true);

    // console.log("evt keycode " + evt.keyCode);
    // Menu Context Controls - if the menu is open, menu keys take priorty
    var centralMenuOpen = TabMenu.isVisible;
    if( centralMenuOpen ) {
        switch (evt.keyCode) {
            case KEY_SWITCH_TAB_LEFT:
                TabMenu.switchTabLeft();
                break;
            case KEY_SWITCH_TAB_RIGHT:
                TabMenu.switchTabRight();
                break;
            default:
                keyUsedByGame = false;
                break;
        }
    }
    // Common Controls (These are always checked)
    switch (evt.keyCode) {
            case KEY_TAB:
                inventory.equippedItemIndex++;
                if (inventory.inventorySlots[inventory.equippedItemIndex].item == items.nothing) {
                    inventory.equippedItemIndex = 0;
                }
                if (inventory.equippedItemIndex > 4) {
                    inventory.equippedItemIndex = 0;
                }
                break;
            case KEY_B:
                isBuildModeEnabled = !isBuildModeEnabled;
                console.log("Build mode enabled is " + isBuildModeEnabled);
                break;
            case KEY_ESCAPE:
                if (isBuildModeEnabled) {
                    isBuildModeEnabled = !isBuildModeEnabled;
                }
                break;
            case KEY_USE_TOOL:
                toolKeyPressedThisFrame = true;
                toolKeyHeld = true;
                player.workingLand(getTileIndexAtPixelCoord(player.x, player.y), true);
                break;
            case KEY_I:
                //Switch central menu to inventory tab
                TabMenu.switchTabName("Inventory");
                break;
            case KEY_0:
                keyPressForSaving(evt);
                break;
            case KEY_P:
                for (var i = 0; i < plantTrackingArray.length; i++) {
                    plantTrackingArray[i].dayChanged();
                }
                break;
            case KEY_O:
                console.log("Pressed the O Key");
                player.plantAtFeet();
                break;
            case KEY_ENTER:
                //toggle menu
                console.log("Enter pressed");
                TabMenu.isVisible = !TabMenu.isVisible;
                break;
            default:
                //console.log("keycode press is " + evt.keyCode);
                keyUsedByGame = false;
                break;
        }

    if (keyUsedByGame) {
        evt.preventDefault();
    }

    //put this line just to prevent browser from scrolling with up/down arrows.
    evt.preventDefault();
}

function keyReleased(evt)
{
    if (isPaused) {
        startGameLoop();
        return;
    }

    keySet(evt, player, false);

    evt.preventDefault();
    
    switch(evt.keyCode) {
        case KEY_USE_TOOL:
            toolKeyHeld = false;
            break;
    }
}
