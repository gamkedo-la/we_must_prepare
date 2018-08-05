// Main Menu Pane
function MainMenuPane(name, topLeftX, topLeftY, width, height, visible) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = visible;

    this.buttons = [];

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        // console.log("isVisible: " + this.isVisible + " isInPane: " + isInPane(this, x, y));

        if (this.isVisible && isInPane(this, x, y)) {
            //checks for *first* button in array that mouse can click
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (button.leftMouseClick(x, y)) {
                    console.log("button name is : " + button.name);
                }
            }
            // console.log("main menu is visible and mouse is in this pane");
            return true;
        }
        return false;
    };

    this.draw = function () {
        if (this.isVisible) {
            drawInterfacePaneBackground(this, '#D2B48C');
            canvasContext.drawImage(mainLogo, canvas.width / 2 - mainLogo.width / 2, canvas.height / 2 - mainLogo.height);
            //draw buttons
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                draw(button);
            }

            this.loadGamePane && draw(this.loadGamePane);
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

function CreditPane(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = false;

    this.buttons = [];

    this.padding = 20;
    this.columnPadding = 40;
    this.lineHeight = 15;
    this.textColor = 'black';

    this.textLine = ['Jeremy Kenyon: Project lead, concept, core gameplay code, initial HUD and resource pickup, ' +
    'camera movement, tree chopping, recharge station functoinality, time of day implementation, programmatic harvest ' +
    'animation, player energy limitation, plant harvesting, silo progress bar and goal display',
        'Randy Tan Shaoxian: Crops blowing in wind effect, tooltip improvements, wind mechanics that affect plants, ' +
        'gather limits, inventory hotkeys, hoe functionality, mouseover sound, context sensitive click handling, energy ' +
        'bar dynamic coloration, extensive refactoring and general code readability improvements, assorted bug fixes',
        'Michael "Misha" Fewkes: Custom sound system code,  music integration, environmental and weather sounds, mute ' +
        'functionality, effect volume mixing, time of day and movement fixes, UI sounds, ',
        'Christer "McFunkypants" Kaitila: Weather simulation system code and related art, soil drying, bird and ' +
        'butterly animations and environmental awareness AI, GUI clock improvements, ' +
        'interaction highlight, GUI polish, text wrap and font integration, showing selected item in player hands, ' +
        'liquid layout, particle system system and related effects art, mouse bug fixes',
        'Dan Dela Rosa: persistent data storage save and load of all gameplay data',
        'Harrison Leadlay: Main menu, in-game UI (pane, button, and tab code), cliff tiles, original help text',
        'Charlene A.:  planting, art (wood, twig, multiple flowers, water tiles, lily, corn, potato, eggplant, ' +
        'tomato, apple tree, chili, wheat, )',
        'Terrence McDonnell: farm and related tile integration, object depth sorting, land tilling, implemented ' +
        'plant requirements, back hoe, watered plant persistence, mineral art improvements',
        'Nicholas Polchies:  Main inventory code, animation support, hotbar improvements, mouse code, ' +
        'movement fixes, input refactoring',
        'Jaime Rivas:  Walking code, audio for walking, idle, watering, resource gathering and depositing',
        'Brandon Trumpold: Resource limits and removal when depleted, hotkeys for hotbar menu, ambient song, time reset,' +
        ' code clean up', 'Simon J Hoffiz: Level layout design, farm fence code and art, radiation mechanic prototype (' +
        'unused)',
        'Rémy Lapointe: Rock art, art for several trees (large, dead, surviving)',
        'Klaim (A. Joël Lamotte): 3 songs (Bright Future, good and bad endings), GUI polish, liquid layout, mouse bug fixes',
        'H Trayford: 3 plant sprites, movement and gathering interaction improvements',
        'Vignesh Ramesh: Peace song, player character sprite',
        'Dana Alcala: Tilled and watered soil art, dirt ground art, rock transparency fix',
        'Kyle Thomas: Barn art', 'Kise: Morning song, main menu logo, grass ground tile art',
        'Stebs: Farmhouse art and menu song'];


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

        // draw buttons
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            draw(button);
        }
    };

    this.push = function (button) {
        this.buttons.push(button);
    };
}

