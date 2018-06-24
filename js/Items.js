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
    WHEAT_SEED_ONE: 8,
    WHEAT_SEED_TWO: 9,
});

// Item class
function Item(itemName, itemType) {
    this.name = itemName;
    this.type = itemType;
    this.thing = ItemCode.NOTHING;

    switch (itemType) {
        case ItemCode.WATERCAN:
            this.thing = new Watercan(WATERCAN_START_VOLUME, WATERCAN_CAPACITY);
            break;
    }

    return this;
}

// Create item instances here, instanced in Main.js
function Items() {
    this.nothing = new Item("Nothing", ItemCode.NOTHING);
    this.metal = new Item("Metal", ItemCode.METAL);
    this.stone = new Item("Stone", ItemCode.STONE);
    this.wood = new Item("Wood", ItemCode.WOOD);
    this.axe = new Item("Axe", ItemCode.AXE);
    this.watercan = new Item("Watercan", ItemCode.WATERCAN);
    this.hoe = new Item("Hoe", ItemCode.HOE);
    this.pickaxe = new Item("Pickaxe", ItemCode.PICKAXE);
    this.wheatSeedOne = new Item("Wheat Seed One", ItemCode.WHEAT_SEED_ONE);
    this.wheatSeedTwo = new Item("Wheat Seed Two", ItemCode.WHEAT_SEED_TWO);
}

function Watercan(waterLeft = WATERCAN_START_VOLUME, waterCapacity = WATERCAN_CAPACITY) {
    this.waterLeft = waterLeft;
    this.waterCapcity = waterCapacity;

    this.use = function (useRate) {
        if (this.waterLeft > 0) {
            this.waterLeft -= useRate;
        }
        console.log("Watercan water left: " + this.waterLeft);
        return this.waterLeft;
    };

    this.refill = function (fillRate) {
        if (this.waterLeft < this.waterCapcity) {
            this.waterLeft += fillRate;
        }
        console.log("Watercan water left: " + this.waterLeft);
        return this.waterLeft;
    };
}
