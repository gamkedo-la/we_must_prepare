// world, room, and tile constants, variables
const ROOM_COLS = 18;
const ROOM_ROWS = 14;

var roomGrid =
    [   01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01,
        01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 00, 00, 03, 04, 00, 06, 07, 00, 00, 00, 00, 00, 00, 18, 00, 00, 01,
        01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 00, 00, 00, 00, 00, 00, 02, 12, 00, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 19, 19, 19, 00, 00, 00, 00, 00, 13, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 19, 16, 19, 00, 00, 00, 00, 00, 00, 14, 00, 00, 00, 00, 00, 00, 01,
        01, 19, 19, 19, 00, 00, 00, 00, 00, 05, 00, 15, 00, 00, 00, 00, 00, 01,
        01, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 19, 19, 19, 00, 01,
        01, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 19, 17, 19, 00, 01,
        01, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 19, 19, 19, 00, 01,
        01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01,
        01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01];

const TILE_W = 50;
const TILE_H = 50;
const BUTTON_DIM = TILE_W;
const BUTTON_MARGIN = 5;

const TILE_GROUND = 00;
const TILE_WALL = 01;
const TILE_PLAYER = 02;
const TILE_METAL_SRC = 03;
const TILE_RECHARGE_STATION = 04;
const TILE_WOOD_SRC = 05;
const TILE_WOOD_DEST = 0600;
const TILE_METAL_DEST = 0600;
const TILE_STONE_SRC = 07;
const TILE_STONE_DEST = 08;
const TILE_FOOD_SRC = 09;
const TILE_FOOD_DEST = 10;
const TILE_BUILDING = 11;
const TILE_TILLED = 12;
const TILE_TILLED_WATERED = 13;
const TILE_TILLED_SEEDS = 14;
const TILE_TILLED_SEEDS_WATERED = 15;
const TILE_FLOWER_01 = 16;
const TILE_FLOWER_02 = 17;
const TILE_TWIG = 18;
const TILE_GRASS = 19;
const TILE_WOOD_PILE = 06;
const TILE_WHEAT_01_SEED = 50;
const TILE_WHEAT_01_SEEDLING = 51;
const TILE_WHEAT_01_MEDIUM = 52;
const TILE_WHEAT_01_FULLY_GROWN = 53;
const TILE_WHEAT_02_SEED = 54;
const TILE_WHEAT_02_SEEDLING = 55;
const TILE_WHEAT_02_MEDIUM = 56;
const TILE_WHEAT_02_FULLY_GROWN = 57;
const START_TILE_WALKABLE_GROWTH_RANGE = TILE_WHEAT_01_SEED;
const LAST_TILE_ENUM = TILE_WHEAT_02_FULLY_GROWN;

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
    if (tileKind >= START_TILE_WALKABLE_GROWTH_RANGE) {
        return true;
    }
    switch (tileKind) {
        case TILE_GROUND:
        case TILE_TILLED:
        case TILE_TILLED_WATERED:
        case TILE_TILLED_SEEDS:
        case TILE_TILLED_SEEDS_WATERED:
        case TILE_FLOWER_01:
        case TILE_FLOWER_02:
        case TILE_GRASS:
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
        case TILE_TWIG:
        case TILE_WOOD_PILE:
            return true;
    }
    return false;
}

function tileTypeIsFood(checkTileType) {
    if (checkTileType >= START_TILE_WALKABLE_GROWTH_RANGE) {
        return true;
    }
    return false;
}

function tileTypeIsPlant(checkTileType) {
    switch (checkTileType) {
        case TILE_FLOWER_01:
        case TILE_FLOWER_02:
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
            if (tileTypeIsPlant(tileTypeHere)) {
                canvasContext.drawImage(tileSheet,
                    TILE_GRASS * TILE_W, 0,
                    TILE_W, TILE_H, 
                    tileLeftEdgeX, tileTopEdgeY,
                    TILE_W, TILE_H); 
            }
            if (tileTypeIsFood(tileTypeHere)) {
                canvasContext.drawImage(tileSheet,
                    TILE_TILLED * TILE_W, 0,
                    TILE_W, TILE_H, 
                    tileLeftEdgeX, tileTopEdgeY,
                    TILE_W, TILE_H); 
            }
            if (tileTypeHere >= START_TILE_WALKABLE_GROWTH_RANGE) {
                var sheetIndex = tileTypeHere - START_TILE_WALKABLE_GROWTH_RANGE;
                var sheetStage = sheetIndex % 4;
                var sheetType = Math.floor(sheetIndex / 4);
                canvasContext.drawImage(plantSpritesheet,
                    sheetType * TILE_W, sheetStage * TILE_H, // top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H, // get full tile size from source
                    tileLeftEdgeX, tileTopEdgeY, // x,y top-left corner for image destination
                    TILE_W, TILE_H); // draw full full tile size for destination

            } else if (tileTypeHere != TILE_WOOD_SRC || debugTreesEnabled) {
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