function LoadGamePane(parentPane, topLeftX, topLeftY, width, height, visible) {
    this.parentPane = parentPane;
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.isVisible = visible;

    this.buttons = [];
    this.push = function (button) {
        this.buttons.push(button);
    };

    this.generateButtons = function () {

        var topY = (canvas.height * 0.5) - 70;
        var gapY = 10;
        var buttonHeight = 40;
        var buttonSkip = gapY + buttonHeight;
        var buttonNum = 0;

        //////////////
        // To be short: interface position and width determination is decided by this set of functions.
        // Technique used here: we calculate the positions and sizes
        // relative to several other variables, so we store the way we are calculating these
        // in functions instead of values, then call them to update the positions and sizes. - Klaim
        LOAD_MENU_TOP_X = function(){ return (canvas.width * 0.5) - 50; };
        LOAD_MENU_BUTTON_LEFT = function(){ return (canvas.width * 0.5) - 50; };
        LOAD_MENU_BUTTON_TOP = function(buttonNum){ return topY + buttonSkip * buttonNum; };
        LOAD_MENU_BUTTON_WIDTH = function(){ return 100; };
        LOAD_MENU_BUTTON_HEIGHT = function(buttonNum){ return buttonHeight; };

        LOAD_MENU_BUTTON_POSITION_UPDATER = function(buttonNum){ // Generate position/size updater for menu buttons.
            return RectangleUpdater( obj => LOAD_MENU_BUTTON_LEFT()         // how x is determined
                                , obj => LOAD_MENU_BUTTON_TOP(buttonNum) // how y is determined
                                , obj => LOAD_MENU_BUTTON_WIDTH()        // how width is determined
                                , obj => LOAD_MENU_BUTTON_HEIGHT()       // how height is determined
                                );
        };
        //////////////

        var backButton = Flow( new Button(this, "Back"), LOAD_MENU_BUTTON_POSITION_UPDATER(buttonNum));
        backButton.action = function () {
            interface.loadGameMenu.isVisible = false;
            interface.mainMenu.isVisible = true;
        };
        buttonNum++;

        if (hasAutoSaveState()) {
            var autoLoadButton = Flow( new Button(this, "Load Auto-Save"), LOAD_MENU_BUTTON_POSITION_UPDATER(buttonNum));
            autoLoadButton.action = function () {

                // This is different for each slot
                autoLoad();

                this.parentInterface.startTheGame();
            };
        }
        buttonNum++;

        if (hasManualSaveState(1)) {
            var loadButton = Flow( new Button(this, "Load Slot 1"), LOAD_MENU_BUTTON_POSITION_UPDATER(buttonNum));
            loadButton.action = function () {
                // This is different for each slot
                load(1);

                this.parentInterface.startTheGame();
            };
        }
        buttonNum++;

        if (hasManualSaveState(2)) {
            var loadButton = Flow( new Button(this, "Load Slot 2"), LOAD_MENU_BUTTON_POSITION_UPDATER(buttonNum));
            loadButton.action = function () {
                // This is different for each slot
                load(2);

                this.parentInterface.startTheGame();
            };
        }
        buttonNum++;

        if (hasManualSaveState(3)) {
            var loadButton = Flow( new Button(this, "Load Slot 3"), LOAD_MENU_BUTTON_POSITION_UPDATER(buttonNum));
            loadButton.action = function () {
                // This is different for each slot
                load(3);

                this.parentInterface.startTheGame();
            };
        }
        buttonNum++;
    };
    this.generateButtons();

    this.startTheGame = function () {
        interface.loadGameMenu.isVisible = false;
        // HACK: Not sure why the main menu is shown here
        interface.mainMenu.isVisible = false;

        audioEventManager.addFadeEvent(menu_music_track, 0.5, 0);
        inGame_music_master.play();
        musicPastMainMenu = true;

        // Don't enable auto-save until you exit the menu
        activateAutoSave();

        // interface.allowPlayerToSave();
    };

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        // console.log("isVisible: " + this.isVisible + " isInPane: " + isInPane(this, x, y));

        if (this.isVisible && isInPane(this, x, y)) {
            //checks for *first* button in array that mouse can click
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (button.leftMouseClick(x, y)) {
                    console.log("button name is : " + button.name);
                }
            }
            console.log("load game menu is visible and mouse is in this pane");
            return true;
        }
        return false;
    };

    this.draw = function () {
        if (this.isVisible) {
            drawInterfacePaneBackground(this);

            // draw buttons
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                draw(button);
            }
        }
    };

    this.update = function (x = mouseX, y = mouseY) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.mouseOver(x, y);
        }
    };
}

