var autoSaveInterval = null;

var autoSaveEnabled = persistence.getValue('autoSaveEnabled', false);
// TODO: implement getBool/setBool
if (autoSaveEnabled === null) {
  autoSaveEnabled = false;
}

function keyPressForSaving(evt) {
  if (evt.keyCode === KEY_0) {
    autoSaveEnabled = !autoSaveEnabled;
    persistence.setValue('autoSaveEnabled', autoSaveEnabled);
    if (autoSaveEnabled) {
      HTMLLog("auto-save enabled!");
      activateAutoSave();
    }
    else {
      HTMLLog("auto-save disabled!");
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
}

if (autoSaveEnabled) {
  HTMLLog("auto-save enabled!");
  activateAutoSave();
}
else {
  HTMLLog("auto-save disabled!");
}
