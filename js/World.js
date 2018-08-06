// world, room, and tile constants, variables
const ROOM_COLS = 43;
const ROOM_ROWS = 33;

var roomGrid =
    [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35,
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 41,
        36, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 05, 05, 05, 05, 07, 05, 00, 05, 00, 05, 00, 03, 05, 00, 00, 05, 00, 00, 00, 00, 00, 03, 00, 00, 05, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 07, 00, 05,
        36, 05, 00, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 05, 00, 00, 05, 00, 05, 07, 05, 00, 00, 00, 00, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 00, 00, 00, 00, 00, 00, 00, 07, 00, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 05, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 44, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 07, 05, 00, 00, 05, 00, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 43, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 05, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 04, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 00, 05, 05, 00, 00, 00, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 02, 00, 00, 00, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 30, 32, 32, 32,
        36, 05, 03, 05, 00, 00, 03, 00, 05, 00, 00, 07, 05, 00, 00, 00, 00, 05, 05, 05, 05, 05, 00, 05, 05, 05, 05, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32,
        36, 05, 00, 05, 00, 00, 00, 00, 05, 00, 05, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 05, 00, 00, 00, 00, 00, 30, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 03, 05, 00, 00, 05, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 00, 00, 05, 00, 05, 00, 05, 00, 00, 00, 00, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 05, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 07, 05, 07, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 00, 32, 32, 32, 32, 32, 16, 32,
        36, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 05, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 42, 00, 00, 05, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 05, 00, 00, 07, 05, 00, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 32, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 26, 22, 22, 22, 22, 22, 22, 20, 00, 21, 22, 22, 22, 23, 24, 22, 27, 00, 00, 00, 31, 32, 32, 32, 32, 32, 32,
        36, 05, 00, 05, 18, 00, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 31, 32, 32, 32, 32,
        36, 05, 00, 05, 07, 05, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 00, 00, 07, 28, 00, 07, 07, 05, 00, 00, 31, 32, 32, 32,
        36, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 28, 00, 05, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 28, 07, 07, 00, 00, 00, 00, 00, 00, 00, 31,
        36, 05, 00, 05, 05, 00, 00, 00, 00, 05, 00, 00, 03, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 07, 05, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 05, 00, 28, 00, 00, 05, 00, 00, 00, 00, 00, 00, 07, 00, 00, 05, 00, 00, 28, 00, 03, 05, 07, 00, 00, 07, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 05, 00, 00, 05, 00, 03, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 07, 00, 00, 07, 00, 07, 07, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 05, 00, 05, 00, 00, 00, 00, 05, 00, 00, 28, 00, 00, 00, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 28, 00, 07, 00, 03, 00, 00, 07, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 00, 00, 00, 05, 00, 00, 03, 00, 00, 00, 28, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 07, 00, 00, 05, 00, 28, 00, 00, 00, 00, 07, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 05, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 28, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 07, 05, 00, 05, 00, 00, 00, 00, 00, 00, 00, 29, 22, 22, 22, 22, 23, 24, 22, 22, 22, 22, 22, 22, 22, 22, 22, 25, 00, 00, 05, 00, 05, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 00, 00, 00, 05, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        36, 05, 00, 05, 00, 00, 00, 00, 00, 07, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05,
        39, 05, 00, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05, 05];

var defaultRoomGrid = roomGrid.slice();

const TILE_W = 50;
const TILE_H = 50;
const BUTTON_DIM = TILE_W;
const BUTTON_MARGIN = 5;

const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYER = 2;
const TILE_METAL_SRC = 3;
const TILE_RECHARGE_STATION = 4;
const TILE_WOOD_SRC = 5;
const TILE_WOOD_DEST = 6;
const TILE_METAL_DEST = 6;
const TILE_WOOD_PILE = 6;
const TILE_STONE_SRC = 7;
const TILE_STONE_DEST = 8;
const TILE_FOOD_SRC = 9;
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
const TILE_CLIFF_MIDDLE = 37;
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