function SaveGamePane(parentPane, topLeftX, topLeftY, width, height, visible) {
    this.parentPane = parentPane;
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.isVisible = visible;

    this.buttons = [];
    this.push = function (button) {
        this.buttons.push(button);
    };

    this.generateButtons = function () {
        var topY = (canvas.height * 0.5) - 70;
        var gapY = 10;
        var buttonHeight = 40;
        var buttonSkip = gapY + buttonHeight;
        var buttonNum = 0;

        var backButton = new Button(this, "Back", (canvas.width * 0.5) - 50, topY + buttonSkip * buttonNum, (canvas.width * 0.5) + 50, topY + buttonSkip * buttonNum + buttonHeight);
        backButton.action = function () {
            interface.saveGameMenu.isVisible = false;
            interface.mainMenu.isVisible = true;
        };
        buttonNum++;

        var saveButton1 = new Button(this, "Save Slot 1", (canvas.width * 0.5) - 50, topY + buttonSkip * buttonNum, (canvas.width * 0.5) + 50, topY + buttonSkip * buttonNum + buttonHeight);
        saveButton1.action = function () {
            // This is different for each slot
            save(1);
        };
        buttonNum++;

        var saveButton2 = new Button(this, "Save Slot 2", (canvas.width * 0.5) - 50, topY + buttonSkip * buttonNum, (canvas.width * 0.5) + 50, topY + buttonSkip * buttonNum + buttonHeight);
        saveButton2.action = function () {
            // This is different for each slot
            save(2);
        };
        buttonNum++;

        var saveButton3 = new Button(this, "Save Slot 3", (canvas.width * 0.5) - 50, topY + buttonSkip * buttonNum, (canvas.width * 0.5) + 50, topY + buttonSkip * buttonNum + buttonHeight);
        saveButton3.action = function () {
            // This is different for each slot
            save(3);
        };
        buttonNum++;
    };
    // this.generateButtons();

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        // console.log("isVisible: " + this.isVisible + " isInPane: " + isInPane(this, x, y));

        if (this.isVisible && isInPane(this, x, y)) {
            //checks for *first* button in array that mouse can click
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (button.leftMouseClick(x, y)) {
                    console.log("button name is : " + button.name);
                }
            }
            console.log("save game menu is visible and mouse is in this pane");
            return true;
        }
        return false;
    };

    this.draw = function () {
        if (this.isVisible) {
            drawInterfacePaneBackground(this);

            // draw buttons
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                draw(button);
            }
        }
    };

    this.update = function (x = mouseX, y = mouseY) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.mouseOver(x, y);
        }
    };
}

