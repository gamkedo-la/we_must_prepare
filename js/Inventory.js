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
	this.slotCount = 35;
	this.hotbarCount = 5;
	
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
		if(this.holdingSlot == item.nothing){
			this.holdingSlot = this.inventorySlots[this.selectedSlot];
			this.inventorySlots[this.selectedSlot] = new this.emptySlot();
		}else if(this.holdingSlot.item == this.inventorySlots[this.selectedSlot].item){
			this.holdingSlot.count += this.inventorySlots[this.selectedSlot].count;
			this.inventorySlots[this.selectedSlot] = new this.emptySlot();
		}
		
		var tempSlot = this.holdingSlot;
		this.holdingSlot = this.inventorySlots[this.selectedSlot];
		this.inventorySlots[this.selectedSlot] = tempSlot;
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

//TODO move this to UI code
hotbarItemX = 215;
hotbarItemXSpacing = 55;
hotbarItemY = 570;

inventoryX = 150;
itemXSpacing = 55;
inventoryY = 250;
itemYSpacing = 55;
itemsPerRow = 10;

var inventory = new inventorySystem();

function inventoryUITest(){
	var itemSpriteSheet = new SpriteSheetClass(itemSheet, 50, 50);// TODO maybe put the image size somewhere else
	var selectedSlotSprite = new SpriteClass(selectedItemSlot, 50, 50);
	
	this.active = false;
	
	this.draw = function(){
		var itemX = 0;
		var itemY = 0;
		
		inventory.selectedItemSlot = -1;
		
		for(var i = 0; i < inventory.slotCount; i++) {
			
			if(i < inventory.hotbarCount) {
				//draw as hotbar
				itemX = hotbarItemX + hotbarItemXSpacing * i;
				itemY = hotbarItemY;
				
				if(this.testMouse(itemX, itemY)){
					inventory.selectedItemSlot = i;
				}

				if (i == inventory.equippedItemIndex) {
					colorRect(itemX-25, itemY-25, 50, 50, 'green');
					canvasContext.fillStyle = 'white'; 
				}
				
				if(inventory.inventorySlots[i].count > 0){
					itemSpriteSheet.draw(itemX, itemY, inventory.inventorySlots[i].item, 0);
				}
				
				if(inventory.inventorySlots[i].count > 1){
					canvasContext.fillText(inventory.inventorySlots[i].count, itemX, itemY);
				}
			} else if(this.active) {
				//draw as regular slot
				itemX = inventoryX + itemXSpacing * ((i - inventory.hotbarCount) % itemsPerRow);
				itemY = inventoryY + itemYSpacing * Math.floor((i - inventory.hotbarCount)/itemsPerRow);
				
				if(this.testMouse(itemX, itemY)){
					inventory.selectedItemSlot = i;
				}
				
				if(inventory.inventorySlots[i].count > 0){
					itemSpriteSheet.draw(itemX, itemY, inventory.inventorySlots[i].item, 0);
				}
				
				if(inventory.inventorySlots[i].count > 1){
					canvasContext.fillText(inventory.inventorySlots[i].count, itemX, itemY);
				}
			}
		}
	};
	
	this.testMouse = function(itemX, itemY){
		if(mouseX > itemX - 25 && mouseX < itemX + 25 && mouseY > itemY - 25 && mouseY < itemY + 25){
			selectedSlotSprite.draw(itemX, itemY);
		} else {
			itemSpriteSheet.draw(itemX, itemY, 0, 0);
		}
	}
}

//var inventoryUI;
