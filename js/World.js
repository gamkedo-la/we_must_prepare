// world, room, and tile constants, variables
const ROOM_COLS = 18;
const ROOM_ROWS = 14;

var roomGrid =
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 3, 4, 0, 6, 7, 8, 9, 10, 11, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const TILE_W = 50;
const TILE_H = 50;
const BUTTON_DIM = TILE_W;
const BUTTON_MARGIN = 5;

const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYER = 2;
const TILE_METAL_SRC = 3;
const TILE_METAL_DEST = 4;
const TILE_WOOD_SRC = 5;
const TILE_WOOD_DEST = 6;
const TILE_STONE_SRC = 7;
const TILE_STONE_DEST = 8;
const TILE_FOOD_SRC = 9;
const TILE_FOOD_DEST = 10;
const TILE_BUILDING = 11;
const LAST_TILE_ENUM = TILE_BUILDING;

var objectsWithDepth = [];

var tileTestColors = ['black', // TILE_GROUND
    'purple', // TILE_WALL
    'blue', // TILE_PLAYER
    'grey', // TILE_METAL_SRC
    'brown', // TILE_WOOD_SRC
    'lightgray', // TILE_STONE_SRC
    'yellow', // TILE_FOOD_SRC
    'white', // TILE_BUILDING
];

function roomTileToIndex(tileCol, tileRow) {
    return (tileCol + ROOM_COLS * tileRow);
}

function isTileKindBuilding(tileKind) {
    switch (tileKind) {
        case TILE_WOOD_DEST:
        case TILE_STONE_DEST:
        case TILE_METAL_DEST:
        case TILE_FOOD_DEST:
        case TILE_FOOD_SRC:
        case TILE_BUILDING:
            return true;
    }
    return false;
}

function isTileKindWalkable(tileKind) {
    switch (tileKind) {
        case TILE_GROUND:
            return true;
    }
    return false;
}

function getTileIndexAtPixelCoord(pixelX, pixelY) {
    var tileCol = pixelX / TILE_W;
    var tileRow = pixelY / TILE_H;

    // we'll use Math.floor to round down to the nearest whole number
    tileCol = Math.floor(tileCol);
    tileRow = Math.floor(tileRow);

    // first check whether the tile coords fall within valid bounds
    if (tileCol < 0 || tileCol >= ROOM_COLS ||
        tileRow < 0 || tileRow >= ROOM_ROWS) {
        HTMLLog("out of bounds:" + pixelX + "," + pixelY);
        return undefined;
    }

    var tileIndex = roomTileToIndex(tileCol, tileRow);
    return tileIndex;
}

function tileTypeHasTransparency(checkTileType) {
    switch (checkTileType) {
        case TILE_PLAYER:
        case TILE_METAL_SRC:
        case TILE_STONE_SRC:
        case TILE_WOOD_SRC:
            return true;
    }
    return false;
}

function drawGroundTiles() {
    var tileIndex = 0;
    var tileLeftEdgeX = 0;
    var tileTopEdgeY = 0;

    for (var eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // deal with one row at a time

        tileLeftEdgeX = 0; // resetting horizontal draw position for tiles to left edge

        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // left to right in each row

            var tileTypeHere = roomGrid[tileIndex]; // getting the tile code for this index
            if (tileTypeHasTransparency(tileTypeHere)) {
                canvasContext.drawImage(tileSheet,
                    TILE_GROUND * TILE_W, 0, // top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H, // get full tile size from source
                    tileLeftEdgeX, tileTopEdgeY, // x,y top-left corner for image destination
                    TILE_W, TILE_H); // draw full tile size for destination
            }
            if (tileTypeHere != TILE_WOOD_SRC || debugTreesEnabled) {
                canvasContext.drawImage(tileSheet,
                    tileTypeHere * TILE_W, 0, // top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H, // get full tile size from source
                    tileLeftEdgeX, tileTopEdgeY, // x,y top-left corner for image destination
                    TILE_W, TILE_H); // draw full full tile size for destination
                if (tileIndex == selectedIndex) {
                    canvasContext.drawImage(buildingSelection, tileLeftEdgeX, tileTopEdgeY);
                }
            }
            tileIndex++; // increment which index we're going to next check for in the room
            tileLeftEdgeX += TILE_W; // jump horizontal draw position to next tile over by tile width

        } // end of for eachCol

        tileTopEdgeY += TILE_H; // jump horizontal draw position down by one full tile height

    } // end of for eachRow    
} // end of drawGroundTiles()

function draw3DTiles() {
    var tileIndex = 0;
    var tileLeftEdgeX = 0;
    var tileTopEdgeY = 0;
    objectsWithDepth = [];
    for (var eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // deal with one row at a time

        tileLeftEdgeX = 0; // resetting horizontal draw position for tiles to left edge

        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // left to right in each row

            var tileTypeHere = roomGrid[tileIndex]; // getting the tile code for this index
            var useImage = null;
            var depthGap = null;
            switch (tileTypeHere) {
                case TILE_WOOD_SRC:
                    if ((eachRow + eachCol) % 2 == 1) {
                        useImage = tree3D;
                    } else {
                        useImage = treeDead3D;
                    }
                    depthGap = 6;
                    break;
                default:
                    break;
            }
            if (useImage != null) {
                var newDepthObject = new depthObjectClass(tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H - depthGap,
                    tileLeftEdgeX - useImage.width / 2 + TILE_W / 2,
                    tileTopEdgeY - useImage.height + TILE_H,
                    useImage);
                // var sameDepthObjects = 0;
                objectsWithDepth.push(newDepthObject);
            }
            tileIndex++; // increment which index we're going to next check for in the room
            tileLeftEdgeX += TILE_W; // jump horizontal draw position to next tile over by tile width

        } // end of for eachCol

        tileTopEdgeY += TILE_H; // jump horizontal draw position down by one full tile height

    } // end of for eachRow
    //console.log("Objects with depth:"+objectsWithDepth.length);
    var allObjectsToDrawDepthSorted = objectsWithDepth.concat([player]);
    allObjectsToDrawDepthSorted.sort(function (a, b) {
        return a.y - b.y;
    });
    for (var j = 0; j < allObjectsToDrawDepthSorted.length; j++) {
        allObjectsToDrawDepthSorted[j].draw();
    }
    canvasContext.globalAlpha = 0.2;
    player.draw();
    canvasContext.globalAlpha = 1;
} // end of draw3DTiles()
