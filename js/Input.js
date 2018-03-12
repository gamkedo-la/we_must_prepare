// save the canvas for dimensions, and its 2d context for drawing to it

var mouseClickedThisFrame = false;
var mouseHeld = false;
var mouseX = 0;
var mouseY = 0;
var isBuildModeEnabled = false;
const KEY_B = 66;

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
    mouseHeld = true;
    mouseClickedThisFrame = true;

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
        if (mouseClickedThisFrame && mouseOverBuildingInterfaceIndex != -1 && resoucesAvailableToBuild(mouseOverBuildingInterfaceIndex)) {
            console.log("I clicked " + buildingDefs[mouseOverBuildingInterfaceIndex].label);
            buildingDefs[mouseOverBuildingInterfaceIndex].onClick();
            isBuildModeEnabled = true;
        }
    } else if (isBuildModeEnabled) {
        if (mouseClickedThisFrame) {
            placeBuildingAtPixelCoord(TILE_BUILDING);
            isBuildModeEnabled = !isBuildModeEnabled;
        }
    } else { // this means we aren't in build mode
        if (mouseHeld) {
            player.goto(mouseX, mouseY);
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
        default:
            console.log("keycode press is " + evt.keyCode);
            keyUsedByGame = false;
            break;
    }
    if (keyUsedByGame) {
        evt.preventDefault();
    }
}
