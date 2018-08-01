// Player
const KEY_USE_TOOL = "KeyC";
const KEY_INVENTORY = "KeyE";
const KEY_DO_ACTION = "KeyX";
const KEY_FAST_FORWARD = "F1"; // press F1 to toggle timer.fastForward

const DEBUG_MOUSE = true; // set to false for normal play
const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 3;

const NO_SELECTION = -1;
const PLAYER_SELECTED = -2;

var mouseClickedThisFrame = false;

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


function calculateMousePos(evt) { // called during mousemove event

    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
    mouseWorldX = mouseX + camPanX;
    mouseWorldY = mouseY + camPanY;

    // testing: appears correct at all screen resolutions
    // if (DEBUG_MOUSE) { console.log('calculateMousePos: mouseX=' + mouseX + ' mouseY=' + mouseY + ' mouseWorldX=' + mouseWorldX + '  mouseWorldY=' + mouseWorldY); }

}

function setupInput() {
    canvas.addEventListener('mousemove', mousemoveHandler);
    canvas.addEventListener('mousedown', mousedownHandler);
    canvas.addEventListener('wheel', mousewheelHandler);
    // note for init reason canvas.addEventListener('mouseup', mouseupHandler); is in the onload handler for the main window

    document.addEventListener('keydown', keyPress);
    document.addEventListener('keyup', keyReleased);

    player.setupInput("KeyA", "KeyW", "KeyS", "KeyD", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight");
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
    if (!interface.tabMenu.isVisible) {
        player.hotbar.scrollThrough(evt.deltaY < 0);
    }
    evt.preventDefault();
}

function isMouseOverInterface() {
    return mouseY > HOTBAR_Y();
}

function inputUpdate() {
    // TODO here is where we are are going to check on where mouse is etc. to make sure menus and player actions don't
    // overlap.  Things mouse does: player moves, player harvests, menu interactions

    var centralMenuOpen = interface.tabMenu.isVisible;
    var inputHandled = false;
    if (mouseClickedThisFrame) {
        inputHandled = interface.mainMenu.leftMouseClick(mouseX, mouseY);
        // Still at the menu/title screen
        if (!inputHandled) {
            inputHandled = interface.loadGameMenu.leftMouseClick(mouseX, mouseY);
        }
        if (!inputHandled) {
            inputHandled = interface.saveGameMenu.leftMouseClick(mouseX, mouseY);
        }
        // Central Menu //
        if (!inputHandled) {
            inputHandled = interface.tabMenu.leftMouseClick(mouseX, mouseY) || interface.hotbarPane.leftMouseClick(mouseX, mouseY);
        }
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

        if (indexUnderMouse != undefined && isTileTypeBuilding(roomGrid[indexUnderMouse])) {
            if (mouseClickedThisFrame) {
                if (selectedIndex != PLAYER_SELECTED) {
                    console.log('Clicked on a building!');
                    selectedIndex = indexUnderMouse;

                    if (!interface.tabMenu.isVisible && roomGrid[indexUnderMouse] == TILE_SILO) {
                        buildingStorage.active = true;
                        interface.tabMenu.setVisible(true);
                        uiSelect.play();
                    }
                }
            }
        }

        if (indexUnderMouse != undefined) {
            if (mouseClickedThisFrame && player.currentlyFocusedTileIndex == getTileIndexFromAdjacentTileCoord(mouseWorldX, mouseWorldY)) {
                player.playerLastFacingDirection = player.getMouseActionDirection();
                toolKeyPressedThisFrame = true;
                toolKeyHeld = true;
                player.doActionOnTile(); // gather resources, till tiles, etc
            }
        }
    }

    if (rightMouseClickedThisFrame) {
        inputHandled = interface.tabMenu.rightMouseClick(mouseX, mouseY) || interface.hotbarPane.rightMouseClick(mouseX, mouseY);
        rightMouseClickedThisFrame = false;
    }
    if (!centralMenuOpen) {
        player.move();
    }
}


function keySet(keyEvent, whichUnit, setTo) {
    if (keyEvent.code == whichUnit.controlKeyLeft || keyEvent.code == whichUnit.controlKeyLeft2) {
        whichUnit.keyHeld_West = setTo;
    }
    if (keyEvent.code == whichUnit.controlKeyUp || keyEvent.code == whichUnit.controlKeyUp2) {
        whichUnit.keyHeld_North = setTo;
    }
    if (keyEvent.code == whichUnit.controlKeyDown || keyEvent.code == whichUnit.controlKeyDown2) {
        whichUnit.keyHeld_South = setTo;
    }
    if (keyEvent.code == whichUnit.controlKeyRight || keyEvent.code == whichUnit.controlKeyRight2) {
        whichUnit.keyHeld_East = setTo;
    }
}

function keyPress(evt) {
    if (isPaused) {
        return;
    }

    // Stop eating the console display key
    if (evt.code === "F12") {
        return;
    }

    var keyUsedByGame = true;

    keySet(evt, player, true);

    // console.log("evt keycode " + evt.keyCode);

    const SCROLL_TO_THE_LEFT = true;

    // If the menu is open, menu keys take priorty
    switch (evt.code) {
        case "ShiftLeft":
        case "ShiftRight":
            shiftKeyHeld = true;
            break;
        case "Tab":
            if (interface.tabMenu.isVisible) {
                interface.tabMenu.switchTab(shiftKeyHeld);
            }
            if (!interface.tabMenu.isVisible) {
                player.hotbar.scrollThrough(shiftKeyHeld);
            }
            break;
        case "KeyB":
            isBuildModeEnabled = !isBuildModeEnabled;
            console.log("Build mode enabled is " + isBuildModeEnabled);
            break;
        case "Escape":
        case "Esc":

            // skip the intro if it is playing
            if (window.intro && intro.currentlyPlaying) {
                console.log("Skipping intro: ESC pressed.");
                intro.currentlyPlaying = false;
                break; // avoid also opening the menu if we did
            }

            // console.log("Escape pressed");
            if (isBuildModeEnabled) {
                isBuildModeEnabled = !isBuildModeEnabled;
            } else {
                if (interface.loadGameMenu.isVisible) {
                    interface.loadGameMenu.isVisible = false;
                    interface.mainMenu.isVisible = true;
                    return;
                }
                else if (interface.saveGameMenu.isVisible) {
                    interface.saveGameMenu.isVisible = false;
                    interface.mainMenu.isVisible = true;
                    return;
                }
                //toggle main menu
                interface.mainMenu.isVisible = !interface.mainMenu.isVisible;
                if (interface.mainMenu.isVisible) {
                    uiSelect.play();
                } else {
                    uiCancel.play();
                }

                //TODO remove old mapping
                //toggle tab menu
                //interface.tabMenu.switchTabName("Audio");
                //interface.tabMenu.isVisible = !interface.tabMenu.isVisible;
                //if(interface.tabMenu.isVisible) {
                //    uiSelect.play();
                //} else {
                //    uiCancel.play();
                //}
            }
            break;
        case KEY_USE_TOOL:
            toolKeyPressedThisFrame = true;
            toolKeyHeld = true;
            player.doActionOnTile(); // gather resources, till tiles, etc
            break;
        case KEY_INVENTORY:
            //Switch central menu to inventory tab                  
            if (player.itemsHeldAtMouse.count == 0) {
                interface.tabMenu.setVisible(!interface.tabMenu.isVisible);
            }

            buildingStorage.active = false;
            if (interface.tabMenu.isVisible) {
                uiSelect.play();
            } else {
                uiCancel.play();
            }
            break;
        case KEY_DO_ACTION:
            player.doActionOnTile();
            break;
        case "Digit0":
            keyPressForSaving();
            break;
        case "KeyP":
            timer.endOfDay();
            break;
        case "KeyO":
            console.log("Pressed the O Key");
            timer.pauseTime();
            break;
        case "KeyF":
            console.log("Pressed the F Key");
            toggleRadiation();
            uiChange.play();
            break;
        case "KeyU":
            createFinalResources();
            break;
        case "KeyY":
            timer.dayNumber = 364;
            break;
        case KEY_FAST_FORWARD:
            timer.fastForward = !timer.fastForward; // flip on/off
            console.log("Fast Forward: " + timer.fastForward);
            break;
        case "Digit1":
            if (!interface.tabMenu.isVisible) {
                player.hotbar.equipSlot(SLOT_1);
            }
            break;
        case "Digit2":
            if (!interface.tabMenu.isVisible) {
                player.hotbar.equipSlot(SLOT_2);
            }
            break;
        case "Digit3":
            if (!interface.tabMenu.isVisible) {
                player.hotbar.equipSlot(SLOT_3);
            }
            break;
        case "Digit4":
            if (!interface.tabMenu.isVisible) {
                player.hotbar.equipSlot(SLOT_4);
            }
            break;
        case "Digit5":
            if (!interface.tabMenu.isVisible) {
                player.hotbar.equipSlot(SLOT_5);
            }
            break;
        case "KeyL":
            resetGame(false);
            break;
        default:
            // console.log("keycode press is " + evt.keyCode);
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

    switch (evt.code) {
        case KEY_USE_TOOL:
            toolKeyHeld = false;
            break;
        case "ShiftLeft":
        case "ShiftRight":
            shiftKeyHeld = false;
            break;
    }
}
