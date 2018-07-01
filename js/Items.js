const WATERCAN_START_VOLUME = 100;
const WATERCAN_CAPACITY = 100;
const WATERCAN_USE_RATE = 5;
const WATERCAN_FILL_RATE = 20;

var ItemCode = Object.freeze({
    NOTHING: 0,
    METAL: 1,
    STONE: 2,
    WOOD: 3,
    AXE: 4,
    WATERCAN: 5,
    HOE: 6,
    PICKAXE: 7,
    SEED_CORN: 8,
    SEED_TOMATO: 9,
    CROP_CORN: 10,
    CROP_TOMATO: 11
});

// Item class
function Item(itemName, itemType, energyCost) {
    console.log("type of energyCost " + energyCost);
    if (typeof energyCost === 'undefined') {
        energyCost = 0;
    }
    this.name = itemName;
    this.type = itemType;
    this.thing = ItemCode.NOTHING;
    this.energyCost = energyCost;

    switch (itemType) {
        case ItemCode.AXE:
            this.thing = new Axe(energyCost);
            break;
        case ItemCode.WATERCAN:
            this.thing = new Watercan(energyCost);
            break;
        case ItemCode.HOE:
            this.thing = new Hoe(energyCost);
            break;
        case ItemCode.PICKAXE:
            this.thing = new Pickaxe(energyCost);
            break;
        case ItemCode.SEED_CORN:
            this.thing = new Seed(energyCost, ItemCode.SEED_CORN);
            break;
        case ItemCode.SEED_TOMATO:
            this.thing = new Seed(energyCost, ItemCode.SEED_TOMATO);
            break;
    }

    return this;
}

// Create instances of items here, Items() itself is instanced in Main.js
function Items() {
    this.nothing = new Item("Nothing", ItemCode.NOTHING);
    this.metal = new Item("Metal", ItemCode.METAL);
    this.stone = new Item("Stone", ItemCode.STONE);
    this.wood = new Item("Wood", ItemCode.WOOD);
    this.axe = new Item("Axe", ItemCode.AXE, 5);
    this.watercan = new Item("Watercan", ItemCode.WATERCAN, 5);
    this.hoe = new Item("Hoe", ItemCode.HOE, 5);
    this.pickaxe = new Item("Pickaxe", ItemCode.PICKAXE, 5);
    this.seedCorn = new Item("Corn Seeds", ItemCode.SEED_CORN, 5);
    this.seedTomato = new Item("Tomato Seeds", ItemCode.SEED_TOMATO, 5);
    this.cropCorn = new Item("Corn", ItemCode.CROP_CORN);
    this.cropTomato = new Item("Tomato", ItemCode.CROP_TOMATO);
}

// ----------------
// Tool
// ----------------
// Parent class for all items that consume energy
function Tool (energyCost) {    
    this.energyCost = energyCost;
}
// Explicitly define function on parent class' prototype so that it can be called by children classes
Tool.prototype.checkIfEnoughEnergy = function (toolUser = this.toolUser, energyCost = this.energyCost) {    
    console.log("Player energy is " + toolUser.playerEnergyLevel + " and checking " + energyCost);

    toolUser.playerEnergyLevel -= energyCost;
    if (toolUser.playerEnergyLevel < 0) {
        timer.endOfDay();
    }

    return toolUser.playerEnergyLevel >= energyCost;
};

// ----------------
// Axe
// ----------------
function Axe(energyCost) {
    Tool.call(this, energyCost); // Axe inheriting Tool class
    
    this.use = function (toolUser, activeTileIndex) {        
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Axe and pass argument(s)
            if (getResourceFromIndex(activeTileIndex, true, toolUser.bucketList)) {
                playSFXForCollectingResource(TILE_WOOD_SRC);       
                return toolUser.inventory.add(items.wood.type, 1);
            }
        }

        return -1;
    }
}
// Axe inheriting Tool class
Axe.prototype = Object.create(Tool.prototype);
Axe.prototype.constructor = Axe;

