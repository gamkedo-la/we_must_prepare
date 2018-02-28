// world, room, and tile constants, variables
const ROOM_COLS = 16;
const ROOM_ROWS = 12;

var roomGrid =
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 4, 4, 4, 0, 0, 0, 2, 0, 0, 6, 6, 6, 0, 1,
      1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 1,
      1, 0, 0, 0, 0, 0, 0, 0,-5,-5, 0, 0, 0, 0, 0, 1,
      1, 0,-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0,-4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-3,-3, 0, 1,
      1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 3, 3, 0, 0, 0,-6,-6, 0, 0, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const TILE_W = 50;
const TILE_H = 50;

const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYER = 2;
const TILE_METAL_SRC = 3;
const TILE_WOOD_SRC = 4;
const TILE_STONE_SRC = 5;
const TILE_FOOD_SRC = 6;
const TILE_WOOD_DEST = -TILE_WOOD_SRC;
const TILE_STONE_DEST = -TILE_STONE_SRC;
const TILE_METAL_DEST = -TILE_METAL_SRC;
const TILE_FOOD_DEST = -TILE_FOOD_SRC;
const TILE_BUILDING = 7;

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
  return (tileCol + ROOM_COLS*tileRow);
}

function isTileKindWalkable(tileKind) {
  switch (tileKind) {
      case TILE_GROUND:
        return true;
  }
  return false;
}

function getTileIndexAtPixelCoord(pixelX,pixelY) {
  var tileCol = pixelX / TILE_W;
  var tileRow = pixelY / TILE_H;
  
  // we'll use Math.floor to round down to the nearest whole number
  tileCol = Math.floor( tileCol );
  tileRow = Math.floor( tileRow );

  // first check whether the tile coords fall within valid bounds
  if(tileCol < 0 || tileCol >= ROOM_COLS ||
     tileRow < 0 || tileRow >= ROOM_ROWS) {
     document.getElementById("debugText").innerHTML = "out of bounds:"+pixelX+","+pixelY;
     return undefined;
  }
  
  var tileIndex = roomTileToIndex(tileCol, tileRow);
  return tileIndex;
}

function tileTypeHasTransparency(checkTileType) {
  return (false);
}

function drawRoom() {
  var tileIndex = 0;
  var tileLeftEdgeX = 0;
  var tileTopEdgeY = 0;
  
  for(var eachRow=0; eachRow<ROOM_ROWS; eachRow++) { // deal with one row at a time
    
    tileLeftEdgeX = 0; // resetting horizontal draw position for tiles to left edge
    
    for(var eachCol=0; eachCol<ROOM_COLS; eachCol++) { // left to right in each row

      var tileTypeHere = roomGrid[ tileIndex ]; // getting the tile code for this index
      if( tileTypeHasTransparency(tileTypeHere) ) {
        // canvasContext.drawImage(tilePics[TILE_GROUND], tileLeftEdgeX, tileTopEdgeY);
      }
      // canvasContext.drawImage(tilePics[tileTypeHere], tileLeftEdgeX, tileTopEdgeY);

      var nonNegativeTyleType;
      var tileIsDest = (tileTypeHere < 0);
      if (tileIsDest) {
        nonNegativeTyleType = -tileTypeHere;
      } else {
        nonNegativeTyleType = tileTypeHere;
      }
      canvasContext.fillStyle = tileTestColors[nonNegativeTyleType];
      canvasContext.fillRect(tileLeftEdgeX, tileTopEdgeY, TILE_W, TILE_H);
      
      if (tileIsDest) {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(tileLeftEdgeX + 10, tileTopEdgeY + 10, TILE_W - 20, TILE_H - 20)
      }

      tileIndex++; // increment which index we're going to next check for in the room
      tileLeftEdgeX += TILE_W; // jump horizontal draw position to next tile over by tile width

    } // end of for eachCol
    
    tileTopEdgeY += TILE_H; // jump horizontal draw position down by one full tile height
    
  } // end of for eachRow    
} // end of drawRoom()