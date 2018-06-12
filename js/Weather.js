// weather system
// made by mcfunkypants for gamkedo

function WeatherSystem() {

    const DEBUG_WEATHER_GUI = true; // weather states for visual debugging

    var rainDrops = [];
    const RAIN_COUNT = 400;
    const RAIN_SPRITE_SIZE = 32;

    var clouds = [];
    const CLOUD_COUNT = 6;
    const CLOUD_SPRITE_SIZE = 256;
    const WIND_CLOUD_SPEED_INFLUENCE = 2;

    // very small chance, since this is checked per tile every frame it's raining
    const PER_FRAME_CHANCE_RAIN_WATERS_A_TILE = 0.01; // max value if 100% rainy

    // weather systems can fade in and out and overlap
    var howSunny = 1;
    var howCloudy = 0;
    var howFoggy = 0;
    var howWindy = 0;
    var howRainy = 0;

    // how many seconds to oscillate in and out (approx: random variance)
    const sunLength = 303;
    const cloudLength = 99;
    const fogLength = 189;
    const windLength = 50;
    const rainLength = 101;

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
                    case TILE_EGGPLANT_SEED:
                    case TILE_TOMATO_SEED:
                    case TILE_POTATO_SEED:
                        wetcount++;
                        for (var p = 0; p < plantTrackingArray.length; p++) {
                            if (plantTrackingArray[p].mapIndex == i) {
                                plantTrackingArray[p].is_watered = true;
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

        updateWeatherVolumes(howSunny, howCloudy, howFoggy, howWindy, howRainy);

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
        howSunny = Math.sin(dayPercent * 5);

        // oscillate in and out from -1 to 1 at different rates
        howCloudy = Math.sin(timer.secondsInDay / cloudLength / 60);
        howFoggy = Math.sin(timer.secondsInDay / fogLength / 60);
        howWindy = Math.sin(timer.secondsInDay / windLength / 60);
        howRainy = Math.cos(timer.secondsInDay / rainLength / 60);

        if (howSunny > 0) {
            canvasContext.globalAlpha = howSunny;
            // sun "ray" rotation animation is in realtime, not affected by game timer
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, performance.now() / 14000);
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, -performance.now() / 12701);
            drawBitmapCenteredAtLocationWithRotation(sunshine, 0, 0, performance.now() / 33303);
            canvasContext.globalAlpha = 1;
        } // if sunny


        if (howRainy > 0) {

            this.handleRainWater(howRainy);

            for (var loop = 0; loop < RAIN_COUNT * howRainy; loop++) { // number of drops depends on HOW rainy it is
                if (!rainDrops[loop]) //lazy init once only
                    rainDrops[loop] = { x: 0, y: 999999, sx: -1, sy: 2 };
                // respawn when past bottom
                if (rainDrops[loop].y > maxY - cameraOffsetY) { //canvas.height+RAIN_SPRITE_SIZE) {
                    spdy = 1 + Math.random() * 4;
                    rainDrops[loop] = {
                        x: (Math.random() * canvas.width * 2) - cameraOffsetX,
                        y: Math.random() * canvas.height * -1 - RAIN_SPRITE_SIZE + cameraOffsetY,
                        sx: -spdy / 2, sy: spdy
                    };
                    //console.log('cameraOffsetX'+cameraOffsetX);
                }
                // update position
                rainDrops[loop].x += rainDrops[loop].sx;
                rainDrops[loop].y += rainDrops[loop].sy;
                // render raindrop
                canvasContext.drawImage(weatherSpritesheet, // see imgLoading.js
                    RAIN_SPRITE_SIZE * (loop % 4), // sx
                    0, // sy
                    RAIN_SPRITE_SIZE, // sw
                    RAIN_SPRITE_SIZE, // sh
                    rainDrops[loop].x, // dx
                    rainDrops[loop].y, // dy
                    RAIN_SPRITE_SIZE / 3, // dw // 32x32 is too big: scaled down
                    RAIN_SPRITE_SIZE / 3); // dh        
            }
        } // if rainy

        if (howCloudy > 0) {
            for (var loop = 0; loop < CLOUD_COUNT; loop++) {

                // cloud speed is a very sloooow circle, like shifting winds, mostly horizontal
                // these rotations are not tied to the game timer, just realtime
                spdx = Math.sin(performance.now() * 0.0001) * 0.75 + (loop * 0.15); // some clouds go a little faster
                spdy = Math.cos(performance.now() * 0.0001) * 0.25 - (loop * 0.15);

                // add some extra cloud speed when it is windy!
                spdx += howWindy * WIND_CLOUD_SPEED_INFLUENCE;
                spdy += howWindy * WIND_CLOUD_SPEED_INFLUENCE;

                if (!clouds[loop]) { //lazy init once only
                    // start somewhere onscreen:
                    clouds[loop] = { x: Math.random() * canvas.width - CLOUD_SPRITE_SIZE, y: Math.random() * canvas.height - CLOUD_SPRITE_SIZE, sx: spdx, sy: spdy };
                    // start offscreen and force a respawn immed:
                    //clouds[loop] = { x: 0, y: 999999, sx: -1, sy: 2 }; 
                }

                // respawn when past any edge
                if ((clouds[loop].y > maxY - cameraOffsetY + CLOUD_SPRITE_SIZE * 4) || // past bottom
                    (clouds[loop].y < 0 - cameraOffsetY - CLOUD_SPRITE_SIZE * 4) || // past top
                    (clouds[loop].x > maxX - cameraOffsetX + CLOUD_SPRITE_SIZE * 4) || // right
                    (clouds[loop].x < 0 - cameraOffsetX - CLOUD_SPRITE_SIZE * 4)) {

                    var randy = Math.random();

                    // clouds always come from the right (to match rain angle)
                    spawnx = canvas.width + (CLOUD_SPRITE_SIZE) + cameraOffsetX;
                    spawny = Math.random() * canvas.height + cameraOffsetY - CLOUD_SPRITE_SIZE;

                    spawnx = Math.round(spawnx);
                    spawny = Math.round(spawny);

                    //console.log("cloud " + loop + " respawning to " + spawnx + "," + spawny);
                    clouds[loop] = {
                        x: spawnx, y: spawny,
                        sx: spdx, sy: spdy
                        //sx: Math.random() - 0.5, sy: Math.random() - 0.5 // random speeds mean each cloud has its own wind speed?!
                    };

                }

                // cloud speed changes en masses in realtime, not according to spawn values
                clouds[loop].x += -Math.abs(spdx) - camDeltaX; //clouds[loop].sx; // only in one direction: left
                clouds[loop].y += spdy - camDeltaY; //clouds[loop].sy;

                //if (loop == 1) console.log("cloud " + loop + " pos " + clouds[loop].x + "," + clouds[loop].y);

                canvasContext.globalAlpha = howCloudy;
                canvasContext.drawImage(cloudSpritesheet, // see imgLoading.js
                    CLOUD_SPRITE_SIZE * (loop % 4), // sx
                    0, // sy
                    CLOUD_SPRITE_SIZE, // sw
                    CLOUD_SPRITE_SIZE, // sh
                    clouds[loop].x, // dx
                    clouds[loop].y, // dy
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
                ' howWindy:' + howWindy.toFixed(1) +
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
            //colorRect(barX, barY + 24, Math.max(barW * howWindy, 1), barH, "#ccbbaa");
            //colorRect(barX, barY + 32, Math.max(barW * howRainy, 1), barH, "blue");

            var barW = 44;
            var barH = 12;
            var barX = Math.round(canvas.width / 2);
            var barY = 21;

            colorRect(barX - 86, barY, barW, barH, "rgba(255,255,0,0.25)");
            colorRect(barX - 86, barY, Math.max(barW * howSunny, 0), barH, "rgba(255,255,0,1.0)");

            colorRect(barX + 42, barY, barW, barH, "rgba(180,180,255,0.25)");
            colorRect(barX + 42, barY, Math.max(barW * howCloudy, 1), barH, "rgba(180,180,255,1.0)");

            colorRect(barX - 86, barY + 25, barW, barH, "rgba(80,180,255,0.25)");
            colorRect(barX - 86, barY + 25, Math.max(barW * howWindy, 1), barH, "rgba(80,180,255,1.0)");

            colorRect(barX + 42, barY + 25, barW, barH, "rgba(0,0,255,0.25)");
            colorRect(barX + 42, barY + 25, Math.max(barW * howRainy, 1), barH, "rgba(0,0,255,1.0)");

            // sky circle (shows sun/moon state)
            drawBitmapCenteredAtLocationWithRotation(skyCircle,
                Math.round(canvas.width / 2),
                Math.round(skyCircle.height / 2),
                2 * Math.PI * dayPercent - (0.5 * Math.PI)); // is this math right? FIXME

            // weather gui (overlay)
            canvasContext.drawImage(weatherGUI, // see imgLoading.js
                Math.round(canvas.width / 2 - weatherGUI.width / 2), 0);

        }

    }; // weather.draw()

} // weather system class

// make one immediately
console.log("Weather system init complete.");
window.weather = new WeatherSystem();
