setFormat();
setAudioPath("./audio/");

//set music tracks here
var menu_music_track = new musicContainerWStinger([menu_music_track_1 = new MusicTrackNonLoopingDoubleBuffer("menu", 102.33), //By Stebs
                                                    menu_music_track_2 = new MusicTrackNonLooping("menustinger", 2.0)]);
var win_music_track = new MusicTrackLoopingWTail("ending_open", 30.6);  // by Klaim
var loose_music_track = new MusicTrackLoopingWTail("ending_bad", 63.5);  // by Klaim
var inGame_music_track1 = new MusicTrackNonLoopingDoubleBuffer("Peace", 90.5);  //By Vignesh
var inGame_music_track2 = new MusicContainerRandom([inGame_music_track2_1 = new MusicTrackNonLooping("lazyGuitarVar1", 52.8), //By Misha
                                                    inGame_music_track2_2 = new MusicTrackNonLooping("lazyGuitarVar2", 52.8),
                                                    inGame_music_track2_3 = new MusicTrackNonLooping("lazyGuitarVar3", 52.8),
                                                    inGame_music_track2_4 = new MusicTrackNonLooping("lazyGuitarVar4", 52.8)]);
var inGame_music_track3 = new MusicTrackNonLoopingDoubleBuffer("morning", 18.4);  //By Kise
inGame_music_track3.setMixVolume(0.7);
var inGame_music_track4 = new musicContainerWStinger([inGame_music_track4_1 = new MusicTrackNonLoopingDoubleBuffer("ambientmenu", 41.42), //By Btrumps
                                                    inGame_music_track4_2 = new MusicTrackNonLooping("ambientmusicstinger", 6.0)]);
var inGame_music_track5 = new MusicContainerRandomLayers([inGame_music_track2_1 = new MusicTrackNonLooping("MP Marimba", 64.0), //By Coy Compositions
                                                    inGame_music_track2_2 = new MusicTrackNonLooping("MP Marimba-Piano", 64.0),
                                                    inGame_music_track2_3 = new MusicTrackNonLooping("MP Piano high-high", 64.0),
                                                    inGame_music_track2_3 = new MusicTrackNonLooping("MP Piano high-low", 64.0),
                                                    inGame_music_track2_3 = new MusicTrackNonLooping("MP Piano low-high", 64.0),
                                                    inGame_music_track2_4 = new MusicTrackNonLooping("MP Piano low-low", 64.0)]);
var inGame_music_track6 = new MusicTrackNonLoopingDoubleBuffer("bright_future-normalized", 236.744);  //By Klaim
inGame_music_track6.setMixVolume(0.8);

var inGame_music_master = new MusicContainerPlaylistRandom( [ inGame_music_track1
                                                            , inGame_music_track2
                                                            , inGame_music_track3
                                                            , inGame_music_track4
                                                            , inGame_music_track5
                                                            , inGame_music_track6
                                                            ], 240 , 90 );

musicVolumeManager.setVolume(0.7);

//set environment sound here
var wind_enviSFX = new EnviSFXClipLoopingWTail("wind_loop_45", 45);
wind_enviSFX.setMixVolume(0.8);
var rain_enviSFX = new EnviSFXClipLoopingWTail("rain_loop_45", 45);
rain_enviSFX.setMixVolume(0.5);
var sun_enviSFX = new EnviSFXClipLoopingWTail("sun_loop_45", 45);
var water_enviSFX = new EnviSFXClipLoopingWTail("water_loop_45", 45);
water_enviSFX.setMixVolume(0.9);

enviSFXVolumeManager.setVolume(0.7);

//set SFX here
var robotIdleSFX = new SfxClipLoopingWTail("robot_idle", 20);
var robotMovementDefault = new SfxClipLoopingWTail("Robot_Moving", 5);
var robotWateringSFX = new SfxClipSingle("robot_green_thumb_halfsec");
var robotTillingLandSFX = new SfxClipSingle("tilling_land_version2");
var robotHarvestingCropsSFX = new SfxContainerRandom([crops = new SfxContainerRandom([harvest1 = new SfxClipSingle("harvesting_crops"),
                                                                                harvest2 = new SfxClipSingle("harvesting_crops_version_2"),
                                                                                harvest3 = new SfxClipSingle("harvesting_crops_version_3")])
                                                ]);