const TILE_CORN_SEED = 50;
const TILE_CORN_SEEDLING = 51;
const TILE_CORN_MEDIUM = 52;
const TILE_CORN_FULLY_GROWN = 53;
const TILE_CORN_RIPE = 54;
const TILE_CORN_HARVESTED = 55;
const TILE_EGGPLANT_SEED = 56;
const TILE_EGGPLANT_SEEDLING = 57;
const TILE_EGGPLANT_MEDIUM = 58;
const TILE_EGGPLANT_FULLY_GROWN = 59;
const TILE_EGGPLANT_RIPE = 60;
const TILE_EGGPLANT_HARVESTED = 61;
const TILE_POTATO_SEED = 62;
const TILE_POTATO_SEEDLING = 63;
const TILE_POTATO_MEDIUM = 64;
const TILE_POTATO_FULLY_GROWN = 65;
const TILE_POTATO_RIPE = 66;
const TILE_POTATO_HARVESTED = 67;
const TILE_TOMATO_SEED = 68;
const TILE_TOMATO_SEEDLING = 69;
const TILE_TOMATO_MEDIUM = 70;
const TILE_TOMATO_FULLY_GROWN = 71;
const TILE_TOMATO_RIPE = 72;
const TILE_TOMATO_HARVESTED = 73;
const TILE_CHILI_SEED = 74;
const TILE_CHILI_SEEDLING = 75;
const TILE_CHILI_MEDIUM = 76;
const TILE_CHILI_FULLY_GROWN = 77;
const TILE_CHILI_RIPE = 78;
const TILE_CHILI_HARVESTED = 79;
const TILE_WHEAT_SEED = 80;
const TILE_WHEAT_SEEDLING = 81;
const TILE_WHEAT_MEDIUM = 82;
const TILE_WHEAT_FULLY_GROWN = 83;
const TILE_WHEAT_RIPE = 84;
const TILE_WHEAT_HARVESTED = 85;
const START_TILE_WALKABLE_GROWTH_RANGE = TILE_CORN_SEED;  // make sure to keeps plants at the end of this list or there will be weird issues with walking through items
const LAST_TILE_ENUM = TILE_TOMATO_HARVESTED;

const DIRECTION_NONE = -1;
const DIRECTION_NORTH = 0;
const DIRECTION_EAST = 1;
const DIRECTION_SOUTH = 2;
const DIRECTION_WEST = 3;
const DIRECTION_NORTHEAST = 4;
const DIRECTION_NORTHWEST = 5;
const DIRECTION_SOUTHEAST = 6;
const DIRECTION_SOUTHWEST = 7;

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

function getRoomGridSaveState() {
    return roomGrid.slice();
}

function loadRoomGridSaveState(saveState) {
    // Protect against older save states
    if (!saveState || saveState.length === 0) {
        return;
    }
    roomGrid = saveState;
}

function extendBuildingCollision() {
    var tileIndex = 0;
    for (var eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // deal with one row at a time
        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // left to right in each row
            switch (roomGrid[tileIndex]) {
                case TILE_BARN:
                case TILE_SILO:
                    roomGrid[tileIndex - 1] = TILE_BUILDING;
                    roomGrid[tileIndex + 1] = TILE_BUILDING;
                    break;
                case TILE_FARMHOUSE:
                    roomGrid[tileIndex - 1] = TILE_BUILDING;
                    roomGrid[tileIndex + 1] = TILE_BUILDING;
                    roomGrid[tileIndex - 2] = TILE_BUILDING;
                    roomGrid[tileIndex + 2] = TILE_BUILDING;
                    break;
            }
            tileIndex++;
        }
    }
}

function getTileIndexAtTileCoord(tileCol, tileRow) {
    return (tileCol + ROOM_COLS * tileRow);
}

function getTileIndexFromAdjacentTileIndex(index, direction) {
    if (index > 0 && index < ROOM_COLS * ROOM_ROWS) {
        switch (direction) {
            case DIRECTION_NORTH:
                index -= ROOM_COLS;
                if (index < ROOM_COLS) {
                    index = -1;
                }
                break;
            case DIRECTION_EAST:
                if (index % ROOM_COLS != 0 && (index % ROOM_COLS + 1 != 1)) {
                    index += 1;
                }
                else {
                    index = -1;
                }
                break;
            case DIRECTION_SOUTH:
                index += ROOM_COLS;
                break;
            case DIRECTION_WEST:
                if (index % ROOM_COLS != 0 && (index % ROOM_COLS + 1 != 1)) {
                    index -= 1;
                }
                else {
                    index = -1;
                }
                break;
            default:
        }
    }
    else {
        index = -1;
    }

    return index;
}

