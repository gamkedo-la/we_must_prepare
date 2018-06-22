var radCenterX = 200;
var radCenterY = 200;
var radSize = 150;
var radGrowthRate = 0.1;
var radEnabled = false;

function getRadiationSaveState() {
	return {
		radCenterX: radCenterX,
		radCenterY: radCenterY,
		radSize: radSize,
		radGrowthRate: radGrowthRate,
		radEnabled: radEnabled
	};
}

function loadRadiationSaveState(saveState) {
	radCenterX = saveState.radCenterX;
	radCenterY = saveState.radCenterY;
	radSize = saveState.radSize;
	radGrowthRate = saveState.radGrowthRate;
	radEnabled = saveState.radEnabled;
}

function drawRadiation () {
	if (radEnabled == false) {
		return;
	}
	coloredOutlineRectCornerToCorner(radCenterX-radSize, radCenterY-radSize, radCenterX+radSize, radCenterY+radSize, 'yellow');
}

function centerRadiation (newX, newY){
	radCenterX = newX;
	radCenterY = newY;
	console.log ('radiation fog turned on, press F to toggle');
}

function boundPlayerInRadiation () {
	if (radEnabled == false) {
		return;
	}
	var leftEdge = radCenterX-radSize;
	var topEdge = radCenterY-radSize;
	var rightEdge = radCenterX+radSize;
	var bottomEdge = radCenterY+radSize;
	if (player.x < leftEdge) {
		player.x = leftEdge;
	} 
	if (player.y < topEdge) {
		player.y = topEdge;
	}
	if (player.x > rightEdge) {
		player.x = rightEdge;
	}
	if (player.y > bottomEdge) {
		player.y = bottomEdge;
	}

}

function handleRadiationGrowth () {
	radSize += radGrowthRate;
}

function toggleRadiation (){
	radEnabled = !radEnabled;
	console.log ('Radiation Enable? ' + radEnabled);
}
