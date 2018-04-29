var playerImage = document.createElement("img");
var playerImageShaded = document.createElement("img");
var playerSelection = document.createElement("img");
var buildingSelection = document.createElement("img");
var timeOfDayGradient = document.createElement("img");
var tree3D = document.createElement("img");
var treeDead3D = document.createElement("img");
var tileSheet = document.createElement("img");
var weatherSpritesheet = document.createElement("img");
var cloudSpritesheet = document.createElement("img");

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
    { varName: playerImage, theFile: "robokedo3.png" },
    { varName: playerImageShaded, theFile: "player_shaded.png" },
    { varName: playerSelection, theFile: "player_selection.png" },
    { varName: timeOfDayGradient, theFile: "time_of_day_gradient2.png" },
    { varName: buildingSelection, theFile: "building_selection.png" },
    { varName: tree3D, theFile: "treeLarge.png" },
    { varName: treeDead3D, theFile: "deadTree1.png" },
    { varName: weatherSpritesheet, theFile: "weatherSpritesheet.png" },
    { varName: cloudSpritesheet, theFile: "clouds.png" }
  ];

  picsToLoad = imageList.length;
  for (var i = 0; i < imageList.length; i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  } // end of for imageList

} // end of function loadImages
