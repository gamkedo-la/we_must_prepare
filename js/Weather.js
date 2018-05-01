// weather system
// made by mcfunkypants for gamkedo

var weather = (function () {

    console.log("Weather system init...");

    const DEBUG_WEATHER_GUI = true; // weather states for visual debugging

    var rainDrops = [];
    const RAIN_COUNT = 500;
    const RAIN_SPRITE_SIZE = 32;

    var clouds = [];
    const CLOUD_COUNT = 8;
    const CLOUD_SPRITE_SIZE = 256;

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

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        if (cameraOffsetX == undefined) cameraOffsetX = 0;
        if (cameraOffsetY == undefined) cameraOffsetY = 0;

        var spdx = 0;
        var spdy = 0;
        var spawnx = 0;
        var spawny = 0;
        const maxY = canvas.height;
        const maxX = canvas.width;

        var now = performance.now(); // in seconds

        // oscillate in and out from -1 to 1
        // only draw if > 1 so there are gaps with no weather
        howSunny = Math.sin(now / sunLength / 100);
        howCloudy = Math.sin(now / cloudLength / 100);
        howFoggy = Math.sin(now / fogLength / 100);
        howWindy = Math.sin(now / windLength / 100);
        howRainy = Math.cos(now / rainLength / 100);

        if (howRainy > 0) {
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
            for (var loop = 0; loop < CLOUD_COUNT * howCloudy; loop++) {

                // cloud speed is a very sloooow circle, like shifting winds, mostly horizontal
                spdx = Math.sin(performance.now() * 0.0001) * 0.5 + (loop * 0.05); // some clouds go a little faster
                spdy = Math.cos(performance.now() * 0.0001) * 0.2 - (loop * 0.05);

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

                    /* // buggy:
                    // comes from any of the four edges?
                    // top edge
                    if (randy > 0.75) { spawnx = Math.random() * canvas.width * 2 - cameraOffsetX; spawny = -CLOUD_SPRITE_SIZE + cameraOffsetY; }
                    // bottom edge
                    else if (randy > 0.50) { spawnx = Math.random() * canvas.width * 2 - cameraOffsetX; spawny = maxY + cameraOffsetY; }
                    // left edge
                    else if (randy > 0.25) { spawnx = -CLOUD_SPRITE_SIZE + cameraOffsetY; spawny = Math.random() * canvas.height * 2 + cameraOffsetY; }
                    // right edge
                    else { spawnx = maxX + CLOUD_SPRITE_SIZE + cameraOffsetY; spawny = Math.random() * canvas.height * 2 + cameraOffsetY; }
                    */

                    // always comes from the right (because the rain is angled that way!)
                    spawnx = canvas.width + /* (CLOUD_SPRITE_SIZE * 3) + */ cameraOffsetX;
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
                clouds[loop].x += -Math.abs(spdx); //clouds[loop].sx; // only in one direction: left
                clouds[loop].y += spdy; //clouds[loop].sy;

                //if (loop == 1) console.log("cloud " + loop + " pos " + clouds[loop].x + "," + clouds[loop].y);

                canvasContext.drawImage(cloudSpritesheet, // see imgLoading.js
                    CLOUD_SPRITE_SIZE * (loop % 4), // sx
                    0, // sy
                    CLOUD_SPRITE_SIZE, // sw
                    CLOUD_SPRITE_SIZE, // sh
                    clouds[loop].x, // dx
                    clouds[loop].y, // dy
                    CLOUD_SPRITE_SIZE * 3, // dw // make em huge
                    CLOUD_SPRITE_SIZE * 3); // dh        
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

            var barW = 100;
            var barH = 6;
            var barX = 400;
            var barY = 6;

            colorText('sun', barX - 26, barY + 5, 'white');
            colorText('cloud', barX - 26, barY + 5 + 8, 'white');
            colorText('fog', barX - 26, barY + 5 + 16, 'white');
            colorText('wind', barX - 26, barY + 5 + 24, 'white');
            colorText('rain', barX - 26, barY + 5 + 32, 'white');

            colorRect(barX, barY, Math.max(barW * howSunny, 0), barH, "yellow");
            colorRect(barX, barY + 8, Math.max(barW * howCloudy, 1), barH, "#777799");
            colorRect(barX, barY + 16, Math.max(barW * howFoggy, 1), barH, "#333333");
            colorRect(barX, barY + 24, Math.max(barW * howWindy, 1), barH, "#ccbbaa");
            colorRect(barX, barY + 32, Math.max(barW * howRainy, 1), barH, "blue");

        }

    }; // weather.draw()

    console.log("Weather system init complete.");

    return this; // weather constructor

}()); // end weather class 