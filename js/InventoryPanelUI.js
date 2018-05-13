var inventory = new inventorySystem();

function inventoryPaneUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;
    
    var itemSpriteSheet = new SpriteSheetClass(itemSheet, 50, 50);// TODO maybe put the image size somewhere else
	var selectedSlotSprite = new SpriteClass(selectedItemSlot, 50, 50);
    //formatting variables

    this.inventoryX = 150;
    this.itemXSpacing = 55;
    this.inventoryY = 250;
    this.itemYSpacing = 55;
    this.itemsPerRow = 10;
    
    this.leftMouseClick = function(mouseX, mouseY) {
        return true;
    }

    this.draw = function(draw) {
        colorRect(this.x,this.y,this.width,this.height, 'beige');
        //canvasContext.fillStyle = 'beige';
        //canvasContext.fillRect(this.x,this.y,this.width,this.height);
        
		inventory.selectedItemSlot = -1;
		
		for(var i = inventory.hotbarCount; i < inventory.slotCount; i++) {
			//draw as regular slot
			this.itemX = this.inventoryX + this.itemXSpacing * ((i - inventory.hotbarCount) % this.itemsPerRow);
			this.itemY = this.inventoryY + this.itemYSpacing * Math.floor((i - inventory.hotbarCount)/this.itemsPerRow);

			if(this.testMouse(this.itemX, this.itemY)){
				inventory.selectedItemSlot = i;
			}

			if(inventory.inventorySlots[i].count > 0){
				itemSpriteSheet.draw(this.itemX, this.itemY, inventory.inventorySlots[i].item, 0);
			}

			if(inventory.inventorySlots[i].count > 1){
				canvasContext.fillText(inventory.inventorySlots[i].count, this.itemX, this.itemY);
			}
		}
    } // end draw()
    
    this.testMouse = function(itemX, itemY) {
        if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {
			selectedSlotSprite.draw(itemX, itemY);
		} else {
			itemSpriteSheet.draw(itemX, itemY, 0, 0);
		}
	}
}