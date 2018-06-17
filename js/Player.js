const PLAYER_PIXELS_MOVE_RATE = 6;

function playerClass() {
    this.x = 0;
    this.y = 0;
    this.isWalking = false;

    this.holdingSlot = new emptyInventorySlot();

    this.bucketList = [];
    this.storageList = [];

    this.keyHeld_West = false;
    this.keyHeld_North = false;
    this.keyHeld_South = false;
    this.keyHeld_East = false;

    this.isPlayerFacingNorth = false;
    this.isPlayerFacingSouth = false;
    this.isPlayerFacingWest = false;
    this.isPlayerFacingEast = false;

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
        this.inventory = new InventoryClass(30);
        this.hotbar = new InventoryClass(5);
        this.hotbar.equippedItemIndex = 0;
    }

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

        this.bucketList = [];
        this.bucketList[Resources.Metal] = new resourceClass(1000, 0);
        this.bucketList[Resources.Stone] = new resourceClass(1000, 0);
        this.bucketList[Resources.Wood] = new resourceClass(1000, 0);

        this.storageList = [];
        this.storageList[Resources.Metal] = new resourceClass(2550, 0);
        this.storageList[Resources.Stone] = new resourceClass(2550, 0);
        this.storageList[Resources.Wood] = new resourceClass(1550, 0);
        this.storageList[Resources.Food] = new resourceClass(1550, 0);

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
    };

    this.draw = function () {
        // colorCircle(this.homeX, this.homeY, 25, 'yellow');
        if (this.keyHeld_North) {
            playerWalkNorth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkNorth.update();
            this.playerLastFacingDirectionImage = playerIdleNorth;
            playFootstep(playerWalkNorth);
            return;
        } else if (this.keyHeld_East) {
            playerWalkEast.draw(this.x, this.y - playerImage.height / 2);
            playerWalkEast.update();
            this.playerLastFacingDirectionImage = playerIdleEast;
            playFootstep(playerWalkEast);
            return;
        } else if (this.keyHeld_South) {
            playerWalkSouth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkSouth.update();
            this.playerLastFacingDirectionImage = playerIdleSouth;
            playFootstep(playerWalkSouth);
            return;
        } else if (this.keyHeld_West) {
            playerWalkWest.draw(this.x, this.y - playerImage.height / 2);
            playerWalkWest.update();
            this.playerLastFacingDirectionImage = playerIdleWest;
            playFootstep(playerWalkWest);
            return;
        } else {            
            this.playerLastFacingDirectionImage.draw(this.x, this.y - playerImage.height / 2);
        }
    };

    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - (this.y - playerImage.height / 2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    this.collectResourcesIfAble = function () {
        switch (walkIntoTileType) {
            case TILE_WALL:
                distToGo = 0;
                break;
            case TILE_FOOD_SRC:
                distToGo = 0;
                break;
            case TILE_METAL_SRC:
                if (this.hotbar.slots[this.hotbar.equippedItemIndex].item == items.pickaxe) {
                    if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                        playSFXForCollectingResource(TILE_METAL_SRC);
                        this.inventory.add(items.metal, 1);
                    }
                }
                break;
            case TILE_STONE_SRC:
                if (this.hotbar.slots[this.hotbar.equippedItemIndex].item == items.pickaxe) {
                    if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                        playSFXForCollectingResource(TILE_STONE_SRC);
                        this.inventory.add(items.stone, 1);
                    }
                }
                break;
            case TILE_STONE_DEST:
                var temp = { carried: this.inventory.countItems(items.stone), makeEmpty: function () { } };
                this.inventory.remove(items.stone, this.inventory.countItems(items.stone));
                depositResources(temp, this.storageList[Resources.Stone]);
                break;
            case TILE_WOOD_SRC:
                if (this.hotbar.slots[this.hotbar.equippedItemIndex].item == items.axe) {
                    if (getResourceFromIndex(walkIntoTileIndex, true, this.bucketList) == true) {
                        playSFXForCollectingResource(TILE_WOOD_SRC);
                        this.inventory.add(items.wood, 1);
                    }
                }
                break;
            case TILE_WOOD_DEST:
                var temp = { carried: this.inventory.countItems(items.wood), makeEmpty: function () { } };
                this.inventory.remove(items.wood, this.inventory.countItems(items.wood));
                depositResources(temp, this.storageList[Resources.Wood]);
                break;
            default:
                break;
        }
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
        boundPlayerInRadiation();
        soundUpdateOnPlayer();
    }; // end move

    this.doActionOnLandTile = function (index, oncePerClick) {
        if (oncePerClick) {
            if (toolKeyPressedThisFrame == false) {
                return;
            }
        }
        
        index = getTileIndexFromAdjacentTileCoord(this.x, this.y, this.playerLastFacingDirection);        

        // if (proper tool is equipped / something else?) {
        if (this.hotbar.equippedItemIndex >= 0 && this.hotbar.equippedItemIndex < this.hotbar.slotCount) {
            var equippedItem = this.hotbar.slots[this.hotbar.equippedItemIndex].item;
            switch(roomGrid[index]) {
                case TILE_GROUND:
                    if (equippedItem == items.hoe) {
                        robotTillingLandSFX.play();
                        roomGrid[index] = TILE_TILLED;
                    }
                    break;
                case TILE_TILLED:
                    if (equippedItem == items.watercan) {
                        robotWateringSFX.play();
                        roomGrid[index] = TILE_TILLED_WATERED;
                    }
                    else if (equippedItem == items.wheatSeedOne) {
                        new PlantClass(index, TILE_CORN_SEED);
                        this.hotbar.remove(equippedItem, 1);
                    } 
                    else if (equippedItem == items.wheatSeedTwo) {
                        new PlantClass(index, TILE_TOMATO_SEED);
                        this.hotbar.remove(equippedItem, 1);
                    }
                    break;
                case TILE_TILLED_WATERED:
                    if (equippedItem == items.wheatSeedOne) {
                        new PlantClass(index, TILE_CORN_SEED);
                        this.hotbar.remove(equippedItem, 1);
                    } else if (equippedItem == items.wheatSeedTwo) {
                        new PlantClass(index, TILE_TOMATO_SEED);
                        this.hotbar.remove(equippedItem, 1);
                    }
                    for (var i = 0; i < plantTrackingArray.length; i++) {
                        if (plantTrackingArray[i].mapIndex == index) {
                            plantTrackingArray[i].is_watered = true;
                        }
                    }
                    break;
                default:
                    if (roomGrid[index] >= START_TILE_WALKABLE_GROWTH_RANGE) {
                        if (equippedItem == items.watercan) {
                            for (var i = 0; i < plantTrackingArray.length; i++) {
                                if (plantTrackingArray[i].mapIndex == index) {
                                    plantTrackingArray[i].is_watered = true;
                                    robotWateringSFX.play();
                                }
                            }
                        }
                        else if (equippedItem == items.hoe) {
                            robotTillingLandSFX.play();
        
                            var plantAtIndex = getTileIndexAtPixelCoord(this.x, this.y);
                            plantAtIndex = getTileIndexFromAdjacentTileIndex(plantAtIndex, this.playerLastFacingDirection);
        
                            for (var i = 0; i < plantTrackingArray.length; i++) {
                                if (plantTrackingArray[i].mapIndex == plantAtIndex) {
                                    plantTrackingArray[i].plantRemoved();
                                }
                            }
                        }
                    }
            }            
        }
    };

    this.isPlayerIdle = function () {
        return (!this.keyHeld_North &&
            !this.keyHeld_South &&
            !this.keyHeld_West &&
            !this.keyHeld_East);
    }

    this.getDirectionPlayerIsCurrentlyFacing = function () {
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
    };

} // end playerClass
