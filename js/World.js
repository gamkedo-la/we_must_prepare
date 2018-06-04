// world, room, and tile constants, variables
const ROOM_COLS = 40;
const ROOM_ROWS = 32;

var roomGrid =
    [   00, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05,
        05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 05, 05, 05, 07, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 18, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 00, 05, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 19, 19, 19, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 00, 00, 05, 05, 00, 00, 00, 00, 00, 00, 00, 19, 17, 19, 00, 00, 00, 00, 00, 00, 44, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 30, 32, 32, 32,
        05, 00, 00, 18, 00, 05, 00, 00, 00, 00, 00, 00, 00, 19, 19, 19, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32,
        05, 00, 00, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 18, 00, 03, 04, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 30, 32, 32, 32, 32, 32, 32,
        05, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 43, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 19, 19, 19, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 00, 00, 05, 00, 00, 00, 05, 00, 33, 34, 34, 34, 34, 35, 00, 00, 00, 19, 16, 19, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 00, 05, 07, 00, 00, 00, 05, 00, 36, 37, 38, 40, 40, 41, 00, 00, 00, 19, 19, 19, 00, 00, 00, 00, 00, 00, 00, 00, 42, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 00, 00, 00, 00, 05, 00, 00, 00, 39, 40, 41, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 05, 00, 00, 07, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        05, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 26, 22, 22, 22, 22, 20, 00, 21, 22, 22, 23, 24, 22, 27, 00, 00, 00, 31, 32, 32, 32, 32, 32, 32,
        05, 18, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 28, 00, 00, 00, 00, 00, 31, 32, 32, 32, 32,
        05, 07, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 07, 07, 00, 00, 00, 31, 32, 32, 32,
        05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 28, 07, 07, 00, 00, 00, 00, 00, 00, 00, 31,
        05, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 07, 00, 00, 00, 00, 00, 05,
        05, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 28, 00, 00, 00, 07, 00, 00, 07, 00, 00, 05,
        05, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 07, 00, 00, 07, 00, 07, 07, 00, 00, 05,
        05, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 28, 00, 07, 00, 00, 00, 00, 07, 00, 00, 05,
        05, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 07, 00, 00, 00, 00, 05,
        05, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 07, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 29, 22, 23, 24, 22, 22, 22, 22, 22, 22, 22, 22, 22, 25, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 00, 00, 00, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05];

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
const TILE_WOOD_DEST = 06;
const TILE_METAL_DEST = 06;
const TILE_WOOD_PILE = 06;
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
const TILE_FENCE_LEFT_ENTRANCE = 20;
const TILE_FENCE_RIGHT_ENTRANCE = 21;
const TILE_FENCE_HORIZONTAL_MIDDLE = 22;
const TILE_FENCE_BROKEN_RIGHT = 23;
const TILE_FENCE_BROKEN_LEFT = 24;
const TILE_FENCE_LOWER_RIGHT_CORNER = 25;
const TILE_FENCE_UPPER_LEFT_CORNER = 26;
const TILE_FENCE_UPPER_RIGHT_CORNER = 27;
const TILE_FENCE_VERTICAL = 28;
const TILE_FENCE_LOWER_LEFT_CORNER = 29;
const TILE_LAKE_CORNER01 = 30;
const TILE_LAKE_CORNER02 = 31;
const TILE_LAKE_WATER = 32;

const TILE_CLIFF_TOP_LEFT = 33;
const TILE_CLIFF_TOP_MIDDLE = 34;
const TILE_CLIFF_TOP_RIGHT = 35;
const TILE_CLIFF_MIDDLE_LEFT = 36;
const TILE_CLIFF_MIDDLE = 37
const TILE_CLIFF_MIDDLE_RIGHT = 38;
const TILE_CLIFF_BOTTOM_LEFT = 39;
const TILE_CLIFF_BOTTOM_MIDDLE = 40;
const TILE_CLIFF_BOTTOM_RIGHT = 41;

const TILE_SILO = 42;
const TILE_FARMHOUSE = 43;
const TILE_BARN = 44;
const START_BUILDING_RANGE = TILE_SILO;
const TILE_BUILDING_HEIGHT = 250;
const TILE_BUILDING_WIDTH = 250;

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

var tileTestColors = [
    'black', // TILE_GROUND
    'purple', // TILE_WALL
    'blue', // TILE_PLAYER
    'grey', // TILE_METAL_SRC
    'brown', // TILE_WOOD_SRC
    'lightgray', // TILE_STONE_SRC
    'yellow', // TILE_FOOD_SRC
    'white', // TILE_BUILDING
];

function extendBuildingCollision() {
    var tileIndex = 0;
    for (var eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // deal with one row at a time
        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // left to right in each row
            switch(roomGrid[tileIndex]) {
                case TILE_BARN:
                case TILE_SILO:
                    roomGrid[tileIndex -1] = TILE_BUILDING;
                    roomGrid[tileIndex +1] = TILE_BUILDING;
                    break;
                case TILE_FARMHOUSE:
                    roomGrid[tileIndex -1] = TILE_BUILDING;
                    roomGrid[tileIndex +1] = TILE_BUILDING;
                    roomGrid[tileIndex -2] = TILE_BUILDING;
                    roomGrid[tileIndex +2] = TILE_BUILDING;
                    break;
            }
            tileIndex++;
        }
    }
}

