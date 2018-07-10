const SECONDS_PER_DAY = 24 * 60 * 60; // used in Main.js and Weather.js to determine % of day elapsed
const MS_PER_TIMETICK = 12; // how often the timer ticks in milliseconds
const DAY_SECONDS_PER_TIMETICK = 1; // how many seconds to simulate each tick
const DAY_SECONDS_PER_TIMETICK_IN_FASTFORWARD = 60; // nice and fast for debugging (or sleep?)

// GAME OVER is triggered when we hit the "arrival date"
const DAY_OF_ARRIVAL = 365;
const DATE_DISPLAY_LENGTH_IN_GAME_SECONDS = 240;

function Timer() {
    this.dayNumber = 1; // how many days has the player experienced?
    this.secondsInDay = 0; // how many seconds have elapsed today?
    this.isTimeFrozen = false;
    this.fastForward = false;

    this.getSaveState = function() {
        return {
            dayNumber: this.dayNumber,
            secondsInDay: this.secondsInDay
        };
    }

    this.loadSaveState = function(saveState) {
        this.dayNumber = saveState.dayNumber;
        this.secondsInDay = saveState.secondsInDay;
    }

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
        //this.secondsInDay = SECONDS_PER_DAY; // BUGFIX: start at 88 thousand? 
        this.secondsInDay = 0; // days start at 0 and count up
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

        var timerFont = '8px Arial';
        var dayX = Math.round(canvas.width / 2) - 12;
        var dayY = 11;
        var clockX = Math.round(canvas.width / 2) - 17;
        var clockY = 22;
        // draw a shadow for readability on top of any shade of sky
        colorText('' + hoursInDay + ':' + minutesRemainder + ':' + secondsRemainder, clockX + 1, clockY + 1, 'rgba(0,0,0,1.0)', timerFont);
        // draw the time
        colorText('' + hoursInDay + ':' + minutesRemainder + ':' + secondsRemainder, clockX, clockY, 'rgba(230,255,255,1.0)', timerFont);
        // day number GUI
        colorText('Day ' + timer.dayNumber, dayX, dayY, 'rgba(0,0,0,1.0)', timerFont);

        // announce the day number and countdown at dawn every day
        if (this.secondsInDay < DATE_DISPLAY_LENGTH_IN_GAME_SECONDS) {
            var percent = this.secondsInDay / DATE_DISPLAY_LENGTH_IN_GAME_SECONDS;

            // background rays
            canvasContext.globalAlpha = 1 - percent;
            drawBitmapCenteredAtLocationWithRotation(sunshine, Math.round(canvas.width / 2), Math.round(canvas.height / 2) - 88, performance.now() / 1400);
            drawBitmapCenteredAtLocationWithRotation(sunshine, Math.round(canvas.width / 2), Math.round(canvas.height / 2) - 88, -performance.now() / 1271);
            drawBitmapCenteredAtLocationWithRotation(sunshine, Math.round(canvas.width / 2), Math.round(canvas.height / 2) - 88, performance.now() / 3333);
            canvasContext.globalAlpha = 1;

            colorText('Day ' + timer.dayNumber + ' of ' + DAY_OF_ARRIVAL,
                Math.round(canvas.width / 2) - 172,
                Math.round(canvas.height / 2) - 64,
                'rgba(0,0,0,' + (1 - percent) + ')',
                '64px Arial' // huge
            );


        }

    }

    this.endOfDay = function () {
        console.log("Day number " + this.dayNumber + " has ended!");
        console.log("The humans will arrive in " + (DAY_OF_ARRIVAL - this.dayNumber) + " days.");
        this.dayNumber++;
        this.secondsInDay = 0;

        // check for "game over" cutscene 
        // FIXME do we have a bounds "+/-1" bug here? one too many or one too few days?
        if (this.dayNumber > DAY_OF_ARRIVAL) {
            console.log("GAME OVER: on day " + this.dayNumber + " the humans arrived!");
            alert("GAME OVER! The humans have arrived.");
            // FIXME TODO implement endgame
        }

        weather.newDay(); // tell weather to decide if it will rain today
        butterflies.newDay();
        birds.newDay();

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

        player.playerEnergyLevel = Math.floor(PLAYER_MAX_ENERGY * 0.66);
    }
}
