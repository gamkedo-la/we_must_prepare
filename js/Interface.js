
function interfaceUpdate() {
    if (mouseClickedThisFrame) {
        if (isBuildModeEnabled) {
            var indexToPlaceBuildingAt = getTileIndexAtPixelCoord(mouseX, mouseY);
            roomGrid[indexToPlaceBuildingAt] = TILE_BUILDING;
        }
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
