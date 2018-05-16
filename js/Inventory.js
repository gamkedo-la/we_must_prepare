var items = Object.freeze({
	nothing    :   0,
	metal      :   1,
	stone      :   2,
	wood       :   3,
	axe	       :   4,
	watercan   :   5,
	hoe        :   6,
});

function inventorySystem(){
	this.selectedSlot = -1;
	this.equippedItemIndex = 0;
	this.holdingSlot = items.nothing;
	this.hotbarCount = 5;
	this.slotCount = 30 + this.hotbarCount;
	
	this.inventorySlots = [];
	
	this.emptySlot = function(){
		this.item = items.nothing;
		this.count = 0;
	};
	
	//Working backwards decreases array allocation time
	for(var i = this.slotCount - 1; i >= 0; i--){
		this.inventorySlots[i] = new this.emptySlot();
	}
	
	//Add count no. of item to inventory, filling stacks first, then empty slots
	//Returns leftover item count
	this.add = function(item, count){
		//Check for slots with the same item and fill those first
		for(var i = 0; i < this.slotCount; i++){
			if(this.inventorySlots[i].item == item){
				if(this.inventorySlots[i].count + count > this.inventorySlots[i].item.maxStackSize){
					count -= (this.inventorySlots[i].item.maxStackSize - this.inventorySlots[i].count);
					this.inventorySlots[i].count = this.inventorySlots[i].item.maxStackSize;
				}else{
					this.inventorySlots[i].count += count;
					count = 0;
					break;
				}
			}
		}
		
		//Then fill empty slots after all stacks are at max size
		for(var i = 0; i < this.slotCount; i++){
			if(count === 0) break;
			if(this.inventorySlots[i].item == items.nothing){
				this.inventorySlots[i].item = item;
				
				if(count > this.inventorySlots[i].item.maxStackSize){
					count -= this.inventorySlots[i].item.maxStackSize;
					this.inventorySlots[i].count = this.inventorySlots[i].item.maxStackSize;
				}else{
					this.inventorySlots[i].count = count;
					count = 0;
				}
			}
		}
		
		return count; //Tells calling function how many items are left
	};

	this.grabSlot = function(){
		if(this.holdingSlot.item != this.inventorySlots[this.selectedSlot].item){
			var tempSlot = this.holdingSlot;
			this.holdingSlot = this.inventorySlots[this.selectedSlot];
			this.inventorySlots[this.selectedSlot] = tempSlot;
		} else {
			// TODO account for stack limits
			this.inventorySlots[this.selectedSlot].count += this.holdingSlot.count;
			this.holdingSlot = new this.emptySlot();
		}
	};
	
	//Automatically remove count number of items from inventory iff they exist
	this.remove = function(item, count){
		var itemsToRemove = [];
		var removeItems = false; // Do we have enough items to fill the request?
		// TODO name this better so I don't need a comment
		
		for(var i = this.slotCount - 1; i >= 0; i--){
			if(this.inventorySlots[i].item == item){
				if(count == this.inventorySlots[i].count){
					this.inventorySlots[i] = new this.emptySlot();
					
					removeItems = true;
				}else if(count < this.inventorySlots[i].count){
					this.inventorySlots[i].count -= count;
					
					removeItems = true;
				}else{ // Tally item slots smaller than count but do not remove yet
					itemsToRemove[i] = this.inventorySlots[i].count;
					count -= this.inventorySlots[i].count;
				}
			}
		}
		
		// Remove tallied items only if we have enough to fulfill the request
		if(removeItems && itemsToRemove.length > 0){
			for(var i = 0; i < itemsToRemove.length; i++){
				if(itemsToRemove[i] > 0){
					this.inventorySlots[i] = new this.emptySlot();
				}
			}
		}
		
		return removeItems;
	};
	
	this.countItems = function(item){
		var count = 0;
		
		for(var i = 0; i < this.slotCount; i++){
			if(this.inventorySlots[i].item == item){
				count += this.inventorySlots[i].count;
			}
		}
		
		return count;
	};
}

function hotbarPaneUI() {
	this.hotbarItemX = 215;
	this.hotbarItemXSpacing = 55;
	this.hotbarItemY = 570;

	this.leftMouseClick = function(x = mouseX, y = mouseY) {
		if(inventory.selectedSlot >= 0){
			inventory.grabSlot();
			return true;
		}
		return false;
	};

	this.draw = function() {
		var itemX, itemY;
		
		for(var i = 0; i < inventory.hotbarCount; i++) {
			//draw as hotbar
			itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
			itemY = this.hotbarItemY;
			
			inventoryUIHelper.drawSlot(itemX, itemY, i);
		}
	};
}

var inventoryUIHelper = {
	itemSpriteSheet: new SpriteSheetClass(itemSheet, 50, 50),// TODO maybe put the image size somewhere else
	selectedSlotSprite: new SpriteClass(selectedItemSlot, 50, 50),

	drawSlot:	function (x, y, i){
		if(this.testMouse(x, y)){
			inventory.selectedSlot = i;
		}

		if (i == inventory.equippedItemIndex) {
			colorRect(x - 25, y - 25, 50, 50, 'green');
			canvasContext.fillStyle = 'white';
		}
			
		if(inventory.inventorySlots[i].count > 0){
			this.itemSpriteSheet.draw(x, y, inventory.inventorySlots[i].item, 0);
		}

		if(inventory.inventorySlots[i].count > 1){
			canvasContext.fillText(inventory.inventorySlots[i].count, x, y);
		}
	},
  
	testMouse: function (itemX, itemY) {
		if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {
			this.selectedSlotSprite.draw(itemX, itemY);
			return true;
		} else {
			this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
			return false;
		}
	},
};
