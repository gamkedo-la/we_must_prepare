// weather system
// made by mcfunkypants for gamkedo

var weather = (function () {

    console.log("Weather system init");

    var rainDrops = [];
    const RAIN_COUNT = 400;
    const RAIN_SPRITE_SIZE = 32;
    const WORLD_COLS_VISIBLE = 9; // FIXME hardcoded

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        if (cameraOffsetX == undefined) cameraOffsetX = 0;
        if (cameraOffsetY == undefined) cameraOffsetY = 0;

        var spdy = 0;
        const maxY = canvas.height; // px down

        // TODO: only rain occasionaly, following a schedule
        // (ie rain only once a week or so)

        for (var loop = 0; loop < RAIN_COUNT; loop++) {
            if (!rainDrops[loop]) //lazy init once only
                rainDrops[loop] = { x: 0, y: 999999, sx: -1, sy: 2 };
            // respawn when past bottom
            if (rainDrops[loop].y > maxY - cameraOffsetY) { //canvas.height+RAIN_SPRITE_SIZE) {
                spdy = 1 + Math.random() * 4;
                rainDrops[loop] = { x: (Math.random() * canvas.width * 2) - cameraOffsetX, y: Math.random() * canvas.height * -1 - RAIN_SPRITE_SIZE + cameraOffsetY, sx: -spdy / 2, sy: spdy };
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
    };

    return this;

}()); // end weather class 