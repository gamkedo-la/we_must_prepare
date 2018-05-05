function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function outlineCircle(centerX, centerY, radius, strokeColor) {
    canvasContext.strokeStyle = strokeColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.setLineDash([]);
    canvasContext.stroke();
}

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY, withAngle = 0) {
    canvasContext.save(); // allows us to undo translate movement and rotate spin
    canvasContext.translate(atX, atY); // sets the point where our graphic will go
    canvasContext.rotate(withAngle); // sets the rotation
    canvasContext.drawImage(graphic, -graphic.width / 2, -graphic.height / 2); // center, draw
    canvasContext.restore(); // undo the translation movement and rotation since save()
}

function coloredOutlineRectCornerToCorner(corner1X, corner1Y, corner2X, corner2Y, lineColor) {
    canvasContext.strokeStyle = lineColor;
    canvasContext.beginPath();
    canvasContext.rect(corner1X, corner1Y, corner2X - corner1X, corner2Y - corner1Y);
    canvasContext.stroke();
}

function colorText(text, textLineX, textLineY, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, textLineX, textLineY);
}

function SpriteClass(imageIn, widthIn, heightIn){
	var image = imageIn;
	var width = widthIn;
	var height = heightIn;
	
	//These save division operations when drawing to increase performance at the cost of memory
	var halfWidth = width/2;
	var halfHeight = height/2;
	
	this.draw = function(atX, atY){
		canvasContext.drawImage(image, atX - halfWidth, atY - halfHeight);
	};
	
	this.drawExtended = function(atX, atY, withAngle = 0, flipped = false){
		canvasContext.save();
		
		canvasContext.translate(atX, atY);
		canvasContext.rotate(withAngle);
		canvasContext.scale(flipped ? -1 : 1, 1);
		
		canvasContext.drawImage(image, -halfWidth, -halfHeight);
		
		canvasContext.restore();
	};
	
	this.getDimensions = function(){
		return {width:width, height:height};
	};
}

function SpriteSheetClass(sheetIn, colWidth, rowHeight){
	var sheet = sheetIn;
	var width = colWidth;
	var height = rowHeight;
	
	//These save division operations when drawing to increase performance at the cost of memory
	var halfWidth = width/2;
	var halfHeight = height/2;
	
	this.draw = function(atX, atY, col, row){
		canvasContext.drawImage(sheet,
		                        col * width, row * height,
		                        width, height,
		                        atX - halfWidth, atY - halfHeight,
		                        width, height);
	};
	
	this.drawExtended = function(atX, atY, col, row, withAngle = 0, flipped = false){
		canvasContext.save();
		
		canvasContext.translate(atX, atY);
		canvasContext.rotate(withAngle);
		canvasContext.scale(flipped ? -1 : 1, 1);
		
		canvasContext.drawImage(sheet,
		                        col * width, row * height,
		                        width, height,
		                        -halfWidth, -halfHeight,
		                        width, height);
		
		canvasContext.restore();
	};
	
	this.getDimensions = function(){
		return {width:width, height:height};
	};
}