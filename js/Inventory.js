function items(){
	this.nothing = 0;
	this.wood = 1;
	this.metal = 2;
	this.stone = 3;
}

function inventory(){
	this.currentSelectedSlot;
	this.holdingSlot = items.nothing;
	this.slotCount = 30;
	this.hotBarCount = 10;
	
	this.inventorySlots = [];
	this.hotBar = [];
	
	this.emptySlot = {
		this.item = items.nothing;
		this.count = 0;
	};
	
	//Working backwards decreases array allocation time
	for(var i = this.slotCount - 1; i >= 0; i--){
		this.inventorySlots[i] = item.nothing;
	}
	
	for(var i = this.hotBarCount - 1; i >= 0; i--){
		this.hot
	}
	
	function add(item, count){
		for(var i; i < this.slotCount; i++){
			if(this.inventorySlots[i].item == item){
				this.inventorySlots[i].count++;
			}
			return;
		}
		for(var i; i < this.slotCount; i++){
			if(this.inventorySlots[i].item == items.nothing){
				this.inventorySlots[i].item = item;
				this.inventorySlots[i].count = 1;
			}
			return;
		}
		//TODO: Drop the item because the inventory is full
	}
	
	function grabSlot(slot){
		if(this.holdingSlot == item.nothing){
			this.holdingSlot = this.inventorySlots[slot];
			this.inventorySlots[slot] = inventory.emptySlot;
		}
		else if(this.holdingSlot.item == this.inventorySlots[slot].item){
			this.holdingSlot.count += this.inventorySlots[slot].count;
			this.inventorySlots[slot] = inventory.emptySlot;
		}
		var tempSlot = this.holdingSlot;
		this.holdingSlot = this.inventorySlots[slot];
		this.inventorySlots[slot] = tempSlot;
	}
	
	//Automatically remove count number of items from inventory iff they exist
	function remove(item, count){
		var itemsToRemove = [];
		var removeItems = false;
		
		for(var i; i < this.slotCount; i++){
			if(this.inventorySlots[i].item == item){
				if(count == this.inventorySlots[i]){
					this.inventorySlots[i].item = items.nothing;
					this.inventorySlots[i].count = 0;
					
					removeItems = true;
				}
				else if(count > this.inventorySlots[i].count){
					this.inventorySlots[i].count -= count;
					
					removeItems = true;
				}
				else{
					itemsToRemove[i] = this.inventorySlots[i].count;
					count -= this.inventorySlots[i].count;
				}
				
			}
		}
		
		if(removeItems && itemsToRemove.length > 0){
			for(var i = 0; i < itemsToRemove.length; i++){
				if(itemsToRemove[i] > 0){
					this.inventorySlots[i].count = 0;
					this.inventorySlots[i].item = items.nothing;
				}
			}
		}
		
		return removeItems;
	}
	
}