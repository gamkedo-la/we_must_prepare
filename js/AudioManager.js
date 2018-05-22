setFormat();
setAudioPath("./audio/");

//set music tracks here
var menu_music_track = new musicTrackLoopingWTail("temp_placeholder", 3);
var win_music_track = new musicTrackLoopingWTail("temp_placeholder", 3);
var loose_music_track = new musicTrackLoopingWTail("temp_placeholder", 3);
var inGame_music_track1 = new musicTrackNonLooping("Peace", 90.5);  //By Vignesh
var inGame_music_track2 = new musicContainerRandom([inGame_music_track2_1 = new musicTrackNonLooping("lazyGuitarVar1", 52.8),
													inGame_music_track2_2 = new musicTrackNonLooping("lazyGuitarVar2", 52.8),
													inGame_music_track2_3 = new musicTrackNonLooping("lazyGuitarVar3", 52.8),
													inGame_music_track2_4 = new musicTrackNonLooping("lazyGuitarVar4", 52.8)]);
var inGame_music_track3 = new musicTrackNonLooping("morning", 18.4);  //By Kise
inGame_music_track3.setMixVolume(0.7);
var inGame_music_master = new musicContainerPlaylistRandom([inGame_music_track1,inGame_music_track2,inGame_music_track3],240,90);

MusicVolumeManager.setVolume(0.7);

//set environment sound here
var wind_enviSFX = new enviSFXClipLoopingWTail("wind_loop_45", 45);
wind_enviSFX.setMixVolume(0.8);
var rain_enviSFX = new enviSFXClipLoopingWTail("rain_loop_45", 45);
rain_enviSFX.setMixVolume(0.5);
var sun_enviSFX = new enviSFXClipLoopingWTail("sun_loop_45", 45);

EnviSFXVolumeManager.setVolume(0.7);

//set SFX here
var robotIdleSFX = new sfxClipLoopingWTail("robot_idle", 20);
var robotMovementDefault = new sfxClipLoopingWTail("Robot_Moving", 5);
var robotWateringSFX = new sfxClipSingle("robot_green_thumb");
var robotFootstepGround = new sfxContainer([dirt = new sfxContainerRandom([ dirt1 = new sfxClipSingle("temp_footstep_dirt01"),
																			dirt2 = new sfxClipSingle("temp_footstep_dirt02"),
																			dirt3 = new sfxClipSingle("temp_footstep_dirt03")]),
											soil = new sfxContainerRandom([ soil1 = new sfxClipSingle("temp_footstep_soil01"),
																			soil2 = new sfxClipSingle("temp_footstep_soil02"),
																			soil3 = new sfxClipSingle("temp_footstep_soil03")]),
											grass = new sfxContainerRandom([grass1 = new sfxClipSingle("temp_footstep_grass01"),
																			grass2 = new sfxClipSingle("temp_footstep_grass02"),
																			grass3 = new sfxClipSingle("temp_footstep_grass03")])]);
robotFootstepGround.setVolume(0.7);
robotIdleSFX.setVolume(1);
robotMovementDefault.setVolume(0.9);
robotWateringSFX.setVolume(0.9);

SFXVolumeManager.setVolume(0.7);

