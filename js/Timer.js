const SECONDS_PER_DAY = 24 * 60 * 60; // used in Main.js and Weather.js to determine % of day elapsed
const MS_PER_TIMETICK = 12; // how often the timer ticks in milliseconds
const DAY_SECONDS_PER_TIMETICK = 1; // how many seconds to simulate each tick
const DAY_SECONDS_PER_TIMETICK_IN_FASTFORWARD = 60; // nice and fast for debugging (or sleep?)

function TimerClass() {
    this.dayNumber = 1; // how many days has the player experienced?
    this.secondsInDay = 0; // how many seconds have elapsed today?
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

        // draw a shadow for readability on top of any shade of sky
        colorText('' + hoursInDay + ':' + minutesRemainder + ':' + secondsRemainder, Math.round(canvas.width / 2) - 20 + 1, 22 + 1, 'rgba(0,0,0,1.0)');
        // draw the time
        colorText('' + hoursInDay + ':' + minutesRemainder + ':' + secondsRemainder, Math.round(canvas.width / 2) - 20, 22, 'rgba(230,255,255,1.0)');

    }

    this.endOfDay = function () {
        console.log("Day number " + this.dayNumber + " has ended!");
        this.dayNumber++;
        this.secondsInDay = 0;

        weather.newDay(); // tell weather to decide if it will rain today

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