// In-game Menu Pane
function TabMenuPane(inventoryPane, tabHeight = 30, X = 0, Y = 0) {
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
                    draw(pane);
                }
            }
            // draw active pane
            var pane = this.activePane;
            if (pane.isVisible) {
                draw(pane);
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

    this.setVisible = function (isVisible = false, defaultPane = 2) {
        this.isVisible = isVisible;
        for (let i = 0; i < this.panes.length; i++) {
            if (this.panes[i].isVisible != null) {
                this.panes[i].isVisible = isVisible;
                this.switchTabIndex(defaultPane);
            }
        }
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
    this.isVisible = false;

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
function InventoryPane(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = false;

    this.currentX = function () {
        return this.x;
    };
    //formatting variables

    // old hardcoded values now default to overlap tab menu window
    this.inventoryX = () => 150;
    this.itemXSpacing = () => 55;
    this.inventoryY = () => 188;
    this.itemYSpacing = () => 55;
    this.itemsPerRow = () => 10;
    this.firstInventoryX = () => 150;
    this.firstInventoryY = () => 562;
    this.secondInventoryX = () => 150;
    this.secondItemXSpacing = () => 55;
    this.secondInventoryY = () => 387;
    this.secondItemYSpacing = () => 55;

    if (LIQUID_LAYOUT_FULLSCREEN) {
        this.inventoryX = () => this.x + this.itemXSpacing();
        this.inventoryY = () => this.y + this.itemYSpacing();
        this.firstInventoryX = this.inventoryX;
        this.firstInventoryY = () => this.inventoryY() + (this.height / 2);
        this.secondInventoryX = this.inventoryX;
        this.secondInventoryY = () => this.inventoryY();

        this.itemsPerRow = function () { return Math.ceil(this.width / 70); };
    }


    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (player.inventory.selectedSlotIndex >= 0) {
            player.inventory.grabSlot(shiftKeyHeld);
            return true;
        } else if (buildingStorage.active && buildingStorage.selectedSlotIndex >= 0) {
            buildingStorage.grabSlot(shiftKeyHeld);
            return true;
        }
        return false;
    };

    this.rightMouseClick = function (x = mouseX, y = mouseY) {
        if (player.inventory.selectedSlotIndex >= 0) {
            player.inventory.altGrabSlot();
            return true;
        } else if (buildingStorage.active && buildingStorage.selectedSlotIndex >= 0) {
            buildingStorage.altGrabSlot();
            return true;
        }
        return false;
    };

    this.draw = function () {
        drawInterfacePaneBackground(this);

        var itemX, itemY;
        if (buildingStorage.active) {
            var inventoryX = this.firstInventoryX;
            var inventoryY = this.firstInventoryY;
        } else {
            var inventoryX = this.inventoryX;
            var inventoryY = this.inventoryY;
        }
        buildingStorage.selectedSlotIndex = -1;
        player.inventory.selectedSlotIndex = -1;

        //draw regular slots
        for (var i = 0; i < player.inventory.numberOfSlots; i++) {
            itemX = inventoryX() + this.itemXSpacing() * (i % this.itemsPerRow());
            itemY = inventoryY() + this.itemYSpacing() * Math.floor(i / this.itemsPerRow());

            inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(player.inventory, itemX, itemY, i);
            inventorySlotInterfaceHelper.drawInventorySlotBackground(player.inventory, itemX, itemY, i);
            inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, player.inventory.slots[i]);

            if (i == 0 && buildingStorage.active) { // label only when it may be confusing
                colorText("Player Inventory: (click to move items to the silo above)", itemX - 25, itemY - 30, 'black');
            }

        }

        if (buildingStorage.active) {
            for (var i = 0; i < buildingStorage.numberOfSlots; i++) {
                //draw as regular slot
                itemX = this.secondInventoryX() + this.secondItemXSpacing() * (i % this.itemsPerRow());
                itemY = this.secondInventoryY() + this.secondItemYSpacing() * Math.floor(i / this.itemsPerRow());

                inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(buildingStorage, itemX, itemY, i);
                inventorySlotInterfaceHelper.drawInventorySlotBackground(buildingStorage, itemX, itemY, i);
                inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, buildingStorage.slots[i]);

                if (i == 0) { // label
                    colorText("Silo Storage: (the objective tab lists what needs to go here)", itemX - 25, itemY - 30, 'black');
                }
            }
        }

        // draw tooltip for each selected slot in first inventory
        for (var i = 0; i < player.inventory.numberOfSlots; i++) {
            itemX = this.inventoryX() + this.itemXSpacing() * (i % this.itemsPerRow());
            itemY = this.inventoryY() + this.itemYSpacing() * Math.floor(i / this.itemsPerRow());

            inventorySlotInterfaceHelper.drawToolTips(player.inventory, itemX, itemY, i);
        }

        // draw tooltip for each selected slot in second inventory
        if (buildingStorage.active) {
            for (var i = 0; i < buildingStorage.numberOfSlots; i++) {
                //draw as regular slot
                itemX = this.secondInventoryX() + this.secondItemXSpacing() * (i % this.itemsPerRow());
                itemY = this.secondInventoryY() + this.secondItemYSpacing() * Math.floor(i / this.itemsPerRow());
                inventorySlotInterfaceHelper.drawToolTips(buildingStorage, itemX, itemY, i);
            }
        }
    };
}

