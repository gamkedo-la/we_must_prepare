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
    this.inventoryY = 275;
    this.itemYSpacing = 55;
    this.itemsPerRow = 10;
		
    this.firstInventoryX = 150;
    this.firstInventoryY = 362;
    
    this.secondInventoryX = 150;
    this.secondItemXSpacing = 55;
    this.secondInventoryY = 187;
    this.secondItemYSpacing = 55;
    
    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(player.inventory.selectedSlotIndex >= 0){
            player.inventory.grabSlot();
            return true;
        } else if(secondInventory.active && secondInventory.selectedSlotIndex >= 0) {
            secondInventory.grabSlot();
            return true;
        }
        return false;
    };

    this.rightMouseClick = function(x=mouseX, y=mouseY) {
        if(player.inventory.selectedSlotIndex >= 0){
            player.inventory.altGrabSlot();
            return true;
        } else if(secondInventory.active && secondInventory.selectedSlotIndex >= 0) {
            secondInventory.altGrabSlot();
            return true;
        }
        return false;
    };

	this.draw = function() {
		drawUIPaneBackground(this);
		
		var itemX, itemY;
		if(secondInventory.active) {
			var inventoryX = this.firstInventoryX;
			var inventoryY = this.firstInventoryY;
		} else {
			var inventoryX = this.inventoryX;
			var inventoryY = this.inventoryY;
		}
		secondInventory.selectedSlotIndex = -1;
		player.inventory.selectedSlotIndex = -1;
		
		//draw regular slots
		for(var i = 0; i < player.inventory.slotCount; i++) {
            itemX = inventoryX + this.itemXSpacing * (i % this.itemsPerRow);
            itemY = inventoryY + this.itemYSpacing * Math.floor(i / this.itemsPerRow);

			inventoryUIHelper.testMouse(player.inventory, itemX, itemY, i); // TODO this should probably be in interfaceUpdate
			inventoryUIHelper.drawSlockBackground(player.inventory, itemX, itemY, i);
			inventoryUIHelper.drawSlot(itemX, itemY, player.inventory.slots[i]);
		}
		
		if(secondInventory.active) {
			for(var i = 0; i < secondInventory.slotCount; i++) {
				//draw as regular slot
                itemX = this.secondInventoryX + this.secondItemXSpacing * (i % this.itemsPerRow);
                itemY = this.secondInventoryY + this.secondItemYSpacing * Math.floor(i / this.itemsPerRow);
	
				inventoryUIHelper.testMouse(secondInventory, itemX, itemY, i); // TODO this should probably be in interfaceUpdate
				inventoryUIHelper.drawSlockBackground(secondInventory, itemX, itemY, i);
				inventoryUIHelper.drawSlot(itemX, itemY, secondInventory.slots[i]);
			}
		}
	};
}

function hotbarPaneUI() {
	this.hotbarItemX = canvas.width * 0.5 - 115;
	this.hotbarItemXSpacing = 55;
	this.hotbarItemY = canvas.height - 50;

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
        for (var i = 0; i < player.hotbar.slotCount; i++) {
            itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
			itemY = this.hotbarItemY;
			var keyText = i + 1; // i + 1 to show the correct keybind
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
			colorText(keyText, itemX + 17, itemY + 22, 'white'); // 17 and 22 are just values to put keybind text in corner
		}
	};
}

function holdingSlotUI() {
    this.draw = function () {
        if (player.holdingSlot.count > 0) { // TODO move this to inventory code somewhere
            inventoryUIHelper.drawSlot(mouseX, mouseY, player.holdingSlot);
        }
    };
}

var inventoryUIHelper = {	
	isAudioUIInventorySelectPlaying : false,
	uiMouseX: mouseX,
	uiMouseY: mouseY,
	itemSpriteSheet: new SpriteSheetClass(itemSheet, 50, 50),// TODO maybe put the image size somewhere else
	selectedSlotSprite: new SpriteClass(targetTilePic, 64, 64),

	drawSlot:	function (itemX, itemY, slot){
		if(slot.count > 0){
			this.itemSpriteSheet.draw(itemX, itemY, slot.item, 0);
		}

		if(slot.count > 1){
			colorText(slot.count, itemX - 3, itemY - 15, 'white');
		}
	},
  
	drawSlockBackground: function(inventory, itemX, itemY, i) {
		if(inventory.selectedSlotIndex === i) {						
			this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
			this.selectedSlotSprite.draw(itemX, itemY);
		} else {
			this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
		}
	},

	testMouse: function (inventory, itemX, itemY, i) {		
		if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {				
			inventory.selectedSlotIndex = i;

			if (this.uiMouseX != mouseX || this.uiMouseY != mouseY)	{
				if (this.uiMouseX > itemX - 25 && this.uiMouseX < itemX + 25 && this.uiMouseY > itemY - 25 && this.uiMouseY < itemY + 25) {
					this.isAudioUIInventorySelectPlaying = false;
				}
				else if (!this.isAudioUIInventorySelectPlaying) {				
					uiInventorySelect.play();
					this.isAudioUIInventorySelectPlaying = true;			
				}		
			}			

			this.uiMouseX = mouseX;
			this.uiMouseY = mouseY;
		}
	}
};
