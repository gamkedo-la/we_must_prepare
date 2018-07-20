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
    timer: timer.getSaveState(),
    building: buildingGetSaveState()
  };
  return saveState;
}

function hasSaveState(slot) {
  var saveState = persistence.getObject(slot, null);
  if (saveState) {
    return true;
  }
  else {
    return false;
  }
}

function hasAutoSaveState() {
  return hasSaveState('autosave');
}

function hasManualSaveState(slotIndex) {
  var slotName = 'save_' + slotIndex;
  return hasSaveState(slotName); 
}

function hasAnySaveState() {
  if (hasAutoSaveState()) {
    return true;
  }
  else if (hasManualSaveState(1)) {
    return true;
  }
  else if (hasManualSaveState(2)) {
    return true;
  }
  else if (hasManualSaveState(3)) {
    return true;
  }

  return false;
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
  buildingLoadSaveState(saveState.building);
}
