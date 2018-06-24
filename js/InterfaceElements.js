var buttonColor = "lightgray";
var buttonColorPressed = "gray"

function Button(parentInterface, name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    this.parentInterface = parentInterface;
    this.isPressed = false;

    this.parentInterface.push(this); // button is pushed into parentInterface's array at init

    //TODO I think this is ok in javascript with varable scope
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(isInPane(this, x, y)) {
            this.isPressed = true;
        }
    };
    
    this.mouseOver = function(x=mouseX, y=mouseY) {
        if (!mouseHeld && isInPane(this, x, y)) {
            //mouse released while inside pane
            if(this.isPressed) {
                this.action();
            }
            this.isPressed = false;
        } else if (!isInPane(this, x, y)) {
            this.isPressed = false;
        }
    };

    // This function will be called when button is triggered
    this.action = function() {
        // assign custom function to do something
    };
    
    this.draw = function() {
        if(this.isVisible) {
            var drawColor;
            drawColor = (this.isPressed) ? buttonColorPressed : buttonColor;
            colorRect(this.x, this.y, this.width, this.height, drawColor);

            var str = this.name;
            var strWidth = canvasContext.measureText(this.name).width;
            //center text
            var textX = this.x + (this.width*0.5) - (strWidth*0.5);
            //TODO magic numbers going here.
            var textY = this.y + (this.height*0.5) + 4;
            colorText(str, textX, textY, "black");
        }
    };
}

function InventoryItemHeldAtMouseCursor() {
    this.draw = function () {
        if (player.holdingSlot.count > 0) { // TODO move this to inventory code somewhere
            inventoryInterfaceHelper.drawSlot(mouseX, mouseY, player.holdingSlot);
        }
    };
}