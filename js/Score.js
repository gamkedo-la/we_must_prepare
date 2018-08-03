
// these are the material requirements to win the game
var itemScores = [
    { itemIndex: ItemCode.CROP_CHILI, requiredAmount: 16.0 },
    { itemIndex: ItemCode.CROP_CORN, requiredAmount: 80.0 },
    { itemIndex: ItemCode.CROP_EGGPLANT, requiredAmount: 24.0 },
    { itemIndex: ItemCode.CROP_POTATO, requiredAmount: 120.0 },
    { itemIndex: ItemCode.CROP_TOMATO, requiredAmount: 64.0 },
    { itemIndex: ItemCode.METAL, requiredAmount: 15.0 },
    { itemIndex: ItemCode.WOOD, requiredAmount: 75.0 },
    { itemIndex: ItemCode.STONE, requiredAmount: 35.0 },
];


var reportScoreCount = function (item) { // return a text description like "25 of 100 wood (25% complete)"
    var str = "";
    var percentToReturn = 0.0;
    for (var i = 0; i < itemScores.length; i++) {

        if (itemScores[i].itemIndex == item.item) {

            percentToReturn = item.count / itemScores[i].requiredAmount;

            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }

            str += item.count + " of " + itemScores[i].requiredAmount + " " + items.itemCodeToObj[itemScores[i].itemIndex].name + " (" + (Math.ceil(percentToReturn * 100) + "% complete)\n");

        }
    }

    return str;
};

var winQuantity = function (item) { // used by buildingstorage drawWinBars via drawSiloDisplays
    var percentToReturn = 0.0;
    for (var i = 0; i < itemScores.length; i++) {
        if (itemScores[i].itemIndex == item.item) {
            percentToReturn = item.count / itemScores[i].requiredAmount;
            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }
        }
    }
    return percentToReturn;
};

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
    var conditions = ['We must prepare for the arrival of the human population.',
        'You have ' + (DAY_OF_ARRIVAL - timer.dayNumber) + ' days left to complete this task.',
        'Fill the silo with the following items before they emerge:', ''];
    for (var i = 0; i < itemScores.length; i++) {
        conditions.push("- " + Math.floor(itemScores[i].requiredAmount) + " " + items.itemCodeToObj[itemScores[i].itemIndex].name);
    }

    if (window.buildingStorage) {
        conditions.push('');
        var report = buildingStorage.preparednessReport();
        if (report == "")
            report = "Your silo is currently empty.";
        else
            report = "Your silo contains " + report;
        conditions.push(report);
        conditions.push('');
        conditions.push("You are currently " + Math.ceil(buildingStorage.preparednessLevel() * 100) + "% prepared. Don't give up!");
    }

    return conditions;
};
