const PERCENTAGE_REFUND = 0.5;

var toBuild; //this is currently generated in Input.js

// IMPORTANT!
// Building inventory is currently implemented as global
// When building construction and placement is implemented, then this should be moved to per building inventory instead
var buildingStorage;

function lumberToConsole() {
    // console.log("farm clicked");
}
function houseToConsole() {
    // console.log("house clicked");
}
function siloToConsole() {
    // console.log("silo clicked");
}
function generaToConsole() {
    // console.log("genera clicked");
}
function farmToConsole() {
    // console.log("farm clicked");
}
function upgradeToConsole() {
    // console.log("upgrade clicked");
}

function clickUpgrade() {
    // console.log('upgrade button clicked');
}

function clickSell() {
    // console.log('sell button clicked');
    var buildingDefsAtTile = tileKindToBuildingDef(roomGrid[selectedIndex]);
    player.storageList[Resources.Metal].carried += Math.ceil(buildingDefsAtTile.Metal * PERCENTAGE_REFUND);
    player.storageList[Resources.Wood].carried += Math.ceil(buildingDefsAtTile.Wood * PERCENTAGE_REFUND);
    player.storageList[Resources.Stone].carried += Math.ceil(buildingDefsAtTile.Stone * PERCENTAGE_REFUND);
    roomGrid[selectedIndex] = TILE_GROUND;
    selectedIndex = -1;

}

var buildingDefs = [
    {name: 'Silo', Wood: 10, Stone: 10, Metal: 5, tile: TILE_FOOD_DEST, label: 'genera', onClick: generaToConsole},
    {name: 'Farm', Wood: 3, Stone: 3, Metal: 0, tile: TILE_FOOD_SRC, label: 'farm', onClick: farmToConsole},
    {name: 'Barn', Wood: 10, Stone: 10, Metal: 5, tile: TILE_BUILDING, label: 'upgrade', onClick: upgradeToConsole}
]

var perBuildingButtonDefs = [
    {name: 'Upgrade', label: 'upgrade', onClick: clickUpgrade},
    {name: 'Sell', label: 'sell', onClick: clickSell}
]

function tileKindToBuildingDef(tileKind) {
    for (var i = 0; i < buildingDefs.length; i++) {
        if (buildingDefs[i].tile == tileKind) {
            return buildingDefs[i];
        }
    }
}

function resourcesAvailableToBuild(defIndex) {
    // console.log("resources for %s are metal: %s, wood: %s, and stone: %s", defIndex, buildingDefs[defIndex].Metal,
    //  buildingDefs[defIndex].Wood, buildingDefs[defIndex].Stone);
    return (buildingDefs[defIndex].Metal <= player.storageList[Resources.Metal].carried &&
            buildingDefs[defIndex].Wood <= player.storageList[Resources.Wood].carried &&
            buildingDefs[defIndex].Stone <= player.storageList[Resources.Stone].carried);
}

// See buildingStorage definition regarding global inventory
function buildingGetSaveState() {
    var result = {};

    result.storage = buildingStorage.getSaveState();

    return result;
}

// See buildingStorage definition regarding global inventory
function buildingLoadSaveState(saveState) {
    buildingStorage.loadSaveState(saveState.storage);
};
