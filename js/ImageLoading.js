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
var plantSpritesheet = document.createElement("img");
var sunshine = document.createElement("img");
var itemSheet = document.createElement("img");
var selectedItemSlot = document.createElement("img");
var weatherGUI = document.createElement("img");
var skyCircle = document.createElement("img");
var siloImage = document.createElement("img");
var barnImage = document.createElement("img");
var farmhouseImage = document.createElement("img");
var wildlifeSpritesheet = document.createElement("img");

var playerSpriteSheetWalkNorth = document.createElement("img");
var playerSpriteSheetWalkSouth = document.createElement("img");
var playerSpriteSheetSideWalk = document.createElement("img");

//function SpriteSheetClass(sheetIn,frameWidth, frameHeight,sheetInFrames, animationInRowIndex, frameTickRate,looping)
var playerIdleNorth = new AnimationClass(playerSpriteSheetWalkNorth, 48, 48, 8, 0, 0, false);
var playerIdleEast = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 0, 0, false);
var playerIdleSouth = new AnimationClass(playerSpriteSheetWalkSouth, 48, 48, 8, 0, 0, false);
var playerIdleWest = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 1, 0, false);

var playerWalkNorth = new AnimationClass(playerSpriteSheetWalkNorth, 48, 48, 8, 0, 3, true);
var playerWalkEast = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 0, 3, true);
var playerWalkSouth = new AnimationClass(playerSpriteSheetWalkSouth, 48, 48, 8, 0, 3, true);
var playerWalkWest = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 1, 3, true);

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if (picsToLoad == 0) { // last image loaded?
    // loadingDoneSoStartGame();
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    colorText('Click to Start', canvas.width / 2, canvas.height / 2, 'white');
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload = countLoadedImageAndLaunchIfReady;
  imgVar.src = "images/" + fileName;
}

function loadImages() {

  var imageList = [
    { varName: tileSheet, theFile: "sprite_strip.png" },
    { varName: playerImage, theFile: "robokedo3tiny2.png" },
    { varName: playerSpriteSheetWalkNorth, theFile: "robokedoWalkBack.png" },
    { varName: playerSpriteSheetWalkSouth, theFile: "robokedoWalk2.png" },
    { varName: playerSpriteSheetSideWalk, theFile: "robokedoSideWalk.png" },
    { varName: playerSelection, theFile: "player_selection.png" },
    { varName: timeOfDayGradient, theFile: "time_of_day_gradient3.png" },
    { varName: buildingSelection, theFile: "building_selection.png" },
    { varName: tree3D, theFile: "survivingTree1.png" },
    { varName: treeDead3D, theFile: "deadTree1.png" },
    { varName: treeSpritesheet, theFile: "treeSpritesheet.png" },
    { varName: weatherSpritesheet, theFile: "weatherSpritesheet.png" },
    { varName: plantSpritesheet, theFile: "plants_sprite_sheet_3.png" },
    { varName: cloudSpritesheet, theFile: "clouds.png" },
    { varName: sunshine, theFile: "sunshine.png" },
    { varName: itemSheet, theFile: "item_sheet.png" },
    { varName: selectedItemSlot, theFile: "selected_item_slot.png" },
    { varName: weatherGUI, theFile: "weatherGUI.png" },
    { varName: skyCircle, theFile: "skyCircle.png" },
    { varName: siloImage, theFile: "siloBuilding.png" },
    { varName: farmhouseImage, theFile: "farmhouse_large.png" },
    { varName: barnImage, theFile: "barn.png" },
    { varName: wildlifeSpritesheet, theFile: "wildlife.png" }
  ];

  picsToLoad = imageList.length;
  for (var i = 0; i < imageList.length; i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  } // end of for imageList

} // end of function loadImages