// In-game Menu Pane: Audio Settings Tab
function AudioPane(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = false;

    const padding = 4;
    this.PIECES_X = (piece) => this.x + 20;
    this.PIECES_Y = (piece, idx) => this.y + 20 + (idx * (this.PIECES_HEIGHT(piece)+ padding));
    this.PIECES_WIDTH = (piece) => this.width - 30;
    this.PIECES_HEIGHT = (piece) => 40;
    this.PIECES_POSITION_UPDATER = (pieceIdx) => new RectangleUpdater(this.PIECES_X
        , (piece) => this.PIECES_Y(piece, pieceIdx)
        , this.PIECES_WIDTH
        , this.PIECES_HEIGHT
    );

    this.pieces = [mSlider = Flow(new AudioSliderInterface('Music Volume', musicVolumeManager), this.PIECES_POSITION_UPDATER(0)),
    eSlider = Flow(new AudioSliderInterface('Environment Volume', enviSFXVolumeManager), this.PIECES_POSITION_UPDATER(1)),
    sfxSlider = Flow(new AudioSliderInterface('Sound Effects Volume', sFXVolumeManager), this.PIECES_POSITION_UPDATER(2)),
    uiSlider = Flow(new AudioSliderInterface('UI Volume', interfaceSFXVolumeManager), this.PIECES_POSITION_UPDATER(3)),
    muteToggle = Flow(new AudioMuteToggleInterface('Mute Audio'), this.PIECES_POSITION_UPDATER(4)),
    skipButton = Flow(new AudioButtonInterface('Skip Track'), this.PIECES_POSITION_UPDATER(5)),
    currentSong = Flow(new AudioCurrentTrackInterface('Now playing:'), this.PIECES_POSITION_UPDATER(6))];
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
            draw(this.pieces[i]);
        }

    }
}

// In-game Hotbar Pane for Quick Equipping and Using Items from the Player Inventory
function HotbarPane() {
    this.hotbarItemX = HOTBAR_X();
    this.hotbarItemY = HOTBAR_Y();
    this.hotbarItemXSpacing = 55;

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        if (player.hotbar.selectedSlotIndex >= 0) {
            mouseClickToMoveRelease();

            if (interface.inventoryPane.isVisible && interface.tabMenu.isVisible) {
                player.hotbar.grabSlot(shiftKeyHeld);
            }
            else if (player.hotbar.slots[player.hotbar.selectedSlotIndex].count > 0) {
                player.hotbar.equippedSlotIndex = player.hotbar.selectedSlotIndex;
            }

            return true;
        }
        return false;
    };

    this.rightMouseClick = function (x = mouseX, y = mouseY) {
        if (player.hotbar.selectedSlotIndex >= 0 && interface.inventoryPane.isVisible && interface.tabMenu.isVisible) {
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
            var hotkeyText = i + 1; // i + 1 to show the correct keybind
            inventorySlotInterfaceHelper.mouseHoverInventorySlotToSelect(player.hotbar, itemX, itemY, i);

            // Draw equipped slot differently
            if (i === player.hotbar.equippedSlotIndex) {
                inventorySlotInterfaceHelper.drawInventorySlotBackground(player.hotbar, itemX, itemY, i);

                if (i === player.hotbar.selectedSlotIndex) {
                    coloredOutlineRectCornerToCorner(itemX - 25, itemY - 25, itemX - 25 + 50, itemY - 25 + 50, 'orange', 4);
                } else {
                    coloredOutlineRectCornerToCorner(itemX - 25, itemY - 25, itemX - 25 + 50, itemY - 25 + 50, 'orange', 4);
                    canvasContext.fillStyle = 'white';
                }

            } else { // Draw all other slots
                inventorySlotInterfaceHelper.drawInventorySlotBackground(player.hotbar, itemX, itemY, i);
            }

            inventorySlotInterfaceHelper.drawInventorySlot(itemX, itemY, player.hotbar.slots[i]);

            let hotkeyColor = hotkeyText == player.hotbar.equippedSlotIndex + 1 ? 'orange' : 'white';
            colorText(hotkeyText, itemX, itemY - 30, hotkeyColor); // 17 and 22 are just values to put keybind text in corner
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

function WinningPane(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = false;

    this.buttons = [];

    this.padding = 20;
    this.columnPadding = 40;
    this.lineHeight = 15;
    this.textColor = 'black';

    this.textLine = getWinConditions(); // this now can change during gameplay


    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        return false;
    };

    this.draw = function () {
        drawInterfacePaneBackground(this);

        this.textLine = getWinConditions();

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


function GameManagementPane(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = false;

    this.buttons = [];

    this.leftMouseClick = function (x = mouseX, y = mouseY) {
        return false;
    };

    this.draw = function () {
        drawInterfacePaneBackground(this);

        // draw buttons
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            draw(button);
        }
    };

    this.push = function (button) {
        this.buttons.push(button);
    };
}

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
