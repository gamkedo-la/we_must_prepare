var items = Object.freeze({
	nothing    		:   0,
	metal      		:   1,
	stone      		:   2,
	wood       		:   3,
	axe	       		:   4,
	watercan   		:   5,
	hoe        		:   6,
	pickaxe    		:   7,
	wheatSeedOne  :   8,
	wheatSeedTwo  :   9,
});

function emptyInventorySlot(){
	this.item = items.nothing;
	this.count = 0;
}

function InventoryClass(size){
	this.selectedSlotIndex = -1; //Index of slot the cursor is hovering over
	this.slotCount = size;
	
	this.slots = [];
	
	//Working backwards decreases array allocation time
	for(var i = this.slotCount - 1; i >= 0; i--){
		this.slots[i] = new emptyInventorySlot();
	}
	
	//Add count no. of item to inventory, filling stacks first, then empty slots
	//Returns leftover item count
	this.add = function(item, count){
		if(count <= 0) return;
		
		//Check for slots with the same item and fill those first
		for(var i = 0; i < this.slotCount; i++){
			if(this.slots[i].item === item){
				if(this.slots[i].count + count > this.slots[i].item.maxStackSize){
					count -= (this.slots[i].item.maxStackSize - this.slots[i].count);
					this.slots[i].count = this.slots[i].item.maxStackSize;
				}else{
					this.slots[i].count += count;
					count = 0;
					break;
				}
			}
		}
		
		//Then fill empty slots after all stacks are at max size
		for(var i = 0; i < this.slotCount; i++){
			if(count <= 0) break;
			if(this.slots[i].item === items.nothing){
				this.slots[i].item = item;
				
				if(count > this.slots[i].item.maxStackSize){
					count -= this.slots[i].item.maxStackSize;
					this.slots[i].count = this.slots[i].item.maxStackSize;
				}else{
					this.slots[i].count = count;
					count = 0;
				}
			}
		}
		
		return count; //Tells calling function how many items are left
	};
	
	this.grabSlot = function(){
		if(player.holdingSlot.item != this.slots[this.selectedSlotIndex].item){
			var tempSlot = player.holdingSlot;
			player.holdingSlot = this.slots[this.selectedSlotIndex];
			this.slots[this.selectedSlotIndex] = tempSlot;
		} else {
			// TODO account for stack limits
			this.slots[this.selectedSlotIndex].count += player.holdingSlot.count;
			player.holdingSlot = new emptyInventorySlot();
		}
	};
	
	this.altGrabSlot = function() {
		if(player.holdingSlot.count <= 0) {
			player.holdingSlot.item = this.slots[this.selectedSlotIndex].item;
			player.holdingSlot.count = Math.ceil(this.slots[this.selectedSlotIndex].count/2);
			this.slots[this.selectedSlotIndex].count = Math.floor(this.slots[this.selectedSlotIndex].count/2);
			return;
		}
		
		if(this.slots[this.selectedSlotIndex].count <= 0) {
			this.slots[this.selectedSlotIndex].item = player.holdingSlot.item;
		}
		
		if(player.holdingSlot.item === this.slots[this.selectedSlotIndex].item) {
			this.slots[this.selectedSlotIndex].count++;
			
			player.holdingSlot.count--;
			if(player.holdingSlot.count === 0) {
				player.holdingSlot = new emptyInventorySlot();
			}
		}
	};
	
	//Automatically remove count number of items from inventory iff they exist
	this.remove = function(item, count, allowPartialRemoval){
		var itemsToRemove = [];
		var removeItems = false; // Do we have enough items to fill the request?
		// TODO name this better so I don't need a comment
		
		for(var i = this.slotCount - 1; i >= 0; i--){
			if(this.slots[i].item == item){
				if(count == this.slots[i].count){
					this.slots[i] = new emptyInventorySlot();
					
					removeItems = true;
				}else if(count < this.slots[i].count){
					this.slots[i].count -= count;
					
					removeItems = true;
				}else{ // Tally item slots smaller than count but do not remove yet
					itemsToRemove[i] = this.slots[i].count;
					count -= this.slots[i].count;
				}
			}
		}
		
		// Remove tallied items only if we have enough to fulfill the request
		if(removeItems && itemsToRemove.length > 0){
			for(var i = 0; i < itemsToRemove.length; i++){
				if(itemsToRemove[i] > 0){
					this.slots[i] = new emptyInventorySlot();
				}
			}
		}
		
		return removeItems;
	};
	
	this.removeAll = function(item){
		if(!item) return console.error("ERROR: no item provided. This function removes all of a single item, to clear inventory please use the clear() function");
		
		var count = 0;
		
		for(var i = 0; i < slotCount; i++){
			if(this.slots[i].item === item){
				count += this.slots[i].count;
				this.slots[i] = new emptyInventorySlot();
			}
		}
		
		return count;
	};
	
	this.clear = function(){
		for(var i = this.slotCount - 1; i >= 0; i--){
			this.slots[i] = new emptyInventorySlot();
		}
	};
	
	this.countItems = function(item){
		var count = 0;
		
		for(var i = 0; i < this.slotCount; i++){
			if(this.slots[i].item == item){
				count += this.slots[i].count;
			}
		}
		
		return count;
	};
}

var secondInventory = new InventoryClass(30);
