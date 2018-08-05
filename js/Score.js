
// these are the material requirements to win the game
var winConditionRequirements = [
    { itemIndex: ItemCode.CROP_POTATO, requiredAmount: 120.0 },
    { itemIndex: ItemCode.CROP_WHEAT, requiredAmount: 100.0 },
    { itemIndex: ItemCode.CROP_CORN, requiredAmount: 80.0 },
    { itemIndex: ItemCode.CROP_TOMATO, requiredAmount: 64.0 },
    { itemIndex: ItemCode.CROP_EGGPLANT, requiredAmount: 48.0 },
    { itemIndex: ItemCode.CROP_CHILI, requiredAmount: 32.0 },
    { itemIndex: ItemCode.WOOD, requiredAmount: 2000.0 },
    { itemIndex: ItemCode.METAL, requiredAmount: 100.0 },
    { itemIndex: ItemCode.STONE, requiredAmount: 350.0 },
];

// the current running total toward the requirements above
var siloTotals = [];
var addToSiloTotals = function (item) {
    for (var i = 0; i < winConditionRequirements.length; i++) {
        if (winConditionRequirements[i].itemIndex == item.item) {
            var keyname = items.itemCodeToObj[winConditionRequirements[i].itemIndex].name;
            if (!siloTotals[keyname]) siloTotals[keyname] = 0;
            siloTotals[keyname] += item.count;
        }
    }
}

var reportScoreCount = function (item) { // return a text description like "25 of 100 wood (25% complete)"
    var str = "";
    var percentToReturn = 0.0;
    for (var i = 0; i < winConditionRequirements.length; i++) {

        if (winConditionRequirements[i].itemIndex == item.item) {

            percentToReturn = item.count / winConditionRequirements[i].requiredAmount;

            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }

            str += item.count + " of " + winConditionRequirements[i].requiredAmount + " " + items.itemCodeToObj[winConditionRequirements[i].itemIndex].name + " (" + (Math.ceil(percentToReturn * 100) + "% complete)\n");

        }
    }

    return str;
};

var winQuantity = function (item) { // used by buildingstorage drawWinBars via drawSiloDisplays
    var percentToReturn = 0.0;
    for (var i = 0; i < winConditionRequirements.length; i++) {
        if (winConditionRequirements[i].itemIndex == item.item) {
            percentToReturn = item.count / winConditionRequirements[i].requiredAmount;
            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }
        }
    }
    return percentToReturn;
};

var checkScoreCount = function (item) {
    var percentToReturn = 0.0;
    for (var i = 0; i < winConditionRequirements.length; i++) {

        if (winConditionRequirements[i].itemIndex == item.item) {

            percentToReturn = item.count / winConditionRequirements[i].requiredAmount;

            if (percentToReturn > 1.0) {
                percentToReturn = 1.0;
            }
        }
    }

    return percentToReturn / winConditionRequirements.length;
};


var createFinalResources = function () {
    for (var i = 0; i < winConditionRequirements.length; i++) {
        player.inventory.add(items.itemCodeToObj[winConditionRequirements[i].itemIndex].type, winConditionRequirements[i].requiredAmount);
    }
};


var getWinConditions = function () {
    var conditions = ['We must prepare for the arrival of the human population.',
        'You have ' + (DAY_OF_ARRIVAL - timer.dayNumber) + ' days left to complete this task.',
        'Fill the silo with the following items before they emerge:', ''];
    for (var i = 0; i < winConditionRequirements.length; i++) {
        conditions.push("- " + Math.floor(winConditionRequirements[i].requiredAmount) + " " + items.itemCodeToObj[winConditionRequirements[i].itemIndex].name);
    }

    if (window.buildingStorage) {
        conditions.push('');
        var report = buildingStorage.preparednessReport();
        if (report == "")
            report = "Your silo is currently empty.";
        else
            report = "Your silo contains " + report;

        // allow >1 line in the report
        var reportlines = report.split('\n');
        conditions = conditions.concat(reportlines);

        var percentage = Math.ceil(buildingStorage.preparednessLevel() * 100);

        conditions.push('');
        conditions.push("You are currently " + percentage + "% prepared.");

        // some encouragement
        conditions.push('');
        if (percentage == 100) {
            conditions.push('Congratulations! The planet is ready for human habitation!');
        }
        else if (percentage > 75) {
            conditions.push("You're over three-quarters there! You got this!");
        }
        else if (percentage > 50) {
            conditions.push("You're over halfway there! Keep it up the good work!");
        }
        else if (percentage > 25) {
            conditions.push("You're over a quarter of the way to being ready! Keep going!");
        }
        else if (percentage > 0) {
            conditions.push("You've sucessfully begun preparing! Don't give up!");
        }
        else {
            conditions.push("Harvest some resources, then click the silo to begin!");
        }

    }

    return conditions;
};
