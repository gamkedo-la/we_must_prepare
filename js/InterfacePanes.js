// Main Menu Pane
function MainMenuPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY, visible) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = visible;

    this.buttons = [];

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        console.log("isVisible: " + this.isVisible + " isInPane: " + isInPane(this, x, y));

        if (this.isVisible && isInPane(this, x, y)) {
            //checks for *first* button in array that mouse can click
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (button.leftMouseClick(x, y)) {
                    console.log("button name is : " + button.name);
                }
            }
            console.log("main menu is visible and mouse is in this pane");
            return true;
        }
        return false;
    };

    this.draw = function () {
        if (this.isVisible) {
            drawInterfacePaneBackground(this);

            //draw buttons
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                button.draw();
            }
        }
    };

    // this menu needs to be updated every frame 
    this.update = function (x = mouseX, y = mouseY) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.mouseOver(x, y);
        }
    };

    this.push = function (button) {
        this.buttons.push(button);
    };
}

// In-game Menu Pane
function TabMenuPane(inventoryPane, X = 0, Y = 0, tabHeight = 30) {
    this.x = X;
    this.y = Y;
    this.tabHeight = tabHeight;
    this.tabTextPadding = 15;
    this.panes = [];
    this.activePane = null;
    this.activeIndex = -1;

    this.isVisible = false;

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (this.isVisible && isInPane(this.activePane, x, y)) {
            this.activePane.leftMouseClick(x, y);
            return true;
        } else if (this.isVisible) {
            var clickedPane = this.getTabPaneAt(x, y);
            if (clickedPane !== null) {
                this.switchTabName(clickedPane.name);
                uiSelect.play();
                return true;
            } else {
                return false;
            }
        } else {
            return false; //Input was not handled by this
        }
    };

    this.rightMouseClick = function (x = mouseX, y = mouseY) {
        if (interface.inventoryPane.isVisible) {
            return interface.inventoryPane.rightMouseClick(x, y);
        }
        return false;
    };

    this.getTabPaneAt = function (x = mouseX, y = mouseY) {
        var clickedPane = null;
        var tabX = this.x;
        var tabY = this.y; //bottom of tab
        var i;
        for (i = 0; i < this.panes.length; i++) {
            var pane = this.panes[i];
            //draw tab
            str = pane.name;
            var textWidth = canvasContext.measureText(str).width;
            var tabWidth = (this.tabTextPadding * 2) + textWidth;
            //check if inside current tab
            if (x >= tabX && x <= tabX + tabWidth &&
                y >= tabY && y <= tabY + this.tabHeight) {
                clickedPane = pane;
                break;
                //Terminate loop early, no need to check further tabs
            }
            tabX += tabWidth;
        }
        return clickedPane; //returns null if no pane clicked
    };

    this.draw = function () {
        if (this.isVisible) {
            var length = this.panes.length;
            var i;
            var tabX = this.x;
            var tabY = this.y
            var activeTabX = 0;
            var activeTabY = 0;
            var activeTabWidth = 0;
            var activeTabStr = "";
            var str;

            // draw inactive tabs
            for (i = 0; i < length; i++) {
                var pane = this.panes[i];
                //draw tab
                str = pane.name;
                var textWidth = canvasContext.measureText(str).width;
                var tabWidth = (this.tabTextPadding * 2) + textWidth;
                var textColor;
                if (i == this.activeIndex) {
                    //active tab, skip drawing (will draw at end over other elements)
                    activeTabX = tabX;
                    activeTabY = tabY;
                    activeTabWidth = tabWidth;
                    activeTabStr = str;
                } else {
                    //inactive tab
                    canvasContext.fillStyle = tabInterfaceBackgroundDark;
                    canvasContext.fillRect(tabX, tabY, tabWidth, this.tabHeight);
                    textColor = 'LightSlateGray';
                }
                colorText(str, tabX + this.tabTextPadding, tabY + this.tabTextPadding, textColor);
                tabX += tabWidth;
                //draw only panes set as visible
                if (pane.isVisible) {
                    pane.draw();
                }
            }
            // draw active pane
            var pane = this.activePane;
            if (pane.isVisible) {
                pane.draw();
            }
            //draw active tab on top
            canvasContext.fillStyle = backgroundInterfaceColor;
            canvasContext.fillRect(activeTabX, activeTabY, activeTabWidth, this.tabHeight);
            var textColor = 'black';
            colorText(activeTabStr, activeTabX + this.tabTextPadding, activeTabY + this.tabTextPadding, textColor);
        }
    };

    this.push = function (pane, isVisible = false) {
        this.panes.push(pane);
        pane.isVisible = isVisible;
    };

    this.switchTabIndex = function (index) {
        var i;
        var pane = null;
        for (i = 0; i < this.panes.length; i++) {
            pane = this.panes[i];
            if (i == index) {
                this.activePane = pane;
                this.activeIndex = index;
                pane.isVisible = true;
            } else {
                pane.isVisible = false;
            }
        }
    };
    this.switchTabName = function (name) {
        //search panes to find next one that matches name
        var i;
        var pane;
        for (i = 0; i < this.panes.length; i++) {
            pane = this.panes[i];
            if (pane.name == name) {
                this.switchTabIndex(i);
            }
        }
    };
    this.switchTab = function (scrollLeftIfTrue = false, doWrap = true) {
        var i;
        if (scrollLeftIfTrue) {
            i = this.activeIndex - 1;
            if (doWrap) {
                if (i < 0) {
                    i = this.panes.length - 1;
                }
            }
        }
        else {
            i = this.activeIndex + 1;
            if (doWrap) {
                i = Math.abs(i % this.panes.length); //wrap index
            } else if (i >= this.panes.length - 1) {
                i = this.panes.length - 1;
            }
        }
        this.switchTabIndex(i);
    };
}

