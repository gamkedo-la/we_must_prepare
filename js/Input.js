// save the canvas for dimensions, and its 2d context for drawing to it
var wasClickUsed = false;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // account for the margins, canvas position on page, scroll amount, etc.
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}


function mousemoveHandler(evt) {
    var mousePos = calculateMousePos(evt);

}


function mousedownHandler(evt) {
    var mousePos = calculateMousePos(evt);
}


function mouseupHandler(evt) {

    var mousePos = calculateMousePos(evt);
    wasClickUsed = false;
    player.goto(mousePos.x, mousePos.y);
    document.getElementById("debugText").innerHTML = "Moving to  (" + mousePos.x + ", " + mousePos.y + ")";
} // end mouse up handler
