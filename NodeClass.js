var tau = 2 * Math.PI;

function rng(min, max) { // min..max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// changes for every node
var lastNodeAngle = tau * (15/360);
var nodeAngles = {}; // nodeAngles[id] = angle of neighbor id

// persistent
var nodes = []; // nodes[id] = Node
var neighbors = {}; // neighbors[node id] = array of neighbor ids for node id
var existing_nodes = {};
var checkedNodes = {};
var neighborAngle = {}; // angle of first neighbor

function generateNeighbors(id) {
  var neighborIds = (currentNode == lastNode) ? [] : [lastNode];
  var num = rng(STYLE.neighbors_min, STYLE.neighbors_max);
  var giveup = 1000;
  for (let i = 0; neighborIds.length < num && giveup-- > 0; i++) {
    var newId = rng(0, nodes.length - 1);
    if (existing_nodes[newId]) {
      i--;
      if (giveup == 0) {
        num = i + 1;
      }
    } else {
      neighborIds.push(newId);
      existing_nodes[newId] = true;
    }
  }
  neighbors[id] = neighborIds;
  neighborAngle[id] = lastNodeAngle;
  return neighborIds;
}

function deleteNonexistentNodes() {
  for (let key in existing_nodes) {
    if (key >= nodes.length) {
      delete neighbors[key];
      delete existing_nodes[key];
      delete checkedNodes[key];
      delete neighborAngle[key];
    }
  }
}

class Node {
  constructor(id, term, definition) {
    this.id = id;
    this.term = term;
    this.width = STYLE.node_width + (STYLE.node_width_per_char * term.length);
    this.height = STYLE.node_height;
    this.definition = definition;
  }
  isChecked() {
    return checkedNodes[this.id];
  }
  drawNode(center) {
    if (this.isChecked()) {
      x.fillStyle = STYLE.checked_node_color;
      x.strokeStyle = STYLE.checked_node_border_color;
      x.lineWidth = 2;
    } else {
      x.fillStyle = "#000";
      x.strokeStyle = "#000";
      x.lineWidth = 1;
    }
    x.beginPath();
    x.ellipse(center.x, center.y, this.width / 2, this.height / 2, 0, 0, tau);
    x.stroke();
    x.fillText(this.term, center.x, center.y + STYLE.node_text_y_offset);
    addClickRect(center.x, center.y, this.width / 2, this.height / 2, this.id);
  }
  drawNeighbors() {
    var neighborIds = neighbors[this.id] || generateNeighbors(this.id);
    for (let i = 0; i < neighborIds.length; i++) {
      let nodeId = neighborIds[i];
      let node = nodes[nodeId];
      let angle = (tau * i / neighborIds.length) + neighborAngle[this.id];
      nodeAngles[nodeId] = angle;
      let node_center = {
        x: center.x * (1 + STYLE.neighbor_radius_x_percent * Math.cos(angle)),
        y: center.y * (1 + STYLE.neighbor_radius_y_percent * Math.sin(angle))
      }
      node.drawNode(node_center);
    }
  }
}

function addNode(term, definition) {
  nodes[nodes.length] = new Node(nodes.length, term, definition);
}

function addNodeFormatLine(string) { // separate term, definition by " - "
  var separator = " - ";
  if (!string.includes(" - ")) {
    separator = ": ";
  }
  var definition = string.split(separator);
  var term = definition.shift(); // get first term
  definition = definition.join(separator);
  if (!term.startsWith("Unit") && !term.startsWith("Chapter") && !term.includes("?") && !definition.includes("?")) {
    addNode(term, definition);
  }
}

function importNodes(string) {
  var lines = string.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // strip beginning bulletpoint
    var line = lines[i].replace(/^\s*\- ?/, "").replace(/\*/g, "").trim();
    var hasDelimiter = (line.includes(" - ") || line.includes(": "));
    var notHeader = !line.startsWith("#") && !line.startsWith("Unit") && !line.startsWith("Chapter");
    if (hasDelimiter && notHeader) {
      addNodeFormatLine(line);
    }
  }
}

function importNotes() {
  nodes = [];
  var notes = document.getElementById("notes_input");
  window.localStorage.setItem("notes", notes.value);
  importNodes(notes.value);
  redraw();
}

function notesButtonClicked() {
  var notes = document.getElementById("notes_input");
  if (notes.className == 'unhide') {
    notes.className = '';
  } else {
    notes.className = 'unhide';
  }
}
