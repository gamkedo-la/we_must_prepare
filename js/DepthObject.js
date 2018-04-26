function depthObjectClass(x, y, xDraw, yDraw, useImg) {
    this.x = x;
    this.y = y;

    this.draw = function() {
        canvasContext.drawImage(useImg, xDraw, yDraw); // coords at base of feet
    }
}