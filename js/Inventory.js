// when pressing number key in Input.js, we assign numbers to slots
const SLOT_1 = 0;
const SLOT_2 = 1;
const SLOT_3 = 2;
const SLOT_4 = 3;
const SLOT_5 = 4;

function EmptyInventorySlot() {
    this.item = ItemCode.NOTHING;
    this.count = 0;
}

function Inventory(size){
    this.active = true;
    this.selectedSlotIndex = -1; //Index of slot the cursor is hovering over
    this.equippedSlotIndex = -1;
    this.numberOfSlots = size;

    this.slots = [];

    //Working backwards decreases array allocation time
    for(var i = this.numberOfSlots - 1; i >= 0; i--){
        this.slots[i] = new EmptyInventorySlot();
    }

    this.getSaveState = function() {
        return {
            active: this.active,
            selectedSlotIndex: this.selectedSlotIndex,
            equippedSlotIndex: this.equippedSlotIndex,
            numberOfSlots: this.numberOfSlots,
            slots: this.slots
        };
    };

    this.loadSaveState = function(saveState) {
        this.active = saveState.active;
        this.selectedSlotIndex = saveState.selectedSlotIndex;
        this.equippedSlotIndex = saveState.equippedSlotIndex;
        this.numberOfSlots = saveState.numberOfSlots;
        this.slots = saveState.slots;
    };

    //Add count no. of item to inventory, filling stacks first, then empty slots
    //Returns leftover item count
    this.add = function(item, count){
        if(count <= 0) return;

        //Check for slots with the same item and fill those first
        for(var i = 0; i < this.numberOfSlots; i++){
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
        for(var i = 0; i < this.numberOfSlots; i++){
            if(count <= 0) break;
            if(this.slots[i].item === items.nothing.type){
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

    this.moveSlotToAnotherInventory= function (fromInventory, fromIndex, toInventory, itemCode = ItemCode.NOTHING) {
        let hasItemBeenMoved = false;

        // If stackable items of the same type are present, add to them.
        for (let i = 0; i < toInventory.numberOfSlots; i++) {
            if (toInventory.slots[i].item == itemCode) {
                toInventory.slots[i].item = fromInventory.slots[fromIndex].item;
                toInventory.slots[i].count += fromInventory.slots[fromIndex].count;
                hasItemBeenMoved = true;
                break;
            }
        }

        // If no stackable items of the same type are present, find an empty slot.
        if (!hasItemBeenMoved) {
            for (let i = 0; i < toInventory.numberOfSlots; i++) {
                if (toInventory.slots[i].item == ItemCode.NOTHING) {
                    toInventory.slots[i].item = fromInventory.slots[fromIndex].item;
                    toInventory.slots[i].count += fromInventory.slots[fromIndex].count;
                    hasItemBeenMoved = true;
                    break;
                }
            }
        }

        // Empty the incoming inventory slot.
        if (hasItemBeenMoved) {
            fromInventory.slots[fromIndex] = new EmptyInventorySlot();
        }

        return fromInventory;
    };

    this.grabSlot = function (isSwappingInventorySlot = false) {         
        if (player.itemsHeldAtMouse.item != this.slots[this.selectedSlotIndex].item) { // if item types don't match
            // swap item at mouse with selected item in the hotbar
            let tempSlot = player.itemsHeldAtMouse;
            let itemTypeInThisSlot = this.slots[this.selectedSlotIndex].item;

            if (isSwappingInventorySlot && interface.inventoryPane.isVisible) {
                if (this == player.hotbar) {
                    let temp = this.moveSlotToAnotherInventory(this, this.selectedSlotIndex, player.inventory, itemTypeInThisSlot);
                    if (temp) {
                        player.hotbar = temp;
                    }
                    // else {
                    //     player.hotbar = this.moveSlotToAnotherInventory(this, this.selectedSlotIndex, player.secondInventory, itemTypeInThisSlot);
                    // }
                }
                else if (this == player.inventory/* || this == player.secondInventory*/) {
                    // if (this == player.inventory) {
                        player.inventory = this.moveSlotToAnotherInventory(this, this.selectedSlotIndex, player.hotbar, itemTypeInThisSlot);
                    // }
                    // else if (this == player.secondInventory) {
                    //     player.secondInventory = this.moveSlotToAnotherInventory(this, this.selectedSlotIndex, player.hotbar, itemTypeInThisSlot);
                    // }
                }
            }

            player.itemsHeldAtMouse = this.slots[this.selectedSlotIndex];
            this.slots[this.selectedSlotIndex] = tempSlot;
        }
        else {
            // TODO account for stack limits
            this.slots[this.selectedSlotIndex].count += player.itemsHeldAtMouse.count;
            player.itemsHeldAtMouse = new EmptyInventorySlot();
        }

        // unequip selected item in hotbar if it is equipped
        if (this.selectedSlotIndex == this.equippedSlotIndex) {
            this.equippedSlotIndex = -1;
            player.outlineTargetTile = false;
        }
    };

    this.altGrabSlot = function() {
        if (player.itemsHeldAtMouse.count <= 0) {
            player.itemsHeldAtMouse.item = this.slots[this.selectedSlotIndex].item;
            player.itemsHeldAtMouse.count = Math.ceil(this.slots[this.selectedSlotIndex].count / 2);
            this.slots[this.selectedSlotIndex].count = Math.floor(this.slots[this.selectedSlotIndex].count / 2);
        }
        else if (player.itemsHeldAtMouse.item != this.slots[this.selectedSlotIndex].item) {
            // swap item at mouse with selected item in the hotbar
            var tempSlot = player.itemsHeldAtMouse;
            player.itemsHeldAtMouse = this.slots[this.selectedSlotIndex];
            this.slots[this.selectedSlotIndex] = tempSlot;
        }
        else {
            // TODO account for stack limits
            this.slots[this.selectedSlotIndex].count += player.itemsHeldAtMouse.count;
            player.itemsHeldAtMouse = new EmptyInventorySlot();

            if (this.slots[this.selectedSlotIndex].count <= 0) {
                this.slots[this.selectedSlotIndex].item = player.itemsHeldAtMouse.item;
            }

            if (player.itemsHeldAtMouse.item === this.slots[this.selectedSlotIndex].item) {
                this.slots[this.selectedSlotIndex].count++;

                player.itemsHeldAtMouse.count--;
                if (player.itemsHeldAtMouse.count === 0) {
                    player.itemsHeldAtMouse = new EmptyInventorySlot();
                }
            }
        }

        // unequip selected item in hotbar if it is equipped
        if (this.selectedSlotIndex == this.equippedSlotIndex) {
            this.equippedSlotIndex = -1;
            player.outlineTargetTile = false;
        }
    };

    // Automatically remove count number of items from inventory if they exist
    this.remove = function(item, count, allowPartialRemoval){
        var itemsToRemove = [];
        var canRemoveItems = false; // Do we have enough items to fill the request?
        // TODO name this better so I don't need a comment

        for (var i = this.numberOfSlots - 1; i >= 0; i--){
            let isItemInSlot = this.slots[i].item == item;
            let isItemEquipped = i == this.equippedSlotIndex;            

            if (isItemInSlot && isItemEquipped) {
                if(count == this.slots[i].count){
                    this.slots[i] = new EmptyInventorySlot();
                    this.equippedSlotIndex = -1;
                    canRemoveItems = true;
                }else if(count < this.slots[i].count){
                    this.slots[i].count -= count;

                    canRemoveItems = true;
                }else{ // Tally item slots smaller than count but do not remove yet
                    itemsToRemove[i] = this.slots[i].count;
                    count -= this.slots[i].count;
                }
            }
        }

        // Remove tallied items only if we have enough to fulfill the request
        if(canRemoveItems && itemsToRemove.length > 0){
            for(var i = 0; i < itemsToRemove.length; i++){
                if(itemsToRemove[i] > 0){
                    this.slots[i] = new EmptyInventorySlot();
                }
            }
        }

        return canRemoveItems;
    };

    this.removeAll = function(item){
        if(!item) return console.error("ERROR: no item provided. This function removes all of a single item, to clear inventory please use the clear() function");

        var count = 0;

        for(var i = 0; i < numberOfSlots; i++){
            if(this.slots[i].item === item){
                count += this.slots[i].count;
                this.slots[i] = new EmptyInventorySlot();
            }
        }

        return count;
    };

    this.clear = function(){
        for(var i = this.numberOfSlots - 1; i >= 0; i--){
            this.slots[i] = new EmptyInventorySlot();
        }
    };

    this.countItems = function(item){
        var count = 0;

        for(var i = 0; i < this.numberOfSlots; i++){
            if(this.slots[i].item == item){
                count += this.slots[i].count;
            }
        }

        return count;
    };

    this.scrollThrough = function (scrollLeftIfTrue = false) {
        var scrollDir = scrollLeftIfTrue ? -1 : 1;
        this.equipSlot(this.equippedSlotIndex + scrollDir);

        if (scrollLeftIfTrue) {
            while (this.equippedSlotIndex >= 0 && this.equippedSlotIndex < this.numberOfSlots && this.slots[this.equippedSlotIndex].count <= 0) {
                this.equippedSlotIndex--;
            }
        }
        else {
            while (this.equippedSlotIndex >= 0 && this.equippedSlotIndex < this.numberOfSlots && this.slots[this.equippedSlotIndex].count <= 0) {
                this.equippedSlotIndex++;
            }
        }
    };

    this.equipSlot = function (whichSlot) {
        this.equippedSlotIndex = whichSlot;

        if (this.equippedSlotIndex < -1) {
            this.equipSlot(this.numberOfSlots - 1);
        }
        else if (this.equippedSlotIndex > this.numberOfSlots) {
            this.equipSlot(0);
        }
    }
}