var robotCollectingResourcesSFX = new SfxContainer([metal = new SfxContainerRandom([metal1 = new SfxClipSingle("mining metal"),
                                                                                    metal2 = new SfxClipSingle("mining metal version 2")]),
                                                    stone = new SfxContainerRandom([stone1 = new SfxClipSingle("mining_stone_version_4"),
                                                                                    stone2 = new SfxClipSingle("mining_stone_version_5"),
                                                                                    stone3 = new SfxClipSingle("mining_stone_version_6")]),
                                                    wood = new SfxContainerRandom([wood1 = new SfxClipSingle("chopping_wood_version_2"),
                                                                                    wood2 = new SfxClipSingle("chopping_wood_version_3")])
                                                    ]);

var robotFootstepGround = new SfxContainer([sfx_step_dirt = new SfxContainerRandom([ sfx_step_dirt1 = new SfxClipSingle("temp_footstep_dirt01"),
                                                                            sfx_step_dirt2 = new SfxClipSingle("temp_footstep_dirt02"),
                                                                            sfx_step_dirt3 = new SfxClipSingle("temp_footstep_dirt03")]),
                                            sfx_step_soil = new SfxContainerRandom([ sfx_step_soil1 = new SfxClipSingle("temp_footstep_soil01"),
                                                                            sfx_step_soil2 = new SfxClipSingle("temp_footstep_soil02"),
                                                                            sfx_step_soil3 = new SfxClipSingle("temp_footstep_soil03")]),
                                            sfx_step_grass = new SfxContainerRandom([sfx_step_grass1 = new SfxClipSingle("temp_footstep_grass01"),
                                                                            sfx_step_grass2 = new SfxClipSingle("temp_footstep_grass02"),
                                                                            sfx_step_grass3 = new SfxClipSingle("temp_footstep_grass03")])]);

var robotStoringItemsSFX = new SfxContainer([stone = new SfxContainerRandom([stone1 = new SfxClipSingle("stone_deposit"),
                                                                             stone2 = new SfxClipSingle("stone_deposit_ver2"),
                                                                             stone3 = new SfxClipSingle("stone_deposit_ver3")]),
                                             wood = new SfxContainerRandom([wood1 = new SfxClipSingle("wood_deposit"),
                                                                            wood2 = new SfxClipSingle("wood_deposit_ver2")]),
                                             metal = new SfxContainerRandom([metal1 = new SfxClipSingle("metal_deposit"),
                                                                             metal2 = new SfxClipSingle("metal_deposit_ver2")])
                                            ]);

robotFootstepGround.setVolume(0.7);
sfx_step_dirt1.setMixVolume(0.8);
sfx_step_dirt2.setMixVolume(0.8);
sfx_step_dirt3.setMixVolume(0.8);
robotIdleSFX.setMixVolume(0.9);
robotMovementDefault.setMixVolume(0.7);
robotWateringSFX.setMixVolume(0.9);
robotTillingLandSFX.setMixVolume(0.9);
robotCollectingResourcesSFX.setVolume(0.7);
robotHarvestingCropsSFX.setVolume(0.7);
robotStoringItemsSFX.setVolume(0.6);

sFXVolumeManager.setVolume(0.7);

//set UI sound here
var uiSelect = new InterfaceSFXClipSingle("uiSelect");
var uiCancel = new InterfaceSFXClipSingle("uiCancel");
var uiChange = new InterfaceSFXClipSingle("uiChange");
var uiInventorySelect = new InterfaceSFXClipSingle("uiInventorySelect");

interfaceSFXVolumeManager.setVolume(0.7);

function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/ogg")) {
        audioFormatType = ".ogg";
    } else {
        audioFormatType = ".mp3";
    }
}

function setAudioPath(path = "") {
    audioPath = path;
}

function audioFormat(alt = false) {
    var format = audioFormatType;
    if (alt != false) {
        format = ".mp3";
    }
    return format;
}

function toggleMute() {
    isMuted = !isMuted;
    musicVolumeManager.updateVolume();
    enviSFXVolumeManager.updateVolume();
    sFXVolumeManager.updateVolume();
    interfaceSFXVolumeManager.updateVolume();
}

