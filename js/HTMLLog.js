function HTMLLog(message) {
  var newDiv = document.createElement("p");
  var newTextNode = document.createTextNode(message); 
  newDiv.appendChild(newTextNode);
  document.getElementById("debugText").appendChild(newDiv);
}
