const SECONDS_PER_DAY = 24 * 60 * 60; // used in Main.js and Weather.js to determine % of day elapsed
const MS_PER_TIMETICK = 12; // how often the timer ticks in milliseconds
const DAY_SECONDS_PER_TIMETICK = 1; // how many seconds to simulate each tick
const DAY_SECONDS_PER_TIMETICK_IN_FASTFORWARD = 60; // nice and fast for debugging (or sleep?)

function TimerClass() {
    this.secondsInDay = 0;
    this.isTimeFrozen = false;
    this.fastForward = false;
    this.timeTick = function () {
        if (this.isTimeFrozen == false) {
            if (!this.fastForward) {
                this.secondsInDay += DAY_SECONDS_PER_TIMETICK;
            }
            else {
                this.secondsInDay += DAY_SECONDS_PER_TIMETICK_IN_FASTFORWARD;
            }
        }
    }

    this.setupTimer = function () {
        var t = this;
        setInterval(function () { t.timeTick(); }, MS_PER_TIMETICK);
    }

    this.resetDay = function () {
        this.secondsInDay = SECONDS_PER_DAY;
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
        if (hoursInDay == 2) {
            this.endOfDay();
        }
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
        this.secondsInDay = 0;

        // make plants grow and absorb water
        for (var i = 0; i < plantTrackingArray.length; i++) {
            plantTrackingArray[i].dayChanged();
        }

        // make soil dry up - must happen after plant logic or seeds may not sprout
        var drycount = 0;
        for (var i = 0; i < roomGrid.length; i++) {
            if (roomGrid[i] == TILE_TILLED_WATERED) {
                drycount++;
                roomGrid[i] = TILE_TILLED;
            }
            if (roomGrid[i] == TILE_TILLED_SEEDS_WATERED) {
                drycount++;
                roomGrid[i] = TILE_TILLED_SEEDS;
            }
        }
        console.log(drycount + " patches of soil dried up.");

    }
}