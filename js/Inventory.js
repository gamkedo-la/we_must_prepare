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

// when pressing number key in Input.js, we assign numbers to slots
const SLOT_1 = 0;
const SLOT_2 = 1;
const SLOT_3 = 2;
const SLOT_4 = 3;
const SLOT_5 = 4;

function emptyInventorySlot(){
	this.item = items.nothing;
	this.count = 0;
}

function InventoryClass(size){
    this.selectedSlotIndex = -1; //Index of slot the cursor is hovering over
    this.equippedItemIndex = -1;
	this.slotCount = size;
	
	this.slots = [];
	
	//Working backwards decreases array allocation time
	for(var i = this.slotCount - 1; i >= 0; i--){
		this.slots[i] = new emptyInventorySlot();
	}

	this.getSaveState = function() {
		return {
			selectedSlotIndex: this.selectedSlotIndex,
			equippedItemIndex: this.equippedItemIndex,
			slotCount: this.slotCount,
			slots: this.slots
		};
	};

	this.loadSaveState = function(saveState) {
		this.selectedSlotIndex = saveState.selectedSlotIndex;
		this.equippedItemIndex = saveState.equippedItemIndex;
		this.slotCount = saveState.slotCount;
		this.slots = saveState.slots;
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

        if (this.selectedSlotIndex == this.equippedItemIndex) {
            this.equippedItemIndex = -1;
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

        if (this.selectedSlotIndex == this.equippedItemIndex) {
            this.equippedItemIndex = -1;
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
                    this.equippedItemIndex = -1;
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

    this.scrollThrough = function (scrollLeftIfTrue = false) {
        var scrollDir = scrollLeftIfTrue ? -1 : 1;
        this.equipSlot(this.equippedItemIndex + scrollDir);

        if (scrollLeftIfTrue) {
            while (this.equippedItemIndex >= 0 && this.equippedItemIndex < this.slotCount && this.slots[this.equippedItemIndex].item == 0) {
                this.equippedItemIndex--;
            }
		}
		else {            
            while (this.equippedItemIndex >= 0 && this.equippedItemIndex < this.slotCount && this.slots[this.equippedItemIndex].item == 0) {
                this.equippedItemIndex++;
            }
        }
	}

    this.equipSlot = function (whichSlot) {
        this.equippedItemIndex = whichSlot;

        if (this.equippedItemIndex < -1) {
            this.equipSlot(this.slotCount - 1);
        }
        else if (this.equippedItemIndex > this.slotCount) {
            this.equipSlot(0);
        }
	}
}
