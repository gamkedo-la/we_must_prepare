// We Must Prepare Intro

function Introduction() { // a class constructor

    // public
    this.currentlyPlaying = true; // false when game is ready to play

    // private
    var introText = [
        "The unthinkable happened;  World War Three. Nuclear weapons.\n" +
        "Total destruction.  The end of life as we know it on our planet, Earth.",

        "The remaining people of the planet put together\n" +
        "a desperate plan to save the human race.",

        "Knowing that the planet wouldn’t be survivable\n" +
        "for a few hundred years, they put themselves in\n" +
        "cryogenic hibernation and created a group of special robots",

        "that would be activated in a few hundred years\n" +
        "to help make the resources that they would need to keep going.",

        "This is where we come in. You are one of those robots\n" +
        "who will help save the human race.",

        "They will need food and housing. They will need resources\n" +
        "to rebuild civilization.  We must prepare, for they are coming."
    ];
    var introHints = [
        "You need to till the soil before you can plant.",
        "Remember to plant seeds and water them!",
        "You can harvest food and seeds using a scythe.",
        "Store your harvest in the silo to prepare for the humans!"
    ];
    var introFont = '24px Arial';
    var textLineHeight = 32;
    var timeStarted = -9999; // a timestamp in ms
    var timePerSlide = 4000; // in ms

    this.draw = function () {

        if (timeStarted == -9999) {
            timeStarted = performance.now();
            console.log("Starting the intro at " + (timeStarted / 1000).toFixed(1) + "sec");
        }
        var timeStamp = performance.now();
        var elapsedTime = timeStamp - timeStarted;
        var slideNum = Math.floor(elapsedTime / timePerSlide);

        console.log("intro slide " + slideNum + " after " + (elapsedTime / 1000).toFixed(1) + " sec");

        // are we done?
        if (slideNum >= introText.length) {
            console.log("Intro completed after " + (elapsedTime / 1000).toFixed(1) + " sec");
            this.currentlyPlaying = false;
            return;
        }

        // otherwise: draw it
        var textX = Math.round(canvas.width / 2);
        //var textY = Math.round(canvas.height / 2);
        var textY = canvas.height - textLineHeight * 4;

        var slidePercentDone = (elapsedTime - (slideNum * timePerSlide)) / timePerSlide;
        var textAlpha = Math.min(slidePercentDone * 2, 1.0); // fade in for the first half
        //console.log('slidePercentDone ' + slidePercentDone.toFixed(1));

        // bg
        //colorRect(0, 0, canvas.width, canvas.height, "rgba(80,180,255,1.0)");
        colorRect(0, canvas.height - textLineHeight * 5, canvas.width, textLineHeight * 5, "rgba(80,180,255,1.0)");

        // the text
        var textLines = introText[slideNum].split("\n");
        for (var num = 0; num < textLines.length; num++) {
            textY += textLineHeight;
            // draw a shadow for readability on top of any shade of sky
            colorTextCentered(textLines[num], textX + 1, textY + 1, 'rgba(0,0,0,' + textAlpha + ')', introFont);
            // draw the text
            colorTextCentered(textLines[num], textX, textY, 'rgba(255,240,220,' + textAlpha + ')', introFont);
        }

    }
}
