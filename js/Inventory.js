var items = Object.freeze({
	nothing    :   0,
	metal      :   1,
	stone      :   2,
	wood       :   3,
});

function inventorySystem(){
	this.currentSelectedSlot;
	this.holdingSlot = items.nothing;
	this.slotCount = 30;
	this.hotbarCount = 10;
	
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
	
	this.grabSlot = function(slot){
		if(this.holdingSlot == item.nothing){
			this.holdingSlot = this.inventorySlots[slot];
			this.inventorySlots[slot] = new this.emptySlot();
		}else if(this.holdingSlot.item == this.inventorySlots[slot].item){
			this.holdingSlot.count += this.inventorySlots[slot].count;
			this.inventorySlots[slot] = new this.emptySlot();
		}
		
		var tempSlot = this.holdingSlot;
		this.holdingSlot = this.inventorySlots[slot];
		this.inventorySlots[slot] = tempSlot;
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
hotbarItemX = 20;
hotbarItemXSpacing = 30;
hotbarItemY = 500;

inventoryX = 20;
itemXSpacing = 30;
inventoryY = 300;
itemYSpacing = 30;
itemsPerRow = 10;

var inventory = new inventorySystem();

function inventoryUITest(){
	this.active = false;
	
	this.draw = function(){
		if(this.active){
			var itemX = 0;
			var itemY = 0;
			
			for(var i = 0; i < inventory.slotCount; i++){
				if(i < inventory.hotbarCount){
					//draw as hotbar
					itemX = hotbarItemX + hotbarItemXSpacing * i;
					itemY = hotbarItemY;
					
					TEMPDrawItem(inventory.inventorySlots[i].item, itemX, itemY);
					
					if(inventory.inventorySlots[i].count > 0){
						canvasContext.fillText(inventory.inventorySlots[i].count, itemX, itemY);
					}
				} else {
					//draw as regular slot
					itemX = inventoryX + itemXSpacing * (i % itemsPerRow);
					itemY = inventoryY + itemYSpacing * Math.floor(i/itemsPerRow);
					
					TEMPDrawItem(inventory.inventorySlots[i].item, itemX, itemY);
					
					if(inventory.inventorySlots[i].count > 0){
						canvasContext.fillText(inventory.inventorySlots[i].count, itemX, itemY);
					}
				}
			}
		}
	};
}

var inventoryUI = new inventoryUITest();

function TEMPDrawItem(item, x, y){
	canvasContext.drawImage(tileSheet,
	                        item * TILE_W, 0, // top-left corner of tile art, multiple of tile width
	                        TILE_W, TILE_H, // get full tile size from source
	                        x, y, // x,y top-left corner for image destination
	                        TILE_W/2, TILE_H/2); // draw full tile size for destination
}