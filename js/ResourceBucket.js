var resouceLookupTable = [];

function getResourceLookupTableSaveState() {
    var resourceLookupTableSaveState = [];
    for (var i = 0; i < resouceLookupTable.length; i++) {
        var tileLookupTable = resouceLookupTable[i];
        if (!tileLookupTable) {
            resourceLookupTableSaveState[i] = null;
            continue;
        }
        Object.keys(Resources).forEach(function(resourceType) {
            var resourceBucket = tileLookupTable[resourceType];
            if (resourceBucket) {
                // TODO: save actual bucket
                console.log(resourceType);
                console.log(resourceBucket);
            }
        });
    }
    return resourceLookupTableSaveState;
}

const Resources = {
	Wood:"Wood",
	Metal:"Metal",
    Stone:"Stone",
    Food:"Food" 
};

function resourceClass(max, carried) {
    this.max = max;
    this.carried = carried;

    this.makeEmpty = function() {
        this.carried = 0;
    }
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
    console.log('fromContainer is %s before building and cost is %s', fromContainer[Resources.Wood].carried, buildingBlueprint.Wood);
    fromContainer[Resources.Wood].carried -= buildingBlueprint.Wood;
    fromContainer[Resources.Metal].carried -= buildingBlueprint.Metal;
    fromContainer[Resources.Stone].carried -= buildingBlueprint.Stone;
    console.log('fromContainer is %s after building', fromContainer[Resources.Wood].carried);
}

function setupBuckets() {
    for(var i=0; i<roomGrid.length; i++) {
        var resourceType = '';
        var resourceQuantity = 0;
        switch (roomGrid[i]) {
            case TILE_METAL_SRC:
                resourceType = Resources.Metal;
                resourceQuantity = 40;
                break;
            case TILE_STONE_SRC:
                resourceType = Resources.Stone;
                resourceQuantity = 20;
                break;
            case TILE_WOOD_SRC:
                resourceType = Resources.Wood;
                resourceQuantity = 10;
                break;
            default:
                break;
        }
        if (resourceType != '') {
            resouceLookupTable[i] = [];
            resouceLookupTable[i][resourceType] = new resourceClass(resourceQuantity, resourceQuantity);
            //console.log("Added in " + resourceType);
        }

      } // end of for
}

// this function is called from Player.js collectResourcesIfAbleTo.
// returns true if resources are available and adds to inventory, destroys the resource when empty
function getResourceFromIndex(index, oncePerClick, playerBucket) {
    if (oncePerClick) {
        if (toolKeyPressedThisFrame == false) {
            return;
        }
    }
    if (typeof resouceLookupTable[index] === "undefined") {
        console.log("No resource bucket exists.");
    } else {
        for (var key in resouceLookupTable[index]) {
            if (resouceLookupTable[index][key].carried > 1) {
                depositResources(resouceLookupTable[index][key], playerBucket[key], 1);
                console.log("Just gathered from a bucket of " + key + " with count of " + resouceLookupTable[index][key].carried + " left!");
            } else if (resouceLookupTable[index][key].carried == 1) {
                depositResources(resouceLookupTable[index][key], playerBucket[key], 1);
                roomGrid[index] = TILE_GROUND;
                console.log("Cannot grab any resources, destroying resource");
                return true;
            }

            return resouceLookupTable[index][key].carried > 0;
        }
    }
}
