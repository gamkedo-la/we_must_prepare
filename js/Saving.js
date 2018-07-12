var autoSaveInterval = null;

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
    resourceLookupTable: getResourceLookupTableSaveState(),
    radiation: getRadiationSaveState(),
    roomGrid: getRoomGridSaveState(),
    plantTrackingArray: getPlantsSaveState(),
    weather: weather.getSaveState(),
    player: player.getSaveState(),
    timer: timer.getSaveState()
  };
  return saveState;
}

function hasAutoSaveState() {
  var saveState = persistence.getObject('autosave', null);
  if (saveState) {
    return true;
  }
  else {
    return false;
  }
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

  loadResourceLookupTableSaveState(saveState.resourceLookupTable);  
  loadRadiationSaveState(saveState.radiation);
  loadRoomGridSaveState(saveState.roomGrid);
  loadPlantsSaveState(saveState.plantTrackingArray);
  weather.loadSaveState(saveState.weather);
  player.loadSaveState(saveState.player);
  timer.loadSaveState(saveState.timer);
}
