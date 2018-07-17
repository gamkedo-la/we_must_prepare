// weather system
// made by mcfunkypants for gamkedo

function WeatherSystem() {

    const DEBUG_WEATHER_GUI = true; // weather states for visual debugging

    this.rainDrops = [];
    const RAIN_COUNT = 400;
    const RAIN_SPRITE_SIZE = 32;

    this.clouds = [];
    const CLOUD_COUNT = 6;
    const CLOUD_SPRITE_SIZE = 256;
    const WIND_CLOUD_SPEED_INFLUENCE = 2;

    // very small chance, since this is checked per tile every frame it's raining
    const PER_FRAME_CHANCE_RAIN_WATERS_A_TILE = 0.01; // max value if 100% rainy

    // weather systems can fade in and out and overlap
    this.howSunny = 1;
    this.howCloudy = 0;
    this.howFoggy = 0;
    this.howWindy = {
        magnitude: 0,
        direction: { x: -1, y: 0 }        
    };    
    this.howRainy = 0;

    const PROBABILITY_OF_PRECIPITATION = 0.15; // each morning, we roll the dice to see if it will rain today
    this.canRainToday = true;

    // how many seconds to oscillate in and out (approx: random variance)
    const sunLength = 303;
    const cloudLength = 99;
    const fogLength = 189;
    const windLength = 50;
    const rainLength = 101;

    this.getSaveState = function() {
        var result = {
            // Don't save rainDrops - looks like it's auto-generated
            // Don't save clouds - looks like it's auto-generated
            howSunny: this.howSunny,
            howCloudy: this.howCloudy,
            howFoggy: this.howFoggy,
            howWindy: this.howWindy,
            howRainy: this.howRainy,
            canRainToday: this.canRainToday,
        };
        return result;
    }

    this.loadSaveState = function(saveState) {
        this.howSunny = saveState.howSunny;
        this.howCloudy = saveState.howCloudy;
        this.howFoggy = saveState.howFoggy;
        this.howWindy = saveState.howWindy;
        this.howRainy = saveState.howRainy;
        this.canRainToday = saveState.canRainToday;
    }

    this.debugPrint = function() {
        console.log("howSunny = " + this.howSunny);
        console.log("howCloudy = " + this.howCloudy);
        console.log("howFoggy = " + this.howFoggy);
        console.log("howWindy = " + this.howWindy);
        console.log("howRainy = " + this.howRainy);
        console.log("canRainToday = " + this.canRainToday);
    }

    this.isRaining = function () { // used by wildlife
        return (this.canRainToday && (this.howRainy > 0.1)); // true if rainy
    }

    this.newDay = function () {
        console.log("weather.newDay()");
        this.canRainToday = (Math.random() <= PROBABILITY_OF_PRECIPITATION);
        if (this.canRainToday)
            console.log("It is going to rain today!");
        else
            console.log("It is not going to rain today.");
    }

    // rain occasionally waters tilled soil
    this.handleRainWater = function (howRainy) {
        var wetcount = 0;
        for (var i = 0; i < roomGrid.length; i++) {
            if (Math.random() < PER_FRAME_CHANCE_RAIN_WATERS_A_TILE * howRainy) {
                switch (roomGrid[i]) {
                    case TILE_TILLED:
                        wetcount++;
                        roomGrid[i] = TILE_TILLED_WATERED;
                        break;
                    case TILE_CORN_SEED:
                    case TILE_CORN_SEEDLING:
                    case TILE_CORN_MEDIUM:
                    case TILE_CORN_FULLY_GROWN:
                    case TILE_CORN_RIPE:
                    case TILE_CORN_HARVESTED:
                    case TILE_EGGPLANT_SEED:
                    case TILE_EGGPLANT_SEEDLING:
                    case TILE_EGGPLANT_MEDIUM:
                    case TILE_EGGPLANT_FULLY_GROWN:
                    case TILE_EGGPLANT_RIPE:
                    case TILE_EGGPLANT_HARVESTED:
                    case TILE_POTATO_SEED:
                    case TILE_POTATO_SEEDLING:
                    case TILE_POTATO_MEDIUM:
                    case TILE_POTATO_FULLY_GROWN:
                    case TILE_POTATO_RIPE:
                    case TILE_POTATO_HARVESTED:
                    case TILE_TOMATO_SEED:
                    case TILE_TOMATO_SEEDLING:
                    case TILE_TOMATO_MEDIUM:
                    case TILE_TOMATO_FULLY_GROWN:
                    case TILE_TOMATO_RIPE:
                    case TILE_TOMATO_HARVESTED:
                        wetcount++;
                        for (var p = 0; p < plantTrackingArray.length; p++) {
                            if (plantTrackingArray[p].mapIndex == i) {
                                plantTrackingArray[p].isWatered = true;
                            }
                        }
                        break;
                }
            }
        }
        //if (wetcount) {
        //    console.log(wetcount + " patches of soil got wet from the rain.");
        //}
    };

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        //console.log("weather.draw()");

        updateWeatherVolumes(this.howSunny, this.howCloudy, this.howFoggy, this.howWindy.magnitude, this.howRainy);

        if (cameraOffsetX == undefined) cameraOffsetX = 0;
        if (cameraOffsetY == undefined) cameraOffsetY = 0;

        var spdx = 0;
        var spdy = 0;
        var spawnx = 0;
        var spawny = 0;
        const maxY = canvas.height;
        const maxX = canvas.width;

        // weather and sunrise/sunset depend on game timer
        // note: this means it changes VERY SLOWLY
        // (takes an entire day (16 minutes) to go from 0..1..0

        var dayPercent = timer.secondsInDay / SECONDS_PER_DAY;
        this.howSunny = Math.sin(dayPercent * 5);        
        // oscillate in and out from -1 to 1 at different rates
        this.howCloudy = Math.sin(timer.secondsInDay / cloudLength / 60);
        this.howFoggy = Math.sin(timer.secondsInDay / fogLength / 60);
        this.howWindy.magnitude = Math.sin(timer.secondsInDay / windLength / 60);
        if (timer.secondsInDay % 200 == 0) {
            if (Math.random() > 0.1) {
                let x = Math.floor(Math.random() * 2 - 1);
                let y = Math.floor(Math.random() * 2 - 1);
                this.howWindy.direction.x = x == 0 ? (Math.random() > 0.5 ? -1 : 1) * 1 : x;
                this.howWindy.direction.y = y == 0 ? (Math.random() > 0.5 ? -1 : 1) * 1 : y;
                console.log("Wind direction updated: { x: " + this.howWindy.direction.x + ', y: ' + this.howWindy.direction.y + ' }');
            }
        }
        this.howRainy = Math.cos(timer.secondsInDay / rainLength / 60);

        if (!this.canRainToday) {
            this.howRainy = 0;
        }

        if (this.howSunny > 0) {
            canvasContext.globalAlpha = this.howSunny;
            // sun "ray" rotation animation is in realtime, not affected by game timer
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, performance.now() / 14000);
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, -performance.now() / 12701);
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, performance.now() / 33303);
            canvasContext.globalAlpha = 1;
        } // if sunny


        if (this.howRainy > 0) {

            this.handleRainWater(this.howRainy);

            for (var loop = 0; loop < RAIN_COUNT * this.howRainy; loop++) { // number of drops depends on HOW rainy it is
                if (!this.rainDrops[loop]) //lazy init once only
                    this.rainDrops[loop] = { x: 0, y: 999999, sx: -1, sy: 2 };
                // respawn when past bottom
                if (this.rainDrops[loop].y > maxY - cameraOffsetY) { //canvas.height+RAIN_SPRITE_SIZE) {
                    spdy = 1 + Math.random() * 4;
                    this.rainDrops[loop] = {
                        x: (Math.random() * canvas.width * 2) - cameraOffsetX,
                        y: Math.random() * canvas.height * -1 - RAIN_SPRITE_SIZE + cameraOffsetY,
                        sx: -spdy / 2, sy: spdy
                    };
                    //console.log('cameraOffsetX'+cameraOffsetX);
                }
                // update position
                this.rainDrops[loop].x += this.rainDrops[loop].sx;
                this.rainDrops[loop].y += this.rainDrops[loop].sy;
                // render raindrop
                canvasContext.drawImage(weatherSpritesheet, // see imgLoading.js
                    RAIN_SPRITE_SIZE * (loop % 4), // sx
                    0, // sy
                    RAIN_SPRITE_SIZE, // sw
                    RAIN_SPRITE_SIZE, // sh
                    this.rainDrops[loop].x, // dx
                    this.rainDrops[loop].y, // dy
                    RAIN_SPRITE_SIZE / 3, // dw // 32x32 is too big: scaled down
                    RAIN_SPRITE_SIZE / 3); // dh        
            }
        } // if rainy

        if (this.howCloudy > 0) {
            for (var loop = 0; loop < CLOUD_COUNT; loop++) {

                // cloud speed is a very sloooow circle, like shifting winds, mostly horizontal
                // these rotations are not tied to the game timer, just realtime
                spdx = Math.sin(performance.now() * 0.0001) * 0.75 + (loop * 0.15); // some clouds go a little faster
                spdy = Math.cos(performance.now() * 0.0001) * 0.25 - (loop * 0.15);

                // add some extra cloud speed when it is windy!
                spdx += this.howWindy.magnitude * WIND_CLOUD_SPEED_INFLUENCE;
                spdy += this.howWindy.magnitude * WIND_CLOUD_SPEED_INFLUENCE;

                if (!this.clouds[loop]) { //lazy init once only
                    // start somewhere onscreen:
                    this.clouds[loop] = { x: Math.random() * canvas.width - CLOUD_SPRITE_SIZE, y: Math.random() * canvas.height - CLOUD_SPRITE_SIZE, sx: spdx, sy: spdy };
                    // start offscreen and force a respawn immed:
                    //clouds[loop] = { x: 0, y: 999999, sx: -1, sy: 2 }; 
                }

                // respawn when past any edge
                if ((this.clouds[loop].y > maxY - cameraOffsetY + CLOUD_SPRITE_SIZE * 4) || // past bottom
                    (this.clouds[loop].y < 0 - cameraOffsetY - CLOUD_SPRITE_SIZE * 4) || // past top
                    (this.clouds[loop].x > maxX - cameraOffsetX + CLOUD_SPRITE_SIZE * 4) || // right
                    (this.clouds[loop].x < 0 - cameraOffsetX - CLOUD_SPRITE_SIZE * 4)) {

                    var randy = Math.random();

                    // clouds always come from the right (to match rain angle)
                    spawnx = canvas.width + (CLOUD_SPRITE_SIZE) + cameraOffsetX;
                    spawny = Math.random() * canvas.height + cameraOffsetY - CLOUD_SPRITE_SIZE;

                    spawnx = Math.round(spawnx);
                    spawny = Math.round(spawny);

                    //console.log("cloud " + loop + " respawning to " + spawnx + "," + spawny);
                    this.clouds[loop] = {
                        x: spawnx, y: spawny,
                        sx: spdx, sy: spdy
                        //sx: Math.random() - 0.5, sy: Math.random() - 0.5 // random speeds mean each cloud has its own wind speed?!
                    };

                }

                // cloud speed changes en masses in realtime, not according to spawn values
                this.clouds[loop].x += -Math.abs(spdx) - camDeltaX; //clouds[loop].sx; // only in one direction: left
                this.clouds[loop].y += spdy - camDeltaY; //clouds[loop].sy;

                //if (loop == 1) console.log("cloud " + loop + " pos " + clouds[loop].x + "," + clouds[loop].y);

                canvasContext.globalAlpha = this.howCloudy;
                canvasContext.drawImage(cloudSpritesheet, // see imgLoading.js
                    CLOUD_SPRITE_SIZE * (loop % 4), // sx
                    0, // sy
                    CLOUD_SPRITE_SIZE, // sw
                    CLOUD_SPRITE_SIZE, // sh
                    this.clouds[loop].x, // dx
                    this.clouds[loop].y, // dy
                    CLOUD_SPRITE_SIZE * 3, // dw // make em huge
                    CLOUD_SPRITE_SIZE * 3); // dh        
                canvasContext.globalAlpha = 1;
            }
        } // if cloudy

        if (DEBUG_WEATHER_GUI) {

            /*
            console.log(
                'howSunny:' + howSunny.toFixed(1) +
                ' howCloudy:' + howCloudy.toFixed(1) +
                ' howFoggy:' + howFoggy.toFixed(1) +
                ' howWindy:' + howWindy.magnitude.toFixed(1) +
                ' howRainy:' + howRainy.toFixed(1)
            );
            */


            // old text and bars
            //colorText('sun', barX - 26, barY + 5, 'white');
            //colorText('cloud', barX - 26, barY + 5 + 8, 'white');
            //colorText('fog', barX - 26, barY + 5 + 16, 'white');
            //colorText('wind', barX - 26, barY + 5 + 24, 'white');
            //colorText('rain', barX - 26, barY + 5 + 32, 'white');
            //colorRect(barX, barY, Math.max(barW * howSunny, 0), barH, "yellow");
            //colorRect(barX, barY + 8, Math.max(barW * howCloudy, 1), barH, "#777799");
            //colorRect(barX, barY + 16, Math.max(barW * howFoggy, 1), barH, "#333333");
            //colorRect(barX, barY + 24, Math.max(barW * howWindy.magnitude, 1), barH, "#ccbbaa");
            //colorRect(barX, barY + 32, Math.max(barW * howRainy, 1), barH, "blue");

            var barW = 44;
            var barH = 12;
            var barX = Math.round(canvas.width / 2);
            var barY = 21;

            colorRect(barX - 86, barY, barW, barH, "rgba(255,255,0,0.25)");
            colorRect(barX - 86, barY, Math.max(barW * this.howSunny, 0), barH, "rgba(255,255,0,1.0)");

            colorRect(barX + 42, barY, barW, barH, "rgba(180,180,255,0.25)");
            colorRect(barX + 42, barY, Math.max(barW * this.howCloudy, 1), barH, "rgba(180,180,255,1.0)");

            colorRect(barX - 86, barY + 25, barW, barH, "rgba(80,180,255,0.25)");
            colorRect(barX - 86, barY + 25, Math.max(barW * this.howWindy.magnitude, 1), barH, "rgba(80,180,255,1.0)");

            colorRect(barX + 42, barY + 25, barW, barH, "rgba(0,0,255,0.25)");
            colorRect(barX + 42, barY + 25, Math.max(barW * this.howRainy, 1), barH, "rgba(0,0,255,1.0)");

            // sky circle (shows sun/moon state)
            drawBitmapCenteredAtLocationWithRotation(skyCircle,
                Math.round(canvas.width / 2),
                Math.round(skyCircle.height / 2),
                2 * Math.PI * dayPercent - (0.5 * Math.PI)); // is this math right? FIXME

            // weather gui (overlay)
            canvasContext.drawImage(weatherGUI, // see imgLoading.js
                Math.round(canvas.width / 2 - weatherGUI.width / 2), 0);

            // Note: item quantities are drawn in Player.drawPlayerHUD()

        }

    }; // weather.draw()

} // weather system class