function setMute(TorF) {
    isMuted = TorF;
    musicVolumeManager.updateVolume();
    enviSFXVolumeManager.updateVolume();
    sFXVolumeManager.updateVolume();
    interfaceSFXVolumeManager.updateVolume();
}

function getMute() {
    return isMuted;
}


//Time Manager
const REMOVE = 0; // Arrayformat [REMOVE]
const FADE = 1; // Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
const TIMER = 2; // Arrayformat [TIMER, track, endTime, callSign]
const STOP = 3; // Arrayformat [STOP, track, endTime]

var audioEventManager = new AudioEventManager();

function AudioEventManager() {
    var eventList = [];
    var now = Date.now();

    this.returnEventList = function() {
        return eventList;
    }

    this.updateEvents = function() {
        now = Date.now();
        runList();
        cleanupList();
    }

    this.addFadeEvent = function(track, duration, endVol) {
        var check = checkListFor(FADE, track);
        var endTime = duration * 1000 + now;
        var startVolume = track.getVolume();
        //console.log("Adding Fade Event for " + track.getTrackName());

        if (check == "none") {
            eventList.push([FADE, track, now, endTime, startVolume, endVol, false]);
        } else {
            eventList[check] = [FADE, track, now, endTime, startVolume, endVol, false];
        }
    }

    this.addCrossfadeEvent = function(track, duration, endVol) {
        var check = checkListFor(FADE, track);
        var endTime = duration * 1000 + now;
        var startVolume = track.getVolume();
        //console.log("Adding Fade Event for " + track.getTrackName());

        if (check == "none") {
            eventList.push([FADE, track, now, endTime, startVolume, endVol, true]);
        } else {
            eventList[check] = [FADE, track, now, endTime, startVolume, endVol, true];
        }
    }

    this.addTimerEvent = function(track, duration, callSign = "none") {
        var thisTrack = track;
        var check = checkListFor(TIMER, thisTrack, callSign);
        var endTime = (duration * 1000) + now;
        //var endTime = (thisTrack.getDuration() - thisTrack.getTime()) * 1000 + now;

        if (check == "none") {
            //console.log("Adding Timer Event for " + track.getTrackName());
            eventList.push([TIMER, track, endTime, callSign]);
        } else {
            eventList[check] = [TIMER, track, endTime, callSign];
        }
    }

    this.addStopEvent = function(track, duration) {
        var thisTrack = track;
        var check = checkListFor(STOP, thisTrack);
        var endTime = (duration * 1000) + now;
        //var endTime = (thisTrack.getDuration() - thisTrack.getTime()) * 1000 + now;

        if (check == "none") {
            //console.log("Adding Stop Event for " + track.getTrackName());
            eventList.push([STOP, track, endTime]);
        } else {
            eventList[check] = [STOP, track, endTime];
        }
    }

    this.removeTimerEvent = function(track, callSign = "none") {
        var thisTrack = track;
        var check = checkListFor(TIMER, thisTrack, callSign);

        if (check == "none") {
            return;
        } else {
            //console.log("Removing Timer Event for " + track.getTrackName());
            eventList[check] = [REMOVE];
        }
    }

    this.removeStopEvent = function(track) {
        var thisTrack = track;
        var check = checkListFor(STOP, thisTrack);

        if (check == "none") {
            return;
        } else {
            //console.log("Removing Stop Event for " + track.getTrackName());
            eventList[check] = [REMOVE];
        }
    }

    function runList(){
        for (var i = 0; i < eventList.length; i++) {
            if (eventList[i][0] == FADE) {
                // Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
                thisTrack = eventList[i][1];
                if (thisTrack.getPaused() == false) {
                        if(eventList[i][6]) {
                            if(eventList[i][4] < eventList[i][5]){
                                thisTrack.setVolume(scaleRange(0, 1, eventList[i][4], eventList[i][5],
                                    Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 0, 1, now), 0.5)));
                            } else {
                                thisTrack.setVolume(scaleRange(1, 0, eventList[i][4], eventList[i][5],
                                    Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 1, 0, now), 0.5)));
                            }
                        } else {
                            thisTrack.setVolume(interpolateFade(eventList[i][2], eventList[i][3], eventList[i][4], eventList[i][5], now));
                        }
                    if (eventList[i][3] < now) {
                        //console.log("Ending Fade Event for " + thisTrack.getTrackName());
                        eventList[i] = [REMOVE];
                    }
                }
            }
            if (eventList[i][0] == TIMER) {
                thisTrack = eventList[i][1];
                if (thisTrack.getPaused() == false) {
                    if (eventList[i][2] <= now) {
                        //console.log("Ending Timer Event for " + thisTrack.getTrackName());
                        eventList[i] = [REMOVE];
                        thisTrack.triggerTimerEnded(eventList[i][3]);
                    }
                } else {
                    eventList[i] = [REMOVE];
                }
            }
            if (eventList[i][0] == STOP) {
                thisTrack = eventList[i][1];
                if (thisTrack.getPaused() == false) {
                    if (eventList[i][2] <= now) {
                        //console.log("Executing Stop Event for " + thisTrack.getTrackName());
                        eventList[i] = [REMOVE];
                        thisTrack.stop();
                    }
                }
            }
        }

    }

    function cleanupList() {
        eventList.sort(function(a, b){return b-a});
        while (eventList[eventList.length - 1] == REMOVE) {
            eventList.pop();
        }
    }

    function checkListFor(eventType, track, callSign = "none"){
        var foundItem = false;
        for (var i = 0; i < eventList.length; i++) {
            if (eventList[i][0] == eventType) {
                if (eventList[i][1] == track) {
                    if(eventType == TIMER && eventList[i][3] == callSign) {
                        foundItem = true;
                        return i;
                    } else if (eventType != TIMER) {
                        foundItem = true;
                        return i;
                    }
                }
            }
        }
        if (!foundItem) {
            return "none";
        }
    }
}