// In-game Menu Pane: Controls Info Tab
function ControlsInfoPane(name, controlsInfoText, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;

    this.buttons = [];

    this.padding = 20;
    this.columnPadding = 40;
    this.lineHeight = 15;
    this.textColor = 'black';
    this.textLine = controlsInfoText;

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        return false;
    };

    this.draw = function () {
        drawInterfacePaneBackground(this);

        var lines = this.textLine.length;
        var columnWidth = 0;
        var textX = this.x + this.padding;
        var startTextY = this.y + this.padding;
        var textY = startTextY;
        var i;
        for (i = 0; i < lines; i++) {
            // check if at bottom of pane; If so start new column
            if (textY > this.y + this.height - this.padding) {
                textX += columnWidth + this.columnPadding;
                columnWidth = 0;
                textY = startTextY;
            }
            var line = this.textLine[i];
            colorText(line, textX, textY, this.textColor);
            var textWidth = canvasContext.measureText(line).width;
            if (textWidth > columnWidth) {
                columnWidth = textWidth;
            }
            textY += this.lineHeight;
        }
    };

    this.push = function (button) {
        this.buttons.push(button);
    };
}

// In-game Menu Pane: Inventory Tab
function InventoryPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
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

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (player.inventory.selectedSlotIndex >= 0) {
            player.inventory.grabSlot(shiftKeyHeld);
            return true;
        } else if (player.secondInventory.active && player.secondInventory.selectedSlotIndex >= 0) {
            player.secondInventory.grabSlot(shiftKeyHeld);
            return true;
        }
        return false;
    };

    this.rightMouseClick = function (x = mouseX, y = mouseY) {
        if (player.inventory.selectedSlotIndex >= 0) {
            player.inventory.altGrabSlot();
            return true;
        } else if (player.secondInventory.active && player.secondInventory.selectedSlotIndex >= 0) {
            player.secondInventory.altGrabSlot();
            return true;
        }
        return false;
    };

    this.draw = function () {
        drawInterfacePaneBackground(this);

        var itemX, itemY;
        if (player.secondInventory.active) {
            var inventoryX = this.firstInventoryX;
            var inventoryY = this.firstInventoryY;
        } else {
            var inventoryX = this.inventoryX;
            var inventoryY = this.inventoryY;
        }
        player.secondInventory.selectedSlotIndex = -1;
        player.inventory.selectedSlotIndex = -1;

        //draw regular slots
        for (var i = 0; i < player.inventory.numberOfSlots; i++) {
            itemX = inventoryX + this.itemXSpacing * (i % this.itemsPerRow);
            itemY = inventoryY + this.itemYSpacing * Math.floor(i / this.itemsPerRow);

            inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(player.inventory, itemX, itemY, i);
            inventorySlotInterfaceHelper.drawInventorySlotBackground(player.inventory, itemX, itemY, i);
            inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, player.inventory.slots[i]);
        }        

        if (player.secondInventory.active) {
            for (var i = 0; i < player.secondInventory.numberOfSlots; i++) {
                //draw as regular slot
                itemX = this.secondInventoryX + this.secondItemXSpacing * (i % this.itemsPerRow);
                itemY = this.secondInventoryY + this.secondItemYSpacing * Math.floor(i / this.itemsPerRow);

                inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(player.secondInventory, itemX, itemY, i);
                inventorySlotInterfaceHelper.drawInventorySlotBackground(player.secondInventory, itemX, itemY, i);
                inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, player.secondInventory.slots[i]);                
            }
        }

        // draw tooltip for each selected slot in first inventory
        for (var i = 0; i < player.inventory.numberOfSlots; i++) {
            itemX = inventoryX + this.itemXSpacing * (i % this.itemsPerRow);
            itemY = inventoryY + this.itemYSpacing * Math.floor(i / this.itemsPerRow);

            inventorySlotInterfaceHelper.drawToolTips(player.inventory, itemX, itemY, i);
        }

        // draw tooltip for each selected slot in second inventory
        if (player.secondInventory.active) {
            for (var i = 0; i < player.secondInventory.numberOfSlots; i++) {
                //draw as regular slot
                itemX = this.secondInventoryX + this.secondItemXSpacing * (i % this.itemsPerRow);
                itemY = this.secondInventoryY + this.secondItemYSpacing * Math.floor(i / this.itemsPerRow);
                inventorySlotInterfaceHelper.drawToolTips(player.secondInventory, itemX, itemY, i);
            }
        }
    };
}