//set UI sound here
UISFXVolumeManager.setVolume(0.7);

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
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function setMute(TorF) {
	isMuted = TorF;
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function getMute() {
	return isMuted;
}


//Time Manager
const REMOVE = 0; // Arrayformat [REMOVE]
const FADE = 1; // Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
const TIMER = 2; // Arrayformat [TIMER, track, endTime, callSign]
const STOP = 3; // Arrayformat [STOP, track, endTime]

var AudioEventManager = new audioEventManager();

function audioEventManager() {
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
function startAudioEngine() {
	if(inGame_music_master.getPaused()) {
		inGame_music_master.play();
	}
}

function updateWeatherVolumes(sun, cloud, fog, wind, rain) {
	//console.log("Updating weathar volumes. Sun: " + sun + " Cloud: " + cloud + " Fog: " + fog + " Wind: " + wind + " Rain: " + rain);
	var sunLevel = Math.max(sun, 0);
	var cloudLevel = Math.max(cloud, 0);
	var fogLevel = Math.max(fog, 0);
	var windLevel = Math.max(wind, 0);
	var rainLevel = Math.max(rain, 0);

	sunLevel -= Math.max((cloudLevel + windLevel), 0);
	//Set birds to sun - the average of cloudand wind
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

function audioPaneUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
	this.x = topLeftX;
	this.y = topLeftY;
	this.width = bottomRightX - topLeftX;
	this.height = bottomRightY - topLeftY;
	this.name = name;
	this.isVisible = true;

	this.sliders = [mSlider = new audioSliderUI('Music Volume', this.x+20, this.y+20, this.x + this.width-20, this.y+40, MusicVolumeManager),
					eSlider = new audioSliderUI('Environment Volume', this.x+20, this.y+50, this.x + this.width-20, this.y+70, EnviSFXVolumeManager),
					sfxSlider = new audioSliderUI('Sound Effects Volume', this.x+20, this.y+80, this.x + this.width-20, this.y+100, SFXVolumeManager),
					uiSlider = new audioSliderUI('UI Volume', this.x+20, this.y+110, this.x + this.width-20, this.y+130, UISFXVolumeManager),
					muteToggle = new audioMuteToggleUI('Mute Audio', this.x+20, this.y+140, this.x + this.width-20, this.y+160),
					currentSong = new audioCurrentTrackUI('Now playing:', this.x+20, this.y+190, this.x + this.width-20, this.y+210)];
    
	this.leftMouseClick = function(x=mouseX, y=mouseY) {
		for(var i = 0; i < this.sliders.length; i++){
			if(y >= this.sliders[i].y && y <= this.sliders[i].y+this.sliders[i].height &&
			   x >= this.sliders[i].x && x <= this.sliders[i].x+this.sliders[i].width){
				this.sliders[i].leftMouseClick();
				return true;
			}
		}
		return false;
	}

	this.draw = function() {
		colorRect(this.x,this.y,this.width,this.height, 'beige');
		for(var i = 0; i < this.sliders.length; i++){
			this.sliders[i].draw();
		}

	}
}

function audioSliderUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY, volumeManager) {
	this.x = topLeftX;
	this.y = topLeftY;
	this.width = bottomRightX - topLeftX;
	this.height = bottomRightY - topLeftY;
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
			return true;
		}
		return false;
	}

	this.draw = function() {
		if(mouseY >= this.y && mouseY <= this.y + this.height + this.lineHeight && 
		   mouseX >= this.x - this.lineHeight && mouseX <= this.x + this.width + this.lineHeight && mouseHeld && this.clicked) {
			var newVolume = (mouseX - this.x)/this.width;
			this.sliderValue = newVolume;
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

function audioMuteToggleUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
	this.x = topLeftX;
	this.y = topLeftY;
	this.width = bottomRightX - topLeftX;
	this.height = bottomRightY - topLeftY;
	this.name = name;
	this.isVisible = true;

	this.lineHeight = 10;
	this.textLine = name;

	this.toggleHeight = this.height - this.lineHeight;
	this.toggleValue = getMute();

	this.leftMouseClick = function(x=mouseX, y=mouseY) {
		if(y >= this.y + this.lineHeight && y <= this.y + this.height &&
		   x >= this.x && x <= this.x + this.toggleHeight) {
			toggleMute();
			return true;
		}
		return false;
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

function audioCurrentTrackUI(name, topLeftX, topLeftY, bottomRightX, bottomRightY) {
	this.x = topLeftX;
	this.y = topLeftY;
	this.width = bottomRightX - topLeftX;
	this.height = bottomRightY - topLeftY;
	this.name = name;
	this.isVisible = true;

	this.lineHeight = 10;
	this.textLine1 = name;
	this.textLine2 = getCurrentTrackInfo();

	this.leftMouseClick = function(x=mouseX, y=mouseY) {
		return false;
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

var isRobotMovingSFXPlaying = false;
function playMovingSFX(player)
{
	if (!player.isPlayerIdle() && !isRobotMovingSFXPlaying) 
	{
		robotMovementDefault.play();
		isRobotMovingSFXPlaying = true;
	}
	else
	{
		if (player.isPlayerIdle()) 
		{
			robotMovementDefault.pause();
		}
		else
		{
			robotMovementDefault.resume();
		}
	}

	if (robotMovementDefault.getTime() >= robotMovementDefault.getDuration()) 
	{
		robotMovementDefault.setTime(0);
	}
}

var isIdleSFXPlaying = false;
function playIdleSFX(player)
{
	if (player.isPlayerIdle() && !isIdleSFXPlaying)
	{
		robotIdleSFX.play();
		isIdleSFXPlaying = true;
	}
	else
	{
		if (!player.isPlayerIdle() && isIdleSFXPlaying)
		{
			robotIdleSFX.pause();
		}
		else if (player.isPlayerIdle() && isIdleSFXPlaying)
		{
			robotIdleSFX.resume();
		}
	}

	if (robotIdleSFX.getTime() >= robotIdleSFX.getDuration())
	{
		robotIdleSFX.setTime(0);
	}
}