function interpolateFade(startTime, endTime, startVolume, endVolume, currentTime) {
    /*
    x1 = startTime
    y1 = startVolume

    x2 = endTime
    y2 = endVolume

    x = currentTime
    y = y1 + (x - x1)((y2 - y1)/(x2 - x1))
    currentVolume = startVolume + (now - startTime) * ((endVolume - startVolume) / (endTime - startTime))
    */
    if (currentTime > endTime) {currentTime = endTime;}
    var currentVolume = startVolume + (currentTime - startTime) * ((endVolume - startVolume) / (endTime - startTime));

    return currentVolume;
}

function scaleRange(inputStart, inputEnd, outputStart, outputEnd, value) {
    var scale = (outputEnd - outputStart) / (inputEnd - inputStart);
    return outputStart + ((value - inputStart) * scale);
}

//Game hooks
var musicPastMainMenu = false;
function startAudioEngine() {
    if(inGame_music_master.getPaused() && musicPastMainMenu) {
        inGame_music_master.resume();
    } else if (!musicPastMainMenu && menu_music_track.getTime() > 0) {
        menu_music_track.resume();
    } else if (!musicPastMainMenu) {
        menu_music_track.play();
    }
}

function stopAudioEngine() {
    inGame_music_master.pause();
    menu_music_track.pause();
    wind_enviSFX.pause();
    rain_enviSFX.pause();
    sun_enviSFX.pause();
    water_enviSFX.pause();
    robotIdleSFX.pause();
    robotMovementDefault.pause();
}

function soundUpdateOnPlayer() {
    if (!musicPastMainMenu) {return;}
    //playMovingSFX
    if (!player.isPlayerIdle() && robotMovementDefault.getPaused()) {
        robotMovementDefault.resume();
        robotIdleSFX.pause();
    } else if (player.isPlayerIdle() && robotIdleSFX.getPaused()) {
        robotIdleSFX.resume();
        robotMovementDefault.pause();
    } else if (!player.isPlayerIdle() && !robotMovementDefault.getPaused()) {
        robotIdleSFX.pause();
    } else if (player.isPlayerIdle() && !robotIdleSFX.getPaused()) {
        robotMovementDefault.pause();
    }

    //playWaterAmbi
    var a = player.x - 1800;
    var b = player.y - 700;
    var c = Math.sqrt(a*a + b*b);
    if (c < 700) {
        if (c < 300) {
            water_enviSFX.setVolume(1);
        } else {
            water_enviSFX.setVolume(Math.abs(2 -c*2/700));
        }
        if (water_enviSFX.getPaused()) {
            water_enviSFX.resume();
        }
    }

}

