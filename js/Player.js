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
        // this.secondInventory = new Inventory(30);
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
                // console.log("homeX: " + this.homeX + " and homeY: " + this.homeY);
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

        result.playerEnergyLevel = this.playerEnergyLevel;

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

        this.playerEnergyLevel = saveState.playerEnergyLevel;
    };

    this.drawPlayerHUD = function () {

        //var oldFont = canvasContext.font; // FIXME: do we need to remember and reset this?

        canvasContext.font = '8px Arial';

        // display the player inventory carried / max totals
        // var textLineY = 35, textLineSkip = 11, textLineX = Math.round(canvas.width / 2) + 24;
        // var i = 1;
        // var str = "";
        // for (var key in this.bucketList) {
        //     str = (typeof this.storageList[key] !== "undefined" ? this.storageList[key].carried : 0); //+ '/' + this.storageList[key].max
        //     canvasContext.fillStyle = 'black'; // shadow
        //     canvasContext.fillText(str, textLineX, textLineY + 1);
        //     canvasContext.fillStyle = 'brown';
        //     canvasContext.fillText(str, textLineX, textLineY);
        //     textLineY += textLineSkip;
        //     i++;
        // }

        const ENERGY_BAR_W = canvas.width * 0.18;
        const ENERGY_BAR_H = 6;

        let playerEnergyLeftLevel = (this.playerEnergyLevel / PLAYER_MAX_ENERGY) * ENERGY_BAR_W;

        let barRectX = (canvas.width - ENERGY_BAR_W) * 0.5 + ENERGY_BAR_W * 0.5;
        let barRectY = canvas.height - 18;
        let barRectColor = this.playerEnergyLevel >= 70 ? "yellow" : this.playerEnergyLevel >= 40 ? "orange" : "red";

        const ENERGY_LABEL_W = 14;

        colorRect(barRectX - playerEnergyLeftLevel - ENERGY_LABEL_W, barRectY, playerEnergyLeftLevel, ENERGY_BAR_H, barRectColor);
        colorRect(barRectX + ENERGY_LABEL_W, barRectY, playerEnergyLeftLevel, ENERGY_BAR_H, barRectColor);

        const PLAYER_ENERGY_LEVEL_ROUNDED = Math.floor(this.playerEnergyLevel);
        let energyText = this.playerEnergyLevel >= 100 ? PLAYER_ENERGY_LEVEL_ROUNDED :
            this.playerEnergyLevel >= 10 ? ' ' + PLAYER_ENERGY_LEVEL_ROUNDED :
                "  " + PLAYER_ENERGY_LEVEL_ROUNDED;
        colorText(energyText, canvas.width * 0.5 - 8, canvas.height - 12, "yellow");
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

        var drewAnimationAlready = false; // did we draw a walking frame?

        if (this.playerLastFacingDirection == DIRECTION_WEST) { // draw item BEHIND player
            this.drawEquippedItem(); // draw first, otherwise we draw it below
        }

        // colorCircle(this.homeX, this.homeY, 25, 'yellow');
        if (this.keyHeld_North) {
            playerWalkNorth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkNorth.update();
            playFootstep(playerWalkNorth);
            drewAnimationAlready = true;
            //return;
        } else if (this.keyHeld_East) {
            playerWalkEast.draw(this.x, this.y - playerImage.height / 2);
            playerWalkEast.update();
            playFootstep(playerWalkEast);
            drewAnimationAlready = true;
            //return;
        } else if (this.keyHeld_South) {
            playerWalkSouth.draw(this.x, this.y - playerImage.height / 2);
            playerWalkSouth.update();
            playFootstep(playerWalkSouth);
            drewAnimationAlready = true;
            //return;
        } else if (this.keyHeld_West) {
            playerWalkWest.draw(this.x, this.y - playerImage.height / 2);
            playerWalkWest.update();
            playFootstep(playerWalkWest);
            drewAnimationAlready = true;
            //return;
        }

        if (!drewAnimationAlready) // only draw these if idle:
        {
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

            for (var i = toolAnimList.length - 1; i >= 0; i--) {
                if (toolAnimList[i].framesLeft > 0) {
                    toolAnimList[i].draw();
                } else {
                    toolAnimList.splice(i);
                }
            }

            switch (this.playerLastFacingDirection) {
                case DIRECTION_NORTH:
                    this.playerLastFacingDirectionImage = playerIdleNorth;
                    break;
                case DIRECTION_EAST:
                case DIRECTION_NORTHEAST:
                case DIRECTION_SOUTHEAST:
                    this.playerLastFacingDirectionImage = playerIdleEast;
                    break;
                case DIRECTION_SOUTH:
                    this.playerLastFacingDirectionImage = playerIdleSouth;
                    break;
                case DIRECTION_WEST:
                case DIRECTION_NORTHWEST:
                case DIRECTION_SOUTHWEST:
                    this.playerLastFacingDirectionImage = playerIdleWest;
                    break;

            }
            this.playerLastFacingDirectionImage.draw(this.x, this.y - playerImage.height / 2);

        } // if idle

        // draw the currently held tool from inventory in our hands
        if (this.playerLastFacingDirection != DIRECTION_WEST) { // draw item IN FRONT OF player
            this.drawEquippedItem();
        }

    };

    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - (this.y - playerImage.height / 2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    this.move = function () {
        var movementX = 0;
        var movementY = 0;

        // maybe spawn some particles
        var moved = ((this.prev_x != this.x) || (this.prev_y != this.y));
        if (moved) walkFX(this.x, this.y - 20); // dust / footsteps
        this.prev_x = this.x;
        this.prev_y = this.y;

        if (this.keyHeld_North) {
            movementY -= PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_East) {
            movementX += PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_South) {
            movementY += PLAYER_PIXELS_MOVE_RATE;
        }
        if (this.keyHeld_West) {
            movementX -= PLAYER_PIXELS_MOVE_RATE;
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
                if (player.playerEnergyLevel = PLAYER_MAX_ENERGY) {
                    console.log("Going for recharge!");
                    for (var i = 0; i < plantTrackingArray.length; i++) {
                        plantTrackingArray[i].dayChanged();
                    }
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

        this.getTileTypeAction(this.currentlyFocusedTileIndex, false);

        boundPlayerInRadiation();
        soundUpdateOnPlayer();
    }; // end move

    this.doActionOnTile = function (tileIndex = this.currentlyFocusedTileIndex, oncePerClick = true) {
        if (oncePerClick) {
            let toolToUseOnTile = this.getTileTypeAction(tileIndex);
            if (toolToUseOnTile && toolToUseOnTile != items.nothing) {
                toolToUseOnTile.use(this, tileIndex);
                toolAnimList.push(new toolAnimatorAtAngle(player.x, player.y, toolToUseOnTile.type, 10));
            }
        }
    };

    this.drawEquippedItem = function () { // used in draw() function to show items in our hands

        //console.log("drawEquippedItem from hotbar slot " + this.hotbar.equippedSlotIndex);

        // if (proper tool is equipped / something else?) 
        if (this.hotbar.equippedSlotIndex >= 0 && this.hotbar.equippedSlotIndex < this.hotbar.numberOfSlots) {
            let equippedItemType = this.hotbar.slots[this.hotbar.equippedSlotIndex].item;

            // items spritesheet
            var sx = sy = 0; // where on spritesheet
            var sw = sh = 50; // size of item sprite
            var dw = dh = 25; // size of tool in hand
            var dx = this.x; // where in world
            var dy = this.y - 24;
            var flippedX = false;
            var flippedY = false;

            switch (equippedItemType) {
                case items.hoe.type:
                    sx = 6 * sw;
                    dy += 10;
                    // the hoe seems a bit low when facing this way; 
                    // could render it flipped but then it looks like we'll take a blade to the face!
                    // flippedY = true;
                    // dy += 20;
                    break;
                case items.pickaxe.type:
                    sx = 7 * sw;
                    break;
                case items.axe.type:
                    sx = 4 * sw;
                    break;
                case items.watercan.type:
                    sx = 5 * sw;
                    break;
                case items.seedCorn.type:
                    sx = 8 * sw;
                    break;
                case items.seedTomato.type:
                    sx = 9 * sw;
                    break;
                case items.seedEggplant.type:
                    sx = 3 * sw;
                    sy = 1 * sh;
                    break;
                case items.seedPotato.type:
                    sx = 5 * sw;
                    sy = 1 * sh;
                    break;
                case items.seedChili.type:
                    sx = 7 * sw;
                    sy = 1 * sh;
                    break;
                case items.seedWheat.type:
                    sx = 9 * sw;
                    sy = 1 * sh;
                    break;
                default:
                    return;  // nothing equippable in current slot to hold (stops robokedo from holding a grey square)
            }

            switch (this.playerLastFacingDirection) {
                case DIRECTION_NORTH:
                    dx += 12;
                    dy -= 4;
                case DIRECTION_EAST:
                case DIRECTION_NORTHEAST:
                case DIRECTION_SOUTHEAST:
                    flippedX = true;
                    dx += 22;
                    break;
                case DIRECTION_SOUTH:
                    dx -= 8;
                    dy -= 4;
                case DIRECTION_WEST:
                    dx -= 4;
                case DIRECTION_NORTHWEST:
                case DIRECTION_SOUTHWEST:
                    dx -= 22;
                    flipped = false;
                    break;

            }

            canvasContext.save();
            canvasContext.translate(dx, dy);
            canvasContext.scale(flippedX ? -1 : 1, flippedY ? -1 : 1);
            canvasContext.drawImage(itemSheet, sx, sy, sw, sh, 0, 0, dw, dh);
            canvasContext.restore();
        }

    }

    this.getTileTypeAction = function (tileIndex, isAction = true) {
        // if (proper tool is equipped / something else?) {
        if (this.hotbar.equippedSlotIndex >= 0 && this.hotbar.equippedSlotIndex < this.hotbar.numberOfSlots) {
            // don't show outline on unactionable tile by default
            this.outlineTargetTile = false;

            // the currently equipped item
            let equippedItemType = this.hotbar.slots[this.hotbar.equippedSlotIndex].item;
            let equippedItem = items.nothing;
            let currentTile = roomGrid[tileIndex];

            switch (equippedItemType) {
                case items.hoe.type:
                    if (currentTile == TILE_GROUND || currentTile == TILE_TILLED || currentTile == TILE_TILLED_WATERED || currentTile >= START_TILE_WALKABLE_GROWTH_RANGE) {
                        equippedItem = isAction ? items.hoe : equippedItem;
                        this.outlineTargetTile = true;
                    }
                    break;

                case items.pickaxe.type:
                    if (currentTile == TILE_METAL_SRC || currentTile == TILE_STONE_SRC) {
                        equippedItem = isAction ? items.pickaxe : equippedItem;
                        this.outlineTargetTile = true;
                    }
                    break;

                case items.axe.type:
                    if (currentTile == TILE_WOOD_SRC) {
                        equippedItem = isAction ? items.axe : equippedItem;
                        this.outlineTargetTile = true;
                    }
                    break;

                case items.watercan.type:
                    if (currentTile == TILE_TILLED || currentTile == TILE_TILLED_WATERED || currentTile >= START_TILE_WALKABLE_GROWTH_RANGE) {
                        equippedItem = isAction ? items.watercan : equippedItem;
                        // tilled tile ALWAYS shows outline with a suitable equipment equipped
                        this.outlineTargetTile = true;
                    }
                    else if (currentTile == TILE_LAKE_WATER) {
                        if (isAction) {
                            items.watercan.fill(this);
                        }
                        this.outlineTargetTile = true;
                    }
                    break;

                case items.seedCorn.type:
                case items.seedTomato.type:
                case items.seedEggplant.type:
                case items.seedPotato.type:
                case items.seedChili.type:
                case items.seedWheat.type:
                    if (currentTile == TILE_TILLED || currentTile == TILE_TILLED_WATERED) {
                        if (equippedItemType == items.seedCorn.type) {
                            equippedItem = isAction ? items.seedCorn : equippedItem;
                        }
                        else if (equippedItemType == items.seedTomato.type) {
                            equippedItem = isAction ? items.seedTomato : equippedItem;
                        }
                        else if (equippedItemType == items.seedEggplant.type) {
                            equippedItem = isAction ? items.seedEggplant : equippedItem;
                        }
                        else if (equippedItemType == items.seedPotato.type) {
                            equippedItem = isAction ? items.seedPotato : equippedItem;
                        }
                        else if (equippedItemType == items.seedChili.type) {
                            equippedItem = isAction ? items.seedChili : equippedItem;
                        }
                        else if (equippedItemType == items.seedWheat.type) {
                            equippedItem = isAction ? items.seedWheat : equippedItem;
                        }
                        // tilled tile ALWAYS shows outline with a suitable equipment equipped
                        this.outlineTargetTile = true;
                    }
                    break;
            }

            switch (roomGrid[tileIndex]) { // check currently selected tile
                // ------ harvesting cases START ------
                case TILE_CORN_RIPE:
                case TILE_TOMATO_RIPE:
                case TILE_EGGPLANT_RIPE:
                case TILE_POTATO_RIPE:
                case TILE_CHILI_RIPE:
                case TILE_WHEAT_RIPE:
                    if (isAction) {
                        for (var i = 0; i < plantTrackingArray.length; i++) {
                            if (plantTrackingArray[i].mapIndex == tileIndex) {
                                plantTrackingArray[i].harvestPlant();
                            }
                        }
                        equippedItem = items.nothing;
                    }
                    this.outlineTargetTile = true;
                    break;
                // ------ harvesting cases END ------

                // ------ resource depositing cases START ------
                case TILE_STONE_DEST:
                    if (isAction) {
                        let temp = { carried: this.inventory.countItems(items.STONE.type), makeEmpty: function () { } };
                        this.inventory.remove(items.STONE.type, this.inventory.countItems(items.STONE.type));
                        depositResources(temp, this.storageList[Resources.Stone]);
                    }
                    this.outlineTargetTile = true;
                    break;
                case TILE_WOOD_DEST:
                    if (isAction) {
                        let temp = { carried: this.inventory.countItems(items.WOOD.type), makeEmpty: function () { } };
                        this.inventory.remove(items.WOOD.type, this.inventory.countItems(items.WOOD.type));
                        depositResources(temp, this.storageList[Resources.Wood]);
                    }
                    this.outlineTargetTile = true;
                    break;
                // ------ resource depositing cases END ------

                // ------ other cases START ------
                case TILE_WALL:
                case TILE_FOOD_SRC:
                    distToGo = 0;
                    break;
                // ------ other cases END ------
            }

            return equippedItem;
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
        if (playerTileIndex == mouseTileIndex) {
            return playerTileIndex;
        }
        return DIRECTION_NONE;
    }

    this.resetEquippedAnimations = function (itemType) {
        switch (itemType) {
            case items.pickaxe.type:
                if (this.playerLastFacingDirection == DIRECTION_EAST ||
                    this.playerLastFacingDirection == DIRECTION_NORTHEAST ||
                    this.playerLastFacingDirection == DIRECTION_SOUTHEAST) {
                    pickaxeAnimationEast.reset();
                } else if (this.playerLastFacingDirection == DIRECTION_WEST ||
                    this.playerLastFacingDirection == DIRECTION_NORTHWEST ||
                    this.playerLastFacingDirection == DIRECTION_SOUTHWEST) {
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
