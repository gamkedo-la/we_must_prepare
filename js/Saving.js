var autoSaveInterval = null;

var autoSaveEnabled = persistence.getBoolean('autoSaveEnabled', false);
// if (autoSaveEnabled) {
//   HTMLLog("auto-save enabled!");
//   activateAutoSave();
// }
// else {
//   HTMLLog("Press `0` to enable auto-save");
// }

function keyPressForSaving() {
    // autoSaveEnabled = !autoSaveEnabled;
    // persistence.setBoolean('autoSaveEnabled', autoSaveEnabled);
    // if (autoSaveEnabled) {
    //   HTMLLog("auto-save enabled!");
    //   activateAutoSave();
    // }
    // else {
    //   HTMLLog("auto-save disabled!");
    //   deactivateAutoSave();
    // }
}

function activateAutoSave() {
  autoSaveInterval = setInterval(autoSave, 10 * 1000);
}

function deactivateAutoSave() {
  clearInterval(autoSaveInterval);
}

function autoSave() {
  console.log("auto-saving...");

  var saveState = getSaveState();
  persistence.setObject('autosave', saveState);

  // console.log(JSON.stringify(saveState));
}

function save(slotIndex) {
  var slotName = 'save_' + slotIndex;
  console.log('saving to ' + slotName);
  var saveState = getSaveState();
  persistence.setObject(slotName, saveState);
  uiSelect.play();
}

function getSaveState() {
  var saveState = {
    player: player.getSaveState(),
    resourceLookupTable: getResourceLookupTableSaveState()
  };
  return saveState;
}

function autoLoad() {
  var slotName = 'autosave';
  console.log('loading from ' + slotName);
  var saveState = persistence.getObject(slotName, null);
  loadSaveState(saveState);
}

function load(slotIndex) {
  var slotName = 'save_' + slotIndex;
  console.log('loading from ' + slotName);
  var saveState = persistence.getObject(slotName, null);
  loadSaveState(saveState);
  uiSelect.play();
}

function loadSaveState(saveState) {
  // Never saved, nothing to load
  if (!saveState) {
    return;
  }

  player.loadSaveState(saveState.player);
  loadResourceLookupTableSaveState(saveState.resourceLookupTable);
}
