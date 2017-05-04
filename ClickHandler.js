

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
function handleClicks(canvas) {
  c.addEventListener('mousedown', function(evt) { // stop selecting text on page
    evt.preventDefault();
  });
  c.addEventListener('click', function(evt) {
      var pos = getMousePos(c, evt);
      for (let i = 0; i < clickRects.length; i++) {
        if (isInside(pos, clickRects[i])) {
          if (clickRects[i].id == currentNode) {
            break;
          }
          lastNode = currentNode;
          currentNode = clickRects[i].id;
          lastNodeAngle = nodeAngles[currentNode] + Math.PI;
          redraw();
          break;
        }
      }
  }, false);
}