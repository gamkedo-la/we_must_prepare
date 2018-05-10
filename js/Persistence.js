var persistence = new Persistence();

function Persistence() {
  this.setBoolean = function(key, value) {
    return this.setValue(key, value);
  }

  this.getBoolean = function(key, fallback) {
    var storedValue = this.getValue(key, null);
    if (storedValue === null) {
      if (fallback) {
        return fallback;
      }
      return false;
    }
    return JSON.parse(storedValue);
  }

  this.setObject = function(key, value) {
    var valueToStore = JSON.stringify(value);
    return this.setValue(key, valueToStore);
  }

  this.getObject = function(key, fallback) {
    var storedValue = this.getValue(key, false);
    if (typeof storedValue !== "string") {
      return fallback;
    }
    return JSON.parse(storedValue);
  }

  this.setValue = function(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  this.getValue = function(key, fallback) {
    // Can't use window.localStorage on file:/// on Google Chrome
    try {
      var storedValue = window.localStorage.getItem(key);
      return storedValue;
    }
    catch(e) {
      return fallback;
    }
  }
}
