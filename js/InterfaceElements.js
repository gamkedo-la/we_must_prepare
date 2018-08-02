var buttonColor = "lightgray";
var buttonColorPressed = "gray"

// Can update a rectangle-like object to position and size depending on stored functions.
// By default it does not change the previous state of the object passed in call.
// Basically the functions passed to this constructor becomes "rules" to apply to the object passed
// as argument to the resulting function.
//
// How to use it:
//
//     var some_variable = 123;
//     var rect_updater = RectangleUpdater( obj => 10 // x will always be 10
//                                        , obj => 42 + some_variable // y might change depending on another vriable
//                                        , obj => obj.width + some_variable // width might change depending on previous object's width!
//                                        ); // no height function, so the object height will be preserved
//
//     var my_object = ObjectConstructor(); // construct an object with .x, .y, .width, .height members
//     rect_updater(my_object); // set the x, y, width and height according to the functions passed when constructing rect_updater.
//     some_variable = 0; // change something global (for example the canvas size)
//     rect_updater(my_object); // set the x, y, width and height but now y and width have different values.
//
function RectangleUpdater( x_func = object => object.x
                         , y_func = object => object.y
                         , width_func = object => object.width
                         , height_func = object => object.height
                        ){
    return function(rectangle_object){
        rectangle_object.x = x_func(rectangle_object);
        rectangle_object.y = y_func(rectangle_object);
        rectangle_object.width = width_func(rectangle_object);
        rectangle_object.height = height_func(rectangle_object);
        return rectangle_object;
    };
}

// Modifies a rectangular object to automatically use the provided RectangleUpdater to redefine it's position and size dynamically
// when .updatePosition() is called.
function Flow(rectangularObject, rectangleUpdater) {
    rectangularObject.updatePosition = function(){ rectangleUpdater(rectangularObject); };
    rectangularObject.updatePosition();

    rectangularObject.onScreenSizeChange = function(){
        if(rectangularObject.isVisible)
            rectangularObject.updatePosition();
    }
    return rectangularObject;
}

// Generic way to draw something, assuming it might have functions from either Flow or Button or any panel.
function draw(interfaceElement) {
    if (interfaceElement.onScreenSizeChange) // HACK HACK HACK: here we are updating the position of each button all the time, please optimize this by calling it only once per screen size change instead!
        interfaceElement.onScreenSizeChange();
    interfaceElement.draw();
};

// Just a clickable button.
// parentInterface is the Pane instance this button is created on
function Button(parentInterface, name, topLeftX, topLeftY, width, height) {
    // assert(width >= 0);
    // assert(height >= 0);
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = true;
    this.parentInterface = parentInterface;
    this.isPressed = false;

    if (this.parentInterface.push) {
        this.parentInterface.push(this); // this button is pushed into parentInterface's array when instanced
    }

    //TODO I think this is ok in javascript with varable scope
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(isInPane(this, x, y) && this.isVisible) {
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
    }


}

// An item picked up from the Inventory or Hotbar pane, and attached to the mouse cursor.
function ItemsHeldAtMouse() {
    this.draw = function () {
        if (player.itemsHeldAtMouse.count > 0) { // TODO move this to inventory code somewhere
            inventorySlotInterfaceHelper.drawInventorySlot(mouseX, mouseY, player.itemsHeldAtMouse);
        }
    };
}
