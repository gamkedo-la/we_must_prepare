var inventory = new inventorySystem();

function inventoryPaneUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    
    //formatting variables

    this.inventoryX = 150;
    this.itemXSpacing = 55;
    this.inventoryY = 250;
    this.itemYSpacing = 55;
    this.itemsPerRow = 10;
    
    this.leftMouseClick = function(mouseX, mouseY) {
        return false;
    }

	this.draw = function() {
		colorRect(this.x,this.y,this.width,this.height, 'beige');
		//canvasContext.fillStyle = 'beige';
		//canvasContext.fillRect(this.x,this.y,this.width,this.height);
		
		var itemX, itemY;
		for(var i = inventory.hotbarCount; i < inventory.slotCount; i++) {
			//draw as regular slot
			itemX = this.inventoryX + this.itemXSpacing * ((i - inventory.hotbarCount) % this.itemsPerRow);
			itemY = this.inventoryY + this.itemYSpacing * Math.floor((i - inventory.hotbarCount)/this.itemsPerRow);

			inventoryUIHelper.drawSlot(itemX, itemY, i);
		}
	};
}