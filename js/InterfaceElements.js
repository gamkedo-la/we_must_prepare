var buttonColor = "lightgray";
var buttonColorPressed = "gray"

// Just a clickable button.
// parentInterface is the Pane instance this button is created on
function Button(parentInterface, name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    this.parentInterface = parentInterface;
    this.isPressed = false;

    if (this.parentInterface.push) {
        this.parentInterface.push(this); // this button is pushed into parentInterface's array when instanced
    }

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

// An item picked up from the Inventory or Hotbar pane, and attached to the mouse cursor.
function ItemsHeldAtMouse() {
    this.draw = function () {
        if (player.itemsHeldAtMouse.count > 0) { // TODO move this to inventory code somewhere
            inventorySlotInterfaceHelper.drawInventorySlot(mouseX, mouseY, player.itemsHeldAtMouse);
        }
    };
}