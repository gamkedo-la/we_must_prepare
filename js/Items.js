const WATERCAN_START_VOLUME = 100;
const WATERCAN_CAPACITY = 100;
const WATERCAN_USE_RATE = 5;
const WATERCAN_FILL_RATE = 20;

let itemTrackingArray = [];

let ItemCode = Object.freeze({
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
    CROP_TOMATO: 11,
    CROP_EGGPLANT: 12,
    SEED_EGGPLANT: 13,
    CROP_POTATO: 14,
    SEED_POTATO: 15,
});

// Create instances of item types here, Items() itself is instanced in Main.js
function Items() {
    this.nothing = new Item("Nothing", ItemCode.NOTHING);

    this.metal = new Item("Metal", ItemCode.METAL);
    this.stone = new Item("Stone", ItemCode.STONE);
    this.wood = new Item("Wood", ItemCode.WOOD);

    this.axe = new Axe("Axe", 5);
    this.watercan = new Watercan("Watercan", 5);
    this.hoe = new Hoe("Hoe", 5);
    this.pickaxe = new Pickaxe("Pickaxe", 5);

    this.seedCorn = new Seed("Corn Seeds", 0, ItemCode.SEED_CORN, 5);
    this.seedTomato = new Seed("Tomato Seeds", 0, ItemCode.SEED_TOMATO, 5);
    this.seedEggplant = new Seed("Eggplant Seeds", 0, ItemCode.SEED_EGGPLANT, 5);
    this.seedPotato = new Seed("Potato Seeds", 0, ItemCode.SEED_POTATO, 5);

    this.cropCorn = new Item("Corn", ItemCode.CROP_CORN, 3, 30);
    this.cropTomato = new Item("Tomato", ItemCode.CROP_TOMATO, 3, 44);
    this.cropEggplant = new Item("Eggplant", ItemCode.CROP_EGGPLANT, 3, 52);
    this.cropPotato = new Item("Potato", ItemCode.CROP_POTATO, 4, 38);    
}

// ----------------
// Item class
// ----------------
// For creating instances of items
// Parent class of Tool
function Item(itemName, itemType, itemCount = 1, toolTipWidth = 128, toolTipHeight = 16) {
    this.name = itemName;
    this.type = itemType;
    this.count = itemCount;

    this.toolTipWidth = toolTipWidth;
    this.toolTipHeight = toolTipHeight;

    this.drawToolTip = function (toolTipX, toolTipY, toolTipWidth = this.toolTipWidth, toolTipHeight = this.toolTipHeight) {
        let x = toolTipX - 4;
        let y = toolTipY - 12;        

        colorRect(x, y, toolTipWidth, toolTipHeight, "rgba(255,255,255,1.0)");
        coloredOutlineRectCornerToCorner(x, y, x + toolTipWidth, y + toolTipHeight, "rgba(0,0,0,1.0)");
        colorText(this.name, toolTipX, toolTipY, 'black');
    };

    itemTrackingArray.push(this);

    return this;
}

// ----------------
// Tool
// ----------------
// Parent class for all items that consume energy
function Tool(toolName, toolType, energyCost, count, toolTipWidth = 128, toolTipHeight = 16) {
    Item.call(this, toolName, toolType, count, toolTipWidth, toolTipHeight);

    this.energyCost = energyCost;
}
// Tool inheriting Item class
Tool.prototype = Object.create(Item.prototype);
Tool.prototype.constructor = Tool;

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
function Axe(name, energyCost) {
    Tool.call(this, name, ItemCode.AXE, energyCost, 1, 30); // Axe inheriting Tool class
    
    this.use = function (toolUser, activeTileIndex) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Axe and pass argument(s)
            if (getResourceFromIndex(activeTileIndex, true, toolUser.bucketList)) {
                playSFXForCollectingResource(TILE_WOOD_SRC);
                return toolUser.inventory.add(items.wood.type, items.wood.count);
            }
        }

        return -1;
    };
}
// Axe inheriting Tool class
Axe.prototype = Object.create(Tool.prototype);
Axe.prototype.constructor = Axe;

// ----------------
// Watercan
// ----------------
function Watercan(name, energyCost, waterLeft = WATERCAN_START_VOLUME, waterCapacity = WATERCAN_CAPACITY, waterDepletionRate = WATERCAN_USE_RATE, waterFillRate = WATERCAN_FILL_RATE) {
    Tool.call(this, name, ItemCode.WATERCAN, energyCost, 1, 56); // Watercan inheriting Tool class
    
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
function Hoe(name, energyCost) {
    Tool.call(this, name, ItemCode.HOE, energyCost, 1, 30); // Hoe inheriting Tool class
    
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
function Pickaxe(name, energyCost) {
    Tool.call(this, name, ItemCode.PICKAXE, energyCost, 1, 48); // Pickaxe inheriting Tool class

    this.use = function (toolUser, activeTileIndex) {
        if (Tool.prototype.checkIfEnoughEnergy.call(this, toolUser)) { // call parent class function in the context of Pickaxe and pass argument(s)
            if (getResourceFromIndex(activeTileIndex, true, toolUser.bucketList) == true) {
                switch (roomGrid[activeTileIndex]) {
                    case TILE_METAL_SRC:
                        playSFXForCollectingResource(TILE_METAL_SRC);
                        toolUser.inventory.add(items.metal.type, items.metal.count);
                        break;
                    case TILE_STONE_SRC:
                        playSFXForCollectingResource(TILE_STONE_SRC);
                        toolUser.inventory.add(items.stone.type, items.stone.count);
                        break;
                }
            }
            toolUser.resetEquippedAnimations(toolUser.hotbar.slots[toolUser.hotbar.equippedSlotIndex].item);
        }

        return -1;
    };
}
// Pickaxe inheriting Tool class
Pickaxe.prototype = Object.create(Tool.prototype);
Pickaxe.prototype.constructor = Pickaxe;

// ----------------
// Seed
// ----------------
function Seed(name, energyCost, whichSeed, count) {    
    Tool.call(this, name, whichSeed, energyCost, count, name.length * 11.0 * 0.58); // Seed inheriting Tool class
    
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
                case items.seedEggplant.type:
                    seedTypeTile = TILE_EGGPLANT_SEED;
                    break;
                case items.seedPotato.type:
                    seedTypeTile = TILE_POTATO_SEED;
                    break;
            }
            new Plant(activeTileIndex, seedTypeTile);

            toolUser.hotbar.remove(toolUser.hotbar.slots[toolUser.hotbar.equippedSlotIndex].item, 1);
        }
    };
}
// Seed inheriting Tool class
Seed.prototype = Object.create(Tool.prototype);
Seed.prototype.constructor = Seed;
