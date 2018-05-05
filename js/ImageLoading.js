var playerImage = document.createElement("img");
var playerSelection = document.createElement("img");
var buildingSelection = document.createElement("img");
var timeOfDayGradient = document.createElement("img");
var tree3D = document.createElement("img");
var treeDead3D = document.createElement("img");
var treeSpritesheet = document.createElement("img");
var tileSheet = document.createElement("img");
var weatherSpritesheet = document.createElement("img");
var cloudSpritesheet = document.createElement("img");
var sunshine = document.createElement("img");

var playerSpriteSheetWalkUp = document.createElement("img");
var playerSpriteSheetWalkDown = document.createElement("img");
var playerSpriteSheetWalkLeft = document.createElement("img");
var playerSpriteSheetWalkRight = document.createElement("img");

var playerWalkUp = new SpriteSheetClass(playerSpriteSheetWalkUp,128,128);
var playerWalkDown = new SpriteSheetClass(playerSpriteSheetWalkDown,64,64);
var playerWalkLeft = new SpriteSheetClass(playerSpriteSheetWalkLeft,64,64);
var playerWalkRight = new SpriteSheetClass(playerSpriteSheetWalkRight,64,64);

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if (picsToLoad == 0) { // last image loaded?
    loadingDoneSoStartGame();
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload = countLoadedImageAndLaunchIfReady;
  imgVar.src = "images/" + fileName;
}

function loadImages() {

  var imageList = [
    { varName: tileSheet, theFile: "sprite_strip.png" },
    { varName: playerImage, theFile: "robokedo3tiny.png" },
    { varName: playerSpriteSheetWalkUp, theFile: "robokedoWalkBack.png" },
    { varName: playerSpriteSheetWalkDown, theFile: "robokedoWalk.png" },
    { varName: playerSpriteSheetWalkLeft, theFile: "robokedoSideLeft.png" },
    { varName: playerSpriteSheetWalkRight, theFile: "robokedoSideRight.png" },
    { varName: playerSelection, theFile: "player_selection.png" },
    { varName: timeOfDayGradient, theFile: "time_of_day_gradient2.png" },
    { varName: buildingSelection, theFile: "building_selection.png" },
    { varName: tree3D, theFile: "survivingTree1.png" },
    { varName: treeDead3D, theFile: "deadTree1.png" },
    { varName: treeSpritesheet, theFile: "treeSpritesheet.png" },
    { varName: weatherSpritesheet, theFile: "weatherSpritesheet.png" },
    { varName: cloudSpritesheet, theFile: "clouds.png" },
    { varName: sunshine, theFile: "sunshine.png" }
  ];

  picsToLoad = imageList.length;
  for (var i = 0; i < imageList.length; i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  } // end of for imageList

} // end of function loadImages
