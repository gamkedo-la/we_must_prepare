var items = Object.freeze({
	nothing    		:   0,
	metal      		:   1,
	stone      		:   2,
	wood       		:   3,
	axe	       		:   4,
	watercan   		:   5,
	hoe        		:   6,
	pickaxe    		:   7,
	wheatSeedOne   	:   8,
	wheatSeedTwo   	:   9,
});

function inventorySystem(){
	this.emptySlot = function(){
		this.item = items.nothing;
		this.count = 0;
	};
	
	this.selectedSlot = -1;
	this.equippedItemIndex = 0;
	this.holdingSlot = new this.emptySlot();
	this.hotbarCount = 5;
	this.slotCount = 30 + this.hotbarCount;
	
	this.inventorySlots = [];
	
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
	
	this.altGrabSlot = function() {
		if(this.holdingSlot.count <= 0) {
			this.holdingSlot.item = this.inventorySlots[this.selectedSlot].item;
			this.holdingSlot.count = Math.ceil(this.inventorySlots[this.selectedSlot].count/2);
			this.inventorySlots[this.selectedSlot].count = Math.floor(this.inventorySlots[this.selectedSlot].count/2);
			return;
		}
		
		if(this.inventorySlots[this.selectedSlot].count <= 0) {
			this.inventorySlots[this.selectedSlot].item = this.holdingSlot.item;
		}
		
		if(this.holdingSlot.item === this.inventorySlots[this.selectedSlot].item) {
			this.inventorySlots[this.selectedSlot].count++;
			
			this.holdingSlot.count--;
			if(this.holdingSlot.count === 0) {
				this.holdingSlot = new this.emptySlot();
			}
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

	this.rightMouseClick = function(x=mouseX, y=mouseY) {
		if(inventory.selectedSlot >= 0){
			inventory.altGrabSlot();
			return true;
		}
		return false;
	};

	this.draw = function() {
		var itemX, itemY;
		inventory.selectedSlot = -1;
		
		for(var i = 0; i < inventory.hotbarCount; i++) {
			//draw as hotbar
			itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
			itemY = this.hotbarItemY;
			
			inventoryUIHelper.drawSlockBackground(itemX, itemY, i);
			

			inventoryUIHelper.drawSlot(itemX, itemY, inventory.inventorySlots[i]);
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
  
	drawSlockBackground: function(itemX, itemY, i) {
		this.testMouse(itemX, itemY, i); // TODO this should probably be in interfaceUpdate
		
		if(inventory.selectedSlot === i) {
			if (i === inventory.equippedItemIndex) {
				colorRect(itemX - 25, itemY - 25, 50, 50, 'lightgreen');
				canvasContext.fillStyle = 'white';
			} else {
				this.selectedSlotSprite.draw(itemX, itemY);
			}
		} else if (i === inventory.equippedItemIndex) {
			colorRect(itemX - 25, itemY - 25, 50, 50, 'green');
			canvasContext.fillStyle = 'white';
		} else {
			this.itemSpriteSheet.draw(itemX, itemY, 0, 0);
		}
	},
	
	testMouse: function (itemX, itemY, i) {
		if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25) {
			inventory.selectedSlot = i;
		}
	},
};
