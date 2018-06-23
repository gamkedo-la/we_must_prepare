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

var pickaxeAnimationSpriteSheetNorth = document.createElement("img");
var pickaxeAnimationSpriteSheetEast = document.createElement("img");
var pickaxeAnimationSpriteSheetSouth = document.createElement("img");
var pickaxeAnimationSpriteSheetWest = document.createElement("img");

var playerSpriteSheetWalkNorth = document.createElement("img");
var playerSpriteSheetWalkSouth = document.createElement("img");
var playerSpriteSheetSideWalk = document.createElement("img");

var targetTilePic = document.createElement("img");

//function SpriteSheetClass(sheetIn,frameWidth, frameHeight,sheetInFrames, animationInRowIndex, frameTickRate,looping)
var playerIdleNorth = new AnimationClass(playerSpriteSheetWalkNorth, 48, 48, 8, 0, 0, false);
var playerIdleEast = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 0, 0, false);
var playerIdleSouth = new AnimationClass(playerSpriteSheetWalkSouth, 48, 48, 8, 0, 0, false);
var playerIdleWest = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 1, 0, false);

var playerWalkNorth = new AnimationClass(playerSpriteSheetWalkNorth, 48, 48, 8, 0, 3, true);
var playerWalkEast = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 0, 3, true);
var playerWalkSouth = new AnimationClass(playerSpriteSheetWalkSouth, 48, 48, 8, 0, 3, true);
var playerWalkWest = new AnimationClass(playerSpriteSheetSideWalk, 48, 48, 4, 1, 3, true);

var pickaxeAnimationNorth = new AnimationClass(pickaxeAnimationSpriteSheetNorth, 48, 48, 6, 0, 2, false);
var pickaxeAnimationEast = new AnimationClass(pickaxeAnimationSpriteSheetEast, 48, 48, 7, 0, 2, false);
var pickaxeAnimationSouth = new AnimationClass(pickaxeAnimationSpriteSheetSouth, 48, 48, 6, 0, 2, false);
var pickaxeAnimationWest = new AnimationClass(pickaxeAnimationSpriteSheetWest, 48, 48, 7, 0, 2, false);


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
    { varName: wildlifeSpritesheet, theFile: "wildlife.png" },
    { varName: pickaxeAnimationSpriteSheetNorth, theFile: "pickaxe-animation-north.png" },
    { varName: pickaxeAnimationSpriteSheetEast, theFile: "pickaxe-animation-east.png" },
    { varName: pickaxeAnimationSpriteSheetSouth, theFile: "pickaxe-animation-south.png" },
    { varName: pickaxeAnimationSpriteSheetWest, theFile: "pickaxe-animation-west.png" },
    { varName: targetTilePic, theFile: "targetTile.png" }
  ];

  picsToLoad = imageList.length;
  for (var i = 0; i < imageList.length; i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  } // end of for imageList

} // end of function loadImages
