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
        tileTypeSeed: TILE_WHEAT_01_SEED,
        tileTypeStages: [TILE_WHEAT_01_SEEDLING, TILE_WHEAT_01_MEDIUM, TILE_WHEAT_01_FULLY_GROWN],
        daysPerStage: 1,
        daysCanLiveWithoutWater: 3,
    },
    {
        tileTypeSeed: TILE_WHEAT_02_SEED,
        tileTypeStages: [TILE_WHEAT_02_SEEDLING, TILE_WHEAT_02_MEDIUM, TILE_WHEAT_02_FULLY_GROWN],
        daysPerStage: 1,
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
        if (this.currentPlantStage >= PLANT_STAGE_FULLY_GROWN) {
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