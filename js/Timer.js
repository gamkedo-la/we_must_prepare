
function TimerClass() {
    this.secondsInDay = 0;
    this.isTimeFrozen = false;
    this.timeTick = function () {
        if (this.isTimeFrozen == false){
            this.secondsInDay++;
        }
    }

    this.setupTimer = function () {
        var t = this;
        setInterval(function() {t.timeTick();}, 12);
    }

    this.pauseTime = function (freezeNow) {
        if (freezeNow === undefined) {
            this.isTimeFrozen = !this.isTimeFrozen;
        } else {
            this.isTimeFrozen = freezeNow;
        }
        console.log("is Time Frozen? " + this.isTimeFrozen);
    }

    this.drawTimer = function () {
        var minutesInDay = Math.floor(this.secondsInDay / 60);
        var hoursInDay = Math.floor(minutesInDay / 60) + 6;
        var secondsRemainder = this.secondsInDay % 60;
        var minutesRemainder = minutesInDay % 60;
        hoursInDay %= 24;
        if (hoursInDay < 10) {
            hoursInDay = '0' + hoursInDay;
        }
        if (minutesRemainder < 10) {
            minutesRemainder = '0' + minutesRemainder;
        }
        if (secondsRemainder < 10) {
            secondsRemainder = '0' + secondsRemainder;
        }

        colorText('' + hoursInDay + ':' + minutesRemainder + ':' + secondsRemainder, canvas.width - 150, 25, 'white');
    }

    this.endOfDay = function () {
        console.log("The day has ended!");
        for (var i = 0; i < plantTrackingArray.length; i++) {
            plantTrackingArray[i].dayChanged();
        }
    }
}