// In-game Menu Pane: Audio Settings Tab
function AudioPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = bottomRightX - topLeftX;
    this.height = bottomRightY - topLeftY;
    this.name = name;
    this.isVisible = true;

    this.pieces = [mSlider = new AudioSliderInterface('Music Volume', this.x + 20, this.y + 20, this.x + this.width - 20, this.y + 40, musicVolumeManager),
    eSlider = new AudioSliderInterface('Environment Volume', this.x + 20, this.y + 50, this.x + this.width - 20, this.y + 70, enviSFXVolumeManager),
    sfxSlider = new AudioSliderInterface('Sound Effects Volume', this.x + 20, this.y + 80, this.x + this.width - 20, this.y + 100, sFXVolumeManager),
    uiSlider = new AudioSliderInterface('UI Volume', this.x + 20, this.y + 110, this.x + this.width - 20, this.y + 130, interfaceSFXVolumeManager),
    muteToggle = new AudioMuteToggleInterface('Mute Audio', this.x + 20, this.y + 140, this.x + 40, this.y + 160),
    skipButton = new AudioButtonInterface('Skip Track', this.x + this.width / 4, this.y + 140, this.x + this.width / 4 + 60, this.y + 160),
    currentSong = new AudioCurrentTrackInterface('Now playing:', this.x + 20, this.y + 190, this.x + this.width - 20, this.y + 210)];
    skipButton.action = function () {
        inGame_music_master.jump();
    };

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (y >= this.pieces[i].y && y <= this.pieces[i].y + this.pieces[i].height &&
                x >= this.pieces[i].x && x <= this.pieces[i].x + this.pieces[i].width) {
                this.pieces[i].leftMouseClick();
                return true;
            }
        }
        return false;
    }

    this.draw = function () {
        drawInterfacePaneBackground(this);
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].draw();
        }

    }
}

