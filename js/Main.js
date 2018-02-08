// save the canvas for dimensions, and its 2d context for drawing to it
const PLAYER_START_UNITS = 1;
const ENEMY_START_UNITS = 20;

var carriedWood, carriedMetal, carriedStone;
var storedWood, storedMetal, storedStone;
var canvas, canvasContext;
var playerUnits = [];
var enemyUnits = [];

var reset = function() {
    carriedMetal = 0;
    carriedStone = 0;
    carriedWood = 0;
    storedMetal = 0;
    storedStone = 0;
    storedWood = 0;
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);
    reset();
    canvas.addEventListener('mousemove', mousemoveHandler);
    canvas.addEventListener('mousedown', mousedownHandler);
    canvas.addEventListener('mouseup', mouseupHandler);
    var player = new unitClass();
    player.resetAndSetPlayerTeam(true);
    playerUnits.push(player);
/*    for (var i = 0; i < PLAYER_START_UNITS; i++) {
        var spawnUnit = new unitClass();
        spawnUnit.resetAndSetPlayerTeam(true);
        playerUnits.push(spawnUnit);
    }
    for (var i = 0; i < ENEMY_START_UNITS; i++) {
        var spawnUnit = new unitClass();
        spawnUnit.resetAndSetPlayerTeam(false);
        enemyUnits.push(spawnUnit);
    }*/
}  // end onload

function moveEverything() {
    for (var i = 0; i < playerUnits.length; i++) {
        playerUnits[i].move();
    }
    for (var i = 0; i < enemyUnits.length; i++) {
        enemyUnits[i].move();
    }
}

function drawEverything() {
    // clear the game view by filling it with black
    // colorRect(0, 0, canvas.width, canvas.height, 'black');
    drawRoom();
    for (var i = 0; i < playerUnits.length; i++) {
        playerUnits[i].draw();
    }
    for (var i = 0; i < enemyUnits.length; i++) {
        enemyUnits[i].draw();
    }

    for (var i = 0; i < selectedUnits.length; i++) {
        selectedUnits[i].drawSelectionBox();
    }

    if (isMouseDragging) {
        coloredOutlineRectCornerToCorner(lassoX1, lassoY1, lassoX2, lassoY2, 'yellow');
    }

    canvasContext.fillStyle = 'white';
    var textLineY = 20, textLineSkip = 15, textLineX = 30;
    canvasContext.fillText('Wood: ' + carriedWood, textLineX, textLineY); textLineY += textLineSkip;
    canvasContext.fillText('Metal: ' + carriedMetal, textLineX, textLineY); textLineY += textLineSkip;
    canvasContext.fillText('Stone: ' + carriedStone, textLineX, textLineY); textLineY += textLineSkip;

}
