var c, x;
var title, description, button, pointsSpan;

var STYLE = {
  canvas_width: 810,
  canvas_height: 420,
  node_text_y_offset: 8,
  node_width_per_char: 9,
  node_width: 72,
  node_height: 48,
  neighbor_radius_x_percent: .60,
  neighbor_radius_y_percent: .75,
  neighbors_min: () => (Math.max(Math.round(Math.log(nodes.length)), 3)),
  neighbors_max: () => (Math.min(Math.round(Math.log(nodes.length)) + 2, 9)),
  checked_node_color: "#0a2",
  checked_node_border_color: "#070",
}
var center = {x: STYLE.canvas_width / 2, y: STYLE.canvas_height / 2};

var currentNode = -1;
var lastNode = -1;

function getPoints() {
  // x.clearRect(center.x - (nodes[currentNode].width / 2),
  //   center.y - (nodes[currentNode].height / 2),
  //   nodes[currentNode].width,
  //   nodes[currentNode].height);

  checkedNodes[currentNode] = true;
  redrawButton();

  pointsSpan.innerHTML = +(pointsSpan.innerHTML) + 10;
  nodes[currentNode].drawNode(center);
}

function redrawButton() {
  if (nodes[currentNode].isChecked()) {
    button.style.display = "none";
  } else {
    button.style.display = "block";
  }
}

function validateCurrentNode() {
  if (nodes.length == 0) {
    currentNode = lastNode = -1;
    return false;
  } else if (currentNode == -1 || currentNode >= nodes.length) {
    currentNode = lastNode = rng(0, nodes.length - 1);
    existing_nodes[currentNode] = true;
    deleteNonexistentNodes();
  }
  return true;
}

function redraw() {
  if (!validateCurrentNode()) {
    return;
  }
  clearClickRects();
  x.clearRect(0, 0, c.width, c.height);

  redrawButton();

  nodes[currentNode].drawNode(center);
  nodes[currentNode].drawNeighbors();
  title.innerHTML = nodes[currentNode].term;
  description.innerHTML = nodes[currentNode].definition;
}

function init() {
  c = document.getElementById("canvas");
  c.width = STYLE.canvas_width;
  c.height = STYLE.canvas_height;

  x = c.getContext("2d");
  x.font = "24px Cabin";
  x.textAlign = "center";
  x.fillStyle = "#000";
  x.strokeStyle = "#000";
  x.imageSmoothingEnabled = false;

  title = document.getElementById("title");
  description = document.getElementById("description");
  button = document.getElementById("points_button");
  pointsSpan = document.getElementById("points");

  var notes = document.getElementById("notes_input");
  notes.value = window.localStorage.getItem("notes") || notes.value;
  importNodes(notes.value);
  redraw();
  handleClicks(c);
}