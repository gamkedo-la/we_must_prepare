// a simple "juice/polish" effect: little ai critters! =)
// made for we must prepare by mcfunkypants

var wildlife = (function () {

    var frameCount = 0;
    const SPRITE_SIZE = 16;
    const ANIM_FRAMES = 8;
    const ANIM_SPEED = 8;

    var birdx = 999999999; // force a respawn
    var birdy = 999999999;
    const RESPAWN_DISTANCE_OFFSCREEN = 2000; // extra so the bird isn't always on screen    
    var flySpeedX = 0.5;
    var flySpeedY = 0;
    var altitudeVariance = 20;

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        frameCount++;

        // fly forward
        birdx += flySpeedX;
        birdy += flySpeedY;

        // wrap around and respawn
        if ((birdx > canvas.width + SPRITE_SIZE + RESPAWN_DISTANCE_OFFSCREEN) ||
            (birdy > canvas.height + SPRITE_SIZE + RESPAWN_DISTANCE_OFFSCREEN)) { // far enough offscreen?
            console.log("Respawning bird.");
            birdx = -SPRITE_SIZE + cameraOffsetX;
            birdy = Math.random() * canvas.height + cameraOffsetY;
            flySpeedY = Math.random() - 0.5;
        }

        // draw bird
        canvasContext.drawImage(wildlifeSpritesheet, // see imgLoading.js
            SPRITE_SIZE * (Math.round(frameCount / ANIM_SPEED) % ANIM_FRAMES), // sx
            0, // sy
            SPRITE_SIZE, // sw
            SPRITE_SIZE, // sh
            birdx - cameraOffsetX, // dx
            birdy - cameraOffsetY + Math.cos(frameCount / 100) * altitudeVariance, // dy + wobble
            SPRITE_SIZE, // dw
            SPRITE_SIZE); // dh        
        canvasContext.globalAlpha = 1;

    }

    console.log("Wildlife system init complete.");

    return this; // wildlife constructor

}()); // create one wildlife system now