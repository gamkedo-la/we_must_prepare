// save the canvas for dimensions, and its 2d context for drawing to it
const KEY_B = 66;
const KEY_ESAPE = 27;
const NO_SELECTION = -1;
const PLAYER_SELECTED = -2;

var mouseClickedThisFrame = false;
var mouseHeld = false;
var mouseX = 0;
var mouseY = 0;
var isBuildModeEnabled = false;
var selectedIndex = NO_SELECTION;


function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}

function setupInput() {
    canvas.addEventListener('mousemove', mousemoveHandler);
    canvas.addEventListener('mousedown', mousedownHandler);
    canvas.addEventListener('mouseup', mouseupHandler);
    document.addEventListener('keydown', keyPress);
}


function mousemoveHandler(evt) {
    calculateMousePos(evt);

}


function mousedownHandler(evt) {
    calculateMousePos(evt);
    if (evt.button == 0) {
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
        // will be handeled by interface code
        if (mouseClickedThisFrame) {
            if (mouseOverBuildingInterfaceIndex != -1 && resoucesAvailableToBuild(mouseOverBuildingInterfaceIndex)) {
                console.log("I clicked " + buildingDefs[mouseOverBuildingInterfaceIndex].label);
                buildingDefs[mouseOverBuildingInterfaceIndex].onClick();
                isBuildModeEnabled = true;
                toBuild = buildingDefs[mouseOverBuildingInterfaceIndex];
            } else if (mouseOverButtonPerBuildingInterfaceIndex != -1) {
                perBuildingButtonDefs[mouseOverButtonPerBuildingInterfaceIndex].onClick();
            }
        }
    } else if (isBuildModeEnabled) {
        if (mouseClickedThisFrame) {
            placeBuildingAtPixelCoord(TILE_BUILDING);
            removeResourcesForBuilding(player.storageList, toBuild);
            isBuildModeEnabled = !isBuildModeEnabled;
            mouseHeld = false;
        }
    } else { // this means we aren't in build mode
        if (player.distFrom(mouseX, mouseY) < UNIT_SELECTED_DIM_HALF) {
            if (mouseClickedThisFrame) {
                selectedIndex = PLAYER_SELECTED;
            }
        } else {
            var indexUnderMouse = getTileIndexAtPixelCoord(mouseX, mouseY);

            if (indexUnderMouse != undefined && isTileKindBuilding(roomGrid[indexUnderMouse])) {
                if (mouseClickedThisFrame) {
                    if (selectedIndex != PLAYER_SELECTED) {
                        console.log('Clicked on a building!');
                        selectedIndex = indexUnderMouse;
                    } else {
                        player.goto(mouseX, mouseY);
                    }
                }
            } else {
                if (mouseHeld) {
                    console.log('Mouse has been held!');
                    if (selectedIndex == PLAYER_SELECTED) {
                        player.goto(mouseX, mouseY);
                    }
                }
            }
        }
        player.move();
    }
}


function keyPress(evt) {
    var keyUsedByGame = true;
    console.log("evt keycode " + evt.keyCode);
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
        default:
            console.log("keycode press is " + evt.keyCode);
            keyUsedByGame = false;
            break;
    }
    if (keyUsedByGame) {
        evt.preventDefault();
    }
}
