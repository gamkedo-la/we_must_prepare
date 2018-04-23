const UNIT_PLACEHOLDER_RADIUS = 5;
const UNIT_PIXELS_MOVE_RATE = 2;
const UNIT_MAX_RAND_DIST_FROM_WALK_TARGET = 50;
const UNIT_SELECTED_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;

function playerClass() {
    this.isWalking = false;
    this.bucketList = [];
    this.storageList = [];
    this.x = 0;
    this.y = 0;

    this.keyHeld_West = false;
    this.keyHeld_North = false;
    this.keyHeld_South = false;
    this.keyHeld_East = false;

    this.controlKeyLeft;
    this.controlKeyUp;
    this.controlKeyDown;
    this.controlKeyRight;

    this.controlKeyLeft2;
    this.controlKeyUp2;
    this.controlKeyDown2;
    this.controlKeyRight2;

    this.setupInput = function (leftKey,upKey,downKey,rightKey, leftKey2,upKey2,downKey2,rightKey2)
    {
        //next four lines set a,w,s,d
        this.controlKeyLeft = leftKey;
        this.controlKeyUp = upKey;
        this.controlKeyDown = downKey;
        this.controlKeyRight = rightKey;

        //these four set left, up, down, right arrows
        this.controlKeyLeft2 = leftKey2;
        this.controlKeyUp2 = upKey2;
        this.controlKeyDown2 = downKey2;
        this.controlKeyRight2 = rightKey2;
    }

    this.reset = function() {
        if(this.homeX == undefined) {
            for(var i=0; i<roomGrid.length; i++) {
              if( roomGrid[i] == TILE_PLAYER) {
                var tileRow = Math.floor(i / ROOM_COLS);
                var tileCol = i % ROOM_COLS;
                this.homeX = tileCol * TILE_W + 0.5 * TILE_W;
                this.homeY = tileRow * TILE_H + 0.5 * TILE_H;
                roomGrid[i] = TILE_GROUND;
                break; // found it, so no need to keep searching 
              } // end of if
            } // end of for
          } // end of if position not saved yet
        
        this.unitColor = 'white';
        this.x = this.homeX;
        this.y = this.homeY;
        this.gotoX = this.x;
        this.gotoY = this.y;
        
        this.myTarget = null;
        
        this.bucketList = [];
        this.bucketList["Metal"] = new resourceClass(10, 0);
        this.bucketList["Stone"] = new resourceClass(10, 0);
        this.bucketList["Wood"] = new resourceClass(10, 0);

        this.storageList = [];
        this.storageList["Metal"] = new resourceClass(50, 0);
        this.storageList["Stone"] = new resourceClass(50, 0);
        this.storageList["Wood"] = new resourceClass(50, 0);

    }  // end reset

    this.drawPlayerHUD = function() {
        canvasContext.fillStyle = 'white';
        var textLineY = 15, textLineSkip = 15, textLineX = 30;
        for (var key in this.bucketList) {
            canvasContext.fillText('Carried ' + key + ': ' + this.bucketList[key].carried + '/' + this.bucketList[key].max, textLineX, textLineY);
            canvasContext.fillText('Stored ' + key + ': ' + 
            (typeof this.storageList[key] !== "undefined" ? this.storageList[key].carried : 0) + '/' + this.storageList[key].max, 
            textLineX * 4, textLineY); textLineY += textLineSkip;
        }
    }

    this.draw = function() {
        
        if (selectedIndex == PLAYER_SELECTED) {
            drawBitmapCenteredAtLocationWithRotation(playerSelection, this.x, this.y, 0);
        }
        canvasContext.drawImage(playerImage, this.x - playerImage.width / 2, this.y - playerImage.height); // coords at base of feet
        if (this.isWalking) {
            canvasContext.beginPath();
            canvasContext.moveTo(this.x, this.y);
            canvasContext.lineTo(this.gotoX, this.gotoY);
            canvasContext.strokeStyle = 'red';
            canvasContext.setLineDash([5, 15]);
            canvasContext.stroke();
        }
    }

    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - (this.y - playerImage.height / 2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    this.setTarget = function(newTarget) {
        this.myTarget = newTarget;
    }

    this.goto = function(destinationX, destinationY) {

        this.gotoX = destinationX;
        this.gotoY = destinationY;
    }

    this.move = function() {

        var deltaX = this.gotoX - this.x;
        var deltaY = this.gotoY - this.y;
        var distToGo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var moveX = UNIT_PIXELS_MOVE_RATE * deltaX / distToGo;
        var moveY = UNIT_PIXELS_MOVE_RATE * deltaY / distToGo;
        var nextX = this.x + moveX;
        var nextY = this.y + moveY;
      
        //Works only if unit is selected and currently fights against the click to move functionality
        /*if (this.keyHeld_North) 
        {
            nextY -= UNIT_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_South) 
        {
            nextY += UNIT_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_West) 
        {
            nextX -= UNIT_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_East) 
        {
            nextX += UNIT_PIXELS_MOVE_RATE;
        }*/

        var walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
        var walkIntoTileType = TILE_WALL;

        if (walkIntoTileIndex != undefined) {
            walkIntoTileType = roomGrid[walkIntoTileIndex];
        }

        switch (walkIntoTileType) {
            case TILE_WALL:
                distToGo = 0;
                break;
            case TILE_FOOD_SRC:
                distToGo = 0;
                break;
            case TILE_METAL_SRC:
                getResourceFromIndex(walkIntoTileIndex, true, this.bucketList);
                break;
            case TILE_METAL_DEST:
                depositResources(this.bucketList["Metal"], this.storageList["Metal"]);
                break;
            case TILE_STONE_SRC:
                getResourceFromIndex(walkIntoTileIndex, true, this.bucketList);
                break;
            case TILE_STONE_DEST:
                depositResources(this.bucketList["Stone"], this.storageList["Stone"]);
                break;
            case TILE_WOOD_SRC:
                getResourceFromIndex(walkIntoTileIndex, true, this.bucketList);
                break;
            case TILE_WOOD_DEST:
                depositResources(this.bucketList["Wood"], this.storageList["Wood"]);
                break;
            default:
                break;
        }

        if (isTileKindWalkable(walkIntoTileType)) {
            this.isWalking = (distToGo > UNIT_PIXELS_MOVE_RATE);
            if (this.isWalking) {
                this.x = nextX;
                this.y = nextY;
            } else {
                this.x = this.gotoX;
                this.y = this.gotoY;
            }
        } else if (this.isWalking) {
            this.isWalking = false;
            console.log('Ran into a wall');
        }
    } // end move
} // end unitClass
