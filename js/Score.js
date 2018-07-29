
var itemScores = [
    {itemIndex: ItemCode.CROP_CHILI, requiredAmount: 3.0},
    {itemIndex: ItemCode.CROP_CORN, requiredAmount: 3.0},
    {itemIndex: ItemCode.CROP_EGGPLANT, requiredAmount: 3.0},
    {itemIndex: ItemCode.CROP_POTATO, requiredAmount: 3.0},
    {itemIndex: ItemCode.CROP_TOMATO, requiredAmount: 3.0},
    {itemIndex: ItemCode.METAL, requiredAmount: 3.0},
    {itemIndex: ItemCode.WOOD, requiredAmount: 3.0},
    {itemIndex: ItemCode.STONE, requiredAmount: 10.0},
    ];


var checkScoreCount = function (item) {
    var percentToReturn = 0.0;
    for (var i = 0; i < itemScores.length; i++) {

        if (itemScores[i].itemIndex == item.item) {

            percentToReturn = item.count / itemScores[i].requiredAmount;

            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }
        }
    }

    return percentToReturn / itemScores.length;
};


var createFinalResources = function () {
    for (var i = 0; i < itemScores.length; i++) {
        player.inventory.add(items.itemCodeToObj[itemScores[i].itemIndex].type, itemScores[i].requiredAmount);
    }
};


var getWinConditions = function () {
    var conditions = ['The people will need the following items in the silo before they emerge:'];
    for (var i = 0; i < itemScores.length; i++) {
        conditions.push("" + Math.floor(itemScores[i].requiredAmount) + " " + items.itemCodeToObj[itemScores[i].itemIndex].name);
    }
    return conditions;
};