function updateWeatherVolumes(sun, cloud, fog, wind, rain) {
    if (!musicPastMainMenu) {return;}
    //console.log("Updating weathar volumes. Sun: " + sun + " Cloud: " + cloud + " Fog: " + fog + " Wind: " + wind + " Rain: " + rain);
    var sunLevel = Math.max(sun, 0);
    var cloudLevel = Math.max(cloud, 0);
    var fogLevel = Math.max(fog, 0);
    var windLevel = Math.max(wind, 0);
    var rainLevel = Math.max(rain, 0);

    sunLevel -= Math.max((cloudLevel + windLevel), 0);
    //Set birds to sun - the average of cloud and wind
    if (sun_enviSFX.getPaused()) {
        sun_enviSFX.resume();
        sun_enviSFX.setVolume(sunLevel);
    } else {
        sun_enviSFX.setVolume(sunLevel);
    }
    //Set wind
    if (wind_enviSFX.getPaused()) {
        wind_enviSFX.resume();
        wind_enviSFX.setVolume(windLevel);
    } else {
        wind_enviSFX.setVolume(windLevel);
    }
    //Set rain
    if (rain_enviSFX.getPaused()) {
        rain_enviSFX.resume();
        rain_enviSFX.setVolume(rainLevel);
    } else {
        rain_enviSFX.setVolume(rainLevel);
    }
}

function AudioSliderInterface(name, volumeManager, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = true;

    if(this.height < 15){this.height = 15;}

    this.lineHeight = 10;
    this.textLine = name;

    this.sliderHeight = this.height - this.lineHeight;
    this.lengthScale = this.width - this.sliderHeight;
    this.sliderValue = volumeManager.getVolume();
    this.clicked = false;

    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(y >= this.y + this.lineHeight && y <= this.y + this.height) {
            this.clicked = true;
            uiSelect.play();
            return true;
        }
    }

    this.draw = function() {
        if(mouseY >= this.y && mouseY <= this.y + this.height + this.lineHeight &&
           mouseX >= this.x - this.lineHeight && mouseX <= this.x + this.width + this.lineHeight && mouseHeld && this.clicked) {
            var newVolume = (mouseX - this.x)/this.width;
            this.sliderValue = newVolume;
            if(this.sliderValue != volumeManager.getVolume()) {
                uiChange.play();
            }
            volumeManager.setVolume(this.sliderValue);
        } else if(!mouseHeld){
            this.clicked = false;
        }

        var textX = this.x;
        var textY = this.y + this.lineHeight - 2;
        var sliderX = this.x;
        var sliderY = this.y + this.lineHeight;
        this.sliderValue = volumeManager.getVolume();

        colorText(this.textLine, textX, textY, 'black');
        colorRect(sliderX, sliderY, this.width, this.sliderHeight, 'black');
        colorRect(sliderX+2 + this.sliderValue*this.lengthScale, sliderY+2, this.sliderHeight-4, this.sliderHeight-4, 'white');
    }
}

function AudioMuteToggleInterface(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = true;

    this.lineHeight = 10;
    this.textLine = name;

    this.toggleHeight = this.height - this.lineHeight;
    this.toggleValue = getMute();

    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(y >= this.y + this.lineHeight && y <= this.y + this.height &&
           x >= this.x && x <= this.x + this.toggleHeight) {
            uiChange.play();
            toggleMute();
            return true;
        }
    }

    this.draw = function() {
        this.toggleValue = getMute();
        var textX = this.x;
        var textY = this.y + this.lineHeight - 2;
        var toggleX = this.x;
        var toggleY = this.y + this.lineHeight;

        colorText(this.textLine, textX, textY, 'black');
        colorRect(toggleX, toggleY, this.toggleHeight, this.toggleHeight, 'black');
        colorRect(toggleX+2, toggleY+2, this.toggleHeight-4, this.toggleHeight-4, 'white');
        if (this.toggleValue) {
            colorRect(toggleX+3, toggleY+3, this.toggleHeight-6, this.toggleHeight-6, 'black');
        }

    }
}

