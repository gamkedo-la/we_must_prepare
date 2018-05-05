const PLAYER_PIXELS_MOVE_RATE = 3;

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

    this.isPlayerFacingNorth = false;
    this.isPlayerFacingSouth = false;
    this.isPlayerFacingWest = false;
    this.isPlayerFacingEast = false;

    this.controlKeyLeft;
    this.controlKeyUp;
    this.controlKeyDown;
    this.controlKeyRight;

    this.controlKeyLeft2;
    this.controlKeyUp2;
    this.controlKeyDown2;
    this.controlKeyRight2;
    
    var walkIntoTileIndex = -1;
    var walkIntoTileType = TILE_WALL;

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
        
        this.playerColor = 'white';
        this.x = this.homeX;
        this.y = this.homeY;
        
        this.bucketList = [];
        this.bucketList[Resources.Metal] = new resourceClass(1000, 0);
        this.bucketList[Resources.Stone] = new resourceClass(1000, 0);
        this.bucketList[Resources.Wood] = new resourceClass(1000, 0);

        this.storageList = [];
        this.storageList[Resources.Metal] = new resourceClass(50, 0);
        this.storageList[Resources.Stone] = new resourceClass(50, 0);
        this.storageList[Resources.Wood] = new resourceClass(50, 0);

    }  // end reset

    this.drawPlayerHUD = function() {
        canvasContext.fillStyle = 'white';
        var textLineY = 15, textLineSkip = 15, textLineX = 30;
				var i = 1;
        for (var key in this.bucketList) {
            canvasContext.fillText('Carried ' + key + ': ' + inventory.countItems(i), textLineX, textLineY);
            canvasContext.fillText('Stored ' + key + ': ' + 
            (typeof this.storageList[key] !== "undefined" ? this.storageList[key].carried : 0) + '/' + this.storageList[key].max, 
            textLineX * 4, textLineY); textLineY += textLineSkip;
						i++;
        }
    }

    this.draw = function(direction) {
        canvasContext.drawImage(playerImage, this.x - playerImage.width / 2, this.y - playerImage.height); // coords at base of feet
        //playerWalkUp.draw(this.x,this.y,0,1);
    }
    
    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - (this.y - playerImage.height / 2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    
    this.collectResourcesIfAble = function() {
	    switch (walkIntoTileType) {
            case TILE_WALL:
                distToGo = 0;
                break;
            case TILE_FOOD_SRC:
                distToGo = 0;
                break;
            case TILE_METAL_SRC:
                if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                    inventory.add(items.metal, 1);
                }
                break;
            case TILE_METAL_DEST:
                var temp = {carried: inventory.countItems(items.metal), makeEmpty: function(){}};
                inventory.remove(items.metal, inventory.countItems(items.metal));
                depositResources(temp, this.storageList[Resources.Metal]);
                break;
            case TILE_STONE_SRC:
                if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                    inventory.add(items.stone, 1);
                }
                break;
            case TILE_STONE_DEST:
                var temp = {carried: inventory.countItems(items.stone), makeEmpty: function(){}};
                inventory.remove(items.stone, inventory.countItems(items.stone));
                depositResources(temp, this.storageList[Resources.Stone]);
                break;
            case TILE_WOOD_SRC:
                if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                    inventory.add(items.wood, 1);
                }
                break;
            case TILE_WOOD_DEST:
                var temp = {carried: inventory.countItems(items.wood), makeEmpty: function(){}};
                inventory.remove(items.wood, inventory.countItems(items.wood));
                depositResources(temp, this.storageList[Resources.Wood]);
                break;
            default:
                break;
        }
    }

    this.workingLand = function(index, oncePerClick) {
        if (oncePerClick) {
            if (toolKeyPressedThisFrame == false) {
                return;
            }   
        }
        // if (proper tool is equipped / something else?) {
        if (roomGrid[index] == TILE_GROUND)   
        roomGrid[index] = TILE_TILLED;
    };

    this.move = function() {
        var nextX = this.x;
        var nextY = this.y;
      
        //Works but note that in order to pick up materials you need to keep moving into the material
        if (this.keyHeld_North) 
        {
            nextY -= PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_South) 
        {
            nextY += PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_West) 
        {
            nextX -= PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_East) 
        {
            nextX += PLAYER_PIXELS_MOVE_RATE;
        }

        this.getDirectionPlayerIsCurrentlyFacing();

		if((nextX != this.x) || (nextY != this.y))
		{
			walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
	        walkIntoTileType = TILE_WALL;
	
	        if (walkIntoTileIndex != undefined) {
	            walkIntoTileType = roomGrid[walkIntoTileIndex];
	        }
	
	        if (isTileKindWalkable(walkIntoTileType)) 
	        {
	            this.x = nextX;
	            this.y = nextY;
	        }
	        else
	        {
	            // console.log('Ran into a wall!');
	        }

		}//end if nextX & nextY
    } // end move

    this.getDirectionPlayerIsCurrentlyFacing = function() 
    {
        //next four if/else if statements set direction only for horizontal and vertical movement
        if (this.keyHeld_West && !this.keyHeld_North && !this.keyHeld_South) {
            this.isPlayerFacingWest = true;

            //console.log("facing west");

            this.isPlayerFacingEast = false;
            this.isPlayerFacingSouth = false;
            this.isPlayerFacingNorth = false;
        }
        else if (this.keyHeld_East && !this.keyHeld_North && !this.keyHeld_South) {
            this.isPlayerFacingEast = true;

            //console.log("facing east");

            this.isPlayerFacingWest = false;           
            this.isPlayerFacingSouth = false;
            this.isPlayerFacingNorth = false;
        }
        else if (this.keyHeld_North && !this.keyHeld_West && !this.keyHeld_East) {
            this.isPlayerFacingNorth = true;

            //console.log("facing north");

            this.isPlayerFacingWest = false;
            this.isPlayerFacingEast = false;            
            this.isPlayerFacingSouth = false;
        }
        else if (this.keyHeld_South && !this.keyHeld_West && !this.keyHeld_East) {
            this.isPlayerFacingSouth = true;

            //console.log("facing south");

            this.isPlayerFacingWest = false;
            this.isPlayerFacingEast = false;
            this.isPlayerFacingNorth = false;           
        }

        //these four else if statements set direction for diagonal movement rather than horizontal and vertical movement
        else if (this.keyHeld_North && this.keyHeld_East) {
            this.isPlayerFacingNorth = true;
            this.isPlayerFacingEast = true;

            //console.log("facing northeast");

            this.isPlayerFacingWest = false;                        
            this.isPlayerFacingSouth = false;
        }
        else if (this.keyHeld_North && this.keyHeld_West) {
            this.isPlayerFacingNorth = true;
            this.isPlayerFacingWest = true;

            //console.log("facing northwest");

            this.isPlayerFacingEast = false;            
            this.isPlayerFacingSouth = false;
        }
        else if (this.keyHeld_South && this.keyHeld_East) {
            this.isPlayerFacingSouth = true;
            this.isPlayerFacingEast = true;

            //console.log("facing southeast");

            this.isPlayerFacingWest = false;            
            this.isPlayerFacingNorth = false;            
        }
        else if (this.keyHeld_South && this.keyHeld_West) {
            this.isPlayerFacingSouth = true;
            this.isPlayerFacingWest = true;

            //console.log("facing southwest");

            this.isPlayerFacingEast = false;
            this.isPlayerFacingNorth = false;      
        }
    }

} // end playerClass