const PLAYER_PIXELS_MOVE_RATE = 6;
const PLAYER_MAX_ENERGY = 100;

function Player() {
    this.x = 0;
    this.y = 0;
    this.isWalking = false;

    this.itemsHeldAtMouse = new EmptyInventorySlot();

    this.bucketList = [];
    this.storageList = [];

    this.keyHeld_West = false;
    this.keyHeld_North = false;
    this.keyHeld_South = false;
    this.keyHeld_East = false;

    this.playerLastFacingDirection = DIRECTION_SOUTH;
    this.playerLastFacingDirectionImage = playerIdleSouth;

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

    this.playerEnergyLevel = 0;

    this.outlineTargetTile = true; // draw a square around the tile we are aiming at

    this.setupInput = function (leftKey, upKey, downKey, rightKey, leftKey2, upKey2, downKey2, rightKey2) {
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
    };

    this.setupInventory = function () {
        this.inventory = new Inventory(30);
        this.secondInventory = new Inventory(30);        
        this.hotbar = new Inventory(5);
        this.hotbar.equippedSlotIndex = 0;
    };

    this.reset = function () {
        for (var i = 0; i < roomGrid.length; i++) {
            if (roomGrid[i] == TILE_PLAYER) {
                var tileRow = Math.floor(i / ROOM_COLS);
                var tileCol = i % ROOM_COLS;
                this.homeX = tileCol * TILE_W + 0.5 * TILE_W;
                this.homeY = tileRow * TILE_H + 0.5 * TILE_H;
                console.log("homeX: " + this.homeX + " and homeY: " + this.homeY);
                roomGrid[i] = TILE_GROUND;
                break; // found it, so no need to keep searching 
            } // end of if
        } // end of for
        this.setupInventory();
        this.playerColor = 'white';
        this.x = this.homeX;
        this.y = this.homeY;
        centerRadiation(this.x, this.y);
        this.playerEnergyLevel = PLAYER_MAX_ENERGY;

        this.bucketList = [];
        this.bucketList[Resources.Metal] = new Resource(1000, 0);
        this.bucketList[Resources.Stone] = new Resource(1000, 0);
        this.bucketList[Resources.Wood] = new Resource(1000, 0);

        this.storageList = [];
        this.storageList[Resources.Metal] = new Resource(2550, 0);
        this.storageList[Resources.Stone] = new Resource(2550, 0);
        this.storageList[Resources.Wood] = new Resource(1550, 0);
        this.storageList[Resources.Food] = new Resource(1550, 0);

        this.inventory.oldAdd = this.inventory.add;
        this.inventory.add = function (item, count) {
            return player.inventory.oldAdd(item, player.hotbar.add(item, count));
        };

        this.inventory.oldCountItems = this.inventory.countItems;
        this.inventory.countItems = function (item) {
            return player.inventory.oldCountItems(item) + player.hotbar.countItems(item);
        };

        this.inventory.oldRemove = this.inventory.remove;
        this.inventory.remove = function (item, count) {
            if (count > player.inventory.countItems(item)) {
                return false;
            }

            return player.inventory.oldRemove(items, count) || player.hotbar.remove(items, count);
        };

        this.inventory.oldRemoveAll = this.inventory.removeAll;
        this.inventory.removeAll = function (item) {
            return player.inventory.oldRemoveAll(item) + player.hotbar.removeAll(item);
        };

        pickaxeAnimationNorth.setFinished();
        pickaxeAnimationEast.setFinished();
        pickaxeAnimationSouth.setFinished();
        pickaxeAnimationWest.setFinished();

    };  // end reset

    this.getSaveState = function () {
        var result = {};
        result.x = this.x;
        result.y = this.y;

        var bucketList = {};
        for (var resourceType in this.bucketList) {
            var bucket = this.bucketList[resourceType];
            bucketList[resourceType] = {
                max: bucket.max,
                carried: bucket.carried
            };
        }
        result.bucketList = bucketList;

        var storageList = {};
        for (var resourceType in this.storageList) {
            var bucket = this.storageList[resourceType];
            storageList[resourceType] = {
                max: bucket.max,
                carried: bucket.carried
            };
        }
        result.storageList = storageList;

        result.inventory = this.inventory.getSaveState();

        result.hotbar = this.hotbar.getSaveState();

        // remember how many days have elapsed
        result.dayNumber = timer.dayNumber;

        return result;
    };

    this.loadSaveState = function (saveState) {
        this.x = saveState.x;
        this.y = saveState.y;

        for (var resourceType in saveState.bucketList) {
            var bucket = saveState.bucketList[resourceType];
            this.bucketList[resourceType].max = bucket.max;
            this.bucketList[resourceType].carried = bucket.carried;
        }

        for (var resourceType in saveState.storageList) {
            var bucket = saveState.storageList[resourceType];
            this.storageList[resourceType].max = bucket.max;
            this.storageList[resourceType].carried = bucket.carried;
        }

        this.inventory.loadSaveState(saveState.inventory);

        this.hotbar.loadSaveState(saveState.hotbar);

        // remember how many days have elapsed
        if (saveState.dayNumber) // allow malformed data
            timer.dayNumber = saveState.dayNumber - 1;
        else
            timer.dayNumber = 0;

        // start the day fresh, reset the time too
        timer.endOfDay(); // this +1's the dayNumber!

    };

    this.drawPlayerHUD = function () {
        canvasContext.fillStyle = 'white';
        var textLineY = 37, textLineSkip = 10, textLineX = Math.round(canvas.width / 2) - 32;
        var i = 1;
        for (var key in this.bucketList) {
            canvasContext.fillStyle = 'brown';
            canvasContext.fillText(/*'Carried +  '*/ key + ': ', textLineX, textLineY);
            canvasContext.fillText(/*'Stored + ' key + ': ' + */
                (typeof this.storageList[key] !== "undefined" ? this.storageList[key].carried : 0) + '/' + this.storageList[key].max,
                textLineX + 34, textLineY);
            textLineY += textLineSkip;
            i++;
        }
        canvasContext.fillStyle = 'yellow';
        var textLineY = 37, textLineX = Math.round(canvas.width / 3) - 32;
        canvasContext.fillText(this.playerEnergyLevel, textLineX, textLineY)
    };

    this.draw = function () {
        if (this.getMouseActionDirection() == DIRECTION_NONE) {
			this.currentlyFocusedTileIndex = getTileIndexFromAdjacentTileCoord(this.x, this.y, this.playerLastFacingDirection);
		} else {
			this.currentlyFocusedTileIndex = getTileIndexFromAdjacentTileCoord(mouseWorldX, mouseWorldY);
		}

        if (this.outlineTargetTile) {
            // idea: different colour depending on player.currentlyFocusedTileIndex
                        
            if (this.getMouseActionDirection() == DIRECTION_NONE) {
				var target = getAdjacentTileCoord(this.x, this.y, this.playerLastFacingDirection);
			} else {
				var target = getAdjacentTileCoord(mouseWorldX, mouseWorldY);
			}
			
            // yellow square done in code - works
            /*
            canvasContext.beginPath();
            canvasContext.lineWidth = "1";
            canvasContext.strokeStyle = "rgba(255,255,0,0.5)";
            canvasContext.rect(target.x, target.y, TILE_W, TILE_H);
            canvasContext.stroke();
            */
            var strobe = Math.sin(performance.now() / 150) * 0.5 + 0.5; // 0..1..0
            strobe *= 0.2; // never fullbright, 
            strobe += 0.1; // never completely invisible
            //console.log('strobe:' + strobe);
            canvasContext.globalAlpha = strobe;
            canvasContext.drawImage(targetTilePic, target.x - 7, target.y - 7);
            canvasContext.globalAlpha = 1;

        }

        // colorCircle(this.homeX, this.homeY, 25, 'yellow');
        if (this.keyHeld_North) {
            playerWalkNorth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkNorth.update();            
            playFootstep(playerWalkNorth);
            return;
        } else if (this.keyHeld_East) {
            playerWalkEast.draw(this.x, this.y - playerImage.height / 2);
            playerWalkEast.update();            
            playFootstep(playerWalkEast);
            return;
        } else if (this.keyHeld_South) {
            playerWalkSouth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkSouth.update();            
            playFootstep(playerWalkSouth);
            return;
        } else if (this.keyHeld_West) {
            playerWalkWest.draw(this.x, this.y - playerImage.height / 2);
            playerWalkWest.update();            
            playFootstep(playerWalkWest);
            return;
        } 

        if (pickaxeAnimationEast.isFinishedPlaying() == false) {
            pickaxeAnimationEast.draw(this.x, this.y - playerImage.height / 2);
            pickaxeAnimationEast.update();
        } else if (pickaxeAnimationWest.isFinishedPlaying() == false) {
            pickaxeAnimationWest.draw(this.x, this.y - playerImage.height / 2);
            pickaxeAnimationWest.update();
        } else if (pickaxeAnimationNorth.isFinishedPlaying() == false) {
            pickaxeAnimationNorth.draw(this.x, this.y - playerImage.height / 1);
            pickaxeAnimationNorth.update();
        } else if (pickaxeAnimationSouth.isFinishedPlaying() == false) {
            pickaxeAnimationSouth.draw(this.x, this.y - playerImage.height / 5);
            pickaxeAnimationSouth.update();
        }

        switch (this.playerLastFacingDirection) {
            case DIRECTION_NORTH:
                this.playerLastFacingDirectionImage = playerIdleNorth;
                break;
            case DIRECTION_EAST:
                this.playerLastFacingDirectionImage = playerIdleEast;
                break;
            case DIRECTION_SOUTH:
                this.playerLastFacingDirectionImage = playerIdleSouth;
                break;
            case DIRECTION_WEST:
                this.playerLastFacingDirectionImage = playerIdleWest;
                break;
            
        }
        this.playerLastFacingDirectionImage.draw(this.x, this.y - playerImage.height / 2);
    };

    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - (this.y - playerImage.height / 2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    this.move = function () {
        var movementX = 0;
        var movementY = 0;

        if (this.keyHeld_West) {
            movementX -= PLAYER_PIXELS_MOVE_RATE;
            this.playerLastFacingDirection = DIRECTION_WEST;
        }
        if (this.keyHeld_East) {
            movementX += PLAYER_PIXELS_MOVE_RATE;
            this.playerLastFacingDirection = DIRECTION_EAST;
        }
        if (this.keyHeld_North) {
            movementY -= PLAYER_PIXELS_MOVE_RATE;
            this.playerLastFacingDirection = DIRECTION_NORTH;
        }
        if (this.keyHeld_South) {
            movementY += PLAYER_PIXELS_MOVE_RATE;
            this.playerLastFacingDirection = DIRECTION_SOUTH;
        }

        this.getDirectionPlayerIsCurrentlyFacing();

        if ((movementX != 0) || (movementY != 0)) {
            // Adjust speed for diagonal movement
            if ((movementX != 0) && (movementY != 0)) {
                movementX = movementX * Math.SQRT1_2;
                movementY = movementY * Math.SQRT1_2;
            }

            var nextX = Math.round(this.x + movementX);
            var nextY = Math.round(this.y + movementY);
            
            // actually walked into tile type and index
            // for currently focused/selected/activated/highlighted tile, use currentlyFocusedTileIndex
            walkIntoTileType = getTileTypeAtPixelCoord(nextX, nextY);
            walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
            if (walkIntoTileType === undefined) {
                walkIntoTileType = TILE_WALL;
            }

            if (walkIntoTileType == TILE_RECHARGE_STATION) {
                console.log("Going for recharge!");
                for (var i = 0; i < plantTrackingArray.length; i++) {
                    plantTrackingArray[i].dayChanged();
                }

                timer.endOfDay();
                player.playerEnergyLevel = PLAYER_MAX_ENERGY;

                this.y = this.y + TILE_H;
            }
            if (isTileTypeWalkable(walkIntoTileType)) {
                this.x = nextX;
                this.y = nextY;
            } else if (isTileTypeWalkable(getTileTypeAtPixelCoord(this.x, nextY))) {
                this.y = nextY;
            } else if (isTileTypeWalkable(getTileTypeAtPixelCoord(nextX, this.y))) {
                this.x = nextX;
            }
        }//end if nextX & nextY
        
        this._helperTileAction(this.currentlyFocusedTileIndex, false);

        boundPlayerInRadiation();
        soundUpdateOnPlayer();
    }; // end move

    this.doActionOnTile = function (tileIndex = this.currentlyFocusedTileIndex, oncePerClick = true) {
        if (oncePerClick) {
            if (toolKeyPressedThisFrame == false) {
                return;
            }
        }        

        this._helperTileAction(tileIndex);
    };

    this._helperTileAction = function(tileIndex, isAction = true) {
        // if (proper tool is equipped / something else?) {
            if (this.hotbar.equippedSlotIndex >= 0 && this.hotbar.equippedSlotIndex < this.hotbar.numberOfSlots) {
                // don't show outline on unactionable tile by default
                this.outlineTargetTile = false;
                
                // the currently equipped item
                var equippedItem = this.hotbar.slots[this.hotbar.equippedSlotIndex].item;                

                switch (roomGrid[tileIndex]) { // check currently selected tile
                    // ------ farming cases START ------
                    case TILE_GROUND:
                        if (equippedItem == items.hoe.type) {
                            if (isAction) {
                                items.hoe.thing.use(this, tileIndex);
                            }
                            this.outlineTargetTile = true;
                        }
                        break;
                    case TILE_TILLED:
                        if (equippedItem == items.hoe.type) {
                            if (isAction) {
                                items.hoe.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        }
                        else if (equippedItem == items.watercan.type) {
                            if (isAction) {
                                items.watercan.thing.use(this, tileIndex, WATERCAN_USE_RATE);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true; 
                        }
                        else if (equippedItem == items.wheatSeedOne.type) {
                            if (isAction) {
                                items.wheatSeedOne.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        }
                        else if (equippedItem == items.wheatSeedTwo.type) {
                            if (isAction) {
                                items.wheatSeedTwo.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        }                        
                        break;
                    case TILE_TILLED_WATERED:
                        if (equippedItem == items.hoe.type) {
                            if (isAction) {
                                items.hoe.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        }
                        else if (equippedItem == items.watercan.type) {
                            if (isAction) {
                                items.watercan.thing.use(this, tileIndex, WATERCAN_USE_RATE);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true; 
                        }
                        else if (equippedItem == items.wheatSeedOne.type) {
                            if (isAction) {
                                items.wheatSeedOne.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        } else if (equippedItem == items.wheatSeedTwo.type) {
                            if (isAction) {
                                items.wheatSeedTwo.thing.use(this, tileIndex);
                            }
                            // tilled tile ALWAYS shows outline with a suitable equipment equipped
                            this.outlineTargetTile = true;
                        }
                        for (var i = 0; i < plantTrackingArray.length; i++) {
                            if (plantTrackingArray[i].mapIndex == tileIndex) {
                                plantTrackingArray[i].is_watered = true;
                            }
                        }
                        break;
                    // ------ farming cases END ------
                    
                    // ------ resource gathering cases START ------            
                    case TILE_METAL_SRC:                    
                        if (equippedItem == items.pickaxe.type) {
                            if (isAction) {
                                items.pickaxe.thing.use(this, tileIndex);
                            }
                            this.outlineTargetTile = true;
                        }
                        break;
                    case TILE_STONE_SRC:                    
                        if (equippedItem == items.pickaxe.type) {
                            if (isAction) {
                                items.pickaxe.thing.use(this, tileIndex);
                            }
                            this.outlineTargetTile = true;
                        }
                        break;
                    case TILE_WOOD_SRC:
                        if (equippedItem == items.axe.type) {
                            if (isAction) {
                                items.axe.thing.use(this, tileIndex);
                            }
                            this.outlineTargetTile = true;
                        }
                        break;
                    // ------ resource gathering cases END ------
                    
                    // ------ resource depositing cases START ------
                    case TILE_STONE_DEST:
                        if (isAction) {
                            var temp = { carried: this.inventory.countItems(items.STONE.type), makeEmpty: function () { } };
                            this.inventory.remove(items.STONE.type, this.inventory.countItems(items.STONE.type));
                            depositResources(temp, this.storageList[Resources.Stone]);
                        }
                        this.outlineTargetTile = true;
                        break;
                    case TILE_WOOD_DEST:
                        if (isAction) {
                            var temp = { carried: this.inventory.countItems(items.WOOD.type), makeEmpty: function () { } };
                            this.inventory.remove(items.WOOD.type, this.inventory.countItems(items.WOOD.type));
                            depositResources(temp, this.storageList[Resources.Wood]);
                        }
                        this.outlineTargetTile = true;
                        break;
                    // ------ resource depositing cases END ------
    
                    // ------ other cases START ------
                    case TILE_WALL:
                        distToGo = 0;
                        break;
                    case TILE_FOOD_SRC:
                        distToGo = 0;
                        break;
                    case TILE_LAKE_WATER:                        
                        if (equippedItem == items.watercan.type) {
                            if (isAction) {
                                items.watercan.thing.refill(this, WATERCAN_FILL_RATE);                                
                            }
                            this.outlineTargetTile = true;
                        }
                    // ------ other cases END ------
                    
                    // ------ default case START ------
                    default:                        
                        if (roomGrid[tileIndex] >= START_TILE_WALKABLE_GROWTH_RANGE) {
                            if (equippedItem == items.watercan.type) {
                                if (isAction) {
                                    items.watercan.thing.use(this, tileIndex, WATERCAN_USE_RATE);
                                }
                                this.outlineTargetTile = true;
                            }
                            else if (equippedItem == items.hoe.type) {
                                if (isAction) {
                                    items.hoe.thing.use(this, tileIndex);
                                }
                                this.outlineTargetTile = true;
                            }
                        }
                    // ------ default case END ------
                }
            }
    };

    this.isPlayerIdle = function () {
        return (!this.keyHeld_North &&
            !this.keyHeld_South &&
            !this.keyHeld_West &&
            !this.keyHeld_East);
    };

    this.getDirectionPlayerIsCurrentlyFacing = function () {
        //next four if/else if statements set direction only for horizontal and vertical movement
        if (this.keyHeld_West && !this.keyHeld_North && !this.keyHeld_South) {
            this.playerLastFacingDirection = DIRECTION_WEST;
            //console.log("facing west");
        }
        else if (this.keyHeld_East && !this.keyHeld_North && !this.keyHeld_South) {
            this.playerLastFacingDirection = DIRECTION_EAST;
            //console.log("facing east");
        }
        else if (this.keyHeld_North && !this.keyHeld_West && !this.keyHeld_East) {
            this.playerLastFacingDirection = DIRECTION_NORTH;
            //console.log("facing north");
        }
        else if (this.keyHeld_South && !this.keyHeld_West && !this.keyHeld_East) {
            this.playerLastFacingDirection = DIRECTION_SOUTH;
            //console.log("facing south");
        }

        //these four else if statements set direction for diagonal movement rather than horizontal and vertical movement
        else if (this.keyHeld_North && this.keyHeld_East) {
            this.playerLastFacingDirection = DIRECTION_NORTHEAST;
            //console.log("facing northeast");
        }
        else if (this.keyHeld_North && this.keyHeld_West) {
            this.playerLastFacingDirection = DIRECTION_NORTHWEST;
            //console.log("facing northwest");
        }
        else if (this.keyHeld_South && this.keyHeld_East) {
            this.playerLastFacingDirection = DIRECTION_SOUTHEAST;
            //console.log("facing southeast");
        }
        else if (this.keyHeld_South && this.keyHeld_West) {
            this.playerLastFacingDirection = DIRECTION_SOUTHWEST;
            //console.log("facing southwest");
        }
    };

    this.getMouseActionDirection = function () { //checks to see if the mouse is over either the player's current tile or one of the 8 surrounding tiles.
        var mouseTileIndex = getTileIndexAtPixelCoord(mouseWorldX, mouseWorldY);
        var playerTileIndex = getTileIndexAtPixelCoord(this.x, this.y);

        if (getTileIndexFromAdjacentTileIndex(playerTileIndex, DIRECTION_NORTH) == mouseTileIndex) {
            return DIRECTION_NORTH;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex, DIRECTION_EAST) == mouseTileIndex) {
            return DIRECTION_EAST;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex, DIRECTION_SOUTH) == mouseTileIndex) {
            return DIRECTION_SOUTH;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex, DIRECTION_WEST) == mouseTileIndex) {
            return DIRECTION_WEST;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex + 1, DIRECTION_NORTH) == mouseTileIndex) {
            return DIRECTION_NORTHEAST;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex - 1, DIRECTION_NORTH) == mouseTileIndex) {
            return DIRECTION_NORTHWEST;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex + 1, DIRECTION_SOUTH) == mouseTileIndex) {
            return DIRECTION_SOUTHEAST;
        }
        if (getTileIndexFromAdjacentTileIndex(playerTileIndex - 1, DIRECTION_SOUTH) == mouseTileIndex) {
            return DIRECTION_SOUTHWEST;
        }
        return DIRECTION_NONE;        
    }

    this.resetEquippedAnimations = function (itemType) {
        switch (itemType) {
            case items.pickaxe.type:
                if (this.playerLastFacingDirection == DIRECTION_EAST) {
                    pickaxeAnimationEast.reset();
                } else if (this.playerLastFacingDirection == DIRECTION_WEST) {
                    pickaxeAnimationWest.reset();
                } else if (this.playerLastFacingDirection == DIRECTION_NORTH) {
                    pickaxeAnimationNorth.reset();
                } else if (this.playerLastFacingDirection == DIRECTION_SOUTH) {
                    pickaxeAnimationSouth.reset();
                }
            break;        
        }
    };
} // end playerClass
