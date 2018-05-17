var autoSaveInterval = null;

var autoSaveEnabled = persistence.getBoolean('autoSaveEnabled', false);
if (autoSaveEnabled) {
  HTMLLog("auto-save enabled!");
  activateAutoSave();
}
else {
  HTMLLog("Press `0` to enable auto-save");
}

function keyPressForSaving(evt) {
  if (evt.keyCode === KEY_0) {
    autoSaveEnabled = !autoSaveEnabled;
    persistence.setBoolean('autoSaveEnabled', autoSaveEnabled);
    if (autoSaveEnabled) {
      HTMLLog("auto-save enabled!");
      activateAutoSave();
    }
    else {
      HTMLLog("auto-save disabled!");
      deactivateAutoSave();
    }
  }
}

function activateAutoSave() {
  autoSaveInterval = setInterval(autoSave, 10 * 1000);
}

function deactivateAutoSave() {
  clearInterval(autoSaveInterval);
}

function autoSave() {
  HTMLLog("saving...");

  var saveState = {
    player: player.getSaveState()
  };
  persistence.setObject('autosave', saveState);

  console.log(JSON.stringify(saveState));
}

function autoLoad() {
  var saveState = persistence.getObject('autosave', null);

  // Never saved, nothing to load
  if (!saveState) {
    return;
  }

  player.loadSaveState(saveState.player);
}