// ----------------
// Watercan
// ----------------
function Watercan(energyCost, waterLeft = WATERCAN_START_VOLUME, waterCapacity = WATERCAN_CAPACITY, waterDepletionRate = WATERCAN_USE_RATE, waterFillRate = WATERCAN_FILL_RATE) {
    Tool.call(this, energyCost); // Watercan inheriting Tool class
    
    this.waterLeft = waterLeft;
    this.waterCapcity = waterCapacity;
    this.waterDepletionRate = waterDepletionRate;
    this.waterFillRate = waterFillRate;

    this.use = function (toolUser, activeTileIndex, waterDepletionRate = this.waterDepletionRate) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Watercan and pass argument(s)
            if (this.waterLeft > 0) {
                this.waterLeft -= waterDepletionRate;

                robotWateringSFX.play();

                if (roomGrid[activeTileIndex] < START_TILE_WALKABLE_GROWTH_RANGE) {
                    roomGrid[activeTileIndex] = TILE_TILLED_WATERED;
                }

                for (var i = 0; i < plantTrackingArray.length; i++) {
                    if (plantTrackingArray[i].mapIndex == activeTileIndex) {
                        plantTrackingArray[i].waterPlant();
                    }
                }
            }
            console.log("Watercan water left: " + this.waterLeft);
        }

        return this.waterLeft > 0;
    };

    this.fill = function (toolUser, fillRate = this.waterFillRate) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser, this.energyCost * 0.5)) { // call parent class function in the context of Watercan and pass argument(s)
            if (this.waterLeft < this.waterCapcity) {
                this.waterLeft += fillRate;

                robotWateringSFX.play();
            }
            console.log("Watercan water left: " + this.waterLeft);
        }

        if (this.waterLeft > this.waterCapacity) {
            this.waterLeft = this.waterCapacity;
        }

        return this.waterLeft < this.waterCapcity;
    };
}
// Watercan inheriting Tool class
Watercan.prototype = Object.create(Tool.prototype);
Watercan.prototype.constructor = Watercan;

// ------------
// Hoe
// ------------
function Hoe(energyCost) {
    Tool.call(this, energyCost); // Hoe inheriting Tool class
    
    this.use = function (toolUser, activeTileIndex) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Hoe and pass argument(s)
            switch (roomGrid[activeTileIndex]) {
                case TILE_GROUND:
                    robotTillingLandSFX.play();
                    roomGrid[activeTileIndex] = TILE_TILLED;
                    break;

                case TILE_TILLED:
                case TILE_TILLED_WATERED:
                    robotTillingLandSFX.play();
                    break;

                default:
                    if (roomGrid[activeTileIndex] >= START_TILE_WALKABLE_GROWTH_RANGE) {
                        robotTillingLandSFX.play();

                        for (var i = 0; i < plantTrackingArray.length; i++) {
                            if (plantTrackingArray[i].mapIndex == activeTileIndex) {
                                plantTrackingArray[i].plantRemoved();
                            }
                        }
                    }
            }
        }
    };
}
// Hoe inheriting Tool class
Hoe.prototype = Object.create(Tool.prototype);
Hoe.prototype.constructor = Hoe;

// ----------------
// Pickaxe
// ----------------
function Pickaxe(energyCost) {
    Tool.call(this, energyCost); // Pickaxe inheriting Tool class

    this.use = function (toolUser, activeTileIndex) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Pickaxe and pass argument(s)
            if (getResourceFromIndex(activeTileIndex, true, toolUser.bucketList) == true) {
                switch (roomGrid[activeTileIndex]) {
                    case TILE_METAL_SRC:
                        playSFXForCollectingResource(TILE_METAL_SRC);
                        toolUser.inventory.add(items.metal.type, 1);
                        break;
                    case TILE_STONE_SRC:
                        playSFXForCollectingResource(TILE_STONE_SRC);
                        toolUser.inventory.add(items.stone.type, 1);
                        break;
                }
            }
            toolUser.resetEquippedAnimations(toolUser.hotbar.slots[toolUser.hotbar.equippedSlotIndex].item);
        }

        return -1;
    }
}
// Pickaxe inheriting Tool class
Pickaxe.prototype = Object.create(Tool.prototype);
Pickaxe.prototype.constructor = Pickaxe;

// ----------------
// Seed
// ----------------
function Seed(energyCost, whichSeed) {
    Tool.call(this, energyCost); // Seed inheriting Tool class
    
    this.use = function (toolUser, activeTileIndex) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Seed and pass argument(s)
            let seedTypeTile = items.seedCorn.type;

            switch (whichSeed) { 
                case items.seedCorn.type:
                    seedTypeTile = TILE_CORN_SEED;
                    break;
                case items.seedTomato.type:
                    seedTypeTile = TILE_TOMATO_SEED;
                    break;
            }
            new Plant(activeTileIndex, seedTypeTile);

            toolUser.hotbar.remove(toolUser.hotbar.slots[toolUser.hotbar.equippedSlotIndex].item, 1);
        }        
    }
}
// Seed inheriting Tool class
Seed.prototype = Object.create(Tool.prototype);
Seed.prototype.constructor = Seed;
