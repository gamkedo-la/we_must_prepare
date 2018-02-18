// save the canvas for dimensions, and its 2d context for drawing to it
const PLAYER_START_UNITS = 1;
const ENEMY_START_UNITS = 20;

var canvas, canvasContext;
var player = new playerClass();


window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', mousemoveHandler);
    canvas.addEventListener('mousedown', mousedownHandler);
    canvas.addEventListener('mouseup', mouseupHandler);
    
    player.reset();

}  // end onload

function moveEverything() {
    player.move();
}

function drawEverything() {
    // clear the game view by filling it with black
    // colorRect(0, 0, canvas.width, canvas.height, 'black');
    drawRoom();
    player.draw();
}
