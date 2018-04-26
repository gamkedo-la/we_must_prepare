var persistence = new Persistence();

function Persistence() {
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

// THIS IS JUST A POC
var storedValue = persistence.getValue('test', 0);
console.log(storedValue);
persistence.setValue('test', 5);
