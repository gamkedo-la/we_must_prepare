const PLANT_STAGE_NULL = -1;
const PLANT_STAGE_SEED = 0;

var plantTrackingArray = [];

var Plants = [
    {
        tileTypeSeed: TILE_CORN_SEED,
        tileTypeStages: [TILE_CORN_SEEDLING, TILE_CORN_MEDIUM, TILE_CORN_FULLY_GROWN, TILE_CORN_RIPE, TILE_CORN_HARVESTED],
        daysPerStage: 2,
        daysCanLiveWithoutWater: 3,
        ripeStage: 4,
        regrows: true,
        regrowStages: 6
    },
    {
        tileTypeSeed: TILE_EGGPLANT_SEED,
        tileTypeStages: [TILE_EGGPLANT_SEEDLING, TILE_EGGPLANT_MEDIUM, TILE_EGGPLANT_FULLY_GROWN, TILE_EGGPLANT_RIPE, TILE_EGGPLANT_HARVESTED],
        daysPerStage: 1,
        daysCanLiveWithoutWater: 3,
        ripeStage: 4,
        regrows: true,
        regrowStages: 6
    },
    {
        tileTypeSeed: TILE_POTATO_SEED,
        tileTypeStages: [TILE_POTATO_SEEDLING, TILE_POTATO_MEDIUM, TILE_POTATO_FULLY_GROWN, TILE_POTATO_RIPE],
        daysPerStage: 1,
        daysCanLiveWithoutWater: 3,
        ripeStage: 4,
        regrows: false,
        regrowStages: 1
    },
    {
        tileTypeSeed: TILE_TOMATO_SEED,
        tileTypeStages: [TILE_TOMATO_SEEDLING, TILE_TOMATO_MEDIUM, TILE_TOMATO_FULLY_GROWN, TILE_TOMATO_RIPE, TILE_TOMATO_HARVESTED],
        daysPerStage: 2,
        daysCanLiveWithoutWater: 3,
        ripeStage: 4,
        regrows: true,
        regrowStages: 6
    },
];

// Plant class constructor
function Plant(mapIndex, plantTypeSeed) {
    this.mapIndex = mapIndex;    
    this.plantTypeSeed = plantTypeSeed;
    this.plantFacts;
    this.daysWithoutWater = 0;
    this.daysGrownPerStage = 0;
    this.currentPlantStage = PLANT_STAGE_NULL;
    this.is_watered = false;
    this.is_harvested = false;

    plantTrackingArray.push(this);

    this.getSaveState = function() {
        return {
            mapIndex: this.mapIndex,
            plantTypeSeed: this.plantTypeSeed,
            // Don't save plantFacts, reload from the Plants object
            daysWithoutWater: this.daysWithoutWater,
            daysGrownPerStage: this.daysGrownPerStage,
            currentPlantStage: this.currentPlantStage,
            is_watered: this.is_watered,
            is_harvested: this.is_harvested,
        }
    }

    this.loadSaveState = function (saveState) {
        this.mapIndex = saveState.mapIndex;
        this.plantTypeSeed = saveState.plantTypeSeed;
        // this.plantFacts loaded below
        this.daysWithoutWater = saveState.daysWithoutWater;
        this.daysGrownPerStage = saveState.daysGrownPerStage;
        this.currentPlantStage = saveState.currentPlantStage;
        this.is_watered = saveState.is_watered;
        this.is_harvested = saveState.is_harvested;

        // reload plantFacts (modeled after cachePlantFacts function below)
        for (var i = 0; i < Plants.length; i++) {
            if (Plants[i].tileTypeSeed == this.plantTypeSeed) {
                this.plantFacts = Plants[i];
                break;
            }
        }
        
        // Don't edit roomGrid here (already loaded in another step)
    }

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

    this.harvestPlant = function () {
        if (this.currentPlantStage != this.plantFacts.ripeStage || this.is_harvested == true) {
            console.log("can't harvest this plant, plant stage is " + this.currentPlantStage);
            return;
        }
        console.log("harvesting plant");
        // give fruit / seeds here
        switch (this.plantTypeSeed) {
            case TILE_CORN_SEED:
                player.inventory.add(items.cropCorn.type, 5);
                break;
            case TILE_TOMATO_SEED:
                player.inventory.add(items.cropTomato.type, 5);
                break;
        }

        if (this.plantFacts.regrows == false) {
            this.plantRemoved();
        } else {
            console.log("hiiiii plant stage is " + this.currentPlantStage);
            this.is_harvested = true;
            roomGrid[this.mapIndex] = this.plantFacts.tileTypeStages[this.currentPlantStage];
        }
    }

    this.dayChanged = function () {
        console.log("Day is changing!");
        console.log("length is " + this.plantFacts.tileTypeStages.length);
        if ((this.currentPlantStage >= this.plantFacts.tileTypeStages.length && this.is_harvested) ||
            (this.currentPlantStage == this.plantFacts.ripeStage && this.is_harvested == false)) {
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
            if (this.daysGrownPerStage >= this.plantFacts.daysPerStage || this.daysGrownPerStage >= this.plantFacts.regrowStages) {
                console.log("Plant is a big kid now at " + this.mapIndex);
                roomGrid[this.mapIndex] = this.plantFacts.tileTypeStages[this.currentPlantStage];
                if (this.is_harvested == false) {
                    this.currentPlantStage++; // incrementing after assignment because seed is not in the array
                } else {
                    this.is_harvested = false;
                    this.currentPlantStage--;
                }
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
}  // end Plant class constructor
