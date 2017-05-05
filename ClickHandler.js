

var clickRects = [];
function addClickRect(x, y, halfwidth, halfheight, id) { // centered on x, y
  clickRects.push({x, y, halfwidth, halfheight, id});
}
function clearClickRects() {
  clickRects = [];
}

// handle clicks
// source: http://stackoverflow.com/questions/24384368/simple-button-in-html5-canvas
function getMousePos(c, event) {
    var rect = c.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function isInside(pos, rect){
    return (pos.x > rect.x - rect.halfwidth)
      && (pos.x < rect.x + rect.halfwidth)
      && (pos.y > rect.y - rect.halfheight)
      && (pos.y < rect.y + rect.halfheight);
}
function changeNode(newId) {
  if (newId != currentNode) {
    lastNode = currentNode;
    currentNode = newId;
    lastNodeAngle = nodeAngles[currentNode] + Math.PI;
    const auto_score = document.getElementById("autoScoreCheckbox").checked;
    if (auto_score) {
      getPoints();
    }
    redraw();
  }
}
function handleClicks(canvas) {
  c.addEventListener('mousedown', function(evt) { // stop selecting text on page
    evt.preventDefault();
  });
  c.addEventListener('click', function(evt) {
      var pos = getMousePos(c, evt);
      for (let i = 0; i < clickRects.length; i++) {
        if (isInside(pos, clickRects[i])) {
          changeNode(clickRects[i].id);
          break;
        }
      }
  }, false);
}