function AudioCurrentTrackInterface(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = true;

    this.lineHeight = 10;
    this.textLine1 = name;
    this.textLine2 = getCurrentTrackInfo();

    this.leftMouseClick = function(x=mouseX, y=mouseY) {
    }

    this.draw = function() {
        this.textLine2 = getCurrentTrackInfo();
        var textX = this.x;
        var textY = this.y + this.lineHeight - 2;
        var titleX = this.x;
        var titleY = this.y + this.lineHeight*2 - 2;

        colorText(this.textLine1, textX, textY, 'black');
        colorText(this.textLine2, titleX, titleY, 'black');
    }
}

function AudioButtonInterface(name, topLeftX, topLeftY, width, height) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.width = width;
    this.height = height;
    this.name = name;
    this.isVisible = true;

    this.isPressed = false;

    this.leftMouseClick = function(x=mouseX, y=mouseY) {
        if(isInPane(this, x, y)) {
            this.isPressed = true;
            this.action();
        }
    };

    // This function will be called when button is triggered
    this.action = function() {
        // assign custom function to do something
    };

    this.draw = function() {
        if(this.isVisible) {
            var drawColor;
            drawColor = (this.isPressed) ? buttonColorPressed : buttonColor;
            colorRect(this.x, this.y, this.width, this.height, drawColor);

            var str = this.name;
            var strWidth = canvasContext.measureText(this.name).width;
            //center text
            var textX = this.x + (this.width*0.5) - (strWidth*0.5);
            //TODO magic numbers going here.
            var textY = this.y + (this.height*0.5) + 4;
            colorText(str, textX, textY, "black");
            this.isPressed = false;
        }
    };
}

function getCurrentTrackInfo() {
    var details = "";
    var currentTrack = inGame_music_master.getTrackName();

    currentTrack = currentTrack.slice(0,3);
    switch(currentTrack){
        case "Pea":
            details = "Peace by Vignesh"
            break;
        case "mor":
            details = "Morning by Kise"
            break;
        case "laz":
            details = "Lazy Guitar by Misha"
            break;
        case "amb":
            details = "Ambient Menu by Btrumps"
            break;
        case "MP ":
            details = "Marimba Piano by Coy Compositions"
            break;
        case "bri":
            details = "Bright Future by Klaim"
            break;
    }

    return details;
}

var walkFrame = 0;
function playFootstep(spriteSheetObject) {
    groundType = roomGrid[getTileIndexAtPixelCoord(player.x,player.y)];
    if(groundType == TILE_GROUND) {
        robotFootstepGround.setCurrentClip(0);
    } else if(groundType == TILE_TILLED || groundType == TILE_TILLED_WATERED ||
              groundType == TILE_TILLED_SEEDS || groundType == TILE_TILLED_SEEDS_WATERED) {
        robotFootstepGround.setCurrentClip(1);
    } else if(groundType == TILE_GRASS) {
        robotFootstepGround.setCurrentClip(2);
    }
    var currentFrame = spriteSheetObject.getCurrentFrame() % 4;
    if (currentFrame == 0 && currentFrame != walkFrame) {
        robotFootstepGround.play();
    }
    walkFrame = currentFrame;
}

function playSFXForCollectingResource(tileType) {
    switch(tileType)
    {
        case TILE_METAL_SRC:
            robotCollectingResourcesSFX.setCurrentClip(0);
            break;
        case TILE_STONE_SRC:
            robotCollectingResourcesSFX.setCurrentClip(1);
            break;
        case TILE_WOOD_SRC:
            robotCollectingResourcesSFX.setCurrentClip(2);
            break;
    }

    robotCollectingResourcesSFX.play();
}

function playSFXForStoringItems(tileType)
{
    switch(tileType)
    {
        case TILE_STONE_DEST:
            robotStoringItemsSFX.setCurrentClip(0);
            break;
        case TILE_WOOD_DEST:
            robotStoringItemsSFX.setCurrentClip(1);
            break;
        case TILE_METAL_DEST:
            robotStoringItemsSFX.setCurrentClip(2);
            break;
    }

    robotStoringItemsSFX.play();
}

function playSFXForHarvestingCrops() {
    robotHarvestingCropsSFX.play();
}
