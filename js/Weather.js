// weather system
// made by mcfunkypants for gamkedo

var weather = (function () {

    console.log("Weather system init");

    var rainDrops = [];
    const RAIN_COUNT = 400;
    const RAIN_SPRITE_SIZE = 32;

    var clouds = [];
    const CLOUD_COUNT = 16;
    const CLOUD_SPRITE_SIZE = 256;

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        if (cameraOffsetX == undefined) cameraOffsetX = 0;
        if (cameraOffsetY == undefined) cameraOffsetY = 0;

        var spdx = 0;
        var spdy = 0;
        var spawnx = 0;
        var spawny = 0;
        const maxY = canvas.height;
        const maxX = canvas.width;

        // TODO: only rain occasionaly, following a schedule
        // (ie rain only once a week or so)

        for (var loop = 0; loop < RAIN_COUNT; loop++) {
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

            rainDrops[loop].x += rainDrops[loop].sx;
            rainDrops[loop].y += rainDrops[loop].sy;

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

        // cloud shadows
        for (var loop = 0; loop < CLOUD_COUNT; loop++) {
            if (!clouds[loop]) //lazy init once only
                clouds[loop] = { x: 0, y: 999999, sx: -1, sy: 2 };
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

                // always comes from the right
                spawnx = canvas.width + /* (CLOUD_SPRITE_SIZE * 3) + */ cameraOffsetX;
                spawny = Math.random() * canvas.height + cameraOffsetY - CLOUD_SPRITE_SIZE;

                spawnx = Math.round(spawnx);
                spawny = Math.round(spawny);

                // cloud speed is set each frame
                spdx = 0;
                spdy = 0;

                //console.log("cloud " + loop + " respawning to " + spawnx + "," + spawny);
                clouds[loop] = {
                    x: spawnx, y: spawny,
                    sx: spdx, sy: spdy
                    //sx: Math.random() - 0.5, sy: Math.random() - 0.5 // random speeds mean each cloud has its own wind speed?!
                };

            }

            // cloud speed is a very sloooow circle, like shifting winds, mostly horizontal
            spdx = Math.sin(performance.now() * 0.0001) * 0.5 + (loop * 0.05); // some clouds go a little faster
            spdy = Math.cos(performance.now() * 0.0001) * 0.2;
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
    };

    return this;

}()); // end weather class 