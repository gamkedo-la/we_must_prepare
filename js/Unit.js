const UNIT_PLACEHOLDER_RADIUS = 5;
const UNIT_PIXELS_MOVE_RATE = 2;
const UNIT_MAX_RAND_DIST_FROM_WALK_TARGET = 50;
const UNIT_SELECTED_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_ATTACK_RANGE = 55;

function unitClass() {

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

        this.carriedMetal = 0;
        this.carriedStone = 0;
        this.carriedWood = 0;
        this.storedMetal = 0;
        this.storedStone = 0;
        this.storedWood = 0;

        this.carryMaxMetal = 10;
        this.carryMaxStone = 10;
        this.carryMaxWood = 10;
    }  // end reset

    this.drawPlayerHUD = function() {
        canvasContext.fillStyle = 'white';
        var textLineY = 15, textLineSkip = 15, textLineX = 30;
        canvasContext.fillText('Carried Wood: ' + this.carriedWood, textLineX, textLineY);
        canvasContext.fillText('Stored Wood: ' + this.storedWood, textLineX * 4, textLineY); textLineY += textLineSkip;
        canvasContext.fillText('Carried Metal: ' + this.carriedMetal, textLineX, textLineY);
        canvasContext.fillText('Stored Metal: ' + this.storedMetal, textLineX * 4, textLineY); textLineY += textLineSkip;
        canvasContext.fillText('Carried Stone: ' + this.carriedStone, textLineX, textLineY);
        canvasContext.fillText('Stored Stone: ' + this.storedStone, textLineX * 4, textLineY); textLineY += textLineSkip;
    }

    this.draw = function() {
        colorCircle(this.x, this.y, UNIT_PLACEHOLDER_RADIUS, this.unitColor);
        this.drawPlayerHUD();
    }

    this.distFrom = function (otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - this.y;
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
        if (this.myTarget != null) {
            if (this.myTarget.isDead) {
                this.myTarget = null;
                this.gotoX = this.x;
                this.gotoY = this.y;
            } else if (this.distFrom(this.myTarget.x, this.myTarget.y) > UNIT_ATTACK_RANGE) {
                this.gotoX = this.myTarget.x;
                this.gotoY = this.myTarget.y;
            } else {
                this.myTarget.isDead = true;
                this.gotoX = this.x;
                this.gotoY = this.y;
            }
        }

        var deltaX = this.gotoX - this.x;
        var deltaY = this.gotoY - this.y;
        var distToGo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var moveX = UNIT_PIXELS_MOVE_RATE * deltaX / distToGo;
        var moveY = UNIT_PIXELS_MOVE_RATE * deltaY / distToGo;
        var nextX = this.x += moveX;
        var nextY = this.y += moveY;

        var walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
        var walkIntoTileType = TILE_WALL;

        if (walkIntoTileIndex != undefined) {
            walkIntoTileType = roomGrid[walkIntoTileIndex];
        }

        switch (walkIntoTileType) {
            case TILE_WALL:
                distToGo = 0;
                this.x -= nextX;
                this.y -= nextY;
                break;
            case TILE_FOOD_SRC:
                distToGo = 0;
                break;
            case TILE_METAL_SRC:
                if (this.carriedMetal < this.carryMaxMetal) {
                    this.carriedMetal += 1;
                }
                break;
            case TILE_METAL_DEST:
                if (this.carriedMetal > 0) {
                    this.storedMetal += this.carriedMetal;
                    this.carriedMetal = 0;
                }
                break;
            case TILE_STONE_SRC:
                if (this.carriedStone < this.carryMaxStone) {
                    this.carriedStone += 1;
                }
                break;
            case TILE_STONE_DEST:
                if (this.carriedStone > 0) {
                    this.storedStone += this.carriedStone;
                    this.carriedStone = 0;
                }
                break;
            case TILE_WOOD_SRC:
                if (this.carriedWood < this.carryMaxWood) {
                    this.carriedWood += 1;
                }
                break;
            case TILE_WOOD_DEST:
                if (this.carriedWood > 0) {
                    this.storedWood += this.carriedWood;
                    this.carriedWood = 0;
                }
                break;
            default:
                break;
        }

        if (distToGo > UNIT_PIXELS_MOVE_RATE) {
            this.x = nextX;
            this.y = nextY;
        } else {
            this.x = this.gotoX;
            this.y = this.gotoY;
        }
    } // end move
} // end unitClass
