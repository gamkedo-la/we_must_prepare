const PERCENTAGE_REFUND = 0.5;

var toBuild; //this is currently generated in Input.js

function farmToConsole() {
    console.log("farm clicked");
}
function houseToConsole() {
    console.log("house clicked");
}
function siloToConsole() {
    console.log("silo clicked");
}
function generaToConsole() {
    console.log("genera clicked");
}
function upgradeToConsole() {
    console.log("upgrade clicked");
}

function clickUpgrade() {
    console.log('upgrade button clicked');
}

function clickSell() {
    console.log('sell button clicked');
    var buildingDefsAtTile = tileKindToBuildingDef(roomGrid[selectedIndex]);
    player.storageList["Metal"].carried += Math.ceil(buildingDefsAtTile.Metal * PERCENTAGE_REFUND);
    player.storageList["Wood"].carried += Math.ceil(buildingDefsAtTile.Wood * PERCENTAGE_REFUND);
    player.storageList["Stone"].carried += Math.ceil(buildingDefsAtTile.Stone * PERCENTAGE_REFUND);
    roomGrid[selectedIndex] = TILE_GROUND;
    selectedIndex = -1;

}

var buildingDefs = [
    {name: 'Lumber Yard', Wood: 5, Stone: 3, Metal: 2, tile: TILE_WOOD_DEST, label: 'farm', onClick: farmToConsole},
    {name: 'Blacksmith', Wood: 5, Stone: 10, Metal: 5, tile: TILE_METAL_DEST, label: 'house', onClick: houseToConsole},
    {name: 'Stone Mason', Wood: 10, Stone: 10, Metal: 5, tile: TILE_STONE_DEST, label: 'silo', onClick: siloToConsole},
    {name: 'Silo', Wood: 10, Stone: 10, Metal: 5, tile: TILE_FOOD_DEST, label: 'genera', onClick: generaToConsole},
    {name: 'Factory', Wood: 10, Stone: 10, Metal: 5, tile: TILE_BUILDING, label: 'upgrade', onClick: upgradeToConsole}
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
    return (buildingDefs[defIndex].Metal <= player.storageList["Metal"].carried &&
            buildingDefs[defIndex].Wood <= player.storageList["Wood"].carried &&
            buildingDefs[defIndex].Stone <= player.storageList["Stone"].carried);
}
