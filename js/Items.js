const WATER_CAN_CAPACITY = 100;
const WATER_CAN_USE_RATE = 5;
const WATER_CAN_FILL_RATE = 20;

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

function Item(itemType) {
    this.type = itemType;

    switch (itemType) {
        case ItemCode.WATERCAN:
            this.watercan = new Watercan(100, WATER_CAN_CAPACITY);
            break;
    }

    return this;
}

function Items() {
    this.NOTHING = new Item(ItemCode.NOTHING);
    this.METAL = new Item(ItemCode.METAL);
    this.STONE = new Item(ItemCode.STONE);
    this.WOOD = new Item(ItemCode.WOOD);
    this.AXE = new Item(ItemCode.AXE);
    this.WATERCAN = new Item(ItemCode.WATERCAN);
    this.HOE = new Item(ItemCode.HOE);
    this.PICKAXE = new Item(ItemCode.PICKAXE);
    this.WHEAT_SEED_ONE = new Item(ItemCode.WHEAT_SEED_ONE);
    this.WHEAT_SEED_TWO = new Item(ItemCode.WHEAT_SEED_TWO);
}

function Watercan(waterLeft = 100, waterCapacity = 100) {
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