// In-game Hotbar Pane for Quick Equipping and Using Items from the Player Inventory
function HotbarPane() {
    this.hotbarItemX = canvas.width * 0.5 - 115;
    this.hotbarItemXSpacing = 55;
    this.hotbarItemY = canvas.height - 50;

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (player.hotbar.selectedSlotIndex >= 0) {
            player.hotbar.grabSlot(shiftKeyHeld);
            return true;
        }
        return false;
    };

    this.leftMouseDblClick = function (x = mouseX, y = mouseY) {
        if (player.hotbar.selectedSlotIndex >= 0 && player.hotbar.slots[player.hotbar.selectedSlotIndex].count > 0) {
            player.hotbar.equippedSlotIndex = player.hotbar.selectedSlotIndex;
            return true;
        }
        return false;
    };

    this.rightMouseClick = function (x = mouseX, y = mouseY) {
        if (player.hotbar.selectedSlotIndex >= 0) {
            player.hotbar.altGrabSlot();
            return true;
        }
        return false;
    };

    this.draw = function () {
        var itemX, itemY;
        player.hotbar.selectedSlotIndex = -1;

        // draw hotbar
        for (var i = 0; i < player.hotbar.numberOfSlots; i++) {
            itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
            itemY = this.hotbarItemY;
            var keyText = i + 1; // i + 1 to show the correct keybind
            inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(player.hotbar, itemX, itemY, i);

            // Draw equipped slot differently
            if (i === player.hotbar.equippedSlotIndex) {
                if (i === player.hotbar.selectedSlotIndex) {
                    inventorySlotInterfaceHelper.drawInventorySlotBackground(player.hotbar, itemX, itemY, i);
                    colorRect(itemX - 25, itemY - 25, 50, 50, 'green');
                } else {
                    colorRect(itemX - 25, itemY - 25, 50, 50, 'green');
                    canvasContext.fillStyle = 'white';
                }
            } else { // Draw all other slots
                inventorySlotInterfaceHelper.drawInventorySlotBackground(player.hotbar, itemX, itemY, i);
            }

            inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, player.hotbar.slots[i]);
            colorText(keyText, itemX + 17, itemY + 22, 'white'); // 17 and 22 are just values to put keybind text in corner            
        }

        // draw tooltip for each item in hotbar
        for (var i = 0; i < player.hotbar.numberOfSlots; i++) {
            itemX = this.hotbarItemX + this.hotbarItemXSpacing * i;
            itemY = this.hotbarItemY;            
            
            if (i === player.hotbar.selectedSlotIndex) {
                inventorySlotInterfaceHelper.drawToolTips(player.hotbar, itemX, itemY, i);                
            }            
        }
    };
}

// function CreditPane(name, topLeftX, topLeftY, bottomRightX, bottomRightY, visible) {
//    this.x = topLeftX;
//    this.y = topLeftY;
//    this.width = bottomRightX - topLeftX;
//    this.height = bottomRightY - topLeftY;
//    this.name = name;
//    this.isVisible = visible;
//
//    this.leftMouseClick = function (x = mouseX, y = mouseY) {
//        return false;
//    };
//
//    this.draw = function () {
//        drawInterfacePaneBackground(this);
//    };
// }

// Pane Example??
//function Pane(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
//    this.x = topLeftX;
//    this.y = topLeftY;
//    this.width = bottomRightX - topLeftX;
//    this.height = bottomRightY - topLeftY;
//    this.name = name;
//    this.isVisible = true;

//    this.leftMouseClick = function (x = mouseX, y = mouseY) {
//        return false;
//    };

//    this.draw = function () {
//        drawInterfacePaneBackground(this);
//    };
//}