function roomTileToIndex(tileCol, tileRow) {
    return (tileCol + ROOM_COLS * tileRow);
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

function getTileTypeAtPixelCoord(pixelX, pixelY) {
    return roomGrid[getTileIndexAtPixelCoord(pixelX, pixelY)];
}

function isTileTypeTransparent(checkTileType) {
    if (isTileTypeBuilding(checkTileType)) {
        return true;
    }
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

function isTileTypeWalkable(tileType) {
    if (tileType >= START_TILE_WALKABLE_GROWTH_RANGE) {
        return true;
    }
    switch (tileType) {
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

function isTileTypeFood(checkTileType) {
    if (checkTileType >= START_TILE_WALKABLE_GROWTH_RANGE) {
        return true;
    }
    return false;
}

function isTileTypePlant(checkTileType) {
    switch (checkTileType) {
        case TILE_FLOWER_01:
        case TILE_FLOWER_02:
            return true;
    }
    return false;
}

function isTileTypeCliff(checkTileType) {
    switch(checkTileType) {
        case TILE_CLIFF_TOP_LEFT:
        case TILE_CLIFF_TOP_MIDDLE:
        case TILE_CLIFF_TOP_RIGHT:
        case TILE_CLIFF_MIDDLE_LEFT:
        case TILE_CLIFF_MIDDLE:
        case TILE_CLIFF_MIDDLE_RIGHT:
        case TILE_CLIFF_BOTTOM_LEFT:
        case TILE_CLIFF_BOTTOM_MIDDLE:
        case TILE_CLIFF_BOTTOM_RIGHT:
            return true;
            break;
        default:
            return false;
            break;
    }
}

function isTileTypeBuilding(tileType) {
    switch (tileType) {
        // case TILE_WOOD_DEST:
        // case TILE_STONE_DEST:
        // case TILE_METAL_DEST:
        // case TILE_FOOD_DEST:
        case TILE_FOOD_SRC:
        case TILE_BUILDING:
        case TILE_BARN:
        case TILE_FARMHOUSE:
        case TILE_SILO:
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

            if (isTileTypeTransparent(tileTypeHere)) {
                canvasContext.drawImage(tileSheet,
                    TILE_GROUND * TILE_W, 0, // top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H, // get full tile size from source
                    tileLeftEdgeX, tileTopEdgeY, // x,y top-left corner for image destination
                    TILE_W, TILE_H); // draw full tile size for destination
            }
            if (isTileTypePlant(tileTypeHere)) {
                canvasContext.drawImage(tileSheet,
                    TILE_GRASS * TILE_W, 0,
                    TILE_W, TILE_H, 
                    tileLeftEdgeX, tileTopEdgeY,
                    TILE_W, TILE_H); 
            }
            if (isTileTypeFood(tileTypeHere)) {
                for (i = 0; i < plantTrackingArray.length; i++) {
                    if (plantTrackingArray[i].mapIndex == tileIndex) {
                        if (plantTrackingArray[i].is_watered == true) {
                            canvasContext.drawImage(tileSheet,
                            TILE_TILLED_WATERED * TILE_W, 0,
                            TILE_W, TILE_H, 
                            tileLeftEdgeX, tileTopEdgeY,
                            TILE_W, TILE_H);
                        } else {
                            canvasContext.drawImage(tileSheet,
                            TILE_TILLED * TILE_W, 0,
                            TILE_W, TILE_H, 
                            tileLeftEdgeX, tileTopEdgeY,
                            TILE_W, TILE_H);
                        }
                    }
                }
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

            } else if ((tileTypeHere != TILE_WOOD_SRC && isTileTypeBuilding(tileTypeHere) == false) || debug3DTiles) {
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
                case TILE_BARN:
                    useImage = barnImage;
                    break;
                case TILE_FARMHOUSE:
                    useImage = farmhouseImage;
                    break;
                case TILE_SILO:
                    useImage = siloImage;
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
    if (player.keyHeld_South) {
        playerWalkSouth.drawExtended(player.x, player.y - playerImage.height / 2, 0, false, 1, 0.2);
        return;
    }
    if (player.keyHeld_West) {
        playerWalkWest.drawExtended(player.x, player.y - playerImage.height / 2, 0, false, 1, 0.2);
        return;
    }
    if (player.keyHeld_East) {
        playerWalkEast.drawExtended(player.x, player.y - playerImage.height / 2, 0, false, 1, 0.2);
        return;
    } 
    canvasContext.drawImage(playerImage, player.x - playerImage.width / 2, player.y - playerImage.height);
    canvasContext.globalAlpha = 1;
} // end of draw3DTiles()
