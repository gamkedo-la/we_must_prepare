function HTMLLog(message) {
  var debugDiv = document.getElementById("debugText");
  if (!debugDiv) return;
  var newDiv = document.createElement("p");
  var newTextNode = document.createTextNode(message);
  newDiv.appendChild(newTextNode);
  debugDiv.appendChild(newDiv);
}
