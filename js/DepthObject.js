function DepthObject(x, y, xDraw, yDraw, useImg) {
    this.x = x;
    this.y = y;
    this.useImg = useImg;
    this.draw = function() {
        canvasContext.drawImage(this.useImg, xDraw, yDraw); // coords at base of feet
    }
}