function mainMenuUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(this.isVisible && isInPane(this, x, y)) {
            this.isVisible = false;
            return true; //mouse input handled
        } else {
            return false; //mouse input not handled
        }
    };
    
    this.draw = function() {
        if(this.isVisible) {
            drawUIPaneBackground(this);
            var str = "-- Press Left Click --";
            var strWidth = canvasContext.measureText(str).width;
            colorText(str, (canvas.width-strWidth) * 0.5, canvas.height*0.5, "black");
        }
    };
}