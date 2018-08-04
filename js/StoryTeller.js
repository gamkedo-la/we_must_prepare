// We Must Prepare Story class

function StoryTeller() { // a class constructor

    // public
    this.currentlyPlaying = true; // false when game is ready to play

    // private
    var introText = [
        "...",
        "The unthinkable happened;  World War Three. Nuclear weapons.\n" +
        "Total destruction.  The end of life as we know it on our planet, Earth.",

        "The remaining people of the planet put together\n" +
        "a desperate plan to save the human race.",

        "Knowing that the planet wouldn’t be survivable for a few\n" +
        "hundred years, they put themselves in cryogenic hibernation and",

        "created a group of special robots that would be activated\n" +
        "in a few hundred years to help make the resources they need.",

        "This is where we come in. You are one of those robots\n" +
        "who will help save the human race.",

        "They will need food and housing. They will need resources\n" +
        "to rebuild civilization.  We must prepare, for they are coming."
    ];

    var goodEndingText = [
        "...",  // when playing for ending, zero element doesn't show up.
        "The day has come. They are coming. Did we prepare enough?\n" +
        "Let's hope we are ready. The instructions were clear.\n" +
        "But is it really enough?",

        "Those who are coming. These people. These humans. They are so fragile.\n" +
        "Yet they brought the world to the brink of destruction.\n" +
        "Was that their strength?",

        "No. Those who tried to destroy each other were left behind.\n" +
        "These here are resilient and built us to ensure their survival.\n" +
        "We did it. We were prepared."
    ];

    var badEndingText = [
        "...",  // when playing for ending, zero element doesn't show up.
        "The day has come. They are coming. Did we prepare enough?\n" +
        "Let's hope we are ready. The instructions were clear.\n" +
        "But is it really enough?",

        "Those who are coming. These people. These humans. They are so fragile.\n" +
        "Yet they brought the world to the brink of destruction.\n" +
        "Was that their strength?",

        "It looks like it was. Those who sought to destroy were successful.\n" +
        "We failed. We were not prepared."
    ];

    var introHints = [
        "You need to till the soil before you can plant.",
        "Remember to plant seeds and water them!",
        "You can harvest food and seeds using a scythe.",
        "Store your harvest in the silo to prepare for the humans!"
    ];

    var storyText = [];

    //var introFont = '24px Arial';
    var introFont = '20px Kelly Slab';
    // other nice "title" fonts
    // Bungee
    // Concert+One
    // Titan+One
    // Squada+One
    // Kelly+Slab

    var textLineHeight = 32;
    var timeStarted = -9999; // a timestamp in ms
    var timePerSlide = 9000; // in ms
    var slideRemainingTime = timePerSlide;
    var timeStampPrev = timeStarted;
    var timeStamp = timeStarted;
    var elapsedTime = 0;
    var slideNum = 0;

    this.tellIntro = function () {
        storyText = introText;
    };

    this.tellGoodEnding = function () {
        storyText = goodEndingText;
    };

    this.tellBadEnding = function () {
        storyText = badEndingText;
    };

    this.draw = function () {

        if (!this.currentlyPlaying) return;

        if (isPaused) {
            timeStamp = performance.now(); // so pause time doesn't advance tons when unpaused
            return;
        }

        if (timeStarted == -9999) {
            timeStarted = performance.now();
            console.log("Starting the intro at " + (timeStarted / 1000).toFixed(1) + "sec");
        }

        timeStampPrev = timeStamp;
        timeStamp = performance.now();

        slideRemainingTime -= (timeStamp - timeStampPrev);
        if (slideRemainingTime <= 0) {
            slideNum++;
            slideRemainingTime = timePerSlide;
            console.log("Starting intro slide " + slideNum);
        }

        elapsedTime = timeStamp - timeStarted; // total, including time spent in pause!

        //console.log("intro slide " + slideNum + " after " + (elapsedTime / 1000).toFixed(1) + " sec");

        // are we done?
        if (slideNum >= storyText.length) {
            console.log("Intro completed after " + (elapsedTime / 1000).toFixed(1) + " seconds total");
            this.currentlyPlaying = false;
            return;
        }

        // skip if player presses a button
        /*
        if (mouseClickedThisFrame) { // FIXME: this is never true, and clicks interfere with inventory clicks underneath
            console.log("Intro window clicked at " + mouseY + ": going to next slide.");
            //timeStarted = timeStamp - (slideNum * timePerSlide);
            slideNum++;
            introSlideRemainingTime = timePerSlide;
        }
        */

        // otherwise: draw it
        var textX = Math.round(canvas.width / 2) + 32; // slightly offset from true center to account for the robot icon
        //var textY = Math.round(canvas.height / 2);
        var textY = canvas.height - textLineHeight * 4;

        //var slidePercentDone = (elapsedTime - (slideNum * timePerSlide)) / timePerSlide;
        var slidePercentDone = slideRemainingTime / timePerSlide;
        var textAlpha = Math.min(slidePercentDone * 2, 1.0); // fade in for the first half
        //console.log('slidePercentDone ' + slidePercentDone.toFixed(1));

        // bg - solid blue
        //colorRect(0, canvas.height - textLineHeight * 5, canvas.width, textLineHeight * 5, "rgba(80,180,255,1.0)");

        canvasContext.drawImage(introBackground, (canvas.width - introBackground.width) * 0.5, canvas.height - introBackground.height);

        // the text
        var textLines = storyText[slideNum].split("\n");
        for (var num = 0; num < textLines.length; num++) {
            textY += textLineHeight;
            // draw a shadow for readability on top of any shade of sky
            colorTextCentered(textLines[num], textX + 1, textY + 1, 'rgba(0,0,0,' + textAlpha + ')', introFont);
            // draw the text
            colorTextCentered(textLines[num], textX, textY, 'rgba(255,240,220,' + textAlpha + ')', introFont);
        }

    }
}
