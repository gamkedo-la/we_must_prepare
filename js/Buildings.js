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

var buildingDefs = [
    {name: 'Farm', Wood: 1, Stone: 0, Metal: 0, tile: TILE_WOOD_DEST, label: 'farm', onClick: farmToConsole},
    {name: 'House', Wood: 5, Stone: 10, Metal: 5, tile: TILE_METAL_DEST, label: 'house', onClick: houseToConsole},
    {name: 'Resource Silo', Wood: 10, Stone: 10, Metal: 5, tile: TILE_STONE_DEST, label: 'silo', onClick: siloToConsole},
    {name: 'Generator', Wood: 10, Stone: 10, Metal: 5, tile: TILE_STONE_DEST, label: 'genera', onClick: generaToConsole},
    {name: 'Upgrades', Wood: 10, Stone: 10, Metal: 5, tile: TILE_STONE_DEST, label: 'upgrade', onClick: upgradeToConsole}
]

function resoucesAvailableToBuild(defIndex) {
    // console.log("resources for %s are metal: %s, wood: %s, and stone: %s", defIndex, buildingDefs[defIndex].Metal,
    //  buildingDefs[defIndex].Wood, buildingDefs[defIndex].Stone);
    return (buildingDefs[defIndex].Metal <= player.storageList["Metal"].carried &&
            buildingDefs[defIndex].Wood <= player.storageList["Wood"].carried &&
            buildingDefs[defIndex].Stone <= player.storageList["Stone"].carried);
}
