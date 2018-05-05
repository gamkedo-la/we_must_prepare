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
    }
    else {
      HTMLLog("auto-save disabled!");
    }
  }
}

if (autoSaveEnabled) {
  HTMLLog("auto-save enabled!");
}
else {
  HTMLLog("auto-save disabled!");
}