function getAdjacentTileCoord(pixelX, pixelY, direction, coordThreshold = 15) {

    // force the next tile over
    switch (direction) {
        case DIRECTION_NORTH:
            pixelY -= TILE_H;
            break;
        case DIRECTION_EAST:
            pixelX += TILE_W;
            break;
        case DIRECTION_SOUTH:
            pixelY += TILE_H;
            break;
        case DIRECTION_WEST:
            pixelX -= TILE_W;
            break;
        default:
    }

    // fudge to match code below
    switch (direction) {
        case DIRECTION_NORTH:
            pixelY -= coordThreshold;
            break;
        case DIRECTION_EAST:
            pixelX += coordThreshold;
            break;
        case DIRECTION_SOUTH:
            pixelY += coordThreshold;
            break;
        case DIRECTION_WEST:
            pixelX -= coordThreshold;
            break;
        default:
    }

    // snap to grid
    pixelX = Math.floor(pixelX / TILE_W) * TILE_W;
    pixelY = Math.floor(pixelY / TILE_H) * TILE_H;

    return { x: pixelX, y: pixelY };

}

function getTileIndexFromAdjacentTileCoord(pixelX, pixelY, direction, coordThreshold = 15) {
    var index;

    switch (direction) {
        case DIRECTION_NORTH:
            pixelY -= coordThreshold;
            break;
        case DIRECTION_EAST:
            pixelX += coordThreshold;
            break;
        case DIRECTION_SOUTH:
            pixelY += coordThreshold;
            break;
        case DIRECTION_WEST:
            pixelX -= coordThreshold;
            break;
        default:
    }

    index = getTileIndexAtPixelCoord(pixelX, pixelY);

    index = getTileIndexFromAdjacentTileIndex(index, direction);

    return index;
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

    var tileIndex = getTileIndexAtTileCoord(tileCol, tileRow);
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

function isTileTypeCrop(checkTileType) {
    if (checkTileType >= START_TILE_WALKABLE_GROWTH_RANGE) {
        return true;
    }
    return false;
}

function isTileTypeFoliage(checkTileType) {
    switch (checkTileType) {
        case TILE_FLOWER_01:
        case TILE_FLOWER_02:
            return true;
    }
    return false;
}

function isTileTypeCliff(checkTileType) {
    switch (checkTileType) {
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

    for (let eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // deal with one row at a time
        tileLeftEdgeX = 0; // resetting horizontal draw position for tiles to left edge

        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // left to right in each row
            let tileTypeHere = roomGrid[tileIndex]; // getting the tile code for this index           

            let tileToDraw = TILE_GROUND;

            if (isTileTypeTransparent(tileTypeHere)) {
                tileToDraw = TILE_GROUND;
            }
            if (isTileTypeFoliage(tileTypeHere)) {
                tileToDraw = TILE_GRASS;
            }
            if (isTileTypeCrop(tileTypeHere)) {
                for (var i = 0; i < plantTrackingArray.length; i++) {
                    if (plantTrackingArray[i].mapIndex == tileIndex) {
                        tileToDraw = plantTrackingArray[i].isWatered ? TILE_TILLED_WATERED : TILE_TILLED;
                    }
                }
            }
            canvasContext.drawImage(tileSheet,
                tileToDraw * TILE_W, 0,
                TILE_W, TILE_H,
                tileLeftEdgeX, tileTopEdgeY,
                TILE_W, TILE_H);

            if ((tileTypeHere != TILE_WOOD_SRC && isTileTypeBuilding(tileTypeHere) == false) || debug3DTiles) {
                canvasContext.drawImage(tileSheet,
                    tileTypeHere * TILE_W, 0, // top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H, // get full tile size from source
                    tileLeftEdgeX, tileTopEdgeY, // x,y top-left corner for image destination
                    TILE_W, TILE_H); // draw full full tile size for destination
                if (tileIndex == selectedIndex) {
                    canvasContext.drawImage(buildingSelection, tileLeftEdgeX, tileTopEdgeY);
                }
            }

            tileIndex++;
            tileLeftEdgeX += TILE_W; // jump horizontal draw position to next tile over by tile width
        } // end of for eachCol

        tileTopEdgeY += TILE_H; // jump horizontal draw position down by one full tile height
    } // end of for eachRow    

    // Reset variables for the next for-loop
    tileIndex = 0;
    tileLeftEdgeX = 0;
    tileTopEdgeY = 0;

    // Separate for-loop so that plants are not overlapped by other tiles
    for (let eachRow = 0; eachRow < ROOM_ROWS; eachRow++) { // Deal with one row at a time
        tileLeftEdgeX = 0; // Resetting horizontal draw position for tiles to left edge

        for (var eachCol = 0; eachCol < ROOM_COLS; eachCol++) { // Left to right in each row
            var tileTypeHere = roomGrid[tileIndex]; // Getting the tile code for this index            

            if (tileTypeHere >= START_TILE_WALKABLE_GROWTH_RANGE) {
                var sheetIndex = tileTypeHere - START_TILE_WALKABLE_GROWTH_RANGE;
                var sheetStage = sheetIndex % 6;
                var sheetType = Math.floor(sheetIndex / 6);

                var cropAtX = tileLeftEdgeX + TILE_W * 0.5;  // Center of tile width
                var cropAtY = tileTopEdgeY + TILE_H * 0.5;   // Center of tile height
                var cropOffsetY = -6;                        // Offset upwards from center of tile 

                const NO_WIND_ROTATE_FACTOR = 0.1    // So that plant does not sit still even if there is no wind (would look unlively)
                const WIND_ROTATE_LIMIT_FACTOR = 0.2 // Only rotate 0.2 of wind magnitude to avoid crop rotating in almost full circle
                var windDirection = weather.howWindy.direction.x;
                var windStrength = weather.howWindy.magnitude;
                windStrength = (windStrength > 0 ? windStrength : NO_WIND_ROTATE_FACTOR) * WIND_ROTATE_LIMIT_FACTOR;

                // Rotation in radians
                var rotateTarget = windStrength * Math.sin(performance.now() * 0.004) + windDirection * windStrength;
                var rotateTo = 0;

                canvasContext.save();

                // Rotate and offset only if crop grew past the seed stage
                var pivotPosY = 0;
                for (let i = 0; i < plantTrackingArray.length; i++) {
                    if (plantTrackingArray[i].mapIndex == tileIndex) {
                        if (plantTrackingArray[i].currentPlantStage > 0) {   // If past seed stage
                            rotateTo = rotateTarget;                                // Rotation in radians
                            cropAtY = tileTopEdgeY + TILE_H * 0.5 - cropOffsetY;    // Adjust offset of crop sprite
                            pivotPosY = cropOffsetY * 4;                            // Set rotation pivot
                            break;
                        }
                    }
                }

                canvasContext.translate(cropAtX, cropAtY);
                canvasContext.rotate(rotateTo); // Rotation in radians
                canvasContext.translate(0, pivotPosY);

                canvasContext.drawImage(plantSpritesheet,
                    sheetStage * TILE_W, sheetType * TILE_H,    // Top-left corner of tile art, multiple of tile width
                    TILE_W, TILE_H,                             // Get full tile size from source
                    -TILE_W / 2, -TILE_H / 2,                   // Top-left corner for image destination
                    TILE_W, TILE_H);                            // Draw full tile size for destination                    

                canvasContext.restore();
            }

            tileIndex++;
            tileLeftEdgeX += TILE_W; // Jump horizontal draw position to next tile over by tile width
        } // End of for eachCol

        tileTopEdgeY += TILE_H; // Jump horizontal draw position down by one full tile height
    }

} // End of drawGroundTiles()

function drawSiloDisplays(x, y) { //render the bars on the silo sprite that tell you how close to winning you are

    //console.log('drawSiloDisplays ' + x + ',' + y);
    if (window.buildingStorage) {
        // percent complete
        var storedPercentage = buildingStorage.preparednessLevel();
        buildingStorage.drawWinBars(x, y);
    }
}

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
                var newDepthObject = new DepthObject(tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H - depthGap,
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

        if (allObjectsToDrawDepthSorted[j].useImg === siloImage) {
            drawSiloDisplays(allObjectsToDrawDepthSorted[j].x, allObjectsToDrawDepthSorted[j].y);
        }
    }

    canvasContext.globalAlpha = 0.2; // make the following mostly transparent:
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
    // canvasContext.drawImage(playerImage, player.x - playerImage.width / 2, player.y - playerImage.height);
    canvasContext.globalAlpha = 1;


} // End of draw3DTiles()
