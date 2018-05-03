// save the canvas for dimensions, and its 2d context for drawing to it
const KEY_A = 65;
const KEY_B = 66;
const KEY_D = 68;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_S = 83;
const KEY_W = 87;
const KEY_C = KEY_USE_TOOL = 67;
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_ESAPE = 27;
const MOUSE_LEFT_CLICK = 0;
const NO_SELECTION = -1;
const PLAYER_SELECTED = -2;

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
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
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
    calculateMousePos(evt);
    mouseHeld = false;
} // end mouse up handler

function isMouseOverInterface() {
    return mouseY > INTERFACE_Y;
}


function inputUpdate() {
    // TODO here is where we are are going to check on where mouse is etc. to make sure menus and player actions don't
    // overlap.  Things mouse does: player moves, player harvests, menu interactions
    if (isMouseOverInterface()) {
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
    } else if (isBuildModeEnabled) {
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
    } else { // this means we aren't in build mode
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
    player.move(); 
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
    var keyUsedByGame = true;

    keySet(evt, player, true);

    //console.log("evt keycode " + evt.keyCode);
    switch (evt.keyCode) {
        case KEY_B:
            isBuildModeEnabled = !isBuildModeEnabled;
            console.log("Build mode enabled is " + isBuildModeEnabled);
            break;
        case KEY_ESAPE:
            if (isBuildModeEnabled) {
                isBuildModeEnabled = !isBuildModeEnabled;
            }
            break;
        case KEY_USE_TOOL:
            // if (properToolEquipped?) {
        	toolKeyPressedThisFrame = true;
        	toolKeyHeld = true;
            // else if (otherToolEquipped)
            player.workingLand(getTileIndexAtPixelCoord(player.x, player.y), true); 
        	break;
        case KEY_I:
            camPanY -= CAM_PAN_SPEED;
            break;
        case KEY_J:
            camPanX -= CAM_PAN_SPEED;
            break;
        case KEY_K:
            camPanY += CAM_PAN_SPEED;
            break;
        case KEY_L:
            camPanX += CAM_PAN_SPEED;
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
    keySet(evt, player, false);

    evt.preventDefault();
    
    switch(evt.keyCode) {
	    case KEY_USE_TOOL:
	    	toolKeyHeld = false;
	    	break;
    }
}