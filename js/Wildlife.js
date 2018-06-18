// a simple "juice/polish" effect: little ai critters! =)
// made for we must prepare by mcfunkypants

function WildlifeSystem(populationSize = 2, spriteSheetRow = 0, animSpeedmodifier = 8) {

    var frameCount = 0;
    const SPRITE_SIZE = 16;
    const ANIM_FRAMES = 8;
    const ANIM_SPEED = animSpeedmodifier;
    const NUM_BIRDS = populationSize; //100; lol SWARM!!!
    const SPRITE_YOFS = spriteSheetRow * SPRITE_SIZE;

    var birdx = [];
    var birdy = [];
    var birdSpeedX = [];
    var birdSpeedY = [];
    const RESPAWN_DISTANCE_OFFSCREEN = 2000; // extra so the bird isn't always on screen    
    var altitudeVariance = 20;

    this.draw = function (cameraOffsetX, cameraOffsetY) {

        frameCount++;

        // loop through all birds
        for (var me = 0; me < NUM_BIRDS; me++) {

            // wrap around and respawn
            if (!birdx[me] ||
                !birdy[me] ||
                (birdx[me] > canvas.width + SPRITE_SIZE + RESPAWN_DISTANCE_OFFSCREEN) ||
                (birdy[me] > canvas.height + SPRITE_SIZE + RESPAWN_DISTANCE_OFFSCREEN)) { // far enough offscreen?
                birdx[me] = -SPRITE_SIZE + cameraOffsetX - Math.random() * 500;
                birdy[me] = Math.random() * canvas.height + cameraOffsetY;
                birdSpeedX[me] = 0.5;
                birdSpeedY[me] = Math.random() - 0.5;
                //console.log("Respawning bird " + me + " at " + birdx[me] + "," + birdy[me]);
            }

            // fly forward
            birdx[me] += birdSpeedX[me];
            birdy[me] += birdSpeedY[me];

            // draw bird
            canvasContext.drawImage(wildlifeSpritesheet, // see imgLoading.js
                SPRITE_SIZE * (Math.round(frameCount / ANIM_SPEED + me) % ANIM_FRAMES), // sx
                SPRITE_YOFS, // sy
                SPRITE_SIZE, // sw
                SPRITE_SIZE, // sh
                birdx[me] - cameraOffsetX, // dx
                birdy[me] - cameraOffsetY + Math.cos(frameCount / 100) * altitudeVariance, // dy + wobble
                SPRITE_SIZE, // dw
                SPRITE_SIZE); // dh        

        } // loop through all birds
    };


} // wildlife system

// make one immediately
window.birds = new WildlifeSystem(2, 0, 8);
window.butterflies = new WildlifeSystem(4, 1, 1);
console.log("Wildlife system init complete.");

