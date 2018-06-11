const DAYS_WITHOUT_WATER_BEFORE_PLANT_DIES = 3;
const PLANT_STAGE_NULL = -1;
const PLANT_STAGE_SEED = 0;
const PLANT_STAGE_SEEDLING = 1;
const PLANT_STAGE_MEDIUM = 2;
const PLANT_STAGE_FULLY_GROWN = 3;

var plantTrackingArray = [];

//Plant Class
var Plants = [
    {
        tileTypeSeed: TILE_CORN_SEED,
        tileTypeStages: [TILE_CORN_SEEDLING, TILE_CORN_MEDIUM, TILE_CORN_FULLY_GROWN, TILE_CORN_RIPE, TILE_CORN_HARVESTED],
        daysPerStage: 1,
        daysCanLiveWithoutWater: 3,
    },
    {
        tileTypeSeed: TILE_EGGPLANT_SEED,
        tileTypeStages: [TILE_EGGPLANT_SEEDLING, TILE_EGGPLANT_MEDIUM, TILE_EGGPLANT_FULLY_GROWN, TILE_EGGPLANT_RIPE, TILE_EGGPLANT_HARVESTED],
        daysPerStage: 1,
        daysCanLiveWithoutWater: 3,
    },
    {
        tileTypeSeed: TILE_POTATO_SEED,
        tileTypeStages: [TILE_POTATO_SEEDLING, TILE_POTATO_MEDIUM, TILE_POTATO_FULLY_GROWN, TILE_POTATO_RIPE],
        daysPerStage: 2,
        daysCanLiveWithoutWater: 3,
    },
    {
        tileTypeSeed: TILE_TOMATO_SEED,
        tileTypeStages: [TILE_TOMATO_SEEDLING, TILE_TOMATO_MEDIUM, TILE_TOMATO_FULLY_GROWN, TILE_TOMATO_RIPE, TILE_TOMATO_HARVESTED],
        daysPerStage: 2,
        daysCanLiveWithoutWater: 3,
    },
];


function PlantClass(mapIndex, plantTypeSeed) {
    this.mapIndex = mapIndex;    
    this.plantTypeSeed = plantTypeSeed;
    this.plantFacts;
    this.daysWithoutWater = 0;
    this.daysGrownPerStage = 0;
    this.currentPlantStage = PLANT_STAGE_NULL;
    this.is_watered = false;

    plantTrackingArray.push(this);

    this.cachePlantFacts = function () {
        // NOTE: Gets called immediately as part of initialization (around line 38)
        this.plantFacts = null;
        for (var i = 0; i < Plants.length; i++) {
            if (Plants[i].tileTypeSeed == this.plantTypeSeed) {
                this.plantFacts = Plants[i];
                break;
            }
        }
        if (this.plantFacts == null) {
            console.log("Plant facts missing for " + this.plantTypeSeed + "  at " + this.mapIndex);
        } else {
            this.currentPlantStage = PLANT_STAGE_SEED;
            roomGrid[this.mapIndex] = this.plantTypeSeed;
        }
    }

    this.cachePlantFacts();

    this.waterPlant = function () {
        console.log("Plant has been watered!");
        this.is_watered = true;
        this.daysWithoutWater = 0;
    }

    this.dayChanged = function () {
        console.log("Day is changing!");
        console.log("length is " + this.plantFacts.tileTypeStages.length);
        if (this.currentPlantStage >= this.plantFacts.tileTypeStages.length) {
            console.log("Plant needs no more water at " + this.mapIndex);
            if (this.is_watered == true) {
                this.is_watered = false;
            }
            return;
        }

        if (this.is_watered == false) {
            this.daysWithoutWater += 1;
        }

        this.is_watered = false; // resetting for the next day

        if (this.daysWithoutWater == 0) {
            this.daysGrownPerStage++;
            if (this.daysGrownPerStage >= this.plantFacts.daysPerStage) {
                console.log("Plant is a big kid now at " + this.mapIndex);
                roomGrid[this.mapIndex] = this.plantFacts.tileTypeStages[this.currentPlantStage];
                this.currentPlantStage++; // incrementing after assignment because seed is not in the array
                this.daysGrownPerStage = 0;
            }
        }

        if (this.daysWithoutWater > this.plantFacts.daysCanLiveWithoutWater) {
            this.plantDied();
        }
    } // end dayChanged

    this.plantDied = function () {
        console.log("Plant died at index " + this.mapIndex + "! So... err... booooo?");
        roomGrid[this.mapIndex] = TILE_GROUND;
        plantTrackingArray.splice(plantTrackingArray.indexOf(this), 1);
    }

    this.plantRemoved = function () {
        console.log("Plant removed at index " + this.mapIndex + "!");
        roomGrid[this.mapIndex] = TILE_TILLED;
        if (this.is_watered) {
            roomGrid[this.mapIndex] = TILE_TILLED_WATERED;
        }
        plantTrackingArray.splice(plantTrackingArray.indexOf(this), 1);
    }
}  // end PlantClass