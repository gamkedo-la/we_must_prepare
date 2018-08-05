var resourceLookupTable = [];

function getResourceLookupTableSaveState() {
    var resourceLookupTableSaveState = [];
    for (var i = 0; i < resourceLookupTable.length; i++) {
        var tileLookupTable = resourceLookupTable[i];
        if (!tileLookupTable) {
            resourceLookupTableSaveState[i] = null;
            continue;
        }
        var tileLookupTableSaveState = {};
        Object.keys(Resources).forEach(function(resourceType) {
            var resourceBucket = tileLookupTable[resourceType];
            if (resourceBucket) {
                tileLookupTableSaveState[resourceType] = resourceBucket.getSaveState();
            }
        });
        resourceLookupTableSaveState[i] = tileLookupTableSaveState;
    }
    return resourceLookupTableSaveState;
}

function loadResourceLookupTableSaveState(saveState) {
    // console.log("Loading state");
    for (var i = 0; i < resourceLookupTable.length; i++) {
        var tileLookupTableSaveState = saveState[i];
        if (tileLookupTableSaveState) {
            var tileLookupTable = [];
            Object.keys(Resources).forEach(function(resourceType) {
                var resourceBucketSaveState = tileLookupTableSaveState[resourceType];
                if (resourceBucketSaveState) {
                    tileLookupTable[resourceType] = new Resource(0, 0);
                    tileLookupTable[resourceType].loadSaveState(resourceBucketSaveState);
                }
            });
            resourceLookupTable[i] = tileLookupTable;
        }
        else {
            resourceLookupTable[i] = undefined;
        }
    }
}

const Resources = {
    Wood:"Wood",
    Metal:"Metal",
    Stone:"Stone",
    Food:"Food" 
};

function Resource(max, carried) {
    this.max = max;
    this.carried = carried;

    this.makeEmpty = function() {
        this.carried = 0;
    }

    this.getSaveState = function() {
        return {
            max: this.max,
            carried: this.carried
        };
    };

    this.loadSaveState = function(saveState) {
        this.max = saveState.max;
        this.carried = saveState.carried;
    };
}

function depositResources(fromContainer, toContainer, quantity) {
    if (typeof quantity === "undefined") {
        if (fromContainer.carried + toContainer.carried <= toContainer.max) {
            toContainer.carried += fromContainer.carried;
            fromContainer.makeEmpty();
        } else {
            fromContainer.carried = fromContainer.carried + toContainer.carried - toContainer.max;
            toContainer.carried = toContainer.max;
        }
    } else {
        var itemsToTransfer = quantity;
        if (fromContainer.carried < quantity) {
            itemsToTransfer = fromContainer.carried;
        }
        if (toContainer.carried + itemsToTransfer > toContainer.max) {
            itemsToTransfer = toContainer.max - toContainer.carried;
        }
        fromContainer.carried -= itemsToTransfer;
        toContainer.carried += itemsToTransfer;
    }
}

function removeResourcesForBuilding(fromContainer, buildingBlueprint) {
    // console.log('fromContainer is %s before building and cost is %s', fromContainer[Resources.Wood].carried, buildingBlueprint.Wood);
    fromContainer[Resources.Wood].carried -= buildingBlueprint.Wood;
    fromContainer[Resources.Metal].carried -= buildingBlueprint.Metal;
    fromContainer[Resources.Stone].carried -= buildingBlueprint.Stone;
    // console.log('fromContainer is %s after building', fromContainer[Resources.Wood].carried);
}

function setupBuckets() {
    for(var i=0; i<roomGrid.length; i++) {
        var resourceType = '';
        var resourceQuantity = 0;
        switch (roomGrid[i]) {
            case TILE_METAL_SRC:
                resourceType = Resources.Metal;
                resourceQuantity = 10;
                break;
            case TILE_STONE_SRC:
                resourceType = Resources.Stone;
                resourceQuantity = 15;
                break;
            case TILE_WOOD_SRC:
                resourceType = Resources.Wood;
                resourceQuantity = 15;
                break;
            default:
                break;
        }
        if (resourceType != '') {
            resourceLookupTable[i] = [];
            resourceLookupTable[i][resourceType] = new Resource(resourceQuantity, resourceQuantity);
            // console.log("Added in " + resourceType + " to roomGrid index " + i);
        }

      } // end of for
}

// this function is called from Player.js doActionOnTile().
// returns true if resources are available and adds to inventory, destroys the resource when empty
function getResourceFromIndex(index, oncePerClick, playerBucket) {
    if (oncePerClick) {
        if (toolKeyPressedThisFrame == false) {
            return;
        }
    }
    if (typeof resourceLookupTable[index] === "undefined") {
        // console.log("No resource bucket exists.  Resource at index " + index);
    } else {
        for (var key in resourceLookupTable[index]) {
            if (resourceLookupTable[index][key].carried > 1) {
                depositResources(resourceLookupTable[index][key], playerBucket[key], 1);
                // console.log("Just gathered from a bucket of " + key + " with count of " + resourceLookupTable[index][key].carried + " left!");
            } else if (resourceLookupTable[index][key].carried == 1) {
                depositResources(resourceLookupTable[index][key], playerBucket[key], 1);
                roomGrid[index] = TILE_GROUND;
                // console.log("Cannot grab any resources, destroying resource");
                return true;
            }

            return resourceLookupTable[index][key].carried > 0;
        }
    }
}
