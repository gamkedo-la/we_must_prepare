
function resourceClass(max, carried) {
    this.max = max;
    this.carried = carried;

    this.changeResource = function(delta, oncePerClick) {
        if (oncePerClick) {
            if (wasClickUsed) {
                return;
            } else {
                wasClickUsed = true;
            }
        }
        var newCarried = this.carried + delta;
        if (newCarried < 0) {
            console.log("tried to go negative");
            this.carried = 0;
        } else if (newCarried > this.max) {
            console.log("tried to go past max");
            this.carried = this.max;
        } else {
            this.carried = newCarried;
        }
    }

    this.makeEmpty = function() {
        this.carried = 0;
    }
}

function depositResources(fromContainer, toContainer) {
    if (fromContainer.carried + toContainer.carried <= toContainer.max) {
        toContainer.carried += fromContainer.carried;
        fromContainer.makeEmpty();
    } else {
        fromContainer.carried = fromContainer.carried + toContainer.carried - toContainer.max;
        toContainer.carried = toContainer.max;
    }
}