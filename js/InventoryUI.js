//var inventory = new inventoryClass(30);

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
    this.inventoryY = 362;
    this.itemYSpacing = 55;
    this.itemsPerRow = 10;
    
    this.secondInventoryX = 150;
    this.secondItemXSpacing = 55;
    this.secondInventoryY = 187;
    this.secondItemYSpacing = 55;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(player.inventory.selectedSlotIndex >= 0){
            player.inventory.grabSlot();
            return true;
        } else if(secondInventory.selectedSlotIndex >= 0) {
            secondInventory.grabSlot();
            return true;
        }
        return false;
    };

    this.rightMouseClick = function(x=mouseX, y=mouseY) {
        if(player.inventory.selectedSlotIndex >= 0){
            player.inventory.altGrabSlot();
            return true;
        } else if(secondInventory.selectedSlotIndex >= 0) {
            secondInventory.altGrabSlot();
            return true;
        }
        return false;
    };

	this.draw = function() {
		drawUIPaneBackground(this);
		
		var itemX, itemY;
		secondInventory.selectedSlotIndex = -1;
		player.inventory.selectedSlotIndex = -1;
		
		//draw regular slots
		for(var i = 0; i < player.inventory.slotCount; i++) {
			itemX = this.inventoryX + this.itemXSpacing * (i % this.itemsPerRow);
			itemY = this.inventoryY + this.itemYSpacing * Math.floor(i / this.itemsPerRow);

			inventoryUIHelper.testMouse(player.inventory, itemX, itemY, i); // TODO this should probably be in interfaceUpdate
			inventoryUIHelper.drawSlockBackground(player.inventory, itemX, itemY, i);
			inventoryUIHelper.drawSlot(itemX, itemY, player.inventory.slots[i]);
		}
		
		for(var i = 0; i < secondInventory.slotCount; i++) {
			//draw as regular slot
			itemX = this.secondInventoryX + this.secondItemXSpacing * (i % this.itemsPerRow);
			itemY = this.secondInventoryY + this.secondItemYSpacing * Math.floor(i / this.itemsPerRow);

			inventoryUIHelper.testMouse(secondInventory, itemX, itemY, i); // TODO this should probably be in interfaceUpdate
			inventoryUIHelper.drawSlockBackground(secondInventory, itemX, itemY, i);
			inventoryUIHelper.drawSlot(itemX, itemY, secondInventory.slots[i]);
		}
	};
}

function hotbarPaneUI() {
	this.hotbarItemX = 215;
	this.hotbarItemXSpacing = 55;
	this.hotbarItemY = 570;

	this.leftMouseClick = function(x = mouseX, y = mouseY) {
		if(player.hotbar.selectedSlotIndex >= 0){
			player.hotbar.grabSlot();
			return true;
		}
		return false;
	};

	this.leftMouseDblClick = function(x = mouseX, y = mouseY) {
		if(player.hotbar.selectedSlotIndex >= 0){
			player.hotbar.equippedItemIndex = player.hotbar.selectedSlotIndex;
			return true;
		}
		return false;
	};

	this.rightMouseClick = function(x=mouseX, y=mouseY) {
		if(player.hotbar.selectedSlotIndex >= 0){
			player.hotbar.altGrabSlot();
			return true;
		}
		return false;
	};

	this.draw = function() {
		var itemX, itemY;
		player.hotbar.selectedSlotIndex = -1;
		
		// draw hotbar
		for(var i = 0; i < player.hotbar.slotCount; i++) {
			itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
			itemY = this.hotbarItemY;
			
			inventoryUIHelper.testMouse(player.hotbar, itemX, itemY, i); // TODO this should probably be in interfaceUpdate
			
			// Draw equipped slot differently
			if(i === player.hotbar.equippedItemIndex) {
				if(i === player.hotbar.selectedSlotIndex) {
					colorRect(itemX - 25, itemY - 25, 50, 50, 'lightgreen');
					canvasContext.fillStyle = 'white';
				} else {
					colorRect(itemX - 25, itemY - 25, 50, 50, 'green');
					canvasContext.fillStyle = 'white';
				}
			} else { // Draw all other slots
				inventoryUIHelper.drawSlockBackground(player.hotbar, itemX, itemY, i);
			}
			
			inventoryUIHelper.drawSlot(itemX, itemY, player.hotbar.slots[i]);
		}
	};
}

var inventoryUIHelper = {
	itemSpriteSheet: new SpriteSheetClass(itemSheet, 50, 50),// TODO maybe put the image size somewhere else
	selectedSlotSprite: new SpriteClass(selectedItemSlot, 50, 50),

	drawSlot:	function (itemX, itemY, slot){
		if(slot.count > 0){
			this.itemSpriteSheet.draw(itemX, itemY, slot.item, 0);
		}

		if(slot.count > 1){
			canvasContext.fillStyle = 'white';
			canvasContext.fillText(slot.count, itemX, itemY);
		}
	},
  
	drawSlockBackground: function(inventory, itemX, itemY, i) {
		if(inventory.selectedSlotIndex === i) {
				this.selectedSlotSprite.draw(itemX, itemY);
		} else {
			this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
		}
	},
	
	testMouse: function (inventory, itemX, itemY, i) {
		if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {
			inventory.selectedSlotIndex = i;
		}
	},
};
